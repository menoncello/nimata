/**
 * Path Security Validation
 *
 * Handles path validation and security checks
 */
import { resolve } from 'node:path';
import { DirectoryPathValidator } from '../../validators/directory-path-validator.js';
import { getTempPathPatterns } from './file-permissions.js';

/**
 * Validates path to prevent directory traversal attacks and malicious path patterns
 * @param {string} basePath - Base path to validate against
 * @param {string} targetPath - Target path to validate
 * @throws Error if path validation fails
 */
export function validatePath(basePath: string, targetPath: string): void {
  DirectoryPathValidator.validatePath(basePath, targetPath);
}

/**
 * Validates if a path is a secure temporary directory with comprehensive security checks
 * @param {string} fullPath - Full path to validate
 * @returns {boolean} True if the path is a validated temporary directory
 */
export function isValidTempDirectory(fullPath: string): boolean {
  // SECURITY: Multi-layer validation for temporary directory usage

  if (!hasValidTempPattern(fullPath)) {
    return false;
  }

  if (hasSuspiciousPatterns(fullPath)) {
    return false;
  }

  return hasValidPathResolution(fullPath);
}

/**
 * Check if path has valid temporary directory pattern
 * @param {string} fullPath - Path to check
 * @returns {boolean} True if path has valid temp pattern
 */
function hasValidTempPattern(fullPath: string): boolean {
  const tempPathPatterns = getTempPathPatterns();
  return tempPathPatterns.some((pattern) => fullPath.includes(pattern));
}

/**
 * Check if path contains suspicious patterns
 * @param {string} fullPath - Path to check
 * @returns {boolean} True if path has suspicious patterns
 */
function hasSuspiciousPatterns(fullPath: string): boolean {
  const suspiciousPatterns = [
    '..', // Directory traversal
    '~/', // Home directory expansion
    '/etc/', // System configuration
    '/usr/', // System files
    '/bin/', // System binaries
    '/sbin/', // System administration
    '/var/log/', // System logs
    '/var/db/', // System databases
    '/Library/', // macOS system library
    '/System/', // macOS system files
  ];

  return suspiciousPatterns.some((pattern) => fullPath.includes(pattern));
}

/**
 * Check if path resolution is valid and safe
 * @param {string} fullPath - Path to check
 * @returns {boolean} True if path resolution is valid
 */
function hasValidPathResolution(fullPath: string): boolean {
  try {
    const resolvedPath = resolve(fullPath);
    const normalizedPath = resolvedPath.replace(/\/+/g, '/');

    // Additional check for path normalization safety
    return !(normalizedPath.includes('../') || normalizedPath.includes('..\\'));
  } catch {
    return false;
  }
}

/**
 * Check if error is a permission error
 * @param {Error} error - Error to check
 * @returns {boolean} True if permission error
 */
export function isPermissionError(error: Error): boolean {
  return error.message.includes('EACCES') || error.message.includes('permission denied');
}

/**
 * Create a standardized creation error
 * @param {string} itemType - Type of item being created ('file' or 'directory')
 * @param {string} itemPath - Path of the item
 * @param {unknown} originalError - Original error that occurred
 * @returns {Error} Error with standardized message
 */
export function createCreationError(
  itemType: string,
  itemPath: string,
  originalError: unknown
): Error {
  if (originalError instanceof Error) {
    // Add retry context for permission errors
    if (isPermissionError(originalError)) {
      return new Error(
        `Failed to create ${itemType} '${itemPath}': Permission denied. Check file/directory permissions and ensure the target directory exists and is writable. (${originalError.message})`
      );
    }
    return new Error(`Failed to create ${itemType} '${itemPath}': ${originalError.message}`);
  }
  return new Error(`Failed to create ${itemType} '${itemPath}': Unknown error`);
}
