/**
 * Template Metadata Validation Utilities
 *
 * Provides validation functionality for template metadata
 */
import fs from 'node:fs/promises';
import type { TemplateMetadata, TemplateValidationResult } from '@nimata/core';

/**
 * Type definition for validation error severity
 */
type ValidationErrorSeverity = 'error' | 'warning' | 'info';

/**
 * Type definition for validation warning category
 */
type ValidationWarningCategory = 'performance' | 'compatibility' | 'best-practice' | 'deprecation';

/**
 * Constants for template validation
 */
const VALIDATION_CONSTANTS = {
  ERROR_SEVERITY: 'error',
  BEST_PRACTICE_CATEGORY: 'best-practice',
  REQUIRED_MESSAGE: 'is required',
} as const;

/**
 * Template validation utilities
 */
export class TemplateMetadataValidator {
  /**
   * Validate a template
   * @param template - The template to validate
   * @returns Validation result with any errors or warnings
   */
  static async validateTemplate(template: TemplateMetadata): Promise<TemplateValidationResult> {
    const errors = this.initializeValidationErrors();
    const warnings = this.initializeValidationWarnings();

    try {
      this.validateRequiredFields(template, errors);
      await this.validateTemplateFile(template, errors);
      this.validateProjectTypes(template, warnings);
      this.validateTags(template, warnings);
      this.validateVersionFormat(template, warnings);
      this.validateFeatures(template, errors);
    } catch (error) {
      this.handleValidationError(error, errors);
    }

    return this.createValidationResult(errors, warnings);
  }

  /**
   * Initialize validation errors array
   * @returns Empty validation errors array
   */
  private static initializeValidationErrors(): Array<{
    code: string;
    message: string;
    severity: ValidationErrorSeverity;
    context?: Record<string, unknown>;
  }> {
    return [] as Array<{
      code: string;
      message: string;
      severity: ValidationErrorSeverity;
      context?: Record<string, unknown>;
    }>;
  }

  /**
   * Initialize validation warnings array
   * @returns Empty validation warnings array
   */
  private static initializeValidationWarnings(): Array<{
    code: string;
    message: string;
    category: ValidationWarningCategory;
    suggestion?: string;
  }> {
    return [] as Array<{
      code: string;
      message: string;
      category: ValidationWarningCategory;
      suggestion?: string;
    }>;
  }

  /**
   * Validate required template fields
   * @param template - Template to validate
   * @param errors - Errors array to populate
   */
  private static validateRequiredFields(
    template: TemplateMetadata,
    errors: Array<{ code: string; message: string; severity: string }>
  ): void {
    this.addValidationError(
      !template.id,
      'MISSING_ID',
      `Template ID ${VALIDATION_CONSTANTS.REQUIRED_MESSAGE}`,
      errors
    );
    this.addValidationError(
      !template.name,
      'MISSING_NAME',
      `Template name ${VALIDATION_CONSTANTS.REQUIRED_MESSAGE}`,
      errors
    );
    this.addValidationError(
      !template.filePath,
      'MISSING_FILE_PATH',
      `Template file path ${VALIDATION_CONSTANTS.REQUIRED_MESSAGE}`,
      errors
    );
  }

  /**
   * Validate template file exists and is readable
   * @param template - Template to validate
   * @param errors - Errors array to populate
   */
  private static async validateTemplateFile(
    template: TemplateMetadata,
    errors: Array<{
      code: string;
      message: string;
      severity: string;
      context?: Record<string, unknown>;
    }>
  ): Promise<void> {
    if (!template.filePath) return;

    try {
      await fs.access(template.filePath, fs.constants.R_OK);
    } catch {
      errors.push({
        code: 'FILE_NOT_FOUND',
        message: `Template file not found: ${template.filePath}`,
        severity: VALIDATION_CONSTANTS.ERROR_SEVERITY,
        context: { filePath: template.filePath },
      });
    }
  }

  /**
   * Validate supported project types
   * @param template - Template to validate
   * @param warnings - Warnings array to populate
   */
  private static validateProjectTypes(
    template: TemplateMetadata,
    warnings: Array<{ code: string; message: string; category: string; suggestion?: string }>
  ): void {
    if (!template.supportedProjectTypes || template.supportedProjectTypes.length === 0) {
      warnings.push({
        code: 'NO_PROJECT_TYPES',
        message: 'No project types specified',
        category: VALIDATION_CONSTANTS.BEST_PRACTICE_CATEGORY,
        suggestion: 'Add supported project types to template metadata',
      });
    }
  }

  /**
   * Validate template tags
   * @param template - Template to validate
   * @param warnings - Warnings array to populate
   */
  private static validateTags(
    template: TemplateMetadata,
    warnings: Array<{ code: string; message: string; category: string; suggestion?: string }>
  ): void {
    if (!template.tags || template.tags.length === 0) {
      warnings.push({
        code: 'NO_TAGS',
        message: 'No tags specified for better discoverability',
        category: VALIDATION_CONSTANTS.BEST_PRACTICE_CATEGORY,
        suggestion: 'Add relevant tags to improve template discoverability',
      });
    }
  }

  /**
   * Validate version format follows semantic versioning
   * @param template - Template to validate
   * @param warnings - Warnings array to populate
   */
  private static validateVersionFormat(
    template: TemplateMetadata,
    warnings: Array<{ code: string; message: string; category: string; suggestion?: string }>
  ): void {
    if (!template.version) return;

    const semverRegex = /^\d+\.\d+\.\d+(-[\d.A-Za-z-]+)?$/;
    if (!semverRegex.test(template.version)) {
      warnings.push({
        code: 'INVALID_VERSION_FORMAT',
        message: 'Version should follow semantic versioning (semver)',
        category: VALIDATION_CONSTANTS.BEST_PRACTICE_CATEGORY,
        suggestion: 'Use semantic versioning like "1.0.0"',
      });
    }
  }

  /**
   * Validate template features
   * @param template - Template to validate
   * @param errors - Errors array to populate
   */
  private static validateFeatures(
    template: TemplateMetadata,
    errors: Array<{ code: string; message: string; severity: string }>
  ): void {
    if (!template.features) return;

    for (const [index, feature] of template.features.entries()) {
      this.validateFeature(feature, index, errors);
    }
  }

  /**
   * Validate individual template feature
   * @param feature - Feature to validate
   * @param feature.id - Feature ID
   * @param feature.name - Feature name
   * @param index - Feature index
   * @param errors - Errors array to populate
   */
  private static validateFeature(
    feature: { id?: string; name?: string },
    index: number,
    errors: Array<{ code: string; message: string; severity: string }>
  ): void {
    this.addValidationError(
      !feature.id,
      'MISSING_FEATURE_ID',
      `Feature at index ${index} is missing ID`,
      errors
    );

    if (feature.id) {
      this.addValidationError(
        !feature.name,
        'MISSING_FEATURE_NAME',
        `Feature "${feature.id}" is missing name`,
        errors
      );
    }
  }

  /**
   * Add validation error if condition is met
   * @param condition - Whether to add the error
   * @param code - Error code
   * @param message - Error message
   * @param errors - Errors array to populate
   */
  private static addValidationError(
    condition: boolean,
    code: string,
    message: string,
    errors: Array<{ code: string; message: string; severity: string }>
  ): void {
    if (condition) {
      errors.push({
        code,
        message,
        severity: VALIDATION_CONSTANTS.ERROR_SEVERITY,
      });
    }
  }

  /**
   * Handle validation exceptions
   * @param error - Error that occurred
   * @param errors - Errors array to populate
   */
  private static handleValidationError(
    error: unknown,
    errors: Array<{ code: string; message: string; severity: string }>
  ): void {
    errors.push({
      code: 'VALIDATION_ERROR',
      message: `Template validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      severity: VALIDATION_CONSTANTS.ERROR_SEVERITY,
    });
  }

  /**
   * Create validation result from errors and warnings
   * @param errors - Validation errors
   * @param warnings - Validation warnings
   * @returns Complete validation result
   */
  private static createValidationResult(
    errors: Array<{
      code: string;
      message: string;
      severity: string;
      context?: Record<string, unknown>;
    }>,
    warnings: Array<{ code: string; message: string; category: string; suggestion?: string }>
  ): TemplateValidationResult {
    return {
      valid: errors.length === 0,
      errors: errors.map((e) => ({
        code: e.code,
        message: e.message,
        severity: e.severity as 'error' | 'warning' | 'info',
        context: e.context,
      })),
      warnings: warnings.map((w) => ({
        code: w.code,
        message: w.message,
        category: w.category as 'performance' | 'compatibility' | 'best-practice' | 'deprecation',
        suggestion: w.suggestion,
      })),
      timestamp: new Date(),
      validator: 'TemplateRegistry',
    };
  }
}
