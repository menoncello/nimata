/**
 * String Utilities
 *
 * Helper functions for string case conversion
 */

/**
 * Convert string to camelCase
 * @param {string} str - String to convert
 * @returns {string): string} camelCase string
 */
export function toCamelCase(str: string): string {
  return str.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
}

/**
 * Convert string to PascalCase
 * @param {string} str - String to convert
 * @returns {string): string} PascalCase string
 */
export function toPascalCase(str: string): string {
  const camelCase = toCamelCase(str);
  return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
}

/**
 * Convert string to kebab-case
 * @param {string} str - String to convert
 * @returns {string): string} kebab-case string
 */
export function toKebabCase(str: string): string {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase();
}

/**
 * Convert string to snake_case
 * @param {string} str - String to convert
 * @returns {string): string} snake_case string
 */
export function toSnakeCase(str: string): string {
  return str.replace(/-([a-z])/g, (_, char) => `_${char}`).toLowerCase();
}
