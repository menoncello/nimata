import { join } from 'path';
import { spawn, type Subprocess } from 'bun';

/**
 * CLI Execution Helper
 *
 * Pure function for executing CLI commands in E2E tests.
 * Framework-agnostic - can be unit tested independently.
 */

export interface CLIExecutionOptions {
  /** Working directory (defaults to temp directory) */
  cwd?: string;
  /** Environment variables to merge with process.env */
  env?: Record<string, string>;
  /** Input to send to stdin */
  stdin?: string;
  /** Timeout in milliseconds (default: 30s) */
  timeout?: number;
  /** CLI arguments (e.g., ['init', '--yes']) */
  args: string[];
}

export interface CLIExecutionResult {
  /** Exit code from the process */
  exitCode: number;
  /** Standard output */
  stdout: string;
  /** Standard error */
  stderr: string;
  /** Combined output (stdout + stderr) */
  output: string;
  /** Execution time in milliseconds */
  executionTime: number;
}

/**
 * Execute CLI command and return structured result
 *
 * @example
 * const result = await executeCLI({
 *   args: ['init', '--yes'],
 *   cwd: tempDir,
 * });
 *
 * expect(result.exitCode).toBe(0);
 * expect(result.stdout).toContain('Project initialized');
 */
export async function executeCLI(options: CLIExecutionOptions): Promise<CLIExecutionResult> {
  const { args, cwd = process.cwd(), env = {}, stdin, timeout = 30_000 } = options;

  // Determine CLI binary path (handle monorepo structure)
  const rootDir = process.cwd().includes('/apps/cli')
    ? join(process.cwd(), '../..')
    : process.cwd();
  const cliBin = join(rootDir, 'apps/cli/bin/nimata');

  const startTime = Date.now();

  // Spawn CLI process
  const proc: Subprocess = spawn({
    cmd: [cliBin, ...args],
    cwd,
    env: { ...process.env, ...env },
    stdout: 'pipe',
    stderr: 'pipe',
    stdin: stdin ? 'pipe' : 'ignore',
  });

  // Write to stdin if provided
  if (stdin && proc.stdin) {
    proc.stdin.write(stdin);
    proc.stdin.end();
  }

  // Create timeout promise
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      proc.kill();
      reject(new Error(`CLI command timed out after ${timeout}ms: ${args.join(' ')}`));
    }, timeout);
  });

  // Wait for process to exit or timeout
  try {
    const exitCode = await Promise.race([proc.exited, timeoutPromise]);

    // Capture outputs
    const stdout = await new Response(proc.stdout).text();
    const stderr = await new Response(proc.stderr).text();
    const executionTime = Date.now() - startTime;

    return {
      exitCode: exitCode as number,
      stdout,
      stderr,
      output: stdout + stderr,
      executionTime,
    };
  } catch (error) {
    // Ensure process is killed on timeout
    proc.kill();
    throw error;
  }
}

/**
 * Execute CLI command and expect success (exit code 0)
 *
 * Throws if exit code is non-zero.
 *
 * @example
 * const result = await executeCLISuccess({
 *   args: ['validate'],
 *   cwd: tempDir,
 * });
 */
export async function executeCLISuccess(options: CLIExecutionOptions): Promise<CLIExecutionResult> {
  const result = await executeCLI(options);

  if (result.exitCode !== 0) {
    throw new Error(
      `CLI command failed with exit code ${result.exitCode}\n` +
        `Command: ${options.args.join(' ')}\n` +
        `Stdout: ${result.stdout}\n` +
        `Stderr: ${result.stderr}`
    );
  }

  return result;
}

/**
 * Execute CLI command and expect failure (non-zero exit code)
 *
 * Throws if exit code is 0.
 *
 * @example
 * const result = await executeCLIFailure({
 *   args: ['validate'],
 *   cwd: projectWithErrors,
 * });
 * expect(result.exitCode).toBe(1);
 */
export async function executeCLIFailure(options: CLIExecutionOptions): Promise<CLIExecutionResult> {
  const result = await executeCLI(options);

  if (result.exitCode === 0) {
    throw new Error(
      `Expected CLI command to fail but it succeeded\n` +
        `Command: ${options.args.join(' ')}\n` +
        `Stdout: ${result.stdout}\n` +
        `Stderr: ${result.stderr}`
    );
  }

  return result;
}
