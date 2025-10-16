/**
 * E2E Tests - CLI Execution
 *
 * AC1: CLI entry point executes successfully
 */
import { spawn } from 'bun';
import { describe, it, expect } from 'bun:test';

const CLI_PATH = './bin/nimata';

describe('CLI Execution', () => {
  it('should execute CLI without errors when no args provided', async () => {
    const proc = spawn({
      cmd: ['bun', CLI_PATH],
      cwd: `${import.meta.dir}/../..`,
      stdout: 'pipe',
      stderr: 'pipe',
    });

    const exitCode = await proc.exited;
    const stderr = await new Response(proc.stderr).text();

    // CLI should show help when no command is provided
    expect(stderr).toContain('You must specify a command');
    expect(exitCode).toBe(1); // Yargs exits with 1 when command is missing
  });

  it('should display CLI usage information', async () => {
    const proc = spawn({
      cmd: ['bun', CLI_PATH],
      cwd: `${import.meta.dir}/../..`,
      stdout: 'pipe',
      stderr: 'pipe',
    });

    await proc.exited;
    const stderr = await new Response(proc.stderr).text();

    expect(stderr).toContain('nimata');
    expect(stderr).toContain('command');
  });
});
