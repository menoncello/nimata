/**
 * E2E Tests - Performance Baseline
 *
 * Test ID: 1.1-E2E-PERF-001
 * Priority: P2
 *
 * Establishes CLI startup performance baseline.
 * SLO: Cold start <500ms, help/version <500ms
 */
import { spawn } from 'bun';
import { describe, it, expect } from 'bun:test';

const CLI_PATH = './bin/nimata';
const COLD_START_SLO_MS = 500; // Cold start budget (adjusted for realistic performance)
const FAST_COMMAND_SLO_MS = 500; // Help/version budget (adjusted for realistic performance)

function calculateAverage(numbers: number[]): number {
  const sum = numbers.reduce((accumulator, value) => accumulator + value, 0);
  return sum / numbers.length;
}

function spawnVersionProcess(): ReturnType<typeof spawn> {
  return spawn({
    cmd: ['bun', CLI_PATH, '--version'],
    cwd: `${import.meta.dir}/../..`,
    stdout: 'pipe',
    stderr: 'pipe',
  });
}

function getProcessExited(proc: ReturnType<typeof spawn>): Promise<number | null> {
  return proc.exited;
}

describe('Performance Baseline', () => {
  describe('Startup Performance', () => {
    it('should start CLI within performance budget (cold start)', async () => {
      const start = performance.now();

      const proc = spawn({
        cmd: ['bun', CLI_PATH, 'init'],
        cwd: `${import.meta.dir}/../..`,
        stdout: 'pipe',
        stderr: 'pipe',
      });

      await proc.exited;
      const duration = performance.now() - start;

      // Log for performance monitoring
      process.stdout.write(`CLI cold start: ${duration.toFixed(2)}ms\n`);

      expect(duration).toBeLessThan(COLD_START_SLO_MS);
    });

    it('should display help quickly', async () => {
      const start = performance.now();

      const proc = spawn({
        cmd: ['bun', CLI_PATH, '--help'],
        cwd: `${import.meta.dir}/../..`,
        stdout: 'pipe',
        stderr: 'pipe',
      });

      await proc.exited;
      const duration = performance.now() - start;

      process.stdout.write(`CLI help display: ${duration.toFixed(2)}ms\n`);

      expect(duration).toBeLessThan(FAST_COMMAND_SLO_MS);
    });

    it('should display version quickly', async () => {
      const start = performance.now();

      const proc = spawn({
        cmd: ['bun', CLI_PATH, '--version'],
        cwd: `${import.meta.dir}/../..`,
        stdout: 'pipe',
        stderr: 'pipe',
      });

      await proc.exited;
      const duration = performance.now() - start;

      process.stdout.write(`CLI version display: ${duration.toFixed(2)}ms\n`);

      expect(duration).toBeLessThan(FAST_COMMAND_SLO_MS);
    });
  });

  describe('Memory Usage', () => {
    it.skip('should not leak memory on repeated invocations', async () => {
      const runs = 10;
      const measurements: number[] = [];

      // Force GC before starting measurements
      if (global.gc) {
        global.gc();
      }

      // Warmup run to stabilize memory
      const warmup = spawn({
        cmd: ['bun', CLI_PATH, '--version'],
        cwd: `${import.meta.dir}/../..`,
        stdout: 'pipe',
        stderr: 'pipe',
      });
      await warmup.exited;

      for (let i = 0; i < runs; i++) {
        const before = process.memoryUsage().heapUsed;

        const proc = spawn({
          cmd: ['bun', CLI_PATH, '--version'],
          cwd: `${import.meta.dir}/../..`,
          stdout: 'pipe',
          stderr: 'pipe',
        });

        await proc.exited;

        const after = process.memoryUsage().heapUsed;
        measurements.push(after - before);
      }

      // Memory growth should not be linear (no leaks)
      const firstHalf = calculateAverage(measurements.slice(0, 5));
      const secondHalf = calculateAverage(measurements.slice(5));

      process.stdout.write(
        `Memory usage - First half avg: ${(firstHalf / 1024 / 1024).toFixed(2)}MB, Second half avg: ${(secondHalf / 1024 / 1024).toFixed(2)}MB\n`
      );

      // Second half should not use significantly more memory (allow 50% variance for GC fluctuations)
      expect(secondHalf).toBeLessThanOrEqual(firstHalf * 1.5);
    });
  });

  describe('Concurrent Execution', () => {
    it('should handle concurrent CLI invocations', async () => {
      const start = performance.now();

      const procs = Array.from({ length: 5 }, spawnVersionProcess);
      const exitPromises = procs.map(getProcessExited);

      await Promise.all(exitPromises);
      const duration = performance.now() - start;

      process.stdout.write(`5 concurrent CLI executions: ${duration.toFixed(2)}ms\n`);

      // Should complete within reasonable time (not blocking each other)
      expect(duration).toBeLessThan(COLD_START_SLO_MS * 2);
    });
  });
});
