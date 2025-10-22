/**
 * Tests for wizard validation helpers
 */

import { describe, expect, it } from 'bun:test';
import {
  validateRequiredFields,
  validateOptionalFields,
  validateProjectName,
  validateAIAssistants,
  isValidQualityLevel,
  isValidProjectType,
  isValidLicense,
  type ProjectConfig,
} from '../src/wizards/wizard-validators.js';

describe('wizard-validators', () => {
  describe('validateRequiredFields', () => {
    it('should validate complete config', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['claude-code'],
      };

      const result = validateRequiredFields(config);
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should detect missing name', () => {
      const config = {
        qualityLevel: 'medium' as const,
        projectType: 'basic' as const,
        aiAssistants: ['claude-code'],
      };

      const result = validateRequiredFields(config);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Project name is required');
    });

    it('should detect invalid quality level', () => {
      const config = {
        name: 'test',
        qualityLevel: 'invalid' as 'medium',
        projectType: 'basic' as const,
        aiAssistants: ['claude-code'],
      };

      const result = validateRequiredFields(config);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('quality level'))).toBe(true);
    });

    it('should detect invalid project type', () => {
      const config = {
        name: 'test',
        qualityLevel: 'medium' as const,
        projectType: 'invalid' as 'basic',
        aiAssistants: ['claude-code'],
      };

      const result = validateRequiredFields(config);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('project type'))).toBe(true);
    });

    it('should detect missing AI assistants', () => {
      const config = {
        name: 'test',
        qualityLevel: 'medium' as const,
        projectType: 'basic' as const,
        aiAssistants: [],
      };

      const result = validateRequiredFields(config);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('AI assistant'))).toBe(true);
    });

    it('should detect invalid AI assistant', () => {
      const config = {
        name: 'test',
        qualityLevel: 'medium' as const,
        projectType: 'basic' as const,
        aiAssistants: ['invalid'],
      };

      const result = validateRequiredFields(config);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('Invalid AI assistants'))).toBe(true);
    });
  });

  describe('validateOptionalFields', () => {
    it('should validate empty optional fields', () => {
      const config = {};
      const result = validateOptionalFields(config);
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should detect description too long', () => {
      const config = {
        description: 'a'.repeat(501),
      };

      const result = validateOptionalFields(config);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('Description'))).toBe(true);
    });

    it('should detect author name too long', () => {
      const config = {
        author: 'a'.repeat(101),
      };

      const result = validateOptionalFields(config);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('Author'))).toBe(true);
    });

    it('should accept valid SPDX licenses', () => {
      const licenses = ['MIT', 'Apache-2.0', 'GPL-3.0-or-later', 'BSD-3-Clause', 'ISC'];

      for (const license of licenses) {
        const config = { license };
        const result = validateOptionalFields(config);
        expect(result.valid).toBe(true);
      }
    });
  });

  describe('validateProjectName', () => {
    it('should accept valid names', () => {
      const validNames = ['my-project', 'test_app', 'project-123', 'a'];

      for (const name of validNames) {
        const result = validateProjectName(name);
        expect(result.valid).toBe(true);
      }
    });

    it('should reject uppercase letters', () => {
      const result = validateProjectName('MyProject');
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain('lowercase');
    });

    it('should reject spaces', () => {
      const result = validateProjectName('my project');
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain('lowercase');
    });

    it('should reject names starting with number', () => {
      const result = validateProjectName('123-project');
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('start with'))).toBe(true);
    });

    it('should reject names starting with dot', () => {
      const result = validateProjectName('.project');
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('start with'))).toBe(true);
    });

    it('should reject empty names', () => {
      const result = validateProjectName('');
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('between'))).toBe(true);
    });

    it('should reject names exceeding max length', () => {
      const result = validateProjectName('a'.repeat(215)); // Max is 214
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('between'))).toBe(true);
    });
  });

  describe('validateAIAssistants', () => {
    it('should accept valid assistants', () => {
      expect(validateAIAssistants(['claude-code'])).toEqual([]);
      expect(validateAIAssistants(['copilot'])).toEqual([]);
      expect(validateAIAssistants(['claude-code', 'copilot'])).toEqual([]);
    });

    it('should reject invalid assistants', () => {
      const errors = validateAIAssistants(['invalid', 'also-invalid']);
      expect(errors.length).toBe(1);
      expect(errors[0]).toContain('invalid');
      expect(errors[0]).toContain('also-invalid');
    });
  });

  describe('isValidQualityLevel', () => {
    it('should accept valid quality levels', () => {
      expect(isValidQualityLevel('light')).toBe(true);
      expect(isValidQualityLevel('medium')).toBe(true);
      expect(isValidQualityLevel('strict')).toBe(true);
    });

    it('should reject invalid quality levels', () => {
      expect(isValidQualityLevel('invalid')).toBe(false);
      expect(isValidQualityLevel('high')).toBe(false);
      expect(isValidQualityLevel('')).toBe(false);
    });
  });

  describe('isValidProjectType', () => {
    it('should accept valid project types', () => {
      expect(isValidProjectType('basic')).toBe(true);
      expect(isValidProjectType('web')).toBe(true);
      expect(isValidProjectType('cli')).toBe(true);
      expect(isValidProjectType('library')).toBe(true);
    });

    it('should reject invalid project types', () => {
      expect(isValidProjectType('invalid')).toBe(false);
      expect(isValidProjectType('api')).toBe(false);
      expect(isValidProjectType('')).toBe(false);
    });
  });

  describe('isValidLicense', () => {
    it('should accept common SPDX licenses', () => {
      expect(isValidLicense('MIT')).toBe(true);
      expect(isValidLicense('Apache-2.0')).toBe(true);
      expect(isValidLicense('GPL-3.0-or-later')).toBe(true);
      expect(isValidLicense('BSD-3-Clause')).toBe(true);
      expect(isValidLicense('ISC')).toBe(true);
    });

    it('should accept custom SPDX-like identifiers', () => {
      expect(isValidLicense('Custom-1.0')).toBe(true);
      expect(isValidLicense('Proprietary-License')).toBe(true);
    });

    it('should reject invalid license formats', () => {
      expect(isValidLicense('Invalid License!')).toBe(false);
      expect(isValidLicense('License (With Parens)')).toBe(false);
    });
  });
});
