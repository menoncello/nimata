/**
 * TypeScript class generators
 */
import type { ProjectConfig } from '../../../../../types/project-config.js';
import { convertToPascalCase } from '../shared/common-generators.js';

/**
 * Generate TypeScript class
 * @param {ProjectConfig} config - Project configuration
 * @returns {string} TypeScript class TypeScript code
 */
export function generateTypeScriptClass(config: ProjectConfig): string {
  const className = convertToPascalCase(config.name);
  return [
    generateTSClassHeader(className, config),
    generateTSConstructor(className, config),
    generateTSInitializeMethod(),
    generateTSValidateMethod(),
    generateTSAdaptMethod(),
    generateTSExecuteServiceMethod(),
    generateTSConfigMethods(className),
  ].join('\n');
}

/**
 * Generate TypeScript class header and properties
 * @param {string} className - Class name
 * @param {ProjectConfig} _config - Project configuration
 * @returns {string} Class header TypeScript code
 */
function generateTSClassHeader(className: string, _config: ProjectConfig): string {
  return `export class ${className} {
  private config: ${className}Config;
  private initialized: boolean = false;`;
}

/**
 * Generate TypeScript class constructor
 * @param {string} className - Class name
 * @param {ProjectConfig} config - Project configuration
 * @returns {string} Constructor TypeScript code
 */
function generateTSConstructor(className: string, config: ProjectConfig): string {
  return `  constructor(config: Partial<${className}Config> = {}) {
    this.config = {
      name: '${config.name}',
      version: '1.0.0',
      debug: false,
      options: {},
      ...config
    };
  }`;
}

/**
 * Generate TypeScript initialize method
 * @returns {string} Initialize method TypeScript code
 */
function generateTSInitializeMethod(): string {
  return `  /**
   * Initialize TypeScript utilities
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    if (this.config.debug) {
      console.log(\`\${this.config.name} v\${this.config.version} initializing...\`);
    }

    // Initialize TypeScript-specific logic here
    this.initialized = true;

    if (this.config.debug) {
      console.log('TypeScript utilities initialized successfully');
    }
  }`;
}

/**
 * Generate TypeScript validate method
 * @returns {string} Validate method TypeScript code
 */
function generateTSValidateMethod(): string {
  return `  /**
   * Validate input with validator
   * @param {string} validator - Validator to use
   * @param {string} input - Input to validate
   * @returns {string} Validation result
   */
  validate(validator: Validator, input: unknown): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!validator.validate(input)) {
      if (validator.errorMessage) {
        errors.push(validator.errorMessage);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }`;
}

/**
 * Generate TypeScript adapt method
 * @returns {string} Adapt method TypeScript code
 */
function generateTSAdaptMethod(): string {
  return `  /**
   * Adapt data with adapter
   * @param {string} adapter - Adapter to use
   * @param {string} input - Input to adapt
   * @returns {string} Adapted data
   */
  adapt<T = unknown, U = unknown>(adapter: Adapter<T, U>, input: T): U {
    return adapter.adapt(input);
  }`;
}

/**
 * Generate TypeScript execute service method
 * @returns {string} Execute service method TypeScript code
 */
function generateTSExecuteServiceMethod(): string {
  return `  /**
   * Execute service
   * @param {string} service - Service to execute
   * @param {string} input - Service input
   * @returns {string} Service result
   */
  async executeService<T = unknown, U = unknown>(
    service: Service<T>,
    input: T
  ): Promise<U> {
    return service.execute(input) as Promise<U>;
  }`;
}

/**
 * Generate TypeScript configuration methods
 * @param {string} className - Class name
 * @returns {string} Configuration methods TypeScript code
 */
function generateTSConfigMethods(className: string): string {
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
    this.config = { ...this.config, ...updates };
  }
}`;
}
