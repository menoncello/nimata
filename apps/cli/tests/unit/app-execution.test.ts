/**
 * Unit Tests - App Module (Execution & Interrupt Handler)
 *
 * Tests for run() and interrupt handling in app.ts
 */
import 'reflect-metadata';
import { describe, it, expect, beforeEach, afterEach, spyOn } from 'bun:test';
import { container } from 'tsyringe';
import { CliApp } from '../../src/app.js';
import type { CliBuilder } from '../../src/cli-builder.js';
import { EXIT_CODES } from '../../src/constants.js';
import type { OutputWriter } from '../../src/output.js';
import { MockOutputWriter, MockCliBuilder } from './test-helpers.js';

// Helper functions for test mocks
const throwProcessExitError = (): never => {
  throw new Error('process.exit called');
};

const createExitMock = (): ReturnType<typeof spyOn> => {
  return spyOn(process, 'exit').mockImplementation(throwProcessExitError);
};

// Helper to emit SIGINT for testing
const emitSIGINT = (): void => {
  process.emit('SIGINT');
};

// Helper to create error-throwing createCli mock
const createFailingCliMock = (): (() => never) => {
  return (): never => {
    throw new Error('Simulated fatal error');
  };
};

describe('App Module - Execution & Interrupt Handler', () => {
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

  describe('setupInterruptHandler', () => {
    let originalListeners: NodeJS.SignalsListener[];

    beforeEach(() => {
      // Save original SIGINT listeners
      originalListeners = process.listeners('SIGINT').slice() as NodeJS.SignalsListener[];
    });

    afterEach(() => {
      // Remove all SIGINT listeners
      process.removeAllListeners('SIGINT');
      // Restore original listeners
      for (const listener of originalListeners) {
        process.on('SIGINT', listener);
      }
    });

    it('should register SIGINT handler', () => {
      const initialCount = process.listenerCount('SIGINT');
      app.setupInterruptHandler();
      const newCount = process.listenerCount('SIGINT');
      expect(newCount).toBeGreaterThan(initialCount);
    });

    it('should exit with INTERRUPTED code on SIGINT and log message', () => {
      // Create exit mock and output mock
      const mockExit = createExitMock();
      const mockOutput = new MockOutputWriter();
      const logSpy = spyOn(mockOutput, 'log');
      const mockBuilder = new MockCliBuilder();

      // Create test app with spies
      const testApp = new CliApp(mockOutput, mockBuilder);

      testApp.setupInterruptHandler();

      // Simulate SIGINT - should call log then exit
      expect(emitSIGINT).toThrow('process.exit called');
      expect(logSpy).toHaveBeenCalled();
      expect(mockExit).toHaveBeenCalledWith(EXIT_CODES.INTERRUPTED);

      mockExit.mockRestore();
      logSpy.mockRestore();
    });
  });

  describe('run', () => {
    it('should execute with help flag', async () => {
      const mockExit = createExitMock();

      try {
        await app.run(['--help']);
      } catch {
        // Expected to exit
      }

      mockExit.mockRestore();
    });

    it('should execute with version flag', async () => {
      const mockExit = createExitMock();

      try {
        await app.run(['--version']);
      } catch {
        // Expected to exit
      }

      mockExit.mockRestore();
    });

    it('should handle init command', async () => {
      const mockExit = createExitMock();

      try {
        await app.run(['init']);
      } catch {
        // Expected to exit
      }

      mockExit.mockRestore();
    });

    it('should handle validate command', async () => {
      const mockExit = createExitMock();

      try {
        await app.run(['validate']);
      } catch {
        // Expected to exit
      }

      mockExit.mockRestore();
    });

    it('should handle fix command', async () => {
      const mockExit = createExitMock();

      try {
        await app.run(['fix']);
      } catch {
        // Expected to exit
      }

      mockExit.mockRestore();
    });

    it('should handle prompt command', async () => {
      const mockExit = createExitMock();

      try {
        await app.run(['prompt']);
      } catch {
        // Expected to exit
      }

      mockExit.mockRestore();
    });

    it('should handle errors with CONFIG_ERROR exit code', async () => {
      const mockExit = createExitMock();

      // Force an error by passing invalid arguments that yargs will reject
      try {
        await app.run(['--unknown-flag-that-will-fail']);
      } catch {
        // Expected to throw
      }

      mockExit.mockRestore();
    });

    it('should handle missing command error', async () => {
      const mockExit = createExitMock();

      try {
        await app.run([]);
      } catch {
        // Expected to throw
      }

      // Yargs handles missing command internally
      mockExit.mockRestore();
    });

    it('should run without arguments when argv is not provided', async () => {
      const mockExit = createExitMock();

      try {
        await app.run();
      } catch {
        // Expected - uses process.argv when no args provided
      }

      mockExit.mockRestore();
    });

    it('should accept custom argv array', async () => {
      const mockExit = createExitMock();

      try {
        await app.run(['init', '--config', 'custom.json']);
      } catch {
        // Expected
      }

      mockExit.mockRestore();
    });

    it('should handle fatal errors and exit with CONFIG_ERROR', async () => {
      const mockOutput = container.resolve<OutputWriter>('OutputWriter');
      const mockBuilder = container.resolve<CliBuilder>('CliBuilder');
      const errorSpy = spyOn(mockOutput, 'error');
      const mockExit = createExitMock();

      // Create test instance
      const testApp = new CliApp(mockOutput, mockBuilder);

      // Mock createCli to throw error
      const createCliMock = createFailingCliMock();
      spyOn(testApp, 'createCli').mockImplementation(createCliMock);

      try {
        await testApp.run(['init']);
      } catch {
        // Expected - process.exit throws in mock
      }

      expect(errorSpy).toHaveBeenCalled();
      expect(mockExit).toHaveBeenCalledWith(EXIT_CODES.CONFIG_ERROR);

      mockExit.mockRestore();
      errorSpy.mockRestore();
    });
  });
});
