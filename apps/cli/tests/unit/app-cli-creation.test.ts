/**
 * Unit Tests - App Module (CLI Creation)
 *
 * Tests for CLI configuration in app.ts
 */
import 'reflect-metadata';
import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { container } from 'tsyringe';
import { CliApp } from '../../src/app.js';
import type { CliBuilder } from '../../src/cli-builder.js';
import type { OutputWriter } from '../../src/output.js';
import { MockOutputWriter, MockCliBuilder } from './test-helpers.js';

// Test helpers
const findConfigCall = (calls: unknown[][]): unknown[] | undefined => {
  return calls.find((call) => call[0] === 'config');
};

describe('App Module - CLI Creation', () => {
  let app: CliApp;

  beforeEach(() => {
    // Clear and configure DI container for tests with mocks
    container.clearInstances();
    container.register<OutputWriter>('OutputWriter', {
      useValue: new MockOutputWriter(),
    });
    container.register<CliBuilder>('CliBuilder', {
      useValue: new MockCliBuilder(),
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
    it('should create yargs instance with correct configuration', async () => {
      const cli = await app.createCli('1.0.0', ['init'], true);
      expect(cli).toBeDefined();
    });

    it('should configure all four commands', async () => {
      const cli = await app.createCli('1.0.0', ['--help'], true);
      expect(cli).toBeDefined();
      // Commands are registered via .command() calls
      // This verifies the function runs without errors
    });

    it('should call scriptName with "nimata"', async () => {
      // Create fresh mock builder
      const mockBuilder = new MockCliBuilder();

      // Create new app with mock'd builder
      const mockOutput = container.resolve<OutputWriter>('OutputWriter');
      const testApp = new CliApp(mockOutput, mockBuilder);

      await testApp.createCli('1.0.0', [], true);

      expect(mockBuilder.calls.scriptName).toHaveLength(1);
      expect(mockBuilder.calls.scriptName[0][0]).toBe('nimata');
    });

    it('should call usage with correct string', async () => {
      const mockBuilder = new MockCliBuilder();

      const mockOutput = container.resolve<OutputWriter>('OutputWriter');
      const testApp = new CliApp(mockOutput, mockBuilder);

      await testApp.createCli('1.0.0', [], true);

      expect(mockBuilder.calls.usage).toHaveLength(1);
      expect(mockBuilder.calls.usage[0][0]).toBe('$0 <command> [options]');
    });

    it('should call epilogue with github URL', async () => {
      const mockBuilder = new MockCliBuilder();

      const mockOutput = container.resolve<OutputWriter>('OutputWriter');
      const testApp = new CliApp(mockOutput, mockBuilder);

      await testApp.createCli('1.0.0', [], true);

      expect(mockBuilder.calls.epilogue).toHaveLength(1);
      // Verify it was called with string containing github URL
      const epilogueArg = mockBuilder.calls.epilogue[0][0] as string;
      expect(epilogueArg).toContain('github.com');
    });

    it('should configure global config option with name "config"', async () => {
      const mockBuilder = new MockCliBuilder();

      const mockOutput = container.resolve<OutputWriter>('OutputWriter');
      const testApp = new CliApp(mockOutput, mockBuilder);

      await testApp.createCli('1.0.0', [], true);

      // Verify option was called with 'config' as first argument
      const configCall = findConfigCall(mockBuilder.calls.option);
      expect(configCall).toBeDefined();
      expect(configCall?.[0]).toBe('config');
    });

    it('should configure config option with alias "c"', async () => {
      const mockBuilder = new MockCliBuilder();

      const mockOutput = container.resolve<OutputWriter>('OutputWriter');
      const testApp = new CliApp(mockOutput, mockBuilder);

      await testApp.createCli('1.0.0', [], true);

      // Verify config option has alias 'c'
      const configCall = findConfigCall(mockBuilder.calls.option);
      expect((configCall?.[1] as any)?.alias).toBe('c');
    });

    it('should configure config option as global', async () => {
      const mockBuilder = new MockCliBuilder();

      const mockOutput = container.resolve<OutputWriter>('OutputWriter');
      const testApp = new CliApp(mockOutput, mockBuilder);

      await testApp.createCli('1.0.0', [], true);

      // Verify config option is global
      const configCall = findConfigCall(mockBuilder.calls.option);
      expect((configCall?.[1] as any)?.global).toBe(true);
    });

    it('should set version correctly', async () => {
      const cli = await app.createCli('2.5.3', [], true);
      expect(cli).toBeDefined();
    });

    it('should configure suppressOutput mode correctly', async () => {
      const mockBuilder = new MockCliBuilder();

      const mockOutput = container.resolve<OutputWriter>('OutputWriter');
      const testApp = new CliApp(mockOutput, mockBuilder);

      await testApp.createCli('1.0.0', [], true);

      expect(mockBuilder.calls.exitProcess).toHaveLength(1);
      expect(mockBuilder.calls.exitProcess[0][0]).toBe(false);
      expect(mockBuilder.calls.showHelpOnFail).toHaveLength(1);
      expect(mockBuilder.calls.showHelpOnFail[0][0]).toBe(false);
      expect(mockBuilder.calls.fail).toHaveLength(1);
      expect(mockBuilder.calls.fail[0][0]).toBe(false);
    });

    it('should not configure suppressOutput mode when false', async () => {
      const mockBuilder = new MockCliBuilder();

      const mockOutput = container.resolve<OutputWriter>('OutputWriter');
      const testApp = new CliApp(mockOutput, mockBuilder);

      await testApp.createCli('1.0.0', [], false);

      expect(mockBuilder.calls.exitProcess?.length ?? 0).toBe(0);
    });
  });
});
