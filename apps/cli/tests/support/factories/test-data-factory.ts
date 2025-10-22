/**
 * Test Data Factory [T900]
 *
 * Factory functions for generating test data with controlled randomness.
 * Eliminates hardcoded test data and ensures parallel-safe tests.
 * Priority: P2 - Test infrastructure improvement
 */

/**
 * Creates a temporary directory path with unique name
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
 * Creates test project configuration data
 */
export function createProjectConfig(overrides: Partial<ProjectConfig> = {}): ProjectConfig {
  const timestamp = Date.now();
  // Using Math.random() is safe here - we only need unique project names for test isolation
  // eslint-disable-next-line sonarjs/pseudo-random
  const random = Math.random().toString(36).substring(2, 8);

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
  // Using Math.random() is safe here - we only need unique command names for test isolation
  // eslint-disable-next-line sonarjs/pseudo-random
  const random = Math.random().toString(36).substring(2, 8);

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
