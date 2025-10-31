/**
 * String-based conditional helpers for Handlebars
 *
 * Provides conditional logic helpers for string operations including
 * comparisons, pattern matching, and length checks
 */
import Handlebars from 'handlebars';

type HandlebarsInstance = typeof Handlebars;

/**
 * String conditional helpers for Handlebars templates
 */
export class StringConditionalHelpers {
  /**
   * Register all string-based conditional helpers with Handlebars instance
   * @param {HandlebarsInstance} handlebars - Handlebars instance
   */
  static registerAll(handlebars: HandlebarsInstance): void {
    this.registerBasicStringHelpers(handlebars);
    this.registerStringPatternHelpers(handlebars);
    this.registerStringLengthHelpers(handlebars);
  }

  /**
   * Register basic string comparison helpers
   * @param {HandlebarsInstance} handlebars - Handlebars instance
   */
  private static registerBasicStringHelpers(handlebars: HandlebarsInstance): void {
    // Case-insensitive string comparison
    handlebars.registerHelper(
      'ifEqualsIgnoreCase',
      (str1: string, str2: string, options: Handlebars.HelperOptions): string => {
        return String(str1).toLowerCase() === String(str2).toLowerCase()
          ? options.fn(this)
          : options.inverse(this);
      }
    );

    // String contains check
    handlebars.registerHelper(
      'ifContains',
      (str: string, substring: string, options: Handlebars.HelperOptions): string => {
        return String(str).includes(String(substring)) ? options.fn(this) : options.inverse(this);
      }
    );

    // String starts with check
    handlebars.registerHelper(
      'ifStartsWith',
      (str: string, prefix: string, options: Handlebars.HelperOptions): string => {
        return String(str).startsWith(String(prefix)) ? options.fn(this) : options.inverse(this);
      }
    );

    // String ends with check
    handlebars.registerHelper(
      'ifEndsWith',
      (str: string, suffix: string, options: Handlebars.HelperOptions): string => {
        return String(str).endsWith(String(suffix)) ? options.fn(this) : options.inverse(this);
      }
    );
  }

  /**
   * Register string pattern matching helpers
   * @param {HandlebarsInstance} handlebars - Handlebars instance
   */
  private static registerStringPatternHelpers(handlebars: HandlebarsInstance): void {
    // String matches regex
    handlebars.registerHelper(
      'ifMatches',
      (str: string, pattern: string, options: Handlebars.HelperOptions): string => {
        try {
          const regex = new RegExp(pattern);
          return regex.test(String(str)) ? options.fn(this) : options.inverse(this);
        } catch {
          return options.inverse(this);
        }
      }
    );
  }

  /**
   * Register string length comparison helpers
   * @param {HandlebarsInstance} handlebars - Handlebars instance
   */
  private static registerStringLengthHelpers(handlebars: HandlebarsInstance): void {
    // String length comparison
    handlebars.registerHelper(
      'ifLength',
      (
        str: string,
        operator: string,
        length: number,
        options: Handlebars.HelperOptions
      ): string => {
        return this.evaluateLengthComparison(String(str).length, operator, length)
          ? options.fn(this)
          : options.inverse(this);
      }
    );
  }

  /**
   * Evaluates length comparison
   * @param {unknown} strLength - String length
   * @param {unknown} operator - Comparison operator
   * @param {unknown} targetLength - Target length
   * @returns {boolean} Comparison result
   */
  private static evaluateLengthComparison(
    strLength: number,
    operator: string,
    targetLength: number
  ): boolean {
    if (this.isEqualityOperator(operator)) {
      return strLength === targetLength;
    }

    if (this.isInequalityOperator(operator)) {
      return strLength !== targetLength;
    }

    if (this.isGreaterThanOperator(operator)) {
      return strLength > targetLength;
    }

    if (this.isGreaterThanOrEqualOperator(operator)) {
      return strLength >= targetLength;
    }

    if (this.isLessThanOperator(operator)) {
      return strLength < targetLength;
    }

    if (this.isLessThanOrEqualOperator(operator)) {
      return strLength <= targetLength;
    }

    return false;
  }

  /**
   * Checks if operator is an equality operator
   * @param {string} operator - Operator to check
   * @returns {string): boolean} True if equality operator
   */
  private static isEqualityOperator(operator: string): boolean {
    return operator === 'eq' || operator === '==' || operator === '===';
  }

  /**
   * Checks if operator is an inequality operator
   * @param {string} operator - Operator to check
   * @returns {string): boolean} True if inequality operator
   */
  private static isInequalityOperator(operator: string): boolean {
    return operator === 'ne' || operator === '!=' || operator === '!==';
  }

  /**
   * Checks if operator is a greater than operator
   * @param {string} operator - Operator to check
   * @returns {string): boolean} True if greater than operator
   */
  private static isGreaterThanOperator(operator: string): boolean {
    return operator === 'gt' || operator === '>';
  }

  /**
   * Checks if operator is a greater than or equal operator
   * @param {string} operator - Operator to check
   * @returns {string): boolean} True if greater than or equal operator
   */
  private static isGreaterThanOrEqualOperator(operator: string): boolean {
    return operator === 'gte' || operator === '>=';
  }

  /**
   * Checks if operator is a less than operator
   * @param {string} operator - Operator to check
   * @returns {string): boolean} True if less than operator
   */
  private static isLessThanOperator(operator: string): boolean {
    return operator === 'lt' || operator === '<';
  }

  /**
   * Checks if operator is a less than or equal operator
   * @param {string} operator - Operator to check
   * @returns {string): boolean} True if less than or equal operator
   */
  private static isLessThanOrEqualOperator(operator: string): boolean {
    return operator === 'lte' || operator === '<=';
  }
}
