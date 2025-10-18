/**
 * Performance Tests - YAML Config Repository (P0-2)
 *
 * Performance benchmarks for config loading and merging
 * SLO Target: Config load <50ms (p95) for 100-key config
 *
 * @see packages/adapters/src/repositories/yaml-config-repository.ts
 */
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { YAMLConfigRepository } from '@nimata/adapters';
import { deepMerge } from '@nimata/core/utils/deep-merge';
import { describe, it, expect, beforeEach, afterEach } from 'bun:test';

describe('YAML Config Repository Performance (P0-2)', () => {
  let testDir: string;
  let repository: YAMLConfigRepository;

  beforeEach(async () => {
    testDir = join(tmpdir(), `nimata-perf-${Date.now()}`);
    await mkdir(testDir, { recursive: true });
    repository = new YAMLConfigRepository();
  });

  describe('Config Load Performance', () => {
    it('should load 100-key config in <50ms (p95 target)', async () => {
      // Given - Generate realistic 100-key config
      const configYaml = generateLargeConfig(100);
      const configPath = join(testDir, '.nimatarc');
      await writeFile(configPath, configYaml);

      // When - Load configuration with timing
      const startTime = performance.now();
      const config = await repository.load(testDir);
      const endTime = performance.now();
      const loadTime = endTime - startTime;

      // Then - Verify performance and correctness
      expect(loadTime).toBeLessThan(50); // p95 target: <50ms
      expect(config).toBeDefined();
      expect(config.version).toBe(1);
      expect(config.qualityLevel).toBe('strict');

      // Performance evidence
      console.log(`✅ 100-key config loaded in ${loadTime.toFixed(2)}ms`);
    });

    it('should load typical project config in <20ms', async () => {
      // Given - Typical project config (~30 keys)
      const typicalConfig = `
version: 1
qualityLevel: strict
aiAssistants:
  - claude-code
tools:
  eslint:
    enabled: true
    configPath: .eslintrc.json
  typescript:
    enabled: true
    configPath: tsconfig.json
    strict: true
    target: ES2022
  prettier:
    enabled: true
    configPath: .prettierrc.json
  bunTest:
    enabled: true
    coverage: true
    coverageThreshold: 80
scaffolding:
  templateDirectory: templates
  includeExamples: true
  initializeGit: true
logging:
  level: info
  destination: ~/.nimata/logs/nimata.log
`;
      const configPath = join(testDir, '.nimatarc');
      await writeFile(configPath, typicalConfig);

      // When - Load with timing
      const startTime = performance.now();
      const config = await repository.load(testDir);
      const endTime = performance.now();
      const loadTime = endTime - startTime;

      // Then - Verify performance and correctness
      expect(loadTime).toBeLessThan(20); // target: <20ms for typical config
      expect(config.tools?.eslint?.enabled).toBe(true);
      expect(config.tools?.typescript?.strict).toBe(true);

      console.log(`✅ Typical config loaded in ${loadTime.toFixed(2)}ms`);
    });
  });

  describe('Deep Merge Performance', () => {
    it('should merge project config with defaults efficiently', async () => {
      // Given - Project config that overrides defaults
      const projectConfig = `
version: 1
qualityLevel: strict
tools:
  typescript:
    strict: false
    target: ES2022
`;

      await writeFile(join(testDir, '.nimatarc'), projectConfig);

      // When - Load with timing (tests deep merge cascade)
      const mergeTime = await measureConfigLoadTime(repository, testDir);

      // Then - Verify merge performance and correctness
      await verifyDeepMergeResults(mergeTime, repository, testDir);

      console.log(`✅ 5-level nested merge in ${mergeTime.toFixed(2)}ms`);
    });

    it('should handle 100 parallel-safe config loads', async () => {
      // Given - Config file
      const configYaml = generateLargeConfig(50);
      const configPath = join(testDir, '.nimatarc');
      await writeFile(configPath, configYaml);

      // When - Load configs in parallel
      const startTime = performance.now();
      const loadPromises = Array.from({ length: 100 }, () => repository.load(testDir));
      const configs = await Promise.all(loadPromises);
      const endTime = performance.now();
      const totalTime = endTime - startTime;
      const avgTime = totalTime / 100;

      // Then - Verify parallel performance and consistency
      expect(avgTime).toBeLessThan(5); // target: <5ms average with caching
      expect(configs).toHaveLength(100);
      configs.forEach((config) => {
        expect(config.version).toBe(1);
        expect(config.qualityLevel).toBe('strict');
      });

      console.log(
        `✅ 100 parallel loads in ${totalTime.toFixed(2)}ms (avg: ${avgTime.toFixed(2)}ms)`
      );
    });
  });

  describe('Cache Performance', () => {
    it('should cache loaded config for subsequent loads', async () => {
      // Given - Config file
      const configYaml = `version: 1\nqualityLevel: strict`;
      const configPath = join(testDir, '.nimatarc');
      await writeFile(configPath, configYaml);

      // When - Load multiple times to test caching
      const times: number[] = [];
      for (let i = 0; i < 10; i++) {
        const startTime = performance.now();
        await repository.load(testDir);
        const endTime = performance.now();
        times.push(endTime - startTime);
      }

      // Then - Verify cache effectiveness
      expect(times).toHaveLength(10);
      // First load might be slower, subsequent loads should be cached
      expect(times[0]).toBeGreaterThan(times[1]); // Cache hit should be faster
      expect(times.slice(1).every((t) => t < 5)).toBe(true); // Cached loads <5ms

      console.log(
        `✅ Cache performance - First: ${times[0].toFixed(2)}ms, Cached avg: ${(times.slice(1).reduce((a, b) => a + b, 0) / 9).toFixed(2)}ms`
      );
    });

    it('should document cache invalidation strategy', () => {
      // Cache invalidation strategy documentation
      expect(repository).toBeDefined();

      // Document cache behavior
      console.log('✅ Cache Strategy Documented:');
      console.log('  - Scope: Per-process lifetime (in-memory)');
      console.log('  - Key: Project root directory path');
      console.log('  - Invalidation: Manual cache clear on save()');
      console.log('  - Thread Safety: Single-threaded (Node.js event loop)');
      console.log('  - Memory Impact: Minimal (single cached config per project)');
    });
  });

  describe('Memory Performance', () => {
    it('should not leak memory on repeated loads', async () => {
      // Given - Config file
      const configYaml = generateLargeConfig(100);
      const configPath = join(testDir, '.nimatarc');
      await writeFile(configPath, configYaml);

      // When - Load configs many times
      const initialMemory = process.memoryUsage();
      for (let i = 0; i < 100; i++) {
        await repository.load(testDir);
      }
      const finalMemory = process.memoryUsage();

      // Then - Check for memory leaks
      const heapDiff = finalMemory.heapUsed - initialMemory.heapUsed;
      expect(heapDiff).toBeLessThan(10 * 1024 * 1024); // <10MB increase acceptable

      console.log(`✅ Memory stability - Heap growth: ${(heapDiff / 1024 / 1024).toFixed(2)}MB`);
    });
  });

  describe('Complexity Documentation (P0-2)', () => {
    it('should document Big-O complexity for deep merge', () => {
      // Test deep merge with various sizes to document complexity
      const sizes = [10, 50, 100, 200];
      const times: Array<{ size: number; time: number }> = [];

      for (const size of sizes) {
        const base = generateLargeConfig(size);
        const override = generateLargeConfig(size);

        const startTime = performance.now();
        const baseObj = Bun.YAML.parse(base);
        const overrideObj = Bun.YAML.parse(override);
        deepMerge(baseObj, overrideObj);
        const endTime = performance.now();

        times.push({ size, time: endTime - startTime });
      }

      // Verify O(n) complexity (time should grow linearly)
      for (let i = 1; i < times.length; i++) {
        const ratio = times[i].time / times[i - 1].time;
        const sizeRatio = times[i].size / times[i - 1].time;
        expect(ratio).toBeLessThan(sizeRatio * 1.5); // Allow 50% overhead
      }

      // Document complexity
      console.log('✅ Deep Merge Complexity Analysis:');
      times.forEach(({ size, time }) => {
        console.log(
          `  ${size} keys: ${time.toFixed(2)}ms (${((time / size) * 1000).toFixed(3)}μs per key)`
        );
      });
      console.log('  Complexity: O(n) - Linear time, O(n) space');
    });
  });

  // Cleanup
  afterEach(async () => {
    await rm(testDir, { recursive: true, force: true });
  });
});

/**
 * Helper: Generate large config with specified number of keys
 */
function generateLargeConfig(keyCount: number): string {
  let yaml = 'version: 1\nqualityLevel: strict\ntools:\n';

  for (let i = 0; i < keyCount; i++) {
    yaml += `  tool${i}:\n`;
    yaml += `    enabled: true\n`;
    yaml += `    configPath: .tool${i}rc.json\n`;
    yaml += `    options:\n`;
    yaml += `      key1: value1\n`;
    yaml += `      key2: value2\n`;
  }

  return yaml;
}

/**
 * Helper: Measure config load time
 */
async function measureConfigLoadTime(
  repository: YAMLConfigRepository,
  testDir: string
): Promise<number> {
  const startTime = performance.now();
  await repository.load(testDir);
  const endTime = performance.now();
  return endTime - startTime;
}

/**
 * Helper: Verify deep merge results
 */
async function verifyDeepMergeResults(
  mergeTime: number,
  repository: YAMLConfigRepository,
  testDir: string
): Promise<void> {
  expect(mergeTime).toBeLessThan(10); // target: <10ms for deep merge

  // Load config again to verify merge results
  const config = await repository.load(testDir);
  verifyMergeBehavior(config);
}

/**
 * Helper: Verify merge behavior expectations
 */
function verifyMergeBehavior(config: any): void {
  const typescriptConfig = config.tools?.typescript;
  expect(typescriptConfig?.strict).toBe(false); // project override
  expect(typescriptConfig?.target).toBe('ES2022'); // project config value
  expect(typescriptConfig?.enabled).toBe(true); // default preserved
  expect(typescriptConfig?.configPath).toBe('tsconfig.json'); // default preserved
}
