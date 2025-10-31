/**
 * CLI Configuration Generator
 *
 * Generates configuration files for CLI projects
 */
import type { ProjectConfig } from '../../../types/project-config.js';
import {
  generateCLIConfigHeader,
  generateCLIConfigImports,
  generateCLIConfigBody,
} from './modules/basic-cli-config-generators.js';
import { generateCommandConfigs } from './modules/command-config-generators.js';
import {
  generateConfigHelpers,
  generateConfigDefaultExport,
} from './modules/config-helper-generators.js';
import { generateEnvironmentConfigs } from './modules/environment-config-generators.js';
import { generatePluginConfigs } from './modules/plugin-hook-generators.js';

/**
 * CLI Configuration Generator
 *
 * Generates configuration files for CLI applications
 */
export class CLIConfigGenerator {
  /**
   * Generate CLI configuration
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} CLI configuration content
   */
  generateCLIConfig(config: ProjectConfig): string {
    return [
      generateCLIConfigHeader(),
      generateCLIConfigImports(),
      generateCLIConfigBody(config),
      generateCommandConfigs(config),
      generatePluginConfigs(),
      generateEnvironmentConfigs(config),
      generateConfigHelpers(),
      generateConfigDefaultExport(),
    ].join('\n');
  }
}
