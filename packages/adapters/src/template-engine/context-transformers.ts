/**
 * Template Context Transformers Implementation
 *
 * Provides context transformation utilities for template generation
 */

import type {
  BaseTemplateContext,
  ExtendedTemplateContext,
  ContextTransformers,
  ProjectConfig,
} from '@nimata/core';
import { ContextConfigProviders } from './context-config-providers';
import { StringTransformersImpl } from './string-transformers';
import { ValidationUtils } from './validation-utils';

/**
 * Constants for template context transformation
 */
const _TEMPLATE_CONTEXT_CONSTANTS = {
  GET_NEXT_MONTH_OFFSET: 1,
  MONTH_DAY_PAD_LENGTH: 2,
  DEFAULT_LICENSE: 'MIT',
  DEFAULT_VERSION: '1.0.0',
  DEFAULT_DESCRIPTION: 'A TypeScript project',
  BUN_VERSION: '1.x',
  NODE_VERSION: '18.x',
  DEFAULT_QUALITY_LEVEL: 'medium' as const,
} as const;

/**
 * Template context transformer implementation
 */
export class ContextTransformersImpl implements ContextTransformers {
  /**
   * Transforms ProjectConfig to BaseTemplateContext
   * @param config - The project configuration to transform
   * @returns The base template context
   */
  fromProjectConfig(config: ProjectConfig): BaseTemplateContext {
    const now = new Date();

    return {
      ...this.getProjectInfo(config),
      ...this.getProjectMetadata(config),
      ...this.getAIAssistantConfig(config.aiAssistants),
      ...this.getFilesystemPaths(config),
      ...this.getDateInfo(now),
      ...this.getFeatureFlags(),
      ...this.getPackageConfig(),
      ...this.getRepositoryInfo(),
    };
  }

  /**
   * Gets core project information from the project configuration.
   * Extracts basic project details like name, description, author, license and version.
   * @param config - The project configuration containing project metadata
   * @returns An object containing project information properties
   */
  private getProjectInfo(config: ProjectConfig): {
    project_name: string;
    description: string;
    author?: string;
    license: string;
    version: string;
  } {
    return {
      project_name: config.name,
      description: config.description || _TEMPLATE_CONTEXT_CONSTANTS.DEFAULT_DESCRIPTION,
      author: config.author,
      license: config.license || _TEMPLATE_CONTEXT_CONSTANTS.DEFAULT_LICENSE,
      version: _TEMPLATE_CONTEXT_CONSTANTS.DEFAULT_VERSION,
    };
  }

  /**
   * Gets project metadata and quality level properties from the project configuration.
   * Extracts quality level information and project type settings.
   * @param config - The project configuration containing quality and type settings
   * @returns An object containing project metadata properties including quality flags
   */
  private getProjectMetadata(config: ProjectConfig): {
    quality_level: import('@nimata/core').ProjectQualityLevel;
    project_type: import('@nimata/core').ProjectType;
    is_strict: boolean;
    is_light: boolean;
    is_high_quality: boolean;
  } {
    return {
      quality_level: config.qualityLevel,
      project_type: config.projectType,
      is_strict: config.qualityLevel === 'strict' || config.qualityLevel === 'high',
      is_light: config.qualityLevel === 'light',
      is_high_quality: config.qualityLevel === 'high' || config.qualityLevel === 'strict',
    };
  }

  /**
   * Gets AI assistant configuration from the provided list.
   * Creates configuration flags for different AI assistant types.
   * @param aiAssistants - List of AI assistants configured for the project
   * @returns An object containing AI assistant configuration properties and feature flags
   */
  private getAIAssistantConfig(aiAssistants?: Array<import('@nimata/core').ProjectAIAssistant>): {
    ai_assistants: Array<import('@nimata/core').ProjectAIAssistant>;
    has_claude_code: boolean;
    has_copilot: boolean;
    has_ai_context: boolean;
  } {
    return {
      ai_assistants: aiAssistants || [],
      has_claude_code: aiAssistants?.includes('claude-code') || false,
      has_copilot: aiAssistants?.includes('github-copilot') || false,
      has_ai_context: aiAssistants?.includes('ai-context') || false,
    };
  }

  /**
   * Gets filesystem path configuration from the project settings.
   * Creates standardized paths for different project directories.
   * @param config - The project configuration containing target directory settings
   * @returns An object containing filesystem path properties for project structure
   */
  private getFilesystemPaths(config: ProjectConfig): {
    target_directory?: string;
    project_root: string;
    src_directory: string;
    config_directory: string;
    tests_directory: string;
  } {
    return {
      target_directory: config.targetDirectory,
      project_root: '.',
      src_directory: './src',
      config_directory: './config',
      tests_directory: './tests',
    };
  }

  /**
   * Gets date and timestamp information from the provided date.
   * Extracts current date, time, and formatted timestamp components.
   * @param now - The current date object to extract time information from
   * @returns An object containing date and timestamp properties for template generation
   */
  private getDateInfo(now: Date): {
    now: string;
    year: string;
    month: string;
    day: string;
    timestamp: number;
  } {
    return {
      now: now.toISOString(),
      year: now.getFullYear().toString(),
      month: (now.getMonth() + _TEMPLATE_CONTEXT_CONSTANTS.GET_NEXT_MONTH_OFFSET)
        .toString()
        .padStart(_TEMPLATE_CONTEXT_CONSTANTS.MONTH_DAY_PAD_LENGTH, '0'),
      day: now.getDate().toString().padStart(_TEMPLATE_CONTEXT_CONSTANTS.MONTH_DAY_PAD_LENGTH, '0'),
      timestamp: now.getTime(),
    };
  }

  /**
   * Gets default feature flags for template generation.
   * Returns standard feature enablement flags for project tools and capabilities.
   * @returns An object containing feature flag properties for project configuration
   */
  private getFeatureFlags(): {
    enable_eslint: boolean;
    enable_prettier: boolean;
    enable_typescript: boolean;
    enable_tests: boolean;
    enable_git: boolean;
  } {
    return {
      enable_eslint: true,
      enable_prettier: true,
      enable_typescript: true,
      enable_tests: true,
      enable_git: true,
    };
  }

  /**
   * Gets package configuration settings for the project.
   * Returns package manager and runtime version information.
   * @returns An object containing package configuration properties
   */
  private getPackageConfig(): {
    package_manager: 'bun';
    node_version: string;
    bun_version: string;
  } {
    return {
      package_manager: 'bun' as const,
      node_version: _TEMPLATE_CONTEXT_CONSTANTS.NODE_VERSION,
      bun_version: _TEMPLATE_CONTEXT_CONSTANTS.BUN_VERSION,
    };
  }

  /**
   * Gets repository information settings for the project.
   * Returns CI/CD and repository integration flags.
   * @returns An object containing repository information properties
   */
  private getRepositoryInfo(): {
    has_ci: boolean;
    has_github_actions: boolean;
  } {
    return {
      has_ci: false,
      has_github_actions: false,
    };
  }

  /**
   * Extends BaseTemplateContext with computed properties
   * @param base - The base template context to extend
   * @returns The extended template context with computed properties
   */
  extend(base: BaseTemplateContext): ExtendedTemplateContext {
    const projectNameVariants = this.getProjectNameVariants(base);
    const licenseInfo = this.getLicenseInfo(base);
    const qualityConfigs = this.getQualityConfigs(base);
    const templateContext = this.getTemplateContext();
    const advancedFeatures = this.getAdvancedFeatures(base);
    const developmentSettings = this.getDevelopmentSettings();

    return {
      ...base,
      ...projectNameVariants,
      ...licenseInfo,
      ...qualityConfigs,
      ...templateContext,
      ...advancedFeatures,
      ...developmentSettings,
    } as ExtendedTemplateContext;
  }

  /**
   * Gets project name variations in different formats
   * @param base - The base template context
   * @returns Object containing project name variants
   */
  private getProjectNameVariants(base: BaseTemplateContext): Record<string, string> {
    return {
      project_name_camel: StringTransformersImpl.toCamelCase(base.project_name),
      project_name_pascal: StringTransformersImpl.toPascalCase(base.project_name),
      project_name_kebab: StringTransformersImpl.toKebabCase(base.project_name),
      project_name_snake: StringTransformersImpl.toSnakeCase(base.project_name),
      project_name_upper: StringTransformersImpl.toUpperCase(base.project_name),
      project_name_lower: StringTransformersImpl.toLowerCase(base.project_name),
    };
  }

  /**
   * Gets license information
   * @param base - The base template context
   * @returns Object containing license information
   */
  private getLicenseInfo(base: BaseTemplateContext): { license_short: string } {
    return {
      license_short: base.license.split(' ')[0],
    };
  }

  /**
   * Gets quality-based configuration presets
   * @param base - The base template context
   * @returns Object containing quality configuration strings
   */
  private getQualityConfigs(base: BaseTemplateContext): Record<string, string> {
    return {
      eslint_config: JSON.stringify(ContextConfigProviders.getESLintConfig(base.quality_level)),
      prettier_config: JSON.stringify(ContextConfigProviders.getPrettierConfig(base.quality_level)),
      typescript_config: JSON.stringify(
        ContextConfigProviders.getTypeScriptConfig(base.quality_level)
      ),
    };
  }

  /**
   * Gets basic template context
   * @returns Object containing template context properties
   */
  private getTemplateContext(): {
    template_data: Record<string, unknown>;
    custom_variables: Record<string, unknown>;
  } {
    return {
      template_data: {},
      custom_variables: {},
    };
  }

  /**
   * Gets advanced feature flags based on quality level
   * @param base - The base template context
   * @returns Object containing advanced feature flags
   */
  private getAdvancedFeatures(base: BaseTemplateContext): {
    enable_documentation: boolean;
    enable_examples: boolean;
    enable_changelog: boolean;
    enable_contributing: boolean;
  } {
    const isHighQuality = base.is_high_quality;
    return {
      enable_documentation: isHighQuality,
      enable_examples: isHighQuality,
      enable_changelog: isHighQuality,
      enable_contributing: isHighQuality,
    };
  }

  /**
   * Gets development-related settings
   * @returns Object containing development configuration
   */
  private getDevelopmentSettings(): {
    build_output: string;
    source_maps: boolean;
    minification: boolean;
    dev_server_port: number;
    hot_reload: boolean;
    auto_restart: boolean;
  } {
    return {
      build_output: 'dist',
      source_maps: true,
      minification: false,
      dev_server_port: 3000,
      hot_reload: true,
      auto_restart: true,
    };
  }

  /**
   * Applies custom variables to extended template context
   * @param context - The extended template context
   * @param variables - Custom variables to apply
   * @returns Extended template context with custom variables applied
   */
  applyCustomVariables(
    context: ExtendedTemplateContext,
    variables: Record<string, unknown>
  ): ExtendedTemplateContext {
    return {
      ...context,
      custom_variables: {
        ...context.custom_variables,
        ...variables,
      },
    };
  }

  /**
   * Validates template context
   * @param context - The context to validate
   * @param schema - Validation schema
   * @returns Validation result
   */
  validateContext(
    context: BaseTemplateContext,
    schema: Record<string, Array<import('@nimata/core').ValidationRule>>
  ): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    for (const [key, rules] of Object.entries(schema)) {
      const value = context[key as keyof BaseTemplateContext];

      for (const rule of rules) {
        const result = ValidationUtils.applyValidationRule(value, rule);
        if (result !== true) {
          errors.push(`${key}: ${result}`);
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
