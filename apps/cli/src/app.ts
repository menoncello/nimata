/**
 * Nìmata CLI - Application Logic
 *
 * This file contains the main CLI application logic, separated from the entry point
 * to make it fully testable without mocking process.argv or import.meta.main
 */
import pc from 'picocolors';
import { injectable, inject } from 'tsyringe';
import type { CommandModule } from 'yargs';
import { hideBin } from 'yargs/helpers';
import type { CliBuilder } from './cli-builder.js';
import { EXIT_CODES } from './constants.js';
import type { OutputWriter } from './output.js';

/**
 * Lazy load all CLI commands for better cold start performance
 * @returns Array of command instances
 */
async function loadCommands(): Promise<{
  initCommand: CommandModule;
  validateCommand: CommandModule;
  fixCommand: CommandModule;
  promptCommand: CommandModule;
}> {
  const [initCommand, validateCommand, fixCommand, promptCommand] = await Promise.all([
    import('./commands/init.js').then(m => m.initCommand),
    import('./commands/validate.js').then(m => m.validateCommand),
    import('./commands/fix.js').then(m => m.fixCommand),
    import('./commands/prompt.js').then(m => m.promptCommand),
  ]);
  return { initCommand, validateCommand, fixCommand, promptCommand };
}

/**
 * Configure CLI with common options and settings
 * @param cli - CLI builder instance
 * @param version - Application version
 * @returns Configured CLI builder
 */
function configureCli(cli: CliBuilder, version: string): CliBuilder {
  return cli
    .scriptName('nimata')
    .version(version)
    .usage('$0 <command> [options]')
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
}

/**
 * Configure CLI for test mode (suppress output, disable exit)
 * @param cli - CLI builder instance
 * @returns CLI builder configured for testing
 */
function configureForTestMode(cli: CliBuilder): CliBuilder {
  return cli.exitProcess(false).showHelpOnFail(false).fail(false);
}

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
   * @returns Promise that resolves to configured CLI builder instance
   */
  async createCli(version: string, argv: string[], suppressOutput = false): Promise<CliBuilder> {
    const commands = await loadCommands();

    let cli = configureCli(
      this.cliBuilder.create(argv)
        .command(commands.initCommand)
        .command(commands.validateCommand)
        .command(commands.fixCommand)
        .command(commands.promptCommand),
      version
    );

    if (suppressOutput) {
      cli = configureForTestMode(cli);
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

      // Create and configure CLI (now async for lazy loading)
      const cli = await this.createCli(version, argv);

      // Parse and execute
      await cli.parse();
    } catch (error) {
      this.output.error(pc.red('Fatal error:'), error);
      process.exit(EXIT_CODES.CONFIG_ERROR);
    }
  }
}
