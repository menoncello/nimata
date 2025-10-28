/**
 * CLI Configuration Types Generator
 *
 * Generates CLI configuration type definitions
 */

/**
 * Generate configuration types
 * @returns Configuration type definitions
 */
export function generateConfigurationTypes(): string {
  return [
    generateMainConfigInterfaces(),
    generateCommandRelatedInterfaces(),
    generatePluginAndHookInterfaces(),
    generateLoggingInterface(),
  ].join('\n\n');
}

/**
 * Generate main configuration interfaces
 * @returns Main configuration interface definitions
 */
function generateMainConfigInterfaces(): string {
  return `/**
 * Configuration file options interface
 */
export interface ConfigFileOptions {
  app: AppConfig;
  commands: CommandConfig[];
  plugins: PluginConfig[];
  hooks: HookConfig[];
  logging: LoggingConfig;
}`;
}

/**
 * Generate command-related interfaces
 * @returns Command-related interface definitions
 */
function generateCommandRelatedInterfaces(): string {
  return [
    generateCommandConfigInterface(),
    generateOptionConfigInterface(),
    generateArgumentConfigInterface(),
  ].join('\n\n');
}

/**
 * Generate command configuration interface
 * @returns Command configuration interface definition
 */
function generateCommandConfigInterface(): string {
  return `/**
 * Command configuration interface
 */
export interface CommandConfig {
  name: CLICommand;
  description: string;
  handler: string;
  options?: OptionConfig[];
  arguments?: ArgumentConfig[];
  examples?: string[];
}`;
}

/**
 * Generate option configuration interface
 * @returns Option configuration interface definition
 */
function generateOptionConfigInterface(): string {
  return `/**
 * Option configuration interface
 */
export interface OptionConfig {
  name: string;
  description: string;
  type: 'string' | 'number' | 'boolean';
  required?: boolean;
  default?: unknown;
  choices?: unknown[];
}`;
}

/**
 * Generate argument configuration interface
 * @returns Argument configuration interface definition
 */
function generateArgumentConfigInterface(): string {
  return `/**
 * Argument configuration interface
 */
export interface ArgumentConfig {
  name: string;
  description: string;
  type: 'string' | 'number' | 'boolean';
  required?: boolean;
  default?: unknown;
}`;
}

/**
 * Generate plugin and hook interfaces
 * @returns Plugin and hook interface definitions
 */
function generatePluginAndHookInterfaces(): string {
  return `/**
 * Plugin configuration interface
 */
export interface PluginConfig {
  name: string;
  enabled: boolean;
  options?: Record<string, unknown>;
}

/**
 * Hook configuration interface
 */
export interface HookConfig {
  name: string;
  command: CLICommand;
  event: 'before' | 'after' | 'error';
  handler: string;
}`;
}

/**
 * Generate logging configuration interface
 * @returns Logging configuration interface definition
 */
function generateLoggingInterface(): string {
  return `/**
 * Logging configuration interface
 */
export interface LoggingConfig {
  level: 'error' | 'warn' | 'info' | 'debug';
  format: 'json' | 'simple' | 'detailed';
  output: 'console' | 'file' | 'memory';
  file?: {
    path: string;
    maxSize: string;
    maxFiles: number;
  };
}`;
}
