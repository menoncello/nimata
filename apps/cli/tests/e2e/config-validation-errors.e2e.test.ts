/**
 * E2E Tests - Configuration Validation Error Messages
 *
 * Test ID: 1.2-E2E-VALIDATION-001
 * Priority: P1
 *
 * Validates that configuration validation errors include:
 * - Clear field paths (e.g., "tools.eslint.configPath")
 * - Actionable error messages
 * - No sensitive data exposure
 * - Proper error formatting
 *
 * STATUS: SKIPPED - Implementation pending for Epic 2 (Validation)
 * Story 1.2 implements configuration loading but not validation with error codes
 */
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'bun';
import { describe, it, expect, beforeEach, afterEach } from 'bun:test';

const CLI_PATH = join(__dirname, '../../bin/nimata');

describe.skip('Configuration Validation Error Messages (P1-2)', () => {
  let testDir: string;

  beforeEach(async () => {
    testDir = join(tmpdir(), `nimata-e2e-validation-${Date.now()}`);
    await mkdir(testDir, { recursive: true });
  });

  afterEach(async () => {
    await rm(testDir, { recursive: true, force: true });
  });

  describe('Path Validation Errors', () => {
    it('should show field path for absolute path violations', async () => {
      const config = `
version: 1
qualityLevel: strict
tools:
  eslint:
    enabled: true
    configPath: /absolute/path/to/eslintrc.json
  typescript:
    enabled: true
    configPath: ./tsconfig.json
`;
      await writeFile(join(testDir, '.nimatarc'), config);

      const proc = spawn({
        cmd: [CLI_PATH, 'init'],
        cwd: testDir,
        stdout: 'pipe',
        stderr: 'pipe',
      });

      const exitCode = await proc.exited;
      const stderr = await new Response(proc.stderr as ReadableStream<Uint8Array>).text();

      expect(exitCode).toBeGreaterThan(0);
      // Should include the specific field path
      expect(stderr).toMatch(/tools\.eslint\.configpath/i);
      // Should indicate absolute path issue
      expect(stderr).toMatch(/absolute path|relative path/i);
      // Should be actionable
      expect(stderr).toMatch(/must be relative|use relative path/i);
    });

    it('should show field path for directory traversal attempts', async () => {
      const config = `
version: 1
qualityLevel: strict
tools:
  eslint:
    enabled: true
    configPath: ../../../etc/passwd
`;
      await writeFile(join(testDir, '.nimatarc'), config);

      const proc = spawn({
        cmd: [CLI_PATH, 'init'],
        cwd: testDir,
        stdout: 'pipe',
        stderr: 'pipe',
      });

      const exitCode = await proc.exited;
      const stderr = await new Response(proc.stderr as ReadableStream<Uint8Array>).text();

      expect(exitCode).toBeGreaterThan(0);
      // Should include the field path
      expect(stderr).toMatch(/tools\.eslint\.configpath/i);
      // Should indicate path traversal issue
      expect(stderr).toMatch(/directory traversal|\.\.\//i);
    });

    it('should show multiple field paths when multiple violations exist', async () => {
      const config = `
version: 1
qualityLevel: strict
tools:
  eslint:
    enabled: true
    configPath: /absolute/eslintrc.json
  typescript:
    enabled: true
    configPath: ../../../etc/tsconfig.json
  prettier:
    enabled: true
    configPath: /absolute/prettier.json
`;
      await writeFile(join(testDir, '.nimatarc'), config);

      const proc = spawn({
        cmd: [CLI_PATH, 'init'],
        cwd: testDir,
        stdout: 'pipe',
        stderr: 'pipe',
      });

      const exitCode = await proc.exited;
      const stderr = await new Response(proc.stderr as ReadableStream<Uint8Array>).text();

      expect(exitCode).toBeGreaterThan(0);
      // Should include all problematic field paths
      expect(stderr).toMatch(/tools\.eslint\.configpath/i);
      expect(stderr).toMatch(/tools\.typescript\.configpath/i);
      expect(stderr).toMatch(/tools\.prettier\.configpath/i);
    });
  });

  describe('Schema Validation Errors', () => {
    it('should show field path for invalid enum values', async () => {
      const config = `
version: 1
qualityLevel: invalid_quality
aiAssistants:
  - invalid_assistant
  - another_invalid
tools:
  eslint:
    enabled: "not_boolean"
`;
      await writeFile(join(testDir, '.nimatarc'), config);

      const proc = spawn({
        cmd: [CLI_PATH, 'init'],
        cwd: testDir,
        stdout: 'pipe',
        stderr: 'pipe',
      });

      const exitCode = await proc.exited;
      const stderr = await new Response(proc.stderr as ReadableStream<Uint8Array>).text();

      expect(exitCode).toBeGreaterThan(0);
      // Should include field paths for invalid values
      expect(stderr).toMatch(/qualitylevel/i);
      expect(stderr).toMatch(/aiassistants/i);
      expect(stderr).toMatch(/tools\.eslint\.enabled/i);
      // Should provide context about valid values
      expect(stderr).toMatch(/invalid|enum|must be/i);
    });

    it('should show field path for type mismatches', async () => {
      const config = `
version: "not_a_number"
qualityLevel: strict
tools:
  eslint:
    enabled: true
    configPath: .eslintrc.json
  prettier:
    enabled: true
    # Missing required fields that should be objects
`;
      await writeFile(join(testDir, '.nimatarc'), config);

      const proc = spawn({
        cmd: [CLI_PATH, 'init'],
        cwd: testDir,
        stdout: 'pipe',
        stderr: 'pipe',
      });

      const exitCode = await proc.exited;
      const stderr = await new Response(proc.stderr as ReadableStream<Uint8Array>).text();

      expect(exitCode).toBeGreaterThan(0);
      // Should identify type issues
      expect(stderr).toMatch(/version/i);
      expect(stderr).toMatch(/number|integer/i);
    });
  });

  describe('Error Message Quality', () => {
    it('should not expose sensitive data in error messages', async () => {
      const config = `
version: 1
qualityLevel: strict
tools:
  eslint:
    enabled: true
    configPath: .eslintrc.json
  # Simulate sensitive data in config
  secretKey: "super-secret-api-key-12345"
  database:
    password: "admin123"
    authToken: "token-abc-123"
`;
      await writeFile(join(testDir, '.nimatarc'), config);

      const proc = spawn({
        cmd: [CLI_PATH, 'init'],
        cwd: testDir,
        stdout: 'pipe',
        stderr: 'pipe',
      });

      await proc.exited;
      const stderr = await new Response(proc.stderr as ReadableStream<Uint8Array>).text();

      // Should not expose sensitive values
      expect(stderr).not.toContain('super-secret-api-key-12345');
      expect(stderr).not.toContain('admin123');
      expect(stderr).not.toContain('token-abc-123');

      // But should reference field paths
      expect(stderr).toMatch(/secretkey|database|authtoken/i);
    });

    it('should provide actionable error messages', async () => {
      const config = `
version: 1
qualityLevel: strict
tools:
  eslint:
    enabled: true
    configPath: /absolute/path/file.json
`;
      await writeFile(join(testDir, '.nimatarc'), config);

      const proc = spawn({
        cmd: [CLI_PATH, 'init'],
        cwd: testDir,
        stdout: 'pipe',
        stderr: 'pipe',
      });

      const exitCode = await proc.exited;
      const stderr = await new Response(proc.stderr as ReadableStream<Uint8Array>).text();

      expect(exitCode).toBeGreaterThan(0);
      // Error should be actionable
      expect(stderr).toMatch(/tools\.eslint\.configpath/i);
      expect(stderr).toMatch(/absolute|relative/i);
      // Should suggest a solution
      expect(stderr).toMatch(/use relative|must be relative/i);
    });

    it('should maintain consistent error message format', async () => {
      // Test different error types for consistency
      const configs = [
        {
          name: 'absolute path',
          content: `
version: 1
tools:
  eslint:
    configPath: /absolute/path.json
`,
        },
        {
          name: 'invalid enum',
          content: `
version: 1
qualityLevel: invalid_level
`,
        },
        {
          name: 'type mismatch',
          content: `
version: "not_a_number"
`,
        },
      ];

      for (const { content } of configs) {
        await writeFile(join(testDir, '.nimatarc'), content);

        const proc = spawn({
          cmd: [CLI_PATH, 'init'],
          cwd: testDir,
          stdout: 'pipe',
          stderr: 'pipe',
        });

        const exitCode = await proc.exited;
        const stderr = await new Response(proc.stderr as ReadableStream<Uint8Array>).text();

        expect(exitCode).toBeGreaterThan(0);
        // Should reference config file
        expect(stderr).toMatch(/\.nimatarc/i);
        // Should include error context
        expect(stderr.length).toBeGreaterThan(10);

        // Clean up for next iteration
        await rm(join(testDir, '.nimatarc'));
      }
    });
  });

  describe('Error Recovery and Help', () => {
    it('should suggest checking config file when validation fails', async () => {
      const config = `
version: 1
qualityLevel: strict
tools:
  eslint:
    enabled: true
    configPath: /absolute/path.json
`;
      await writeFile(join(testDir, '.nimatarc'), config);

      const proc = spawn({
        cmd: [CLI_PATH, 'init'],
        cwd: testDir,
        stdout: 'pipe',
        stderr: 'pipe',
      });

      const exitCode = await proc.exited;
      const stderr = await new Response(proc.stderr as ReadableStream<Uint8Array>).text();

      expect(exitCode).toBeGreaterThan(0);
      // Should reference the config file
      expect(stderr).toMatch(/\.nimatarc/i);
      // Should suggest reviewing the config
      expect(stderr).toMatch(/check|review|fix|invalid/i);
    });
  });
});
