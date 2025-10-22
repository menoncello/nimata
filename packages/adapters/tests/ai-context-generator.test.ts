/**
 * Unit tests for AI Context Generator
 */

import { describe, it, expect, beforeEach } from 'bun:test';
import {
  AIContextGenerator,
  createAIContextGenerator,
} from '../src/generators/ai-context-generator';

// Inline type to avoid import issues
interface ProjectConfig {
  name: string;
  description?: string;
  qualityLevel: 'light' | 'medium' | 'strict';
  projectType: 'basic' | 'web' | 'cli' | 'library';
  aiAssistants: Array<'claude-code' | 'copilot'>;
}

describe('AIContextGenerator', () => {
  let generator: AIContextGenerator;

  beforeEach(() => {
    generator = createAIContextGenerator();
  });

  describe('generate', () => {
    it('should generate all AI context files for Claude Code only', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        description: 'Test project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);

      expect(results).toHaveLength(3); // unified, claude, manifest
      expect(results[0].filename).toBe('.ai/context.md');
      expect(results[1].filename).toBe('.ai/claude-context.md');
      expect(results[2].filename).toBe('.ai/manifest.json');
    });

    it('should generate all AI context files for Copilot only', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        description: 'Test project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['copilot'],
      };

      const results = generator.generate(config);

      expect(results).toHaveLength(3); // unified, copilot, manifest
      expect(results[0].filename).toBe('.ai/context.md');
      expect(results[1].filename).toBe('.ai/copilot-context.md');
      expect(results[2].filename).toBe('.ai/manifest.json');
    });

    it('should generate all AI context files for both assistants', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        description: 'Test project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['claude-code', 'copilot'],
      };

      const results = generator.generate(config);

      expect(results).toHaveLength(4); // unified, claude, copilot, manifest
      expect(results[0].filename).toBe('.ai/context.md');
      expect(results[1].filename).toBe('.ai/claude-context.md');
      expect(results[2].filename).toBe('.ai/copilot-context.md');
      expect(results[3].filename).toBe('.ai/manifest.json');
    });

    it('should include project description in unified context', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        description: 'A test project for AI integration',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);
      const unifiedContext = results[0];

      expect(unifiedContext.content).toContain('> A test project for AI integration');
    });

    it('should handle missing project description', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);
      const unifiedContext = results[0];

      expect(unifiedContext.content).toContain('# test-project - AI Context');
      expect(unifiedContext.content).not.toContain('>');
    });
  });

  describe('unified context content', () => {
    it('should include project metadata', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        description: 'Test project',
        qualityLevel: 'medium',
        projectType: 'web',
        aiAssistants: ['claude-code', 'copilot'],
      };

      const results = generator.generate(config);
      const unifiedContext = results[0];

      expect(unifiedContext.content).toContain('# test-project - AI Context');
      expect(unifiedContext.content).toContain('**Project Type**: Web Application');
      expect(unifiedContext.content).toContain('**Environment**: Browser');
      expect(unifiedContext.content).toContain('**Quality Level**: medium');
      expect(unifiedContext.content).toContain('**AI Assistants**: claude-code, copilot');
    });

    it('should include core technologies section', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);
      const unifiedContext = results[0];

      expect(unifiedContext.content).toContain('### Core Technologies');
      expect(unifiedContext.content).toContain(
        '- **TypeScript**: Strict mode with comprehensive type safety'
      );
      expect(unifiedContext.content).toContain(
        '- **Vitest**: Modern testing framework with TypeScript support'
      );
    });

    it('should include development standards', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);
      const unifiedContext = results[0];

      expect(unifiedContext.content).toContain('### Development Standards');
      expect(unifiedContext.content).toContain(
        '- **Language**: All code, comments, and documentation in English'
      );
      expect(unifiedContext.content).toContain(
        '- **TypeScript**: Strict mode enabled with comprehensive type safety'
      );
      expect(unifiedContext.content).toContain(
        '- **Testing**: Vitest framework with 85% coverage requirement'
      );
    });

    it('should include architecture section based on project type', () => {
      const config: ProjectConfig = {
        name: 'web-project',
        qualityLevel: 'medium',
        projectType: 'web',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);
      const unifiedContext = results[0];

      expect(unifiedContext.content).toContain('## Architecture and Patterns');
      expect(unifiedContext.content).toContain(
        '- **MVC Pattern**: Separation of concerns with models, views, and controllers'
      );
      expect(unifiedContext.content).toContain(
        '- **Repository Pattern**: Data access abstraction layer'
      );
    });

    it('should include testing requirements', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'strict',
        projectType: 'basic',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);
      const unifiedContext = results[0];

      expect(unifiedContext.content).toContain('### Testing Requirements');
      expect(unifiedContext.content).toContain('- **Coverage**: Minimum 95% required');
      expect(unifiedContext.content).toContain('- **Framework**: Vitest with TypeScript support');
    });

    it('should include code conventions', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);
      const unifiedContext = results[0];

      expect(unifiedContext.content).toContain('## Code Conventions');
      expect(unifiedContext.content).toContain('### Style Guidelines');
      expect(unifiedContext.content).toContain('### Naming Conventions');
      expect(unifiedContext.content).toContain('### Import Guidelines');
    });

    it('should include AI assistant integration section', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['claude-code', 'copilot'],
      };

      const results = generator.generate(config);
      const unifiedContext = results[0];

      expect(unifiedContext.content).toContain('## AI Assistant Integration');
      expect(unifiedContext.content).toContain(
        'This project is configured for the following AI assistants:'
      );
      expect(unifiedContext.content).toContain(
        '- **Claude Code**: Advanced code generation with project-specific context'
      );
      expect(unifiedContext.content).toContain(
        '- **GitHub Copilot**: IntelliSense-powered code completion'
      );
    });
  });

  describe('Claude-specific context', () => {
    it('should include Claude-specific instructions', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);
      const claudeContext = results[1];

      expect(claudeContext.content).toContain('# Claude Code Context for test-project');
      expect(claudeContext.content).toContain('## Claude-Specific Instructions');
      expect(claudeContext.content).toContain('### File Management');
      expect(claudeContext.content).toContain('### Code Generation Preferences');
    });

    it('should include Claude tool usage guidelines', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);
      const claudeContext = results[1];

      expect(claudeContext.content).toContain(
        '- Use the Read tool to examine existing code before making changes'
      );
      expect(claudeContext.content).toContain('- Use Write/Edit tools for file modifications');
      expect(claudeContext.content).toContain('- Use Bash tool for running commands and scripts');
      expect(claudeContext.content).toContain('- Use Glob/Grep tools for code search and analysis');
    });

    it('should include project-specific guidelines for CLI', () => {
      const config: ProjectConfig = {
        name: 'cli-project',
        qualityLevel: 'medium',
        projectType: 'cli',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);
      const claudeContext = results[1];

      expect(claudeContext.content).toContain('### Project-Specific Guidelines');
      expect(claudeContext.content).toContain(
        '- Generate command classes with proper error handling'
      );
      expect(claudeContext.content).toContain('- Use dependency injection for testability');
    });

    it('should include interaction patterns', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);
      const claudeContext = results[1];

      expect(claudeContext.content).toContain('### Interaction Patterns');
      expect(claudeContext.content).toContain(
        '- Ask clarifying questions before implementing complex features'
      );
      expect(claudeContext.content).toContain(
        '- Provide explanations for significant code changes'
      );
      expect(claudeContext.content).toContain(
        '- Ensure all generated code compiles without errors'
      );
    });
  });

  describe('Copilot-specific context', () => {
    it('should include Copilot-specific instructions', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['copilot'],
      };

      const results = generator.generate(config);
      const copilotContext = results[1];

      expect(copilotContext.content).toContain('# GitHub Copilot Context for test-project');
      expect(copilotContext.content).toContain('## Copilot-Specific Instructions');
      expect(copilotContext.content).toContain('### Code Style Preferences');
      expect(copilotContext.content).toContain('### Framework Usage');
    });

    it('should include testing patterns', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['copilot'],
      };

      const results = generator.generate(config);
      const copilotContext = results[1];

      expect(copilotContext.content).toContain('### Testing Patterns');
      expect(copilotContext.content).toContain('- Use Vitest with describe/it/test structure');
      expect(copilotContext.content).toContain(
        '- Include setup and teardown with beforeEach/afterEach'
      );
      expect(copilotContext.content).toContain('- Mock external dependencies using vi.mock');
    });

    it('should include security and performance guidelines', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['copilot'],
      };

      const results = generator.generate(config);
      const copilotContext = results[1];

      expect(copilotContext.content).toContain('### Security Considerations');
      expect(copilotContext.content).toContain('- Never generate code with hardcoded secrets');
      expect(copilotContext.content).toContain('- Validate all user inputs');
      expect(copilotContext.content).toContain('### Performance Guidelines');
      expect(copilotContext.content).toContain('- Write efficient, optimized code');
    });
  });

  describe('AI manifest', () => {
    it('should generate valid JSON manifest', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        description: 'Test project',
        qualityLevel: 'medium',
        projectType: 'web',
        aiAssistants: ['claude-code', 'copilot'],
      };

      const results = generator.generate(config);
      const manifest = results[results.length - 1]; // Last item is always manifest

      expect(() => JSON.parse(manifest.content)).not.toThrow();
    });

    it('should include project metadata in manifest', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        description: 'Test project',
        qualityLevel: 'medium',
        projectType: 'web',
        aiAssistants: ['claude-code', 'copilot'],
      };

      const results = generator.generate(config);
      const manifest = results[results.length - 1];
      const manifestData = JSON.parse(manifest.content);

      expect(manifestData.project.name).toBe('test-project');
      expect(manifestData.project.description).toBe('Test project');
      expect(manifestData.project.type).toBe('web');
      expect(manifestData.project.qualityLevel).toBe('medium');
      expect(manifestData.project.environment).toBe('browser');
    });

    it('should include assistants list in manifest', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['claude-code', 'copilot'],
      };

      const results = generator.generate(config);
      const manifest = results[results.length - 1];
      const manifestData = JSON.parse(manifest.content);

      expect(manifestData.assistants).toEqual(['claude-code', 'copilot']);
    });

    it('should include context paths in manifest', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['claude-code', 'copilot'],
      };

      const results = generator.generate(config);
      const manifest = results[results.length - 1];
      const manifestData = JSON.parse(manifest.content);

      expect(manifestData.contexts.unified).toBe('.ai/context.md');
      expect(manifestData.contexts.claude).toBe('.ai/claude-context.md');
      expect(manifestData.contexts.copilot).toBe('.ai/copilot-context.md');
    });

    it('should include configuration in manifest', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'strict',
        projectType: 'basic',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);
      const manifest = results[results.length - 1];
      const manifestData = JSON.parse(manifest.content);

      expect(manifestData.configuration.codeStyle.trailingComma).toBe('all');
      expect(manifestData.configuration.testing.coverage).toBe(95);
      expect(manifestData.configuration.quality.level).toBe('strict');
      expect(manifestData.configuration.quality.eslint.strict).toBe(true);
      expect(manifestData.configuration.quality.typescript.strict).toBe(true);
    });

    it('should include generation timestamp', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);
      const manifest = results[results.length - 1];
      const manifestData = JSON.parse(manifest.content);

      expect(manifestData.generated).toBeDefined();
      expect(new Date(manifestData.generated)).toBeInstanceOf(Date);
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
      const unifiedContext = results[0];

      expect(unifiedContext.content).toContain('**Quality Level**: light');
      expect(unifiedContext.content).toContain('- **Coverage**: Minimum 70% required');
      expect(unifiedContext.content).toContain('- Focus on basic functionality and readability');
    });

    it('should use medium quality settings', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);
      const unifiedContext = results[0];

      expect(unifiedContext.content).toContain('**Quality Level**: medium');
      expect(unifiedContext.content).toContain('- **Coverage**: Minimum 85% required');
      expect(unifiedContext.content).toContain('- High code quality and maintainability');
    });

    it('should use strict quality settings', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'strict',
        projectType: 'basic',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);
      const unifiedContext = results[0];

      expect(unifiedContext.content).toContain('**Quality Level**: strict');
      expect(unifiedContext.content).toContain('- **Coverage**: Minimum 95% required');
      expect(unifiedContext.content).toContain('- Maximum code quality and maintainability');
      expect(unifiedContext.content).toContain('- Use Test-Driven Development when possible');
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
      const unifiedContext = results[0];

      expect(unifiedContext.content).toContain('**Project Type**: CLI Application');
      expect(unifiedContext.content).toContain('**Environment**: Node.js');
      expect(unifiedContext.content).toContain(
        '- **Command Pattern**: Separate command classes for different operations'
      );
    });

    it('should include web project architecture', () => {
      const config: ProjectConfig = {
        name: 'web-project',
        qualityLevel: 'medium',
        projectType: 'web',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);
      const unifiedContext = results[0];

      expect(unifiedContext.content).toContain('**Project Type**: Web Application');
      expect(unifiedContext.content).toContain('**Environment**: Browser');
      expect(unifiedContext.content).toContain(
        '- **MVC Pattern**: Separation of concerns with models, views, and controllers'
      );
    });

    it('should include library project architecture', () => {
      const config: ProjectConfig = {
        name: 'lib-project',
        qualityLevel: 'medium',
        projectType: 'library',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);
      const unifiedContext = results[0];

      expect(unifiedContext.content).toContain('**Project Type**: Library Package');
      expect(unifiedContext.content).toContain('**Environment**: Universal (Node.js + Browser)');
      expect(unifiedContext.content).toContain(
        '- **API Design**: Clean, minimal public surface area'
      );
    });
  });

  describe('createAIContextGenerator factory', () => {
    it('should create a new AIContextGenerator instance', () => {
      const generator = createAIContextGenerator();

      expect(generator).toBeInstanceOf(AIContextGenerator);
    });

    it('should create working generator', () => {
      const generator = createAIContextGenerator();
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
      const unifiedContext = results[0];

      expect(unifiedContext.content).toContain('# ');
      expect(unifiedContext.content).toContain('## ');
      expect(unifiedContext.content).toContain('### ');
      expect(unifiedContext.content).toContain('**');
      expect(unifiedContext.content).toContain('- ');
      expect(unifiedContext.content).toContain('`');
    });

    it('should include generation timestamp', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);
      const unifiedContext = results[0];

      const today = new Date().toISOString().split('T')[0];
      expect(unifiedContext.content).toContain(`**Last Updated**: ${today}`);
      expect(unifiedContext.content).toContain(
        `*Generated by Nìmata CLI - AI Context Integration*`
      );
    });

    it('should handle null contexts for missing assistants', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['claude-code'], // No copilot
      };

      const results = generator.generate(config);
      const manifest = results[results.length - 1];
      const manifestData = JSON.parse(manifest.content);

      expect(manifestData.contexts.claude).toBe('.ai/claude-context.md');
      expect(manifestData.contexts.copilot).toBeNull();
    });
  });
});
