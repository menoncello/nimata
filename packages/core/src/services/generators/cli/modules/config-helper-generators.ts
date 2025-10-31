/**
 * Configuration Helper Generators
 *
 * Generates configuration helper functions for CLI projects
 */

/**
 * Generate configuration helper functions
 * @returns {string} Helper functions code
 */
export function generateConfigHelpers(): string {
  return [generateGetConfigFunction(), generateValidateConfigFunction()].join('\n\n');
}

/**
 * Generate get configuration function
 * @returns {string} Get configuration function code
 */
function generateGetConfigFunction(): string {
  return `/**
 * Get configuration based on environment
   * @param {string} env - Environment name
   * @returns {boolean}ied environment
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
 * @returns {string} Validate configuration function code
 */
function generateValidateConfigFunction(): string {
  return `/**
 * Validate configuration
   * @param {string} config - Configuration to validate
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
 * @returns {string} Default export statement
 */
export function generateConfigDefaultExport(): string {
  return `/**
 * Default configuration export
 */
export default devConfig;`;
}
