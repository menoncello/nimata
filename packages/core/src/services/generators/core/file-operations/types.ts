/**
 * File Operations Types
 *
 * Type definitions for file and directory operations
 */

export interface DirectoryItem {
  path: string;
  type: 'directory' | 'file';
  content?: string;
  executable?: boolean;
  mode?: number; // File permissions (e.g., STANDARD_DIR_PERMISSIONS for directories)
}

export interface FileCreationContext {
  itemPath: string;
  parentDir: string;
  fullPath: string;
  content?: string;
}
