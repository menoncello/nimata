/**
 * Content Generators
 *
 * Main entry point for generating content for various configuration and documentation files
 */
import type { ProjectConfig } from '../../../types/project-config.js';
import { AIConfigGenerators } from './ai-config-generators.js';
import { CIGenerators } from './ci-generators.js';
import { ConfigGenerators } from './config-generators.js';
import { MiscGenerators } from './misc-generators.js';
import { ReadmeGenerator } from './readme-generator.js';

/**
 * Utility class for generating file content
 */
export class ContentGenerators {
  /**
   * Generate README content
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} README markdown content
   */
  static generateReadme(config: ProjectConfig): string {
    return ReadmeGenerator.generate(config);
  }

  /**
   * Generate .gitignore content
   * @returns {string} Gitignore content
   */
  static generateGitignore(): string {
    return MiscGenerators.generateGitignore();
  }

  /**
   * Generate TypeScript configuration
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} TypeScript config JSON
   */
  static generateTypeScriptConfig(config: ProjectConfig): string {
    return ConfigGenerators.generateTypeScriptConfig(config);
  }

  /**
   * Generate Prettier configuration
   * @returns {string} Prettier config JSON
   */
  static generatePrettierConfig(): string {
    return ConfigGenerators.generatePrettierConfig();
  }

  /**
   * Generate ESLint configuration
   * @returns {string} ESLint config JSON
   */
  static generateESLintConfig(): string {
    return ConfigGenerators.generateESLintConfig();
  }

  /**
   * Generate Vitest configuration
   * @returns {string} Vitest config TypeScript code
   */
  static generateVitestConfig(): string {
    return ConfigGenerators.generateVitestConfig();
  }

  /**
   * Generate Stryker configuration
   * @returns {string} Stryker config JSON
   */
  static generateStrykerConfig(): string {
    return ConfigGenerators.generateStrykerConfig();
  }

  /**
   * Generate CI configuration
   * @returns {string} GitHub Actions workflow
   */
  static generateCIConfig(): string {
    return CIGenerators.generateCIConfig();
  }

  /**
   * Generate Claude configuration
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Claude configuration content
   */
  static generateClaudeConfig(config: ProjectConfig): string {
    return AIConfigGenerators.generateClaudeConfig(config);
  }

  /**
   * Generate GitHub Copilot configuration
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Copilot configuration content
   */
  static generateCopilotConfig(config: ProjectConfig): string {
    return AIConfigGenerators.generateCopilotConfig(config);
  }

  /**
   * Generate AI context configuration
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} AI context configuration content
   */
  static generateAIContext(config: ProjectConfig): string {
    return AIConfigGenerators.generateAIContext(config);
  }

  /**
   * Generate Cursor rules configuration
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Cursor rules configuration content
   */
  static generateCursorRules(config: ProjectConfig): string {
    return AIConfigGenerators.generateCursorRules(config);
  }

  /**
   * Generate package.json content
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Package.json content
   */
  static generatePackageJson(config: ProjectConfig): string {
    return ConfigGenerators.generatePackageJson(config);
  }

  /**
   * Generate API documentation placeholder
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} API documentation markdown
   */
  static generateAPIDocumentation(config: ProjectConfig): string {
    return ConfigGenerators.generateAPIDocumentation(config);
  }
}
