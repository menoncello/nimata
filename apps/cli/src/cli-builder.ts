/**
 * CLI Builder - Yargs Wrapper
 *
 * Provides a mockable abstraction layer for Yargs CLI operations.
 * This allows tests to completely mock CLI behavior without executing Yargs.
 */
import { injectable } from 'tsyringe';
import yargs, { type CommandModule, type Options } from 'yargs';

/**
 * Interface for CLI builder operations
 */
export interface CliBuilder {
  /**
   * Create a CLI instance
   * @param {string[]} argv - Command line arguments
   * @returns {CliBuilder} CLI builder instance
   */
  create: (argv: string[]) => CliBuilder;

  /**
   * Set script name
   * @param {string} name - Script name
   * @returns {CliBuilder} CLI builder instance
   */
  scriptName: (name: string) => CliBuilder;

  /**
   * Set version
   * @param {string} version - Version string
   * @returns {CliBuilder} CLI builder instance
   */
  version: (version: string) => CliBuilder;

  /**
   * Set usage text
   * @param {string} usage - Usage text
   * @returns {CliBuilder} CLI builder instance
   */
  usage: (usage: string) => CliBuilder;

  /**
   * Add a command
   * @param {CommandModule} command - Command module
   * @returns {CliBuilder} CLI builder instance
   */
  command: (command: CommandModule) => CliBuilder;

  /**
   * Add an option
   * @param {string} key - Option key
   * @param {Options} config - Option configuration
   * @returns {CliBuilder} CLI builder instance
   */
  option: (key: string, config: Options) => CliBuilder;

  /**
   * Demand at least N commands
   * @param {number} count - Minimum number of commands
   * @param {string} message - Error message
   * @returns {CliBuilder} CLI builder instance
   */
  demandCommand: (count: number, message: string) => CliBuilder;

  /**
   * Enable help
   * @param {string} option - Help option
   * @returns {CliBuilder} CLI builder instance
   */
  help: (option: string) => CliBuilder;

  /**
   * Add alias
   * @param {string} key - Key to alias
   * @param {string} alias - Alias name
   * @returns {CliBuilder} CLI builder instance
   */
  alias: (key: string, alias: string) => CliBuilder;

  /**
   * Enable strict mode
   * @returns {CliBuilder} CLI builder instance
   */
  strict: () => CliBuilder;

  /**
   * Set wrap columns
   * @param {number | null} columns - Number of columns or null for auto
   * @returns {CliBuilder} CLI builder instance
   */
  wrap: (columns: number | null) => CliBuilder;

  /**
   * Set epilogue text
   * @param {string} text - Epilogue text
   * @returns {CliBuilder} CLI builder instance
   */
  epilogue: (text: string) => CliBuilder;

  /**
   * Control process exit
   * @param {boolean} enabled - Enable or disable process exit
   * @returns {CliBuilder} CLI builder instance
   */
  exitProcess: (enabled: boolean) => CliBuilder;

  /**
   * Show help on fail
   * @param {boolean} enabled - Enable or disable help on fail
   * @returns {CliBuilder} CLI builder instance
   */
  showHelpOnFail: (enabled: boolean) => CliBuilder;

  /**
   * Set fail handler
   * @param {((msg: string, err: Error) => void) | boolean} handler - Fail handler or false to disable
   * @returns {CliBuilder} CLI builder instance
   */
  fail: (handler: ((msg: string, err: Error) => void) | boolean) => CliBuilder;

  /**
   * Parse arguments and execute
   * @returns {Promise<void>} Promise that resolves when parsing is complete
   */
  parse: () => Promise<void>;
}

/**
 * Real Yargs implementation
 */
@injectable()
export class YargsCliBuilder implements CliBuilder {
  private instance: ReturnType<typeof yargs> | null = null;

  /**
   * Ensures the Yargs instance is initialized
   * @returns {ReturnType<typeof yargs>} The Yargs instance
   * @throws {Error} Error if create() has not been called
   */
  private ensureInstance(): ReturnType<typeof yargs> {
    if (!this.instance) {
      throw new Error('CLI instance not created. Call create() first.');
    }
    return this.instance;
  }

  create(argv: string[]): CliBuilder {
    this.instance = yargs(argv);
    return this;
  }

  scriptName(name: string): CliBuilder {
    this.instance = this.ensureInstance().scriptName(name);
    return this;
  }

  version(version: string): CliBuilder {
    this.instance = this.ensureInstance().version(version);
    return this;
  }

  usage(usage: string): CliBuilder {
    this.instance = this.ensureInstance().usage(usage);
    return this;
  }

  command(command: CommandModule): CliBuilder {
    this.instance = this.ensureInstance().command(command);
    return this;
  }

  option(key: string, config: Options): CliBuilder {
    this.instance = this.ensureInstance().option(key, config);
    return this;
  }

  demandCommand(count: number, message: string): CliBuilder {
    this.instance = this.ensureInstance().demandCommand(count, message);
    return this;
  }

  help(option: string): CliBuilder {
    this.instance = this.ensureInstance().help(option);
    return this;
  }

  alias(key: string, alias: string): CliBuilder {
    this.instance = this.ensureInstance().alias(key, alias);
    return this;
  }

  strict(): CliBuilder {
    this.instance = this.ensureInstance().strict();
    return this;
  }

  wrap(columns: number | null): CliBuilder {
    this.instance = this.ensureInstance().wrap(columns);
    return this;
  }

  epilogue(text: string): CliBuilder {
    this.instance = this.ensureInstance().epilogue(text);
    return this;
  }

  exitProcess(enabled: boolean): CliBuilder {
    this.instance = this.ensureInstance().exitProcess(enabled);
    return this;
  }

  showHelpOnFail(enabled: boolean): CliBuilder {
    this.instance = this.ensureInstance().showHelpOnFail(enabled);
    return this;
  }

  fail(handler: ((msg: string, err: Error) => void) | boolean): CliBuilder {
    this.instance = this.ensureInstance().fail(handler);
    return this;
  }

  async parse(): Promise<void> {
    await this.ensureInstance().parse();
  }
}
