/**
 * Utility functions for conditional expressions
 *
 * Provides expression evaluation, validation, and helper creation
 * utilities for complex conditional logic
 */
import Handlebars from 'handlebars';

/**
 * Utility functions for conditional expressions
 */
export class ConditionalUtils {
  /**
   * Evaluate a conditional expression string
   * @param {string} expression - Expression to evaluate (e.g., "a > b && c === 'test'")
   * @param {Record<string} context - Context object with variables
   * @returns {boolean} Evaluation result
   */
  static evaluateExpression(expression: string, context: Record<string, unknown>): boolean {
    try {
      // Check for comparison operators first (highest precedence after !)
      if (expression.includes('>=')) {
        return this.evaluateComparisonExpression(expression, context, '>=');
      } else if (expression.includes('>')) {
        return this.evaluateComparisonExpression(expression, context, '>');
      } else if (expression.includes('<=')) {
        return this.evaluateComparisonExpression(expression, context, '<=');
      } else if (expression.includes('<')) {
        return this.evaluateComparisonExpression(expression, context, '<');
      } else if (expression.includes('!==')) {
        return this.evaluateInequalityExpression(expression, context);
      } else if (expression.includes('===')) {
        return this.evaluateEqualityExpression(expression, context);
      } else if (expression.includes('&&')) {
        return this.evaluateAndExpression(expression, context);
      } else if (expression.includes('||')) {
        return this.evaluateOrExpression(expression, context);
      }

      // Handle simple variable reference
      return Boolean(context[expression]);
    } catch {
      return false;
    }
  }

  /**
   * Create a conditional helper from an expression
   * @param {string} expression - Expression string
   * @returns {unknown[]): string} Handlebars helper function
   */
  static createHelper(expression: string) {
    return function (this: Record<string, unknown>, ...args: unknown[]): string {
      const options = args[args.length - 1] as Handlebars.HelperOptions;
      const context = { ...this, ...(options.data?.root || {}) };

      const result = ConditionalUtils.evaluateExpression(expression, context);
      return result ? options.fn(this) : options.inverse(this);
    };
  }

  /**
   * Evaluates AND expression
   * @param {unknown} expression - AND expression
   * @param {unknown} context - Context variables
   * @returns {boolean} Evaluation result
   */
  private static evaluateAndExpression(
    expression: string,
    context: Record<string, unknown>
  ): boolean {
    const parts = expression.split('&&').map((p) => p.trim());
    return parts.every((part) => this.evaluateExpressionPart(part, context));
  }

  /**
   * Evaluates OR expression
   * @param {unknown} expression - OR expression
   * @param {unknown} context - Context variables
   * @returns {boolean} Evaluation result
   */
  private static evaluateOrExpression(
    expression: string,
    context: Record<string, unknown>
  ): boolean {
    const parts = expression.split('||').map((p) => p.trim());
    return parts.some((part) => this.evaluateExpressionPart(part, context));
  }

  /**
   * Evaluates equality expression
   * @param {unknown} expression - Equality expression
   * @param {unknown} context - Context variables
   * @returns {boolean} Evaluation result
   */
  private static evaluateEqualityExpression(
    expression: string,
    context: Record<string, unknown>
  ): boolean {
    const [left, right] = expression.split('===').map((p) => p.trim());
    return context[left] === context[right];
  }

  /**
   * Evaluates inequality expression
   * @param {unknown} expression - Inequality expression
   * @param {unknown} context - Context variables
   * @returns {boolean} Evaluation result
   */
  private static evaluateInequalityExpression(
    expression: string,
    context: Record<string, unknown>
  ): boolean {
    const [left, right] = expression.split('!==').map((p) => p.trim());
    return context[left] !== context[right];
  }

  /**
   * Evaluates comparison expression
   * @param {unknown} expression - Comparison expression
   * @param {unknown} context - Context variables
   * @param {unknown} operator - Comparison operator
   * @returns {boolean} Evaluation result
   */
  private static evaluateComparisonExpression(
    expression: string,
    context: Record<string, unknown>,
    operator: string
  ): boolean {
    const { leftValue, rightValue } = this.extractComparisonValues(expression, context, operator);
    if (leftValue === null || rightValue === null) return false;

    return this.compareNumbers(leftValue, rightValue, operator);
  }

  /**
   * Extracts numeric values from comparison expression
   * @param {unknown} expression - Comparison expression
   * @param {unknown} context - Context variables
   * @param {unknown} operator - Comparison operator
   * @returns {{ leftValue: number | null; rightValue: number | null }} Extracted values
   */
  private static extractComparisonValues(
    expression: string,
    context: Record<string, unknown>,
    operator: string
  ): { leftValue: number | null; rightValue: number | null } {
    const regex = this.createComparisonRegex(operator);
    if (!regex) return { leftValue: null, rightValue: null };

    const match = expression.match(regex);
    if (!match) return { leftValue: null, rightValue: null };

    const [, left, right] = match;
    const leftValue = this.parseNumericValue(left.trim(), context);
    const rightValue = this.parseNumericValue(right.trim(), context);

    return { leftValue, rightValue };
  }

  /**
   * Creates optimized regex for comparison operator
   * @param {string} operator - Comparison operator
   * @returns {string): RegExp | null} Optimized regex pattern
   */
  private static createComparisonRegex(operator: string): RegExp | null {
    switch (operator) {
      case '>':
        return /^([^\s>]+?)\s*>\s*(\S+)$/;
      case '<':
        return /^([^\s<]+?)\s*<\s*(\S+)$/;
      case '>=':
        return /^([^\s=]+?)\s*>=\s*(\S+)$/;
      case '<=':
        return /^([^\s=]+?)\s*<=\s*(\S+)$/;
      default:
        return null;
    }
  }

  /**
   * Parses numeric value from context or direct value
   * @param {unknown} valueStr - String value to parse
   * @param {unknown} context - Context variables
   * @returns {number | null} Parsed numeric value or null
   */
  private static parseNumericValue(
    valueStr: string,
    context: Record<string, unknown>
  ): number | null {
    if (valueStr in context) {
      const val = Number(context[valueStr]);
      return Number.isNaN(val) ? null : val;
    }
    return Number.isNaN(Number(valueStr)) ? null : Number(valueStr);
  }

  /**
   * Compares two numeric values
   * @param {number} left - Left value
   * @param {number} right - Right value
   * @param {string} operator - Comparison operator
   * @returns { boolean} Comparison result
   */
  private static compareNumbers(left: number, right: number, operator: string): boolean {
    switch (operator) {
      case '>':
        return left > right;
      case '<':
        return left < right;
      case '>=':
        return left >= right;
      case '<=':
        return left <= right;
      default:
        return false;
    }
  }

  /**
   * Evaluates a single expression part
   * @param {string} part - Expression part
   * @param {Record<string} context - Context variables
   * @returns {boolean} Evaluation result
   */
  private static evaluateExpressionPart(part: string, context: Record<string, unknown>): boolean {
    // Handle comparison expressions
    if (part.includes('===')) {
      return this.evaluateEqualityExpression(part, context);
    }
    if (part.includes('!==')) {
      return this.evaluateInequalityExpression(part, context);
    }
    if (part.includes('>')) {
      return this.evaluateComparisonExpression(part, context, '>');
    }
    if (part.includes('<')) {
      return this.evaluateComparisonExpression(part, context, '<');
    }
    if (part.includes('>=')) {
      return this.evaluateComparisonExpression(part, context, '>=');
    }
    if (part.includes('<=')) {
      return this.evaluateComparisonExpression(part, context, '<=');
    }

    // Handle direct boolean/variable reference
    const value = context[part];
    return Boolean(value);
  }

  /**
   * Validate conditional syntax in template
   * @param {string} template - Template content to validate
   * @returns {string):} Validation result
   */
  static validateConditionalSyntax(template: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    this.validateBalancedBlocks(template, errors);
    this.validateNestedBlockSyntax(template, errors);

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates balanced block syntax
   * @param {string} template - Template content
   * @param {string[]} errors - Array to collect errors
   */
  private static validateBalancedBlocks(template: string, errors: string[]): void {
    const blockCounts = this.countBlockTypes(template);

    this.validateBlockBalance('if', blockCounts.if.open, blockCounts.if.close, errors);
    this.validateBlockBalance('unless', blockCounts.unless.open, blockCounts.unless.close, errors);
    this.validateBlockBalance('each', blockCounts.each.open, blockCounts.each.close, errors);
  }

  /**
   * Counts different types of blocks in template
   * @param {string} template - Template content
   * @returns {string):} Object with block counts
   */
  private static countBlockTypes(template: string): {
    if: { open: number; close: number };
    unless: { open: number; close: number };
    each: { open: number; close: number };
  } {
    return {
      if: {
        open: (template.match(/{{#if[^}]*}}/g) || []).length,
        close: (template.match(/{{\/if}}/g) || []).length,
      },
      unless: {
        open: (template.match(/{{#unless[^}]*}}/g) || []).length,
        close: (template.match(/{{\/unless}}/g) || []).length,
      },
      each: {
        open: (template.match(/{{#each[^}]*}}/g) || []).length,
        close: (template.match(/{{\/each}}/g) || []).length,
      },
    };
  }

  /**
   * Validates block balance for a specific block type
   * @param {unknown} blockType - Type of block
   * @param {unknown} openCount - Opening block count
   * @param {unknown} closeCount - Closing block count
   * @param {unknown} errors - Array to collect errors
   */
  private static validateBlockBalance(
    blockType: string,
    openCount: number,
    closeCount: number,
    errors: string[]
  ): void {
    if (openCount !== closeCount) {
      errors.push(`Unbalanced #${blockType} blocks: ${openCount} opening, ${closeCount} closing`);
    }
  }

  /**
   * Validates nested block syntax
   * @param {string} template - Template content
   * @param {string[]} errors - Array to collect errors
   */
  private static validateNestedBlockSyntax(template: string, errors: string[]): void {
    const nestedBlockPattern = /{{(#(if|unless|each))[^}]*}.*{{#\1[^}]*}/gs;
    const invalidNested = template.match(nestedBlockPattern);
    if (invalidNested) {
      errors.push(`Invalid nested block syntax found: ${invalidNested.join(', ')}`);
    }
  }
}
