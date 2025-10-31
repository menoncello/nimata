/**
 * CLI Executor Helper
 *
 * Provides test execution capabilities for the CLI application.
 * Implements proper mock/fake pattern for test isolation.
 */

import { spawn } from 'node:child_process';
import { join } from 'node:path';
import { createTempDirectory, cleanupTempDirectory } from './file-assertions.js';

export interface CLIExecutionResult {
  exitCode: number;
  stdout: string;
  stderr: string;
  command: string;
  duration: number;
}

export interface CLIExecutionOptions {
  cwd?: string;
  env?: Record<string, string>;
  timeout?: number;
  input?: string;
}

/**
 * Execute CLI command with proper isolation and timeout handling
 */
export async function executeCLI(
  args: string[],
  options: CLIExecutionOptions = {}
): Promise<CLIExecutionResult> {
  const startTime = Date.now();

  // Resolve CLI path - assume we're running from the repository root
  const cliPath = join(process.cwd(), 'apps/cli/src/index.ts');
  const bunPath = process.execPath; // Use current Bun executable

  // Default timeout
  const timeout = options.timeout ?? 30000; // 30 seconds default

  return new Promise((resolve, reject) => {
    let stdout = '';
    let stderr = '';

    const child = spawn(bunPath, [cliPath, ...args], {
      cwd: options.cwd ?? process.cwd(),
      env: { ...process.env, ...options.env },
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    // Set up timeout
    const timeoutHandle = setTimeout(() => {
      child.kill('SIGKILL');
      reject(new Error(`CLI execution timed out after ${timeout}ms`));
    }, timeout);

    // Collect output
    child.stdout?.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr?.on('data', (data) => {
      stderr += data.toString();
    });

    // Handle input if provided
    if (options.input) {
      child.stdin?.write(options.input);
      child.stdin?.end();
    }

    // Handle process completion
    child.on('close', (code) => {
      clearTimeout(timeoutHandle);
      const duration = Date.now() - startTime;

      resolve({
        exitCode: code ?? 1,
        stdout,
        stderr,
        command: `${bunPath} ${cliPath} ${args.join(' ')}`,
        duration,
      });
    });

    child.on('error', (error) => {
      clearTimeout(timeoutHandle);
      reject(error);
    });
  });
}

/**
 * Execute CLI command in temporary directory for isolated testing
 */
export async function executeCLIInTempDir(
  args: string[],
  options: Omit<CLIExecutionOptions, 'cwd'> = {}
): Promise<{ result: CLIExecutionResult; tempDir: string; cleanup: () => Promise<void> }> {
  const tempDir = await createTempDirectory('cli-test-');

  try {
    const result = await executeCLI(args, {
      ...options,
      cwd: tempDir,
    });

    return {
      result,
      tempDir,
      cleanup: () => cleanupTempDirectory(tempDir),
    };
  } catch (error) {
    // Ensure cleanup on error
    await cleanupTempDirectory(tempDir);
    throw error;
  }
}

/**
 * Mock CLI execution for testing without actual process spawning
 */
export class MockCLIExecutor {
  private responses: Map<string, Partial<CLIExecutionResult>> = new Map();

  /**
   * Register a mock response for specific arguments
   */
  setMockResponse(args: string[], response: Partial<CLIExecutionResult>): void {
    const key = args.join(' ');
    this.responses.set(key, {
      exitCode: 0,
      stdout: '',
      stderr: '',
      command: `mock ${args.join(' ')}`,
      duration: 0,
      ...response,
    });
  }

  /**
   * Execute with mocked response
   */
  async execute(args: string[]): Promise<CLIExecutionResult> {
    const key = args.join(' ');
    const mock = this.responses.get(key);

    if (!mock) {
      throw new Error(`No mock response registered for args: ${key}`);
    }

    // Simulate async execution
    await new Promise((resolve) => setTimeout(resolve, 10));

    return {
      exitCode: 0,
      stdout: '',
      stderr: '',
      command: `mock ${args.join(' ')}`,
      duration: 10,
      ...mock,
    };
  }

  /**
   * Clear all mock responses
   */
  clearMocks(): void {
    this.responses.clear();
  }

  /**
   * Check if mock response exists for given args
   */
  hasMock(args: string[]): boolean {
    return this.responses.has(args.join(' '));
  }
}

/**
 * Create a mock CLI executor with common test scenarios
 */
export function createMockCLIExecutor(): MockCLIExecutor {
  const executor = new MockCLIExecutor();

  // Common successful responses
  executor.setMockResponse(
    ['init', 'test-project', '--template', 'basic', '--quality', 'strict', '--nonInteractive'],
    {
      exitCode: 0,
      stdout: 'Project created successfully',
    }
  );

  executor.setMockResponse(
    ['init', 'test-web', '--template', 'web', '--quality', 'strict', '--nonInteractive'],
    {
      exitCode: 0,
      stdout: 'Web project created successfully',
    }
  );

  executor.setMockResponse(
    ['init', 'test-cli', '--template', 'cli', '--quality', 'strict', '--nonInteractive'],
    {
      exitCode: 0,
      stdout: 'CLI project created successfully',
    }
  );

  executor.setMockResponse(
    ['init', 'test-library', '--template', 'library', '--quality', 'strict', '--nonInteractive'],
    {
      exitCode: 0,
      stdout: 'Library project created successfully',
    }
  );

  // Error response
  executor.setMockResponse(['init', 'invalid-project'], {
    exitCode: 1,
    stderr: 'Error: Invalid project name',
  });

  return executor;
}
