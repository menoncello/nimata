/**
 * Unit Tests - Exit Codes
 *
 * AC6: Exit codes follow Unix conventions
 */
import { describe, it, expect } from 'bun:test';
import { EXIT_CODES } from '../../src/index.js';

describe('Exit Codes', () => {
  it('should define SUCCESS as 0', () => {
    expect(EXIT_CODES.SUCCESS).toBe(0);
  });

  it('should define VALIDATION_ERROR as 1', () => {
    expect(EXIT_CODES.VALIDATION_ERROR).toBe(1);
  });

  it('should define CONFIG_ERROR as 3', () => {
    expect(EXIT_CODES.CONFIG_ERROR).toBe(3);
  });

  it('should define INTERRUPTED as 130', () => {
    expect(EXIT_CODES.INTERRUPTED).toBe(130);
  });

  it('should have all exit codes as numbers', () => {
    expect(typeof EXIT_CODES.SUCCESS).toBe('number');
    expect(typeof EXIT_CODES.VALIDATION_ERROR).toBe('number');
    expect(typeof EXIT_CODES.CONFIG_ERROR).toBe('number');
    expect(typeof EXIT_CODES.INTERRUPTED).toBe('number');
  });
});
