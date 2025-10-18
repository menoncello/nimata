/**
 * Unit Tests - CLI Output Integration
 *
 * AC1: CLI entry point executes successfully
 */
import 'reflect-metadata';
import { describe, expect, it } from 'bun:test';
import { ConsoleOutputWriter, SilentOutputWriter } from '../../src/output';

describe('Story 1.1 - AC1: CLI Output Integration', () => {
  describe('Output Writer Creation', () => {
    it('should create ConsoleOutputWriter instance', () => {
      const writer = new ConsoleOutputWriter();
      expect(writer).toBeInstanceOf(ConsoleOutputWriter);
    });

    it('should create SilentOutputWriter instance', () => {
      const writer = new SilentOutputWriter();
      expect(writer).toBeInstanceOf(SilentOutputWriter);
    });
  });

  describe('Output Writer Interface Consistency', () => {
    it('should have consistent methods across writers', () => {
      const consoleWriter = new ConsoleOutputWriter();
      const silentWriter = new SilentOutputWriter();

      expect(typeof consoleWriter.stdout).toBe('function');
      expect(typeof consoleWriter.stderr).toBe('function');
      expect(typeof consoleWriter.success).toBe('function');
      expect(typeof consoleWriter.error).toBe('function');
      expect(typeof consoleWriter.info).toBe('function');

      expect(typeof silentWriter.stdout).toBe('function');
      expect(typeof silentWriter.stderr).toBe('function');
      expect(typeof silentWriter.success).toBe('function');
      expect(typeof silentWriter.error).toBe('function');
      expect(typeof silentWriter.info).toBe('function');
    });
  });
});
