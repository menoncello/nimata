/**
 * AI Configuration Generators Tests
 *
 * Comprehensive tests for AI assistant configuration generation functionality
 */

import { describe, it, expect, beforeEach } from 'bun:test';
import type { ProjectConfig } from '../../../types/project-config.js';
import { AIConfigGenerators } from '../config/ai-config-generators.js';

describe('AIConfigGenerators', () => {
  describe('generateClaudeConfig', () => {
    it('should generate Claude configuration with all sections', () => {
      // Given
      const config: ProjectConfig = {
        name: 'test-project',
        description: 'Test project for Claude',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['claude-code'],
      };

      // When
      const result = AIConfigGenerators.generateClaudeConfig(config);

      // Then
      expect(result).toContain('# Claude Code Configuration for test-project');
      expect(result).toContain('## AI Assistant');
      expect(result).toContain('claude-code');
      expect(result).toContain('## Project Information');
      expect(result).toContain('## Development Guidelines');
      expect(result).toContain('## Project Structure');
      expect(result).toContain('## Commands');
      expect(result).toContain('## AI Assistant Instructions');
    });

    it('should include project information correctly', () => {
      // Given
      const config: ProjectConfig = {
        name: 'my-awesome-project',
        qualityLevel: 'high',
        projectType: 'web',
        aiAssistants: ['claude-code'],
        template: 'react-template',
      };

      // When
      const result = AIConfigGenerators.generateClaudeConfig(config);

      // Then
      expect(result).toContain('- **Name**: my-awesome-project');
      expect(result).toContain('- **Type**: web');
      expect(result).toContain('- **Quality Level**: high');
      expect(result).toContain('- **Template**: react-template');
    });

    it('should use default template when not specified', () => {
      // Given
      const config: ProjectConfig = {
        name: 'no-template-project',
        qualityLevel: 'medium',
        projectType: 'cli',
        aiAssistants: ['claude-code'],
      };

      // When
      const result = AIConfigGenerators.generateClaudeConfig(config);

      // Then
      expect(result).toContain('- **Template**: basic');
    });

    it('should include development guidelines', () => {
      // Given
      const config: ProjectConfig = {
        name: 'guidelines-project',
        qualityLevel: 'strict',
        projectType: 'library',
        aiAssistants: ['claude-code'],
      };

      // When
      const result = AIConfigGenerators.generateClaudeConfig(config);

      // Then
      expect(result).toContain('All code must be written in English');
      expect(result).toContain('Use TypeScript with strict mode enabled');
      expect(result).toContain('Maintain test coverage above 80%');
      expect(result).toContain('Run mutation testing with Stryker');
    });

    it('should include project structure information', () => {
      // Given
      const config: ProjectConfig = {
        name: 'structure-project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['claude-code'],
      };

      // When
      const result = AIConfigGenerators.generateClaudeConfig(config);

      // Then
      expect(result).toContain('- `src/`: Source code');
      expect(result).toContain('- `tests/`: Test files');
      expect(result).toContain('- `docs/`: Documentation');
      expect(result).toContain('- `dist/`: Build output');
    });

    it('should include commands section', () => {
      // Given
      const config: ProjectConfig = {
        name: 'commands-project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['claude-code'],
      };

      // When
      const result = AIConfigGenerators.generateClaudeConfig(config);

      // Then
      expect(result).toContain('- `bun test`: Run tests');
      expect(result).toContain('- `bun run lint`: Check code quality');
      expect(result).toContain('- `bun run typecheck`: Verify types');
      expect(result).toContain('- `bun run build`: Build the project');
    });

    it('should include AI instructions', () => {
      // Given
      const config: ProjectConfig = {
        name: 'instructions-project',
        qualityLevel: 'high',
        projectType: 'web',
        aiAssistants: ['claude-code'],
      };

      // When
      const result = AIConfigGenerators.generateClaudeConfig(config);

      // Then
      expect(result).toContain('When generating code for this project:');
      expect(result).toContain('1. Always include TypeScript types');
      expect(result).toContain('2. Write comprehensive tests');
      expect(result).toContain('3. Follow the existing patterns and conventions');
      expect(result).toContain('4. Add proper documentation');
      expect(result).toContain('5. Consider performance and security');
    });

    it('should handle special characters in project name', () => {
      // Given
      const config: ProjectConfig = {
        name: 'project-with-special-chars_@#$',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['claude-code'],
      };

      // When
      const result = AIConfigGenerators.generateClaudeConfig(config);

      // Then
      expect(result).toContain('# Claude Code Configuration for project-with-special-chars_@#$');
      expect(result).toContain('- **Name**: project-with-special-chars_@#$');
    });
  });

  describe('generateCopilotConfig', () => {
    it('should generate Copilot configuration with all sections', () => {
      // Given
      const config: ProjectConfig = {
        name: 'copilot-project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['github-copilot'],
      };

      // When
      const result = AIConfigGenerators.generateCopilotConfig(config);

      // Then
      expect(result).toContain('# GitHub Copilot Instructions for copilot-project');
      expect(result).toContain('## Project Context');
      expect(result).toContain('## Code Style Guidelines');
      expect(result).toContain('## Testing Requirements');
      expect(result).toContain('## Security Considerations');
      expect(result).toContain('## Performance Guidelines');
    });

    it('should include project context with correct details', () => {
      // Given
      const config: ProjectConfig = {
        name: 'context-project',
        qualityLevel: 'high',
        projectType: 'web',
        aiAssistants: ['github-copilot'],
      };

      // When
      const result = AIConfigGenerators.generateCopilotConfig(config);

      // Then
      expect(result).toContain('This is a web project built with Bun and TypeScript.');
      expect(result).toContain('Quality level: high');
    });

    it('should include code style guidelines', () => {
      // Given
      const config: ProjectConfig = {
        name: 'style-project',
        qualityLevel: 'strict',
        projectType: 'library',
        aiAssistants: ['github-copilot'],
      };

      // When
      const result = AIConfigGenerators.generateCopilotConfig(config);

      // Then
      expect(result).toContain('Use TypeScript strict mode');
      expect(result).toContain('Follow ESLint and Prettier configurations');
      expect(result).toContain('Write descriptive variable and function names');
      expect(result).toContain('Include JSDoc comments for public APIs');
      expect(result).toContain('Prefer explicit types over implicit any');
    });

    it('should include testing requirements', () => {
      // Given
      const config: ProjectConfig = {
        name: 'testing-project',
        qualityLevel: 'medium',
        projectType: 'cli',
        aiAssistants: ['github-copilot'],
      };

      // When
      const result = AIConfigGenerators.generateCopilotConfig(config);

      // Then
      expect(result).toContain('Write tests for all public methods');
      expect(result).toContain('Use Vitest for unit testing');
      expect(result).toContain('Aim for 80%+ code coverage');
      expect(result).toContain('Include edge cases and error scenarios');
    });

    it('should include security considerations', () => {
      // Given
      const config: ProjectConfig = {
        name: 'secure-project',
        qualityLevel: 'high',
        projectType: 'web',
        aiAssistants: ['github-copilot'],
      };

      // When
      const result = AIConfigGenerators.generateCopilotConfig(config);

      // Then
      expect(result).toContain('Validate all inputs from external sources');
      expect(result).toContain('Handle errors appropriately');
      expect(result).toContain('Avoid exposing sensitive information');
      expect(result).toContain('Follow secure coding practices');
    });

    it('should include performance guidelines', () => {
      // Given
      const config: ProjectConfig = {
        name: 'performance-project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['github-copilot'],
      };

      // When
      const result = AIConfigGenerators.generateCopilotConfig(config);

      // Then
      expect(result).toContain('Optimize for Bun runtime');
      expect(result).toContain('Use async/await for async operations');
      expect(result).toContain('Consider memory usage and performance');
    });
  });

  describe('generateAIContext', () => {
    it('should generate AI context with all sections', () => {
      // Given
      const config: ProjectConfig = {
        name: 'ai-context-project',
        description: 'A comprehensive AI context test project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['ai-context'],
      };

      // When
      const result = AIConfigGenerators.generateAIContext(config);

      // Then
      expect(result).toContain('# AI Context for ai-context-project');
      expect(result).toContain('## Project Overview');
      expect(result).toContain('## Technical Stack');
      expect(result).toContain('## Project Configuration');
      expect(result).toContain('## Development Standards');
      expect(result).toContain('## Testing Strategy');
      expect(result).toContain('## Quality Gates');
      expect(result).toContain('## When Making Changes');
    });

    it('should include project overview with description', () => {
      // Given
      const config: ProjectConfig = {
        name: 'overview-project',
        description: 'A detailed project description for testing',
        qualityLevel: 'high',
        projectType: 'web',
        aiAssistants: ['ai-context'],
      };

      // When
      const result = AIConfigGenerators.generateAIContext(config);

      // Then
      expect(result).toContain('## Project Overview');
      expect(result).toContain('A detailed project description for testing');
    });

    it('should use default overview when description is missing', () => {
      // Given
      const config: ProjectConfig = {
        name: 'no-desc-project',
        qualityLevel: 'medium',
        projectType: 'cli',
        aiAssistants: ['ai-context'],
      };

      // When
      const result = AIConfigGenerators.generateAIContext(config);

      // Then
      expect(result).toContain('## Project Overview');
      expect(result).toContain('A modern TypeScript library built with Bun');
    });

    it('should include technical stack with mutation testing for high quality', () => {
      // Given
      const config: ProjectConfig = {
        name: 'tech-stack-project',
        qualityLevel: 'high',
        projectType: 'library',
        aiAssistants: ['ai-context'],
      };

      // When
      const result = AIConfigGenerators.generateAIContext(config);

      // Then
      expect(result).toContain('## Technical Stack');
      expect(result).toContain('Runtime: Bun');
      expect(result).toContain('Language: TypeScript (strict mode)');
      expect(result).toContain('Testing: Vitest');
      expect(result).toContain('Quality: ESLint + Prettier + Stryker');
    });

    it('should include technical stack without mutation testing for lower quality', () => {
      // Given
      const config: ProjectConfig = {
        name: 'low-quality-project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['ai-context'],
      };

      // When
      const result = AIConfigGenerators.generateAIContext(config);

      // Then
      expect(result).toContain('Quality: ESLint + Prettier');
      expect(result).not.toContain('+ Stryker');
    });

    it('should include development standards with mutation requirements for high quality', () => {
      // Given
      const config: ProjectConfig = {
        name: 'high-standards-project',
        qualityLevel: 'high',
        projectType: 'web',
        aiAssistants: ['ai-context'],
      };

      // When
      const result = AIConfigGenerators.generateAIContext(config);

      // Then
      expect(result).toContain('## Development Standards');
      expect(result).toContain('7. Achieve 80%+ mutation testing score');
      expect(result).toContain('Maintain code coverage above 80%');
    });

    it('should include development standards without mutation requirements for lower quality', () => {
      // Given
      const config: ProjectConfig = {
        name: 'medium-standards-project',
        qualityLevel: 'medium',
        projectType: 'cli',
        aiAssistants: ['ai-context'],
      };

      // When
      const result = AIConfigGenerators.generateAIContext(config);

      // Then
      expect(result).toContain('6. Maintain code coverage above 80%');
      expect(result).not.toContain('7. Achieve 80%+ mutation testing score');
    });

    it('should include quality gates with mutation testing for high quality', () => {
      // Given
      const config: ProjectConfig = {
        name: 'quality-gates-project',
        qualityLevel: 'high',
        projectType: 'library',
        aiAssistants: ['ai-context'],
      };

      // When
      const result = AIConfigGenerators.generateAIContext(config);

      // Then
      expect(result).toContain('## Quality Gates');
      expect(result).toContain('80%+ mutation testing score');
      expect(result).toContain('80%+ code coverage');
    });

    it('should include quality gates without mutation testing for lower quality', () => {
      // Given
      const config: ProjectConfig = {
        name: 'basic-gates-project',
        qualityLevel: 'light',
        projectType: 'basic',
        aiAssistants: ['ai-context'],
      };

      // When
      const result = AIConfigGenerators.generateAIContext(config);

      // Then
      expect(result).toContain('80%+ code coverage');
      expect(result).not.toContain('mutation testing score');
    });

    it('should include testing strategy', () => {
      // Given
      const config: ProjectConfig = {
        name: 'testing-strategy-project',
        qualityLevel: 'strict',
        projectType: 'web',
        aiAssistants: ['ai-context'],
      };

      // When
      const result = AIConfigGenerators.generateAIContext(config);

      // Then
      expect(result).toContain('## Testing Strategy');
      expect(result).toContain('Unit tests for all functions and classes');
      expect(result).toContain('Integration tests for complex workflows');
      expect(result).toContain('Edge case and error handling tests');
      expect(result).toContain('Performance tests for critical paths');
    });

    it('should include change process', () => {
      // Given
      const config: ProjectConfig = {
        name: 'change-process-project',
        qualityLevel: 'medium',
        projectType: 'cli',
        aiAssistants: ['ai-context'],
      };

      // When
      const result = AIConfigGenerators.generateAIContext(config);

      // Then
      expect(result).toContain('## When Making Changes');
      expect(result).toContain('1. Understand the existing codebase structure');
      expect(result).toContain('2. Follow established patterns and conventions');
      expect(result).toContain('3. Write tests before implementing features');
      expect(result).toContain('4. Verify all quality gates pass');
      expect(result).toContain('5. Update documentation as needed');
    });
  });

  describe('generateCursorRules', () => {
    it('should generate Cursor rules with all sections', () => {
      // Given
      const config: ProjectConfig = {
        name: 'cursor-project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['cursor'],
      };

      // When
      const result = AIConfigGenerators.generateCursorRules(config);

      // Then
      expect(result).toContain('# Cursor Rules for cursor-project');
      expect(result).toContain('## Technical Guidelines');
      expect(result).toContain('## Code Quality Standards');
      expect(result).toContain('## Testing Requirements');
      expect(result).toContain('## Security Principles');
      expect(result).toContain('## When Writing Code');
      expect(result).toContain('## Project-Specific Context');
    });

    it('should include introduction with project type', () => {
      // Given
      const config: ProjectConfig = {
        name: 'intro-project',
        qualityLevel: 'high',
        projectType: 'web',
        aiAssistants: ['cursor'],
      };

      // When
      const result = AIConfigGenerators.generateCursorRules(config);

      // Then
      expect(result).toContain('You are an expert TypeScript developer working on a web project.');
    });

    it('should include technical guidelines', () => {
      // Given
      const config: ProjectConfig = {
        name: 'tech-guidelines-project',
        qualityLevel: 'strict',
        projectType: 'library',
        aiAssistants: ['cursor'],
      };

      // When
      const result = AIConfigGenerators.generateCursorRules(config);

      // Then
      expect(result).toContain('## Technical Guidelines');
      expect(result).toContain('Use Bun as the runtime environment');
      expect(result).toContain('Write TypeScript in strict mode');
      expect(result).toContain('Follow ESLint rules without exceptions');
      expect(result).toContain('Format code with Prettier');
      expect(result).toContain('Write comprehensive tests with Vitest');
    });

    it('should include quality standards', () => {
      // Given
      const config: ProjectConfig = {
        name: 'quality-standards-project',
        qualityLevel: 'high',
        projectType: 'cli',
        aiAssistants: ['cursor'],
      };

      // When
      const result = AIConfigGenerators.generateCursorRules(config);

      // Then
      expect(result).toContain('## Code Quality Standards');
      expect(result).toContain("No 'any' types - use explicit TypeScript types");
      expect(result).toContain('No non-null assertions (!) - use proper type guards');
      expect(result).toContain('No disabled ESLint rules - fix the underlying issues');
      expect(result).toContain('Functions must be ≤30 lines and ≤10 complexity');
      expect(result).toContain('Files must be ≤300 lines');
    });

    it('should include testing requirements with mutation testing for high quality', () => {
      // Given
      const config: ProjectConfig = {
        name: 'cursor-testing-project',
        qualityLevel: 'high',
        projectType: 'library',
        aiAssistants: ['cursor'],
      };

      // When
      const result = AIConfigGenerators.generateCursorRules(config);

      // Then
      expect(result).toContain('## Testing Requirements');
      expect(result).toContain('Test all public methods and edge cases');
      expect(result).toContain('Use descriptive test names with Given-When-Then structure');
      expect(result).toContain('Verify behavior, not just execution');
      expect(result).toContain('Achieve 80%+ code coverage');
      expect(result).toContain('Achieve 80%+ mutation testing score');
    });

    it('should include testing requirements without mutation testing for lower quality', () => {
      // Given
      const config: ProjectConfig = {
        name: 'basic-testing-project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['cursor'],
      };

      // When
      const result = AIConfigGenerators.generateCursorRules(config);

      // Then
      expect(result).toContain('Achieve 80%+ code coverage');
      expect(result).not.toContain('mutation testing score');
    });

    it('should include security principles', () => {
      // Given
      const config: ProjectConfig = {
        name: 'security-principles-project',
        qualityLevel: 'strict',
        projectType: 'web',
        aiAssistants: ['cursor'],
      };

      // When
      const result = AIConfigGenerators.generateCursorRules(config);

      // Then
      expect(result).toContain('## Security Principles');
      expect(result).toContain('Validate all inputs from external sources');
      expect(result).toContain('Handle errors gracefully without exposing sensitive information');
      expect(result).toContain('Use parameterized queries for database operations');
      expect(result).toContain('Escape outputs to prevent XSS attacks');
    });

    it('should include coding process', () => {
      // Given
      const config: ProjectConfig = {
        name: 'coding-process-project',
        qualityLevel: 'high',
        projectType: 'cli',
        aiAssistants: ['cursor'],
      };

      // When
      const result = AIConfigGenerators.generateCursorRules(config);

      // Then
      expect(result).toContain('## When Writing Code');
      expect(result).toContain('1. Understand the requirements and existing codebase');
      expect(result).toContain('2. Plan the implementation before coding');
      expect(result).toContain('3. Write tests first (TDD approach preferred)');
      expect(result).toContain('4. Implement the solution incrementally');
      expect(result).toContain('5. Refactor for clarity and maintainability');
      expect(result).toContain('6. Verify all quality gates pass');
    });

    it('should include project-specific context', () => {
      // Given
      const config: ProjectConfig = {
        name: 'specific-context-project',
        description: 'A project with specific context requirements',
        qualityLevel: 'strict',
        projectType: 'library',
        aiAssistants: ['cursor'],
      };

      // When
      const result = AIConfigGenerators.generateCursorRules(config);

      // Then
      expect(result).toContain('## Project-Specific Context');
      expect(result).toContain(
        'This is a specific-context-project project with strict quality standards.'
      );
      expect(result).toContain('A project with specific context requirements');
    });

    it('should use default context when description is missing', () => {
      // Given
      const config: ProjectConfig = {
        name: 'no-description-project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['cursor'],
      };

      // When
      const result = AIConfigGenerators.generateCursorRules(config);

      // Then
      expect(result).toContain(
        'This is a no-description-project project with medium quality standards.'
      );
      expect(result).toContain('Focus on clean, maintainable code.');
    });
  });

  describe('cross-AI configuration features', () => {
    it('should handle all project types consistently', () => {
      // Given
      const projectTypes: Array<ProjectConfig['projectType']> = [
        'basic',
        'web',
        'cli',
        'library',
        'bun-react',
        'bun-vue',
        'bun-express',
        'bun-typescript',
      ];

      // When/Then
      for (const projectType of projectTypes) {
        const config: ProjectConfig = {
          name: `test-${projectType}`,
          qualityLevel: 'medium',
          projectType,
          aiAssistants: [],
        };

        // All generators should handle the project type without errors
        expect(() => AIConfigGenerators.generateClaudeConfig(config)).not.toThrow();
        expect(() => AIConfigGenerators.generateCopilotConfig(config)).not.toThrow();
        expect(() => AIConfigGenerators.generateAIContext(config)).not.toThrow();
        expect(() => AIConfigGenerators.generateCursorRules(config)).not.toThrow();
      }
    });

    it('should handle all quality levels with appropriate variation', () => {
      // Given
      const qualityLevels: Array<ProjectConfig['qualityLevel']> = [
        'light',
        'medium',
        'strict',
        'high',
      ];

      for (const qualityLevel of qualityLevels) {
        const config: ProjectConfig = {
          name: `test-${qualityLevel}`,
          qualityLevel,
          projectType: 'basic',
          aiAssistants: [],
        };

        // When
        const claudeConfig = AIConfigGenerators.generateClaudeConfig(config);
        const aiContext = AIConfigGenerators.generateAIContext(config);
        const cursorRules = AIConfigGenerators.generateCursorRules(config);

        // Then
        expect(claudeConfig).toContain(qualityLevel);
        expect(aiContext).toContain(qualityLevel);
        expect(cursorRules).toContain(qualityLevel);

        // High quality should include mutation testing
        if (qualityLevel === 'high') {
          expect(claudeConfig).toContain('Stryker');
          expect(aiContext).toContain('Stryker');
          expect(aiContext).toContain('mutation testing');
          expect(cursorRules).toContain('mutation testing');
        } else {
          expect(claudeConfig).toContain('Stryker'); // Claude always includes Stryker
          expect(aiContext).not.toContain('Stryker');
          expect(aiContext).not.toContain('mutation testing');
          expect(cursorRules).not.toContain('mutation testing');
        }
      }
    });

    it('should handle special characters in project names across all generators', () => {
      // Given
      const specialNames = [
        'project-with-dashes',
        'project_with_underscores',
        'project123',
        'PROJECT-UPPERCASE',
        'project-with-special-chars@#$',
      ];

      for (const name of specialNames) {
        const config: ProjectConfig = {
          name,
          qualityLevel: 'medium',
          projectType: 'basic',
          aiAssistants: [],
        };

        // When/Then
        expect(() => {
          const claudeConfig = AIConfigGenerators.generateClaudeConfig(config);
          const copilotConfig = AIConfigGenerators.generateCopilotConfig(config);
          const aiContext = AIConfigGenerators.generateAIContext(config);
          const cursorRules = AIConfigGenerators.generateCursorRules(config);

          // All should contain the project name
          expect(claudeConfig).toContain(name);
          expect(copilotConfig).toContain(name);
          expect(aiContext).toContain(name);
          expect(cursorRules).toContain(name);
        }).not.toThrow();
      }
    });

    it('should handle missing optional fields gracefully', () => {
      // Given
      const config: ProjectConfig = {
        name: 'minimal-project',
        qualityLevel: 'light',
        projectType: 'basic',
        aiAssistants: [],
        // All optional fields omitted
      };

      // When
      const claudeConfig = AIConfigGenerators.generateClaudeConfig(config);
      const copilotConfig = AIConfigGenerators.generateCopilotConfig(config);
      const aiContext = AIConfigGenerators.generateAIContext(config);
      const cursorRules = AIConfigGenerators.generateCursorRules(config);

      // Then
      expect(claudeConfig).toContain('- **Template**: basic');
      expect(aiContext).toContain('A modern TypeScript library built with Bun');
      expect(cursorRules).toContain('Focus on clean, maintainable code.');
      expect(copilotConfig).toContain('Quality level: light');

      // All should be valid strings
      expect(typeof claudeConfig).toBe('string');
      expect(typeof copilotConfig).toBe('string');
      expect(typeof aiContext).toBe('string');
      expect(typeof cursorRules).toBe('string');
    });

    it('should handle complete config with all fields', () => {
      // Given
      const config: ProjectConfig = {
        name: 'complete-project',
        description: 'A complete project with all fields configured',
        author: 'Test Author',
        license: 'MIT',
        qualityLevel: 'high',
        projectType: 'web',
        aiAssistants: ['claude-code', 'cursor'],
        version: '2.1.0',
        homepage: 'https://example.com',
        repository: 'https://github.com/example/repo',
        bugs: 'https://github.com/example/repo/issues',
        keywords: ['typescript', 'test', 'complete'],
        template: 'advanced-template',
        theme: { primaryColor: '#blue' },
      };

      // When
      const claudeConfig = AIConfigGenerators.generateClaudeConfig(config);
      const copilotConfig = AIConfigGenerators.generateCopilotConfig(config);
      const aiContext = AIConfigGenerators.generateAIContext(config);
      const cursorRules = AIConfigGenerators.generateCursorRules(config);

      // Then
      expect(claudeConfig).toContain('complete-project');
      expect(claudeConfig).toContain('web');
      expect(claudeConfig).toContain('high');
      expect(claudeConfig).toContain('advanced-template');

      expect(copilotConfig).toContain('complete-project');
      expect(copilotConfig).toContain('web project');
      expect(copilotConfig).toContain('high');

      expect(aiContext).toContain('complete-project');
      expect(aiContext).toContain('A complete project with all fields configured');
      expect(aiContext).toContain('Stryker');
      expect(aiContext).toContain('mutation testing');

      expect(cursorRules).toContain('complete-project');
      expect(cursorRules).toContain('web project');
      expect(cursorRules).toContain('mutation testing');
      expect(cursorRules).toContain('A complete project with all fields configured');
    });
  });
});
