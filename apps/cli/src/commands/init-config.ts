/**
 * Init Command Configuration Functions
 *
 * Configuration loading and processing functions for the init command.
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { type ProjectWizard, type ProjectConfig } from '@nimata/adapters/wizards/project-wizard';
import { type ProjectConfig as CoreProjectConfig, type ProjectConfigProcessor } from '@nimata/core';
import pc from 'picocolors';
import type { OutputWriter } from '../output.js';

// Constants for error messages
const ERROR_MESSAGES = {
  CONFIG_NOT_FOUND: '❌ Configuration file not found:',
  CONFIG_LOAD_FAILED: '❌ Failed to load configuration file:',
  PROJECT_NAME_REQUIRED: '❌ Project name is required in non-interactive mode',
  UNKNOWN_ERROR: '❌ Error:',
} as const;

export interface InitCommandArgs {
  projectName?: string;
  config?: string;
  template?: string;
  quality?: string;
  ai?: string;
  description?: string;
  author?: string;
  listTemplates?: boolean;
  nonInteractive?: boolean;
  help?: boolean;
  version?: boolean;
}

/**
 * Load configuration file if provided
 * @param {string} configPath - Path to configuration file
 * @param {OutputWriter} output - Output writer instance
 * @returns {Promise<Partial<ProjectConfig>>} Partial project configuration
 */
export async function loadConfigurationFile(
  configPath: string | undefined,
  output: OutputWriter
): Promise<Partial<ProjectConfig>> {
  if (!configPath) {
    return {};
  }

  try {
    const resolvedPath = resolve(configPath);
    if (!existsSync(resolvedPath)) {
      output.error(pc.red(`${ERROR_MESSAGES.CONFIG_NOT_FOUND} ${configPath}`));
      process.exit(1);
    }

    const configData = readFileSync(resolvedPath, 'utf-8');
    const customConfig = JSON.parse(configData);
    output.success(pc.green(`✅ Loaded configuration from: ${configPath}`));
    return customConfig;
  } catch (error) {
    output.error(pc.red(`${ERROR_MESSAGES.CONFIG_LOAD_FAILED} ${configPath}`));
    output.error(pc.red(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`));
    process.exit(1);
  }
}

/**
 * Handle non-interactive mode configuration
 * @param {InitCommandArgs} argv - Command line arguments
 * @param {Partial<ProjectConfig>} config - Existing configuration
 * @param {OutputWriter} output - Output writer instance
 * @returns {Promise<Partial<ProjectConfig>>} Updated configuration
 */
export async function handleNonInteractiveMode(
  argv: InitCommandArgs,
  config: Partial<ProjectConfig>,
  output: OutputWriter
): Promise<Partial<ProjectConfig>> {
  if (!argv.nonInteractive) {
    return config;
  }

  const argsConfig = buildConfigFromArgs(argv, output);
  // Merge config file with args, giving priority to config file for name
  const mergedConfig = { ...argsConfig, ...config };

  // Validate required arguments for non-interactive mode
  if (!mergedConfig.name && !argv.projectName) {
    output.error(pc.red(ERROR_MESSAGES.PROJECT_NAME_REQUIRED));
    output.info(pc.dim('Usage: nimata init <project-name> --non-interactive'));
    process.exit(1);
  }

  return mergedConfig;
}

/**
 * Set project name from positional argument if not already set
 * @param {Partial<ProjectConfig>} config - Current configuration
 * @param {string} projectName - Project name from arguments
 * @returns {Partial<ProjectConfig>} Updated configuration
 */
export function setProjectNameFromArgs(
  config: Partial<ProjectConfig>,
  projectName: string | undefined
): Partial<ProjectConfig> {
  if (!config.name && projectName) {
    config.name = projectName;
  }
  return config;
}

/**
 * Run non-interactive project configuration
 * @param {Partial<ProjectConfig>} config - Partial project configuration
 * @param {ProjectWizard} wizard - Project wizard instance
 * @param {OutputWriter} output - Output writer instance
 * @returns {Promise<ProjectConfig>} Complete project configuration
 */
export async function runNonInteractive(
  config: Partial<ProjectConfig>,
  wizard: ProjectWizard,
  output: OutputWriter
): Promise<ProjectConfig> {
  output.info(pc.blue('🚀 Running in non-interactive mode...'));

  // Validate the configuration
  const validation = wizard.validate(config);

  if (!validation.valid) {
    output.error(pc.red('❌ Configuration validation failed:'));
    for (const error of validation.errors) {
      output.error(pc.red(`  • ${error}`));
    }
    throw new Error('Invalid configuration');
  }

  // Use defaults for any missing values
  const defaults: Partial<ProjectConfig> = {
    description: '',
    qualityLevel: 'medium',
    projectType: 'basic',
    aiAssistants: ['claude-code'],
  };

  const finalConfig = {
    ...defaults,
    ...config,
  } as ProjectConfig;

  output.success(pc.green('✅ Configuration validated successfully'));
  return finalConfig;
}

/**
 * Process and validate configuration
 * @param {ProjectConfig} config - Raw project configuration
 * @param {object} deps - Dependencies object containing processor and output writer
 * @param {ProjectConfigProcessorImpl} deps.processor - Configuration processor instance
 * @param {OutputWriter} deps.output - Output writer for logging results
 * @returns {Promise<ProjectConfig>} Processed and validated configuration
 */
export async function processConfiguration(
  config: ProjectConfig,
  deps: {
    processor: ProjectConfigProcessor;
    output: OutputWriter;
  }
): Promise<ProjectConfig> {
  // processor.process() already validates internally, so we don't need to validate again
  const finalConfig = await deps.processor.process(config as unknown as CoreProjectConfig);

  return finalConfig as ProjectConfig;
}

/**
 * Build configuration from command line arguments
 * @param {InitCommandArgs} argv - Command line arguments
 * @param {OutputWriter} _output - Output writer instance (unused but required for interface consistency)
 * @returns {Partial<ProjectConfig>} Partial project configuration
 */
function buildConfigFromArgs(argv: InitCommandArgs, _output: OutputWriter): Partial<ProjectConfig> {
  const config: Partial<ProjectConfig> = {};

  if (argv.projectName) {
    config.name = argv.projectName;
  }

  if (argv.template) {
    config.template = argv.template as 'basic' | 'web' | 'cli' | 'library';
    config.projectType = argv.template as 'basic' | 'web' | 'cli' | 'library';
  }

  if (argv.description) {
    config.description = argv.description;
  }

  if (argv.author) {
    config.author = argv.author;
  }

  config.qualityLevel = argv.quality ? (argv.quality as 'light' | 'medium' | 'strict') : 'medium'; // Default

  config.aiAssistants = argv.ai
    ? (argv.ai.split(',').map((ai) => ai.trim()) as Array<'claude-code' | 'copilot'>)
    : ['claude-code']; // Default

  config['nonInteractive'] = true;

  return config;
}

/**
 * Handle errors consistently
 * @param {unknown} error - Error object
 * @param {OutputWriter} output - Output writer instance
 * @returns {never} Never returns (always exits)
 */
export function handleError(error: unknown, output: OutputWriter): never {
  const message = error instanceof Error ? error.message : 'Unknown error occurred';
  output.error(pc.red(`${ERROR_MESSAGES.UNKNOWN_ERROR} ${message}`));
  process.exit(1);
}
