/**
 * CLI Utility Generators
 *
 * Generates utility files for CLI projects
 */
import type { ProjectConfig } from '../../../types/project-config.js';

/**
 * CLI Utility Generators
 *
 * Generates utility files for CLI projects
 */
export class CLIUtilGenerators {
  /**
   * Generate logger utility
   * @param _config - Project configuration
   * @returns Logger utility content
   */
  generateLoggerUtil(_config: ProjectConfig): string {
    return [
      this.generateLoggerHeader(),
      this.generateLoggerTypes(),
      this.generateLoggerClass(),
      this.generateLoggerExports(),
    ].join('\n');
  }

  /**
   * Generate logger header comment
   * @returns Header comment
   */
  private generateLoggerHeader(): string {
    return `/**
 * Logger Utility
 *
 * Comprehensive logging utility for CLI applications
 */`;
  }

  /**
   * Generate logger type definitions
   * @returns Type definitions
   */
  private generateLoggerTypes(): string {
    return `export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LoggerOptions {
  level?: LogLevel;
  colorEnabled?: boolean;
  prefix?: string;
}`;
  }

  /**
   * Generate logger class implementation
   * @returns Logger class code
   */
  private generateLoggerClass(): string {
    return [
      this.generateLoggerClassDeclaration(),
      this.generateLoggerConstructor(),
      this.generateLoggerSetters(),
      this.generateLoggerHelperMethods(),
      this.generateLoggerLogMethods(),
      this.generateLoggerSuccessMethod(),
      this.generateLoggerChildMethod(),
      this.generateLoggerClassClosing(),
    ].join('\n');
  }

  /**
   * Generate logger class declaration
   * @returns Class declaration
   */
  private generateLoggerClassDeclaration(): string {
    return `/**
 * Logger Class
 */
export class Logger {
  private level: LogLevel = 'info';
  private colorEnabled: boolean = true;
  private prefix?: string;`;
  }

  /**
   * Generate logger constructor
   * @returns Constructor implementation
   */
  private generateLoggerConstructor(): string {
    return `  constructor(options: LoggerOptions = {}) {
    this.level = options.level || 'info';
    this.colorEnabled = options.colorEnabled !== false;
    this.prefix = options.prefix;
  }`;
  }

  /**
   * Generate logger setter methods
   * @returns Setter methods
   */
  private generateLoggerSetters(): string {
    return `  /**
   * Set log level
   * @param level - New log level
   */
  setLevel(level: LogLevel): void {
    this.level = level;
  }

  /**
   * Enable/disable colors
   * @param enabled - Whether to enable colors
   */
  setColorEnabled(enabled: boolean): void {
    this.colorEnabled = enabled;
  }`;
  }

  /**
   * Generate logger helper methods
   * @returns Helper methods
   */
  private generateLoggerHelperMethods(): string {
    return [this.generateShouldLogMethod(), this.generateFormatMessageMethod()].join('\n');
  }

  /**
   * Generate shouldLog method
   * @returns shouldLog method implementation
   */
  private generateShouldLogMethod(): string {
    return `  /**
   * Check if a log level should be output
   * @param level - Log level to check
   * @returns True if should log
   */
  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    const currentLevelIndex = levels.indexOf(this.level);
    const checkLevelIndex = levels.indexOf(level);

    return checkLevelIndex >= currentLevelIndex;
  }`;
  }

  /**
   * Generate formatMessage method
   * @returns formatMessage method implementation
   */
  private generateFormatMessageMethod(): string {
    return `  /**
   * Format log message with colors and timestamp
   * @param level - Log level
   * @param message - Message to format
   * @returns Formatted message
   */
  private formatMessage(level: LogLevel, message: string): string {
    const timestamp = new Date().toISOString();
    const prefix = this.prefix ? \`[\${this.prefix}] \` : '';

    if (!this.colorEnabled) {
      return \`[\${timestamp}] \${prefix}[\${level.toUpperCase()}] \${message}\`;
    }

    const colors = {
      debug: '\\x1b[36m', // Cyan
      info: '\\x1b[32m',  // Green
      warn: '\\x1b[33m',  // Yellow
      error: '\\x1b[31m', // Red
      reset: '\\x1b[0m',   // Reset,
    };

    const levelColors = {
      debug: colors.debug,
      info: colors.info,
      warn: colors.warn,
      error: colors.error,
    };

    return \`\${colors.reset}[\${timestamp}] \${prefix}\${levelColors[level]}[\${level.toUpperCase()}]\${colors.reset} \${message}\`;
  }`;
  }

  /**
   * Generate logger log methods
   * @returns Log methods (debug, info, warn, error)
   */
  private generateLoggerLogMethods(): string {
    return [
      this.generateDebugMethod(),
      this.generateInfoMethod(),
      this.generateWarnMethod(),
      this.generateErrorMethod(),
    ].join('\n');
  }

  /**
   * Generate debug method
   * @returns Debug method implementation
   */
  private generateDebugMethod(): string {
    return `  /**
   * Log debug message
   * @param message - Message to log
   * @param args - Additional arguments
   */
  debug(message: string, ...args: any[]): void {
    if (this.shouldLog('debug')) {
      console.debug(this.formatMessage('debug', message), ...args);
    }
  }`;
  }

  /**
   * Generate info method
   * @returns Info method implementation
   */
  private generateInfoMethod(): string {
    return `  /**
   * Log info message
   * @param message - Message to log
   * @param args - Additional arguments
   */
  info(message: string, ...args: any[]): void {
    if (this.shouldLog('info')) {
      console.info(this.formatMessage('info', message), ...args);
    }
  }`;
  }

  /**
   * Generate warn method
   * @returns Warn method implementation
   */
  private generateWarnMethod(): string {
    return `  /**
   * Log warning message
   * @param message - Message to log
   * @param args - Additional arguments
   */
  warn(message: string, ...args: any[]): void {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage('warn', message), ...args);
    }
  }`;
  }

  /**
   * Generate error method
   * @returns Error method implementation
   */
  private generateErrorMethod(): string {
    return `  /**
   * Log error message
   * @param message - Message to log
   * @param args - Additional arguments
   */
  error(message: string, ...args: any[]): void {
    if (this.shouldLog('error')) {
      console.error(this.formatMessage('error', message), ...args);
    }
  }`;
  }

  /**
   * Generate logger success method
   * @returns Success method implementation
   */
  private generateLoggerSuccessMethod(): string {
    return `  /**
   * Log success message (alias for info with green color)
   * @param message - Message to log
   * @param args - Additional arguments
   */
  success(message: string, ...args: any[]): void {
    if (this.colorEnabled) {
      const greenColor = '\\x1b[32m';
      const resetColor = '\\x1b[0m';
      message = \`\${greenColor}\${message}\${resetColor}\`;
    }

    if (this.shouldLog('info')) {
      console.info(this.formatMessage('info', message), ...args);
    }
  }`;
  }

  /**
   * Generate logger child method
   * @returns Child method implementation
   */
  private generateLoggerChildMethod(): string {
    return `  /**
   * Create child logger with prefix
   * @param prefix - Prefix for child logger
   * @returns New logger instance with prefix
   */
  child(prefix: string): Logger {
    const fullPrefix = this.prefix ? \`\${this.prefix}:\${prefix}\` : prefix;
    return new Logger({
      level: this.level,
      colorEnabled: this.colorEnabled,
      prefix: fullPrefix,
    });
  }`;
  }

  /**
   * Generate logger class closing
   * @returns Class closing brace
   */
  private generateLoggerClassClosing(): string {
    return `}`;
  }

  /**
   * Generate logger exports
   * @returns Export statements
   */
  private generateLoggerExports(): string {
    return `/**
 * Default logger instance
 */
export const logger = new Logger();

/**
 * Create logger with custom options
 * @param options - Logger options
 * @returns New logger instance
 */
export const createLogger = (options?: LoggerOptions): Logger => {
  return new Logger(options);
};`;
  }
}
