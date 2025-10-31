/**
 * Template Helpers
 *
 * Built-in helper functions for template processing
 */

export type HelperFunction = (...args: unknown[]) => unknown;

/**
 * Registers string manipulation helpers
 * @param {unknown} registerHelper - Function to register a helper
 */
/**
 * Capitalize first letter of a string
 * @param {unknown[]} args - Arguments array, first element is the string to capitalize
 * @returns {unknown[]): string} Capitalized string
 */
function capitalizeHelper(...args: unknown[]): string {
  const str = String(args[0] || '');
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}

/**
 * Convert string to camelCase
 * @param {unknown[]} args - Arguments array, first element is the string to convert
 * @returns {unknown[]): string} camelCase string
 */
function camelCaseHelper(...args: unknown[]): string {
  const str = String(args[0] || '');
  if (!str) return '';

  // Convert PascalCase to camelCase
  if (str.length > 0 && str[0] !== undefined && str[0] === str[0].toUpperCase()) {
    return str[0].toLowerCase() + str.slice(1);
  }

  // Convert kebab-case to camelCase
  return str.replace(/-([a-z])/g, (_, char: string) => char.toUpperCase());
}

/**
 * Convert string to kebab-case
 * @param {unknown[]} args - Arguments array, first element is the string to convert
 * @returns {unknown[]): string} kebab-case string
 */
function kebabCaseHelper(...args: unknown[]): string {
  const str = String(args[0] || '');
  return str
    ? str
        .replace(/([A-Z])/g, '-$1')
        .toLowerCase()
        .replace(/^-/, '')
    : '';
}

/**
 * Convert string to snake_case
 * @param {unknown[]} args - Arguments array, first element is the string to convert
 * @returns {unknown[]): string} snake_case string
 */
function snakeCaseHelper(...args: unknown[]): string {
  const str = String(args[0] || '');
  return str ? str.replace(/-([a-z])/g, (_, char: string) => `_${char}`) : '';
}

/**
 * Convert string to lowercase
 * @param {unknown[]} args - Arguments array, first element is the string to convert
 * @returns {unknown[]): string} Lowercase string
 */
function lowercaseHelper(...args: unknown[]): string {
  const str = String(args[0] || '');
  return str.toLowerCase();
}

/**
 * Convert string to uppercase
 * @param {unknown[]} args - Arguments array, first element is the string to convert
 * @returns {unknown[]): string} Uppercase string
 */
function uppercaseHelper(...args: unknown[]): string {
  const str = String(args[0] || '');
  return str.toUpperCase();
}

/**
 * Convert string to PascalCase
 * @param {unknown[]} args - Arguments array, first element is the string to convert
 * @returns {unknown[]): string} PascalCase string
 */
function pascalCaseHelper(...args: unknown[]): string {
  const str = String(args[0] || '');
  if (!str) return '';
  const camelCase = str.replace(/-([a-z])/g, (_, char: string) => char.toUpperCase());
  return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
}

/**
 * Register core string manipulation helpers
 * @param {(name} registerHelper - Function to register a helper
 */
function registerCoreStringHelpers(
  registerHelper: (name: string, helper: HelperFunction) => void
): void {
  registerHelper('capitalize', capitalizeHelper);
  registerHelper('camelCase', camelCaseHelper);
  registerHelper('kebabCase', kebabCaseHelper);
}

/**
 * Register additional string manipulation helpers
 * @param {(name} registerHelper - Function to register a helper
 */
function registerAdditionalStringHelpers(
  registerHelper: (name: string, helper: HelperFunction) => void
): void {
  registerHelper('snakeCase', snakeCaseHelper);
  registerHelper('lowercase', lowercaseHelper);
  registerHelper('uppercase', uppercaseHelper);

  // Register lowercase versions for compatibility
  registerHelper('kebabcase', kebabCaseHelper);
  registerHelper('pascalcase', pascalCaseHelper);
  registerHelper('pascalCase', pascalCaseHelper);
  registerHelper('pascal_case', pascalCaseHelper);
  registerHelper('camel_case', camelCaseHelper);
  registerHelper('kebab_case', kebabCaseHelper);
  registerHelper('snake_case', snakeCaseHelper);
}

/**
 * Register string manipulation helpers
 * @param {(name} registerHelper - Function to register a helper
 */
export function registerStringHelpers(
  registerHelper: (name: string, helper: HelperFunction) => void
): void {
  registerCoreStringHelpers(registerHelper);
  registerAdditionalStringHelpers(registerHelper);
}

/**
 * Registers array manipulation helpers
 * @param {(name} registerHelper - Function to register a helper
 */
export function registerArrayHelpers(
  registerHelper: (name: string, helper: HelperFunction) => void
): void {
  registerHelper('join', (...args: unknown[]) => {
    const array = args[0];
    const separator = args[1] !== undefined && args[1] !== null ? String(args[1]) : ', ';
    return Array.isArray(array) ? array.join(separator) : String(array || '');
  });

  registerHelper('first', (...args: unknown[]) => {
    const array = args[0];
    return Array.isArray(array) && array.length > 0 ? array[0] : undefined;
  });

  registerHelper('last', (...args: unknown[]) => {
    const array = args[0];
    return Array.isArray(array) && array.length > 0 ? array[array.length - 1] : undefined;
  });
}

/**
 * Registers conditional helpers
 * @param {(name} registerHelper - Function to register a helper
 */
export function registerConditionalHelpers(
  registerHelper: (name: string, helper: HelperFunction) => void
): void {
  registerHelper('eq', (...args: unknown[]) => args[0] === args[1]);
  registerHelper('ne', (...args: unknown[]) => args[0] !== args[1]);
  registerHelper('gt', (...args: unknown[]) => Number(args[0]) > Number(args[1]));
  registerHelper('gte', (...args: unknown[]) => Number(args[0]) >= Number(args[1]));
  registerHelper('lt', (...args: unknown[]) => Number(args[0]) < Number(args[1]));
  registerHelper('lte', (...args: unknown[]) => Number(args[0]) <= Number(args[1]));
}

/**
 * Registers utility helpers
 * @param {(name} registerHelper - Function to register a helper
 */
export function registerUtilityHelpers(
  registerHelper: (name: string, helper: HelperFunction) => void
): void {
  registerHelper('now', () => new Date().toISOString());
  registerHelper('year', () => new Date().getFullYear());
}
