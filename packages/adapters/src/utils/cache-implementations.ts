/**
 * Cache Implementation Utilities
 *
 * Provides memory and file system cache implementations
 */

import { promises as fs } from 'fs';
import { join } from 'path';

// Constants for magic numbers
const DEFAULT_MAX_SIZE = 1000;
const DEFAULT_TTL_MINUTES = 5;
const SECONDS_PER_MINUTE = 60;
const MS_PER_SECOND = 1000;
const DEFAULT_HOUR_TTL = SECONDS_PER_MINUTE * SECONDS_PER_MINUTE * MS_PER_SECOND;
const MINUTE_IN_MS = SECONDS_PER_MINUTE * MS_PER_SECOND;

export interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  maxSize?: number;
  directory?: string;
}

/**
 * Simple in-memory cache
 */
export class MemoryCache<T = unknown> {
  private cache = new Map<string, { value: T; timestamp: number; ttl?: number }>();
  private maxSize: number;
  private defaultTtl: number;

  /**
   * Create a new memory cache instance
   * @param options - Cache configuration options
   */
  constructor(options: CacheOptions = {}) {
    this.maxSize = options.maxSize || DEFAULT_MAX_SIZE;
    this.defaultTtl = options.ttl || DEFAULT_TTL_MINUTES * MINUTE_IN_MS;
  }

  /**
   * Get value from cache
   * @param key - Cache key
   * @returns Cached value or null if not found/expired
   */
  get(key: string): T | null {
    const item = this.cache.get(key);

    if (!item) {
      return null;
    }

    // Check if expired
    if (item.ttl && Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  /**
   * Set value in cache
   * @param key - Cache key
   * @param value - Value to cache
   * @param ttl - Optional time to live in milliseconds
   */
  set(key: string, value: T, ttl?: number): void {
    // Remove oldest items if cache is full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTtl,
    });
  }

  /**
   * Delete value from cache
   * @param key - Cache key
   * @returns True if item was deleted
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache size
   * @returns Number of cached items
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Clean expired items
   * @returns Number of items cleaned
   */
  cleanup(): number {
    let cleaned = 0;
    const now = Date.now();

    for (const [key, item] of this.cache.entries()) {
      if (item.ttl && now - item.timestamp > item.ttl) {
        this.cache.delete(key);
        cleaned++;
      }
    }

    return cleaned;
  }
}

/**
 * File system cache
 */
export class FileSystemCache {
  private cacheDir: string;
  private defaultTtl: number;

  /**
   * Create a new file system cache instance
   * @param options - Cache configuration options
   */
  constructor(options: CacheOptions = {}) {
    this.cacheDir = options.directory || join(process.cwd(), '.nimata-cache');
    this.defaultTtl = options.ttl || DEFAULT_HOUR_TTL;
  }

  /**
   * Initialize cache directory
   */
  async init(): Promise<void> {
    try {
      await fs.mkdir(this.cacheDir, { recursive: true });
    } catch {
      // Directory might already exist
    }
  }

  /**
   * Get cached file content
   * @param key - Cache key
   * @returns Cached content or null if not found/expired
   */
  async get(key: string): Promise<string | null> {
    const filePath = join(this.cacheDir, `${key}.cache`);
    const metaPath = join(this.cacheDir, `${key}.meta`);

    try {
      // Check if files exist
      await fs.access(filePath);
      await fs.access(metaPath);

      // Read metadata
      const metaContent = await fs.readFile(metaPath, 'utf-8');
      const meta = JSON.parse(metaContent);

      // Check if expired
      if (Date.now() - meta.timestamp > meta.ttl) {
        await fs.unlink(filePath);
        await fs.unlink(metaPath);
        return null;
      }

      // Return cached content
      return await fs.readFile(filePath, 'utf-8');
    } catch {
      return null;
    }
  }

  /**
   * Set cached file content
   * @param key - Cache key
   * @param content - Content to cache
   * @param ttl - Optional time to live in milliseconds
   */
  async set(key: string, content: string, ttl?: number): Promise<void> {
    await this.init();

    const filePath = join(this.cacheDir, `${key}.cache`);
    const metaPath = join(this.cacheDir, `${key}.meta`);

    const meta = {
      timestamp: Date.now(),
      ttl: ttl || this.defaultTtl,
    };

    // Write files atomically
    await Promise.all([
      fs.writeFile(filePath, content, 'utf-8'),
      fs.writeFile(metaPath, JSON.stringify(meta), 'utf-8'),
    ]);
  }

  /**
   * Delete cached file
   * @param key - Cache key
   */
  async delete(key: string): Promise<void> {
    const filePath = join(this.cacheDir, `${key}.cache`);
    const metaPath = join(this.cacheDir, `${key}.meta`);

    try {
      await Promise.all([fs.unlink(filePath), fs.unlink(metaPath)]);
    } catch {
      // Files might not exist
    }
  }

  /**
   * Clear all cache
   */
  async clear(): Promise<void> {
    try {
      const files = await fs.readdir(this.cacheDir);
      await Promise.all(files.map((file) => fs.unlink(join(this.cacheDir, file))));
    } catch {
      // Directory might not exist
    }
  }

  /**
   * Clean expired cache files
   * @returns Number of files cleaned
   */
  async cleanup(): Promise<number> {
    try {
      const files = await fs.readdir(this.cacheDir);
      const now = Date.now();
      let cleaned = 0;

      for (const file of files) {
        if (file.endsWith('.meta')) {
          cleaned += await this.processMetadataFile(file, now);
        }
      }

      return cleaned;
    } catch {
      // Directory might not exist
      return 0;
    }
  }

  /**
   * Process a single metadata file for cleanup
   * @param file - Metadata file name
   * @param now - Current timestamp
   * @returns Number of files cleaned (0 or 1)
   */
  private async processMetadataFile(file: string, now: number): Promise<number> {
    const metaPath = join(this.cacheDir, file);
    const cachePath = join(this.cacheDir, file.replace('.meta', '.cache'));

    try {
      const shouldDelete = await this.isMetadataExpired(metaPath, now);
      if (shouldDelete) {
        await this.deleteCacheFiles(metaPath, cachePath);
        return 1;
      }
      return 0;
    } catch {
      // Invalid metadata file, delete both
      await this.deleteCacheFilesSafe(metaPath, cachePath);
      return 1;
    }
  }

  /**
   * Check if metadata file is expired
   * @param metaPath - Path to metadata file
   * @param now - Current timestamp
   * @returns True if expired
   */
  private async isMetadataExpired(metaPath: string, now: number): Promise<boolean> {
    const metaContent = await fs.readFile(metaPath, 'utf-8');
    const meta = JSON.parse(metaContent);
    return now - meta.timestamp > meta.ttl;
  }

  /**
   * Delete cache files (unsafe)
   * @param metaPath - Path to metadata file
   * @param cachePath - Path to cache file
   */
  private async deleteCacheFiles(metaPath: string, cachePath: string): Promise<void> {
    await Promise.all([fs.unlink(metaPath), fs.unlink(cachePath)]);
  }

  /**
   * Delete cache files (safe with error handling)
   * @param metaPath - Path to metadata file
   * @param cachePath - Path to cache file
   */
  private async deleteCacheFilesSafe(metaPath: string, cachePath: string): Promise<void> {
    await Promise.all([
      fs.unlink(metaPath).catch(() => Promise.resolve()),
      fs.unlink(cachePath).catch(() => Promise.resolve()),
    ]);
  }
}
