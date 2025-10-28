/**
 * Utilities Generator
 *
 * Generates utility functions for libraries
 */
import type { ProjectConfig } from '../../../../types/project-config.js';
import { toPascalCase } from '../../../../utils/string-utils.js';

/**
 * Generates utility functions for libraries
 * @param config - Project configuration
 * @returns Utilities TypeScript code
 */
export class UtilsGenerator {
  /**
   * Generates the utilities exports file
   * @param config - Project configuration
   * @returns Utilities module code
   */
  generateUtilsExports(config: ProjectConfig): string {
    const className = toPascalCase(config.name);
    const deepMergeFunction = this.generateDeepMergeFunction();
    const mergeConfigsFunction = this.generateMergeConfigsFunction(className);
    const validateConfigFunction = this.generateValidateConfigFunction(className);

    return `/**
 * ${className} Utilities
 *
 * Utility functions for ${config.name}
 */

import type { ${className}Config } from '../types/index.js';

${deepMergeFunction}

${mergeConfigsFunction}

${validateConfigFunction}
`;
  }

  /**
   * Generates the deep merge utility function
   * @returns Deep merge function code
   */
  private generateDeepMergeFunction(): string {
    const functionSignature = this.generateDeepMergeSignature();
    const functionBody = this.generateDeepMergeBody();
    const helperFunctions = this.generateDeepMergeHelpers();

    return `${functionSignature}

${functionBody}

${helperFunctions}`;
  }

  /**
   * Generates deep merge function signature
   * @returns Function signature code
   */
  private generateDeepMergeSignature(): string {
    return `/**
 * Deep merge two objects
 * @param target - Target object
 * @param source - Source object
 * @returns Merged object
 */
export function deepMerge<T extends Record<string, unknown>>(
  target: T,
  source: Partial<T>
): T {`;
  }

  /**
   * Generates deep merge function body
   * @returns Function body code
   */
  private generateDeepMergeBody(): string {
    return `  const result = { ...target };

  for (const key in source) {
    if (source[key] !== undefined) {
      result[key] = isMergeableValue(source[key], result[key])
        ? deepMerge(result[key] as Record<string, unknown>, source[key] as Record<string, unknown>) as T[Extract<keyof T, string>]
        : source[key] as T[Extract<keyof T, string>];
    }
  }

  return result;
}`;
  }

  /**
   * Generates helper functions for deep merge
   * @returns Helper functions code
   */
  private generateDeepMergeHelpers(): string {
    return `/**
 * Check if a value is mergeable (object and not array)
 * @param sourceValue - Source value to check
 * @param targetValue - Target value to check
 * @returns Whether values can be merged
 */
function isMergeableValue(
  sourceValue: unknown,
  targetValue: unknown
): boolean {
  return (
    typeof sourceValue === 'object' &&
    sourceValue !== null &&
    !Array.isArray(sourceValue) &&
    typeof targetValue === 'object' &&
    targetValue !== null &&
    !Array.isArray(targetValue)
  );
}`;
  }

  /**
   * Generates the merge configs function
   * @param className - Name of the class
   * @returns Merge configs function code
   */
  private generateMergeConfigsFunction(className: string): string {
    return `/**
 * Merge configuration objects
 * @param defaultConfig - Default configuration
 * @param userConfig - User configuration
 * @returns Merged configuration
 */
export function mergeConfigs(
  defaultConfig: ${className}Config,
  userConfig?: Partial<${className}Config>
): ${className}Config {
  if (!userConfig) {
    return defaultConfig;
  }

  return deepMerge(defaultConfig, userConfig);
}`;
  }

  /**
   * Generates the validate config function
   * @param className - Name of the class
   * @returns Validate config function code
   */
  private generateValidateConfigFunction(className: string): string {
    return `/**
 * Validate configuration object
 * @param config - Configuration to validate
 * @throws Error if configuration is invalid
 */
export function validateConfig(config: ${className}Config): void {
  if (!config) {
    throw new Error('Configuration is required');
  }

  if (!config.name || typeof config.name !== 'string') {
    throw new Error('Configuration must have a valid name');
  }

  if (!config.version || typeof config.version !== 'string') {
    throw new Error('Configuration must have a valid version');
  }

  // Add more validation as needed
}`;
  }
}
