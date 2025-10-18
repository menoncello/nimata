/**
 * E2E Tests - Init Command
 *
 * Tests for `nimata init` command using:
 * - CLI executor helper for command execution
 * - File assertion helpers for verification
 * - Test project factories for setup
 */
import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { executeCLI } from './support/helpers/cli-executor';
import { createTempDirectory, cleanupTempDirectory } from './support/helpers/file-assertions';

describe('nimata init (E2E)', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDirectory();
  });

  afterEach(async () => {
    await cleanupTempDirectory(tempDir);
  });

  it('should display help when --help flag is used', async () => {
    const result = await executeCLI({
      args: ['init', '--help'],
      cwd: tempDir,
    });

    expect(result.exitCode).toBe(0);
    expect(result.output).toContain('init');
    expect(result.output).toContain('Initialize');
  });

  it('should display global help when no command provided', async () => {
    const result = await executeCLI({
      args: ['--help'],
      cwd: tempDir,
    });

    expect(result.exitCode).toBe(0);
    expect(result.output).toContain('Commands');
  });
});
