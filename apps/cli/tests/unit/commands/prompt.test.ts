/**
 * Unit Tests - Prompt Command [T004]
 *
 * AC2: Command routing supports subcommands (prompt)
 * AC3: Argument parsing handles flags and options
 * Priority: P1 - Core command functionality
 */
import 'reflect-metadata';
import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { container } from 'tsyringe';
import { promptCommand } from '../../../src/commands/prompt.js';
import type { OutputWriter } from '../../../src/output.js';
import { MockOutputWriter, createExitMock } from '../test-helpers.js';

describe('PromptCommand [T004]', () => {
  beforeEach(() => {
    container.clearInstances();
    container.registerInstance<OutputWriter>('OutputWriter', new MockOutputWriter());
  });

  afterEach(() => {
    container.clearInstances();
  });

  describe('Command Structure [T004-10]', () => {
    it('[T004-11] should have correct command name', () => {
      expect(promptCommand.command).toBe('prompt');
    });

    it('[T004-12] should have meaningful description', () => {
      expect(promptCommand.describe).toBeDefined();
      expect(typeof promptCommand.describe).toBe('string');
      expect((promptCommand.describe as string)?.length).toBeGreaterThan(10);
      expect(promptCommand.describe as string).toContain('prompt');
    });

    it('[T004-13] should define builder function', () => {
      expect(promptCommand.builder).toBeDefined();
      expect(typeof promptCommand.builder).toBe('function');
    });

    it('[T004-14] should define handler function', () => {
      expect(promptCommand.handler).toBeDefined();
      expect(typeof promptCommand.handler).toBe('function');
    });

    it('[T004-15] should accept builder function context', () => {
      const mockYargs = {
        option: () => mockYargs,
      };

      expect(() => {
        // @ts-expect-error - Testing builder function
        promptCommand.builder(mockYargs);
      }).not.toThrow();
    });
  });

  describe('Option Configuration [T004-20]', () => {
    it('[T004-21] should configure config option with correct properties', () => {
      let configOption = null;

      const mockYargs = {
        option: (name: string, opts: any) => {
          if (name === 'config') {
            configOption = opts;
          }
          return mockYargs;
        },
      };

      // @ts-expect-error - Mocking yargs
      promptCommand.builder(mockYargs);

      expect(configOption).not.toBeNull();
      expect(configOption.type).toBe('string');
      expect(configOption.alias).toBe('c');
      expect(configOption.description).toContain('Path');
    });

    it('[T004-22] should configure output option with correct properties', () => {
      let outputOption = null;

      const mockYargs = {
        option: (name: string, opts: any) => {
          if (name === 'output') {
            outputOption = opts;
          }
          return mockYargs;
        },
      };

      // @ts-expect-error - Mocking yargs
      promptCommand.builder(mockYargs);

      expect(outputOption).not.toBeNull();
      expect(outputOption.type).toBe('string');
      expect(outputOption.alias).toBe('o');
      expect(outputOption.description).toContain('Output');
    });

    it('[T004-23] should configure all expected options', () => {
      const configuredOptions = [];

      const mockYargs = {
        option: (name: string, config: any) => {
          configuredOptions.push({ name, config });
          return mockYargs;
        },
      };

      // @ts-expect-error - Mocking yargs
      promptCommand.builder(mockYargs);

      const optionNames = configuredOptions.map((opt) => opt.name);

      expect(optionNames).toContain('config');
      expect(optionNames).toContain('output');
    });

    it('[T004-24] should provide descriptive help text', () => {
      const optionDescriptions = {};

      const mockYargs = {
        option: (name: string, config: any) => {
          optionDescriptions[name] = config.description;
          return mockYargs;
        },
      };

      // @ts-expect-error - Mocking yargs
      promptCommand.builder(mockYargs);

      expect(optionDescriptions['config']).toBeDefined();
      expect(optionDescriptions['output']).toBeDefined();
      expect(typeof optionDescriptions['config']).toBe('string');
      expect(typeof optionDescriptions['output']).toBe('string');
    });

    it('[T004-25] should configure config and output options in builder', () => {
      let configCalled = false;
      let outputCalled = false;
      const mockYargs = {
        option: (name: string, opts: any) => {
          if (name === 'config') {
            configCalled = true;
            expect(opts.type).toBe('string');
            expect(opts.alias).toBe('c');
          }
          if (name === 'output') {
            outputCalled = true;
            expect(opts.type).toBe('string');
            expect(opts.alias).toBe('o');
          }
          return mockYargs;
        },
      };

      // @ts-expect-error - Mocking yargs
      promptCommand.builder(mockYargs);

      expect(configCalled).toBe(true);
      expect(outputCalled).toBe(true);
    });
  });

  describe('Builder Pattern [T004-30]', () => {
    it('[T004-31] should return yargs instance for chaining', () => {
      const mockYargs = {
        option: () => mockYargs,
      };

      const result = promptCommand.builder(mockYargs);

      expect(result).toBe(mockYargs);
    });

    it('[T004-32] should handle multiple option configurations', () => {
      let optionCallCount = 0;

      const mockYargs = {
        option: () => {
          optionCallCount++;
          return mockYargs;
        },
      };

      // @ts-expect-error - Mocking yargs
      promptCommand.builder(mockYargs);

      expect(optionCallCount).toBe(2); // config and output options
    });

    it('[T004-33] should preserve option order consistency', () => {
      const callOrder = [];

      const mockYargs = {
        option: (name: string) => {
          callOrder.push(name);
          return mockYargs;
        },
      };

      // @ts-expect-error - Mocking yargs
      promptCommand.builder(mockYargs);

      expect(callOrder).toHaveLength(2);
      expect(callOrder).toContain('config');
      expect(callOrder).toContain('output');
    });
  });

  describe('Handler Interface [T004-40]', () => {
    it('[T004-41] should have handler with correct signature', () => {
      const handler = promptCommand.handler;
      expect(typeof handler).toBe('function');
      expect(handler.length).toBeGreaterThanOrEqual(1); // Should accept argv parameter
    });

    it('[T004-42] should accept empty arguments object', () => {
      const exitMock = createExitMock();

      expect(() => {
        // @ts-expect-error - Testing handler interface
        promptCommand.handler({});
      }).toThrow('process.exit called');

      exitMock.mockRestore();
    });

    it('[T004-43] should accept arguments with options', () => {
      const exitMock = createExitMock();

      const testArgs = {
        config: 'test.json',
        output: 'result.txt',
        _: ['prompt'],
      };

      expect(() => {
        // @ts-expect-error - Testing handler interface
        promptCommand.handler(testArgs);
      }).toThrow('process.exit called');

      exitMock.mockRestore();
    });
  });

  describe('Command Integration [T004-50]', () => {
    it('[T004-51] should have consistent interface with other commands', () => {
      const requiredProperties = ['command', 'describe', 'builder', 'handler'];

      for (const prop of requiredProperties) {
        expect(promptCommand).toHaveProperty(prop);
        expect(promptCommand[prop as keyof typeof promptCommand]).toBeDefined();
      }
    });

    it('[T004-52] should have command name matching file structure', () => {
      expect(promptCommand.command).toBe('prompt');
    });

    it('[T004-53] should export command object correctly', () => {
      expect(typeof promptCommand).toBe('object');
      expect(promptCommand).not.toBeNull();
      expect(promptCommand).not.toBeUndefined();
    });
  });

  describe('Option Specifics [T004-60]', () => {
    it('[T004-61] should configure config option alias correctly', () => {
      let configAlias = null;

      const mockYargs = {
        option: (name: string, opts: any) => {
          if (name === 'config') {
            configAlias = opts.alias;
          }
          return mockYargs;
        },
      };

      // @ts-expect-error - Mocking yargs
      promptCommand.builder(mockYargs);

      expect(configAlias).toBe('c');
    });

    it('[T004-62] should configure output option alias correctly', () => {
      let outputAlias = null;

      const mockYargs = {
        option: (name: string, opts: any) => {
          if (name === 'output') {
            outputAlias = opts.alias;
          }
          return mockYargs;
        },
      };

      // @ts-expect-error - Mocking yargs
      promptCommand.builder(mockYargs);

      expect(outputAlias).toBe('o');
    });

    it('[T004-63] should configure both options as string type', () => {
      const optionTypes = {};

      const mockYargs = {
        option: (name: string, opts: any) => {
          optionTypes[name] = opts.type;
          return mockYargs;
        },
      };

      // @ts-expect-error - Mocking yargs
      promptCommand.builder(mockYargs);

      expect(optionTypes['config']).toBe('string');
      expect(optionTypes['output']).toBe('string');
    });
  });
});
