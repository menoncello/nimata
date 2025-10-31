/**
 * Enum Export Generator
 *
 * Generates enum definitions and exports for TypeScript projects
 */
import type { ProjectConfig } from '../../../../types/project-config.js';

/**
 * Generates enum exports for TypeScript libraries
 */
export class EnumExportGenerator {
  /**
   * Generates common enum definitions and exports
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Enum definitions string
   */
  generateEnumExports(config: ProjectConfig): string {
    const { name } = config;
    const header = this.getHeader(name);
    const coreEnums = this.getCoreEnums();
    const systemEnums = this.getSystemEnums();
    const dataEnums = this.getDataEnums();
    const utilityEnums = this.getUtilityEnums();

    return `${header}

${coreEnums}

${systemEnums}

${dataEnums}

${utilityEnums}
`;
  }

  /**
   * Get header comment
   * @param {string} name - Project name
   * @returns {string} Header string
   */
  private getHeader(name: string): string {
    return `// Enum definitions for ${name}`;
  }

  /**
   * Get core application enums
   * @returns {string} Core enum definitions
   */
  private getCoreEnums(): string {
    const logLevel = this.getLogLevelEnum();
    const environment = this.getEnvironmentEnum();
    const priority = this.getPriorityEnum();

    return `${logLevel}

${environment}

${priority}`;
  }

  /**
   * Get LogLevel enum
   * @returns {string} LogLevel enum code
   */
  private getLogLevelEnum(): string {
    return `/**
 * Log levels for structured logging
 */
export enum LogLevel {
  Trace = 'trace',
  Debug = 'debug',
  Info = 'info',
  Warn = 'warn',
  Error = 'error',
  Fatal = 'fatal',
}`;
  }

  /**
   * Get Environment enum
   * @returns {string} Environment enum code
   */
  private getEnvironmentEnum(): string {
    return `/**
 * Environment types
 */
export enum Environment {
  Development = 'development',
  Testing = 'testing',
  Staging = 'staging',
  Production = 'production',
}`;
  }

  /**
   * Get Priority enum
   * @returns {string} Priority enum code
   */
  private getPriorityEnum(): string {
    return `/**
 * Priority levels
 */
export enum Priority {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
  Critical = 'critical',
}`;
  }

  /**
   * Get system and error-related enums
   * @returns {string} System enum definitions
   */
  private getSystemEnums(): string {
    const httpStatus = this.getHttpStatusEnum();
    const errorCode = this.getErrorCodeEnum();
    const cacheStrategy = this.getCacheStrategyEnum();
    const retryStrategy = this.getRetryStrategyEnum();

    return `${httpStatus}

${errorCode}

${cacheStrategy}

${retryStrategy}`;
  }

  /**
   * Get HttpStatus enum
   * @returns {string} HttpStatus enum code
   */
  private getHttpStatusEnum(): string {
    return `/**
 * HTTP status codes
 */
export enum HttpStatus {
  // Success
  Ok = 200,
  Created = 201,
  Accepted = 202,
  NoContent = 204,

  // Redirection
  MovedPermanently = 301,
  Found = 302,
  NotModified = 304,

  // Client errors
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  MethodNotAllowed = 405,
  Conflict = 409,
  UnprocessableEntity = 422,
  TooManyRequests = 429,

  // Server errors
  InternalServerError = 500,
  BadGateway = 502,
  ServiceUnavailable = 503,
  GatewayTimeout = 504,
}`;
  }

  /**
   * Get ErrorCode enum
   * @returns {string} ErrorCode enum code
   */
  private getErrorCodeEnum(): string {
    return `/**
 * Error codes for application errors
 */
export enum ErrorCode {
  // Configuration errors
  InvalidConfig = 'INVALID_CONFIG',
  MissingConfig = 'MISSING_CONFIG',
  ConfigValidationFailed = 'CONFIG_VALIDATION_FAILED',

  // Processing errors
  ProcessingError = 'PROCESSING_ERROR',
  ValidationError = 'VALIDATION_ERROR',
  TimeoutError = 'TIMEOUT_ERROR',
  ResourceNotFound = 'RESOURCE_NOT_FOUND',
  PermissionDenied = 'PERMISSION_DENIED',

  // System errors
  DatabaseError = 'DATABASE_ERROR',
  NetworkError = 'NETWORK_ERROR',
  FileSystemError = 'FILESYSTEM_ERROR',
  MemoryError = 'MEMORY_ERROR',
}`;
  }

  /**
   * Get CacheStrategy enum
   * @returns {string} CacheStrategy enum code
   */
  private getCacheStrategyEnum(): string {
    return `/**
 * Cache strategies
 */
export enum CacheStrategy {
  None = 'none',
  Memory = 'memory',
  Redis = 'redis',
  File = 'file',
}`;
  }

  /**
   * Get RetryStrategy enum
   * @returns {string} RetryStrategy enum code
   */
  private getRetryStrategyEnum(): string {
    return `/**
 * Retry strategies
 */
export enum RetryStrategy {
  None = 'none',
  Fixed = 'fixed',
  Exponential = 'exponential',
  Linear = 'linear',
}`;
  }

  /**
   * Get data processing enums
   * @returns {string} Data enum definitions
   */
  private getDataEnums(): string {
    const dataFormat = this.getDataFormatEnum();
    const compression = this.getCompressionEnum();
    const hashAlgorithm = this.getHashAlgorithmEnum();

    return `${dataFormat}

${compression}

${hashAlgorithm}`;
  }

  /**
   * Get DataFormat enum
   * @returns {string} DataFormat enum code
   */
  private getDataFormatEnum(): string {
    return `/**
 * Data formats
 */
export enum DataFormat {
  Json = 'json',
  Xml = 'xml',
  Yaml = 'yaml',
  Csv = 'csv',
  Text = 'text',
  Binary = 'binary',
}`;
  }

  /**
   * Get Compression enum
   * @returns {string} Compression enum code
   */
  private getCompressionEnum(): string {
    return `/**
 * Compression algorithms
 */
export enum Compression {
  None = 'none',
  Gzip = 'gzip',
  Deflate = 'deflate',
  Brotli = 'brotli',
}`;
  }

  /**
   * Get HashAlgorithm enum
   * @returns {string} HashAlgorithm enum code
   */
  private getHashAlgorithmEnum(): string {
    return `/**
 * Hash algorithms
 */
export enum HashAlgorithm {
  Md5 = 'md5',
  Sha1 = 'sha1',
  Sha256 = 'sha256',
  Sha512 = 'sha512',
}`;
  }

  /**
   * Get utility and helper enums
   * @returns {string} Utility enum definitions
   */
  private getUtilityEnums(): string {
    const sortDirection = this.getSortDirectionEnum();
    const comparisonOperator = this.getComparisonOperatorEnum();
    const booleanState = this.getBooleanStateEnum();

    return `${sortDirection}

${comparisonOperator}

${booleanState}`;
  }

  /**
   * Get SortDirection enum
   * @returns {string} SortDirection enum code
   */
  private getSortDirectionEnum(): string {
    return `/**
 * Sorting directions
 */
export enum SortDirection {
  Ascending = 'asc',
  Descending = 'desc',
}`;
  }

  /**
   * Get ComparisonOperator enum
   * @returns {string} ComparisonOperator enum code
   */
  private getComparisonOperatorEnum(): string {
    return `/**
 * Comparison operators
 */
export enum ComparisonOperator {
  Equals = 'eq',
  NotEquals = 'ne',
  GreaterThan = 'gt',
  GreaterThanOrEqual = 'gte',
  LessThan = 'lt',
  LessThanOrEqual = 'lte',
  In = 'in',
  NotIn = 'nin',
  Contains = 'contains',
  StartsWith = 'startsWith',
  EndsWith = 'endsWith',
}`;
  }

  /**
   * Get BooleanState enum
   * @returns {boolean}State enum code
   */
  private getBooleanStateEnum(): string {
    return `/**
 * Boolean states
 */
export enum BooleanState {
  True = 'true',
  False = 'false',
}`;
  }
}
