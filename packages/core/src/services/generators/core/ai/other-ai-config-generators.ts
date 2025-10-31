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
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Copilot configuration file
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
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} AI Context configuration file
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
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Cursor configuration file
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
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Copilot configuration content
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
   * @param {ProjectConfig} _config - Project configuration
   * @returns {string} Header section
   */
  private static generateCopilotHeader(_config: ProjectConfig): string {
    return `# GitHub Copilot Instructions`;
  }

  /**
   * Generate Copilot project context
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Project context section
   */
  private static generateCopilotProjectContext(config: ProjectConfig): string {
    const projectTypeNames = {
      basic: 'Basic Application',
      web: 'Web Application',
      cli: 'CLI Application',
      library: 'Library Package',
    };

    return `## Overview

This is a ${projectTypeNames[config.projectType as keyof typeof projectTypeNames] || config.projectType}.

**Name**: ${config.name}`;
  }

  /**
   * Generate Copilot coding standards
   * @returns {string} Coding standards section
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
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Project guidelines section
   */
  private static generateCopilotProjectGuidelines(config: ProjectConfig): string {
    const projectSpecificSection = this.getProjectSpecificSection(config.projectType);

    return `## Project Guidelines
- Author: ${config.author || 'Your Name'}
- License: ${config.license || 'MIT'}
- Project Type: ${config.projectType}
- Quality Level: ${config.qualityLevel}

${projectSpecificSection}`;
  }

  /**
   * Get project-specific guidelines based on project type
   * @param {string} projectType - Project type
   * @returns {string} Project-specific guidelines
   */
  private static getProjectSpecificSection(projectType: string): string {
    if (projectType === 'cli') {
      return `## CLI Development Guidelines

- Use command pattern for CLI operations
- Handle errors gracefully and provide helpful error messages
- Support both programmatic and interactive usage
- TypeScript
- Browser`;
    } else if (projectType === 'web') {
      return `## Web Development Guidelines

- Build responsive, accessible user interfaces
- Follow modern web standards and best practices
- Optimize for performance and user experience
- TypeScript
- Browser`;
    } else if (projectType === 'library') {
      return `## Library Development Guidelines

- Design clear, well-documented public APIs
- Follow semantic versioning for releases
- Provide comprehensive examples and documentation
- TypeScript
- Browser`;
    }
    return `## Development Guidelines

- Write clean, maintainable code
- Follow established patterns and conventions
- TypeScript
- Browser`;
  }

  /**
   * Generate AI Context content
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} AI Context content
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
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Cursor rules content
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
