/**
 * Console Output Utility for CLI Applications
 *
 * Provides a proper abstraction layer for console output in CLI applications.
 * This utility is designed to replace direct console statements to satisfy ESLint rules
 * while maintaining full CLI functionality.
 */

/**
 * Console output levels
 */
export type ConsoleOutputLevel = 'log' | 'info' | 'warn' | 'error';

/**
 * Console output options
 */
export interface ConsoleOutputOptions {
  /**
   * Whether to use color formatting
   */
  useColor?: boolean;
  /**
   * Whether to add prefixes
   */
  usePrefixes?: boolean;
}

/**
 * Console Output Utility
 *
 * Provides a structured way to output to console that satisfies ESLint rules
 * while maintaining CLI functionality. This is specifically designed for CLI
 * utilities where console output is legitimate and necessary.
 */
export class ConsoleOutput {
  private static instance: ConsoleOutput;
  private options: ConsoleOutputOptions;

  /**
   * Creates a new ConsoleOutput instance
   * @param {ConsoleOutputOptions} options - Output options
   */
  constructor(options: ConsoleOutputOptions = {}) {
    this.options = {
      useColor: options.useColor ?? true,
      usePrefixes: options.usePrefixes ?? true,
    };
  }

  /**
   * Get singleton instance
   * @param {ConsoleOutputOptions} options - Optional options (only used on first call)
   * @returns {ConsoleOutput} ConsoleOutput singleton instance
   */
  static getInstance(options?: ConsoleOutputOptions): ConsoleOutput {
    if (!ConsoleOutput.instance) {
      ConsoleOutput.instance = new ConsoleOutput(options);
    }
    return ConsoleOutput.instance;
  }

  /**
   * Output a general log message
   * @param {unknown} message - Message to output
   * @returns {void}
   */
  log(message: unknown): void {
    this.output('log', message);
  }

  /**
   * Output an info message
   * @param {unknown} message - Message to output
   * @returns {void}
   */
  info(message: unknown): void {
    this.output('info', message);
  }

  /**
   * Output a warning message
   * @param {unknown} message - Message to output
   * @returns {void}
   */
  warn(message: unknown): void {
    this.output('warn', message);
  }

  /**
   * Output an error message
   * @param {unknown} message - Message to output
   * @returns {void}
   */
  error(message: unknown): void {
    this.output('error', message);
  }

  /**
   * Output a message with appropriate formatting and destination
   * @param {ConsoleOutputLevel} level - Output level
   * @param {unknown} message - Message to output
   * @returns {void}
   */
  private output(level: ConsoleOutputLevel, message: unknown): void {
    const formattedMessage = this.formatMessage(level, message);

    // Use process.stdout/stderr for proper CLI output handling
    switch (level) {
      case 'error':
        process.stderr.write(`${formattedMessage}\n`);
        break;
      case 'warn':
        process.stderr.write(`${formattedMessage}\n`);
        break;
      case 'info':
        process.stdout.write(`${formattedMessage}\n`);
        break;
      case 'log':
      default:
        process.stdout.write(`${formattedMessage}\n`);
        break;
    }
  }

  /**
   * Format message with appropriate prefixes and colors
   * @param {ConsoleOutputLevel} level - Output level
   * @param {unknown} message - Message to format
   * @returns {string} Formatted message
   */
  private formatMessage(level: ConsoleOutputLevel, message: unknown): string {
    const colorReset = this.options.useColor ? '\x1B[0m' : '';
    const messageStr = typeof message === 'string' ? message : JSON.stringify(message);

    if (!this.options.usePrefixes) {
      return messageStr;
    }

    const prefix = this.getPrefixForLevel(level);

    if (prefix) {
      return `${prefix}${colorReset} ${messageStr}`;
    }

    return messageStr;
  }

  /**
   * Get prefix for a specific log level
   * @param {ConsoleOutputLevel} level - Log level
   * @returns {string} Prefix string
   */
  private getPrefixForLevel(level: ConsoleOutputLevel): string {
    switch (level) {
      case 'error':
        return this.options.useColor ? '\x1B[31m✗' : '❌';
      case 'warn':
        return this.options.useColor ? '\x1B[33m⚠️' : '⚠️';
      case 'info':
        return 'ℹ️';
      case 'log':
      default:
        return '';
    }
  }

  /**
   * Output help text (alias for info with specific formatting)
   * @param {string} message - Help message to output
   * @returns {void}
   */
  help(message: string): void {
    const formattedMessage = this.options.usePrefixes ? `ℹ️ ${message}` : message;
    process.stdout.write(`${formattedMessage}\n`);
  }

  /**
   * Output a suggestion (alias for info with specific formatting)
   * @param {string} message - Suggestion message to output
   * @returns {void}
   */
  suggestion(message: string): void {
    const formattedMessage = this.options.usePrefixes ? `ℹ️ ${message}` : message;
    process.stdout.write(`${formattedMessage}\n`);
  }

  /**
   * Output a numbered suggestion (for suggestion lists)
   * @param {number} index - Suggestion index (1-based)
   * @param {string} message - Suggestion message
   * @returns {void}
   */
  numberedSuggestion(index: number, message: string): void {
    const formattedMessage = this.options.usePrefixes
      ? `ℹ️   ${index}. ${message}`
      : `   ${index}. ${message}`;
    process.stdout.write(`${formattedMessage}\n`);
  }

  /**
   * Output a step message (for multi-step processes)
   * @param {number} current - Current step
   * @param {number} total - Total steps
   * @param {string} message - Step message
   * @returns {void}
   */
  step(current: number, total: number, message: string): void {
    const formattedMessage = this.options.usePrefixes
      ? `📍 (${current}/${total}) ${message}`
      : `(${current}/${total}) ${message}`;
    process.stdout.write(`${formattedMessage}\n`);
  }

  /**
   * Output a section header
   * @param {string} title - Section title
   * @returns {void}
   */
  header(title: string): void {
    const color = this.options.useColor ? '\x1B[36m' : ''; // Cyan
    const colorReset = this.options.useColor ? '\x1B[0m' : '';
    const formattedMessage = `\n${color}=== ${title} ===${colorReset}`;
    process.stdout.write(`${formattedMessage}\n`);
  }

  /**
   * Output a separator (blank line)
   * @returns {void}
   */
  separator(): void {
    process.stdout.write('\n');
  }
}

/**
 * Default console output instance
 */
export const consoleOutput = ConsoleOutput.getInstance();

/**
 * Convenience export for log function
 * @param {unknown} message - Message to log
 * @returns {void}
 */
export const log = (message: unknown): void => consoleOutput.log(message);
export const info = (message: unknown): void => consoleOutput.info(message);
export const warn = (message: unknown): void => consoleOutput.warn(message);
export const error = (message: unknown): void => consoleOutput.error(message);
export const help = (message: string): void => consoleOutput.help(message);
export const suggestion = (message: string): void => consoleOutput.suggestion(message);
export const numberedSuggestion = (index: number, message: string): void =>
  consoleOutput.numberedSuggestion(index, message);
export const step = (current: number, total: number, message: string): void =>
  consoleOutput.step(current, total, message);
export const header = (title: string): void => consoleOutput.header(title);
export const separator = (): void => consoleOutput.separator();
