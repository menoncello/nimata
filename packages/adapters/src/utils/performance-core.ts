/**
 * Performance Core Utilities
 *
 * Provides performance monitoring and async operation utilities
 */

import { randomBytes } from 'crypto';

// Constants for magic numbers
const RANDOM_BYTES_LENGTH = 8;

// Constants for magic numbers
const DEFAULT_QUEUE_DELAY = 10;
const SECOND_IN_MS = 1000;
const SECONDS_PER_MINUTE = 60;
const MINUTE_IN_MS = SECONDS_PER_MINUTE * SECOND_IN_MS;
const BYTES_PER_KB = 1024;

export interface PerformanceMetrics {
  operation: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  memoryStart?: number;
  memoryEnd?: number;
  memoryDelta?: number;
}

/**
 * Performance Monitor
 */
export class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private activeMetrics = new Map<string, PerformanceMetrics>();

  /**
   * Start monitoring an operation
   * @param operation - Operation name
   * @returns Metric ID for stopping the monitor
   */
  start(operation: string): string {
    const timestamp = Date.now();
    const randomSuffix = randomBytes(RANDOM_BYTES_LENGTH).toString('hex');
    const id = `${operation}_${timestamp}_${randomSuffix}`;
    const metric: PerformanceMetrics = {
      operation,
      startTime: timestamp,
      memoryStart: this.getMemoryUsage(),
    };

    this.activeMetrics.set(id, metric);
    return id;
  }

  /**
   * Stop monitoring an operation
   * @param id - Metric ID returned by start()
   * @returns Completed metrics or null if not found
   */
  stop(id: string): PerformanceMetrics | null {
    const metric = this.activeMetrics.get(id);

    if (!metric) {
      return null;
    }

    metric.endTime = Date.now();
    metric.duration = metric.endTime - metric.startTime;
    metric.memoryEnd = this.getMemoryUsage();
    metric.memoryDelta = metric.memoryEnd - (metric.memoryStart || 0);

    this.activeMetrics.delete(id);
    this.metrics.push(metric);

    return metric;
  }

  /**
   * Get all metrics
   * @returns Copy of all metrics array
   */
  getMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  /**
   * Get metrics by operation name
   * @param operation - Operation name
   * @returns Array of metrics for the operation
   */
  getMetricsByOperation(operation: string): PerformanceMetrics[] {
    return this.metrics.filter((metric) => metric.operation === operation);
  }

  /**
   * Get average duration for an operation
   * @param operation - Operation name
   * @returns Average duration in milliseconds
   */
  getAverageDuration(operation: string): number {
    const operationMetrics = this.getMetricsByOperation(operation);
    if (operationMetrics.length === 0) return 0;

    const total = operationMetrics.reduce((sum, metric) => sum + (metric.duration || 0), 0);
    return total / operationMetrics.length;
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics = [];
    this.activeMetrics.clear();
  }

  /**
   * Print performance summary
   */
  printSummary(): void {
    console.log('\n📊 Performance Summary:');

    const operations = [...new Set(this.metrics.map((m) => m.operation))];

    for (const operation of operations) {
      const operationMetrics = this.getMetricsByOperation(operation);
      const avgDuration = this.getAverageDuration(operation);
      const totalDuration = operationMetrics.reduce((sum, m) => sum + (m.duration || 0), 0);
      const avgMemory =
        operationMetrics.reduce((sum, m) => sum + (m.memoryDelta || 0), 0) /
        operationMetrics.length;

      console.log(`  ${operation}:`);
      console.log(`    Operations: ${operationMetrics.length}`);
      console.log(`    Avg Duration: ${avgDuration.toFixed(0)}ms`);
      console.log(`    Total Duration: ${totalDuration.toFixed(0)}ms`);
      console.log(`    Avg Memory: ${(avgMemory / BYTES_PER_KB / BYTES_PER_KB).toFixed(1)}MB`);
    }
  }

  /**
   * Get current memory usage
   * @returns Memory usage in bytes
   */
  private getMemoryUsage(): number {
    if (typeof process !== 'undefined' && process.memoryUsage) {
      return process.memoryUsage().heapUsed;
    }
    return 0;
  }
}

/**
 * Async Operation Queue
 */
export class AsyncQueue {
  private queue: Array<() => Promise<unknown>> = [];
  private running = false;
  private concurrency: number;
  private activeCount = 0;

  /**
   * Create a new async queue
   * @param concurrency - Maximum concurrent operations
   */
  constructor(concurrency = 4) {
    this.concurrency = concurrency;
  }

  /**
   * Add operation to queue
   * @param operation - Async operation function
   * @returns Promise that resolves with operation result
   */
  async add<T>(operation: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await operation();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });

      this.process();
    });
  }

  /**
   * Process queue
   */
  private async process(): Promise<void> {
    if (this.running || this.activeCount >= this.concurrency) {
      return;
    }

    this.running = true;

    while (this.queue.length > 0 && this.activeCount < this.concurrency) {
      const operation = this.queue.shift();
      if (operation) {
        this.activeCount++;

        // Don't await here to allow concurrent operations
        operation().finally(() => {
          this.activeCount--;
          this.process();
        });
      }
    }

    this.running = false;
  }

  /**
   * Wait for all operations to complete
   */
  async drain(): Promise<void> {
    while (this.queue.length > 0 || this.activeCount > 0) {
      await new Promise((resolve) => setTimeout(resolve, DEFAULT_QUEUE_DELAY));
    }
  }

  /**
   * Get queue status
   * @returns Queue status object
   */
  status(): { queue: number; active: number; concurrency: number } {
    return {
      queue: this.queue.length,
      active: this.activeCount,
      concurrency: this.concurrency,
    };
  }
}

/**
 * Performance utility functions
 */
export const PerformanceUtils = {
  /**
   * Debounce function calls
   * @param func - Function to debounce
   * @param wait - Wait time in milliseconds
   * @returns Debounced function
   */
  debounce: <T extends (...args: unknown[]) => unknown>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;

    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  },

  /**
   * Throttle function calls
   * @param func - Function to throttle
   * @param limit - Time limit in milliseconds
   * @returns Throttled function
   */
  throttle: <T extends (...args: unknown[]) => unknown>(
    func: T,
    limit: number
  ): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean;

    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },

  /**
   * Format duration in milliseconds to human readable string
   * @param durationMs - Duration in milliseconds
   * @returns Formatted duration string
   */
  formatDuration: (durationMs: number): string => {
    if (durationMs < SECOND_IN_MS) {
      return `${durationMs}ms`;
    } else if (durationMs < MINUTE_IN_MS) {
      return `${(durationMs / SECOND_IN_MS).toFixed(1)}s`;
    }
    return `${(durationMs / MINUTE_IN_MS).toFixed(1)}m`;
  },
};
