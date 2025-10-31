/**
 * TypeScript Structure Generator (Refactored)
 *
 * Generates plain TypeScript project structure and files using modular approach
 */
import type { ProjectConfig } from '../../../types/project-config.js';
import type { DirectoryItem } from '../core/file-operations/types.js';
import { TypeScriptDirectoryGenerator } from './typescript-directory-generator.js';
import { TypeScriptFileGenerator } from './typescript-file-generator.js';

/**
 * Generator for TypeScript project structures (Refactored)
 */
export class TypeScriptStructureGenerator {
  private readonly directoryGenerator: TypeScriptDirectoryGenerator;
  private readonly fileGenerator: TypeScriptFileGenerator;

  /**
   * Initialize TypeScript structure generator with all sub-generators
   */
  constructor() {
    this.directoryGenerator = new TypeScriptDirectoryGenerator();
    this.fileGenerator = new TypeScriptFileGenerator();
  }

  /**
   * Generate TypeScript project structure
   * @param {ProjectConfig} config - Project configuration
   * @returns {DirectoryItem[]} TypeScript-specific directory structure
   */
  generate(config: ProjectConfig): DirectoryItem[] {
    const directories = this.directoryGenerator.generateTypeScriptDirectories();
    const files = this.fileGenerator.generateTypeScriptFiles(config);

    return [...directories, ...files];
  }
}
