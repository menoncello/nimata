/**
 * ESLint Rules Constants
 *
 * Magic numbers and configuration values for ESLint rules generation
 */

export const ESLINT_RULES_CONSTANTS = {
  COMPLEXITY: {
    MAX: 10,
  },
  LINES: {
    MAX: 30,
  },
  STATEMENTS: {
    MAX: 15,
  },
  NESTING: {
    MAX: 4,
  },
  PARAMETERS: {
    MAX: 2,
  },
} as const;
