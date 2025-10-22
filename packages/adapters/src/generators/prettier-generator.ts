/**
 * Prettier Configuration Generator
 *
 * Generates Prettier configuration files based on project requirements and quality levels
 */

import { FORMATTING } from '../utils/constants.js';
import {
  buildMainConfigContent,
  getTrailingCommaStyle,
  getPrintWidth,
  getTargetEnvironment,
} from './prettier-config-builders.js';
import { generateIgnoreFile, generateEditorConfig } from './prettier-file-generators.js';
import type { PrettierConfigOptions, GeneratedPrettierConfig } from './prettier-types.js';

// Inline type to avoid import issues
interface ProjectConfig {
  name: string;
  description?: string;
  qualityLevel: 'light' | 'medium' | 'strict';
  projectType: 'basic' | 'web' | 'cli' | 'library';
  aiAssistants: Array<'claude-code' | 'copilot'>;
}

/**
 * Prettier Configuration Generator
 */
export class PrettierGenerator {
  /**
   * Generate Prettier configuration for a project
   *
   * @param config - Project configuration
   * @returns Generated Prettier configuration files
   */
  generate(config: ProjectConfig): GeneratedPrettierConfig[] {
    const options: PrettierConfigOptions = {
      qualityLevel: config.qualityLevel,
      projectType: config.projectType,
      targetEnvironment: getTargetEnvironment(config.projectType),
      enableTypeScript: true,
      tabWidth: FORMATTING.TAB_WIDTH,
      semi: true,
      singleQuote: true,
      trailingComma: getTrailingCommaStyle(config.qualityLevel),
      printWidth: getPrintWidth(config.qualityLevel),
    };

    const configs: GeneratedPrettierConfig[] = [];

    // Generate main Prettier configuration
    configs.push(this.generateMainConfig(options));

    // Generate ignore file
    configs.push(generateIgnoreFile());

    // Generate editor configuration
    configs.push(generateEditorConfig(options));

    return configs;
  }

  /**
   * Generate main Prettier configuration
   * @param options - Configuration options
   * @returns Generated configuration file
   */
  private generateMainConfig(options: PrettierConfigOptions): GeneratedPrettierConfig {
    const filename = '.prettierrc.json';
    const content = buildMainConfigContent(options);

    return {
      filename,
      content,
      description: 'Main Prettier configuration with formatting rules',
    };
  }
}

/**
 * Create a Prettier generator instance
 * @returns New PrettierGenerator instance
 */
export function createPrettierGenerator(): PrettierGenerator {
  return new PrettierGenerator();
}
