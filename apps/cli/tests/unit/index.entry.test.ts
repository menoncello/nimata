import { describe, expect, test } from 'bun:test';
import { EXIT_CODES } from '../../src/index.js';

describe('CLI Entry Point', () => {
  describe('EXIT_CODES export', () => {
    test('should export EXIT_CODES', () => {
      expect(EXIT_CODES).toBeDefined();
    });

    test('should have SUCCESS exit code', () => {
      expect(EXIT_CODES.SUCCESS).toBe(0);
    });

    test('should have CONFIG_ERROR exit code', () => {
      expect(EXIT_CODES.CONFIG_ERROR).toBeDefined();
      expect(typeof EXIT_CODES.CONFIG_ERROR).toBe('number');
    });

    test('should have VALIDATION_ERROR exit code', () => {
      expect(EXIT_CODES.VALIDATION_ERROR).toBeDefined();
      expect(typeof EXIT_CODES.VALIDATION_ERROR).toBe('number');
    });

    test('should have INTERRUPTED exit code', () => {
      expect(EXIT_CODES.INTERRUPTED).toBeDefined();
      expect(typeof EXIT_CODES.INTERRUPTED).toBe('number');
    });

    test('all exit codes should be unique', () => {
      const codes = Object.values(EXIT_CODES);
      const uniqueCodes = new Set(codes);
      expect(codes.length).toBe(uniqueCodes.size);
    });

    test('all exit codes should be non-negative integers', () => {
      for (const code of Object.values(EXIT_CODES)) {
        expect(code).toBeGreaterThanOrEqual(0);
        expect(Number.isInteger(code)).toBe(true);
      }
    });
  });
});
