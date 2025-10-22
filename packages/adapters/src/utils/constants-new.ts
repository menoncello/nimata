/**
 * Common constants used across the adapters package
 */

// Project name validation constants
export const PROJECT_NAME_CONSTRAINTS = {
  MIN_LENGTH: 2,
  MAX_LENGTH: 50,
  TRUNCATED_LENGTH: 47,
} as const;

// Regular expressions - extremely simplified to eliminate ReDoS vulnerabilities
export const REGEX_PATTERNS = {
  PROJECT_NAME: /^[a-z][\da-z-]*$/,
  START_WITH_LETTER: /^[a-z]/,
  VARIABLE_REFERENCE: /^{{[^}]*$/,
  HELPER_SYNTAX: /^{{helper:[a-z]*}}$/gi,
  HELPER_CALL: /^{{helper:[a-z]*}}$/gi,
  // Ultra-simple patterns to completely avoid backtracking
  CONDITIONAL_BLOCK: /^{{#if/gi,
  LOOP_BLOCK: /^{{#each/gi,
  SIMPLE_VAR: /{{([^{}]+)}}/g,
  QUOTED_STRING: /^["'][^"']*["']$/,
  BOOL_EXPRESSION: /^[\w.@]+\s*==\s*\S+(?:\s+\S+)*$/i,
  HELPER_CONDITION: /^\(.+\)$/,
  VARIABLE_PATH: /^[\w.@]+$/,
  ARGUMENT_PARTS: /\S+/g,
  ESCAPE_REGEX: /[$()*+.?[\\\]^{|}]/g,
} as const;

/**
 * Safe regex patterns with atomic grouping to prevent ReDoS attacks
 * These patterns are optimized for performance and security
 */
export const SAFE_REGEX_PATTERNS = {
  // Ultra-safe patterns - eliminates all potential ReDoS vectors
  VARIABLE_REFERENCE_ATOMIC: /^{{[^}]*$/,
  HELPER_SYNTAX_SAFE: /^{{helper:[a-z]*}}$/gi,
  HELPER_CALL_SAFE: /^{{helper:[a-z]*}}$/gi,
  CONDITIONAL_BLOCK_SAFE: /^{{#if/gi,
  LOOP_BLOCK_SAFE: /^{{#each/gi,
} as const;

// Helper strings
export const HELPER_STRINGS = {
  PROJECT_PREFIX: 'project-',
  DEFAULT_PROJECT: 'project',
  ELLIPSIS: '...',
  EMPTY_STRING: '',
  HYPHEN: '-',
  DOT: '.',
  COMMA_SPACE: ', ',
  DEFAULT_AI_ASSISTANT: 'claude-code',
} as const;

// Numeric constants
export const NUMERIC_CONSTANTS = {
  QUOTE_SLICE_START: 1,
  QUOTE_SLICE_END: -2,
  VAR_SLICE_START: 2,
  VAR_SLICE_END: -2,
  DECIMAL_RADIX: 10,
} as const;
