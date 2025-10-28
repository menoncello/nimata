/**
 * Template Context Validator
 *
 * Provides validation utilities for template contexts and variables
 */
import type { TemplateVariable, ValidationResult } from '@nimata/core';

/**
 * Constants for template context validation and management
 */
const TEMPLATE_CONTEXT_CONSTANTS = {
  MAX_NESTED_DEPTH: 10,
  STRING_CASE_PATTERN: /^[\w.\-]+$/,
} as const;

/**
 * Reserved words for variable validation
 */
const RESERVED_WORDS = new Set([
  'abstract',
  'boolean',
  'break',
  'byte',
  'case',
  'catch',
  'char',
  'class',
  'const',
  'continue',
  'debugger',
  'default',
  'delete',
  'do',
  'double',
  'else',
  'enum',
  'export',
  'extends',
  'false',
  'final',
  'finally',
  'float',
  'for',
  'function',
  'goto',
  'if',
  'implements',
  'import',
  'in',
  'instanceof',
  'int',
  'interface',
  'long',
  'native',
  'new',
  'null',
  'package',
  'private',
  'protected',
  'public',
  'return',
  'short',
  'static',
  'super',
  'switch',
  'synchronized',
  'this',
  'throw',
  'throws',
  'transient',
  'true',
  'try',
  'typeof',
  'var',
  'void',
  'volatile',
  'while',
  'with',
  'yield',
  'let',
  'async',
  'await',
]);

/**
 * Template context validator implementation
 */
export class TemplateContextValidator {
  /**
   * Validates template context variables
   * @param variables - Variables to validate
   * @returns Validation result
   */
  static validateVariables(variables: TemplateVariable[]): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    for (const variable of variables) {
      this.validateVariableName(variable, errors);
      this.validateReservedWords(variable, warnings);
      this.validateRequiredValue(variable, errors);
      this.validateVariableType(variable, errors);
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Validates variable name format
   * @param variable - Variable to validate
   * @param errors - Array to collect errors
   */
  private static validateVariableName(variable: TemplateVariable, errors: string[]): void {
    if (!TEMPLATE_CONTEXT_CONSTANTS.STRING_CASE_PATTERN.test(variable.name)) {
      errors.push(`Invalid variable name format: ${variable.name}`);
    }
  }

  /**
   * Validates variable name against reserved words
   * @param variable - Variable to validate
   * @param warnings - Array to collect warnings
   */
  private static validateReservedWords(variable: TemplateVariable, warnings: string[]): void {
    if (RESERVED_WORDS.has(variable.name.toLowerCase())) {
      warnings.push(`Variable name '${variable.name}' is a reserved word`);
    }
  }

  /**
   * Validates required variable has a value
   * @param variable - Variable to validate
   * @param errors - Array to collect errors
   */
  private static validateRequiredValue(variable: TemplateVariable, errors: string[]): void {
    if (
      variable.required &&
      (variable.default === undefined || variable.default === null || variable.default === '')
    ) {
      errors.push(`Required variable '${variable.name}' is missing or empty`);
    }
  }

  /**
   * Validates variable type matches default value
   * @param variable - Variable to validate
   * @param errors - Array to collect errors
   */
  private static validateVariableType(variable: TemplateVariable, errors: string[]): void {
    if (
      variable.type &&
      variable.default !== undefined &&
      !this.validateType(variable.default, variable.type)
    ) {
      errors.push(
        `Variable '${variable.name}' has invalid type. Expected ${variable.type}, got ${typeof variable.default}`
      );
    }
  }

  /**
   * Validates context depth
   * @param context - Context to validate
   * @param maxDepth - Maximum allowed depth
   * @returns Validation result
   */
  static validateDepth(
    context: unknown,
    maxDepth = TEMPLATE_CONTEXT_CONSTANTS.MAX_NESTED_DEPTH
  ): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    const depth = this.calculateDepth(context);
    if (depth > maxDepth) {
      errors.push(`Context depth (${depth}) exceeds maximum allowed depth (${maxDepth})`);
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Calculates the maximum depth of an object
   * @param obj - Object to analyze
   * @param currentDepth - Current depth (for recursion)
   * @returns Maximum depth
   */
  private static calculateDepth(obj: unknown, currentDepth = 0): number {
    if (typeof obj !== 'object' || obj === null) {
      return currentDepth;
    }

    if (currentDepth > TEMPLATE_CONTEXT_CONSTANTS.MAX_NESTED_DEPTH) {
      return currentDepth;
    }

    let maxDepth = currentDepth;
    for (const value of Object.values(obj as Record<string, unknown>)) {
      const depth = this.calculateDepth(value, currentDepth + 1);
      maxDepth = Math.max(maxDepth, depth);
    }

    return maxDepth;
  }

  /**
   * Validates type of a value
   * @param value - Value to validate
   * @param expectedType - Expected type
   * @returns True if type is valid
   */
  private static validateType(value: unknown, expectedType: string): boolean {
    switch (expectedType) {
      case 'string':
        return typeof value === 'string';
      case 'number':
        return typeof value === 'number' && !Number.isNaN(value);
      case 'boolean':
        return typeof value === 'boolean';
      case 'array':
        return Array.isArray(value);
      case 'object':
        return typeof value === 'object' && value !== null && !Array.isArray(value);
      default:
        return typeof value === expectedType;
    }
  }
}
