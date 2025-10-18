/**
 * Pure test helper functions
 * Framework-agnostic utilities
 */

/**
 * Strip ANSI color codes from string
 */
export function stripAnsi(text: string): string {
  const bellChar = String.fromCodePoint(7);
  const ansiPattern = new RegExp(
    `[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?${bellChar})|(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))`,
    'g'
  );
  return text.replace(ansiPattern, '');
}

/**
 * Normalize line endings to \n
 */
export function normalizeLineEndings(text: string): string {
  return text.replace(/\r\n/g, '\n');
}

/**
 * Parse JSON with helpful error message
 */
export function parseJsonSafe<T = unknown>(text: string): T {
  try {
    return JSON.parse(text) as T;
  } catch (error) {
    throw new Error(
      `Failed to parse JSON: ${error instanceof Error ? error.message : 'unknown error'}\nInput: ${text}`
    );
  }
}

/**
 * Wait for condition with timeout
 */
export async function waitFor(
  condition: () => boolean | Promise<boolean>,
  options: { timeout?: number; interval?: number } = {}
): Promise<void> {
  const timeout = options.timeout ?? 5000;
  const interval = options.interval ?? 100;
  const startTime = Date.now();

  while (!(await condition())) {
    if (Date.now() - startTime > timeout) {
      throw new Error(`Condition not met within ${timeout}ms`);
    }
    await new Promise((resolve) => setTimeout(resolve, interval));
  }
}

/**
 * Create mock console for capturing output
 */
export function createMockConsole(): {
  console: Console;
  stdout: string[];
  stderr: string[];
  clear: () => void;
} {
  const stdout: string[] = [];
  const stderr: string[] = [];

  const mockConsole = {
    log: (...args: unknown[]) => stdout.push(args.join(' ')),
    error: (...args: unknown[]) => stderr.push(args.join(' ')),
    warn: (...args: unknown[]) => stderr.push(args.join(' ')),
    info: (...args: unknown[]) => stdout.push(args.join(' ')),
    // Add missing Console properties with eslint-disable comments
    assert: () => {   },
    clear: () => {   },
    count: () => {   },
    countReset: () => {   },
    debug: (...args: unknown[]) => stdout.push(args.join(' ')),
    dir: () => {   },
    dirxml: () => {   },
    group: () => {   },
    groupCollapsed: () => {   },
    groupEnd: () => {   },
    table: () => {   },
    time: () => {   },
    timeEnd: () => {   },
    timeLog: () => {   },
    trace: (...args: unknown[]) => stdout.push(args.join(' ')),
    profile: () => {   },
    profileEnd: () => {   },
    timeStamp: () => {   },
    context: () => {   },
  } as unknown as Console;

  return {
    console: mockConsole,
    stdout,
    stderr,
    clear: () => {
      stdout.length = 0;
      stderr.length = 0;
    },
  };
}

/**
 * Measure async function execution time
 */
export async function measureTime<T>(
  fn: () => Promise<T>
): Promise<{ result: T; duration: number }> {
  const start = performance.now();
  const result = await fn();
  const duration = performance.now() - start;
  return { result, duration };
}

/**
 * Create deterministic timestamp for testing
 */
export function createTestDate(isoString = '2025-01-15T10:30:00.000Z'): Date {
  return new Date(isoString);
}

/**
 * Generate random test identifier
 */
export function createTestId(prefix = 'test'): string {
  return `${prefix}-${crypto.randomUUID().slice(0, 9)}`;
}
