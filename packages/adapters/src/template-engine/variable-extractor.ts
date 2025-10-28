/**
 * Variable Extraction Utilities
 *
 * Extracted from variable-substitution.ts to reduce file length
 * Contains utilities for extracting variables from template content
 */

import type { ExtendedTemplateContext } from '@nimata/core';
import { VariableFormatter } from './variable-formatter.js';

/**
 * Constants for variable extraction
 */
const EXTRACTION_CONSTANTS = {
  MAX_PROPERTY_DEPTH: 3,
} as const;

/**
 * Configuration for variable substitution
 */
export interface SubstitutionConfig {
  context: ExtendedTemplateContext;
  getVariableValue: (path: string, context: ExtendedTemplateContext) => unknown;
  formatVariableValue: (value: unknown, variableName: string) => string;
  warnings: string[];
}

/**
 * Variable extraction utilities
 */
export class VariableExtractor {
  /**
   * Extracts variable names from template content
   * @param content - Template content to analyze
   * @returns Object containing used variables set and found variables array
   */
  static extractVariableNames(content: string): {
    usedVariables: Set<string>;
    foundVariables: string[];
  } {
    const usedVariables = new Set<string>();
    const foundVariables: string[] = [];
    // Pattern that matches simple variables but excludes Handlebars block helpers
    // Also exclude complex property access patterns like array indices and .length
    const variablePattern = /{{(?![#/])([^{}]+?)}}/g;
    let match;

    while ((match = variablePattern.exec(content)) !== null) {
      const variableName = match[1]?.trim();
      if (variableName && this.isSimpleVariable(variableName)) {
        foundVariables.push(variableName);
        usedVariables.add(variableName);
      }
    }

    return { usedVariables, foundVariables };
  }

  /**
   * Determines if a variable should be processed by substitution engine vs Handlebars
   * @param variableName - Variable name to check
   * @returns True if variable should be processed by substitution engine
   */
  private static isSimpleVariable(variableName: string): boolean {
    // Exclude Handlebars keywords and special variables
    if (['this', '@last', '@first', '@index', '@key'].includes(variableName)) {
      return false;
    }

    // Allow custom_variables.* property access (including deeply nested)
    if (variableName.startsWith('custom_variables.')) {
      // Exclude complex array access patterns
      return !variableName.includes('.length') && !/\.\d+/.test(variableName);
    }

    // Allow template_data.* property access (including deeply nested)
    if (variableName.startsWith('template_data.')) {
      // Exclude complex array access patterns
      return !variableName.includes('.length') && !/\.\d+/.test(variableName);
    }

    // Exclude complex property access (arrays, length property, nested access with more than MAX_PROPERTY_DEPTH dots)
    if (
      variableName.includes('.length') ||
      /\.\d+/.test(variableName) ||
      (variableName.match(/\./g) || []).length > EXTRACTION_CONSTANTS.MAX_PROPERTY_DEPTH
    ) {
      return false;
    }

    // Allow all other simple variables
    return !variableName.includes('.');
  }

  /**
   * Performs variable substitution in content
   * @param content - Template content
   * @param config - Configuration object containing all substitution parameters
   * @returns Content with substituted variables
   */
  static performSubstitution(content: string, config: SubstitutionConfig): string {
    // Pattern that matches simple variables but excludes Handlebars block helpers
    const variablePattern = /{{(?![#/])([^{}]+?)}}/g;

    return content.replace(variablePattern, (match, variableName) => {
      const trimmedName = variableName.trim();
      // Skip complex variables - let Handlebars handle them
      if (!this.isSimpleVariable(trimmedName)) {
        return match;
      }

      const value = config.getVariableValue(trimmedName, config.context);

      if (value === undefined || value === null) {
        config.warnings.push(`Variable '${trimmedName}' not found in context`);
        return '';
      }

      return VariableFormatter.formatVariableValue(value, trimmedName);
    });
  }
}
