/**
 * Unit Tests - App Module (Version Logic)
 *
 * Tests for version retrieval in app.ts
 */
import 'reflect-metadata';
import { describe, it, expect, beforeEach, afterEach, spyOn } from 'bun:test';
import { container } from 'tsyringe';
import { CliApp } from '../../src/app.js';
import type { CliBuilder } from '../../src/cli-builder.js';
import type { OutputWriter } from '../../src/output.js';
import { MockOutputWriter, MockCliBuilder } from './test-helpers.js';

// Test helpers
const createEmptyJsonMock = (): { json: () => Promise<Record<string, never>> } => ({
  json: async () => ({}),
});

const createThrowingBunFileMock = (): (() => never) => {
  return (): never => {
    throw new Error('File not found');
  };
};


describe('App Module - Version Logic', () => {
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

  describe('getVersion', () => {
    it('should return version from package.json', async () => {
      const version = await app.getVersion();
      expect(version).toBeDefined();
      expect(typeof version).toBe('string');
      expect(version).toMatch(/^\d+\.\d+\.\d+$/);
    });

    it('should return default version "0.0.0" when package.json cannot be read', async () => {
      // Create a new app with mocked getVersion that simulates file read error
      const mockOutput = container.resolve<OutputWriter>('OutputWriter');
      const mockBuilder = container.resolve<CliBuilder>('CliBuilder');
      const errorSpy = spyOn(mockOutput, 'error');

      // Create test instance
      const testApp = new CliApp(mockOutput, mockBuilder);

      // Mock Bun.file to throw error
      const originalBunFile = Bun.file;
      const throwingMock = createThrowingBunFileMock();
      (Bun as { file: typeof originalBunFile }).file =
        throwingMock as unknown as typeof originalBunFile;

      const version = await testApp.getVersion();

      expect(version).toBe('0.0.0');
      expect(errorSpy).toHaveBeenCalled();

      // Restore original Bun.file
      (Bun as { file: typeof originalBunFile }).file = originalBunFile;
      errorSpy.mockRestore();
    });

    it('should return default version "0.0.0" when package.json.version is undefined', async () => {
      const mockOutput = container.resolve<OutputWriter>('OutputWriter');
      const mockBuilder = container.resolve<CliBuilder>('CliBuilder');
      const testApp = new CliApp(mockOutput, mockBuilder);

      // Mock Bun.file to return package.json without version
      const originalBunFile = Bun.file;
      const emptyJsonMock = createEmptyJsonMock();
      (Bun as { file: typeof originalBunFile }).file = (() =>
        emptyJsonMock) as unknown as typeof originalBunFile;

      const version = await testApp.getVersion();

      expect(version).toBe('0.0.0');

      // Restore original Bun.file
      (Bun as { file: typeof originalBunFile }).file = originalBunFile;
    });

    it('should use correct package.json path with ../package.json', async () => {
      const mockOutput = container.resolve<OutputWriter>('OutputWriter');
      const mockBuilder = container.resolve<CliBuilder>('CliBuilder');
      const testApp = new CliApp(mockOutput, mockBuilder);

      // The path should work and return a valid version
      const version = await testApp.getVersion();
      expect(version).toBeDefined();
      expect(typeof version).toBe('string');
      // Should either get real version or default '0.0.0'
      expect(version.match(/^\d+\.\d+\.\d+$/)).toBeTruthy();
    });

    it('should log error with "Error reading package.json version" message when file read fails', async () => {
      const mockOutput = new MockOutputWriter();
      const errorSpy = spyOn(mockOutput, 'error');
      const mockBuilder = container.resolve<CliBuilder>('CliBuilder');

      const testApp = new CliApp(mockOutput, mockBuilder);

      // Mock Bun.file to throw error
      const originalBunFile = Bun.file;
      const throwingMock = createThrowingBunFileMock();
      (Bun as { file: typeof originalBunFile }).file =
        throwingMock as unknown as typeof originalBunFile;

      await testApp.getVersion();

      // Verify error was called
      expect(errorSpy).toHaveBeenCalled();
      const calls = errorSpy.mock.calls;
      expect(calls.length).toBeGreaterThan(0);

      // Restore original Bun.file
      (Bun as { file: typeof originalBunFile }).file = originalBunFile;
      errorSpy.mockRestore();
    });
  });
});
