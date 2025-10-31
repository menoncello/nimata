import { spawn } from 'bun';
import { join } from 'node:path';

/**
 * Result from executing a CLI command
 */
export interface CliResult {
  exitCode: number | null;
  stdout: string;
  stderr: string;
  duration: number;
}

/**
 * Options for CLI execution
 */
export interface CliRunOptions {
  cwd?: string;
  env?: Record<string, string>;
  timeout?: number;
  stdin?: string;
}

/**
 * CLI runner for E2E tests
 * Spawns actual nimata process and captures output
 */
export class CliRunner {
  private readonly binPath: string;

  constructor(binPath?: string) {
    // Default to local bin/nimata
    this.binPath = binPath ?? join(import.meta.dir, '../../../bin/nimata');
  }

  /**
   * Execute CLI command and return result
   */
  async run(args: string[], options: CliRunOptions = {}): Promise<CliResult> {
    const startTime = performance.now();

    const proc = spawn({
      cmd: [this.binPath, ...args],
      cwd: options.cwd ?? process.cwd(),
      env: {
        ...process.env,
        ...options.env,
        // Disable color output for easier assertion
        NO_COLOR: '1',
      },
      stdin: 'pipe',
      stdout: 'pipe',
      stderr: 'pipe',
    });

    // Send stdin if provided
    if (options.stdin) {
      proc.stdin.write(options.stdin);
      proc.stdin.end();
    }

    // Handle timeout
    const timeoutMs = options.timeout ?? 30_000;
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        proc.kill();
        reject(new Error(`CLI command timed out after ${timeoutMs}ms`));
      }, timeoutMs);
    });

    try {
      const result = await Promise.race([proc.exited, timeoutPromise]);

      const stdout = await new Response(proc.stdout as ReadableStream<Uint8Array>).text();
      const stderr = await new Response(proc.stderr as ReadableStream<Uint8Array>).text();
      const duration = performance.now() - startTime;

      return {
        exitCode: result,
        stdout,
        stderr,
        duration,
      };
    } catch (error) {
      // Timeout or other error
      proc.kill();
      throw error;
    }
  }

  /**
   * Run and assert successful execution (exit code 0)
   */
  async runSuccess(args: string[], options: CliRunOptions = {}): Promise<CliResult> {
    const result = await this.run(args, options);
    if (result.exitCode !== 0) {
      throw new Error(
        `Command failed with exit code ${result.exitCode}\nstdout: ${result.stdout}\nstderr: ${result.stderr}`
      );
    }
    return result;
  }

  /**
   * Run and assert failure (non-zero exit code)
   */
  async runFailure(
    args: string[],
    expectedExitCode?: number,
    options: CliRunOptions = {}
  ): Promise<CliResult> {
    const result = await this.run(args, options);
    if (result.exitCode === 0) {
      throw new Error(`Expected command to fail but it succeeded\nstdout: ${result.stdout}`);
    }
    if (expectedExitCode !== undefined && result.exitCode !== expectedExitCode) {
      throw new Error(`Expected exit code ${expectedExitCode} but got ${result.exitCode}`);
    }
    return result;
  }
}

/**
 * Create CLI runner instance for tests
 */
export function createCliRunner(binPath?: string): CliRunner {
  return new CliRunner(binPath);
}
