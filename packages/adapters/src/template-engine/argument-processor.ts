/**
 * Template Argument Processor
 *
 * Handles parsing and processing of template helper arguments
 */
import { REGEX_PATTERNS, NUMERIC_CONSTANTS } from '../utils/constants-new';
import type { TemplateContext } from './types.js';

/**
 * Processes helper arguments from argument string
 * @param {string} argsString - String containing arguments
 * @param {TemplateContext} context - Template context for variable resolution
 * @returns { unknown[]} Array of processed arguments
 */
export function processHelperArguments(argsString: string, context: TemplateContext): unknown[] {
  const argsStringTrimmed = argsString.trim();

  if (!argsStringTrimmed) {
    return [];
  }

  // Split by spaces, but handle quoted strings
  const matches = argsStringTrimmed.match(REGEX_PATTERNS.ARGUMENT_PARTS);
  if (!matches) {
    return [];
  }

  return matches
    .filter((part): part is string => typeof part === 'string' && part.length > 0)
    .map((part) => processHelperArgument(part, context));
}

/**
 * Processes a single helper argument
 * @param {string} part - Argument part to process
 * @param {TemplateContext} context - Template context for variable resolution
 * @returns { unknown} Processed argument
 */
export function processHelperArgument(part: string, context: TemplateContext): unknown {
  // Remove quotes if present
  if (isQuotedArgument(part)) {
    return part.slice(NUMERIC_CONSTANTS.QUOTE_SLICE_START, NUMERIC_CONSTANTS.QUOTE_SLICE_END);
  }

  // Check if it's a variable reference
  if (isVariableReference(part)) {
    const varName = part
      .slice(NUMERIC_CONSTANTS.VAR_SLICE_START, NUMERIC_CONSTANTS.VAR_SLICE_END)
      .trim();
    return varName ? getNestedValue(context, varName) : undefined;
  }

  // Check if it's a variable name (no quotes, no braces)
  if (REGEX_PATTERNS.VARIABLE_PATH.test(part) && part) {
    return getNestedValue(context, part);
  }

  // Return as string
  return part;
}

/**
 * Checks if argument is quoted
 * @param {string} part - Argument part to check
 * @returns {string): boolean} True if argument is quoted
 */
export function isQuotedArgument(part: string): boolean {
  return (
    (part.startsWith('"') && part.endsWith('"')) || (part.startsWith("'") && part.endsWith("'"))
  );
}

/**
 * Checks if argument is a variable reference
 * @param {string} part - Argument part to check
 * @returns {string): boolean} True if argument is a variable reference
 */
export function isVariableReference(part: string): boolean {
  return part.startsWith('{{') && part.endsWith('}}');
}

/**
 * Parses helper function arguments from a string
 * @param {unknown} argsString - String containing arguments to parse
 * @returns {Array<} Array of parsed arguments with their types
 */
export function parseHelperArguments(
  argsString: string
): Array<{ type: 'literal' | 'variable' | 'helper'; value: string }> {
  const tokens = tokenizeArguments(argsString);
  return tokens.map((token) => parseArgumentToken(token));
}

/**
 * Tokenizes argument string into individual tokens
 * @param {string} argsString - String containing arguments
 * @returns {string): string[]} Array of argument tokens
 */
export function tokenizeArguments(argsString: string): string[] {
  const { tokens, finalCurrent } = processArgumentCharacters(argsString);

  // Add final token if exists
  if (finalCurrent.trim()) {
    tokens.push(finalCurrent.trim());
  }

  return tokens;
}

/**
 * Processes characters in argument string
 * @param {string} argsString - String containing arguments
 * @returns {string):} Object with tokens and final current string
 */
export function processArgumentCharacters(argsString: string): {
  tokens: string[];
  finalCurrent: string;
} {
  const tokens: string[] = [];
  let current = '';
  let { inQuotes, quoteChar } = { inQuotes: false, quoteChar: '' };

  for (const char of argsString) {
    const newState = processArgumentChar(char, current, inQuotes, quoteChar);

    if (newState.tokenAdded) {
      tokens.push(newState.token);
    }

    current = newState.current;
    inQuotes = newState.inQuotes;
    quoteChar = newState.quoteChar;
  }

  return { tokens, finalCurrent: current };
}

/**
 * Processes a single character in argument tokenization
 * @param {unknown} char - Character to process
 * @param {unknown} current - Current token string
 * @param {unknown} inQuotes - Whether we're in quotes
 * @param {unknown} quoteChar - Current quote character
 * @returns {void} New processing state
 */
export function processArgumentChar(
  char: string,
  current: string,
  inQuotes: boolean,
  quoteChar: string
): { tokenAdded: boolean; token: string; current: string; inQuotes: boolean; quoteChar: string } {
  if (isQuoteStart(char, inQuotes)) {
    return { tokenAdded: false, token: '', current, inQuotes: true, quoteChar: char };
  }

  if (isQuoteEnd(char, quoteChar, inQuotes)) {
    return { tokenAdded: false, token: '', current, inQuotes: false, quoteChar: '' };
  }

  if (isArgumentSeparator(char, inQuotes) && current.trim()) {
    return { tokenAdded: true, token: current.trim(), current: '', inQuotes, quoteChar };
  }

  return { tokenAdded: false, token: '', current: current + char, inQuotes, quoteChar };
}

/**
 * Checks if character starts a quoted section
 * @param {string} char - Character to check
 * @param {boolean} inQuotes - Whether we're currently in quotes
 * @returns { boolean} True if character starts quotes
 */
export function isQuoteStart(char: string, inQuotes: boolean): boolean {
  return !inQuotes && (char === '"' || char === "'");
}

/**
 * Checks if character ends a quoted section
 * @param {string} char - Character to check
 * @param {string} quoteChar - Current quote character
 * @param {boolean} inQuotes - Whether we're currently in quotes
 * @returns { boolean} True if character ends quotes
 */
export function isQuoteEnd(char: string, quoteChar: string, inQuotes: boolean): boolean {
  return inQuotes && char === quoteChar;
}

/**
 * Checks if character separates arguments
 * @param {string} char - Character to check
 * @param {boolean} inQuotes - Whether we're currently in quotes
 * @returns { boolean} True if character separates arguments
 */
export function isArgumentSeparator(char: string, inQuotes: boolean): boolean {
  return !inQuotes && char === ' ';
}

/**
 * Parses a single argument token
 * @param {string} token - Token to parse
 * @returns {string):} Parsed argument object
 */
export function parseArgumentToken(token: string): {
  type: 'literal' | 'variable' | 'helper';
  value: string;
} {
  if (isVariableToken(token)) {
    const value = token
      .slice(NUMERIC_CONSTANTS.VAR_SLICE_START, NUMERIC_CONSTANTS.VAR_SLICE_END)
      .trim();
    return {
      type: 'variable',
      value: value || '',
    };
  }

  if (isQuotedLiteral(token)) {
    return {
      type: 'literal',
      value: token.slice(NUMERIC_CONSTANTS.QUOTE_SLICE_START, NUMERIC_CONSTANTS.QUOTE_SLICE_END),
    };
  }

  return { type: 'literal', value: token };
}

/**
 * Checks if token is a variable
 * @param {string} token - Token to check
 * @returns {string): boolean} True if token is a variable
 */
export function isVariableToken(token: string): boolean {
  return token.startsWith('{{') && token.endsWith('}}');
}

/**
 * Checks if token is a quoted literal
 * @param {string} token - Token to check
 * @returns {string): boolean} True if token is a quoted literal
 */
export function isQuotedLiteral(token: string): boolean {
  return token.startsWith('"') && token.endsWith('"');
}

/**
 * Gets a nested value from an object using dot notation
 * @param {unknown} obj - Object to get value from
 * @param {string} path - Dot-separated path to the value
 * @returns { unknown} The nested value or undefined if not found
 */
export function getNestedValue(obj: unknown, path: string): unknown {
  const parts = path.split('.');
  let current: unknown = obj;

  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = (current as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }

  return current;
}
