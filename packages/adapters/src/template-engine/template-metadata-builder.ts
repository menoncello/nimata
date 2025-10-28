/**
 * Template Metadata Builder
 *
 * Builds and assembles template metadata from components
 */
import type { Stats } from 'node:fs';
import path from 'node:path';
import type { TemplateMetadata, ProjectType, ProjectQualityLevel } from '@nimata/core';
import { CategoryInference } from './category-inference.js';
import { PARSER_CONSTANTS } from './template-metadata-parser-core.js';

/**
 * Template metadata builder utility class
 */
export class TemplateMetadataBuilder {
  /**
   * Complete template metadata with defaults
   * @param params Object containing all parameters
   * @param params.metadata Partial metadata
   * @param params.filePath File path
   * @param params.stats File stats
   * @param params.content File content
   * @param params.ext File extension
   * @returns Complete template metadata
   */
  static completeTemplateMetadata(params: {
    metadata: Partial<TemplateMetadata>;
    filePath: string;
    stats: Stats;
    content: string;
    ext: string;
  }): TemplateMetadata {
    const { metadata, filePath, stats, ext } = params;
    const identityMetadata = this.buildIdentityMetadata(metadata, filePath, ext);
    const fileMetadata = this.buildFileMetadata(filePath, stats);
    const systemMetadata = this.buildSystemMetadata(metadata, filePath);

    return this.assembleCompleteMetadata(
      {
        identityMetadata,
        fileMetadata,
        systemMetadata,
        metadata,
      },
      {
        filePath,
        ext,
      }
    );
  }

  /**
   * Assemble complete template metadata from components
   * @param metadataComponents Object containing metadata components
   * @param metadataComponents.identityMetadata Identity metadata
   * @param metadataComponents.fileMetadata File metadata
   * @param metadataComponents.systemMetadata System metadata
   * @param metadataComponents.metadata Original partial metadata
   * @param fileInfo File information
   * @param fileInfo.filePath File path
   * @param fileInfo.ext File extension
   * @returns Complete template metadata
   */
  private static assembleCompleteMetadata(
    metadataComponents: {
      identityMetadata: Partial<TemplateMetadata>;
      fileMetadata: Partial<TemplateMetadata>;
      systemMetadata: Partial<TemplateMetadata>;
      metadata: Partial<TemplateMetadata>;
    },
    fileInfo: {
      filePath: string;
      ext: string;
    }
  ): TemplateMetadata {
    const { identityMetadata, fileMetadata, systemMetadata, metadata } = metadataComponents;
    const { filePath, ext } = fileInfo;

    const identityProps = this.buildIdentityProps(identityMetadata, filePath, ext);
    const systemProps = this.buildSystemProps(systemMetadata, filePath);
    const fileProps = this.buildFileProps(fileMetadata, filePath);
    const optionalProps = this.buildOptionalProps(systemMetadata, metadata);

    return {
      ...identityProps,
      ...systemProps,
      ...fileProps,
      ...optionalProps,
    } as TemplateMetadata;
  }

  /**
   * Build identity properties
   * @param identityMetadata Identity metadata
   * @param filePath File path
   * @param ext File extension
   * @returns Identity properties
   */
  private static buildIdentityProps(
    identityMetadata: Partial<TemplateMetadata>,
    filePath: string,
    ext: string
  ): Partial<TemplateMetadata> {
    return {
      id: identityMetadata.id || this.generateTemplateId(filePath),
      name: identityMetadata.name || path.basename(filePath, ext),
      description:
        identityMetadata.description || `Template from ${path.relative(process.cwd(), filePath)}`,
    };
  }

  /**
   * Build system properties
   * @param systemMetadata System metadata
   * @param filePath File path
   * @returns System properties
   */
  private static buildSystemProps(
    systemMetadata: Partial<TemplateMetadata>,
    filePath: string
  ): Partial<TemplateMetadata> {
    return {
      version: systemMetadata.version || PARSER_CONSTANTS.DEFAULT_VERSION,
      tags: systemMetadata.tags || [],
      supportedProjectTypes:
        systemMetadata.supportedProjectTypes ||
        this.convertToProjectTypes([...PARSER_CONSTANTS.DEFAULT_PROJECT_TYPES]),
      recommendedQualityLevels:
        systemMetadata.recommendedQualityLevels ||
        this.convertToProjectQualityLevels([...PARSER_CONSTANTS.DEFAULT_QUALITY_LEVELS]),
      category: systemMetadata.category || CategoryInference.inferCategory(filePath),
    };
  }

  /**
   * Build file properties
   * @param fileMetadata File metadata
   * @param filePath File path
   * @returns File properties
   */
  private static buildFileProps(
    fileMetadata: Partial<TemplateMetadata>,
    filePath: string
  ): Partial<TemplateMetadata> {
    return {
      filePath: fileMetadata.filePath || path.relative(process.cwd(), filePath),
      size: fileMetadata.size || 0,
      lastModified: fileMetadata.lastModified || new Date(),
    };
  }

  /**
   * Build optional properties
   * @param systemMetadata System metadata
   * @param metadata Original partial metadata
   * @returns Optional properties
   */
  private static buildOptionalProps(
    systemMetadata: Partial<TemplateMetadata>,
    metadata: Partial<TemplateMetadata>
  ): Partial<TemplateMetadata> {
    return {
      author: systemMetadata.author,
      dependencies: systemMetadata.dependencies || [],
      features: systemMetadata.features || [],
      validation: this.buildValidationMetadata(metadata),
      usageStats: this.buildUsageMetadata(metadata),
      metadata: metadata.metadata || {},
    };
  }

  /**
   * Build system metadata (version, dependencies, features)
   * @param metadata Partial metadata
   * @param filePath File path
   * @returns System metadata
   */
  private static buildSystemMetadata(
    metadata: Partial<TemplateMetadata>,
    filePath: string
  ): Partial<TemplateMetadata> {
    const defaultMetadata = this.buildDefaultMetadata(filePath);
    return {
      version: metadata.version || PARSER_CONSTANTS.DEFAULT_VERSION,
      author: metadata.author,
      tags: metadata.tags || defaultMetadata.tags,
      supportedProjectTypes: this.convertToProjectTypes(
        metadata.supportedProjectTypes || defaultMetadata.supportedProjectTypes
      ),
      recommendedQualityLevels: this.convertToProjectQualityLevels(
        metadata.recommendedQualityLevels || defaultMetadata.recommendedQualityLevels
      ),
      category: metadata.category || defaultMetadata.category,
      dependencies: metadata.dependencies || [],
      features: metadata.features || [],
    };
  }

  /**
   * Build identity metadata (id, name, description)
   * @param metadata Partial metadata
   * @param filePath File path
   * @param ext File extension
   * @returns Identity metadata
   */
  private static buildIdentityMetadata(
    metadata: Partial<TemplateMetadata>,
    filePath: string,
    ext: string
  ): Partial<TemplateMetadata> {
    return {
      id: metadata.id || this.generateTemplateId(filePath),
      name: metadata.name || path.basename(filePath, ext),
      description:
        metadata.description || `Template from ${path.relative(process.cwd(), filePath)}`,
    };
  }

  /**
   * Build default metadata (arrays, category)
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
   * Build file metadata from stats
   * @param filePath File path
   * @param stats File stats
   * @returns File metadata
   */
  private static buildFileMetadata(filePath: string, stats: Stats): Partial<TemplateMetadata> {
    return {
      filePath: path.relative(process.cwd(), filePath),
      size: stats.size,
      lastModified: stats.mtime,
    };
  }

  /**
   * Build validation metadata
   * @param metadata Partial metadata
   * @returns Validation metadata
   */
  private static buildValidationMetadata(
    metadata: Partial<TemplateMetadata>
  ): TemplateMetadata['validation'] {
    return (
      metadata.validation || {
        valid: true,
        errors: [],
        warnings: [],
        timestamp: new Date(),
        validator: 'TemplateDiscovery',
      }
    );
  }

  /**
   * Build usage metadata
   * @param metadata Partial metadata
   * @returns Usage metadata
   */
  private static buildUsageMetadata(
    metadata: Partial<TemplateMetadata>
  ): TemplateMetadata['usageStats'] {
    return (
      metadata.usageStats || {
        usageCount: 0,
        successRate: 1.0,
        averageRenderTime: 0,
        popularProjectTypes: [],
        popularQualityLevels: [],
      }
    );
  }

  /**
   * Generate a unique template ID from file path
   * @param filePath The file path
   * @returns A unique template ID
   */
  private static generateTemplateId(filePath: string): string {
    const relativePath = path.relative(process.cwd(), filePath);
    return relativePath
      .replace(/[^\dA-Za-z]/g, '-')
      .replace(/-+/g, '-')
      .replace(/(?:^-)|(?:-$)/g, '');
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
