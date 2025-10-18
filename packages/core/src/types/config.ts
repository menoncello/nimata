import { z } from 'zod';

/**
 * Quality level determines the strictness of code quality checks
 */
export const QualityLevel = z.enum(['light', 'medium', 'strict']);
export type QualityLevel = z.infer<typeof QualityLevel>;

/**
 * Supported AI assistants for code generation and analysis
 */
export const AIAssistant = z.enum(['claude-code', 'copilot', 'windsurf']);
export type AIAssistant = z.infer<typeof AIAssistant>;

/**
 * ESLint configuration options
 */
export const ESLintConfigSchema = z.object({
  enabled: z.boolean().optional(),
  configPath: z.string().optional(),
});
export type ESLintConfig = z.infer<typeof ESLintConfigSchema>;

/**
 * TypeScript configuration options
 */
export const TypeScriptConfigSchema = z.object({
  enabled: z.boolean().optional(),
  configPath: z.string().optional(),
  strict: z.boolean().optional(),
  target: z.string().optional(),
});
export type TypeScriptConfig = z.infer<typeof TypeScriptConfigSchema>;

/**
 * Prettier configuration options
 */
export const PrettierConfigSchema = z.object({
  enabled: z.boolean().optional(),
  configPath: z.string().optional(),
});
export type PrettierConfig = z.infer<typeof PrettierConfigSchema>;

const MIN_COVERAGE = 0;
const MAX_COVERAGE = 100;

/**
 * Bun Test configuration options
 */
export const BunTestConfigSchema = z.object({
  enabled: z.boolean().optional(),
  coverage: z.boolean().optional(),
  coverageThreshold: z.number().min(MIN_COVERAGE).max(MAX_COVERAGE).optional(),
});
export type BunTestConfig = z.infer<typeof BunTestConfigSchema>;

/**
 * All tool configurations
 */
export const ToolsConfigSchema = z.object({
  eslint: ESLintConfigSchema.optional(),
  typescript: TypeScriptConfigSchema.optional(),
  prettier: PrettierConfigSchema.optional(),
  bunTest: BunTestConfigSchema.optional(),
});
export type ToolsConfig = z.infer<typeof ToolsConfigSchema>;

/**
 * Scaffolding configuration options
 */
export const ScaffoldingConfigSchema = z.object({
  templateDirectory: z.string().optional(),
  includeExamples: z.boolean().optional(),
  initializeGit: z.boolean().optional(),
  installDependencies: z.boolean().optional(),
});
export type ScaffoldingConfig = z.infer<typeof ScaffoldingConfigSchema>;

/**
 * Validation configuration options
 */
export const ValidationConfigSchema = z.object({
  cache: z.boolean().optional(),
  parallel: z.boolean().optional(),
});
export type ValidationConfig = z.infer<typeof ValidationConfigSchema>;

/**
 * Refactoring configuration options
 */
export const RefactoringConfigSchema = z.object({
  preview: z.boolean().optional(),
});
export type RefactoringConfig = z.infer<typeof RefactoringConfigSchema>;

/**
 * Logging configuration options
 */
export const LoggingConfigSchema = z.object({
  level: z.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal']).optional(),
  destination: z.string().optional(),
});
export type LoggingConfig = z.infer<typeof LoggingConfigSchema>;

/**
 * Complete Nìmata configuration schema
 *
 * Validation rules:
 * - All config paths must be relative (no absolute paths)
 * - Quality level must be one of: light, medium, strict
 * - AI assistants must be from supported list
 * - Coverage threshold must be 0-100
 */
export const ConfigSchema = z.object({
  version: z.number().int().positive().default(1),
  qualityLevel: QualityLevel.default('strict'),
  aiAssistants: z.array(AIAssistant).default(['claude-code']),
  tools: ToolsConfigSchema.default({}),
  scaffolding: ScaffoldingConfigSchema.default({}),
  validation: ValidationConfigSchema.default({}),
  refactoring: RefactoringConfigSchema.default({}),
  logging: LoggingConfigSchema.default({}),
});

export type Config = z.infer<typeof ConfigSchema>;

/**
 * Validates that config paths are relative (security requirement)
 * @param config - Configuration object to validate
 * @returns Array of validation error messages (empty if valid)
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
