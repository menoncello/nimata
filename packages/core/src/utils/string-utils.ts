/**
 * String manipulation utilities for project generation.
 *
 * These utilities provide consistent string formatting across all generators
 * and templates in the project generation system.
 */

/**
 * Converts a string to PascalCase format.
 *
 * Transformations applied:
 * - First letter of each word is capitalized
 * - Spaces, hyphens, and underscores are removed
 * - Existing camelCase is preserved and enhanced
 *
 * @param {string} str - Input string to convert
 * @returns {string} String in PascalCase format
 *
 * @example
 * ```ts
 * toPascalCase('my-component')    // returns 'MyComponent'
 * toPascalCase('my component')    // returns 'MyComponent'
 * toPascalCase('my_component')    // returns 'MyComponent'
 * toPascalCase('myComponent')     // returns 'MyComponent'
 * toPascalCase('already-pascal')  // returns 'AlreadyPascal'
 * ```
 */
export function toPascalCase(str: string): string {
  if (!str || typeof str !== 'string') {
    return '';
  }

  return (
    str
      // Capitalize first letter and any letter after word boundaries
      .replace(/(?:^\w)|[A-Z]|(?:\b\w)/g, (word) => {
        return word.toUpperCase();
      })
      // Remove spaces, hyphens, and underscores
      .replace(/\s+/g, '')
      .replace(/-/g, '')
      .replace(/_/g, '')
  );
}
