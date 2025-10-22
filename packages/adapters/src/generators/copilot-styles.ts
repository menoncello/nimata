/**
 * Copilot Style Utilities
 *
 * Provides style and formatting utilities for GitHub Copilot instructions
 */

import { FORMATTING } from '../utils/constants.js';

// Constants for magic numbers
const DEFAULT_PRINT_WIDTH = 100;

/**
 * Get base code style configuration
 * @returns Base style configuration
 */
export function getBaseCodeStyle(): Record<string, unknown> {
  return {
    indentSize: FORMATTING.JSON_INDENT_SIZE,
    useTabs: false,
    semi: true,
    singleQuote: true,
  };
}

/**
 * Get quality-specific style overrides
 * @param qualityLevel - Quality level string
 * @returns Style overrides
 */
export function getQualityStyleOverrides(qualityLevel: string): Record<string, unknown> {
  switch (qualityLevel) {
    case 'light':
      return {
        trailingComma: 'none',
        printWidth: 120,
      };

    case 'medium':
      return {
        trailingComma: 'es5',
        printWidth: DEFAULT_PRINT_WIDTH,
      };

    case 'strict':
      return {
        trailingComma: 'all',
        printWidth: 80,
      };

    default:
      return getQualityStyleOverrides('medium');
  }
}

/**
 * Get formatting rules based on code style
 * @param codeStyle - Code style configuration
 * @returns Formatted rules string
 */
export function getFormattingRules(codeStyle: Record<string, unknown>): string {
  const indentSize = (codeStyle['indentSize'] as number) || FORMATTING.JSON_INDENT_SIZE;
  const trailingComma = (codeStyle['trailingComma'] as string) || 'es5';
  const printWidth = (codeStyle['printWidth'] as number) || DEFAULT_PRINT_WIDTH;

  return `- **Indentation**: ${indentSize} spaces (never tabs)
- **Semicolons**: Always use semicolons
- **Quotes**: Single quotes for strings, double quotes only when needed
- **Trailing commas**: ${trailingComma}
- **Line length**: Maximum ${printWidth} characters
- **Braces**: Always use braces for control structures
- **Spacing**: Use spaces around operators and after commas`;
}

/**
 * Get quality standards based on level
 * @param qualityLevel - Quality level string
 * @returns Quality standards description
 */
export function getQualityStandards(qualityLevel: string): string {
  switch (qualityLevel) {
    case 'light':
      return `- Focus on readability and basic functionality
- Add comments for complex logic
- Basic error handling sufficient
- Simple tests for main features`;

    case 'medium':
      return `- Maintain high code readability and maintainability
- Add comprehensive comments for business logic
- Proper error handling with user-friendly messages
- Good test coverage for critical paths
- Follow SOLID principles
- Use TypeScript interfaces for data structures`;

    case 'strict':
      return `- Maximum code quality and maintainability standards
- Comprehensive documentation for all public APIs
- Robust error handling with proper logging and recovery
- Extensive test coverage (95%+) with edge cases
- Follow all SOLID principles and design patterns
- Use strict TypeScript configuration
- Implement proper logging and monitoring
- Performance optimization and security best practices
- Code review standards: all changes must be reviewed`;

    default:
      return '';
  }
}

/**
 * Get documentation requirements
 * @param qualityLevel - Quality level string
 * @returns Documentation requirements string
 */
export function getDocumentationRequirements(qualityLevel: string): string {
  const baseRules = `- Write clear, concise commit messages in English
- Document public APIs with JSDoc comments
- Update README for user-facing changes
- Include examples for complex features`;

  if (qualityLevel === 'strict') {
    return `${baseRules}
- Document all function parameters and return types
- Include usage examples in documentation
- Maintain CHANGELOG for all versions
- Document architectural decisions and design patterns
- Include performance characteristics in API documentation`;
  }

  return baseRules;
}

/**
 * Get avoidance rules
 * @param qualityLevel - Quality level string
 * @returns Avoidance rules string
 */
export function getAvoidanceRules(qualityLevel: string): string {
  const baseRules = `- **NEVER** disable ESLint rules with inline comments
- **NEVER** use \`any\` type in TypeScript
- **NEVER** commit sensitive information
- **NEVER** ignore test failures
- **ALWAYS** handle errors properly
- **ALWAYS** write meaningful commit messages`;

  if (qualityLevel === 'strict') {
    return `${baseRules}
- **NEVER** use console.log in production code (use proper logging)
- **NEVER** leave commented-out code in commits
- **NEVER** use hardcoded magic numbers or strings
- **ALWAYS** write tests before fixing bugs (TDD approach)
- **ALWAYS** document public APIs and complex logic`;
  }

  return baseRules;
}
