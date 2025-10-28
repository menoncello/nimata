/**
 * Basic CLI Configuration Generators
 *
 * Generates basic CLI configuration components
 */
import type { ProjectConfig } from '../../../../types/project-config.js';

/**
 * Generate CLI config header
 * @returns Header comment
 */
export function generateCLIConfigHeader(): string {
  return `/**
 * CLI Configuration
 *
 * Default configuration for CLI application
 */`;
}

/**
 * Generate CLI config imports
 * @returns Import statements
 */
export function generateCLIConfigImports(): string {
  return `import type { ConfigFileOptions, CommandConfig, PluginConfig, HookConfig } from './types.js';
import type { Logger } from 'winston';
import { createLogger } from 'winston';
import { Console } from 'winston/transports';`;
}

/**
 * Generate CLI config body
 * @param config - Project configuration
 * @returns Basic configuration
 */
export function generateCLIConfigBody(config: ProjectConfig): string {
  return [generateAppConfig(config), generateLoggingConfig()].join('\n\n');
}

/**
 * Generate application configuration
 * @param config - Project configuration
 * @returns Application configuration object
 */
function generateAppConfig(config: ProjectConfig): string {
  return `/**
 * Default application configuration
 */
const appConfig = {
  name: '${config.name}',
  version: '${config.version}',
  description: '${config.description}',
  author: '${config.author}',
  license: '${config.license}',
  homepage: '${config.homepage || ''}',
  repository: '${config.repository || ''}',
  bugs: '${config.bugs || ''}',
  keywords: ${JSON.stringify(config.keywords || [])},
  engines: {
    node: '>=18.0.0',
    bun: '>=1.0.0',
  },
};`;
}

/**
 * Generate logging configuration
 * @returns Logging configuration object
 */
function generateLoggingConfig(): string {
  return `/**
 * Default logging configuration
 */
const loggingConfig = {
  level: process.env.LOG_LEVEL || 'info',
  format: process.env.NODE_ENV === 'production' ? 'json' : 'simple',
  output: process.env.LOG_OUTPUT || 'console',
  file: process.env.LOG_FILE ? {
    path: process.env.LOG_FILE,
    maxSize: process.env.LOG_MAX_SIZE || '10m',
    maxFiles: parseInt(process.env.LOG_MAX_FILES || '5', 10),
  } : undefined,
};`;
}
