/**
 * Configuration Generators (Refactored)
 *
 * Main orchestrator for generating various configuration files for the project.
 * This class delegates to specialized generator modules to keep the code organized
 * and maintainable.
 */

import type {
  ClaudeConfig,
  CopilotConfig,
  EslintConfig,
  PackageJsonConfig,
  TypeScriptConfig,
} from '../types/config-types.js';
import {
  CoreConfigGenerators,
  TestingConfigGenerators,
  AiConfigGenerators,
  WebProjectGenerators,
  CliProjectGenerators,
  DocumentationGenerators,
} from './config-generators/index.js';
import type { ProjectConfig } from './enhanced-init-types.js';

/**
 * Configuration Generators Class
 *
 * This is the main entry point for all configuration generation functionality.
 * It delegates to specialized generators to maintain separation of concerns
 * and keep individual files under the ESLint line limit.
 */
export class ConfigGenerators {
  private coreGenerators: CoreConfigGenerators;
  private testingGenerators: TestingConfigGenerators;
  private aiGenerators: AiConfigGenerators;
  private webGenerators: WebProjectGenerators;
  private cliGenerators: CliProjectGenerators;
  private documentationGenerators: DocumentationGenerators;

  /**
   * Creates a new ConfigGenerators instance
   */
  constructor() {
    this.coreGenerators = new CoreConfigGenerators();
    this.testingGenerators = new TestingConfigGenerators();
    this.aiGenerators = new AiConfigGenerators();
    this.webGenerators = new WebProjectGenerators();
    this.cliGenerators = new CliProjectGenerators();
    this.documentationGenerators = new DocumentationGenerators();
  }

  // Core Configuration Methods (delegated to CoreConfigGenerators)

  /**
   * Generate package.json content
   * @param {ProjectConfig} config - Project configuration
   * @returns {PackageJsonConfig} Package.json content
   */
  generatePackageJson(config: ProjectConfig): PackageJsonConfig {
    return this.coreGenerators.generatePackageJson(config);
  }

  /**
   * Generate TypeScript configuration
   * @param {ProjectConfig} config - Project configuration
   * @returns {TypeScriptConfig} TypeScript configuration
   */
  generateTsConfig(config: ProjectConfig): TypeScriptConfig {
    return this.coreGenerators.generateTsConfig(config);
  }

  /**
   * Generate ESLint configuration
   * @param {ProjectConfig} config - Project configuration
   * @returns {EslintConfig} ESLint configuration
   */
  generateEslintConfig(config: ProjectConfig): EslintConfig {
    return this.coreGenerators.generateEslintConfig(config);
  }

  /**
   * Generate Prettier configuration
   * @returns {Record<string, unknown>} Prettier configuration
   */
  generatePrettierConfig(): Record<string, unknown> {
    return this.coreGenerators.generatePrettierConfig();
  }

  // Testing Configuration Methods (delegated to TestingConfigGenerators)

  /**
   * Generate Vitest configuration
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Vitest configuration content
   */
  generateVitestConfig(config: ProjectConfig): string {
    return this.testingGenerators.generateVitestConfig(config);
  }

  /**
   * Generate sample test file
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Sample test file content
   */
  generateSampleTest(config: ProjectConfig): string {
    return this.testingGenerators.generateSampleTest(config);
  }

  // AI Configuration Methods (delegated to AiConfigGenerators)

  /**
   * Generate Claude Code configuration
   * @param {ProjectConfig} config - Project configuration
   * @returns {ClaudeConfig} Claude Code configuration
   */
  generateClaudeConfig(config: ProjectConfig): ClaudeConfig {
    return this.aiGenerators.generateClaudeConfig(config);
  }

  /**
   * Generate GitHub Copilot configuration
   * @param {ProjectConfig} config - Project configuration
   * @returns {CopilotConfig} GitHub Copilot configuration
   */
  generateCopilotConfig(config: ProjectConfig): CopilotConfig {
    return this.aiGenerators.generateCopilotConfig(config);
  }

  // Web Project Methods (delegated to WebProjectGenerators)

  /**
   * Generate Vite configuration for web projects
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Vite configuration content
   */
  generateViteConfig(config: ProjectConfig): string {
    return this.webGenerators.generateViteConfig(config);
  }

  /**
   * Generate index.html for web projects
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} HTML content
   */
  generateIndexHtml(config: ProjectConfig): string {
    return this.webGenerators.generateIndexHtml(config);
  }

  /**
   * Generate App.tsx for web projects
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} App.tsx content
   */
  generateAppTsx(config: ProjectConfig): string {
    return this.webGenerators.generateAppTsx(config);
  }

  /**
   * Generate main.css for web projects
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} CSS content
   */
  generateMainCss(config: ProjectConfig): string {
    return this.webGenerators.generateMainCss(config);
  }

  /**
   * Generate public/styles.css for web projects
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} CSS content
   */
  generatePublicCss(config: ProjectConfig): string {
    return this.webGenerators.generatePublicCss(config);
  }

  // CLI Project Methods (delegated to CliProjectGenerators)

  /**
   * Generate CLI executable file
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} CLI executable content
   */
  generateCliExecutable(config: ProjectConfig): string {
    return this.cliGenerators.generateCliExecutable(config);
  }

  /**
   * Generate CLI entry point content
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} CLI entry point content
   */
  generateCliEntryContent(config: ProjectConfig): string {
    return this.cliGenerators.generateCliEntryContent(config);
  }

  // Documentation Methods (delegated to DocumentationGenerators)

  /**
   * Generate API documentation for library projects
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} API documentation content
   */
  generateApiDocumentation(config: ProjectConfig): string {
    return this.documentationGenerators.generateApiDocumentation(config);
  }
}
