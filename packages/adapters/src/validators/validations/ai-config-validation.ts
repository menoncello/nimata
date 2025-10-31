/**
 * AI configuration validation utilities
 */

import type { ProjectValidationResult, ProjectValidatorOptions } from '../types.js';
import { fileExists } from './file-utils.js';

/**
 * Validate AI assistant configurations and files
 * @param {unknown} options - Validator options containing project path and config
 * @param {unknown} result - Validation result to populate with findings
 */
export async function validateAIConfigurations(
  options: ProjectValidatorOptions,
  result: ProjectValidationResult
): Promise<void> {
  await validateClaudeCodeConfig(options, result);
  await validateGitHubCopilotConfig(options, result);
}

/**
 * Validate Claude Code configuration
 * @param {unknown} options - Validator options containing project configuration
 * @param {unknown} result - Validation result to populate with findings
 */
async function validateClaudeCodeConfig(
  options: ProjectValidatorOptions,
  result: ProjectValidationResult
): Promise<void> {
  if (options.config.aiAssistants.includes('claude-code')) {
    const claudeConfigPath = `${options.projectPath}/CLAUDE.md`;
    if (await fileExists(claudeConfigPath)) {
      result.info.push('✓ Claude Code configuration found');
    } else {
      result.warnings.push('CLAUDE.md not found (Claude Code assistant enabled)');
    }

    const aiContextPath = `${options.projectPath}/.ai`;
    if (await fileExists(aiContextPath)) {
      result.info.push('✓ AI context directory found');
    } else {
      result.warnings.push('.ai directory not found (AI context integration)');
    }
  }
}

/**
 * Validate GitHub Copilot configuration
 * @param {unknown} options - Validator options containing project configuration
 * @param {unknown} result - Validation result to populate with findings
 */
async function validateGitHubCopilotConfig(
  options: ProjectValidatorOptions,
  result: ProjectValidationResult
): Promise<void> {
  if (options.config.aiAssistants.includes('copilot')) {
    const copilotConfigPath = `${options.projectPath}/.github/copilot-instructions.md`;
    if (await fileExists(copilotConfigPath)) {
      result.info.push('✓ GitHub Copilot configuration found');
    } else {
      result.warnings.push('GitHub Copilot instructions not found (Copilot assistant enabled)');
    }

    const githubPath = `${options.projectPath}/.github`;
    if (await fileExists(githubPath)) {
      result.info.push('✓ .github directory found');
    } else {
      result.warnings.push('.github directory not found (GitHub integration)');
    }
  }
}
