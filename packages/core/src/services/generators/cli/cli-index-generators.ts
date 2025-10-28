/**
 * CLI Index Generators
 *
 * Generates main index files for CLI projects
 */
import type { ProjectConfig } from '../../../types/project-config.js';
import { toPascalCase } from '../../../utils/string-utils.js';

/**
 * CLI Index Generators
 *
 * Generates main index files for CLI projects
 */
export class CLIIndexGenerators {
  /**
   * Generate CLI index file
   * @param config - Project configuration
   * @returns CLI index file content
   */
  generateCLIIndex(config: ProjectConfig): string {
    const { name } = config;
    const className = toPascalCase(name);

    return `${this.generateCLIIndexHeader()}
${this.generateCLIIndexImports()}
${this.generateCLIIndexClass(className, name, config)}
${this.generateCLIIndexMain(className)}
${this.generateCLIIndexErrorHandlers()}
${this.generateCLIIndexEntry(className)}`;
  }

  /**
   * Generate CLI index header comment
   * @returns Header comment
   */
  private generateCLIIndexHeader(): string {
    return `/**
 * ${this.generateCLIIndexOptions()}
 *
 * ${this.generateCLIIndexParseOptions()}
 * ${this.generateCLIIndexMain('className')}
 */`;
  }

  /**
   * Generate CLI index description
   * @returns Description
   */
  private generateCLIIndexOptions(): string {
    return 'CLI Application Entry Point';
  }

  /**
   * Generate CLI index imports
   * @returns Import statements
   */
  private generateCLIIndexImports(): string {
    return `import { Command } from 'commander';
import { Logger } from './utils/logger.js';
import { helloCommand } from './commands/index.js';
import { appConfig } from './config/app-config.js';`;
  }

  /**
   * Generate CLI index class
   * @param className - Class name
   * @param name - Project name
   * @param _config - Project configuration
   * @returns CLI class implementation
   */
  private generateCLIIndexClass(className: string, name: string, _config: ProjectConfig): string {
    return [
      this.generateClassDeclaration(className, name),
      this.generateClassConstructor(name),
      this.generateClassMethods(className, name),
    ].join('\n');
  }

  /**
   * Generate class declaration and properties
   * @param className - Class name
   * @param _name - Project name
   * @returns Class declaration
   */
  private generateClassDeclaration(className: string, _name: string): string {
    return `/**
 * ${className} CLI Application
 */
export class ${className}CLI {
  private readonly program: Command;
  private readonly logger: Logger;`;
  }

  /**
   * Generate class constructor
   * @param name - Project name
   * @returns Constructor implementation
   */
  private generateClassConstructor(name: string): string {
    return `  constructor() {
    this.program = new Command();
    this.logger = new Logger({ prefix: '${name}' });

    this.setupProgram();
    this.setupCommands();
  }`;
  }

  /**
   * Generate class methods
   * @param _className - Class name
   * @param _name - Project name
   * @returns Class methods implementation
   */
  private generateClassMethods(_className: string, _name: string): string {
    return [
      this.generateSetupProgramMethod(),
      this.generateSetupCommandsMethod(),
      this.generateRunMethod(),
      this.generateParseGlobalOptionsMethod(),
      this.generateHandleErrorMethod(),
      this.generateClassClosing(),
    ].join('\n');
  }

  /**
   * Generate setup program method
   * @returns Setup program method implementation
   */
  private generateSetupProgramMethod(): string {
    return `  /**
   * Setup the main program
   */
  private setupProgram(): void {
    this.program
      .name(appConfig.name)
      .description(appConfig.description)
      .version(appConfig.version)
      .option('-v, --verbose', 'Enable verbose logging')
      .option('-q, --quiet', 'Suppress non-error output')
      .option('--no-color', 'Disable colored output')
      .option('--log-level <level>', 'Set log level', 'info')
      .option('--config <path>', 'Path to configuration file');
  }`;
  }

  /**
   * Generate setup commands method
   * @returns Setup commands method implementation
   */
  private generateSetupCommandsMethod(): string {
    return `  /**
   * Setup available commands
   */
  private setupCommands(): void {
    // Register commands
    helloCommand.configure(this.program, this.logger);

    // TODO: Add more commands as they are implemented
    // buildCommand.configure(this.program, this.logger);
    // deployCommand.configure(this.program, this.logger);
  }`;
  }

  /**
   * Generate run method
   * @returns Run method implementation
   */
  private generateRunMethod(): string {
    return `  /**
   * Run the CLI application
   * @param argv - Command line arguments
   */
  async run(argv: string[]): Promise<void> {
    try {
      // Parse global options
      this.parseGlobalOptions();

      // Execute command
      await this.program.parseAsync(argv);
    } catch (error) {
      this.handleError(error);
      process.exit(1);
    }
  }`;
  }

  /**
   * Generate parse global options method
   * @returns Parse global options method implementation
   */
  private generateParseGlobalOptionsMethod(): string {
    return `  /**
   * Parse global options and configure logger
   */
  private parseGlobalOptions(): void {
    const options = this.program.opts();

    // Configure logging
    if (options.quiet) {
      this.logger.setLevel('error');
    } else if (options.verbose) {
      this.logger.setLevel('debug');
    } else if (options.logLevel) {
      this.logger.setLevel(options.logLevel);
    }

    // Configure colors
    this.logger.setColorEnabled(options.color !== false);

    // Load configuration if specified
    if (options.config) {
      // TODO: Implement configuration loading
      this.logger.debug(\`Loading configuration from: \${options.config}\`);
    }
  }`;
  }

  /**
   * Generate handle error method
   * @returns Handle error method implementation
   */
  private generateHandleErrorMethod(): string {
    return [
      this.generateHandleErrorMethodStart(),
      this.generateHandleCommanderError(),
      this.generateHandleValidationError(),
      this.generateHandleUnexpectedError(),
      this.generateHandleErrorMethodEnd(),
    ].join('\n');
  }

  /**
   * Generate handle error method start
   * @returns Method signature and opening
   */
  private generateHandleErrorMethodStart(): string {
    return `  /**
   * Handle application errors
   * @param error - Error to handle
   */
  private handleError(error: Error): void {`;
  }

  /**
   * Generate commander error handling
   * @returns Commander error handling logic
   */
  private generateHandleCommanderError(): string {
    return `    if (error.name === 'CommanderError') {
      // Handle commander.js specific errors
      if (error.code === 'commander.help') {
        // Help was requested, exit gracefully
        process.exit(0);
      }

      this.logger.error(error.message);
      process.exit(1);
    }`;
  }

  /**
   * Generate validation error handling
   * @returns Validation error handling logic
   */
  private generateHandleValidationError(): string {
    return `    if (error.name === 'ValidationError') {
      this.logger.error(\`Validation error: \${error.message}\`);
      if (error.suggestions) {
        this.logger.info('Suggestions:');
        error.suggestions.forEach((suggestion: string) => {
          this.logger.info(\`  - \${suggestion}\`);
        });
      }
      process.exit(1);
    }`;
  }

  /**
   * Generate unexpected error handling
   * @returns Unexpected error handling logic
   */
  private generateHandleUnexpectedError(): string {
    return `    // Handle unexpected errors
    this.logger.error('An unexpected error occurred:', error.message);
    this.logger.debug(error.stack);

    process.exit(1);`;
  }

  /**
   * Generate handle error method end
   * @returns Method closing
   */
  private generateHandleErrorMethodEnd(): string {
    return `  }`;
  }

  /**
   * Generate class closing brace
   * @returns Class closing
   */
  private generateClassClosing(): string {
    return `}`;
  }

  /**
   * Generate CLI main function options
   * @returns Main function options description
   */
  private generateCLIIndexParseOptions(): string {
    return 'Main CLI application class with command handling';
  }

  /**
   * Generate CLI main function
   * @param className - Class name
   * @returns Main function implementation
   */
  private generateCLIIndexMain(className: string): string {
    return `/**
 * Main function - entry point for the CLI application
 */
async function main(): Promise<void> {
  const cli = new ${className}CLI();
  await cli.run(process.argv);
}

// Run the application if this file is executed directly
if (import.meta.url === \`file://\${process.argv[1]}\`) {
  main().catch((error) => {
    console.error('Failed to start CLI application:', error);
    process.exit(1);
  });
}`;
  }

  /**
   * Generate CLI error handlers
   * @returns Error handling code
   */
  private generateCLIIndexErrorHandlers(): string {
    return `/**
 * Global error handlers
 */

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Handle SIGINT (Ctrl+C)
process.on('SIGINT', () => {
  console.log('\\nReceived SIGINT. Gracefully shutting down...');
  process.exit(0);
});

// Handle SIGTERM
process.on('SIGTERM', () => {
  console.log('\\nReceived SIGTERM. Gracefully shutting down...');
  process.exit(0);
});`;
  }

  /**
   * Generate CLI entry point
   * @param className - Class name
   * @returns Entry point export
   */
  private generateCLIIndexEntry(className: string): string {
    return `/**
 * Export the CLI class for programmatic usage
 */
export { ${className}CLI as CLI };
export default CLI;`;
  }
}
