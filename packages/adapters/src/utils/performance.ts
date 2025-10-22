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
   * @param options - Cache configuration options
   * @returns New memory cache instance
   */
  memoryCache: <T = unknown>(options?: CacheOptions): MemoryCache<T> => {
    return new MemoryCache<T>(options);
  },

  /**
   * Create a file system cache
   * @param options - Cache configuration options
   * @returns New file system cache instance
   */
  fileSystemCache: (options?: CacheOptions): FileSystemCache => {
    return new FileSystemCache(options);
  },

  /**
   * Create a performance monitor
   * @returns New performance monitor instance
   */
  monitor: (): PerformanceMonitor => {
    return new PerformanceMonitor();
  },

  /**
   * Create an async queue
   * @param concurrency - Maximum concurrent operations
   * @returns New async queue instance
   */
  queue: (concurrency?: number): AsyncQueue => {
    return new AsyncQueue(concurrency);
  },

  /**
   * Debounce function calls
   * @param func - Function to debounce
   * @param wait - Wait time in milliseconds
   * @returns Debounced function
   */
  debounce: PerformanceUtils.debounce,

  /**
   * Throttle function calls
   * @param func - Function to throttle
   * @param limit - Time limit in milliseconds
   * @returns Throttled function
   */
  throttle: PerformanceUtils.throttle,

  /**
   * Create a memoized function
   * @param func - Function to memoize
   * @param cache - Optional cache instance
   * @returns Memoized function
   */
  memoize: createMemoizedFunction,

  /**
   * Format duration in milliseconds to human readable string
   * @param durationMs - Duration in milliseconds
   * @returns Formatted duration string
   */
  formatDuration: PerformanceUtils.formatDuration,
};

/**
 * Default instances
 */
export const defaultMemoryCache = Performance.memoryCache();
export const defaultFileSystemCache = Performance.fileSystemCache();
export const defaultMonitor = Performance.monitor();
