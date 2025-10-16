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
   * @param argv - Command line arguments
   * @returns CLI builder instance
   */
  create: (argv: string[]) => CliBuilder;

  /**
   * Set script name
   * @param name - Script name
   * @returns CLI builder instance
   */
  scriptName: (name: string) => CliBuilder;

  /**
   * Set version
   * @param version - Version string
   * @returns CLI builder instance
   */
  version: (version: string) => CliBuilder;

  /**
   * Set usage text
   * @param usage - Usage text
   * @returns CLI builder instance
   */
  usage: (usage: string) => CliBuilder;

  /**
   * Add a command
   * @param command - Command module
   * @returns CLI builder instance
   */
  command: (command: CommandModule) => CliBuilder;

  /**
   * Add an option
   * @param key - Option key
   * @param config - Option configuration
   * @returns CLI builder instance
   */
  option: (key: string, config: Options) => CliBuilder;

  /**
   * Demand at least N commands
   * @param count - Minimum number of commands
   * @param message - Error message
   * @returns CLI builder instance
   */
  demandCommand: (count: number, message: string) => CliBuilder;

  /**
   * Enable help
   * @param option - Help option
   * @returns CLI builder instance
   */
  help: (option: string) => CliBuilder;

  /**
   * Add alias
   * @param key - Key to alias
   * @param alias - Alias name
   * @returns CLI builder instance
   */
  alias: (key: string, alias: string) => CliBuilder;

  /**
   * Enable strict mode
   * @returns CLI builder instance
   */
  strict: () => CliBuilder;

  /**
   * Set wrap columns
   * @param columns - Number of columns or null for auto
   * @returns CLI builder instance
   */
  wrap: (columns: number | null) => CliBuilder;

  /**
   * Set epilogue text
   * @param text - Epilogue text
   * @returns CLI builder instance
   */
  epilogue: (text: string) => CliBuilder;

  /**
   * Control process exit
   * @param enabled - Enable or disable process exit
   * @returns CLI builder instance
   */
  exitProcess: (enabled: boolean) => CliBuilder;

  /**
   * Show help on fail
   * @param enabled - Enable or disable help on fail
   * @returns CLI builder instance
   */
  showHelpOnFail: (enabled: boolean) => CliBuilder;

  /**
   * Set fail handler
   * @param handler - Fail handler or false to disable
   * @returns CLI builder instance
   */
  fail: (handler: ((msg: string, err: Error) => void) | boolean) => CliBuilder;

  /**
   * Parse arguments and execute
   * @returns Promise that resolves when parsing is complete
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
   * @returns The Yargs instance
   * @throws Error if create() has not been called
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
