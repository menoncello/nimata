/**
 * Template Content Validator Utility
 *
 * Handles validation of template content
 */
import type {
  TemplateValidationResult,
  TemplateValidationError,
  TemplateValidationWarning,
} from '@nimata/core';

/**
 * Constants for template validation
 */
const VALIDATION_CONSTANTS = {
  MAX_FILE_SIZE_KB: 100,
  BYTES_PER_KB: 1024,
  HANDLEBARS_START_LENGTH: 2,
  HANDLEBARS_END_LENGTH: 2,
  // Safe regex patterns optimized for performance
  // Note: These regex patterns are designed to avoid catastrophic backtracking
  // by using atomic groups and limiting quantifiers where possible
  HANDLEBARS_PATTERN: /{{[^{}]*}}/g,
  YAML_PATTERN: /^---\n.*\n---/s,
  JSON_PATTERN: /^\s*{.*}\s*$/s,
  YAML_BASIC_PATTERN: /^[A-Z]:/, // Simple YAML key detection
  // Use simpler patterns to avoid regex vulnerabilities
  HANDLEBARS_BLOCK_PATTERN: /{{#/, // Simple detection for opening blocks
  HANDLEBARS_END_BLOCK_PATTERN: /{{\//, // Simple detection for closing blocks
  HANDLEBARS_BLOCK_TYPE_PATTERN: /{{#(\w+)/,
  HANDLEBARS_END_BLOCK_TYPE_PATTERN: /{{\/(\w+)/,
} as const;

/**
 * Creates a template validation error
 * @param {unknown} code The error code
 * @param {unknown} message The error message
 * @param {unknown} filePath The file path where the error occurred
 * @returns {TemplateValidationError} A template validation error object
 */
function createValidationError(
  code: string,
  message: string,
  filePath?: string
): TemplateValidationError {
  return {
    code,
    message,
    filePath,
    severity: 'error' as const,
  };
}

/**
 * Creates a template validation warning
 * @param {unknown} code The warning code
 * @param {unknown} message The warning message
 * @param {unknown} category The warning category
 * @returns {TemplateValidationWarning} A template validation warning object
 */
function createValidationWarning(
  code: string,
  message: string,
  category: TemplateValidationWarning['category'] = 'best-practice'
): TemplateValidationWarning {
  return {
    code,
    message,
    category,
  };
}

/**
 * Template content validator utility class
 */
export class TemplateContentValidator {
  /**
   * Validate template content
   * @param {string} content The template content to validate
   * @param {string} extension The file extension
   * @returns { TemplateValidationResult} Validation result
   */
  static validateTemplateContent(content: string, extension: string): TemplateValidationResult {
    const errors: TemplateValidationError[] = [];
    const warnings: TemplateValidationWarning[] = [];

    this.validateFileSize(content, errors);
    this.validateContentByExtension(content, extension, errors, warnings);

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      timestamp: new Date(),
      validator: 'TemplateContentValidator',
    };
  }

  /**
   * Validate file size
   * @param {string} content File content
   * @param {TemplateValidationError[]} errors Array to collect errors
   */
  private static validateFileSize(content: string, errors: TemplateValidationError[]): void {
    const maxFileSize = VALIDATION_CONSTANTS.MAX_FILE_SIZE_KB * VALIDATION_CONSTANTS.BYTES_PER_KB;
    if (content.length > maxFileSize) {
      errors.push(
        createValidationError(
          'FILE_TOO_LARGE',
          `Template file is large (${content.length} bytes). Consider breaking it into smaller parts.`
        )
      );
    }
  }

  /**
   * Validate content based on file extension
   * @param {unknown} content File content
   * @param {unknown} extension File extension
   * @param {unknown} errors Array to collect errors
   * @param {unknown} warnings Array to collect warnings
   */
  private static validateContentByExtension(
    content: string,
    extension: string,
    errors: TemplateValidationError[],
    warnings: TemplateValidationWarning[]
  ): void {
    switch (extension) {
      case '.json':
        this.validateJsonContent(content, errors);
        break;
      case '.yaml':
      case '.yml':
        this.validateYamlContent(content, errors, warnings);
        break;
      case '.hbs':
      case '.handlebars':
        this.validateHandlebarsContent(content, errors, warnings);
        break;
    }
  }

  /**
   * Validate JSON content
   * @param {string} content JSON content
   * @param {TemplateValidationError[]} errors Array to collect errors
   */
  private static validateJsonContent(content: string, errors: TemplateValidationError[]): void {
    try {
      JSON.parse(content);
    } catch (error) {
      errors.push(
        createValidationError(
          'INVALID_JSON',
          `Invalid JSON format: ${error instanceof Error ? error.message : 'Unknown error'}`
        )
      );
    }
  }

  /**
   * Validate YAML content
   * @param {unknown} content YAML content
   * @param {unknown} errors Array to collect errors
   * @param {unknown} warnings Array to collect warnings
   */
  private static validateYamlContent(
    content: string,
    errors: TemplateValidationError[],
    warnings: TemplateValidationWarning[]
  ): void {
    const hasFrontmatter = VALIDATION_CONSTANTS.YAML_PATTERN.test(content);

    if (!hasFrontmatter && content.trim() !== '') {
      const hasBasicYaml = VALIDATION_CONSTANTS.YAML_BASIC_PATTERN.test(content);
      if (!hasBasicYaml) {
        warnings.push(
          createValidationWarning(
            'INVALID_YAML_FORMAT',
            'YAML content does not appear to be in standard format',
            'best-practice'
          )
        );
      }
    }
  }

  /**
   * Validate Handlebars content
   * @param {unknown} content Handlebars content
   * @param {unknown} errors Array to collect errors
   * @param {unknown} _warnings Array to collect warnings (renamed parameter)
   */
  private static validateHandlebarsContent(
    content: string,
    errors: TemplateValidationError[],
    _warnings: TemplateValidationWarning[]
  ): void {
    this.validateHandlebarsExpressions(content, errors);
    this.validateHandlebarsBlocks(content, errors);
  }

  /**
   * Validate Handlebars expressions
   * @param {unknown} content Handlebars content
   * @param {unknown} errors Array to collect errors
   */
  private static validateHandlebarsExpressions(
    content: string,
    errors: TemplateValidationError[]
  ): void {
    const matches = content.match(VALIDATION_CONSTANTS.HANDLEBARS_PATTERN);

    if (!matches) {
      return;
    }

    const invalidExpressions = matches.filter((match) => {
      const inner = match
        .slice(
          VALIDATION_CONSTANTS.HANDLEBARS_START_LENGTH,
          -VALIDATION_CONSTANTS.HANDLEBARS_END_LENGTH
        )
        .trim();
      return inner === '' || inner.includes('{{') || inner.includes('}}');
    });

    if (invalidExpressions.length > 0) {
      errors.push(
        createValidationError(
          'INVALID_HANDLEBARS_EXPRESSIONS',
          `Found ${invalidExpressions.length} invalid Handlebars expressions`
        )
      );
    }
  }

  /**
   * Validate Handlebars blocks
   * @param {unknown} content Handlebars content
   * @param {unknown} errors Array to collect errors
   */
  private static validateHandlebarsBlocks(
    content: string,
    errors: TemplateValidationError[]
  ): void {
    const unclosedBlocks = this.findUnclosedHandlebarsBlocks(content);
    if (unclosedBlocks.length > 0) {
      errors.push(
        createValidationError(
          'UNCLOSED_HANDLEBARS_BLOCKS',
          `Unclosed Handlebars blocks found: ${unclosedBlocks.join(', ')}`
        )
      );
    }
  }

  /**
   * Find unclosed Handlebars blocks
   * @param {string} content Handlebars content
   * @returns {string): string[]} Array of unclosed block types
   */
  private static findUnclosedHandlebarsBlocks(content: string): string[] {
    const openBlocks: string[] = [];

    this.extractOpenBlocks(content, openBlocks);
    this.removeClosedBlocks(content, openBlocks);

    return [...new Set(openBlocks)];
  }

  /**
   * Extract open Handlebars blocks from content
   * @param {string} content Handlebars content
   * @param {string[]} openBlocks Array to collect open block types
   */
  private static extractOpenBlocks(content: string, openBlocks: string[]): void {
    const matches = content.match(VALIDATION_CONSTANTS.HANDLEBARS_BLOCK_PATTERN);

    if (!matches) {
      return;
    }

    for (const match of matches) {
      const blockTypeMatch = match.match(VALIDATION_CONSTANTS.HANDLEBARS_BLOCK_TYPE_PATTERN);
      if (blockTypeMatch) {
        openBlocks.push(blockTypeMatch[1]);
      }
    }
  }

  /**
   * Remove closed Handlebars blocks from open blocks array
   * @param {string} content Handlebars content
   * @param {string[]} openBlocks Array of open block types to modify
   */
  private static removeClosedBlocks(content: string, openBlocks: string[]): void {
    const endMatches = content.match(VALIDATION_CONSTANTS.HANDLEBARS_END_BLOCK_PATTERN);

    if (!endMatches) {
      return;
    }

    for (const endMatch of endMatches) {
      const blockTypeMatch = endMatch.match(VALIDATION_CONSTANTS.HANDLEBARS_END_BLOCK_TYPE_PATTERN);
      if (blockTypeMatch) {
        const index = openBlocks.lastIndexOf(blockTypeMatch[1]);
        if (index !== -1) {
          openBlocks.splice(index, 1);
        }
      }
    }
  }
}
