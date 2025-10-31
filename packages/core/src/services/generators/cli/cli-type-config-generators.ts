/**
 * CLI Type and Configuration Generators
 *
 * Generates type definitions and configuration files for CLI projects
 */
import type { ProjectConfig } from '../../../types/project-config.js';
import { CLIConfigGenerator } from './cli-config-generator.js';
import { CLITypesGenerator } from './cli-types-generator.js';

/**
 * CLI Type and Configuration Generators
 *
 * Orchestrates generation of TypeScript types and configuration files for CLI projects
 */
export class CLITypeConfigGenerators {
  /**
   * CLI types generator
   */
  private readonly typesGenerator: CLITypesGenerator;

  /**
   * CLI config generator
   */
  private readonly configGenerator: CLIConfigGenerator;

  /**
   * Create CLI type and config generators
   */
  constructor() {
    this.typesGenerator = new CLITypesGenerator();
    this.configGenerator = new CLIConfigGenerator();
  }

  /**
   * Generate CLI types
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} CLI types content
   */
  generateCLITypes(config: ProjectConfig): string {
    return this.typesGenerator.generateCLITypes(config);
  }

  /**
   * Generate CLI configuration
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} CLI configuration content
   */
  generateCLIConfig(config: ProjectConfig): string {
    return this.configGenerator.generateCLIConfig(config);
  }
}
