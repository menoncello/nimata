/**
 * File Assertion Helpers
 *
 * Helper functions for asserting file system state in tests.
 * Following the fixture architecture pattern with explicit cleanup.
 */

import { mkdir, writeFile, rm } from 'fs/promises';
import { join } from 'path';

/**
 * Creates a temporary directory path with unique name (synchronous)
 * Using Math.random() is acceptable for test isolation as we only need uniqueness
 */
export function createTempDirectoryPath(): string {
  const timestamp = Date.now();
  // Using Math.random() is safe here - we only need unique directory names for test isolation
  // eslint-disable-next-line sonarjs/pseudo-random
  const random = Math.random().toString(36).substring(2, 8);
  return `/tmp/nimata-test-${timestamp}-${random}`;
}

/**
 * Create a temporary directory for testing
 */
export async function createTempDirectory(prefix = 'test-'): Promise<string> {
  const tempDir = `/tmp/${prefix}-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
  await mkdir(tempDir, { recursive: true });
  return tempDir;
}

/**
 * Clean up a temporary directory
 */
export async function cleanupTempDirectory(tempDir: string): Promise<void> {
  try {
    await rm(tempDir, { recursive: true, force: true });
  } catch (error) {
    // Ignore cleanup errors
    console.warn(`Warning: Failed to cleanup ${tempDir}:`, error);
  }
}

/**
 * Assert that a directory exists
 */
export async function assertDirectoryExists(basePath: string, relativePath: string): Promise<void> {
  const fullPath = join(basePath, relativePath);
  try {
    await Bun.file(fullPath).text(); // This will throw if directory doesn't exist
  } catch {
    throw new Error(`Expected directory to exist: ${fullPath}`);
  }
}

/**
 * Assert that a file exists
 */
export async function assertFileExists(filePath: string): Promise<void> {
  try {
    await Bun.file(filePath).text(); // This will throw if file doesn't exist
  } catch {
    throw new Error(`Expected file to exist: ${filePath}`);
  }
}

/**
 * Assert that a file does not exist
 */
export async function assertFileNotExists(filePath: string): Promise<void> {
  try {
    await Bun.file(filePath).text();
    throw new Error(`Expected file NOT to exist: ${filePath}`);
  } catch (error) {
    // File doesn't exist, which is expected
    if ((error as Error).message.includes('Expected file NOT to exist')) {
      throw error;
    }
  }
}

/**
 * Assert file contains specific text
 */
export async function assertFileContains(filePath: string, expectedText: string): Promise<void> {
  const content = await Bun.file(filePath).text();
  if (!content.includes(expectedText)) {
    throw new Error(`File ${filePath} does not contain expected text: ${expectedText}`);
  }
}

/**
 * Assert file does not contain specific text
 */
export async function assertFileNotContains(
  filePath: string,
  unexpectedText: string
): Promise<void> {
  const content = await Bun.file(filePath).text();
  if (content.includes(unexpectedText)) {
    throw new Error(`File ${filePath} contains unexpected text: ${unexpectedText}`);
  }
}

/**
 * Assert JSON file contains specific key-value pair
 */
export async function assertJsonFileContains<T = unknown>(
  filePath: string,
  key: string,
  expectedValue: T
): Promise<void> {
  const content = await Bun.file(filePath).text();
  const data = JSON.parse(content);

  const keys = key.split('.');
  let current = data;

  for (const k of keys) {
    if (!(k in current)) {
      throw new Error(`JSON file ${filePath} does not contain key: ${key}`);
    }
    current = current[k];
  }

  if (current !== expectedValue) {
    throw new Error(
      `JSON file ${filePath} key ${key} has value ${current}, expected ${expectedValue}`
    );
  }
}

/**
 * Create a test file with content
 */
export async function createTestFile(filePath: string, content: string): Promise<void> {
  await writeFile(filePath, content, 'utf-8');
}

/**
 * Get file size in bytes
 */
export async function getFileSize(filePath: string): Promise<number> {
  try {
    const file = Bun.file(filePath);
    return file.size;
  } catch (error) {
    throw new Error(`Failed to get file size for ${filePath}: ${error}`);
  }
}

/**
 * Assert file size is within bounds
 */
export async function assertFileSizeWithin(
  filePath: string,
  minBytes: number,
  maxBytes: number
): Promise<void> {
  const size = await getFileSize(filePath);
  if (size < minBytes || size > maxBytes) {
    throw new Error(
      `File ${filePath} size ${size} bytes is outside bounds [${minBytes}, ${maxBytes}]`
    );
  }
}
