/**
 * Configuration providers for template context transformers
 */

/**
 * Constants for template context transformation
 */
const _TEMPLATE_CONTEXT_CONSTANTS = {
  PRINT_WIDTH_STRICT: 80,
  PRINT_WIDTH_NORMAL: 100,
} as const;

/**
 * Static configuration providers for template context
 */
export class ContextConfigProviders {
  /**
   * Gets ESLint configuration based on the specified quality level.
   * Generates appropriate ESLint rules and extends configurations.
   * @param qualityLevel - The quality level determining ESLint rule strictness
   * @returns ESLint configuration object with rules and extends settings
   */
  static getESLintConfig(qualityLevel: string): Record<string, unknown> {
    return {
      extends:
        qualityLevel === 'high'
          ? [
              'eslint:recommended',
              '@typescript-eslint/recommended',
              '@typescript-eslint/restrict-type-checked',
            ]
          : ['eslint:recommended', '@typescript-eslint/recommended'],
      rules:
        qualityLevel === 'strict'
          ? {
              'no-console': 'error',
              'prefer-const': 'error',
            }
          : {
              'no-console': 'warn',
              'prefer-const': 'warn',
            },
    };
  }

  /**
   * Gets Prettier configuration based on the specified quality level.
   * Generates appropriate Prettier formatting settings.
   * @param qualityLevel - The quality level determining Prettier formatting strictness
   * @returns Prettier configuration object with formatting rules
   */
  static getPrettierConfig(qualityLevel: string): Record<string, unknown> {
    return {
      semi: true,
      trailingComma: qualityLevel === 'high' ? 'all' : 'es5',
      singleQuote: true,
      printWidth:
        qualityLevel === 'strict'
          ? _TEMPLATE_CONTEXT_CONSTANTS.PRINT_WIDTH_STRICT
          : _TEMPLATE_CONTEXT_CONSTANTS.PRINT_WIDTH_NORMAL,
      tabWidth: 2,
    };
  }

  /**
   * Gets TypeScript configuration based on the specified quality level.
   * Generates appropriate TypeScript compiler options.
   * @param qualityLevel - The quality level determining TypeScript compiler strictness
   * @returns TypeScript configuration object with compiler options
   */
  static getTypeScriptConfig(qualityLevel: string): Record<string, unknown> {
    return {
      strict: qualityLevel !== 'light',
      noImplicitAny: qualityLevel === 'high',
      strictNullChecks: qualityLevel === 'high',
      noImplicitReturns: qualityLevel === 'strict',
    };
  }
}
