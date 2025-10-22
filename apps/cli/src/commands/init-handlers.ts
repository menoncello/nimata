/**
 * Init Command Handlers
 *
 * Helper functions for the init command to keep the main file focused.
 */

import { ProjectGenerator, getProjectDirectory } from '@nimata/adapters';
import type { ProjectConfig } from '@nimata/adapters/wizards/project-wizard';
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
 * @param validation - Validation result containing validity status, errors, and warnings
 * @param validation.valid - Whether the validation passed
 * @param validation.errors - Array of validation error messages
 * @param validation.warnings - Array of validation warning messages
 * @param output - Output writer instance
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
 * @param validation - Validation result containing warnings
 * @param validation.warnings - Array of validation warning messages
 * @param output - Output writer instance
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
 * @param finalConfig - Final project configuration
 * @param output - Output writer instance
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
 * @param finalConfig - Final project configuration
 * @param output - Output writer instance
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
 * Execute project generation
 * @param finalConfig - Final project configuration
 * @returns Generation result
 */
async function executeProjectGeneration(
  finalConfig: ProjectConfig
): Promise<{ success: boolean; errors: string[]; warnings: string[] }> {
  const generator = new ProjectGenerator();
  return generator.generateProject(finalConfig);
}

/**
 * Handle generation result (errors and warnings)
 * @param result - Generation result containing success status, errors, and warnings
 * @param result.success - Whether the generation succeeded
 * @param result.errors - Array of generation error messages
 * @param result.warnings - Array of generation warning messages
 * @param output - Output writer instance
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
 * @param finalConfig - Final project configuration
 * @param output - Output writer instance
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
 * @param genError - Generation error
 * @param output - Output writer instance
 */
function handleGenerationError(genError: unknown, output: OutputWriter): never {
  const errorMessage = genError instanceof Error ? genError.message : 'Unknown generation error';
  output.error(pc.red(`${ERROR_MESSAGES.GENERATION_ERROR} ${errorMessage}`));
  process.exit(1);
}
