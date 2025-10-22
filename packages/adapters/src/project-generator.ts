/**
 * Project Generator Implementation
 *
 * Main project generator that orchestrates the entire project generation process
 * using the template engine and configuration processor
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import {
  createBaseResult,
  handleUnexpectedError,
  createErrorResult,
} from './generators/project-generator-helpers.js';
import {
  prepareProjectSetup,
  generateFilesFromTemplate,
  finalizeProject,
} from './generators/project-generator-workflow.js';
import { TemplateEngine } from './template-engine.js';
import {
  validateRequiredConfigFields,
  validateOptionalConfigFields,
  validateRequiredFiles,
  validateSrcDirectory,
  validatePackageJson,
  type ProjectConfig,
  type ValidationResult,
  type GenerationResult,
  type ProjectTemplate,
} from './utils/project-generation-helpers.js';

// Re-export ProjectTemplate from helpers
export type { ProjectTemplate } from './utils/project-generation-helpers.js';

/**
 * Project Generator Implementation
 */
export class ProjectGenerator {
  private templateEngine: TemplateEngine;
  private templatesDir: string;

  /**
   * Constructor
   * @param templatesDir - Templates directory
   */
  constructor(templatesDir?: string) {
    if (templatesDir) {
      this.templatesDir = templatesDir;
    } else {
      // Get the file URL path properly
      const currentFilePath = new URL(import.meta.url).pathname;
      const currentDir = path.dirname(currentFilePath);
      this.templatesDir = path.resolve(currentDir, '../templates');
    }
    this.templateEngine = new TemplateEngine(this.templatesDir);
  }

  /**
   * Generate a new project
   * @param config - Project configuration
   * @returns Generation result
   */
  async generateProject(config: ProjectConfig): Promise<GenerationResult> {
    const startTime = Date.now();

    try {
      const configValidation = this.validateProjectConfig(config);
      if (!configValidation.valid) {
        return createErrorResult(
          createBaseResult(),
          'Invalid project configuration:',
          configValidation.errors,
          startTime
        );
      }

      return this.executeProjectGeneration(config, startTime);
    } catch (error) {
      return handleUnexpectedError(error, startTime);
    }
  }

  /**
   * Execute the project generation workflow
   * @param config - Project configuration
   * @param startTime - Start time for duration calculation
   * @returns Generation result
   */
  private async executeProjectGeneration(
    config: ProjectConfig,
    startTime: number
  ): Promise<GenerationResult> {
    const setupResult = await prepareProjectSetup(config, this.templateEngine, startTime);
    if (!setupResult.success) {
      return setupResult;
    }

    const generationResult = await generateFilesFromTemplate(
      config,
      this.templateEngine,
      setupResult.files || [],
      startTime
    );
    if (!generationResult.success) {
      return generationResult;
    }

    return finalizeProject(
      config,
      generationResult.files || [],
      startTime,
      this.addValidationWarnings.bind(this)
    );
  }

  /**
   * Add validation warnings to result
   * @param result - Result object to add warnings to
   * @param projectDir - Project directory to validate
   */
  private async addValidationWarnings(result: GenerationResult, projectDir: string): Promise<void> {
    const projectValidation = await this.validateProject(projectDir);
    if (!projectValidation.valid) {
      result.warnings.push('Project validation warnings:');
      result.warnings.push(...projectValidation.errors);
    }
  }

  /**
   * Validate project configuration
   * @param config - Project configuration
   * @returns Validation result
   */
  validateProjectConfig(config: ProjectConfig): ValidationResult {
    const requiredValidation = validateRequiredConfigFields(config);
    const optionalValidation = validateOptionalConfigFields(config);

    const allErrors = [...requiredValidation.errors, ...optionalValidation.errors];

    return {
      valid: allErrors.length === 0,
      errors: allErrors,
    };
  }

  /**
   * Validate generated project structure and files
   * @param projectPath - Path to the generated project
   * @returns Validation result
   */
  async validateProject(projectPath: string): Promise<ValidationResult> {
    const errors: string[] = [];

    try {
      // Check if project directory exists
      await fs.access(projectPath);

      // Validate required files
      const requiredFileErrors = await validateRequiredFiles(projectPath);
      errors.push(...requiredFileErrors);

      // Validate src directory
      const srcDirectoryErrors = await validateSrcDirectory(projectPath);
      errors.push(...srcDirectoryErrors);

      // Validate package.json structure
      const packageJsonErrors = await validatePackageJson(projectPath);
      errors.push(...packageJsonErrors);
    } catch (error) {
      errors.push(
        `Project directory not accessible: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Add a new template to the system
   * @param template - Template configuration to add
   * @throws Error if template is invalid
   */
  addTemplate(template: ProjectTemplate): void {
    // This would save the template to the templates directory
    // For now, we'll just validate it
    const errors: string[] = [];

    if (!template.name) {
      errors.push('Template name is required');
    }

    if (!template.version) {
      errors.push('Template version is required');
    }

    if (
      !Array.isArray(template.supportedProjectTypes) ||
      template.supportedProjectTypes.length === 0
    ) {
      errors.push('Template supportedProjectTypes must be a non-empty array');
    }

    if (!Array.isArray(template.files) || template.files.length === 0) {
      errors.push('Template files must be a non-empty array');
    }

    if (errors.length > 0) {
      throw new Error(`Invalid template: ${errors.join(', ')}`);
    }

    // In a real implementation, this would save to the templates directory
    // For now, we just validate the template structure
  }

  /**
   * Get list of available templates
   * @returns Array of available template names
   */
  getAvailableTemplates(): string[] {
    // Return available templates synchronously for the interface
    // In a real implementation, this might cache the result or use async differently
    return ['basic', 'web', 'cli', 'library'];
  }

  /**
   * Validate project name format and constraints
   * @param name - Project name to validate
   * @returns Validation result
   */
  validateProjectName(name: string): ValidationResult {
    if (!name || name.trim().length === 0) {
      return {
        valid: false,
        errors: ['Project name is required'],
      };
    }

    if (!/^[\w-]+$/.test(name)) {
      return {
        valid: false,
        errors: ['Project name can only contain letters, numbers, hyphens, and underscores'],
      };
    }

    return {
      valid: true,
      errors: [],
    };
  }
}
