/**
 * Unit Tests - Silent Output Writer
 *
 * AC1: CLI entry point executes successfully
 */
import 'reflect-metadata';
import { describe, expect, it, spyOn, beforeEach, afterEach } from 'bun:test';
import { SilentOutputWriter } from '../../src/output';

describe('Story 1.1 - AC1: Silent Output Writer', () => {
  let writer: SilentOutputWriter;
  let stdoutSpy: ReturnType<typeof spyOn>;
  let stderrSpy: ReturnType<typeof spyOn>;
  let consoleLogSpy: ReturnType<typeof spyOn>;
  let consoleErrorSpy: ReturnType<typeof spyOn>;

  beforeEach(() => {
    writer = new SilentOutputWriter();
    stdoutSpy = spyOn(process.stdout, 'write');
    stderrSpy = spyOn(process.stderr, 'write');
    consoleLogSpy = spyOn(console, 'log');
    consoleErrorSpy = spyOn(console, 'error');
  });

  afterEach(() => {
    stdoutSpy.mockRestore();
    stderrSpy.mockRestore();
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  describe('silent stdout operations', () => {
    it('should not write to process.stdout', () => {
      writer.stdout('test message');
      expect(stdoutSpy).not.toHaveBeenCalled();
    });

    it('should not write empty string to stdout', () => {
      writer.stdout('');
      expect(stdoutSpy).not.toHaveBeenCalled();
    });

    it('should not write multiline strings to stdout', () => {
      const multiline = 'line 1\nline 2\nline 3';
      writer.stdout(multiline);
      expect(stdoutSpy).not.toHaveBeenCalled();
    });
  });

  describe('silent stderr operations', () => {
    it('should not write to process.stderr', () => {
      writer.stderr('error message');
      expect(stderrSpy).not.toHaveBeenCalled();
    });

    it('should not write empty error string to stderr', () => {
      writer.stderr('');
      expect(stderrSpy).not.toHaveBeenCalled();
    });
  });

  describe('silent success operations', () => {
    it('should not write success message to console.log', () => {
      writer.success('operation completed');
      expect(consoleLogSpy).not.toHaveBeenCalled();
    });
  });

  describe('silent error operations', () => {
    it('should not write error message to console.error', () => {
      writer.error('operation failed');
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });
  });

  describe('silent info operations', () => {
    it('should not write info message to console.log', () => {
      writer.info('information');
      expect(consoleLogSpy).not.toHaveBeenCalled();
    });
  });
});
