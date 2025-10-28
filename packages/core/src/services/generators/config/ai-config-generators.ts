/**
 * AI Configuration File Generators
 */

import type { ProjectConfig } from '../../../types/project-config.js';

/**
 * Generates AI assistant configuration content
 */
export class AIConfigGenerators {
  /**
   * Generate Claude configuration
   * @param config - Project configuration
   * @returns Claude configuration content
   */
  static generateClaudeConfig(config: ProjectConfig): string {
    const projectInfo = this.getProjectInfo(config);
    const guidelines = this.getDevelopmentGuidelines();
    const structure = this.getProjectStructure();
    const commands = this.getCommands();
    const instructions = this.getAIInstructions();

    return `# Claude Code Configuration for ${config.name}

## AI Assistant
This configuration is for **claude-code** AI assistant.

${projectInfo}

${guidelines}

${structure}

${commands}

${instructions}`;
  }

  /**
   * Generate GitHub Copilot configuration
   * @param config - Project configuration
   * @returns Copilot configuration content
   */
  static generateCopilotConfig(config: ProjectConfig): string {
    const context = this.getProjectContext(config);
    const styleGuidelines = this.getCodeStyleGuidelines();
    const testingRequirements = this.getTestingRequirements();
    const securityConsiderations = this.getSecurityConsiderations();
    const performanceGuidelines = this.getPerformanceGuidelines();

    return `# GitHub Copilot Instructions for ${config.name}

${context}

${styleGuidelines}

${testingRequirements}

${securityConsiderations}

${performanceGuidelines}`;
  }

  /**
   * Generate AI context configuration
   * @param config - Project configuration
   * @returns AI context configuration content
   */
  static generateAIContext(config: ProjectConfig): string {
    const overview = this.getProjectOverview(config);
    const techStack = this.getTechStack(config);
    const projectConfig = this.getProjectConfiguration(config);
    const devStandards = this.getDevelopmentStandards(config);
    const testingStrategy = this.getTestingStrategy();
    const qualityGates = this.getQualityGates(config);
    const changeProcess = this.getChangeProcess();

    return `# AI Context for ${config.name}

${overview}

${techStack}

${projectConfig}

${devStandards}

${testingStrategy}

${qualityGates}

${changeProcess}`;
  }

  /**
   * Generate Cursor rules configuration
   * @param config - Project configuration
   * @returns Cursor rules configuration content
   */
  static generateCursorRules(config: ProjectConfig): string {
    const intro = this.getIntroduction(config);
    const technicalGuidelines = this.getTechnicalGuidelines();
    const qualityStandards = this.getQualityStandards();
    const testingRequirements = this.getCursorTestingRequirements(config);
    const securityPrinciples = this.getSecurityPrinciples();
    const codingProcess = this.getCodingProcess();
    const projectContext = this.getProjectSpecificContext(config);

    return `# Cursor Rules for ${config.name}

${intro}

${technicalGuidelines}

${qualityStandards}

${testingRequirements}

${securityPrinciples}

${codingProcess}

${projectContext}`;
  }

  /**
   * Get project information section
   * @param config - Project configuration
   * @returns Project information content
   */
  private static getProjectInfo(config: ProjectConfig): string {
    return `## Project Information
- **Name**: ${config.name}
- **Type**: ${config.projectType}
- **Quality Level**: ${config.qualityLevel}
- **Template**: ${config.template || 'basic'}`;
  }

  /**
   * Get development guidelines
   * @returns Development guidelines content
   */
  private static getDevelopmentGuidelines(): string {
    return `## Development Guidelines
- All code must be written in English
- Use TypeScript with strict mode enabled
- Follow the existing code style and patterns
- Ensure all tests pass before committing
- Maintain test coverage above 80%
- Run mutation testing with Stryker`;
  }

  /**
   * Get project structure
   * @returns Project structure content
   */
  private static getProjectStructure(): string {
    return `## Project Structure
- \`src/\`: Source code
- \`tests/\`: Test files
- \`docs/\`: Documentation
- \`dist/\`: Build output`;
  }

  /**
   * Get commands section
   * @returns Commands content
   */
  private static getCommands(): string {
    return `## Commands
- \`bun test\`: Run tests
- \`bun run lint\`: Check code quality
- \`bun run typecheck\`: Verify types
- \`bun run build\`: Build the project`;
  }

  /**
   * Get AI instructions
   * @returns AI instructions content
   */
  private static getAIInstructions(): string {
    return `## AI Assistant Instructions
When generating code for this project:
1. Always include TypeScript types
2. Write comprehensive tests
3. Follow the existing patterns and conventions
4. Add proper documentation
5. Consider performance and security`;
  }

  /**
   * Get project context for Copilot
   * @param config - Project configuration
   * @returns Project context content
   */
  private static getProjectContext(config: ProjectConfig): string {
    return `## Project Context
This is a ${config.projectType} project built with Bun and TypeScript.
Quality level: ${config.qualityLevel}`;
  }

  /**
   * Get code style guidelines
   * @returns Code style guidelines content
   */
  private static getCodeStyleGuidelines(): string {
    return `## Code Style Guidelines
- Use TypeScript strict mode
- Follow ESLint and Prettier configurations
- Write descriptive variable and function names
- Include JSDoc comments for public APIs
- Prefer explicit types over implicit any`;
  }

  /**
   * Get testing requirements
   * @returns Testing requirements content
   */
  private static getTestingRequirements(): string {
    return `## Testing Requirements
- Write tests for all public methods
- Use Vitest for unit testing
- Aim for 80%+ code coverage
- Include edge cases and error scenarios`;
  }

  /**
   * Get security considerations
   * @returns Security considerations content
   */
  private static getSecurityConsiderations(): string {
    return `## Security Considerations
- Validate all inputs from external sources
- Handle errors appropriately
- Avoid exposing sensitive information
- Follow secure coding practices`;
  }

  /**
   * Get performance guidelines
   * @returns Performance guidelines content
   */
  private static getPerformanceGuidelines(): string {
    return `## Performance Guidelines
- Optimize for Bun runtime
- Use async/await for async operations
- Consider memory usage and performance`;
  }

  /**
   * Get project overview
   * @param config - Project configuration
   * @returns Project overview content
   */
  private static getProjectOverview(config: ProjectConfig): string {
    return `## Project Overview
${config.description || 'A modern TypeScript library built with Bun'}`;
  }

  /**
   * Get tech stack information
   * @param config - Project configuration
   * @returns Tech stack content
   */
  private static getTechStack(config: ProjectConfig): string {
    const mutationTesting = config.qualityLevel === 'high' ? ' + Stryker' : '';
    return `## Technical Stack
- Runtime: Bun
- Language: TypeScript (strict mode)
- Testing: Vitest
- Quality: ESLint + Prettier${mutationTesting}`;
  }

  /**
   * Get project configuration details
   * @param config - Project configuration
   * @returns Project configuration content
   */
  private static getProjectConfiguration(config: ProjectConfig): string {
    return `## Project Configuration
- Name: ${config.name}
- Type: ${config.projectType}
- Quality: ${config.qualityLevel}
- Template: ${config.template || 'basic'}`;
  }

  /**
   * Get development standards
   * @param config - Project configuration
   * @returns Development standards content
   */
  private static getDevelopmentStandards(config: ProjectConfig): string {
    const mutationRequirement =
      config.qualityLevel === 'high' ? '\n7. Achieve 80%+ mutation testing score' : '';

    return `## Development Standards
1. Code must be written in English
2. All functions must have explicit return types
3. Use 'const' and 'let', never 'var'
4. Follow functional programming principles where possible
5. Write comprehensive tests with meaningful assertions
6. Maintain code coverage above 80%${mutationRequirement}`;
  }

  /**
   * Get testing strategy
   * @returns Testing strategy content
   */
  private static getTestingStrategy(): string {
    return `## Testing Strategy
- Unit tests for all functions and classes
- Integration tests for complex workflows
- Edge case and error handling tests
- Performance tests for critical paths`;
  }

  /**
   * Get quality gates
   * @param config - Project configuration
   * @returns Quality gates content
   */
  private static getQualityGates(config: ProjectConfig): string {
    const mutationGate = config.qualityLevel === 'high' ? '\n- 80%+ mutation testing score' : '';

    return `## Quality Gates
- TypeScript compilation with no errors
- ESLint with no warnings or errors
- 100% test pass rate
- 80%+ code coverage${mutationGate}`;
  }

  /**
   * Get change process
   * @returns Change process content
   */
  private static getChangeProcess(): string {
    return `## When Making Changes
1. Understand the existing codebase structure
2. Follow established patterns and conventions
3. Write tests before implementing features
4. Verify all quality gates pass
5. Update documentation as needed`;
  }

  /**
   * Get introduction for Cursor rules
   * @param config - Project configuration
   * @returns Introduction content
   */
  private static getIntroduction(config: ProjectConfig): string {
    return `You are an expert TypeScript developer working on a ${config.projectType} project.`;
  }

  /**
   * Get technical guidelines for Cursor
   * @returns Technical guidelines content
   */
  private static getTechnicalGuidelines(): string {
    return `## Technical Guidelines
- Use Bun as the runtime environment
- Write TypeScript in strict mode
- Follow ESLint rules without exceptions
- Format code with Prettier
- Write comprehensive tests with Vitest`;
  }

  /**
   * Get quality standards for Cursor
   * @returns Quality standards content
   */
  private static getQualityStandards(): string {
    return `## Code Quality Standards
- No 'any' types - use explicit TypeScript types
- No non-null assertions (!) - use proper type guards
- No disabled ESLint rules - fix the underlying issues
- Functions must be ≤30 lines and ≤10 complexity
- Files must be ≤300 lines`;
  }

  /**
   * Get testing requirements for Cursor
   * @param config - Project configuration
   * @returns Testing requirements content
   */
  private static getCursorTestingRequirements(config: ProjectConfig): string {
    const mutationRequirement =
      config.qualityLevel === 'high' ? '\n- Achieve 80%+ mutation testing score' : '';

    return `## Testing Requirements
- Test all public methods and edge cases
- Use descriptive test names with Given-When-Then structure
- Verify behavior, not just execution
- Achieve 80%+ code coverage${mutationRequirement}`;
  }

  /**
   * Get security principles
   * @returns Security principles content
   */
  private static getSecurityPrinciples(): string {
    return `## Security Principles
- Validate all inputs from external sources
- Handle errors gracefully without exposing sensitive information
- Use parameterized queries for database operations
- Escape outputs to prevent XSS attacks`;
  }

  /**
   * Get coding process
   * @returns Coding process content
   */
  private static getCodingProcess(): string {
    return `## When Writing Code
1. Understand the requirements and existing codebase
2. Plan the implementation before coding
3. Write tests first (TDD approach preferred)
4. Implement the solution incrementally
5. Refactor for clarity and maintainability
6. Verify all quality gates pass`;
  }

  /**
   * Get project-specific context
   * @param config - Project configuration
   * @returns Project-specific context content
   */
  private static getProjectSpecificContext(config: ProjectConfig): string {
    return `## Project-Specific Context
This is a ${config.name} project with ${config.qualityLevel} quality standards.
${config.description || 'Focus on clean, maintainable code.'}`;
  }
}
