/**
 * Project name validation helpers
 */
import {
  MAX_PROJECT_NAME_LENGTH,
  PROJECT_NAME_PATTERN,
  RESERVED_PROJECT_NAMES,
  DANGEROUS_NAME_PATTERNS,
} from './validation-constants.js';

/**
 * Check if project name is empty or invalid
 * @param name - Project name to validate
 * @returns Error message if invalid, null if valid
 */
export function validateProjectNameRequired(name: string): string | null {
  if (!name || name.trim().length === 0) {
    return 'Project name is required';
  }
  return null;
}

/**
 * Check for dangerous patterns in project name
 * @param name - Project name to validate
 * @returns Error message if dangerous patterns found, null if safe
 */
export function validateProjectNameSecurity(name: string): string | null {
  for (const pattern of DANGEROUS_NAME_PATTERNS) {
    if (pattern.test(name)) {
      return `Invalid project name: "${name}" contains forbidden characters or patterns`;
    }
  }
  return null;
}

/**
 * Validate project name length
 * @param name - Project name to validate
 * @returns Object with error and warning messages
 */
export function validateProjectNameLength(name: string): {
  error: string | null;
  warning: string | null;
} {
  const result = { error: null as string | null, warning: null as string | null };

  if (name.length === 0) {
    result.error = 'Project name must be at least 1 character long';
  } else if (name.length > MAX_PROJECT_NAME_LENGTH) {
    result.warning = 'Project name exceeds 214 characters, may cause issues on some systems';
  }

  return result;
}

/**
 * Validate npm package name format
 * @param name - Project name to validate
 * @returns Error message if invalid format, null if valid
 */
export function validateProjectNameFormat(name: string): string | null {
  if (!PROJECT_NAME_PATTERN.test(name)) {
    return 'Project name must follow npm package naming: lowercase, hyphens only, no spaces';
  }
  return null;
}

/**
 * Check if project name is reserved
 * @param name - Project name to validate
 * @returns Warning message if reserved, null if available
 */
export function validateProjectNameReserved(name: string): string | null {
  if (RESERVED_PROJECT_NAMES.includes(name.toLowerCase())) {
    return `"${name}" is a reserved name that may cause conflicts`;
  }
  return null;
}

/**
 * Complete project name validation
 * @param name - Project name to validate
 * @param warnings - Array to collect warnings
 * @param errors - Array to collect errors
 */
export function validateProjectName(name: string, warnings: string[], errors: string[]): void {
  // Check required
  const requiredError = validateProjectNameRequired(name);
  if (requiredError) {
    errors.push(requiredError);
    return;
  }

  // Check security
  const securityError = validateProjectNameSecurity(name);
  if (securityError) {
    errors.push(securityError);
    return;
  }

  // Validate remaining aspects
  validateRemainingProjectNameAspects(name, warnings, errors);
}

/**
 * Validate remaining project name aspects (length, format, reserved names)
 * @param name - Project name to validate
 * @param warnings - Array to collect warnings
 * @param errors - Array to collect errors
 */
function validateRemainingProjectNameAspects(
  name: string,
  warnings: string[],
  errors: string[]
): void {
  // Check length
  const lengthValidation = validateProjectNameLength(name);
  if (lengthValidation.error) {
    errors.push(lengthValidation.error);
    return;
  }
  if (lengthValidation.warning) {
    warnings.push(lengthValidation.warning);
  }

  // Check format and reserved names
  const formatError = validateProjectNameFormat(name);
  if (formatError) {
    errors.push(formatError);
  }

  const reservedWarning = validateProjectNameReserved(name);
  if (reservedWarning) {
    warnings.push(reservedWarning);
  }
}
