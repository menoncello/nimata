/**
 * Types Generator
 *
 * Generates TypeScript type definitions for libraries
 */
import type { ProjectConfig } from '../../../../types/project-config.js';
import { toPascalCase } from '../../../../utils/string-utils.js';

/**
 * Generates TypeScript type definitions for libraries
 */
export class TypesGenerator {
  /**
   * Generates the types exports file
   * @param config - Project configuration
   * @returns Types module code
   */
  generateTypeExports(config: ProjectConfig): string {
    const className = toPascalCase(config.name);
    const configInterface = this.generateConfigInterface(className);
    const optionsInterface = this.generateOptionsInterface(className);
    const resultInterface = this.generateResultInterface(className);
    const eventInterface = this.generateEventInterface(className);
    const errorInterface = this.generateErrorInterface(className);
    const eventHandlerType = this.generateEventHandlerType(className);
    const pluginInterface = this.generatePluginInterface(className);

    return `/**
 * ${className} Types
 *
 * Type definitions for ${config.name}
 */

${configInterface}

${optionsInterface}

${resultInterface}

${eventInterface}

${errorInterface}

${eventHandlerType}

${pluginInterface}
`;
  }

  /**
   * Generates the configuration interface
   * @param className - Name of the class
   * @returns Configuration interface code
   */
  private generateConfigInterface(className: string): string {
    return `export interface ${className}Config {
  /** Library name */
  name: string;
  /** Library version */
  version: string;
  /** Debug mode flag */
  debug: boolean;
  /** Additional options */
  options?: Record<string, unknown>;
}`;
  }

  /**
   * Generates the options interface
   * @param className - Name of the class
   * @returns Options interface code
   */
  private generateOptionsInterface(className: string): string {
    return `export interface ${className}Options {
  /** Operation mode */
  mode?: 'sync' | 'async';
  /** Timeout in milliseconds */
  timeout?: number;
  /** Retry attempts */
  retries?: number;
  /** Custom data */
  data?: Record<string, unknown>;
}`;
  }

  /**
   * Generates the result interface
   * @param className - Name of the class
   * @returns Result interface code
   */
  private generateResultInterface(className: string): string {
    return `export interface ${className}Result<T = unknown> {
  /** Success flag */
  success: boolean;
  /** Result data */
  data?: T;
  /** Error message */
  error?: string;
  /** Processing time in milliseconds */
  duration?: number;
  /** Timestamp */
  timestamp: string;
}`;
  }

  /**
   * Generates the event interface
   * @param className - Name of the class
   * @returns Event interface code
   */
  private generateEventInterface(className: string): string {
    return `export interface ${className}Event {
  /** Event type */
  type: string;
  /** Event data */
  data: unknown;
  /** Timestamp */
  timestamp: string;
}`;
  }

  /**
   * Generates the error interface
   * @param className - Name of the class
   * @returns Error interface code
   */
  private generateErrorInterface(className: string): string {
    return `export interface ${className}Error extends Error {
  /** Error code */
  code: string;
  /** Error details */
  details?: Record<string, unknown>;
}`;
  }

  /**
   * Generates the event handler type
   * @param className - Name of the class
   * @returns Event handler type code
   */
  private generateEventHandlerType(className: string): string {
    return `export type ${className}EventHandler<T = unknown> = (event: ${className}Event<T>) => void | Promise<void>;`;
  }

  /**
   * Generates the plugin interface
   * @param className - Name of the class
   * @returns Plugin interface code
   */
  private generatePluginInterface(className: string): string {
    return `export interface ${className}Plugin {
  /** Plugin name */
  name: string;
  /** Plugin version */
  version: string;
  /** Initialize plugin */
  initialize?(config: ${className}Config): Promise<void> | void;
  /** Destroy plugin */
  destroy?(): Promise<void> | void;
}`;
  }
}
