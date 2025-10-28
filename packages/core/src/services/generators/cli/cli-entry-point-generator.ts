/**
 * CLI Entry Point Generator
 *
 * Generates CLI entry point files with proper error handling
 */
import { promises as fs } from 'node:fs';
import { join } from 'node:path';

const DEFAULT_DIR_PERMISSIONS = 0o755;
const DEFAULT_EXECUTABLE_PERMISSIONS = 0o755;

/**
 * Generates CLI entry point files with enhanced error handling
 */
export class CliEntryPointGenerator {
  /**
   * Generates a CLI entry point file
   * @param basePath - Base path where CLI should be created
   * @param cliName - Name of the CLI tool
   * @throws Error if file creation fails
   */
  async generateCliEntryPoint(basePath: string, cliName: string): Promise<void> {
    const filePath = join(basePath, 'bin', cliName);
    const content = this.generateCliContent(cliName);

    try {
      // Ensure the bin directory exists
      await fs.mkdir(join(basePath, 'bin'), { recursive: true, mode: DEFAULT_DIR_PERMISSIONS });
      await fs.writeFile(filePath, content, { mode: DEFAULT_EXECUTABLE_PERMISSIONS });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to create CLI entry point: ${error.message}`);
      }
      throw new Error('Failed to create CLI entry point: Unknown error');
    }
  }

  /**
   * Generates the content for a CLI entry point file
   * @param cliName - Name of the CLI tool
   * @returns CLI entry point file content
   */
  private generateCliContent(cliName: string): string {
    return [
      this.generateShebang(),
      this.generateFileHeader(cliName),
      this.generateErrorHandlers(),
      this.generateCliEntryPointFunction(cliName),
      this.generateShowHelpFunction(cliName),
      this.generateHandleCliErrorFunction(cliName),
      this.generateEntryPointCall(),
    ].join('\n');
  }

  /**
   * Generates the shebang line
   * @returns Shebang line
   */
  private generateShebang(): string {
    return '#!/usr/bin/env bun';
  }

  /**
   * Generates the file header with metadata
   * @param cliName - Name of the CLI tool
   * @returns File header content
   */
  private generateFileHeader(cliName: string): string {
    return `/**
 * ${cliName} CLI Entry Point
 *
 * Main CLI launcher for ${cliName}
 *
 * @author Your Name
 * @license MIT
 * @version 1.0.0
 */`;
  }

  /**
   * Generates error handling code
   * @returns Error handling code
   */
  private generateErrorHandlers(): string {
    return `// Error handling for uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error.message);
  if (process.env.NODE_ENV === 'development') {
    console.error(error.stack);
  }
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});`;
  }

  /**
   * Generates the main CLI entry point function
   * @param cliName - Name of the CLI tool
   * @returns CLI entry point function
   */
  private generateCliEntryPointFunction(cliName: string): string {
    return `/**
 * CLI entry point wrapper with enhanced error handling
 */
async function cliEntryPoint(): Promise<void> {
  try {
    // Parse command line arguments
    const args = process.argv.slice(2);

    // Show help if no arguments provided
    if (args.length === 0) {
      showHelp('${cliName}');
      return;
    }

    // Handle basic commands
    if (args.includes('--help')) {
      showHelp('${cliName}');
      return;
    }

    if (args.includes('--version')) {
      console.log('${cliName} version 1.0.0');
      return;
    }

    // Add your CLI logic here
    console.log('Hello from ${cliName} CLI!');

  } catch (error) {
    handleCliError(error, '${cliName}');
  }
}`;
  }

  /**
   * Generates the show help function
   * @param cliName - Name of the CLI tool
   * @returns Show help function
   */
  private generateShowHelpFunction(cliName: string): string {
    return `/**
 * Shows help information for the CLI
 * @param cliName - Name of the CLI tool
 */
function showHelp(cliName: string): void {
  console.log('${cliName} - CLI Tool');
  console.log('Usage: ${cliName} [options]');
  console.log('');
  console.log('Options:');
  console.log('  --help     Show this help message');
  console.log('  --version  Show version information');
}`;
  }

  /**
   * Generates the error handling function
   * @param _cliName - Name of the CLI tool
   * @returns Error handling function
   */
  private generateHandleCliErrorFunction(_cliName: string): string {
    return `/**
 * Handles CLI errors with proper formatting
 * @param error - Error that occurred
 * @param cliName - Name of the CLI tool
 */
function handleCliError(error: unknown, cliName: string): void {
  console.error(\`❌ \${cliName} CLI Error:\`);
  if (error instanceof Error) {
    console.error(error.message);
    if (process.env.NODE_ENV === 'development' || process.env.VERBOSE) {
      console.error('\\nStack trace:');
      console.error(error.stack);
    }
  } else {
    console.error('Unknown error occurred');
  }

  // Exit with error code
  process.exit(1);
}`;
  }

  /**
   * Generates the entry point call
   * @returns Entry point call
   */
  private generateEntryPointCall(): string {
    return `// Execute CLI entry point
cliEntryPoint();`;
  }
}
