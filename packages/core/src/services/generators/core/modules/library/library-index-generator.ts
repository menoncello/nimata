/**
 * Library index file generators
 */
import type { ProjectConfig } from '../../../../../types/project-config.js';
import { generateIndexDocumentation, convertToPascalCase } from '../shared/common-generators.js';
import { generateLibraryClass } from './library-classes.js';
import { generateLibraryExports } from './library-exports.js';
import { generateLibraryInterface } from './library-interfaces.js';

/**
 * Generate Library project index file
 * @param {ProjectConfig} config - Project configuration
 * @returns {string} Library index file TypeScript code
 */
export function generateLibraryIndexFile(config: ProjectConfig): string {
  return [
    generateLibraryIndexHeader(config),
    generateLibraryIndexInterfaces(config),
    generateLibraryIndexClass(config),
    generateLibraryIndexExports(config),
    generateLibraryIndexUtilities(config),
  ].join('\n\n');
}

/**
 * Generate library index file header
 * @param {ProjectConfig} config - Project configuration
 * @returns {string} Header documentation
 */
function generateLibraryIndexHeader(config: ProjectConfig): string {
  return `/**
 * ${config.name} - A modern TypeScript library
 *
 * @author ${config.author || 'Your Name'}
 * @license ${config.license || 'MIT'}
 * @version 1.0.0
 */`;
}

/**
 * Generate library index interfaces
 * @param {ProjectConfig} config - Project configuration
 * @returns {string} Interface definitions
 */
function generateLibraryIndexInterfaces(config: ProjectConfig): string {
  return generateLibraryInterface(config);
}

/**
 * Generate library index main class
 * @param {ProjectConfig} config - Project configuration
 * @returns {string} Main class implementation
 */
function generateLibraryIndexClass(config: ProjectConfig): string {
  const className = convertToPascalCase(config.name);
  return `// Main library class
export class ${className} {
  private version: string = '1.0.0';

  /**
   * Get library version
   */
  getVersion(): string {
    return this.version;
  }

  /**
   * Main library functionality
   */
  process(input: unknown): unknown {
    // TODO: Implement main library functionality
    return input;
  }
}`;
}

/**
 * Generate library index exports
 * @param {ProjectConfig} config - Project configuration
 * @returns {string} Export statements
 */
function generateLibraryIndexExports(config: ProjectConfig): string {
  const className = convertToPascalCase(config.name);
  return `// Export all from internal modules
export * from './types/index.js';
export * from './utils/index.js';
export * from './services/index.js';

// Export main class explicitly
export { ${className} };

// Export types for library
export type { Config, ProcessResult };`;
}

/**
 * Generate library index utilities
 * @param {ProjectConfig} config - Project configuration
 * @returns {string} Utility exports
 */
function generateLibraryIndexUtilities(config: ProjectConfig): string {
  const className = convertToPascalCase(config.name);
  return `// Export default and utilities
export default ${className};
export const VERSION = '1.0.0';
export const PACKAGE_NAME = '${config.name}';`;
}

/**
 * Generate comprehensive library project index file with interfaces and classes
 * @param {ProjectConfig} config - Project configuration
 * @returns {string} Library index file TypeScript code
 */
export function generateLibraryProjectIndexFile(config: ProjectConfig): string {
  const documentation = generateIndexDocumentation(config);
  const interfaceCode = generateLibraryInterface(config);
  const classCode = generateLibraryClass(config);
  const exports = generateLibraryExports(config);

  return `${documentation}

${interfaceCode}

${classCode}

${exports}`;
}
