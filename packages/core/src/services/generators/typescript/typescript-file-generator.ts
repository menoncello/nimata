/**
 * TypeScript File Generator
 *
 * Handles the generation of TypeScript-specific files
 */
import type { ProjectConfig } from '../../../types/project-config.js';
import type { DirectoryItem } from '../core/file-operations/types.js';
import { TypeScriptConfigGenerator } from './typescript-config-generator.js';
import { TypeScriptCoreModuleGenerator } from './typescript-core-module-generator.js';
import { TypeScriptMainExportGenerator } from './typescript-main-export-generator.js';
import { TypeScriptTypeExportGenerator } from './typescript-type-export-generator.js';

/**
 * Generator for TypeScript project files
 */
export class TypeScriptFileGenerator {
  private readonly mainExportGenerator: TypeScriptMainExportGenerator;
  private readonly coreModuleGenerator: TypeScriptCoreModuleGenerator;
  private readonly typeExportGenerator: TypeScriptTypeExportGenerator;
  private readonly configGenerator: TypeScriptConfigGenerator;

  /**
   * Initialize TypeScript file generator with all sub-generators
   */
  constructor() {
    this.mainExportGenerator = new TypeScriptMainExportGenerator();
    this.coreModuleGenerator = new TypeScriptCoreModuleGenerator();
    this.typeExportGenerator = new TypeScriptTypeExportGenerator();
    this.configGenerator = new TypeScriptConfigGenerator();
  }

  /**
   * Get TypeScript-specific files
   * @param {ProjectConfig} config - Project configuration
   * @returns {DirectoryItem[]} Array of file items
   */
  generateTypeScriptFiles(config: ProjectConfig): DirectoryItem[] {
    return [
      ...this.getMainFiles(config),
      ...this.getLibraryFiles(config),
      ...this.getConfigFiles(config),
    ];
  }

  /**
   * Get main TypeScript files
   * @param {ProjectConfig} config - Project configuration
   * @returns {DirectoryItem[]} Main file items
   */
  private getMainFiles(config: ProjectConfig): DirectoryItem[] {
    return [
      {
        path: 'src/index.ts',
        type: 'file',
        content: this.mainExportGenerator.generateMainExport(config),
      },
    ];
  }

  /**
   * Get library TypeScript files
   * @param {ProjectConfig} config - Project configuration
   * @returns {DirectoryItem[]} Library file items
   */
  private getLibraryFiles(config: ProjectConfig): DirectoryItem[] {
    const coreFiles = this.getCoreLibraryFiles(config);
    const typeFiles = this.getTypeLibraryFiles(config);
    const utilityFiles = this.getUtilityLibraryFiles(config);

    return [...coreFiles, ...typeFiles, ...utilityFiles];
  }

  /**
   * Get core library files
   * @param {ProjectConfig} config - Project configuration
   * @returns {DirectoryItem[]} Core library file items
   */
  private getCoreLibraryFiles(config: ProjectConfig): DirectoryItem[] {
    return [
      {
        path: 'src/lib/core/index.ts',
        type: 'file',
        content: this.coreModuleGenerator.generateCoreModule(config),
      },
    ];
  }

  /**
   * Get type-related library files
   * @param {ProjectConfig} config - Project configuration
   * @returns {DirectoryItem[]} Type library file items
   */
  private getTypeLibraryFiles(config: ProjectConfig): DirectoryItem[] {
    return [
      {
        path: 'src/lib/types/index.ts',
        type: 'file',
        content: this.typeExportGenerator.generateTypeExports(config),
      },
      {
        path: 'src/lib/interfaces/index.ts',
        type: 'file',
        content: this.typeExportGenerator.generateInterfaceExports(config),
      },
      {
        path: 'src/lib/enums/index.ts',
        type: 'file',
        content: this.typeExportGenerator.generateEnumExports(config),
      },
      {
        path: 'src/lib/errors/index.ts',
        type: 'file',
        content: this.typeExportGenerator.generateErrorExports(config),
      },
    ];
  }

  /**
   * Get utility library files
   * @param {ProjectConfig} config - Project configuration
   * @returns {DirectoryItem[]} Utility library file items
   */
  private getUtilityLibraryFiles(config: ProjectConfig): DirectoryItem[] {
    return [
      {
        path: 'src/lib/utils/index.ts',
        type: 'file',
        content: this.typeExportGenerator.generateUtilsExports(config),
      },
    ];
  }

  /**
   * Get configuration files
   * @param {ProjectConfig} config - Project configuration
   * @returns {DirectoryItem[]} Configuration file items
   */
  private getConfigFiles(config: ProjectConfig): DirectoryItem[] {
    return [
      {
        path: 'tsconfig.json',
        type: 'file',
        content: this.configGenerator.generateTypeScriptConfig(config),
      },
    ];
  }
}
