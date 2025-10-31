/**
 * Memoization Utilities
 *
 * Provides function memoization capabilities
 */

import { MemoryCache } from './cache-implementations.js';

/**
 * Create a memoized function
 * @param {unknown} func - Function to memoize
 * @param {unknown} cache - Optional cache instance
 * @returns {T} Memoized function
 */
export function createMemoizedFunction<T extends (...args: unknown[]) => unknown>(
  func: T,
  cache?: MemoryCache<ReturnType<T>>
): T {
  const memoCache = cache || new MemoryCache<ReturnType<T>>();

  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    const result = memoCache.get(key);

    if (result === null) {
      const newResult = func(...args);
      memoCache.set(key, newResult as ReturnType<T>);
      return newResult;
    }

    return result;
  }) as T;
}

/**
 * Create a memoized function with custom cache options
 * @param {unknown} func - Function to memoize
 * @param {unknown} cacheOptions - Cache configuration options
 * @param {unknown} cacheOptions.ttl - Time to live in milliseconds
 * @param {unknown} cacheOptions.maxSize - Maximum cache size
 * @returns {T} Memoized function
 */
export function memoize<T extends (...args: unknown[]) => unknown>(
  func: T,
  cacheOptions?: { ttl?: number; maxSize?: number }
): T {
  const cache = new MemoryCache<ReturnType<T>>(cacheOptions);
  return createMemoizedFunction(func, cache);
}
