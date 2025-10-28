/**
 * TypeScript class generators
 */
import type { ProjectConfig } from '../../../../../types/project-config.js';
import { convertToPascalCase } from '../shared/common-generators.js';

/**
 * Generate TypeScript class
 * @param config - Project configuration
 * @returns TypeScript class TypeScript code
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
 * @param className - Class name
 * @param _config - Project configuration
 * @returns Class header TypeScript code
 */
function generateTSClassHeader(className: string, _config: ProjectConfig): string {
  return `export class ${className} {
  private config: ${className}Config;
  private initialized: boolean = false;`;
}

/**
 * Generate TypeScript class constructor
 * @param className - Class name
 * @param config - Project configuration
 * @returns Constructor TypeScript code
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
 * @returns Initialize method TypeScript code
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
 * @returns Validate method TypeScript code
 */
function generateTSValidateMethod(): string {
  return `  /**
   * Validate input with validator
   * @param validator - Validator to use
   * @param input - Input to validate
   * @returns Validation result
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
 * @returns Adapt method TypeScript code
 */
function generateTSAdaptMethod(): string {
  return `  /**
   * Adapt data with adapter
   * @param adapter - Adapter to use
   * @param input - Input to adapt
   * @returns Adapted data
   */
  adapt<T = unknown, U = unknown>(adapter: Adapter<T, U>, input: T): U {
    return adapter.adapt(input);
  }`;
}

/**
 * Generate TypeScript execute service method
 * @returns Execute service method TypeScript code
 */
function generateTSExecuteServiceMethod(): string {
  return `  /**
   * Execute service
   * @param service - Service to execute
   * @param input - Service input
   * @returns Service result
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
 * @param className - Class name
 * @returns Configuration methods TypeScript code
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
