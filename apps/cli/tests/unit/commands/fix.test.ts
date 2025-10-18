/**
 * Unit Tests - Fix Command
 *
 * AC2: Command routing supports subcommands (fix)
 * AC3: Argument parsing handles flags and options
 */
import 'reflect-metadata';
import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { container } from 'tsyringe';
import { fixCommand } from '../../../src/commands/fix.js';
import type { OutputWriter } from '../../../src/output.js';
import { MockOutputWriter } from '../test-helpers.js';


describe('FixCommand', () => {
  beforeEach(() => {
    container.clearInstances();
    container.registerInstance('OutputWriter', new MockOutputWriter());
  });

  afterEach(() => {
    container.clearInstances();
  });

  it('should have correct command name', () => {
    expect(fixCommand.command).toBe('fix');
  });

  it('should have description', () => {
    expect(fixCommand.describe).toBeDefined();
    expect(typeof fixCommand.describe).toBe('string');
    expect((fixCommand.describe as string)?.length).toBeGreaterThan(0);
  });

  it('should define builder function', () => {
    expect(fixCommand.builder).toBeDefined();
    expect(typeof fixCommand.builder).toBe('function');
  });

  it('should define handler function', () => {
    expect(fixCommand.handler).toBeDefined();
    expect(typeof fixCommand.handler).toBe('function');
  });

  it('should configure config and interactive options in builder', () => {
    let configCalled = false;
    let interactiveCalled = false;
    const mockYargs = {
      option: (name: string, opts: any) => {
        if (name === 'config') {
          configCalled = true;
          expect(opts.type).toBe('string');
          expect(opts.alias).toBe('c');
        }
        if (name === 'interactive') {
          interactiveCalled = true;
          expect(opts.type).toBe('boolean');
          expect(opts.alias).toBe('i');
          expect(opts.default).toBe(false);
        }
        return mockYargs;
      },
    };

    // @ts-expect-error - Mocking yargs
    fixCommand.builder(mockYargs);

    expect(configCalled).toBe(true);
    expect(interactiveCalled).toBe(true);
  });
});
