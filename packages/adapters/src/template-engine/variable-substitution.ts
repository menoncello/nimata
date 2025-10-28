/**
 * Variable Substitution System
 *
 * Type-safe variable substitution with validation and complex type support
 */
import type { ExtendedTemplateContext, TemplateVariable, ValidationResult } from '@nimata/core';
import { StringTransformersImpl } from './string-transformers.js';
import { VariableExtractor } from './variable-extractor.js';
import { VariableFormatter } from './variable-formatter.js';
import { VariableGetterEnhanced } from './variable-getter-enhanced.js';
import { VariableSubstitutionStatic } from './variable-substitution-static.js';

/**
 * Variable substitution result
 */
export interface VariableSubstitutionResult {
  substitutedContent: string;
  usedVariables: string[];
  validation: ValidationResult;
}

/**
 * Variable substitution engine
 */
export class VariableSubstitutionEngine {
  /**
   * Substitutes variables in template content
   * @param content - Template content with variable placeholders
   * @param context - Template context
   * @param variables - Variable definitions for validation
   * @returns Substitution result with validation
   */
  substitute(
    content: string,
    context: ExtendedTemplateContext,
    variables?: TemplateVariable[]
  ): VariableSubstitutionResult {
    const { usedVariables, foundVariables } = VariableExtractor.extractVariableNames(content);
    const validation = this.performValidation(context, variables, foundVariables);
    const substitutionWarnings: string[] = [];
    const substitutedContent = VariableExtractor.performSubstitution(content, {
      context,
      getVariableValue: (path, ctx) => VariableGetterEnhanced.getVariableValue(path, ctx),
      formatVariableValue: (value, variableName) =>
        VariableFormatter.formatVariableValue(value, variableName),
      warnings: substitutionWarnings,
    });

    // Merge validation warnings with substitution warnings
    const allWarnings = [...validation.warnings, ...substitutionWarnings];

    return {
      substitutedContent,
      usedVariables: Array.from(usedVariables),
      validation: {
        valid: validation.valid,
        errors: validation.errors,
        warnings: allWarnings,
      },
    };
  }

  /**
   * Performs validation of variables against context
   * @param context - Template context
   * @param variables - Variable definitions for validation
   * @param foundVariables - Variables found in content
   * @returns Validation result with errors and warnings
   */
  private performValidation(
    context: ExtendedTemplateContext,
    variables: TemplateVariable[] | undefined,
    foundVariables: string[]
  ): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (variables) {
      const validation = this.validateVariables(context, variables, foundVariables);
      errors.push(...validation.errors);
      warnings.push(...validation.warnings);
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Validates variables against context
   * @param context - The template context containing variable values
   * @param variables - Array of expected template variables
   * @param foundVariables - Array of variables found in the template
   * @returns Validation result with errors and warnings
   */
  private validateVariables(
    context: ExtendedTemplateContext,
    variables: TemplateVariable[],
    foundVariables: string[]
  ): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    this.validateRequiredVariables(variables, foundVariables, warnings);
    this.validateVariableTypes(variables, foundVariables, context, warnings);
    this.validateVariableDefinitions(foundVariables, context, warnings);

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Validate that required variables are present in the template
   * @param variables - Expected template variables
   * @param foundVariables - Variables found in template
   * @param warnings - Array to collect warnings
   */
  private validateRequiredVariables(
    variables: TemplateVariable[],
    foundVariables: string[],
    warnings: string[]
  ): void {
    for (const variable of variables) {
      if (variable.required && !foundVariables.includes(variable.name)) {
        warnings.push(`Required variable '${variable.name}' not found in template`);
      }
    }
  }

  /**
   * Validate variable types against expected types
   * @param variables - Expected template variables
   * @param foundVariables - Variables found in template
   * @param context - Template context
   * @param warnings - Array to collect warnings
   */
  private validateVariableTypes(
    variables: TemplateVariable[],
    foundVariables: string[],
    context: ExtendedTemplateContext,
    warnings: string[]
  ): void {
    for (const variable of variables) {
      if (!foundVariables.includes(variable.name)) {
        continue;
      }

      const value = VariableGetterEnhanced.getVariableValue(variable.name, context);
      if (value === undefined || value === null) {
        continue;
      }

      const typeWarning = this.checkVariableType(variable, value);
      if (typeWarning) {
        warnings.push(typeWarning);
      }
    }
  }

  /**
   * Check the type of a variable against its expected type
   * @param variable - Variable definition with expected type
   * @param value - Actual value to check
   * @returns Type mismatch warning message or null if no mismatch
   */
  private checkVariableType(variable: TemplateVariable, value: unknown): string | null {
    const actualType = typeof value;
    const expectedType = variable.type;

    if (this.isArrayTypeMismatch(expectedType, value)) {
      return `Type mismatch: variable '${variable.name}' expected ${expectedType} but got ${actualType}`;
    }

    if (this.isObjectTypeMismatch(expectedType, value, actualType)) {
      return `Type mismatch: variable '${variable.name}' expected ${expectedType} but got ${actualType}`;
    }

    if (this.isPrimitiveTypeMismatch(expectedType, value, actualType)) {
      return `Type mismatch: variable '${variable.name}' expected ${expectedType} but got ${actualType}`;
    }

    return null;
  }

  /**
   * Check if there's an array type mismatch
   * @param expectedType - Expected type
   * @param value - Actual value
   * @returns True if array type mismatch
   */
  private isArrayTypeMismatch(expectedType: string, value: unknown): boolean {
    return expectedType === 'array' && !Array.isArray(value);
  }

  /**
   * Check if there's an object type mismatch
   * @param expectedType - Expected type
   * @param value - Actual value
   * @param actualType - Actual type of value
   * @returns True if object type mismatch
   */
  private isObjectTypeMismatch(expectedType: string, value: unknown, actualType: string): boolean {
    return expectedType === 'object' && (actualType !== 'object' || Array.isArray(value));
  }

  /**
   * Check if there's a primitive type mismatch
   * @param expectedType - Expected type
   * @param value - Actual value
   * @param actualType - Actual type of value
   * @returns True if primitive type mismatch
   */
  private isPrimitiveTypeMismatch(
    expectedType: string,
    value: unknown,
    actualType: string
  ): boolean {
    return expectedType !== 'array' && expectedType !== 'object' && actualType !== expectedType;
  }

  /**
   * Validate that all variables found in template are defined in context
   * @param foundVariables - Variables found in template
   * @param context - Template context
   * @param warnings - Array to collect warnings
   */
  private validateVariableDefinitions(
    foundVariables: string[],
    context: ExtendedTemplateContext,
    warnings: string[]
  ): void {
    for (const variableName of foundVariables) {
      const value = VariableGetterEnhanced.getVariableValue(variableName, context);
      if (value === undefined || value === null) {
        warnings.push(`Variable '${variableName}' is not defined in context`);
      }
    }
  }

  /**
   * Validates variable type and format against expected type
   * @param value - The value to validate
   * @param expectedType - The expected type for the variable
   * @param variableName - The name of the variable being validated
   * @returns Validation result with any type mismatch errors
   */
  static validateVariableValue(
    value: unknown,
    expectedType: string,
    variableName: string
  ): ValidationResult {
    return VariableSubstitutionStatic.validateVariableValue(value, expectedType, variableName);
  }

  /**
   * Processes complex variable types by adding metadata and validation
   * @param value - The value to process
   * @param variableName - The name of the variable being processed
   * @param expectedType - The expected type for the variable
   * @returns Object containing the processed value and validation result
   */
  static processComplexType(
    value: unknown,
    variableName: string,
    expectedType: string
  ): { processed: unknown; validation: ValidationResult } {
    return VariableSubstitutionStatic.processComplexType(value, variableName, expectedType);
  }

  /**
   * Extracts all variable placeholders from template content
   * @param content - The template content to extract variables from
   * @returns Array of variable names found in the content
   */
  static extractVariables(content: string): string[] {
    return VariableSubstitutionStatic.extractVariables(content);
  }

  /**
   * Validates the syntax of all variable placeholders in template content
   * @param content - The template content to validate variable syntax for
   * @returns Validation result with syntax errors and warnings
   */
  static validateVariableSyntax(content: string): ValidationResult {
    return VariableSubstitutionStatic.validateVariableSyntax(content);
  }

  /**
   * Gets variable value from context with support for complex paths
   * @param path - The variable path (e.g., "project.name" or "custom_variables.theme")
   * @param context - The template context containing variable values
   * @returns The variable value or undefined if not found
   */
  protected getVariableValue(path: string, context: ExtendedTemplateContext): unknown {
    return VariableGetterEnhanced.getVariableValue(path, context);
  }
}

/**
 * Re-export StringTransformersImpl as StringTransformers for backward compatibility
 */
export const StringTransformers = StringTransformersImpl;
