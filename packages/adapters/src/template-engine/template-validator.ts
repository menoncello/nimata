/**
 * Template Validator
 *
 * Validates template syntax and structure
 */
import { REGEX_PATTERNS } from '../utils/constants-new';
import type { ProjectTemplate, TemplateFile, ValidationResult } from './types.js';

/**
 * Validates template syntax and structure
 * @param template - Template string to validate
 * @param helpers - Map of registered helper functions
 * @returns Validation result with any errors found
 */
export function validateTemplateSyntax(
  template: string,
  helpers: Map<string, (...args: unknown[]) => unknown>
): ValidationResult {
  const errors: string[] = [];

  validateBlockPairs(template, errors);
  validateVariableReferences(template, errors);
  validateHelperSyntax(template, helpers, errors);

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validates that all template blocks are properly paired
 * @param template - Template string to validate
 * @param errors - Array to collect validation errors
 */
export function validateBlockPairs(template: string, errors: string[]): void {
  const blockPairs = [
    { open: '{{#if', close: '{{/if', name: '{{#if}}' },
    { open: '{{#each', close: '{{/each', name: '{{#each}}' },
  ];

  for (const { open, close, name } of blockPairs) {
    const openCount = (template.match(new RegExp(escapeRegExp(open), 'g')) || []).length;
    const closeCount = (template.match(new RegExp(escapeRegExp(close), 'g')) || []).length;

    if (openCount !== closeCount) {
      errors.push(`Unclosed ${name} blocks: ${openCount} open, ${closeCount} closed`);
    }
  }
}

/**
 * Validates template variable reference syntax
 * @param template - Template string to validate
 * @param errors - Array to collect validation errors
 */
export function validateVariableReferences(template: string, errors: string[]): void {
  const malformedVars = template.match(REGEX_PATTERNS.VARIABLE_REFERENCE);
  if (malformedVars) {
    errors.push(`Malformed variable references: ${malformedVars.join(', ')}`);
  }
}

/**
 * Validates helper function syntax and existence
 * @param template - Template string to validate
 * @param helpers - Map of registered helper functions
 * @param errors - Array to collect validation errors
 */
export function validateHelperSyntax(
  template: string,
  helpers: Map<string, (...args: unknown[]) => unknown>,
  errors: string[]
): void {
  const helperMatches = template.match(REGEX_PATTERNS.HELPER_SYNTAX);
  if (!helperMatches) {
    return;
  }

  for (const match of helperMatches) {
    const helperName = match.match(/{{helper:([A-Z_a-z]\w*)}}/)?.[1];
    if (helperName && !helpers.has(helperName)) {
      errors.push(`Unknown helper: ${helperName}`);
    }
  }
}

/**
 * Escapes special characters in a string for use in regular expressions
 * @param string - String to escape
 * @returns Escaped string safe for use in RegExp
 */
export function escapeRegExp(string: string): string {
  return string.replace(REGEX_PATTERNS.ESCAPE_REGEX, '\\$&');
}

/**
 * Validates the structure of a project template
 * @param template - Template to validate
 * @returns Validation result with any errors found
 */
export function validateTemplateStructure(template: ProjectTemplate): ValidationResult {
  const errors: string[] = [];

  validateBasicTemplateFields(template, errors);
  validateTemplateArrays(template, errors);
  validateTemplateFiles(template, errors);

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validates basic template fields
 * @param template - Template to validate
 * @param errors - Array to collect errors
 */
export function validateBasicTemplateFields(template: ProjectTemplate, errors: string[]): void {
  if (!template.name) {
    errors.push('Template name is required');
  }

  if (!template.version) {
    errors.push('Template version is required');
  }
}

/**
 * Validates template array fields
 * @param template - Template to validate
 * @param errors - Array to collect errors
 */
export function validateTemplateArrays(template: ProjectTemplate, errors: string[]): void {
  if (!Array.isArray(template.supportedProjectTypes)) {
    errors.push('Template supportedProjectTypes must be an array');
  }

  if (!Array.isArray(template.variables)) {
    errors.push('Template variables must be an array');
  }
}

/**
 * Validates template files array
 * @param template - Template to validate
 * @param errors - Array to collect errors
 */
export function validateTemplateFiles(template: ProjectTemplate, errors: string[]): void {
  if (!Array.isArray(template.files)) {
    errors.push('Template files must be an array');
    return;
  }

  for (const [index, file] of template.files.entries()) {
    validateTemplateFile(file, index, errors);
  }
}

/**
 * Validates a single template file
 * @param file - File to validate
 * @param index - File index
 * @param errors - Array to collect errors
 */
export function validateTemplateFile(file: TemplateFile, index: number, errors: string[]): void {
  if (!file.path) {
    errors.push(`File ${index}: path is required`);
  }
  if (!file.template) {
    errors.push(`File ${index}: template is required`);
  }
}
