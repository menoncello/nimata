/**
 * Library interface generators
 */
import type { ProjectConfig } from '../../../../../types/project-config.js';
import { convertToPascalCase } from '../shared/common-generators.js';

/**
 * Generate Library interface
 * @param config - Project configuration
 * @returns Library interface TypeScript code
 */
export function generateLibraryInterface(config: ProjectConfig): string {
  const className = convertToPascalCase(config.name);
  const configInterface = generateLibraryConfigInterface(className);
  const optionsInterface = generateLibraryOptionsInterface(className);
  const resultInterface = generateLibraryResultInterface();

  return `${configInterface}

${optionsInterface}

${resultInterface}`;
}

/**
 * Generate Library config interface
 * @param className - Class name
 * @returns Config interface code
 */
export function generateLibraryConfigInterface(className: string): string {
  return `export interface ${className}Config {
  /** Library name */
  name: string;
  /** Library version */
  version: string;
  /** Debug mode flag */
  debug: boolean;
  /** Library options */
  options: Record<string, unknown>;
}`;
}

/**
 * Generate Library options interface
 * @param className - Class name
 * @returns Options interface code
 */
export function generateLibraryOptionsInterface(className: string): string {
  return `export interface ${className}Options {
  /** Processing mode */
  mode?: 'sync' | 'async';
  /** Timeout in milliseconds */
  timeout?: number;
  /** Retry attempts */
  retries?: number;
  /** Custom configuration */
  [key: string]: unknown;
}`;
}

/**
 * Generate Library result interface
 * @returns Result interface code
 */
export function generateLibraryResultInterface(): string {
  return `export interface LibraryResult<T = unknown> {
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
