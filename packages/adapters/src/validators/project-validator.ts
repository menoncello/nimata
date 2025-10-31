/**
 * Project Validator
 *
 * Validates generated projects and verifies setup correctness
 */

import { CONFIG_FILES } from './project-structures.js';
import type { ProjectValidationResult, ProjectValidatorOptions } from './types.js';
import { validateAIConfigurations } from './validations/ai-config-validation.js';
import { validateDependencies } from './validations/dependency-validation.js';
import { fileExists, readFile } from './validations/file-utils.js';
import { validatePackageJson } from './validations/package-json-validation.js';
import { validateProjectStructure } from './validations/project-structure-validation.js';
import { validateProjectSpecificRequirements } from './validations/project-type-validation.js';
import { validateTypeScriptConfig } from './validations/typescript-validation.js';

/**
 * Project Validator Class
 */
export class ProjectValidator {
  /**
   * Validate a generated project
   * @param {ProjectValidatorOptions} options - Validator options
   * @returns {void} Validation result with detailed information
   */
  async validateProject(options: ProjectValidatorOptions): Promise<ProjectValidationResult> {
    const result: ProjectValidationResult = {
      success: true,
      errors: [],
      warnings: [],
      info: [],
    };

    try {
      await this.validateProjectStructure(options, result);
      await this.validateConfigurations(options, result);
      await this.validatePackageJson(options, result);
      await this.validateTypeScriptConfig(options, result);
      await this.validateESLintConfig(options, result);
      await this.validateTestConfig(options, result);
      await this.validateAIConfigurations(options, result);
      await this.validateDependencies(options, result);
      await this.validateProjectSpecificRequirements(options, result);

      result.success = result.errors.length === 0;
    } catch (error) {
      result.success = false;
      result.errors.push(
        `Validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }

    return result;
  }

  /**
   * Validate basic project structure
   * @param {unknown} options - Validator options
   * @param {unknown} result - Validation result
   */
  private async validateProjectStructure(
    options: ProjectValidatorOptions,
    result: ProjectValidationResult
  ): Promise<void> {
    await validateProjectStructure(options, result);
  }

  /**
   * Validate configuration files
   * @param {unknown} options - Validator options
   * @param {unknown} result - Validation result
   */
  private async validateConfigurations(
    options: ProjectValidatorOptions,
    result: ProjectValidationResult
  ): Promise<void> {
    for (const file of CONFIG_FILES) {
      const filePath = `${options.projectPath}/${file}`;
      if (await fileExists(filePath)) {
        try {
          const content = await readFile(filePath);
          JSON.parse(content);
          result.info.push(`✓ ${file} is valid JSON`);
        } catch (error) {
          result.errors.push(
            `${file} contains invalid JSON: ${error instanceof Error ? error.message : 'Unknown error'}`
          );
        }
      } else {
        result.warnings.push(`Optional configuration file missing: ${file}`);
      }
    }
  }

  /**
   * Validate package.json content and structure
   * @param {unknown} options - Validator options containing project path and config
   * @param {unknown} result - Validation result to populate with findings
   */
  private async validatePackageJson(
    options: ProjectValidatorOptions,
    result: ProjectValidationResult
  ): Promise<void> {
    await validatePackageJson(options, result);
  }

  /**
   * Validate TypeScript configuration and compiler options
   * @param {unknown} options - Validator options containing project path and config
   * @param {unknown} result - Validation result to populate with findings
   */
  private async validateTypeScriptConfig(
    options: ProjectValidatorOptions,
    result: ProjectValidationResult
  ): Promise<void> {
    await validateTypeScriptConfig(options, result);
  }

  /**
   * Validate ESLint configuration and rules
   * @param {unknown} options - Validator options containing project path and config
   * @param {unknown} result - Validation result to populate with findings
   */
  private async validateESLintConfig(
    options: ProjectValidatorOptions,
    result: ProjectValidationResult
  ): Promise<void> {
    const eslintConfigs = ['.eslintrc.json', 'eslint.config.mjs', '.eslintrc.js'];

    let eslintFound = false;
    for (const config of eslintConfigs) {
      const configPath = `${options.projectPath}/${config}`;
      if (await fileExists(configPath)) {
        eslintFound = true;
        result.info.push(`✓ ESLint configuration found: ${config}`);
        break;
      }
    }

    if (!eslintFound) {
      result.warnings.push('No ESLint configuration file found');
    }
  }

  /**
   * Validate test configuration and setup
   * @param {unknown} options - Validator options containing project path and config
   * @param {unknown} result - Validation result to populate with findings
   */
  private async validateTestConfig(
    options: ProjectValidatorOptions,
    result: ProjectValidationResult
  ): Promise<void> {
    await this.validateTestConfigurationFiles(options, result);
    await this.validateTestDirectories(options, result);
  }

  /**
   * Validate test configuration files
   * @param {unknown} options - Validator options
   * @param {unknown} result - Validation result
   */
  private async validateTestConfigurationFiles(
    options: ProjectValidatorOptions,
    result: ProjectValidationResult
  ): Promise<void> {
    const testConfigs = [
      'vitest.config.ts',
      'vitest.config.js',
      'jest.config.js',
      'jest.config.json',
    ];

    let testConfigFound = false;
    for (const config of testConfigs) {
      const configPath = `${options.projectPath}/${config}`;
      if (await fileExists(configPath)) {
        testConfigFound = true;
        result.info.push(`✓ Test configuration found: ${config}`);
        break;
      }
    }

    if (!testConfigFound) {
      result.warnings.push('No test configuration file found');
    }
  }

  /**
   * Validate test directories
   * @param {unknown} options - Validator options
   * @param {unknown} result - Validation result
   */
  private async validateTestDirectories(
    options: ProjectValidatorOptions,
    result: ProjectValidationResult
  ): Promise<void> {
    const testDirs = ['tests', 'test', '__tests__'];
    let testDirFound = false;
    for (const dir of testDirs) {
      const dirPath = `${options.projectPath}/${dir}`;
      if (await fileExists(dirPath)) {
        testDirFound = true;
        result.info.push(`✓ Test directory found: ${dir}`);
        break;
      }
    }

    if (!testDirFound) {
      result.warnings.push('No test directory found');
    }
  }

  /**
   * Validate AI assistant configurations and files
   * @param {unknown} options - Validator options containing project path and config
   * @param {unknown} result - Validation result to populate with findings
   */
  private async validateAIConfigurations(
    options: ProjectValidatorOptions,
    result: ProjectValidationResult
  ): Promise<void> {
    await validateAIConfigurations(options, result);
  }

  /**
   * Validate dependencies and installations
   * @param {unknown} options - Validator options containing project path and config
   * @param {unknown} result - Validation result to populate with findings
   */
  private async validateDependencies(
    options: ProjectValidatorOptions,
    result: ProjectValidationResult
  ): Promise<void> {
    await validateDependencies(options, result);
  }

  /**
   * Validate project-specific requirements
   * @param {unknown} options - Validator options
   * @param {unknown} result - Validation result
   */
  private async validateProjectSpecificRequirements(
    options: ProjectValidatorOptions,
    result: ProjectValidationResult
  ): Promise<void> {
    await validateProjectSpecificRequirements(options, result);
  }
}

/**
 * Create a project validator instance
 * @returns {ProjectValidator} New ProjectValidator instance
 */
export function createProjectValidator(): ProjectValidator {
  return new ProjectValidator();
}
