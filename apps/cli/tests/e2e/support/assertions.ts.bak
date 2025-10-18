import { expect } from 'bun:test';
import type { CliResult } from './cli-runner';

/**
 * CLI-specific assertions for E2E tests
 */
export class CliAssertions {
  constructor(private readonly result: CliResult) {}

  /**
   * Assert exit code
   */
  exitCode(expected: number): this {
    expect(this.result.exitCode).toBe(expected);
    return this;
  }

  /**
   * Assert success (exit code 0)
   */
  success(): this {
    return this.exitCode(0);
  }

  /**
   * Assert failure (non-zero exit code)
   */
  failure(): this {
    expect(this.result.exitCode).not.toBe(0);
    return this;
  }

  /**
   * Assert stdout contains text
   */
  stdoutContains(text: string): this {
    expect(this.result.stdout).toContain(text);
    return this;
  }

  /**
   * Assert stdout matches regex
   */
  stdoutMatches(pattern: RegExp): this {
    expect(this.result.stdout).toMatch(pattern);
    return this;
  }

  /**
   * Assert stderr contains text
   */
  stderrContains(text: string): this {
    expect(this.result.stderr).toContain(text);
    return this;
  }

  /**
   * Assert stderr matches regex
   */
  stderrMatches(pattern: RegExp): this {
    expect(this.result.stderr).toMatch(pattern);
    return this;
  }

  /**
   * Assert stderr is empty
   */
  noStderr(): this {
    expect(this.result.stderr.trim()).toBe('');
    return this;
  }

  /**
   * Assert execution completed within time limit (ms)
   */
  completedWithin(maxMs: number): this {
    expect(this.result.duration).toBeLessThan(maxMs);
    return this;
  }

  /**
   * Assert stderr does not contain text
   */
  stderrNotContains(text: string): this {
    expect(this.result.stderr).not.toContain(text);
    return this;
  }

  /**
   * Assert stdout does not contain text
   */
  stdoutNotContains(text: string): this {
    expect(this.result.stdout).not.toContain(text);
    return this;
  }

  /**
   * Assert specific exit code (e.g., 130 for SIGINT)
   */
  exitCodeIs(expected: number): this {
    return this.exitCode(expected);
  }

  /**
   * Get raw result for custom assertions
   */
  raw(): CliResult {
    return this.result;
  }
}

/**
 * Create assertion helper for CLI result
 */
export function assertCli(result: CliResult): CliAssertions {
  return new CliAssertions(result);
}
