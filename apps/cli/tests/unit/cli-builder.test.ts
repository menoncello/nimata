import { describe, expect, it, beforeEach } from 'bun:test';
import { YargsCliBuilder } from '../../src/cli-builder';

describe('YargsCliBuilder', () => {
  let builder: YargsCliBuilder;

  beforeEach(() => {
    builder = new YargsCliBuilder();
  });

  describe('ensureInstance error handling', () => {
    const testCases = [
      { name: 'scriptName', fn: (): void => builder.scriptName('test') },
      { name: 'version', fn: (): void => builder.version('1.0.0') },
      { name: 'usage', fn: (): void => builder.usage('usage text') },
      { name: 'option', fn: (): void => builder.option('key', {}) },
      {
        name: 'demandCommand',
        fn: (): void => builder.demandCommand(1, 'message'),
      },
      { name: 'help', fn: (): void => builder.help('help') },
      { name: 'alias', fn: (): void => builder.alias('key', 'alias') },
      { name: 'strict', fn: (): void => builder.strict() },
      { name: 'wrap', fn: (): void => builder.wrap(80) },
      { name: 'epilogue', fn: (): void => builder.epilogue('text') },
      { name: 'exitProcess', fn: (): void => builder.exitProcess(false) },
      {
        name: 'showHelpOnFail',
        fn: (): void => builder.showHelpOnFail(false),
      },
      { name: 'fail', fn: (): void => builder.fail(false) },
    ];

    for (const testCase of testCases) {
      it(`should throw error when ${testCase.name} called before create`, () => {
        expect(testCase.fn).toThrow('CLI instance not created. Call create() first.');
      });
    }

    it('should throw error when parse called before create', async () => {
      await expect(builder.parse()).rejects.toThrow(
        'CLI instance not created. Call create() first.'
      );
    });
  });

  describe('builder methods after create', () => {
    beforeEach(() => {
      builder.create(['--help']);
    });

    it('should allow scriptName', () => {
      expect(builder.scriptName('test')).toBe(builder);
    });

    it('should allow version', () => {
      expect(builder.version('1.0.0')).toBe(builder);
    });

    it('should allow usage', () => {
      expect(builder.usage('Usage text')).toBe(builder);
    });

    it('should allow option', () => {
      expect(builder.option('test', { type: 'string' })).toBe(builder);
    });

    it('should allow demandCommand', () => {
      expect(builder.demandCommand(1, 'Need command')).toBe(builder);
    });

    it('should allow help', () => {
      expect(builder.help('help')).toBe(builder);
    });

    it('should allow alias', () => {
      expect(builder.alias('h', 'help')).toBe(builder);
    });

    it('should allow strict', () => {
      expect(builder.strict()).toBe(builder);
    });

    it('should allow wrap', () => {
      expect(builder.wrap(80)).toBe(builder);
    });

    it('should allow wrap with null', () => {
      expect(builder.wrap(null)).toBe(builder);
    });

    it('should allow epilogue', () => {
      expect(builder.epilogue('Epilogue text')).toBe(builder);
    });

    it('should allow exitProcess', () => {
      expect(builder.exitProcess(false)).toBe(builder);
    });

    it('should allow showHelpOnFail', () => {
      expect(builder.showHelpOnFail(false)).toBe(builder);
    });

    it('should allow fail', () => {
      expect(builder.fail(false)).toBe(builder);
    });
  });

  describe('method chaining', () => {
    it('should support full method chain', () => {
      const result = builder
        .create(['--help'])
        .scriptName('nimata')
        .version('1.0.0')
        .usage('Usage text')
        .help('help')
        .alias('h', 'help')
        .strict()
        .wrap(80)
        .epilogue('Epilogue')
        .exitProcess(false)
        .showHelpOnFail(false);

      expect(result).toBe(builder);
    });
  });
});
