/**
 * Main CLAUDE.md Content Builders
 *
 * Functions for building main CLAUDE.md sections
 */

import {
  CLAUDE_MD_CONSTANTS,
  ESLINT_CRITICAL_RULES,
  MUTATION_THRESHOLDS,
  CODE_STYLE_REQUIREMENTS,
} from './claude-md-constants.js';
import { getEnvironmentName } from './claude-md-helpers.js';
import type { ProjectConfig, ClaudeMdConfigOptions, QualityLevel } from './claude-md-types.js';

/**
 * Build CLAUDE.md header section
 * @param config - Project configuration
 * @returns Header markdown
 */
export function buildHeader(config: ProjectConfig): string {
  const projectTypeName = config.projectType.charAt(0).toUpperCase() + config.projectType.slice(1);
  const environment = getEnvironmentName(config.projectType);

  return `# ${config.name}

> ${config.description || `A ${config.projectType} project`}

## Project Overview

- **Name**: ${config.name}
- **Project Type**: ${projectTypeName} Application
- **Environment**: ${environment}
- **Quality Level**: ${config.qualityLevel}
- **AI Assistants**: ${config.aiAssistants.join(', ')}

**Generated**: ${new Date().toISOString().split('T')[0]}
`;
}

/**
 * Build language requirements section
 * @returns Language requirements markdown
 */
export function buildLanguageRequirementsSection(): string {
  return `
## Language Requirements

All code, code comments, and technical documentation MUST be written in **English**.

- **Code**: English only
- **Code comments**: English only
- **Technical documentation** (README files, API docs, inline docs, etc.): English only
- **Commit messages**: English only
- **Pull request descriptions**: English only
`;
}

/**
 * Build ESLint rules section
 * @param _options - Claude.md generation options (reserved for future use)
 * @returns ESLint rules section markdown
 */
export function buildEslintRulesSection(_options: ClaudeMdConfigOptions): string {
  return `
### ESLint Rules

${ESLINT_CRITICAL_RULES}
`;
}

/**
 * Build mutation testing section
 * @param _options - Claude.md generation options (reserved for future use)
 * @returns Mutation testing section markdown
 */
export function buildMutationTestingSection(_options: ClaudeMdConfigOptions): string {
  return `
### Mutation Testing Thresholds

${MUTATION_THRESHOLDS}
`;
}

/**
 * Build code style requirements section
 * @param qualityLevel - Quality level
 * @returns Code style requirements markdown
 */
export function buildCodeStyleRequirementsSection(qualityLevel: QualityLevel): string {
  return `
### Code Style Requirements

${CODE_STYLE_REQUIREMENTS}

${buildCodeStyleConfiguration(qualityLevel)}
`;
}

/**
 * Build testing section
 * @param options - Claude.md generation options
 * @returns Testing section markdown
 */
export function buildTestingSection(options: ClaudeMdConfigOptions): string {
  const coverageThreshold = getCoverageThreshold(options.qualityLevel);

  return `
### Testing Requirements

- Maintain ${coverageThreshold}% test coverage
- Write tests for all public methods and functions
- Test both success and error scenarios
- Use descriptive test names
- Mock external dependencies in tests
- **Test files**: Use \`.test.ts\` or \`.spec.ts\` suffix
- **Framework**: Vitest with TypeScript support
- **Coverage**: Minimum ${coverageThreshold}% required for all tests
`;
}

/**
 * Get coverage threshold based on quality level
 * @param qualityLevel - Quality level
 * @returns Coverage threshold percentage
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
 * Build code style configuration section
 * @param qualityLevel - Quality level
 * @returns Code style configuration object
 */
function buildCodeStyleConfiguration(qualityLevel: QualityLevel): string {
  const printWidth = getPrintWidth(qualityLevel);

  return `
## Code Style Configuration

- **Indent Size**: 2 spaces
- **Use Tabs**: No
- **Semicolons**: Required
- **Quotes**: Single
- **Trailing Commas**: es5
- **Print Width**: ${printWidth} characters
- **Line Endings**: LF
`;
}

/**
 * Get print width based on quality level
 * @param qualityLevel - Quality level
 * @returns Print width number
 */
function getPrintWidth(qualityLevel: QualityLevel): number {
  switch (qualityLevel) {
    case 'light':
      return CLAUDE_MD_CONSTANTS.CODE_STYLE.LIGHT_PRINT_WIDTH;
    case 'medium':
      return CLAUDE_MD_CONSTANTS.CODE_STYLE.MEDIUM_PRINT_WIDTH;
    case 'strict':
      return CLAUDE_MD_CONSTANTS.CODE_STYLE.STRICT_PRINT_WIDTH;
    default:
      return CLAUDE_MD_CONSTANTS.CODE_STYLE.MEDIUM_PRINT_WIDTH;
  }
}

/**
 * Build key dependencies section
 * @param config - Project configuration
 * @returns Key dependencies section markdown
 */
export function buildKeyDependenciesSection(config: ProjectConfig): string {
  const deps = ['typescript', 'eslint', 'prettier', 'vitest'];

  if (config.projectType === 'web') {
    deps.push('react', 'vite');
  } else if (config.projectType === 'cli') {
    deps.push('commander', 'chalk');
  }

  return `
## Key Dependencies

${deps.map((dep) => `- ${dep}`).join('\n')}
`;
}

/**
 * Build generation timestamp
 * @param date - Date string
 * @returns Timestamp markdown
 */
export function buildGenerationTimestamp(date: string): string {
  return `\n*Last updated: ${date}*\n`;
}

/**
 * Build footer section
 * @returns Footer markdown
 */
export function buildFooter(): string {
  return `
---

*This CLAUDE.md file was automatically generated by Nìmata CLI.*
*Modify with care, as changes may be overwritten during regeneration.*`;
}
