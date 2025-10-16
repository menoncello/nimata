/**
 * Nìmata CLI - Application Logic
 *
 * This file contains the main CLI application logic, separated from the entry point
 * to make it fully testable without mocking process.argv or import.meta.main
 */
import pc from 'picocolors';
import { injectable, inject } from 'tsyringe';
import { hideBin } from 'yargs/helpers';
import type { CliBuilder } from './cli-builder.js';
import { fixCommand } from './commands/fix.js';
import { initCommand } from './commands/init.js';
import { promptCommand } from './commands/prompt.js';
import { validateCommand } from './commands/validate.js';
import { EXIT_CODES } from './constants.js';
import type { OutputWriter } from './output.js';

/**
 * CLI Application Service
 * Handles all CLI operations with dependency injection
 */
@injectable()
export class CliApp {
  /**
   * Creates a new CLI application instance
   * @param output - Output writer for console operations
   * @param cliBuilder - CLI builder for creating Yargs instances
   */
  constructor(
    @inject('OutputWriter') private output: OutputWriter,
    @inject('CliBuilder') private cliBuilder: CliBuilder
  ) {}

  /**
   * Get CLI version from package.json
   * @returns The version string from package.json or '0.0.0' if not found
   */
  async getVersion(): Promise<string> {
    try {
      const packagePath = new URL('../package.json', import.meta.url);
      const packageJson = (await Bun.file(packagePath).json()) as { version?: string };
      return packageJson.version ?? '0.0.0';
    } catch {
      this.output.error(pc.red('Error reading package.json version'));
      return '0.0.0';
    }
  }

  /**
   * Handle Ctrl+C interruption gracefully
   * @returns void
   */
  setupInterruptHandler(): void {
    process.on('SIGINT', () => {
      this.output.log(pc.yellow('\n\nOperation interrupted by user'));
      process.exit(EXIT_CODES.INTERRUPTED);
    });
  }

  /**
   * Create and configure the CLI instance
   * @param version - The CLI version string
   * @param argv - Command line arguments array
   * @param suppressOutput - Suppress console output (for testing)
   * @returns Configured CLI builder instance
   */
  createCli(version: string, argv: string[], suppressOutput = false): CliBuilder {
    const cli = this.cliBuilder
      .create(argv)
      .scriptName('nimata')
      .version(version)
      .usage('$0 <command> [options]')
      .command(initCommand)
      .command(validateCommand)
      .command(fixCommand)
      .command(promptCommand)
      .option('config', {
        type: 'string',
        description: 'Path to custom configuration file',
        alias: 'c',
        global: true,
      })
      .demandCommand(1, pc.red('You must specify a command'))
      .help('h')
      .alias('h', 'help')
      .alias('v', 'version')
      .strict()
      .wrap(null)
      .epilogue(pc.dim('For more information, visit: https://github.com/yourusername/nimata'));

    // Suppress output and exit in test mode
    if (suppressOutput) {
      cli.exitProcess(false).showHelpOnFail(false).fail(false);
    }

    return cli;
  }

  /**
   * Run the CLI application
   * @param argv - Command line arguments (defaults to process.argv)
   * @returns Promise that resolves when CLI execution completes
   */
  async run(argv: string[] = hideBin(process.argv)): Promise<void> {
    try {
      // Setup interrupt handler
      this.setupInterruptHandler();

      // Get version
      const version = await this.getVersion();

      // Create and configure CLI
      const cli = this.createCli(version, argv);

      // Parse and execute
      await cli.parse();
    } catch (error) {
      this.output.error(pc.red('Fatal error:'), error);
      process.exit(EXIT_CODES.CONFIG_ERROR);
    }
  }
}
