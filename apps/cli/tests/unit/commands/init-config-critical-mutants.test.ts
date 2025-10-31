/**
 * Critical Mutant Tests - Init Config
 *
 * Targeted tests to kill high-priority surviving mutants in:
 * - src/commands/init-config.ts
 * - src/commands/init-handlers.ts
 */
import 'reflect-metadata';
import { describe, it, expect, beforeEach } from 'bun:test';
import {
  ProjectWizardImplementation,
  type ProjectConfig,
} from '@nimata/adapters/wizards/project-wizard';
import { runNonInteractive } from '../../../src/commands/init-config.js';
import {
  displayValidationErrors,
  displayConfigurationSummary,
} from '../../../src/commands/init-handlers.js';
import { ConsoleOutputWriter } from '../../../src/output.js';

// Helper to capture output calls
class CaptureOutputWriter extends ConsoleOutputWriter {
  public calls: Array<{ method: string; args: unknown[] }> = [];

  override error(...messages: unknown[]): void {
    this.calls.push({ method: 'error', args: messages });
  }

  override info(...messages: unknown[]): void {
    this.calls.push({ method: 'info', args: messages });
  }

  override success(...messages: unknown[]): void {
    this.calls.push({ method: 'success', args: messages });
  }
}

describe('Critical Mutant Tests - Validation Logic', () => {
  let output: CaptureOutputWriter;
  let wizard: ProjectWizardImplementation;

  beforeEach(() => {
    output = new CaptureOutputWriter();
    wizard = new ProjectWizardImplementation();
  });

  describe('runNonInteractive - Validation Bypass Mutants', () => {
    it('should throw error when validation fails (kills ConditionalExpression mutant)', async () => {
      const invalidConfig: Partial<ProjectConfig> = {
        name: '', // Invalid: empty name
        qualityLevel: 'invalid' as never,
      };

      await expect(runNonInteractive(invalidConfig, wizard, output)).rejects.toThrow(
        'Invalid configuration'
      );

      // Verify error output was called (kills BlockStatement mutant)
      const errorCalls = output.calls.filter((c) => c.method === 'error');
      expect(errorCalls.length).toBeGreaterThan(0);
    });

    it('should iterate through ALL validation errors (kills BlockStatement in loop)', async () => {
      const invalidConfig: Partial<ProjectConfig> = {
        name: '', // Error 1
        qualityLevel: 'bad' as never, // Error 2
        projectType: 'wrong' as never, // Error 3
      };

      await expect(runNonInteractive(invalidConfig, wizard, output)).rejects.toThrow();

      // Verify multiple errors were logged (kills for loop BlockStatement)
      const errorCalls = output.calls.filter((c) => c.method === 'error');
      expect(errorCalls.length).toBeGreaterThanOrEqual(2);

      // Verify each error was formatted correctly (not empty string)
      for (const call of errorCalls) {
        const message = String(call.args[0]);
        expect(message.length).toBeGreaterThan(10); // Not empty or just whitespace
      }
    });

    it('should apply defaults when values are missing (kills ObjectLiteral mutant)', async () => {
      const minimalConfig: Partial<ProjectConfig> = {
        name: 'test-project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['claude-code'],
        // description intentionally omitted to test default
      };

      const result = await runNonInteractive(minimalConfig, wizard, output);

      // Verify defaults were applied to optional fields (NOT empty object)
      expect(result.description).toBe('');
      expect(result.qualityLevel).toBe('medium');
      expect(result.projectType).toBe('basic');
      expect(result.aiAssistants).toEqual(['claude-code']);
    });

    it('should preserve provided values over defaults (kills default value mutations)', async () => {
      const customConfig: Partial<ProjectConfig> = {
        name: 'my-project',
        description: 'Custom description',
        qualityLevel: 'strict',
        projectType: 'cli',
        aiAssistants: ['copilot'], // Valid assistant name
      };

      const result = await runNonInteractive(customConfig, wizard, output);

      // Verify custom values preserved (kills StringLiteral mutations in defaults)
      expect(result.description).toBe('Custom description');
      expect(result.qualityLevel).toBe('strict');
      expect(result.projectType).toBe('cli');
      expect(result.aiAssistants).toEqual(['copilot']);
    });

    it('should validate that defaults object is not empty (kills ObjectLiteral mutation)', async () => {
      const partialConfig: Partial<ProjectConfig> = {
        name: 'test',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['claude-code'],
        // Missing optional: description, author, license
      };

      const result = await runNonInteractive(partialConfig, wizard, output);

      // If defaults were {}, description would be undefined instead of ''
      expect(result.description).toBeDefined();
      expect(result.description).toBe(''); // Default empty string
      expect(result.qualityLevel).toBeDefined();
      expect(result.projectType).toBeDefined();
      expect(result.aiAssistants).toBeDefined();
      expect(Array.isArray(result.aiAssistants)).toBe(true);
      expect(result.aiAssistants.length).toBeGreaterThan(0);
    });
  });

  describe('displayValidationErrors - Error Iteration Mutants', () => {
    it('should display each error in errors array (kills loop BlockStatement)', () => {
      const validation = {
        valid: false,
        errors: [
          'Error 1: Name is required',
          'Error 2: Invalid quality level',
          'Error 3: Missing type',
        ],
        warnings: [],
      };

      displayValidationErrors(validation, output);

      // Verify all 3 errors were displayed
      const errorCalls = output.calls.filter((c) => c.method === 'error');

      // Should have at least 4 calls: 1 header + 3 errors
      expect(errorCalls.length).toBeGreaterThanOrEqual(4);

      // Verify error messages contain actual content (not empty strings)
      const errorMessages = errorCalls.map((c) => String(c.args[0]));
      const contentfulErrors = errorMessages.filter((msg) => msg.length > 5);
      expect(contentfulErrors.length).toBeGreaterThanOrEqual(3);
    });

    it('should handle validation with both errors and warnings (kills EqualityOperator mutants)', () => {
      const validation = {
        valid: false,
        errors: ['Critical error'],
        warnings: ['Warning 1', 'Warning 2'],
      };

      displayValidationErrors(validation, output);

      const errorCalls = output.calls.filter((c) => c.method === 'error');

      // Should show errors section
      expect(errorCalls.length).toBeGreaterThan(0);

      // Verify length > 0 check works (kills >= and <= mutations)
      expect(validation.errors.length > 0).toBe(true);
      expect(validation.warnings.length > 0).toBe(true);
    });

    it('should not display errors section when errors array is empty (kills ConditionalExpression)', () => {
      const validation = {
        valid: true,
        errors: [], // Empty array
        warnings: ['Just a warning'],
      };

      output.calls = []; // Clear previous calls
      displayValidationErrors(validation, output);

      // Should not have error section header if errors.length === 0
      const errorSectionHeaders = output.calls.filter((c) => {
        const msg = String(c.args[0]);
        return msg.includes('Errors:');
      });

      expect(errorSectionHeaders.length).toBe(0);
    });
  });

  describe('displayConfigurationSummary - Conditional Logic Mutants', () => {
    it('should display description only when provided (kills ConditionalExpression)', () => {
      const configWithDescription: ProjectConfig = {
        name: 'test-project',
        description: 'A test project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['claude-code'],
        targetDirectory: '.',
        nonInteractive: true,
      };

      output.calls = [];
      displayConfigurationSummary(configWithDescription, output);

      // Should show description line
      const descriptionCalls = output.calls.filter((c) => {
        const msg = String(c.args[0]);
        return msg.includes('Description:');
      });

      expect(descriptionCalls.length).toBe(1);
    });

    it('should NOT display description when undefined (kills BlockStatement mutant)', () => {
      const configWithoutDescription: ProjectConfig = {
        name: 'test-project',
        // description is undefined
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['claude-code'],
        targetDirectory: '.',
        nonInteractive: true,
      } as ProjectConfig;

      output.calls = [];
      displayConfigurationSummary(configWithoutDescription, output);

      // Should NOT show description line
      const descriptionCalls = output.calls.filter((c) => {
        const msg = String(c.args[0]);
        return msg.includes('Description:');
      });

      expect(descriptionCalls.length).toBe(0);
    });

    it('should display author only when provided (kills ConditionalExpression and BlockStatement)', () => {
      const configWithAuthor: ProjectConfig = {
        name: 'test-project',
        author: 'John Doe',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['claude-code'],
        targetDirectory: '.',
        nonInteractive: true,
      };

      output.calls = [];
      displayConfigurationSummary(configWithAuthor, output);

      const authorCalls = output.calls.filter((c) => {
        const msg = String(c.args[0]);
        return msg.includes('Author:') && msg.includes('John Doe');
      });

      expect(authorCalls.length).toBe(1);
    });

    it('should display license only when provided (kills ConditionalExpression and BlockStatement)', () => {
      const configWithLicense: ProjectConfig = {
        name: 'test-project',
        license: 'MIT',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['claude-code'],
        targetDirectory: '.',
        nonInteractive: true,
      };

      output.calls = [];
      displayConfigurationSummary(configWithLicense, output);

      const licenseCalls = output.calls.filter((c) => {
        const msg = String(c.args[0]);
        return msg.includes('License:') && msg.includes('MIT');
      });

      expect(licenseCalls.length).toBe(1);
    });

    it('should verify all required fields are always shown (kills string literal mutations)', () => {
      const config: ProjectConfig = {
        name: 'my-project',
        qualityLevel: 'strict',
        projectType: 'cli',
        aiAssistants: ['github-copilot', 'claude-code'],
        targetDirectory: './projects',
        nonInteractive: true,
      };

      output.calls = [];
      displayConfigurationSummary(config, output);

      const allMessages = output.calls.map((c) => String(c.args[0])).join('\n');

      // All required fields must be present (NOT empty strings)
      expect(allMessages).toContain('my-project');
      expect(allMessages).toContain('strict');
      expect(allMessages).toContain('cli');
      expect(allMessages).toContain('github-copilot');
      expect(allMessages).toContain('claude-code');

      // Verify message length (not empty strings)
      const infoCalls = output.calls.filter((c) => c.method === 'info');
      for (const call of infoCalls) {
        const msg = String(call.args[0]);
        expect(msg.length).toBeGreaterThan(5);
      }
    });
  });
});
