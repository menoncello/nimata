/**
 * E2E Tests - Validate Command
 *
 * Tests for `nimata validate` command using test project factories
 */
import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { executeCLI } from './support/helpers/cli-executor';
import { createTempDirectory, cleanupTempDirectory } from './support/helpers/file-assertions';

describe('nimata validate (E2E)', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDirectory();
  });

  afterEach(async () => {
    await cleanupTempDirectory(tempDir);
  });

  it('should display help when --help flag is used', async () => {
    const result = await executeCLI({
      args: ['validate', '--help'],
      cwd: tempDir,
    });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('validate');
  });
});
