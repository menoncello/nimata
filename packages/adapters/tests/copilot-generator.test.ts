/**
 * Unit tests for Copilot Generator
 */

import { describe, it, expect, beforeEach } from 'bun:test';
import { CopilotGenerator, createCopilotGenerator } from '../src/generators/copilot-generator';

// Inline type to avoid import issues
interface ProjectConfig {
  name: string;
  description?: string;
  qualityLevel: 'light' | 'medium' | 'strict';
  projectType: 'basic' | 'web' | 'cli' | 'library';
  aiAssistants: Array<'claude-code' | 'copilot'>;
}

describe('CopilotGenerator', () => {
  let generator: CopilotGenerator;

  beforeEach(() => {
    generator = createCopilotGenerator();
  });

  describe('generate', () => {
    it('should generate instructions and patterns files', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        description: 'Test project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['copilot'],
      };

      const results = generator.generate(config);

      expect(results).toHaveLength(2);
      expect(results[0].filename).toBe('.github/copilot-instructions.md');
      expect(results[1].filename).toBe('.github/copilot-patterns.md');
    });

    it('should include project description in instructions', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        description: 'A test project for Copilot integration',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['copilot'],
      };

      const results = generator.generate(config);
      const instructions = results[0];

      expect(instructions.content).toContain('> A test project for Copilot integration');
    });

    it('should handle missing project description', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['copilot'],
      };

      const results = generator.generate(config);
      const instructions = results[0];

      expect(instructions.content).toContain('# test-project - GitHub Copilot Instructions');
      expect(instructions.content).not.toContain('>');
    });
  });

  describe('main instructions content', () => {
    it('should include project metadata', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        description: 'Test project',
        qualityLevel: 'medium',
        projectType: 'web',
        aiAssistants: ['copilot'],
      };

      const results = generator.generate(config);
      const instructions = results[0];

      expect(instructions.content).toContain('# test-project - GitHub Copilot Instructions');
      expect(instructions.content).toContain('**Project Type**: Web Application');
      expect(instructions.content).toContain('**Environment**: Browser');
      expect(instructions.content).toContain('**Quality Level**: medium');
    });

    it('should include language standards', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['copilot'],
      };

      const results = generator.generate(config);
      const instructions = results[0];

      expect(instructions.content).toContain('### Language Standards');
      expect(instructions.content).toContain(
        '**MUST** write all code, comments, and documentation in **English** only'
      );
      expect(instructions.content).toContain(
        '**MUST** use TypeScript with strict type checking enabled'
      );
      expect(instructions.content).toContain('Files: `kebab-case`');
      expect(instructions.content).toContain('Classes/Types: `PascalCase`');
    });

    it('should include formatting rules', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['copilot'],
      };

      const results = generator.generate(config);
      const instructions = results[0];

      expect(instructions.content).toContain('### Formatting Rules');
      expect(instructions.content).toContain('- **Indentation**: 2 spaces (never tabs)');
      expect(instructions.content).toContain('- **Semicolons**: Always use semicolons');
      expect(instructions.content).toContain('- **Quotes**: Single quotes for strings');
      expect(instructions.content).toContain('- **Trailing commas**: es5');
    });

    it('should include testing requirements', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['copilot'],
      };

      const results = generator.generate(config);
      const instructions = results[0];

      expect(instructions.content).toContain('## Testing Requirements');
      expect(instructions.content).toContain('- **Framework**: Use Vitest with TypeScript support');
      expect(instructions.content).toContain('- **Coverage**: Minimum 85% code coverage required');
      expect(instructions.content).toContain('- **Test Structure**: Use describe/it/test pattern');
    });

    it('should include what to avoid section', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['copilot'],
      };

      const results = generator.generate(config);
      const instructions = results[0];

      expect(instructions.content).toContain('## What to Avoid');
      expect(instructions.content).toContain(
        '- **NEVER** disable ESLint rules with inline comments'
      );
      expect(instructions.content).toContain('- **NEVER** use `any` type in TypeScript');
      expect(instructions.content).toContain('- **ALWAYS** handle errors properly');
    });
  });

  describe('quality level differences', () => {
    it('should use light quality settings', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'light',
        projectType: 'basic',
        aiAssistants: ['copilot'],
      };

      const results = generator.generate(config);
      const instructions = results[0];

      expect(instructions.content).toContain('**Quality Level**: light');
      expect(instructions.content).toContain('- **Trailing commas**: none');
      expect(instructions.content).toContain('- **Line length**: Maximum 120 characters');
      expect(instructions.content).toContain('- **Coverage**: Minimum 70% code coverage required');
      expect(instructions.content).toContain('- Focus on readability and basic functionality');
    });

    it('should use medium quality settings', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['copilot'],
      };

      const results = generator.generate(config);
      const instructions = results[0];

      expect(instructions.content).toContain('**Quality Level**: medium');
      expect(instructions.content).toContain('- **Trailing commas**: es5');
      expect(instructions.content).toContain('- **Line length**: Maximum 100 characters');
      expect(instructions.content).toContain('- **Coverage**: Minimum 85% code coverage required');
      expect(instructions.content).toContain(
        '- Maintain high code readability and maintainability'
      );
    });

    it('should use strict quality settings', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'strict',
        projectType: 'basic',
        aiAssistants: ['copilot'],
      };

      const results = generator.generate(config);
      const instructions = results[0];

      expect(instructions.content).toContain('**Quality Level**: strict');
      expect(instructions.content).toContain('- **Trailing commas**: all');
      expect(instructions.content).toContain('- **Line length**: Maximum 80 characters');
      expect(instructions.content).toContain('- **Coverage**: Minimum 95% code coverage required');
      expect(instructions.content).toContain(
        '- Maximum code quality and maintainability standards'
      );
      expect(instructions.content).toContain('- **NEVER** use console.log in production code');
    });
  });

  describe('project type specific configurations', () => {
    it('should include CLI project guidelines', () => {
      const config: ProjectConfig = {
        name: 'cli-project',
        qualityLevel: 'medium',
        projectType: 'cli',
        aiAssistants: ['copilot'],
      };

      const results = generator.generate(config);
      const instructions = results[0];

      expect(instructions.content).toContain('**Project Type**: CLI Application');
      expect(instructions.content).toContain('**Environment**: Node.js');
      expect(instructions.content).toContain('- Use command pattern for CLI operations');
      expect(instructions.content).toContain(
        '- **Commander.js**: Use command pattern, implement help text'
      );
    });

    it('should include web project guidelines', () => {
      const config: ProjectConfig = {
        name: 'web-project',
        qualityLevel: 'medium',
        projectType: 'web',
        aiAssistants: ['copilot'],
      };

      const results = generator.generate(config);
      const instructions = results[0];

      expect(instructions.content).toContain('**Project Type**: Web Application');
      expect(instructions.content).toContain('**Environment**: Browser');
      expect(instructions.content).toContain('- Use MVC or similar architectural pattern');
      expect(instructions.content).toContain(
        '- **Express.js**: Use middleware for cross-cutting concerns'
      );
    });

    it('should include library project guidelines', () => {
      const config: ProjectConfig = {
        name: 'lib-project',
        qualityLevel: 'medium',
        projectType: 'library',
        aiAssistants: ['copilot'],
      };

      const results = generator.generate(config);
      const instructions = results[0];

      expect(instructions.content).toContain('**Project Type**: Library Package');
      expect(instructions.content).toContain('**Environment**: Universal (Node.js + Browser)');
      expect(instructions.content).toContain(
        '- Design with clear public APIs and minimal surface area'
      );
      expect(instructions.content).toContain('- Use semantic versioning for releases');
    });

    it('should include appropriate security guidelines', () => {
      const config: ProjectConfig = {
        name: 'web-project',
        qualityLevel: 'medium',
        projectType: 'web',
        aiAssistants: ['copilot'],
      };

      const results = generator.generate(config);
      const instructions = results[0];

      expect(instructions.content).toContain('## Security and Performance');
      expect(instructions.content).toContain('- Implement CSRF protection');
      expect(instructions.content).toContain('- Use HTTPS in production');
      expect(instructions.content).toContain('- Set proper security headers');
    });
  });

  describe('patterns file content', () => {
    it('should generate patterns file with code examples', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['copilot'],
      };

      const results = generator.generate(config);
      const patterns = results[1];

      expect(patterns.content).toContain('# Code Patterns and Examples');
      expect(patterns.content).toContain('## Common Patterns');
      expect(patterns.content).toContain('### Testing Pattern');
      expect(patterns.content).toContain('### Error Handling Pattern');
    });

    it('should include CLI-specific patterns', () => {
      const config: ProjectConfig = {
        name: 'cli-project',
        qualityLevel: 'medium',
        projectType: 'cli',
        aiAssistants: ['copilot'],
      };

      const results = generator.generate(config);
      const patterns = results[1];

      expect(patterns.content).toContain('Command pattern example');
      expect(patterns.content).toContain('export class MyCommand');
      expect(patterns.content).toContain('async execute(options: CommandOptions)');
    });

    it('should include web-specific patterns', () => {
      const config: ProjectConfig = {
        name: 'web-project',
        qualityLevel: 'medium',
        projectType: 'web',
        aiAssistants: ['copilot'],
      };

      const results = generator.generate(config);
      const patterns = results[1];

      expect(patterns.content).toContain('Express route example');
      expect(patterns.content).toContain('export const getUserHandler');
      expect(patterns.content).toContain('async (req: Request, res: Response)');
    });

    it('should include testing patterns', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['copilot'],
      };

      const results = generator.generate(config);
      const patterns = results[1];

      expect(patterns.content).toContain(
        "import { describe, it, expect, beforeEach, vi } from 'vitest'"
      );
      expect(patterns.content).toContain("describe('Example functionality', () => {");
      expect(patterns.content).toContain("it('should handle valid input correctly'");
      expect(patterns.content).toContain('// Arrange');
      expect(patterns.content).toContain('// Act');
      expect(patterns.content).toContain('// Assert');
    });

    it('should include error handling patterns', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['copilot'],
      };

      const results = generator.generate(config);
      const patterns = results[1];

      expect(patterns.content).toContain('export class AppError extends Error');
      expect(patterns.content).toContain('export const safeExecute');
      expect(patterns.content).toContain('try {');
      expect(patterns.content).toContain('} catch (error) {');
    });

    it('should include API patterns for web projects', () => {
      const config: ProjectConfig = {
        name: 'web-project',
        qualityLevel: 'medium',
        projectType: 'web',
        aiAssistants: ['copilot'],
      };

      const results = generator.generate(config);
      const patterns = results[1];

      expect(patterns.content).toContain('## API Patterns');
      expect(patterns.content).toContain('interface ApiResponse<T>');
      expect(patterns.content).toContain('export const createSuccessResponse');
      expect(patterns.content).toContain('export const createErrorResponse');
    });

    it('should include configuration patterns', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['copilot'],
      };

      const results = generator.generate(config);
      const patterns = results[1];

      expect(patterns.content).toContain('## Configuration Patterns');
      expect(patterns.content).toContain('interface AppConfig');
      expect(patterns.content).toContain('export const loadConfig');
      expect(patterns.content).toContain('process.env.PORT');
    });
  });

  describe('createCopilotGenerator factory', () => {
    it('should create a new CopilotGenerator instance', () => {
      const generator = createCopilotGenerator();

      expect(generator).toBeInstanceOf(CopilotGenerator);
    });

    it('should create working generator', () => {
      const generator = createCopilotGenerator();
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['copilot'],
      };

      const results = generator.generate(config);
      expect(results).toHaveLength(2);
    });
  });

  describe('configuration validation', () => {
    it('should include proper markdown formatting', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['copilot'],
      };

      const results = generator.generate(config);
      const instructions = results[0];

      expect(instructions.content).toContain('# ');
      expect(instructions.content).toContain('## ');
      expect(instructions.content).toContain('### ');
      expect(instructions.content).toContain('**');
      expect(instructions.content).toContain('- ');
      expect(instructions.content).toContain('`');
    });

    it('should include generation timestamp', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['copilot'],
      };

      const results = generator.generate(config);
      const instructions = results[0];

      const today = new Date().toISOString().split('T')[0];
      expect(instructions.content).toContain(`**Last Updated**: ${today}`);
      expect(instructions.content).toContain(
        `*Instructions generated by Nìmata CLI - Last updated: ${today}*`
      );
    });

    it('should include code blocks in patterns', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['copilot'],
      };

      const results = generator.generate(config);
      const patterns = results[1];

      expect(patterns.content).toContain('```typescript');
      expect(patterns.content).toContain('```');
    });
  });
});
