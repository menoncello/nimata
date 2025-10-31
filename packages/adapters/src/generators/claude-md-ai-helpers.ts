/**
 * AI Context Helper Functions
 *
 * Extracted from ClaudeMdGenerator to reduce file size while preserving exact behavior
 */

import { CLI_PATTERN, GOOD_PATTERNS, BAD_PATTERNS } from './claude-md-constants.js';
import type {
  ProjectConfig,
  ClaudeMdConfigOptions,
  ProjectType,
  QualityLevel,
} from './claude-md-types.js';

/**
 * Build AI context header section
 * @param {unknown} config - Project configuration
 * @param {unknown} options - Configuration options
 * @returns {string} Header section string
 */
export function buildAIContextHeader(
  config: ProjectConfig,
  options: ClaudeMdConfigOptions
): string {
  const today = new Date().toISOString().split('T')[0];

  return `# AI Context for ${config.name}

**Generated**: ${today}
**Quality Level**: ${options.qualityLevel}
**Project Type**: ${config.projectType}`;
}

/**
 * Build AI context project overview section
 * @param {ProjectConfig} config - Project configuration
 * @returns {ProjectConfig): string} Overview section string
 */
export function buildAIContextOverview(config: ProjectConfig): string {
  const projectTypeNames = {
    basic: 'Basic TypeScript Project',
    web: 'Web Application Project',
    cli: 'CLI Application Project',
    library: 'Library Package Project',
  };

  return `## Project Information

**Name**: ${config.name}
**Type**: ${projectTypeNames[config.projectType as keyof typeof projectTypeNames] || config.projectType}
**Description**: ${config.description || 'A TypeScript project configured for Claude Code integration'}`;
}

/**
 * Build AI context dependencies section
 * @param {ProjectConfig} config - Project configuration
 * @returns {ProjectConfig): string} Dependencies section string
 */
export function buildAIContextDependencies(config: ProjectConfig): string {
  const baseDependencies = [
    '- TypeScript for type safety',
    '- ESLint for code quality',
    '- Prettier for code formatting',
    '- Vitest for testing',
  ];

  const projectSpecificDependencies = {
    web: ['- Express.js for web server'],
    cli: ['- Commander.js for CLI argument parsing'],
    library: ['- Rollup for bundling'],
    basic: [],
  };

  const additionalDeps =
    projectSpecificDependencies[config.projectType as keyof typeof projectSpecificDependencies] ||
    [];

  return `### Key Dependencies

${[...baseDependencies, ...additionalDeps].join('\n')}`;
}

/**
 * Build AI context code patterns section
 * @param {ProjectConfig} config - Project configuration
 * @returns {ProjectConfig): string} Code patterns section string
 */
export function buildAIContextCodePatterns(config: ProjectConfig): string {
  const cliPattern = config.projectType === 'cli' ? `\n\n${CLI_PATTERN}` : '';
  const cliBulletPattern =
    config.projectType === 'cli' ? `\n\n- Use command pattern for CLI operations` : '';

  return `## Code Patterns

${GOOD_PATTERNS}

${cliBulletPattern ? cliBulletPattern.trim() : ''}
\`\`\`
${cliPattern ? cliPattern : ''}

${BAD_PATTERNS}`;
}

/**
 * Build AI context testing strategy section
 * @param {unknown} options - Configuration options
 * @param {(qualityLevel} getCoverageThreshold - Function to get coverage threshold
 * @returns {void} Testing strategy section string
 */
export function buildAIContextTestingStrategy(
  options: ClaudeMdConfigOptions,
  getCoverageThreshold: (qualityLevel: QualityLevel) => number
): string {
  return `## Testing Strategy

- Achieve ${getCoverageThreshold(options.qualityLevel)}% test coverage
- Use Vitest as the primary testing framework
- Test both happy path and error cases
- Mock external dependencies`;
}

/**
 * Build AI context development guidelines section
 * @param {unknown} projectType - Project type
 * @returns {ProjectType): string} Guidelines section string
 */
export function buildAIContextGuidelines(projectType?: ProjectType): string {
  const cliGuidelines =
    projectType === 'cli' ? '\n- Implement proper error handling with user-friendly messages' : '';

  return `## Development Guidelines

- Follow the existing code style
- Write tests for new features
- Update documentation when needed
- Use TypeScript strictly
- Handle errors properly${cliGuidelines}`;
}

/**
 * Build AI context project structure section
 * @returns {string} Project structure section string
 */
export function buildAIContextProjectStructure(): string {
  return `## Project Structure

\`\`\`
src/
├── components/     # UI components (if web project)
├── utils/         # Utility functions
├── types/         # TypeScript type definitions
└── tests/         # Test files
\`\`\``;
}
