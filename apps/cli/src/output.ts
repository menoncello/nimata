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
   * @param message - Message to write
   */
  stdout: (message: string) => void;

  /**
   * Write to stderr
   * @param message - Message to write
   */
  stderr: (message: string) => void;

  /**
   * Log to console
   * @param messages - Messages to log
   */
  log: (...messages: unknown[]) => void;

  /**
   * Log error to console
   * @param messages - Error messages to log
   */
  error: (...messages: unknown[]) => void;

  /**
   * Log success message to console
   * @param message - Success message to log
   */
  success: (message: string) => void;

  /**
   * Log info message to console
   * @param message - Info message to log
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
    console.log(...messages);
  }

  error(...messages: unknown[]): void {
    console.error(...messages);
  }

  success(message: string): void {
    console.log(message);
  }

  info(message: string): void {
    console.log(message);
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
