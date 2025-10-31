/**
 * File system utility functions for validation
 */

/**
 * Check if file exists
 * @param {string} filePath - File path
 * @returns {void} True if file exists
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
 * @param {string} dirPath - Directory path
 * @returns {void} True if directory exists
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
 * @param {string} filePath - File path
 * @returns {void} File content as string
 */
export async function readFile(filePath: string): Promise<string> {
  const { readFile: fsReadFile } = await import('fs/promises');
  return fsReadFile(filePath, 'utf-8');
}
