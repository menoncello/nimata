/**
 * Configuration File Generators
 */

import type { ProjectConfig } from '../../../types/project-config.js';
import { DocumentationGenerator } from './documentation-generator.js';
import { ESLintConfigGenerator } from './eslint-config-generator.js';
import { PackageJsonGenerator } from './package-json-generator.js';
import { PrettierConfigGenerator } from './prettier-config-generator.js';
import { StrykerConfigGenerator } from './stryker-config-generator.js';
import { TypeScriptConfigGenerator } from './typescript-config-generator.js';
import { VitestConfigGenerator } from './vitest-config-generator.js';

/**
 * Main configuration generators facade
 */
export class ConfigGenerators {
  /**
   * Generate TypeScript configuration
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} TypeScript config JSON
   */
  static generateTypeScriptConfig(config: ProjectConfig): string {
    return TypeScriptConfigGenerator.generateTypeScriptConfig(config);
  }

  /**
   * Generate Prettier configuration
   * @returns {string} Prettier config JSON
   */
  static generatePrettierConfig(): string {
    return PrettierConfigGenerator.generatePrettierConfig();
  }

  /**
   * Generate ESLint configuration
   * @returns {string} ESLint config ESM format
   */
  static generateESLintConfig(): string {
    return ESLintConfigGenerator.generateESLintConfig();
  }

  /**
   * Generate Vitest configuration
   * @returns {string} Vitest config TypeScript code
   */
  static generateVitestConfig(): string {
    return VitestConfigGenerator.generateVitestConfig();
  }

  /**
   * Generate Stryker configuration
   * @returns {string} Stryker config JSON
   */
  static generateStrykerConfig(): string {
    return StrykerConfigGenerator.generateStrykerConfig();
  }

  /**
   * Generate package.json content
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Package.json content
   */
  static generatePackageJson(config: ProjectConfig): string {
    return PackageJsonGenerator.generatePackageJson(config);
  }

  /**
   * Generate API documentation placeholder
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} API documentation markdown
   */
  static generateAPIDocumentation(config: ProjectConfig): string {
    return DocumentationGenerator.generateAPIDocumentation(config);
  }
}
