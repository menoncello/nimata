/**
 * Test Data Factory [T900]
 *
 * Factory functions for generating test data with cryptographically secure randomness.
 * Eliminates hardcoded test data and ensures parallel-safe tests.
 * Priority: P2 - Test infrastructure improvement
 */

import { randomInt } from 'node:crypto';

/**
 * Creates a temporary directory path with unique name
 * Using cryptographically secure random values for test isolation
 */
export function createTempDirectoryPath(): string {
  const timestamp = Date.now();
  // Using cryptographically secure random values for unique directory names
  const random = randomInt(0, 1000000).toString(36);
  return `/tmp/nimata-test-${timestamp}-${random}`;
}

/**
 * Creates test project configuration data
 */
export function createProjectConfig(overrides: Partial<ProjectConfig> = {}): ProjectConfig {
  const timestamp = Date.now();
  // Using cryptographically secure random values for unique project names
  const random = randomInt(0, 1000000).toString(36);

  return {
    projectName: `test-project-${timestamp}-${random}`,
    description: 'Test project generated via factory',
    version: '1.0.0',
    author: 'Test User',
    license: 'MIT',
    repository: `https://github.com/test/test-project-${timestamp}-${random}.git`,
    keywords: ['test', 'factory-generated'],
    ...overrides,
  };
}

/**
 * Creates CLI execution arguments
 */
export function createCLIArgs(overrides: Partial<CLIArgs> = {}): CLIArgs {
  return {
    command: 'init',
    flags: [],
    options: {},
    ...overrides,
  };
}

/**
 * Creates mock command configuration
 */
export function createCommandConfig(overrides: Partial<CommandConfig> = {}): CommandConfig {
  // Using cryptographically secure random values for unique command names
  const random = randomInt(0, 1000000).toString(36);

  return {
    name: `test-command-${random}`,
    description: 'Test command generated via factory',
    alias: `tc-${random.substring(0, 3)}`,
    options: [
      {
        name: 'config',
        alias: 'c',
        description: 'Configuration file path',
        type: 'string',
        required: false,
      },
    ],
    ...overrides,
  };
}

/**
 * Creates file system test data
 */
export function createFileData(overrides: Partial<FileData> = {}): FileData {
  const timestamp = Date.now();

  return {
    name: `test-file-${timestamp}.txt`,
    content: 'Test file content generated via factory',
    size: 100,
    encoding: 'utf-8',
    ...overrides,
  };
}

// Type definitions for factory functions
interface ProjectConfig {
  projectName: string;
  description: string;
  version: string;
  author: string;
  license: string;
  repository: string;
  keywords: string[];
}

interface CLIArgs {
  command: string;
  flags: string[];
  options: Record<string, any>;
}

interface CommandConfig {
  name: string;
  description: string;
  alias: string;
  options: Array<{
    name: string;
    alias: string;
    description: string;
    type: string;
    required: boolean;
  }>;
}

interface FileData {
  name: string;
  content: string;
  size: number;
  encoding: string;
}
