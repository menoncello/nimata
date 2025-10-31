/**
 * TypeScript Core Module Generator
 *
 * Handles the generation of the core module for TypeScript projects
 */
import type { ProjectConfig } from '../../../types/project-config.js';
import { toPascalCase } from '../../../utils/string-utils.js';

/**
 * Generator for TypeScript core module
 */
export class TypeScriptCoreModuleGenerator {
  /**
   * Generate core module file
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Core module content
   */
  generateCoreModule(config: ProjectConfig): string {
    const header = this.generateCoreModuleHeader(config);
    const imports = this.generateCoreModuleImports(config);
    const constants = this.generateCoreModuleConstants(config);
    const classDefinition = this.generateCoreClassDefinition(config);

    return `${header}

${imports}

${constants}

${classDefinition}
`;
  }

  /**
   * Generate core module header
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Header content
   */
  private generateCoreModuleHeader(config: ProjectConfig): string {
    const className = toPascalCase(config.name);
    const description = config.description || `Main implementation class for ${config.name}`;

    return `/**
 * Core ${className} class
 *
 * ${description}
 */`;
  }

  /**
   * Generate core module imports
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Imports content
   */
  private generateCoreModuleImports(config: ProjectConfig): string {
    const className = toPascalCase(config.name);

    return `import type { ${className}Config } from '../types/index.js';
import { ErrorCode, ${className}Error } from '../errors/index.js';
import { deepMerge, isEmpty } from '../utils/index.js';`;
  }

  /**
   * Generate core module constants
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Constants content
   */
  private generateCoreModuleConstants(config: ProjectConfig): string {
    const className = toPascalCase(config.name);

    return `/**
 * Default configuration for ${className}
 */
const DEFAULT_CONFIG: Partial<${className}Config> = {
  debug: false,
  timeout: 5000,
  maxRetries: 3,
  enableMetrics: false,
};`;
  }

  /**
   * Generate core class definition
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Class definition content
   */
  private generateCoreClassDefinition(config: ProjectConfig): string {
    const className = toPascalCase(config.name);
    const constructor = this.generateCoreConstructor(className);
    const publicMethods = this.generateCorePublicMethods(className);
    const privateMethods = this.generateCorePrivateMethods(className);

    return `/**
 * Main ${className} class
 */
export class ${className} {
  private readonly config: ${className}Config;
  private initialized: boolean = false;

${constructor}

${publicMethods}

${privateMethods}
}`;
  }

  /**
   * Generate core class constructor
   * @param {string} className - Class name
   * @returns {string} Constructor content
   */
  private generateCoreConstructor(className: string): string {
    return `  constructor(config?: Partial<${className}Config>) {
    this.config = this.mergeWithDefaults(config);
  }`;
  }

  /**
   * Generate core class public methods
   * @param {string} className - Class name
   * @returns {string} Public methods content
   */
  private generateCorePublicMethods(className: string): string {
    const initializeMethod = this.generateCoreInitializeMethod(className);
    const configMethods = this.generateCoreConfigMethods(className);
    const stateMethods = this.generateCoreStateMethods(className);

    return `${initializeMethod}

${configMethods}

${stateMethods}`;
  }

  /**
   * Generate core initialize method
   * @param {string} className - Class name
   * @returns {string} Initialize method content
   */
  private generateCoreInitializeMethod(className: string): string {
    return `  /**
   * Initialize the ${className} instance
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    this.validateConfig(this.config);

    if (this.config.debug) {
      console.log('Initializing ${className}...');
    }

    // Initialize components here
    this.initialized = true;

    if (this.config.debug) {
      console.log('${className} initialized successfully');
    }
  }`;
  }

  /**
   * Generate core configuration methods
   * @param {string} className - Class name
   * @returns {string} Configuration methods content
   */
  private generateCoreConfigMethods(className: string): string {
    return `  /**
   * Get current configuration
   */
  getConfig(): ${className}Config {
    return { ...this.config };
  }

  /**
   * Update configuration
   */
  updateConfig(updates: Partial<${className}Config>): void {
    this.validateConfig({ ...this.config, ...updates });
    Object.assign(this.config, updates);
  }`;
  }

  /**
   * Generate core state methods
   * @param {string} className - Class name
   * @returns {string} State methods content
   */
  private generateCoreStateMethods(className: string): string {
    return `  /**
   * Check if instance is initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Reset the instance
   */
  reset(): void {
    if (this.config.debug) {
      console.log('Resetting ${className}...');
    }
    this.initialized = false;
  }`;
  }

  /**
   * Generate core class private methods
   * @param {string} className - Class name
   * @returns {string} Private methods content
   */
  private generateCorePrivateMethods(className: string): string {
    const validationMethod = this.generateCoreValidationMethod(className);
    const mergeMethod = this.generateCoreMergeMethod(className);

    return `${validationMethod}

${mergeMethod}`;
  }

  /**
   * Generate core validation method
   * @param {string} className - Class name
   * @returns {string} Validation method content
   */
  private generateCoreValidationMethod(className: string): string {
    return `  /**
   * Validate configuration
   */
  private validateConfig(config: Partial<${className}Config>): void {
    if (!config) {
      throw new ${className}Error('Configuration is required', ErrorCode.MissingConfig);
    }

    // Add specific validation logic here
  }`;
  }

  /**
   * Generate core merge method
   * @param {string} className - Class name
   * @returns {string} Merge method content
   */
  private generateCoreMergeMethod(className: string): string {
    return `  /**
   * Merge configuration with defaults
   */
  private mergeWithDefaults(config?: Partial<${className}Config>): ${className}Config {
    return deepMerge(DEFAULT_CONFIG, config || {}) as ${className}Config;
  }`;
  }
}
