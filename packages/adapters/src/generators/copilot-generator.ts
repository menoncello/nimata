/**
 * GitHub Copilot Instructions Generator
 *
 * Generates .github/copilot-instructions.md for GitHub Copilot assistant integration
 */

import { COPILOT_CONSTANTS } from './copilot-constants.js';
import {
  buildProjectContextSection,
  buildCodingStandardsSection,
  buildSecurityPerformanceSection,
  getCopilotCoverageThreshold,
} from './copilot-content-builders.js';
import {
  getProjectSpecificPatternsContent,
  getBestPracticesContent,
} from './copilot-patterns-content.js';
import { getCodePatternsContent } from './copilot-patterns.js';
import type {
  ProjectType,
  ProjectConfig,
  CopilotConfigOptions,
  GeneratedCopilotConfig,
} from './copilot-types.js';

// Constants
const LINE_LENGTH_LIGHT = 120;
const LINE_LENGTH_MEDIUM = 100;
const LINE_LENGTH_STRICT = 80;

/**
 * Copilot Instructions Generator
 */
export class CopilotGenerator {
  /**
   * Generate Copilot instructions for a project
   * @param config - Project configuration
   * @returns Generated Copilot instructions files
   */
  generate(config: ProjectConfig): GeneratedCopilotConfig[] {
    const targetEnvironment = this.getTargetEnvironment(config.projectType);
    const options: CopilotConfigOptions = {
      qualityLevel: config.qualityLevel,
      projectType: config.projectType,
      targetEnvironment,
      projectName: config.name,
      projectDescription: config.description,
      codeStyle: this.getDefaultCodeStyle(),
      testing: true,
      frameworks: this.getFrameworks(config.projectType),
    };

    const instructionsContent = this.buildCopilotInstructions(options);
    const patternsContent = this.buildCopilotPatterns(options);

    return [
      {
        filename: '.github/copilot-instructions.md',
        content: instructionsContent,
        description: 'GitHub Copilot assistant instructions with project guidelines',
      },
      {
        filename: '.github/copilot-patterns.md',
        content: patternsContent,
        description: 'GitHub Copilot code patterns and examples',
      },
    ];
  }

  /**
   * Get target environment based on project type
   * @param projectType - Project type
   * @returns Target environment
   */
  private getTargetEnvironment(projectType: ProjectType): 'node' | 'browser' | 'both' {
    switch (projectType) {
      case 'web':
        return 'browser';
      case 'cli':
        return 'node';
      case 'library':
        return 'both';
      default:
        return 'node';
    }
  }

  /**
   * Get formatted environment name for display
   * @param targetEnvironment - Target environment
   * @returns Formatted environment name
   */
  private getFormattedEnvironment(targetEnvironment: 'node' | 'browser' | 'both'): string {
    switch (targetEnvironment) {
      case 'browser':
        return 'Browser';
      case 'node':
        return 'Node.js';
      case 'both':
        return 'Universal (Node.js + Browser)';
      default:
        return 'Node.js';
    }
  }

  /**
   * Get default code style configuration
   * @returns Default code style configuration
   */
  private getDefaultCodeStyle(): Record<string, unknown> {
    return {
      singleQuote: true,
      semi: true,
      useTabs: false,
      indentSize: COPILOT_CONSTANTS.CODE_STYLE.DEFAULT_INDENT_SIZE,
      printWidth: COPILOT_CONSTANTS.CODE_STYLE.DEFAULT_PRINT_WIDTH,
      trailingComma: 'es5',
    };
  }

  /**
   * Get frameworks based on project type
   * @param projectType - Project type
   * @returns Array of framework names
   */
  private getFrameworks(projectType: ProjectType): string[] {
    switch (projectType) {
      case 'web':
        return ['React', 'TypeScript', 'Vite', 'ESLint', 'Prettier'];
      case 'cli':
        return ['Node.js', 'TypeScript', 'Commander.js', 'Inquirer.js'];
      case 'library':
        return ['TypeScript', 'Rollup', 'Jest', 'ESLint'];
      default:
        return ['TypeScript', 'ESLint', 'Prettier'];
    }
  }

  /**
   * Build complete Copilot instructions
   * @param options - Configuration options
   * @returns Complete Copilot instructions string
   */
  private buildCopilotInstructions(options: CopilotConfigOptions): string {
    const sections = [
      this.buildHeader(options),
      buildProjectContextSection(options),
      this.buildLanguageStandardsSection(),
      this.buildFormattingRulesSection(options),
      buildCodingStandardsSection(options),
      this.buildTestingRequirementsSection(options),
      this.buildCodePatternsSection(),
      this.buildWhatToAvoidSection(options),
      this.buildProjectSpecificGuidelines(options),
      buildSecurityPerformanceSection(options),
      this.buildCopilotSpecificInstructions(options),
    ];

    return sections.join('\n\n');
  }

  /**
   * Build header section
   * @param options - Configuration options
   * @returns Header section string
   */
  private buildHeader(options: CopilotConfigOptions): string {
    const today = new Date().toISOString().split('T')[0];

    const projectTypeNames = {
      basic: 'Basic Application',
      web: 'Web Application',
      cli: 'CLI Application',
      library: 'Library Package',
    };

    return `# ${options.projectName} - GitHub Copilot Instructions

*Instructions generated by Nìmata CLI - Last updated: ${today}*

**Last Updated**: ${today}

## Overview

This file contains specific instructions for GitHub Copilot to help generate high-quality code for **${options.projectName}**.

### Project Information
- **Name**: ${options.projectName}
- **Project Type**: ${projectTypeNames[options.projectType as keyof typeof projectTypeNames] || options.projectType}
- **Environment**: ${this.getFormattedEnvironment(options.targetEnvironment)}
- **Quality Level**: ${options.qualityLevel}`;
  }

  /**
   * Build language standards section
   * @returns Language standards section string
   */
  private buildLanguageStandardsSection(): string {
    return `### Language Standards

**MUST** write all code, comments, and documentation in **English** only

**MUST** use TypeScript with strict type checking enabled

- Files: \`kebab-case\`
- Classes/Types: \`PascalCase\`
- Functions/Variables: \`camelCase\`
- Constants: \`UPPER_SNAKE_CASE\``;
  }

  /**
   * Build formatting rules section
   * @param options - Configuration options
   * @returns Formatting rules section string
   */
  private buildFormattingRulesSection(options: CopilotConfigOptions): string {
    const indentSize =
      options.codeStyle['indentSize'] || COPILOT_CONSTANTS.CODE_STYLE.DEFAULT_INDENT_SIZE;

    // Get trailing comma text based on quality level
    let trailingCommaText;
    if (options.qualityLevel === 'light') {
      trailingCommaText = 'none';
    } else if (options.qualityLevel === 'strict') {
      trailingCommaText = 'all';
    } else {
      trailingCommaText = 'es5';
    }

    // Get line length based on quality level
    let lineLength;
    if (options.qualityLevel === 'light') {
      lineLength = LINE_LENGTH_LIGHT;
    } else if (options.qualityLevel === 'strict') {
      lineLength = LINE_LENGTH_STRICT;
    } else {
      lineLength = LINE_LENGTH_MEDIUM;
    }

    return `### Formatting Rules

- **Indentation**: ${indentSize} spaces (never tabs)
- **Semicolons**: Always use semicolons
- **Quotes**: Single quotes for strings
- **Trailing commas**: ${trailingCommaText}
- **Line length**: Maximum ${lineLength} characters`;
  }

  /**
   * Build testing requirements section
   * @param options - Configuration options
   * @returns Testing requirements section string
   */
  private buildTestingRequirementsSection(options: CopilotConfigOptions): string {
    const coverageThreshold = getCopilotCoverageThreshold(options.qualityLevel);
    let framework = 'Vitest';

    if (options.projectType === 'web' || options.projectType === 'basic') {
      framework = 'Vitest with TypeScript support';
    }

    return `## Testing Requirements

- **Framework**: Use ${framework}
- **Coverage**: Minimum ${coverageThreshold}% code coverage required
- **Test Structure**: Use describe/it/test pattern`;
  }

  /**
   * Build what to avoid section
   * @param options - Configuration options
   * @returns What to avoid section string
   */
  private buildWhatToAvoidSection(options: CopilotConfigOptions): string {
    const strictRules =
      options.qualityLevel === 'strict' ? '\n- **NEVER** use console.log in production code' : '';

    return `## What to Avoid

- **NEVER** disable ESLint rules with inline comments
- **NEVER** use \`any\` type in TypeScript
- **ALWAYS** handle errors properly${strictRules}`;
  }

  /**
   * Build code patterns section
   * @returns Code patterns section string
   */
  private buildCodePatternsSection(): string {
    return `## Code Patterns

### Project Structure
- Follow standard TypeScript project structure
- Separate concerns with clear module boundaries

### Testing Patterns
- Write unit tests for all business logic
- Use integration tests for component interactions

### Error Handling
- Use try-catch blocks for async operations
- Return Result types for business operations

### API Patterns
- Use RESTful principles for API design
- Implement proper HTTP status codes

### Configuration
- Use environment variables for configuration
- Validate configuration at startup`;
  }

  /**
   * Build project-specific guidelines
   * @param options - Configuration options
   * @returns Project-specific guidelines string
   */
  private buildProjectSpecificGuidelines(options: CopilotConfigOptions): string {
    if (options.projectType === 'cli') {
      return `## CLI Development Guidelines

- Use command pattern for CLI operations
- **Commander.js**: Use command pattern, implement help text`;
    } else if (options.projectType === 'web') {
      return `## Web Development Guidelines

- Use MVC or similar architectural pattern
- **Express.js**: Use middleware for cross-cutting concerns`;
    } else if (options.projectType === 'library') {
      return `## Library Development Guidelines

- Design with clear public APIs and minimal surface area
- Use semantic versioning for releases`;
    }
    return '';
  }

  /**
   * Build Copilot-specific instructions
   * @param _options - Configuration options (unused but kept for consistency)
   * @returns Copilot-specific instructions string
   */
  private buildCopilotSpecificInstructions(_options: CopilotConfigOptions): string {
    return `${this.buildCodeGenerationInstructions()}
${this.buildRefactoringInstructions()}
${this.buildTestingInstructions()}
${this.getCodeQualityStandards()}
${this.getFinalInstructions()}`;
  }

  /**
   * Build code generation instructions
   * @returns Code generation instructions string
   */
  private buildCodeGenerationInstructions(): string {
    return `### When Generating Code

1. **Always** follow the coding standards and patterns defined above
2. **Prefer** modern JavaScript/TypeScript features when appropriate
3. **Include** proper error handling and validation
4. **Write** meaningful comments for complex logic
5. **Consider** performance implications of generated code
6. **Ensure** compatibility with the target environment`;
  }

  /**
   * Build refactoring instructions
   * @returns Refactoring instructions string
   */
  private buildRefactoringInstructions(): string {
    return `### When Refactoring Code

1. **Maintain** existing functionality while improving structure
2. **Follow** established patterns and conventions
3. **Update** comments and documentation as needed
4. **Preserve** error handling behavior
5. **Consider** impact on dependent code`;
  }

  /**
   * Build testing instructions
   * @returns Testing instructions string
   */
  private buildTestingInstructions(): string {
    return `### When Writing Tests

1. **Test** behavior, not implementation details
2. **Cover** edge cases and error conditions
3. **Use** descriptive test names
4. **Follow** the testing patterns defined above
5. **Maintain** high test coverage`;
  }

  /**
   * Get code quality standards
   * @returns Code quality standards string
   */
  private getCodeQualityStandards(): string {
    return `### Code Quality Standards

- Write clean, readable code
- Follow SOLID principles

- Use consistent formatting
- Follow project style guide

- Document complex logic
- Use meaningful variable names

- Avoid hardcoded values
- Prefer composition over inheritance`;
  }

  /**
   * Get final instructions
   * @returns Final instructions string
   */
  private getFinalInstructions(): string {
    return `### Final Instructions

- **Always** prioritize code quality and maintainability
- **Consider** the specific needs of this project
- **Follow** security best practices
- **Write** code that is easy to understand and modify
- **Ensure** all generated code follows these guidelines`;
  }

  /**
   * Build Copilot patterns content
   * @param options - Configuration options
   * @returns Copilot patterns content string
   */
  private buildCopilotPatterns(options: CopilotConfigOptions): string {
    const today = new Date().toISOString().split('T')[0];
    const patterns = getCodePatternsContent();
    const projectPatterns = getProjectSpecificPatternsContent(options.projectType);
    const bestPractices = getBestPracticesContent();

    return `# Code Patterns and Examples

**Last Updated**: ${today}

${patterns}

${projectPatterns}

${bestPractices}`;
  }
}

/**
 * Factory function to create Copilot generator instance
 * @returns New CopilotGenerator instance
 */
export function createCopilotGenerator(): CopilotGenerator {
  return new CopilotGenerator();
}
