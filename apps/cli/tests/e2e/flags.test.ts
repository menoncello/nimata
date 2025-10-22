/**
 * E2E Tests - Flags and Options
 *
 * AC3: Argument parsing handles flags and options
 * AC4: Help text displays for each command
 * AC5: Version number displays correctly
 */
import { spawn } from 'bun';
import { describe, it, expect } from 'bun:test';

const CLI_PATH = './bin/nimata';

describe('CLI Flags', () => {
  it('should display help with --help flag', async () => {
    const proc = spawn({
      cmd: ['bun', CLI_PATH, '--help'],
      cwd: `${import.meta.dir}/../..`,
      stdout: 'pipe',
      stderr: 'pipe',
    });

    const exitCode = await proc.exited;
    const stdout = await new Response(proc.stdout as ReadableStream<Uint8Array>).text();

    expect(stdout).toContain('nimata');
    expect(stdout).toContain('Commands:');
    expect(stdout).toContain('init');
    expect(stdout).toContain('validate');
    expect(stdout).toContain('fix');
    expect(stdout).toContain('prompt');
    expect(exitCode).toBe(0);
  });

  it('should display help with -h flag', async () => {
    const proc = spawn({
      cmd: ['bun', CLI_PATH, '-h'],
      cwd: `${import.meta.dir}/../..`,
      stdout: 'pipe',
      stderr: 'pipe',
    });

    const exitCode = await proc.exited;
    const stdout = await new Response(proc.stdout as ReadableStream<Uint8Array>).text();

    expect(stdout).toContain('nimata');
    expect(stdout).toContain('Commands:');
    expect(exitCode).toBe(0);
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

    expect(stdout).toMatch(/^(?:\d{1,3}\.){2}\d{1,3}$/m); // Matches version pattern (e.g., 0.1.0)
    expect(exitCode).toBe(0);
  });

  it('should display version with -v flag', async () => {
    const proc = spawn({
      cmd: ['bun', CLI_PATH, '-v'],
      cwd: `${import.meta.dir}/../..`,
      stdout: 'pipe',
      stderr: 'pipe',
    });

    const exitCode = await proc.exited;
    const stdout = await new Response(proc.stdout as ReadableStream<Uint8Array>).text();

    expect(stdout).toMatch(/^(?:\d{1,3}\.){2}\d{1,3}$/m);
    expect(exitCode).toBe(0);
  });

  it('should pass config flag to init command', async () => {
    const proc = spawn({
      cmd: ['bun', CLI_PATH, 'init', '--config', 'custom.json'],
      cwd: `${import.meta.dir}/../..`,
      stdout: 'pipe',
      stderr: 'pipe',
    });

    await proc.exited;
    const stdout = await new Response(proc.stdout as ReadableStream<Uint8Array>).text();
    const stderr = await new Response(proc.stderr as ReadableStream<Uint8Array>).text();
    const output = stdout + stderr;

    expect(output).toContain('custom.json');
  });

  it('should pass config flag with -c alias', async () => {
    const proc = spawn({
      cmd: ['bun', CLI_PATH, 'init', '-c', 'test.json'],
      cwd: `${import.meta.dir}/../..`,
      stdout: 'pipe',
      stderr: 'pipe',
    });

    await proc.exited;
    const stdout = await new Response(proc.stdout as ReadableStream<Uint8Array>).text();
    const stderr = await new Response(proc.stderr as ReadableStream<Uint8Array>).text();
    const output = stdout + stderr;

    expect(output).toContain('test.json');
  });
});
