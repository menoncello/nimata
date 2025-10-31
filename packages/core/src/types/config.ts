/**
 * Quality level determines the strictness of code quality checks
 */
export type QualityLevel = 'light' | 'medium' | 'strict';

/**
 * Supported AI assistants for code generation and analysis
 */
export type AIAssistant = 'claude-code' | 'copilot' | 'windsurf';

/**
 * ESLint configuration options
 */
export interface ESLintConfig {
  enabled?: boolean;
  configPath?: string;
}

/**
 * TypeScript configuration options
 */
export interface TypeScriptConfig {
  enabled?: boolean;
  configPath?: string;
  strict?: boolean;
  target?: string;
}

/**
 * Prettier configuration options
 */
export interface PrettierConfig {
  enabled?: boolean;
  configPath?: string;
}

/**
 * Bun Test configuration options
 */
export interface BunTestConfig {
  enabled?: boolean;
  coverage?: boolean;
  coverageThreshold?: number;
}

/**
 * All tool configurations
 */
export interface ToolsConfig {
  eslint?: ESLintConfig;
  typescript?: TypeScriptConfig;
  prettier?: PrettierConfig;
  bunTest?: BunTestConfig;
}

/**
 * Scaffolding configuration options
 */
export interface ScaffoldingConfig {
  templateDirectory?: string;
  includeExamples?: boolean;
  initializeGit?: boolean;
  installDependencies?: boolean;
}

/**
 * Validation configuration options
 */
export interface ValidationConfig {
  cache?: boolean;
  parallel?: boolean;
}

/**
 * Refactoring configuration options
 */
export interface RefactoringConfig {
  preview?: boolean;
}

/**
 * Logging configuration options
 */
export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';

export interface LoggingConfig {
  level?: LogLevel;
  destination?: string;
}

/**
 * Complete Nìmata configuration
 *
 * Validation rules:
 * - All config paths must be relative (no absolute paths)
 * - Quality level must be one of: light, medium, strict
 * - AI assistants must be from supported list
 * - Coverage threshold must be 0-100
 */
export interface Config {
  version?: number;
  qualityLevel?: QualityLevel;
  aiAssistants?: AIAssistant[];
  tools?: ToolsConfig;
  scaffolding?: ScaffoldingConfig;
  validation?: ValidationConfig;
  refactoring?: RefactoringConfig;
  logging?: LoggingConfig;
}

/**
 * Validates that config paths are relative (security requirement)
 * @param {string} config - Configuration object to validate
 * @returns {string} Array of validation error messages (empty if valid)
 */
export function validateConfigPaths(config: Config): string[] {
  const errors: string[] = [];

  const checkPath = (path: string | undefined, fieldPath: string): void => {
    if (path && (path.startsWith('/') || path.includes('..'))) {
      errors.push(
        `${fieldPath}: Absolute paths and parent directory references are not allowed (got: ${path})`
      );
    }
  };

  checkPath(config.tools?.eslint?.configPath, 'tools.eslint.configPath');
  checkPath(config.tools?.typescript?.configPath, 'tools.typescript.configPath');
  checkPath(config.tools?.prettier?.configPath, 'tools.prettier.configPath');
  checkPath(config.scaffolding?.templateDirectory, 'scaffolding.templateDirectory');
  checkPath(config.logging?.destination, 'logging.destination');

  return errors;
}
