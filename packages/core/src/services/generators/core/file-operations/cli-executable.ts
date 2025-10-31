/**
 * CLI Executable Operations
 *
 * Handles CLI executable file creation and management
 */
import { promises as fs } from 'node:fs';
import { resolve, relative } from 'node:path';
import {
  getTempDirPermissions,
  getTempFilePermissions,
  getDefaultDirPermissions,
  getDefaultExecutablePermissions,
} from './file-permissions.js';
import { validatePath, isValidTempDirectory, isPermissionError } from './path-validation.js';

/**
 * Create CLI executable file
 * @param {string} filePath - Path to the executable file
 * @param {string} content - Content of the executable file
 * @throws Error if file creation fails or path validation fails
 */
export async function createCliExecutable(filePath: string, content: string): Promise<void> {
  const basePath = resolve(filePath, '..');
  const fileName = relative(basePath, filePath);

  validatePath(basePath, fileName);

  // SECURITY: Validate if this is a secure temporary directory before using permissive permissions
  const isTempDir = isValidTempDirectory(filePath);

  try {
    await createCliExecutableParentDirectory(basePath, isTempDir);
    const fileMode = getExecutableFileMode(isTempDir);
    await fs.writeFile(filePath, content, { mode: fileMode });
  } catch (error) {
    await handleCliExecutableError(error, basePath, filePath, content);
  }
}

/**
 * Create parent directory for CLI executable
 * @param {string} basePath - Base directory path
 * @param {boolean} isTempDir - Whether this is a temp directory
 */
async function createCliExecutableParentDirectory(
  basePath: string,
  isTempDir: boolean
): Promise<void> {
  await fs.mkdir(basePath, {
    recursive: true,
    mode: isTempDir ? getTempDirPermissions() : getDefaultDirPermissions(),
  });
}

/**
 * Get appropriate file mode for CLI executable
 * @param {boolean} isTempDir - Whether this is a temp directory
 * @returns {number} File mode to use
 */
function getExecutableFileMode(isTempDir: boolean): number {
  return isTempDir ? getTempFilePermissions() : getDefaultExecutablePermissions();
}

/**
 * Handle CLI executable creation errors with retry logic
 * @param {unknown} error - Error that occurred
 * @param {string} basePath - Base directory path
 * @param {string} filePath - Full file path
 * @param {string} content - File content
 */
async function handleCliExecutableError(
  error: unknown,
  basePath: string,
  filePath: string,
  content: string
): Promise<void> {
  if (error instanceof Error && isPermissionError(error)) {
    try {
      await retryCliExecutableCreation(basePath, filePath, content);
      return;
    } catch (retryError) {
      throw createCliExecutableError(retryError);
    }
  }
  throw createCliExecutableError(error);
}

/**
 * Retry CLI executable creation with fallback permissions
 * @param {string} basePath - Base directory path
 * @param {string} filePath - Full file path
 * @param {string} content - File content
 */
async function retryCliExecutableCreation(
  basePath: string,
  filePath: string,
  content: string
): Promise<void> {
  // SECURITY: Use security wrapper for fallback permissions
  const { executeWithPermissivePermissions } = await import('./file-operations.js');
  await executeWithPermissivePermissions('retry CLI executable creation', filePath, async () => {
    await fs.mkdir(basePath, { recursive: true, mode: getTempDirPermissions() });
    await fs.writeFile(filePath, content, { mode: getTempFilePermissions() });
  });
}

/**
 * Create standardized CLI executable error
 * @param {unknown} error - Original error
 * @returns {Error} Formatted error message
 */
function createCliExecutableError(error: unknown): Error {
  if (error instanceof Error) {
    return new Error(`Failed to create CLI executable: ${error.message}`);
  }
  return new Error('Failed to create CLI executable: Unknown error');
}
