/**
 * Directory Operations
 *
 * Handles directory creation and management operations
 */
import { promises as fs } from 'node:fs';
import { join, resolve, relative } from 'node:path';
import {
  getTempDirPermissions,
  getDefaultDirPermissions,
  getDefaultFilePermissions,
  ALL_PERMISSIONS,
  STANDARD_DIR_PERMISSIONS,
} from './file-permissions.js';
import { validatePath, isValidTempDirectory } from './path-validation.js';
import type { DirectoryItem } from './types.js';

/**
 * Create directories with security validation
 * @param {string} basePath - Base path for directory creation
 * @param {string[]} directories - Array of directory paths to create
 * @throws Error if directory creation fails or path validation fails
 */
export async function createDirectories(basePath: string, directories: string[]): Promise<void> {
  if (!directories || directories.length === 0) {
    return;
  }

  for (const dir of directories) {
    // Validate path to prevent directory traversal attacks
    validatePath(basePath, dir);

    const fullPath = join(basePath, dir);

    try {
      await fs.mkdir(fullPath, { recursive: true, mode: getDefaultDirPermissions() });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to create directory '${dir}': ${error.message}`);
      }
      throw new Error(`Failed to create directory '${dir}': Unknown error`);
    }
  }
}

/**
 * Create nested directory structure recursively
 * @param {string} basePath - Base path for directory creation
 * @param {string[]} nestedStructure - Array of nested directory paths
 * @throws Error if directory creation fails or path validation fails
 */
export async function createNestedDirectories(
  basePath: string,
  nestedStructure: string[]
): Promise<void> {
  await createDirectories(basePath, nestedStructure);
}

/**
 * Create directories with .gitkeep files for empty directories
 * @param {string} basePath - Base path for directory creation
 * @param {string[]} directories - Array of directory paths to create with .gitkeep files
 * @throws Error if directory creation fails or path validation fails
 */
export async function createDirectoriesWithGitkeep(
  basePath: string,
  directories: string[]
): Promise<void> {
  // First create the directories
  await createDirectories(basePath, directories);

  // Then add .gitkeep files to each directory
  for (const dir of directories) {
    validatePath(basePath, dir);
    const gitkeepPath = join(basePath, dir, '.gitkeep');

    try {
      await fs.writeFile(gitkeepPath, '', { mode: getDefaultFilePermissions() });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to create .gitkeep file in '${dir}': ${error.message}`);
      }
      throw new Error(`Failed to create .gitkeep file in '${dir}': Unknown error`);
    }
  }
}

/**
 * Create directory with specific permissions
 * @param {string} dirPath - Directory path to create
 * @param {number} mode - Permission mode (e.g., STANDARD_DIR_PERMISSIONS)
 * @throws Error if directory creation fails or path validation fails
 */
export async function createDirectoryWithPermissions(dirPath: string, mode: number): Promise<void> {
  // Extract base path for validation (parent directory)
  const basePath = resolve(dirPath, '..');
  const dirName = relative(basePath, dirPath);

  validatePath(basePath, dirName);

  try {
    await fs.mkdir(dirPath, { recursive: true, mode });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to create directory with permissions: ${error.message}`);
    }
    throw new Error(`Failed to create directory with permissions: Unknown error`);
  }
}

/**
 * Create directory structure from DirectoryItem array
 * @param {string} basePath - Base path where to create the structure
 * @param {DirectoryItem[]} structure - Array of DirectoryItem objects
 * @throws Error if structure creation fails or path validation fails
 */
export async function createStructureFromDirectoryItems(
  basePath: string,
  structure: DirectoryItem[]
): Promise<void> {
  for (const item of structure) {
    await createDirectoryItem(basePath, item);
  }
}

/**
 * Create a single directory item (file or directory)
 * @param {string} basePath - Base path where to create the item
 * @param {DirectoryItem} item - DirectoryItem to create
 * @throws Error if item creation fails or path validation fails
 */
async function createDirectoryItem(basePath: string, item: DirectoryItem): Promise<void> {
  validatePath(basePath, item.path);
  const fullPath = join(basePath, item.path);

  if (item.type === 'directory') {
    await createDirectoryItemWithValidation(item.path, fullPath, item.mode);
  } else if (item.type === 'file') {
    // Import here to avoid circular dependency
    const { createFileItemWithValidation } = await import('./file-operations.js');
    await createFileItemWithValidation(item.path, fullPath, item.content, item.mode);
  }
}

/**
 * Create directory with error handling and validation
 * @param {string} itemPath - Relative path of the directory
 * @param {string} fullPath - Full path where to create the directory
 * @param {number | undefined} mode - Permission mode for the directory
 * @throws Error if directory creation fails
 */
export async function createDirectoryItemWithValidation(
  itemPath: string,
  fullPath: string,
  mode?: number
): Promise<void> {
  try {
    // SECURITY: Validate if this is a secure temporary directory before using permissive permissions
    const isTempDir = isValidTempDirectory(fullPath);
    const dirMode = mode || (isTempDir ? getTempDirPermissions() : getDefaultDirPermissions());
    await fs.mkdir(fullPath, { recursive: true, mode: dirMode });
  } catch (error) {
    // Import here to avoid circular dependency
    const { isPermissionError, createCreationError } = await import('./path-validation.js');

    // If permission denied, retry with fallback permissions
    if (error instanceof Error && isPermissionError(error)) {
      try {
        const isTempDir = isValidTempDirectory(fullPath);
        const fallbackMode = isTempDir ? ALL_PERMISSIONS : STANDARD_DIR_PERMISSIONS;
        await fs.mkdir(fullPath, { recursive: true, mode: fallbackMode });
        return;
      } catch (retryError) {
        throw createCreationError('directory', itemPath, retryError);
      }
    }

    throw createCreationError('directory', itemPath, error);
  }
}
