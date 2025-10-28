/**
 * Directory Structure Assertion Helpers
 *
 * Helper functions for validating directory structure generation following
 * the test-quality principles from the knowledge base. These helpers provide
 * deterministic validation of generated directory structures.
 */

import { promises as fs, constants } from 'node:fs';
import { join } from 'node:path';

/**
 * Directory structure validation interface
 */
export interface DirectoryStructureValidation {
  path: string;
  exists: boolean;
  isDirectory: boolean;
  permissions?: string;
  content?: string;
  size?: number;
}

/**
 * Assert that a directory exists in the test project
 */
export async function assertDirectoryExists(
  testProjectPath: string,
  relativePath: string
): Promise<void> {
  const fullPath = join(testProjectPath, relativePath);
  const stats = await fs.stat(fullPath).catch(() => null);

  if (!stats) {
    throw new Error(`Expected directory to exist: ${relativePath}`);
  }

  if (!stats.isDirectory()) {
    throw new Error(`Expected path to be a directory: ${relativePath}`);
  }
}

/**
 * Assert that a file exists in the test project
 */
export async function assertFileExists(
  testProjectPath: string,
  relativePath: string
): Promise<void> {
  const fullPath = join(testProjectPath, relativePath);
  const stats = await fs.stat(fullPath).catch(() => null);

  if (!stats) {
    throw new Error(`Expected file to exist: ${relativePath}`);
  }

  if (!stats.isFile()) {
    throw new Error(`Expected path to be a file: ${relativePath}`);
  }
}

/**
 * Assert that a path does NOT exist (for testing exclusions)
 */
export async function assertPathNotExists(
  testProjectPath: string,
  relativePath: string
): Promise<void> {
  const fullPath = join(testProjectPath, relativePath);
  const exists = await fs.access(fullPath).then(
    () => true,
    () => false
  );

  if (exists) {
    throw new Error(`Expected path to NOT exist: ${relativePath}`);
  }
}

/**
 * Assert file content matches expected value
 */
export async function assertFileContent(
  testProjectPath: string,
  relativePath: string,
  expectedContent: string | RegExp
): Promise<void> {
  const fullPath = join(testProjectPath, relativePath);
  const content = await fs.readFile(fullPath, 'utf-8');

  if (typeof expectedContent === 'string') {
    if (!content.includes(expectedContent)) {
      throw new Error(
        `File ${relativePath} does not contain expected content: "${expectedContent}"`
      );
    }
  } else if (!expectedContent.test(content)) {
    throw new Error(
      `File ${relativePath} content does not match expected pattern: ${expectedContent}`
    );
  }
}

/**
 * Assert file permissions match expected value
 */
export async function assertFilePermissions(
  testProjectPath: string,
  relativePath: string,
  expectedMode: number
): Promise<void> {
  const fullPath = join(testProjectPath, relativePath);
  const stats = await fs.stat(fullPath);

  if ((stats.mode & 0o777) !== expectedMode) {
    throw new Error(
      `File ${relativePath} has incorrect permissions. Expected: ${expectedMode.toString(8)}, Got: ${(stats.mode & 0o777).toString(8)}`
    );
  }
}

/**
 * Assert directory has correct permissions (755 by default)
 */
export async function assertDirectoryPermissions(
  testProjectPath: string,
  relativePath: string,
  expectedMode = 0o755
): Promise<void> {
  const fullPath = join(testProjectPath, relativePath);
  const stats = await fs.stat(fullPath);

  if (!stats.isDirectory()) {
    throw new Error(`Path ${relativePath} is not a directory`);
  }

  if ((stats.mode & 0o777) !== expectedMode) {
    throw new Error(
      `Directory ${relativePath} has incorrect permissions. Expected: ${expectedMode.toString(8)}, Got: ${(stats.mode & 0o777).toString(8)}`
    );
  }
}

/**
 * Assert JSON file contains expected structure
 */
export async function assertJsonFileContains(
  testProjectPath: string,
  relativePath: string,
  expectedStructure: Record<string, unknown>
): Promise<void> {
  const fullPath = join(testProjectPath, relativePath);
  const content = await fs.readFile(fullPath, 'utf-8');
  const parsed = JSON.parse(content);

  for (const [key, value] of Object.entries(expectedStructure)) {
    if (!(key in parsed)) {
      throw new Error(`JSON file ${relativePath} missing expected key: ${key}`);
    }

    if (typeof value === 'object' && typeof parsed[key] === 'object') {
      // Deep comparison for objects
      assertJsonFileContains(testProjectPath, relativePath, value as Record<string, unknown>);
    } else if (parsed[key] !== value) {
      throw new Error(
        `JSON file ${relativePath} has incorrect value for key ${key}. Expected: ${JSON.stringify(value)}, Got: ${JSON.stringify(parsed[key])}`
      );
    }
  }
}

/**
 * Assert .gitignore contains expected patterns
 */
export async function assertGitignoreContains(
  testProjectPath: string,
  relativePath = '.gitignore',
  expectedPatterns: string[]
): Promise<void> {
  const fullPath = join(testProjectPath, relativePath);
  const content = await fs.readFile(fullPath, 'utf-8');

  expectedPatterns.forEach((pattern) => {
    if (!content.split('\n').some((line) => line.trim() === pattern.trim())) {
      throw new Error(`Gitignore file missing expected pattern: ${pattern}`);
    }
  });
}

/**
 * Assert file has proper shebang line
 */
export async function assertFileHasShebang(
  testProjectPath: string,
  relativePath: string,
  expectedShebang = '#!/usr/bin/env bun'
): Promise<void> {
  const fullPath = join(testProjectPath, relativePath);
  const content = await fs.readFile(fullPath, 'utf-8');
  const firstLine = content.split('\n')[0].trim();

  if (firstLine !== expectedShebang) {
    throw new Error(
      `File ${relativePath} has incorrect shebang. Expected: "${expectedShebang}", Got: "${firstLine}"`
    );
  }
}

/**
 * Validate complete directory structure
 */
export async function validateDirectoryStructure(
  testProjectPath: string,
  expectedStructure: {
    directories: string[];
    files: string[];
    fileContents?: Record<string, string>;
  }
): Promise<void> {
  // Validate directories exist
  for (const dir of expectedStructure.directories) {
    await assertDirectoryExists(testProjectPath, dir);
  }

  // Validate files exist
  for (const file of expectedStructure.files) {
    await assertFileExists(testProjectPath, file);
  }

  // Validate file contents if specified
  if (expectedStructure.fileContents) {
    for (const [file, expectedContent] of Object.entries(expectedStructure.fileContents)) {
      await assertFileContent(testProjectPath, file, expectedContent);
    }
  }
}

/**
 * Assert file is executable
 */
export async function assertFileIsExecutable(
  testProjectPath: string,
  relativePath: string
): Promise<void> {
  const fullPath = join(testProjectPath, relativePath);
  const stats = await fs.stat(fullPath);

  if (!(stats.mode & constants.S_IXUSR)) {
    throw new Error(`File ${relativePath} is not executable by owner`);
  }

  if (!(stats.mode & constants.S_IXGRP)) {
    throw new Error(`File ${relativePath} is not executable by group`);
  }

  if (!(stats.mode & constants.S_IXOTH)) {
    throw new Error(`File ${relativePath} is not executable by others`);
  }
}

/**
 * Create a validation result object for test debugging
 */
export async function createValidationResult(
  testProjectPath: string,
  pathsToValidate: string[]
): Promise<Record<string, DirectoryStructureValidation>> {
  const results: Record<string, DirectoryStructureValidation> = {};

  for (const relativePath of pathsToValidate) {
    const fullPath = join(testProjectPath, relativePath);
    try {
      const stats = await fs.stat(fullPath);
      let content: string | undefined;

      if (stats.isFile()) {
        content = await fs.readFile(fullPath, 'utf-8');
      }

      results[relativePath] = {
        path: relativePath,
        exists: true,
        isDirectory: stats.isDirectory(),
        size: stats.size,
        content,
      };
    } catch {
      results[relativePath] = {
        path: relativePath,
        exists: false,
        isDirectory: false,
      };
    }
  }

  return results;
}
