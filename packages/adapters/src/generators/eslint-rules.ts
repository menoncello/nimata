/**
 * ESLint Rules Configuration
 *
 * Contains rule definitions for different quality levels
 */

import { ESLINT_RULES_CONSTANTS } from './eslint-rules-constants.js';

// Base rules that apply to all quality levels
/**
 * Gets base ESLint rules that apply to all quality levels
 * @returns Base ESLint rules configuration
 */
export function getBaseQualityRules(): Record<string, unknown> {
  return {
    // Best practices
    'no-console': 'warn',
    'no-debugger': 'error',
    'no-alert': 'error',
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error',
    'no-script-url': 'error',
    'no-void': 'error',
    'no-with': 'error',

    // Code style
    indent: ['error', ESLINT_RULES_CONSTANTS.PARAMETERS.MAX],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    'comma-dangle': ['error', 'always-multiline'],
    'eol-last': ['error', 'always'],
    'no-trailing-spaces': 'error',

    // ES6+
    'arrow-spacing': 'error',
    'no-var': 'error',
    'prefer-const': 'error',
    'prefer-arrow-callback': 'error',
  };
}

// Light quality rules (minimal requirements)
/**
 * Gets light quality ESLint rules with minimal requirements
 * @param baseRules - Base rules to extend
 * @returns Light quality ESLint rules configuration
 */
export function getLightQualityRules(baseRules: Record<string, unknown>): Record<string, unknown> {
  return {
    ...baseRules,
    // Basic error prevention
    'no-unused-vars': 'warn',
    'no-undef': 'error',
    'no-unreachable': 'error',
    'no-constant-condition': 'warn',
  };
}

// Medium quality rules (standard requirements)
/**
 * Gets medium quality ESLint rules with standard requirements
 * @param baseRules - Base rules to extend
 * @returns Medium quality ESLint rules configuration
 */
export function getMediumQualityRules(baseRules: Record<string, unknown>): Record<string, unknown> {
  return {
    ...baseRules,
    // Stricter rules
    'no-unused-vars': 'error',
    'no-console': 'warn',
    'prefer-const': 'error',
    'no-var': 'error',
    // Security
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error',
  };
}

// Strict quality rules (maximum quality requirements)
/**
 * Gets strict quality ESLint rules with comprehensive requirements
 * @param baseRules - Base rules to extend
 * @returns Strict quality ESLint rules configuration
 */
export function getStrictQualityRules(baseRules: Record<string, unknown>): Record<string, unknown> {
  return {
    ...baseRules,
    // Very strict rules
    'no-unused-vars': 'error',
    'no-console': 'error',
    'prefer-const': 'error',
    'no-var': 'error',
    // Additional strict rules
    complexity: ['error', ESLINT_RULES_CONSTANTS.COMPLEXITY.MAX],
    'max-lines-per-function': ['error', ESLINT_RULES_CONSTANTS.LINES.MAX],
    'max-statements': ['error', ESLINT_RULES_CONSTANTS.STATEMENTS.MAX],
    'max-depth': ['error', ESLINT_RULES_CONSTANTS.NESTING.MAX],
  };
}

/**
 * Gets quality-based ESLint rules for the specified quality level
 * @param qualityLevel - The quality level ('light', 'medium', or 'strict')
 * @returns Quality-based ESLint rules configuration
 */
export function getQualityRules(qualityLevel: string): Record<string, unknown> {
  const baseRules = getBaseQualityRules();

  switch (qualityLevel) {
    case 'light':
      return getLightQualityRules(baseRules);
    case 'medium':
      return getMediumQualityRules(baseRules);
    case 'strict':
      return getStrictQualityRules(baseRules);
    default:
      return baseRules;
  }
}
