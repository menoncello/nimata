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
   * @param config - Project configuration
   * @returns Main export file code
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
   * @param config - Project configuration
   * @param _className - Name of the class
   * @returns Header code
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
   * @param className - Name of the class
   * @returns Core exports code
   */
  private generateCoreExports(className: string): string {
    return `// Core exports
export { ${className} } from './core.js';`;
  }

  /**
   * Generates type exports
   * @param className - Name of the class
   * @returns Type exports code
   */
  private generateTypeExports(className: string): string {
    return `export type { ${className}Config, ${className}Options } from './types/index.js';`;
  }

  /**
   * Generates utility exports
   * @returns Utility exports code
   */
  private generateUtilityExports(): string {
    return `// Utility exports
export * from './utils/index.js';`;
  }

  /**
   * Generates constant exports
   * @returns Constant exports code
   */
  private generateConstantExports(): string {
    return `// Constant exports
export * from './constants/index.js';`;
  }

  /**
   * Generates default export
   * @param className - Name of the class
   * @returns Default export code
   */
  private generateDefaultExport(className: string): string {
    return `// Default export
export { ${className} as default } from './core.js';`;
  }
}
