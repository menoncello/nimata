/**
 * Template File Scanner Utility
 *
 * Handles scanning directories for template files
 */
import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * Constants for template scanning
 */
const SCANNER_CONSTANTS = {
  TEMPLATE_EXTENSIONS: ['.hbs', '.handlebars', '.json', '.yaml', '.yml'] as string[],
  IGNORED_DIRECTORIES: ['node_modules', '.git', '.turbo', 'dist', 'build'] as string[],
} as const;

/**
 * Template file scanner utility class
 */
export class TemplateFileScanner {
  /**
   * Scan directory for template files
   * @param directory - Directory to scan
   * @returns Array of template file paths
   */
  static async scanDirectory(directory: string): Promise<string[]> {
    // Check if directory exists first
    try {
      await fs.access(directory, fs.constants.R_OK);
    } catch {
      throw new Error(`Directory not found: ${directory}`);
    }

    const templatePaths: string[] = [];
    await this.scanRecursive(directory, templatePaths);
    return templatePaths;
  }

  /**
   * Recursively scan directory for template files
   * @param dir - Directory to scan
   * @param templatePaths - Array to accumulate template paths
   */
  private static async scanRecursive(dir: string, templatePaths: string[]): Promise<void> {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });

      for (const entry of entries) {
        await this.processDirectoryEntry(entry, dir, templatePaths);
      }
    } catch (error) {
      console.warn(`Failed to scan directory ${dir}:`, error);
    }
  }

  /**
   * Process a single directory entry during scanning
   * @param entry - Directory entry to process
   * @param dir - Parent directory path
   * @param templatePaths - Array to accumulate template paths
   */
  private static async processDirectoryEntry(
    entry: import('fs').Dirent,
    dir: string,
    templatePaths: string[]
  ): Promise<void> {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory() && !this.isIgnoredDirectory(entry.name)) {
      await this.scanRecursive(fullPath, templatePaths);
      return;
    }

    if (entry.isFile() && this.isTemplateFile(entry.name)) {
      templatePaths.push(fullPath);
    }
  }

  /**
   * Check if a file is a template file based on its extension
   * @param fileName - Name of the file to check
   * @returns True if the file is a template file
   */
  static isTemplateFile(fileName: string): boolean {
    const ext = path.extname(fileName).toLowerCase();
    return SCANNER_CONSTANTS.TEMPLATE_EXTENSIONS.includes(ext) && !fileName.startsWith('.');
  }

  /**
   * Check if a directory should be ignored during scanning
   * @param dirName - Name of the directory to check
   * @returns True if the directory should be ignored
   */
  static isIgnoredDirectory(dirName: string): boolean {
    return SCANNER_CONSTANTS.IGNORED_DIRECTORIES.includes(dirName);
  }

  /**
   * Get file statistics for a template file
   * @param filePath - Path to the file
   * @returns File statistics
   */
  static async getFileStats(filePath: string): Promise<{
    size: number;
    lastModified: Date;
  }> {
    try {
      const stats = await fs.stat(filePath);
      return {
        size: stats.size,
        lastModified: stats.mtime,
      };
    } catch (error) {
      throw new Error(
        `Failed to get file stats for ${filePath}: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}
