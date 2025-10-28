/**
 * Directory Path Validator
 *
 * Validates directory paths for security and structure generation
 */
import { resolve, relative, normalize } from 'node:path';

const MAX_PATH_LENGTH = 1024;

/**
 * Validates directory paths for security and proper structure
 */
export class DirectoryPathValidator {
  /**
   * Validates a directory path with comprehensive security checks
   * @param basePath - Base path to validate against
   * @param targetPath - Target path to validate
   * @throws Error if any validation fails
   */
  static validatePath(basePath: string, targetPath: string): void {
    this.validatePathInputs(basePath, targetPath);
    this.validatePathCharacters(targetPath);
    this.validatePathTraversalPatterns(targetPath);
    this.validateAbsolutePath(targetPath);
    this.validatePathResolution(basePath, targetPath);
    this.validatePathLength(targetPath);
    this.validateSuspiciousCharacters(targetPath);
    this.validatePathNormalization(targetPath);
  }

  /**
   * Validates basic path inputs
   * @param basePath - Base path to validate against
   * @param targetPath - Target path to validate
   * @throws Error if inputs are invalid
   */
  private static validatePathInputs(basePath: string, targetPath: string): void {
    if (!targetPath || typeof targetPath !== 'string') {
      throw new Error(`Invalid target path: path must be a non-empty string`);
    }

    if (!basePath || typeof basePath !== 'string') {
      throw new Error(`Invalid base path: base path must be a non-empty string`);
    }
  }

  /**
   * Validates for dangerous characters in path
   * @param targetPath - Target path to validate
   * @throws Error if dangerous characters are found
   */
  private static validatePathCharacters(targetPath: string): void {
    if (targetPath.includes('\0') || targetPath.includes('\r') || targetPath.includes('\n')) {
      throw new Error(`Path traversal detected: ${targetPath} contains null bytes or line breaks`);
    }
  }

  /**
   * Validates for path traversal patterns
   * @param targetPath - Target path to validate
   * @throws Error if traversal patterns are found
   */
  private static validatePathTraversalPatterns(targetPath: string): void {
    const dangerousPatterns = [
      '../',
      '..\\',
      '~/', // Home directory access
      '~\\', // Windows home directory access
      '%2e%2e%2f', // URL encoded ../
      '%2e%2e\\', // URL encoded ..\
      '%2e%2e%5c', // Alternative URL encoded ..\
      '..%2f', // Mixed encoding
      '..%5c', // Mixed encoding
    ];

    const lowerPath = targetPath.toLowerCase();
    for (const pattern of dangerousPatterns) {
      if (lowerPath.includes(pattern)) {
        throw new Error(
          `Path traversal detected: ${targetPath} contains dangerous pattern: ${pattern}`
        );
      }
    }
  }

  /**
   * Validates that path is not absolute
   * @param targetPath - Target path to validate
   * @throws Error if absolute path is detected
   */
  private static validateAbsolutePath(targetPath: string): void {
    if (targetPath.startsWith('/') || /^[A-Za-z]:/.test(targetPath)) {
      throw new Error(
        `Absolute path detected: ${targetPath} - paths must be relative to project directory`
      );
    }
  }

  /**
   * Validates path resolution to prevent directory escape
   * @param basePath - Base path to validate against
   * @param targetPath - Target path to validate
   * @throws Error if path resolves outside base directory
   */
  private static validatePathResolution(basePath: string, targetPath: string): void {
    const resolvedBase = resolve(basePath);
    const resolvedTarget = resolve(basePath, targetPath);
    const relativePath = relative(resolvedBase, resolvedTarget);

    // If relative path starts with '..', it's trying to escape the base directory
    if (relativePath.startsWith('..') || relativePath === resolve(resolvedTarget)) {
      throw new Error(
        `Path traversal detected: ${targetPath} attempts to access files outside the project directory`
      );
    }
  }

  /**
   * Validates path length to prevent DoS attacks
   * @param targetPath - Target path to validate
   * @throws Error if path is too long
   */
  private static validatePathLength(targetPath: string): void {
    if (targetPath.length > MAX_PATH_LENGTH) {
      throw new Error(`Path too long: ${targetPath} exceeds maximum allowed length`);
    }
  }

  /**
   * Validates for suspicious characters that might cause issues
   * @param targetPath - Target path to validate
   * @throws Error if suspicious characters are found
   */
  private static validateSuspiciousCharacters(targetPath: string): void {
    const suspiciousChars = /["*:<>?|]/;
    if (suspiciousChars.test(targetPath)) {
      throw new Error(`Invalid characters in path: ${targetPath} contains forbidden characters`);
    }
  }

  /**
   * Validates path normalization to detect encoding issues
   * @param targetPath - Target path to validate
   * @throws Error if normalization issues are detected
   */
  private static validatePathNormalization(targetPath: string): void {
    const normalizedPath = normalize(targetPath);
    if (normalizedPath !== targetPath && targetPath.includes('//')) {
      throw new Error(`Path normalization issue detected in: ${targetPath}`);
    }
  }
}
