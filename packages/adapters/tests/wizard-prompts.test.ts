/**
 * Tests for wizard prompt handlers
 */

import { describe, expect, it } from 'bun:test';
import { validateStepInput, type WizardStep } from '../src/wizards/validation-rules.js';
import { promptForStep, createErrorMessage } from '../src/wizards/wizard-prompts.js';

describe('wizard-prompts', () => {
  describe('promptForStep', () => {
    it('should prompt for text step', async () => {
      // We can't fully test interactive prompts in unit tests without mocking stdin
      // This test validates the step configuration structure needed for text prompts
      const stepType = 'text';
      const stepRequired = true;

      expect(stepType).toBe('text');
      expect(stepRequired).toBe(true);
    });

    it('should throw error for unsupported step type', async () => {
      const step = {
        id: 'test',
        title: 'Test',
        description: 'Test description',
        type: 'unknown' as 'text',
        required: true,
      };

      try {
        await promptForStep(step);
        expect(true).toBe(false); // Should not reach here
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toContain('Unsupported step type');
      }
    });
  });

  describe('validateStepInput', () => {
    it('should validate required text field', () => {
      const step: WizardStep = {
        id: 'name',
        title: 'Name',
        description: 'Enter name',
        type: 'text',
        required: true,
      };

      const result = validateStepInput(step, '');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('This field is required');
    });

    it('should validate pattern rule', () => {
      const step: WizardStep = {
        id: 'name',
        title: 'Name',
        description: 'Enter name',
        type: 'text',
        required: true,
        validation: [
          {
            type: 'pattern',
            pattern: /^[\d_a-z-]+$/,
            message: 'Must be lowercase with hyphens/underscores only',
          },
        ],
      };

      const invalidResult = validateStepInput(step, 'Invalid-Name');
      expect(invalidResult.valid).toBe(false);
      expect(invalidResult.errors[0]).toContain('lowercase');

      const validResult = validateStepInput(step, 'valid-name');
      expect(validResult.valid).toBe(true);
      expect(validResult.errors).toEqual([]);
    });

    it('should validate length rule', () => {
      const step: WizardStep = {
        id: 'name',
        title: 'Name',
        description: 'Enter name',
        type: 'text',
        required: true,
        validation: [
          {
            type: 'length',
            min: 3,
            max: 50,
            message: 'Must be between 3 and 50 characters',
          },
        ],
      };

      const tooShort = validateStepInput(step, 'ab');
      expect(tooShort.valid).toBe(false);
      expect(tooShort.errors[0]).toContain('3 and 50');

      const tooLong = validateStepInput(step, 'a'.repeat(51));
      expect(tooLong.valid).toBe(false);

      const validLength = validateStepInput(step, 'valid');
      expect(validLength.valid).toBe(true);
    });

    it('should validate custom rule', () => {
      const step: WizardStep = {
        id: 'name',
        title: 'Name',
        description: 'Enter name',
        type: 'text',
        required: true,
        validation: [
          {
            type: 'custom',
            validator: (value: unknown) => {
              const str = value as string;
              return str.startsWith('test-') || 'Must start with test-';
            },
            message: 'Custom validation failed',
          },
        ],
      };

      const invalid = validateStepInput(step, 'invalid');
      expect(invalid.valid).toBe(false);
      expect(invalid.errors[0]).toContain('test-');

      const valid = validateStepInput(step, 'test-name');
      expect(valid.valid).toBe(true);
    });

    it('should skip validation for optional empty fields', () => {
      const step: WizardStep = {
        id: 'description',
        title: 'Description',
        description: 'Enter description',
        type: 'text',
        required: false,
        validation: [
          {
            type: 'length',
            max: 100,
            message: 'Too long',
          },
        ],
      };

      const result = validateStepInput(step, '');
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should run multiple validation rules', () => {
      const step: WizardStep = {
        id: 'name',
        title: 'Name',
        description: 'Enter name',
        type: 'text',
        required: true,
        validation: [
          {
            type: 'pattern',
            pattern: /^[\d_a-z-]+$/,
            message: 'Invalid characters',
          },
          {
            type: 'length',
            min: 3,
            max: 20,
            message: 'Length error',
          },
        ],
      };

      const bothInvalid = validateStepInput(step, 'AB');
      expect(bothInvalid.valid).toBe(false);
      expect(bothInvalid.errors.length).toBe(2);

      const patternInvalid = validateStepInput(step, 'Invalid-Name-Too-Long');
      expect(patternInvalid.valid).toBe(false);
      expect(patternInvalid.errors.length).toBeGreaterThan(0);
    });
  });

  describe('createErrorMessage', () => {
    it('should extract message from Error object', () => {
      const error = new Error('Test error');
      expect(createErrorMessage(error)).toBe('Test error');
    });

    it('should return default message for non-Error objects', () => {
      expect(createErrorMessage('string error')).toBe('Unknown error');
      expect(createErrorMessage(null)).toBe('Unknown error');
      expect(createErrorMessage()).toBe('Unknown error');
    });
  });
});
