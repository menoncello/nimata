/**
 * Copilot Content Builders v2
 *
 * Helper functions for building Copilot instruction content sections
 */

import { COPILOT_CONSTANTS } from './copilot-constants.js';
import type { QualityLevel, CopilotConfigOptions } from './copilot-types.js';

// Constants for code formatting
const MAX_LINE_LENGTH_LIGHT = 120;
const MAX_LINE_LENGTH_STRICT = 80;

/**
 * Get quality level configuration
 * @param qualityLevel - Project quality level
 * @returns Quality configuration object
 */
function getQualityConfig(qualityLevel: string): {
  trailingCommas: 'none' | 'es5' | 'all';
  lineLength: number;
  qualityFocus: string;
} {
  switch (qualityLevel) {
    case 'light':
      return {
        trailingCommas: 'none' as const,
        lineLength: MAX_LINE_LENGTH_LIGHT,
        qualityFocus: '- Focus on readability and basic functionality',
      };
    case 'strict':
      return {
        trailingCommas: 'all' as const,
        lineLength: MAX_LINE_LENGTH_STRICT,
        qualityFocus: '- Maximum code quality and maintainability standards',
      };
    default:
      return {
        trailingCommas: 'es5' as const,
        lineLength: 100,
        qualityFocus: '- Maintain high code readability and maintainability',
      };
  }
}

/**
 * Build frameworks list from array of frameworks
 * @param frameworks - Array of framework names
 * @returns Formatted frameworks list string
 */
function buildFrameworksList(frameworks: string[]): string {
  return frameworks.map((f: string) => `- ${f}`).join('\n');
}

/**
 * Get security guidelines based on project type
 * @param projectType - Type of project
 * @returns Security guidelines string
 */
function getSecurityGuidelines(projectType: string): string {
  const baseSecurity = [
    '- Validate all user inputs',
    '- Handle sensitive data properly',
    '- Use secure authentication practices',
    '- Follow OWASP security guidelines',
    '- Sanitize data to prevent XSS attacks',
  ];

  const webSpecific = [
    '- Implement CSRF protection',
    '- Use HTTPS in production',
    '- Set proper security headers',
  ];

  return projectType === 'web'
    ? [...baseSecurity, ...webSpecific].join('\n')
    : baseSecurity.join('\n');
}

/**
 * Get coverage threshold based on quality level
 * @param qualityLevel - Quality level
 * @returns Coverage threshold number
 */
export function getCopilotCoverageThreshold(qualityLevel: QualityLevel): number {
  switch (qualityLevel) {
    case 'light':
      return COPILOT_CONSTANTS.COVERAGE_THRESHOLD.LIGHT;
    case 'medium':
      return COPILOT_CONSTANTS.COVERAGE_THRESHOLD.MEDIUM;
    case 'strict':
      return COPILOT_CONSTANTS.COVERAGE_THRESHOLD.STRICT;
    default:
      return COPILOT_CONSTANTS.COVERAGE_THRESHOLD.MEDIUM;
  }
}

/**
 * Build project context section
 * @param options - Configuration options
 * @returns Project context section string
 */
export function buildProjectContextSection(options: CopilotConfigOptions): string {
  return `## Project Context

You are working on **${options.projectName}**, a ${options.projectType} project.

${options.projectDescription ? `> ${options.projectDescription}` : ''}

### Environment
- Target: ${options.targetEnvironment}
- Testing: ${options.testing ? 'Enabled' : 'Disabled'}
- Quality Level: ${options.qualityLevel}

### Frameworks and Libraries
${options.frameworks.length > 0 ? buildFrameworksList(options.frameworks) : '- No specific frameworks configured'}`;
}

/**
 * Build coding standards section
 * @param options - Configuration options
 * @returns Coding standards section string
 */
export function buildCodingStandardsSection(options: CopilotConfigOptions): string {
  const coverageThreshold = getCopilotCoverageThreshold(options.qualityLevel);
  const qualityConfig = getQualityConfig(options.qualityLevel);

  return `## Coding Standards

### Code Style
- Use ${options.codeStyle['singleQuote'] ? 'single' : 'double'} quotes for strings
- Use ${options.codeStyle['semi'] ? 'semicolons' : 'no semicolons'}
- Use ${options.codeStyle['useTabs'] ? 'tabs' : `${options.codeStyle['indentSize'] || COPILOT_CONSTANTS.CODE_STYLE.DEFAULT_INDENT_SIZE} spaces`} for indentation
- Maximum line length: ${qualityConfig.lineLength} characters
- Use trailing commas: ${qualityConfig.trailingCommas}

### Quality Requirements
- Maintain ${coverageThreshold}% test coverage
- Write meaningful tests for all new functionality
- Follow TypeScript best practices${options.targetEnvironment === 'node' || options.targetEnvironment === 'both' ? ' (Node.js compatible)' : ''}
- Use modern JavaScript/TypeScript features appropriately
${qualityConfig.qualityFocus}

### Documentation
- Write clear JSDoc comments for functions and classes
- Include parameter descriptions and return types
- Document complex business logic
- Keep comments up-to-date with code changes`;
}

/**
 * Build testing guidelines section
 * @param options - Configuration options
 * @returns Testing guidelines section string
 */
export function buildTestingGuidelinesSection(options: CopilotConfigOptions): string {
  if (!options.testing) {
    return `## Testing

Testing is disabled for this project.`;
  }

  return `## Testing

### Test Structure
- Write unit tests for all pure functions
- Test components and integration points
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)

### Test Coverage
- Aim for ${getCopilotCoverageThreshold(options.qualityLevel)}% code coverage
- Test edge cases and error conditions
- Mock external dependencies appropriately
- Keep tests fast and reliable

### Best Practices
- Test behavior, not implementation details
- Use appropriate assertion methods
- Group related tests with describe blocks
- Setup and teardown state properly`;
}

/**
 * Build security and performance section
 * @param options - Configuration options
 * @returns Security and performance section string
 */
export function buildSecurityPerformanceSection(options: CopilotConfigOptions): string {
  const securityGuidelines = getSecurityGuidelines(options.projectType);

  return `## Security and Performance

### Security Guidelines
${securityGuidelines}

### Performance Considerations
- Optimize algorithms for time and space complexity
- Use appropriate data structures
- Minimize bundle size for web applications
- Implement efficient caching strategies
- Monitor and optimize bottlenecks

### Code Quality
- Write readable and maintainable code
- Follow established patterns and conventions
- Refactor complex code into smaller functions
- Use meaningful variable and function names
- Keep functions focused on single responsibilities`;
}
