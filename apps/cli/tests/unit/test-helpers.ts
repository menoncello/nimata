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
  // Track method calls and arguments
  public calls: Record<string, unknown[][]> = {};

  private trackCall(method: string, args: unknown[]): void {
    if (!this.calls[method]) {
      this.calls[method] = [];
    }
    this.calls[method].push(args);
  }

  create(argv?: string[]): CliBuilder {
    this.trackCall('create', [argv]);
    return this;
  }
  scriptName(name?: string): CliBuilder {
    this.trackCall('scriptName', [name]);
    return this;
  }
  version(version?: string): CliBuilder {
    this.trackCall('version', [version]);
    return this;
  }
  usage(usage?: string): CliBuilder {
    this.trackCall('usage', [usage]);
    return this;
  }
  command(command?: unknown): CliBuilder {
    this.trackCall('command', [command]);
    return this;
  }
  option(key?: string, options?: unknown): CliBuilder {
    this.trackCall('option', [key, options]);
    return this;
  }
  demandCommand(min?: number, minMsg?: string): CliBuilder {
    this.trackCall('demandCommand', [min, minMsg]);
    return this;
  }
  help(enable?: boolean | string): CliBuilder {
    this.trackCall('help', [enable]);
    return this;
  }
  alias(key?: string, value?: string): CliBuilder {
    this.trackCall('alias', [key, value]);
    return this;
  }
  strict(enable?: boolean): CliBuilder {
    this.trackCall('strict', [enable]);
    return this;
  }
  wrap(enable?: boolean | number): CliBuilder {
    this.trackCall('wrap', [enable]);
    return this;
  }
  epilogue(epilogue?: string): CliBuilder {
    this.trackCall('epilogue', [epilogue]);
    return this;
  }
  exitProcess(enable?: boolean): CliBuilder {
    this.trackCall('exitProcess', [enable]);
    return this;
  }
  showHelpOnFail(enable?: boolean, message?: string): CliBuilder {
    this.trackCall('showHelpOnFail', [enable, message]);
    return this;
  }
  fail(enable?: boolean): CliBuilder {
    this.trackCall('fail', [enable]);
    return this;
  }
  async parse(): Promise<void> {
    this.trackCall('parse', []);
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
