/**
 * Validation Rules for Template Error Handler
 */
import type { TemplateMetadata } from '@nimata/core';
import { MAX_TEMPLATE_SIZE, MAX_DEPTH_NESTING, MAX_ERRORS_REPORTED } from './constants.js';
import { ErrorCategory, ErrorSeverity, type TemplateError } from './types.js';

/**
 * Creates a syntax validation rule for JSON
 * @returns Function that validates JSON syntax
 */
export function createJsonSyntaxRule() {
  return (content: string): TemplateError[] => {
    const errors: TemplateError[] = [];

    if (content.trim().startsWith('{') && content.trim().endsWith('}')) {
      try {
        JSON.parse(content);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Invalid JSON';
        const match = message.match(/line (\d+)/);
        const line = match ? Number.parseInt(match[1]) : undefined;

        errors.push({
          code: 'JSON_SYNTAX_ERROR',
          message: `JSON syntax error: ${message}`,
          severity: ErrorSeverity.ERROR,
          category: ErrorCategory.SYNTAX,
          context: { line },
          suggestion: 'Fix JSON syntax errors',
          fixes: [
            'Check for missing commas',
            'Balance brackets and braces',
            'Escape quotes properly',
          ],
        });
      }
    }

    return errors;
  };
}

/**
 * Validates Handlebars brace balance
 * @param content - Template content to check
 * @returns Array of brace-related errors
 */
function validateHandlebarsBraces(content: string): TemplateError[] {
  const errors: TemplateError[] = [];
  const openBraces = (content.match(/{{/g) || []).length;
  const closeBraces = (content.match(/}}/g) || []).length;

  if (openBraces !== closeBraces) {
    errors.push({
      code: 'UNBALANCED_BRACES',
      message: `Unbalanced Handlebars braces: ${openBraces} opening, ${closeBraces} closing`,
      severity: ErrorSeverity.ERROR,
      category: ErrorCategory.SYNTAX,
      suggestion: 'Balance all Handlebars braces',
      fixes: [
        'Add missing closing braces',
        'Remove extra opening braces',
        'Check nested expressions',
      ],
    });
  }

  return errors;
}

/**
 * Validates Handlebars helper syntax
 * @param content - Template content to check
 * @returns Array of helper-related errors
 */
function validateHandlebarsHelpers(content: string): TemplateError[] {
  const invalidHelpers = findInvalidHelperLines(content);
  return createIncompleteHelperErrors(invalidHelpers);
}

/**
 * Finds lines with invalid Handlebars helper syntax
 * @param content - Template content to check
 * @returns Array of invalid helper lines
 */
function findInvalidHelperLines(content: string): string[] {
  const lines = content.split('\n');
  const invalidHelpers: string[] = [];

  for (const line of lines) {
    const trimmedLine = line.trim();
    // Check for patterns that start with {{ but don't have closing }} and are helpers (# or /)
    if (
      trimmedLine.includes('{{') &&
      !trimmedLine.includes('}}') &&
      (trimmedLine.includes('{{#') || trimmedLine.includes('{{/'))
    ) {
      invalidHelpers.push(trimmedLine);
    }
  }

  return invalidHelpers;
}

/**
 * Creates error objects for invalid helper lines
 * @param invalidHelpers - Array of invalid helper lines
 * @returns Array of template error objects
 */
function createIncompleteHelperErrors(invalidHelpers: string[]): TemplateError[] {
  const errors: TemplateError[] = [];

  for (const [i, invalidHelper] of invalidHelpers.entries()) {
    const line = i + 1;
    errors.push({
      code: 'INCOMPLETE_HELPER',
      message: 'Incomplete Handlebars helper expression',
      severity: ErrorSeverity.ERROR,
      category: ErrorCategory.SYNTAX,
      context: { line, snippet: invalidHelper },
      suggestion: 'Complete the helper expression or remove it',
      fixes: [
        'Add missing closing braces',
        'Complete helper arguments',
        'Remove incomplete expression',
      ],
    });
  }

  return errors;
}

/**
 * Creates a syntax validation rule for Handlebars
 * @returns Function that validates Handlebars syntax
 */
export function createHandlebarsSyntaxRule() {
  return (content: string): TemplateError[] => {
    const errors: TemplateError[] = [];

    errors.push(...validateHandlebarsBraces(content));
    errors.push(...validateHandlebarsHelpers(content));

    return errors;
  };
}

/**
 * Validates template name in metadata
 * @param metadata - Template metadata to validate
 * @returns Array of name-related errors
 */
function validateTemplateName(metadata?: TemplateMetadata): TemplateError[] {
  const errors: TemplateError[] = [];

  if (metadata && !metadata.name) {
    errors.push({
      code: 'MISSING_TEMPLATE_NAME',
      message: 'Template name is required',
      severity: ErrorSeverity.ERROR,
      category: ErrorCategory.STRUCTURE,
      suggestion: 'Add a name to the template metadata',
      fixes: ['Add name field to template metadata', 'Use filename as template name'],
    });
  }

  return errors;
}

/**
 * validates project types in metadata
 * @param metadata - Template metadata to validate
 * @returns Array of project type-related errors
 */
function validateProjectTypes(metadata?: TemplateMetadata): TemplateError[] {
  const errors: TemplateError[] = [];

  if (
    (metadata && !metadata.supportedProjectTypes) ||
    metadata.supportedProjectTypes.length === 0
  ) {
    errors.push({
      code: 'MISSING_PROJECT_TYPES',
      message: 'Template must specify supported project types',
      severity: ErrorSeverity.WARNING,
      category: ErrorCategory.STRUCTURE,
      suggestion: 'Add supported project types to template metadata',
      fixes: ['Add supportedProjectTypes array to metadata', 'Specify at least one project type'],
    });
  }

  return errors;
}

/**
 * Creates a structure validation rule
 * @returns Function that validates template structure
 */
export function createStructureRule() {
  return (content: string, metadata?: TemplateMetadata): TemplateError[] => {
    const errors: TemplateError[] = [];

    errors.push(...validateTemplateName(metadata));
    errors.push(...validateProjectTypes(metadata));

    return errors;
  };
}

/**
 * Creates a content validation rule
 * @returns Function that validates template content
 */
export function createContentRule() {
  return (content: string): TemplateError[] => {
    const errors: TemplateError[] = [];

    // Check for empty templates
    if (content.trim().length === 0) {
      errors.push({
        code: 'EMPTY_TEMPLATE',
        message: 'Template content is empty',
        severity: ErrorSeverity.CRITICAL,
        category: ErrorCategory.CONTENT,
        suggestion: 'Add content to the template',
        fixes: ['Add template content', 'Remove empty template file'],
      });
    }

    // Check for suspicious patterns
    if (content.includes('TODO') || content.includes('FIXME')) {
      errors.push({
        code: 'INCOMPLETE_TEMPLATE',
        message: 'Template contains TODO or FIXME comments',
        severity: ErrorSeverity.WARNING,
        category: ErrorCategory.CONTENT,
        suggestion: 'Complete the template implementation',
        fixes: ['Implement TODO items', 'Remove placeholder comments'],
      });
    }

    return errors;
  };
}

/**
 * Creates a dependency validation rule
 * @returns Function that validates template dependencies
 */
export function createDependencyRule() {
  return (content: string, metadata?: TemplateMetadata): TemplateError[] => {
    const errors: TemplateError[] = [];

    // Check for circular dependencies
    if (metadata && metadata.dependencies) {
      for (const dependency of metadata.dependencies) {
        if (dependency === metadata.id) {
          errors.push({
            code: 'CIRCULAR_DEPENDENCY',
            message: `Template depends on itself: ${dependency}`,
            severity: ErrorSeverity.CRITICAL,
            category: ErrorCategory.DEPENDENCY,
            context: { templateId: metadata.id },
            suggestion: 'Remove circular dependency',
            fixes: ['Remove self-dependency', 'Refactor template structure'],
          });
        }
      }
    }

    return errors;
  };
}

/**
 * Validates template size
 * @param content - Template content to validate
 * @returns Array of size-related errors
 */
function validateTemplateSize(content: string): TemplateError[] {
  const errors: TemplateError[] = [];

  // Check for large templates
  const contentSize = Buffer.byteLength(content, 'utf8');
  if (contentSize > MAX_TEMPLATE_SIZE * MAX_TEMPLATE_SIZE) {
    // 1MB
    errors.push({
      code: 'LARGE_TEMPLATE',
      message: `Template is very large: ${(contentSize / MAX_TEMPLATE_SIZE / MAX_TEMPLATE_SIZE).toFixed(MAX_DEPTH_NESTING)}MB`,
      severity: ErrorSeverity.WARNING,
      category: ErrorCategory.PERFORMANCE,
      suggestion: 'Consider breaking down large templates',
      fixes: [
        'Split into smaller templates',
        'Use partials for reusable sections',
        'Remove unnecessary content',
      ],
    });
  }

  return errors;
}

/**
 * Validates template nesting depth
 * @param content - Template content to validate
 * @returns Array of nesting-related errors
 */
function validateTemplateNesting(content: string): TemplateError[] {
  const errors: TemplateError[] = [];

  // Check for deeply nested loops
  const nestedEach = (content.match(/{{#each/g) || []).length;
  if (nestedEach > MAX_ERRORS_REPORTED) {
    errors.push({
      code: 'DEEP_NESTING',
      message: `Template has deeply nested loops: ${nestedEach} levels`,
      severity: ErrorSeverity.WARNING,
      category: ErrorCategory.PERFORMANCE,
      suggestion: 'Reduce nesting depth for better performance',
      fixes: [
        'Flatten nested structures',
        'Use helpers instead of deep nesting',
        'Optimize data structure',
      ],
    });
  }

  return errors;
}

/**
 * Creates a performance validation rule
 * @returns Function that validates template performance
 */
export function createPerformanceRule() {
  return (content: string): TemplateError[] => {
    const errors: TemplateError[] = [];

    errors.push(...validateTemplateSize(content));
    errors.push(...validateTemplateNesting(content));

    return errors;
  };
}

/**
 * Creates a security validation rule
 * @returns Function that validates template security
 */
export function createSecurityRule() {
  return (content: string): TemplateError[] => {
    const errors: TemplateError[] = [];

    // Check for potential security issues
    const dangerousPatterns = [
      { pattern: /eval\s*\(/, name: 'eval()', issue: 'Code execution' },
      { pattern: /Function\s*\(/, name: 'Function()', issue: 'Code execution' },
      { pattern: /document\.write/, name: 'document.write', issue: 'XSS vulnerability' },
      { pattern: /innerHTML\s*=/, name: 'innerHTML', issue: 'XSS vulnerability' },
    ];

    for (const { pattern, name, issue } of dangerousPatterns) {
      if (pattern.test(content)) {
        errors.push({
          code: 'SECURITY_RISK',
          message: `Template contains potentially dangerous ${name}: ${issue}`,
          severity: ErrorSeverity.WARNING,
          category: ErrorCategory.SECURITY,
          suggestion: 'Remove or sanitize dangerous code',
          fixes: [
            'Remove dangerous code',
            'Use safer alternatives',
            'Implement proper sanitization',
          ],
        });
      }
    }

    return errors;
  };
}

/**
 * Creates a compatibility validation rule
 * @returns Function that validates template compatibility
 */
export function createCompatibilityRule() {
  return (content: string): TemplateError[] => {
    const errors: TemplateError[] = [];

    // Check for deprecated Handlebars syntax
    if (content.includes('{{each }}')) {
      errors.push({
        code: 'DEPRECATED_SYNTAX',
        message: 'Template uses deprecated Handlebars syntax',
        severity: ErrorSeverity.WARNING,
        category: ErrorCategory.COMPATIBILITY,
        suggestion: 'Update to modern Handlebars syntax',
        fixes: [
          'Update {{each}} syntax',
          'Use modern helper syntax',
          'Check Handlebars documentation',
        ],
      });
    }

    return errors;
  };
}
