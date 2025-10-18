/**
 * E2E Tests - Exit Codes
 *
 * AC6: Exit codes follow Unix conventions
 *
 * Note: Story 1.1 implements successful stub execution (exit 0)
 * Full error handling with exit codes 1, 3, 130 will be tested in future stories
 */
import { join } from 'node:path';
import { spawn } from 'bun';
import { describe, it, expect } from 'bun:test';

const CLI_PATH = join(__dirname, '../../bin/nimata');

describe('Exit Codes', () => {
  it('should exit with 0 for successful stub command execution', async () => {
    const proc = spawn({
      cmd: ['bun', CLI_PATH, 'init'],
      cwd: `${import.meta.dir}/../..`,
      stdout: 'pipe',
      stderr: 'pipe',
    });

    const exitCode = await proc.exited;
    expect(exitCode).toBe(0);
  });

  it('should exit with 0 for --help flag', async () => {
    const proc = spawn({
      cmd: ['bun', CLI_PATH, '--help'],
      cwd: `${import.meta.dir}/../..`,
      stdout: 'pipe',
      stderr: 'pipe',
    });

    const exitCode = await proc.exited;
    expect(exitCode).toBe(0);
  });

  it('should exit with 0 for --version flag', async () => {
    const proc = spawn({
      cmd: ['bun', CLI_PATH, '--version'],
      cwd: `${import.meta.dir}/../..`,
      stdout: 'pipe',
      stderr: 'pipe',
    });

    const exitCode = await proc.exited;
    expect(exitCode).toBe(0);
  });

  it('should exit with non-zero for missing command', async () => {
    const proc = spawn({
      cmd: ['bun', CLI_PATH],
      cwd: `${import.meta.dir}/../..`,
      stdout: 'pipe',
      stderr: 'pipe',
    });

    const exitCode = await proc.exited;
    expect(exitCode).not.toBe(0);
  });

  it('should exit with non-zero for unknown command', async () => {
    const proc = spawn({
      cmd: ['bun', CLI_PATH, 'unknown-command'],
      cwd: `${import.meta.dir}/../..`,
      stdout: 'pipe',
      stderr: 'pipe',
    });

    const exitCode = await proc.exited;
    expect(exitCode).not.toBe(0);
  });
});
