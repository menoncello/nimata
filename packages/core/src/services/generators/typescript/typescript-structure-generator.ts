/**
 * TypeScript Structure Generator (Refactored)
 *
 * Generates plain TypeScript project structure and files using modular approach
 */
import type { ProjectConfig } from '../../../types/project-config.js';
import { toPascalCase } from '../../../utils/string-utils.js';
import { JSON_INDENTATION } from '../config/constants.js';
import type { DirectoryItem } from '../core/core-file-operations.js';
import {
  TypeExportGenerator,
  InterfaceExportGenerator,
  EnumExportGenerator,
  ErrorExportGenerator,
  UtilsExportGenerator,
} from './exports/index.js';

/**
 * Generator for TypeScript project structures (Refactored)
 */
export class TypeScriptStructureGenerator {
  private readonly typeExportGenerator: TypeExportGenerator;
  private readonly interfaceExportGenerator: InterfaceExportGenerator;
  private readonly enumExportGenerator: EnumExportGenerator;
  private readonly errorExportGenerator: ErrorExportGenerator;
  private readonly utilsExportGenerator: UtilsExportGenerator;

  /**
   * Initialize TypeScript structure generator with all export generators
   */
  constructor() {
    this.typeExportGenerator = new TypeExportGenerator();
    this.interfaceExportGenerator = new InterfaceExportGenerator();
    this.enumExportGenerator = new EnumExportGenerator();
    this.errorExportGenerator = new ErrorExportGenerator();
    this.utilsExportGenerator = new UtilsExportGenerator();
  }

  /**
   * Generate TypeScript project structure
   * @param config - Project configuration
   * @returns TypeScript-specific directory structure
   */
  generate(config: ProjectConfig): DirectoryItem[] {
    const directories = this.getTypeScriptDirectories();
    const files = this.getTypeScriptFiles(config);

    return [...directories, ...files];
  }

  /**
   * Get TypeScript-specific directory structure
   * @returns Array of directory items
   */
  private getTypeScriptDirectories(): DirectoryItem[] {
    return [
      { path: 'src/lib', type: 'directory' },
      { path: 'src/lib/types', type: 'directory' },
      { path: 'src/lib/interfaces', type: 'directory' },
      { path: 'src/lib/enums', type: 'directory' },
      { path: 'src/lib/errors', type: 'directory' },
      { path: 'src/lib/utils', type: 'directory' },
      { path: 'src/lib/validators', type: 'directory' },
      { path: 'src/lib/adapters', type: 'directory' },
      { path: 'src/lib/services', type: 'directory' },
      { path: 'tests/unit', type: 'directory' },
      { path: 'tests/integration', type: 'directory' },
      { path: 'tests/benchmarks', type: 'directory' },
      { path: 'tests/fixtures', type: 'directory' },
      { path: 'tests/mocks', type: 'directory' },
      { path: 'docs/api', type: 'directory' },
      { path: 'docs/guides', type: 'directory' },
      { path: 'examples', type: 'directory' },
      { path: 'scripts', type: 'directory' },
    ];
  }

  /**
   * Get TypeScript-specific files
   * @param config - Project configuration
   * @returns Array of file items
   */
  private getTypeScriptFiles(config: ProjectConfig): DirectoryItem[] {
    return [
      ...this.getMainFiles(config),
      ...this.getLibraryFiles(config),
      ...this.getConfigFiles(config),
    ];
  }

  /**
   * Get main TypeScript files
   * @param config - Project configuration
   * @returns Main file items
   */
  private getMainFiles(config: ProjectConfig): DirectoryItem[] {
    return [
      {
        path: 'src/index.ts',
        type: 'file',
        content: this.generateMainExport(config),
      },
    ];
  }

  /**
   * Get library TypeScript files
   * @param config - Project configuration
   * @returns Library file items
   */
  private getLibraryFiles(config: ProjectConfig): DirectoryItem[] {
    const coreFiles = this.getCoreLibraryFiles(config);
    const typeFiles = this.getTypeLibraryFiles(config);
    const utilityFiles = this.getUtilityLibraryFiles(config);

    return [...coreFiles, ...typeFiles, ...utilityFiles];
  }

  /**
   * Get core library files
   * @param config - Project configuration
   * @returns Core library file items
   */
  private getCoreLibraryFiles(config: ProjectConfig): DirectoryItem[] {
    return [
      {
        path: 'src/lib/core/index.ts',
        type: 'file',
        content: this.generateCoreModule(config),
      },
    ];
  }

  /**
   * Get type-related library files
   * @param config - Project configuration
   * @returns Type library file items
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
        content: this.interfaceExportGenerator.generateInterfaceExports(config),
      },
      {
        path: 'src/lib/enums/index.ts',
        type: 'file',
        content: this.enumExportGenerator.generateEnumExports(config),
      },
      {
        path: 'src/lib/errors/index.ts',
        type: 'file',
        content: this.errorExportGenerator.generateErrorExports(config),
      },
    ];
  }

  /**
   * Get utility library files
   * @param config - Project configuration
   * @returns Utility library file items
   */
  private getUtilityLibraryFiles(config: ProjectConfig): DirectoryItem[] {
    return [
      {
        path: 'src/lib/utils/index.ts',
        type: 'file',
        content: this.utilsExportGenerator.generateUtilsExports(config),
      },
    ];
  }

  /**
   * Get configuration files
   * @param config - Project configuration
   * @returns Configuration file items
   */
  private getConfigFiles(config: ProjectConfig): DirectoryItem[] {
    return [
      {
        path: 'tsconfig.json',
        type: 'file',
        content: this.generateTypeScriptConfig(config),
      },
    ];
  }

  /**
   * Generate main export file
   * @param config - Project configuration
   * @returns Main export file content
   */
  private generateMainExport(config: ProjectConfig): string {
    const header = this.generateMainExportHeader(config);
    const typeExports = this.generateMainExportTypeSections(config);
    const enumExports = this.generateMainExportEnumSection();
    const errorExports = this.generateMainExportErrorSection(config);
    const utilityExports = this.generateMainExportUtilitySection();
    const classExport = this.generateMainExportClassSection(config);

    return `${header}

${typeExports}

${enumExports}

${errorExports}

${utilityExports}

${classExport}
`;
  }

  /**
   * Generate main export file header
   * @param config - Project configuration
   * @returns Header content
   */
  private generateMainExportHeader(config: ProjectConfig): string {
    return `/**
 * ${config.name}
 *
 * ${config.description || 'A modern TypeScript library'}
 */`;
  }

  /**
   * Generate type export sections for main export
   * @param config - Project configuration
   * @returns Type export sections content
   */
  private generateMainExportTypeSections(config: ProjectConfig): string {
    const className = toPascalCase(config.name);
    const typeExports = this.generateMainTypeExports(className);
    const interfaceExports = this.generateMainInterfaceExports();

    return `${typeExports}

${interfaceExports}`;
  }

  /**
   * Generate main type exports
   * @param className - Project class name
   * @returns Type exports content
   */
  private generateMainTypeExports(className: string): string {
    return `// Export main types
export type {
  ${className}Config,
  OperationResult,
  AsyncFunction,
  EventHandler,
} from './lib/types/index.js';`;
  }

  /**
   * Generate main interface exports
   * @returns Interface exports content
   */
  private generateMainInterfaceExports(): string {
    return `// Export main interfaces
export type {
  Configurable,
  Service,
  Repository,
  Validator,
  ValidationResult,
  Adapter,
  Logger,
  EventEmitter,
  Cache,
} from './lib/interfaces/index.js';`;
  }

  /**
   * Generate enum export section for main export
   * @returns Enum exports content
   */
  private generateMainExportEnumSection(): string {
    return `// Export enums
export {
  LogLevel,
  Environment,
  HttpStatus,
  ErrorCode,
  CacheStrategy,
  RetryStrategy,
  DataFormat,
  Compression,
  HashAlgorithm,
  SortDirection,
  ComparisonOperator,
  BooleanState,
  Priority,
} from './lib/enums/index.js';`;
  }

  /**
   * Generate error export section for main export
   * @param config - Project configuration
   * @returns Error exports content
   */
  private generateMainExportErrorSection(config: ProjectConfig): string {
    const className = toPascalCase(config.name);

    return `// Export errors
export {
  ${className}Error,
  ConfigError,
  ValidationError,
  TimeoutError,
  NotFoundError,
  PermissionError,
  NetworkError,
  DatabaseError,
  is${className}Error,
  getErrorCode,
} from './lib/errors/index.js';`;
  }

  /**
   * Generate utility export section for main export
   * @returns Utility exports content
   */
  private generateMainExportUtilitySection(): string {
    return `// Export utilities
export {
  deepClone,
  deepMerge,
  debounce,
  throttle,
  retry,
  timeout,
  generateUUID,
  formatBytes,
  sleep,
  isEmpty,
  capitalize,
  camelCase,
  snakeCase,
  kebabCase,
  parseQueryString,
  toQueryString,
} from './lib/utils/index.js';`;
  }

  /**
   * Generate class export section for main export
   * @param config - Project configuration
   * @returns Class export content
   */
  private generateMainExportClassSection(config: ProjectConfig): string {
    const className = toPascalCase(config.name);

    return `// Export main class
export { ${className} } from './lib/core/index.js';`;
  }

  /**
   * Generate core module file
   * @param config - Project configuration
   * @returns Core module content
   */
  private generateCoreModule(config: ProjectConfig): string {
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
   * @param config - Project configuration
   * @returns Header content
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
   * @param config - Project configuration
   * @returns Imports content
   */
  private generateCoreModuleImports(config: ProjectConfig): string {
    const className = toPascalCase(config.name);

    return `import type { ${className}Config } from '../types/index.js';
import { ErrorCode, ${className}Error } from '../errors/index.js';
import { deepMerge, isEmpty } from '../utils/index.js';`;
  }

  /**
   * Generate core module constants
   * @param config - Project configuration
   * @returns Constants content
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
   * @param config - Project configuration
   * @returns Class definition content
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
   * @param className - Class name
   * @returns Constructor content
   */
  private generateCoreConstructor(className: string): string {
    return `  constructor(config?: Partial<${className}Config>) {
    this.config = this.mergeWithDefaults(config);
  }`;
  }

  /**
   * Generate core class public methods
   * @param className - Class name
   * @returns Public methods content
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
   * @param className - Class name
   * @returns Initialize method content
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
   * @param className - Class name
   * @returns Configuration methods content
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
   * @param className - Class name
   * @returns State methods content
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
   * @param className - Class name
   * @returns Private methods content
   */
  private generateCorePrivateMethods(className: string): string {
    const validationMethod = this.generateCoreValidationMethod(className);
    const mergeMethod = this.generateCoreMergeMethod(className);

    return `${validationMethod}

${mergeMethod}`;
  }

  /**
   * Generate core validation method
   * @param className - Class name
   * @returns Validation method content
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
   * @param className - Class name
   * @returns Merge method content
   */
  private generateCoreMergeMethod(className: string): string {
    return `  /**
   * Merge configuration with defaults
   */
  private mergeWithDefaults(config?: Partial<${className}Config>): ${className}Config {
    return deepMerge(DEFAULT_CONFIG, config || {}) as ${className}Config;
  }`;
  }

  /**
   * Generate TypeScript configuration
   * @param _config - Project configuration
   * @returns TypeScript configuration content
   */
  private generateTypeScriptConfig(_config: ProjectConfig): string {
    const compilerOptions = this.buildCompilerOptions();
    const baseConfig = this.buildTypeScriptBaseConfig(compilerOptions);

    return JSON.stringify(baseConfig, null, JSON_INDENTATION);
  }

  /**
   * Build TypeScript base configuration
   * @param compilerOptions - Compiler options object
   * @returns Base configuration object
   */
  private buildTypeScriptBaseConfig(
    compilerOptions: Record<string, unknown>
  ): Record<string, unknown> {
    return {
      compilerOptions,
      include: ['src/**/*'],
      exclude: ['node_modules', 'dist', 'tests'],
    };
  }

  /**
   * Build TypeScript compiler options
   * @returns Compiler options object
   */
  private buildCompilerOptions(): Record<string, unknown> {
    const basicOptions = this.getBasicCompilerOptions();
    const strictOptions = this.getStrictTypeCheckingOptions();
    const outputOptions = this.getOutputOptions();
    const moduleOptions = this.getModuleOptions();
    const advancedOptions = this.getAdvancedOptions();

    return {
      ...basicOptions,
      ...strictOptions,
      ...outputOptions,
      ...moduleOptions,
      ...advancedOptions,
    };
  }

  /**
   * Get basic TypeScript compiler options
   * @returns Basic compiler options
   */
  private getBasicCompilerOptions(): Record<string, unknown> {
    return {
      target: 'ES2022',
      lib: ['ES2022'],
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
    };
  }

  /**
   * Get strict type checking options
   * @returns Strict type checking options
   */
  private getStrictTypeCheckingOptions(): Record<string, unknown> {
    return {
      noImplicitAny: true,
      noImplicitReturns: true,
      noImplicitThis: true,
      noUnusedLocals: true,
      noUnusedParameters: true,
      exactOptionalPropertyTypes: true,
      noImplicitOverride: true,
      noPropertyAccessFromIndexSignature: false,
      noUncheckedIndexedAccess: true,
    };
  }

  /**
   * Get output and source map options
   * @returns Output options
   */
  private getOutputOptions(): Record<string, unknown> {
    return {
      outDir: './dist',
      rootDir: './src',
      declaration: true,
      declarationMap: true,
      sourceMap: true,
      removeComments: false,
    };
  }

  /**
   * Get module resolution options
   * @returns Module options
   */
  private getModuleOptions(): Record<string, unknown> {
    return {
      module: 'ESNext',
      moduleResolution: 'node',
      resolveJsonModule: true,
      allowSyntheticDefaultImports: true,
    };
  }

  /**
   * Get advanced TypeScript options
   * @returns Advanced options
   */
  private getAdvancedOptions(): Record<string, unknown> {
    return {
      experimentalDecorators: true,
      emitDecoratorMetadata: true,
    };
  }
}
