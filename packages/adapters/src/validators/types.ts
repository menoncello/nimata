/**
 * Type definitions for project validation
 */

export interface ProjectConfig {
  name: string;
  description?: string;
  qualityLevel: 'light' | 'medium' | 'strict';
  projectType: 'basic' | 'web' | 'cli' | 'library';
  aiAssistants: Array<'claude-code' | 'copilot'>;
}

export interface ProjectValidationResult {
  success: boolean;
  errors: string[];
  warnings: string[];
  info: string[];
}

export interface ProjectStructure {
  files: string[];
  directories: string[];
  configurations: string[];
  scripts: string[];
}

export interface ProjectValidatorOptions {
  projectPath: string;
  config: ProjectConfig;
  verbose?: boolean;
  skipOptional?: boolean;
}
