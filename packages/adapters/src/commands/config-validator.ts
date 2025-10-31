/**
 * Configuration Validator
 *
 * Handles project configuration validation and creation
 */

import { CLILogger } from '../utils/cli-helpers';
import { PROJECT_NAME_CONSTRAINTS, REGEX_PATTERNS, HELPER_STRINGS } from '../utils/constants-new';
import { EXIT_CODES } from '../utils/constants.js';
import {
  type ProjectConfig,
  type EnhancedInitCommandOptions,
  type QualityLevel,
  type ProjectType,
  type AIAssistant,
} from './enhanced-init-types.js';

// AI Assistant constants
const VALID_AI_ASSISTANTS = ['claude-code', 'copilot'] as const;

/**
 * Configuration Validator Class
 */
export class ConfigValidator {
  private logger: CLILogger;

  /**
   * Creates a new ConfigValidator instance
   * @param {CLILogger} logger - Logger instance for outputting validation messages
   */
  constructor(logger: CLILogger) {
    this.logger = logger;
  }

  /**
   * Validate project name and exit if invalid
   * @param {string | undefined} projectName - Project name to validate
   */
  validateProjectNameOrExit(projectName: string | undefined): void {
    if (!projectName) {
      this.logger.error('Project name is required. Use: nimata init <project-name>');
      this.logger.info('Example: nimata init my-awesome-project');
      process.exit(EXIT_CODES.ERROR);
    }

    if (!this.isValidProjectName(projectName)) {
      this.logger.error('Invalid project name. Project names should:');
      this.logger.info('  • Be lowercase');
      this.logger.info('  • Start with a letter');
      this.logger.info('  • Contain only letters, numbers, and hyphens');
      this.logger.info('  • Be between 3 and 50 characters');

      const suggestion = this.suggestProjectName(projectName);
      this.logger.info(`Suggestion: ${suggestion}`);
      process.exit(EXIT_CODES.ERROR);
    }
  }

  /**
   * Check if a project name is valid
   * @param {string} name - Project name to validate
   * @returns {boolean} True if valid
   */
  isValidProjectName(name: string): boolean {
    if (
      name.length < PROJECT_NAME_CONSTRAINTS.MIN_LENGTH ||
      name.length > PROJECT_NAME_CONSTRAINTS.MAX_LENGTH
    ) {
      return false;
    }

    if (!REGEX_PATTERNS.PROJECT_NAME.test(name)) {
      return false;
    }

    // Reserved words that shouldn't be used as project names
    const reservedWords = ['npm', 'node', 'test', 'lib', 'bin', 'src'];
    if (reservedWords.includes(name.toLowerCase())) {
      return false;
    }

    return true;
  }

  /**
   * Suggest a valid project name based on invalid input
   * @param {string} name - Invalid project name
   * @returns {string} Suggested valid project name
   */
  suggestProjectName(name: string): string {
    let suggestion = name
      .toLowerCase()
      .replace(/([^\da-z-]+)/g, '-')
      .replace(/(-+)/g, '-')
      .replace(/(^-)|(-$)/g, '');

    // Ensure it starts with a letter
    if (/^(\d)/.test(suggestion)) {
      suggestion = `project-${suggestion}`;
    }

    // Ensure minimum length
    if (suggestion.length < PROJECT_NAME_CONSTRAINTS.MIN_LENGTH) {
      suggestion = `${suggestion}-app`;
    }

    // Ensure maximum length
    if (suggestion.length > PROJECT_NAME_CONSTRAINTS.MAX_LENGTH) {
      suggestion = suggestion.substring(0, PROJECT_NAME_CONSTRAINTS.TRUNCATED_LENGTH);
      if (suggestion.endsWith('-')) {
        suggestion = suggestion.slice(0, -1);
      }
    }

    return suggestion;
  }

  /**
   * Parse quality level from string
   * @param {string | undefined} quality - Quality level string
   * @returns {QualityLevel} Quality level enum value
   */
  parseQualityLevel(quality?: string): QualityLevel {
    if (!quality) {
      return 'medium';
    }

    const validLevels: QualityLevel[] = ['light', 'medium', 'strict'];
    const normalized = quality.toLowerCase();

    if (validLevels.includes(normalized as QualityLevel)) {
      return normalized as QualityLevel;
    }

    // Handle aliases
    switch (normalized) {
      case 'high':
        return 'strict';
      case 'low':
        return 'light';
      case 'standard':
      case 'default':
        return 'medium';
      default:
        this.logger.warn(`Unknown quality level "${quality}". Using "medium".`);
        return 'medium';
    }
  }

  /**
   * Parse project type from string
   * @param {string | undefined} projectType - Project type string
   * @returns {ProjectType} Project type enum value
   */
  parseProjectType(projectType?: string): ProjectType {
    if (!projectType) {
      return 'basic';
    }

    const validTypes: ProjectType[] = ['basic', 'web', 'cli', 'library'];
    const normalized = projectType.toLowerCase();

    if (validTypes.includes(normalized as ProjectType)) {
      return normalized as ProjectType;
    }

    // Handle aliases
    switch (normalized) {
      case 'website':
      case 'webapp':
        return 'web';
      case 'command-line':
      case 'tool':
        return 'cli';
      case 'package':
      case 'module':
        return 'library';
      default:
        this.logger.warn(`Unknown project type "${projectType}". Using "basic".`);
        return 'basic';
    }
  }

  /**
   * Parse AI assistants from comma-separated string
   * @param {string | undefined} aiString - AI assistants string
   * @returns {AIAssistant[]} Array of AI assistant enum values
   */
  parseAIAssistants(aiString?: string): AIAssistant[] {
    if (!aiString) {
      return [HELPER_STRINGS.DEFAULT_AI_ASSISTANT];
    }

    const validAssistants: AIAssistant[] = [...VALID_AI_ASSISTANTS];
    const requested = aiString.split(',').map((s) => s.trim().toLowerCase());

    const assistants: AIAssistant[] = [];
    for (const assistant of requested) {
      if (validAssistants.includes(assistant as AIAssistant)) {
        assistants.push(assistant as AIAssistant);
      } else {
        this.logger.warn(`Unknown AI assistant "${assistant}". Skipping.`);
      }
    }

    return assistants.length > 0 ? assistants : ['claude-code'];
  }

  /**
   * Create project configuration from command options
   * @param {string} projectName - Project name
   * @param {EnhancedInitCommandOptions} options - Command options
   * @returns {ProjectConfig} Project configuration
   */
  createConfigFromOptions(projectName: string, options: EnhancedInitCommandOptions): ProjectConfig {
    return {
      name: projectName,
      description: options.description || `A ${this.parseProjectType(options.projectType)} project`,
      qualityLevel: this.parseQualityLevel(options.quality),
      projectType: this.parseProjectType(options.projectType),
      aiAssistants: this.parseAIAssistants(options.ai),
    };
  }

  /**
   * Validate project configuration
   * @param {ProjectConfig} config - Configuration to validate
   * @returns {Promise<void>}
   * @throws {Error} if validation fails
   */
  async validateConfiguration(config: ProjectConfig): Promise<void> {
    const errors: string[] = [];

    // Validate name
    if (!config.name || !this.isValidProjectName(config.name)) {
      errors.push(`Invalid project name: ${config.name}`);
    }

    // Validate quality level
    const validQualities: QualityLevel[] = ['light', 'medium', 'strict'];
    if (!validQualities.includes(config.qualityLevel)) {
      errors.push(`Invalid quality level: ${config.qualityLevel}`);
    }

    // Validate project type
    const validTypes: ProjectType[] = ['basic', 'web', 'cli', 'library'];
    if (!validTypes.includes(config.projectType)) {
      errors.push(`Invalid project type: ${config.projectType}`);
    }

    // Validate AI assistants
    const validAssistants: AIAssistant[] = [...VALID_AI_ASSISTANTS];
    for (const assistant of config.aiAssistants) {
      if (!validAssistants.includes(assistant)) {
        errors.push(`Invalid AI assistant: ${assistant}`);
      }
    }

    if (errors.length > 0) {
      throw new Error(`Configuration validation failed:\n${errors.join('\n')}`);
    }
  }
}
