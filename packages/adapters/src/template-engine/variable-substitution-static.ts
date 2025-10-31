/**
 * Static Variable Substitution Methods
 *
 * Extracted from variable-substitution.ts to reduce file length
 * Contains static methods for variable processing and validation
 */
import type { ValidationResult } from '@nimata/core';

/**
 * Static variable substitution utility methods
 */
export class VariableSubstitutionStatic {
  /**
   * Validates variable type and format against expected type
   * @param {unknown} value - The value to validate
   * @param {unknown} expectedType - The expected type for the variable
   * @param {unknown} variableName - The name of the variable being validated
   * @returns {ValidationResult} Validation result with any type mismatch errors
   */
  static validateVariableValue(
    value: unknown,
    expectedType: string,
    variableName: string
  ): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    const actualType = Array.isArray(value) ? 'array' : typeof value;

    if (
      actualType !== expectedType &&
      expectedType !== 'select' &&
      expectedType !== 'multiselect'
    ) {
      errors.push(
        `Variable '${variableName}' should be of type '${expectedType}', got '${actualType}'`
      );
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Processes complex variable types by adding metadata and validation
   * @param {unknown} value - The value to process
   * @param {string} variableName - The name of the variable being processed
   * @param {string} expectedType - The expected type for the variable
   * @returns {{ value: unknown; isValid: boolean; errors: string[] }} Object containing the processed value and validation result
   */
  static processComplexType(
    value: unknown,
    variableName: string,
    expectedType: string
  ): { processed: unknown; validation: ValidationResult } {
    const validation = this.validateVariableValue(value, expectedType, variableName);
    const processed = this.applyComplexTypeProcessing(value, expectedType);

    return { processed, validation };
  }

  /**
   * Applies type-specific processing to complex values
   * @param {unknown} value - The value to process
   * @param {string} expectedType - The expected type for processing
   * @returns { unknown} Processed value with added metadata
   */
  private static applyComplexTypeProcessing(value: unknown, expectedType: string): unknown {
    if (expectedType === 'array' && Array.isArray(value)) {
      return this.processArrayWithMetadata(value);
    }

    if (this.isPlainObject(value) && expectedType === 'object') {
      return this.processObjectWithMetadata(value);
    }

    return value;
  }

  /**
   * Processes array values by adding metadata to each item
   * @param {unknown[]} value - Array value to process
   * @returns {unknown[]): unknown[]} Array with metadata added to each item
   */
  private static processArrayWithMetadata(value: unknown[]): unknown[] {
    return value.map((item, index) => {
      if (typeof item === 'object' && item !== null) {
        return {
          ...item,
          _index: index,
          _isFirst: index === 0,
          _isLast: index === value.length - 1,
        };
      }
      // Add metadata to primitive values too
      return {
        value: item,
        _index: index,
        _isFirst: index === 0,
        _isLast: index === value.length - 1,
      };
    });
  }

  /**
   * Processes object values by adding metadata
   * @param {unknown} value - Object value to process
   * @returns {unknown): unknown} Object with added metadata
   */
  private static processObjectWithMetadata(value: unknown): unknown {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
      return value;
    }

    const keys = Object.keys(value);
    return {
      ...value,
      _keys: keys,
      _size: keys.length,
      _isEmpty: keys.length === 0,
    };
  }

  /**
   * Checks if value is a plain object (not array, not null)
   * @param {unknown} value - Value to check
   * @returns {unknown): boolean} True if value is a plain object
   */
  private static isPlainObject(value: unknown): boolean {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }

  /**
   * Extracts all variable placeholders from template content
   * @param {string} content - The template content to extract variables from
   * @returns {string): string[]} Array of variable names found in the content
   */
  static extractVariables(content: string): string[] {
    const variablePattern = /{{([^{}]+?)}}/g;
    const variables = new Set<string>();
    let match;

    while ((match = variablePattern.exec(content)) !== null) {
      const variableName = match[1]?.trim();
      if (variableName) {
        variables.add(variableName);
      }
    }

    return Array.from(variables);
  }

  /**
   * Validates the syntax of all variable placeholders in template content
   * @param {string} content - The template content to validate variable syntax for
   * @returns {string): ValidationResult} Validation result with syntax errors and warnings
   */
  static validateVariableSyntax(content: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const variablePattern = /{{([^{}]+?)}}/g;
    let match;

    while ((match = variablePattern.exec(content)) !== null) {
      const variableName = match[1]?.trim();

      if (!variableName) {
        errors.push('Empty variable found in template');
        continue;
      }

      // Check for valid variable names
      if (!/^[A-Z_a-z]\w*(?:\.[A-Z_a-z]\w*)*$/.test(variableName)) {
        errors.push(`Invalid variable name syntax: '${variableName}'`);
      }

      // Warn about variables that might be functions
      if (variableName.endsWith('()')) {
        warnings.push(`Variable '${variableName}' looks like a function call`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }
}
