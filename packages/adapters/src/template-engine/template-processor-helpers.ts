/**
 * Template Processor Helper Functions
 *
 * Utility functions for template processing
 */

import type { TemplateContext } from './types.js';

export const DOUBLE_BRACE_LENGTH = 2;

/**
 * Evaluates a condition expression
 * @param condition - Condition string to evaluate
 * @param context - Context object containing variable values
 * @returns Boolean result of condition evaluation
 */
export function evaluateCondition(condition: string, context: TemplateContext): boolean {
  // Remove quotes and trim
  const cleanCondition = condition.replace(/["']/g, '').trim();

  // Handle boolean values
  if (cleanCondition === 'true') return true;
  if (cleanCondition === 'false') return false;

  // Handle empty/null checks
  if (cleanCondition === 'null' || cleanCondition === 'undefined') return false;

  // Get the value from context
  const value = getNestedValue(context, cleanCondition);

  // Check if value exists and is truthy
  return value != null && Boolean(value);
}

/**
 * Gets a nested value from an object using dot notation
 * @param obj - Object to get value from
 * @param path - Path to the value
 * @returns The value or undefined if not found
 */
export function getNestedValue(obj: TemplateContext, path: string): unknown {
  return path.split('.').reduce((current: unknown, key: string) => {
    return typeof current === 'object' && current !== null
      ? (current as Record<string, unknown>)[key]
      : undefined;
  }, obj);
}

/**
 * Check if a value represents null or undefined
 * @param value - String value to check
 * @returns True if value represents null/undefined
 */
function isNullOrUndefined(value: string): boolean {
  return value === 'null' || value === 'undefined';
}

/**
 * Check if a value represents a boolean
 * @param value - String value to check
 * @returns True if value represents a boolean
 */
function isBoolean(value: string): boolean {
  return value === 'true' || value === 'false';
}

/**
 * Parse boolean value
 * @param value - String value to parse
 * @returns Parsed boolean value
 */
function parseBoolean(value: string): boolean {
  return value === 'true';
}

/**
 * Check if value is a valid number
 * @param value - String value to check
 * @returns True if value is a valid number
 */
function isValidNumber(value: string): boolean {
  const num = Number(value);
  return !Number.isNaN(num);
}

/**
 * Check if value is a JSON structure
 * @param value - String value to check
 * @returns True if value is a JSON structure
 */
function isJsonStructure(value: string): boolean {
  return (
    (value.startsWith('[') && value.endsWith(']')) || (value.startsWith('{') && value.endsWith('}'))
  );
}

/**
 * Parses a value and converts it to the appropriate type
 * @param value - String value to parse
 * @returns Parsed value
 */
export function parseValue(value: string): unknown {
  // Handle null and undefined
  if (isNullOrUndefined(value)) {
    return value === 'null' ? null : undefined;
  }

  // Handle boolean values
  if (isBoolean(value)) {
    return parseBoolean(value);
  }

  // Handle numbers
  if (isValidNumber(value)) {
    return Number(value);
  }

  // Handle JSON arrays and objects
  if (isJsonStructure(value)) {
    try {
      return JSON.parse(value);
    } catch {
      // Return as string if JSON parsing fails
      return value;
    }
  }

  // Return as string
  return value;
}
