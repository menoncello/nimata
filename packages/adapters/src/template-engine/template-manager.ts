/**
 * Template Manager Implementation
 *
 * Simplified template management that works with existing codebase
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import type {
  TemplateEngine,
  TemplateContext,
  ProjectTemplate,
  ValidationResult,
} from '@nimata/core';
import Handlebars from 'handlebars';
import { TemplateFileScanner } from './template-file-scanner.js';
import {
  registerStringHelpers,
  registerConditionalHelpers,
  registerUtilityHelpers,
} from './template-helpers.js';
import { SimpleTemplateMetadataParser } from './template-metadata-parser-simple.js';
import { TemplateUtils } from './template-utils.js';
import { TemplateVariableExtractor } from './template-variable-extractor.js';

/**
 * Constants for template manager
 */
const ERROR_MESSAGES = {
  FAILED_LOAD: 'Failed to load template',
  FAILED_RENDER: 'Failed to render template',
  FAILED_PROCESS: 'Failed to process file',
  UNKNOWN_ERROR: 'Unknown error',
  TEMPLATE_VARIABLE: 'Template variable: ',
  TEMPLATE_FROM: 'Template from ',
  TEMPLATE_PREFIX: 'Template: ',
} as const;

/**
 * Simple template metadata
 */
export interface SimpleTemplateMetadata {
  id: string;
  name: string;
  description: string;
  filePath: string;
  lastModified: Date;
  size: number;
  category: string;
  tags: string[];
  variables: string[];
}

/**
 * Template discovery result
 */
export interface TemplateDiscoveryResult {
  templates: SimpleTemplateMetadata[];
  errors: string[];
  totalProcessed: number;
}

/**
 * Template manager implementation
 */
export class TemplateManager implements TemplateEngine {
  private templatesDir: string;
  private templates = new Map<string, SimpleTemplateMetadata>();
  private handlebars: typeof Handlebars;
  private cache = new Map<string, HandlebarsTemplateDelegate>();

  /**
   * Creates a new template manager instance
   * @param templatesDir - Optional directory path where templates are located
   */
  constructor(templatesDir?: string) {
    this.templatesDir = templatesDir || this.resolveTemplatesDirectory();
    this.handlebars = Handlebars.create();
    this.registerDefaultHelpers();
  }

  /**
   * Load template from file system
   * @param templateName - The name of the template to load
   * @returns Promise resolving to the loaded project template
   */
  async loadTemplate(templateName: string): Promise<ProjectTemplate> {
    const templatePath = path.join(this.templatesDir, templateName);

    try {
      const content = await fs.readFile(templatePath, 'utf-8');
      const variables = TemplateVariableExtractor.extractVariables(content);
      const templateVariables = this.createTemplateVariables(variables);

      return this.createProjectTemplate(templateName, content, variables, templateVariables);
    } catch (error) {
      throw new Error(
        `Failed to load ${templateName}: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Creates template variables array
   * @param variables - Extracted variable names
   * @returns Template variables configuration
   */
  private createTemplateVariables(
    variables: string[]
  ): Array<{ name: string; type: 'string'; description: string; required: boolean }> {
    return variables.map((v) => ({
      name: v,
      type: 'string' as const,
      description: `${ERROR_MESSAGES.TEMPLATE_VARIABLE}${v}`,
      required: false,
    }));
  }

  /**
   * Creates project template object
   * @param templateName - Template name
   * @param content - Template content
   * @param variables - Extracted variables
   * @param templateVariables - Template variables configuration
   * @returns Project template object
   */
  private createProjectTemplate(
    templateName: string,
    content: string,
    variables: string[],
    templateVariables: Array<{
      name: string;
      type: 'string';
      description: string;
      required: boolean;
    }>
  ): ProjectTemplate & { content: string; extractedVariables: string[] } {
    return {
      name: templateName,
      description: `${ERROR_MESSAGES.TEMPLATE_PREFIX}${templateName}`,
      version: '1.0.0',
      supportedProjectTypes: ['basic'], // Default support for basic projects
      variables: templateVariables,
      files: [
        {
          path: templateName,
          template: content,
        },
      ],
      // Add compatibility properties for tests
      content,
      extractedVariables: variables,
    } as ProjectTemplate & { content: string; extractedVariables: string[] };
  }

  /**
   * Render template with context
   * @param template - The template string to render
   * @param context - The template context containing variables
   * @returns Promise resolving to the rendered template string
   */
  async renderTemplate(template: string, context: TemplateContext): Promise<string> {
    try {
      // Check cache first
      let compiledTemplate = this.cache.get(template);

      if (!compiledTemplate) {
        compiledTemplate = this.handlebars.compile(template);
        this.cache.set(template, compiledTemplate);
      }

      return compiledTemplate(context);
    } catch (error) {
      throw new Error(
        `${ERROR_MESSAGES.FAILED_RENDER}: ${error instanceof Error ? error.message : ERROR_MESSAGES.UNKNOWN_ERROR}`
      );
    }
  }

  /**
   * Validate template syntax
   * @param template - The template string to validate
   * @returns Validation result indicating if template is valid
   */
  validateTemplate(template: string): ValidationResult {
    const errors: string[] = [];

    // Check for unbalanced braces
    const openBraces = (template.match(/{{/g) || []).length;
    const closeBraces = (template.match(/}}/g) || []).length;

    if (openBraces !== closeBraces) {
      errors.push(`Unbalanced Handlebars braces: ${openBraces} opening, ${closeBraces} closing`);
    }

    // Check for incomplete helper expressions
    const incompleteHelpers = template.match(/{{#[^}]*$/gm);
    if (incompleteHelpers) {
      errors.push('Incomplete Handlebars helper expressions found');
    }

    try {
      this.handlebars.compile(template);
    } catch (error) {
      errors.push(
        `Template compilation error: ${error instanceof Error ? error.message : ERROR_MESSAGES.UNKNOWN_ERROR}`
      );
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings: [],
    };
  }

  /**
   * Process complete project template
   * @param projectTemplate - The project template containing files to process
   * @param context - The template context for rendering
   * @returns Promise resolving to array of generated files with paths and content
   */
  async processProjectTemplate(
    projectTemplate: ProjectTemplate,
    context: TemplateContext
  ): Promise<Array<{ path: string; content: string }>> {
    const generatedFiles: Array<{ path: string; content: string }> = [];

    if (!projectTemplate.files) {
      return generatedFiles;
    }

    for (const file of projectTemplate.files) {
      try {
        const content = await this.renderTemplate(file.template, context);
        generatedFiles.push({
          path: TemplateUtils.resolveFilePath(file.path, context),
          content,
        });
      } catch (error) {
        throw new Error(
          `${ERROR_MESSAGES.FAILED_PROCESS} ${file.path}: ${error instanceof Error ? error.message : ERROR_MESSAGES.UNKNOWN_ERROR}`
        );
      }
    }

    return generatedFiles;
  }

  /**
   * Register a custom helper function
   * @param name - The name of the helper function
   * @param helper - The helper function implementation
   */
  registerHelper(name: string, helper: (...args: unknown[]) => unknown): void {
    this.handlebars.registerHelper(name, helper);
  }

  /**
   * Get available templates
   * @returns Promise resolving to array of available template IDs
   */
  async getAvailableTemplates(): Promise<string[]> {
    const templates = await this.discoverTemplates();
    return templates.map((t) => t.id);
  }

  /**
   * Discover templates from file system
   * @returns Promise resolving to array of discovered template metadata
   */
  async discoverTemplates(): Promise<SimpleTemplateMetadata[]> {
    const result: TemplateDiscoveryResult = {
      templates: [],
      errors: [],
      totalProcessed: 0,
    };

    try {
      const templateFiles = await this.scanDirectory(this.templatesDir);

      for (const filePath of templateFiles) {
        try {
          const metadata = await this.extractMetadata(filePath);
          result.templates.push(metadata);
          this.templates.set(metadata.id, metadata);
        } catch (error) {
          result.errors.push(
            `Failed to process ${filePath}: ${error instanceof Error ? error.message : ERROR_MESSAGES.UNKNOWN_ERROR}`
          );
        }
        result.totalProcessed++;
      }

      return result.templates;
    } catch (error) {
      throw new Error(
        `Template discovery failed: ${error instanceof Error ? error.message : ERROR_MESSAGES.UNKNOWN_ERROR}`
      );
    }
  }

  /**
   * Get template metadata
   * @param templateId - The ID of the template to retrieve
   * @returns Template metadata or null if not found
   */
  getTemplateMetadata(templateId: string): SimpleTemplateMetadata | null {
    return this.templates.get(templateId) || null;
  }

  /**
   * Get all template metadata
   * @returns Array of all template metadata
   */
  getAllTemplates(): SimpleTemplateMetadata[] {
    return Array.from(this.templates.values());
  }

  /**
   * Search templates by query
   * @param query - The search query string
   * @returns Array of templates matching the search query
   */
  searchTemplates(query: string): SimpleTemplateMetadata[] {
    const lowerQuery = query.toLowerCase();
    return this.getAllTemplates().filter(
      (template) =>
        template.name.toLowerCase().includes(lowerQuery) ||
        template.description.toLowerCase().includes(lowerQuery) ||
        template.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)) ||
        template.category.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Get templates by category
   * @param category - The category to filter by
   * @returns Array of templates in the specified category
   */
  getTemplatesByCategory(category: string): SimpleTemplateMetadata[] {
    return this.getAllTemplates().filter((template) => template.category === category);
  }

  /**
   * Get templates by tag
   * @param tag - The tag to filter by
   * @returns Array of templates with the specified tag
   */
  getTemplatesByTag(tag: string): SimpleTemplateMetadata[] {
    return this.getAllTemplates().filter((template) => template.tags.includes(tag));
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   * @returns Object containing cache size and keys
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }

  /**
   * Scan directory for template files
   * @param directory - Directory to scan
   * @returns Array of template file paths
   */
  private async scanDirectory(directory: string): Promise<string[]> {
    return TemplateFileScanner.scanDirectory(directory);
  }

  /**
   * Resolve templates directory
   * @returns The resolved templates directory path
   */
  private resolveTemplatesDirectory(): string {
    const possiblePaths = [
      'templates',
      'src/templates',
      'templates/typescript-bun-cli',
      path.join(process.cwd(), 'templates'),
      path.join(process.cwd(), 'src', 'templates'),
    ];

    for (const possiblePath of possiblePaths) {
      try {
        fs.access(possiblePath);
        return possiblePath;
      } catch {
        // Continue to next path
      }
    }

    // Default to templates directory
    return 'templates';
  }

  /**
   * Extract metadata from template file
   * @param filePath The path to the template file
   * @returns The extracted metadata
   */
  private async extractMetadata(filePath: string): Promise<SimpleTemplateMetadata> {
    const stats = await fs.stat(filePath);
    const content = await fs.readFile(filePath, 'utf-8');
    const relativePath = path.relative(this.templatesDir, filePath);
    const ext = path.extname(filePath).toLowerCase();

    // Extract metadata from content
    const metadata = SimpleTemplateMetadataParser.parseMetadata(content);

    // Extract variables from template
    const variables = TemplateVariableExtractor.extractVariables(content);

    return {
      id: TemplateUtils.generateTemplateId(relativePath),
      name: metadata.name || path.basename(relativePath, ext),
      description: metadata.description || `${ERROR_MESSAGES.TEMPLATE_FROM}${relativePath}`,
      filePath: relativePath,
      lastModified: stats.mtime,
      size: stats.size,
      category: metadata.category || TemplateUtils.inferCategory(filePath),
      tags: metadata.tags || [],
      variables,
    };
  }

  /**
   * Register default Handlebars helpers
   */
  private registerDefaultHelpers(): void {
    registerStringHelpers(this.handlebars.registerHelper.bind(this.handlebars));
    registerConditionalHelpers(this.handlebars.registerHelper.bind(this.handlebars));
    registerUtilityHelpers(this.handlebars.registerHelper.bind(this.handlebars));

    // Register custom date helper
    this.handlebars.registerHelper('current_date', () => {
      return new Date().toISOString().split('T')[0];
    });

    // Register custom existence helpers
    this.handlebars.registerHelper(
      'ifExists',
      (value: unknown, options: Handlebars.HelperOptions) => {
        return value !== null && value !== undefined && value !== ''
          ? options.fn(options.data?.root || this)
          : options.inverse(options.data?.root || this);
      }
    );

    this.handlebars.registerHelper(
      'ifEmpty',
      (value: unknown, options: Handlebars.HelperOptions) => {
        const isEmpty = this.isEmptyValue(value);
        return isEmpty ? options.fn(this) : options.inverse(this);
      }
    );
  }

  /**
   * Check if value is considered empty
   * @param value - Value to check
   * @returns True if value is empty
   */
  private isEmptyValue(value: unknown): boolean {
    return (
      value === null ||
      value === undefined ||
      value === '' ||
      (Array.isArray(value) && value.length === 0)
    );
  }
}
