/**
 * Main Export Generator
 *
 * Generates the main export file for libraries
 */
import type { ProjectConfig } from '../../../../types/project-config.js';
import { toPascalCase } from '../../../../utils/string-utils.js';

/**
 * Generates the main export file for libraries
 */
export class MainExportGenerator {
  /**
   * Generates the main export file content
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Main export file code
   */
  generateMainExport(config: ProjectConfig): string {
    const className = toPascalCase(config.name);
    const header = this.generateMainHeader(config, className);
    const coreExports = this.generateCoreExports(className);
    const typeExports = this.generateTypeExports(className);
    const utilityExports = this.generateUtilityExports();
    const constantExports = this.generateConstantExports();
    const defaultExport = this.generateDefaultExport(className);

    return [header, coreExports, typeExports, utilityExports, constantExports, defaultExport].join(
      '\n'
    );
  }

  /**
   * Generates the main file header
   * @param {ProjectConfig} config - Project configuration
   * @param {string} _className - Name of the class
   * @returns {string} Header code
   */
  private generateMainHeader(config: ProjectConfig, _className: string): string {
    return `/**
 * ${config.name}
 *
${config.description || 'A modern TypeScript library'}
 *
 * @author ${config.author || 'Your Name'}
 * @version 1.0.0
 * @license ${config.license || 'MIT'}
 */`;
  }

  /**
   * Generates core module exports
   * @param {string} className - Name of the class
   * @returns {string} Core exports code
   */
  private generateCoreExports(className: string): string {
    return `// Core exports
export { ${className} } from './core.js';`;
  }

  /**
   * Generates type exports
   * @param {string} className - Name of the class
   * @returns {string} Type exports code
   */
  private generateTypeExports(className: string): string {
    return `export type { ${className}Config, ${className}Options } from './types/index.js';`;
  }

  /**
   * Generates utility exports
   * @returns {string} Utility exports code
   */
  private generateUtilityExports(): string {
    return `// Utility exports
export * from './utils/index.js';`;
  }

  /**
   * Generates constant exports
   * @returns {string} Constant exports code
   */
  private generateConstantExports(): string {
    return `// Constant exports
export * from './constants/index.js';`;
  }

  /**
   * Generates default export
   * @param {string} className - Name of the class
   * @returns {string} Default export code
   */
  private generateDefaultExport(className: string): string {
    return `// Default export
export { ${className} as default } from './core.js';`;
  }
}
