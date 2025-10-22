/**
 * Unit tests for Help System Utilities
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'bun:test';
import { HelpSystem, Help } from '../../src/utils/help-system';

describe('HelpSystem', () => {
  let helpSystem: HelpSystem;
  let mockConsoleLog: any;
  let mockConsoleError: any;
  let consoleLogSpy: string[];
  let consoleErrorSpy: string[];

  beforeEach(() => {
    helpSystem = new HelpSystem();
    consoleLogSpy = [];
    consoleErrorSpy = [];
    mockConsoleLog = vi.spyOn(console, 'log').mockImplementation((...args) => {
      consoleLogSpy?.push(args.join(' '));
    });
    mockConsoleError = vi.spyOn(console, 'error').mockImplementation((...args) => {
      consoleErrorSpy?.push(args.join(' '));
    });
  });

  afterEach(() => {
    mockConsoleLog.mockRestore();
    mockConsoleError.mockRestore();
  });

  describe('constructor', () => {
    it('should create help system', () => {
      expect(helpSystem).toBeInstanceOf(HelpSystem);
    });
  });

  describe('showGeneralHelp', () => {
    it('should display general help', () => {
      helpSystem.showGeneralHelp();
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('Nìmata CLI - TypeScript Project Generator')
      );
      expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining('USAGE:'));
      expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining('COMMANDS:'));
      expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining('EXAMPLES:'));
    });
  });

  describe('showCommandHelp', () => {
    it('should show help for init command', () => {
      helpSystem.showCommandHelp('init');
      expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining('INIT'));
      expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining('USAGE:'));
      expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining('EXAMPLES:'));
      expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining('OPTIONS:'));
    });

    it('should show help for help command', () => {
      helpSystem.showCommandHelp('help');
      expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining('HELP'));
    });

    it('should show help for version command', () => {
      helpSystem.showCommandHelp('version');
      expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining('VERSION'));
    });

    it('should show error for unknown command', () => {
      helpSystem.showCommandHelp('unknown');
      expect(mockConsoleError).toHaveBeenCalledWith('Unknown command: unknown');
      expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining('Available commands:'));
    });
  });

  describe('showTopicHelp', () => {
    it('should show help for project-types topic', () => {
      helpSystem.showTopicHelp('project-types');
      expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining('PROJECT TYPES'));
      expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining('EXAMPLES:'));
      expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining('OPTIONS:'));
      expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining('SEE ALSO:'));
    });

    it('should show help for quality-levels topic', () => {
      helpSystem.showTopicHelp('quality-levels');
      expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining('QUALITY LEVELS'));
    });

    it('should show help for ai-assistants topic', () => {
      helpSystem.showTopicHelp('ai-assistants');
      expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining('AI ASSISTANTS'));
    });

    it('should show help for interactive-mode topic', () => {
      helpSystem.showTopicHelp('interactive-mode');
      expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining('INTERACTIVE MODE'));
    });

    it('should show help for advanced-options topic', () => {
      helpSystem.showTopicHelp('advanced-options');
      expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining('ADVANCED OPTIONS'));
    });

    it('should show help for troubleshooting topic', () => {
      helpSystem.showTopicHelp('troubleshooting');
      expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining('TROUBLESHOOTING'));
    });

    it('should show error for unknown topic', () => {
      helpSystem.showTopicHelp('unknown');
      expect(mockConsoleError).toHaveBeenCalledWith('Unknown topic: unknown');
      expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining('Available topics:'));
    });
  });

  describe('listTopics', () => {
    it('should list all available topics', () => {
      helpSystem.listTopics();
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('Available Help Topics:')
      );
      expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining('project-types'));
      expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining('quality-levels'));
      expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining('ai-assistants'));
    });
  });

  describe('getAvailableTopics', () => {
    it('should return array of topic names', () => {
      const topics = helpSystem.getAvailableTopics();
      expect(Array.isArray(topics)).toBe(true);
      expect(topics.length).toBeGreaterThan(0);
      expect(topics).toContain('project-types');
      expect(topics).toContain('quality-levels');
      expect(topics).toContain('ai-assistants');
    });
  });

  describe('getAvailableCommands', () => {
    it('should return array of command names', () => {
      const commands = helpSystem.getAvailableCommands();
      expect(Array.isArray(commands)).toBe(true);
      expect(commands.length).toBeGreaterThan(0);
      expect(commands).toContain('init');
      expect(commands).toContain('help');
      expect(commands).toContain('version');
    });
  });

  describe('hasTopic', () => {
    it('should return true for existing topics', () => {
      expect(helpSystem.hasTopic('project-types')).toBe(true);
      expect(helpSystem.hasTopic('quality-levels')).toBe(true);
      expect(helpSystem.hasTopic('ai-assistants')).toBe(true);
    });

    it('should return false for non-existing topics', () => {
      expect(helpSystem.hasTopic('unknown')).toBe(false);
      expect(helpSystem.hasTopic('invalid')).toBe(false);
    });
  });

  describe('hasCommand', () => {
    it('should return true for existing commands', () => {
      expect(helpSystem.hasCommand('init')).toBe(true);
      expect(helpSystem.hasCommand('help')).toBe(true);
      expect(helpSystem.hasCommand('version')).toBe(true);
    });

    it('should return false for non-existing commands', () => {
      expect(helpSystem.hasCommand('unknown')).toBe(false);
      expect(helpSystem.hasCommand('invalid')).toBe(false);
    });
  });
});

describe('Help utility', () => {
  let mockConsoleLog: any;
  let mockConsoleError: any;
  let consoleLogSpy: string[];
  let consoleErrorSpy: string[];

  beforeEach(() => {
    consoleLogSpy = [];
    consoleErrorSpy = [];
    mockConsoleLog = vi.spyOn(console, 'log').mockImplementation((...args) => {
      consoleLogSpy?.push(args.join(' '));
    });
    mockConsoleError = vi.spyOn(console, 'error').mockImplementation((...args) => {
      consoleErrorSpy?.push(args.join(' '));
    });
  });

  afterEach(() => {
    mockConsoleLog.mockRestore();
    mockConsoleError.mockRestore();
  });

  describe('show', () => {
    it('should show general help', () => {
      Help.show();
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('Nìmata CLI - TypeScript Project Generator')
      );
    });
  });

  describe('command', () => {
    it('should show command help', () => {
      Help.command('init');
      expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining('INIT'));
    });

    it('should show error for unknown command', () => {
      Help.command('unknown');
      expect(mockConsoleError).toHaveBeenCalledWith('Unknown command: unknown');
    });
  });

  describe('topic', () => {
    it('should show topic help', () => {
      Help.topic('project-types');
      expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining('PROJECT TYPES'));
    });

    it('should show error for unknown topic', () => {
      Help.topic('unknown');
      expect(mockConsoleError).toHaveBeenCalledWith('Unknown topic: unknown');
    });
  });

  describe('topics', () => {
    it('should list all topics', () => {
      Help.topics();
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('Available Help Topics:')
      );
    });
  });

  describe('getTopics', () => {
    it('should return available topics', () => {
      const topics = Help.getTopics();
      expect(Array.isArray(topics)).toBe(true);
      expect(topics.length).toBeGreaterThan(0);
    });
  });

  describe('getCommands', () => {
    it('should return available commands', () => {
      const commands = Help.getCommands();
      expect(Array.isArray(commands)).toBe(true);
      expect(commands.length).toBeGreaterThan(0);
    });
  });
});
