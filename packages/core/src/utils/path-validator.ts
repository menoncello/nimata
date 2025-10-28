/**
 * Path Security Validator
 *
 * Utility class for validating paths and preventing security vulnerabilities
 */
import { resolve, relative, normalize } from 'node:path';
import { MAX_PATH_LENGTH as MAX_PATH_LENGTH_CONST } from '../services/validators/validation-constants.js';

/**
 *
 */
export class PathValidator {
  private static readonly MAX_PATH_LENGTH = MAX_PATH_LENGTH_CONST;
  private static readonly DANGEROUS_PATTERNS = [
    '../',
    '..\\',
    '~/', // Home directory access
    '~\\', // Windows home directory access
    '%2e%2e%2f', // URL encoded ../
    '%2e%2e\\', // URL encoded ..\
    '%2e%2e%5c', // Alternative URL encoded ..\
    '..%2f', // Mixed encoding
    '..%5c', // Mixed encoding
  ] as const;

  private static readonly FORBIDDEN_CHARS = /["*:<>?|]/;

  /**
   * Validates path to prevent directory traversal attacks and malicious path patterns
   * @param {string} basePath - Base path to validate against
   * @param {string} targetPath - Target path to validate
   * @throws {Error} Error if path validation fails
   */
  static validatePath(basePath: string, targetPath: string): void {
    this.validateInputs(basePath, targetPath);
    this.validateDangerousPatterns(targetPath);
    this.validatePathFormat(targetPath);
    this.validatePathResolution(basePath, targetPath);
    this.validatePathLength(targetPath);
    this.validateForbiddenCharacters(targetPath);
    this.validatePathNormalization(targetPath);
  }

  /**
   * Validate basic inputs
   * @param {string} basePath - Base path
   * @param {string} targetPath - Target path
   */
  private static validateInputs(basePath: string, targetPath: string): void {
    if (!targetPath || typeof targetPath !== 'string') {
      throw new Error('Invalid target path: path must be a non-empty string');
    }

    if (!basePath || typeof basePath !== 'string') {
      throw new Error('Invalid base path: base path must be a non-empty string');
    }
  }

  /**
   * Check for dangerous patterns
   * @param {string} targetPath - Path to check
   */
  private static validateDangerousPatterns(targetPath: string): void {
    // Check for null bytes and other dangerous characters
    if (targetPath.includes('\0') || targetPath.includes('\r') || targetPath.includes('\n')) {
      throw new Error(`Path traversal detected: ${targetPath} contains null bytes or line breaks`);
    }

    // Check for path traversal patterns
    const lowerPath = targetPath.toLowerCase();
    for (const pattern of this.DANGEROUS_PATTERNS) {
      if (lowerPath.includes(pattern)) {
        throw new Error(
          `Path traversal detected: ${targetPath} contains dangerous pattern: ${pattern}`
        );
      }
    }
  }

  /**
   * Validate path format
   * @param {string} targetPath - Path to validate
   */
  private static validatePathFormat(targetPath: string): void {
    // Check for absolute paths (should be relative to base)
    if (targetPath.startsWith('/') || /^[A-Za-z]:/.test(targetPath)) {
      throw new Error(
        `Absolute path detected: ${targetPath} - paths must be relative to project directory`
      );
    }
  }

  /**
   * Validate path resolution to prevent escapes
   * @param {string} basePath - Base path
   * @param {string} targetPath - Target path
   */
  private static validatePathResolution(basePath: string, targetPath: string): void {
    const resolvedBase = resolve(basePath);
    const resolvedTarget = resolve(basePath, targetPath);

    // Check if resolved target path is within base path
    const relativePath = relative(resolvedBase, resolvedTarget);

    // If relative path starts with '..', it's trying to escape base directory
    if (relativePath.startsWith('..') || relativePath === resolve(resolvedTarget)) {
      throw new Error(
        `Path traversal detected: ${targetPath} attempts to access files outside project directory`
      );
    }
  }

  /**
   * Validate path length
   * @param {string} targetPath - Path to validate
   */
  private static validatePathLength(targetPath: string): void {
    // Check for overly long paths (potential DoS)
    if (targetPath.length > this.MAX_PATH_LENGTH) {
      throw new Error(
        `Path too long: ${targetPath} exceeds maximum allowed length of ${this.MAX_PATH_LENGTH}`
      );
    }
  }

  /**
   * Validate forbidden characters
   * @param {string} targetPath - Path to validate
   */
  private static validateForbiddenCharacters(targetPath: string): void {
    // Check for suspicious characters that might cause issues
    if (this.FORBIDDEN_CHARS.test(targetPath)) {
      throw new Error(`Invalid characters in path: ${targetPath} contains forbidden characters`);
    }
  }

  /**
   * Validate path normalization
   * @param {string} targetPath - Path to validate
   */
  private static validatePathNormalization(targetPath: string): void {
    // Normalize path and check for double slashes/dots that could indicate issues
    const normalizedPath = normalize(targetPath);
    if (normalizedPath !== targetPath && targetPath.includes('//')) {
      throw new Error(`Path normalization issue detected in: ${targetPath}`);
    }
  }
}
