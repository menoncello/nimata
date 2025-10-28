/**
 * TypeScript interface generators
 */
import type { ProjectConfig } from '../../../../../types/project-config.js';
import { convertToPascalCase } from '../shared/common-generators.js';

/**
 * Generate TypeScript interface
 * @param config - Project configuration
 * @returns TypeScript interface TypeScript code
 */
export function generateTypeScriptInterface(config: ProjectConfig): string {
  const className = convertToPascalCase(config.name);
  const configInterface = generateTypeScriptConfigInterface(className);
  const validatorInterface = generateValidatorInterface();
  const adapterInterface = generateAdapterInterface();
  const serviceInterface = generateServiceInterface();

  return `${configInterface}

${validatorInterface}

${adapterInterface}

${serviceInterface}`;
}

/**
 * Generate TypeScript config interface
 * @param className - Class name
 * @returns Config interface code
 */
export function generateTypeScriptConfigInterface(className: string): string {
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
 * Generate Validator interface
 * @returns Validator interface code
 */
export function generateValidatorInterface(): string {
  return `export interface Validator {
  /** Validation function */
  validate: (input: unknown) => boolean | string;
  /** Error message */
  errorMessage?: string;
}`;
}

/**
 * Generate Adapter interface
 * @returns Adapter interface code
 */
export function generateAdapterInterface(): string {
  return `export interface Adapter<T = unknown, U = unknown> {
  /** Adapt input to output */
  adapt: (input: T) => U;
  /** Reverse adaptation */
  reverse?: (output: U) => T;
}`;
}

/**
 * Generate Service interface
 * @returns Service interface code
 */
export function generateServiceInterface(): string {
  return `export interface Service<T = unknown> {
  /** Service name */
  name: string;
  /** Execute service */
  execute: (input: T) => Promise<unknown>;
  /** Service configuration */
  config?: Record<string, unknown>;
}`;
}
