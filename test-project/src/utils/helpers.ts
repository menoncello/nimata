/**
 * Utility helper functions
 */

/**
 * Format a date as ISO string
 * @param {Date} date - The date to format, defaults to current date
 * @returns {string} The date formatted as ISO string
 */
export function formatDate(date: Date = new Date()): string {
  return date.toISOString();
}

/**
 * Delay execution for specified milliseconds
 * @param {number} ms - Number of milliseconds to delay
 * @returns {Promise<void>} Promise that resolves after the specified delay
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Generate a random string
 * @param {number} length - Length of the random string to generate, defaults to 10
 * @returns {string} Randomly generated string
 */
export function generateRandomString(length = 10): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const maxRandomValue = 4294967296; // 2^32 as a constant
  let result = '';
  for (let i = 0; i < length; i++) {
    // Use crypto.getRandomValues for better randomness
    const randomIndex = Math.floor(
      (crypto.getRandomValues(new Uint32Array(1))[0] / maxRandomValue) * chars.length
    );
    result += chars.charAt(randomIndex);
  }
  return result;
}

/**
 * Deep clone an object
 * @param {T} obj - The object to clone
 * @returns {T} A deep clone of the input object
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Check if a value is a valid object
 * @param {unknown} value - The value to check
 * @returns {boolean} True if the value is a non-null, non-array object
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Safely access nested object properties
 * @param {Record<string, unknown>} obj - The object to access nested properties from
 * @param {string} path - The dot-separated path to the property
 * @returns {T | undefined} The value at the specified path or undefined if not found
 */
export function getNestedValue<T>(obj: Record<string, unknown>, path: string): T | undefined {
  return path.split('.').reduce((current, key) => {
    return isObject(current) ? (current[key] as T) : undefined;
  }, obj) as T | undefined;
}
