/**
 * Project Configuration Interfaces
 *
 * Core interfaces for project generation and configuration collection
 */

export type ProjectQualityLevel = 'light' | 'medium' | 'strict' | 'high';
export type ProjectType =
  | 'basic'
  | 'web'
  | 'cli'
  | 'library'
  | 'bun-react'
  | 'bun-vue'
  | 'bun-express'
  | 'bun-typescript';
export type ProjectAIAssistant =
  | 'claude-code'
  | 'copilot'
  | 'github-copilot'
  | 'ai-context'
  | 'cursor';
export type ProjectLicense = 'MIT' | 'Apache-2.0' | 'GPL-3.0' | 'BSD-3-Clause' | 'ISC' | string;

export interface ProjectConfig {
  name: string;
  description?: string;
  author?: string;
  license?: ProjectLicense;
  qualityLevel: ProjectQualityLevel;
  projectType: ProjectType;
  aiAssistants: ProjectAIAssistant[];
  template?: string;
  targetDirectory?: string;
  nonInteractive?: boolean;
}

export interface WizardStep {
  id: string;
  title: string;
  description: string;
  help?: string;
  type: 'text' | 'list' | 'checkbox' | 'confirm';
  required: boolean;
  defaultValue?: unknown;
  options?: Array<{ label: string; value: unknown; description?: string }>;
  validation?: ValidationRule[];
  condition?: (config: Partial<ProjectConfig>) => boolean;
}

export interface ValidationRule {
  type: 'required' | 'pattern' | 'length' | 'range' | 'custom';
  message: string;
  pattern?: RegExp;
  min?: number;
  max?: number;
  validator?: (value: unknown) => boolean | string;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface TemplateVariable {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'select' | 'multiselect';
  description: string;
  required: boolean;
  default?: unknown;
  validation?: ValidationRule[];
  options?: Array<{ label: string; value: unknown; description?: string }>;
}

export interface TemplateFile {
  path: string;
  template: string;
  permissions?: string;
  condition?: string; // Conditional rendering based on variables
}

export interface ProjectTemplate {
  name: string;
  description: string;
  version: string;
  supportedProjectTypes: ProjectType[];
  variables: TemplateVariable[];
  files: TemplateFile[];
}

export interface GeneratedFile {
  path: string;
  content: string;
  permissions?: string;
}

export interface GenerationResult {
  success: boolean;
  files: GeneratedFile[];
  errors: string[];
  warnings: string[];
  duration: number;
}
