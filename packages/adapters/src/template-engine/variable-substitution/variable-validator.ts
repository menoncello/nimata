/**
 * Variable Validator for Variable Substitution
 */
import type { ExtendedTemplateContext, TemplateVariable, ValidationResult } from '@nimata/core';

/**
 * Variable validation utilities
 */
export class VariableValidator {
  /**
   * Validates variables against context
   * @param {unknown} context - The template context containing variable values
   * @param {unknown} variables - Array of expected template variables
   * @param {unknown} foundVariables - Array of variables found in the template
   * @returns {ValidationResult} Validation result with errors and warnings
   */
  static validateVariables(
    context: ExtendedTemplateContext,
    variables: TemplateVariable[],
    foundVariables: string[]
  ): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    this.checkMissingVariables(context, variables, foundVariables, errors);
    this.checkUnexpectedVariables(variables, foundVariables, warnings);
    this.checkVariableTypes(context, variables, errors, warnings);

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Checks for missing required variables
   * @param {unknown} context - Template context
   * @param {unknown} variables - Expected variables
   * @param {unknown} foundVariables - Found variables
   * @param {unknown} errors - Array to collect errors
   */
  private static checkMissingVariables(
    context: ExtendedTemplateContext,
    variables: TemplateVariable[],
    foundVariables: string[],
    errors: string[]
  ): void {
    for (const variable of variables) {
      if (variable.required && !foundVariables.includes(variable.name)) {
        errors.push(`Required variable '${variable.name}' is missing from template`);
      }
    }
  }

  /**
   * Checks for unexpected variables
   * @param {unknown} variables - Expected variables
   * @param {unknown} foundVariables - Found variables
   * @param {unknown} warnings - Array to collect warnings
   */
  private static checkUnexpectedVariables(
    variables: TemplateVariable[],
    foundVariables: string[],
    warnings: string[]
  ): void {
    const expectedNames = new Set(variables.map((v) => v.name));

    for (const foundVar of foundVariables) {
      if (!expectedNames.has(foundVar)) {
        warnings.push(`Unexpected variable '${foundVar}' found in template`);
      }
    }
  }

  /**
   * Checks variable types
   * @param {unknown} context - Template context
   * @param {unknown} variables - Expected variables
   * @param {unknown} errors - Array to collect errors
   * @param {unknown} _warnings - Array to collect warnings (unused)
   */
  private static checkVariableTypes(
    context: ExtendedTemplateContext,
    variables: TemplateVariable[],
    errors: string[],
    _warnings: string[]
  ): void {
    for (const variable of variables) {
      const value = this.getVariableValue(variable.name, context);

      if (value !== undefined && !this.isValidType(value, variable.type)) {
        errors.push(
          `Variable '${variable.name}' has invalid type. Expected ${variable.type}, got ${typeof value}`
        );
      }
    }
  }

  /**
   * Gets variable value from context
   * @param {string} variableName - Name of the variable
   * @param {ExtendedTemplateContext} context - Template context
   * @returns { unknown} Variable value or undefined
   */
  private static getVariableValue(variableName: string, context: ExtendedTemplateContext): unknown {
    const keys = variableName.split('.');
    let value: unknown = context;

    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = (value as Record<string, unknown>)[key];
      } else {
        return undefined;
      }
    }

    return value;
  }

  /**
   * Checks if value matches expected type
   * @param {unknown} value - Value to check
   * @param {string} expectedType - Expected type
   * @returns { boolean} True if type matches
   */
  private static isValidType(value: unknown, expectedType: string): boolean {
    switch (expectedType) {
      case 'string':
        return typeof value === 'string';
      case 'number':
        return typeof value === 'number';
      case 'boolean':
        return typeof value === 'boolean';
      case 'array':
        return Array.isArray(value);
      case 'object':
        return typeof value === 'object' && value !== null && !Array.isArray(value);
      default:
        return true; // Unknown type, assume valid
    }
  }
}
