/**
 * CLI interface generators
 */
import type { ProjectConfig } from '../../../../../types/project-config.js';
import { convertToPascalCase } from '../shared/common-generators.js';

/**
 * Generate CLI interface
 * @param config - Project configuration
 * @returns CLI interface TypeScript code
 */
export function generateCLIInterface(config: ProjectConfig): string {
  const className = convertToPascalCase(config.name);
  const configInterface = generateCLIConfigInterface(className);
  const optionsInterface = generateCLIOptionsInterface();
  const resultInterface = generateCommandResultInterface();

  return `${configInterface}

${optionsInterface}

${resultInterface}`;
}

/**
 * Generate CLI config interface
 * @param className - Class name
 * @returns Config interface code
 */
export function generateCLIConfigInterface(className: string): string {
  return `export interface ${className}Config {
  /** CLI name */
  name: string;
  /** CLI version */
  version: string;
  /** Debug mode flag */
  debug: boolean;
  /** Default command */
  defaultCommand?: string;
  /** Global options */
  globalOptions?: Record<string, unknown>;
  /** Command-specific options */
  commandOptions?: Record<string, unknown>;
}`;
}

/**
 * Generate CLI options interface
 * @returns Options interface code
 */
export function generateCLIOptionsInterface(): string {
  return `export interface CLIOptions {
  /** Verbose output */
  verbose?: boolean;
  /** Configuration file path */
  config?: string;
  /** Disable colored output */
  noColor?: boolean;
  /** Custom options */
  [key: string]: unknown;
}`;
}

/**
 * Generate Command result interface
 * @returns Result interface code
 */
export function generateCommandResultInterface(): string {
  return `export interface CommandResult {
  /** Success flag */
  success: boolean;
  /** Result data */
  data?: unknown;
  /** Error message */
  error?: string;
  /** Exit code */
  exitCode: number;
}`;
}
