/**
 * Unit Tests - Init Command
 *
 * AC2: Command routing supports subcommands (init)
 * AC3: Argument parsing handles flags and options
 */
import 'reflect-metadata';
import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { container } from 'tsyringe';
import { initCommand } from '../../../src/commands/init.js';
import type { OutputWriter } from '../../../src/output.js';
import { MockOutputWriter } from '../test-helpers.js';


describe('InitCommand', () => {
  beforeEach(() => {
    container.clearInstances();
    container.register<OutputWriter>('OutputWriter', new MockOutputWriter());
  });

  afterEach(() => {
    container.clearInstances();
  });

  it('should have correct command name', () => {
    expect(initCommand.command).toBe('init');
  });

  it('should have description', () => {
    expect(initCommand.describe).toBeDefined();
    expect(typeof initCommand.describe).toBe('string');
    expect((initCommand.describe as string)?.length).toBeGreaterThan(0);
  });

  it('should define builder function', () => {
    expect(initCommand.builder).toBeDefined();
    expect(typeof initCommand.builder).toBe('function');
  });

  it('should define handler function', () => {
    expect(initCommand.handler).toBeDefined();
    expect(typeof initCommand.handler).toBe('function');
  });

  it('should configure config option in builder', () => {
    let configCalled = false;
    const mockYargs = {
      option: (name: string, opts: any) => {
        if (name === 'config') {
          configCalled = true;
          expect(opts.type).toBe('string');
          expect(opts.alias).toBe('c');
        }
        return mockYargs;
      },
    };

    // @ts-expect-error - Mocking yargs
    initCommand.builder(mockYargs);

    expect(configCalled).toBe(true);
  });
});
