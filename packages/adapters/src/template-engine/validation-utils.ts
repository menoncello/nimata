/**
 * Template Validation Utilities
 *
 * Provides validation utilities for template context values and rules
 */

/**
 * Constants for validation
 */
const _VALIDATION_CONSTANTS = {
  MAX_NESTED_DEPTH: 10,
  MIN_EMAIL_LENGTH: 5,
  MAX_EMAIL_LENGTH: 254,
  MIN_URL_LENGTH: 7,
} as const;

/**
 * Utility class for validating template context values
 */
export class ValidationUtils {
  /**
   * Validates required fields
   * @param {unknown} value - Value to validate
   * @returns {unknown): boolean} True if valid
   */
  static validateRequired(value: unknown): boolean {
    return value !== undefined && value !== null && value !== '';
  }

  /**
   * Validates string patterns
   * @param {unknown} value - Value to validate
   * @param {unknown} pattern - Regular expression pattern to test against
   * @returns { boolean} True if valid, false if invalid
   */
  static validatePattern(value: unknown, pattern?: RegExp): boolean {
    if (typeof value !== 'string') return false;
    // Avoid potential regex security issues by only allowing known safe patterns
    if (!pattern) return true;

    // Only allow simple, safe patterns
    const patternStr = pattern.source;
    if (
      patternStr.includes('[') ||
      patternStr.includes('(') ||
      patternStr.includes('+') ||
      patternStr.includes('*')
    ) {
      return false; // Reject potentially dangerous patterns
    }

    try {
      return pattern.test(value);
    } catch {
      return false;
    }
  }

  /**
   * Validates string or array length
   * @param {unknown} value - Value to validate
   * @param {{ min?: number; max?: number }} rule - Validation rule
   * @param {number} rule.min - Minimum allowed length
   * @param {number} rule.max - Maximum allowed length
   * @returns {boolean | string} True if valid, error message if invalid
   */
  static validateLength(value: unknown, rule: { min?: number; max?: number }): boolean | string {
    if (typeof value !== 'string' && !Array.isArray(value)) return false;
    const length = value.length;

    if (rule.min !== undefined && length < rule.min) {
      return `Minimum length is ${rule.min}`;
    }
    if (rule.max !== undefined && length > rule.max) {
      return `Maximum length is ${rule.max}`;
    }
    return true;
  }

  /**
   * Validates numeric ranges
   * @param {unknown} value - Value to validate
   * @param {{ min?: number; max?: number }} rule - Validation rule
   * @param {number} rule.min - Minimum allowed value
   * @param {number} rule.max - Maximum allowed value
   * @returns {boolean | string} True if valid, error message if invalid
   */
  static validateRange(value: unknown, rule: { min?: number; max?: number }): boolean | string {
    if (typeof value !== 'number') return false;

    if (rule.min !== undefined && value < rule.min) {
      return `Minimum value is ${rule.min}`;
    }
    if (rule.max !== undefined && value > rule.max) {
      return `Maximum value is ${rule.max}`;
    }
    return true;
  }

  /**
   * Validates using custom validator function
   * @param {unknown} value - Value to validate
   * @param {unknown} validator - Custom validator function
   * @returns {boolean | string} Validation result
   */
  static validateCustom(
    value: unknown,
    validator?: (value: unknown) => boolean | string
  ): boolean | string {
    return validator ? validator(value) : true;
  }

  /**
   * Validates email format
   * @param {string} email - Email string to validate
   * @returns {string): boolean} True if valid email format
   */
  static validateEmail(email: string): boolean {
    // Simple email validation without regex
    if (
      !email ||
      email.length < _VALIDATION_CONSTANTS.MIN_EMAIL_LENGTH ||
      email.length > _VALIDATION_CONSTANTS.MAX_EMAIL_LENGTH
    )
      return false;

    const atIndex = email.indexOf('@');
    if (atIndex <= 0 || atIndex >= email.length - 1) return false;

    const domainPart = email.substring(atIndex + 1);
    if (domainPart.indexOf('.') <= 0 || domainPart.lastIndexOf('.') >= domainPart.length - 1) {
      return false;
    }

    return email.charAt(0) !== '.' && email.charAt(email.length - 1) !== '.';
  }

  /**
   * Validates URL format
   * @param {string} url - URL string to validate
   * @returns {string): boolean} True if valid URL format
   */
  static validateURL(url: string): boolean {
    // Simple URL validation without regex
    if (!url || url.length < _VALIDATION_CONSTANTS.MIN_URL_LENGTH) return false;

    return url.startsWith('http://') || url.startsWith('https://');
  }

  /**
   * Validates string case format (camelCase, snake_case, etc.)
   * @param {string} str - String to validate
   * @returns {string): boolean} True if valid string case format
   */
  static validateStringCase(str: string): boolean {
    // Simple validation to avoid regex performance issues
    const validChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789._-';
    for (const char of str) {
      if (!validChars.includes(char)) {
        return false;
      }
    }
    return str.length > 0;
  }

  /**
   * Applies a single validation rule
   * @param {unknown} value - Value to validate
   * @param {import('@nimata/core'} rule - Validation rule to apply
   * @returns {boolean | string} True if valid, error message if invalid
   */
  static applyValidationRule(
    value: unknown,
    rule: import('@nimata/core').ValidationRule
  ): boolean | string {
    switch (rule.type) {
      case 'required':
        return this.validateRequired(value);
      case 'pattern':
        return this.validatePattern(value, rule.pattern);
      case 'length':
        return this.validateLength(value, rule);
      case 'range':
        return this.validateRange(value, rule);
      case 'custom':
        return this.validateCustom(value, rule.validator);
      default:
        return true;
    }
  }
}
