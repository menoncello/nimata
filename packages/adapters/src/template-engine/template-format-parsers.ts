/**
 * Template Format Parsers
 *
 * Handles parsing of different template file formats (JSON, YAML, Handlebars)
 */
import type { TemplateMetadata, ProjectType, ProjectQualityLevel } from '@nimata/core';
import { CategoryInference } from './category-inference.js';
import { PARSER_CONSTANTS, UNKNOWN_ERROR_MSG } from './template-metadata-parser-core.js';

/**
 * Template format parsers utility class
 */
export class TemplateFormatParsers {
  /**
   * Parse template content based on file extension
   * @param content The template content
   * @param ext The file extension
   * @param filePath The file path for error reporting
   * @returns Partial template metadata or null
   */
  static parseTemplateContent(
    content: string,
    ext: string,
    filePath: string
  ): Partial<TemplateMetadata> | null {
    if (ext === '.json') {
      return this.parseJsonTemplate(content, filePath);
    } else if (['.yaml', '.yml'].includes(ext)) {
      return this.parseYamlTemplate(content, filePath);
    } else if (['.hbs', '.handlebars'].includes(ext)) {
      return this.parseHandlebarsTemplate(content, filePath);
    }
    return null;
  }

  /**
   * Parse JSON template file
   * @param content The JSON content to parse
   * @param filePath The file path for error reporting
   * @returns The parsed template metadata
   */
  private static parseJsonTemplate(content: string, filePath: string): Partial<TemplateMetadata> {
    try {
      return JSON.parse(content);
    } catch (error) {
      throw new Error(
        `Invalid JSON in ${filePath}: ${error instanceof Error ? error.message : UNKNOWN_ERROR_MSG}`
      );
    }
  }

  /**
   * Parse YAML template file
   * @param content The YAML content to parse
   * @param filePath The file path for error reporting
   * @returns The parsed template metadata
   */
  private static parseYamlTemplate(content: string, filePath: string): Partial<TemplateMetadata> {
    try {
      const frontmatter = this.extractYamlFrontmatter(content);
      if (frontmatter) {
        return this.parseYamlFrontmatter(frontmatter);
      }
      return this.parseBasicYaml(content);
    } catch (error) {
      throw new Error(
        `Invalid YAML in ${filePath}: ${error instanceof Error ? error.message : UNKNOWN_ERROR_MSG}`
      );
    }
  }

  /**
   * Parse YAML frontmatter content
   * @param yamlContent The YAML frontmatter content
   * @returns Parsed metadata
   */
  private static parseYamlFrontmatter(yamlContent: string): Partial<TemplateMetadata> {
    const data: Record<string, unknown> = {};

    for (const line of yamlContent.split('\n')) {
      if (line.trim() === '' || line.trim().startsWith('#')) continue;

      const colonIndex = line.indexOf(':');
      if (colonIndex > 0) {
        const key = line.slice(0, colonIndex).trim();
        let value: string | string[] = line.slice(colonIndex + 1).trim();

        value = this.cleanValueQuotes(value);
        value = this.parseArrayValue(value);

        data[key] = value;
      }
    }

    return data as Partial<TemplateMetadata>;
  }

  /**
   * Clean quotes from string values
   * @param value The value to clean
   * @returns Cleaned value
   */
  private static cleanValueQuotes(value: string): string {
    return value.replace(/(?:^["'])|(?:["']$)/g, '');
  }

  /**
   * Parse array values from string
   * @param value The value to parse
   * @returns Parsed value (string or string array)
   */
  private static parseArrayValue(value: string): string | string[] {
    if (value.startsWith('[') && value.endsWith(']')) {
      const arrayContent = value.slice(1, -1);
      return arrayContent
        .split(',')
        .map((item) => this.cleanValueQuotes(item.trim()))
        .filter((item) => item.length > 0);
    }
    return value;
  }

  /**
   * Parse basic YAML content
   * @param content The YAML content
   * @returns Parsed metadata
   */
  private static parseBasicYaml(content: string): Partial<TemplateMetadata> {
    const data: Record<string, unknown> = {};

    for (const line of content.split('\n')) {
      if (line.trim() === '' || line.trim().startsWith('#')) continue;

      const colonIndex = line.indexOf(':');
      if (colonIndex > 0) {
        const key = line.slice(0, colonIndex).trim();
        let value: string | string[] = line.slice(colonIndex + 1).trim();

        value = this.cleanValueQuotes(value);
        value = this.parseArrayValue(value);

        data[key] = value;
      }
    }

    return data as Partial<TemplateMetadata>;
  }

  /**
   * Parse Handlebars template file
   * @param content The Handlebars content to parse
   * @param filePath The file path for error reporting
   * @returns The parsed template metadata
   */
  private static parseHandlebarsTemplate(
    content: string,
    filePath: string
  ): Partial<TemplateMetadata> {
    try {
      // First try to parse YAML frontmatter
      const yamlFrontmatter = this.extractYamlFrontmatter(content);
      if (yamlFrontmatter) {
        const frontmatterMetadata = this.parseYamlFrontmatter(yamlFrontmatter);

        // Merge frontmatter with inferred defaults
        const defaultMetadata = this.buildDefaultMetadata(filePath);

        return {
          ...frontmatterMetadata,
          // Ensure we have all required arrays even if not in frontmatter
          tags: frontmatterMetadata.tags || defaultMetadata.tags,
          supportedProjectTypes: this.convertToProjectTypes(
            frontmatterMetadata.supportedProjectTypes || defaultMetadata.supportedProjectTypes
          ),
          recommendedQualityLevels: this.convertToProjectQualityLevels(
            frontmatterMetadata.recommendedQualityLevels || defaultMetadata.recommendedQualityLevels
          ),
          // Use frontmatter category if provided, otherwise infer
          category: frontmatterMetadata.category || defaultMetadata.category,
        };
      }

      // Fall back to Handlebars comment metadata
      return this.parseHandlebarsComments(content);
    } catch (error) {
      throw new Error(
        `Invalid Handlebars template in ${filePath}: ${error instanceof Error ? error.message : UNKNOWN_ERROR_MSG}`
      );
    }
  }

  /**
   * Extract YAML frontmatter from content
   * @param content The content to extract from
   * @returns YAML frontmatter content or null
   */
  private static extractYamlFrontmatter(content: string): string | null {
    const yamlRegex = /^-{3}\n([\S\s]*?)\n-{3}/;
    const yamlMatch = content.match(yamlRegex);
    return yamlMatch ? yamlMatch[1] : null;
  }

  /**
   * Parse Handlebars comment metadata
   * @param content The Handlebars content
   * @returns Parsed metadata
   */
  private static parseHandlebarsComments(content: string): Partial<TemplateMetadata> {
    const metadata: Partial<TemplateMetadata> = {};

    const name = this.extractHandlebarsCommentValue(content, 'title');
    if (name) {
      metadata.name = name;
    }

    const description = this.extractHandlebarsCommentValue(content, 'description');
    if (description) {
      metadata.description = description;
    }

    const tags = this.extractHandlebarsTags(content);
    if (tags) {
      metadata.tags = tags;
    }

    return metadata;
  }

  /**
   * Extract a specific value from Handlebars comments
   * @param content The content to search
   * @param key The key to extract
   * @returns The extracted value or null
   */
  private static extractHandlebarsCommentValue(content: string, key: string): string | null {
    const regex = new RegExp(`(?:{{!--\\s*${key}:\\s*)([^}]+?)(?:\\s*--}})`);
    const match = content.match(regex);
    return match ? match[1].trim() : null;
  }

  /**
   * Extract tags from Handlebars comments
   * @param content The content to search
   * @returns Array of tags or null
   */
  private static extractHandlebarsTags(content: string): string[] | null {
    // Use simple string matching to avoid regex vulnerabilities
    const tagsStart = '{{!-- tags:';
    const tagsEnd = '--}}';

    const startIndex = content.indexOf(tagsStart);
    if (startIndex === -1) return null;

    const valueStart = startIndex + tagsStart.length;
    const endIndex = content.indexOf(tagsEnd, valueStart);
    if (endIndex === -1) return null;

    const tagsStr = content.substring(valueStart, endIndex).trim();
    return tagsStr.split(',').map((tag) => this.cleanValueQuotes(tag.trim()));
  }

  /**
   * Build default metadata for Handlebars templates
   * @param filePath File path
   * @returns Default metadata
   */
  private static buildDefaultMetadata(filePath: string): {
    tags: string[];
    supportedProjectTypes: ProjectType[];
    recommendedQualityLevels: ProjectQualityLevel[];
    category: string;
  } {
    return {
      tags: [],
      supportedProjectTypes: this.convertToProjectTypes([
        ...PARSER_CONSTANTS.DEFAULT_PROJECT_TYPES,
      ]),
      recommendedQualityLevels: this.convertToProjectQualityLevels([
        ...PARSER_CONSTANTS.DEFAULT_QUALITY_LEVELS,
      ]),
      category: CategoryInference.inferCategory(filePath),
    };
  }

  /**
   * Convert string array to ProjectType array with validation
   * @param types String array to convert
   * @returns ProjectType array
   */
  private static convertToProjectTypes(types: string[]): ProjectType[] {
    const validProjectTypes: ProjectType[] = [
      'basic',
      'web',
      'cli',
      'library',
      'bun-react',
      'bun-vue',
      'bun-express',
      'bun-typescript',
    ];

    return types.filter((type) => validProjectTypes.includes(type as ProjectType)) as ProjectType[];
  }

  /**
   * Convert string array to ProjectQualityLevel array with validation
   * @param levels String array to convert
   * @returns ProjectQualityLevel array
   */
  private static convertToProjectQualityLevels(levels: string[]): ProjectQualityLevel[] {
    const validQualityLevels: ProjectQualityLevel[] = ['light', 'medium', 'strict', 'high'];

    return levels.filter((level) =>
      validQualityLevels.includes(level as ProjectQualityLevel)
    ) as ProjectQualityLevel[];
  }
}
