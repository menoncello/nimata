/**
 * Unit tests for CLAUDE.md Generator
 */

import { describe, it, expect, beforeEach } from 'bun:test';
import { ClaudeMdGenerator, createClaudeMdGenerator } from '../src/generators/claude-md-generator';

// Inline type to avoid import issues
interface ProjectConfig {
  name: string;
  description?: string;
  qualityLevel: 'light' | 'medium' | 'strict';
  projectType: 'basic' | 'web' | 'cli' | 'library';
  aiAssistants: Array<'claude-code' | 'copilot'>;
}

describe('ClaudeMdGenerator', () => {
  let generator: ClaudeMdGenerator;

  beforeEach(() => {
    generator = createClaudeMdGenerator();
  });

  describe('generate', () => {
    it('should generate configurations for basic project with medium quality', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        description: 'Test project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);

      expect(results).toHaveLength(2); // main, ai-context
      expect(results[0].filename).toBe('CLAUDE.md');
      expect(results[1].filename).toBe('.claude/ai-context.md');
    });

    it('should generate only main config when Claude Code not enabled', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['copilot'],
      };

      const results = generator.generate(config);

      expect(results).toHaveLength(1);
      expect(results[0].filename).toBe('CLAUDE.md');
    });

    it('should include project description in main config', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        description: 'A test project for demonstration',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);
      const mainConfig = results[0];

      expect(mainConfig.content).toContain('> A test project for demonstration');
    });

    it('should handle missing project description', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);
      const mainConfig = results[0];

      expect(mainConfig.content).toContain('# test-project');
      expect(mainConfig.content).not.toContain('>');
    });
  });

  describe('main configuration content', () => {
    it('should include project metadata', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        description: 'Test project',
        qualityLevel: 'medium',
        projectType: 'web',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);
      const mainConfig = results[0];

      expect(mainConfig.content).toContain('# test-project');
      expect(mainConfig.content).toContain('**Project Type**: Web Application');
      expect(mainConfig.content).toContain('**Environment**: Browser');
      expect(mainConfig.content).toContain('**Quality Level**: medium');
    });

    it('should include language requirements section', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);
      const mainConfig = results[0];

      expect(mainConfig.content).toContain('## Language Requirements');
      expect(mainConfig.content).toContain(
        'All code, code comments, and technical documentation MUST be written in **English**'
      );
      expect(mainConfig.content).toContain('**Code**: English only');
      expect(mainConfig.content).toContain('**Code comments**: English only');
    });

    it('should include ESLint rules section', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);
      const mainConfig = results[0];

      expect(mainConfig.content).toContain('### ESLint Rules');
      expect(mainConfig.content).toContain(
        '**CRITICAL RULE**: NEVER disable ESLint rules via inline comments'
      );
      expect(mainConfig.content).toContain('❌ **NEVER USE** `// eslint-disable-next-line`');
      expect(mainConfig.content).toContain('✅ **ALWAYS FIX** the underlying code issue');
    });

    it('should include mutation testing section', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);
      const mainConfig = results[0];

      expect(mainConfig.content).toContain('### Mutation Testing Thresholds');
      expect(mainConfig.content).toContain(
        '**CRITICAL RULE**: NEVER reduce mutation testing thresholds'
      );
      expect(mainConfig.content).toContain('✅ **ADD MORE TESTS** to kill surviving mutants');
      expect(mainConfig.content).toContain('❌ **NEVER LOWER THRESHOLDS** as a shortcut');
    });

    it('should include code style requirements', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);
      const mainConfig = results[0];

      expect(mainConfig.content).toContain('### Code Style Requirements');
      expect(mainConfig.content).toContain('- **Indentation**: 2 spaces (no tabs)');
      expect(mainConfig.content).toContain('- **Semicolons**: Required');
      expect(mainConfig.content).toContain('- **Quotes**: Single quotes preferred');
      expect(mainConfig.content).toContain('- **Trailing commas**: es5');
    });

    it('should include testing requirements', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);
      const mainConfig = results[0];

      expect(mainConfig.content).toContain('### Testing Requirements');
      expect(mainConfig.content).toContain('- **Framework**: Vitest with TypeScript support');
      expect(mainConfig.content).toContain('- **Coverage**: Minimum 90% required for all tests');
      expect(mainConfig.content).toContain('- **Test files**: Use `.test.ts` or `.spec.ts` suffix');
    });
  });

  describe('quality level differences', () => {
    it('should use light quality settings', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'light',
        projectType: 'basic',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);
      const mainConfig = results[0];

      expect(mainConfig.content).toContain('**Quality Level**: light');
      expect(mainConfig.content).toContain('- **Trailing commas**: none');
      expect(mainConfig.content).toContain('- **Line length**: Maximum 120 characters');
      expect(mainConfig.content).toContain('- **Coverage**: Minimum 70% required for all tests');
    });

    it('should use medium quality settings', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);
      const mainConfig = results[0];

      expect(mainConfig.content).toContain('**Quality Level**: medium');
      expect(mainConfig.content).toContain('- **Trailing commas**: es5');
      expect(mainConfig.content).toContain('- **Line length**: Maximum 100 characters');
      expect(mainConfig.content).toContain('- **Coverage**: Minimum 90% required for all tests');
    });

    it('should use strict quality settings', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'strict',
        projectType: 'basic',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);
      const mainConfig = results[0];

      expect(mainConfig.content).toContain('**Quality Level**: strict');
      expect(mainConfig.content).toContain('- **Trailing commas**: all');
      expect(mainConfig.content).toContain('- **Line length**: Maximum 80 characters');
      expect(mainConfig.content).toContain('- **Coverage**: Minimum 95% required for all tests');
    });
  });

  describe('project type specific configurations', () => {
    it('should include CLI project architecture', () => {
      const config: ProjectConfig = {
        name: 'cli-project',
        qualityLevel: 'medium',
        projectType: 'cli',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);
      const mainConfig = results[0];

      expect(mainConfig.content).toContain('**Project Type**: CLI Application');
      expect(mainConfig.content).toContain('**Environment**: Node.js');
      expect(mainConfig.content).toContain('- **src/commands/**: CLI command implementations');
      expect(mainConfig.content).toContain('- **src/utils/**: Utility functions and helpers');
    });

    it('should include web project architecture', () => {
      const config: ProjectConfig = {
        name: 'web-project',
        qualityLevel: 'medium',
        projectType: 'web',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);
      const mainConfig = results[0];

      expect(mainConfig.content).toContain('**Project Type**: Web Application');
      expect(mainConfig.content).toContain('**Environment**: Browser');
      expect(mainConfig.content).toContain('- **src/components/**: Reusable UI components');
      expect(mainConfig.content).toContain('- **src/pages/**: Page-level components');
    });

    it('should include library project architecture', () => {
      const config: ProjectConfig = {
        name: 'lib-project',
        qualityLevel: 'medium',
        projectType: 'library',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);
      const mainConfig = results[0];

      expect(mainConfig.content).toContain('**Project Type**: Library Package');
      expect(mainConfig.content).toContain('**Environment**: Universal (Node.js + Browser)');
      expect(mainConfig.content).toContain('- **src/**: Library source code');
      expect(mainConfig.content).toContain('- **types/**: TypeScript type definitions');
    });

    it('should include appropriate dev commands', () => {
      const config: ProjectConfig = {
        name: 'web-project',
        qualityLevel: 'medium',
        projectType: 'web',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);
      const mainConfig = results[0];

      expect(mainConfig.content).toContain('1. Install dependencies: `bun install`');
      expect(mainConfig.content).toContain('2. Run development server: `bun run dev`');
      expect(mainConfig.content).toContain('3. Run tests: `bun test`');
    });
  });

  describe('AI context configuration', () => {
    it('should generate AI context file when Claude Code is enabled', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);
      const aiContextConfig = results.find((r) => r.filename === '.claude/ai-context.md');

      expect(aiContextConfig).toBeDefined();
      expect(aiContextConfig?.content).toContain('# AI Context for test-project');
      expect(aiContextConfig?.content).toContain('**Name**: test-project');
      expect(aiContextConfig?.content).toContain('**Type**: Basic TypeScript Project');
    });

    it('should include key dependencies in AI context', () => {
      const config: ProjectConfig = {
        name: 'web-project',
        qualityLevel: 'medium',
        projectType: 'web',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);
      const aiContextConfig = results.find((r) => r.filename === '.claude/ai-context.md');

      expect(aiContextConfig?.content).toContain('## Key Dependencies');
      expect(aiContextConfig?.content).toContain('- Express.js for web server');
      expect(aiContextConfig?.content).toContain('- TypeScript');
    });

    it('should include code patterns in AI context', () => {
      const config: ProjectConfig = {
        name: 'cli-project',
        qualityLevel: 'medium',
        projectType: 'cli',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);
      const aiContextConfig = results.find((r) => r.filename === '.claude/ai-context.md');

      expect(aiContextConfig?.content).toContain('## Code Patterns');
      expect(aiContextConfig?.content).toContain('- Use command pattern for CLI operations');
      expect(aiContextConfig?.content).toContain(
        '- Implement proper error handling with user-friendly messages'
      );
    });

    it('should include testing strategy in AI context', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'strict',
        projectType: 'basic',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);
      const aiContextConfig = results.find((r) => r.filename === '.claude/ai-context.md');

      expect(aiContextConfig?.content).toContain('## Testing Strategy');
      expect(aiContextConfig?.content).toContain('- Achieve 95% test coverage');
      expect(aiContextConfig?.content).toContain('- Use Vitest as the primary testing framework');
    });
  });

  describe('createClaudeMdGenerator factory', () => {
    it('should create a new ClaudeMdGenerator instance', () => {
      const generator = createClaudeMdGenerator();

      expect(generator).toBeInstanceOf(ClaudeMdGenerator);
    });

    it('should create working generator', () => {
      const generator = createClaudeMdGenerator();
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);
      expect(results.length).toBeGreaterThan(0);
    });
  });

  describe('configuration validation', () => {
    it('should include proper markdown formatting', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);
      const mainConfig = results[0];

      expect(mainConfig.content).toContain('# test-project');
      expect(mainConfig.content).toContain('## ');
      expect(mainConfig.content).toContain('### ');
      expect(mainConfig.content).toContain('**');
      expect(mainConfig.content).toContain('- ');
    });

    it('should include generation timestamp', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);
      const mainConfig = results[0];

      const today = new Date().toISOString().split('T')[0];
      expect(mainConfig.content).toContain(`**Generated**: ${today}`);
    });

    it('should include proper footer', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);
      const mainConfig = results[0];

      expect(mainConfig.content).toContain(
        '*This CLAUDE.md file was automatically generated by Nìmata CLI.'
      );
      expect(mainConfig.content).toContain(
        'Modify with care, as changes may be overwritten during regeneration.*'
      );
    });
  });
});
