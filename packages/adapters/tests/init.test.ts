/**
 * Unit tests for Init Command
 */

import { describe, it, expect, beforeEach, vi } from 'bun:test';
import { InitCommand, createInitCommand } from '../src/commands/init';

describe('InitCommand', () => {
  let initCommand: InitCommand;

  beforeEach(() => {
    initCommand = createInitCommand();
  });

  describe('createCommand', () => {
    it('should create a command with correct configuration', () => {
      const command = initCommand.createCommand();

      expect(command.name).toBe('init');
      expect(command.description).toBe('Initialize a new TypeScript project');
      expect(command.arguments).toEqual(['[project-name]']);
      expect(Array.isArray(command.options)).toBe(true);
      expect(typeof command.action).toBe('function');
    });

    it('should have all required options', () => {
      const command = initCommand.createCommand();
      const optionFlags = command.options.map((opt: any) => opt.flags);

      expect(optionFlags).toContain('-i, --interactive');
      expect(optionFlags).toContain('-t, --template <template>');
      expect(optionFlags).toContain('-q, --quality <quality>');
      expect(optionFlags).toContain('-a, --ai <assistants>');
      expect(optionFlags).toContain('-d, --directory <directory>');
      expect(optionFlags).toContain('--skip-install');
      expect(optionFlags).toContain('--skip-git');
      expect(optionFlags).toContain('-v, --verbose');
    });
  });

  describe('parseQualityLevel', () => {
    it('should return valid quality levels', () => {
      const command = initCommand as any;

      expect(command.parseQualityLevel('light')).toBe('light');
      expect(command.parseQualityLevel('medium')).toBe('medium');
      expect(command.parseQualityLevel('strict')).toBe('strict');
    });

    it('should return medium for invalid quality levels', () => {
      const command = initCommand as any;
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation((...args) => {
        // Capture console warnings for testing
        consoleSpy?.warnings?.push(args.join(' '));
      });
      // Initialize warnings array
      (consoleSpy as any).warnings = [];
      // Initialize warnings array
      (consoleSpy as any).warnings = [];

      expect(command.parseQualityLevel('invalid')).toBe('medium');
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Invalid quality level'));

      consoleSpy.mockRestore();
    });
  });

  describe('parseAIAssistants', () => {
    it('should parse valid AI assistants', () => {
      const command = initCommand as any;

      expect(command.parseAIAssistants('claude-code')).toEqual(['claude-code']);
      expect(command.parseAIAssistants('copilot')).toEqual(['copilot']);
      expect(command.parseAIAssistants('claude-code,copilot')).toEqual(['claude-code', 'copilot']);
    });

    it('should handle case insensitive input', () => {
      const command = initCommand as any;

      expect(command.parseAIAssistants('CLAUDE-CODE')).toEqual(['claude-code']);
      expect(command.parseAIAssistants('Copilot')).toEqual(['copilot']);
    });

    it('should filter invalid assistants', () => {
      const command = initCommand as any;
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation((...args) => {
        // Capture console warnings for testing
        consoleSpy?.warnings?.push(args.join(' '));
      });
      // Initialize warnings array
      (consoleSpy as any).warnings = [];

      expect(command.parseAIAssistants('invalid,claude-code')).toEqual(['claude-code']);
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Invalid AI assistants ignored')
      );

      consoleSpy.mockRestore();
    });

    it('should return claude-code for empty or invalid input', () => {
      const command = initCommand as any;
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation((...args) => {
        // Capture console warnings for testing
        consoleSpy?.warnings?.push(args.join(' '));
      });
      // Initialize warnings array
      (consoleSpy as any).warnings = [];

      expect(command.parseAIAssistants('')).toEqual(['claude-code']);
      expect(command.parseAIAssistants('invalid1,invalid2')).toEqual(['claude-code']);

      consoleSpy.mockRestore();
    });
  });

  describe('parseProjectType', () => {
    it('should parse valid project types', () => {
      const command = initCommand as any;

      expect(command.parseProjectType('basic')).toBe('basic');
      expect(command.parseProjectType('web')).toBe('web');
      expect(command.parseProjectType('cli')).toBe('cli');
      expect(command.parseProjectType('library')).toBe('library');
    });

    it('should handle alternative template names', () => {
      const command = initCommand as any;

      expect(command.parseProjectType('website')).toBe('web');
      expect(command.parseProjectType('command')).toBe('cli');
      expect(command.parseProjectType('lib')).toBe('library');
      expect(command.parseProjectType('package')).toBe('library');
    });

    it('should return basic for invalid template names', () => {
      const command = initCommand as any;
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation((...args) => {
        // Capture console warnings for testing
        consoleSpy?.warnings?.push(args.join(' '));
      });
      // Initialize warnings array
      (consoleSpy as any).warnings = [];

      expect(command.parseProjectType('invalid')).toBe('basic');
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Unknown template'));

      consoleSpy.mockRestore();
    });
  });

  describe('createConfigFromOptions', () => {
    it('should create config from valid options', () => {
      const command = initCommand as any;
      const options = {
        template: 'web',
        quality: 'strict',
        ai: 'claude-code,copilot',
      };

      const config = command.createConfigFromOptions('my-project', options);

      expect(config).toEqual({
        name: 'my-project',
        description: 'A web TypeScript project',
        qualityLevel: 'strict',
        projectType: 'web',
        aiAssistants: ['claude-code', 'copilot'],
      });
    });

    it('should handle default values', () => {
      const command = initCommand as any;
      const options = {};

      const config = command.createConfigFromOptions('my-project', options);

      expect(config).toEqual({
        name: 'my-project',
        description: 'A basic TypeScript project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['claude-code'],
      });
    });
  });

  describe('execute', () => {
    it('should handle missing project name', async () => {
      const command = initCommand as any;
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation((...args) => {
        // Capture console logs for testing
        consoleSpy?.logs?.push(args.join(' '));
      });
      // Initialize logs array
      (consoleSpy as any).logs = [];

      await command.execute(undefined, {});

      expect(consoleSpy).toHaveBeenCalledWith('❌ Project initialization cancelled');

      consoleSpy.mockRestore();
    });

    it('should show configuration summary for valid project', async () => {
      const command = initCommand as any;
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation((...args) => {
        // Capture console logs for testing
        consoleSpy?.logs?.push(args.join(' '));
      });
      // Initialize logs array
      (consoleSpy as any).logs = [];

      await command.execute('test-project', { quality: 'strict' });

      expect(consoleSpy).toHaveBeenCalledWith('🚀 Nìmata CLI - TypeScript Project Generator');
      expect(consoleSpy).toHaveBeenCalledWith('📋 Project Configuration:');
      expect(consoleSpy).toHaveBeenCalledWith('✅ Project configuration validated');
      expect(consoleSpy).toHaveBeenCalledWith('🎉 Project Ready! Next Steps:');

      consoleSpy.mockRestore();
    });

    it('should handle errors gracefully', async () => {
      const command = initCommand as any;
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation((...args) => {
        // Capture console errors for testing
        consoleSpy?.errors?.push(args.join(' '));
      });
      // Initialize errors array
      (consoleSpy as any).errors = [];
      const processSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
        // Mock implementation for process.exit
      });

      // Mock createConfigFromOptions to throw an error
      command.createConfigFromOptions = vi.fn().mockImplementation(() => {
        throw new Error('Test error');
      });

      await command.execute('test-project', { verbose: false });

      expect(consoleSpy).toHaveBeenCalledWith('❌ Error creating project:', 'Test error');
      expect(processSpy).toHaveBeenCalledWith(1);

      consoleSpy.mockRestore();
      processSpy.mockRestore();
    });
  });

  describe('createInitCommand factory', () => {
    it('should create a new InitCommand instance', () => {
      const command = createInitCommand();

      expect(command).toBeInstanceOf(InitCommand);
    });

    it('should create working command with all methods', () => {
      const command = createInitCommand();

      expect(typeof command.createCommand).toBe('function');
      expect(typeof command.execute).toBe('function');

      const cmd = command.createCommand();
      expect(cmd.name).toBe('init');
    });
  });

  describe('helper methods', () => {
    it('should get correct project type names', () => {
      const command = initCommand as any;

      expect(command.getProjectTypeName('basic')).toBe('Basic TypeScript Project');
      expect(command.getProjectTypeName('web')).toBe('Web Application');
      expect(command.getProjectTypeName('cli')).toBe('CLI Application');
      expect(command.getProjectTypeName('library')).toBe('Library Package');
      expect(command.getProjectTypeName('unknown')).toBe('Unknown');
    });
  });
});
