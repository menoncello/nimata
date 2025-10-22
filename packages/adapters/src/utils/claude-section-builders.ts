/**
 * Claude Context Section Builders
 *
 * Utility functions for building Claude-specific AI context sections
 */

import { AIContextConfigOptions } from '../types/config-types.js';

/**
 * Build Claude instructions section
 * @returns Formatted markdown string with Claude instructions
 */
export function buildClaudeInstructionsSection(): string {
  return `## Claude-Specific Instructions`;
}

/**
 * Build Claude file management section
 * @returns Formatted markdown string with file management guidelines
 */
export function buildClaudeFileManagementSection(): string {
  return `### File Management
- Use the Read tool to examine existing code before making changes
- Use Write/Edit tools for file modifications
- Use Bash tool for running commands and scripts
- Use Glob/Grep tools for code search and analysis`;
}

/**
 * Build Claude code generation section
 * @returns Formatted markdown string with code generation preferences
 */
export function buildClaudeCodeGenerationSection(): string {
  return `### Code Generation Preferences
- Generate TypeScript with strict type safety
- Use async/await patterns for asynchronous operations
- Implement proper error handling with try-catch blocks
- Include JSDoc comments for public APIs
- Follow the established code style and patterns`;
}

/**
 * Build Claude testing section
 * @param options - Configuration options for AI context generation
 * @param getCoverageThreshold - Function to get coverage threshold
 * @returns Formatted markdown string with testing approach
 */
export function buildClaudeTestingSection(
  options: AIContextConfigOptions,
  getCoverageThreshold: (qualityLevel: string) => number
): string {
  return `### Testing Approach
- Generate comprehensive test suites using Vitest
- Include both unit and integration tests
- Mock external dependencies appropriately
- Use descriptive test names and clear assertions
- Aim for ${getCoverageThreshold(options.qualityLevel)}% code coverage`;
}

/**
 * Build Claude quality standards section
 * @returns Formatted markdown string with quality standards
 */
export function buildClaudeQualityStandardsSection(): string {
  return `### Quality Standards
- Never disable ESLint rules
- Never use \`any\` type - use proper TypeScript types
- Always handle errors gracefully
- Include meaningful comments for complex logic
- Follow the project's architectural patterns`;
}

/**
 * Build Claude project-specific section
 * @param options - Configuration options for AI context generation
 * @param getClaudeSpecificGuidelines - Function to get Claude-specific guidelines
 * @returns Formatted markdown string with project-specific guidelines
 */
export function buildClaudeProjectSpecificSection(
  options: AIContextConfigOptions,
  getClaudeSpecificGuidelines: (projectType: string) => string
): string {
  return `### Project-Specific Guidelines
${getClaudeSpecificGuidelines(options.projectType)}`;
}

/**
 * Build Claude interaction patterns section
 * @returns Formatted markdown string with interaction patterns
 */
export function buildClaudeInteractionPatternsSection(): string {
  return `### Interaction Patterns
- Ask clarifying questions before implementing complex features
- Provide explanations for significant code changes
- Suggest improvements and optimizations when appropriate
- Follow Test-Driven Development when adding new features
- Ensure all generated code compiles without errors`;
}
