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
      const stderrSpy = vi.spyOn(process.stderr, 'write');

      expect(command.parseQualityLevel('invalid')).toBe('medium');
      expect(stderrSpy).toHaveBeenCalledWith(expect.stringContaining('Invalid quality level'));

      stderrSpy.mockRestore();
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
      const stderrSpy = vi.spyOn(process.stderr, 'write');

      expect(command.parseAIAssistants('invalid,claude-code')).toEqual(['claude-code']);
      expect(stderrSpy).toHaveBeenCalledWith(
        expect.stringContaining('Invalid AI assistants ignored')
      );

      stderrSpy.mockRestore();
    });

    it('should return claude-code for empty or invalid input', () => {
      const command = initCommand as any;
      const stderrSpy = vi.spyOn(process.stderr, 'write');

      expect(command.parseAIAssistants('')).toEqual(['claude-code']);
      expect(command.parseAIAssistants('invalid1,invalid2')).toEqual(['claude-code']);

      stderrSpy.mockRestore();
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
      const stderrSpy = vi.spyOn(process.stderr, 'write');

      expect(command.parseProjectType('invalid')).toBe('basic');
      expect(stderrSpy).toHaveBeenCalledWith(expect.stringContaining('Unknown template'));

      stderrSpy.mockRestore();
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
      const stdoutSpy = vi.spyOn(process.stdout, 'write');

      await command.execute(undefined, {});

      expect(stdoutSpy).toHaveBeenCalledWith(
        expect.stringContaining('❌ Project initialization cancelled')
      );

      stdoutSpy.mockRestore();
    });

    it('should show configuration summary for valid project', async () => {
      const command = initCommand as any;
      const stdoutSpy = vi.spyOn(process.stdout, 'write');

      await command.execute('test-project', { quality: 'strict' });

      expect(stdoutSpy).toHaveBeenCalledWith(
        expect.stringContaining('🚀 Nìmata CLI - TypeScript Project Generator')
      );
      expect(stdoutSpy).toHaveBeenCalledWith(expect.stringContaining('📋 Project Configuration:'));
      expect(stdoutSpy).toHaveBeenCalledWith(
        expect.stringContaining('✅ Project configuration validated')
      );
      expect(stdoutSpy).toHaveBeenCalledWith(
        expect.stringContaining('🎉 Project Ready! Next Steps:')
      );

      stdoutSpy.mockRestore();
    });

    it('should handle errors gracefully', async () => {
      const command = initCommand as any;
      const stderrSpy = vi.spyOn(process.stderr, 'write');
      const processSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
        // Mock implementation for process.exit
      });

      // Mock createConfigFromOptions to throw an error
      command.createConfigFromOptions = vi.fn().mockImplementation(() => {
        throw new Error('Test error');
      });

      await command.execute('test-project', { verbose: false });

      // Check that the error was logged properly
      expect(stderrSpy).toHaveBeenCalledWith(expect.stringContaining('❌ Error creating project:'));
      expect(stderrSpy).toHaveBeenCalledWith(expect.stringContaining('Test error'));
      expect(processSpy).toHaveBeenCalledWith(1);

      stderrSpy.mockRestore();
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
