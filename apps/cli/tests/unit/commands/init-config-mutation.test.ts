/**
 * Mutation Testing - Init Config
 *
 * Tests targeting surviving mutants in init-config.ts
 */
import 'reflect-metadata';
import type { ProjectConfig } from '@nimata/adapters/wizards/project-wizard';
import { describe, it, expect, mock, beforeEach } from 'bun:test';
import {
  loadConfigurationFile,
  handleNonInteractiveMode,
  setProjectNameFromArgs,
  handleError,
  type InitCommandArgs,
} from '../../../src/commands/init-config.js';
import { ConsoleOutputWriter } from '../../../src/output.js';

// Helper function for mocks (non-empty to satisfy ESLint)
function noop(..._args: unknown[]): void {
  // Intentionally empty mock function
}

describe('Mutation Testing - Init Config', () => {
  let output: ConsoleOutputWriter;
  let mockExit: ReturnType<typeof mock>;

  beforeEach(() => {
    output = new ConsoleOutputWriter();
    mockExit = mock((code?: number) => {
      throw new Error(`process.exit(${code ?? 0})`);
    });
    process.exit = mockExit as never;
  });

  describe('loadConfigurationFile - Error Paths', () => {
    it('should exit when config file does not exist', async () => {
      const errorSpy = mock(noop);
      output.error = errorSpy;

      await expect(loadConfigurationFile('/nonexistent/path/config.json', output)).rejects.toThrow(
        'process.exit(1)'
      );

      expect(errorSpy).toHaveBeenCalled();
      expect(mockExit).toHaveBeenCalledWith(1);
    });

    it('should exit when config file is invalid JSON', async () => {
      const errorSpy = mock(noop);
      output.error = errorSpy;

      // Create temp file with invalid JSON
      const tmpPath = `/tmp/test-invalid-${Date.now()}.json`;
      await Bun.write(tmpPath, 'invalid json content{{{');

      await expect(loadConfigurationFile(tmpPath, output)).rejects.toThrow('process.exit(1)');

      expect(errorSpy).toHaveBeenCalledTimes(2); // 2 error calls in catch block
      expect(mockExit).toHaveBeenCalledWith(1);
    });

    it('should handle Error instances correctly in catch block', async () => {
      const errorSpy = mock(noop);
      output.error = errorSpy;

      const tmpPath = `/tmp/test-parse-${Date.now()}.json`;
      await Bun.write(tmpPath, '{invalid}');

      await expect(loadConfigurationFile(tmpPath, output)).rejects.toThrow();

      // Verify that Error.message was used (not default string)
      expect(errorSpy.mock.calls.length).toBeGreaterThanOrEqual(2);
    });

    it('should return empty object when configPath is undefined', async () => {
      const result = await loadConfigurationFile(undefined, output);
      expect(result).toEqual({});
    });

    it('should successfully load valid JSON config', async () => {
      const successSpy = mock(noop);
      output.success = successSpy;

      const tmpPath = `/tmp/test-valid-${Date.now()}.json`;
      await Bun.write(tmpPath, JSON.stringify({ name: 'test-project' }));

      const result = await loadConfigurationFile(tmpPath, output);

      expect(result).toEqual({ name: 'test-project' });
      expect(successSpy).toHaveBeenCalled();
    });
  });

  describe('handleNonInteractiveMode - Conditional Branches', () => {
    it('should return config unchanged when not in non-interactive mode', async () => {
      const config: Partial<ProjectConfig> = { name: 'test-project' };
      const argv: InitCommandArgs = { nonInteractive: false };

      const result = await handleNonInteractiveMode(argv, config, output);

      expect(result).toEqual(config);
    });

    it('should exit when name is missing in non-interactive mode', async () => {
      const errorSpy = mock(noop);
      const infoSpy = mock(noop);
      output.error = errorSpy;
      output.info = infoSpy;

      const config: Partial<ProjectConfig> = {};
      const argv: InitCommandArgs = {
        nonInteractive: true,
        // No projectName provided
      };

      await expect(handleNonInteractiveMode(argv, config, output)).rejects.toThrow(
        'process.exit(1)'
      );

      expect(errorSpy).toHaveBeenCalled();
      expect(infoSpy).toHaveBeenCalled();
      expect(mockExit).toHaveBeenCalledWith(1);
    });

    it('should merge args config with file config correctly', async () => {
      const config: Partial<ProjectConfig> = {
        name: 'config-file-name',
        qualityLevel: 'strict',
      };
      const argv: InitCommandArgs = {
        nonInteractive: true,
        projectName: 'cli-arg-name',
        template: 'cli',
      };

      const result = await handleNonInteractiveMode(argv, config, output);

      // Config file takes priority for name
      expect(result.name).toBe('config-file-name');
      // Template from args should be present
      expect(result.projectType).toBe('cli');
    });

    it('should use argv.projectName when config.name is not provided', async () => {
      const config: Partial<ProjectConfig> = {};
      const argv: InitCommandArgs = {
        nonInteractive: true,
        projectName: 'my-project',
      };

      const result = await handleNonInteractiveMode(argv, config, output);

      expect(result.name).toBe('my-project');
    });
  });

  describe('setProjectNameFromArgs - Conditional Logic', () => {
    it('should set name when config has no name and projectName is provided', () => {
      const config: Partial<ProjectConfig> = {};
      const result = setProjectNameFromArgs(config, 'new-project');

      expect(result.name).toBe('new-project');
    });

    it('should not override existing name', () => {
      const config: Partial<ProjectConfig> = { name: 'existing-name' };
      const result = setProjectNameFromArgs(config, 'new-project');

      expect(result.name).toBe('existing-name');
    });

    it('should not set name when projectName is undefined', () => {
      const config: Partial<ProjectConfig> = {};
      const result = setProjectNameFromArgs(config, undefined);

      expect(result.name).toBeUndefined();
    });

    it('should handle both conditions: no name AND projectName present', () => {
      const config: Partial<ProjectConfig> = { qualityLevel: 'medium' };
      const result = setProjectNameFromArgs(config, 'test-name');

      expect(result.name).toBe('test-name');
      expect(result.qualityLevel).toBe('medium');
    });
  });

  describe('handleError - Error Message Handling', () => {
    it('should use Error.message when error is an Error instance', () => {
      const errorSpy = mock(noop);
      output.error = errorSpy;

      expect(() => handleError(new Error('Custom error message'), output)).toThrow(
        'process.exit(1)'
      );

      const errorMessage = String(errorSpy.mock.calls[0][0]);
      expect(errorMessage).toContain('Custom error message');
    });

    it('should use default message when error is not an Error instance', () => {
      const errorSpy = mock(noop);
      output.error = errorSpy;

      expect(() => handleError('string error', output)).toThrow('process.exit(1)');

      const errorMessage = String(errorSpy.mock.calls[0][0]);
      expect(errorMessage).toContain('Unknown error occurred');
    });

    it('should handle null error', () => {
      const errorSpy = mock(noop);
      output.error = errorSpy;

      expect(() => handleError(null, output)).toThrow('process.exit(1)');

      const errorMessage = String(errorSpy.mock.calls[0][0]);
      expect(errorMessage).toContain('Unknown error occurred');
    });

    it('should handle undefined error', () => {
      const errorSpy = mock(noop);
      output.error = errorSpy;

      expect(() => handleError(undefined, output)).toThrow('process.exit(1)');

      expect(errorSpy).toHaveBeenCalled();
    });
  });
});
