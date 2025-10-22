/**
 * CLI Formatting Utilities
 *
 * Provides formatting functions for CLI output
 */

// Constants for formatting
const BYTES_IN_KB = 1024;
const MS_IN_SECOND = 1000;
const MS_IN_MINUTE = 60000;

/**
 * Format file size in human readable format
 * @param bytes - File size in bytes
 * @returns Formatted file size string
 */
export function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= BYTES_IN_KB && unitIndex < units.length - 1) {
    size /= BYTES_IN_KB;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

/**
 * Format duration in human readable format
 * @param ms - Duration in milliseconds
 * @returns Formatted duration string
 */
export function formatDuration(ms: number): string {
  if (ms < MS_IN_SECOND) {
    return `${ms}ms`;
  } else if (ms < MS_IN_MINUTE) {
    return `${(ms / MS_IN_SECOND).toFixed(1)}s`;
  }
  const minutes = Math.floor(ms / MS_IN_MINUTE);
  const seconds = Math.floor((ms % MS_IN_MINUTE) / MS_IN_SECOND);
  return `${minutes}m ${seconds}s`;
}

/**
 * Format list with bullet points
 * @param items - Array of strings to format
 * @param bullet - Bullet character to use (default: '•')
 * @returns Formatted list string
 */
export function formatList(items: string[], bullet = '•'): string {
  return items.map((item) => `${bullet} ${item}`).join('\n');
}
