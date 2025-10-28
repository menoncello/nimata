/**
 * ESLint Configuration Generator
 *
 * Generates ESLint configuration files for projects
 */
import type { ProjectConfig } from '../../../types/project-config.js';

/**
 * ESLint Configuration Generator class
 */
export class ESLintConfigGenerator {
  /**
   * Generate ESLint configuration
   * @param _config - Project configuration
   * @returns eslint.config.js content
   */
  generate(_config: ProjectConfig): string {
    return `${this.generateImports()}

export default [
  eslint.configs.recommended,
  ${this.generateTypeScriptConfig()},
  ${this.generateTestConfig()},
  ${this.generateIgnores()},
];`;
  }

  /**
   * Generate ESLint imports
   * @returns ESLint import statements
   */
  private generateImports(): string {
    return `import eslint from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';`;
  }

  /**
   * Generate ESLint TypeScript configuration
   * @returns TypeScript configuration object
   */
  private generateTypeScriptConfig(): string {
    return `{
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: ${this.generateRules()}
  }`;
  }

  /**
   * Generate ESLint rules
   * @returns ESLint rules object
   */
  private generateRules(): string {
    return `{
      ${this.generateTypeScriptRules()},
      ${this.generateGeneralRules()},
      ${this.generateStyleRules()},
      ${this.generateBestPracticeRules()},
      ${this.generateImportRules()}
    }`;
  }

  /**
   * Generate TypeScript-specific ESLint rules
   * @returns TypeScript ESLint rules
   */
  private generateTypeScriptRules(): string {
    return `// TypeScript specific rules
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error'`;
  }

  /**
   * Generate general ESLint rules
   * @returns General ESLint rules
   */
  private generateGeneralRules(): string {
    return `// General rules
      'no-console': 'warn',
      'no-debugger': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'prefer-template': 'error'`;
  }

  /**
   * Generate code style ESLint rules
   * @returns Code style ESLint rules
   */
  private generateStyleRules(): string {
    return `// Code style
      'indent': ['error', 2],
      'quotes': ['error', 'single'],
      'semi': ['error', 'always'],
      'comma-dangle': ['error', 'always-multiline']`;
  }

  /**
   * Generate best practice ESLint rules
   * @returns Best practice ESLint rules
   */
  private generateBestPracticeRules(): string {
    return `// Best practices
      'eqeqeq': ['error', 'always'],
      'curly': ['error', 'all'],
      'brace-style': ['error', '1tbs'],
      'max-len': ['error', { code: 100 }]`;
  }

  /**
   * Generate import/export ESLint rules
   * @returns Import/export ESLint rules
   */
  private generateImportRules(): string {
    return `// Import/Export
      'sort-imports': ['error', { ignoreDeclarationSort: true }],
      'import/order': ['error', {
        'groups': [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index'
        ],
        'newlines-between': 'always'
      }]`;
  }

  /**
   * Generate ESLint test configuration
   * @returns Test configuration object
   */
  private generateTestConfig(): string {
    return `{
    files: ['tests/**/*.ts', '**/*.test.ts'],
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  }`;
  }

  /**
   * Generate ESLint ignores
   * @returns ESLint ignores configuration
   */
  private generateIgnores(): string {
    return `{
    ignores: [
      'dist/**',
      'build/**',
      'coverage/**',
      'node_modules/**',
      '*.js'
    ],
  }`;
  }
}
