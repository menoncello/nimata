/**
 * TypeScript Main Export Generator
 *
 * Handles the generation of the main export file for TypeScript projects
 */
import type { ProjectConfig } from '../../../types/project-config.js';
import { toPascalCase } from '../../../utils/string-utils.js';

/**
 * Generator for TypeScript main export file
 */
export class TypeScriptMainExportGenerator {
  /**
   * Generate main export file
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Main export file content
   */
  generateMainExport(config: ProjectConfig): string {
    const header = this.generateMainExportHeader(config);
    const typeExports = this.generateMainExportTypeSections(config);
    const enumExports = this.generateMainExportEnumSection();
    const errorExports = this.generateMainExportErrorSection(config);
    const utilityExports = this.generateMainExportUtilitySection();
    const classExport = this.generateMainExportClassSection(config);

    return `${header}

${typeExports}

${enumExports}

${errorExports}

${utilityExports}

${classExport}
`;
  }

  /**
   * Generate main export file header
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Header content
   */
  private generateMainExportHeader(config: ProjectConfig): string {
    return `/**
 * ${config.name}
 *
 * ${config.description || 'A modern TypeScript library'}
 */`;
  }

  /**
   * Generate type export sections for main export
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Type export sections content
   */
  private generateMainExportTypeSections(config: ProjectConfig): string {
    const className = toPascalCase(config.name);
    const typeExports = this.generateMainTypeExports(className);
    const interfaceExports = this.generateMainInterfaceExports();

    return `${typeExports}

${interfaceExports}`;
  }

  /**
   * Generate main type exports
   * @param {string} className - Project class name
   * @returns {string} Type exports content
   */
  private generateMainTypeExports(className: string): string {
    return `// Export main types
export type {
  ${className}Config,
  OperationResult,
  AsyncFunction,
  EventHandler,
} from './lib/types/index.js';`;
  }

  /**
   * Generate external interface exports
   * @returns {string} External interface exports content
   */
  private generateExternalInterfaceExports(): string {
    return `// Export main interfaces
export type {
  Configurable,
  Service,
  Repository,
  Validator,
  ValidationResult,
  Adapter,
  Logger,
  EventEmitter,
  Cache,
} from './lib/interfaces/index.js';`;
  }

  /**
   * Generate inline interface definitions
   * @returns {string} Inline interface definitions content
   */
  private generateInlineInterfaceDefinitions(): string {
    return `// Define key interfaces inline for direct access
export interface ProjectConfig {
  /** Project name */
  name: string;
  /** Project description */
  description?: string;
  /** Debug mode */
  debug?: boolean;
  /** Request timeout in milliseconds */
  timeout?: number;
  /** Maximum retry attempts */
  maxRetries?: number;
  /** Enable metrics collection */
  enableMetrics?: boolean;
}`;
  }

  /**
   * Generate operation result interface
   * @returns {string} Operation result interface content
   */
  private generateOperationResultInterface(): string {
    return `export interface OperationResult<T = unknown> {
  /** Operation success status */
  success: boolean;
  /** Result data */
  data?: T;
  /** Error message if operation failed */
  error?: string;
  /** Additional metadata */
  metadata?: Record<string, unknown>;
}`;
  }

  /**
   * Generate main interface exports
   * @returns {string} Interface exports content
   */
  private generateMainInterfaceExports(): string {
    const externalExports = this.generateExternalInterfaceExports();
    const inlineDefinitions = this.generateInlineInterfaceDefinitions();
    const operationResult = this.generateOperationResultInterface();

    return `${externalExports}

${inlineDefinitions}

${operationResult}`;
  }

  /**
   * Generate enum export section for main export
   * @returns {string} Enum exports content
   */
  private generateMainExportEnumSection(): string {
    return `// Export enums
export {
  LogLevel,
  Environment,
  HttpStatus,
  ErrorCode,
  CacheStrategy,
  RetryStrategy,
  DataFormat,
  Compression,
  HashAlgorithm,
  SortDirection,
  ComparisonOperator,
  BooleanState,
  Priority,
} from './lib/enums/index.js';`;
  }

  /**
   * Generate error export section for main export
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Error exports content
   */
  private generateMainExportErrorSection(config: ProjectConfig): string {
    const className = toPascalCase(config.name);

    return `// Export errors
export {
  ${className}Error,
  ConfigError,
  ValidationError,
  TimeoutError,
  NotFoundError,
  PermissionError,
  NetworkError,
  DatabaseError,
  is${className}Error,
  getErrorCode,
} from './lib/errors/index.js';`;
  }

  /**
   * Generate utility export section for main export
   * @returns {string} Utility exports content
   */
  private generateMainExportUtilitySection(): string {
    return `// Export utilities
export {
  deepClone,
  deepMerge,
  debounce,
  throttle,
  retry,
  timeout,
  generateUUID,
  formatBytes,
  sleep,
  isEmpty,
  capitalize,
  camelCase,
  snakeCase,
  kebabCase,
  parseQueryString,
  toQueryString,
} from './lib/utils/index.js';`;
  }

  /**
   * Generate class export section for main export
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Class export content
   */
  private generateMainExportClassSection(config: ProjectConfig): string {
    const className = toPascalCase(config.name);

    return `// Export main class
export { ${className} } from './lib/core/index.js';`;
  }
}
