/**
 * Project Generation Helpers
 *
 * Helper functions and utilities for project generation
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import type { TemplateEngineImpl } from '../template-engine/types.js';
import {
  validateProjectNameConfig,
  validateQualityLevelConfig,
  validateProjectTypeConfig,
  validateAIAssistantsConfig,
  validateOptionalConfig,
} from './project-validation-helpers.js';

// Import the proper interface from template-engine

// Use TemplateEngineImpl as our TemplateEngine interface
export type TemplateEngine = TemplateEngineImpl;

export interface ProjectConfig {
  name: string;
  description?: string;
  author?: string;
  license?: string;
  qualityLevel: 'light' | 'medium' | 'strict' | 'high';
  projectType:
    | 'basic'
    | 'web'
    | 'cli'
    | 'library'
    | 'bun-react'
    | 'bun-vue'
    | 'bun-express'
    | 'bun-typescript';
  aiAssistants: Array<'claude-code' | 'copilot' | 'github-copilot' | 'ai-context' | 'cursor'>;
  template?: string;
  targetDirectory?: string;
  nonInteractive?: boolean;
}

export interface ProjectTemplate {
  name: string;
  description: string;
  version: string;
  supportedProjectTypes: string[];
  variables: Array<{
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
  }>;
  files: Array<{
    path: string;
    template: string;
    permissions?: string;
    condition?: string;
  }>;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export interface GenerationResult {
  success: boolean;
  files: Array<{
    path: string;
    content: string;
    permissions?: string;
  }>;
  errors: string[];
  warnings: string[];
  duration: number;
}

/**
 * Validate required project configuration fields
 * @param config - Project configuration
 * @returns Validation result for required fields
 */
export function validateRequiredConfigFields(config: ProjectConfig): ValidationResult {
  const errors: string[] = [];

  // Validate each required field using helper functions
  validateProjectNameConfig(config, errors);
  validateQualityLevelConfig(config, errors);
  validateProjectTypeConfig(config, errors);
  validateAIAssistantsConfig(config, errors);

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate optional project configuration fields
 * @param config - Project configuration
 * @returns Validation result for optional fields
 */
export function validateOptionalConfigFields(config: ProjectConfig): ValidationResult {
  const errors: string[] = [];

  validateOptionalConfig(config, errors);

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Check if project directory already exists
 * @param projectDir - Project directory path
 * @param allowExisting - If true, don't throw error if directory exists (default: true)
 * @returns Promise that resolves if directory doesn't exist (or allowExisting is true), rejects otherwise
 */
export async function checkDirectoryExists(
  projectDir: string,
  allowExisting = true
): Promise<void> {
  try {
    await fs.access(projectDir);
    // Directory exists
    if (!allowExisting) {
      throw new Error(`Directory already exists: ${projectDir}`);
    }
    // Directory exists but we're allowing it
  } catch (error) {
    if (error instanceof Error && error.message.includes('already exists')) {
      throw error;
    }
    // Directory doesn't exist, which is fine
  }
}

/**
 * Load and validate template
 * @param templateEngine - Template engine instance
 * @param templateName - Template name
 * @param projectType - Project type
 * @returns Loaded template
 */
export async function loadAndValidateTemplate(
  templateEngine: TemplateEngine,
  templateName: string,
  projectType: string
): Promise<ProjectTemplate> {
  // Load template
  let template: ProjectTemplate;
  try {
    template = await templateEngine.loadTemplate(templateName);
  } catch (error) {
    throw new Error(
      `Failed to load template '${templateName}': ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }

  // Validate template supports project type
  if (!template.supportedProjectTypes.includes(projectType)) {
    throw new Error(`Template '${templateName}' does not support project type '${projectType}'`);
  }

  return template;
}

/**
 * Write generated files to disk
 * @param files - Generated files
 * @param projectDir - Project directory
 * @returns Array of write errors
 */
export async function writeFilesToDisk(
  files: Array<{ path: string; content: string; permissions?: string }>,
  projectDir: string
): Promise<string[]> {
  const writeErrors: string[] = [];

  for (const file of files) {
    try {
      const filePath = path.join(projectDir, file.path);
      const fileDir = path.dirname(filePath);

      // Create directory if it doesn't exist
      await fs.mkdir(fileDir, { recursive: true });

      // Write file
      await fs.writeFile(filePath, file.content, { encoding: 'utf-8' });

      // Set permissions if specified
      if (file.permissions) {
        const mode = Number.parseInt(file.permissions, 8);
        await fs.chmod(filePath, mode);
      }
    } catch (error) {
      writeErrors.push(
        `Failed to write file '${file.path}': ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  return writeErrors;
}

/**
 * Validate required files exist in project
 * @param projectPath - Project path
 * @returns Array of missing files errors
 */
export async function validateRequiredFiles(projectPath: string): Promise<string[]> {
  const errors: string[] = [];
  const requiredFiles = ['package.json', 'tsconfig.json'];

  for (const file of requiredFiles) {
    const filePath = path.join(projectPath, file);
    try {
      await fs.access(filePath);
    } catch {
      errors.push(`Missing required file: ${file}`);
    }
  }

  return errors;
}

/**
 * Validate src directory structure
 * @param projectPath - Project path
 * @returns Array of src directory errors
 */
export async function validateSrcDirectory(projectPath: string): Promise<string[]> {
  const errors: string[] = [];
  const srcDir = path.join(projectPath, 'src');

  try {
    await fs.access(srcDir);

    // Check for index.ts in src directory
    const indexFile = path.join(srcDir, 'index.ts');
    try {
      await fs.access(indexFile);
    } catch {
      errors.push('Missing src/index.ts file');
    }
  } catch {
    errors.push('Missing src directory');
  }

  return errors;
}

/**
 * Validate package.json basic fields
 * @param packageJson - Parsed package.json object
 * @param errors - Array to collect validation errors
 */
function validateBasicPackageFields(packageJson: Record<string, unknown>, errors: string[]): void {
  if (!packageJson['name']) {
    errors.push('package.json missing name field');
  }
  if (!packageJson['version']) {
    errors.push('package.json missing version field');
  }
}

/**
 * Validate package.json scripts
 * @param packageJson - Parsed package.json object
 * @param errors - Array to collect validation errors
 */
function validatePackageScripts(packageJson: Record<string, unknown>, errors: string[]): void {
  if (packageJson['scripts']) {
    const requiredScripts = ['build', 'test', 'lint'];
    for (const script of requiredScripts) {
      if (!(packageJson['scripts'] as Record<string, string>)[script]) {
        errors.push(`package.json missing script: ${script}`);
      }
    }
  } else {
    errors.push('package.json missing scripts field');
  }
}

/**
 * Validate package.json structure
 * @param projectPath - Project path
 * @returns Array of package.json validation errors
 */
export async function validatePackageJson(projectPath: string): Promise<string[]> {
  const errors: string[] = [];

  try {
    const packageJsonPath = path.join(projectPath, 'package.json');
    const packageContent = await fs.readFile(packageJsonPath, 'utf-8');
    const packageJson = JSON.parse(packageContent);

    validateBasicPackageFields(packageJson, errors);
    validatePackageScripts(packageJson, errors);
  } catch {
    errors.push('Invalid package.json format');
  }

  return errors;
}
