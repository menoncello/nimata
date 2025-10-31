/**
 * Core File Operations
 *
 * Handles basic file and directory operations with validation and error handling
 *
 * This module has been refactored from a single large file into smaller, focused modules
 * to improve maintainability and follow BunJS best practices.
 */

// Export types
export type { DirectoryItem, FileCreationContext } from './types.js';

// Export permission utilities
export {
  getTempDirPermissions,
  getTempFilePermissions,
  getDefaultDirPermissions,
  getDefaultFilePermissions,
  getDefaultExecutablePermissions,
  getTempPathPatterns,
} from './file-permissions.js';

// Export path validation utilities
export {
  validatePath,
  isValidTempDirectory,
  isPermissionError,
  createCreationError,
} from './path-validation.js';

// Export directory operations
export {
  createDirectories,
  createNestedDirectories,
  createDirectoriesWithGitkeep,
  createDirectoryWithPermissions,
  createStructureFromDirectoryItems,
  createDirectoryItemWithValidation,
} from './directory-operations.js';

// Export file operations
export {
  createFileItemWithValidation,
  executeWithPermissivePermissions,
} from './file-operations.js';

// Export CLI executable operations
export { createCliExecutable } from './cli-executable.js';

// Export utilities
export { normalizeDirectoryItems } from './utils.js';

// Import with aliases to avoid naming conflicts
import { createCliExecutable as _createCliExecutable } from './cli-executable.js';
import {
  createDirectories as _createDirectories,
  createNestedDirectories as _createNestedDirectories,
  createDirectoriesWithGitkeep as _createDirectoriesWithGitkeep,
  createDirectoryWithPermissions as _createDirectoryWithPermissions,
  createStructureFromDirectoryItems as _createStructureFromDirectoryItems,
} from './directory-operations.js';
import { executeWithPermissivePermissions as _executeWithPermissivePermissions } from './file-operations.js';
import {
  validatePath as _validatePath,
  isValidTempDirectory as _isValidTempDirectory,
} from './path-validation.js';
import type { DirectoryItem } from './types.js';
import { normalizeDirectoryItems as _normalizeDirectoryItems } from './utils.js';

/**
 * Core file operations handler
 *
 * This class maintains the same API as the original CoreFileOperations class
 * while internally using the modularized functions.
 */
export class CoreFileOperations {
  /**
   * Validates path to prevent directory traversal attacks and malicious path patterns
   * @param {string} basePath - Base path to validate against
   * @param {string} targetPath - Target path to validate
   * @throws Error if path validation fails
   */
  static validatePath(basePath: string, targetPath: string): void {
    _validatePath(basePath, targetPath);
  }

  /**
   * Validates if a path is a secure temporary directory with comprehensive security checks
   * @param {string} fullPath - Full path to validate
   * @returns {boolean} True if the path is a validated temporary directory
   */
  static isValidTempDirectory(fullPath: string): boolean {
    return _isValidTempDirectory(fullPath);
  }

  /**
   * Create directories with security validation
   * @param {string} basePath - Base path for directory creation
   * @param {string[]} directories - Array of directory paths to create
   * @throws Error if directory creation fails or path validation fails
   */
  static async createDirectories(basePath: string, directories: string[]): Promise<void> {
    await _createDirectories(basePath, directories);
  }

  /**
   * Create nested directory structure recursively
   * @param {string} basePath - Base path for directory creation
   * @param {string[]} nestedStructure - Array of nested directory paths
   * @throws Error if directory creation fails or path validation fails
   */
  static async createNestedDirectories(basePath: string, nestedStructure: string[]): Promise<void> {
    await _createNestedDirectories(basePath, nestedStructure);
  }

  /**
   * Create directories with .gitkeep files for empty directories
   * @param {string} basePath - Base path for directory creation
   * @param {string[]} directories - Array of directory paths to create with .gitkeep files
   * @throws Error if directory creation fails or path validation fails
   */
  static async createDirectoriesWithGitkeep(
    basePath: string,
    directories: string[]
  ): Promise<void> {
    await _createDirectoriesWithGitkeep(basePath, directories);
  }

  /**
   * Create directory structure from DirectoryItem array
   * @param {string} basePath - Base path where to create the structure
   * @param {DirectoryItem[]} structure - Array of DirectoryItem objects
   * @throws Error if structure creation fails or path validation fails
   */
  static async createStructureFromDirectoryItems(
    basePath: string,
    structure: DirectoryItem[]
  ): Promise<void> {
    await _createStructureFromDirectoryItems(basePath, structure);
  }

  /**
   * Create directory with specific permissions
   * @param {string} dirPath - Directory path to create
   * @param {number} mode - Permission mode (e.g., STANDARD_DIR_PERMISSIONS)
   * @throws Error if directory creation fails or path validation fails
   */
  static async createDirectoryWithPermissions(dirPath: string, mode: number): Promise<void> {
    await _createDirectoryWithPermissions(dirPath, mode);
  }

  /**
   * Create CLI executable file
   * @param {string} filePath - Path to the executable file
   * @param {string} content - Content of the executable file
   * @throws Error if file creation fails or path validation fails
   */
  static async createCliExecutable(filePath: string, content: string): Promise<void> {
    await _createCliExecutable(filePath, content);
  }

  /**
   * Execute an operation with permissive permissions in a secure context
   * @param {string} operation - Description of the operation for logging/security
   * @param {string} targetPath - Target path for the operation
   * @param {() => Promise<void>} callback - Function to execute with permissive permissions
   * @throws Error if operation fails or security validation fails
   */
  static async executeWithPermissivePermissions(
    operation: string,
    targetPath: string,
    callback: () => Promise<void>
  ): Promise<void> {
    await _executeWithPermissivePermissions(operation, targetPath, callback);
  }

  /**
   * Normalize DirectoryItems to ensure all directories and files have mode field
   * @param {DirectoryItem[]} items - Array of DirectoryItems to normalize
   * @returns {DirectoryItem[]} Normalized DirectoryItems
   */
  static normalizeDirectoryItems(items: DirectoryItem[]): DirectoryItem[] {
    return _normalizeDirectoryItems(items);
  }
}
