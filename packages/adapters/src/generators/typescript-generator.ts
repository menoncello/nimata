/**
 * TypeScript Configuration Generator
 *
 * Generates TypeScript configuration files based on project requirements and quality levels
 */

import { getCompilerOptions } from './typescript-compiler-options.js';
import {
  buildMainConfigContent,
  buildTscConfigContent,
  buildTscTypesConfigContent,
  buildEsbuildConfigContent,
  buildTestingConfigContent,
  buildBaseConfigContent,
} from './typescript-config-builders.js';
import {
  getIncludePatterns,
  getExcludePatterns,
  getTargetEnvironment,
  getBuildSystem,
  getProjectTypeName,
  getESBuildBaseConfig,
  getESBuildDefines,
  getESBuildPlugins,
} from './typescript-utilities.js';

// Inline type to avoid import issues
interface ProjectConfig {
  name: string;
  description?: string;
  qualityLevel: 'light' | 'medium' | 'strict';
  projectType: 'basic' | 'web' | 'cli' | 'library';
  aiAssistants: Array<'claude-code' | 'copilot'>;
}

// Type for compiler options
export type CompilerOptions = Record<
  string,
  string | boolean | number | string[] | Record<string, string>
>;

export interface TypeScriptConfigOptions {
  qualityLevel: 'light' | 'medium' | 'strict';
  projectType: 'basic' | 'web' | 'cli' | 'library';
  targetEnvironment: 'node' | 'browser' | 'both';
  buildSystem: 'esbuild' | 'tsc' | 'both';
  testing: boolean;
  jsx: boolean;
  decorators: boolean;
  paths?: Record<string, string>;
  baseUrl?: string;
}

export interface GeneratedTypeScriptConfig {
  filename: string;
  content: string;
  description: string;
}

/**
 * TypeScript Configuration Generator
 */
export class TypeScriptGenerator {
  /**
   * Generate TypeScript configuration for a project
   *
   * @param {ProjectConfig} config - Project configuration
   * @returns {ProjectConfig): GeneratedTypeScriptConfig[]} Generated TypeScript configuration files
   */
  generate(config: ProjectConfig): GeneratedTypeScriptConfig[] {
    const options: TypeScriptConfigOptions = {
      qualityLevel: config.qualityLevel,
      projectType: config.projectType,
      targetEnvironment: getTargetEnvironment(config.projectType),
      buildSystem: getBuildSystem(config.projectType),
      testing: true,
      jsx: config.projectType === 'web',
      decorators: true,
      baseUrl: './src',
      paths: this.getDefaultPaths(config.projectType),
    };

    const configs: GeneratedTypeScriptConfig[] = [];

    // Generate main TypeScript configuration
    configs.push(this.generateMainConfig(options));

    // Generate build configurations
    if (options.buildSystem === 'tsc' || options.buildSystem === 'both') {
      configs.push(this.generateTscConfig(options));
      configs.push(this.generateTscTypesConfig(options));
    }

    if (options.buildSystem === 'esbuild' || options.buildSystem === 'both') {
      configs.push(this.generateEsbuildConfig(options));
    }

    // Generate testing configuration
    if (options.testing) {
      configs.push(this.generateTestingConfig(options));
    }

    // Generate base configuration
    configs.push(this.generateBaseConfig(options));

    return configs;
  }

  /**
   * Generate main TypeScript configuration
   * @param {TypeScriptConfigOptions} options - TypeScript configuration options
   * @returns {TypeScriptConfigOptions): GeneratedTypeScriptConfig} Generated TypeScript configuration
   */
  private generateMainConfig(options: TypeScriptConfigOptions): GeneratedTypeScriptConfig {
    const filename = 'tsconfig.json';
    const content = buildMainConfigContent(
      options,
      getCompilerOptions,
      getIncludePatterns,
      getExcludePatterns
    );

    return {
      filename,
      content,
      description: 'Main TypeScript configuration',
    };
  }

  /**
   * Generate TypeScript compiler configuration
   * @param {TypeScriptConfigOptions} options - TypeScript configuration options
   * @returns {TypeScriptConfigOptions): GeneratedTypeScriptConfig} Generated TypeScript compiler configuration
   */
  private generateTscConfig(options: TypeScriptConfigOptions): GeneratedTypeScriptConfig {
    const filename = 'tsconfig.build.json';
    const content = buildTscConfigContent(
      options,
      getCompilerOptions,
      getIncludePatterns,
      getExcludePatterns
    );

    return {
      filename,
      content,
      description: 'TypeScript build configuration',
    };
  }

  /**
   * Generate TypeScript types configuration
   * @param {TypeScriptConfigOptions} options - TypeScript configuration options
   * @returns {TypeScriptConfigOptions): GeneratedTypeScriptConfig} Generated TypeScript types configuration
   */
  private generateTscTypesConfig(options: TypeScriptConfigOptions): GeneratedTypeScriptConfig {
    const filename = 'tsconfig.types.json';
    const content = buildTscTypesConfigContent(options, getCompilerOptions);

    return {
      filename,
      content,
      description: 'TypeScript types-only configuration',
    };
  }

  /**
   * Generate ESBuild configuration
   * @param {TypeScriptConfigOptions} options - TypeScript configuration options
   * @returns {TypeScriptConfigOptions): GeneratedTypeScriptConfig} Generated ESBuild configuration
   */
  private generateEsbuildConfig(options: TypeScriptConfigOptions): GeneratedTypeScriptConfig {
    const filename = 'esbuild.config.mjs';
    const content = buildEsbuildConfigContent(options, {
      getProjectTypeName,
      getESBuildBaseConfig,
      getESBuildDefines,
      getESBuildPlugins,
    });

    return {
      filename,
      content,
      description: 'ESBuild configuration for fast compilation',
    };
  }

  /**
   * Generate testing TypeScript configuration
   * @param {TypeScriptConfigOptions} options - TypeScript configuration options
   * @returns {TypeScriptConfigOptions): GeneratedTypeScriptConfig} Generated testing TypeScript configuration
   */
  private generateTestingConfig(options: TypeScriptConfigOptions): GeneratedTypeScriptConfig {
    const filename = 'tsconfig.test.json';
    const content = buildTestingConfigContent(options, getCompilerOptions);

    return {
      filename,
      content,
      description: 'TypeScript configuration for tests',
    };
  }

  /**
   * Generate base TypeScript configuration
   * @param {TypeScriptConfigOptions} options - TypeScript configuration options
   * @returns {TypeScriptConfigOptions): GeneratedTypeScriptConfig} Generated base TypeScript configuration
   */
  private generateBaseConfig(options: TypeScriptConfigOptions): GeneratedTypeScriptConfig {
    const filename = 'tsconfig.base.json';
    const content = buildBaseConfigContent(options, getCompilerOptions);

    return {
      filename,
      content,
      description: 'Base TypeScript configuration with shared settings',
    };
  }

  /**
   * Get default path mappings for project type
   * @param {string} projectType - Project type
   * @returns {void} Default path mappings
   */
  private getDefaultPaths(projectType: string): Record<string, string> {
    // Common path mappings
    const BASE_PATHS = {
      '@/*': './src/*',
      '@': './src/*',
      '@/utils': './src/utils/*',
      '@/types': './src/types/*',
    } as const;

    const COMPONENT_PATHS = {
      '@/components': './src/components/*',
    } as const;

    const COMMAND_PATHS = {
      '@/commands': './src/commands/*',
    } as const;

    switch (projectType) {
      case 'web':
        return {
          ...BASE_PATHS,
          ...COMPONENT_PATHS,
        };
      case 'cli':
        return {
          ...BASE_PATHS,
          ...COMMAND_PATHS,
        };
      case 'library':
      case 'basic':
      default:
        return BASE_PATHS;
    }
  }
}

/**
 * Factory function to create TypeScript generator instance
 * @param {unknown} _config - Project configuration (parameter not used but kept for interface consistency)
 * @returns {TypeScriptGenerator} TypeScript generator instance
 */
export function createTypeScriptGenerator(_config?: Record<string, unknown>): TypeScriptGenerator {
  return new TypeScriptGenerator();
}
