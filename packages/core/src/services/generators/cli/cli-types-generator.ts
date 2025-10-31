/**
 * CLI Types Generator
 *
 * Generates TypeScript types for CLI projects
 */
import type { ProjectConfig } from '../../../types/project-config.js';
import { toPascalCase } from '../../../utils/string-utils.js';
import {
  generateCommandTypes,
  generateApplicationTypes,
  generateCommandOptionTypes,
} from './modules/basic-cli-types.js';
import { generateConfigurationTypes } from './modules/cli-config-types.js';
import { generateErrorTypes } from './modules/cli-error-types.js';
import { generateProjectSpecificTypes } from './modules/cli-project-types.js';
import { generateRuntimeTypes } from './modules/cli-runtime-types.js';
import { generateUtilityTypes } from './modules/cli-utility-types.js';

/**
 * CLI Types Generator
 *
 * Generates TypeScript types for CLI applications
 */
export class CLITypesGenerator {
  /**
   * Generate CLI types
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} CLI types content
   */
  generateCLITypes(config: ProjectConfig): string {
    const { name } = config;
    const className = toPascalCase(name);

    return [
      this.generateCLITypesHeader(),
      this.generateCLITypesImports(),
      generateCommandTypes(),
      generateApplicationTypes(),
      generateCommandOptionTypes(),
      generateErrorTypes(),
      generateConfigurationTypes(),
      generateRuntimeTypes(),
      generateUtilityTypes(),
      generateProjectSpecificTypes(className),
    ].join('\n');
  }

  /**
   * Generate CLI types header
   * @returns {string} Header comment
   */
  private generateCLITypesHeader(): string {
    return `/**
 * CLI Types
 *
 * Type definitions for CLI application
 */`;
  }

  /**
   * Generate CLI types imports
   * @returns {string} Import statements
   */
  private generateCLITypesImports(): string {
    return `import type { Command, Argument, Option } from 'commander';
import type { Logger } from 'winston';`;
  }
}
