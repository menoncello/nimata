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
   * @param {string} config - Project configuration
   * @returns {string} Generation result
   */
  generateProject: (config: ProjectConfig) => Promise<GenerationResult>;

  /**
   * Validate project configuration
   * @param {string} config - Project configuration to validate
   * @returns {string} Validation result
   */
  validateProjectConfig: (config: ProjectConfig) => ValidationResult;

  /**
   * Validate generated project
   * @param {string} projectPath - Path to generated project
   * @returns {string} Validation result
   */
  validateProject: (projectPath: string) => Promise<ValidationResult>;

  /**
   * Add a new project template
   * @param {string} template - Template to add
   */
  addTemplate: (template: ProjectTemplate) => void;

  /**
   * Get available templates
   * @returns {string} List of available templates
   */
  getAvailableTemplates: () => string[];

  /**
   * Check if project name is valid
   * @param {string} name - Project name to validate
   * @returns {string} Validation result
   */
  validateProjectName: (name: string) => ValidationResult;

  /**
   * Get default project directory
   * @param {string} config - Project configuration
   * @returns {string} Project directory path
   */
  getProjectDirectory: (config: ProjectConfig) => string;
}
