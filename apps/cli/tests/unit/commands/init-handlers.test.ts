import type { ProjectConfig } from '@nimata/adapters/wizards/project-wizard';
import { describe, expect, test, mock, beforeEach } from 'bun:test';
import {
  displayValidationErrors,
  displayValidationWarnings,
  displayConfigurationSummary,
} from '../../../src/commands/init-handlers.js';
import type { OutputWriter } from '../../../src/output.js';

const noop = (): void => {
  // Mock function - intentionally empty
};

describe('Init Command Handlers', () => {
  let mockOutput: OutputWriter;

  beforeEach(() => {
    mockOutput = {
      info: mock(noop),
      error: mock(noop),
      success: mock(noop),
      debug: mock(noop),
    };
  });

  describe('displayValidationErrors', () => {
    test('should display validation errors', () => {
      const validation = {
        valid: false,
        errors: ['Error 1', 'Error 2'],
      };

      displayValidationErrors(validation, mockOutput);

      expect(mockOutput.error).toHaveBeenCalled();
      expect(mockOutput.error).toHaveBeenCalledWith(expect.stringContaining('validation failed'));
    });

    test('should display validation errors and warnings', () => {
      const validation = {
        valid: false,
        errors: ['Error 1'],
        warnings: ['Warning 1'],
      };

      displayValidationErrors(validation, mockOutput);

      expect(mockOutput.error).toHaveBeenCalled();
    });

    test('should handle empty errors array', () => {
      const validation = {
        valid: false,
        errors: [],
      };

      displayValidationErrors(validation, mockOutput);

      expect(mockOutput.error).toHaveBeenCalled();
    });

    test('should handle empty warnings array', () => {
      const validation = {
        valid: false,
        errors: ['Error 1'],
        warnings: [],
      };

      displayValidationErrors(validation, mockOutput);

      expect(mockOutput.error).toHaveBeenCalled();
    });
  });

  describe('displayValidationWarnings', () => {
    test('should display validation warnings', () => {
      const validation = {
        warnings: ['Warning 1', 'Warning 2'],
      };

      displayValidationWarnings(validation, mockOutput);

      expect(mockOutput.info).toHaveBeenCalled();
    });

    test('should not display anything if no warnings', () => {
      const validation = {
        warnings: [],
      };

      displayValidationWarnings(validation, mockOutput);

      expect(mockOutput.info).not.toHaveBeenCalled();
    });

    test('should handle undefined warnings', () => {
      const validation = {};

      displayValidationWarnings(validation, mockOutput);

      expect(mockOutput.info).not.toHaveBeenCalled();
    });
  });

  describe('displayConfigurationSummary', () => {
    test('should display complete configuration summary', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        description: 'Test Description',
        projectType: 'cli',
        qualityLevel: 'strict',
        aiAssistants: ['claude-code', 'copilot'],
        targetDirectory: '/test/dir',
        author: 'Test Author',
        license: 'MIT',
      };

      displayConfigurationSummary(config, mockOutput);

      expect(mockOutput.success).toHaveBeenCalled();
      expect(mockOutput.info).toHaveBeenCalled();
    });

    test('should display configuration without optional fields', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        projectType: 'cli',
        qualityLevel: 'medium',
        aiAssistants: ['claude-code'],
        targetDirectory: '/test/dir',
      };

      displayConfigurationSummary(config, mockOutput);

      expect(mockOutput.success).toHaveBeenCalled();
      expect(mockOutput.info).toHaveBeenCalled();
    });
  });

  // Note: generateProject tests require dependency injection or module mocking
  // which is complex in the current setup. Integration tests cover this functionality.
});
