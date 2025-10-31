/**
 * Project Validation Helpers
 *
 * Helper functions for project configuration validation
 */

import { PROJECT_GENERATION_CONSTANTS } from './project-generation-constants.js';
import type { ProjectConfig, ValidationResult } from './project-generation-helpers.js';

/**
 * Validate project name configuration
 * @param {ProjectConfig} config - Project configuration
 * @param {string[]} errors - Array to collect validation errors
 */
export function validateProjectNameConfig(config: ProjectConfig, errors: string[]): void {
  if (!config.name) {
    errors.push(PROJECT_GENERATION_CONSTANTS.ERROR_MESSAGES.PROJECT_NAME_REQUIRED);
    return;
  }

  const nameValidation = validateProjectName(config.name);
  if (!nameValidation.valid) {
    errors.push(...nameValidation.errors);
  }
}

/**
 * Validate quality level configuration
 * @param {ProjectConfig} config - Project configuration
 * @param {string[]} errors - Array to collect validation errors
 */
export function validateQualityLevelConfig(config: ProjectConfig, errors: string[]): void {
  if (!config.qualityLevel) {
    errors.push(PROJECT_GENERATION_CONSTANTS.ERROR_MESSAGES.QUALITY_LEVEL_REQUIRED);
    return;
  }

  if (!PROJECT_GENERATION_CONSTANTS.VALID_QUALITY_LEVELS.includes(config.qualityLevel)) {
    errors.push(PROJECT_GENERATION_CONSTANTS.ERROR_MESSAGES.INVALID_QUALITY_LEVEL);
  }
}

/**
 * Validate project type configuration
 * @param {ProjectConfig} config - Project configuration
 * @param {string[]} errors - Array to collect validation errors
 */
export function validateProjectTypeConfig(config: ProjectConfig, errors: string[]): void {
  if (!config.projectType) {
    errors.push(PROJECT_GENERATION_CONSTANTS.ERROR_MESSAGES.PROJECT_TYPE_REQUIRED);
    return;
  }

  if (!PROJECT_GENERATION_CONSTANTS.VALID_PROJECT_TYPES.includes(config.projectType)) {
    errors.push(PROJECT_GENERATION_CONSTANTS.ERROR_MESSAGES.INVALID_PROJECT_TYPE);
  }
}

/**
 * Validate AI assistants configuration
 * @param {ProjectConfig} config - Project configuration
 * @param {string[]} errors - Array to collect validation errors
 */
export function validateAIAssistantsConfig(config: ProjectConfig, errors: string[]): void {
  if (!config.aiAssistants || config.aiAssistants.length === 0) {
    errors.push(PROJECT_GENERATION_CONSTANTS.ERROR_MESSAGES.AI_ASSISTANT_REQUIRED);
    return;
  }

  const invalidAssistants = config.aiAssistants.filter(
    (assistant) => !PROJECT_GENERATION_CONSTANTS.VALID_AI_ASSISTANTS.includes(assistant)
  );

  if (invalidAssistants.length > 0) {
    errors.push(
      PROJECT_GENERATION_CONSTANTS.ERROR_MESSAGES.INVALID_AI_ASSISTANTS(invalidAssistants)
    );
  }
}

/**
 * Validate optional fields configuration
 * @param {ProjectConfig} config - Project configuration
 * @param {string[]} errors - Array to collect validation errors
 */
export function validateOptionalConfig(config: ProjectConfig, errors: string[]): void {
  if (
    config.description &&
    config.description.length > PROJECT_GENERATION_CONSTANTS.MAX_DESCRIPTION_LENGTH
  ) {
    errors.push(
      PROJECT_GENERATION_CONSTANTS.ERROR_MESSAGES.DESCRIPTION_TOO_LONG(
        PROJECT_GENERATION_CONSTANTS.MAX_DESCRIPTION_LENGTH
      )
    );
  }

  if (config.author && config.author.length > PROJECT_GENERATION_CONSTANTS.MAX_AUTHOR_NAME_LENGTH) {
    errors.push(
      PROJECT_GENERATION_CONSTANTS.ERROR_MESSAGES.AUTHOR_NAME_TOO_LONG(
        PROJECT_GENERATION_CONSTANTS.MAX_AUTHOR_NAME_LENGTH
      )
    );
  }

  if (config.license && !isValidLicense(config.license)) {
    errors.push(PROJECT_GENERATION_CONSTANTS.ERROR_MESSAGES.INVALID_LICENSE);
  }
}

/**
 * Validate project name format
 * @param {string} name - Project name to validate
 * @returns {string): ValidationResult} Validation result with any errors
 */
export function validateProjectName(name: string): ValidationResult {
  const errors: string[] = [];

  if (!PROJECT_GENERATION_CONSTANTS.PROJECT_NAME_PATTERN.test(name)) {
    errors.push(
      'Project name must contain only lowercase letters, numbers, hyphens, and underscores'
    );
  }

  if (name.length === 0 || name.length > PROJECT_GENERATION_CONSTANTS.MAX_NAME_LENGTH) {
    errors.push(
      `Project name must be between 1 and ${PROJECT_GENERATION_CONSTANTS.MAX_NAME_LENGTH} characters`
    );
  }

  if (PROJECT_GENERATION_CONSTANTS.PROJECT_NAME_START_PATTERN.test(name)) {
    errors.push('Project name cannot start with a number or dot');
  }

  // Check for reserved names
  const reservedNames = ['npm', 'node', 'bun', 'test', 'lib', 'bin', 'config'];
  if (reservedNames.includes(name)) {
    errors.push(`Project name '${name}' is reserved`);
  }

  // Check for invalid patterns
  if (name.includes('..') || name.startsWith('.') || name.endsWith('.')) {
    errors.push('Project name cannot contain consecutive dots or start/end with dots');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Check if license is valid SPDX identifier
 * @param {string} license - License string to validate
 * @returns {string): boolean} True if license is valid
 */
export function isValidLicense(license: string): boolean {
  const validLicenses = [
    'MIT',
    'Apache-2.0',
    'GPL-3.0-or-later',
    'BSD-3-Clause',
    'BSD-2-Clause',
    'ISC',
    'LGPL-3.0-or-later',
    'AGPL-3.0-or-later',
    'Unlicense',
    'CC0-1.0',
    'MPL-2.0',
    'BSL-1.0',
    'Zlib',
    'WTFPL',
    '0BSD',
  ];

  return validLicenses.includes(license) || /^[\d.A-Za-z-]+$/.test(license);
}
