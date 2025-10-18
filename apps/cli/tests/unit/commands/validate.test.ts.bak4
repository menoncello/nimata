/**
 * Unit Tests - Validate Command
 *
 * AC2: Command routing supports subcommands (validate)
 * AC3: Argument parsing handles flags and options
 */
import 'reflect-metadata';
import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { container } from 'tsyringe';
import { validateCommand } from '../../../src/commands/validate.js';
import type { OutputWriter } from '../../../src/output.js';

// Mock OutputWriter
class MockOutputWriter implements OutputWriter {
  stdout(): void {
    /* Intentionally empty - stub for testing */
  }
  stderr(): void {
    /* Intentionally empty - stub for testing */
  }
  log(): void {
    /* Intentionally empty - stub for testing */
  }
  error(): void {
    /* Intentionally empty - stub for testing */
  }
}

describe('ValidateCommand', () => {
  beforeEach(() => {
    container.clearInstances();
    container.register<OutputWriter>('OutputWriter', { useClass: MockOutputWriter });
  });

  afterEach(() => {
    container.clearInstances();
  });

  it('should have correct command name', () => {
    expect(validateCommand.command).toBe('validate');
  });

  it('should have description', () => {
    expect(validateCommand.describe).toBeDefined();
    expect(typeof validateCommand.describe).toBe('string');
    expect(validateCommand.describe.length).toBeGreaterThan(0);
  });

  it('should define builder function', () => {
    expect(validateCommand.builder).toBeDefined();
    expect(typeof validateCommand.builder).toBe('function');
  });

  it('should define handler function', () => {
    expect(validateCommand.handler).toBeDefined();
    expect(typeof validateCommand.handler).toBe('function');
  });

  it('should configure config and fix options in builder', () => {
    let configCalled = false;
    let fixCalled = false;
    const mockYargs = {
      option: (name: string, opts: any) => {
        if (name === 'config') {
          configCalled = true;
          expect(opts.type).toBe('string');
          expect(opts.alias).toBe('c');
        }
        if (name === 'fix') {
          fixCalled = true;
          expect(opts.type).toBe('boolean');
          expect(opts.default).toBe(false);
        }
        return mockYargs;
      },
    };

    // @ts-expect-error - Mocking yargs
    validateCommand.builder(mockYargs);

    expect(configCalled).toBe(true);
    expect(fixCalled).toBe(true);
  });
});
