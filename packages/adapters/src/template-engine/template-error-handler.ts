/**
 * Template Error Handler
 *
 * Comprehensive error handling for malformed templates and validation failures
 */
import type {
  TemplateMetadata,
  TemplateValidationResult,
  TemplateValidationError,
  TemplateValidationWarning,
} from '@nimata/core';
import {
  handleLoadingError,
  handleParsingError,
  handleRenderingError,
} from './error-handler/error-handlers.js';
import { determineRecoveryStrategy } from './error-handler/recovery-strategies.js';
import {
  ErrorSeverity,
  type TemplateError,
  type ErrorRecoveryStrategy,
} from './error-handler/types.js';
import {
  createJsonSyntaxRule,
  createHandlebarsSyntaxRule,
  createStructureRule,
  createContentRule,
  createDependencyRule,
  createPerformanceRule,
  createSecurityRule,
  createCompatibilityRule,
} from './error-handler/validation-rules.js';

/**
 * Template error handler
 */
export class TemplateErrorHandler {
  private static readonly ERROR_RULES = new Map<
    string,
    (content: string, metadata?: TemplateMetadata) => TemplateError[]
  >();
  private static initialized = false;

  /**
   * Initialize error handling rules
   */
  static initialize(): void {
    if (this.initialized) {
      return;
    }

    this.registerSyntaxRules();
    this.registerStructureRules();
    this.registerContentRules();
    this.registerDependencyRules();
    this.registerPerformanceRules();
    this.registerSecurityRules();
    this.registerCompatibilityRules();

    this.initialized = true;
  }

  /**
   * Validate template and return enhanced errors
   * @param {string} content - Template content to validate
   * @param {TemplateMetadata | undefined} metadata - Optional template metadata
   * @returns {{ valid: boolean; errors: TemplateError[]; warnings: TemplateError[]; recovery: ErrorRecoveryStrategy; }} Enhanced validation result with detailed errors
   */
  static validateTemplate(
    content: string,
    metadata?: TemplateMetadata
  ): {
    valid: boolean;
    errors: TemplateError[];
    warnings: TemplateError[];
    recovery: ErrorRecoveryStrategy;
  } {
    this.initialize();

    const { errors, warnings } = this.runValidationRules(content, metadata);
    const recovery = determineRecoveryStrategy(errors, content);

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      recovery,
    };
  }

  /**
   * Run all validation rules and collect errors
   * @param {string} content - Template content to validate
   * @param {TemplateMetadata | undefined} metadata - Optional template metadata
   * @returns {{ errors: TemplateError[]; warnings: TemplateError[]; }} Collected errors and warnings
   */
  private static runValidationRules(
    content: string,
    metadata?: TemplateMetadata
  ): { errors: TemplateError[]; warnings: TemplateError[] } {
    const allErrors: TemplateError[] = [];
    const warnings: TemplateError[] = [];

    // Run all validation rules
    for (const [, ruleFn] of this.ERROR_RULES.entries()) {
      try {
        const ruleErrors = ruleFn(content, metadata);
        this.categorizeErrors(ruleErrors, allErrors, warnings);
      } catch {
        // Validation rule failed, continuing with other rules
      }
    }

    return { errors: allErrors, warnings };
  }

  /**
   * Categorize errors into errors and warnings
   * @param {unknown} ruleErrors - Errors from a rule
   * @param {unknown} allErrors - Array to collect errors
   * @param {unknown} warnings - Array to collect warnings
   */
  private static categorizeErrors(
    ruleErrors: TemplateError[],
    allErrors: TemplateError[],
    warnings: TemplateError[]
  ): void {
    for (const error of ruleErrors) {
      if (error.severity === ErrorSeverity.CRITICAL || error.severity === ErrorSeverity.ERROR) {
        allErrors.push(error);
      } else {
        warnings.push(error);
      }
    }
  }

  /**
   * Handle template loading errors
   * @param {string} filePath - Path to the template file
   * @param {Error} error - Original error that occurred
   * @returns { TemplateError} Enhanced template error with context
   */
  static handleLoadingError(filePath: string, error: Error): TemplateError {
    return handleLoadingError(filePath, error);
  }

  /**
   * Handle template parsing errors
   * @param {string} content - Template content that failed to parse
   * @param {Error} error - Original parsing error
   * @param {unknown} filePath - Optional file path where error occurred
   * @returns { TemplateError} Enhanced template error with parsing context
   */
  static handleParsingError(content: string, error: Error, filePath?: string): TemplateError {
    return handleParsingError(content, error, filePath);
  }

  /**
   * Handle template rendering errors
   * @param {unknown} templateId - ID of the template that failed to render
   * @param {unknown} error - Original rendering error
   * @param {unknown} _context - Optional rendering context data
   * @returns {TemplateError} Enhanced template error with rendering context
   */
  static handleRenderingError(
    templateId: string,
    error: Error,
    _context?: Record<string, unknown>
  ): TemplateError {
    return handleRenderingError(templateId, error, _context);
  }

  /**
   * Convert enhanced errors to standard validation result
   * @param {TemplateError[]} enhancedErrors - Array of enhanced template errors
   * @returns {TemplateError[]): TemplateValidationResult} Standard validation result with errors and warnings
   */
  static toValidationResult(enhancedErrors: TemplateError[]): TemplateValidationResult {
    const errors: TemplateValidationError[] = [];
    const warnings: TemplateValidationWarning[] = [];

    this.convertEnhancedErrors(enhancedErrors, errors, warnings);

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      timestamp: new Date(),
      validator: 'TemplateErrorHandler',
    };
  }

  /**
   * Convert enhanced errors to standard format
   * @param {unknown} enhancedErrors - Enhanced errors to convert
   * @param {unknown} errors - Array to collect converted errors
   * @param {unknown} warnings - Array to collect converted warnings
   */
  private static convertEnhancedErrors(
    enhancedErrors: TemplateError[],
    errors: TemplateValidationError[],
    warnings: TemplateValidationWarning[]
  ): void {
    for (const error of enhancedErrors) {
      if (error.severity === ErrorSeverity.CRITICAL || error.severity === ErrorSeverity.ERROR) {
        errors.push(this.createValidationError(error));
      } else {
        warnings.push(this.createValidationWarning(error));
      }
    }
  }

  /**
   * Create a validation error from enhanced error
   * @param {TemplateError} error - Enhanced error
   * @returns {TemplateError): TemplateValidationError} Validation error
   */
  private static createValidationError(error: TemplateError): TemplateValidationError {
    return {
      code: error.code,
      message: error.message,
      filePath: error.context?.filePath,
      line: error.context?.line,
      column: error.context?.column,
      severity: error.severity as 'error' | 'warning',
      context: error.context as Record<string, unknown>,
    };
  }

  /**
   * Create a validation warning from enhanced error
   * @param {TemplateError} error - Enhanced error
   * @returns {TemplateError): TemplateValidationWarning} Validation warning
   */
  private static createValidationWarning(error: TemplateError): TemplateValidationWarning {
    return {
      code: error.code,
      message: error.message,
      category: error.category as 'performance' | 'compatibility' | 'best-practice' | 'deprecation',
      suggestion: error.suggestion,
    };
  }

  /**
   * Register syntax validation rules
   */
  private static registerSyntaxRules(): void {
    this.ERROR_RULES.set('json_syntax', createJsonSyntaxRule());
    this.ERROR_RULES.set('handlebars_syntax', createHandlebarsSyntaxRule());
  }

  /**
   * Register structure validation rules
   */
  private static registerStructureRules(): void {
    this.ERROR_RULES.set('template_structure', createStructureRule());
  }

  /**
   * Register content validation rules
   */
  private static registerContentRules(): void {
    this.ERROR_RULES.set('template_content', createContentRule());
  }

  /**
   * Register dependency validation rules
   */
  private static registerDependencyRules(): void {
    this.ERROR_RULES.set('template_dependencies', createDependencyRule());
  }

  /**
   * Register performance validation rules
   */
  private static registerPerformanceRules(): void {
    this.ERROR_RULES.set('template_performance', createPerformanceRule());
  }

  /**
   * Register security validation rules
   */
  private static registerSecurityRules(): void {
    this.ERROR_RULES.set('template_security', createSecurityRule());
  }

  /**
   * Register compatibility validation rules
   */
  private static registerCompatibilityRules(): void {
    this.ERROR_RULES.set('template_compatibility', createCompatibilityRule());
  }
}

// Re-export types for convenience
export type {
  TemplateError,
  ErrorRecoveryStrategy,
  TemplateErrorContext,
} from './error-handler/types.js';
export { ErrorSeverity, ErrorCategory } from './error-handler/types.js';
