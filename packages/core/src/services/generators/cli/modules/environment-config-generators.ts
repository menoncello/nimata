/**
 * Environment Configuration Generators
 *
 * Generates environment-specific configurations for CLI projects
 */
import type { ProjectConfig } from '../../../../types/project-config.js';

/**
 * Generate environment configurations
 * @param {ProjectConfig} config - Project configuration
 * @returns {string} Environment configurations
 */
export function generateEnvironmentConfigs(config: ProjectConfig): string {
  return [generateDevelopmentConfig(), generateProductionConfig(), generateTestConfig(config)].join(
    '\n\n'
  );
}

/**
 * Generate development environment configuration
 * @returns {string} Development configuration definition
 */
function generateDevelopmentConfig(): string {
  return `/**
 * Development configuration
 */
export const devConfig: ConfigFileOptions = {
  app: appConfig,
  commands,
  plugins,
  hooks,
  logging: {
    ...loggingConfig,
    level: 'debug',
    colorEnabled: true,
    timestamp: true,
    output: 'console',
  },
};`;
}

/**
 * Generate production environment configuration
 * @returns {string} Production configuration definition
 */
function generateProductionConfig(): string {
  return `/**
 * Production configuration
 */
export const prodConfig: ConfigFileOptions = {
  app: appConfig,
  commands,
  plugins,
  hooks,
  logging: {
    ...loggingConfig,
    level: 'info',
    colorEnabled: false,
    timestamp: true,
    output: 'file',
    file: {
      path: './logs/app.log',
      maxSize: '10m',
      maxFiles: 5,
    },
  },
};`;
}

/**
 * Generate test environment configuration
 * @param {ProjectConfig} config - Project configuration
 * @returns {string} Test configuration definition
 */
function generateTestConfig(config: ProjectConfig): string {
  return `/**
 * Test configuration
 */
export const testConfig: ConfigFileOptions = {
  app: {
    ...appConfig,
    name: '${config.name}-test',
  },
  commands,
  plugins,
  hooks,
  logging: {
    ...loggingConfig,
    level: 'debug',
    colorEnabled: false,
    timestamp: false,
    output: 'memory', // Store logs in memory for testing
  },
};`;
}
