/**
 * Enhanced Index File Generator
 *
 * Generates comprehensive main index.ts files with interfaces and classes
 * supporting all project types with proper entry point patterns
 */
import type { ProjectConfig } from '../../../types/project-config.js';
// Import all generator modules
import {
  generateCLIIndexFile as generateCLIIndexFileModule,
  generateWebIndexFile as generateWebIndexFileModule,
  generateLibraryIndexFile as generateLibraryIndexFileModule,
  generateTypeScriptIndexFile as generateTypeScriptIndexFileModule,
  generateFrameworkIndexFile as generateFrameworkIndexFileModule,
  getBaseInterface,
  getClassHeader,
  getClassConstructor,
  getInitializeMethod,
  getConfigMethod,
  getUpdateConfigMethod,
  getClassFooter,
  generateIndexDocumentation,
} from './modules/index.js';

const BUN_FRAMEWORK_PREFIX = 'bun-';

/**
 * Generator for main index files with project-type specific patterns
 */
export class IndexGenerator {
  /**
   * Generate main index.ts file content based on project type
   * @param config - Project configuration
   * @returns Index file TypeScript code
   */
  generateIndexFile(config: ProjectConfig): string {
    switch (config.projectType) {
      case 'cli':
        return this.generateCLIIndexFile(config);
      case 'web':
        return this.generateWebIndexFile(config);
      case 'library':
        return this.generateLibraryIndexFile(config);
      case `${BUN_FRAMEWORK_PREFIX}typescript`:
        return this.generateTypeScriptIndexFile(config);
      case `${BUN_FRAMEWORK_PREFIX}react`:
      case `${BUN_FRAMEWORK_PREFIX}vue`:
      case `${BUN_FRAMEWORK_PREFIX}express`:
        return this.generateFrameworkIndexFile(config);
      case 'basic':
      default:
        return this.generateBasicIndexFile(config);
    }
  }

  /**
   * Generate CLI project index file
   * @param config - Project configuration
   * @returns CLI index file TypeScript code
   */
  private generateCLIIndexFile(config: ProjectConfig): string {
    return generateCLIIndexFileModule(config);
  }

  /**
   * Generate Web project index file
   * @param config - Project configuration
   * @returns Web index file TypeScript code
   */
  private generateWebIndexFile(config: ProjectConfig): string {
    return generateWebIndexFileModule(config);
  }

  /**
   * Generate Library project index file
   * @param config - Project configuration
   * @returns Library index file TypeScript code
   */
  private generateLibraryIndexFile(config: ProjectConfig): string {
    return generateLibraryIndexFileModule(config);
  }

  /**
   * Generate TypeScript project index file
   * @param config - Project configuration
   * @returns TypeScript index file TypeScript code
   */
  private generateTypeScriptIndexFile(config: ProjectConfig): string {
    return generateTypeScriptIndexFileModule(config);
  }

  /**
   * Generate Framework project index file (React, Vue, Express)
   * @param config - Project configuration
   * @returns Framework index file TypeScript code
   */
  private generateFrameworkIndexFile(config: ProjectConfig): string {
    return generateFrameworkIndexFileModule(config);
  }

  /**
   * Generate Basic project index file (original implementation)
   * @param config - Project configuration
   * @returns Basic index file TypeScript code
   */
  private generateBasicIndexFile(config: ProjectConfig): string {
    const exportInterface = this.generateExportInterface(config);
    const exportClass = this.generateExportClass(config);
    const documentation = generateIndexDocumentation(config);

    return `${documentation}

${exportInterface}

${exportClass}`;
  }

  /**
   * Generate export interface
   * @param config - Project configuration
   * @returns Interface TypeScript code
   */
  private generateExportInterface(config: ProjectConfig): string {
    return getBaseInterface(config);
  }

  /**
   * Generate export class
   * @param config - Project configuration
   * @returns Class TypeScript code
   */
  private generateExportClass(config: ProjectConfig): string {
    const className = `${this.toPascalCase(config.name)}Core`;

    return [
      getClassHeader(config, className),
      getClassConstructor(config),
      getInitializeMethod(config),
      getConfigMethod(className),
      getUpdateConfigMethod(className),
      getClassFooter(),
    ].join('\n');
  }

  /**
   * Convert string to PascalCase
   * @param str - Input string
   * @returns PascalCase string
   */
  private toPascalCase(str: string): string {
    return str
      .replace(/(?:^\w)|[A-Z]|(?:\b\w)/g, (word) => {
        return word.toUpperCase();
      })
      .replace(/\s+/g, '')
      .replace(/-/g, '')
      .replace(/_/g, '');
  }
}
