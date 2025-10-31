/**
 * CLAUDE.md Generator
 *
 * Generates CLAUDE.md configuration files for Claude Code assistant integration
 */

import {
  buildAIContextHeader,
  buildAIContextOverview,
  buildAIContextDependencies,
  buildAIContextCodePatterns,
  buildAIContextTestingStrategy,
  buildAIContextGuidelines,
  buildAIContextProjectStructure,
} from './claude-md-ai-helpers.js';
import { CLAUDE_MD_CONSTANTS } from './claude-md-constants.js';
import {
  buildCodeStyleSection,
  buildArchitectureSection,
  buildDevelopmentWorkflowSection,
} from './claude-md-content-builders.js';
import {
  buildHeader,
  buildTestingSection,
  getCoverageThreshold,
  buildKeyDependenciesSection,
  buildGenerationTimestamp,
  buildFooter,
  buildLanguageRequirementsSection,
  buildEslintRulesSection,
} from './claude-md-core-helpers.js';
import type {
  QualityLevel,
  CodeStyleConfig,
  ProjectConfig,
  ClaudeMdConfigOptions,
  GeneratedClaudeMdConfig,
} from './claude-md-types.js';

/**
 * CLAUDE.md Generator
 */
export class ClaudeMdGenerator {
  /**
   * Generate CLAUDE.md configuration for a project
   * @param {ProjectConfig} config - Project configuration
   * @returns {ProjectConfig): GeneratedClaudeMdConfig[]} Generated CLAUDE.md configuration files
   */
  generate(config: ProjectConfig): GeneratedClaudeMdConfig[] {
    const options: ClaudeMdConfigOptions = {
      qualityLevel: config.qualityLevel,
      projectType: config.projectType,
      enableTypeScript: true,
      enableTesting: true,
      codeStyle: this.getDefaultCodeStyle(config.qualityLevel),
    };

    const content = this.buildClaudeMdContent(config, options);
    const results: GeneratedClaudeMdConfig[] = [
      {
        filename: 'CLAUDE.md',
        content,
        description: 'Claude Code assistant configuration with project guidelines',
      },
    ];

    // Add AI context file when Claude Code is enabled
    if (config.aiAssistants.includes('claude-code')) {
      const aiContextContent = this.buildAIContextContent(config, options);
      results.push({
        filename: '.claude/ai-context.md',
        content: aiContextContent,
        description: 'Claude Code AI context with project-specific instructions',
      });
    }

    return results;
  }

  /**
   * Get default code style configuration
   * @param {QualityLevel} qualityLevel - Quality level
   * @returns {QualityLevel): CodeStyleConfig} Default code style configuration
   */
  private getDefaultCodeStyle(qualityLevel: QualityLevel): CodeStyleConfig {
    return {
      indentSize: CLAUDE_MD_CONSTANTS.CODE_STYLE.DEFAULT_INDENT_SIZE,
      useTabs: false,
      semi: true,
      singleQuote: true,
      trailingComma: qualityLevel === 'light' ? 'none' : 'es5',
      printWidth: this.getPrintWidth(qualityLevel),
    };
  }

  /**
   * Get print width based on quality level
   * @param {QualityLevel} qualityLevel - Quality level
   * @returns {QualityLevel): number} Print width number
   */
  private getPrintWidth(qualityLevel: QualityLevel): number {
    switch (qualityLevel) {
      case 'light':
        return CLAUDE_MD_CONSTANTS.CODE_STYLE.LIGHT_PRINT_WIDTH;
      case 'medium':
        return CLAUDE_MD_CONSTANTS.CODE_STYLE.MEDIUM_PRINT_WIDTH;
      case 'strict':
        return CLAUDE_MD_CONSTANTS.CODE_STYLE.STRICT_PRINT_WIDTH;
      default:
        return CLAUDE_MD_CONSTANTS.CODE_STYLE.DEFAULT_PRINT_WIDTH;
    }
  }

  /**
   * Build complete CLAUDE.md content
   * @param {ProjectConfig} config - Project configuration
   * @param {ClaudeMdConfigOptions} options - Configuration options
   * @returns { string} Complete CLAUDE.md content string
   */
  private buildClaudeMdContent(config: ProjectConfig, options: ClaudeMdConfigOptions): string {
    const today: string = new Date().toISOString().split('T')[0] || '2025-01-01';

    const sections = [
      buildHeader(config),
      buildGenerationTimestamp(today),
      buildLanguageRequirementsSection(),
      buildArchitectureSection(config.projectType || 'library'),
      buildEslintRulesSection(options),
      buildCodeStyleSection(options),
      buildTestingSection(options, getCoverageThreshold),
      buildDevelopmentWorkflowSection(options, config.projectType),
      buildKeyDependenciesSection(config),
      buildFooter(),
    ];

    return sections.join('\n\n');
  }

  /**
   * Build AI context content for Claude Code
   * @param {ProjectConfig} config - Project configuration
   * @param {ClaudeMdConfigOptions} options - Configuration options
   * @returns { string} AI context content string
   */
  private buildAIContextContent(config: ProjectConfig, options: ClaudeMdConfigOptions): string {
    const sections = [
      buildAIContextHeader(config, options),
      buildAIContextOverview(config),
      buildAIContextDependencies(config),
      buildAIContextCodePatterns(config),
      buildAIContextTestingStrategy(options, getCoverageThreshold),
      buildAIContextGuidelines(config.projectType),
      buildAIContextProjectStructure(),
    ];

    return sections.join('\n\n');
  }
}

/**
 * Create a CLAUDE.md generator instance
 * @returns {ClaudeMdGenerator} New ClaudeMdGenerator instance
 */
export function createClaudeMdGenerator(): ClaudeMdGenerator {
  return new ClaudeMdGenerator();
}
