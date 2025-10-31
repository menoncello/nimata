/**
 * Type Export Generator
 *
 * Generates type definitions and exports for TypeScript projects
 */
import type { ProjectConfig } from '../../../../types/project-config.js';
import { toPascalCase } from '../../../../utils/string-utils.js';

/**
 * Generates type exports for TypeScript libraries
 */
export class TypeExportGenerator {
  /**
   * Generates common type definitions and exports
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Type definitions string
   */
  generateTypeExports(config: ProjectConfig): string {
    const header = this.generateTypeHeader(config);
    const configInterface = this.generateConfigInterface(config);
    const commonTypes = this.generateCommonTypes();
    const functionTypes = this.generateFunctionTypes();
    const utilityTypes = this.generateUtilityTypes();

    return `${header}

${configInterface}

${commonTypes}

${functionTypes}

${utilityTypes}
`;
  }

  /**
   * Generate type file header
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Header content
   */
  private generateTypeHeader(config: ProjectConfig): string {
    return `// Type definitions for ${config.name}`;
  }

  /**
   * Generate configuration interface
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Configuration interface content
   */
  private generateConfigInterface(config: ProjectConfig): string {
    const className = toPascalCase(config.name);

    return `/**
 * Configuration interface for ${className}
 */
export interface ${className}Config {
  /** Enable debug logging */
  debug?: boolean;
  /** Default timeout in milliseconds */
  timeout?: number;
  /** Maximum retry attempts */
  maxRetries?: number;
  /** Enable performance monitoring */
  enableMetrics?: boolean;
}`;
  }

  /**
   * Generate common types
   * @returns {string} Common types content
   */
  private generateCommonTypes(): string {
    return `/**
 * Generic result type for operations
 */
export type OperationResult<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

/**
 * Event handler type
 */
export type EventHandler<T = unknown> = (data: T) => void | Promise<void>;`;
  }

  /**
   * Generate function types
   * @returns {string} Function types content
   */
  private generateFunctionTypes(): string {
    return `/**
 * Async function type
 */
export type AsyncFunction<T = unknown> = (...args: unknown[]) => Promise<T>;

/**
 * Predicate function type
 */
export type Predicate<T = unknown> = (value: T) => boolean;

/**
 * Mapper function type
 */
export type Mapper<T, U> = (value: T, index: number) => U;

/**
 * Reducer function type
 */
export type Reducer<T, U> = (accumulator: U, current: T, index: number) => U;`;
  }

  /**
   * Generate utility types
   * @returns {string} Utility types content
   */
  private generateUtilityTypes(): string {
    return `/**
 * Optional utility types
 */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Required utility types
 */
export type RequiredKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Deep partial utility type
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Deep required utility type
 */
export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};`;
  }
}
