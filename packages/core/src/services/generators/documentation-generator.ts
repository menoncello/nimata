/**
 * Documentation Generator
 *
 * Handles generation of documentation files for projects
 * Integrates with existing content generation functionality
 */
import type { ProjectConfig } from '../../types/project-config.js';
import { ContentGenerators } from './config/content-generators.js';
import { DirectoryItem } from './directory-structure-generator.js';

/**
 * Documentation Generator
 *
 * Provides a focused interface for generating documentation files
 * Wraps the existing content generation functionality
 */
export class DocumentationGenerator {
  /**
   * Generate documentation files for a project
   * @param config - Project configuration
   * @returns Array of documentation file items
   */
  generate(config: ProjectConfig): DirectoryItem[] {
    const documentationFiles: DirectoryItem[] = [];

    // Generate README.md
    const readmeContent = ContentGenerators.generateReadme(config);
    documentationFiles.push({
      path: 'README.md',
      type: 'file',
      content: readmeContent,
      mode: 0o644,
    });

    // Generate API documentation for library projects
    if (config.projectType === 'library') {
      const apiContent = ContentGenerators.generateAPIDocumentation(config);
      documentationFiles.push({
        path: 'docs/api.md',
        type: 'file',
        content: apiContent,
        mode: 0o644,
      });
    }

    // Generate AI assistant configurations
    for (const assistant of config.aiAssistants) {
      const aiConfig = this.generateAIAssistantConfig(assistant, config);
      if (aiConfig) {
        documentationFiles.push(aiConfig);
      }
    }

    return documentationFiles;
  }

  /**
   * Generate AI assistant configuration
   * @param assistant - AI assistant type
   * @param config - Project configuration
   * @returns AI assistant configuration file item or null
   */
  private generateAIAssistantConfig(
    assistant: string,
    config: ProjectConfig
  ): DirectoryItem | null {
    return this.getAssistantConfig(assistant, config);
  }

  /**
   * Gets configuration for specific AI assistant
   * @param assistant - Assistant name
   * @param config - Project configuration
   * @returns Assistant configuration or null
   */
  private getAssistantConfig(assistant: string, config: ProjectConfig): DirectoryItem | null {
    const configurations = {
      'claude-code': this.createClaudeConfig(config),
      'github-copilot': this.createCopilotConfig(config),
      copilot: this.createCopilotConfig(config),
      'ai-context': this.createAIContextConfig(config),
      cursor: this.createCursorConfig(config),
    };

    const configFn = configurations[assistant as keyof typeof configurations];
    if (configFn) {
      return configFn;
    }

    console.warn(`Unknown AI assistant: ${assistant}`);
    return null;
  }

  /**
   * Creates Claude configuration
   * @param config - Project configuration
   * @returns Claude configuration
   */
  private createClaudeConfig(config: ProjectConfig): DirectoryItem {
    return {
      path: '.claude/CLAUDE.md',
      type: 'file',
      content: ContentGenerators.generateClaudeConfig(config),
      mode: 0o644,
    };
  }

  /**
   * Creates Copilot configuration
   * @param config - Project configuration
   * @returns Copilot configuration
   */
  private createCopilotConfig(config: ProjectConfig): DirectoryItem {
    return {
      path: '.github/copilot-instructions.md',
      type: 'file',
      content: ContentGenerators.generateCopilotConfig(config),
      mode: 0o644,
    };
  }

  /**
   * Creates AI context configuration
   * @param config - Project configuration
   * @returns AI context configuration
   */
  private createAIContextConfig(config: ProjectConfig): DirectoryItem {
    return {
      path: '.ai-context.md',
      type: 'file',
      content: ContentGenerators.generateAIContext(config),
      mode: 0o644,
    };
  }

  /**
   * Creates Cursor configuration
   * @param config - Project configuration
   * @returns Cursor configuration
   */
  private createCursorConfig(config: ProjectConfig): DirectoryItem {
    return {
      path: '.cursorrules',
      type: 'file',
      content: ContentGenerators.generateCursorRules(config),
      mode: 0o644,
    };
  }

  /**
   * Generate README.md only
   * @param config - Project configuration
   * @returns README.md content
   */
  generateReadme(config: ProjectConfig): string {
    return ContentGenerators.generateReadme(config);
  }

  /**
   * Generate API documentation only
   * @param config - Project configuration
   * @returns API documentation content
   */
  generateApiDocumentation(config: ProjectConfig): string {
    return ContentGenerators.generateAPIDocumentation(config);
  }

  /**
   * Generate CLAUDE.md only
   * @param config - Project configuration
   * @returns CLAUDE.md content
   */
  generateClaudeConfig(config: ProjectConfig): string {
    return ContentGenerators.generateClaudeConfig(config);
  }
}
