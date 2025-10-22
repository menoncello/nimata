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
  /** Input to send to stdin (string or array of strings) */
  stdin?: string;
  /** Input lines to send to stdin (will be joined with empty strings) - convenience alias for stdin */
  input?: string[];
  /** Callback for output streaming */
  onOutput?: (output: string) => void;
  /** Command to execute (defaults to 'nimata' via bin) */
  command?: string;
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
function determineCliBinaryPath(): string {
  const rootDir = process.cwd().includes('/apps/cli')
    ? join(process.cwd(), '../..')
    : process.cwd();
  return join(rootDir, 'apps/cli/bin/nimata');
}

function createTimeoutPromise(timeout: number, args: string[], proc: Subprocess): Promise<never> {
  return new Promise<never>((_, reject) => {
    setTimeout(() => {
      proc.kill();
      reject(new Error(`CLI command timed out after ${timeout}ms: ${args.join(' ')}`));
    }, timeout);
  });
}

async function captureProcessOutput(proc: Subprocess): Promise<{ stdout: string; stderr: string }> {
  const stdout =
    proc.stdout && typeof proc.stdout !== 'number'
      ? await new Response(proc.stdout as ReadableStream<Uint8Array>).text()
      : '';
  const stderr =
    proc.stderr && typeof proc.stderr !== 'number'
      ? await new Response(proc.stderr as ReadableStream<Uint8Array>).text()
      : '';
  return { stdout, stderr };
}

function writeStdin(proc: Subprocess, stdin?: string): void {
  if (stdin && proc.stdin && typeof proc.stdin !== 'number') {
    proc.stdin.write(stdin);
    proc.stdin.end();
  }
}

export async function executeCLI(options: CLIExecutionOptions): Promise<CLIExecutionResult> {
  const { args, cwd = process.cwd(), env = {}, stdin, input, command, timeout = 30_000 } = options;

  // Convert input array to stdin string if provided
  const finalStdin = input ? input.join('') : stdin;

  // Determine command binary
  const cmdBin = command || determineCliBinaryPath();
  const startTime = Date.now();

  const proc: Subprocess = spawn({
    cmd: command ? [command, ...args] : [cmdBin, ...args],
    cwd,
    env: { ...process.env, ...env },
    stdout: 'pipe',
    stderr: 'pipe',
    stdin: finalStdin ? 'pipe' : 'ignore',
  });

  writeStdin(proc, finalStdin);

  const timeoutPromise = createTimeoutPromise(timeout, args, proc);

  try {
    const exitCode = await Promise.race([proc.exited, timeoutPromise]);
    const { stdout, stderr } = await captureProcessOutput(proc);
    const executionTime = Date.now() - startTime;

    return {
      exitCode: exitCode as number,
      stdout,
      stderr,
      output: stdout + stderr,
      executionTime,
    };
  } catch (error) {
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
