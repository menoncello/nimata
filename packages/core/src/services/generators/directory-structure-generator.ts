/**
 * Directory Structure Generator
 *
 * Generates directory structure for different project types
 */
import type { ProjectConfig } from '../../types/project-config.js';
import { ContentGenerators } from './config/content-generators.js';
import { IndexGenerator } from './core/index-generator.js';
import { TemplateGenerator } from './template-generator.js';
import { TestFileGenerator } from './test-file-generator.js';

export interface DirectoryItem {
  path: string;
  type: 'directory' | 'file';
  content?: string;
}

/**
 * Directory Structure Generator
 */
export class DirectoryStructureGenerator {
  private readonly testFileGenerator: TestFileGenerator;
  private readonly templateGenerator: TemplateGenerator;
  private readonly indexGenerator: IndexGenerator;

  /**
   * Initialize directory structure generators
   */
  constructor() {
    this.testFileGenerator = new TestFileGenerator();
    this.templateGenerator = new TemplateGenerator();
    this.indexGenerator = new IndexGenerator();
  }

  /**
   * Generate complete directory structure
   * @param config - Project configuration
   * @returns Complete directory structure
   */
  generate(config: ProjectConfig): DirectoryItem[] {
    const structure: DirectoryItem[] = [
      // Core directories
      { path: 'src', type: 'directory' },
      { path: 'dist', type: 'directory' },
      { path: 'tests', type: 'directory' },
      { path: 'docs', type: 'directory' },

      // Core files
      {
        path: 'src/index.ts',
        type: 'file',
        content: this.indexGenerator.generateIndexFile(config),
      },
      {
        path: 'tests/index.test.ts',
        type: 'file',
        content: this.testFileGenerator.generate(config),
      },
      { path: 'README.md', type: 'file', content: ContentGenerators.generateReadme(config) },
      { path: '.gitignore', type: 'file', content: ContentGenerators.generateGitignore() },

      // AI Assistant configurations
      ...this.generateAIAssistantConfigs(config),
    ];

    // Add type-specific structure
    structure.push(...this.templateGenerator.generate(config));

    // Add quality configurations
    structure.push(...this.generateQualityConfigs(config));

    return structure;
  }

  /**
   * Generate AI assistant configuration files
   * @param config - Project configuration
   * @returns AI assistant configuration files
   */
  private generateAIAssistantConfigs(config: ProjectConfig): DirectoryItem[] {
    return config.aiAssistants.map((assistant) => this.getAIAssistantConfig(assistant, config));
  }

  /**
   * Get AI assistant configuration for a specific assistant
   * @param assistant - AI assistant type
   * @param config - Project configuration
   * @returns AI assistant configuration file
   */
  private getAIAssistantConfig(assistant: string, config: ProjectConfig): DirectoryItem {
    switch (assistant) {
      case 'claude-code':
        return this.getClaudeConfig(config);
      case 'github-copilot':
        return this.getCopilotConfig(config);
      case 'ai-context':
        return this.getAIContextConfig(config);
      case 'cursor':
        return this.getCursorConfig(config);
      default:
        throw new Error(`Unknown AI assistant: ${assistant}`);
    }
  }

  /**
   * Get Claude configuration
   * @param config - Project configuration
   * @returns Claude configuration file
   */
  private getClaudeConfig(config: ProjectConfig): DirectoryItem {
    return {
      path: '.claude/CLAUDE.md',
      type: 'file',
      content: ContentGenerators.generateClaudeConfig(config),
    };
  }

  /**
   * Get Copilot configuration
   * @param config - Project configuration
   * @returns Copilot configuration file
   */
  private getCopilotConfig(config: ProjectConfig): DirectoryItem {
    return {
      path: '.github/copilot-instructions.md',
      type: 'file',
      content: ContentGenerators.generateCopilotConfig(config),
    };
  }

  /**
   * Get AI context configuration
   * @param config - Project configuration
   * @returns AI context configuration file
   */
  private getAIContextConfig(config: ProjectConfig): DirectoryItem {
    return {
      path: '.ai-context.md',
      type: 'file',
      content: ContentGenerators.generateAIContext(config),
    };
  }

  /**
   * Get Cursor configuration
   * @param config - Project configuration
   * @returns Cursor configuration file
   */
  private getCursorConfig(config: ProjectConfig): DirectoryItem {
    return {
      path: '.cursorrules',
      type: 'file',
      content: ContentGenerators.generateCursorRules(config),
    };
  }

  /**
   * Generate quality configuration files
   * @param config - Project configuration
   * @returns Quality configuration files
   */
  private generateQualityConfigs(config: ProjectConfig): DirectoryItem[] {
    const baseConfigs = this.getBaseQualityConfigs(config);
    const testConfigs = this.getTestConfigs();
    const highQualityConfigs = this.getHighQualityConfigs(config);

    return [...baseConfigs, ...testConfigs, ...highQualityConfigs];
  }

  /**
   * Get base quality configuration files
   * @param config - Project configuration
   * @returns Base quality configuration files
   */
  private getBaseQualityConfigs(config: ProjectConfig): DirectoryItem[] {
    return [
      {
        path: 'tsconfig.json',
        type: 'file',
        content: ContentGenerators.generateTypeScriptConfig(config),
      },
      {
        path: '.prettierrc.json',
        type: 'file',
        content: ContentGenerators.generatePrettierConfig(),
      },
      {
        path: '.eslintrc.json',
        type: 'file',
        content: ContentGenerators.generateESLintConfig(),
      },
    ];
  }

  /**
   * Get test configuration files
   * @returns Test configuration files
   */
  private getTestConfigs(): DirectoryItem[] {
    return [
      {
        path: 'vitest.config.ts',
        type: 'file',
        content: ContentGenerators.generateVitestConfig(),
      },
    ];
  }

  /**
   * Get high quality configuration files
   * @param config - Project configuration
   * @returns High quality configuration files
   */
  private getHighQualityConfigs(config: ProjectConfig): DirectoryItem[] {
    if (config.qualityLevel !== 'high') {
      return [];
    }

    return [
      {
        path: 'stryker.config.json',
        type: 'file',
        content: ContentGenerators.generateStrykerConfig(),
      },
      {
        path: '.github/workflows/ci.yml',
        type: 'file',
        content: ContentGenerators.generateCIConfig(),
      },
    ];
  }
}
