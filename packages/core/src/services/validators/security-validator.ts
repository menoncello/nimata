/**
 * Security validation helpers for project configuration
 */
import type { ProjectConfig } from '../../types/project-config.js';
import {
  MAX_DESCRIPTION_LENGTH,
  MAX_AUTHOR_LENGTH,
  MAX_AI_ASSISTANTS,
  XSS_PATTERNS,
  DANGEROUS_AUTHOR_PATTERNS,
} from './validation-constants.js';

/**
 * Validate description for security issues
 * @param {string} description - Project description to validate
 * @returns {string} Array of security validation errors
 */
export function validateDescriptionSecurity(description: string): string[] {
  const errors: string[] = [];

  // Check for XSS patterns
  for (const pattern of XSS_PATTERNS) {
    if (pattern.test(description)) {
      errors.push('Project description contains potentially dangerous content');
      break;
    }
  }

  return errors;
}

/**
 * Validate author field for security issues
 * @param {string} author - Author name to validate
 * @returns {string} Array of security validation errors
 */
export function validateAuthorSecurity(author: string): string[] {
  const errors: string[] = [];

  // Check for dangerous patterns in author field
  for (const pattern of DANGEROUS_AUTHOR_PATTERNS) {
    if (pattern.test(author)) {
      errors.push('Author field contains potentially dangerous content');
      break;
    }
  }

  return errors;
}

/**
 * Validate description length
 * @param {string} description - Project description to validate
 * @returns {string} Warning message if too long, null if OK
 */
export function validateDescriptionLength(description: string): string | null {
  if (description.length > MAX_DESCRIPTION_LENGTH) {
    return 'Project description is very long, consider shortening it';
  }
  return null;
}

/**
 * Validate author length
 * @param {string} author - Author name to validate
 * @returns {string} Warning message if too long, null if OK
 */
export function validateAuthorLength(author: string): string | null {
  if (author.length > MAX_AUTHOR_LENGTH) {
    return 'Author name is quite long';
  }
  return null;
}

/**
 * Validate AI assistants count
 * @param {string} aiAssistants - Array of AI assistants
 * @returns {string} Warning message if too many, null if OK
 */
export function validateAiAssistantsCount(aiAssistants: string[]): string | null {
  if (aiAssistants.length > MAX_AI_ASSISTANTS) {
    return 'Using many AI assistants may impact project performance';
  }
  return null;
}

/**
 * Validate quality level security implications
 * @param {string} qualityLevel - Quality level to validate
 * @returns {string} Warning message if low security, null if OK
 */
export function validateQualityLevelSecurity(qualityLevel: string): string | null {
  if (qualityLevel === 'light') {
    return 'Light quality level provides minimal security protections';
  }
  return null;
}

/**
 * Main security validation function
 * @param {string} config - Project configuration to validate
 * @param {string} warnings - Array to collect warnings
 * @param {string} errors - Array to collect errors
 */
export function validateSecurityConstraints(
  config: ProjectConfig,
  warnings: string[],
  errors: string[]
): void {
  validateDescriptionSecurityAndLength(config.description, warnings, errors);
  validateAuthorSecurityAndLength(config.author, warnings, errors);
  validateAiAssistantsConfiguration(config.aiAssistants, warnings);
  validateQualityLevelSecurityImplications(config.qualityLevel, warnings);
}

/**
 * Validate description security and length
 * @param {string} description - Project description to validate
 * @param {string} warnings - Array to collect warnings
 * @param {string} errors - Array to collect errors
 */
function validateDescriptionSecurityAndLength(
  description: string | undefined,
  warnings: string[],
  errors: string[]
): void {
  if (!description) {
    return;
  }

  const descriptionErrors = validateDescriptionSecurity(description);
  errors.push(...descriptionErrors);

  const lengthWarning = validateDescriptionLength(description);
  if (lengthWarning) {
    warnings.push(lengthWarning);
  }
}

/**
 * Validate author security and length
 * @param {string} author - Author name to validate
 * @param {string} warnings - Array to collect warnings
 * @param {string} errors - Array to collect errors
 */
function validateAuthorSecurityAndLength(
  author: string | undefined,
  warnings: string[],
  errors: string[]
): void {
  if (!author) {
    return;
  }

  const authorErrors = validateAuthorSecurity(author);
  errors.push(...authorErrors);

  const lengthWarning = validateAuthorLength(author);
  if (lengthWarning) {
    warnings.push(lengthWarning);
  }
}

/**
 * Validate AI assistants configuration
 * @param {string} aiAssistants - Array of AI assistants to validate
 * @param {string} warnings - Array to collect warnings
 */
function validateAiAssistantsConfiguration(
  aiAssistants: string[] | undefined,
  warnings: string[]
): void {
  if (!aiAssistants) {
    return;
  }

  const assistantsWarning = validateAiAssistantsCount(aiAssistants);
  if (assistantsWarning) {
    warnings.push(assistantsWarning);
  }
}

/**
 * Validate quality level security implications
 * @param {string} qualityLevel - Quality level to validate
 * @param {string} warnings - Array to collect warnings
 */
function validateQualityLevelSecurityImplications(
  qualityLevel: string | undefined,
  warnings: string[]
): void {
  if (!qualityLevel) {
    return;
  }

  const qualityWarning = validateQualityLevelSecurity(qualityLevel);
  if (qualityWarning) {
    warnings.push(qualityWarning);
  }
}
