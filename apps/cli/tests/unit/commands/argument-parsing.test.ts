/**
 * Unit Tests - Command Argument Parsing [T002]
 *
 * Tests for command argument parsing and validation
 * Priority: P1 - Core CLI functionality
 */
import 'reflect-metadata';
import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { container } from 'tsyringe';
import { initCommand } from '../../../src/commands/init.js';
import { MockOutputWriter } from '../test-helpers.js';

describe('Argument Parsing [T002]', () => {
  beforeEach(() => {
    container.clearInstances();
    container.registerInstance('OutputWriter', new MockOutputWriter());
  });

  afterEach(() => {
    container.clearInstances();
  });

  describe('Yargs Builder Configuration [T002-10]', () => {
    it('[T002-11] should configure positional argument for project name', () => {
      let positionalCalled = false;
      let positionalConfig = null;

      const mockYargs = {
        positional: (name: string, config: any) => {
          positionalCalled = true;
          positionalConfig = config;
          return mockYargs;
        },
        option: () => mockYargs,
      };

      // @ts-expect-error - Mocking yargs
      initCommand.builder(mockYargs);

      expect(positionalCalled).toBe(true);
      expect(positionalConfig.type).toBe('string');
      expect(positionalConfig.description).toContain('Name of the project');
    });

    it('[T002-12] should configure all expected options', () => {
      const configuredOptions = [];

      const mockYargs = {
        positional: () => mockYargs,
        option: (name: string, config: any) => {
          configuredOptions.push({ name, config });
          return mockYargs;
        },
      };

      // @ts-expect-error - Mocking yargs
      initCommand.builder(mockYargs);

      const optionNames = configuredOptions.map((opt) => opt.name);

      expect(optionNames).toContain('config');
      expect(optionNames).toContain('template');
      expect(optionNames).toContain('quality');
      expect(optionNames).toContain('ai');
      expect(optionNames).toContain('nonInteractive');
    });

    it('[T002-13] should configure config option with correct alias', () => {
      let configOption = null;

      const mockYargs = {
        positional: () => mockYargs,
        option: (name: string, config: any) => {
          if (name === 'config') {
            configOption = config;
          }
          return mockYargs;
        },
      };

      // @ts-expect-error - Mocking yargs
      initCommand.builder(mockYargs);

      expect(configOption).not.toBeNull();
      expect(configOption.type).toBe('string');
      expect(configOption.alias).toBe('c');
      expect(configOption.description).toContain('custom configuration file');
    });

    it('[T002-14] should configure template option with choices', () => {
      let templateOption = null;

      const mockYargs = {
        positional: () => mockYargs,
        option: (name: string, config: any) => {
          if (name === 'template') {
            templateOption = config;
          }
          return mockYargs;
        },
      };

      // @ts-expect-error - Mocking yargs
      initCommand.builder(mockYargs);

      expect(templateOption).not.toBeNull();
      expect(templateOption.type).toBe('string');
      expect(templateOption.choices).toEqual(['basic', 'web', 'cli', 'library']);
    });

    it('[T002-15] should configure quality option with choices', () => {
      let qualityOption = null;

      const mockYargs = {
        positional: () => mockYargs,
        option: (name: string, config: any) => {
          if (name === 'quality') {
            qualityOption = config;
          }
          return mockYargs;
        },
      };

      // @ts-expect-error - Mocking yargs
      initCommand.builder(mockYargs);

      expect(qualityOption).not.toBeNull();
      expect(qualityOption.type).toBe('string');
      expect(qualityOption.choices).toEqual(['light', 'medium', 'strict']);
    });

    it('[T002-16] should configure ai option', () => {
      let aiOption = null;

      const mockYargs = {
        positional: () => mockYargs,
        option: (name: string, config: any) => {
          if (name === 'ai') {
            aiOption = config;
          }
          return mockYargs;
        },
      };

      // @ts-expect-error - Mocking yargs
      initCommand.builder(mockYargs);

      expect(aiOption).not.toBeNull();
      expect(aiOption.type).toBe('string');
      expect(aiOption.description).toContain('AI assistants');
    });

    it('[T002-17] should configure nonInteractive option with aliases', () => {
      let nonInteractiveOption = null;

      const mockYargs = {
        positional: () => mockYargs,
        option: (name: string, config: any) => {
          if (name === 'nonInteractive') {
            nonInteractiveOption = config;
          }
          return mockYargs;
        },
      };

      // @ts-expect-error - Mocking yargs
      initCommand.builder(mockYargs);

      expect(nonInteractiveOption).not.toBeNull();
      expect(nonInteractiveOption.type).toBe('boolean');
      expect(nonInteractiveOption.alias).toEqual(['no-interactive']);
      expect(nonInteractiveOption.description).toContain('non-interactive mode');
    });
  });

  describe('Command Structure [T002-20]', () => {
    it('[T002-21] should have correct command signature', () => {
      expect(initCommand.command).toBe('init [project-name]');
    });

    it('[T002-22] should have meaningful description', () => {
      expect(initCommand.describe).toBeDefined();
      expect(typeof initCommand.describe).toBe('string');
      expect((initCommand.describe as string).length).toBeGreaterThan(10);
      expect(initCommand.describe as string).toContain('TypeScript project');
    });

    it('[T002-23] should have builder function', () => {
      expect(initCommand.builder).toBeDefined();
      expect(typeof initCommand.builder).toBe('function');
    });

    it('[T002-24] should have handler function', () => {
      expect(initCommand.handler).toBeDefined();
      expect(typeof initCommand.handler).toBe('function');
    });

    it('[T002-25] should accept builder function context', () => {
      const mockYargs = {
        positional: () => mockYargs,
        option: () => mockYargs,
      };

      expect(() => {
        // @ts-expect-error - Testing builder function
        initCommand.builder(mockYargs);
      }).not.toThrow();
    });
  });

  describe('Option Validation [T002-30]', () => {
    it('[T002-31] should support all template choices', () => {
      const expectedChoices = ['basic', 'web', 'cli', 'library'];

      const mockYargs = {
        positional: () => mockYargs,
        option: (name: string, config: any) => {
          if (name === 'template') {
            expect(config.choices).toEqual(expectedChoices);
          }
          return mockYargs;
        },
      };

      // @ts-expect-error - Mocking yargs
      initCommand.builder(mockYargs);
    });

    it('[T002-32] should support all quality choices', () => {
      const expectedChoices = ['light', 'medium', 'strict'];

      const mockYargs = {
        positional: () => mockYargs,
        option: (name: string, config: any) => {
          if (name === 'quality') {
            expect(config.choices).toEqual(expectedChoices);
          }
          return mockYargs;
        },
      };

      // @ts-expect-error - Mocking yargs
      initCommand.builder(mockYargs);
    });

    it('[T002-33] should provide descriptive help text for options', () => {
      const optionDescriptions = {};

      const mockYargs = {
        positional: () => mockYargs,
        option: (name: string, config: any) => {
          optionDescriptions[name] = config.description;
          return mockYargs;
        },
      };

      // @ts-expect-error - Mocking yargs
      initCommand.builder(mockYargs);

      expect(optionDescriptions['config']).toContain('configuration');
      expect(optionDescriptions['template']).toContain('template');
      expect(optionDescriptions['quality']).toContain('Quality');
      expect(optionDescriptions['ai']).toContain('AI');
      expect(optionDescriptions['nonInteractive']).toContain('non-interactive');
    });
  });

  describe('Chain Pattern [T002-40]', () => {
    it('[T002-41] should return yargs instance for chaining', () => {
      const mockYargs = {
        positional: () => mockYargs,
        option: () => mockYargs,
      };

      const result = initCommand.builder(mockYargs);

      expect(result).toBe(mockYargs);
    });

    it('[T002-42] should handle multiple option configurations', () => {
      let callCount = 0;

      const mockYargs = {
        positional: () => {
          callCount++;
          return mockYargs;
        },
        option: () => {
          callCount++;
          return mockYargs;
        },
      };

      // @ts-expect-error - Mocking yargs
      initCommand.builder(mockYargs);

      expect(callCount).toBeGreaterThan(5); // At least 1 positional + 5 options
    });
  });
});
