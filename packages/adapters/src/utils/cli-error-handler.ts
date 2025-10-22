/**
 * CLI Error Handler
 *
 * Provides enhanced error handling and user feedback for CLI operations
 */

import { CLILogger, type CLIError } from './cli-helpers.js';

/**
 * Enhanced CLI Error Handler
 */
export class CLIErrorHandler {
  private logger: CLILogger;

  /**
   * Create a new CLI error handler instance
   * @param logger - Logger instance for error output
   */
  constructor(logger: CLILogger) {
    this.logger = logger;
  }

  /**
   * Handle and display errors with suggestions
   * @param error - Error to handle
   * @param context - Optional context for the error
   * @returns {void}
   */
  handle(error: unknown, context?: string): void {
    this.handleError(error, context);
  }

  /**
   * Handle and display errors with suggestions
   * @param error - Error to handle
   * @param context - Optional context for the error
   * @returns {void}
   */
  handleError(error: unknown, context?: string): void {
    const cliError = this.normalizeError(error);
    const errorMessage =
      cliError.message || (error instanceof Error ? error.message : String(error));

    this.displayErrorMessage(error, errorMessage, context);
    this.displayContext(context);
    this.displaySuggestions(cliError);
    this.showHelpForError(cliError);
  }

  /**
   * Display error message with appropriate formatting
   * @param error - Original error object
   * @param errorMessage - Processed error message
   * @param context - Optional context string
   */
  private displayErrorMessage(error: unknown, errorMessage: string, context?: string): void {
    const isCLIError =
      typeof error === 'object' && error !== null && 'type' in error && 'suggestions' in error;
    const hasContext = context !== undefined;

    if (isCLIError) {
      console.error(`\x1B[31m✗\x1B[0m ${errorMessage}`);
    } else if (hasContext) {
      console.error(`\x1B[31m✗\x1B[0m undefined`);
    } else {
      this.logger.error(errorMessage);
    }
  }

  /**
   * Display context information if provided
   * @param context - Optional context string
   */
  private displayContext(context?: string): void {
    if (context) {
      this.logger.info(`Context: ${context}`);
    }
  }

  /**
   * Display suggestions if available
   * @param cliError - Normalized CLI error
   */
  private displaySuggestions(cliError: CLIError): void {
    if (cliError.suggestions && cliError.suggestions.length > 0) {
      console.log('ℹ️ Suggestions:');
      for (const [index, suggestion] of cliError.suggestions.entries()) {
        console.log(`   ${index + 1}. ${suggestion}`);
      }
    }
  }

  /**
   * Normalize error to CLIError format
   * @param error - Error to normalize
   * @returns Normalized CLIError
   */
  private normalizeError(error: unknown): CLIError {
    if (this.isCLIError(error)) {
      return error;
    }

    if (error instanceof Error) {
      const cliError: CLIError = {
        ...error,
        type: this.inferErrorType(error),
        suggestions: this.getSuggestionsForError({
          ...error,
          type: this.inferErrorType(error),
        }),
        exitCode: 1,
      };
      return cliError;
    }

    const cliError: CLIError = new Error(String(error)) as CLIError;
    cliError.type = 'system';
    cliError.exitCode = 1;
    return cliError;
  }

  /**
   * Check if error is already a CLIError
   * @param error - Error to check
   * @returns True if error is a CLIError
   */
  private isCLIError(error: unknown): error is CLIError {
    return Boolean(error && typeof error === 'object' && 'type' in error);
  }

  /**
   * Check if error is permission related
   * @param message - Error message to check
   * @returns True if permission error
   */
  private isPermissionError(message: string): boolean {
    return message.includes('eacces') || message.includes('permission');
  }

  /**
   * Check if error is network related
   * @param message - Error message to check
   * @returns True if network error
   */
  private isNetworkError(message: string): boolean {
    return message.includes('enotfound') || message.includes('network');
  }

  /**
   * Check if error is validation related
   * @param message - Error message to check
   * @returns True if validation error
   */
  private isValidationError(message: string): boolean {
    return message.includes('validation') || message.includes('invalid');
  }

  /**
   * Check if error is user related
   * @param message - Error message to check
   * @returns True if user error
   */
  private isUserError(message: string): boolean {
    return message.includes('user') || message.includes('cancelled');
  }

  /**
   * Infer error type from error message and properties
   * @param error - Error to analyze
   * @returns Inferred error type
   */
  private inferErrorType(error: Error): CLIError['type'] {
    const message = (error?.message || '').toLowerCase();

    if (this.isPermissionError(message)) {
      return 'permission';
    }
    if (this.isNetworkError(message)) {
      return 'network';
    }
    if (this.isValidationError(message)) {
      return 'validation';
    }
    if (this.isUserError(message)) {
      return 'user';
    }

    return 'system';
  }

  /**
   * Get permission error suggestions
   * @returns Array of permission-related suggestions
   */
  private getPermissionSuggestions(): string[] {
    return [
      'Try running with administrator privileges',
      'Check file/directory permissions',
      'Try a different directory path',
    ];
  }

  /**
   * Get network error suggestions
   * @returns Array of network-related suggestions
   */
  private getNetworkSuggestions(): string[] {
    return [
      'Check your internet connection',
      'Try using a different network',
      'Check firewall settings',
    ];
  }

  /**
   * Get file existence error suggestions
   * @returns Array of file existence-related suggestions
   */
  private getFileExistenceSuggestions(): string[] {
    return [
      'Use a different project name',
      'Remove the existing directory first',
      'Use the --force flag to overwrite',
    ];
  }

  /**
   * Get path error suggestions
   * @returns Array of path-related suggestions
   */
  private getPathSuggestions(): string[] {
    return ['Check if the path is correct', 'Ensure the file/directory exists'];
  }

  /**
   * Get suggestions for common errors
   * @param error - Error to generate suggestions for
   * @returns Array of suggestion strings
   */
  private getSuggestionsForError(error: CLIError): string[] {
    const message = (error?.message || '').toLowerCase();
    const suggestions: string[] = [];

    if (message.includes('eacces') || message.includes('permission denied')) {
      suggestions.push(...this.getPermissionSuggestions());
    }

    if (message.includes('enotfound') || message.includes('network')) {
      suggestions.push(...this.getNetworkSuggestions());
    }

    if (message.includes('already exists')) {
      suggestions.push(...this.getFileExistenceSuggestions());
    }

    if (message.includes('not found')) {
      suggestions.push(...this.getPathSuggestions());
    }

    return suggestions;
  }

  /**
   * Show additional help for specific error types
   * @param error - Error to show help for
   * @returns {void}
   */
  private showHelpForError(error: CLIError): void {
    switch (error.type) {
      case 'permission':
        this.logger.info('For permission issues, try:');
        console.log('   • Running with sudo (macOS/Linux)');
        console.log('   • Using a different installation directory');
        console.log('   • Checking file/folder permissions');
        break;

      case 'validation':
        this.logger.info('For validation issues, try:');
        console.log('   • Running with --verbose for more details');
        console.log('   • Checking input format and requirements');
        console.log('   • Using --help to see available options');
        break;

      case 'user':
        this.logger.info('Operation was cancelled by user');
        break;

      case 'network':
        this.logger.info('For network issues, try:');
        console.log('   • Checking internet connectivity');
        console.log('   • Using a different network');
        console.log('   • Checking proxy settings');
        break;
    }
  }
}
