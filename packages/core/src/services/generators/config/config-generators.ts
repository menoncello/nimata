/**
 * Configuration File Generators
 */

import type { ProjectConfig } from '../../../types/project-config.js';
import {
  JSON_INDENTATION,
  TS_TARGETS,
  TS_MODULES,
  TS_JSX,
  ESLINT_RULE_VALUES,
} from './constants.js';

/**
 * Generates configuration file content
 */
export class ConfigGenerators {
  /**
   * Generate TypeScript configuration
   * @param _config - Project configuration (unused for now)
   * @returns TypeScript config JSON
   */
  static generateTypeScriptConfig(_config: ProjectConfig): string {
    const compilerOptions = this.buildCompilerOptions();
    const baseConfig = {
      compilerOptions,
      include: ['src/**/*'],
      exclude: ['node_modules', 'dist', 'tests'],
    };

    return JSON.stringify(baseConfig, null, JSON_INDENTATION);
  }

  /**
   * Generate Prettier configuration
   * @returns Prettier config JSON
   */
  static generatePrettierConfig(): string {
    const config = this.buildPrettierOptions();
    return JSON.stringify(config, null, JSON_INDENTATION);
  }

  /**
   * Generate ESLint configuration
   * @returns ESLint config JSON
   */
  static generateESLintConfig(): string {
    const config = this.buildESLintOptions();
    return JSON.stringify(config, null, JSON_INDENTATION);
  }

  /**
   * Generate Vitest configuration
   * @returns Vitest config TypeScript code
   */
  static generateVitestConfig(): string {
    return `import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.test.ts', 'src/**/*.spec.ts']
    }
  }
});`;
  }

  /**
   * Generate Stryker configuration
   * @returns Stryker config JSON
   */
  static generateStrykerConfig(): string {
    const config = this.buildStrykerOptions();
    return JSON.stringify(config, null, JSON_INDENTATION);
  }

  /**
   * Build TypeScript compiler options
   * @returns Compiler options object
   */
  private static buildCompilerOptions(): Record<string, unknown> {
    return {
      target: TS_TARGETS.ES2022,
      module: TS_MODULES.ESNEXT,
      moduleResolution: 'bundler',
      allowImportingTsExtensions: true,
      allowSyntheticDefaultImports: true,
      esModuleInterop: true,
      allowJs: true,
      checkJs: false,
      jsx: TS_JSX.REACT,
      declaration: true,
      declarationMap: true,
      sourceMap: true,
      outDir: './dist',
      rootDir: './src',
      removeComments: false,
      strict: true,
      noImplicitAny: true,
      strictNullChecks: true,
      strictFunctionTypes: true,
      noImplicitReturns: true,
      noFallthroughCasesInSwitch: true,
      noUncheckedIndexedAccess: true,
      noImplicitOverride: true,
      exactOptionalPropertyTypes: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
    };
  }

  /**
   * Build Prettier options
   * @returns Prettier configuration object
   */
  private static buildPrettierOptions(): Record<string, unknown> {
    return {
      semi: true,
      trailingComma: 'es5',
      singleQuote: true,
      printWidth: 100,
      tabWidth: JSON_INDENTATION,
      useTabs: false,
    };
  }

  /**
   * Build ESLint options
   * @returns ESLint configuration object
   */
  private static buildESLintOptions(): Record<string, unknown> {
    return {
      root: true,
      env: {
        node: true,
        es2022: true,
      },
      extends: [
        'eslint:recommended',
        '@typescript-eslint/recommended',
        '@typescript-eslint/recommended-requiring-type-checking',
      ],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
      },
      plugins: ['@typescript-eslint'],
      rules: {
        '@typescript-eslint/no-unused-vars': ESLINT_RULE_VALUES.ERROR,
        '@typescript-eslint/explicit-function-return-type': ESLINT_RULE_VALUES.WARN,
        '@typescript-eslint/no-explicit-any': ESLINT_RULE_VALUES.ERROR,
        '@typescript-eslint/no-non-null-assertion': ESLINT_RULE_VALUES.ERROR,
        'prefer-const': ESLINT_RULE_VALUES.ERROR,
        'no-var': ESLINT_RULE_VALUES.ERROR,
      },
    };
  }

  /**
   * Build Stryker options
   * @returns Stryker configuration object
   */
  private static buildStrykerOptions(): Record<string, unknown> {
    return {
      _comment: 'This config was generated using stryker config init',
      $schema: './node_modules/@stryker-mutator/core/schema/stryker-schema.json',
      testRunner: 'vitest',
      coverageAnalysis: 'perTest',
      reporters: ['progress', 'clear-text', 'html'],
      thresholds: {
        high: 80,
        low: 60,
      },
    };
  }
}
