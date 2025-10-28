/**
 * Configuration Helper Generators
 *
 * Generates configuration helper functions for CLI projects
 */

/**
 * Generate configuration helper functions
 * @returns Helper functions code
 */
export function generateConfigHelpers(): string {
  return [generateGetConfigFunction(), generateValidateConfigFunction()].join('\n\n');
}

/**
 * Generate get configuration function
 * @returns Get configuration function code
 */
function generateGetConfigFunction(): string {
  return `/**
 * Get configuration based on environment
 * @param env - Environment name
 * @returns Configuration for the specified environment
 */
export const getConfig = (env: string = 'development'): ConfigFileOptions => {
  switch (env) {
    case 'production':
      return prodConfig;
    case 'test':
      return testConfig;
    default:
      return devConfig;
  }
};`;
}

/**
 * Generate validate configuration function
 * @returns Validate configuration function code
 */
function generateValidateConfigFunction(): string {
  return `/**
 * Validate configuration
 * @param config - Configuration to validate
 * @throws Error if configuration is invalid
 */
export const validateConfig = (config: ConfigFileOptions): void => {
  if (!config.commands || config.commands.length === 0) {
    throw new Error('Configuration must include at least one command');
  }

  if (config.commands) {
    const commandNames = config.commands.map(cmd => cmd.name);
    const duplicates = commandNames.filter((name, index) => commandNames.indexOf(name) !== index);

    if (duplicates.length > 0) {
      throw new Error(\`Duplicate command names: \${duplicates.join(', ')}\`);
    }
  }
};`;
}

/**
 * Generate default export
 * @returns Default export statement
 */
export function generateConfigDefaultExport(): string {
  return `/**
 * Default configuration export
 */
export default devConfig;`;
}
