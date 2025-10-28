/**
 * Enhanced Variable Getter
 *
 * Extracted from variable-substitution.ts to reduce file length
 * Contains enhanced variable getter with support for complex paths
 */
import type { ExtendedTemplateContext } from '@nimata/core';
import { TemplateVariableGetter } from './variable-getter.js';

/**
 * Enhanced variable getter with support for complex paths
 */
export class VariableGetterEnhanced extends TemplateVariableGetter {
  /**
   * Gets variable value from context with support for complex paths
   * @param path - The variable path (e.g., "project.name" or "custom_variables.theme")
   * @param context - The template context containing variable values
   * @returns The variable value or undefined if not found
   */
  static getVariableValue(path: string, context: ExtendedTemplateContext): unknown {
    // Check if it's a nested path (e.g., "project.name" or "custom_variables.theme")
    if (path.includes('.')) {
      const getter = new TemplateVariableGetter();
      return getter.getNested(path, context);
    }

    // Check if it's a direct property
    if (path in context) {
      return context[path as keyof ExtendedTemplateContext];
    }

    // Check custom variables
    if (path.startsWith('custom_variables.')) {
      const customVarName = path.replace('custom_variables.', '');
      return context.custom_variables[customVarName];
    }

    // Check template data
    if (path.startsWith('template_data.')) {
      const templateVarName = path.replace('template_data.', '');
      return context.template_data[templateVarName];
    }

    return undefined;
  }
}
