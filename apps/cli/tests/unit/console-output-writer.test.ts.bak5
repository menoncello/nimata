/**
 * Unit Tests - Console Output Writer
 *
 * AC1: CLI entry point executes successfully
 */
import 'reflect-metadata';
import { describe, expect, it, spyOn, beforeEach, afterEach } from 'bun:test';
import { ConsoleOutputWriter } from '../../src/output';

describe('Story 1.1 - AC1: Console Output Writer', () => {
  let writer: ConsoleOutputWriter;
  let stdoutSpy: ReturnType<typeof spyOn>;
  let stderrSpy: ReturnType<typeof spyOn>;
  let consoleLogSpy: ReturnType<typeof spyOn>;
  let consoleErrorSpy: ReturnType<typeof spyOn>;

  beforeEach(() => {
    writer = new ConsoleOutputWriter();
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

  describe('stdout operations', () => {
    it('should write to process.stdout', () => {
      writer.stdout('test message');
      expect(stdoutSpy).toHaveBeenCalledWith('test message');
    });

    it('should handle empty string', () => {
      writer.stdout('');
      expect(stdoutSpy).toHaveBeenCalledWith('');
    });

    it('should handle multiline strings', () => {
      const multiline = 'line 1\nline 2\nline 3';
      writer.stdout(multiline);
      expect(stdoutSpy).toHaveBeenCalledWith(multiline);
    });
  });

  describe('stderr operations', () => {
    it('should write to process.stderr', () => {
      writer.stderr('error message');
      expect(stderrSpy).toHaveBeenCalledWith('error message');
    });

    it('should handle empty error string', () => {
      writer.stderr('');
      expect(stderrSpy).toHaveBeenCalledWith('');
    });
  });

  describe('success operations', () => {
    it('should write success message to console.log', () => {
      writer.success('operation completed');
      expect(consoleLogSpy).toHaveBeenCalledWith('operation completed');
    });
  });

  describe('error operations', () => {
    it('should write error message to console.error', () => {
      writer.error('operation failed');
      expect(consoleErrorSpy).toHaveBeenCalledWith('operation failed');
    });
  });

  describe('info operations', () => {
    it('should write info message to console.log', () => {
      writer.info('information');
      expect(consoleLogSpy).toHaveBeenCalledWith('information');
    });
  });
});
