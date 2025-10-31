/**
 * Tech Stack Validation Utilities
 *
 * Utility functions for validating tech stack configurations
 */
import type { TechStackDefinition } from '@nimata/core';
import type { TechStackValidationResult } from './tech-stack-types.js';
import { validateTechStackConfig } from './tech-stack-utils.js';

interface ValidationError {
  code: string;
  message: string;
  severity: 'error' | 'warning';
  category: 'required' | 'recommended' | 'compatibility' | 'best-practice' | 'deprecation';
  suggestion?: string;
}

/**
 * Validates basic required properties
 * @param {TechStackDefinition} techStack - Tech stack to validate
 * @returns {TechStackDefinition): ValidationError[]} Array of validation errors
 */
export function validateBasicProperties(techStack: TechStackDefinition): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!techStack.id) {
    errors.push({
      code: 'MISSING_ID',
      message: 'Tech stack must have an ID',
      severity: 'error',
      category: 'required',
    });
  }

  if (!techStack.name) {
    errors.push({
      code: 'MISSING_NAME',
      message: 'Tech stack must have a name',
      severity: 'error',
      category: 'required',
    });
  }

  if (!techStack.version) {
    errors.push({
      code: 'MISSING_VERSION',
      message: 'Tech stack must have a version',
      severity: 'error',
      category: 'required',
    });
  }

  return errors;
}

/**
 * Validates recommended properties
 * @param {TechStackDefinition} techStack - Tech stack to validate
 * @returns {TechStackDefinition): Array<} Array of validation warnings
 */
export function validateRecommendedProperties(techStack: TechStackDefinition): Array<{
  code: string;
  message: string;
  category: 'compatibility' | 'best-practice' | 'deprecation';
  suggestion?: string;
}> {
  const warnings = [];

  if (!techStack.description) {
    warnings.push({
      code: 'MISSING_DESCRIPTION',
      message: 'Tech stack should have a description',
      category: 'best-practice',
      suggestion: 'Add a clear description explaining what this tech stack provides',
    });
  }

  if (!techStack.supportedProjectTypes || techStack.supportedProjectTypes.length === 0) {
    warnings.push({
      code: 'NO_PROJECT_TYPES',
      message: 'Tech stack should specify supported project types',
      category: 'best-practice',
      suggestion: 'Specify which project types this tech stack supports',
    });
  }

  // Keywords validation removed as they're not part of the core TechStackDefinition type

  return warnings;
}

/**
 * Validates tech stack configuration
 * @param {TechStackDefinition} techStack - Tech stack to validate
 * @returns {TechStackDefinition): ValidationError[]} Array of validation errors
 */
export function validateConfiguration(techStack: TechStackDefinition): ValidationError[] {
  if (!validateTechStackConfig(techStack)) {
    return [
      {
        code: 'INVALID_CONFIG',
        message: 'Tech stack configuration is invalid',
        severity: 'error',
        category: 'required',
        suggestion: 'Check the tech stack configuration structure and required fields',
      },
    ];
  }
  return [];
}

/**
 * Creates validation result
 * @param {ValidationError[]} errors - Validation errors
 * @param {Array<{ code: string; message: string; category: 'compatibility' | 'best-practice' | 'deprecation'; suggestion?: string }>} warnings - Validation warnings
 * @returns {TechStackValidationResult} Formatted validation result
 */
export function createValidationResult(
  errors: ValidationError[],
  warnings: Array<{
    code: string;
    message: string;
    category: 'compatibility' | 'best-practice' | 'deprecation';
    suggestion?: string;
  }>
): TechStackValidationResult {
  return {
    valid: errors.length === 0,
    errors,
    warnings: warnings.map((warning) => ({
      code: warning.code,
      message: warning.message,
      severity: 'warning' as const,
      category: warning.category,
      suggestion: warning.suggestion,
    })),
    timestamp: new Date(),
    validator: 'TechStackRegistry',
  };
}
