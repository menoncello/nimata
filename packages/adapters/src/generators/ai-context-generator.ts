/**
 * AI Context Integration Generator
 *
 * Generates AI context files for multiple AI assistants integration
 */

import {
  TargetEnvironment,
  CodeStyleConfig,
  AIContextConfigOptions,
  QualityLevel,
  ProjectType,
  AIAssistant,
} from '../types/config-types.js';
import {
  buildProjectHeader,
  buildProjectOverviewSection,
  buildArchitectureSection,
  buildDevelopmentWorkflowSection,
  buildCodeConventionsSection,
  buildQualityRequirementsSection,
  buildAIIntegrationSection,
  buildCommonTasksSection,
  buildAvoidanceSection,
} from '../utils/ai-context-sections.js';
import {
  buildClaudeInstructionsSection,
  buildClaudeFileManagementSection,
  buildClaudeCodeGenerationSection,
  buildClaudeTestingSection,
  buildClaudeQualityStandardsSection,
  buildClaudeProjectSpecificSection,
  buildClaudeInteractionPatternsSection,
} from '../utils/claude-section-builders.js';
import { getCodeStyle as getCodeStyleUtil } from '../utils/code-style-builders.js';
import { FORMATTING, COVERAGE_LEVELS } from '../utils/constants.js';
import {
  getArchitectureSection,
  getStyleGuidelines,
  getQualityStandards,
  getTestingRequirements,
  getAIAssistantIntegration,
  getCommonAIGuidelines,
  getAvoidanceRules,
} from '../utils/content-builders.js';
import {
  buildCopilotInstructionsSection,
  buildCopilotCodeStyleSection,
  buildCopilotFrameworkSection,
  buildCopilotTestingSection,
  buildCopilotArchitectureSection,
  buildCopilotCodeGenerationSection,
  buildCopilotSecuritySection,
  buildCopilotPerformanceSection,
  buildCopilotDocumentationSection,
} from '../utils/copilot-section-builders.js';
import {
  getClaudeSpecificGuidelines,
  getCopilotFrameworkGuidelines,
  getCopilotArchitectureGuidelines,
} from '../utils/framework-builders.js';
import { buildAIManifestContent } from '../utils/manifest-builders.js';
import {
  getFrameworks,
  getTargetEnvironment,
  getProjectTypeName,
} from '../utils/project-helpers.js';
import { getDevCommandWrapper, getKeyCommandsWrapper } from './ai-context-helpers.js';

// Constants to avoid string duplication and magic numbers
const DEFAULT_PRINT_WIDTH = 100;
const CLI_CONTEXT_FILENAME = '.ai/claude-context.md';
const COPILOT_CONTEXT_FILENAME = '.ai/copilot-context.md';
const AI_MANIFEST_FILENAME = '.ai/manifest.json';
const CLAUDE_CODE_ASSISTANT = 'claude-code';
const COPILOT_ASSISTANT = 'copilot';

// Type aliases are now imported from ../types/config-types.js

// Inline type to avoid import issues
interface ProjectConfig {
  name: string;
  description?: string;
  qualityLevel: QualityLevel;
  projectType: ProjectType;
  aiAssistants: AIAssistant[];
}

// AIContextConfigOptions is now imported from ../types/config-types.js

export interface GeneratedAIContextConfig {
  filename: string;
  content: string;
  description: string;
  assistant?: AIAssistant;
}

/**
 * AI Context Integration Generator
 */
export class AIContextGenerator {
  /**
   * Generate AI context files for multiple AI assistants
   *
   * @param {ProjectConfig} config - Project configuration
   * @returns {ProjectConfig): GeneratedAIContextConfig[]} Generated AI context configuration files
   */
  generate(config: ProjectConfig): GeneratedAIContextConfig[] {
    const options: AIContextConfigOptions = {
      qualityLevel: config.qualityLevel,
      projectType: config.projectType,
      targetEnvironment: getTargetEnvironment(config.projectType) as TargetEnvironment,
      projectName: config.name,
      projectDescription: config.description || '',
      codeStyle: getCodeStyleUtil(config.qualityLevel),
      testing: true,
      frameworks: getFrameworks(config.projectType),
      aiAssistants: config.aiAssistants,
    };

    const configs: GeneratedAIContextConfig[] = [];

    // Generate unified AI context file
    configs.push(this.generateUnifiedContext(options));

    // Generate assistant-specific files
    if (options.aiAssistants.includes(CLAUDE_CODE_ASSISTANT)) {
      configs.push(this.generateClaudeContext(options));
    }

    if (options.aiAssistants.includes(COPILOT_ASSISTANT)) {
      configs.push(this.generateCopilotContext(options));
    }

    // Generate AI configuration manifest
    configs.push(this.generateAIManifest(options));

    return configs;
  }

  /**
   * Generate unified AI context file
   * @param {AIContextConfigOptions} options - AI context configuration options
   * @returns {AIContextConfigOptions): GeneratedAIContextConfig} Generated unified context configuration
   */
  private generateUnifiedContext(options: AIContextConfigOptions): GeneratedAIContextConfig {
    const filename = '.ai/context.md';
    const content = this.buildUnifiedContextContent(options);

    return {
      filename,
      content,
      description: 'Unified AI context for all AI assistants',
    };
  }

  /**
   * Generate Claude-specific AI context file
   * @param {AIContextConfigOptions} options - AI context configuration options
   * @returns {AIContextConfigOptions): GeneratedAIContextConfig} Generated Claude context configuration
   */
  private generateClaudeContext(options: AIContextConfigOptions): GeneratedAIContextConfig {
    const content = this.buildClaudeContextContent(options);

    return {
      filename: CLI_CONTEXT_FILENAME,
      content,
      description: 'Claude Code specific context and instructions',
    };
  }

  /**
   * Generate Copilot-specific AI context file
   * @param {AIContextConfigOptions} options - AI context configuration options
   * @returns {AIContextConfigOptions): GeneratedAIContextConfig} Generated Copilot context configuration
   */
  private generateCopilotContext(options: AIContextConfigOptions): GeneratedAIContextConfig {
    const content = this.buildCopilotContextContent(options);

    return {
      filename: COPILOT_CONTEXT_FILENAME,
      content,
      description: 'GitHub Copilot specific context and instructions',
    };
  }

  /**
   * Generate AI configuration manifest file
   * @param {AIContextConfigOptions} options - AI context configuration options
   * @returns {AIContextConfigOptions): GeneratedAIContextConfig} Generated AI manifest configuration
   */
  private generateAIManifest(options: AIContextConfigOptions): GeneratedAIContextConfig {
    const content = this.buildAIManifestContent(options);

    return {
      filename: AI_MANIFEST_FILENAME,
      content,
      description: 'AI assistants configuration manifest',
    };
  }

  /**
   * Build unified AI context content
   * @param {AIContextConfigOptions} options - Configuration options for AI context generation
   * @returns {AIContextConfigOptions): string} Generated unified AI context content as markdown string
   */
  private buildUnifiedContextContent(options: AIContextConfigOptions): string {
    const timestamp = new Date().toISOString().split('T')[0];
    const projectTypeName = getProjectTypeName(options.projectType);

    const getStyleGuidelinesWrapper = (
      codeStyle: Record<string, string | number | boolean>
    ): string =>
      getStyleGuidelines(
        codeStyle as CodeStyleConfig,
        FORMATTING.JSON_INDENT_SIZE,
        DEFAULT_PRINT_WIDTH
      );

    return `# ${options.projectName} - AI Context

${buildProjectHeader(options, projectTypeName, timestamp as string)}
${buildProjectOverviewSection(options, projectTypeName, this.getCoverageThreshold.bind(this))}
${buildArchitectureSection(options, getArchitectureSection)}
${buildDevelopmentWorkflowSection(options, getDevCommandWrapper, getKeyCommandsWrapper)}
${buildCodeConventionsSection(options as AIContextConfigOptions & { codeStyle: Record<string, string | number | boolean> }, getStyleGuidelinesWrapper)}
${buildQualityRequirementsSection(options, getQualityStandards, (ql, _pt) => getTestingRequirements(ql, this.getCoverageThreshold.bind(this)))}
${buildAIIntegrationSection(options, (aa) => getAIAssistantIntegration(aa, CLAUDE_CODE_ASSISTANT, COPILOT_ASSISTANT))}
${buildCommonTasksSection(options, getCommonAIGuidelines)}
${buildAvoidanceSection(options, getAvoidanceRules)}

---

*Generated by Nìmata CLI - AI Context Integration*
`;
  }

  /**
   * Build Claude-specific context content
   * @param {AIContextConfigOptions} options - Configuration options for AI context generation
   * @returns {AIContextConfigOptions): string} Generated Claude-specific AI context content as markdown string
   */
  private buildClaudeContextContent(options: AIContextConfigOptions): string {
    return `# Claude Code Context for ${options.projectName}

${buildClaudeInstructionsSection()}
${buildClaudeFileManagementSection()}
${buildClaudeCodeGenerationSection()}
${buildClaudeTestingSection(options, this.getCoverageThreshold.bind(this))}
${buildClaudeQualityStandardsSection()}
${buildClaudeProjectSpecificSection(options, getClaudeSpecificGuidelines)}
${buildClaudeInteractionPatternsSection()}`;
  }

  /**
   * Build Copilot-specific context content
   * @param {AIContextConfigOptions} options - Configuration options for AI context generation
   * @returns {AIContextConfigOptions): string} Generated Copilot-specific AI context content as markdown string
   */
  private buildCopilotContextContent(options: AIContextConfigOptions): string {
    return `# GitHub Copilot Context for ${options.projectName}

${buildCopilotInstructionsSection()}
${buildCopilotCodeStyleSection()}
${buildCopilotFrameworkSection(options, getCopilotFrameworkGuidelines)}
${buildCopilotTestingSection()}
${buildCopilotArchitectureSection(options, getCopilotArchitectureGuidelines)}
${buildCopilotCodeGenerationSection()}
${buildCopilotSecuritySection()}
${buildCopilotPerformanceSection()}
${buildCopilotDocumentationSection()}`;
  }

  /**
   * Build AI manifest content
   * @param {AIContextConfigOptions} options - Configuration options for AI context generation
   * @returns {AIContextConfigOptions): string} Generated AI manifest content as JSON string
   */
  private buildAIManifestContent(options: AIContextConfigOptions): string {
    return buildAIManifestContent(options, (ql) => this.getCoverageThreshold(ql));
  }

  /**
   * Get coverage threshold based on quality level
   * @param {string} qualityLevel - Quality level of the project ('light', 'medium', 'strict')
   * @returns {string): number} Coverage threshold percentage
   */
  private getCoverageThreshold(qualityLevel: string): number {
    switch (qualityLevel) {
      case 'light':
        return COVERAGE_LEVELS.LIGHT_THRESHOLD;
      case 'medium':
        return COVERAGE_LEVELS.MEDIUM_THRESHOLD;
      case 'strict':
        return COVERAGE_LEVELS.STRICT_THRESHOLD;
      default:
        return COVERAGE_LEVELS.DEFAULT_STRICT;
    }
  }
}

/**
 * Create an AI Context generator instance
 * @returns {AIContextGenerator} New instance of AIContextGenerator
 */
export function createAIContextGenerator(): AIContextGenerator {
  return new AIContextGenerator();
}
