/**
 * Tests for project wizard implementation
 */

import { describe, expect, it, beforeEach } from 'bun:test';
import { ProjectWizardImplementation, createProjectWizard } from '../src/wizards/project-wizard.js';
import type { ProjectConfig } from '../src/wizards/wizard-validators.js';

/**
 * Verify all required steps are present and required
 * @param steps - Array of wizard steps
 * @param requiredSteps - IDs of required steps
 */
function verifyRequiredSteps(
  steps: ReturnType<ProjectWizardImplementation['getSteps']>,
  requiredSteps: string[]
): void {
  for (const requiredId of requiredSteps) {
    const step = steps.find((s) => s.id === requiredId);
    expect(step).toBeDefined();
    expect(step?.required).toBe(true);
  }
}

/**
 * Verify all optional steps are present and optional
 * @param steps - Array of wizard steps
 * @param optionalSteps - IDs of optional steps
 */
function verifyOptionalSteps(
  steps: ReturnType<ProjectWizardImplementation['getSteps']>,
  optionalSteps: string[]
): void {
  for (const optionalId of optionalSteps) {
    const step = steps.find((s) => s.id === optionalId);
    expect(step).toBeDefined();
    expect(step?.required).toBe(false);
  }
}

/**
 * Verify license step has common SPDX licenses
 * @param values - Array of license values
 */
function verifyCommonLicenses(values: unknown[]): void {
  const commonLicenses = ['MIT', 'Apache-2.0', 'GPL-3.0-or-later', 'BSD-3-Clause', 'ISC'];
  for (const license of commonLicenses) {
    expect(values).toContain(license);
  }
}

/**
 * Extract step IDs from wizard steps
 * @param steps - Array of wizard steps
 * @returns Array of step IDs
 */
function extractStepIds(steps: ReturnType<ProjectWizardImplementation['getSteps']>): string[] {
  const ids: string[] = [];
  for (const step of steps) {
    ids.push(step.id);
  }
  return ids;
}

/**
 * Check if any error contains a substring
 * @param errors - Array of error messages
 * @param substring - Substring to search for
 * @returns True if any error contains the substring
 */
function containsErrorWith(errors: string[], substring: string): boolean {
  for (const error of errors) {
    if (error.includes(substring)) {
      return true;
    }
  }
  return false;
}

describe('project-wizard', () => {
  describe('ProjectWizardImplementation', () => {
    let wizard: ProjectWizardImplementation;

    beforeEach(() => {
      wizard = new ProjectWizardImplementation();
    });

    describe('initialization', () => {
      it('should initialize with default steps', () => {
        const steps = wizard.getSteps();
        expect(steps.length).toBeGreaterThan(0);

        const stepIds = extractStepIds(steps);
        expect(stepIds).toContain('name');
        expect(stepIds).toContain('qualityLevel');
        expect(stepIds).toContain('projectType');
        expect(stepIds).toContain('aiAssistants');
      });

      it('should have all required steps', () => {
        const steps = wizard.getSteps();
        const requiredSteps = ['name', 'qualityLevel', 'projectType', 'aiAssistants'];
        verifyRequiredSteps(steps, requiredSteps);
      });

      it('should have optional steps', () => {
        const steps = wizard.getSteps();
        const optionalSteps = ['description', 'author', 'license'];
        verifyOptionalSteps(steps, optionalSteps);
      });
    });

    describe('addStep', () => {
      it('should add custom step', () => {
        const customStep = {
          id: 'custom',
          title: 'Custom',
          description: 'Custom step',
          type: 'text' as const,
          required: false,
        };

        wizard.addStep(customStep);
        const step = wizard.getStep('custom');
        expect(step).toBeDefined();
        expect(step?.id).toBe('custom');
      });

      it('should add multiple custom steps', () => {
        const step1 = {
          id: 'step1',
          title: 'Step 1',
          description: 'First',
          type: 'text' as const,
          required: false,
        };
        const step2 = {
          id: 'step2',
          title: 'Step 2',
          description: 'Second',
          type: 'text' as const,
          required: false,
        };

        wizard.addStep(step1);
        wizard.addStep(step2);

        expect(wizard.getStep('step1')).toBeDefined();
        expect(wizard.getStep('step2')).toBeDefined();
      });
    });

    describe('getSteps', () => {
      it('should return all steps', () => {
        const steps = wizard.getSteps();
        expect(Array.isArray(steps)).toBe(true);
        expect(steps.length).toBeGreaterThan(0);
      });

      it('should return a copy of steps array', () => {
        const steps1 = wizard.getSteps();
        const steps2 = wizard.getSteps();

        expect(steps1).not.toBe(steps2);
        expect(steps1.length).toBe(steps2.length);
      });
    });

    describe('getStep', () => {
      it('should get step by ID', () => {
        const step = wizard.getStep('name');
        expect(step).toBeDefined();
        expect(step?.id).toBe('name');
        expect(step?.title).toBe('Project Name');
      });

      it('should return undefined for non-existent step', () => {
        const step = wizard.getStep('non-existent');
        expect(step).toBeUndefined();
      });
    });

    describe('validate', () => {
      it('should validate complete config', () => {
        const config: ProjectConfig = {
          name: 'test-project',
          qualityLevel: 'medium',
          projectType: 'basic',
          aiAssistants: ['claude-code'],
        };

        const result = wizard.validate(config);
        expect(result.valid).toBe(true);
        expect(result.errors).toEqual([]);
      });

      it('should detect missing required fields', () => {
        const config = {
          name: 'test',
        };

        const result = wizard.validate(config);
        expect(result.valid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
      });

      it('should detect invalid field values', () => {
        const config = {
          name: 'INVALID-NAME',
          qualityLevel: 'medium' as const,
          projectType: 'basic' as const,
          aiAssistants: ['claude-code'],
        };

        const result = wizard.validate(config);
        expect(result.valid).toBe(false);
        expect(containsErrorWith(result.errors, 'lowercase')).toBe(true);
      });

      it('should validate optional fields when provided', () => {
        const config: ProjectConfig = {
          name: 'test',
          description: 'a'.repeat(501), // Too long
          qualityLevel: 'medium',
          projectType: 'basic',
          aiAssistants: ['claude-code'],
        };

        const result = wizard.validate(config);
        expect(result.valid).toBe(false);
        expect(containsErrorWith(result.errors, 'Description')).toBe(true);
      });
    });

    describe('reset', () => {
      it('should clear current configuration', () => {
        wizard.reset();
        // After reset, internal state should be empty
        // We can verify this by validating an empty config
        const result = wizard.validate({});
        expect(result.valid).toBe(false);
      });
    });
  });

  describe('createProjectWizard', () => {
    it('should create wizard instance', () => {
      const wizard = createProjectWizard();
      expect(wizard).toBeDefined();
      expect(typeof wizard.run).toBe('function');
      expect(typeof wizard.addStep).toBe('function');
      expect(typeof wizard.validate).toBe('function');
    });

    it('should create independent instances', () => {
      const wizard1 = createProjectWizard();
      const wizard2 = createProjectWizard();

      expect(wizard1).not.toBe(wizard2);

      const customStep = {
        id: 'custom',
        title: 'Custom',
        description: 'Custom',
        type: 'text' as const,
        required: false,
      };

      wizard1.addStep(customStep);
      expect(wizard1.getStep('custom')).toBeDefined();
      expect(wizard2.getStep('custom')).toBeUndefined();
    });
  });

  describe('step definitions', () => {
    let wizard: ProjectWizardImplementation;

    beforeEach(() => {
      wizard = new ProjectWizardImplementation();
    });

    it('should have project name step with validation', () => {
      const step = wizard.getStep('name');
      expect(step).toBeDefined();
      expect(step?.type).toBe('text');
      expect(step?.required).toBe(true);
      expect(step?.validation).toBeDefined();
      expect(step?.validation?.length).toBeGreaterThan(0);
    });

    it('should have quality level step with options', () => {
      const step = wizard.getStep('qualityLevel');
      expect(step).toBeDefined();
      expect(step?.type).toBe('list');
      expect(step?.required).toBe(true);
      expect(step?.options).toBeDefined();
      expect(step?.options?.length).toBe(3);

      const values = step?.options?.map((o) => o.value);
      expect(values).toContain('light');
      expect(values).toContain('medium');
      expect(values).toContain('strict');
    });

    it('should have project type step with options', () => {
      const step = wizard.getStep('projectType');
      expect(step).toBeDefined();
      expect(step?.type).toBe('list');
      expect(step?.required).toBe(true);
      expect(step?.options).toBeDefined();
      expect(step?.options?.length).toBe(4);

      const values = step?.options?.map((o) => o.value);
      expect(values).toContain('basic');
      expect(values).toContain('web');
      expect(values).toContain('cli');
      expect(values).toContain('library');
    });

    it('should have AI assistants step with checkbox type', () => {
      const step = wizard.getStep('aiAssistants');
      expect(step).toBeDefined();
      expect(step?.type).toBe('checkbox');
      expect(step?.required).toBe(true);
      expect(step?.options).toBeDefined();
      expect(step?.options?.length).toBeGreaterThan(0);

      const values = step?.options?.map((o) => o.value);
      expect(values).toContain('claude-code');
      expect(values).toContain('copilot');
    });

    it('should have license step with common licenses', () => {
      const step = wizard.getStep('license');
      expect(step).toBeDefined();
      expect(step?.type).toBe('list');
      expect(step?.required).toBe(false);
      expect(step?.options).toBeDefined();

      const values = step?.options?.map((o) => o.value);
      verifyCommonLicenses(values ?? []);
    });

    it('should have description step with length validation', () => {
      const step = wizard.getStep('description');
      expect(step).toBeDefined();
      expect(step?.type).toBe('text');
      expect(step?.required).toBe(false);
      expect(step?.validation).toBeDefined();

      const lengthRule = step?.validation?.find((r) => r.type === 'length');
      expect(lengthRule).toBeDefined();
      expect(lengthRule?.max).toBeDefined();
    });

    it('should have author step with length validation', () => {
      const step = wizard.getStep('author');
      expect(step).toBeDefined();
      expect(step?.type).toBe('text');
      expect(step?.required).toBe(false);
      expect(step?.validation).toBeDefined();

      const lengthRule = step?.validation?.find((r) => r.type === 'length');
      expect(lengthRule).toBeDefined();
      expect(lengthRule?.max).toBeDefined();
    });
  });

  describe('step conditions', () => {
    let wizard: ProjectWizardImplementation;

    beforeEach(() => {
      wizard = new ProjectWizardImplementation();
    });

    it('should support conditional steps', () => {
      const step = wizard.getStep('name');
      expect(step).toBeDefined();

      if (step?.condition) {
        // Should skip if name already in config
        const skipResult = step.condition({ name: 'existing' });
        expect(skipResult).toBe(false);

        // Should show if name not in config
        const showResult = step.condition({});
        expect(showResult).toBe(true);
      }
    });
  });
});
