/**
 * Performance Optimization Utilities
 *
 * Provides caching, async operations, and performance monitoring for CLI
 */

import { MemoryCache, FileSystemCache, type CacheOptions } from './cache-implementations.js';
import { createMemoizedFunction } from './memoization.js';
import { PerformanceMonitor, AsyncQueue, PerformanceUtils } from './performance-core.js';

// Re-export types and interfaces
export type { PerformanceMetrics } from '../types/config-types.js';
export type { CacheOptions } from './cache-implementations.js';

// Re-export classes
export { MemoryCache, FileSystemCache, PerformanceMonitor, AsyncQueue };

/**
 * Performance utilities
 */
export const Performance = {
  /**
   * Create a memory cache
   * @param {unknown} options - Cache configuration options
   * @returns {void} New memory cache instance
   */
  memoryCache: <T = unknown>(options?: CacheOptions): MemoryCache<T> => {
    return new MemoryCache<T>(options);
  },

  /**
   * Create a file system cache
   * @param {unknown} options - Cache configuration options
   * @returns {void} New file system cache instance
   */
  fileSystemCache: (options?: CacheOptions): FileSystemCache => {
    return new FileSystemCache(options);
  },

  /**
   * Create a performance monitor
   * @returns {void} New performance monitor instance
   */
  monitor: (): PerformanceMonitor => {
    return new PerformanceMonitor();
  },

  /**
   * Create an async queue
   * @param {unknown} concurrency - Maximum concurrent operations
   * @returns {void} New async queue instance
   */
  queue: (concurrency?: number): AsyncQueue => {
    return new AsyncQueue(concurrency);
  },

  /**
   * Debounce function calls
   * @param {unknown} func - Function to debounce
   * @param {unknown} wait - Wait time in milliseconds
   * @returns {void} Debounced function
   */
  debounce: PerformanceUtils.debounce,

  /**
   * Throttle function calls
   * @param {unknown} func - Function to throttle
   * @param {unknown} limit - Time limit in milliseconds
   * @returns {void} Throttled function
   */
  throttle: PerformanceUtils.throttle,

  /**
   * Create a memoized function
   * @param {unknown} func - Function to memoize
   * @param {unknown} cache - Optional cache instance
   * @returns {void} Memoized function
   */
  memoize: createMemoizedFunction,

  /**
   * Format duration in milliseconds to human readable string
   * @param {unknown} durationMs - Duration in milliseconds
   * @returns {void} Formatted duration string
   */
  formatDuration: PerformanceUtils.formatDuration,
};

/**
 * Default instances
 */
export const defaultMemoryCache = Performance.memoryCache();
export const defaultFileSystemCache = Performance.fileSystemCache();
export const defaultMonitor = Performance.monitor();
