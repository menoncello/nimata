/**
 * File Operations
 *
 * Handles file creation and management operations
 */
import { promises as fs } from 'node:fs';
import { resolve } from 'node:path';
import {
  getTempDirPermissions,
  getTempFilePermissions,
  getDefaultFilePermissions,
  ALL_PERMISSIONS,
  STANDARD_DIR_PERMISSIONS,
  STANDARD_FILE_PERMISSIONS,
  WRITABLE_FILE_PERMISSIONS,
} from './file-permissions.js';
import { isValidTempDirectory, isPermissionError, createCreationError } from './path-validation.js';
import type { FileCreationContext } from './types.js';

/**
 * Create file with error handling and validation
 * @param {string} itemPath - Relative path of the file
 * @param {string} fullPath - Full path where to create the file
 * @param {string | undefined} content - Content to write to the file
 * @param {number | undefined} mode - Permission mode for the file
 * @throws Error if file creation fails
 */
export async function createFileItemWithValidation(
  itemPath: string,
  fullPath: string,
  content?: string,
  mode?: number
): Promise<void> {
  // Ensure parent directory exists
  const parentDir = resolve(fullPath, '..');

  try {
    await createParentDirectory(parentDir);
    await writeFileWithPermissions(fullPath, content, mode);
  } catch (error) {
    await handleFileCreationError(error, {
      itemPath,
      parentDir,
      fullPath,
      content,
    });
  }
}

/**
 * Create parent directory with appropriate permissions
 * @param {string} parentDir - Parent directory path
 */
async function createParentDirectory(parentDir: string): Promise<void> {
  try {
    // SECURITY: Validate if this is a secure temporary directory before using permissive permissions
    const isTempDir = isValidTempDirectory(parentDir);
    const dirMode = isTempDir ? getTempDirPermissions() : getDefaultFilePermissions();

    await fs.mkdir(parentDir, {
      recursive: true,
      mode: dirMode,
    });
  } catch (error) {
    // If permission denied, retry with more permissive permissions
    if (error instanceof Error && isPermissionError(error)) {
      const isTempDir = isValidTempDirectory(parentDir);
      const fallbackMode = isTempDir ? ALL_PERMISSIONS : STANDARD_DIR_PERMISSIONS;
      await fs.mkdir(parentDir, {
        recursive: true,
        mode: fallbackMode,
      });
      return;
    }
    throw error;
  }
}

/**
 * Write file with appropriate permissions
 * @param {string} fullPath - Full file path
 * @param {string | undefined} content - File content
 * @param {number | undefined} mode - Optional file mode
 */
async function writeFileWithPermissions(
  fullPath: string,
  content?: string,
  mode?: number
): Promise<void> {
  // SECURITY: Validate if this is a secure temporary directory before using permissive permissions
  const isTempDir = isValidTempDirectory(fullPath);
  const fileMode = mode || (isTempDir ? getTempFilePermissions() : getDefaultFilePermissions());

  await fs.writeFile(fullPath, content || '', { mode: fileMode });
}

/**
 * Handle file creation errors with retry logic
 * @param {unknown} error - Original error
 * @param {FileCreationContext} context - File creation context
 */
async function handleFileCreationError(
  error: unknown,
  context: FileCreationContext
): Promise<void> {
  // If permission denied, try again with fallback permissions
  if (error instanceof Error && isPermissionError(error)) {
    try {
      await retryWithFallbackPermissions(context.parentDir, context.fullPath, context.content);
      return;
    } catch (retryError) {
      throw createCreationError('file', context.itemPath, retryError);
    }
  }
  throw createCreationError('file', context.itemPath, error);
}

/**
 * Retry file creation with fallback permissions
 * @param {string} parentDir - Parent directory path
 * @param {string} fullPath - Full file path
 * @param {string | undefined} content - File content
 */
async function retryWithFallbackPermissions(
  parentDir: string,
  fullPath: string,
  content?: string
): Promise<void> {
  try {
    // SECURITY: Use permissive permissions only for project directories, not system directories
    const isTempDir = isValidTempDirectory(fullPath);
    const dirPermissions = isTempDir ? getTempDirPermissions() : STANDARD_DIR_PERMISSIONS;
    const filePermissions = isTempDir ? getTempFilePermissions() : STANDARD_FILE_PERMISSIONS;

    // Retry with more permissive permissions
    await fs.mkdir(parentDir, { recursive: true, mode: dirPermissions });
    await fs.writeFile(fullPath, content || '', { mode: filePermissions });
  } catch (error) {
    // If still fails, try with maximum permissive permissions for project files
    if (error instanceof Error && isPermissionError(error)) {
      const isTempDir = isValidTempDirectory(fullPath);
      const maxDirPermissions = isTempDir ? ALL_PERMISSIONS : STANDARD_DIR_PERMISSIONS;
      const maxFilePermissions = isTempDir ? WRITABLE_FILE_PERMISSIONS : STANDARD_FILE_PERMISSIONS;

      await fs.mkdir(parentDir, { recursive: true, mode: maxDirPermissions });
      await fs.writeFile(fullPath, content || '', { mode: maxFilePermissions });
      return;
    }
    throw error;
  }
}

/**
 * Execute an operation with permissive permissions in a secure context
 * @param {string} operation - Description of the operation for logging/security
 * @param {string} targetPath - Target path for the operation
 * @param {() => Promise<void>} callback - Function to execute with permissive permissions
 * @throws Error if operation fails or security validation fails
 */
export async function executeWithPermissivePermissions(
  operation: string,
  targetPath: string,
  callback: () => Promise<void>
): Promise<void> {
  // SECURITY: Validate that this is a secure temporary operation
  if (!isValidTempDirectory(targetPath)) {
    throw new Error(`SECURITY: Permissive permissions not allowed for path: ${targetPath}`);
  }

  try {
    // Execute the operation with permissive permissions
    await callback();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to execute ${operation}: ${error.message}`);
    }
    throw new Error(`Failed to execute ${operation}: Unknown error`);
  }
}
