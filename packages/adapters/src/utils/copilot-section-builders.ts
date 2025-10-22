/**
 * Copilot Context Section Builders
 *
 * Utility functions for building Copilot-specific AI context sections
 */

import { AIContextConfigOptions } from '../types/config-types.js';

/**
 * Build Copilot instructions section
 * @returns Formatted markdown string with Copilot instructions
 */
export function buildCopilotInstructionsSection(): string {
  return `## Copilot-Specific Instructions`;
}

/**
 * Build Copilot code style section
 * @returns Formatted markdown string with code style preferences
 */
export function buildCopilotCodeStyleSection(): string {
  return `### Code Style Preferences
- Follow the project's established formatting rules
- Use TypeScript interfaces for data structures
- Implement proper error handling patterns
- Use descriptive variable and function names
- Include comments for business logic`;
}

/**
 * Build Copilot framework section
 * @param options - Configuration options for AI context generation
 * @param getCopilotFrameworkGuidelines - Function to get framework guidelines
 * @returns Formatted markdown string with framework guidelines
 */
export function buildCopilotFrameworkSection(
  options: AIContextConfigOptions,
  getCopilotFrameworkGuidelines: (frameworks: string[], projectType: string) => string
): string {
  return `### Framework Usage
${getCopilotFrameworkGuidelines(options.frameworks, options.projectType)}`;
}

/**
 * Build Copilot testing section
 * @returns Formatted markdown string with testing patterns
 */
export function buildCopilotTestingSection(): string {
  return `### Testing Patterns
- Use Vitest with describe/it/test structure
- Include setup and teardown with beforeEach/afterEach
- Mock external dependencies using vi.mock
- Write tests first when possible (TDD approach)
- Include edge cases and error scenarios`;
}

/**
 * Build Copilot architecture section
 * @param options - Configuration options for AI context generation
 * @param getCopilotArchitectureGuidelines - Function to get architecture guidelines
 * @returns Formatted markdown string with architecture guidelines
 */
export function buildCopilotArchitectureSection(
  options: AIContextConfigOptions,
  getCopilotArchitectureGuidelines: (projectType: string) => string
): string {
  return `### Architecture Guidelines
${getCopilotArchitectureGuidelines(options.projectType)}`;
}

/**
 * Build Copilot code generation section
 * @returns Formatted markdown string with code generation guidelines
 */
export function buildCopilotCodeGenerationSection(): string {
  return `### Code Generation Guidelines
- Generate modular, reusable code
- Follow single responsibility principle
- Use dependency injection patterns
- Implement proper separation of concerns
- Include type annotations for all functions`;
}

/**
 * Build Copilot security section
 * @returns Formatted markdown string with security considerations
 */
export function buildCopilotSecuritySection(): string {
  return `### Security Considerations
- Never generate code with hardcoded secrets
- Validate all user inputs
- Use secure coding practices
- Follow OWASP guidelines for web applications
- Implement proper authentication and authorization`;
}

/**
 * Build Copilot performance section
 * @returns Formatted markdown string with performance guidelines
 */
export function buildCopilotPerformanceSection(): string {
  return `### Performance Guidelines
- Write efficient, optimized code
- Avoid unnecessary computations
- Use appropriate data structures
- Consider memory management
- Implement caching when beneficial`;
}

/**
 * Build Copilot documentation section
 * @returns Formatted markdown string with documentation standards
 */
export function buildCopilotDocumentationSection(): string {
  return `### Documentation Standards
- Include JSDoc comments for public APIs
- Add inline comments for complex logic
- Maintain clear and concise commit messages
- Update documentation for API changes`;
}
