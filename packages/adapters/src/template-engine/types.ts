/**
 * Template Engine Types
 *
 * Type definitions for template processing system
 */

export interface TemplateVariable {
  name: string;
  type: 'string' | 'boolean' | 'select' | 'multiselect';
  description: string;
  required: boolean;
  default?: unknown;
  validation?: Array<{
    type: 'required' | 'pattern' | 'length' | 'custom';
    message: string;
    pattern?: RegExp;
    min?: number;
    max?: number;
    validator?: (value: unknown) => boolean | string;
  }>;
}

export interface TemplateFile {
  path: string;
  template: string;
  permissions?: string;
  condition?: string;
}

export interface ProjectTemplate {
  name: string;
  description: string;
  version: string;
  supportedProjectTypes: string[];
  variables: TemplateVariable[];
  files: TemplateFile[];
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export interface GeneratedFile {
  path: string;
  content: string;
  permissions?: string;
}

export interface TemplateContext {
  [key: string]: unknown;
}

export interface Template {
  name: string;
  content: string;
  variables: string[];
}

export interface TemplateEngineImpl {
  loadTemplate: (templateName: string) => Promise<ProjectTemplate>;
  renderTemplate: (template: string, context: TemplateContext) => Promise<string>;
  validateTemplate: (template: string) => ValidationResult;
  processProjectTemplate: (
    projectTemplate: ProjectTemplate,
    context: TemplateContext
  ) => Promise<GeneratedFile[]>;
  registerHelper: (name: string, helper: (...args: unknown[]) => unknown) => void;
  getAvailableTemplates: () => Promise<string[]>;
}
