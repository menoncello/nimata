/**
 * Project Generation Helpers
 *
 * Helper functions and utilities for project generation
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import type { TemplateEngineImpl } from '../template-engine/types.js';
import { SAFE_FILE_PERMISSIONS } from './constants.js';
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

// Permission bit constants
const WORLD_WRITABLE_BIT = 0o002;
const SETUID_SETGID_BITS = 0o6000;

/**
 * Validates that file permissions are safe and don't expose unnecessary access
 * @param {number} mode - File permission mode (numeric)
 * @returns {boolean} True if permissions are safe, false otherwise
 */
function validateFilePermissions(mode: number): boolean {
  // Allow standard file permissions:
  // - Owner: read/write/execute (7)
  // - Group: read/write/execute (7)
  // - Others: read/execute (5)
  // Also allow common variations like 644, 755, etc.

  // Disallow world-writable permissions (security risk)
  if ((mode & WORLD_WRITABLE_BIT) !== 0) {
    return false;
  }

  // Disallow setuid/setgid bits (security risk)
  if ((mode & SETUID_SETGID_BITS) !== 0) {
    return false;
  }

  // Allow common safe permissions: 644, 755, 750, 640, 600, 700
  const safePermissions = SAFE_FILE_PERMISSIONS;
  return safePermissions.includes(mode);
}

/**
 * Sets file permissions after validation
 * @param {string} filePath - Path to the file
 * @param {string} permissions - Permission string (e.g., '644')
 * @throws {Error} If permissions are invalid or unsafe
 */
async function setFilePermissions(filePath: string, permissions: string): Promise<void> {
  const mode = Number.parseInt(permissions, 8);

  // Validate file permissions are safe
  if (!validateFilePermissions(mode)) {
    throw new Error(
      `Unsafe file permissions: ${permissions}. Only allow read/write for owner and group, and read for others.`
    );
  }

  await fs.chmod(filePath, mode);
}

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
 * @param {ProjectConfig} config - Project configuration
 * @returns {ValidationResult} Validation result for required fields
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
 * @param {ProjectConfig} config - Project configuration
 * @returns {ValidationResult} Validation result for optional fields
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
 * @param {string} projectDir - Project directory path
 * @param {boolean} allowExisting - If true, don't throw error if directory exists (default: true)
 * @returns {Promise<void>} Promise that resolves if directory doesn't exist (or allowExisting is true), rejects otherwise
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
 * @param {TemplateEngine} templateEngine - Template engine instance
 * @param {string} templateName - Template name
 * @param {string} projectType - Project type
 * @returns {Promise<ProjectTemplate>} Loaded template
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
 * @param {Array<{ path: string; content: string; permissions?: string }>} files - Generated files
 * @param {string} projectDir - Project directory
 * @returns {Promise<string[]>} Array of write errors
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
        await setFilePermissions(filePath, file.permissions);
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
 * @param {string} projectPath - Project path
 * @returns {Promise<string[]>} Array of missing files errors
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
 * @param {string} projectPath - Project path
 * @returns {Promise<string[]>} Array of src directory errors
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
 * @param {Record<string} packageJson - Parsed package.json object
 * @param {string[]} errors - Array to collect validation errors
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
 * @param {Record<string} packageJson - Parsed package.json object
 * @param {string[]} errors - Array to collect validation errors
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
 * @param {string} projectPath - Project path
 * @returns {Promise<string[]>} Array of package.json validation errors
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
