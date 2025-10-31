/**
 * Variable Formatter for Variable Substitution
 */

/**
 * Variable formatter utilities
 */
export class VariableFormatter {
  /**
   * Formats variable value for substitution
   * @param {unknown} value - The value to format
   * @param {string} _variableName - Name of the variable (unused)
   * @returns { string} Formatted string value
   */
  static formatVariableValue(value: unknown, _variableName: string): string {
    if (value === null || value === undefined) {
      return '';
    }

    // Handle different value types
    if (typeof value === 'string') {
      return value;
    }

    if (typeof value === 'number') {
      return this.formatNumber(value);
    }

    if (typeof value === 'boolean') {
      return value.toString();
    }

    if (Array.isArray(value)) {
      return this.formatArray(value);
    }

    if (typeof value === 'object' && value !== null) {
      return this.formatObject(value as Record<string, unknown>);
    }

    return String(value);
  }

  /**
   * Formats a number value
   * @param {number} value - The number to format
   * @returns {number): string} Formatted number string
   */
  private static formatNumber(value: number): string {
    // Handle special number values
    if (!Number.isFinite(value)) {
      return '0';
    }

    return value.toString();
  }

  /**
   * Formats an array value
   * @param {unknown[]} value - The array to format
   * @returns {unknown[]): string} Formatted array string
   */
  private static formatArray(value: unknown[]): string {
    return value.map((item) => this.formatVariableValue(item, '')).join(', ');
  }

  /**
   * Formats an object value
   * @param {Record<string} value - The object to format
   * @returns {string} Formatted object string
   */
  private static formatObject(value: Record<string, unknown>): string {
    try {
      return JSON.stringify(value, null, 0);
    } catch {
      return '[Object]';
    }
  }

  /**
   * Processes complex type values
   * @param {unknown} value - The complex value to process
   * @param {string} variableName - Name of the variable
   * @returns { string} Processed string value
   */
  static processComplexType(value: unknown, variableName: string): string {
    if (value === null || value === undefined) {
      return '';
    }

    if (typeof value === 'object' && value !== null) {
      if (Array.isArray(value)) {
        return this.formatArray(value);
      }

      if (value instanceof Date) {
        return value.toISOString();
      }

      if (typeof value === 'function') {
        return '[Function]';
      }

      return this.formatObject(value as Record<string, unknown>);
    }

    return this.formatVariableValue(value, variableName);
  }
}
