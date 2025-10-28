/**
 * CLI Command Generators
 *
 * Generates command files for CLI projects
 */
import type { ProjectConfig } from '../../../types/project-config.js';

/**
 * CLI Command Generators
 *
 * Generates command files for CLI projects
 */
export class CLICommandGenerators {
  /**
   * Generate commands index file
   * @param _config - Project configuration
   * @returns Commands index file content
   */
  generateCommandsIndex(_config: ProjectConfig): string {
    return [
      this.generateCommandsHeader(),
      this.generateCommandExports(),
      this.generateCommandRegistry(),
      this.generateCommandHelpers(),
    ].join('\n');
  }

  /**
   * Generate commands index header
   * @returns Header section
   */
  private generateCommandsHeader(): string {
    return `/**
 * Commands Index
 *
 * Exports all available CLI commands
 */`;
  }

  /**
   * Generate command exports
   * @returns Command exports section
   */
  private generateCommandExports(): string {
    return `export { default as helloCommand } from './hello-command.js';
export { default as helpCommand } from './help-command.js';
export { default as versionCommand } from './version-command.js';`;
  }

  /**
   * Generate command registry
   * @returns Command registry section
   */
  private generateCommandRegistry(): string {
    return `/**
 * Command registry for dynamic command loading
 */
export const commandRegistry = new Map([
  ['hello', () => import('./hello-command.js')],
  ['help', () => import('./help-command.js')],
  ['version', () => import('./version-command.js')],
]);`;
  }

  /**
   * Generate command helper functions
   * @returns Command helpers section
   */
  private generateCommandHelpers(): string {
    return [
      this.generateGetAvailableCommands(),
      this.generateHasCommandFunction(),
      this.generateLoadCommandFunction(),
    ].join('\n');
  }

  /**
   * Generate getAvailableCommands function
   * @returns getAvailableCommands function section
   */
  private generateGetAvailableCommands(): string {
    return `/**
 * Get all available commands
 * @returns Array of command information
 */
export const getAvailableCommands = () => [
  { name: 'hello', description: 'Say hello to the world' },
  { name: 'help', description: 'Show help information' },
  { name: 'version', description: 'Show version information' },
];`;
  }

  /**
   * Generate hasCommand function
   * @returns hasCommand function section
   */
  private generateHasCommandFunction(): string {
    return `/**
 * Check if a command exists
 * @param name - Command name
 * @returns True if command exists
 */
export const hasCommand = (name: string): boolean => {
  return commandRegistry.has(name);
};`;
  }

  /**
   * Generate loadCommand function
   * @returns loadCommand function section
   */
  private generateLoadCommandFunction(): string {
    return `/**
 * Load a command dynamically
 * @param name - Command name
 * @returns Command module
 */
export const loadCommand = async (name: string) => {
  const loader = commandRegistry.get(name);
  if (!loader) {
    throw new Error(\`Command '\${name}' not found\`);
  }

  return loader();
};`;
  }

  /**
   * Generate hello command
   * @param _config - Project configuration
   * @returns Hello command content
   */
  generateHelloCommand(_config: ProjectConfig): string {
    return [
      this.generateHelloCommandHeader(),
      this.generateHelloCommandImports(),
      this.generateHelloCommandInterface(),
      this.generateHelloCommandExecute(),
      this.generateHelloCommandConfigure(),
      this.generateHelloCommandExport(),
    ].join('\n');
  }

  /**
   * Generate hello command header
   * @returns Header section
   */
  private generateHelloCommandHeader(): string {
    return `/**
 * Hello Command
 *
 * Simple greeting command implementation
 */`;
  }

  /**
   * Generate hello command imports
   * @returns Import section
   */
  private generateHelloCommandImports(): string {
    return `import type { Command } from 'commander';
import type { Logger } from '../utils/logger.js';`;
  }

  /**
   * Generate hello command interface
   * @returns Interface section
   */
  private generateHelloCommandInterface(): string {
    return `interface HelloOptions {
  caps?: boolean;
  fancy?: boolean;
}`;
  }

  /**
   * Generate hello command execute function
   * @returns Execute function section
   */
  private generateHelloCommandExecute(): string {
    return `/**
 * Execute hello command
 * @param name - Name to greet
 * @param options - Command options
 * @param logger - Logger instance
 */
function execute(name: string, options: HelloOptions, logger: Logger): void {
  let greeting = 'Hello';

  if (options.fancy) {
    greeting = '👋 Greetings';
  }

  let message = \`\${greeting}, \${name || 'World'}!\`;

  if (options.caps) {
    message = message.toUpperCase();
  }

  if (options.fancy) {
    message = \`✨ \${message} ✨\`;
  }

  logger.info(message);
}`;
  }

  /**
   * Generate hello command configure function
   * @returns Configure function section
   */
  private generateHelloCommandConfigure(): string {
    return `/**
 * Configure hello command
 * @param program - Commander program instance
 * @param logger - Logger instance
 * @returns Configured command
 */
function configure(program: Command, logger: Logger): Command {
  return program
    .command('hello')
    .description('Say hello to someone')
    .argument('[name]', 'Name to greet')
    .option('-c, --caps', 'Display message in uppercase')
    .option('-f, --fancy', 'Display fancy greeting with emojis')
    .action((name, options) => execute(name, options, logger));
}`;
  }

  /**
   * Generate hello command export
   * @returns Export section
   */
  private generateHelloCommandExport(): string {
    return `/**
 * Hello command module
 */
export default {
  execute,
  configure,
};`;
  }
}
