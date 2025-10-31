/**
 * Basic CLI Types Generator
 *
 * Generates basic CLI type definitions
 */

/**
 * Generate command types
 * @returns {string} Command type definitions
 */
export function generateCommandTypes(): string {
  return `/**
 * Available CLI commands
 */
export type CLICommand = 'hello' | 'build' | 'deploy' | 'test' | 'lint' | 'clean';

/**
 * Command result interface
 */
export interface CommandResult {
  success: boolean;
  message?: string;
  data?: unknown;
  error?: Error;
}

/**
 * Command handler function type
 */
export type CommandHandler = (args: unknown, options: unknown) => Promise<CommandResult>;`;
}

/**
 * Generate application types
 * @returns {string} Application type definitions
 */
export function generateApplicationTypes(): string {
  return [
    generateAppConfigInterface(),
    generateCLIApplicationInterface(),
    generateCLIStateInterface(),
  ].join('\n\n');
}

/**
 * Generate AppConfig interface
 * @returns {string} AppConfig interface definition
 */
function generateAppConfigInterface(): string {
  return `/**
 * Application configuration interface
 */
export interface AppConfig {
  name: string;
  version: string;
  description: string;
  author: string;
  license: string;
  homepage?: string;
  repository?: string;
  bugs?: string;
  keywords?: string[];
  engines?: Record<string, string>;
}`;
}

/**
 * Generate CLIApplication interface
 * @returns {string} CLIApplication interface definition
 */
function generateCLIApplicationInterface(): string {
  return `/**
 * CLI application interface
 */
export interface CLIApplication {
  config: AppConfig;
  commands: Record<CLICommand, CommandHandler>;
  logger: Logger;
  plugins: CLIPlugin[];
}`;
}

/**
 * Generate CLIState interface
 * @returns {string} CLIState interface definition
 */
function generateCLIStateInterface(): string {
  return `/**
 * CLI state interface
 */
export interface CLIState {
  currentCommand?: CLICommand;
  isRunning: boolean;
  exitCode: number;
  startTime: Date;
  endTime?: Date;
}`;
}

/**
 * Generate command option types
 * @returns {string} Command option type definitions
 */
export function generateCommandOptionTypes(): string {
  return [
    generateGlobalOptions(),
    generateBuildOptions(),
    generateDeployOptions(),
    generateTestOptions(),
  ].join('\n\n');
}

/**
 * Generate global options interface
 * @returns {string} Global options interface definition
 */
function generateGlobalOptions(): string {
  return `/**
 * Global CLI options
 */
export interface GlobalOptions {
  verbose?: boolean;
  quiet?: boolean;
  config?: string;
  help?: boolean;
  version?: boolean;
}`;
}

/**
 * Generate build command options interface
 * @returns {string} Build options interface definition
 */
function generateBuildOptions(): string {
  return `/**
 * Build command options
 */
export interface BuildOptions extends GlobalOptions {
  watch?: boolean;
  minify?: boolean;
  sourcemap?: boolean;
  target?: string;
  output?: string;
}`;
}

/**
 * Generate deploy command options interface
 * @returns {string} Deploy options interface definition
 */
function generateDeployOptions(): string {
  return `/**
 * Deploy command options
 */
export interface DeployOptions extends GlobalOptions {
  environment?: string;
  dryRun?: boolean;
  force?: boolean;
  skipBuild?: boolean;
}`;
}

/**
 * Generate test command options interface
 * @returns {string} Test options interface definition
 */
function generateTestOptions(): string {
  return `/**
 * Test command options
 */
export interface TestOptions extends GlobalOptions {
  watch?: boolean;
  coverage?: boolean;
  pattern?: string;
  reporter?: string;
}`;
}
