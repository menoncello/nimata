/**
 * Utility helper functions
 */

/**
 * Format a date as ISO string
 * @param date
 */
export function formatDate(date: Date = new Date()): string {
  return date.toISOString();
}

/**
 * Delay execution for specified milliseconds
 * @param ms
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Generate a random string
 * @param length
 */
export function generateRandomString(length = 10): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Deep clone an object
 * @param obj
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Check if a value is a valid object
 * @param value
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Safely access nested object properties
 * @param obj
 * @param path
 */
export function getNestedValue<T = any>(
  obj: Record<string, unknown>,
  path: string
): T | undefined {
  return path.split('.').reduce((current, key) => {
    return isObject(current) ? current[key] as T : undefined;
  }, obj) as T | undefined;
}