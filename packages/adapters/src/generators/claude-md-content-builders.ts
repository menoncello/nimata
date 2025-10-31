/**
 * CLAUDE.md Content Builders v2
 *
 * Helper functions for building CLAUDE.md content sections
 */

import { CLAUDE_MD_CONSTANTS } from './claude-md-constants.js';
import type { QualityLevel, ProjectType, ClaudeMdConfigOptions } from './claude-md-types.js';

/**
 * Get coverage threshold based on quality level
 * @param {QualityLevel} qualityLevel - Quality level
 * @returns {QualityLevel): number} Coverage threshold number
 */
export function getCoverageThreshold(qualityLevel: QualityLevel): number {
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

/**
 * Get print width based on quality level
 * @param {QualityLevel} qualityLevel - Quality level
 * @returns {QualityLevel): number} Print width number
 */
export function getPrintWidth(qualityLevel: QualityLevel): number {
  switch (qualityLevel) {
    case 'light':
      return CLAUDE_MD_CONSTANTS.CODE_STYLE.LIGHT_PRINT_WIDTH;
    case 'medium':
      return CLAUDE_MD_CONSTANTS.CODE_STYLE.MEDIUM_PRINT_WIDTH;
    case 'strict':
      return CLAUDE_MD_CONSTANTS.CODE_STYLE.STRICT_PRINT_WIDTH;
    default:
      return CLAUDE_MD_CONSTANTS.CODE_STYLE.DEFAULT_PRINT_WIDTH;
  }
}

/**
 * Build code style configuration section
 * @param {ClaudeMdConfigOptions} options - Configuration options
 * @returns {ClaudeMdConfigOptions): string} Code style configuration string
 */
export function buildCodeStyleSection(options: ClaudeMdConfigOptions): string {
  const { qualityLevel, codeStyle } = options;

  return `## Code Style Configuration

- **Indent Size**: ${codeStyle.indentSize} spaces
- **Use Tabs**: ${codeStyle.useTabs ? 'Yes' : 'No'}
- **Semicolons**: ${codeStyle.semi ? 'Required' : 'Optional'}
- **Quotes**: ${codeStyle.singleQuote ? 'Single' : 'Double'}
- **Trailing Commas**: ${codeStyle.trailingComma}
- **Print Width**: ${codeStyle.printWidth || getPrintWidth(qualityLevel)} characters
- **Line Endings**: LF

## Quality Standards

- **Quality Level**: ${qualityLevel}
- **Coverage Threshold**: ${getCoverageThreshold(qualityLevel)}%
- **TypeScript**: ${options.enableTypeScript ? 'Enabled' : 'Disabled'}
- **Testing**: ${options.enableTesting ? 'Enabled' : 'Disabled'}`;
}

/**
 * Build project architecture section
 * @param {ProjectType} projectType - Project type
 * @returns {ProjectType): string} Architecture section string
 */
export function buildArchitectureSection(projectType: ProjectType): string {
  const architectureMap = {
    basic: 'Basic project structure with standard conventions',
    web: 'Web application with frontend components and build pipeline',
    cli: 'Command-line interface tool with argument parsing',
    library: 'Reusable library with public API documentation',
  };

  let specificComponents = '';
  if (projectType === 'cli') {
    specificComponents =
      '- **src/commands/**: CLI command implementations\n- **src/utils/**: Utility functions and helpers';
  } else if (projectType === 'web') {
    specificComponents =
      '- **src/components/**: Reusable UI components\n- **src/pages/**: Page-level components';
  } else if (projectType === 'library') {
    specificComponents =
      '- **src/**: Library source code\n- **types/**: TypeScript type definitions';
  }

  return `## Architecture

This is a ${projectType} project with the following characteristics:

${architectureMap[projectType]}

### Key Components

- Source code in \`src/\` directory
- Configuration files in root directory
- Test files alongside source code
- Documentation in \`docs/\` directory${buildSpecificComponents(specificComponents)}`;
}

/**
 * Build specific components string
 * @param {unknown} specificComponents - Specific components text (optional)
 * @returns {string): string} Formatted specific components section
 */
function buildSpecificComponents(specificComponents?: string): string {
  return specificComponents ? `\n\n${specificComponents}` : '';
}

/**
 * Build CLI development section
 * @param {unknown} projectType - Type of project (optional)
 * @returns {ProjectType): string} CLI development section or empty string
 */
function buildCliDevelopmentSection(projectType?: ProjectType): string {
  if (projectType !== 'cli') {
    return '';
  }
  return '\n\n### CLI Development\n- Implement proper error handling with user-friendly messages\n- Use commander.js for argument parsing\n- Add help text and usage examples\n- Test CLI commands with different argument combinations';
}

/**
 * Build development workflow section
 * @param {unknown} options - Configuration options
 * @param {unknown} projectType - Type of project (optional)
 * @returns {string} Development workflow section string
 */
export function buildDevelopmentWorkflowSection(
  options: ClaudeMdConfigOptions,
  projectType?: ProjectType
): string {
  return `## Development Workflow

### Setup
1. Install dependencies: \`bun install\`
2. Run development server: \`bun run dev\`
3. Run tests: \`bun test\`

### Code Quality
- Use ESLint for code linting
- Use Prettier for code formatting
- Maintain ${getCoverageThreshold(options.qualityLevel)}% test coverage
- Follow TypeScript best practices${options.enableTypeScript ? ' (enabled)' : ''}

### Git Workflow
- Use conventional commit messages
- Create feature branches from main
- Submit pull requests for review
- Ensure CI/CD pipeline passes${buildCliDevelopmentSection(projectType)}`;
}
