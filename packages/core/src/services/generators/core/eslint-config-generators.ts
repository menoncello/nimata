/**
 * ESLint Configuration Generators
 *
 * Handles ESLint configuration content generation
 */
import type { ProjectConfig } from '../../../types/project-config.js';

/**
 * ESLint configuration generators
 */
export class EslintConfigGenerators {
  /**
   * Generate ESLint configuration content
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} ESLint configuration content
   */
  static generateEslintContent(config: ProjectConfig): string {
    const isStrict = config.qualityLevel === 'strict';
    const isLight = config.qualityLevel === 'light';

    // Determine ESLint rules based on quality level
    let eslintRules: string;
    if (isStrict) {
      eslintRules = EslintConfigGenerators.generateStrictRules();
    } else if (isLight) {
      eslintRules = EslintConfigGenerators.generateLightRules();
    } else {
      eslintRules = EslintConfigGenerators.generateDefaultRules();
    }

    // Add framework-specific rules
    const frameworkRules = EslintConfigGenerators.getFrameworkSpecificRules(config);

    return `// @ts-check
import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint:recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ['dist/**', 'node_modules/**', 'coverage/**'],
  },
  {
    rules: {
${eslintRules}
${frameworkRules}
    }
  }
);`;
  }

  /**
   * Generate strict ESLint rules
   * @returns {string} Strict ESLint rules
   */
  private static generateStrictRules(): string {
    return `      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/prefer-const': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
      'no-console': 'warn',
      'no-debugger': 'error'`;
  }

  /**
   * Generate light ESLint rules
   * @returns {string} Light ESLint rules
   */
  private static generateLightRules(): string {
    return `      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': 'off',
      'no-debugger': 'off'`;
  }

  /**
   * Generate default ESLint rules
   * @returns {string} Default ESLint rules
   */
  private static generateDefaultRules(): string {
    return `      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      'prefer-const': 'warn',
      'no-var': 'error',
      'no-console': 'warn'`;
  }

  /**
   * Get framework-specific ESLint rules
   * @param {ProjectConfig} config - Project configuration
   * @returns {boolean}ic ESLint rules
   */
  private static getFrameworkSpecificRules(config: ProjectConfig): string {
    let frameworkRules = '';

    switch (config.framework) {
      case 'react':
        frameworkRules = `      // React-specific rules
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off'`;
        break;
      case 'vue':
        frameworkRules = `      // Vue-specific rules
      'vue/multi-word-component-names': 'off'`;
        break;
      case 'express':
        frameworkRules = `      // Express-specific rules
      'no-unused-vars': 'warn'`;
        break;
    }

    // Add project type specific rules
    if (config.projectType === 'cli') {
      frameworkRules += frameworkRules ? '\n' : '';
      frameworkRules += `      // CLI-specific rules
      'no-process-exit': 'off'`;
    }

    return frameworkRules ? `\n${frameworkRules}` : '';
  }

  /**
   * Create eslint.config.mjs file item for DirectoryItem structure
   * @param {ProjectConfig} config - Project configuration
   * @returns {DirectoryItem} Directory item
   */
  static createEslintFile(config: ProjectConfig): {
    path: string;
    type: 'file';
    content: string;
  } {
    return {
      path: 'eslint.config.mjs',
      type: 'file',
      content: EslintConfigGenerators.generateEslintContent(config),
    };
  }
}
