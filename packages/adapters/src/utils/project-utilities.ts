/**
 * Project Utilities
 *
 * Helper functions for project operations and directory management
 */

import path from 'node:path';
import type {
  ProjectConfig,
  ProjectTemplate,
  ValidationResult,
} from './project-generation-helpers.js';
import { toCamelCase, toPascalCase, toKebabCase, toSnakeCase } from './string-utils.js';

/**
 * Get project directory path
 * @param {ProjectConfig} config - Project configuration
 * @returns {ProjectConfig): string} Project directory path
 */
export function getProjectDirectory(config: ProjectConfig): string {
  if (config.targetDirectory) {
    // Check if target directory already ends with the project name
    const targetBasename = path.basename(config.targetDirectory);
    if (targetBasename === config.name) {
      // Use target directory as-is, no need to append project name
      return path.resolve(config.targetDirectory);
    }
    // targetDirectory is the parent directory - append project name
    return path.resolve(config.targetDirectory, config.name);
  }

  // Default to current working directory + project name
  return path.resolve(process.cwd(), config.name);
}

/**
 * Check if project directory already exists
 * @param {unknown} projectDir - Project directory path
 * @param {unknown} allowExisting - If true, don't throw error if directory exists (default: true)
 * @returns {void} Promise that resolves if directory doesn't exist (or allowExisting is true), rejects otherwise
 */
export async function checkDirectoryExists(
  projectDir: string,
  allowExisting = true
): Promise<void> {
  try {
    const { access } = await import('node:fs/promises');
    await access(projectDir);
    // Directory exists
    if (!allowExisting) {
      throw new Error(`Directory '${projectDir}' already exists`);
    }
    // Directory exists but we're allowing it
  } catch (error: unknown) {
    if (error instanceof Error && error.message.includes('already exists')) {
      throw error;
    }
    // Directory doesn't exist, which is fine
  }
}

/**
 * Load and validate a project template
 * @param {{ loadTemplate: (name: string) => Promise<ProjectTemplate> }} templateEngine - Template engine with loadTemplate function
 * @param {() => Promise<ProjectTemplate>} templateEngine.loadTemplate - Function to load template by name
 * @param {string} templateName - Template name
 * @param {string} projectType - Project type
 * @returns {Promise<ProjectTemplate>} Loaded template
 */
export async function loadAndValidateTemplate(
  templateEngine: { loadTemplate: (name: string) => Promise<ProjectTemplate> },
  templateName: string,
  projectType: string
): Promise<ProjectTemplate> {
  // Load template
  let template: ProjectTemplate;
  try {
    template = await templateEngine.loadTemplate(templateName);
  } catch (error) {
    throw new Error(`Failed to load template '${templateName}': ${error}`);
  }

  // Validate template supports project type
  if (!template.supportedProjectTypes.includes(projectType)) {
    throw new Error(
      `Template '${templateName}' does not support project type '${projectType}'. ` +
        `Supported types: ${template.supportedProjectTypes.join(', ')}`
    );
  }

  return template;
}

/**
 * Validate variable type
 * @param {{ name: string; type: string }} variable - Variable configuration with name and type
 * @param {string} variable.name - Variable name
 * @param {string} variable.type - Variable type
 * @param {unknown} value - Variable value to validate
 * @returns {string | null} Error message if validation fails, null if valid
 */
function validateVariableType(
  variable: { name: string; type: string },
  value: unknown
): string | null {
  switch (variable.type) {
    case 'string':
    case 'select':
      if (typeof value !== 'string') {
        return `Variable '${variable.name}' must be a string`;
      }
      break;
    case 'boolean':
      if (typeof value !== 'boolean') {
        return `Variable '${variable.name}' must be a boolean`;
      }
      break;
    case 'multiselect':
      if (!Array.isArray(value) || !value.every((item) => typeof item === 'string')) {
        return `Variable '${variable.name}' must be an array of strings`;
      }
      break;
  }
  return null;
}

/**
 * Validate pattern rule
 * @param {unknown} value - Variable value
 * @param {{ pattern?: RegExp; message: string }} rule - Validation rule with pattern and message
 * @param {RegExp} [rule.pattern] - Pattern for regex validation
 * @param {string} rule.message - Error message
 * @returns {string | null} Error message if validation fails, null if valid
 */
function validatePatternRule(
  value: unknown,
  rule: { pattern?: RegExp; message: string }
): string | null {
  if (typeof value === 'string' && rule.pattern) {
    return rule.pattern.test(value) ? null : rule.message;
  }
  return null;
}

/**
 * Validate length rule
 * @param {unknown} value - Variable value
 * @param {{ min?: number; max?: number; message: string }} rule - Validation rule with min/max length and error message
 * @param {number} [rule.min] - Minimum length
 * @param {number} [rule.max] - Maximum length
 * @param {string} rule.message - Error message
 * @returns {string | null} Error message if validation fails, null if valid
 */
function validateLengthRule(
  value: unknown,
  rule: { min?: number; max?: number; message: string }
): string | null {
  if (typeof value === 'string') {
    const min = rule.min ?? 0;
    const max = rule.max ?? Infinity;
    return value.length >= min && value.length <= max ? null : rule.message;
  }
  return null;
}

/**
 * Validate custom validator rule
 * @param {string} variable - Variable name
 * @param {unknown} value - Variable value
 * @param {{ validator?: (value: unknown) => boolean | string; message: string }} rule - Validation rule with custom validator and error message
 * @param {(value: unknown) => boolean | string} [rule.validator] - Custom validator function
 * @param {string} rule.message - Error message
 * @returns {string | null} Error message if validation fails, null if valid
 */
function validateCustomValidatorRule(
  variable: string,
  value: unknown,
  rule: { validator?: (value: unknown) => boolean | string; message: string }
): string | null {
  if (rule.validator) {
    const result = rule.validator(value);
    if (typeof result === 'boolean') {
      return result ? null : rule.message;
    } else if (typeof result === 'string') {
      return `Variable '${variable}': ${result}`;
    }
  }
  return null;
}

/**
 * Validate variable against custom rules
 * @param {unknown} variable - Template variable definition
 * @param {unknown} variable.name - Variable name
 * @param {unknown} value - Variable value
 * @param {unknown} rule - Validation rule
 * @param {unknown} rule.type - Rule type
 * @param {unknown} rule.pattern - Pattern for regex validation
 * @param {unknown} rule.min - Minimum length
 * @param {unknown} rule.max - Maximum length
 * @param {unknown} rule.validator - Custom validator function
 * @param {unknown} rule.message - Error message
 * @returns {string | null} Error message if validation fails, null if valid
 */
function validateCustomRule(
  variable: { name: string },
  value: unknown,
  rule: {
    type: string;
    pattern?: RegExp;
    min?: number;
    max?: number;
    validator?: (value: unknown) => boolean | string;
    message: string;
  }
): string | null {
  switch (rule.type) {
    case 'pattern':
      return validatePatternRule(value, rule);
    case 'length':
      return validateLengthRule(value, rule);
    case 'custom':
      return validateCustomValidatorRule(variable.name, value, rule);
  }
  return null;
}

/**
 * Validate single template variable
 * @param {{ name: string; type: string; required: boolean; validation?: Array<unknown> }} variable - Variable configuration
 * @param {string} variable.name - Variable name
 * @param {string} variable.type - Variable type
 * @param {boolean} variable.required - Whether variable is required
 * @param {Array<unknown>} [variable.validation] - Validation rules array
 * @param {unknown} value - Variable value
 * @returns {string[]} Array of validation errors
 */
function validateSingleVariable(
  variable: {
    name: string;
    type: string;
    required: boolean;
    validation?: Array<{
      type: string;
      pattern?: RegExp;
      min?: number;
      max?: number;
      validator?: (value: unknown) => boolean | string;
      message: string;
    }>;
  },
  value: unknown
): string[] {
  // Check required variables
  if (variable.required && isValueEmpty(value)) {
    return [`Required variable '${variable.name}' is missing`];
  }

  // Skip validation for optional variables that are not provided
  if (!variable.required && isValueEmpty(value)) {
    return [];
  }

  // Type validation
  return value !== undefined && value !== null ? validateVariableTypeAndRules(variable, value) : [];
}

/**
 * Check if value is empty (undefined, null, or empty string)
 * @param {unknown} value - Value to check
 * @returns {unknown): boolean} True if value is empty
 */
function isValueEmpty(value: unknown): boolean {
  return value === undefined || value === null || value === '';
}

/**
 * Validate variable type and rules
 * @param {{ name: string; type: string; validation?: Array<unknown> }} variable - Variable configuration
 * @param {string} variable.name - Variable name
 * @param {string} variable.type - Variable type
 * @param {Array<unknown>} [variable.validation] - Validation rules array
 * @param {unknown} value - Variable value
 * @returns {string[]} Array of validation errors
 */
function validateVariableTypeAndRules(
  variable: {
    name: string;
    type: string;
    validation?: Array<{
      type: string;
      pattern?: RegExp;
      min?: number;
      max?: number;
      validator?: (value: unknown) => boolean | string;
      message: string;
    }>;
  },
  value: unknown
): string[] {
  const errors: string[] = [];

  // Type validation
  const typeError = validateVariableType(variable, value);
  if (typeError) {
    errors.push(typeError);
    return errors;
  }

  // Custom validation
  const customErrors = validateCustomRules(variable, value);
  errors.push(...customErrors);

  return errors;
}

/**
 * Validate custom validation rules
 * @param {{ name: string; validation?: Array<unknown> }} variable - Variable configuration
 * @param {string} variable.name - Variable name
 * @param {Array<unknown>} [variable.validation] - Validation rules array
 * @param {unknown} value - Value to validate
 * @returns {string[]} Array of validation error messages
 */
function validateCustomRules(
  variable: {
    name: string;
    validation?: Array<{
      type: string;
      pattern?: RegExp;
      min?: number;
      max?: number;
      validator?: (value: unknown) => boolean | string;
      message: string;
    }>;
  },
  value: unknown
): string[] {
  const errors: string[] = [];

  if (!variable.validation) {
    return errors;
  }

  for (const rule of variable.validation) {
    const customError = validateCustomRule(variable, value, rule);
    if (customError) {
      errors.push(customError);
    }
  }

  return errors;
}

/**
 * Validate template variables
 * @param {unknown} template - Project template
 * @param {unknown} variables - Provided variables
 * @returns {ValidationResult} Validation result
 */
export function validateTemplateVariables(
  template: ProjectTemplate,
  variables: Record<string, unknown>
): ValidationResult {
  const errors: string[] = [];

  for (const variable of template.variables) {
    const value = variables[variable.name];
    const variableErrors = validateSingleVariable(variable, value);
    errors.push(...variableErrors);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Generate project summary
 * @param {ProjectConfig} config - Project configuration
 * @returns {ProjectConfig): string} Formatted project summary
 */
export function generateProjectSummary(config: ProjectConfig): string {
  const lines = [
    `Project: ${config.name}`,
    `Type: ${config.projectType}`,
    `Quality: ${config.qualityLevel}`,
    `AI Assistants: ${config.aiAssistants.join(', ')}`,
  ];

  if (config.description) {
    lines.push(`Description: ${config.description}`);
  }

  if (config.author) {
    lines.push(`Author: ${config.author}`);
  }

  if (config.license) {
    lines.push(`License: ${config.license}`);
  }

  return lines.join('\n');
}

/**
 * Create template context
 * @param {ProjectConfig} config - Project configuration
 * @returns {void} Template context
 */
export function createTemplateContext(config: ProjectConfig): Record<string, unknown> {
  return {
    name: config.name,
    description: config.description || '',
    author: config.author || '',
    license: config.license || 'MIT',
    qualityLevel: config.qualityLevel,
    projectType: config.projectType,
    aiAssistants: config.aiAssistants,
    year: new Date().getFullYear().toString(),
    now: new Date().toISOString(),
    camelCaseName: toCamelCase(config.name),
    pascalCaseName: toPascalCase(config.name),
    kebabCaseName: toKebabCase(config.name),
    snakeCaseName: toSnakeCase(config.name),
  };
}
