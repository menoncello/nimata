/**
 * Content Builders Utility
 *
 * Utility functions for building various content sections
 */

import { CodeStyleConfig } from '../types/config-types.js';

/**
 * Get core technologies section for the context
 * @param frameworks - List of frameworks used in the project
 * @param _projectType - Type of project being generated (unused)
 * @returns Formatted markdown string with core technologies information
 */
export function getCoreTechnologies(frameworks: string[], _projectType: string): string {
  return frameworks
    .map((framework) => {
      switch (framework) {
        case 'typescript':
          return '- **TypeScript**: Strict mode with comprehensive type safety';
        case 'vitest':
          return '- **Vitest**: Modern testing framework with TypeScript support';
        case 'express':
          return '- **Express.js**: Fast, unopinionated web framework';
        case 'commander':
          return '- **Commander.js**: Complete solution for Node.js command-line interfaces';
        default:
          return `- **${framework}**: Following best practices and conventions`;
      }
    })
    .join('\n');
}

/**
 * Get architecture section for the context
 * @param projectType - Type of project being generated
 * @returns Formatted markdown string with architecture information
 */
export function getArchitectureSection(projectType: string): string {
  switch (projectType) {
    case 'cli':
      return `- **Command Pattern**: Separate command classes for different operations
- **Dependency Injection**: Testable and maintainable code structure
- **Configuration Management**: Environment-specific settings and validation
- **Error Handling**: Graceful error handling with user-friendly messages`;

    case 'web':
      return `- **MVC Pattern**: Separation of concerns with models, views, and controllers
- **Repository Pattern**: Data access abstraction layer
- **Middleware Architecture**: Cross-cutting concerns handled via middleware
- **RESTful Design**: Proper HTTP methods and status codes`;

    case 'library':
      return `- **API Design**: Clean, minimal public surface area
- **Semantic Versioning**: Proper version management and compatibility
- **Multiple Exports**: Support for ESM, CommonJS, and UMD formats
- **Type Safety**: Comprehensive TypeScript definitions`;

    default:
      return `- **Modular Design**: Clear separation of functionality
- **Clean Architecture**: Dependency inversion and loose coupling
- **Design Patterns**: Appropriate use of established patterns
- **Code Organization**: Logical file and directory structure`;
  }
}

/**
 * Get style guidelines
 * @param codeStyle - Code style configuration object
 * @param jsonIndentSize - JSON indent size from constants
 * @param defaultPrintWidth - Default print width
 * @returns Formatted markdown string with style guidelines
 */
export function getStyleGuidelines(
  codeStyle: CodeStyleConfig,
  jsonIndentSize: number,
  defaultPrintWidth: number
): string {
  const indentSize = codeStyle['indentSize'] || jsonIndentSize;
  const trailingComma = codeStyle['trailingComma'] || 'es5';
  const printWidth = codeStyle['printWidth'] || defaultPrintWidth;

  return `- **Indentation**: ${indentSize} spaces
- **Quotes**: Single quotes, double quotes only when needed
- **Semicolons**: Always required
- **Trailing Commas**: ${trailingComma}
- **Line Length**: Maximum ${printWidth} characters
- **Braces**: Always use braces for control structures`;
}

/**
 * Get quality standards
 * @param qualityLevel - Quality level of the project ('light', 'medium', 'strict')
 * @returns Formatted markdown string with quality standards
 */
export function getQualityStandards(qualityLevel: string): string {
  switch (qualityLevel) {
    case 'light':
      return `- Focus on basic functionality and readability
- Essential error handling and validation
- Basic test coverage for critical paths`;

    case 'medium':
      return `- High code quality and maintainability
- Comprehensive error handling and logging
- Good test coverage with edge cases
- Performance considerations for critical paths`;

    case 'strict':
      return `- Maximum code quality and maintainability
- Comprehensive error handling with recovery mechanisms
- Extensive test coverage (95%+) with mutation testing
- Performance optimization and security best practices
- Code review requirements for all changes`;

    default:
      return '';
  }
}

/**
 * Get testing requirements
 * @param qualityLevel - Quality level of the project ('light', 'medium', 'strict')
 * @param getCoverageThreshold - Function to get coverage threshold
 * @returns Formatted markdown string with testing requirements
 */
export function getTestingRequirements(
  qualityLevel: string,
  getCoverageThreshold: (qualityLevel: string) => number
): string {
  const coverage = getCoverageThreshold(qualityLevel);
  return `- **Coverage**: Minimum ${coverage}% required
- **Framework**: Vitest with TypeScript support
- **Types**: Unit, integration, and E2E tests
- **Structure**: describe/it/test with clear naming
- **Mocking**: Proper mocking of external dependencies
- **Quality**: All tests must pass before deployment`;
}

/**
 * Get AI assistant integration
 * @param aiAssistants - List of AI assistants configured for the project
 * @param claudeCodeAssistant - Claude code assistant constant
 * @param copilotAssistant - Copilot assistant constant
 * @returns Formatted markdown string with AI assistant integration information
 */
export function getAIAssistantIntegration(
  aiAssistants: string[],
  claudeCodeAssistant: string,
  copilotAssistant: string
): string {
  return aiAssistants
    .map((assistant) => {
      switch (assistant) {
        case claudeCodeAssistant:
          return `- **Claude Code**: Advanced code generation with project-specific context and quality standards`;
        case copilotAssistant:
          return `- **GitHub Copilot**: IntelliSense-powered code completion with pattern recognition`;
        default:
          return `- **${assistant}**: AI-assisted development support`;
      }
    })
    .join('\n');
}

/**
 * Get common AI guidelines
 * @param qualityLevel - Quality level of the project ('light', 'medium', 'strict')
 * @returns Formatted markdown string with common AI guidelines
 */
export function getCommonAIGuidelines(qualityLevel: string): string {
  const baseGuidelines = `- Understand the existing codebase before making changes
- Follow established patterns and conventions
- Generate type-safe, well-documented code
- Include appropriate tests for new functionality
- Ensure all generated code follows quality standards`;

  if (qualityLevel === 'strict') {
    return `${baseGuidelines}
- Use Test-Driven Development when possible
- Consider performance implications and optimizations
- Include comprehensive error handling and edge cases
- Follow security best practices for all generated code
- Suggest architectural improvements when appropriate`;
  }

  return baseGuidelines;
}

/**
 * Get avoidance rules
 * @param qualityLevel - Quality level of the project ('light', 'medium', 'strict')
 * @returns Formatted markdown string with rules to avoid
 */
export function getAvoidanceRules(qualityLevel: string): string {
  const baseRules = `- Never disable ESLint rules or ignore errors
- Never use \`any\` type in TypeScript
- Never commit sensitive information or API keys
- Never ignore test failures or coverage drops
- Always follow established patterns and conventions`;

  if (qualityLevel === 'strict') {
    return `${baseRules}
- Never use console.log in production code (use proper logging)
- Never leave commented-out code in commits
- Never use hardcoded values that should be configurable
- Always include comprehensive error handling
- Always document complex logic and architectural decisions`;
  }

  return baseRules;
}
