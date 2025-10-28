/**
 * Other AI Configuration Generators
 *
 * Generates configuration files for Copilot, AI Context, Cursor, etc.
 */
import type { ProjectConfig } from '../../../../../src/types/project-config.js';
import { DirectoryItem } from '../core-file-operations.js';

/**
 * Other AI configuration generators class
 */
export class OtherAIConfigGenerators {
  /**
   * Generate Copilot configuration file
   * @param config - Project configuration
   * @returns Copilot configuration file
   */
  static generateCopilotConfig(config: ProjectConfig): DirectoryItem {
    return {
      path: '.github/copilot-instructions.md',
      type: 'file',
      content: OtherAIConfigGenerators.generateCopilotConfigContent(config),
    };
  }

  /**
   * Generate AI Context configuration file
   * @param config - Project configuration
   * @returns AI Context configuration file
   */
  static generateAIContextConfig(config: ProjectConfig): DirectoryItem {
    return {
      path: '.ai-context',
      type: 'file',
      content: OtherAIConfigGenerators.generateAIContextContent(config),
    };
  }

  /**
   * Generate Cursor configuration file
   * @param config - Project configuration
   * @returns Cursor configuration file
   */
  static generateCursorConfig(config: ProjectConfig): DirectoryItem {
    return {
      path: '.cursorrules',
      type: 'file',
      content: OtherAIConfigGenerators.generateCursorRules(config),
    };
  }

  /**
   * Generate Copilot configuration content
   * @param config - Project configuration
   * @returns Copilot configuration content
   */
  private static generateCopilotConfigContent(config: ProjectConfig): string {
    return [
      OtherAIConfigGenerators.generateCopilotHeader(config),
      OtherAIConfigGenerators.generateCopilotProjectContext(config),
      OtherAIConfigGenerators.generateCopilotCodingStandards(),
      OtherAIConfigGenerators.generateCopilotProjectGuidelines(config),
    ].join('\n\n');
  }

  /**
   * Generate Copilot header
   * @param config - Project configuration
   * @returns Header section
   */
  private static generateCopilotHeader(config: ProjectConfig): string {
    return `# GitHub Copilot Instructions for ${config.name}`;
  }

  /**
   * Generate Copilot project context
   * @param config - Project configuration
   * @returns Project context section
   */
  private static generateCopilotProjectContext(config: ProjectConfig): string {
    const description = config.description ? `\nDescription: ${config.description}` : '';
    return `## Project Context
This is a ${config.projectType} project called ${config.name}.${description}`;
  }

  /**
   * Generate Copilot coding standards
   * @returns Coding standards section
   */
  private static generateCopilotCodingStandards(): string {
    return `## Coding Standards
- Write all code, comments, and documentation in English
- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Maintain consistent naming conventions`;
  }

  /**
   * Generate Copilot project guidelines
   * @param config - Project configuration
   * @returns Project guidelines section
   */
  private static generateCopilotProjectGuidelines(config: ProjectConfig): string {
    return `## Project Guidelines
- Author: ${config.author || 'Your Name'}
- License: ${config.license || 'MIT'}
- Project Type: ${config.projectType}
- Quality Level: ${config.qualityLevel}`;
  }

  /**
   * Generate AI Context content
   * @param config - Project configuration
   * @returns AI Context content
   */
  private static generateAIContextContent(config: ProjectConfig): string {
    return `Project: ${config.name}
Type: ${config.projectType}
Description: ${config.description || 'A modern TypeScript project'}
Author: ${config.author || 'Your Name'}
License: ${config.license || 'MIT'}

This is a TypeScript project with strict ESLint rules and comprehensive testing.`;
  }

  /**
   * Generate Cursor rules content
   * @param config - Project configuration
   * @returns Cursor rules content
   */
  private static generateCursorRules(config: ProjectConfig): string {
    return `# Cursor Rules for ${config.name}

## Project Context
This is a ${config.projectType} project: ${config.name}

## Code Standards
- All code and comments must be in English
- Follow strict ESLint rules without disabling them
- Write comprehensive tests
- Use TypeScript for type safety

## Development Practices
- Follow SOLID principles
- Maintain consistent formatting with Prettier
- Write meaningful commit messages in English
- Aim for high code quality and test coverage

## Author: ${config.author || 'Your Name'}
## License: ${config.license || 'MIT'}`;
  }
}
