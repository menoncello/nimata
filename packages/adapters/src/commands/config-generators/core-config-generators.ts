/**
 * Core Configuration Generators
 *
 * Generates package.json, TypeScript, ESLint, and Prettier configurations
 */

import type {
  EslintConfig,
  PackageJsonConfig,
  TypeScriptConfig,
} from '../../types/config-types.js';
import { FORMATTING_CONSTANTS, TS_CONFIG, NODE_VERSIONS } from '../config-constants.js';
import { DependencyManager } from '../dependency-manager.js';
import type { ProjectConfig } from '../enhanced-init-types.js';

/**
 * Core Configuration Generators Class
 */
export class CoreConfigGenerators {
  private dependencyManager: DependencyManager;

  /**
   * Creates a new CoreConfigGenerators instance
   */
  constructor() {
    this.dependencyManager = new DependencyManager();
  }

  /**
   * Generate package.json content
   * @param {ProjectConfig} config - Project configuration
   * @returns {PackageJsonConfig} Package.json content
   */
  generatePackageJson(config: ProjectConfig): PackageJsonConfig {
    const packageJson: PackageJsonConfig = {
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

    // Add bin field for CLI projects
    const binField = this.dependencyManager.getBinField(config.name, config.projectType);
    if (binField) {
      packageJson.bin = binField;
    }

    return packageJson;
  }

  /**
   * Generate TypeScript configuration
   * @param {ProjectConfig} config - Project configuration
   * @returns {TypeScriptConfig} TypeScript configuration
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
   * @param {ProjectConfig} config - Project configuration
   * @returns {EslintConfig} ESLint configuration
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
   * Generate Prettier configuration
   * @returns {Record<string, unknown>} Prettier configuration
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
   * Get ESLint environment configuration
   * @returns {{ es2022: boolean; node: boolean }} ESLint environment settings
   */
  private getEslintEnvironment(): { es2022: boolean; node: boolean } {
    return {
      es2022: true,
      node: true,
    };
  }

  /**
   * Get ESLint extends configuration based on quality level
   * @param {string} qualityLevel - Project quality level
   * @returns {string[]} ESLint extends array
   */
  private getEslintExtends(qualityLevel: string): string[] {
    const baseExtends = ['eslint:recommended', '@typescript-eslint/recommended'];

    return qualityLevel === 'strict' ? [...baseExtends, 'plugin:import/typescript'] : baseExtends;
  }

  /**
   * Get ESLint parser options
   * @returns {{ ecmaVersion: number; sourceType: string; project: string }} ESLint parser options
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
   * @param {string} qualityLevel - Project quality level
   * @returns {Record<string, unknown>} ESLint rules configuration
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
}
