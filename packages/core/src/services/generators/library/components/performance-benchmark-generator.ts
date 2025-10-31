/**
 * Performance Benchmark Generator
 *
 * Generates performance benchmarks for libraries
 */
import type { ProjectConfig } from '../../../../types/project-config.js';
import { toPascalCase } from '../../../../utils/string-utils.js';

/**
 * Generates performance benchmarks for libraries
 */
export class PerformanceBenchmarkGenerator {
  /**
   * Generates performance benchmarks
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Performance benchmark code
   */
  generatePerformanceBenchmark(config: ProjectConfig): string {
    const className = toPascalCase(config.name);
    const header = this.generateBenchmarkHeader(config);
    const initializationTests = this.generateInitializationTests(className);
    const processingTests = this.generateProcessingTests(className);
    const memoryTests = this.generateMemoryTests();
    const throughputTests = this.generateThroughputTests();
    const scalabilityTests = this.generateScalabilityTests();

    return [
      header,
      initializationTests,
      processingTests,
      memoryTests,
      throughputTests,
      scalabilityTests,
    ].join('\n\n');
  }

  /**
   * Generates the benchmark file header
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Header code
   */
  private generateBenchmarkHeader(config: ProjectConfig): string {
    const className = toPascalCase(config.name);

    return `/**
 * Performance Benchmarks
 *
 * Performance tests for ${config.name}
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ${className}, create${className} } from '../../src/lib/index.js';

describe('${config.name} Performance', () => {
  let instance: ${className};

  beforeEach(async () => {
    instance = await create${className}({
      debug: false, // Disable debug for performance tests
    });
  });`;
  }

  /**
   * Generates initialization performance tests
   * @param {string} className - Name of the class
   * @returns {string} Initialization tests code
   */
  private generateInitializationTests(className: string): string {
    return `  describe('Initialization Performance', () => {
    it('should initialize in under 100ms', async () => {
      const startTime = performance.now();

      const newInstance = new ${className}();
      await newInstance.initialize();

      const duration = performance.now() - startTime;
      expect(duration).toBeLessThan(100);

      await newInstance.destroy();
    });

    it('should create and initialize in under 150ms', async () => {
      const startTime = performance.now();

      const newInstance = await create${className}();

      const duration = performance.now() - startTime;
      expect(duration).toBeLessThan(150);
    });
  });`;
  }

  /**
   * Generates processing performance tests
   * @param {string} _className - Name of the class
   * @returns {string} Processing tests code
   */
  private generateProcessingTests(_className: string): string {
    const singleItemTest = this.generateSingleItemTest();
    const batchTest100 = this.generateBatchTest100();
    const batchTest1000 = this.generateBatchTest1000();
    const concurrentTest = this.generateConcurrentTest();

    return `  describe('Processing Performance', () => {
    ${singleItemTest}

    ${batchTest100}

    ${batchTest1000}

    ${concurrentTest}
  });`;
  }

  /**
   * Generates single item processing test
   * @returns {string} Single item test code
   */
  private generateSingleItemTest(): string {
    return `it('should process single item in under 10ms', async () => {
      const testData = 'Performance test data';

      const startTime = performance.now();
      const result = await instance.process(testData);
      const duration = performance.now() - startTime;

      expect(duration).toBeLessThan(10);
      expect(result).toBeDefined();
    });`;
  }

  /**
   * Generates 100 items batch processing test
   * @returns {string} 100 items test code
   */
  private generateBatchTest100(): string {
    return `it('should process 100 items in under 500ms', async () => {
      const items = Array.from({ length: 100 }, (_, i) => \`Item \${i}\`);

      const startTime = performance.now();

      for (const item of items) {
        await instance.process(item);
      }

      const duration = performance.now() - startTime;
      expect(duration).toBeLessThan(500);
    });`;
  }

  /**
   * Generates 1000 items batch processing test
   * @returns {string} 1000 items test code
   */
  private generateBatchTest1000(): string {
    return `it('should process 1000 items in under 2000ms', async () => {
      const items = Array.from({ length: 1000 }, (_, i) => \`Item \${i}\`);

      const startTime = performance.now();

      for (const item of items) {
        await instance.process(item);
      }

      const duration = performance.now() - startTime;
      expect(duration).toBeLessThan(2000);
    });`;
  }

  /**
   * Generates concurrent processing test
   * @returns {string} Concurrent test code
   */
  private generateConcurrentTest(): string {
    return `it('should handle concurrent processing', async () => {
      const items = Array.from({ length: 50 }, (_, i) => \`Item \${i}\`);

      const startTime = performance.now();

      const promises = items.map(item => instance.process(item));
      await Promise.all(promises);

      const duration = performance.now() - startTime;
      expect(duration).toBeLessThan(1000);
    });`;
  }

  /**
   * Generates memory usage tests
   * @returns {string} Memory tests code
   */
  private generateMemoryTests(): string {
    return `  describe('Memory Usage', () => {
    it('should not leak memory during processing', async () => {
      const initialMemory = process.memoryUsage().heapUsed;

      // Process many items
      for (let i = 0; i < 1000; i++) {
        await instance.process(\`Item \${i}\`);
      }

      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }

      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;

      // Memory increase should be reasonable (less than 10MB)
      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024);
    });
  });`;
  }

  /**
   * Generates throughput tests
   * @returns {string} Throughput tests code
   */
  private generateThroughputTests(): string {
    return `  describe('Throughput', () => {
    it('should achieve at least 100 operations per second', async () => {
      const items = Array.from({ length: 100 }, (_, i) => \`Item \${i}\`);

      const startTime = performance.now();

      for (const item of items) {
        await instance.process(item);
      }

      const duration = performance.now() - startTime;
      const throughput = items.length / (duration / 1000);

      expect(throughput).toBeGreaterThan(100);
    });
  });`;
  }

  /**
   * Generates scalability tests
   * @returns {string} Scalability tests code
   */
  private generateScalabilityTests(): string {
    return `  describe('Scalability', () => {
    it('should handle large data efficiently', async () => {
      const largeData = 'x'.repeat(10000); // 10KB string

      const startTime = performance.now();
      const result = await instance.process(largeData);
      const duration = performance.now() - startTime;

      expect(duration).toBeLessThan(50); // Should handle large data quickly
      expect(result).toBeDefined();
    });
  });
});`;
  }
}
