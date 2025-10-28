/**
 * Interface Export Generator
 *
 * Generates interface definitions and exports for TypeScript projects
 */
import type { ProjectConfig } from '../../../../types/project-config.js';

/**
 * Generates interface exports for TypeScript libraries
 */
export class InterfaceExportGenerator {
  /**
   * Generates common interface definitions and exports
   * @param config - The project configuration
   * @returns Interface definitions string
   */
  generateInterfaceExports(config: ProjectConfig): string {
    const header = this.generateInterfaceHeader(config);
    const coreInterfaces = this.generateCoreInterfaces();
    const dataInterfaces = this.generateDataInterfaces();
    const systemInterfaces = this.generateSystemInterfaces();

    return `${header}

${coreInterfaces}

${dataInterfaces}

${systemInterfaces}
`;
  }

  /**
   * Generate interface file header
   * @param config - Project configuration
   * @returns Header content
   */
  private generateInterfaceHeader(config: ProjectConfig): string {
    return `// Interface definitions for ${config.name}`;
  }

  /**
   * Generate core business interfaces
   * @returns Core interfaces content
   */
  private generateCoreInterfaces(): string {
    const configurable = this.generateConfigurableInterface();
    const service = this.generateServiceInterface();
    const repository = this.generateRepositoryInterface();

    return `${configurable}

${service}

${repository}`;
  }

  /**
   * Generate configurable interface
   * @returns Configurable interface content
   */
  private generateConfigurableInterface(): string {
    return `/**
 * Base interface for all configurable entities
 */
export interface Configurable {
  /** Configuration object */
  readonly config: Record<string, unknown>;
  /** Update configuration */
  updateConfig(config: Partial<Record<string, unknown>>): void;
  /** Reset to default configuration */
  resetConfig(): void;
}`;
  }

  /**
   * Generate service interface
   * @returns Service interface content
   */
  private generateServiceInterface(): string {
    return `/**
 * Base interface for all services
 */
export interface Service extends Configurable {
  /** Service name */
  readonly name: string;
  /** Service version */
  readonly version: string;
  /** Initialize the service */
  initialize(): Promise<void>;
  /** Shutdown the service */
  shutdown(): Promise<void>;
  /** Check if service is healthy */
  healthCheck(): Promise<boolean>;
}`;
  }

  /**
   * Generate repository interface
   * @returns Repository interface content
   */
  private generateRepositoryInterface(): string {
    return `/**
 * Base interface for repositories
 */
export interface Repository<T, ID = string> {
  /** Find entity by ID */
  findById(id: ID): Promise<T | null>;
  /** Find all entities */
  findAll(): Promise<T[]>;
  /** Save entity */
  save(entity: T): Promise<T>;
  /** Update entity */
  update(id: ID, updates: Partial<T>): Promise<T>;
  /** Delete entity */
  delete(id: ID): Promise<boolean>;
  /** Count entities */
  count(): Promise<number>;
}`;
  }

  /**
   * Generate data-related interfaces
   * @returns Data interfaces content
   */
  private generateDataInterfaces(): string {
    const validator = this.generateValidatorInterface();
    const validationResult = this.generateValidationResultInterface();
    const adapter = this.generateAdapterInterface();

    return `${validator}

${validationResult}

${adapter}`;
  }

  /**
   * Generate validator interface
   * @returns Validator interface content
   */
  private generateValidatorInterface(): string {
    return `/**
 * Base interface for validators
 */
export interface Validator<T = unknown> {
  /** Validate value */
  validate(value: unknown): ValidationResult;
  /** Get error message if validation fails */
  readonly errorMessage?: string;
}`;
  }

  /**
   * Generate validation result interface
   * @returns Validation result interface content
   */
  private generateValidationResultInterface(): string {
    return `/**
 * Validation result interface
 */
export interface ValidationResult {
  /** Whether validation passed */
  readonly valid: boolean;
  /** Error messages if validation failed */
  readonly errors: string[];
  /** Warnings */
  readonly warnings: string[];
}`;
  }

  /**
   * Generate adapter interface
   * @returns Adapter interface content
   */
  private generateAdapterInterface(): string {
    return `/**
 * Base interface for adapters
 */
export interface Adapter<TInput, TOutput> {
  /** Adapter name */
  readonly name: string;
  /** Check if adapter can handle input */
  canHandle(input: unknown): boolean;
  /** Convert input to output */
  adapt(input: TInput): TOutput;
  /** Check if adapter supports reverse conversion */
  readonly reverse?: boolean;
  /** Convert output back to input */
  adaptReverse?(output: TOutput): TInput;
}`;
  }

  /**
   * Generate system interfaces
   * @returns System interfaces content
   */
  private generateSystemInterfaces(): string {
    const logger = this.generateLoggerInterface();
    const eventEmitter = this.generateEventEmitterInterface();
    const cache = this.generateCacheInterface();

    return `${logger}

${eventEmitter}

${cache}`;
  }

  /**
   * Generate logger interface
   * @returns Logger interface content
   */
  private generateLoggerInterface(): string {
    return `/**
 * Logger interface
 */
export interface Logger {
  /** Log debug message */
  debug(message: string, ...args: unknown[]): void;
  /** Log info message */
  info(message: string, ...args: unknown[]): void;
  /** Log warning message */
  warn(message: string, ...args: unknown[]): void;
  /** Log error message */
  error(message: string, error?: Error, ...args: unknown[]): void;
}`;
  }

  /**
   * Generate event emitter interface
   * @returns Event emitter interface content
   */
  private generateEventEmitterInterface(): string {
    return `/**
 * Event emitter interface
 */
export interface EventEmitter<TEvents extends Record<string, unknown> = Record<string, unknown>> {
  /** Add event listener */
  on<TEventName extends keyof TEvents>(
    event: TEventName,
    handler: (data: TEvents[TEventName]) => void
  ): () => void;
  /** Add one-time event listener */
  once<TEventName extends keyof TEvents>(
    event: TEventName,
    handler: (data: TEvents[TEventName]) => void
  ): () => void;
  /** Emit event */
  emit<TEventName extends keyof TEvents>(
    event: TEventName,
    data: TEvents[TEventName]
  ): void;
  /** Remove event listener */
  off<TEventName extends keyof TEvents>(
    event: TEventName,
    handler: (data: TEvents[TEventName]) => void
  ): void;
}`;
  }

  /**
   * Generate cache interface
   * @returns Cache interface content
   */
  private generateCacheInterface(): string {
    return `/**
 * Cache interface
 */
export interface Cache<T = unknown> {
  /** Get value from cache */
  get(key: string): Promise<T | undefined>;
  /** Set value in cache */
  set(key: string, value: T, ttl?: number): Promise<void>;
  /** Delete value from cache */
  delete(key: string): Promise<boolean>;
  /** Clear cache */
  clear(): Promise<void>;
  /** Check if key exists in cache */
  has(key: string): Promise<boolean>;
  /** Get cache size */
  size(): Promise<number>;
}`;
  }
}
