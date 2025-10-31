/**
 * CLI Error Types Generator
 *
 * Generates CLI error type definitions
 */

/**
 * Generate error types
 * @returns {string} Error type definitions
 */
export function generateErrorTypes(): string {
  return [generateErrorCodeEnum(), generateErrorClass(), generateErrorHandlerType()].join('\n\n');
}

/**
 * Generate CLI error code enumeration
 * @returns {string} Error code enum definition
 */
function generateErrorCodeEnum(): string {
  return `/**
 * CLI error codes
 */
export enum CLIErrorCode {
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  COMMAND_NOT_FOUND = 'COMMAND_NOT_FOUND',
  INVALID_ARGUMENTS = 'INVALID_ARGUMENTS',
  CONFIGURATION_ERROR = 'CONFIGURATION_ERROR',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  NETWORK_ERROR = 'NETWORK_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
}`;
}

/**
 * Generate CLI error class
 * @returns {string} Error class definition
 */
function generateErrorClass(): string {
  return `/**
 * Custom CLI error class
 */
export class CLIError extends Error {
  public readonly code: CLIErrorCode;
  public readonly details?: Record<string, unknown>;

  constructor(code: CLIErrorCode, message: string, details?: Record<string, unknown>) {
    super(message);
    this.name = 'CLIError';
    this.code = code;
    this.details = details;
  }
}`;
}

/**
 * Generate error handler type
 * @returns {string} Error handler type definition
 */
function generateErrorHandlerType(): string {
  return `/**
 * Error handler function type
 */
export type ErrorHandler = (error: CLIError) => void;`;
}
