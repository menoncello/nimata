/**
 * String Transformers Implementation
 *
 * This module provides a comprehensive set of string transformation utilities
 * designed specifically for template context generation. It includes methods for
 * case conversion, formatting, validation, and sanitization of strings used
 * throughout the template engine system.
 */

/**
 * Constants for string transformations
 *
 * Contains predefined constant values used throughout the string transformers.
 * These constants ensure consistency and provide maintainable configuration
 * for default behaviors and settings.
 */
const _STRING_CONSTANTS = {
  /** Default case transformation to apply when no specific case is specified */
  DEFAULT_CASE: 'lowercase',
} as const;

/**
 * String transformers implementation
 *
 * A utility class providing static methods for various string transformation operations.
 * All methods are static and can be called directly without instantiating the class.
 * This class serves as a centralized library for all string manipulation needs
 * within the template engine system.
 */
export class StringTransformersImpl {
  /**
   * Converts a string to lowercase
   *
   * Transforms all alphabetic characters in the input string to their lowercase
   * equivalents while leaving non-alphabetic characters unchanged.
   *
   * @param {string} str - The input string to convert to lowercase
   * @returns {string): string} A new string with all characters converted to lowercase
   */
  static toLowerCase(str: string): string {
    return str.toLowerCase();
  }

  /**
   * Converts a string to uppercase
   *
   * Transforms all alphabetic characters in the input string to their uppercase
   * equivalents while leaving non-alphabetic characters unchanged.
   *
   * @param {string} str - The input string to convert to uppercase
   * @returns {string): string} A new string with all characters converted to uppercase
   */
  static toUpperCase(str: string): string {
    return str.toUpperCase();
  }

  /**
   * Converts a string to camelCase
   *
   * Transforms the input string to camelCase format where the first word is lowercase
   * and subsequent words have their first letter capitalized. Spaces and word boundaries
   * are removed to create a continuous identifier.
   *
   * @param {string} str - The input string to convert to camelCase
   * @returns {string): string} The camelCase version of the input string
   */
  static toCamelCase(str: string): string {
    return (
      str
        // Replace hyphens and underscores with spaces
        .replace(/[_-]/g, ' ')
        // Remove special characters (keep only alphanumeric and spaces)
        .replace(/[^\d\sA-Za-z]/g, '')
        // Convert first character to lowercase and capitalize first letter of each word
        .replace(/(^|\s)([a-z])/g, (match, space, letter, index) => {
          return index === 0 ? letter.toLowerCase() : letter.toUpperCase();
        })
        // Remove spaces
        .replace(/\s+/g, '')
        // Handle camelCase already (lowercase first letter if string starts with uppercase)
        .replace(/^([A-Z])/, (match, letter) => letter.toLowerCase())
    );
  }

  /**
   * Converts a string to PascalCase
   *
   * Transforms the input string to PascalCase format where each word has its first
   * letter capitalized and all subsequent letters are lowercase. Spaces and word
   * boundaries are removed to create a continuous identifier.
   *
   * @param {string} str - The input string to convert to PascalCase
   * @returns {string): string} The PascalCase version of the input string
   */
  static toPascalCase(str: string): string {
    return (
      str
        // Replace hyphens and underscores with spaces
        .replace(/[_-]/g, ' ')
        // Capitalize first letter of each word
        .replace(/(^|\s)([a-z])/g, (match, space, letter) => {
          return letter.toUpperCase();
        })
        // Handle words that already start with uppercase
        .replace(/(\s)([a-z])/g, (match, space, letter) => {
          return space + letter.toUpperCase();
        })
        // Remove spaces
        .replace(/\s+/g, '')
    );
  }

  /**
   * Converts a string to kebab-case
   *
   * Transforms the input string to kebab-case format where words are separated by
   * hyphens and all letters are lowercase. This format is commonly used for URLs
   * and CSS class names.
   *
   * @param {string} str - The input string to convert to kebab-case
   * @returns {string): string} The kebab-case version of the input string
   */
  static toKebabCase(str: string): string {
    const result = str
      // Replace underscores with hyphens and handle camelCase boundaries
      .replace(/_/g, '-')
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      // Replace spaces with hyphens
      .replace(/\s+/g, '-')
      // Remove special characters (keep only alphanumeric and hyphens)
      .replace(/[^\dA-Za-z-]/g, '')
      // Convert to lowercase
      .toLowerCase();

    // Remove leading/trailing hyphens (manual approach to avoid regex complexity)
    let start = 0;
    let end = result.length;

    // Find first non-hyphen character
    while (start < end && result[start] === '-') {
      start++;
    }

    // Find last non-hyphen character
    while (end > start && result[end - 1] === '-') {
      end--;
    }

    return result.slice(start, end);
  }

  /**
   * Converts a string to snake_case
   *
   * Transforms the input string to snake_case format where words are separated by
   * underscores and all letters are lowercase. This format is commonly used for
   * variable names and database identifiers.
   *
   * @param {string} str - The input string to convert to snake_case
   * @returns {string): string} The snake_case version of the input string
   */
  static toSnakeCase(str: string): string {
    const result = str
      // Replace hyphens with underscores and handle camelCase boundaries
      .replace(/-/g, '_')
      .replace(/([a-z])([A-Z])/g, '$1_$2')
      // Replace spaces with underscores
      .replace(/\s+/g, '_')
      // Remove special characters (keep only alphanumeric and underscores)
      .replace(/\W/g, '')
      // Convert to lowercase
      .toLowerCase();

    // Remove leading/trailing underscores (manual approach to avoid regex complexity)
    let start = 0;
    let end = result.length;

    // Find first non-underscore character
    while (start < end && result[start] === '_') {
      start++;
    }

    // Find last non-underscore character
    while (end > start && result[end - 1] === '_') {
      end--;
    }

    return result.slice(start, end);
  }

  /**
   * Converts string to Title Case
   * @param {string} str - The string to convert
   * @returns {string): string} The Title Case string
   */
  static toTitleCase(str: string): string {
    return str.replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
    });
  }

  /**
   * Capitalizes the first letter of the string
   * @param {string} str - The string to capitalize
   * @returns {string): string} The capitalized string
   */
  static capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  /**
   * Truncates a string to specified length
   *
   * Shortens the input string to the specified maximum length, adding a suffix
   * if truncation occurs. If the original string is already within the length
   * limit, it is returned unchanged.
   *
   * @param {string} str - The input string to truncate
   * @param {number} length - Maximum length of the resulting string including suffix
   * @param {unknown} suffix - Suffix to append if truncation occurs (default: '...')
   * @returns {string} The truncated string with suffix if truncation was needed
   */
  static truncate(str: string, length: number, suffix = '...'): string {
    if (str.length <= length) return str;
    return str.substring(0, length - suffix.length) + suffix;
  }

  /**
   * Removes special characters from a string
   *
   * Strips all non-alphanumeric characters from the input string, keeping only
   * letters, numbers, and whitespace characters. This is useful for sanitizing
   * input or creating clean identifiers.
   *
   * @param {string} str - The input string to clean by removing special characters
   * @returns {string): string} The cleaned string containing only letters, numbers, and whitespace
   */
  static removeSpecialChars(str: string): string {
    return str.replace(/[^\d\sA-Za-z]/g, '');
  }

  /**
   * Normalizes whitespace in string
   * @param {string} str - The string to normalize
   * @returns {string): string} The normalized string
   */
  static normalizeWhitespace(str: string): string {
    return str.replace(/\s+/g, ' ').trim();
  }

  /**
   * Converts a string to URL-safe format
   *
   * Transforms the input string into a URL-safe format by converting to lowercase,
   * removing special characters, replacing spaces and separators with hyphens, and
   * trimming leading/trailing hyphens. The result is suitable for use in URLs.
   *
   * @param {string} str - The input string to convert to a URL-safe format
   * @returns {string): string} A URL-safe version of the input string
   */
  static toUrlSafe(str: string): string {
    let result = str
      .toLowerCase()
      .replace(/[^\s\w-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+/, '');

    // Remove trailing dashes without regex
    while (result.endsWith('-')) {
      result = result.slice(0, -1);
    }

    return result;
  }

  /**
   * Generates a URL slug from a string
   *
   * Creates a URL-friendly slug by converting the input string to a format suitable
   * for use in URLs. This method is an alias for toUrlSafe() and provides semantic
   * clarity when the intent is specifically slug generation.
   *
   * @param {string} str - The input string to convert to a slug
   * @returns {string): string} A slugified version of the input string suitable for URLs
   */
  static slugify(str: string): string {
    return this.toUrlSafe(str);
  }

  /**
   * Converts a string to constant case (UPPER_SNAKE_CASE)
   *
   * Transforms the input string to constant case format where words are separated
   * by underscores and all letters are uppercase. This format is commonly used
   * for constants and environment variables.
   *
   * @param {string} str - The input string to convert to constant case
   * @returns {string): string} The constant case version of the input string
   */
  static toConstantCase(str: string): string {
    return this.toSnakeCase(str).toUpperCase();
  }

  /**
   * Converts a string to sentence case
   *
   * Transforms the input string to sentence case where only the first character
   * is capitalized and all subsequent characters are lowercase. This format is
   * commonly used for ordinary sentences and descriptions.
   *
   * @param {string} str - The input string to convert to sentence case
   * @returns {string): string} The sentence case version of the input string
   */
  static toSentenceCase(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }
}
