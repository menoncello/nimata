/**
 * Plugin and Hook Generators
 *
 * Generates plugin and hook configurations for CLI projects
 */

/**
 * Generate plugin configurations
 * @returns Plugin configurations
 */
export function generatePluginConfigs(): string {
  return `/**
 * Plugin configurations
 */
const plugins: PluginConfig[] = [
  ${generateLoggerPluginConfig()},
];

/**
 * Hook configurations
 */
const hooks: HookConfig[] = [
  ${generateHooksConfig()},
];`;
}

/**
 * Generate logger plugin configuration
 * @returns Logger plugin configuration
 */
export function generateLoggerPluginConfig(): string {
  return `{
    name: 'logger',
    enabled: true,
    options: {
      level: loggingConfig.level,
      format: loggingConfig.format,
      output: loggingConfig.output,
    },
  }`;
}

/**
 * Generate hooks configuration
 * @returns Hooks configuration
 */
export function generateHooksConfig(): string {
  return `{
    name: 'logging-hook',
    command: 'build',
    event: 'before',
    handler: 'logBuildStart',
  },
  {
    name: 'logging-hook',
    command: 'build',
    event: 'after',
    handler: 'logBuildComplete',
  }`;
}
