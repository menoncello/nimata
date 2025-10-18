/**
 * Simple structured logger for configuration operations
 *
 * Provides debug and warn level logging with configurable output
 * Sensitive data is automatically masked in log messages
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  level: LogLevel;
  timestamp: string;
  operation: string;
  message: string;
  source?: string;
  fieldPath?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Simple structured logger with sensitive data masking
 */
export class Logger {
  private static instance: Logger;
  private logLevel: LogLevel;
  // eslint-disable-next-line no-magic-numbers
  private static readonly MIN_MASK_LENGTH = 4;
  // eslint-disable-next-line no-magic-numbers
  private static readonly MASK_PREFIX_LENGTH = 2;
  private static readonly FULL_MASK = '****';

  /**
   * Creates a new Logger instance
   * @param logLevel - Minimum log level to output (default: 'info')
   */
  private constructor(logLevel: LogLevel = 'info') {
    this.logLevel = logLevel;
  }

  /**
   * Get singleton logger instance
   * @param logLevel - Optional minimum log level (only used on first call)
   * @returns Logger singleton instance
   */
  static getInstance(logLevel?: LogLevel): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger(logLevel);
    }
    return Logger.instance;
  }

  /**
   * Log debug message
   * @param operation - Operation being logged
   * @param message - Log message
   * @param metadata - Optional metadata object
   */
  debug(operation: string, message: string, metadata?: Record<string, unknown>): void {
    this.log('debug', operation, message, metadata);
  }

  /**
   * Log info message
   * @param operation - Operation being logged
   * @param message - Log message
   * @param metadata - Optional metadata object
   */
  info(operation: string, message: string, metadata?: Record<string, unknown>): void {
    this.log('info', operation, message, metadata);
  }

  /**
   * Log warning message
   * @param operation - Operation being logged
   * @param message - Log message
   * @param metadata - Optional metadata object
   */
  warn(operation: string, message: string, metadata?: Record<string, unknown>): void {
    this.log('warn', operation, message, metadata);
  }

  /**
   * Log error message
   * @param operation - Operation being logged
   * @param message - Log message
   * @param metadata - Optional metadata object
   */
  error(operation: string, message: string, metadata?: Record<string, unknown>): void {
    this.log('error', operation, message, metadata);
  }

  /**
   * Internal logging method
   * @param level - Log level
   * @param operation - Operation being logged
   * @param message - Log message
   * @param metadata - Optional metadata object
   */
  private log(
    level: LogLevel,
    operation: string,
    message: string,
    metadata?: Record<string, unknown>
  ): void {
    const maskedMetadata = this.maskSensitiveData(metadata);
    const entry: LogEntry = {
      level,
      timestamp: new Date().toISOString(),
      operation,
      message,
      metadata: maskedMetadata,
    };

    // Only log if level meets threshold
    if (this.shouldLog(level)) {
      this.outputLog(entry);
    }
  }

  /**
   * Check if message should be logged based on level
   * @param level - Log level to check
   * @returns True if should log, false otherwise
   */
  private shouldLog(level: LogLevel): boolean {
    const levels: Record<LogLevel, number> = { debug: 0, info: 1, warn: 2, error: 3 };
    return levels[level] >= levels[this.logLevel];
  }

  /**
   * Output log entry to console
   * @param entry - Log entry to output
   */
  private outputLog(entry: LogEntry): void {
    const prefix = `[${entry.timestamp}] [${entry.level.toUpperCase()}] [${entry.operation}] ${entry.message}`;

    switch (entry.level) {
      case 'debug':
        console.debug(prefix, entry.metadata);
        break;
      case 'info':
        console.info(prefix, entry.metadata);
        break;
      case 'warn':
        if (entry.fieldPath) {
          console.warn(prefix, entry.fieldPath, entry.metadata);
        } else {
          console.warn(prefix, entry.metadata);
        }
        break;
      case 'error':
        console.error(prefix, entry.metadata);
        break;
    }
  }

  /**
   * Mask sensitive data in log metadata
   * @param metadata - Metadata object to mask
   * @returns Masked metadata object or undefined
   */
  private maskSensitiveData(
    metadata?: Record<string, unknown>
  ): Record<string, unknown> | undefined {
    if (!metadata) return undefined;

    const sensitiveKeys = ['password', 'token', 'secret', 'apikey', 'auth'];
    const masked: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(metadata)) {
      const lowerKey = key.toLowerCase();
      const isSensitive = sensitiveKeys.some(
        (sensitive) => lowerKey === sensitive || lowerKey.endsWith(sensitive)
      );

      if (isSensitive && typeof value === 'string') {
        masked[key] = this.maskValue(value);
      } else if (typeof value === 'object' && value !== null) {
        masked[key] = this.maskObject(value);
      } else {
        masked[key] = value;
      }
    }

    return masked;
  }

  /**
   * Mask a sensitive string value
   * @param value - String value to mask
   * @returns Masked string
   */
  private maskValue(value: string): string {
    if (value.length <= Logger.MIN_MASK_LENGTH) {
      return Logger.FULL_MASK;
    }
    const prefixLength = Logger.MASK_PREFIX_LENGTH;
    const suffixLength = Logger.MASK_PREFIX_LENGTH;
    return `${value.substring(0, prefixLength)}${Logger.FULL_MASK}${value.substring(value.length - suffixLength)}`;
  }

  /**
   * Recursively mask sensitive object properties
   * @param obj - Object to mask
   * @returns Masked object
   */
  private maskObject(obj: unknown): unknown {
    if (Array.isArray(obj)) {
      return obj.map((item) => this.maskObject(item));
    }

    if (typeof obj === 'object' && obj !== null) {
      const masked: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(obj)) {
        const lowerKey = key.toLowerCase();
        const isSensitive = ['password', 'token', 'secret', 'apikey', 'auth'].some(
          (sensitive) => lowerKey === sensitive || lowerKey.endsWith(sensitive)
        );

        masked[key] =
          isSensitive && typeof value === 'string' ? this.maskValue(value) : this.maskObject(value);
      }
      return masked;
    }

    return obj;
  }
}

/**
 * Default logger instance
 */
export const logger = Logger.getInstance();
