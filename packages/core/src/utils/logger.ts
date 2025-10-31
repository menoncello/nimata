/**
 * Simple structured logger for configuration operations
 *
 * Provides debug and warn level logging with configurable output
 * Sensitive data is automatically masked in log messages
 */

export type LoggerLogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  level: LoggerLogLevel;
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
/**
 * Logger configuration constants
 */
const LOGGER_CONSTANTS = {
  MIN_MASK_LENGTH: 4,
  MASK_PREFIX_LENGTH: 2,
  FULL_MASK: '****',
} as const;

/**
 * Simple structured logger with sensitive data masking
 */
export class Logger {
  private static instance: Logger;
  private logLevel: LoggerLogLevel;

  /**
   * Creates a new Logger instance
   * @param {LoggerLogLevel} logLevel - Minimum log level to output (default: 'info')
   */
  private constructor(logLevel: LoggerLogLevel = 'info') {
    this.logLevel = logLevel;
  }

  /**
   * Get singleton logger instance
   * @param {LoggerLogLevel} logLevel - Optional minimum log level (only used on first call)
   * @returns {Logger} Logger singleton instance
   */
  static getInstance(logLevel?: LoggerLogLevel): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger(logLevel);
    }
    return Logger.instance;
  }

  /**
   * Log debug message
   * @param {string} operation - Operation being logged
   * @param {string} message - Log message
   * @param {Record<string, unknown>} metadata - Optional metadata object
   */
  debug(operation: string, message: string, metadata?: Record<string, unknown>): void {
    this.log('debug', operation, message, metadata);
  }

  /**
   * Log info message
   * @param {string} operation - Operation being logged
   * @param {string} message - Log message
   * @param {string} metadata - Optional metadata object
   */
  info(operation: string, message: string, metadata?: Record<string, unknown>): void {
    this.log('info', operation, message, metadata);
  }

  /**
   * Log warning message
   * @param {string} operation - Operation being logged
   * @param {string} message - Log message
   * @param {string} metadata - Optional metadata object
   */
  warn(operation: string, message: string, metadata?: Record<string, unknown>): void {
    this.log('warn', operation, message, metadata);
  }

  /**
   * Log error message
   * @param {string} operation - Operation being logged
   * @param {string} message - Log message
   * @param {string} metadata - Optional metadata object
   */
  error(operation: string, message: string, metadata?: Record<string, unknown>): void {
    this.log('error', operation, message, metadata);
  }

  /**
   * Internal logging method
   * @param {string} level - Log level
   * @param {string} operation - Operation being logged
   * @param {string} message - Log message
   * @param {string} metadata - Optional metadata object
   */
  private log(
    level: LoggerLogLevel,
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
   * @param {string} level - Log level to check
   * @returns {string} True if should log, false otherwise
   */
  private shouldLog(level: LoggerLogLevel): boolean {
    const levels: Record<LoggerLogLevel, number> = { debug: 0, info: 1, warn: 2, error: 3 };
    return levels[level] >= levels[this.logLevel];
  }

  /**
   * Output log entry to console
   * @param {LogEntry} entry - Log entry to output
   */
  private outputLog(entry: LogEntry): void {
    const prefix = `[${entry.timestamp}] [${entry.level.toUpperCase()}] [${entry.operation}] ${entry.message}`;
    const metadataStr = entry.metadata ? JSON.stringify(entry.metadata) : 'undefined';

    switch (entry.level) {
      case 'debug':
        process.stderr.write(`DEBUG: ${prefix} ${metadataStr}\n`);
        break;
      case 'info':
        process.stdout.write(`INFO: ${prefix} ${metadataStr}\n`);
        break;
      case 'warn':
        if (entry.fieldPath) {
          process.stderr.write(`WARN: ${prefix} ${entry.fieldPath} ${metadataStr}\n`);
        } else {
          process.stderr.write(`WARN: ${prefix} ${metadataStr}\n`);
        }
        break;
      case 'error':
        process.stderr.write(`ERROR: ${prefix} ${metadataStr}\n`);
        break;
    }
  }

  /**
   * Mask sensitive data in log metadata
   * @param {string} metadata - Metadata object to mask
   * @returns {string} Masked metadata object or undefined
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
   * @param {string} value - String value to mask
   * @returns {string} Masked string
   */
  private maskValue(value: string): string {
    if (value.length <= LOGGER_CONSTANTS.MIN_MASK_LENGTH) {
      return LOGGER_CONSTANTS.FULL_MASK;
    }
    const prefixLength = LOGGER_CONSTANTS.MASK_PREFIX_LENGTH;
    const suffixLength = LOGGER_CONSTANTS.MASK_PREFIX_LENGTH;
    return `${value.substring(0, prefixLength)}${LOGGER_CONSTANTS.FULL_MASK}${value.substring(value.length - suffixLength)}`;
  }

  /**
   * Recursively mask sensitive object properties
   * @param {string} obj - Object to mask
   * @returns {string} Masked object
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
