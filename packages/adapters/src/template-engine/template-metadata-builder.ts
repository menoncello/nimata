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
   * @param {{ metadata: Partial<TemplateMetadata>; filePath: string; stats: { size: number; lastModified: Date; }; content: string; ext: string; }} params - Parameters object
   * @param {Partial<TemplateMetadata>} params.metadata Partial metadata
   * @param {string} params.filePath File path
   * @param {{ size: number; lastModified: Date; }} params.stats File stats
   * @param {string} params.content File content
   * @param {string} params.ext File extension
   * @returns {TemplateMetadata} Complete template metadata
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
   * @param {{ identityMetadata: Partial<TemplateMetadata>; fileMetadata: Partial<TemplateMetadata>; systemMetadata: Partial<TemplateMetadata>; metadata: Partial<TemplateMetadata> }} metadataComponents - Object containing metadata components
   * @param {Partial<TemplateMetadata>} metadataComponents.identityMetadata - Identity metadata component
   * @param {Partial<TemplateMetadata>} metadataComponents.fileMetadata - File metadata component
   * @param {Partial<TemplateMetadata>} metadataComponents.systemMetadata - System metadata component
   * @param {Partial<TemplateMetadata>} metadataComponents.metadata - Original metadata component
   * @param {{ filePath: string; ext: string }} fileInfo - File information
   * @param {string} fileInfo.filePath - File path
   * @param {string} fileInfo.ext - File extension
   * @returns {TemplateMetadata} Complete template metadata
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
   * @param {Partial<TemplateMetadata>} identityMetadata Identity metadata
   * @param {string} filePath File path
   * @param {string} ext File extension
   * @returns {Partial<TemplateMetadata>} Identity properties
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
   * @param {Partial<TemplateMetadata>} systemMetadata System metadata
   * @param {string} filePath File path
   * @returns {Partial<TemplateMetadata>} System properties
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
   * @param {Partial<TemplateMetadata>} fileMetadata File metadata
   * @param {string} filePath File path
   * @returns {Partial<TemplateMetadata>} File properties
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
   * @param {Partial<TemplateMetadata>} systemMetadata System metadata
   * @param {Partial<TemplateMetadata>} metadata Original partial metadata
   * @returns {Partial<TemplateMetadata>} Optional properties
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
   * @param {Partial<TemplateMetadata>} metadata Partial metadata
   * @param {string} filePath File path
   * @returns {Partial<TemplateMetadata>} System metadata
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
   * @param {Partial<TemplateMetadata>} metadata Partial metadata
   * @param {string} filePath File path
   * @param {string} ext File extension
   * @returns {Partial<TemplateMetadata>} Identity metadata
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
   * @param {string} filePath File path
   * @returns {{ tags: string[]; supportedProjectTypes: ProjectType[]; recommendedQualityLevels: ProjectQualityLevel[]; category: string }} Default metadata
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
   * @param {string} filePath File path
   * @param {Stats} stats File stats
   * @returns {Partial<TemplateMetadata>} File metadata
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
   * @param {Partial<TemplateMetadata>} metadata Partial metadata
   * @returns {TemplateMetadata['validation']} Validation metadata
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
   * @param {Partial<TemplateMetadata>} metadata Partial metadata
   * @returns {TemplateMetadata['usageStats']} Usage metadata
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
   * @param {string} filePath The file path
   * @returns {string} A unique template ID
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
   * @param {string[]} types String array to convert
   * @returns {ProjectType[]} ProjectType array
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
   * @param {string[]} levels String array to convert
   * @returns {ProjectQualityLevel[]} ProjectQualityLevel array
   */
  private static convertToProjectQualityLevels(levels: string[]): ProjectQualityLevel[] {
    const validQualityLevels: ProjectQualityLevel[] = ['light', 'medium', 'strict', 'high'];

    return levels.filter((level) =>
      validQualityLevels.includes(level as ProjectQualityLevel)
    ) as ProjectQualityLevel[];
  }
}
