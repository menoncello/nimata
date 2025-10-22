/**
 * File system utility functions for validation
 */

/**
 * Check if file exists
 * @param filePath - File path
 * @returns True if file exists
 */
export async function fileExists(filePath: string): Promise<boolean> {
  try {
    const { access } = await import('fs/promises');
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if directory exists
 * @param dirPath - Directory path
 * @returns True if directory exists
 */
export async function directoryExists(dirPath: string): Promise<boolean> {
  try {
    const { access } = await import('fs/promises');
    await access(dirPath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Read file content
 * @param filePath - File path
 * @returns File content as string
 */
export async function readFile(filePath: string): Promise<string> {
  const { readFile: fsReadFile } = await import('fs/promises');
  return fsReadFile(filePath, 'utf-8');
}
