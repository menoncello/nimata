/**
 * Common generators and utilities for index files
 */
import type { ProjectConfig } from '../../../../../types/project-config.js';
import { toPascalCase } from '../../../../../utils/string-utils.js';

/**
 * Generate index documentation
 * @param config - Project configuration
 * @returns Documentation JSDoc comment
 */
export function generateIndexDocumentation(config: ProjectConfig): string {
  return `/**
 * ${config.name}
 * ${config.description || 'A modern TypeScript library built with Bun'}
 *
 * @author ${config.author || 'Unknown'}
 * @license ${config.license || 'MIT'}
 * @version 1.0.0
 *
 * This package was generated using ${config.template || 'basic'} template
 * with ${config.qualityLevel} quality standards.
 */`;
}

/**
 * Generate base interface definition
 * @param config - Project configuration
 * @returns Base interface code
 */
export function getBaseInterface(config: ProjectConfig): string {
  return `/**
 * ${config.name} configuration and utilities
 */
export interface ${toPascalCase(config.name)}Config {
  /**
   * Enable debug mode
   */
  debug?: boolean;

  /**
   * Custom options for ${config.name}
   */
  options?: Record<string, unknown>;
}`;
}

/**
 * Generate class header
 * @param config - Project configuration
 * @param className - Class name
 * @returns Class header
 */
export function getClassHeader(config: ProjectConfig, className: string): string {
  return `/**
 * ${config.name} core functionality
 */
export class ${className} {
  private config: ${toPascalCase(config.name)}Config;`;
}

/**
 * Generate class constructor
 * @param config - Project configuration
 * @returns Class constructor
 */
export function getClassConstructor(config: ProjectConfig): string {
  return `  constructor(config: ${toPascalCase(config.name)}Config = {}) {
    this.config = {
      debug: false,
      options: {},
      ...config
    };
  }`;
}

/**
 * Generate initialize method
 * @param config - Project configuration
 * @returns Initialize method
 */
export function getInitializeMethod(config: ProjectConfig): string {
  return `  /**
   * Initialize ${config.name}
   */
  async initialize(): Promise<void> {
    if (this.config.debug) {
      console.log(\`${config.name} initialized with debug mode\`);
    }
  }`;
}

/**
 * Generate getConfig method
 * @param className - Class name
 * @returns GetConfig method
 */
export function getConfigMethod(className: string): string {
  return `  /**
   * Get current configuration
   */
  getConfig(): ${className.replace('Core', '')}Config {
    return { ...this.config };
  }`;
}

/**
 * Generate updateConfig method
 * @param className - Class name
 * @returns UpdateConfig method
 */
export function getUpdateConfigMethod(className: string): string {
  return `  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<${className.replace('Core', '')}Config>): void {
    this.config = { ...this.config, ...newConfig };
  }`;
}

/**
 * Generate class footer
 * @returns Class footer
 */
export function getClassFooter(): string {
  return `}`;
}

/**
 * Convert string to PascalCase
 * @param str - Input string
 * @returns PascalCase string
 */
export function convertToPascalCase(str: string): string {
  return toPascalCase(str);
}
