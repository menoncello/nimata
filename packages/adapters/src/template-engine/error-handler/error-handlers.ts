/**
 * Error Handlers for Template Error Handler
 */
import { SNIPPET_MAX_LENGTH } from './constants.js';
import {
  ErrorSeverity,
  ErrorCategory,
  type TemplateError,
  type TemplateErrorContext,
} from './types.js';

/**
 * Handles template loading errors
 * @param {string} filePath - Path to the template file
 * @param {Error} error - Original error that occurred
 * @returns { TemplateError} Enhanced template error with context
 */
export function handleLoadingError(filePath: string, error: Error): TemplateError {
  const context: TemplateErrorContext = {
    filePath,
    snippet: `Failed to load template from ${filePath}`,
  };

  if (error.message.includes('ENOENT')) {
    return createTemplateNotFoundError(filePath, context);
  }

  if (error.message.includes('EACCES')) {
    return createTemplatePermissionError(filePath, context);
  }

  return createGenericLoadError(filePath, error, context);
}

/**
 * Creates a template not found error
 * @param {unknown} filePath - Path to the template file
 * @param {unknown} context - Error context
 * @returns {TemplateError} Template error for missing file
 */
function createTemplateNotFoundError(
  filePath: string,
  context: TemplateErrorContext
): TemplateError {
  return {
    code: 'TEMPLATE_NOT_FOUND',
    message: `Template file not found: ${filePath}`,
    severity: ErrorSeverity.CRITICAL,
    category: ErrorCategory.SYNTAX,
    context,
    suggestion: 'Check if the template file exists and the path is correct',
    fixes: [
      'Create the missing template file',
      'Update the template path to an existing file',
      'Check file permissions',
    ],
    documentation: 'https://docs.nimata.dev/templates/troubleshooting#file-not-found',
  };
}

/**
 * Creates a template permission error
 * @param {unknown} filePath - Path to the template file
 * @param {unknown} context - Error context
 * @returns {TemplateError} Template error for permission issues
 */
function createTemplatePermissionError(
  filePath: string,
  context: TemplateErrorContext
): TemplateError {
  return {
    code: 'TEMPLATE_PERMISSION_DENIED',
    message: `Permission denied accessing template: ${filePath}`,
    severity: ErrorSeverity.CRITICAL,
    category: ErrorCategory.SYNTAX,
    context,
    suggestion: 'Check file permissions and ensure the process can read the file',
    fixes: [
      'Update file permissions',
      'Run with appropriate user privileges',
      'Move template to accessible location',
    ],
  };
}

/**
 * Creates a generic template load error
 * @param {unknown} filePath - Path to the template file
 * @param {unknown} error - Original error
 * @param {unknown} context - Error context
 * @returns {TemplateError} Generic template load error
 */
function createGenericLoadError(
  filePath: string,
  error: Error,
  context: TemplateErrorContext
): TemplateError {
  return {
    code: 'TEMPLATE_LOAD_ERROR',
    message: `Failed to load template: ${error.message}`,
    severity: ErrorSeverity.CRITICAL,
    category: ErrorCategory.SYNTAX,
    context,
    suggestion: 'Check the template file format and encoding',
  };
}

/**
 * Handles template parsing errors
 * @param {unknown} content - Template content that failed to parse
 * @param {unknown} error - Original parsing error
 * @param {unknown} filePath - Optional file path where error occurred
 * @returns {TemplateError} Enhanced template error with parsing context
 */
export function handleParsingError(
  content: string,
  error: Error,
  filePath?: string
): TemplateError {
  const context: TemplateErrorContext = {
    filePath,
    snippet:
      content.length > SNIPPET_MAX_LENGTH ? `${content.slice(0, SNIPPET_MAX_LENGTH)}...` : content,
  };

  if (error.message.includes('Unexpected token')) {
    return createJsonSyntaxError(error, context);
  }

  if (error.message.includes('Handlebars')) {
    return createHandlebarsSyntaxError(error, context);
  }

  return createGenericParseError(error, context);
}

/**
 * Creates a JSON syntax error
 * @param {Error} error - Original error
 * @param {TemplateErrorContext} context - Error context
 * @returns { TemplateError} JSON syntax error
 */
function createJsonSyntaxError(error: Error, context: TemplateErrorContext): TemplateError {
  return {
    code: 'INVALID_JSON_SYNTAX',
    message: `Invalid JSON syntax: ${error.message}`,
    severity: ErrorSeverity.ERROR,
    category: ErrorCategory.SYNTAX,
    context,
    suggestion: 'Fix the JSON syntax errors in the template',
    fixes: [
      'Use a JSON validator to check syntax',
      'Check for missing commas, brackets, or quotes',
      'Escape special characters properly',
    ],
  };
}

/**
 * Creates a Handlebars syntax error
 * @param {Error} error - Original error
 * @param {TemplateErrorContext} context - Error context
 * @returns { TemplateError} Handlebars syntax error
 */
function createHandlebarsSyntaxError(error: Error, context: TemplateErrorContext): TemplateError {
  return {
    code: 'INVALID_HANDLEBARS_SYNTAX',
    message: `Invalid Handlebars syntax: ${error.message}`,
    severity: ErrorSeverity.ERROR,
    category: ErrorCategory.SYNTAX,
    context,
    suggestion: 'Fix the Handlebars syntax errors in the template',
    fixes: [
      'Check for balanced braces {{ }}',
      'Verify helper names and arguments',
      'Ensure proper closing tags {{/helper}}',
    ],
    documentation: 'https://handlebarsjs.com/guide/',
  };
}

/**
 * Creates a generic parsing error
 * @param {Error} error - Original error
 * @param {TemplateErrorContext} context - Error context
 * @returns { TemplateError} Generic parsing error
 */
function createGenericParseError(error: Error, context: TemplateErrorContext): TemplateError {
  return {
    code: 'TEMPLATE_PARSE_ERROR',
    message: `Failed to parse template: ${error.message}`,
    severity: ErrorSeverity.ERROR,
    category: ErrorCategory.SYNTAX,
    context,
    suggestion: 'Check the template file format and content',
  };
}

/**
 * Handles template rendering errors
 * @param {unknown} templateId - ID of the template that failed to render
 * @param {unknown} error - Original rendering error
 * @param {unknown} _context - Optional rendering context data
 * @returns {TemplateError} Enhanced template error with rendering context
 */
export function handleRenderingError(
  templateId: string,
  error: Error,
  _context?: Record<string, unknown>
): TemplateError {
  const errorContext: TemplateErrorContext = {
    templateId,
    expression: error.message,
  };

  if (error.message.includes('undefined')) {
    return createUndefinedVariableError(error, errorContext);
  }

  if (error.message.includes('helper')) {
    return createUnknownHelperError(error, errorContext);
  }

  return createGenericRenderError(error, errorContext);
}

/**
 * Creates an undefined variable error
 * @param {unknown} error - Original error
 * @param {unknown} errorContext - Error context
 * @returns {TemplateError} Undefined variable error
 */
function createUndefinedVariableError(
  error: Error,
  errorContext: TemplateErrorContext
): TemplateError {
  const match = error.message.match(/"([^"]+)"/);
  const variableName = match ? match[1] : 'unknown';

  return {
    code: 'UNDEFINED_VARIABLE',
    message: `Undefined variable used in template: ${variableName}`,
    severity: ErrorSeverity.ERROR,
    category: ErrorCategory.CONTENT,
    context: errorContext,
    suggestion: `Provide a value for the '${variableName}' variable or add a conditional check`,
    fixes: [
      `Add ${variableName} to the template context`,
      `Use {{#if ${variableName}}} to conditionally render`,
      `Provide a default value: ${variableName} || 'default'`,
    ],
  };
}

/**
 * Creates an unknown helper error
 * @param {Error} error - Original error
 * @param {TemplateErrorContext} errorContext - Error context
 * @returns { TemplateError} Unknown helper error
 */
function createUnknownHelperError(error: Error, errorContext: TemplateErrorContext): TemplateError {
  return {
    code: 'UNKNOWN_HELPER',
    message: `Unknown helper function: ${error.message}`,
    severity: ErrorSeverity.ERROR,
    category: ErrorCategory.CONTENT,
    context: errorContext,
    suggestion: 'Register the missing helper function or use a different helper',
    fixes: [
      'Register the custom helper before rendering',
      'Use a built-in helper instead',
      'Check helper name spelling',
    ],
  };
}

/**
 * Creates a generic rendering error
 * @param {Error} error - Original error
 * @param {TemplateErrorContext} errorContext - Error context
 * @returns { TemplateError} Generic rendering error
 */
function createGenericRenderError(error: Error, errorContext: TemplateErrorContext): TemplateError {
  return {
    code: 'TEMPLATE_RENDER_ERROR',
    message: `Failed to render template: ${error.message}`,
    severity: ErrorSeverity.ERROR,
    category: ErrorCategory.CONTENT,
    context: errorContext,
    suggestion: 'Check the template context and helper functions',
  };
}
