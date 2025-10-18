/**
 * Shared Test Helpers and Mocks
 *
 * Common utilities for testing the CLI application
 */
import { spyOn } from 'bun:test';
import type { CliBuilder } from '../../src/cli-builder.js';
import type { OutputWriter } from '../../src/output.js';

// Mock OutputWriter for testing
export class MockOutputWriter implements OutputWriter {
  stdout(_message: string): void {
    /* Intentionally empty - test stub */
  }
  stderr(_message: string): void {
    /* Intentionally empty - test stub */
  }
  log(..._messages: unknown[]): void {
    /* Intentionally empty - test stub */
  }
  error(..._messages: unknown[]): void {
    /* Intentionally empty - test stub */
  }
  success(_message: string): void {
    /* Intentionally empty - test stub */
  }
  info(_message: string): void {
    /* Intentionally empty - test stub */
  }
}

// Mock CliBuilder for testing
export class MockCliBuilder implements CliBuilder {
  create(): CliBuilder {
    return this;
  }
  scriptName(): CliBuilder {
    return this;
  }
  version(): CliBuilder {
    return this;
  }
  usage(): CliBuilder {
    return this;
  }
  command(): CliBuilder {
    return this;
  }
  option(): CliBuilder {
    return this;
  }
  demandCommand(): CliBuilder {
    return this;
  }
  help(): CliBuilder {
    return this;
  }
  alias(): CliBuilder {
    return this;
  }
  strict(): CliBuilder {
    return this;
  }
  wrap(): CliBuilder {
    return this;
  }
  epilogue(): CliBuilder {
    return this;
  }
  exitProcess(): CliBuilder {
    return this;
  }
  showHelpOnFail(): CliBuilder {
    return this;
  }
  fail(): CliBuilder {
    return this;
  }
  async parse(): Promise<void> {
    /* Intentionally empty - test stub */
  }
}

// Helper to create exit mock
export const createExitMock = (): ReturnType<typeof spyOn> => {
  return spyOn(process, 'exit').mockImplementation(() => {
    throw new Error('process.exit called');
  });
};

// Helper to emit SIGINT for testing
export const emitSIGINT = (): void => {
  process.emit('SIGINT');
};

/**
 * Sleep utility for async testing
 */
export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Wait for condition with timeout
 */
export async function waitFor(
  condition: () => boolean,
  timeoutMs = 5000,
  intervalMs = 100
): Promise<void> {
  const startTime = Date.now();

  while (!condition()) {
    if (Date.now() - startTime > timeoutMs) {
      throw new Error(`Timeout waiting for condition after ${timeoutMs}ms`);
    }
    await sleep(intervalMs);
  }
}

/**
 * Capture console output during test execution
 */
export function captureConsole<T>(fn: () => T): {
  result: T;
  stdout: string[];
  stderr: string[];
} {
  const stdout: string[] = [];
  const stderr: string[] = [];

  const originalLog = console.log;
  const originalError = console.error;

  console.log = (...args: unknown[]) => {
    stdout.push(args.map(String).join(' '));
  };

  console.error = (...args: unknown[]) => {
    stderr.push(args.map(String).join(' '));
  };

  try {
    const result = fn();
    return { result, stdout, stderr };
  } finally {
    console.log = originalLog;
    console.error = originalError;
  }
}
