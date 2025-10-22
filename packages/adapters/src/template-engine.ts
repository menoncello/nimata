/**
 * Template Engine Implementation
 *
 * Handles template processing, variable substitution, and file generation
 * for project scaffolding with support for conditional rendering and helpers
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { getNestedValue } from './template-engine/argument-processor.js';
import {
  registerStringHelpers,
  registerArrayHelpers,
  registerConditionalHelpers,
  registerUtilityHelpers,
} from './template-engine/template-helpers.js';
import {
  processHelpers,
  processConditionals,
  processLoops,
} from './template-engine/template-processor.js';
import {
  validateTemplateSyntax,
  validateTemplateStructure,
} from './template-engine/template-validator.js';
import type {
  TemplateContext,
  ProjectTemplate,
  GeneratedFile,
  ValidationResult,
  TemplateEngineImpl,
} from './template-engine/types.js';
import { REGEX_PATTERNS } from './utils/constants-new.js';

/**
 * Template Engine class for processing and rendering project templates
 */
export class TemplateEngine implements TemplateEngineImpl {
  private helpers = new Map<string, (...args: unknown[]) => unknown>();
  private templatesDir: string;

  /**
   * Creates a new TemplateEngine instance
   * @param templatesDir - Optional directory path containing templates
   */
  constructor(templatesDir?: string) {
    if (templatesDir) {
      this.templatesDir = templatesDir;
    } else {
      // Get the file URL path properly
      const currentFilePath = new URL(import.meta.url).pathname;
      const currentDir = path.dirname(currentFilePath);
      this.templatesDir = path.resolve(currentDir, '../templates');
    }
    this.registerDefaultHelpers();
  }

  /**
   * Loads a template from the templates directory
   * @param templateName - Name of the template to load
   * @returns The loaded project template
   * @throws Error if template is not found or invalid
   */
  async loadTemplate(templateName: string): Promise<ProjectTemplate> {
    const templatePath = path.join(this.templatesDir, `${templateName}.json`);

    try {
      const content = await fs.readFile(templatePath, 'utf-8');
      const template = JSON.parse(content) as ProjectTemplate;

      // Validate template structure
      const validation = validateTemplateStructure(template);
      if (!validation.valid) {
        throw new Error(`Invalid template structure: ${validation.errors.join(', ')}`);
      }

      return template;
    } catch (error) {
      if (error instanceof Error && error.message.includes('ENOENT')) {
        throw new Error(`Template '${templateName}' not found at ${templatePath}`);
      }
      throw error;
    }
  }

  /**
   * Process pipe syntax variables like {{variable|helper}}
   * @param trimmedPath - Trimmed variable path
   * @param context - Template context
   * @returns Processed string value
   */
  private processPipeVariable(trimmedPath: string, context: TemplateContext): string {
    const pipeMatch = trimmedPath.match(/^([^|]+)\|(\w+)$/);
    if (!pipeMatch) return '';

    const [, varName, helperName] = pipeMatch;
    const value = getNestedValue(context, varName || '');

    if (value === undefined || value === null) {
      return '';
    }

    const helper = this.helpers.get(helperName || '');
    if (helper) {
      try {
        return String(helper(value));
      } catch {
        return String(value);
      }
    }

    return String(value);
  }

  /**
   * Process simple variable substitution
   * @param result - Template string to process
   * @param context - Template context
   * @returns Template string with processed variables
   */
  private processSimpleVariables(result: string, context: TemplateContext): string {
    return result.replace(REGEX_PATTERNS.SIMPLE_VAR, (match, variablePath) => {
      const trimmedPath = variablePath.trim();

      // Check for pipe syntax: {{variable|helper}}
      const pipeMatch = trimmedPath.match(/^([^|]+)\|(\w+)$/);
      if (pipeMatch) {
        return this.processPipeVariable(trimmedPath, context);
      }

      const value = getNestedValue(context, trimmedPath);

      if (value === undefined || value === null) {
        return '';
      }

      return String(value);
    });
  }

  /**
   * Renders a template string with the provided context
   * @param template - Template string to render
   * @param context - Context object containing variable values
   * @returns The rendered template string
   */
  async renderTemplate(template: string, context: TemplateContext): Promise<string> {
    let result = template;
    let hasChanges = true;

    // Keep processing until no more changes (handles nested structures)
    while (hasChanges) {
      hasChanges = false;
      const previousResult = result;

      // Process helper functions {{helper:name arg1 arg2}} first
      result = await processHelpers(result, context, this.helpers);

      // Process conditional blocks {{#if condition}}...{{/if}}
      result = await processConditionals(result, context);

      // Process loops {{#each items}}...{{/each}}
      result = await processLoops(result, context);

      // Process simple variable substitution {{variable}} last
      result = this.processSimpleVariables(result, context);

      if (result !== previousResult) {
        hasChanges = true;
      }
    }

    return this.finalCleanup(result, context);
  }

  /**
   * Final cleanup - ensure all variables are processed
   * @param result - Processed template string
   * @param context - Context object containing variable values
   * @returns Final processed template
   */
  private finalCleanup(result: string, context: TemplateContext): string {
    // Additional pass to ensure no variables are left unprocessed
    let finalResult = result;
    let hasChanges = true;

    const MAX_PROCESSING_PASSES = 3;
    // Run a few more passes to ensure complete processing
    for (let i = 0; i < MAX_PROCESSING_PASSES && hasChanges; i++) {
      hasChanges = false;
      const previousResult = finalResult;

      // Process any remaining simple variables
      finalResult = this.processSimpleVariables(finalResult, context);

      if (finalResult !== previousResult) {
        hasChanges = true;
      }
    }

    return finalResult;
  }

  /**
   * Validates template syntax and structure
   * @param template - Template string to validate
   * @returns Validation result with any errors found
   */
  validateTemplate(template: string): ValidationResult {
    return validateTemplateSyntax(template, this.helpers);
  }

  /**
   * Processes a project template and generates all files
   * @param projectTemplate - Project template to process
   * @param context - Context object containing variable values
   * @returns Array of generated files
   */
  async processProjectTemplate(
    projectTemplate: ProjectTemplate,
    context: TemplateContext
  ): Promise<GeneratedFile[]> {
    const generatedFiles: GeneratedFile[] = [];

    for (const file of projectTemplate.files) {
      // Check conditional rendering
      if (file.condition) {
        // Simple condition evaluation - check if context value is truthy
        const conditionValue = context[file.condition];
        const shouldRender = Boolean(conditionValue);
        if (!shouldRender) {
          continue;
        }
      }

      try {
        const content = await this.renderTemplate(file.template, context);
        const filePath = await this.renderTemplate(file.path, context);

        generatedFiles.push({
          path: filePath,
          content,
          permissions: file.permissions,
        });
      } catch (error) {
        throw new Error(
          `Failed to process file '${file.path}': ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    }

    return generatedFiles;
  }

  /**
   * Registers a custom helper function
   * @param name - Name of the helper function
   * @param helper - Helper function implementation
   */
  registerHelper(name: string, helper: (...args: unknown[]) => unknown): void {
    this.helpers.set(name, helper);
  }

  /**
   * Gets a list of all available templates
   * @returns Array of template names
   */
  async getAvailableTemplates(): Promise<string[]> {
    try {
      const files = await fs.readdir(this.templatesDir);
      return files
        .filter((file) => file.endsWith('.json'))
        .map((file) => file.replace('.json', ''));
    } catch {
      // Directory doesn't exist or is not readable
      return [];
    }
  }

  /**
   * Registers default helper functions for common operations
   */
  private registerDefaultHelpers(): void {
    registerStringHelpers(this.registerHelper.bind(this));
    registerArrayHelpers(this.registerHelper.bind(this));
    registerConditionalHelpers(this.registerHelper.bind(this));
    registerUtilityHelpers(this.registerHelper.bind(this));
  }
}
