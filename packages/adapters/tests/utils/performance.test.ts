/**
 * Unit tests for Performance Utilities
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'bun:test';
import {
  MemoryCache,
  FileSystemCache,
  PerformanceMonitor,
  AsyncQueue,
  Performance,
} from '../../src/utils/performance';

// Helper function for successful operation
const createSuccessOperation = async (): Promise<string> => {
  return 'success';
};

// Mock fs for FileSystemCache tests
const mockFs = {
  mkdir: vi.fn(),
  writeFile: vi.fn(),
  readFile: vi.fn(),
  access: vi.fn(),
  unlink: vi.fn(),
  readdir: vi.fn(),
};

vi.mock('fs', () => ({
  promises: mockFs,
}));

describe('MemoryCache', () => {
  let cache: MemoryCache<string>;

  beforeEach(() => {
    cache = new MemoryCache<string>({ ttl: 1000, maxSize: 3 });
  });

  it('should create with default options', () => {
    const defaultCache = new MemoryCache<string>();
    expect(defaultCache).toBeInstanceOf(MemoryCache);
  });

  it('should store and retrieve values', () => {
    cache.set('key1', 'value1');
    expect(cache.get('key1')).toBe('value1');
  });

  it('should return null for non-existent keys', () => {
    expect(cache.get('nonexistent')).toBeNull();
  });

  it('should handle TTL expiration', async () => {
    const shortTtlCache = new MemoryCache<string>({ ttl: 50 });
    shortTtlCache.set('key1', 'value1');
    expect(shortTtlCache.get('key1')).toBe('value1');

    // Wait for expiration
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(shortTtlCache.get('key1')).toBeNull();
  });

  it('should respect max size', () => {
    // Fill to max size
    cache.set('key1', 'value1');
    cache.set('key2', 'value2');
    cache.set('key3', 'value3');
    expect(cache.size()).toBe(3);

    // Add one more - should remove oldest
    cache.set('key4', 'value4');
    expect(cache.size()).toBe(3);
    expect(cache.get('key1')).toBeNull(); // Should be removed
    expect(cache.get('key4')).toBe('value4'); // Should be added
  });

  it('should delete values', () => {
    cache.set('key1', 'value1');
    expect(cache.delete('key1')).toBe(true);
    expect(cache.get('key1')).toBeNull();
  });

  it('should return false when deleting non-existent key', () => {
    expect(cache.delete('nonexistent')).toBe(false);
  });

  it('should clear all values', () => {
    cache.set('key1', 'value1');
    cache.set('key2', 'value2');
    cache.clear();
    expect(cache.size()).toBe(0);
    expect(cache.get('key1')).toBeNull();
    expect(cache.get('key2')).toBeNull();
  });

  it('should clean expired items', async () => {
    const shortTtlCache = new MemoryCache<string>({ ttl: 50 });
    shortTtlCache.set('key1', 'value1');
    shortTtlCache.set('key2', 'value2', 200); // Longer TTL

    // Wait for first item to expire
    await new Promise((resolve) => setTimeout(resolve, 100));

    const cleaned = shortTtlCache.cleanup();
    expect(cleaned).toBe(1);
    expect(shortTtlCache.get('key1')).toBeNull();
    expect(shortTtlCache.get('key2')).toBe('value2');
  });
});

describe('FileSystemCache', () => {
  let cache: FileSystemCache;

  beforeEach(() => {
    vi.clearAllMocks();
    cache = new FileSystemCache({ ttl: 1000, directory: '/test-cache' });
  });

  it('should create with default options', () => {
    const defaultCache = new FileSystemCache();
    expect(defaultCache).toBeInstanceOf(FileSystemCache);
  });

  it('should initialize cache directory', async () => {
    mockFs.mkdir.mockResolvedValue();
    await cache.init();
    expect(mockFs.mkdir).toHaveBeenCalledWith('/test-cache', { recursive: true });
  });

  it('should store and retrieve values', async () => {
    mockFs.mkdir.mockResolvedValue();
    mockFs.access.mockResolvedValue();
    mockFs.readFile
      .mockResolvedValueOnce(`{"timestamp":${Date.now()},"ttl":1000}`)
      .mockResolvedValueOnce('test value');

    await cache.set('key1', 'value1');
    expect(mockFs.writeFile).toHaveBeenCalledTimes(2); // cache file and meta file

    const result = await cache.get('key1');
    expect(result).toBe('test value');
  });

  it('should return null for non-existent keys', async () => {
    mockFs.access.mockRejectedValue(new Error('File not found'));
    const result = await cache.get('nonexistent');
    expect(result).toBeNull();
  });

  it('should handle TTL expiration', async () => {
    const expiredTime = Date.now() - 2000; // 2 seconds ago
    mockFs.mkdir.mockResolvedValue();
    mockFs.access.mockResolvedValue();
    mockFs.readFile
      .mockResolvedValueOnce(`{"timestamp":${expiredTime},"ttl":1000}`)
      .mockResolvedValueOnce('test value');

    // Should delete expired files
    mockFs.unlink.mockResolvedValue();

    const result = await cache.get('key1');
    expect(result).toBeNull();
    expect(mockFs.unlink).toHaveBeenCalledTimes(2);
  });

  it('should delete cached files', async () => {
    mockFs.unlink.mockResolvedValue();
    await cache.delete('key1');
    expect(mockFs.unlink).toHaveBeenCalledTimes(2); // cache file and meta file
  });

  it('should clear all cache', async () => {
    mockFs.readdir.mockResolvedValue(['key1.cache', 'key1.meta', 'key2.cache', 'key2.meta']);
    mockFs.unlink.mockResolvedValue();

    await cache.clear();
    expect(mockFs.unlink).toHaveBeenCalledTimes(4);
  });

  it('should clean expired cache files', async () => {
    const validTime = Date.now();
    const expiredTime = Date.now() - 2000;

    mockFs.readdir.mockResolvedValue(['key1.meta', 'key2.meta', 'invalid.meta']);
    mockFs.readFile
      .mockResolvedValueOnce(`{"timestamp":${expiredTime},"ttl":1000}`)
      .mockResolvedValueOnce(`{"timestamp":${validTime},"ttl":1000}`)
      .mockRejectedValueOnce(new Error('Invalid JSON'));
    mockFs.unlink.mockResolvedValue();

    const cleaned = await cache.cleanup();
    expect(cleaned).toBe(2); // expired and invalid
    expect(mockFs.unlink).toHaveBeenCalledTimes(4); // 2 files per cleaned item
  });
});

describe('PerformanceMonitor', () => {
  let monitor: PerformanceMonitor;

  beforeEach(() => {
    monitor = new PerformanceMonitor();
  });

  it('should start and stop operations', async () => {
    const id = monitor.start('test-operation');
    expect(typeof id).toBe('string');

    // Add a small delay to ensure measurable duration
    await new Promise((resolve) => setTimeout(resolve, 1));

    const metric = monitor.stop(id);
    expect(metric).toBeDefined();
    if (metric) {
      expect(metric.operation).toBe('test-operation');
      expect(metric.startTime).toBeGreaterThan(0);
      expect(metric.endTime).toBeGreaterThan(0);
      expect(metric.duration).toBeGreaterThanOrEqual(0);
    }
  });

  it('should return null for unknown operation ID', () => {
    const metric = monitor.stop('unknown-id');
    expect(metric).toBeNull();
  });

  it('should track multiple operations', () => {
    const id1 = monitor.start('operation1');
    const id2 = monitor.start('operation2');

    monitor.stop(id1);
    monitor.stop(id2);

    const metrics = monitor.getMetrics();
    expect(metrics).toHaveLength(2);
    expect(metrics[0].operation).toBe('operation1');
    expect(metrics[1].operation).toBe('operation2');
  });

  it('should get metrics by operation name', () => {
    const id1 = monitor.start('test-op');
    const id2 = monitor.start('test-op');
    const id3 = monitor.start('other-op');

    monitor.stop(id1);
    monitor.stop(id2);
    monitor.stop(id3);

    const testMetrics = monitor.getMetricsByOperation('test-op');
    expect(testMetrics).toHaveLength(2);
    expect(testMetrics.every((m) => m.operation === 'test-op')).toBe(true);
  });

  it('should calculate average duration', async () => {
    const id1 = monitor.start('test-op');

    // Wait a bit to create different durations
    await new Promise((resolve) => setTimeout(resolve, 50));

    const id2 = monitor.start('test-op');

    // Wait a bit more
    await new Promise((resolve) => setTimeout(resolve, 50));

    monitor.stop(id1);
    monitor.stop(id2);

    const avgDuration = monitor.getAverageDuration('test-op');
    expect(avgDuration).toBeGreaterThan(0);
    expect(avgDuration).toBeLessThan(200); // Should be reasonable
  });

  it('should return 0 for operations without metrics', () => {
    const avgDuration = monitor.getAverageDuration('nonexistent');
    expect(avgDuration).toBe(0);
  });

  it('should clear all metrics', () => {
    const id1 = monitor.start('test-op');
    monitor.stop(id1);

    expect(monitor.getMetrics()).toHaveLength(1);

    monitor.clear();
    expect(monitor.getMetrics()).toHaveLength(0);
  });

  it('should print performance summary', () => {
    const id1 = monitor.start('test-op');
    const id2 = monitor.start('other-op');
    monitor.stop(id1);
    monitor.stop(id2);

    const consoleSpy = vi.spyOn(console, 'log').mockImplementation((...args) => {
      // Capture console output for testing
      consoleSpy?.calls?.push(args);
    });
    // Initialize calls array if not present
    if (!consoleSpy.calls) consoleSpy.calls = [];
    monitor.printSummary();

    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Performance Summary:'));
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('test-op:'));
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('other-op:'));

    consoleSpy.mockRestore();
  });
});

describe('AsyncQueue', () => {
  it('should create with default concurrency', () => {
    const queue = new AsyncQueue();
    expect(queue).toBeInstanceOf(AsyncQueue);
  });

  it('should create with custom concurrency', () => {
    const queue = new AsyncQueue(2);
    expect(queue).toBeInstanceOf(AsyncQueue);
  });

  it('should process operations in order', async () => {
    const queue = new AsyncQueue(1);
    const results: number[] = [];

    const operation1 = async (): Promise<number> => {
      results.push(1);
      return 1;
    };

    const operation2 = async (): Promise<number> => {
      results.push(2);
      return 2;
    };

    await Promise.all([queue.add(operation1), queue.add(operation2)]);

    expect(results).toEqual([1, 2]);
  });

  it('should handle concurrent operations within limit', async () => {
    const queue = new AsyncQueue(2);
    let activeCount = 0;
    let maxActiveCount = 0;

    const operation = async (value: number): Promise<number> => {
      activeCount++;
      maxActiveCount = Math.max(maxActiveCount, activeCount);
      await new Promise((resolve) => setTimeout(resolve, 50));
      activeCount--;
      return value;
    };

    const results = await Promise.all([
      queue.add(() => operation(1)),
      queue.add(() => operation(2)),
      queue.add(() => operation(3)),
    ]);

    expect(results).toEqual([1, 2, 3]);
    expect(maxActiveCount).toBe(2); // Should not exceed concurrency limit
  });

  it('should handle operation errors', async () => {
    const queue = new AsyncQueue(1);
    const error = new Error('Test error');

    const operation1 = async (): Promise<never> => {
      throw error;
    };

    await expect(queue.add(operation1)).rejects.toThrow('Test error');

    const result = await queue.add(createSuccessOperation);
    expect(result).toBe('success');
  });

  it('should report queue status', () => {
    const queue = new AsyncQueue(2);
    const status = queue.status();
    expect(status).toEqual({
      queue: 0,
      active: 0,
      concurrency: 2,
    });
  });

  it('should wait for drain', async () => {
    const queue = new AsyncQueue(2);

    let completed = false;

    const operation1 = async (): Promise<void> => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      completed = true;
    };

    const operation2 = async (): Promise<void> => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      completed = true;
    };

    queue.add(operation1);
    queue.add(operation2);

    await queue.drain();
    expect(completed).toBe(true);
  });
});

describe('Performance utility', () => {
  describe('memoryCache', () => {
    it('should create memory cache', () => {
      const cache = Performance.memoryCache<string>();
      expect(cache).toBeInstanceOf(MemoryCache);
    });

    it('should create memory cache with options', () => {
      const cache = Performance.memoryCache<string>({ ttl: 1000 });
      expect(cache).toBeInstanceOf(MemoryCache);
    });
  });

  describe('fileSystemCache', () => {
    it('should create file system cache', () => {
      const cache = Performance.fileSystemCache();
      expect(cache).toBeInstanceOf(FileSystemCache);
    });

    it('should create file system cache with options', () => {
      const cache = Performance.fileSystemCache({ ttl: 1000 });
      expect(cache).toBeInstanceOf(FileSystemCache);
    });
  });

  describe('monitor', () => {
    it('should create performance monitor', () => {
      const monitor = Performance.monitor();
      expect(monitor).toBeInstanceOf(PerformanceMonitor);
    });
  });

  describe('queue', () => {
    it('should create async queue', () => {
      const queue = Performance.queue();
      expect(queue).toBeInstanceOf(AsyncQueue);
    });

    it('should create async queue with concurrency', () => {
      const queue = Performance.queue(4);
      expect(queue).toBeInstanceOf(AsyncQueue);
    });
  });

  describe('debounce', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should debounce function calls', async () => {
      const fn = vi.fn().mockReturnValue();
      const debouncedFn = Performance.debounce(fn, 50);

      debouncedFn();
      debouncedFn();
      debouncedFn();

      expect(fn).not.toHaveBeenCalled();

      // Wait for debounce timeout
      await new Promise((resolve) => setTimeout(resolve, 60));
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  describe('throttle', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should throttle function calls', async () => {
      const fn = vi.fn().mockReturnValue();
      const throttledFn = Performance.throttle(fn, 50);

      throttledFn();
      expect(fn).toHaveBeenCalledTimes(1);

      throttledFn();
      expect(fn).toHaveBeenCalledTimes(1); // Should not call again

      // Wait for throttle period
      await new Promise((resolve) => setTimeout(resolve, 60));
      throttledFn();
      expect(fn).toHaveBeenCalledTimes(2); // Should call again after throttle period
    });
  });

  describe('memoize', () => {
    it('should memoize function results', () => {
      const fn = vi.fn().mockReturnValue('result');
      const memoizedFn = Performance.memoize(fn);

      const result1 = memoizedFn('arg1');
      const result2 = memoizedFn('arg1');
      const result3 = memoizedFn('arg2');

      expect(result1).toBe('result');
      expect(result2).toBe('result');
      expect(result3).toBe('result');
      expect(fn).toHaveBeenCalledTimes(2); // Called once for each unique argument
    });

    it('should use custom cache', () => {
      const fn = vi.fn().mockReturnValue('result');
      const customCache = Performance.memoryCache<string>();
      const memoizedFn = Performance.memoize(fn, customCache);

      memoizedFn('arg1');
      memoizedFn('arg1');

      expect(fn).toHaveBeenCalledTimes(1);
      expect(customCache.size()).toBe(1);
    });
  });
});
