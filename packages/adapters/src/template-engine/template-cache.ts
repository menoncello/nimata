/**
 * In-memory Template Cache Implementation
 *
 * Simple in-memory cache for template metadata with TTL support
 */
import type { TemplateMetadata, TemplateCache as ITemplateCache } from '@nimata/core';

/**
 * Constants for template registry
 */
const REGISTRY_CONSTANTS = {
  DEFAULT_CACHE_TTL: 3600,
  MS_PER_SECOND: 1000,
} as const;

/**
 * In-memory template cache implementation
 */
export class TemplateCache implements ITemplateCache {
  private cache = new Map<string, { template: TemplateMetadata; expires: number }>();
  private stats = { hits: 0, misses: 0 };

  /**
   * Get template from cache
   * @param key The cache key
   * @returns The cached template or null if not found
   */
  async get(key: string): Promise<TemplateMetadata | null> {
    const cached = this.cache.get(key);
    if (cached) {
      if (Date.now() < cached.expires) {
        this.stats.hits++;
        return cached.template;
      }
      this.cache.delete(key);
      this.stats.misses++;
      return null;
    }
    this.stats.misses++;
    return null;
  }

  /**
   * Set template in cache
   * @param key The cache key
   * @param template The template to cache
   * @param ttl Time to live in seconds
   */
  async set(
    key: string,
    template: TemplateMetadata,
    ttl = REGISTRY_CONSTANTS.DEFAULT_CACHE_TTL
  ): Promise<void> {
    const expires = Date.now() + ttl * REGISTRY_CONSTANTS.MS_PER_SECOND;
    this.cache.set(key, { template, expires });
  }

  /**
   * Delete template from cache
   * @param key The cache key to delete
   */
  async delete(key: string): Promise<void> {
    this.cache.delete(key);
  }

  /**
   * Clear all templates from cache
   */
  async clear(): Promise<void> {
    this.cache.clear();
    this.stats = { hits: 0, misses: 0 };
  }

  /**
   * Get cache statistics
   * @returns Cache hit/miss statistics
   */
  async getStats(): Promise<{
    size: number;
    hits: number;
    misses: number;
    hitRate: number;
  }> {
    const total = this.stats.hits + this.stats.misses;
    return {
      size: this.cache.size,
      hits: this.stats.hits,
      misses: this.stats.misses,
      hitRate: total > 0 ? this.stats.hits / total : 0,
    };
  }
}
