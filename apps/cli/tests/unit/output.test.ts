import { describe, expect, it, spyOn, beforeEach, afterEach } from 'bun:test';
import { ConsoleOutputWriter, SilentOutputWriter } from '../../src/output';

describe('ConsoleOutputWriter', () => {
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

  describe('stdout', () => {
    it('should write to process.stdout', () => {
      writer.stdout('test message');
      expect(stdoutSpy).toHaveBeenCalledWith('test message');
    });

    it('should handle empty string', () => {
      writer.stdout('');
      expect(stdoutSpy).toHaveBeenCalledWith('');
    });
  });

  describe('stderr', () => {
    it('should write to process.stderr', () => {
      writer.stderr('error message');
      expect(stderrSpy).toHaveBeenCalledWith('error message');
    });

    it('should handle empty string', () => {
      writer.stderr('');
      expect(stderrSpy).toHaveBeenCalledWith('');
    });
  });

  describe('log', () => {
    it('should write to console.log with single argument', () => {
      writer.log('test message');
      expect(consoleLogSpy).toHaveBeenCalledWith('test message');
    });

    it('should write to console.log with multiple arguments', () => {
      writer.log('message', 1, true, { key: 'value' });
      expect(consoleLogSpy).toHaveBeenCalledWith('message', 1, true, {
        key: 'value',
      });
    });

    it('should handle no arguments', () => {
      writer.log();
      expect(consoleLogSpy).toHaveBeenCalledWith();
    });
  });

  describe('error', () => {
    it('should write to console.error with single argument', () => {
      writer.error('error message');
      expect(consoleErrorSpy).toHaveBeenCalledWith('error message');
    });

    it('should write to console.error with multiple arguments', () => {
      writer.error('error', 1, false, { error: true });
      expect(consoleErrorSpy).toHaveBeenCalledWith('error', 1, false, {
        error: true,
      });
    });

    it('should handle no arguments', () => {
      writer.error();
      expect(consoleErrorSpy).toHaveBeenCalledWith();
    });
  });
});

describe('SilentOutputWriter', () => {
  let writer: SilentOutputWriter;

  beforeEach(() => {
    writer = new SilentOutputWriter();
  });

  it('should be no-ops for stdout', () => {
    expect(() => writer.stdout('test')).not.toThrow();
    expect(writer.stdout('test')).toBeUndefined();
  });

  it('should be no-ops for stderr', () => {
    expect(() => writer.stderr('test')).not.toThrow();
    expect(writer.stderr('test')).toBeUndefined();
  });

  it('should be no-ops for log', () => {
    expect(() => writer.log('test', 1, true)).not.toThrow();
    expect(writer.log('test', 1, true)).toBeUndefined();
  });

  it('should be no-ops for error', () => {
    expect(() => writer.error('error', 1, false)).not.toThrow();
    expect(writer.error('error', 1, false)).toBeUndefined();
  });
});
