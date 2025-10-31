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
  getSetConfigMethod,
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
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Index file TypeScript code
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
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} CLI index file TypeScript code
   */
  private generateCLIIndexFile(config: ProjectConfig): string {
    return generateCLIIndexFileModule(config);
  }

  /**
   * Generate Web project index file
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Web index file TypeScript code
   */
  private generateWebIndexFile(config: ProjectConfig): string {
    return generateWebIndexFileModule(config);
  }

  /**
   * Generate Library project index file
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Library index file TypeScript code
   */
  private generateLibraryIndexFile(config: ProjectConfig): string {
    return generateLibraryIndexFileModule(config);
  }

  /**
   * Generate TypeScript project index file
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} TypeScript index file TypeScript code
   */
  private generateTypeScriptIndexFile(config: ProjectConfig): string {
    return generateTypeScriptIndexFileModule(config);
  }

  /**
   * Generate Framework project index file (React, Vue, Express)
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Framework index file TypeScript code
   */
  private generateFrameworkIndexFile(config: ProjectConfig): string {
    return generateFrameworkIndexFileModule(config);
  }

  /**
   * Generate Basic project index file (original implementation)
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Basic index file TypeScript code
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
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Interface TypeScript code
   */
  private generateExportInterface(config: ProjectConfig): string {
    return getBaseInterface(config);
  }

  /**
   * Generate export class
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Class TypeScript code
   */
  private generateExportClass(config: ProjectConfig): string {
    const className = `${this.toPascalCase(config.name)}Core`;

    return [
      getClassHeader(config, className),
      getClassConstructor(config),
      getInitializeMethod(config),
      getConfigMethod(className),
      getSetConfigMethod(className),
      getUpdateConfigMethod(className),
      getClassFooter(),
    ].join('\n');
  }

  /**
   * Convert string to PascalCase
   * @param {string} str - Input string
   * @returns {string} PascalCase string
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
