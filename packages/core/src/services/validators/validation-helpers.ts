/**
 * General validation helpers for project configuration
 */
import type { ProjectConfig } from '../../types/project-config.js';
import { validateProjectName } from './project-name-validator.js';
import { validateSecurityConstraints } from './security-validator.js';
import { validateTemplateCompatibility } from './template-compatibility-validator.js';
import {
  VALID_PROJECT_TYPES,
  VALID_QUALITY_LEVELS,
  VALID_AI_ASSISTANTS,
  COMMON_LICENSES,
  DANGEROUS_DIRECTORIES,
  ERROR_MESSAGES,
  ValidProjectType,
  ValidQualityLevel,
  ValidAIAssistant,
  CommonLicense,
} from './validation-constants.js';

/**
 * Validate project type
 * @param projectType - Project type to validate
 * @returns Warning message if invalid, null if valid
 */
export function validateProjectType(projectType?: string): string | null {
  if (projectType && !VALID_PROJECT_TYPES.includes(projectType as ValidProjectType)) {
    return ERROR_MESSAGES.INVALID_PROJECT_TYPE(projectType);
  }
  return null;
}

/**
 * Validate quality level
 * @param qualityLevel - Quality level to validate
 * @returns Warning message if invalid, null if valid
 */
export function validateQualityLevel(qualityLevel?: string): string | null {
  if (qualityLevel && !VALID_QUALITY_LEVELS.includes(qualityLevel as ValidQualityLevel)) {
    return ERROR_MESSAGES.INVALID_QUALITY_LEVEL(qualityLevel);
  }
  return null;
}

/**
 * Validate AI assistants
 * @param aiAssistants - Array of AI assistants to validate
 * @returns Array of warning messages for invalid assistants
 */
export function validateAIAssistants(aiAssistants?: string[]): string[] {
  const warnings: string[] = [];

  if (!aiAssistants) {
    return warnings;
  }

  for (const assistant of aiAssistants) {
    if (!VALID_AI_ASSISTANTS.includes(assistant as ValidAIAssistant)) {
      warnings.push(ERROR_MESSAGES.INVALID_AI_ASSISTANT(assistant));
    }
  }

  return warnings;
}

/**
 * Validate license
 * @param license - License to validate
 * @returns Warning message if uncommon license, null if common
 */
export function validateLicense(license?: string): string | null {
  if (license && !COMMON_LICENSES.includes(license as CommonLicense)) {
    return ERROR_MESSAGES.INVALID_LICENSE(license);
  }
  return null;
}

/**
 * Validate target directory security
 * @param targetDirectory - Target directory path
 * @returns Object with errors and warnings
 */
export function validateTargetDirectorySecurity(targetDirectory: string): {
  errors: string[];
  warnings: string[];
} {
  const result = { errors: [] as string[], warnings: [] as string[] };

  // Security: Check for path traversal attempts
  if (targetDirectory.includes('..') || targetDirectory.includes('~')) {
    result.errors.push('Target directory cannot contain ".." or "~" for security reasons');
    return result;
  }

  // Check for potentially dangerous directory names
  const pathParts = targetDirectory.split(/[/\\]/);
  for (const part of pathParts) {
    if (DANGEROUS_DIRECTORIES.includes(part.toLowerCase())) {
      result.warnings.push(`Target directory contains potentially dangerous path: "${part}"`);
    }
  }

  return result;
}

/**
 * Validate target directory
 * @param config - Project configuration
 * @param warnings - Array to collect warnings
 * @param errors - Array to collect errors
 */
export function validateTargetDirectory(
  config: ProjectConfig,
  warnings: string[],
  errors: string[]
): void {
  const targetDir = config.targetDirectory || `./${config.name}`;
  const validation = validateTargetDirectorySecurity(targetDir);

  warnings.push(...validation.warnings);
  errors.push(...validation.errors);
}

/**
 * Run all validations on project configuration
 * @param config - Project configuration to validate
 * @returns Object with validation results
 */
export function runAllValidations(config: ProjectConfig): {
  valid: boolean;
  warnings: string[];
  errors: string[];
} {
  const warnings: string[] = [];
  const errors: string[] = [];

  validateBasicProjectFields(config, warnings, errors);
  validateAdvancedProjectFields(config, warnings, errors);

  return {
    valid: errors.length === 0,
    warnings,
    errors,
  };
}

/**
 * Validate basic project fields (name, type, quality, AI assistants, license)
 * @param config - Project configuration to validate
 * @param warnings - Array to collect warnings
 * @param errors - Array to collect errors
 */
function validateBasicProjectFields(
  config: ProjectConfig,
  warnings: string[],
  errors: string[]
): void {
  // Validate project name
  validateProjectName(config.name, warnings, errors);

  // Validate project type
  const projectTypeWarning = validateProjectType(config.projectType);
  if (projectTypeWarning) {
    warnings.push(projectTypeWarning);
  }

  // Validate quality level
  const qualityWarning = validateQualityLevel(config.qualityLevel);
  if (qualityWarning) {
    warnings.push(qualityWarning);
  }

  // Validate AI assistants
  const aiWarnings = validateAIAssistants(config.aiAssistants);
  warnings.push(...aiWarnings);

  // Validate license
  const licenseWarning = validateLicense(config.license);
  if (licenseWarning) {
    warnings.push(licenseWarning);
  }
}

/**
 * Validate advanced project fields (template, target directory, security)
 * @param config - Project configuration to validate
 * @param warnings - Array to collect warnings
 * @param errors - Array to collect errors
 */
function validateAdvancedProjectFields(
  config: ProjectConfig,
  warnings: string[],
  errors: string[]
): void {
  // Validate template compatibility
  const templateWarning = validateTemplateCompatibility(config.template, config.projectType);
  if (templateWarning) {
    warnings.push(templateWarning);
  }

  // Validate target directory
  validateTargetDirectory(config, warnings, errors);

  // Validate security constraints
  validateSecurityConstraints(config, warnings, errors);
}
