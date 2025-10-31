/**
 * Configurable Variable Substitution Engine
 *
 * Extends the base variable substitution engine with configuration options
 */
import type { ExtendedTemplateContext, TemplateVariable } from '@nimata/core';
import {
  VariableSubstitutionEngine,
  type VariableSubstitutionResult,
} from './variable-substitution.js';

/**
 * Variable substitution configuration
 */
export interface VariableSubstitutionConfig {
  /**
   * Whether to throw errors on missing variables
   */
  strictMode: boolean;

  /**
   * Whether to include warnings in results
   */
  includeWarnings: boolean;

  /**
   * Custom variable formatters
   */
  formatters: Record<string, (context: ExtendedTemplateContext) => string>;

  /**
   * Default value for missing variables
   */
  defaultMissingValue: string;
}

/**
 * Configurable variable substitution engine
 */
export class ConfigurableVariableSubstitutionEngine extends VariableSubstitutionEngine {
  private config: VariableSubstitutionConfig;

  /**
   * Creates a new configurable variable substitution engine with provided settings
   * @param {Partial<VariableSubstitutionConfig> = {}} config - Partial configuration object to customize behavior
   */
  constructor(config: Partial<VariableSubstitutionConfig> = {}) {
    super();
    this.config = {
      strictMode: false,
      includeWarnings: true,
      formatters: {},
      defaultMissingValue: '',
      ...config,
    };
  }

  /**
   * Substitutes variables in template content using configuration settings
   * @param {unknown} content - Template content with variable placeholders
   * @param {unknown} context - Template context containing variable values
   * @param {unknown} variables - Optional variable definitions for validation
   * @returns {VariableSubstitutionResult} Substitution result with applied configuration and validation
   */
  substituteWithConfig(
    content: string,
    context: ExtendedTemplateContext,
    variables?: TemplateVariable[]
  ): VariableSubstitutionResult {
    // Apply custom formatters first
    let processedContent = this.applyCustomFormatters(content, context);

    // Then handle missing variables with default value
    const substitutionWarnings: string[] = [];
    processedContent = this.handleMissingVariables(processedContent, context, substitutionWarnings);

    const result = super.substitute(processedContent, context, variables);
    this.validateStrictMode(result, substitutionWarnings);
    this.filterWarningsIfNeeded(result);

    return result;
  }

  /**
   * Applies custom formatters to the content
   * @param {string} content - Template content to process
   * @param {ExtendedTemplateContext} context - Template context containing variable values
   * @returns { string} Processed content with formatters applied
   */
  private applyCustomFormatters(content: string, context: ExtendedTemplateContext): string {
    let processedContent = content;
    for (const [formatterName, formatter] of Object.entries(this.config.formatters)) {
      const formatterResult = formatter(context);
      processedContent = processedContent.replace(
        new RegExp(`\\{\\{${formatterName}\\}\\}`, 'g'),
        formatterResult
      );
    }
    return processedContent;
  }

  /**
   * Handles missing variables in template content
   * @param {unknown} content - Template content to process
   * @param {unknown} context - Template context containing variable values
   * @param {unknown} warnings - Array to collect warning messages
   * @returns {string} Processed content with missing variables handled
   */
  private handleMissingVariables(
    content: string,
    context: ExtendedTemplateContext,
    warnings: string[]
  ): string {
    return content.replace(/{{([^{}]+?)}}/g, (match, variableName) => {
      const trimmedName = variableName.trim();
      const value = this.getVariableValue(trimmedName, context);

      if (value === undefined || value === null) {
        if (this.config.strictMode) {
          warnings.push(`Variable '${trimmedName}' not found in context`);
        }
        return this.config.defaultMissingValue;
      }

      return `{{${trimmedName}}}`; // Keep original for processing
    });
  }

  /**
   * Validates strict mode requirements and throws errors if needed
   * @param {unknown} result - Substitution result to validate
   * @param {unknown} substitutionWarnings - Warnings from substitution process
   */
  private validateStrictMode(
    result: VariableSubstitutionResult,
    substitutionWarnings: string[]
  ): void {
    if (this.config.strictMode) {
      const allIssues = [
        ...result.validation.errors,
        ...result.validation.warnings,
        ...substitutionWarnings,
      ];
      if (allIssues.length > 0) {
        throw new Error(`Variable substitution failed: ${allIssues.join(', ')}`);
      }
    }
  }

  /**
   * Filters warnings based on configuration settings
   * @param {VariableSubstitutionResult} result - Substitution result to filter warnings for
   */
  private filterWarningsIfNeeded(result: VariableSubstitutionResult): void {
    if (!this.config.includeWarnings && !this.config.strictMode) {
      result.validation.warnings = [];
    }
  }

  /**
   * Updates the engine configuration with new settings
   * @param {Partial<VariableSubstitutionConfig>} newConfig - Partial configuration object with settings to update
   */
  updateConfig(newConfig: Partial<VariableSubstitutionConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Gets a copy of the current configuration settings
   * @returns {VariableSubstitutionConfig} Copy of the current configuration object
   */
  getConfig(): VariableSubstitutionConfig {
    return { ...this.config };
  }
}
