/**
 * AI Assistant Configuration Generators
 *
 * Generates configuration files for various AI assistants (Claude, Copilot, etc.)
 */
import type { ProjectConfig } from '../../../types/project-config.js';
import { ClaudeConfigGenerator } from './ai/claude-config-generator.js';
import { OtherAIConfigGenerators } from './ai/other-ai-config-generators.js';
import { DirectoryItem } from './core-file-operations.js';

/**
 * Handles AI assistant configuration file generation
 */
export class AIConfigGenerators {
  /**
   * Generate AI assistant configuration files
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} AI assistant configuration files
   */
  static generateAIAssistantConfigs(config: ProjectConfig): DirectoryItem[] {
    return config.aiAssistants.map((assistant) =>
      AIConfigGenerators.getAIAssistantConfig(assistant, config)
    );
  }

  /**
   * Get AI assistant configuration for a specific assistant
   * @param {string} assistant - AI assistant type
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} AI assistant configuration file
   */
  private static getAIAssistantConfig(assistant: string, config: ProjectConfig): DirectoryItem {
    switch (assistant) {
      case 'claude-code':
        return ClaudeConfigGenerator.generateClaudeConfig(config);
      case 'github-copilot':
      case 'copilot':
        return OtherAIConfigGenerators.generateCopilotConfig(config);
      case 'ai-context':
        return OtherAIConfigGenerators.generateAIContextConfig(config);
      case 'cursor':
        return OtherAIConfigGenerators.generateCursorConfig(config);
      default:
        throw new Error(`Unknown AI assistant: ${assistant}`);
    }
  }
}
