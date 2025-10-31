/**
 * Init Command Handlers
 *
 * Helper functions for the init command to keep the main file focused.
 */

import { getProjectDirectory } from '@nimata/adapters';
import type { ProjectConfig } from '@nimata/adapters/wizards/project-wizard';
import { DirectoryStructureGenerator, type ProjectConfig as CoreProjectConfig } from '@nimata/core';
import pc from 'picocolors';
import type { OutputWriter } from '../output.js';

// Constants for error messages
const ERROR_MESSAGES = {
  CONFIG_NOT_FOUND: '❌ Configuration file not found:',
  CONFIG_LOAD_FAILED: '❌ Failed to load configuration file:',
  PROJECT_GENERATION_FAILED: '❌ Project generation failed:',
  GENERATION_ERROR: '❌ Failed to generate project:',
  VALIDATION_FAILED: '❌ Configuration validation failed',
} as const;

const WARNING_PREFIX = '\n⚠️  Warnings:';

/**
 * Display validation errors and exit
 * @param {object} validation - Validation result containing validity status, errors, and warnings
 * @param {boolean} validation.valid - Whether the validation passed
 * @param {string[]} validation.errors - Array of validation error messages
 * @param {string[]} validation.warnings - Array of validation warning messages
 * @param {OutputWriter} output - Output writer instance
 */
export function displayValidationErrors(
  validation: { valid: boolean; errors?: string[]; warnings?: string[] },
  output: OutputWriter
): void {
  output.error(pc.red(`${ERROR_MESSAGES.VALIDATION_FAILED}`));
  output.error(pc.red('Please fix the following issues:'));

  if (validation.errors && validation.errors.length > 0) {
    output.error(pc.red('\n❌ Errors:'));
    for (const error of validation.errors) {
      output.error(pc.red(`   • ${error}`));
    }
  }

  if (validation.warnings && validation.warnings.length > 0) {
    output.error(pc.yellow(WARNING_PREFIX));
    for (const warning of validation.warnings) {
      output.error(pc.yellow(`   • ${warning}`));
    }
  }
}

/**
 * Display validation warnings if any
 * @param {object} validation - Validation result containing warnings
 * @param {string[]} validation.warnings - Array of validation warning messages
 * @param {OutputWriter} output - Output writer instance
 */
export function displayValidationWarnings(
  validation: { warnings?: string[] },
  output: OutputWriter
): void {
  if (validation.warnings && validation.warnings.length > 0) {
    output.info(pc.yellow(WARNING_PREFIX));
    for (const warning of validation.warnings) {
      output.info(pc.yellow(`  • ${warning}`));
    }
  }
}

/**
 * Display configuration summary to user
 * @param {ProjectConfig} finalConfig - Final project configuration
 * @param {OutputWriter} output - Output writer instance
 */
export function displayConfigurationSummary(
  finalConfig: ProjectConfig,
  output: OutputWriter
): void {
  output.success(pc.green('✅ Project configuration complete!'));
  output.info(pc.cyan('\n📋 Project Details:'));
  output.info(pc.white(`  Name:        ${finalConfig.name}`));

  if (finalConfig.description) {
    output.info(pc.white(`  Description: ${finalConfig.description}`));
  }

  output.info(pc.white(`  Type:        ${finalConfig.projectType}`));
  output.info(pc.white(`  Quality:     ${finalConfig.qualityLevel}`));
  output.info(pc.white(`  AI Assistants: ${finalConfig.aiAssistants.join(', ')}`));
  output.info(pc.white(`  Directory:   ${getProjectDirectory(finalConfig)}`));

  if (finalConfig.author) {
    output.info(pc.white(`  Author:      ${finalConfig.author}`));
  }

  if (finalConfig.license) {
    output.info(pc.white(`  License:     ${finalConfig.license}`));
  }
}

/**
 * Generate the project based on configuration
 * @param {ProjectConfig} finalConfig - Final project configuration
 * @param {OutputWriter} output - Output writer instance
 * @returns {Promise<void>}
 */
export async function generateProject(
  finalConfig: ProjectConfig,
  output: OutputWriter
): Promise<void> {
  output.info(pc.cyan('\n🚀 Generating project...'));

  try {
    const result = await executeProjectGeneration(finalConfig);

    handleGenerationResult(result, output);
    displaySuccessMessage(finalConfig, output);
  } catch (genError) {
    handleGenerationError(genError, output);
  }
}

/**
 * Execute project generation using template engine (Story 1.5)
 * @param {ProjectConfig} finalConfig - Final project configuration
 * @returns {Promise<{ success: boolean; errors: string[]; warnings: string[] }>} Generation result
 */
async function generateProjectFromTemplate(
  finalConfig: ProjectConfig
): Promise<{ success: boolean; errors: string[]; warnings: string[] }> {
  const projectGenerator = new ProjectGenerator();
  const result = await projectGenerator.generateProject(finalConfig);

  return {
    success: result.success,
    errors: result.errors,
    warnings: result.warnings,
  };
}

/**
 * Execute project generation using directory structure (Story 1.4)
 * @param {ProjectConfig} finalConfig - Final project configuration
 * @returns {Promise<{ success: boolean; errors: string[]; warnings: string[] }>} Generation result
 */
async function generateProjectFromDirectoryStructure(
  finalConfig: ProjectConfig
): Promise<{ success: boolean; errors: string[]; warnings: string[] }> {
  const directoryGenerator = new DirectoryStructureGenerator();

  // Generate the directory structure
  const structure = directoryGenerator.generate(finalConfig as unknown as CoreProjectConfig);

  // Get the project directory
  const projectDir = getProjectDirectory(finalConfig);

  // Create the actual directories and files on disk
  await (
    directoryGenerator as {
      createStructureFromDirectoryItems: (dir: string, structure: unknown) => Promise<void>;
    }
  ).createStructureFromDirectoryItems(projectDir, structure);

  return {
    success: true,
    errors: [],
    warnings: [],
  };
}

/**
 * Execute project generation
 * @param {ProjectConfig} finalConfig - Final project configuration
 * @returns {Promise<{ success: boolean; errors: string[]; warnings: string[] }>} Generation result
 */
async function executeProjectGeneration(
  finalConfig: ProjectConfig
): Promise<{ success: boolean; errors: string[]; warnings: string[] }> {
  try {
    // If a template is specified, use the template engine (Story 1.5)
    if (finalConfig.template) {
      return await generateProjectFromTemplate(finalConfig);
    }
    // Otherwise, use the DirectoryStructureGenerator from Story 1.4
    return await generateProjectFromDirectoryStructure(finalConfig);
  } catch (error) {
    return {
      success: false,
      errors: [
        `Failed to generate project: ${error instanceof Error ? error.message : 'Unknown error'}`,
      ],
      warnings: [],
    };
  }
}

/**
 * Handle generation result (errors and warnings)
 * @param {object} result - Generation result containing success status, errors, and warnings
 * @param {boolean} result.success - Whether the generation succeeded
 * @param {string[]} result.errors - Array of generation error messages
 * @param {string[]} result.warnings - Array of generation warning messages
 * @param {OutputWriter} output - Output writer instance
 */
function handleGenerationResult(
  result: { success: boolean; errors: string[]; warnings: string[] },
  output: OutputWriter
): void {
  if (!result.success) {
    output.error(pc.red(ERROR_MESSAGES.PROJECT_GENERATION_FAILED));
    for (const error of result.errors) {
      output.error(pc.red(`   • ${error}`));
    }
    process.exit(1);
  }

  if (result.warnings.length > 0) {
    output.info(pc.yellow(WARNING_PREFIX));
    for (const warning of result.warnings) {
      output.info(pc.yellow(`   • ${warning}`));
    }
  }
}

/**
 * Display success message and next steps
 * @param {ProjectConfig} finalConfig - Final project configuration
 * @param {OutputWriter} output - Output writer instance
 */
function displaySuccessMessage(finalConfig: ProjectConfig, output: OutputWriter): void {
  output.success(pc.green('\n✅ Project generated successfully!'));
  output.info(pc.cyan('\n📝 Next Steps:'));
  output.info(pc.white(`  cd ${finalConfig.name}`));
  output.info(pc.white('  bun install'));
  output.info(pc.white('  bun run dev'));
}

/**
 * Handle generation errors
 * @param {unknown} genError - Generation error
 * @param {OutputWriter} output - Output writer instance
 * @returns {never} Never returns (always exits)
 */
function handleGenerationError(genError: unknown, output: OutputWriter): never {
  const errorMessage = genError instanceof Error ? genError.message : 'Unknown generation error';
  output.error(pc.red(`${ERROR_MESSAGES.GENERATION_ERROR} ${errorMessage}`));
  process.exit(1);
}
