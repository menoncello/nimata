/**
 * Claude Configuration Generator
 *
 * Generates Claude-specific configuration files
 */
import type { ProjectConfig } from '../../../../../src/types/project-config.js';
import { DirectoryItem } from '../core-file-operations.js';

/**
 * Claude configuration generator class
 */
export class ClaudeConfigGenerator {
  /**
   * Generate Claude configuration file
   * @param config - Project configuration
   * @returns Claude configuration file
   */
  static generateClaudeConfig(config: ProjectConfig): DirectoryItem {
    return {
      path: '.claude/CLAUDE.md',
      type: 'file',
      content: ClaudeConfigGenerator.generateClaudeConfigContent(config),
    };
  }

  /**
   * Generate Claude configuration content
   * @param config - Project configuration
   * @returns Claude configuration content
   */
  private static generateClaudeConfigContent(config: ProjectConfig): string {
    return [
      ClaudeConfigGenerator.generateClaudeHeader(config),
      ClaudeConfigGenerator.generateClaudeProjectOverview(config),
      ClaudeConfigGenerator.generateClaudeCodeStandards(),
      ClaudeConfigGenerator.generateClaudeDevelopmentGuidelines(),
      ClaudeConfigGenerator.generateClaudeTestingRequirements(),
      ClaudeConfigGenerator.generateClaudeProjectStructure(),
      ClaudeConfigGenerator.generateClaudeQualityStandards(),
      ClaudeConfigGenerator.generateClaudeNotes(config),
    ].join('\n\n');
  }

  /**
   * Generate Claude configuration header
   * @param config - Project configuration
   * @returns Header section
   */
  private static generateClaudeHeader(config: ProjectConfig): string {
    return `# Claude Code Configuration for ${config.name}`;
  }

  /**
   * Generate Claude project overview section
   * @param config - Project configuration
   * @returns Project overview section
   */
  private static generateClaudeProjectOverview(config: ProjectConfig): string {
    return `## Project Information
${config.description || 'A modern TypeScript project'}`;
  }

  /**
   * Generate Claude code standards section
   * @returns Code standards section
   */
  private static generateClaudeCodeStandards(): string {
    return `## Code Standards
- All code, comments, and documentation must be written in English
- Follow ESLint rules without disabling them inline
- Write comprehensive tests with high mutation score thresholds
- Use \`bunx turbo test\` for running tests`;
  }

  /**
   * Generate Claude development guidelines section
   * @returns Development guidelines section
   */
  private static generateClaudeDevelopmentGuidelines(): string {
    return `## Development Guidelines
- Follow SOLID principles
- Use TypeScript for type safety
- Maintain consistent code formatting with Prettier
- Write meaningful commit messages in English`;
  }

  /**
   * Generate Claude testing requirements section
   * @returns Testing requirements section
   */
  private static generateClaudeTestingRequirements(): string {
    return `## Testing Requirements
- Aim for high test coverage
- Do not lower mutation testing thresholds
- Add more tests to kill surviving mutants
- Use the project's testing framework`;
  }

  /**
   * Generate Claude project structure section
   * @returns Project structure section
   */
  private static generateClaudeProjectStructure(): string {
    return `## Project Structure
- \`src/\` - Main source code
- \`tests/\` - Test files
- \`docs/\` - Documentation
- \`.nimata/\` - Project configuration and cache`;
  }

  /**
   * Generate Claude quality standards section
   * @returns Quality standards section
   */
  private static generateClaudeQualityStandards(): string {
    return `## Quality Standards
- All ESLint rules must pass
- Code must be well-documented
- Follow the established patterns in the codebase
- Maintain backward compatibility when possible`;
  }

  /**
   * Generate Claude notes section
   * @param config - Project configuration
   * @returns Notes section
   */
  private static generateClaudeNotes(config: ProjectConfig): string {
    return `## Notes
- Author: ${config.author || 'Your Name'}
- License: ${config.license || 'MIT'}
- Project Type: ${config.projectType}
- Quality Level: ${config.qualityLevel}`;
  }
}
