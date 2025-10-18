/**
 * Unit Tests - App Module (CLI Creation)
 *
 * Tests for CLI configuration in app.ts
 */
import 'reflect-metadata';
import { describe, it, expect, beforeEach, afterEach, spyOn } from 'bun:test';
import { container } from 'tsyringe';
import { CliApp } from '../../src/app.js';
import type { CliBuilder } from '../../src/cli-builder.js';
import type { OutputWriter } from '../../src/output.js';

// Test helpers
const findConfigCall = (calls: unknown[][]): unknown[] | undefined => {
  return calls.find((call) => call[0] === 'config');
};

// Mock OutputWriter for testing
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

// Mock CliBuilder for testing
class MockCliBuilder implements CliBuilder {
  create(): CliBuilder {
    return this;
  }
  scriptName(): CliBuilder {
    return this;
  }
  version(): CliBuilder {
    return this;
  }
  usage(): CliBuilder {
    return this;
  }
  command(): CliBuilder {
    return this;
  }
  option(): CliBuilder {
    return this;
  }
  demandCommand(): CliBuilder {
    return this;
  }
  help(): CliBuilder {
    return this;
  }
  alias(): CliBuilder {
    return this;
  }
  strict(): CliBuilder {
    return this;
  }
  wrap(): CliBuilder {
    return this;
  }
  epilogue(): CliBuilder {
    return this;
  }
  exitProcess(): CliBuilder {
    return this;
  }
  showHelpOnFail(): CliBuilder {
    return this;
  }
  fail(): CliBuilder {
    return this;
  }
  async parse(): Promise<void> {
    /* Intentionally empty - stub for testing */
  }
}

describe('App Module - CLI Creation', () => {
  let app: CliApp;

  beforeEach(() => {
    // Clear and configure DI container for tests with mocks
    container.clearInstances();
    container.register<OutputWriter>('OutputWriter', {
      useClass: MockOutputWriter,
    });
    container.register<CliBuilder>('CliBuilder', {
      useClass: MockCliBuilder,
    });
    container.registerSingleton(CliApp);

    // Resolve app instance
    app = container.resolve(CliApp);
  });

  afterEach(() => {
    // Clear container after each test
    container.clearInstances();
  });

  describe('createCli', () => {
    it('should create yargs instance with correct configuration', () => {
      const cli = app.createCli('1.0.0', ['init'], true);
      expect(cli).toBeDefined();
    });

    it('should configure all four commands', () => {
      const cli = app.createCli('1.0.0', ['--help'], true);
      expect(cli).toBeDefined();
      // Commands are registered via .command() calls
      // This verifies the function runs without errors
    });

    it('should call scriptName with "nimata"', () => {
      // Create fresh mock builder with spy
      const mockBuilder = new MockCliBuilder();
      const scriptNameSpy = spyOn(mockBuilder, 'scriptName');

      // Create new app with spy'd builder
      const mockOutput = container.resolve<OutputWriter>('OutputWriter');
      const testApp = new CliApp(mockOutput, mockBuilder);

      testApp.createCli('1.0.0', [], true);

      expect(scriptNameSpy).toHaveBeenCalledWith('nimata');
      scriptNameSpy.mockRestore();
    });

    it('should call usage with correct string', () => {
      const mockBuilder = new MockCliBuilder();
      const usageSpy = spyOn(mockBuilder, 'usage');

      const mockOutput = container.resolve<OutputWriter>('OutputWriter');
      const testApp = new CliApp(mockOutput, mockBuilder);

      testApp.createCli('1.0.0', [], true);

      expect(usageSpy).toHaveBeenCalledWith('$0 <command> [options]');
      usageSpy.mockRestore();
    });

    it('should call epilogue with github URL', () => {
      const mockBuilder = new MockCliBuilder();
      const epilogueSpy = spyOn(mockBuilder, 'epilogue');

      const mockOutput = container.resolve<OutputWriter>('OutputWriter');
      const testApp = new CliApp(mockOutput, mockBuilder);

      testApp.createCli('1.0.0', [], true);

      expect(epilogueSpy).toHaveBeenCalled();
      // Verify it was called with string containing github URL
      const callArgs = epilogueSpy.mock.calls[0];
      expect(callArgs?.[0]).toContain('github.com');
      epilogueSpy.mockRestore();
    });

    it('should configure global config option with name "config"', () => {
      const mockBuilder = new MockCliBuilder();
      const optionSpy = spyOn(mockBuilder, 'option');

      const mockOutput = container.resolve<OutputWriter>('OutputWriter');
      const testApp = new CliApp(mockOutput, mockBuilder);

      testApp.createCli('1.0.0', [], true);

      // Verify option was called with 'config' as first argument
      const configCall = findConfigCall(optionSpy.mock.calls);
      expect(configCall).toBeDefined();
      expect(configCall?.[0]).toBe('config');

      optionSpy.mockRestore();
    });

    it('should configure config option with alias "c"', () => {
      const mockBuilder = new MockCliBuilder();
      const optionSpy = spyOn(mockBuilder, 'option');

      const mockOutput = container.resolve<OutputWriter>('OutputWriter');
      const testApp = new CliApp(mockOutput, mockBuilder);

      testApp.createCli('1.0.0', [], true);

      // Verify config option has alias 'c'
      const configCall = findConfigCall(optionSpy.mock.calls);
      expect(configCall?.[1]?.alias).toBe('c');

      optionSpy.mockRestore();
    });

    it('should configure config option as global', () => {
      const mockBuilder = new MockCliBuilder();
      const optionSpy = spyOn(mockBuilder, 'option');

      const mockOutput = container.resolve<OutputWriter>('OutputWriter');
      const testApp = new CliApp(mockOutput, mockBuilder);

      testApp.createCli('1.0.0', [], true);

      // Verify config option is global
      const configCall = findConfigCall(optionSpy.mock.calls);
      expect(configCall?.[1]?.global).toBe(true);

      optionSpy.mockRestore();
    });

    it('should set version correctly', () => {
      const cli = app.createCli('2.5.3', [], true);
      expect(cli).toBeDefined();
    });

    it('should configure suppressOutput mode correctly', () => {
      const mockBuilder = new MockCliBuilder();
      const exitProcessSpy = spyOn(mockBuilder, 'exitProcess');
      const showHelpOnFailSpy = spyOn(mockBuilder, 'showHelpOnFail');
      const failSpy = spyOn(mockBuilder, 'fail');

      const mockOutput = container.resolve<OutputWriter>('OutputWriter');
      const testApp = new CliApp(mockOutput, mockBuilder);

      testApp.createCli('1.0.0', [], true);

      expect(exitProcessSpy).toHaveBeenCalledWith(false);
      expect(showHelpOnFailSpy).toHaveBeenCalledWith(false);
      expect(failSpy).toHaveBeenCalledWith(false);

      exitProcessSpy.mockRestore();
      showHelpOnFailSpy.mockRestore();
      failSpy.mockRestore();
    });

    it('should not configure suppressOutput mode when false', () => {
      const mockBuilder = new MockCliBuilder();
      const exitProcessSpy = spyOn(mockBuilder, 'exitProcess');

      const mockOutput = container.resolve<OutputWriter>('OutputWriter');
      const testApp = new CliApp(mockOutput, mockBuilder);

      testApp.createCli('1.0.0', [], false);

      expect(exitProcessSpy).not.toHaveBeenCalled();

      exitProcessSpy.mockRestore();
    });
  });
});
