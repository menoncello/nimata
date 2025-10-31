/**
 * Quality Configuration Generators
 *
 * Generates quality tooling configurations (ESLint, Prettier, Stryker, etc.)
 */
import type { ProjectConfig } from '../../../types/project-config.js';
import { DirectoryItem } from './core-file-operations.js';
import { CIConfigGenerator } from './quality/ci-config-generator.js';
import { ESLintConfigGenerator } from './quality/eslint-config-generator.js';
import { TypeScriptConfigGenerator } from './quality/typescript-config-generator.js';

/**
 * Constants for configuration formatting
 */
const JSON_INDENTATION = 2;
const DEFAULT_TAB_WIDTH = 2;

/**
 * Handles quality configuration file generation
 */
export class QualityConfigGenerators {
  /**
   * Generate quality configuration files
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Quality configuration files
   */
  static generateQualityConfigs(config: ProjectConfig): DirectoryItem[] {
    return [
      QualityConfigGenerators.generateTypeScriptConfigFile(config),
      QualityConfigGenerators.generateESLintConfigFile(),
      QualityConfigGenerators.generatePrettierConfigFile(),
      QualityConfigGenerators.generateStrykerConfigFile(),
      QualityConfigGenerators.generateCIConfigFile(config),
    ];
  }

  /**
   * Generate TypeScript configuration file
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} TypeScript configuration file
   */
  private static generateTypeScriptConfigFile(config: ProjectConfig): DirectoryItem {
    return {
      path: 'tsconfig.json',
      type: 'file',
      content: TypeScriptConfigGenerator.generateTypeScriptConfig(config),
    };
  }

  /**
   * Generate ESLint configuration file
   * @returns {string} ESLint configuration file
   */
  private static generateESLintConfigFile(): DirectoryItem {
    return {
      path: 'eslint.config.mjs',
      type: 'file',
      content: ESLintConfigGenerator.generateESLintConfig(),
    };
  }

  /**
   * Generate Prettier configuration file
   * @returns {string} Prettier configuration file
   */
  private static generatePrettierConfigFile(): DirectoryItem {
    return {
      path: '.prettierrc.json',
      type: 'file',
      content: QualityConfigGenerators.generatePrettierConfig(),
    };
  }

  /**
   * Generate Stryker configuration file
   * @returns {string} Stryker configuration file
   */
  private static generateStrykerConfigFile(): DirectoryItem {
    return {
      path: 'stryker.config.json',
      type: 'file',
      content: QualityConfigGenerators.generateStrykerConfig(),
    };
  }

  /**
   * Generate CI configuration file
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} CI configuration file
   */
  private static generateCIConfigFile(config: ProjectConfig): DirectoryItem {
    return {
      path: '.github/workflows/ci.yml',
      type: 'file',
      content: CIConfigGenerator.generateCIConfig(config),
    };
  }

  /**
   * Generate Prettier configuration
   * @returns {string} Prettier configuration content
   */
  private static generatePrettierConfig(): string {
    const baseConfig = this.getPrettierBaseConfig();
    const overrides = this.getPrettierOverrides();

    return JSON.stringify(
      {
        ...baseConfig,
        overrides,
      },
      null,
      JSON_INDENTATION
    );
  }

  /**
   * Get base Prettier configuration
   * @returns {object} Base Prettier configuration object with formatting settings
   */
  private static getPrettierBaseConfig(): Record<string, unknown> {
    return {
      semi: true,
      trailingComma: 'es5',
      singleQuote: true,
      printWidth: 100,
      tabWidth: DEFAULT_TAB_WIDTH,
      useTabs: false,
      quoteProps: 'as-needed',
      bracketSpacing: true,
      arrowParens: 'always',
      endOfLine: 'lf',
      bracketSameLine: false,
    };
  }

  /**
   * Get Prettier override configurations
   * @returns {string} Override configurations array
   */
  private static getPrettierOverrides(): Array<Record<string, unknown>> {
    const jsonOverride = this.getJsonPrettierOverride();
    const markdownOverride = this.getMarkdownPrettierOverride();

    return [jsonOverride, markdownOverride];
  }

  /**
   * Get JSON file Prettier override
   * @returns {string} JSON override configuration
   */
  private static getJsonPrettierOverride(): Record<string, unknown> {
    return {
      files: '*.json',
      options: {
        printWidth: 120,
      },
    };
  }

  /**
   * Get Markdown file Prettier override
   * @returns {string} Markdown override configuration
   */
  private static getMarkdownPrettierOverride(): Record<string, unknown> {
    return {
      files: '*.md',
      options: {
        printWidth: 80,
        proseWrap: 'always',
      },
    };
  }

  /**
   * Generate Stryker configuration
   * @returns {string} Stryker configuration content
   */
  private static generateStrykerConfig(): string {
    return JSON.stringify(
      {
        _comment:
          'This config was generated using stryker init. Please take a look at: https://stryker-mutator.io/docs/stryker-js/configuration/ for more information.',
        packageManager: 'bun',
        reporters: ['progress', 'clear-text', 'html'],
        testRunner: 'vitest',
        coverageAnalysis: 'perTest',
        mutate: [
          'src/**/*.js',
          'src/**/*.ts',
          'src/**/*.jsx',
          'src/**/*.tsx',
          '!src/**/*.d.ts',
          '!src/**/*.stories.@(js|jsx|ts|tsx)',
          '!src/**/*.test.@(js|jsx|ts|tsx)',
          '!src/index.ts',
        ],
        thresholds: {
          high: 80,
          low: 60,
          break: null,
        },
      },
      null,
      JSON_INDENTATION
    );
  }
}
