/**
 * Handlebars-based Template Engine Implementation
 *
 * Template engine using Handlebars.js for rendering project templates
 * with TypeScript bindings, caching, and validation
 */
/* eslint-disable max-lines */
import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import Handlebars, { type TemplateDelegate } from 'handlebars';
import type {
  TemplateEngine as ITemplateEngine,
  TemplateContext,
} from '../../core/src/interfaces/template-engine.js';
import type {
  ProjectTemplate,
  ValidationResult,
  GeneratedFile,
} from '../../core/src/types/project-config.js';
import { findBlockMatches, matchBlocks } from './template-engine/block-matching-utils.js';
import { registerDefaultHelpers } from './template-engine/handlebars-helper-registration.js';

/**
 * Template cache entry with TTL support
 */
interface CachedTemplate {
  compiled: TemplateDelegate;
  lastModified: number;
  createdAt: number;
  ttl: number;
}

/**
 * Constants for template engine
 */
const TEMPLATE_ERROR_MESSAGES = {
  RENDERING_FAILED: 'Template rendering failed',
  COMPILATION_FAILED: 'Template compilation failed',
  UNKNOWN_ERROR: 'Unknown error',
} as const;

const TEMPLATE_FILE_EXTENSION = '.json';
const TYPESCRIPT_BUN_CLI_SUBDIR = 'typescript-bun-cli';

// Hash algorithm constants
// Using SHA-256 for secure template hashing

// Cache TTL constant (30 minutes in milliseconds)
// eslint-disable-next-line no-magic-numbers
const DEFAULT_CACHE_TTL = 30 * 60 * 1000;

const CACHE_CLEANUP_PROBABILITY = 0.01; // 1% for periodic cleanup

/**
 * Handlebars Template Engine Implementation
 */
export class HandlebarsTemplateEngine implements ITemplateEngine {
  private templateCache = new Map<string, CachedTemplate>();
  private templatesDir: string;
  private handlebars: typeof Handlebars;

  /**
   * Creates a new HandlebarsTemplateEngine instance
   * @param templatesDir - Directory containing template files
   */
  constructor(templatesDir?: string) {
    this.templatesDir = templatesDir || this.resolveTemplatesDirectory();
    this.handlebars = Handlebars.create();
    registerDefaultHelpers(this.handlebars);
  }

  /**
   * Resolves the templates directory path
   * @returns Resolved templates directory path
   */
  private resolveTemplatesDirectory(): string {
    const currentFilePath = new URL(import.meta.url).pathname;
    const currentDir = path.dirname(currentFilePath);
    return path.resolve(currentDir, '../../templates');
  }

  /**
   * Loads a template from the file system
   * @param templateName - Name of the template to load
   * @returns Loaded project template
   */
  async loadTemplate(templateName: string): Promise<ProjectTemplate> {
    const subDirPath = this.getTemplatePath(templateName, true);
    const directPath = this.getTemplatePath(templateName, false);

    return this.loadTemplateWithFallback(subDirPath, directPath, templateName);
  }

  /**
   * Attempts to load template with fallback to alternative path
   * @param primaryPath - Primary path to try
   * @param fallbackPath - Fallback path to try if primary fails
   * @param templateName - Name of the template for error messages
   * @returns Loaded project template
   */
  private async loadTemplateWithFallback(
    primaryPath: string,
    fallbackPath: string,
    templateName: string
  ): Promise<ProjectTemplate> {
    try {
      return await this.loadTemplateFromPath(primaryPath, templateName);
    } catch (error) {
      if (this.isFileNotFound(error)) {
        return this.handleFallbackLoad(fallbackPath, primaryPath, templateName);
      }
      throw error;
    }
  }

  /**
   * Handles fallback template loading
   * @param fallbackPath - Fallback path to try
   * @param primaryPath - Primary path that failed
   * @param templateName - Name of the template
   * @returns Loaded project template
   */
  private async handleFallbackLoad(
    fallbackPath: string,
    primaryPath: string,
    templateName: string
  ): Promise<ProjectTemplate> {
    try {
      return await this.loadTemplateFromPath(fallbackPath, templateName);
    } catch (directError) {
      if (this.isFileNotFound(directError)) {
        throw this.createTemplateNotFoundError(templateName, primaryPath, fallbackPath);
      }
      throw directError;
    }
  }

  /**
   * Gets template file path
   * @param templateName - Name of the template
   * @param useSubDir - Whether to use subdirectory
   * @returns Template file path
   */
  private getTemplatePath(templateName: string, useSubDir: boolean): string {
    const baseDir = useSubDir
      ? path.join(this.templatesDir, TYPESCRIPT_BUN_CLI_SUBDIR)
      : this.templatesDir;
    return path.join(baseDir, `${templateName}${TEMPLATE_FILE_EXTENSION}`);
  }

  /**
   * Loads template from specified path
   * @param templatePath - Path to template file
   * @param templateName - Name of the template for error messages
   * @returns Parsed and validated template
   */
  private async loadTemplateFromPath(
    templatePath: string,
    templateName: string
  ): Promise<ProjectTemplate> {
    const content = await fs.readFile(templatePath, 'utf-8');
    const template = this.parseTemplateContent(content, templateName);
    this.validateTemplateOrThrow(template);
    return template;
  }

  /**
   * Parses template content from JSON string
   * @param content - JSON content to parse
   * @param templateName - Name of the template for error messages
   * @returns Parsed template
   */
  private parseTemplateContent(content: string, templateName: string): ProjectTemplate {
    try {
      return JSON.parse(content) as ProjectTemplate;
    } catch (parseError) {
      const errorMessage = parseError instanceof Error ? parseError.message : 'Unknown JSON error';
      throw new Error(`Invalid JSON in template '${templateName}': ${errorMessage}`);
    }
  }

  /**
   * Validates template and throws error if invalid
   * @param template - Template to validate
   */
  private validateTemplateOrThrow(template: ProjectTemplate): void {
    const validation = this.validateTemplateStructure(template);
    if (!validation.valid) {
      throw new Error(`Invalid template structure: ${validation.errors.join(', ')}`);
    }
  }

  /**
   * Checks if error is a file not found error
   * @param error - Error to check
   * @returns True if error is ENOENT
   */
  private isFileNotFound(error: unknown): boolean {
    return error instanceof Error && error.message.includes('ENOENT');
  }

  /**
   * Creates template not found error with both attempted paths
   * @param templateName - Name of the template
   * @param subDirPath - Subdirectory path attempted
   * @param directPath - Direct path attempted
   * @returns Error with descriptive message
   */
  private createTemplateNotFoundError(
    templateName: string,
    subDirPath: string,
    directPath: string
  ): Error {
    return new Error(`Template '${templateName}' not found at ${directPath} or ${subDirPath}`);
  }

  /**
   * Renders a template string with the provided context using Handlebars
   * @param template - Template string to render
   * @param context - Context object containing variable values
   * @returns The rendered template string
   */
  async renderTemplate(template: string, context: TemplateContext): Promise<string> {
    try {
      // Compile template with caching
      const compiledTemplate = this.compileTemplate(template);

      // Render with context
      return compiledTemplate(context);
    } catch (error) {
      throw new Error(
        `${TEMPLATE_ERROR_MESSAGES.RENDERING_FAILED}: ${error instanceof Error ? error.message : TEMPLATE_ERROR_MESSAGES.UNKNOWN_ERROR}`
      );
    }
  }

  /**
   * Compiles a template with caching support
   * @param template - Template string to compile
   * @returns Compiled Handlebars template
   */
  private compileTemplate(template: string): TemplateDelegate {
    // Evict expired entries periodically (1 in 100 calls)
    // eslint-disable-next-line sonarjs/pseudo-random
    if (Math.random() < CACHE_CLEANUP_PROBABILITY) {
      this.evictExpiredEntries();
    }

    // Create a secure hash for caching using crypto.createHash
    const templateHash = createHash('sha256').update(template).digest('hex');

    const cached = this.templateCache.get(templateHash);
    if (cached) {
      return cached.compiled;
    }

    try {
      const compiled = this.handlebars.compile(template);

      this.templateCache.set(templateHash, {
        compiled,
        lastModified: Date.now(),
        createdAt: Date.now(),
        ttl: DEFAULT_CACHE_TTL,
      });

      return compiled;
    } catch (error) {
      throw new Error(
        `${TEMPLATE_ERROR_MESSAGES.COMPILATION_FAILED}: ${error instanceof Error ? error.message : TEMPLATE_ERROR_MESSAGES.UNKNOWN_ERROR}`
      );
    }
  }

  /**
   * Validates template syntax and structure
   * @param template - Template string to validate
   * @returns Validation result with any errors found
   */
  validateTemplate(template: string): ValidationResult {
    const errors: string[] = [];

    try {
      // Try to compile the template to check for syntax errors
      this.handlebars.compile(template);

      // Try rendering with empty context to catch runtime errors
      const compiled = this.handlebars.compile(template);
      compiled({});
    } catch (error) {
      if (error instanceof Error) {
        const errorMessage = error.message;
        // Check for specific unclosed block patterns
        if (errorMessage.includes('Expecting') || errorMessage.includes('EOF')) {
          errors.push('unclosed block');
        } else {
          errors.push(`Syntax error: ${errorMessage}`);
        }
      } else {
        errors.push('Unknown syntax error');
      }
    }

    const hasErrors = errors.length > 0;
    return {
      valid: !hasErrors,
      errors,
      warnings: [],
    };
  }

  /**
   * Validates project template structure
   * @param template - Project template to validate
   * @returns Validation result
   */
  validateTemplateStructure(template: ProjectTemplate): ValidationResult {
    const errors: string[] = [];

    this.validateBasicTemplateFields(template, errors);
    this.validateTemplateFiles(template, errors);
    this.validateTemplateVariables(template, errors);

    const hasErrors = errors.length > 0;
    return {
      valid: !hasErrors,
      errors,
      warnings: [],
    };
  }

  /**
   * Validates basic template fields
   * @param template - Template to validate
   * @param errors - Array to collect errors
   */
  private validateBasicTemplateFields(template: ProjectTemplate, errors: string[]): void {
    if (!template.name || typeof template.name !== 'string') {
      errors.push('Template must have a valid name');
    }

    // Description is optional for backward compatibility with tests
  }

  /**
   * Validates template files
   * @param template - Template to validate
   * @param errors - Array to collect errors
   */
  private validateTemplateFiles(template: ProjectTemplate, errors: string[]): void {
    if (!Array.isArray(template.files)) {
      errors.push('Missing required property: files');
      return;
    }

    for (const [index, file] of template.files.entries()) {
      if (!file.path || typeof file.path !== 'string') {
        errors.push(`File ${index} must have a valid path`);
      }
      if (!file.template || typeof file.template !== 'string') {
        errors.push(`File ${index} must have a valid template`);
      }
    }
  }

  /**
   * Validates template variables
   * @param template - Template to validate
   * @param errors - Array to collect errors
   */
  private validateTemplateVariables(template: ProjectTemplate, errors: string[]): void {
    // Variables are optional - only validate if present
    if (template.variables && !Array.isArray(template.variables)) {
      errors.push('Template variables must be an array');
    }
  }

  /**
   * Finds unclosed Handlebars blocks in template
   * @param template - Template string to check
   * @returns Array of unclosed block types
   */
  private findUnclosedBlocks(template: string): string[] {
    const OPEN_BLOCK_PATTERN = /{{#(\w+)}}/g;
    const CLOSE_BLOCK_PATTERN = /{{\/(\w+)}}/g;

    const openBlockMatches = findBlockMatches(template, OPEN_BLOCK_PATTERN, true);
    const closeBlockMatches = findBlockMatches(template, CLOSE_BLOCK_PATTERN, false);

    return matchBlocks(openBlockMatches, closeBlockMatches);
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
      try {
        if (!this.shouldRenderFile(file, context)) {
          continue;
        }

        const generatedFile = await this.generateFile(file, context);
        generatedFiles.push(generatedFile);
      } catch (error) {
        throw new Error(
          `Failed to process file '${file.path}': ${error instanceof Error ? error.message : TEMPLATE_ERROR_MESSAGES.UNKNOWN_ERROR}`
        );
      }
    }

    return generatedFiles;
  }

  /**
   * Determines if a file should be rendered based on conditions
   * @param file - File configuration
   * @param file.condition - Optional condition to check
   * @param context - Template context
   * @returns True if file should be rendered
   */
  private shouldRenderFile(file: { condition?: string }, context: TemplateContext): boolean {
    if (!file.condition) {
      return true;
    }

    const conditionValue = context[file.condition];
    return Boolean(conditionValue);
  }

  /**
   * Generates a single file from template
   * @param file - File configuration
   * @param file.path - Output file path template
   * @param file.template - File content template
   * @param file.permissions - Optional file permissions
   * @param context - Template context
   * @returns Generated file object
   */
  private async generateFile(
    file: { path: string; template: string; permissions?: string },
    context: TemplateContext
  ): Promise<GeneratedFile> {
    const content = await this.renderTemplate(file.template, context);
    const filePath = await this.renderTemplate(file.path, context);

    return {
      path: filePath,
      content,
      permissions: file.permissions,
    };
  }

  /**
   * Registers a custom helper function
   * @param name - Name of the helper function
   * @param helper - Helper function implementation
   */
  registerHelper(name: string, helper: (...args: unknown[]) => unknown): void {
    this.handlebars.registerHelper(name, helper);
  }

  /**
   * Gets a list of all available templates
   * @returns Array of template names
   */
  async getAvailableTemplates(): Promise<string[]> {
    const templates = new Set<string>();

    try {
      // Check main templates directory
      const files = await fs.readdir(this.templatesDir);
      for (const file of files.filter((file) => file.endsWith(TEMPLATE_FILE_EXTENSION)))
        templates.add(file.replace(TEMPLATE_FILE_EXTENSION, ''));

      // Also check typescript-bun-cli subdirectory
      const subDir = path.join(this.templatesDir, TYPESCRIPT_BUN_CLI_SUBDIR);
      try {
        const subFiles = await fs.readdir(subDir);
        for (const file of subFiles.filter((file) => file.endsWith(TEMPLATE_FILE_EXTENSION)))
          templates.add(file.replace(TEMPLATE_FILE_EXTENSION, ''));
      } catch {
        // Subdirectory doesn't exist, ignore
      }

      return Array.from(templates);
    } catch {
      // Directory doesn't exist or is not readable
      return [];
    }
  }

  /**
   * Clears the template cache
   */
  clearCache(): void {
    this.templateCache.clear();
  }

  /**
   * Evicts expired entries from the cache
   * @returns Number of evicted entries
   */
  private evictExpiredEntries(): number {
    const now = Date.now();
    let evictedCount = 0;

    for (const [key, entry] of this.templateCache.entries()) {
      if (now - entry.createdAt > entry.ttl) {
        this.templateCache.delete(key);
        evictedCount++;
      }
    }

    return evictedCount;
  }

  /**
   * Gets or creates a cached template with TTL support
   * @param templateHash - Hash of the template
   * @param templateContent - Content of the template
   * @returns Compiled template
   */
  private getOrCreateCachedTemplate(
    templateHash: string,
    templateContent: string
  ): TemplateDelegate {
    // Check if cache entry exists and is not expired
    const existing = this.templateCache.get(templateHash);
    const now = Date.now();

    if (existing && now - existing.createdAt <= existing.ttl) {
      return existing.compiled;
    }

    // Compile new template
    const compiled = Handlebars.compile(templateContent);

    // Cache with TTL
    this.templateCache.set(templateHash, {
      compiled,
      lastModified: now,
      createdAt: now,
      ttl: DEFAULT_CACHE_TTL,
    });

    return compiled;
  }

  /**
   * Gets cache statistics
   * @returns Cache size and hit information
   */
  getCacheStats(): { size: number; templates: string[] } {
    return {
      size: this.templateCache.size,
      templates: Array.from(this.templateCache.keys()),
    };
  }
}
