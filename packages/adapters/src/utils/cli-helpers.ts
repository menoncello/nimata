/**
 * CLI Helper Utilities
 *
 * Provides enhanced error handling, formatting, and user feedback for CLI operations
 */

import { CLIErrorHandler } from './cli-error-handler.js';
import { formatFileSize, formatDuration, formatList } from './cli-formatting.js';
import { ConsoleOutput } from './console-output.js';
import { JSON_SERIALIZATION, DEBUG_JSON_SPACING } from './constants.js';
import { Progress, Spinner } from './progress';

export interface CLIError extends Error {
  code?: string;
  type?: 'validation' | 'system' | 'network' | 'permission' | 'user';
  suggestions?: string[];
  exitCode?: number;
}

export interface CLIOptions {
  verbose?: boolean;
  silent?: boolean;
  json?: boolean;
  color?: boolean;
}

/**
 * Enhanced CLI Logger
 */
/**
 * Default spacing constants to avoid magic numbers
 */
const DEFAULT_SPACING = {
  JSON: 2,
  INDENTATION: 2,
} as const;

/**
 *
 */
export class CLILogger {
  private verbose: boolean;
  private silent: boolean;
  private json: boolean;
  private color: boolean;
  private consoleOutput: ConsoleOutput;

  private readonly JSON_SPACING = DEFAULT_SPACING.JSON; // Standard JSON indentation
  private readonly STANDARD_INDENTATION = DEFAULT_SPACING.INDENTATION; // Standard indentation level

  /**
   * Creates a new CLILogger instance
   * @param {CLIOptions = {}} options - Optional CLI options for logger configuration
   * @returns {void} {void}
   */
  constructor(options: CLIOptions = {}) {
    this.verbose = options.verbose || false;
    this.silent = options.silent || false;
    this.json = options.json || false;
    this.color = options.color || false; // Default to false for emoji format

    // Create ConsoleOutput instance with the same color settings
    this.consoleOutput = new ConsoleOutput({
      useColor: this.color,
      usePrefixes: true,
    });
  }

  /**
   * Log info message
   * @param {string} message - Message to log
   * @returns {void} {void}
   */
  info(message: string): void {
    if (this.silent) return;

    if (this.json) {
      this.consoleOutput.log(
        JSON.stringify({ level: 'info', message }, null, JSON_SERIALIZATION.PRETTY_INDENT)
      );
    } else if (this.verbose) {
      // ConsoleOutput will add its own prefix, so just pass the message
      this.consoleOutput.info(message);
    }
    // In non-verbose mode, don't log info messages
  }

  /**
   * Log success message
   * @param {string} message - Message to log
   * @param {unknown} data - Optional data to include in JSON mode
   * @returns {void} {void}
   */
  success(message: string, data?: unknown): void {
    if (this.silent) return;

    if (this.json) {
      const output = { status: 'success', message };
      if (data) {
        Object.assign(output, { data });
      }
      this.consoleOutput.log(JSON.stringify(output, null, JSON_SERIALIZATION.PRETTY_INDENT));
    } else {
      this.consoleOutput.log(`✅ ${message}`);
    }
  }

  /**
   * Log warning message
   * @param {string} message - Message to log
   * @returns {void} {void}
   */
  warn(message: string): void {
    if (this.silent) return;

    if (this.json) {
      this.consoleOutput.log(
        JSON.stringify({ level: 'warn', message }, null, JSON_SERIALIZATION.PRETTY_INDENT)
      );
    } else {
      // ConsoleOutput will add its own prefix, so just pass the message
      this.consoleOutput.warn(message);
    }
  }

  /**
   * Log error message
   * @param {string} message - Message to log
   * @param {unknown} details - Optional error details
   * @param {boolean} _forceColor - Force colored output regardless of logger settings
   * @returns {void} {void}
   */
  error(message: string, details?: Error | CLIError, _forceColor?: boolean): void {
    if (this.silent) return;

    if (this.json) {
      this.consoleOutput.log(
        JSON.stringify({ level: 'error', message, details }, null, JSON_SERIALIZATION.PRETTY_INDENT)
      );
    } else {
      // ConsoleOutput will add its own prefix, so just pass the message
      this.consoleOutput.error(message);
      if (details && this.verbose) {
        this.logErrorDetails(details);
      }
    }
  }

  /**
   * Log error details with appropriate formatting
   * @param {Error | CLIError} details - Error details to log
   */
  private logErrorDetails(details: Error | CLIError): void {
    if (details instanceof Error) {
      this.consoleOutput.error(details.message);
      if (details.stack) {
        this.consoleOutput.error(details.stack);
      }
    } else {
      this.consoleOutput.error(JSON.stringify(details, null, this.JSON_SPACING));
    }
  }

  /**
   * Log verbose message
   * @param {string} message - Message to log
   * @returns {void} {void}
   */
  logVerbose(message: string): void {
    if (this.verbose && !this.silent) {
      if (this.json) {
        this.consoleOutput.log(
          JSON.stringify({ level: 'verbose', message }, null, JSON_SERIALIZATION.PRETTY_INDENT)
        );
      } else {
        const gray = this.color ? '\x1B[90m' : '';
        const reset = this.color ? '\x1B[0m' : '';
        this.consoleOutput.log(`${gray}${message}${reset}`);
      }
    }
  }

  /**
   * Log debug message
   * @param {string} message - Message to log
   * @param {unknown} data - Optional data to log
   * @returns {void} {void}
   */
  debug(message: string, data?: unknown): void {
    if (this.verbose && !this.silent) {
      if (this.json) {
        this.consoleOutput.log(
          JSON.stringify({ level: 'debug', message, data }, null, JSON_SERIALIZATION.PRETTY_INDENT)
        );
      } else {
        this.consoleOutput.log(`🔍 ${message}`);
        if (data) {
          this.consoleOutput.log(`   ${JSON.stringify(data, null, DEBUG_JSON_SPACING)}`);
        }
      }
    }
  }

  /**
   * Log step message
   * @param {number} current - Current step number
   * @param {number} total - Total number of steps
   * @param {string} message - Step message
   * @returns {void} {void}
   */
  step(current: number, total: number, message: string): void {
    if (this.silent) return;

    if (this.json) {
      this.consoleOutput.log(
        JSON.stringify(
          {
            level: 'step',
            step: current,
            total,
            message,
          },
          null,
          JSON_SERIALIZATION.PRETTY_INDENT
        )
      );
    } else {
      this.consoleOutput.step(current, total, message);
    }
  }

  /**
   * Create a spinner
   * @param {unknown} message - Optional message for the spinner
   * @returns {void} {string): Spinner} Spinner instance
   */
  spinner(message?: string): Spinner {
    if (this.silent || this.json) {
      return new SilentSpinner();
    }
    return new Spinner(message);
  }

  /**
   * Create progress indicator
   * @param {unknown} total - Total number of progress steps
   * @param {unknown} label - Optional label for the progress indicator
   * @returns {void} {void} Progress indicator instance
   */
  progress(
    total: number,
    label?: string
  ): SilentProgressIndicator | ReturnType<typeof Progress.create> {
    if (this.silent || this.json) {
      return new SilentProgressIndicator(total);
    }
    return Progress.create({ total, label });
  }

  /**
   * Print a section header
   * @param {string} title - Title of the section header
   * @returns {void} {void}
   */
  header(title: string): void {
    if (this.silent) return;

    if (this.json) {
      this.consoleOutput.log(
        JSON.stringify({ status: 'header', title }, null, JSON_SERIALIZATION.PRETTY_INDENT)
      );
    } else {
      this.consoleOutput.header(title);
    }
  }

  /**
   * Print a separator
   * @returns {void} {void}
   */
  separator(): void {
    if (this.silent) return;

    if (!this.json) {
      this.consoleOutput.separator();
    }
  }
}

/**
 * Silent Spinner for quiet modes
 */
class SilentSpinner extends Spinner {
  /**
   * Creates a new SilentSpinner instance
   * @returns {void} {void}
   */
  constructor() {
    super('');
  }

  /**
   * Start spinner (no-op for silent mode)
   * @returns {void} {void}
   */
  override start(): void {
    // No-op for silent mode
  }

  /**
   * Stop spinner (no-op for silent mode)
   * @returns {void} {void}
   */
  override stop(): void {
    // No-op for silent mode
  }

  /**
   * Mark spinner as succeeded (no-op for silent mode)
   * @param {unknown} _text - Optional success text (unused)
   * @returns {void} {void}
   */
  succeed(_text?: string): void {
    // No-op for silent mode
  }

  /**
   * Mark spinner as failed (no-op for silent mode)
   * @param {unknown} _text - Optional error text (unused)
   * @returns {void} {void}
   */
  fail(_text?: string): void {
    // No-op for silent mode
  }
}

/**
 * Silent Progress Indicator
 */
class SilentProgressIndicator {
  /**
   * Creates a new SilentProgressIndicator instance
   * @param {number} total - Total number of progress steps
   * @returns {void} {void}
   */
  constructor(private total: number) {}

  /**
   * Start progress indicator (no-op for silent mode)
   * @returns {void} {void}
   */
  start(): void {
    // No-op for silent mode
  }

  /**
   * Update progress (no-op for silent mode)
   * @param {number} _current - Current progress value (unused)
   * @returns {void} {void}
   */
  update(_current: number): void {
    // No-op for silent mode
  }

  /**
   * Finish progress indicator (no-op for silent mode)
   * @returns {void} {void}
   */
  finish(): void {
    // No-op for silent mode
  }
}

// Re-export CLIErrorHandler
export { CLIErrorHandler };

/**
 * CLI Utility Functions
 */
export const CLI = {
  /**
   * Create a logger with options
   * @param {unknown} options - Optional CLI options for logger configuration
   * @returns {void} {void} New CLILogger instance
   */
  logger: (options?: CLIOptions): CLILogger => {
    return new CLILogger(options);
  },

  /**
   * Create an error handler
   * @param {CLILogger} logger - Logger instance for error output
   * @returns {void} {void} New CLIErrorHandler instance
   */
  errorHandler: (logger: CLILogger): CLIErrorHandler => {
    return new CLIErrorHandler(logger);
  },

  /**
   * Format file size in human readable format
   * @param {unknown} bytes - File size in bytes
   * @returns {void} {void} Formatted file size string
   */
  formatFileSize,

  /**
   * Format duration in human readable format
   * @param {unknown} ms - Duration in milliseconds
   * @returns {void} {string, options: Partial<CLIError> =} Formatted duration string
   */
  formatDuration,

  /**
   * Format list with bullet points
   * @param {unknown} items - Array of strings to format
   * @param {unknown} bullet - Bullet character to use (default: '•')
   * @returns {void} {string, options: Partial<CLIError> =} Formatted list string
   */
  formatList,

  /**
   * Create a CLI error
   * @param {string} message - Error message
   * @param {Partial<CLIError> = {}} options - Additional error options
   * @returns {void} {void} CLIError instance
   */
  error: (message: string, options: Partial<CLIError> = {}): CLIError => {
    const error: CLIError = new Error(message) as CLIError;
    error.type = 'system';
    error.exitCode = 1;
    Object.assign(error, options);
    return error;
  },
};
