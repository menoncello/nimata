/**
 * Error Export Generator
 *
 * Generates error class definitions and exports for TypeScript projects
 */
import type { ProjectConfig } from '../../../../types/project-config.js';
import { toPascalCase } from '../../../../utils/string-utils.js';

/**
 * Generates error class exports for TypeScript libraries
 */
export class ErrorExportGenerator {
  /**
   * Generates error class definitions and exports
   * @param config - The project configuration
   * @returns Error class definitions string
   */
  generateErrorExports(config: ProjectConfig): string {
    const { name } = config;
    const className = toPascalCase(name);
    const header = this.getHeader(name);
    const baseError = this.getBaseErrorClass(className);
    const configErrors = this.getConfigErrors(className);
    const resourceErrors = this.getResourceErrors(className);
    const systemErrors = this.getSystemErrors(className);
    const utilities = this.getErrorUtilities(className);

    return `${header}

${baseError}

${configErrors}

${resourceErrors}

${systemErrors}

${utilities}
`;
  }

  /**
   * Get header comment
   * @param name - Project name
   * @returns Header string
   */
  private getHeader(name: string): string {
    return `// Error class definitions for ${name}`;
  }

  /**
   * Get base error class definition
   * @param className - Class name
   * @returns Base error class code
   */
  private getBaseErrorClass(className: string): string {
    const constructorAndMethods = this.generateBaseErrorConstructorAndMethods(className);

    return `/**
 * Base error class for ${className} library
 */
export class ${className}Error extends Error {
  public readonly code: string;
  public readonly cause?: Error;

${constructorAndMethods}
}`;
  }

  /**
   * Generate base error constructor and methods
   * @param className - Class name
   * @returns Constructor and methods content
   */
  private generateBaseErrorConstructorAndMethods(className: string): string {
    const constructor = this.generateBaseErrorConstructor(className);
    const toJSON = this.generateToJSONMethod();
    const toString = this.generateToStringMethod();

    return `${constructor}

${toJSON}

${toString}`;
  }

  /**
   * Generate base error constructor
   * @param className - Class name
   * @returns Constructor content
   */
  private generateBaseErrorConstructor(className: string): string {
    return `  constructor(message: string, code: string, cause?: Error) {
    super(message);
    this.name = '${className}Error';
    this.code = code;
    this.cause = cause;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ${className}Error);
    }
  }`;
  }

  /**
   * Generate toJSON method
   * @returns toJSON method content
   */
  private generateToJSONMethod(): string {
    return `  /**
   * Convert error to JSON representation
   */
  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      cause: this.cause?.message,
      stack: this.stack,
    };
  }`;
  }

  /**
   * Generate toString method
   * @returns toString method content
   */
  private generateToStringMethod(): string {
    return `  /**
   * Get string representation
   */
  toString(): string {
    return \`\${this.name} [\${this.code}]: \${this.message}\`;
  }`;
  }

  /**
   * Get configuration and validation error classes
   * @param className - Base class name
   * @returns Configuration error classes code
   */
  private getConfigErrors(className: string): string {
    return `/**
 * Configuration error thrown when configuration is invalid
 */
export class ConfigError extends ${className}Error {
  constructor(message: string, cause?: Error) {
    super(message, 'CONFIG_ERROR', cause);
    this.name = 'ConfigError';
  }
}

/**
 * Validation error thrown when input validation fails
 */
export class ValidationError extends ${className}Error {
  public readonly field?: string;

  constructor(message: string, field?: string, cause?: Error) {
    super(message, 'VALIDATION_ERROR', cause);
    this.name = 'ValidationError';
    this.field = field;
  }

  toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      field: this.field,
    };
  }
}`;
  }

  /**
   * Get resource-related error classes
   * @param className - Base class name
   * @returns Resource error classes code
   */
  private getResourceErrors(className: string): string {
    const timeoutError = this.getTimeoutErrorClass(className);
    const notFoundError = this.getNotFoundErrorClass(className);
    const permissionError = this.getPermissionErrorClass(className);

    return `${timeoutError}

${notFoundError}

${permissionError}`;
  }

  /**
   * Get timeout error class
   * @param className - Base class name
   * @returns Timeout error class code
   */
  private getTimeoutErrorClass(className: string): string {
    return `/**
 * Timeout error thrown when operations exceed time limits
 */
export class TimeoutError extends ${className}Error {
  public readonly timeout: number;

  constructor(message: string, timeout: number, cause?: Error) {
    super(message, 'TIMEOUT_ERROR', cause);
    this.name = 'TimeoutError';
    this.timeout = timeout;
  }

  toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      timeout: this.timeout,
    };
  }
}`;
  }

  /**
   * Get not found error class
   * @param className - Base class name
   * @returns Not found error class code
   */
  private getNotFoundErrorClass(className: string): string {
    return `/**
 * Resource not found error
 */
export class NotFoundError extends ${className}Error {
  public readonly resource: string;
  public readonly id?: string;

  constructor(resource: string, id?: string, cause?: Error) {
    const message = id ? \`\${resource} with id '\${id}' not found\` : \`\${resource} not found\`;
    super(message, 'NOT_FOUND_ERROR', cause);
    this.name = 'NotFoundError';
    this.resource = resource;
    this.id = id;
  }

  toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      resource: this.resource,
      id: this.id,
    };
  }
}`;
  }

  /**
   * Get permission error class
   * @param className - Base class name
   * @returns Permission error class code
   */
  private getPermissionErrorClass(className: string): string {
    return `/**
 * Permission denied error
 */
export class PermissionError extends ${className}Error {
  public readonly action: string;
  public readonly resource?: string;

  constructor(action: string, resource?: string, cause?: Error) {
    const message = resource
      ? \`Permission denied for action '\${action}' on resource '\${resource}'\`
      : \`Permission denied for action '\${action}'\`;
    super(message, 'PERMISSION_ERROR', cause);
    this.name = 'PermissionError';
    this.action = action;
    this.resource = resource;
  }

  toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      action: this.action,
      resource: this.resource,
    };
  }
}`;
  }

  /**
   * Get system-related error classes
   * @param className - Base class name
   * @returns System error classes code
   */
  private getSystemErrors(className: string): string {
    const networkError = this.getNetworkErrorClass(className);
    const databaseError = this.getDatabaseErrorClass(className);

    return `${networkError}

${databaseError}`;
  }

  /**
   * Get network error class
   * @param className - Base class name
   * @returns Network error class code
   */
  private getNetworkErrorClass(className: string): string {
    return `/**
 * Network error for connection issues
 */
export class NetworkError extends ${className}Error {
  public readonly url?: string;
  public readonly status?: number;

  constructor(message: string, url?: string, status?: number, cause?: Error) {
    super(message, 'NETWORK_ERROR', cause);
    this.name = 'NetworkError';
    this.url = url;
    this.status = status;
  }

  toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      url: this.url,
      status: this.status,
    };
  }
}`;
  }

  /**
   * Get database error class
   * @param className - Base class name
   * @returns Database error class code
   */
  private getDatabaseErrorClass(className: string): string {
    return `/**
 * Database error for data persistence issues
 */
export class DatabaseError extends ${className}Error {
  public readonly query?: string;
  public readonly table?: string;

  constructor(message: string, query?: string, table?: string, cause?: Error) {
    super(message, 'DATABASE_ERROR', cause);
    this.name = 'DatabaseError';
    this.query = query;
    this.table = table;
  }

  toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      query: this.query,
      table: this.table,
    };
  }
}`;
  }

  /**
   * Get error utility functions
   * @param className - Base class name
   * @returns Error utility functions code
   */
  private getErrorUtilities(className: string): string {
    return `/**
 * Utility function to check if an error is a ${className}Error
 */
export function is${className}Error(error: unknown): error is ${className}Error {
  return error instanceof ${className}Error;
}

/**
 * Utility function to get error code from any error
 */
export function getErrorCode(error: unknown): string {
  if (is${className}Error(error)) {
    return error.code;
  }
  if (error instanceof Error) {
    return error.name;
  }
  return 'UNKNOWN_ERROR';
}`;
  }
}
