/**
 * E2E Tests - Per-Command Help
 *
 * AC4: Help text displays for each command
 */
import { spawn } from 'bun';
import { describe, it, expect } from 'bun:test';

const CLI_PATH = './bin/nimata';

describe('Per-Command Help', () => {
  it('should display help for init command', async () => {
    const proc = spawn({
      cmd: ['bun', CLI_PATH, 'init', '--help'],
      cwd: `${import.meta.dir}/../..`,
      stdout: 'pipe',
      stderr: 'pipe',
    });

    const exitCode = await proc.exited;
    const stdout = await new Response(proc.stdout as ReadableStream<Uint8Array>).text();

    expect(stdout).toContain('init');
    expect(stdout).toContain('Initialize');
    expect(stdout).toContain('--config');
    expect(exitCode).toBe(0);
  });

  it('should display help for validate command', async () => {
    const proc = spawn({
      cmd: ['bun', CLI_PATH, 'validate', '--help'],
      cwd: `${import.meta.dir}/../..`,
      stdout: 'pipe',
      stderr: 'pipe',
    });

    const exitCode = await proc.exited;
    const stdout = await new Response(proc.stdout as ReadableStream<Uint8Array>).text();

    expect(stdout).toContain('validate');
    expect(stdout).toContain('Validate');
    expect(stdout).toContain('--config');
    expect(stdout).toContain('--fix');
    expect(exitCode).toBe(0);
  });

  it('should display help for fix command', async () => {
    const proc = spawn({
      cmd: ['bun', CLI_PATH, 'fix', '--help'],
      cwd: `${import.meta.dir}/../..`,
      stdout: 'pipe',
      stderr: 'pipe',
    });

    const exitCode = await proc.exited;
    const stdout = await new Response(proc.stdout as ReadableStream<Uint8Array>).text();

    expect(stdout).toContain('fix');
    expect(stdout).toContain('fix');
    expect(stdout).toContain('--config');
    expect(stdout).toContain('--interactive');
    expect(exitCode).toBe(0);
  });

  it('should display help for prompt command', async () => {
    const proc = spawn({
      cmd: ['bun', CLI_PATH, 'prompt', '--help'],
      cwd: `${import.meta.dir}/../..`,
      stdout: 'pipe',
      stderr: 'pipe',
    });

    const exitCode = await proc.exited;
    const stdout = await new Response(proc.stdout as ReadableStream<Uint8Array>).text();

    expect(stdout).toContain('prompt');
    expect(stdout).toContain('Generate');
    expect(stdout).toContain('--config');
    expect(stdout).toContain('--output');
    expect(exitCode).toBe(0);
  });
});
