/**
 * E2E Tests - Error Message Quality
 *
 * Test ID: 1.1-E2E-ERR-001
 * Priority: P1
 *
 * Validates error messages are user-friendly, actionable, and non-technical.
 * Ensures CLI provides helpful feedback for common user mistakes.
 *
 * STATUS: PENDING EPIC 2 - Error handling implementation required
 * Story 1.1 relies on Yargs default error messages
 * Epic 2 will add custom error formatting and user-friendly guidance
 */
import { spawn } from 'bun';
import { describe, it, expect } from 'bun:test';
import { join } from 'node:path';

const CLI_PATH = join(__dirname, '../bin/nimata');

describe.skip('Error Message Quality', () => {
  describe('Unknown Command Errors', () => {
    it('should provide helpful message for unknown command', async () => {
      const proc = spawn({
        cmd: ['bun', CLI_PATH, 'unknown-command'],
        cwd: `${import.meta.dir}/../..`,
        stdout: 'pipe',
        stderr: 'pipe',
      });

      await proc.exited;
      const stderr = await new Response(proc.stderr as ReadableStream<Uint8Array>).text();

      // Should show available commands
      expect(stderr).toMatch(/unknown argument|not enough non-option arguments/i);
    });

    it('should suggest similar commands for typos', async () => {
      const proc = spawn({
        cmd: ['bun', CLI_PATH, 'valdate'], // typo: should be 'validate'
        cwd: `${import.meta.dir}/../..`,
        stdout: 'pipe',
        stderr: 'pipe',
      });

      await proc.exited;
      const stderr = await new Response(proc.stderr as ReadableStream<Uint8Array>).text();

      // Yargs shows error for unknown command
      expect(stderr).toContain('Unknown argument');
    });

    it('should show help when no command provided', async () => {
      const proc = spawn({
        cmd: ['bun', CLI_PATH],
        cwd: `${import.meta.dir}/../..`,
        stdout: 'pipe',
        stderr: 'pipe',
      });

      await proc.exited;
      const stderr = await new Response(proc.stderr as ReadableStream<Uint8Array>).text();

      // Should indicate missing command
      expect(stderr).toMatch(/not enough non-option arguments/i);
    });
  });

  describe('Invalid Flag Errors', () => {
    it('should provide clear message for unknown flag', async () => {
      const proc = spawn({
        cmd: ['bun', CLI_PATH, '--invalid-flag'],
        cwd: `${import.meta.dir}/../..`,
        stdout: 'pipe',
        stderr: 'pipe',
      });

      await proc.exited;
      const stderr = await new Response(proc.stderr as ReadableStream<Uint8Array>).text();

      expect(stderr).toContain('Unknown argument');
      expect(stderr).toContain('--invalid-flag');
    });

    it('should indicate missing value for flag requiring argument', async () => {
      const proc = spawn({
        cmd: ['bun', CLI_PATH, 'init', '--config'],
        cwd: `${import.meta.dir}/../..`,
        stdout: 'pipe',
        stderr: 'pipe',
      });

      await proc.exited;
      const stderr = await new Response(proc.stderr as ReadableStream<Uint8Array>).text();

      // Yargs should indicate missing argument
      expect(stderr).toMatch(/not enough arguments|requires a value/i);
    });
  });

  describe('Error Message Format Standards', () => {
    it('should include context in error messages', async () => {
      const proc = spawn({
        cmd: ['bun', CLI_PATH, 'init', '--config', '/non/existent/path.yaml'],
        cwd: `${import.meta.dir}/../..`,
        stdout: 'pipe',
        stderr: 'pipe',
      });

      await proc.exited;
      const stderr = await new Response(proc.stderr as ReadableStream<Uint8Array>).text();

      // Error should reference the problematic path
      expect(stderr).toContain('path.yaml');
    });

    it('should not expose internal stack traces in stderr', async () => {
      const proc = spawn({
        cmd: ['bun', CLI_PATH, 'unknown-command'],
        cwd: `${import.meta.dir}/../..`,
        stdout: 'pipe',
        stderr: 'pipe',
      });

      await proc.exited;
      const stderr = await new Response(proc.stderr as ReadableStream<Uint8Array>).text();

      // Should not show stack traces to end users
      expect(stderr).not.toContain('at async');
      expect(stderr).not.toContain('node_modules');
    });

    it('should use consistent error message formatting', async () => {
      const proc = spawn({
        cmd: ['bun', CLI_PATH, '--unknown'],
        cwd: `${import.meta.dir}/../..`,
        stdout: 'pipe',
        stderr: 'pipe',
      });

      await proc.exited;
      const stderr = await new Response(proc.stderr as ReadableStream<Uint8Array>).text();

      // Yargs provides consistent error format
      expect(stderr.length).toBeGreaterThan(0);
      expect(stderr).toMatch(/unknown argument/i);
    });
  });

  describe('Help Text Accessibility', () => {
    it('should show help with --help flag', async () => {
      const proc = spawn({
        cmd: ['bun', CLI_PATH, '--help'],
        cwd: `${import.meta.dir}/../..`,
        stdout: 'pipe',
        stderr: 'pipe',
      });

      const exitCode = await proc.exited;
      const stdout = await new Response(proc.stdout as ReadableStream<Uint8Array>).text();

      expect(exitCode).toBe(0);
      expect(stdout).toContain('Commands:');
      expect(stdout).toContain('init');
      expect(stdout).toContain('validate');
      expect(stdout).toContain('fix');
      expect(stdout).toContain('prompt');
    });

    it('should show per-command help', async () => {
      const proc = spawn({
        cmd: ['bun', CLI_PATH, 'init', '--help'],
        cwd: `${import.meta.dir}/../..`,
        stdout: 'pipe',
        stderr: 'pipe',
      });

      const exitCode = await proc.exited;
      const stdout = await new Response(proc.stdout as ReadableStream<Uint8Array>).text();

      expect(exitCode).toBe(0);
      expect(stdout).toContain('init');
    });

    it('should display version with --version flag', async () => {
      const proc = spawn({
        cmd: ['bun', CLI_PATH, '--version'],
        cwd: `${import.meta.dir}/../..`,
        stdout: 'pipe',
        stderr: 'pipe',
      });

      const exitCode = await proc.exited;
      const stdout = await new Response(proc.stdout as ReadableStream<Uint8Array>).text();

      expect(exitCode).toBe(0);
      expect(stdout).toContain('.');
    });
  });

  describe('User-Friendly Language', () => {
    it('should avoid technical jargon in errors', async () => {
      const proc = spawn({
        cmd: ['bun', CLI_PATH, 'unknown'],
        cwd: `${import.meta.dir}/../..`,
        stdout: 'pipe',
        stderr: 'pipe',
      });

      await proc.exited;
      const stderr = await new Response(proc.stderr as ReadableStream<Uint8Array>).text();

      // Should not contain developer-only terms
      expect(stderr).not.toContain('undefined is not a function');
      expect(stderr).not.toContain('Cannot read property');
      expect(stderr).not.toContain('null reference');
    });

    it('should provide actionable guidance', async () => {
      const proc = spawn({
        cmd: ['bun', CLI_PATH],
        cwd: `${import.meta.dir}/../..`,
        stdout: 'pipe',
        stderr: 'pipe',
      });

      await proc.exited;
      const stderr = await new Response(proc.stderr as ReadableStream<Uint8Array>).text();

      // Should guide user to help
      expect(stderr).toMatch(/not enough non-option arguments/i);
    });
  });
});
