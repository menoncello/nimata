/**
 * ESLint Configuration Generator
 */

import type { ProjectConfig } from '../../../types/project-config.js';
import { JSON_INDENTATION, ESLINT_RULE_VALUES } from './constants.js';

/**
 * ESLint configuration generator
 */
export class ESLintConfigGenerator {
  /**
   * Generate ESLint configuration (instance method)
   * @param {_config} _config - Project configuration (optional)
   * @returns {string} ESLint config ESM format
   */
  generate(_config?: ProjectConfig): string {
    return ESLintConfigGenerator.generateESLintConfig();
  }

  /**
   * Build ESLint options
   * @returns {Record<string, unknown>} ESLint configuration object
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
   * Generate ESLint configuration
   * @returns {string} ESLint config ESM format
   */
  static generateESLintConfig(): string {
    const config = this.buildESLintOptions();
    return `export default ${JSON.stringify(config, null, JSON_INDENTATION)};`;
  }
}
