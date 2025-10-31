/**
 * AI Context Section Builders
 *
 * Utility functions for building AI context sections
 */

import { AIContextConfigOptions } from '../types/config-types.js';

/**
 * Build project header section
 * @param {unknown} options - Configuration options for AI context generation
 * @param {unknown} projectTypeName - Human-readable project type name
 * @param {unknown} timestamp - ISO date string for the generation time
 * @returns {string} Formatted markdown string with project header information
 */
export function buildProjectHeader(
  options: AIContextConfigOptions,
  projectTypeName: string,
  timestamp: string
): string {
  const description = options.projectDescription ? `> ${options.projectDescription}\n` : '';
  const assistants = options.aiAssistants.join(', ');

  return `${description}**Project Type**: ${projectTypeName}
**Environment**: ${getEnvironmentName(options.targetEnvironment)}
**Quality Level**: ${options.qualityLevel}
**AI Assistants**: ${assistants}
**Last Updated**: ${timestamp}`;
}

/**
 * Build project overview section
 * @param {unknown} options - Configuration options for AI context generation
 * @param {unknown} projectTypeName - Human-readable project type name
 * @param {(qualityLevel} getCoverageThreshold - Function to get coverage threshold
 * @returns {void} Formatted markdown string with project overview information
 */
export function buildProjectOverviewSection(
  options: AIContextConfigOptions,
  projectTypeName: string,
  getCoverageThreshold: (qualityLevel: string) => number
): string {
  return `## Project Information

This is a ${options.qualityLevel} quality ${projectTypeName.toLowerCase()} targeting ${getEnvironmentName(options.targetEnvironment).toLowerCase()}.

### Core Technologies
${getCoreTechnologies(options.frameworks)}

### Development Standards
- **Language**: All code, comments, and documentation in English
- **TypeScript**: Strict mode enabled with comprehensive type safety
- **Testing**: Vitest framework with ${getCoverageThreshold(options.qualityLevel)}% coverage requirement
- **Code Quality**: ESLint with strict rules, no exceptions allowed
- **Formatting**: Prettier with consistent style across all files`;
}

/**
 * Build architecture section
 * @param {unknown} options - Configuration options for AI context generation
 * @param {(projectType} getArchitectureSection - Function to get architecture section
 * @returns {void} Formatted markdown string with architecture information
 */
export function buildArchitectureSection(
  options: AIContextConfigOptions,
  getArchitectureSection: (projectType: string) => string
): string {
  return `## Architecture and Patterns

${getArchitectureSection(options.projectType)}`;
}

/**
 * Build development workflow section
 * @param {unknown} options - Configuration options for AI context generation
 * @param {(projectType} getDevCommand - Function to get development command
 * @param {unknown} getKeyCommands - Function to get key commands
 * @returns {void} Formatted markdown string with development workflow information
 */
export function buildDevelopmentWorkflowSection(
  options: AIContextConfigOptions,
  getDevCommand: (projectType: string) => string,
  getKeyCommands: (projectType: string) => string
): string {
  return `## Development Workflow

### Getting Started
1. Install dependencies: \`bun install\`
2. Start development: ${getDevCommand(options.projectType)}
3. Run tests: \`bun test\`
4. Check code quality: \`bun run lint\`

### Key Commands
${getKeyCommands(options.projectType)}

### Testing Strategy
- Unit tests for all business logic
- Integration tests for critical workflows
- E2E tests for user-facing features (if applicable)
- Mutation testing to ensure test quality (strict quality only)`;
}

/**
 * Build code conventions section
 * @param {unknown} options - Configuration options for AI context generation
 * @param {(codeStyle} getStyleGuidelines - Function to get style guidelines
 * @returns {void} Formatted markdown string with code conventions information
 */
export function buildCodeConventionsSection(
  options: AIContextConfigOptions,
  getStyleGuidelines: (codeStyle: Record<string, string | boolean | number>) => string
): string {
  return `## Code Conventions

### Style Guidelines
${getStyleGuidelines(options.codeStyle as Record<string, string | number | boolean>)}

### Naming Conventions
- **Files**: \`kebab-case\` (e.g., \`user-service.ts\`)
- **Classes/Types**: \`PascalCase\` (e.g., \`UserService\`)
- **Functions/Variables**: \`camelCase\` (e.g., \`getUserById\`)
- **Constants**: \`UPPER_SNAKE_CASE\` (e.g., \`API_BASE_URL\`)
- **Interfaces**: Prefix with \`I\` only when necessary (e.g., \`UserRepository\`)

### Import Guidelines
- Use explicit imports over wildcard imports
- Group imports: external libraries, then internal modules
- Use \`import type\` for type-only imports
- Order imports alphabetically within groups`;
}

/**
 * Build quality requirements section
 * @param {unknown} options - Configuration options for AI context generation
 * @param {(qualityLevel} getQualityStandards - Function to get quality standards
 * @param {unknown} getTestingRequirements - Function to get testing requirements
 * @returns {void} Formatted markdown string with quality requirements information
 */
export function buildQualityRequirementsSection(
  options: AIContextConfigOptions,
  getQualityStandards: (qualityLevel: string) => string,
  getTestingRequirements: (qualityLevel: string, projectType: string) => string
): string {
  return `## Quality Requirements

### Code Quality Standards
${getQualityStandards(options.qualityLevel)}

### Testing Requirements
${getTestingRequirements(options.qualityLevel, options.projectType)}

### Documentation Requirements
- Public APIs must have JSDoc comments
- Complex algorithms require inline comments
- README with setup and usage instructions
- API documentation for libraries`;
}

/**
 * Build AI integration section
 * @param {unknown} options - Configuration options for AI context generation
 * @param {(aiAssistants} getAIAssistantIntegration - Function to get AI assistant integration
 * @returns {void} Formatted markdown string with AI assistant integration information
 */
export function buildAIIntegrationSection(
  options: AIContextConfigOptions,
  getAIAssistantIntegration: (aiAssistants: string[]) => string
): string {
  return `## AI Assistant Integration

This project is configured for the following AI assistants:

${getAIAssistantIntegration(options.aiAssistants)}`;
}

/**
 * Build common tasks section
 * @param {unknown} options - Configuration options for AI context generation
 * @param {(qualityLevel} getCommonAIGuidelines - Function to get common AI guidelines
 * @returns {void} Formatted markdown string with common tasks information
 */
export function buildCommonTasksSection(
  options: AIContextConfigOptions,
  getCommonAIGuidelines: (qualityLevel: string) => string
): string {
  return `## Common Tasks

When working with this project, AI assistants should:

${getCommonAIGuidelines(options.qualityLevel)}`;
}

/**
 * Build avoidance section
 * @param {unknown} options - Configuration options for AI context generation
 * @param {(qualityLevel} getAvoidanceRules - Function to get avoidance rules
 * @returns {void} Formatted markdown string with rules to avoid
 */
export function buildAvoidanceSection(
  options: AIContextConfigOptions,
  getAvoidanceRules: (qualityLevel: string) => string
): string {
  return `## What to Avoid

${getAvoidanceRules(options.qualityLevel)}`;
}

// Helper functions
/**
 * Get human-readable environment name
 * @param {string} targetEnvironment - Target environment identifier
 * @returns {string): string} Human-readable environment name
 */
function getEnvironmentName(targetEnvironment: string): string {
  const names = {
    node: 'Node.js',
    browser: 'Browser',
    both: 'Universal (Node.js + Browser)',
  };
  return names[targetEnvironment as keyof typeof names] || 'Unknown';
}

/**
 * Get formatted core technologies description
 * @param {string[]} frameworks - Array of framework names
 * @returns {string[]): string} Formatted markdown string with core technologies
 */
function getCoreTechnologies(frameworks: string[]): string {
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
