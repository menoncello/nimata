/**
 * Template Engine Interface
 *
 * Interface for processing and rendering project templates
 */
import type { ProjectTemplate, ValidationResult, GeneratedFile } from '../types/project-config.js';

export interface TemplateEngine {
  /**
   * Load template from file system
   * @param templateName - Name of the template to load
   * @returns Loaded template
   */
  loadTemplate: (templateName: string) => Promise<ProjectTemplate>;

  /**
   * Render template with context
   * @param template - Template to render
   * @param context - Variables for template substitution
   * @returns Rendered content
   */
  renderTemplate: (template: string, context: TemplateContext) => Promise<string>;

  /**
   * Validate template syntax
   * @param template - Template to validate
   * @returns Validation result
   */
  validateTemplate: (template: string) => ValidationResult;

  /**
   * Process complete project template
   * @param projectTemplate - Project template definition
   * @param context - Template context
   * @returns Generated files
   */
  processProjectTemplate: (
    projectTemplate: ProjectTemplate,
    context: TemplateContext
  ) => Promise<GeneratedFile[]>;

  /**
   * Register a custom helper function
   * @param name - Helper name
   * @param helper - Helper function
   */
  registerHelper: (name: string, helper: (...args: unknown[]) => unknown) => void;

  /**
   * Get available templates
   * @returns List of available template names
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
