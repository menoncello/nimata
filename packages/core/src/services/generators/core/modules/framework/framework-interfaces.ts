/**
 * Framework interface generators
 */
import type { ProjectConfig } from '../../../../../types/project-config.js';
import { convertToPascalCase } from '../shared/common-generators.js';

/**
 * Generate Framework interface
 * @param config - Project configuration
 * @returns Framework interface TypeScript code
 */
export function generateFrameworkInterface(config: ProjectConfig): string {
  switch (config.projectType) {
    case 'bun-react':
      return getReactInterface(config);
    case 'bun-vue':
      return getVueInterface(config);
    case 'bun-express':
      return getExpressInterface(config);
    default:
      return getBaseInterface(config);
  }
}

/**
 * Get Vue interface
 * @param config - Project configuration
 * @returns Vue interface TypeScript code
 */
export function getVueInterface(config: ProjectConfig): string {
  return `export interface ${convertToPascalCase(config.name)}Config {
  /** Component name */
  name: string;
  /** Debug mode flag */
  debug: boolean;
  /** Component props */
  props?: Record<string, unknown>;
}`;
}

/**
 * Get React-specific interface
 * @param config - Project configuration
 * @returns React interface code
 */
export function getReactInterface(config: ProjectConfig): string {
  return `export interface ${convertToPascalCase(config.name)}Props {
  /**
   * Component children
   */
  children?: React.ReactNode;
}`;
}

/**
 * Get Express-specific interface
 * @param config - Project configuration
 * @returns Express interface code
 */
export function getExpressInterface(config: ProjectConfig): string {
  return `export interface ${convertToPascalCase(config.name)}Middleware {
  /**
   * Express middleware function
   */
  (req: unknown, res: unknown, next: unknown): void;
}`;
}

/**
 * Get base interface
 * @param config - Project configuration
 * @returns Base interface code
 */
export function getBaseInterface(config: ProjectConfig): string {
  return `/**
 * ${config.name} configuration and utilities
 */
export interface ${convertToPascalCase(config.name)}Config {
  /**
   * Enable debug mode
   */
  debug?: boolean;

  /**
   * Custom options for ${config.name}
   */
  options?: Record<string, unknown>;
}`;
}
