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
   * @param {string} basePath - Base path where CLI should be created
   * @param {string} cliName - Name of the CLI tool
   * @throws {Error} if file creation fails
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
   * @param {string} cliName - Name of the CLI tool
   * @returns {string} CLI entry point file content
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
   * @returns {string} Shebang line
   */
  private generateShebang(): string {
    return '#!/usr/bin/env bun';
  }

  /**
   * Generates the file header with metadata
   * @param {string} cliName - Name of the CLI tool
   * @returns {string} File header content
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
   * @returns {string} Error handling code
   */
  private generateErrorHandlers(): string {
    return `// Error handling for uncaught exceptions
process.on('uncaughtException', (error) => {
  process.stderr.write('Uncaught Exception: ' + error.message + '\\n');
  if (process.env.NODE_ENV === 'development') {
    process.stderr.write((error.stack || 'No stack available') + '\\n');
  }
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  process.stderr.write('Unhandled Rejection at: ' + String(promise) + ', reason: ' + String(reason) + '\\n');
  process.exit(1);
});`;
  }

  /**
   * Generates the main CLI entry point function
   * @param {string} cliName - Name of the CLI tool
   * @returns {string} CLI entry point function
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
      process.stdout.write('${cliName} version 1.0.0\\n');
      return;
    }

    // Add your CLI logic here
    process.stdout.write('Hello from ${cliName} CLI!\\n');

  } catch (error) {
    handleCliError(error, '${cliName}');
  }
}`;
  }

  /**
   * Generates the show help function
   * @param {string} cliName - Name of the CLI tool
   * @returns {string} Show help function
   */
  private generateShowHelpFunction(cliName: string): string {
    return `/**
 * Shows help information for the CLI
   * @param {string} cliName - Name of the CLI tool
 */
function showHelp(cliName: string): void {
  const helpText = [
    '${cliName} - CLI Tool',
    'Usage: ${cliName} [options]',
    '',
    'Options:',
    '  --help     Show this help message',
    '  --version  Show version information'
  ].join('\\n');
  process.stdout.write(helpText + '\\n');
}`;
  }

  /**
   * Generates the error handling function
   * @param {string} _cliName - Name of the CLI tool
   * @returns {string} Error handling function
   */
  private generateHandleCliErrorFunction(_cliName: string): string {
    return `/**
 * Handles CLI errors with proper formatting
   * @param {string} error - Error that occurred
   * @param {string} cliName - Name of the CLI tool
 */
function handleCliError(error: unknown, cliName: string): void {
  process.stderr.write('❌ ' + cliName + ' CLI Error:\\n');
  if (error instanceof Error) {
    process.stderr.write(error.message + '\\n');
    if (process.env.NODE_ENV === 'development' || process.env.VERBOSE) {
      process.stderr.write('\\nStack trace:\\n');
      process.stderr.write((error.stack || 'No stack available') + '\\n');
    }
  } else {
    process.stderr.write('Unknown error occurred\\n');
  }

  // Exit with error code
  process.exit(1);
}`;
  }

  /**
   * Generates the entry point call
   * @returns {string} Entry point call
   */
  private generateEntryPointCall(): string {
    return `// Execute CLI entry point
cliEntryPoint();`;
  }
}
