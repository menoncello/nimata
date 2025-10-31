/**
 * TypeScript-specific ESLint Rules
 *
 * Contains TypeScript rule definitions for different quality levels
 */

/**
 * Get base TypeScript ESLint rules
 * @returns {void} Base TypeScript rules configuration
 */
function getBaseTypeScriptRules(): Record<string, unknown> {
  return {
    // Basic TypeScript rules
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-non-null-assertion': 'warn',
  };
}

/**
 * Get light quality TypeScript rules
 * @returns {void} Light quality TypeScript rules configuration
 */
function getLightTypeScriptRules(): Record<string, unknown> {
  return {
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
  };
}

/**
 * Get medium quality TypeScript rules
 * @returns {void} Medium quality TypeScript rules configuration
 */
function getMediumTypeScriptRules(): Record<string, unknown> {
  return {
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'warn',
    '@typescript-eslint/explicit-module-boundary-types': 'warn',
  };
}

/**
 * Get strict quality TypeScript rules
 * @returns {void} Strict quality TypeScript rules configuration
 */
function getStrictTypeScriptRules(): Record<string, unknown> {
  return {
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/explicit-function-return-type': 'error',
    '@typescript-eslint/explicit-module-boundary-types': 'error',
    '@typescript-eslint/no-non-null-assertion': 'error',
    '@typescript-eslint/prefer-nullish-coalescing': 'error',
    '@typescript-eslint/prefer-optional-chain': 'error',
  };
}

/**
 * Get TypeScript ESLint rules based on quality level
 * @param {string} qualityLevel - The quality level ('light', 'medium', 'strict')
 * @returns {void} TypeScript ESLint rules configuration
 */
export function getTypeScriptRules(qualityLevel: string): Record<string, unknown> {
  const baseTSRules = getBaseTypeScriptRules();

  switch (qualityLevel) {
    case 'light':
      return {
        ...baseTSRules,
        ...getLightTypeScriptRules(),
      };

    case 'medium':
      return {
        ...baseTSRules,
        ...getMediumTypeScriptRules(),
      };

    case 'strict':
      return {
        ...baseTSRules,
        ...getStrictTypeScriptRules(),
      };

    default:
      return baseTSRules;
  }
}
