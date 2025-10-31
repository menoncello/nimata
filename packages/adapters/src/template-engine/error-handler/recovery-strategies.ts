/**
 * Recovery Strategies for Template Error Handler
 */
import {
  ErrorSeverity,
  ErrorCategory,
  type TemplateError,
  type ErrorRecoveryStrategy,
} from './types.js';

/**
 * Determines recovery strategy for template errors
 * @param {unknown} errors The template errors to analyze
 * @param {unknown} content The template content to check
 * @returns {ErrorRecoveryStrategy} The recovery strategy to use
 */
export function determineRecoveryStrategy(
  errors: TemplateError[],
  content: string
): ErrorRecoveryStrategy {
  const criticalErrors = errors.filter((e) => e.severity === ErrorSeverity.CRITICAL);
  const syntaxErrors = errors.filter((e) => e.category === ErrorCategory.SYNTAX);

  if (criticalErrors.length > 0) {
    return createAbortStrategy();
  }

  if (syntaxErrors.length > 0) {
    return createSkipStrategy();
  }

  // For non-critical errors, attempt to fix automatically
  const fixedContent = attemptAutoFix(content, errors);

  return createFixOrSkipStrategy(fixedContent === content, fixedContent);
}

/**
 * Creates an abort recovery strategy
 * @returns {ErrorRecoveryStrategy} Abort strategy for critical errors
 */
function createAbortStrategy(): ErrorRecoveryStrategy {
  return {
    canRecover: false,
    strategy: 'abort',
    manualInterventionRequired: true,
  };
}

/**
 * Creates a skip recovery strategy
 * @returns {ErrorRecoveryStrategy} Skip strategy for syntax errors
 */
function createSkipStrategy(): ErrorRecoveryStrategy {
  return {
    canRecover: true,
    strategy: 'skip',
    manualInterventionRequired: true,
  };
}

/**
 * Creates a fix or skip recovery strategy
 * @param {boolean} needsSkip Whether to skip or fix
 * @param {string} fixedContent The fixed content
 * @returns { ErrorRecoveryStrategy} Fix or skip strategy
 */
function createFixOrSkipStrategy(needsSkip: boolean, fixedContent: string): ErrorRecoveryStrategy {
  return {
    canRecover: true,
    strategy: needsSkip ? 'skip' : 'fix',
    recoveredContent: fixedContent,
    fallbackUsed: fixedContent !== '',
    manualInterventionRequired: false,
  };
}

/**
 * Attempts automatic fixes for template errors
 * @param {string} content The template content to fix
 * @param {TemplateError[]} errors The template errors to fix
 * @returns { string} The fixed template content
 */
export function attemptAutoFix(content: string, errors: TemplateError[]): string {
  let fixedContent = content;

  for (const error of errors) {
    switch (error.code) {
      case 'UNBALANCED_BRACES':
        fixedContent = fixUnbalancedBraces(fixedContent);
        break;

      case 'EMPTY_TEMPLATE':
        fixedContent = fixEmptyTemplate();
        break;

      // Add more auto-fixes as needed
    }
  }

  return fixedContent;
}

/**
 * Fixes unbalanced braces in template content
 * @param {string} content The content with unbalanced braces
 * @returns {string): string} Content with balanced braces
 */
function fixUnbalancedBraces(content: string): string {
  const openCount = (content.match(/{{/g) || []).length;
  const closeCount = (content.match(/}}/g) || []).length;
  const diff = openCount - closeCount;

  if (diff > 0) {
    return content + '}}'.repeat(diff);
  } else if (diff < 0) {
    return '{{'.repeat(Math.abs(diff)) + content;
  }

  return content;
}

/**
 * Fixes empty template by adding minimal content
 * @returns {string} Minimal template content
 */
function fixEmptyTemplate(): string {
  return '<!-- Auto-generated empty template -->\n{{!-- Add your template content here --}}';
}
