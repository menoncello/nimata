/**
 * Core File Operations
 *
 * Handles basic file and directory operations with validation and error handling
 */
import { promises as fs } from 'node:fs';
import { join, resolve, relative } from 'node:path';
import { DirectoryPathValidator } from '../validators/directory-path-validator.js';

// File permission constants
const DEFAULT_DIR_PERMISSIONS = 0o755;
const DEFAULT_FILE_PERMISSIONS = 0o644;
const DEFAULT_EXECUTABLE_PERMISSIONS = 0o755;

// More permissive permissions for temporary directories (macOS issues)
const TEMP_DIR_PERMISSIONS = 0o777;
const TEMP_FILE_PERMISSIONS = 0o666;

export interface DirectoryItem {
  path: string;
  type: 'directory' | 'file';
  content?: string;
  executable?: boolean;
  mode?: number; // File permissions (e.g., 0o755 for directories)
}

/**
 * Core file operations handler
 */
export class CoreFileOperations {
  /**
   * Validates path to prevent directory traversal attacks and malicious path patterns
   * @param basePath - Base path to validate against
   * @param targetPath - Target path to validate
   * @throws Error if path validation fails
   */
  static validatePath(basePath: string, targetPath: string): void {
    DirectoryPathValidator.validatePath(basePath, targetPath);
  }

  /**
   * Create directories with security validation
   * @param basePath - Base path for directory creation
   * @param directories - Array of directory paths to create
   * @throws Error if directory creation fails or path validation fails
   */
  static async createDirectories(basePath: string, directories: string[]): Promise<void> {
    if (!directories || directories.length === 0) {
      return;
    }

    for (const dir of directories) {
      // Validate path to prevent directory traversal attacks
      CoreFileOperations.validatePath(basePath, dir);

      const fullPath = join(basePath, dir);

      try {
        await fs.mkdir(fullPath, { recursive: true, mode: DEFAULT_DIR_PERMISSIONS });
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
   * @param basePath - Base path for directory creation
   * @param nestedStructure - Array of nested directory paths
   * @throws Error if directory creation fails or path validation fails
   */
  static async createNestedDirectories(basePath: string, nestedStructure: string[]): Promise<void> {
    await CoreFileOperations.createDirectories(basePath, nestedStructure);
  }

  /**
   * Create directories with .gitkeep files for empty directories
   * @param basePath - Base path for directory creation
   * @param directories - Array of directory paths to create with .gitkeep files
   * @throws Error if directory creation fails or path validation fails
   */
  static async createDirectoriesWithGitkeep(
    basePath: string,
    directories: string[]
  ): Promise<void> {
    // First create the directories
    await CoreFileOperations.createDirectories(basePath, directories);

    // Then add .gitkeep files to each directory
    for (const dir of directories) {
      CoreFileOperations.validatePath(basePath, dir);
      const gitkeepPath = join(basePath, dir, '.gitkeep');

      try {
        await fs.writeFile(gitkeepPath, '', { mode: DEFAULT_FILE_PERMISSIONS });
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Failed to create .gitkeep file in '${dir}': ${error.message}`);
        }
        throw new Error(`Failed to create .gitkeep file in '${dir}': Unknown error`);
      }
    }
  }

  /**
   * Create directory structure from DirectoryItem array
   * @param basePath - Base path where to create the structure
   * @param structure - Array of DirectoryItem objects
   * @throws Error if structure creation fails or path validation fails
   */
  static async createStructureFromDirectoryItems(
    basePath: string,
    structure: DirectoryItem[]
  ): Promise<void> {
    for (const item of structure) {
      await CoreFileOperations.createDirectoryItem(basePath, item);
    }
  }

  /**
   * Create a single directory item (file or directory)
   * @param basePath - Base path where to create the item
   * @param item - DirectoryItem to create
   * @throws Error if item creation fails or path validation fails
   */
  private static async createDirectoryItem(basePath: string, item: DirectoryItem): Promise<void> {
    CoreFileOperations.validatePath(basePath, item.path);
    const fullPath = join(basePath, item.path);

    if (item.type === 'directory') {
      await CoreFileOperations.createDirectoryItemWithValidation(item.path, fullPath, item.mode);
    } else if (item.type === 'file') {
      await CoreFileOperations.createFileItemWithValidation(
        item.path,
        fullPath,
        item.content,
        item.mode
      );
    }
  }

  /**
   * Create directory with error handling and validation
   * @param itemPath - Relative path of the directory
   * @param fullPath - Full path where to create the directory
   * @param mode - Permission mode for the directory
   * @throws Error if directory creation fails
   */
  private static async createDirectoryItemWithValidation(
    itemPath: string,
    fullPath: string,
    mode?: number
  ): Promise<void> {
    try {
      const isTempDir = fullPath.includes('/tmp/') || fullPath.includes('/var/folders/');
      const dirMode = mode || (isTempDir ? TEMP_DIR_PERMISSIONS : DEFAULT_DIR_PERMISSIONS);
      await fs.mkdir(fullPath, { recursive: true, mode: dirMode });
    } catch (error) {
      throw CoreFileOperations.createCreationError('directory', itemPath, error);
    }
  }

  /**
   * Create file with error handling and validation
   * @param itemPath - Relative path of the file
   * @param fullPath - Full path where to create the file
   * @param content - Content to write to the file
   * @param mode - Permission mode for the file
   * @throws Error if file creation fails
   */
  private static async createFileItemWithValidation(
    itemPath: string,
    fullPath: string,
    content?: string,
    mode?: number
  ): Promise<void> {
    // Ensure parent directory exists
    const parentDir = resolve(fullPath, '..');
    const isTempDir = fullPath.includes('/tmp/') || fullPath.includes('/var/folders/');

    try {
      await fs.mkdir(parentDir, {
        recursive: true,
        mode: isTempDir ? TEMP_DIR_PERMISSIONS : DEFAULT_DIR_PERMISSIONS,
      });
      const fileMode = mode || (isTempDir ? TEMP_FILE_PERMISSIONS : DEFAULT_FILE_PERMISSIONS);
      await fs.writeFile(fullPath, content || '', { mode: fileMode });
    } catch (error) {
      // If permission denied, try again with even more permissive permissions
      if (error instanceof Error && error.message.includes('EACCES')) {
        try {
          await fs.mkdir(parentDir, { recursive: true, mode: 0o777 });
          await fs.writeFile(fullPath, content || '', { mode: 0o666 });
          return;
        } catch (retryError) {
          throw CoreFileOperations.createCreationError('file', itemPath, retryError);
        }
      }
      throw CoreFileOperations.createCreationError('file', itemPath, error);
    }
  }

  /**
   * Create a standardized creation error
   * @param itemType - Type of item being created ('file' or 'directory')
   * @param itemPath - Path of the item
   * @param originalError - Original error that occurred
   * @returns Error with standardized message
   */
  private static createCreationError(
    itemType: string,
    itemPath: string,
    originalError: unknown
  ): Error {
    if (originalError instanceof Error) {
      return new Error(`Failed to create ${itemType} '${itemPath}': ${originalError.message}`);
    }
    return new Error(`Failed to create ${itemType} '${itemPath}': Unknown error`);
  }

  /**
   * Create directory with specific permissions
   * @param dirPath - Directory path to create
   * @param mode - Permission mode (e.g., 0o755)
   * @throws Error if directory creation fails or path validation fails
   */
  static async createDirectoryWithPermissions(dirPath: string, mode: number): Promise<void> {
    // Extract base path for validation (parent directory)
    const basePath = resolve(dirPath, '..');
    const dirName = relative(basePath, dirPath);

    CoreFileOperations.validatePath(basePath, dirName);

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
   * Create CLI executable file
   * @param filePath - Path to the executable file
   * @param content - Content of the executable file
   * @throws Error if file creation fails or path validation fails
   */
  static async createCliExecutable(filePath: string, content: string): Promise<void> {
    // Extract base path for validation
    const basePath = resolve(filePath, '..');
    const fileName = relative(basePath, filePath);

    CoreFileOperations.validatePath(basePath, fileName);

    try {
      // Ensure parent directory exists
      await fs.mkdir(basePath, { recursive: true, mode: DEFAULT_DIR_PERMISSIONS });
      await fs.writeFile(filePath, content, { mode: DEFAULT_EXECUTABLE_PERMISSIONS });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to create CLI executable: ${error.message}`);
      }
      throw new Error(`Failed to create CLI executable: Unknown error`);
    }
  }

  /**
   * Normalize DirectoryItems to ensure all directories and files have mode field
   * @param items - Array of DirectoryItems to normalize
   * @returns Normalized DirectoryItems
   */
  static normalizeDirectoryItems(items: DirectoryItem[]): DirectoryItem[] {
    // First, normalize all items to ensure they have proper modes
    const normalizedItems = items.map((item) => {
      if (item.type === 'directory' && item.mode === undefined) {
        return { ...item, mode: DEFAULT_DIR_PERMISSIONS };
      }
      if (item.type === 'file' && item.mode === undefined) {
        // Files should have executable permissions if executable, otherwise standard file permissions
        const defaultMode = item.executable
          ? DEFAULT_EXECUTABLE_PERMISSIONS
          : DEFAULT_FILE_PERMISSIONS;
        return { ...item, mode: defaultMode };
      }
      return item;
    });

    // Then, remove duplicate entries based on path and type
    return normalizedItems.filter(
      (item, index, self) =>
        index ===
        self.findIndex((otherItem) => otherItem.path === item.path && otherItem.type === item.type)
    );
  }
}
