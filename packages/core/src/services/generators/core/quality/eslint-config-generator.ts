/**
 * ESLint Configuration Generator
 *
 * Generates ESLint configuration files
 */

/**
 * Constants for configuration formatting
 */
const JSON_INDENTATION = 2;
const DEFAULT_TAB_WIDTH = 2;

/**
 * ESLint configuration generator class
 */
export class ESLintConfigGenerator {
  /**
   * Generate ESLint configuration
   * @returns ESLint configuration content
   */
  static generateESLintConfig(): string {
    return [
      ESLintConfigGenerator.generateESLintBase(),
      ESLintConfigGenerator.generateESLintRules(),
    ].join('\n\n');
  }

  /**
   * Generate ESLint base configuration
   * @returns Base ESLint configuration
   */
  private static generateESLintBase(): string {
    return JSON.stringify(
      {
        env: {
          browser: true,
          es2022: true,
          node: true,
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
        root: true,
      },
      null,
      JSON_INDENTATION
    );
  }

  /**
   * Generate ESLint rules configuration
   * @returns ESLint rules configuration
   */
  private static generateESLintRules(): string {
    const typeScriptRules = ESLintConfigGenerator.getTypeScriptRules();
    const generalRules = ESLintConfigGenerator.getGeneralRules();
    const codeStyleRules = ESLintConfigGenerator.getCodeStyleRules();
    const bestPracticeRules = ESLintConfigGenerator.getBestPracticeRules();

    const rules = {
      ...typeScriptRules,
      ...generalRules,
      ...codeStyleRules,
      ...bestPracticeRules,
    };

    return JSON.stringify({ rules }, null, JSON_INDENTATION);
  }

  /**
   * Gets TypeScript-specific ESLint rules
   * @returns TypeScript rules object
   */
  private static getTypeScriptRules(): Record<string, unknown> {
    return {
      // TypeScript specific rules
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/prefer-const': 'error',
      '@typescript-eslint/no-var-requires': 'error',
    };
  }

  /**
   * Gets general ESLint rules
   * @returns General rules object
   */
  private static getGeneralRules(): Record<string, unknown> {
    return {
      // General ESLint rules
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-alert': 'error',
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-script-url': 'error',
      'no-void': 'error',
      'no-with': 'error',
    };
  }

  /**
   * Gets code style ESLint rules
   * @returns Code style rules object
   */
  private static getCodeStyleRules(): Record<string, unknown> {
    return {
      // Code style rules
      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],
      'brace-style': ['error', '1tbs'],
      'comma-dangle': ['error', 'always-multiline'],
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
      indent: ['error', DEFAULT_TAB_WIDTH],
      'max-len': ['error', { code: 100, ignoreUrls: true }],
      'no-trailing-spaces': 'error',
      'eol-last': 'error',
    };
  }

  /**
   * Gets best practice ESLint rules
   * @returns Best practice rules object
   */
  private static getBestPracticeRules(): Record<string, unknown> {
    return {
      // Best practices
      'no-unused-vars': 'off', // Handled by TypeScript
      'no-undef': 'off', // Handled by TypeScript
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'prefer-arrow-callback': 'error',
      'prefer-template': 'error',
      'template-curly-spacing': 'error',
      'arrow-spacing': 'error',
      'generator-star-spacing': 'error',
      'yield-star-spacing': 'error',
    };
  }
}
