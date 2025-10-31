/**
 * Template Context Factory
 *
 * Creates and manages template contexts with type safety and validation
 */
import type {
  ProjectConfig,
  BaseTemplateContext,
  ExtendedTemplateContext,
  TemplateVariable,
  ValidationResult,
  TemplateContextFactory,
  ContextTransformers,
  VariableGetter,
  ProjectQualityLevel,
  ValidationRule,
} from '@nimata/core';
import { ContextTransformersImpl } from './context-transformers';
import { TemplateContextValidator } from './context-validator';
import { StringTransformersImpl } from './string-transformers';
import { ValidationUtils } from './validation-utils';
import { TemplateVariableGetter } from './variable-getter';

/**
 * Template context factory implementation
 */
export class TemplateContextFactoryImpl implements TemplateContextFactory {
  private transformers: ContextTransformers;
  private getters: Map<string, TemplateVariableGetter> = new Map();

  /**
   * Creates a new template context factory instance
   */
  constructor() {
    this.transformers = new ContextTransformersImpl();
  }

  /**
   * Creates base template context from project config
   * @param {ProjectConfig} config - Project configuration
   * @returns {ProjectConfig): BaseTemplateContext} Base template context
   */
  createBase(config: ProjectConfig): BaseTemplateContext {
    return this.transformers.fromProjectConfig(config);
  }

  /**
   * Creates extended template context
   * @param {unknown} config - Project configuration
   * @param {unknown} customData - Custom data to include
   * @returns {ExtendedTemplateContext} Extended template context
   */
  createExtended(
    config: ProjectConfig,
    customData?: Record<string, unknown>
  ): ExtendedTemplateContext {
    const base = this.createBase(config);
    const extended = this.transformers.extend(base);

    if (customData) {
      return this.transformers.applyCustomVariables(extended, customData);
    }

    return extended;
  }

  /**
   * Creates context with validation
   * @param {unknown} config - Project configuration
   * @param {unknown} variables - Variable definitions
   * @param {unknown} customData - Custom data to include
   * @returns {{ context: ExtendedTemplateContext; validation: ValidationResult }} Validated context and result
   */
  createValidated(
    config: ProjectConfig,
    variables: TemplateVariable[],
    customData?: Record<string, unknown>
  ): { context: ExtendedTemplateContext; validation: ValidationResult } {
    const context = this.createExtended(config, customData);
    const validation = this.validateContext(context, {
      variables: variables.map((v) => ({
        type: 'required' as const,
        message: `${v.name} is required`,
        validator: (value: unknown) => value !== undefined && value !== null,
      })),
    });

    return { context, validation };
  }

  /**
   * Creates a base template context from project configuration (legacy method)
   * @param {ProjectConfig} config - Project configuration
   * @returns {ProjectConfig): BaseTemplateContext} Base template context
   */
  createBaseContext(config: ProjectConfig): BaseTemplateContext {
    return this.createBase(config);
  }

  /**
   * Creates an extended template context with additional computed properties (legacy method)
   * @param {BaseTemplateContext} base - Base template context
   * @returns {BaseTemplateContext): ExtendedTemplateContext} Extended template context
   */
  createExtendedContext(base: BaseTemplateContext): ExtendedTemplateContext {
    return this.transformers.extend(base);
  }

  /**
   * Creates a full template context from project configuration (legacy method)
   * @param {ProjectConfig} config - Project configuration
   * @returns {ProjectConfig): ExtendedTemplateContext} Complete template context
   */
  createFullContext(config: ProjectConfig): ExtendedTemplateContext {
    return this.createExtended(config);
  }

  /**
   * Creates a template context with custom variables
   * @param {unknown} base - Base template context
   * @param {unknown} variables - Custom variables to include
   * @returns {ExtendedTemplateContext} Extended template context with custom variables
   */
  createContextWithVariables(
    base: BaseTemplateContext,
    variables: TemplateVariable[]
  ): ExtendedTemplateContext {
    const validation = TemplateContextValidator.validateVariables(variables);
    if (!validation.valid) {
      throw new Error(`Invalid variables: ${validation.errors.join(', ')}`);
    }

    const extended = this.transformers.extend(base);
    extended.custom_variables = {};

    for (const variable of variables) {
      if (variable.default !== undefined) {
        extended.custom_variables[variable.name] = variable.default;
      }
    }

    return extended;
  }

  /**
   * Gets a variable getter for a specific context
   * @param {string} contextId - Context identifier
   * @returns {string): VariableGetter} Variable getter instance
   */
  getVariableGetter(contextId: string): VariableGetter {
    let getter = this.getters.get(contextId);
    if (!getter) {
      getter = new TemplateVariableGetter();
      this.getters.set(contextId, getter);
    }
    return getter;
  }

  /**
   * Validates a template context
   * @param {unknown} context - Context to validate
   * @param {unknown} schema - Validation schema
   * @returns {ValidationResult} Validation result
   */
  validateContext(
    context: BaseTemplateContext,
    schema: Record<string, ValidationRule[]>
  ): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate depth
    const depthValidation = TemplateContextValidator.validateDepth(context);
    errors.push(...depthValidation.errors);
    warnings.push(...depthValidation.warnings);

    // Validate schema
    for (const [key, rules] of Object.entries(schema)) {
      const value = context[key as keyof BaseTemplateContext];

      for (const rule of rules) {
        const result = ValidationUtils.applyValidationRule(value, rule);
        if (result !== true) {
          errors.push(`${key}: ${result}`);
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Creates a quality-specific context configuration
   * @param {ProjectQualityLevel} qualityLevel - Project quality level
   * @returns {void} Quality-specific configuration
   */
  getQualityConfig(qualityLevel: ProjectQualityLevel): Record<string, unknown> {
    const baseConfig = this.createBaseQualityConfig(qualityLevel);

    switch (qualityLevel) {
      case 'light':
        return this.createLightQualityConfig(baseConfig);
      case 'medium':
        return this.createMediumQualityConfig(baseConfig);
      case 'high':
        return this.createHighQualityConfig(baseConfig);
      case 'strict':
        return this.createStrictQualityConfig(baseConfig);
      default:
        return baseConfig;
    }
  }

  /**
   * Creates base quality configuration
   * @param {ProjectQualityLevel} qualityLevel - Quality level
   * @returns {void} Base configuration
   */
  private createBaseQualityConfig(qualityLevel: ProjectQualityLevel): Record<string, unknown> {
    return {
      enable_strict_mode: qualityLevel === 'strict',
      enable_advanced_features: qualityLevel === 'high' || qualityLevel === 'strict',
      enable_comprehensive_tests: qualityLevel !== 'light',
      enable_documentation: qualityLevel === 'high' || qualityLevel === 'strict',
    };
  }

  /**
   * Creates light quality configuration
   * @param {Record<string} baseConfig - Base configuration
   * @returns {void} Light quality configuration
   */
  private createLightQualityConfig(baseConfig: Record<string, unknown>): Record<string, unknown> {
    return {
      ...baseConfig,
      eslint_rules: 'basic',
      test_coverage: 'minimal',
      documentation: 'api-only',
    };
  }

  /**
   * Creates medium quality configuration
   * @param {Record<string} baseConfig - Base configuration
   * @returns {void} Medium quality configuration
   */
  private createMediumQualityConfig(baseConfig: Record<string, unknown>): Record<string, unknown> {
    return {
      ...baseConfig,
      eslint_rules: 'recommended',
      test_coverage: 'standard',
      documentation: 'full',
    };
  }

  /**
   * Creates high quality configuration
   * @param {Record<string} baseConfig - Base configuration
   * @returns {void} High quality configuration
   */
  private createHighQualityConfig(baseConfig: Record<string, unknown>): Record<string, unknown> {
    return {
      ...baseConfig,
      eslint_rules: 'strict',
      test_coverage: 'comprehensive',
      documentation: 'complete',
      enable_mutation_testing: true,
      enable_performance_tests: true,
    };
  }

  /**
   * Creates strict quality configuration
   * @param {Record<string} baseConfig - Base configuration
   * @returns {void} Strict quality configuration
   */
  private createStrictQualityConfig(baseConfig: Record<string, unknown>): Record<string, unknown> {
    return {
      ...baseConfig,
      eslint_rules: 'extremely-strict',
      test_coverage: 'complete',
      documentation: 'exhaustive',
      enable_mutation_testing: true,
      enable_performance_tests: true,
      enable_security_tests: true,
      enable_contract_tests: true,
    };
  }

  /**
   * Gets string transformers
   * @returns {StringTransformers} String transformers instance
   */
  getStringTransformers(): StringTransformers {
    return StringTransformersImpl;
  }

  /**
   * Gets context transformers
   * @returns {ContextTransformers} Context transformers instance
   */
  getContextTransformers(): ContextTransformers {
    return this.transformers;
  }

  /**
   * Cleans up resources for a specific context
   * @param {string} contextId - Context identifier to clean up
   */
  cleanup(contextId: string): void {
    this.getters.delete(contextId);
  }

  /**
   * Cleans up all resources
   */
  cleanupAll(): void {
    this.getters.clear();
  }
}

/**
 * Factory instance for creating template contexts
 */
export const templateContextFactory = new TemplateContextFactoryImpl();

/**
 * Export type for backwards compatibility
 */
export type StringTransformers = typeof StringTransformersImpl;
