/**
 * Framework Builders Utility
 *
 * Utility functions for building framework-specific guidelines
 */

/**
 * Get Claude-specific guidelines
 * @param {string} projectType - Type of project being generated
 * @returns {string): string} Formatted markdown string with Claude-specific guidelines
 */
export function getClaudeSpecificGuidelines(projectType: string): string {
  switch (projectType) {
    case 'cli':
      return `- Generate command classes with proper error handling
- Use dependency injection for testability
- Include help text and usage examples
- Handle command-line arguments safely`;

    case 'web':
      return `- Generate Express routes with proper middleware
- Use async/await for all async operations
- Include proper error handling and status codes
- Follow RESTful API design principles`;

    case 'library':
      return `- Generate clean, well-documented public APIs
- Include comprehensive TypeScript definitions
- Use semantic versioning considerations
- Ensure backwards compatibility when possible`;

    default:
      return `- Generate modular, reusable code components
- Include proper TypeScript typing throughout
- Follow established patterns and conventions
- Ensure all generated code is production-ready`;
  }
}

/**
 * Get Copilot framework guidelines
 * @param {string[]} frameworks - List of frameworks used in the project
 * @param {string} _projectType - Type of project being generated (unused)
 * @returns { string} Formatted markdown string with Copilot framework guidelines
 */
export function getCopilotFrameworkGuidelines(frameworks: string[], _projectType: string): string {
  return frameworks
    .map((framework) => {
      switch (framework) {
        case 'typescript':
          return '- Use strict TypeScript with explicit type annotations';
        case 'vitest':
          return '- Write comprehensive tests using Vitest patterns';
        case 'express':
          return '- Follow Express.js best practices and middleware patterns';
        case 'commander':
          return '- Use Commander.js patterns for CLI applications';
        default:
          return `- Follow ${framework} best practices and conventions`;
      }
    })
    .join('\n');
}

/**
 * Get Copilot architecture guidelines
 * @param {string} projectType - Type of project being generated
 * @returns {string): string} Formatted markdown string with Copilot architecture guidelines
 */
export function getCopilotArchitectureGuidelines(projectType: string): string {
  switch (projectType) {
    case 'cli':
      return '- Implement command pattern with separation of concerns';
    case 'web':
      return '- Use MVC or similar architectural patterns';
    case 'library':
      return '- Design with clear APIs and minimal dependencies';
    default:
      return '- Follow clean architecture principles';
  }
}
