/**
 * File Operations Utilities
 *
 * Utility functions for file and directory operations
 */
import {
  getDefaultDirPermissions,
  getDefaultFilePermissions,
  getDefaultExecutablePermissions,
} from './file-permissions.js';
import type { DirectoryItem } from './types.js';

/**
 * Normalize DirectoryItems to ensure all directories and files have mode field
 * @param {DirectoryItem[]} items - Array of DirectoryItems to normalize
 * @returns {DirectoryItem[]} Normalized DirectoryItems
 */
export function normalizeDirectoryItems(items: DirectoryItem[]): DirectoryItem[] {
  // First, normalize all items to ensure they have proper modes
  const normalizedItems = items.map((item) => {
    if (item.type === 'directory' && item.mode === undefined) {
      return { ...item, mode: getDefaultDirPermissions() };
    }
    if (item.type === 'file' && item.mode === undefined) {
      // Files should have executable permissions if executable, otherwise standard file permissions
      const defaultMode = item.executable
        ? getDefaultExecutablePermissions()
        : getDefaultFilePermissions();
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
