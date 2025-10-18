/**
 * CLI Process Factory
 *
 * Provides factory functions for creating CLI processes in E2E tests.
 * Reduces code duplication and provides consistent test setup.
 */

import { spawn, Subprocess } from 'bun';

/**
 * Creates a CLI process with common configuration
 */
export function createCLIProcess(
  args: string[] = [],
  options: {
    cwd?: string;
    stdout?: 'pipe' | 'inherit';
    stderr?: 'pipe' | 'inherit';
  } = {}
): Subprocess<'pipe', 'pipe'> {
  const { cwd = `${import.meta.dir}/../..`, stdout = 'pipe', stderr = 'pipe' } = options;

  return spawn({
    cmd: ['bun', './bin/nimata', ...args],
    cwd,
    stdout,
    stderr,
  });
}

/**
 * Creates a CLI process that captures output
 */
export function createCLIProcessWithCapture(
  args: string[] = [],
  options: { cwd?: string } = {}
): Subprocess<'pipe', 'pipe'> {
  return createCLIProcess(args, {
    ...options,
    stdout: 'pipe',
    stderr: 'pipe',
  });
}

/**
 * Creates a CLI process that inherits output (for debugging)
 */
export function createCLIProcessWithInherit(args: string[] = []): Subprocess<'pipe', 'pipe'> {
  return createCLIProcess(args, {
    stdout: 'inherit',
    stderr: 'inherit',
  });
}

/**
 * Executes a CLI command and returns the result
 */
export async function executeCLICommand(
  args: string[] = [],
  options: {
    cwd?: string;
    timeout?: number;
  } = {}
): Promise<{
  exitCode: number;
  stdout: string;
  stderr: string;
  success: boolean;
}> {
  const { cwd = `${import.meta.dir}/../..`, timeout = 5000 } = options;

  const proc = createCLIProcessWithCapture(args, { cwd });

  // Handle timeout
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Command timeout')), timeout);
  });

  try {
    await Promise.race([proc.exited, timeoutPromise]);
  } catch (error) {
    proc.kill();
    throw error;
  }

  const exitCode = await proc.exited;
  const stdout = await new Response(proc.stdout).text();
  const stderr = await new Response(proc.stderr).text();

  return {
    exitCode,
    stdout,
    stderr,
    success: exitCode === 0,
  };
}

/**
 * Creates CLI command args for common operations
 */
export const CLICommands = {
  init: ['init'],
  validate: ['validate'],
  fix: ['fix'],
  prompt: ['prompt'],
  help: ['--help'],
  version: ['--version'],
  config: ['--config'],
  initWithOptions: (options: string[]): string[] => ['init', ...options],
  validateWithOptions: (options: string[]): string[] => ['validate', ...options],
  fixWithOptions: (options: string[]): string[] => ['fix', ...options],
  promptWithOptions: (options: string[]): string[] => ['prompt', ...options],
};
