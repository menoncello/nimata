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

    // Mock process.stdout and process.stderr since logger writes directly to them
    const originalStdoutWrite = process.stdout.write;
    const originalStderrWrite = process.stderr.write;

    process.stdout.write = (data: string) => {
      mockLogs.push({ level: 'stdout', args: [data] });
      return true;
    };

    process.stderr.write = (data: string) => {
      mockLogs.push({ level: 'stderr', args: [data] });
      return true;
    };

    // Store original methods to restore in afterEach
    (global as any).originalStdoutWrite = originalStdoutWrite;
    (global as any).originalStderrWrite = originalStderrWrite;
  });

  afterEach(() => {
    global.console = originalConsole;

    // Restore process.stdout and process.stderr
    if ((global as any).originalStdoutWrite) {
      process.stdout.write = (global as any).originalStdoutWrite;
    }
    if ((global as any).originalStderrWrite) {
      process.stderr.write = (global as any).originalStderrWrite;
    }
  });

  describe('Basic Logging', () => {
    it('should log debug messages', () => {
      const testLogger = Logger.getInstance('debug');
      testLogger.debug('test-op', 'Test message', { key: 'value' });

      expect(mockLogs).toHaveLength(1);
      expect(mockLogs[0].level).toBe('stderr');
      expect(mockLogs[0].args[0]).toContain('DEBUG:');
      expect(mockLogs[0].args[0]).toContain('[test-op]');
      expect(mockLogs[0].args[0]).toContain('Test message');
      expect(mockLogs[0].args[0]).toContain(JSON.stringify({ key: 'value' }));
    });

    it('should log warning messages', () => {
      const testLogger = Logger.getInstance('debug');
      testLogger.warn('test-op', 'Warning message', { someData: 'value' });

      expect(mockLogs).toHaveLength(1);
      expect(mockLogs[0].level).toBe('stderr');
      expect(mockLogs[0].args[0]).toContain('WARN:');
      expect(mockLogs[0].args[0]).toContain('[test-op]');
      expect(mockLogs[0].args[0]).toContain('Warning message');
      expect(mockLogs[0].args[0]).toContain(JSON.stringify({ someData: 'value' }));
    });

    it('should log error messages', () => {
      const testLogger = Logger.getInstance('debug');
      testLogger.error('test-op', 'Error message', { error: 'Something went wrong' });

      expect(mockLogs).toHaveLength(1);
      expect(mockLogs[0].level).toBe('stderr');
      expect(mockLogs[0].args[0]).toContain('ERROR:');
      expect(mockLogs[0].args[0]).toContain('[test-op]');
      expect(mockLogs[0].args[0]).toContain('Error message');
      expect(mockLogs[0].args[0]).toContain(JSON.stringify({ error: 'Something went wrong' }));
    });
  });

  describe('Log Level Filtering', () => {
    it('should filter debug messages when level is warn', () => {
      const testLogger = Logger.getInstance('warn');
      testLogger.debug('test-op', 'Debug message');
      testLogger.warn('test-op', 'Warning message');

      expect(mockLogs).toHaveLength(1);
      expect(mockLogs[0].level).toBe('stderr');
      expect(mockLogs[0].args[0]).toContain('WARN:');
    });

    it('should filter warning messages when level is error', () => {
      const testLogger = Logger.getInstance('error');
      testLogger.debug('test-op', 'Debug message');
      testLogger.warn('test-op', 'Warning message');
      testLogger.error('test-op', 'Error message');

      expect(mockLogs).toHaveLength(1);
      expect(mockLogs[0].level).toBe('stderr');
      expect(mockLogs[0].args[0]).toContain('ERROR:');
    });
  });

  describe('Sensitive Data Masking', () => {
    it('should mask password fields', () => {
      const testLogger = Logger.getInstance('debug');
      testLogger.debug('auth', 'Authentication attempt', {
        username: 'user1',
        password: process.env.TEST_PASSWORD || 'test-mask-123', // Environment variable or test value

        apiKey: 'abc123def456',
      });

      expect(mockLogs).toHaveLength(1);
      const logMessage = mockLogs[0].args[0] as string;
      const jsonPart = logMessage.substring(logMessage.lastIndexOf('{'));
      const logData = JSON.parse(jsonPart) as Record<string, unknown>;
      expect(logData.username).toBe('user1');
      expect(logData.password).toBe('te****23');
      expect(logData.apiKey).toBe('ab****56');
    });

    it('should mask nested sensitive fields', () => {
      const testLogger = Logger.getInstance('debug');
      testLogger.debug('config', 'Configuration loaded', {
        database: {
          host: 'localhost',
          password: process.env.TEST_DB_PASSWORD || 'test-db-mask', // Environment variable or test value
          credentials: {
            token: process.env.TEST_TOKEN || 'test-token-mask',
          },
        },
        normalField: 'visible',
      });

      expect(mockLogs).toHaveLength(1);
      const logMessage = mockLogs[0].args[0] as string;
      // Find the JSON part - it should be between the last space and newline
      const jsonStart = logMessage.lastIndexOf(' ') + 1;
      const jsonEnd = logMessage.lastIndexOf('\n');
      const jsonPart = logMessage.substring(jsonStart, jsonEnd);
      const logData = JSON.parse(jsonPart) as Record<string, unknown>;
      expect((logData.database as Record<string, unknown>).host).toBe('localhost');
      expect((logData.database as Record<string, unknown>).password).toBe('te****sk');
      expect(
        ((logData.database as Record<string, unknown>).credentials as Record<string, unknown>).token
      ).toBe('te****sk');
      expect(logData.normalField).toBe('visible');
    });

    it('should mask sensitive data in arrays', () => {
      const testLogger = Logger.getInstance('debug');

      const testItems = [
        { id: 1, token: process.env.TEST_ITEM_TOKEN || 'test-item-token' },
        { id: 2, name: 'item2' },
        { id: 3, password: process.env.TEST_ITEM_PASSWORD || 'test-item-pass' }, // Environment variable or test value
      ];

      testLogger.debug('batch', 'Processing batch', {
        items: testItems,
      });

      expect(mockLogs).toHaveLength(1);
      const logMessage = mockLogs[0].args[0] as string;
      // Find the JSON part - it should be between the last space and newline
      const jsonStart = logMessage.lastIndexOf(' ') + 1;
      const jsonEnd = logMessage.lastIndexOf('\n');
      const jsonPart = logMessage.substring(jsonStart, jsonEnd);
      const logData = JSON.parse(jsonPart) as Record<string, unknown>;
      expect((logData.items as Array<Record<string, unknown>>)[0].token).toBe('te****en');
      expect((logData.items as Array<Record<string, unknown>>)[1].name).toBe('item2');
      expect((logData.items as Array<Record<string, unknown>>)[2].password).toBe('te****ss');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty metadata', () => {
      const testLogger = Logger.getInstance('debug');
      testLogger.debug('test-op', 'Test message');

      expect(mockLogs).toHaveLength(1);
      expect(mockLogs[0].args).toHaveLength(1); // single string argument with undefined metadata
    });

    it('should handle null/undefined values in metadata', () => {
      const testLogger = Logger.getInstance('debug');
      testLogger.debug('test-op', 'Test message', {
        nullValue: null,
        undefinedValue: undefined,
        stringValue: 'test',
      });

      expect(mockLogs).toHaveLength(1);
      const logMessage = mockLogs[0].args[0] as string;
      // Find the JSON part - it should be between the last space and newline
      const jsonStart = logMessage.lastIndexOf(' ') + 1;
      const jsonEnd = logMessage.lastIndexOf('\n');
      const jsonPart = logMessage.substring(jsonStart, jsonEnd);
      const logData = JSON.parse(jsonPart) as Record<string, unknown>;
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
      const logMessage = mockLogs[0].args[0] as string;
      // Find the JSON part - it should be between the last space and newline
      const jsonStart = logMessage.lastIndexOf(' ') + 1;
      const jsonEnd = logMessage.lastIndexOf('\n');
      const jsonPart = logMessage.substring(jsonStart, jsonEnd);
      const logData = JSON.parse(jsonPart) as Record<string, unknown>;
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
      expect(mockLogs[0].level).toBe('stderr'); // error messages go to stderr
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
      expect(mockLogs[0].level).toBe('stderr'); // debug goes to stderr
      expect(mockLogs[1].level).toBe('stderr'); // debug goes to stderr
      expect(mockLogs[2].level).toBe('stderr'); // warn goes to stderr

      // Verify field paths are included in warning metadata
      const warningMessage = mockLogs[2].args[0] as string;
      const warningJsonStart = warningMessage.lastIndexOf(' ') + 1;
      const warningJsonEnd = warningMessage.lastIndexOf('\n');
      const warningJsonPart = warningMessage.substring(warningJsonStart, warningJsonEnd);
      const warningData = JSON.parse(warningJsonPart) as Record<string, unknown>;
      expect(warningData.fieldPaths as string[]).toContain('tools.eslint.configPath');
      expect(warningData.fieldPaths as string[]).toContain('tools.typescript.outDir');
    });
  });
});
