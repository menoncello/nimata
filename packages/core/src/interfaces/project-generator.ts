/**
 * Project Generator Interface
 *
 * Interface for generating complete projects from templates
 */
import type {
  ProjectConfig,
  ProjectTemplate,
  GenerationResult,
  ValidationResult,
} from '../types/project-config.js';

export interface ProjectGenerator {
  /**
   * Generate a complete project
   * @param config - Project configuration
   * @returns Generation result
   */
  generateProject: (config: ProjectConfig) => Promise<GenerationResult>;

  /**
   * Validate project configuration
   * @param config - Project configuration to validate
   * @returns Validation result
   */
  validateProjectConfig: (config: ProjectConfig) => ValidationResult;

  /**
   * Validate generated project
   * @param projectPath - Path to generated project
   * @returns Validation result
   */
  validateProject: (projectPath: string) => Promise<ValidationResult>;

  /**
   * Add a new project template
   * @param template - Template to add
   */
  addTemplate: (template: ProjectTemplate) => void;

  /**
   * Get available templates
   * @returns List of available templates
   */
  getAvailableTemplates: () => string[];

  /**
   * Check if project name is valid
   * @param name - Project name to validate
   * @returns Validation result
   */
  validateProjectName: (name: string) => ValidationResult;

  /**
   * Get default project directory
   * @param config - Project configuration
   * @returns Project directory path
   */
  getProjectDirectory: (config: ProjectConfig) => string;
}
