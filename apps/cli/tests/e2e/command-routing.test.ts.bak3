/**
 * E2E Tests - Command Routing
 *
 * AC2: Command routing supports subcommands
 */
import { spawn } from 'bun';
import { describe, it, expect } from 'bun:test';

const CLI_PATH = './bin/nimata';

describe('Command Routing', () => {
  it('should route to init command', async () => {
    const proc = spawn({
      cmd: ['bun', CLI_PATH, 'init'],
      cwd: `${import.meta.dir}/../..`,
      stdout: 'pipe',
      stderr: 'pipe',
    });

    const exitCode = await proc.exited;
    const stdout = await new Response(proc.stdout).text();

    expect(stdout).toContain('init command');
    expect(stdout).toContain('Not implemented yet');
    expect(exitCode).toBe(0);
  });

  it('should route to validate command', async () => {
    const proc = spawn({
      cmd: ['bun', CLI_PATH, 'validate'],
      cwd: `${import.meta.dir}/../..`,
      stdout: 'pipe',
      stderr: 'pipe',
    });

    const exitCode = await proc.exited;
    const stdout = await new Response(proc.stdout).text();

    expect(stdout).toContain('validate command');
    expect(stdout).toContain('Not implemented yet');
    expect(exitCode).toBe(0);
  });

  it('should route to fix command', async () => {
    const proc = spawn({
      cmd: ['bun', CLI_PATH, 'fix'],
      cwd: `${import.meta.dir}/../..`,
      stdout: 'pipe',
      stderr: 'pipe',
    });

    const exitCode = await proc.exited;
    const stdout = await new Response(proc.stdout).text();

    expect(stdout).toContain('fix command');
    expect(stdout).toContain('Not implemented yet');
    expect(exitCode).toBe(0);
  });

  it('should route to prompt command', async () => {
    const proc = spawn({
      cmd: ['bun', CLI_PATH, 'prompt'],
      cwd: `${import.meta.dir}/../..`,
      stdout: 'pipe',
      stderr: 'pipe',
    });

    const exitCode = await proc.exited;
    const stdout = await new Response(proc.stdout).text();

    expect(stdout).toContain('prompt command');
    expect(stdout).toContain('Not implemented yet');
    expect(exitCode).toBe(0);
  });

  it('should reject unknown commands', async () => {
    const proc = spawn({
      cmd: ['bun', CLI_PATH, 'unknown'],
      cwd: `${import.meta.dir}/../..`,
      stdout: 'pipe',
      stderr: 'pipe',
    });

    const exitCode = await proc.exited;
    const stderr = await new Response(proc.stderr).text();

    expect(stderr).toContain('Unknown');
    expect(exitCode).not.toBe(0);
  });
});
