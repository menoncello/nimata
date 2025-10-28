import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { Logger } from '../../src/utils/logger';

describe('Structured Logger (P1-1)', () => {
  let originalConsole: Console;
  let mockLogs: Array<{ level: string; args: unknown[] }>;

  beforeEach(() => {
    // Reset the singleton instance
    (Logger as any).instance = undefined;

    originalConsole = global.console;
    mockLogs = [];

    global.console = {
      ...originalConsole,
      debug: (...args: unknown[]) => mockLogs.push({ level: 'debug', args }),
      info: (...args: unknown[]) => mockLogs.push({ level: 'info', args }),
      warn: (...args: unknown[]) => mockLogs.push({ level: 'warn', args }),
      error: (...args: unknown[]) => mockLogs.push({ level: 'error', args }),
      log: originalConsole.log,
      trace: originalConsole.trace,
    };
  });

  afterEach(() => {
    global.console = originalConsole;
  });

  describe('Basic Logging', () => {
    it('should log debug messages', () => {
      const testLogger = Logger.getInstance('debug');
      testLogger.debug('test-op', 'Test message', { key: 'value' });

      expect(mockLogs).toHaveLength(1);
      expect(mockLogs[0].level).toBe('debug');
      expect(mockLogs[0].args[0]).toContain('[DEBUG]');
      expect(mockLogs[0].args[0]).toContain('[test-op]');
      expect(mockLogs[0].args[0]).toContain('Test message');
      expect(mockLogs[0].args[1]).toEqual({ key: 'value' });
    });

    it('should log warning messages', () => {
      const testLogger = Logger.getInstance('debug');
      testLogger.warn('test-op', 'Warning message', { someData: 'value' });

      expect(mockLogs).toHaveLength(1);
      expect(mockLogs[0].level).toBe('warn');
      expect(mockLogs[0].args[0]).toContain('[WARN]');
      expect(mockLogs[0].args[0]).toContain('[test-op]');
      expect(mockLogs[0].args[0]).toContain('Warning message');
      expect(mockLogs[0].args[1]).toEqual({ someData: 'value' });
    });

    it('should log error messages', () => {
      const testLogger = Logger.getInstance('debug');
      testLogger.error('test-op', 'Error message', { error: 'Something went wrong' });

      expect(mockLogs).toHaveLength(1);
      expect(mockLogs[0].level).toBe('error');
      expect(mockLogs[0].args[0]).toContain('[ERROR]');
      expect(mockLogs[0].args[0]).toContain('[test-op]');
      expect(mockLogs[0].args[0]).toContain('Error message');
      expect(mockLogs[0].args[1]).toEqual({ error: 'Something went wrong' });
    });
  });

  describe('Log Level Filtering', () => {
    it('should filter debug messages when level is warn', () => {
      const testLogger = Logger.getInstance('warn');
      testLogger.debug('test-op', 'Debug message');
      testLogger.warn('test-op', 'Warning message');

      expect(mockLogs).toHaveLength(1);
      expect(mockLogs[0].level).toBe('warn');
    });

    it('should filter warning messages when level is error', () => {
      const testLogger = Logger.getInstance('error');
      testLogger.debug('test-op', 'Debug message');
      testLogger.warn('test-op', 'Warning message');
      testLogger.error('test-op', 'Error message');

      expect(mockLogs).toHaveLength(1);
      expect(mockLogs[0].level).toBe('error');
    });
  });

  describe('Sensitive Data Masking', () => {
    it('should mask password fields', () => {
      const testLogger = Logger.getInstance('debug');
      testLogger.debug('auth', 'Authentication attempt', {
        username: 'user1',
        // eslint-disable-next-line sonarjs/no-hardcoded-passwords
        password: 'secret123',

        apiKey: 'abc123def456',
      });

      expect(mockLogs).toHaveLength(1);
      const logData = mockLogs[0].args[1] as Record<string, unknown>;
      expect(logData.username).toBe('user1');
      expect(logData.password).toBe('se****23');
      expect(logData.apiKey).toBe('ab****56');
    });

    it('should mask nested sensitive fields', () => {
      const testLogger = Logger.getInstance('debug');
      testLogger.debug('config', 'Configuration loaded', {
        database: {
          host: 'localhost',
          // eslint-disable-next-line sonarjs/no-hardcoded-passwords
          password: 'dbpass',
          credentials: {
            token: 'secret-token',
          },
        },
        normalField: 'visible',
      });

      expect(mockLogs).toHaveLength(1);
      const logData = mockLogs[0].args[1] as Record<string, unknown>;
      expect((logData.database as Record<string, unknown>).host).toBe('localhost');
      expect((logData.database as Record<string, unknown>).password).toBe('db****ss');
      expect(
        ((logData.database as Record<string, unknown>).credentials as Record<string, unknown>).token
      ).toBe('se****en');
      expect(logData.normalField).toBe('visible');
    });

    it('should mask sensitive data in arrays', () => {
      const testLogger = Logger.getInstance('debug');

      const testItems = [
        { id: 1, token: 'secret1' },
        { id: 2, name: 'item2' },
        { id: 3, password: 'secret3' }, // eslint-disable-line sonarjs/no-hardcoded-passwords
      ];

      testLogger.debug('batch', 'Processing batch', {
        items: testItems,
      });

      expect(mockLogs).toHaveLength(1);
      const logData = mockLogs[0].args[1] as Record<string, unknown>;
      expect((logData.items as Array<Record<string, unknown>>)[0].token).toBe('se****t1');
      expect((logData.items as Array<Record<string, unknown>>)[1].name).toBe('item2');
      expect((logData.items as Array<Record<string, unknown>>)[2].password).toBe('se****t3');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty metadata', () => {
      const testLogger = Logger.getInstance('debug');
      testLogger.debug('test-op', 'Test message');

      expect(mockLogs).toHaveLength(1);
      expect(mockLogs[0].args).toHaveLength(2); // prefix + undefined metadata
    });

    it('should handle null/undefined values in metadata', () => {
      const testLogger = Logger.getInstance('debug');
      testLogger.debug('test-op', 'Test message', {
        nullValue: null,
        undefinedValue: undefined,
        stringValue: 'test',
      });

      expect(mockLogs).toHaveLength(1);
      const logData = mockLogs[0].args[1] as Record<string, unknown>;
      expect(logData.nullValue).toBe(null);
      expect(logData.undefinedValue).toBe(undefined);
      expect(logData.stringValue).toBe('test');
    });

    it('should handle short sensitive values', () => {
      const testLogger = Logger.getInstance('debug');
      testLogger.debug('test-op', 'Test message', {
        shortSecret: 'ab',
        normalValue: 'normal',
      });

      expect(mockLogs).toHaveLength(1);
      const logData = mockLogs[0].args[1] as Record<string, unknown>;
      expect(logData.shortSecret).toBe('****');
      expect(logData.normalValue).toBe('normal');
    });
  });

  describe('Singleton Pattern', () => {
    it('should return same instance', () => {
      const logger1 = Logger.getInstance();
      const logger2 = Logger.getInstance();

      expect(logger1).toBe(logger2);
    });

    it('should create instance with custom log level', () => {
      const customLogger = Logger.getInstance('error');
      customLogger.debug('test', 'should not appear');
      customLogger.error('test', 'should appear');

      expect(mockLogs).toHaveLength(1);
      expect(mockLogs[0].level).toBe('error');
    });
  });

  describe('Integration with Configuration System', () => {
    it('should demonstrate typical config logging usage', () => {
      // This test shows how logging would be used in real config operations
      const configLogger = Logger.getInstance('debug');

      // Simulate config loading
      configLogger.debug('config-load', 'Loading configuration cascade', {
        projectRoot: '/my/project',
        sources: ['defaults', 'global', 'project'],
      });

      configLogger.debug('config-merge', 'Merged project configuration', {
        source: 'project',
        configPath: '/my/project/.nimatarc',
        overrideKeys: ['qualityLevel', 'tools.eslint.configPath'],
      });

      configLogger.warn('config-validation', 'Configuration path validation failed', {
        filePath: '/my/project/.nimatarc',
        fieldPaths: ['tools.eslint.configPath', 'tools.typescript.outDir'],
      });

      expect(mockLogs).toHaveLength(3);
      expect(mockLogs[0].level).toBe('debug');
      expect(mockLogs[1].level).toBe('debug');
      expect(mockLogs[2].level).toBe('warn');

      // Verify field paths are included in warning metadata
      const warningData = mockLogs[2].args[1] as Record<string, unknown>;
      expect(warningData.fieldPaths as string[]).toContain('tools.eslint.configPath');
      expect(warningData.fieldPaths as string[]).toContain('tools.typescript.outDir');
    });
  });
});
