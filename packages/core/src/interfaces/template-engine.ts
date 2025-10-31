/**
 * Template Engine Interface
 *
 * Interface for processing and rendering project templates
 */
import type { ProjectTemplate, ValidationResult, GeneratedFile } from '../types/project-config.js';

export interface TemplateEngine {
  /**
   * Load template from file system
   * @param {string} templateName - Name of the template to load
   * @returns {string} Loaded template
   */
  loadTemplate: (templateName: string) => Promise<ProjectTemplate>;

  /**
   * Render template with context
   * @param {string} template - Template to render
   * @param {string} context - Variables for template substitution
   * @returns {string} Rendered content
   */
  renderTemplate: (template: string, context: TemplateContext) => Promise<string>;

  /**
   * Validate template syntax
   * @param {string} template - Template to validate
   * @returns {string} Validation result
   */
  validateTemplate: (template: string) => ValidationResult;

  /**
   * Process complete project template
   * @param {string} projectTemplate - Project template definition
   * @param {string} context - Template context
   * @returns {string} Generated files
   */
  processProjectTemplate: (
    projectTemplate: ProjectTemplate,
    context: TemplateContext
  ) => Promise<GeneratedFile[]>;

  /**
   * Register a custom helper function
   * @param {string} name - Helper name
   * @param {string} helper - Helper function
   */
  registerHelper: (name: string, helper: (...args: unknown[]) => unknown) => void;

  /**
   * Get available templates
   * @returns {string} List of available template names
   */
  getAvailableTemplates: () => Promise<string[]>;
}

export interface TemplateContext {
  [key: string]: unknown;
}

export interface Template {
  name: string;
  content: string;
  variables: string[];
}
