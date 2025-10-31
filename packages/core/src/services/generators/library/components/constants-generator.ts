/**
 * Constants Generator
 *
 * Generates constants and default values for libraries
 */
import type { ProjectConfig } from '../../../../types/project-config.js';
import { toPascalCase } from '../../../../utils/string-utils.js';

/**
 * Generates constants and default values for libraries
 */
export class ConstantsGenerator {
  /**
   * Generates the constants exports file
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Constants module code
   */
  generateConstantsExports(config: ProjectConfig): string {
    const className = toPascalCase(config.name);
    const defaultConfig = this.generateDefaultConfig(config, className);
    const errorCodes = this.generateErrorCodes();
    const eventTypes = this.generateEventTypes();
    const defaultOptions = this.generateDefaultOptions();
    const libraryInfo = this.generateLibraryInfo(config);

    return `/**
 * ${config.name} Constants
 *
 * Default values and constants
 */

import type { ${className}Config } from '../types/index.js';

${defaultConfig}

${errorCodes}

${eventTypes}

${defaultOptions}

${libraryInfo}
`;
  }

  /**
   * Generates the default configuration
   * @param {ProjectConfig} config - Project configuration
   * @param {string} className - Name of the class
   * @returns {string} Default configuration code
   */
  private generateDefaultConfig(config: ProjectConfig, className: string): string {
    return `/**
 * Default configuration
 */
export const DEFAULT_CONFIG: ${className}Config = {
  name: '${config.name}',
  version: '1.0.0',
  debug: false,
  options: {},
};`;
  }

  /**
   * Generates error codes constants
   * @returns {string} Error codes code
   */
  private generateErrorCodes(): string {
    return `/**
 * Error codes
 */
export const ERROR_CODES = {
  INITIALIZATION_FAILED: 'INIT_FAILED',
  NOT_INITIALIZED: 'NOT_INITIALIZED',
  INVALID_CONFIG: 'INVALID_CONFIG',
  PROCESSING_FAILED: 'PROCESSING_FAILED',
  TIMEOUT: 'TIMEOUT',
  VALIDATION_FAILED: 'VALIDATION_FAILED',
} as const;`;
  }

  /**
   * Generates event types constants
   * @returns {string} Event types code
   */
  private generateEventTypes(): string {
    return `/**
 * Event types
 */
export const EVENT_TYPES = {
  INITIALIZED: 'initialized',
  DESTROYED: 'destroyed',
  CONFIG_UPDATED: 'config_updated',
  PROCESSING_STARTED: 'processing_started',
  PROCESSING_COMPLETED: 'processing_completed',
  ERROR_OCCURRED: 'error_occurred',
} as const;`;
  }

  /**
   * Generates default options constants
   * @returns {string} Default options code
   */
  private generateDefaultOptions(): string {
    return `/**
 * Default options
 */
export const DEFAULT_OPTIONS = {
  mode: 'async' as const,
  timeout: 30000,
  retries: 3,
};`;
  }

  /**
   * Generates library information constants
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Library information code
   */
  private generateLibraryInfo(config: ProjectConfig): string {
    return `/**
 * Library metadata
 */
export const LIBRARY_INFO = {
  name: '${config.name}',
  version: '1.0.0',
  description: '${config.description || 'A modern TypeScript library'}',
  author: '${config.author || 'Your Name'}',
  license: '${config.license || 'MIT'}',
  repository: 'https://github.com/your-username/${config.name}',
  homepage: 'https://github.com/your-username/${config.name}#readme',
  bugs: 'https://github.com/your-username/${config.name}/issues',
} as const;`;
  }
}
