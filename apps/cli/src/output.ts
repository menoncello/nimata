/**
 * Output Wrapper - Console and Stream Abstraction
 *
 * Provides a mockable abstraction layer for stdout/stderr operations using DI.
 * This allows tests to suppress output without fighting against Yargs internals.
 */
import { injectable, singleton } from 'tsyringe';

/**
 * Interface for output operations
 */
export interface OutputWriter {
  /**
   * Write to stdout
   * @param {string} message - Message to write
   * @returns {void}
   */
  stdout: (message: string) => void;

  /**
   * Write to stderr
   * @param {string} message - Message to write
   * @returns {void}
   */
  stderr: (message: string) => void;

  /**
   * Log to console
   * @param {unknown[]} messages - Messages to log
   * @returns {void}
   */
  log: (...messages: unknown[]) => void;

  /**
   * Log error to console
   * @param {unknown[]} messages - Error messages to log
   * @returns {void}
   */
  error: (...messages: unknown[]) => void;

  /**
   * Log success message to console
   * @param {string} message - Success message to log
   * @returns {void}
   */
  success: (message: string) => void;

  /**
   * Log info message to console
   * @param {string} message - Info message to log
   * @returns {void}
   */
  info: (message: string) => void;
}

/**
 * Default implementation using real console and process streams
 */
@injectable()
@singleton()
export class ConsoleOutputWriter implements OutputWriter {
  stdout(message: string): void {
    process.stdout.write(message);
  }

  stderr(message: string): void {
    process.stderr.write(message);
  }

  log(...messages: unknown[]): void {
    process.stdout.write(`${messages.map(String).join(' ')}\n`);
  }

  error(...messages: unknown[]): void {
    process.stderr.write(`${messages.map(String).join(' ')}\n`);
  }

  success(message: string): void {
    process.stdout.write(`${message}\n`);
  }

  info(message: string): void {
    process.stdout.write(`${message}\n`);
  }
}

/**
 * Silent implementation for testing (no-op)
 */
@injectable()
export class SilentOutputWriter implements OutputWriter {
  stdout(_message: string): void {
    /* no-op for testing */
  }

  stderr(_message: string): void {
    /* no-op for testing */
  }

  log(..._messages: unknown[]): void {
    /* no-op for testing */
  }

  error(..._messages: unknown[]): void {
    /* no-op for testing */
  }

  success(_message: string): void {
    /* no-op for testing */
  }

  info(_message: string): void {
    /* no-op for testing */
  }
}
