/**
 * Template Context Types
 *
 * Comprehensive type definitions for template variables and context
 * used in template rendering with type safety and validation
 */

import type {
  ProjectConfig,
  ProjectQualityLevel,
  ProjectType,
  ProjectAIAssistant,
  ValidationResult,
  TemplateVariable,
} from './project-config.js';

/**
 * Base template context interface
 */
export interface BaseTemplateContext {
  // Core project information
  project_name: string;
  description: string;
  author?: string;
  license: string;
  version: string;

  // Project metadata
  quality_level: ProjectQualityLevel;
  project_type: ProjectType;
  is_strict: boolean;
  is_light: boolean;
  is_high_quality: boolean;

  // AI assistants configuration
  ai_assistants: ProjectAIAssistant[];
  has_claude_code: boolean;
  has_copilot: boolean;
  has_ai_context: boolean;

  // File system and paths
  target_directory?: string;
  project_root: string;
  src_directory: string;
  config_directory: string;
  tests_directory: string;

  // Dates and timestamps
  now: string;
  year: string;
  month: string;
  day: string;
  timestamp: number;

  // Feature flags
  enable_eslint: boolean;
  enable_prettier: boolean;
  enable_typescript: boolean;
  enable_tests: boolean;
  enable_git: boolean;

  // Package configuration
  package_manager: 'bun' | 'npm' | 'yarn' | 'pnpm';
  node_version?: string;
  bun_version?: string;

  // Repository information
  repository_url?: string;
  repository_type?: 'git' | 'svn' | 'mercurial';
  has_ci: boolean;
  has_github_actions: boolean;
}

/**
 * Extended template context with additional helper properties
 */
export interface ExtendedTemplateContext extends BaseTemplateContext {
  // Computed properties
  project_name_camel: string;
  project_name_pascal: string;
  project_name_kebab: string;
  project_name_snake: string;
  project_name_upper: string;
  project_name_lower: string;

  // License information
  license_short: string;
  license_full?: string;

  // Quality presets
  eslint_config: string;
  prettier_config: string;
  typescript_config: string;

  // Template-specific context
  template_data: Record<string, unknown>;
  custom_variables: Record<string, unknown>;

  // Advanced features
  enable_documentation: boolean;
  enable_examples: boolean;
  enable_changelog: boolean;
  enable_contributing: boolean;

  // Build configuration
  build_output: string;
  source_maps: boolean;
  minification: boolean;

  // Development configuration
  dev_server_port?: number;
  hot_reload: boolean;
  auto_restart: boolean;
}

/**
 * Template context validator
 */
export interface TemplateContextValidator {
  /**
   * Validates template context against variable definitions
   * @param {string} context - Context to validate
   * @param {string} variables - Variable definitions
   * @returns {string} Validation result
   */
  validate: (context: BaseTemplateContext, variables: TemplateVariable[]) => ValidationResult;
}

/**
 * Context transformation utilities
 */
export interface ContextTransformers {
  /**
   * Transforms ProjectConfig to BaseTemplateContext
   */
  fromProjectConfig: (config: ProjectConfig) => BaseTemplateContext;

  /**
   * Extends BaseTemplateContext with computed properties
   */
  extend: (base: BaseTemplateContext) => ExtendedTemplateContext;

  /**
   * Applies custom variables to context
   */
  applyCustomVariables: (
    context: ExtendedTemplateContext,
    variables: Record<string, unknown>
  ) => ExtendedTemplateContext;
}

/**
 * Type-safe variable getter
 */
export interface VariableGetter<T = unknown> {
  /**
   * Gets a variable from context with type safety
   * @param {string} key - Variable key
   * @param {string} context - Template context
   * @returns {string} Typed variable value or undefined
   */
  get: <K extends keyof T>(key: K, context: T) => T[K];

  /**
   * Gets a nested variable with type safety
   * @param {string} path - Dot notation path
   * @param {string} context - Template context
   * @returns {string} Variable value or undefined
   */
  getNested: (path: string, context: T) => unknown;

  /**
   * Gets a variable with fallback
   * @param {string} key - Variable key
   * @param {string} context - Template context
   * @param {string} fallback - Fallback value
   * @returns {string} Variable value or fallback
   */
  getWithFallback: <K extends keyof T>(key: K, context: T, fallback: T[K]) => T[K];
}

/**
 * Template context factory
 */
export interface TemplateContextFactory {
  /**
   * Creates base template context from project config
   */
  createBase: (config: ProjectConfig) => BaseTemplateContext;

  /**
   * Creates extended template context
   */
  createExtended: (
    config: ProjectConfig,
    customData?: Record<string, unknown>
  ) => ExtendedTemplateContext;

  /**
   * Creates context with validation
   */
  createValidated: (
    config: ProjectConfig,
    variables: TemplateVariable[],
    customData?: Record<string, unknown>
  ) => { context: ExtendedTemplateContext; validation: ValidationResult };
}
