/**
 * Library class generators
 */
import type { ProjectConfig } from '../../../../../types/project-config.js';
import { convertToPascalCase } from '../shared/common-generators.js';

/**
 * Generate Library class
 * @param config - Project configuration
 * @returns Library class TypeScript code
 */
export function generateLibraryClass(config: ProjectConfig): string {
  const className = convertToPascalCase(config.name);
  return [
    generateClassHeader(className, config),
    generateConstructor(className, config),
    generateInitializeMethod(),
    generateProcessMethod(className),
    generateConfigMethods(className),
    generateCreateMethod(className),
  ].join('\n');
}

/**
 * Generate class header and properties
 * @param className - Class name
 * @param _config - Project configuration
 * @returns Class header TypeScript code
 */
function generateClassHeader(className: string, _config: ProjectConfig): string {
  return `export class ${className} {
  private config: ${className}Config;
  private initialized: boolean = false;`;
}

/**
 * Generate constructor method
 * @param className - Class name
 * @param config - Project configuration
 * @returns Constructor TypeScript code
 */
function generateConstructor(className: string, config: ProjectConfig): string {
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
 * Generate initialize method
 * @returns Initialize method TypeScript code
 */
function generateInitializeMethod(): string {
  return `  /**
   * Initialize library
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    if (this.config.debug) {
      console.log(\`\${this.config.name} v\${this.config.version} initializing...\`);
    }

    // Initialize library-specific logic here
    this.initialized = true;

    if (this.config.debug) {
      console.log('Library initialized successfully');
    }
  }`;
}

/**
 * Generate process method
 * @param className - Class name
 * @returns Process method TypeScript code
 */
function generateProcessMethod(className: string): string {
  return [
    generateProcessMethodSignature(className),
    generateProcessMethodBody(),
    generateProcessMethodErrorHandling(),
  ].join('\n');
}

/**
 * Generate process method signature
 * @param className - Class name
 * @returns Method signature
 */
function generateProcessMethodSignature(className: string): string {
  return `  /**
   * Process data with library
   * @param input - Input data
   * @param options - Processing options
   * @returns Library result
   */
  async process<T = unknown>(
    input: T,
    options?: ${className}Options
  ): Promise<LibraryResult<T>> {`;
}

/**
 * Generate process method main body
 * @returns Method body implementation
 */
function generateProcessMethodBody(): string {
  return `    if (!this.initialized) {
      throw new Error('Library must be initialized before processing');
    }

    const startTime = performance.now();

    try {
      if (this.config.debug) {
        console.log('Processing input:', { input, options });
      }

      // Main processing logic here
      const result = input; // Replace with actual processing

      const duration = performance.now() - startTime;

      return {
        success: true,
        data: result,
        duration,
        timestamp: new Date().toISOString(),
      };`;
}

/**
 * Generate process method error handling
 * @returns Error handling implementation
 */
function generateProcessMethodErrorHandling(): string {
  return `    } catch (error) {
      const duration = performance.now() - startTime;
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        duration,
        timestamp: new Date().toISOString(),
      };
    }
  }`;
}

/**
 * Generate configuration methods
 * @param className - Class name
 * @returns Configuration methods TypeScript code
 */
function generateConfigMethods(className: string): string {
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
  }`;
}

/**
 * Generate static create method
 * @param className - Class name
 * @returns Create method TypeScript code
 */
function generateCreateMethod(className: string): string {
  return `  /**
   * Create instance with configuration
   * @param config - Configuration
   * @returns Initialized instance
   */
  static async create(config?: Partial<${className}Config>): Promise<${className}> {
    const instance = new ${className}(config);
    await instance.initialize();
    return instance;
  }
}`;
}
