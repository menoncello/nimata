/**
 * Project Generation Orchestrator Helpers
 *
 * Helper functions for project generation process
 */

import { spawn, type ChildProcess } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve, normalize } from 'node:path';
import { CLILogger } from '../utils/cli-helpers.js';

// Constants to avoid magic numbers
const GIT_INIT_COMMAND = 'git';
const NPM_INSTALL_COMMAND = 'npm';

/**
 * Validate and sanitize a directory path to prevent path traversal attacks
 * @param path - The path to validate
 * @returns Normalized absolute path if valid, throws error if invalid
 */
function validateDirectoryPath(path: string): string {
  if (!path || typeof path !== 'string') {
    throw new Error('Invalid directory path: path must be a non-empty string');
  }

  // Normalize the path and resolve to absolute path
  const normalizedPath = normalize(path);
  const absolutePath = resolve(normalizedPath);

  // Check for path traversal attempts
  if (path.includes('..') || path.includes('~') || path.startsWith('/')) {
    throw new Error(`Invalid directory path: potentially unsafe path "${path}"`);
  }

  // Ensure the directory exists
  if (!existsSync(absolutePath)) {
    throw new Error(`Invalid directory path: directory does not exist "${absolutePath}"`);
  }

  return absolutePath;
}
const INSTALL_ARGS = ['install'];
const GIT_INIT_ARGS = ['init'];

// Interface for process execution context
interface ProcessExecutionContext {
  command: string;
  args: string[];
  logger: CLILogger;
  resolve: () => void;
}

/**
 * Setup process output handlers
 * @param process - Child process to setup
 * @param _context - Execution context with command info and callbacks (unused)
 * @returns Output accumulator
 */
function setupOutputHandlers(process: ChildProcess, _context: ProcessExecutionContext): string {
  let output = '';

  process.stdout?.on('data', (data: Buffer) => {
    output += data.toString();
  });

  process.stderr?.on('data', (data: Buffer) => {
    output += data.toString();
  });

  return output;
}

/**
 * Setup process completion handlers
 * @param process - Child process to setup
 * @param context - Execution context with command info and callbacks
 * @param output - Accumulated output for error reporting
 */
function setupCompletionHandlers(
  process: ChildProcess,
  context: ProcessExecutionContext,
  output: string
): void {
  const { command, args, logger, resolve } = context;

  process.on('close', (code: number) => {
    if (code === 0) {
      resolve();
    } else {
      logger.error(`Command failed: ${command} ${args.join(' ')} - ${output}`);
      resolve(); // Don't fail the entire process
    }
  });

  process.on('error', (error: Error) => {
    logger.error(`Failed to execute command: ${command} - ${error.message}`);
    resolve(); // Don't fail the entire process
  });
}

/**
 * Setup process event handlers
 * @param process - Child process to setup
 * @param context - Execution context with command info and callbacks
 */
function setupProcessHandlers(process: ChildProcess, context: ProcessExecutionContext): void {
  const output = setupOutputHandlers(process, context);
  setupCompletionHandlers(process, context, output);
}

/**
 * Execute a shell command in a specific directory
 * @param command - Command to execute
 * @param args - Arguments for the command
 * @param cwd - Working directory
 * @param logger - Logger instance
 * @returns Promise that resolves when command completes
 */
export function executeCommand(
  command: string,
  args: string[],
  cwd: string,
  logger: CLILogger
): Promise<void> {
  return new Promise((resolve) => {
    // Validate and sanitize the working directory path
    const validatedCwd = validateDirectoryPath(cwd);

    const process = spawn(command, args, {
      cwd: validatedCwd,
      stdio: 'pipe',
    });

    const context: ProcessExecutionContext = {
      command,
      args,
      logger,
      resolve,
    };

    setupProcessHandlers(process, context);
  });
}

/**
 * Install npm dependencies in project directory
 * @param projectDir - Project directory path
 * @param logger - Logger instance
 * @returns Promise that resolves when installation completes
 */
export async function installDependencies(projectDir: string, logger: CLILogger): Promise<void> {
  try {
    await executeCommand(NPM_INSTALL_COMMAND, INSTALL_ARGS, projectDir, logger);
    logger.success('Dependencies installed successfully');
  } catch (error) {
    logger.error(`Failed to install dependencies: ${error}`);
    throw error;
  }
}

/**
 * Initialize git repository in project directory
 * @param projectDir - Project directory path
 * @param logger - Logger instance
 * @returns Promise that resolves when git initialization completes
 */
export async function initializeGitRepository(
  projectDir: string,
  logger: CLILogger
): Promise<void> {
  try {
    await executeCommand(GIT_INIT_COMMAND, GIT_INIT_ARGS, projectDir, logger);
    logger.success('Git repository initialized');
  } catch (error) {
    logger.warn(`Git not available or failed to initialize: ${error}`);
    // Don't fail the entire process for git issues
  }
}

/**
 * Step definitions for project generation process
 */
export const PROJECT_GENERATION_STEP_DEFINITIONS = {
  VALIDATE_CONFIG: {
    description: 'Validating configuration...',
    weight: 1,
  },
  CREATE_DIRECTORIES: {
    description: 'Creating directory structure...',
    weight: 1,
  },
  GENERATE_PACKAGE_JSON: {
    description: 'Generating package.json...',
    weight: 1,
  },
  SETUP_TYPESCRIPT: {
    description: 'Setting up TypeScript...',
    weight: 2,
  },
  CONFIGURE_ESLINT: {
    description: 'Configuring ESLint...',
    weight: 1,
  },
  ADD_PRETTIER: {
    description: 'Adding Prettier...',
    weight: 1,
  },
  SETUP_TESTS: {
    description: 'Setting up tests...',
    weight: 1,
  },
  CONFIGURE_AI_ASSISTANTS: {
    description: 'Configuring AI assistants...',
    weight: 2,
  },
  CREATE_SOURCE_FILES: {
    description: 'Creating source files...',
    weight: 2,
  },
  VALIDATE_PROJECT: {
    description: 'Validating project...',
    weight: 1,
  },
} as const;
