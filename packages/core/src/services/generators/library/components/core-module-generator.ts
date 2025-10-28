/**
 * Core Module Generator
 *
 * Generates the main library class and core functionality
 */
import type { ProjectConfig } from '../../../../types/project-config.js';
import { toPascalCase } from '../../../../utils/string-utils.js';

/**
 * Generates the main library core module
 * @param config - Project configuration
 * @returns Core module TypeScript code
 */
export class CoreModuleGenerator {
  /**
   * Generates the main library class
   * @param config - Project configuration
   * @returns TypeScript class code
   */
  generateCoreModule(config: ProjectConfig): string {
    const className = toPascalCase(config.name);
    const constructor = this.generateConstructor(className);
    const initializeMethod = this.generateInitializeMethod();
    const configMethods = this.generateConfigMethods(className);
    const processMethod = this.generateProcessMethod(className);

    return `/**
 * ${className} Core Module
 *
 * Main library implementation
 */

import type { ${className}Config, ${className}Options } from './types/index.js';
import { DEFAULT_CONFIG } from './constants/index.js';
import { validateConfig, mergeConfigs } from './utils/index.js';

/**
 * Main ${className} class
 */
export class ${className} {
  private config: ${className}Config;
  private initialized: boolean = false;

  ${constructor}

  ${initializeMethod}

  ${configMethods}

  ${processMethod}
}`;
  }

  /**
   * Generates the constructor for the main class
   * @param className - Name of the class
   * @returns Constructor method code
   */
  private generateConstructor(className: string): string {
    return `/**
   * Create a new ${className} instance
   * @param config - Configuration options
   */
  constructor(config?: Partial<${className}Config>) {
    this.config = mergeConfigs(DEFAULT_CONFIG, config);
  }`;
  }

  /**
   * Generates the initialize method
   * @returns Initialize method code
   */
  private generateInitializeMethod(): string {
    return `/**
   * Initialize the library
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      // Validate configuration
      validateConfig(this.config);

      if (this.config.debug) {
        console.log(\`\${this.config.name} v\${this.config.version} initializing...\`);
      }

      // Perform initialization logic here
      this.initialized = true;

      if (this.config.debug) {
        console.log(\`\${this.config.name} initialized successfully\`);
      }
    } catch (error) {
      console.error(\`Failed to initialize \${this.config.name}:\`, error);
      throw error;
    }
  }`;
  }

  /**
   * Generates configuration-related methods
   * @param className - Name of the class
   * @returns Configuration methods code
   */
  private generateConfigMethods(className: string): string {
    return `/**
   * Get current configuration
   * @returns Current configuration
   */
  getConfig(): ${className}Config {
    return { ...this.config };
  }

  /**
   * Update configuration
   * @param updates - Configuration updates
   */
  updateConfig(updates: Partial<${className}Config>): void {
    this.config = mergeConfigs(this.config, updates);
    validateConfig(this.config);
  }`;
  }

  /**
   * Generates the main process method
   * @param className - Name of the class
   * @returns Process method code
   */
  private generateProcessMethod(className: string): string {
    const methodSignature = this.generateProcessMethodSignature(className);
    const methodBody = this.generateProcessMethodBody();
    const doProcessMethod = this.generateDoProcessMethod();

    return `${methodSignature}

${methodBody}

${doProcessMethod}`;
  }

  /**
   * Generates the process method signature
   * @param className - Name of the class
   * @returns Method signature code
   */
  private generateProcessMethodSignature(className: string): string {
    return `/**
   * Perform main library operation
   * @param input - Input data
   * @param options - Operation options
   * @returns Operation result
   */
  async process<T = unknown>(
    input: T,
    options?: ${className}Options
  ): Promise<T> {`;
  }

  /**
   * Generates the process method body
   * @returns Method body code
   */
  private generateProcessMethodBody(): string {
    return `  if (!this.initialized) {
    throw new Error(\`\${this.config.name} must be initialized before use\`);
  }

  try {
    const mergedOptions = mergeConfigs(this.config.options, options || {});

    if (this.config.debug) {
      console.log('Processing input:', { input, options: mergedOptions });
    }

    // Main processing logic goes here
    const result = await this.doProcess(input, mergedOptions);

    if (this.config.debug) {
      console.log('Processing result:', result);
    }

    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(\`Processing failed: \${error.message}\`);
    }
    throw new Error('Processing failed: Unknown error');
  }
}`;
  }

  /**
   * Generates the internal do process method
   * @returns Do process method code
   */
  private generateDoProcessMethod(): string {
    return `/**
   * Internal processing method (to be implemented by specific libraries)
   * @param input - Input data
   * @param options - Processing options
   * @returns Processed data
   */
  private async doProcess<T = unknown>(input: T, options: unknown): Promise<T> {
    // Default implementation - should be overridden by specific libraries
    return input;
  }`;
  }
}
