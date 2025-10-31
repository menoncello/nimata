/**
 * Variable Formatting Utilities
 *
 * Extracted from variable-substitution.ts to reduce file length
 * Contains utilities for formatting variable values for substitution
 */

/**
 * Variable formatting utilities
 */
export class VariableFormatter {
  /**
   * Formats variable value for substitution
   * @param {unknown} value - The variable value to format
   * @param {string} variableName - The name of the variable being formatted
   * @returns {string} The formatted string value
   */
  static formatVariableValue(value: unknown, variableName: string): string {
    // Handle null and undefined
    if (value === null || value === undefined) {
      return '';
    }

    // Handle primitive types
    if (this.isPrimitiveType(value)) {
      return this.formatPrimitiveType(value);
    }

    // Handle Date objects
    if (value instanceof Date) {
      return value.toISOString();
    }

    // Handle arrays
    if (Array.isArray(value)) {
      return this.formatArrayValue(value, variableName);
    }

    // Handle objects
    if (typeof value === 'object') {
      return this.formatObjectValue(value);
    }

    // Handle functions (shouldn't happen, but just in case)
    if (typeof value === 'function') {
      return '[Function]';
    }

    // Fallback
    return String(value);
  }

  /**
   * Checks if value is a primitive type (excluding null/undefined)
   * @param {unknown} value - Value to check
   * @returns {boolean} True if value is a primitive type
   */
  private static isPrimitiveType(value: unknown): boolean {
    return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean';
  }

  /**
   * Formats primitive type values
   * @param {unknown} value - Primitive value to format
   * @returns {string} Formatted string representation
   */
  private static formatPrimitiveType(value: unknown): string {
    if (typeof value === 'string') {
      return value;
    }
    return String(value);
  }

  /**
   * Formats array values by recursively formatting items
   * @param {unknown[]} value - Array value to format
   * @param {string} variableName - Name of the variable for recursion
   * @returns {string} Formatted string representation of array
   */
  private static formatArrayValue(value: unknown[], variableName: string): string {
    return value.map((item) => this.formatVariableValue(item, variableName)).join(', ');
  }

  /**
   * Formats object values as JSON
   * @param {unknown} value - Object value to format
   * @returns {string} Formatted string representation of object
   */
  private static formatObjectValue(value: unknown): string {
    const JSON_SPACING = 2;
    try {
      return JSON.stringify(value, null, JSON_SPACING);
    } catch {
      return '[Object]';
    }
  }
}
