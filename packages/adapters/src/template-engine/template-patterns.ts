/**
 * Template Processing Patterns
 *
 * Regex patterns used in template processing
 */

export const REGEX_PATTERNS = {
  // Using a simpler regex pattern to avoid potential ReDoS attacks
  SIMPLE_VAR: /{{([^{}]+)}}/g,
} as const;

export const DOUBLE_BRACE_LENGTH = 2;
