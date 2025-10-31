/**
 * AI Assistant Configuration Generators
 *
 * Generates Claude Code and GitHub Copilot configurations
 */

import type { ClaudeConfig, CopilotConfig } from '../../types/config-types.js';
import type { ProjectConfig } from '../enhanced-init-types.js';

/**
 * AI Configuration Generators Class
 */
export class AiConfigGenerators {
  /**
   * Generate Claude Code configuration
   * @param {ProjectConfig} config - Project configuration
   * @returns {ClaudeConfig} Claude Code configuration
   */
  generateClaudeConfig(config: ProjectConfig): ClaudeConfig {
    return {
      project: {
        name: config.name,
        description: config.description,
        type: config.projectType,
      },
      code: {
        style: {
          language: 'typescript',
          framework: 'none',
          testing: 'vitest',
          linting: 'eslint',
          formatting: 'prettier',
        },
        conventions: {
          fileNaming: 'kebab-case',
          componentNaming: 'PascalCase',
          testNaming: 'kebab-case.test.ts',
        },
      },
      ai: {
        model: 'claude-3-sonnet-20240229',
        temperature: 0.1,
        maxTokens: 4000,
        contextWindow: 100000,
      },
      rules: [],
    };
  }

  /**
   * Generate GitHub Copilot configuration
   * @param {ProjectConfig} _config - Project configuration
   * @returns {CopilotConfig} GitHub Copilot configuration
   */
  generateCopilotConfig(_config: ProjectConfig): CopilotConfig {
    return {
      version: 1,
      config: {
        ide: {
          preferredLanguage: 'typescript',
          preferredFramework: 'none',
        },
        preferences: {
          enableCodeSuggestions: true,
          enableInlineCompletion: true,
          enableExplanation: true,
        },
      },
    };
  }
}
