/**
 * Wizard Validation Helpers
 *
 * Validation logic and utilities for project wizard
 */

import { TEXT_LIMITS, LISTS } from '../utils/constants.js';

// Types
type QualityLevel = 'light' | 'medium' | 'strict';
type ProjectType = 'basic' | 'web' | 'cli' | 'library';
type AIAssistant = 'claude-code' | 'copilot';

export interface ProjectConfig {
  name: string;
  description?: string;
  author?: string;
  license?: string;
  qualityLevel: QualityLevel;
  projectType: ProjectType;
  aiAssistants: AIAssistant[];
  template?: string;
  targetDirectory?: string;
  nonInteractive?: boolean;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

// Constants
const VALID_AI_ASSISTANTS = ['claude-code', 'copilot'] as const;
const VALID_ASSISTANTS_MESSAGE = 'claude-code, copilot';
const INVALID_ASSISTANTS_MESSAGE = `Invalid AI assistants: {{invalid}}. Valid options: ${VALID_ASSISTANTS_MESSAGE}`;

/**
 * Validate required configuration fields
 * @param {Partial<ProjectConfig>} config - Configuration to validate
 * @returns {ValidationResult} Validation result
 */
export function validateRequiredFields(config: Partial<ProjectConfig>): ValidationResult {
  const errors: string[] = [];

  // Validate each required field
  validateProjectNameField(config, errors);
  validateQualityLevelField(config, errors);
  validateProjectTypeField(config, errors);
  validateAIAssistantsField(config, errors);

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate project name field
 * @param {Partial<ProjectConfig>} config - Configuration to validate
 * @param {string[]} errors - Array to collect errors
 */
function validateProjectNameField(config: Partial<ProjectConfig>, errors: string[]): void {
  if (config.name) {
    const nameValidation = validateProjectName(config.name);
    if (!nameValidation.valid) {
      errors.push(...nameValidation.errors);
    }
  } else {
    errors.push('Project name is required');
  }
}

/**
 * Validate quality level field
 * @param {Partial<ProjectConfig>} config - Configuration to validate
 * @param {string[]} errors - Array to collect errors
 */
function validateQualityLevelField(config: Partial<ProjectConfig>, errors: string[]): void {
  if (!config.qualityLevel) {
    errors.push('Quality level is required');
  } else if (!isValidQualityLevel(config.qualityLevel)) {
    errors.push('Invalid quality level. Must be: light, medium, or strict');
  }
}

/**
 * Validate project type field
 * @param {Partial<ProjectConfig>} config - Configuration to validate
 * @param {string[]} errors - Array to collect errors
 */
function validateProjectTypeField(config: Partial<ProjectConfig>, errors: string[]): void {
  if (!config.projectType) {
    errors.push('Project type is required');
  } else if (!isValidProjectType(config.projectType)) {
    errors.push('Invalid project type. Must be: basic, web, cli, or library');
  }
}

/**
 * Validate AI assistants field
 * @param {Partial<ProjectConfig>} config - Configuration to validate
 * @param {string[]} errors - Array to collect errors
 */
function validateAIAssistantsField(config: Partial<ProjectConfig>, errors: string[]): void {
  if (!config.aiAssistants || config.aiAssistants.length === 0) {
    errors.push('At least one AI assistant must be selected');
  } else {
    const validationErrors = validateAIAssistants(config.aiAssistants);
    errors.push(...validationErrors);
  }
}

/**
 * Validate optional configuration fields
 * @param {Partial<ProjectConfig>} config - Configuration to validate
 * @returns {ValidationResult} Validation result
 */
export function validateOptionalFields(config: Partial<ProjectConfig>): ValidationResult {
  const errors: string[] = [];

  // Validate description length
  if (config.description && config.description.length > TEXT_LIMITS.DESCRIPTION_MAX) {
    errors.push(`Description must be less than ${TEXT_LIMITS.DESCRIPTION_MAX} characters`);
  }

  // Validate author name length
  if (config.author && config.author.length > TEXT_LIMITS.AUTHOR_NAME_MAX) {
    errors.push(`Author name must be less than ${TEXT_LIMITS.AUTHOR_NAME_MAX} characters`);
  }

  // Validate license format
  if (config.license && !isValidLicense(config.license)) {
    errors.push('Invalid license. Use a valid SPDX license identifier or leave empty');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Check if quality level is valid
 * @param {string} qualityLevel - Quality level to check
 * @returns {qualityLevel is QualityLevel} True if valid
 */
export function isValidQualityLevel(qualityLevel: string): qualityLevel is QualityLevel {
  return ['light', 'medium', 'strict'].includes(qualityLevel);
}

/**
 * Check if project type is valid
 * @param {string} projectType - Project type to check
 * @returns {projectType is ProjectType} True if valid
 */
export function isValidProjectType(projectType: string): projectType is ProjectType {
  return ['basic', 'web', 'cli', 'library'].includes(projectType);
}

/**
 * Validate AI assistants array
 * @param {string[]} aiAssistants - Array of AI assistants to validate
 * @returns {string[]} Array of validation errors
 */
export function validateAIAssistants(aiAssistants: string[]): string[] {
  const errors: string[] = [];

  const invalidAssistants = aiAssistants.filter(
    (assistant) => !VALID_AI_ASSISTANTS.includes(assistant as AIAssistant)
  );

  if (invalidAssistants.length > 0) {
    errors.push(INVALID_ASSISTANTS_MESSAGE.replace('{{invalid}}', invalidAssistants.join(', ')));
  }

  return errors;
}

/**
 * Validate project name format and constraints
 * @param {string} name - The project name to validate
 * @returns {ValidationResult} Validation result with any errors
 */
export function validateProjectName(name: string): ValidationResult {
  const errors: string[] = [];

  if (!/^[\d_a-z-]+$/.test(name)) {
    errors.push(
      'Project name must contain only lowercase letters, numbers, hyphens, and underscores'
    );
  }

  if (name.length === 0 || name.length > LISTS.MAX_NAME_LENGTH) {
    errors.push(
      `Project name must be between ${LISTS.INDEX_OFFSET} and ${LISTS.MAX_NAME_LENGTH} characters`
    );
  }

  // Check if starts with number or dot
  if (/^[\d.]/.test(name)) {
    errors.push('Project name cannot start with a number or dot');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Check if license is a valid SPDX identifier
 * @param {string} license - The license string to validate
 * @returns {boolean} True if license is valid
 */
export function isValidLicense(license: string): boolean {
  // Common SPDX license identifiers
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
