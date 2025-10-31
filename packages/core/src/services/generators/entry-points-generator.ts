/**
 * Entry Points Generator
 *
 * Handles generation of entry point files for different project types
 * Integrates with existing directory structure generation functionality
 */
import type { ProjectConfig } from '../../types/project-config.js';
import { DirectoryItem } from './directory-structure-generator.js';

/**
 * Entry Points Generator
 *
 * Provides focused interface for generating entry point files
 * Wraps the existing DirectoryStructureGenerator functionality
 */
export class EntryPointsGenerator {
  /**
   * Generate entry point files for a project
   * @param {ProjectConfig} config - Project configuration
   * @returns {DirectoryItem[]} Array of entry point file items
   */
  generate(config: ProjectConfig): DirectoryItem[] {
    const entryPoints: DirectoryItem[] = [];

    // Always generate main entry point
    entryPoints.push(this.generateMainEntryPoint(config));

    // Generate CLI entry point for CLI projects
    if (config.projectType === 'cli') {
      entryPoints.push(this.generateCliEntryPoint(config));
    }

    return entryPoints;
  }

  /**
   * Generate main entry point file (src/index.ts)
   * @param {ProjectConfig} config - Project configuration
   * @returns {DirectoryItem} Main entry point file item
   */
  private generateMainEntryPoint(config: ProjectConfig): DirectoryItem {
    const content = this.generateMainEntryPointContent(config);

    return {
      path: 'src/index.ts',
      type: 'file',
      content,
      mode: 0o644,
    };
  }

  /**
   * Generate CLI entry point file
   * @param {ProjectConfig} config - Project configuration
   * @returns {DirectoryItem} CLI entry point file item
   */
  private generateCliEntryPoint(config: ProjectConfig): DirectoryItem {
    const content = this.generateCliEntryPointContent(config);

    return {
      path: `bin/${config.name}`,
      type: 'file',
      content,
      executable: true,
      mode: 0o755,
    };
  }

  /**
   * Generate main entry point content
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Main entry point content
   */
  private generateMainEntryPointContent(config: ProjectConfig): string {
    const header = this.generateFileHeader(config);
    const constants = this.generateMainConstants(config);
    const coreClass = this.generateMainCoreClass(config);
    const mainFunction = this.generateMainFunction(config);
    const exports = this.generateMainExports(config);

    return `${header}

${constants}

${coreClass}

${mainFunction}

${exports}
`;
  }

  /**
   * Generate file header with project information
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} File header content
   */
  private generateFileHeader(config: ProjectConfig): string {
    return `/**
 * ${config.name}
 *
 * ${config.description || 'A TypeScript project'}
 *
 * @author ${config.author || 'Your Name'}
 * @license ${config.license || 'MIT'}
 * @version 1.0.0
 */`;
  }

  /**
   * Generate main constants for the entry point
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Constants content
   */
  private generateMainConstants(config: ProjectConfig): string {
    return `// Main exports
export const VERSION = '1.0.0';
export const NAME = '${config.name}';`;
  }

  /**
   * Generate the main core class
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Core class content
   */
  private generateMainCoreClass(config: ProjectConfig): string {
    const className = this.toPascalCase(config.name);

    return `/**
 * Main application class
 */
export class ${className}Core {
  private options: Record<string, any>;

  constructor(options: Record<string, any> = {}) {
    this.options = { debug: false, ...options };
  }

  /**
   * Initialize the application
   */
  async initialize(): Promise<void> {
    if (this.options.debug) {
      console.log(\`Initializing \${NAME} v\${VERSION}\`);
    }

    // TODO: Add your initialization logic here
  }

  /**
   * Main application logic
   */
  async run(): Promise<void> {
    if (this.options.debug) {
      console.log(\`Running \${NAME}\`);
    }

    // TODO: Add your main application logic here
  }
}`;
  }

  /**
   * Generate the main function
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Main function content
   */
  private generateMainFunction(config: ProjectConfig): string {
    const className = this.toPascalCase(config.name);

    return `/**
 * Main function
 */
export async function main(): Promise<void> {
  const app = new ${className}Core({
    debug: process.env.NODE_ENV === 'development'
  });

  await app.initialize();
  await app.run();
}`;
  }

  /**
   * Generate the main exports
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Main exports content
   */
  private generateMainExports(config: ProjectConfig): string {
    const className = this.toPascalCase(config.name);

    return `// Export main function for CLI usage
export default { main, ${className}Core, VERSION, NAME };`;
  }

  /**
   * Generate CLI entry point content
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} CLI entry point content
   */
  private generateCliEntryPointContent(config: ProjectConfig): string {
    const header = this.generateCliHeader(config);
    const errorHandlers = this.generateCliErrorHandlers();
    const entryPoint = this.generateCliEntryPointFunction(config);
    const helpFunction = this.generateCliHelpFunction(config);
    const execution = this.generateCliExecution();

    return `${header}

${errorHandlers}

${entryPoint}

${helpFunction}

${execution}
`;
  }

  /**
   * Generate CLI file header
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} CLI header content
   */
  private generateCliHeader(config: ProjectConfig): string {
    return `#!/usr/bin/env bun
/**
 * ${config.name} CLI Entry Point
 *
 * Main CLI launcher for ${config.name}
 *
 * @author ${config.author || 'Your Name'}
 * @license ${config.license || 'MIT'}
 * @version 1.0.0
 */`;
  }

  /**
   * Generate CLI error handlers
   * @returns {string} Error handlers content
   */
  private generateCliErrorHandlers(): string {
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
   * Generate CLI entry point function
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} CLI entry point function content
   */
  private generateCliEntryPointFunction(config: ProjectConfig): string {
    return `/**
 * CLI entry point wrapper with enhanced error handling
 */
async function cliEntryPoint(): Promise<void> {
  try {
    const args = process.argv.slice(2);

    if (args.length === 0) {
      showHelp();
      return;
    }

    if (isHelpRequested(args)) {
      showHelp();
      return;
    }

    if (isVersionRequested(args)) {
      showVersion('${config.name}');
      return;
    }

    const { main } = await import('../src/index.js');
    await main();

  } catch (error) {
    handleCliError(error, '${config.name}');
  }
}`;
  }

  /**
   * Generate CLI help function
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} CLI help function content
   */
  private generateCliHelpFunction(config: ProjectConfig): string {
    const helpFunction = this.generateShowHelpFunction(config);
    const helperFunctions = this.generateCliHelperFunctions();

    return `${helpFunction}

${helperFunctions}`;
  }

  /**
   * Generate the main show help function
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Show help function content
   */
  private generateShowHelpFunction(config: ProjectConfig): string {
    return `/**
 * Show help information
 */
function showHelp(): void {
  console.log('${config.name} - CLI Tool');
  console.log('');
  console.log('Usage:');
  console.log('  ${config.name} [options]');
  console.log('');
  console.log('Options:');
  console.log('  -h, --help     Show this help message');
  console.log('  -v, --version  Show version information');
  console.log('  --verbose      Show verbose output');
  console.log('');
  console.log('Examples:');
  console.log('  ${config.name} --help');
  console.log('  ${config.name} --version');
}`;
  }

  /**
   * Generate CLI helper functions
   * @returns {string} CLI helper functions content
   */
  private generateCliHelperFunctions(): string {
    const argumentHelpers = this.generateArgumentHelpers();
    const versionHelper = this.generateVersionHelper();
    const errorHelper = this.generateErrorHelper();

    return `${argumentHelpers}

${versionHelper}

${errorHelper}`;
  }

  /**
   * Generate argument helper functions
   * @returns {string} Argument helper functions content
   */
  private generateArgumentHelpers(): string {
    return `/**
 * Check if help is requested in arguments
 * @param args - Command line arguments
 * @returns Whether help is requested
 */
function isHelpRequested(args: string[]): boolean {
  return args.includes('--help') || args.includes('-h');
}

/**
 * Check if version is requested in arguments
 * @param args - Command line arguments
 * @returns Whether version is requested
 */
function isVersionRequested(args: string[]): boolean {
  return args.includes('--version') || args.includes('-v');
}`;
  }

  /**
   * Generate version helper function
   * @returns {string} Version helper function content
   */
  private generateVersionHelper(): string {
    return `/**
 * Show version information
 * @param projectName - Project name
 */
function showVersion(projectName: string): void {
  console.log(\`\${projectName} version 1.0.0\`);
}`;
  }

  /**
   * Generate error helper function
   * @returns {string} Error helper function content
   */
  private generateErrorHelper(): string {
    return `/**
 * Handle CLI errors
 * @param error - Error object
 * @param projectName - Project name
 */
function handleCliError(error: unknown, projectName: string): void {
  console.error(\`❌ \${projectName} CLI Error:\`);
  if (error instanceof Error) {
    console.error(error.message);
    if (process.env.NODE_ENV === 'development' || process.env.VERBOSE) {
      console.error('\\nStack trace:');
      console.error(error.stack);
    }
  } else {
    console.error('Unknown error occurred');
  }
  process.exit(1);
}`;
  }

  /**
   * Generate CLI execution call
   * @returns {string} CLI execution content
   */
  private generateCliExecution(): string {
    return `// Execute CLI entry point
cliEntryPoint();`;
  }

  /**
   * Convert string to PascalCase
   * @param {string} str - Input string
   * @returns {string} PascalCase string
   */
  private toPascalCase(str: string): string {
    return str.replace(/(?:^|[_-])(\w)/g, (_, char) => char.toUpperCase()).replace(/[_-]/g, '');
  }

  /**
   * Generate only main entry point
   * @param {ProjectConfig} config - Project configuration
   * @returns {DirectoryItem} Main entry point file item
   */
  generateMainEntryPointOnly(config: ProjectConfig): DirectoryItem {
    return this.generateMainEntryPoint(config);
  }

  /**
   * Generate only CLI entry point
   * @param {ProjectConfig} config - Project configuration
   * @returns {DirectoryItem} CLI entry point file item
   */
  generateCliEntryPointOnly(config: ProjectConfig): DirectoryItem {
    return this.generateCliEntryPoint(config);
  }

  /**
   * Check if project should have CLI entry point
   * @param {ProjectConfig} config - Project configuration
   * @returns {boolean} Whether project should have CLI entry point
   */
  shouldHaveCliEntryPoint(config: ProjectConfig): boolean {
    return config.projectType === 'cli';
  }
}
