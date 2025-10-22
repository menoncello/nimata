/**
 * Init command - Interactive scaffolding wizard
 *
 * Story 1.3: Interactive CLI Framework implementation
 */
import {
  ProjectWizardImplementation,
  type ProjectConfig,
} from '@nimata/adapters/wizards/project-wizard';
import { ProjectConfigProcessorImpl } from '@nimata/core';
import { container } from 'tsyringe';
import type { CommandModule, Argv } from 'yargs';
import type { OutputWriter } from '../output.js';
import {
  loadConfigurationFile,
  handleNonInteractiveMode,
  setProjectNameFromArgs,
  runNonInteractive,
  processConfiguration,
  handleError,
  type InitCommandArgs,
} from './init-config.js';
import { displayConfigurationSummary, generateProject } from './init-handlers.js';

export const initCommand: CommandModule<Record<string, never>, InitCommandArgs> = {
  command: 'init [project-name]',
  describe: 'Initialize a new TypeScript project with opinionated scaffolding',
  builder: (yargs) => buildCommandOptions(yargs),
  handler: async (argv) => {
    const deps = initializeDependencies();

    try {
      // Handle --list-templates flag
      if (argv.listTemplates) {
        const { ProjectGenerator } = await import('@nimata/adapters/project-generator');
        const generator = new ProjectGenerator();
        const templates = generator.getAvailableTemplates();

        deps.output.info('\nAvailable templates:');
        for (const template of templates) {
          deps.output.info(`  - ${template}`);
        }
        process.exit(0);
      }

      const config = await buildConfiguration(argv, deps);

      const finalConfig = await processConfiguration(config, deps);

      displayConfigurationSummary(finalConfig, deps.output);

      await generateProject(finalConfig, deps.output);
    } catch (error) {
      handleError(error, deps.output);
    }
  },
};

/**
 * Initialize dependencies for the command
 * @returns Object containing required dependencies
 */
function initializeDependencies(): {
  output: OutputWriter;
  wizard: ProjectWizardImplementation;
  processor: ProjectConfigProcessorImpl;
} {
  return {
    output: container.resolve<OutputWriter>('OutputWriter'),
    wizard: new ProjectWizardImplementation(),
    processor: new ProjectConfigProcessorImpl(),
  };
}

/**
 * Build configuration from arguments and files
 * @param argv - Command line arguments
 * @param deps - Dependencies object
 * @returns Complete project configuration
 */
async function buildConfiguration(
  argv: InitCommandArgs,
  deps: ReturnType<typeof initializeDependencies>
): Promise<ProjectConfig> {
  let config = await loadConfigurationFile(argv.config, deps.output);

  config = await handleNonInteractiveMode(argv, config, deps.output);

  config = setProjectNameFromArgs(config, argv.projectName);

  return argv.nonInteractive
    ? runNonInteractive(config, deps.wizard, deps.output)
    : deps.wizard.run(config);
}

/**
 * Build command options for yargs
 * @param yargs - yargs instance
 * @returns Configured yargs instance
 */
function buildCommandOptions(yargs: Argv<Record<string, never>>): Argv<InitCommandArgs> {
  return addBasicOptions(addPositionalArgument(yargs));
}

/**
 * Add positional argument for project name
 * @param yargs - yargs instance
 * @returns yargs instance with positional argument
 */
function addPositionalArgument(yargs: Argv<Record<string, never>>): Argv<InitCommandArgs> {
  return yargs['positional']('project-name', {
    type: 'string',
    description: 'Name of the project to create',
  });
}

/**
 * Add project configuration options
 * @param yargs - yargs instance
 * @returns yargs instance with project options
 */
function addProjectOptions(yargs: Argv<InitCommandArgs>): Argv<InitCommandArgs> {
  return yargs
    .option('config', {
      type: 'string',
      description: 'Path to custom configuration file',
      alias: 'c',
    })
    .option('template', {
      type: 'string',
      description: 'Project template to use (basic, web, cli, library)',
      choices: ['basic', 'web', 'cli', 'library'],
    })
    .option('quality', {
      type: 'string',
      description: 'Quality level (light, medium, strict)',
      choices: ['light', 'medium', 'strict'],
    })
    .option('ai', {
      type: 'string',
      description: 'AI assistants to configure (comma-separated)',
    });
}

/**
 * Add metadata and control options
 * @param yargs - yargs instance
 * @returns yargs instance with metadata options
 */
function addMetadataOptions(yargs: Argv<InitCommandArgs>): Argv<InitCommandArgs> {
  return yargs
    .option('description', {
      type: 'string',
      description: 'Project description',
      alias: 'd',
    })
    .option('author', {
      type: 'string',
      description: 'Project author',
      alias: 'a',
    })
    .option('list-templates', {
      type: 'boolean',
      description: 'List available project templates',
    })
    .option('nonInteractive', {
      type: 'boolean',
      description: 'Run in non-interactive mode with defaults',
      alias: ['no-interactive'],
    });
}

/**
 * Add basic command options
 * @param yargs - yargs instance
 * @returns yargs instance with options
 */
function addBasicOptions(yargs: Argv<InitCommandArgs>): Argv<InitCommandArgs> {
  const withProjectOptions = addProjectOptions(yargs);
  return addMetadataOptions(withProjectOptions);
}
