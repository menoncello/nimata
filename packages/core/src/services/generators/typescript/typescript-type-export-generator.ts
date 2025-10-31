/**
 * TypeScript Type Export Generator
 *
 * Handles the generation of type, interface, enum, error, and utility exports
 */
import type { ProjectConfig } from '../../../types/project-config.js';
import {
  TypeExportGenerator,
  InterfaceExportGenerator,
  EnumExportGenerator,
  ErrorExportGenerator,
  UtilsExportGenerator,
} from './exports/index.js';

/**
 * Generator for TypeScript type exports
 */
export class TypeScriptTypeExportGenerator {
  private readonly typeExportGenerator: TypeExportGenerator;
  private readonly interfaceExportGenerator: InterfaceExportGenerator;
  private readonly enumExportGenerator: EnumExportGenerator;
  private readonly errorExportGenerator: ErrorExportGenerator;
  private readonly utilsExportGenerator: UtilsExportGenerator;

  /**
   * Initialize type export generator with all export generators
   */
  constructor() {
    this.typeExportGenerator = new TypeExportGenerator();
    this.interfaceExportGenerator = new InterfaceExportGenerator();
    this.enumExportGenerator = new EnumExportGenerator();
    this.errorExportGenerator = new ErrorExportGenerator();
    this.utilsExportGenerator = new UtilsExportGenerator();
  }

  /**
   * Generate type exports
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Type exports content
   */
  generateTypeExports(config: ProjectConfig): string {
    return this.typeExportGenerator.generateTypeExports(config);
  }

  /**
   * Generate interface exports
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Interface exports content
   */
  generateInterfaceExports(config: ProjectConfig): string {
    return this.interfaceExportGenerator.generateInterfaceExports(config);
  }

  /**
   * Generate enum exports
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Enum exports content
   */
  generateEnumExports(config: ProjectConfig): string {
    return this.enumExportGenerator.generateEnumExports(config);
  }

  /**
   * Generate error exports
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Error exports content
   */
  generateErrorExports(config: ProjectConfig): string {
    return this.errorExportGenerator.generateErrorExports(config);
  }

  /**
   * Generate utility exports
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Utility exports content
   */
  generateUtilsExports(config: ProjectConfig): string {
    return this.utilsExportGenerator.generateUtilsExports(config);
  }
}
