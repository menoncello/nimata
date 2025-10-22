/**
 * Project Configuration Processor
 *
 * Processes and enriches project configuration collected from wizard
 */
import type { ProjectConfig } from '../types/project-config.js';
import { DirectoryStructureGenerator } from './generators/directory-structure-generator.js';
import { PackageJsonGenerator } from './generators/package-json-generator.js';
import { MIT, MEDIUM, BASIC, CLAUDE_CODE } from './validators/validation-constants.js';
import { runAllValidations } from './validators/validation-helpers.js';

export interface ProjectConfigProcessor {
  /**
   * Process collected configuration and add defaults
   * @param config - Partial configuration to process
   * @returns Processed complete configuration
   */
  process: (config: Partial<ProjectConfig>) => Promise<ProjectConfig>;

  /**
   * Generate package.json content
   * @param config - Project configuration
   * @returns Generated package.json content
   */
  generatePackageJson: (config: ProjectConfig) => Promise<object>;

  /**
   * Generate initial directory structure
   * @param config - Project configuration
   * @returns Generated directory structure
   */
  generateDirectoryStructure: (config: ProjectConfig) => Promise<
    Array<{
      path: string;
      type: 'directory' | 'file';
      content?: string;
    }>
  >;

  /**
   * Validate final configuration
   * @param config - Project configuration to validate
   * @returns Validation result with validity flag and warnings
   */
  validateFinalConfig: (config: ProjectConfig) => Promise<{
    valid: boolean;
    warnings: string[];
    errors: string[];
  }>;
}

/**
 * Implementation of Project Configuration Processor
 */
export class ProjectConfigProcessorImpl implements ProjectConfigProcessor {
  private readonly packageJsonGenerator: PackageJsonGenerator;
  private readonly directoryStructureGenerator: DirectoryStructureGenerator;

  /**
   * Initialize the processor with required generators
   */
  constructor() {
    this.packageJsonGenerator = new PackageJsonGenerator();
    this.directoryStructureGenerator = new DirectoryStructureGenerator();
  }

  /**
   * Process collected configuration and add defaults
   * @param config - Partial configuration to process
   * @returns Processed complete configuration
   */
  async process(config: Partial<ProjectConfig>): Promise<ProjectConfig> {
    const processedConfig = this.applyDefaults(config);
    const validation = await this.validateFinalConfig(processedConfig);

    if (!validation.valid) {
      const errorMsg =
        validation.errors.length > 0 ? validation.errors.join(', ') : 'Unknown validation error';
      throw new Error(`Configuration validation failed: ${errorMsg}`);
    }

    return processedConfig;
  }

  /**
   * Generate package.json content
   * @param config - Project configuration
   * @returns Generated package.json content
   */
  async generatePackageJson(config: ProjectConfig): Promise<object> {
    return this.packageJsonGenerator.generate(config);
  }

  /**
   * Generate initial directory structure
   * @param config - Project configuration
   * @returns Generated directory structure
   */
  async generateDirectoryStructure(config: ProjectConfig): Promise<
    Array<{
      path: string;
      type: 'directory' | 'file';
      content?: string;
    }>
  > {
    return this.directoryStructureGenerator.generate(config);
  }

  /**
   * Validate final configuration
   * @param config - Project configuration to validate
   * @returns Validation result with validity flag and warnings
   */
  async validateFinalConfig(config: ProjectConfig): Promise<{
    valid: boolean;
    warnings: string[];
    errors: string[];
  }> {
    return runAllValidations(config);
  }

  /**
   * Apply default values to configuration
   * @param config - Partial configuration
   * @returns Configuration with defaults applied
   */
  private applyDefaults(config: Partial<ProjectConfig>): ProjectConfig {
    const name = config.name || 'my-project';
    return {
      name,
      description: config.description === undefined ? '' : config.description,
      author: config.author === undefined ? '' : config.author,
      license: config.license || MIT,
      qualityLevel: config.qualityLevel || MEDIUM,
      projectType: config.projectType || BASIC,
      aiAssistants: config.aiAssistants || [CLAUDE_CODE],
      template: config.template,
      targetDirectory: config.targetDirectory || '.',
      nonInteractive: config.nonInteractive || false,
    };
  }
}
