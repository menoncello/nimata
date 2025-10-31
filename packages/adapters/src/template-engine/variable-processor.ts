/**
 * Variable Template Processor
 *
 * Handles variable replacement in templates
 */
import { NUMERIC_CONSTANTS } from '../utils/constants-new.js';
import { getNestedValue } from './argument-processor.js';
import type { TemplateContext } from './types.js';

// Constants for template processing
const DOUBLE_BRACE_LENGTH = 2;

/**
 * Find the next variable placeholder in template
 * @param {string} template - Template string to search
 * @param {number} startPos - Starting position for search
 * @returns {{ startIndex: number; endIndex: number; variableName: string } | null} Variable placeholder info or null
 */
function findNextVariable(
  template: string,
  startPos: number
): {
  startIndex: number;
  endIndex: number;
  path: string;
} | null {
  const startIndex = template.indexOf('{{', startPos);
  if (startIndex === -1) return null;

  const endIndex = template.indexOf('}}', startIndex);
  if (endIndex === -1) return null;

  const path = template.substring(startIndex + DOUBLE_BRACE_LENGTH, endIndex).trim();
  return { startIndex, endIndex, path };
}

/**
 * Replace a single variable with its value
 * @param {string} template - Template string
 * @param {{ startIndex: number; endIndex: number; path: string }} variableInfo - Variable information
 * @param {number} variableInfo.startIndex - Variable start position
 * @param {number} variableInfo.endIndex - Variable end position
 * @param {string} variableInfo.path - Variable path
 * @param {Record<string, unknown>} context - Template context
 * @returns {string} Replacement string
 */
function replaceSingleVariable(
  template: string,
  variableInfo: { startIndex: number; endIndex: number; path: string },
  context: TemplateContext
): string {
  const { startIndex, endIndex, path } = variableInfo;
  const value = path ? getNestedValue(context, path) : undefined;

  return value === null
    ? template.substring(startIndex, endIndex + DOUBLE_BRACE_LENGTH)
    : String(value);
}

/**
 * Replaces variable placeholders with their values
 * @param {string} template - Template string to process
 * @param {TemplateContext} context - Context object containing variable values
 * @returns { string} Template string with replaced variables
 */
export function replaceVariables(template: string, context: TemplateContext): string {
  let result = '';
  let pos = 0;

  while (pos < template.length) {
    const variableInfo = findNextVariable(template, pos);

    if (!variableInfo) {
      result += template.substring(pos);
      break;
    }

    const { startIndex, endIndex } = variableInfo;

    // Add content before the variable
    result += template.substring(pos, startIndex);

    // Replace the variable
    result += replaceSingleVariable(template, variableInfo, context);

    pos = endIndex + DOUBLE_BRACE_LENGTH;
  }

  return result;
}

/**
 * Parses a value and converts it to the appropriate type
 * @param {string} value - String value to parse
 * @param {TemplateContext} context - Template context for variable resolution
 * @returns { unknown} Parsed value
 */
export function parseValueWrapper(value: string, context: TemplateContext): unknown {
  // Handle quoted strings
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  // Handle numbers
  if (/^\d+$/.test(value)) {
    return Number.parseInt(value, NUMERIC_CONSTANTS.DECIMAL_RADIX);
  }

  // Handle variable references
  return getNestedValue(context, value);
}
