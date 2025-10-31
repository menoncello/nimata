/**
 * Claude Configuration Generator
 *
 * Generates Claude-specific configuration files
 */
import type { ProjectConfig } from '../../../../../src/types/project-config.js';
import { DirectoryItem } from '../core-file-operations.js';

/**
 * Coverage thresholds for different quality levels
 */
const COVERAGE_THRESHOLDS = {
  light: 70,
  medium: 85,
  strict: 95,
  default: 80,
} as const;

/**
 * Claude configuration generator class
 */
export class ClaudeConfigGenerator {
  /**
   * Generate Claude configuration file
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Claude configuration file
   */
  static generateClaudeConfig(config: ProjectConfig): DirectoryItem {
    return {
      path: 'CLAUDE.md',
      type: 'file',
      content: ClaudeConfigGenerator.generateClaudeConfigContent(config),
    };
  }

  /**
   * Generate Claude configuration content
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Claude configuration content
   */
  private static generateClaudeConfigContent(config: ProjectConfig): string {
    return [
      ClaudeConfigGenerator.generateClaudeHeader(config),
      ClaudeConfigGenerator.generateClaudeProjectOverview(config),
      ClaudeConfigGenerator.generateClaudeCodeStandards(),
      ClaudeConfigGenerator.generateClaudeDevelopmentGuidelines(),
      ClaudeConfigGenerator.generateClaudeTestingRequirements(),
      ClaudeConfigGenerator.generateClaudeProjectStructure(config),
      ClaudeConfigGenerator.generateClaudeQualityStandards(config),
      ClaudeConfigGenerator.generateClaudeNotes(config),
    ].join('\n\n');
  }

  /**
   * Generate Claude configuration header
   * @param {ProjectConfig} _config - Project configuration
   * @returns {string} Header section
   */
  private static generateClaudeHeader(_config: ProjectConfig): string {
    return `# Claude Code Integration

AI Assistant: claude-code`;
  }

  /**
   * Generate Claude project overview section
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Project overview section
   */
  private static generateClaudeProjectOverview(config: ProjectConfig): string {
    return `## Project Information

**Name**: ${config.name}
**Description**: ${config.description || 'A modern TypeScript project'}`;
  }

  /**
   * Generate Claude code standards section
   * @returns {string} Code standards section
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
   * @returns {string} Development guidelines section
   */
  private static generateClaudeDevelopmentGuidelines(): string {
    return `## Development Guidelines
- Follow SOLID principles
- Use TypeScript for type safety
- Maintain consistent code formatting with Prettier
- Write meaningful commit messages in English

## Language Requirements

All code, code comments, and technical documentation MUST be written in **English**.

- **Code**: English only
- **Code comments**: English only
- **Technical documentation** (README files, API docs, inline docs, etc.): English only
- **Commit messages**: English only
- **Pull request descriptions**: English only

## Development Workflow

TypeScript
ESLint
test
coverage`;
  }

  /**
   * Generate Claude testing requirements section
   * @returns {string} Testing requirements section
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
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Project structure section
   */
  private static generateClaudeProjectStructure(config: ProjectConfig): string {
    const specificStructure = ClaudeConfigGenerator.generateSpecificStructure(config.projectType);
    const architectureSection = ClaudeConfigGenerator.generateArchitectureSection(
      config.projectType
    );

    const baseStructure = `## Project Structure
- \`src/\` - Main source code
- \`tests/\` - Test files
- \`docs/\` - Documentation
- \`.nimata/\` - Project configuration and cache`;

    return ClaudeConfigGenerator.combineStructureSections(
      baseStructure,
      specificStructure,
      architectureSection
    );
  }

  /**
   * Generate specific structure based on project type
   * @param {string} projectType - Project type
   * @returns {string} Specific structure section
   */
  private static generateSpecificStructure(projectType: string): string {
    switch (projectType) {
      case 'cli':
        return `- \`src/commands/\` - CLI command implementations
- \`src/utils/\` - Utility functions and helpers`;
      case 'web':
        return `- \`src/components/\` - Reusable UI components
- \`src/pages/\` - Page-level components`;
      case 'library':
        return `- \`src/\` - Library source code
- \`types/\` - TypeScript type definitions`;
      default:
        return '';
    }
  }

  /**
   * Generate architecture section based on project type
   * @param {string} projectType - Project type
   * @returns {string} Architecture section
   */
  private static generateArchitectureSection(projectType: string): string {
    switch (projectType) {
      case 'cli':
        return `

## Architecture

CLI Application with command pattern implementation.

### CLI Development
- argument parsing
- error handling`;
      case 'web':
        return `

## Architecture

Web Application with frontend components.

### Key Components
- src/components/
- src/pages/`;
      case 'library':
        return `

## Architecture

Library Package with public API.

### Key Components
- TypeScript
- src/`;
      default:
        return '';
    }
  }

  /**
   * Combine structure sections into final result
   * @param {string} baseStructure - Base structure section
   * @param {string} specificStructure - Specific structure section
   * @param {string} architectureSection - Architecture section
   * @returns {string} Combined structure
   */
  private static combineStructureSections(
    baseStructure: string,
    specificStructure: string,
    architectureSection: string
  ): string {
    let result = baseStructure;

    if (specificStructure) {
      result = `${result}\n${specificStructure}`;
    }

    if (architectureSection) {
      result = `${result}${architectureSection}`;
    }

    return result;
  }

  /**
   * Generate Claude quality standards section
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Quality standards section
   */
  private static generateClaudeQualityStandards(config: ProjectConfig): string {
    const coverageThreshold = ClaudeConfigGenerator.getCoverageThreshold(config.qualityLevel);

    return `## Quality Standards

**Quality Level**: ${config.qualityLevel}
- Target coverage: ${coverageThreshold}%
- Minimum ${coverageThreshold}% required for all tests

### ESLint Rules

**CRITICAL RULE**: NEVER disable ESLint rules via inline comments (eslint-disable, eslint-disable-next-line, etc.).

1. ❌ **NEVER USE** \`// eslint-disable-next-line\`
2. ❌ **NEVER USE** \`/* eslint-disable */\`
3. ✅ **ALWAYS FIX** the underlying code issue

**Rationale**: Disabling rules masks code quality issues and creates technical debt. Code must comply with all ESLint rules without exceptions.

### Mutation Testing Thresholds

**CRITICAL RULE**: NEVER reduce mutation testing thresholds to make tests pass. If mutation score is below threshold:

1. ✅ **ADD MORE TESTS** to kill surviving mutants
2. ✅ **IMPROVE TEST QUALITY** to cover edge cases
3. ❌ **NEVER LOWER THRESHOLDS** as a shortcut

**Rationale**: Lowering thresholds masks quality issues and creates technical debt. Always improve test coverage instead.

- All ESLint rules must pass
- Code must be well-documented
- Follow the established patterns in the codebase
- Maintain backward compatibility when possible`;
  }

  /**
   * Generate Claude notes section
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Notes section
   */
  private static generateClaudeNotes(config: ProjectConfig): string {
    return `## Notes
- Author: ${config.author || 'Your Name'}
- License: ${config.license || 'MIT'}
- Project Type: ${config.projectType}
- Quality Level: ${config.qualityLevel}`;
  }

  /**
   * Get coverage threshold based on quality level
   * @param {string} qualityLevel - Quality level
   * @returns {number} Coverage threshold
   */
  private static getCoverageThreshold(qualityLevel: string): number {
    switch (qualityLevel) {
      case 'light':
        return COVERAGE_THRESHOLDS.light;
      case 'medium':
        return COVERAGE_THRESHOLDS.medium;
      case 'strict':
        return COVERAGE_THRESHOLDS.strict;
      default:
        return COVERAGE_THRESHOLDS.default;
    }
  }
}
