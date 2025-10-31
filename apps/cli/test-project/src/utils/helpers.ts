/**
 * Utility helper functions
 */

/**
 * Format a date as ISO string
 * @param {Date} date - The date to format
 * @returns {string} ISO formatted date string
 */
export function formatDate(date: Date = new Date()): string {
  return date.toISOString();
}

/**
 * Delay execution for specified milliseconds
 * @param {number} ms - Milliseconds to delay
 * @returns {Promise<void>} Promise that resolves after the specified delay
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Generate a cryptographically secure random string
 * @param {number} length - Length of the random string to generate
 * @returns {string} Cryptographically secure random string
 * @throws {Error} If cryptographic random number generation is not available
 */
export function generateRandomString(length = 10): string {
  if (typeof crypto === 'undefined' || !crypto.getRandomValues) {
    throw new Error('Cryptographic random number generation is not available in this environment');
  }

  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  // Use cryptographically secure random number generation
  for (let i = 0; i < length; i++) {
    const randomValues = new Uint32Array(1);
    crypto.getRandomValues(randomValues);
    result += chars.charAt(randomValues[0] % chars.length);
  }

  return result;
}

/**
 * Deep clone an object
 * @param {T} obj - Object to deep clone
 * @returns {T} Deep cloned object
 * @template T - Type of the object to clone
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Check if a value is a valid object
 * @param {unknown} value - Value to check
 * @returns {value is Record<string, unknown>} True if the value is a valid object
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Safely access nested object properties
 * @param {Record<string, unknown>} obj - Object to access
 * @param {string} path - Path to the property
 * @returns {T | undefined} Value at the specified path or undefined
 * @template T - Type of the returned value
 */
export function getNestedValue<T>(obj: Record<string, unknown>, path: string): T | undefined {
  return path.split('.').reduce((current, key) => {
    return isObject(current) ? (current[key] as T) : undefined;
  }, obj) as T | undefined;
}
