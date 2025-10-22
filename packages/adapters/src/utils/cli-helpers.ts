/**
 * CLI Helper Utilities
 *
 * Provides enhanced error handling, formatting, and user feedback for CLI operations
 */

import { CLIErrorHandler } from './cli-error-handler.js';
import { formatFileSize, formatDuration, formatList } from './cli-formatting.js';
import { JSON_SERIALIZATION } from './constants.js';
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

  private readonly JSON_SPACING = DEFAULT_SPACING.JSON; // Standard JSON indentation
  private readonly STANDARD_INDENTATION = DEFAULT_SPACING.INDENTATION; // Standard indentation level

  /**
   * Creates a new CLILogger instance
   * @param options - Optional CLI options for logger configuration
   * @returns {void}
   */
  constructor(options: CLIOptions = {}) {
    this.verbose = options.verbose || false;
    this.silent = options.silent || false;
    this.json = options.json || false;
    this.color = options.color !== false; // Default to true
  }

  /**
   * Log info message
   * @param message - Message to log
   * @returns {void}
   */
  info(message: string): void {
    if (this.silent) return;

    if (this.json) {
      console.log(
        JSON.stringify({ level: 'info', message }, null, JSON_SERIALIZATION.PRETTY_INDENT)
      );
    } else if (this.verbose) {
      console.log(`ℹ️ ${message}`);
    }
    // In non-verbose mode, don't log info messages
  }

  /**
   * Log success message
   * @param message - Message to log
   * @returns {void}
   */
  success(message: string): void {
    if (this.silent) return;

    if (this.json) {
      console.log(
        JSON.stringify({ status: 'success', message }, null, JSON_SERIALIZATION.PRETTY_INDENT)
      );
    } else {
      console.log(`✅ ${message}`);
    }
  }

  /**
   * Log warning message
   * @param message - Message to log
   * @returns {void}
   */
  warn(message: string): void {
    if (this.silent) return;

    if (this.json) {
      console.log(
        JSON.stringify({ level: 'warn', message }, null, JSON_SERIALIZATION.PRETTY_INDENT)
      );
    } else {
      console.warn(`⚠️ ${message}`);
    }
  }

  /**
   * Log error message
   * @param message - Message to log
   * @param details - Optional error details
   * @returns {void}
   */
  error(message: string, details?: Error | CLIError): void {
    if (this.silent) return;

    if (this.json) {
      console.log(
        JSON.stringify({ level: 'error', message, details }, null, JSON_SERIALIZATION.PRETTY_INDENT)
      );
    } else {
      console.error(`❌ ${message}`);
      if (details && this.verbose) {
        this.logErrorDetails(details);
      }
    }
  }

  /**
   * Log error details with appropriate formatting
   * @param details - Error details to log
   */
  private logErrorDetails(details: Error | CLIError): void {
    if (details instanceof Error) {
      console.error(details.message);
      if (details.stack) {
        console.error(details.stack);
      }
    } else {
      console.error(JSON.stringify(details, null, this.JSON_SPACING));
    }
  }

  /**
   * Log verbose message
   * @param message - Message to log
   * @returns {void}
   */
  logVerbose(message: string): void {
    if (this.verbose && !this.silent) {
      if (this.json) {
        console.log(
          JSON.stringify({ level: 'verbose', message }, null, JSON_SERIALIZATION.PRETTY_INDENT)
        );
      } else {
        const gray = this.color ? '\x1B[90m' : '';
        const reset = this.color ? '\x1B[0m' : '';
        console.log(`${gray}${message}${reset}`);
      }
    }
  }

  /**
   * Log debug message
   * @param message - Message to log
   * @param data - Optional data to log
   * @returns {void}
   */
  debug(message: string, data?: unknown): void {
    if (this.verbose && !this.silent) {
      if (this.json) {
        console.log(
          JSON.stringify({ level: 'debug', message, data }, null, JSON_SERIALIZATION.PRETTY_INDENT)
        );
      } else {
        console.log(`🔍 ${message}`);
        if (data) {
          console.log('   ', data);
        }
      }
    }
  }

  /**
   * Log step message
   * @param current - Current step number
   * @param total - Total number of steps
   * @param message - Step message
   * @returns {void}
   */
  step(current: number, total: number, message: string): void {
    if (this.silent) return;

    if (this.json) {
      console.log(
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
      console.log(`📍 (${current}/${total}) ${message}`);
    }
  }

  /**
   * Create a spinner
   * @param message - Optional message for the spinner
   * @returns Spinner instance
   */
  spinner(message?: string): Spinner {
    if (this.silent || this.json) {
      return new SilentSpinner();
    }
    return new Spinner(message);
  }

  /**
   * Create progress indicator
   * @param total - Total number of progress steps
   * @param label - Optional label for the progress indicator
   * @returns Progress indicator instance
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
   * @param title - Title of the section header
   * @returns {void}
   */
  header(title: string): void {
    if (this.silent) return;

    if (this.json) {
      console.log(
        JSON.stringify({ status: 'header', title }, null, JSON_SERIALIZATION.PRETTY_INDENT)
      );
    } else {
      const line = this.color ? '\x1B[36m' : ''; // Cyan
      const reset = this.color ? '\x1B[0m' : '';
      console.log(`\n${line}=== ${title} ===${reset}`);
    }
  }

  /**
   * Print a separator
   * @returns {void}
   */
  separator(): void {
    if (this.silent) return;

    if (!this.json) {
      console.log('');
    }
  }
}

/**
 * Silent Spinner for quiet modes
 */
class SilentSpinner extends Spinner {
  /**
   * Creates a new SilentSpinner instance
   * @returns {void}
   */
  constructor() {
    super('');
  }

  /**
   * Start spinner (no-op for silent mode)
   * @returns {void}
   */
  override start(): void {
    // No-op for silent mode
  }

  /**
   * Stop spinner (no-op for silent mode)
   * @returns {void}
   */
  override stop(): void {
    // No-op for silent mode
  }

  /**
   * Mark spinner as succeeded (no-op for silent mode)
   * @param _text - Optional success text (unused)
   * @returns {void}
   */
  succeed(_text?: string): void {
    // No-op for silent mode
  }

  /**
   * Mark spinner as failed (no-op for silent mode)
   * @param _text - Optional error text (unused)
   * @returns {void}
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
   * @param total - Total number of progress steps
   * @returns {void}
   */
  constructor(private total: number) {}

  /**
   * Start progress indicator (no-op for silent mode)
   * @returns {void}
   */
  start(): void {
    // No-op for silent mode
  }

  /**
   * Update progress (no-op for silent mode)
   * @param _current - Current progress value (unused)
   * @returns {void}
   */
  update(_current: number): void {
    // No-op for silent mode
  }

  /**
   * Finish progress indicator (no-op for silent mode)
   * @returns {void}
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
   * @param options - Optional CLI options for logger configuration
   * @returns New CLILogger instance
   */
  logger: (options?: CLIOptions): CLILogger => {
    return new CLILogger(options);
  },

  /**
   * Create an error handler
   * @param logger - Logger instance for error output
   * @returns New CLIErrorHandler instance
   */
  errorHandler: (logger: CLILogger): CLIErrorHandler => {
    return new CLIErrorHandler(logger);
  },

  /**
   * Format file size in human readable format
   * @param bytes - File size in bytes
   * @returns Formatted file size string
   */
  formatFileSize,

  /**
   * Format duration in human readable format
   * @param ms - Duration in milliseconds
   * @returns Formatted duration string
   */
  formatDuration,

  /**
   * Format list with bullet points
   * @param items - Array of strings to format
   * @param bullet - Bullet character to use (default: '•')
   * @returns Formatted list string
   */
  formatList,

  /**
   * Create a CLI error
   * @param message - Error message
   * @param options - Additional error options
   * @returns CLIError instance
   */
  error: (message: string, options: Partial<CLIError> = {}): CLIError => {
    const error: CLIError = new Error(message) as CLIError;
    error.type = 'system';
    error.exitCode = 1;
    Object.assign(error, options);
    return error;
  },
};
