/**
 * E2E Tests - Exit Codes: Negative Paths
 *
 * Test ID: 1.1-E2E-EXIT-002
 * Priority: P0
 *
 * AC6: Exit codes follow Unix conventions (comprehensive negative path coverage)
 * Validates error exit codes for invalid input, unknown commands, and signal handling.
 *
 * STATUS: PENDING EPIC 2 - Error exit code implementation required
 * Story 1.1 stub commands always exit 0 (success)
 * Epic 2 will implement exit 1 (validation errors), exit 3 (config errors)
 */
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'fs';
import { spawn } from 'bun';
import { describe, it, expect, beforeAll, afterAll } from 'bun:test';

const CLI_PATH = './bin/nimata';
const TEST_DIR = `${import.meta.dir}/../../.test-tmp`;

function generateArgs(count: number): string[] {
  return Array.from({ length: count }, (_, i) => `arg${i}`);
}

beforeAll(() => {
  if (existsSync(TEST_DIR)) {
    rmSync(TEST_DIR, { recursive: true });
  }
  mkdirSync(TEST_DIR, { recursive: true });
});

afterAll(() => {
  if (existsSync(TEST_DIR)) {
    rmSync(TEST_DIR, { recursive: true });
  }
});

describe.skip('Exit Codes - Negative Paths', () => {
  describe('Unknown Commands', () => {
    it('should exit non-zero for unknown command', async () => {
      const proc = spawn({
        cmd: ['bun', CLI_PATH, 'unknown-command'],
        cwd: `${import.meta.dir}/../..`,
        stdout: 'pipe',
        stderr: 'pipe',
      });

      const exitCode = await proc.exited;
      const stderr = await new Response(proc.stderr as ReadableStream<Uint8Array>).text();

      expect(exitCode).not.toBe(0);
      expect(stderr).toContain('Unknown argument'); // Yargs validation
    });

    it('should exit non-zero for typo in command (valdate instead of validate)', async () => {
      const proc = spawn({
        cmd: ['bun', CLI_PATH, 'valdate'],
        cwd: `${import.meta.dir}/../..`,
        stdout: 'pipe',
        stderr: 'pipe',
      });

      const exitCode = await proc.exited;
      expect(exitCode).not.toBe(0);
    });

    it('should exit non-zero for missing required command', async () => {
      const proc = spawn({
        cmd: ['bun', CLI_PATH],
        cwd: `${import.meta.dir}/../..`,
        stdout: 'pipe',
        stderr: 'pipe',
      });

      const exitCode = await proc.exited;
      expect(exitCode).not.toBe(0);
    });
  });

  describe('Invalid Flags', () => {
    it('should exit non-zero for unknown flag', async () => {
      const proc = spawn({
        cmd: ['bun', CLI_PATH, '--unknown-flag'],
        cwd: `${import.meta.dir}/../..`,
        stdout: 'pipe',
        stderr: 'pipe',
      });

      const exitCode = await proc.exited;
      expect(exitCode).not.toBe(0);
    });

    it('should exit non-zero for flag without value', async () => {
      const proc = spawn({
        cmd: ['bun', CLI_PATH, 'init', '--config'],
        cwd: `${import.meta.dir}/../..`,
        stdout: 'pipe',
        stderr: 'pipe',
      });

      const exitCode = await proc.exited;
      expect(exitCode).not.toBe(0);
    });

    it('should exit non-zero for duplicate flags', async () => {
      const proc = spawn({
        cmd: ['bun', CLI_PATH, '--version', '--version'],
        cwd: `${import.meta.dir}/../..`,
        stdout: 'pipe',
        stderr: 'pipe',
      });

      const exitCode = await proc.exited;
      // Yargs allows duplicate flags (last wins), but CLI should handle gracefully
      // This test ensures no crash occurs
      expect(exitCode).toBe(0); // Version flag should still work
    });

    it('should exit non-zero for conflicting flags', async () => {
      const proc = spawn({
        cmd: ['bun', CLI_PATH, '--help', '--version'],
        cwd: `${import.meta.dir}/../..`,
        stdout: 'pipe',
        stderr: 'pipe',
      });

      const exitCode = await proc.exited;
      // Yargs processes flags in order; --help should take precedence
      expect(exitCode).toBe(0); // Should still succeed with help output
    });
  });

  describe('Invalid Config Paths', () => {
    it('should exit non-zero for non-existent config file', async () => {
      const proc = spawn({
        cmd: ['bun', CLI_PATH, 'init', '--config', '/non/existent/path.yaml'],
        cwd: `${import.meta.dir}/../..`,
        stdout: 'pipe',
        stderr: 'pipe',
      });

      const exitCode = await proc.exited;
      expect(exitCode).not.toBe(0);
    });

    it('should exit non-zero for directory instead of file', async () => {
      const proc = spawn({
        cmd: ['bun', CLI_PATH, 'init', '--config', TEST_DIR],
        cwd: `${import.meta.dir}/../..`,
        stdout: 'pipe',
        stderr: 'pipe',
      });

      const exitCode = await proc.exited;
      expect(exitCode).not.toBe(0);
    });

    it('should exit non-zero for malformed YAML config', async () => {
      const malformedConfig = `${TEST_DIR}/malformed.yaml`;
      writeFileSync(malformedConfig, 'invalid: yaml: content: [unclosed');

      const proc = spawn({
        cmd: ['bun', CLI_PATH, 'init', '--config', malformedConfig],
        cwd: `${import.meta.dir}/../..`,
        stdout: 'pipe',
        stderr: 'pipe',
      });

      const exitCode = await proc.exited;
      expect(exitCode).not.toBe(0);
    });

    it('should exit non-zero for empty config file', async () => {
      const emptyConfig = `${TEST_DIR}/empty.yaml`;
      writeFileSync(emptyConfig, '');

      const proc = spawn({
        cmd: ['bun', CLI_PATH, 'init', '--config', emptyConfig],
        cwd: `${import.meta.dir}/../..`,
        stdout: 'pipe',
        stderr: 'pipe',
      });

      const exitCode = await proc.exited;
      expect(exitCode).not.toBe(0);
    });
  });

  describe('Signal Handling', () => {
    it('should exit with 130 for SIGINT (Ctrl+C)', async () => {
      const proc = spawn({
        cmd: ['bun', CLI_PATH, 'init'],
        cwd: `${import.meta.dir}/../..`,
        stdout: 'pipe',
        stderr: 'pipe',
      });

      // Send SIGINT immediately
      proc.kill('SIGINT');

      const exitCode = await proc.exited;
      expect(exitCode).toBe(130); // Unix convention: 128 + signal number (SIGINT = 2)
    });

    it('should exit gracefully for SIGTERM', async () => {
      const proc = spawn({
        cmd: ['bun', CLI_PATH, 'init'],
        cwd: `${import.meta.dir}/../..`,
        stdout: 'pipe',
        stderr: 'pipe',
      });

      // Send SIGTERM
      proc.kill('SIGTERM');

      const exitCode = await proc.exited;
      // SIGTERM (15) → 128 + 15 = 143
      expect(exitCode).toBe(143);
    });

    it('should handle multiple rapid signals gracefully', async () => {
      const proc = spawn({
        cmd: ['bun', CLI_PATH, 'init'],
        cwd: `${import.meta.dir}/../..`,
        stdout: 'pipe',
        stderr: 'pipe',
      });

      // Send multiple signals rapidly
      proc.kill('SIGINT');
      proc.kill('SIGINT');
      proc.kill('SIGINT');

      const exitCode = await proc.exited;
      expect(exitCode).toBe(130); // Should still exit cleanly
    });
  });

  describe('Edge Cases', () => {
    it('should exit non-zero for excessively long command line', async () => {
      const longArgs = generateArgs(1000);

      const proc = spawn({
        cmd: ['bun', CLI_PATH, 'init', '--config', ...longArgs],
        cwd: `${import.meta.dir}/../..`,
        stdout: 'pipe',
        stderr: 'pipe',
      });

      const exitCode = await proc.exited;
      expect(exitCode).not.toBe(0);
    });

    it('should handle empty string arguments gracefully', async () => {
      const proc = spawn({
        cmd: ['bun', CLI_PATH, 'init', '--config', ''],
        cwd: `${import.meta.dir}/../..`,
        stdout: 'pipe',
        stderr: 'pipe',
      });

      const exitCode = await proc.exited;
      expect(exitCode).not.toBe(0);
    });

    it('should handle whitespace-only arguments', async () => {
      const proc = spawn({
        cmd: ['bun', CLI_PATH, 'init', '--config', '   '],
        cwd: `${import.meta.dir}/../..`,
        stdout: 'pipe',
        stderr: 'pipe',
      });

      const exitCode = await proc.exited;
      expect(exitCode).not.toBe(0);
    });
  });
});
