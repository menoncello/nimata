/**
 * Command Configuration Generators
 *
 * Generates command configurations for CLI projects
 */
import type { ProjectConfig } from '../../../../types/project-config.js';

/**
 * Generate command configurations
 * @param config - Project configuration
 * @returns Command configurations
 */
export function generateCommandConfigs(config: ProjectConfig): string {
  return `/**
 * Command configurations
 */
const commands: CommandConfig[] = [
  ${generateHelloCommandConfig(config)},
  ${generateBuildCommandConfig(config)},
  ${generateDeployCommandConfig(config)},
];`;
}

/**
 * Generate hello command configuration
 * @param config - Project configuration
 * @returns Hello command configuration
 */
export function generateHelloCommandConfig(config: ProjectConfig): string {
  return `{
    name: 'hello',
    description: 'Say hello to the world',
    handler: 'handleHelloCommand',
    options: [
      {
        name: 'name',
        description: 'Name to greet',
        type: 'string',
        default: 'World',
      },
      {
        name: 'loud',
        description: 'Make the greeting loud',
        type: 'boolean',
        default: false,
      },
    ],
    examples: [
      '${config.name} hello',
      '${config.name} hello --name Alice',
      '${config.name} hello --name Alice --loud',
    ],
  }`;
}

/**
 * Generate build command configuration
 * @param config - Project configuration
 * @returns Build command configuration
 */
export function generateBuildCommandConfig(config: ProjectConfig): string {
  return `{
    name: 'build',
    description: 'Build the project',
    options: {
      ${generateBuildCommandOptions()},
    },
    examples: ${generateBuildCommandExamples(config)},
  }`;
}

/**
 * Generate build command options
 * @returns Build command options
 */
function generateBuildCommandOptions(): string {
  return [
    `watch: {
        description: 'Enable watch mode',
        type: 'boolean',
        default: false,
      },
      minify: {
        description: 'Minify output',
        type: 'boolean',
        default: true,
      },
      sourcemap: {
        description: 'Generate source maps',
        type: 'boolean',
        default: false,
      },
      target: {
        description: 'Target environment',
        type: 'string',
        default: 'node',
        choices: ['node', 'browser', 'bun'],
      },
      output: {
        description: 'Output directory',
        type: 'string',
        default: './dist',
      },`,
  ].join('\n      ');
}

/**
 * Generate build command examples
 * @param config - Project configuration
 * @returns Build command examples
 */
function generateBuildCommandExamples(config: ProjectConfig): string {
  return `[
      '${config.name} build',
      '${config.name} build --watch',
      '${config.name} build --minify false --sourcemap',
    ]`;
}

/**
 * Generate deploy command configuration
 * @param config - Project configuration
 * @returns Deploy command configuration
 */
export function generateDeployCommandConfig(config: ProjectConfig): string {
  return `{
    name: 'deploy',
    description: 'Deploy the project',
    options: {
      environment: {
        description: 'Deployment environment',
        type: 'string',
        default: 'production',
        choices: ['development', 'staging', 'production'],
      },
      dryRun: {
        description: 'Perform a dry run without making changes',
        type: 'boolean',
        default: false,
      },
      force: {
        description: 'Force deployment even if checks fail',
        type: 'boolean',
        default: false,
      },
    },
    examples: [
      '${config.name} deploy',
      '${config.name} deploy --environment staging',
      '${config.name} deploy --dry-run',
    ],
  }`;
}
