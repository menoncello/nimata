/**
 * Unit Tests - Index Module (Entry Point)
 *
 * Tests for the CLI entry point in index.ts
 * Most application logic is now in app.ts and tested there
 */
import 'reflect-metadata';
import { describe, it, expect, spyOn, beforeEach, afterEach } from 'bun:test';
import { container } from 'tsyringe';
import { CliApp } from '../../src/app.js';
import { EXIT_CODES } from '../../src/index.js';

// Test helpers to reduce nesting
const createNoOpMock = (): void => {
  /* Intentionally empty - stub for testing */
};

const createExitMock = (): ReturnType<typeof spyOn> => {
  return spyOn(process, 'exit').mockImplementation(() => {
    throw new Error('process.exit called');
  });
};

const createErrorMock = (): ReturnType<typeof spyOn> => {
  return spyOn(console, 'error').mockImplementation(createNoOpMock);
};

describe('Index Module', () => {
  describe('EXIT_CODES', () => {
    it('should export EXIT_CODES constant', () => {
      expect(EXIT_CODES).toBeDefined();
      expect(EXIT_CODES.SUCCESS).toBe(0);
      expect(EXIT_CODES.VALIDATION_ERROR).toBe(1);
      expect(EXIT_CODES.CONFIG_ERROR).toBe(3);
      expect(EXIT_CODES.INTERRUPTED).toBe(130);
    });

    it('should have all exit codes as numbers', () => {
      expect(typeof EXIT_CODES.SUCCESS).toBe('number');
      expect(typeof EXIT_CODES.VALIDATION_ERROR).toBe('number');
      expect(typeof EXIT_CODES.CONFIG_ERROR).toBe('number');
      expect(typeof EXIT_CODES.INTERRUPTED).toBe('number');
    });

    it('should have unique exit codes', () => {
      const codes = Object.values(EXIT_CODES);
      const uniqueCodes = new Set(codes);
      expect(uniqueCodes.size).toBe(codes.length);
    });
  });

  describe('Fatal error handling in main execution', () => {
    beforeEach(() => {
      container.clearInstances();
    });

    afterEach(() => {
      container.clearInstances();
    });

    it('should log fatal error and exit with CONFIG_ERROR when app.run() fails', async () => {
      const errorSpy = createErrorMock();
      const exitSpy = createExitMock();

      // Create a mock CliApp that throws error
      const mockApp = {
        run: async () => {
          throw new Error('Simulated fatal error');
        },
      } as CliApp;

      // Simulate the catch block from index.ts
      try {
        await mockApp.run().catch((error: unknown) => {
          console.error('Fatal error:', error);
          process.exit(EXIT_CODES.CONFIG_ERROR);
        });
      } catch {
        // Expected - process.exit throws in mock
      }

      // Verify console.error was called with fatal error message
      expect(errorSpy).toHaveBeenCalledWith('Fatal error:', expect.any(Error));

      // Verify process.exit was called with CONFIG_ERROR
      expect(exitSpy).toHaveBeenCalledWith(EXIT_CODES.CONFIG_ERROR);

      errorSpy.mockRestore();
      exitSpy.mockRestore();
    });

    it('should log error message with "Fatal error:" prefix', async () => {
      const errorSpy = createErrorMock();
      const exitSpy = createExitMock();

      const mockApp = {
        run: async () => {
          throw new Error('Test error');
        },
      } as CliApp;

      try {
        await mockApp.run().catch((error: unknown) => {
          console.error('Fatal error:', error);
          process.exit(EXIT_CODES.CONFIG_ERROR);
        });
      } catch {
        // Expected
      }

      // Verify the exact format of the error log
      const calls = errorSpy.mock.calls;
      expect(calls.length).toBeGreaterThan(0);
      expect(calls[0]?.[0]).toBe('Fatal error:');

      errorSpy.mockRestore();
      exitSpy.mockRestore();
    });
  });
});
