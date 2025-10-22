/**
 * Configuration Generators (Refactored)
 *
 * Generates various configuration files for the project
 */

import type {
  ClaudeConfig,
  CopilotConfig,
  EslintConfig,
  PackageJsonConfig,
  TypeScriptConfig,
} from '../types/config-types.js';
import { JSON_SERIALIZATION } from '../utils/constants.js';
import {
  COVERAGE_THRESHOLDS,
  FORMATTING_CONSTANTS,
  TS_CONFIG,
  NODE_VERSIONS,
} from './config-constants.js';
import { DependencyManager } from './dependency-manager.js';
import type { ProjectConfig } from './enhanced-init-types.js';

/**
 * Configuration Generators Class
 */
export class ConfigGenerators {
  private dependencyManager: DependencyManager;

  /**
   * Creates a new ConfigGenerators instance
   * @returns {void}
   */
  constructor() {
    this.dependencyManager = new DependencyManager();
  }

  /**
   * Generate package.json content
   * @param config - Project configuration
   * @returns Package.json content
   */
  generatePackageJson(config: ProjectConfig): PackageJsonConfig {
    return {
      name: config.name,
      version: '1.0.0',
      description: config.description,
      main: this.dependencyManager.getMainEntry(config.projectType),
      types: this.dependencyManager.getTypesEntry(config.projectType),
      scripts: this.dependencyManager.getScripts(config.projectType),
      keywords: this.dependencyManager.getKeywords(config.projectType),
      author: '',
      license: 'MIT',
      engines: {
        node: NODE_VERSIONS.MINIMUM_NODE,
        npm: NODE_VERSIONS.MINIMUM_NPM,
      },
      devDependencies: this.dependencyManager.getDevDependencies(config),
      dependencies: this.dependencyManager.getDependencies(config.projectType),
    };
  }

  /**
   * Generate TypeScript configuration
   * @param config - Project configuration
   * @returns TypeScript configuration
   */
  generateTsConfig(config: ProjectConfig): TypeScriptConfig {
    return {
      compilerOptions: {
        target: TS_CONFIG.TARGET_VERSION,
        module: TS_CONFIG.MODULE_SYSTEM,
        moduleResolution: TS_CONFIG.MODULE_RESOLUTION,
        outDir: './dist',
        rootDir: './src',
        strict: config.qualityLevel === 'strict',
        esModuleInterop: true,
        skipLibCheck: true,
        forceConsistentCasingInFileNames: true,
        declaration: config.projectType === 'library',
        declarationMap: config.projectType === 'library',
        sourceMap: true,
        removeComments: config.qualityLevel === 'strict',
        noImplicitAny: config.qualityLevel !== 'light',
        noImplicitReturns: config.qualityLevel === 'strict',
        noFallthroughCasesInSwitch: config.qualityLevel === 'strict',
        noUncheckedIndexedAccess: config.qualityLevel === 'strict',
        exactOptionalPropertyTypes: config.qualityLevel === 'strict',
      },
      include: ['src/**/*'],
      exclude: ['node_modules', 'dist', '**/*.test.ts', '**/*.spec.ts'],
    };
  }

  /**
   * Generate ESLint configuration
   * @param config - Project configuration
   * @returns ESLint configuration
   */
  generateEslintConfig(config: ProjectConfig): EslintConfig {
    return {
      root: true,
      env: this.getEslintEnvironment(),
      extends: this.getEslintExtends(config.qualityLevel),
      parser: '@typescript-eslint/parser',
      parserOptions: this.getEslintParserOptions(),
      plugins: ['@typescript-eslint', 'import'],
      rules: this.getEslintRules(config.qualityLevel),
      ignorePatterns: ['dist/', 'node_modules/', '*.js'],
    };
  }

  /**
   * Get ESLint environment configuration
   * @returns ESLint environment settings
   */
  private getEslintEnvironment(): { es2022: boolean; node: boolean } {
    return {
      es2022: true,
      node: true,
    };
  }

  /**
   * Get ESLint extends configuration based on quality level
   * @param qualityLevel - Project quality level
   * @returns ESLint extends array
   */
  private getEslintExtends(qualityLevel: string): string[] {
    const baseExtends = ['eslint:recommended', '@typescript-eslint/recommended'];

    return qualityLevel === 'strict' ? [...baseExtends, 'plugin:import/typescript'] : baseExtends;
  }

  /**
   * Get ESLint parser options
   * @returns ESLint parser options
   */
  private getEslintParserOptions(): {
    ecmaVersion: number;
    sourceType: string;
    project: string;
  } {
    return {
      ecmaVersion: 2022,
      sourceType: 'module',
      project: './tsconfig.json',
    };
  }

  /**
   * Get ESLint rules based on quality level
   * @param qualityLevel - Project quality level
   * @returns ESLint rules configuration
   */
  private getEslintRules(qualityLevel: string): Record<string, unknown> {
    return {
      // Enforce consistent code style
      indent: ['error', FORMATTING_CONSTANTS.INDENT_SIZE],
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
      'comma-dangle': ['error', 'always-multiline'],
      'object-curly-spacing': ['error', 'always'],

      // TypeScript-specific rules
      '@typescript-eslint/no-unused-vars': qualityLevel === 'light' ? 'warn' : 'error',
      '@typescript-eslint/explicit-function-return-type':
        qualityLevel === 'strict' ? 'error' : 'off',
      '@typescript-eslint/no-explicit-any': qualityLevel === 'light' ? 'warn' : 'error',
      '@typescript-eslint/prefer-const': 'error',

      // Import rules
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
        },
      ],
    };
  }

  /**
   * Generate Prettier configuration
   * @returns Prettier configuration
   */
  generatePrettierConfig(): Record<string, unknown> {
    return {
      semi: true,
      trailingComma: 'all',
      singleQuote: true,
      printWidth: FORMATTING_CONSTANTS.MAX_LINE_LENGTH,
      tabWidth: FORMATTING_CONSTANTS.TAB_SIZE,
      useTabs: false,
      endOfLine: 'lf',
      arrowParens: 'avoid',
      bracketSpacing: true,
    };
  }

  /**
   * Generate Vitest configuration
   * @param config - Project configuration
   * @returns Vitest configuration content
   */
  generateVitestConfig(config: ProjectConfig): string {
    const coverageThreshold = this.getCoverageThreshold(config.qualityLevel);
    const testConfig = this.getVitestTestConfig(coverageThreshold);
    const resolveConfig = this.getVitestResolveConfig();

    return this.buildVitestConfigString(testConfig, resolveConfig);
  }

  /**
   * Get coverage threshold based on quality level
   * @param qualityLevel - Project quality level
   * @returns Coverage threshold value
   */
  private getCoverageThreshold(qualityLevel: string): number {
    if (qualityLevel === 'light') {
      return COVERAGE_THRESHOLDS.LIGHT;
    }
    if (qualityLevel === 'medium') {
      return COVERAGE_THRESHOLDS.MEDIUM;
    }
    return COVERAGE_THRESHOLDS.STRICT;
  }

  /**
   * Get Vitest test configuration
   * @param coverageThreshold - Coverage threshold value
   * @returns Vitest test configuration object
   */
  private getVitestTestConfig(coverageThreshold: number): Record<string, unknown> {
    return {
      globals: true,
      environment: 'node',
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        exclude: ['node_modules/', 'dist/', '**/*.d.ts', '**/*.config.*'],
        thresholds: {
          global: {
            branches: coverageThreshold,
            functions: coverageThreshold,
            lines: coverageThreshold,
            statements: coverageThreshold,
          },
        },
      },
    };
  }

  /**
   * Get Vitest resolve configuration
   * @returns Vitest resolve configuration object
   */
  private getVitestResolveConfig(): Record<string, unknown> {
    return {
      alias: {
        '@': "path.resolve(__dirname, './src')",
      },
    };
  }

  /**
   * Build Vitest configuration string
   * @param testConfig - Test configuration object
   * @param resolveConfig - Resolve configuration object
   * @returns Vitest configuration string
   */
  private buildVitestConfigString(
    testConfig: Record<string, unknown>,
    resolveConfig: Record<string, unknown>
  ): string {
    return `
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: ${JSON.stringify(testConfig, null, JSON_SERIALIZATION.PRETTY_INDENT)},
  resolve: ${JSON.stringify(resolveConfig, null, JSON_SERIALIZATION.PRETTY_INDENT)},
});
`.trim();
  }

  /**
   * Generate sample test file
   * @param config - Project configuration
   * @returns Sample test file content
   */
  generateSampleTest(config: ProjectConfig): string {
    return `
import { describe, it, expect } from 'vitest';

describe('${config.name}', () => {
  it('should pass sample test', () => {
    expect(true).toBe(true);
  });
});
`.trim();
  }

  /**
   * Generate Claude Code configuration
   * @param config - Project configuration
   * @returns Claude Code configuration
   */
  generateClaudeConfig(config: ProjectConfig): ClaudeConfig {
    return {
      project: {
        name: config.name,
        description: config.description,
        type: config.projectType,
      },
      code: {
        style: {
          language: 'typescript',
          framework: 'none',
          testing: 'vitest',
          linting: 'eslint',
          formatting: 'prettier',
        },
        conventions: {
          fileNaming: 'kebab-case',
          componentNaming: 'PascalCase',
          testNaming: 'kebab-case.test.ts',
        },
      },
      ai: {
        model: 'claude-3-sonnet-20240229',
        temperature: 0.1,
        maxTokens: 4000,
        contextWindow: 100000,
      },
      rules: [],
    };
  }

  /**
   * Generate GitHub Copilot configuration
   * @param _config - Project configuration
   * @returns GitHub Copilot configuration
   */
  generateCopilotConfig(_config: ProjectConfig): CopilotConfig {
    return {
      version: 1,
      config: {
        ide: {
          preferredLanguage: 'typescript',
          preferredFramework: 'none',
        },
        preferences: {
          enableCodeSuggestions: true,
          enableInlineCompletion: true,
          enableExplanation: true,
        },
      },
    };
  }
}
