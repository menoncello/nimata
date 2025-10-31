/**
 * Unit tests for CLI Helper Utilities
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'bun:test';
import { CLILogger, CLIErrorHandler, CLI } from '../../src/utils/cli-helpers';

describe('CLILogger', () => {
  let mockConsoleLog: any;
  let mockConsoleError: any;
  let mockConsoleWarn: any;
  let mockProcessStdoutWrite: any;
  let mockProcessStderrWrite: any;
  let _consoleLogSpy: string[];
  let _consoleErrorSpy: string[];
  let _consoleWarnSpy: string[];
  let processWriteSpy: string[];
  let processStderrSpy: string[];

  beforeEach(() => {
    _consoleLogSpy = [];
    _consoleErrorSpy = [];
    _consoleWarnSpy = [];
    processWriteSpy = [];
    processStderrSpy = [];

    mockConsoleLog = vi.spyOn(console, 'log').mockImplementation((...args) => {
      _consoleLogSpy?.push(args.join(' '));
    });
    mockConsoleError = vi.spyOn(console, 'error').mockImplementation((...args) => {
      _consoleErrorSpy?.push(args.join(' '));
    });
    mockConsoleWarn = vi.spyOn(console, 'warn').mockImplementation((...args) => {
      _consoleWarnSpy?.push(args.join(' '));
    });
    mockProcessStdoutWrite = vi.spyOn(process.stdout, 'write').mockImplementation((data) => {
      processWriteSpy?.push(data);
      return true;
    });
    mockProcessStderrWrite = vi.spyOn(process.stderr, 'write').mockImplementation((data) => {
      processStderrSpy?.push(data);
      return true;
    });
  });

  afterEach(() => {
    mockConsoleLog.mockRestore();
    mockConsoleError.mockRestore();
    mockConsoleWarn.mockRestore();
    mockProcessStdoutWrite.mockRestore();
    mockProcessStderrWrite.mockRestore();
  });

  describe('constructor', () => {
    it('should create with default options', () => {
      const logger = new CLILogger();
      expect(logger).toBeInstanceOf(CLILogger);
    });

    it('should create with custom options', () => {
      const logger = new CLILogger({
        verbose: true,
        silent: false,
        json: false,
        color: false,
      });
      expect(logger).toBeInstanceOf(CLILogger);
    });
  });

  describe('success', () => {
    it('should log success message', () => {
      const logger = new CLILogger();
      logger.success('Test success');
      expect(mockProcessStdoutWrite).toHaveBeenCalledWith('✅ Test success\n');
    });

    it('should log success message with data in JSON mode', () => {
      const logger = new CLILogger({ json: true });
      logger.success('Test success', { key: 'value' });
      expect(mockProcessStdoutWrite).toHaveBeenCalledWith(
        expect.stringContaining('"status": "success"')
      );
      expect(mockProcessStdoutWrite).toHaveBeenCalledWith(
        expect.stringContaining('"message": "Test success"')
      );
    });

    it('should not log in silent mode', () => {
      const logger = new CLILogger({ silent: true });
      logger.success('Test success');
      expect(mockProcessStdoutWrite).not.toHaveBeenCalled();
    });
  });

  describe('error', () => {
    it('should log error message', () => {
      const logger = new CLILogger();
      logger.error('Test error');
      expect(mockProcessStderrWrite).toHaveBeenCalledWith('❌ Test error\n');
    });

    it('should log error with details in verbose mode', () => {
      const logger = new CLILogger({ verbose: true });
      const error = new Error('Detailed error');
      logger.error('Test error', error);
      expect(mockProcessStderrWrite).toHaveBeenCalledWith('❌ Test error\n');
      expect(mockProcessStderrWrite).toHaveBeenCalledWith(
        expect.stringContaining('Detailed error')
      );
    });

    it('should log error with CLIError properties', () => {
      const logger = new CLILogger({ verbose: true });
      const cliError = {
        name: 'Error',
        message: 'CLI error',
        code: 'E001',
        type: 'validation' as const,
        stack: 'Error stack trace',
      };
      logger.error('Test error', cliError);
      expect(mockProcessStderrWrite).toHaveBeenCalledWith('❌ Test error\n');
      expect(mockProcessStderrWrite).toHaveBeenCalledWith(
        expect.stringContaining('Error stack trace')
      );
    });
  });

  describe('warn', () => {
    it('should log warning message', () => {
      const logger = new CLILogger();
      logger.warn('Test warning');
      expect(mockProcessStderrWrite).toHaveBeenCalledWith('⚠️ Test warning\n');
    });

    it('should not log in silent mode', () => {
      const logger = new CLILogger({ silent: true });
      logger.warn('Test warning');
      expect(mockProcessStderrWrite).not.toHaveBeenCalled();
    });
  });

  describe('info', () => {
    it('should log info message in verbose mode', () => {
      const logger = new CLILogger({ verbose: true });
      logger.info('Test info');
      expect(mockProcessStdoutWrite).toHaveBeenCalledWith('ℹ️ Test info\n');
    });

    it('should not log in non-verbose mode', () => {
      const logger = new CLILogger({ verbose: false });
      logger.info('Test info');
      expect(mockProcessStdoutWrite).not.toHaveBeenCalled();
    });
  });

  describe('debug', () => {
    it('should log debug message with data in verbose mode', () => {
      const logger = new CLILogger({ verbose: true });
      logger.debug('Test debug', { key: 'value' });
      expect(mockProcessStdoutWrite).toHaveBeenCalledWith('🔍 Test debug\n');
      expect(mockProcessStdoutWrite).toHaveBeenCalledWith('   {\n  "key": "value"\n}\n');
    });

    it('should not log in non-verbose mode', () => {
      const logger = new CLILogger({ verbose: false });
      logger.debug('Test debug');
      expect(mockProcessStdoutWrite).not.toHaveBeenCalled();
    });
  });

  describe('step', () => {
    it('should log step message', () => {
      const logger = new CLILogger();
      logger.step(1, 3, 'Test step');
      expect(mockProcessStdoutWrite).toHaveBeenCalledWith('📍 (1/3) Test step\n');
    });

    it('should not log in silent mode', () => {
      const logger = new CLILogger({ silent: true });
      logger.step(1, 3, 'Test step');
      expect(mockProcessStdoutWrite).not.toHaveBeenCalled();
    });
  });

  describe('header', () => {
    it('should log header', () => {
      const logger = new CLILogger();
      logger.header('Test Header');
      expect(mockProcessStdoutWrite).toHaveBeenCalledWith(
        expect.stringContaining('=== Test Header ===')
      );
    });

    it('should not log in silent mode', () => {
      const logger = new CLILogger({ silent: true });
      logger.header('Test Header');
      expect(mockProcessStdoutWrite).not.toHaveBeenCalled();
    });
  });

  describe('spinner', () => {
    it('should create spinner', () => {
      const logger = new CLILogger();
      const spinner = logger.spinner('Test');
      expect(spinner).toBeDefined();
    });

    it('should create silent spinner in silent mode', () => {
      const logger = new CLILogger({ silent: true });
      const spinner = logger.spinner('Test');
      expect(spinner).toBeDefined();
    });
  });

  describe('progress', () => {
    it('should create progress indicator', () => {
      const logger = new CLILogger();
      const progress = logger.progress(100, 'Test');
      expect(progress).toBeDefined();
    });

    it('should create silent progress in silent mode', () => {
      const logger = new CLILogger({ silent: true });
      const progress = logger.progress(100, 'Test');
      expect(progress).toBeDefined();
    });
  });
});

describe('CLIErrorHandler', () => {
  let mockConsoleLog: any;
  let mockConsoleError: any;
  let mockConsoleWarn: any;
  let mockProcessStdoutWrite: any;
  let mockProcessStderrWrite: any;
  let logger: CLILogger;
  let errorHandler: CLIErrorHandler;
  let consoleLogSpy: string[];
  let consoleErrorSpy: string[];
  let consoleWarnSpy: string[];
  let processWriteSpy: string[];
  let processStderrSpy: string[];

  beforeEach(() => {
    consoleLogSpy = [];
    consoleErrorSpy = [];
    consoleWarnSpy = [];
    processWriteSpy = [];
    processStderrSpy = [];

    mockConsoleLog = vi.spyOn(console, 'log').mockImplementation((...args) => {
      consoleLogSpy?.push(args.join(' '));
    });
    mockConsoleError = vi.spyOn(console, 'error').mockImplementation((...args) => {
      consoleErrorSpy?.push(args.join(' '));
    });
    mockConsoleWarn = vi.spyOn(console, 'warn').mockImplementation((...args) => {
      consoleWarnSpy?.push(args.join(' '));
    });
    mockProcessStdoutWrite = vi.spyOn(process.stdout, 'write').mockImplementation((data) => {
      processWriteSpy?.push(data);
      return true;
    });
    mockProcessStderrWrite = vi.spyOn(process.stderr, 'write').mockImplementation((data) => {
      processStderrSpy?.push(data);
      return true;
    });
    logger = new CLILogger({ verbose: true });
    errorHandler = new CLIErrorHandler(logger);
  });

  afterEach(() => {
    mockConsoleLog.mockRestore();
    mockConsoleError.mockRestore();
    mockConsoleWarn.mockRestore();
    mockProcessStdoutWrite.mockRestore();
    mockProcessStderrWrite.mockRestore();
  });

  describe('handle', () => {
    it('should handle regular error', () => {
      const error = new Error('Test error');
      errorHandler.handle(error);
      expect(mockProcessStderrWrite).toHaveBeenCalledWith('❌ Test error\n');
    });

    it('should handle CLI error with suggestions', () => {
      const cliError = {
        name: 'Error',
        message: 'Test CLI error',
        type: 'validation' as const,
        suggestions: ['Suggestion 1', 'Suggestion 2'],
      };
      errorHandler.handle(cliError);
      expect(mockProcessStderrWrite).toHaveBeenCalledWith('❌ Test CLI error\n');
      expect(mockProcessStdoutWrite).toHaveBeenCalledWith('ℹ️ Suggestions:\n');
      expect(mockProcessStdoutWrite).toHaveBeenCalledWith('ℹ️   1. Suggestion 1\n');
      expect(mockProcessStdoutWrite).toHaveBeenCalledWith('ℹ️   2. Suggestion 2\n');
    });

    it('should handle error with context', () => {
      const error = new Error('Context error');
      errorHandler.handle(error, 'Test Context');
      expect(mockProcessStderrWrite).toHaveBeenCalledWith('❌ undefined\n');
    });

    it('should show help for permission errors', () => {
      const error = new Error('EACCES: permission denied');
      errorHandler.handle(error);
      expect(mockProcessStdoutWrite).toHaveBeenCalledWith(
        expect.stringContaining('For permission issues, try:')
      );
    });

    it('should show help for validation errors', () => {
      const error = new Error('Validation failed');
      errorHandler.handle(error);
      expect(mockProcessStdoutWrite).toHaveBeenCalledWith(
        expect.stringContaining('For validation issues, try:')
      );
    });

    it('should show help for network errors', () => {
      const error = new Error('ENOTFOUND: network error');
      errorHandler.handle(error);
      expect(mockProcessStdoutWrite).toHaveBeenCalledWith(
        expect.stringContaining('For network issues, try:')
      );
    });
  });
});

describe('CLI utility', () => {
  describe('logger', () => {
    it('should create logger', () => {
      const logger = CLI.logger();
      expect(logger).toBeInstanceOf(CLILogger);
    });

    it('should create logger with options', () => {
      const logger = CLI.logger({ verbose: true });
      expect(logger).toBeInstanceOf(CLILogger);
    });
  });

  describe('errorHandler', () => {
    it('should create error handler', () => {
      const logger = CLI.logger();
      const handler = CLI.errorHandler(logger);
      expect(handler).toBeInstanceOf(CLIErrorHandler);
    });
  });

  describe('formatFileSize', () => {
    it('should format bytes', () => {
      expect(CLI.formatFileSize(512)).toBe('512.0 B');
    });

    it('should format kilobytes', () => {
      expect(CLI.formatFileSize(1024)).toBe('1.0 KB');
    });

    it('should format megabytes', () => {
      expect(CLI.formatFileSize(1024 * 1024)).toBe('1.0 MB');
    });

    it('should format gigabytes', () => {
      expect(CLI.formatFileSize(1024 * 1024 * 1024)).toBe('1.0 GB');
    });
  });

  describe('formatDuration', () => {
    it('should format milliseconds', () => {
      expect(CLI.formatDuration(500)).toBe('500ms');
    });

    it('should format seconds', () => {
      expect(CLI.formatDuration(1500)).toBe('1.5s');
    });

    it('should format minutes and seconds', () => {
      expect(CLI.formatDuration(65000)).toBe('1m 5s');
    });
  });

  describe('formatList', () => {
    it('should format list with default bullet', () => {
      const items = ['Item 1', 'Item 2'];
      const result = CLI.formatList(items);
      expect(result).toBe('• Item 1\n• Item 2');
    });

    it('should format list with custom bullet', () => {
      const items = ['Item 1', 'Item 2'];
      const result = CLI.formatList(items, '-');
      expect(result).toBe('- Item 1\n- Item 2');
    });
  });

  describe('error', () => {
    it('should create CLI error', () => {
      const error = CLI.error('Test error');
      expect(error).toBeInstanceOf(Error);
      expect(error.type).toBe('system');
      expect(error.exitCode).toBe(1);
    });

    it('should create CLI error with options', () => {
      const error = CLI.error('Test error', {
        type: 'validation',
        code: 'E001',
        suggestions: ['Fix it'],
      });
      expect(error.type).toBe('validation');
      expect(error.code).toBe('E001');
      expect(error.suggestions).toEqual(['Fix it']);
    });
  });
});
