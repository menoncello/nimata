/**
 * AI Context Content Builders for CLAUDE.md
 *
 * Functions for building .claude/ai-context.md sections
 */

import {
  CLAUDE_MD_CONSTANTS,
  GOOD_PATTERNS,
  BAD_PATTERNS,
  CLI_PATTERN,
} from './claude-md-constants.js';
import type { ProjectConfig, ClaudeMdConfigOptions, ProjectType } from './claude-md-types.js';

/**
 * Build AI context header section
 * @param {unknown} config - Project configuration
 * @param {unknown} options - Claude.md generation options
 * @returns {string} AI context header markdown
 */
export function buildAIContextHeader(
  config: ProjectConfig,
  options: ClaudeMdConfigOptions
): string {
  const date = new Date().toISOString().split('T')[0];

  return `# AI Context for ${config.name}

**Generated**: ${date}
**Quality Level**: ${options.qualityLevel}
**Project Type**: ${config.projectType}
`;
}

/**
 * Build AI context overview section
 * @param {ProjectConfig} config - Project configuration
 * @returns {ProjectConfig): string} AI context overview markdown
 */
export function buildAIContextOverview(config: ProjectConfig): string {
  const projectTypeName = config.projectType.charAt(0).toUpperCase() + config.projectType.slice(1);

  return `
## Project Information

**Name**: ${config.name}
**Type**: ${projectTypeName} TypeScript Project
**Description**: ${config.description || `A ${config.projectType} project`}

### Key Dependencies

- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Vitest for testing
`;
}

/**
 * Build AI context dependencies section
 * @param {ProjectConfig} config - Project configuration
 * @returns {ProjectConfig): string} Dependencies section markdown
 */
export function buildAIContextDependencies(config: ProjectConfig): string {
  const deps: string[] = ['typescript', 'eslint', 'prettier', 'vitest'];

  if (config.projectType === 'web') {
    deps.push('react', 'vite');
  } else if (config.projectType === 'cli') {
    deps.push('commander', 'chalk');
  }

  return deps.map((dep) => `- ${dep}`).join('\n');
}

/**
 * Build AI context code patterns section
 * @param {ProjectConfig} config - Project configuration
 * @returns {ProjectConfig): string} Code patterns section markdown
 */
export function buildAIContextCodePatterns(config: ProjectConfig): string {
  const goodPattern = config.projectType === 'cli' ? CLI_PATTERN : GOOD_PATTERNS;
  const badPattern = BAD_PATTERNS;

  return `
## Code Patterns

### Good Patterns
\`\`\`typescript
${goodPattern}
\`\`\`

${config.projectType === 'cli' ? "\n### CLI-Specific Patterns\n```typescript\n// Use commander for CLI parsing\nimport { Command } from 'commander';\n```\n" : ''}

### Avoid These Patterns
\`\`\`typescript
${badPattern}
\`\`\`
`;
}

/**
 * Build AI context testing strategy section
 * @param {ClaudeMdConfigOptions} options - Claude.md generation options
 * @returns {ClaudeMdConfigOptions): string} Testing strategy section markdown
 */
export function buildAIContextTestingStrategy(options: ClaudeMdConfigOptions): string {
  const coverageTarget = getCoverageThreshold(options.qualityLevel);

  return `
## Testing Strategy

- Achieve ${coverageTarget}% test coverage
- Use Vitest as the primary testing framework
- Test both happy path and error cases
- Mock external dependencies
`;
}

/**
 * Build AI context development guidelines section
 * @param {unknown} _projectType - Project type (reserved for future use)
 * @returns {ProjectType): string} Development guidelines section markdown
 */
export function buildAIContextGuidelines(_projectType?: ProjectType): string {
  return `
## Development Guidelines

- Follow the existing code style
- Write tests for new features
- Update documentation when needed
- Use TypeScript strictly
- Handle errors properly
`;
}

/**
 * Build AI context project structure section
 * @returns {string} Project structure section markdown
 */
export function buildAIContextProjectStructure(): string {
  return `
## Project Structure

\`\`\`
src/
├── components/     # UI components (if web project)
├── utils/         # Utility functions
├── types/         # TypeScript type definitions
└── tests/         # Test files
\`\`\``;
}

/**
 * Get coverage threshold based on quality level
 * @param {string} qualityLevel - Quality level
 * @returns {string): number} Coverage threshold percentage
 */
function getCoverageThreshold(qualityLevel: string): number {
  switch (qualityLevel) {
    case 'light':
      return CLAUDE_MD_CONSTANTS.COVERAGE_THRESHOLD.LIGHT;
    case 'medium':
      return CLAUDE_MD_CONSTANTS.COVERAGE_THRESHOLD.MEDIUM;
    case 'strict':
      return CLAUDE_MD_CONSTANTS.COVERAGE_THRESHOLD.STRICT;
    default:
      return CLAUDE_MD_CONSTANTS.COVERAGE_THRESHOLD.DEFAULT;
  }
}
