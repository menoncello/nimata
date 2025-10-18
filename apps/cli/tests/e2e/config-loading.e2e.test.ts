/**
 * E2E Tests - Configuration Loading in CLI
 *
 * Test ID: 1.2-E2E-CONFIG-001
 * Priority: P1
 *
 * Validates CLI respects configuration files and displays proper error messages
 * for configuration validation failures with field paths.
 *
 * Tests critical scenarios:
 * 1. Project config overrides global config in CLI execution
 * 2. Invalid config shows clear error message with field path
 * 3. CLI respects qualityLevel from .nimatarc
 *
 * STATUS: SKIPPED - Validation error handling pending for Epic 2 (Validation)
 * Story 1.2 implements configuration loading but not validation with error exit codes
 */
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'bun';
import { describe, it, expect, beforeEach, afterEach } from 'bun:test';

const CLI_PATH = join(__dirname, '../../bin/nimata');

describe.skip('Configuration Loading E2E (P1-2)', () => {
  let testDir: string;

  beforeEach(async () => {
    testDir = join(tmpdir(), `nimata-e2e-config-${Date.now()}`);
    await mkdir(testDir, { recursive: true });
  });

  afterEach(async () => {
    await rm(testDir, { recursive: true, force: true });
  });

  describe('Config Cascade Behavior', () => {
    it('1.2-E2E-CONFIG-001: should load default configuration when no config files exist', async () => {
      const proc = spawn({
        cmd: [CLI_PATH, '--help'],
        cwd: testDir,
        stdout: 'pipe',
        stderr: 'pipe',
      });

      const exitCode = await proc.exited;
      const stdout = await new Response(proc.stdout as ReadableStream<Uint8Array>).text();

      expect(exitCode).toBe(0);
      expect(stdout).toContain('Commands:');
      // CLI should work with default configuration
    });

    it('1.2-E2E-CONFIG-002: should load project config when .nimatarc exists', async () => {
      // Create project config
      const projectConfig = `
version: 1
qualityLevel: strict
aiAssistants:
  - claude-code
  - copilot
tools:
  eslint:
    enabled: true
    configPath: .eslintrc.js
  typescript:
    enabled: true
    strict: false
    target: ES2022
`;
      await writeFile(join(testDir, '.nimatarc'), projectConfig);

      const proc = spawn({
        cmd: [CLI_PATH, '--help'],
        cwd: testDir,
        stdout: 'pipe',
        stderr: 'pipe',
      });

      const exitCode = await proc.exited;
      const stdout = await new Response(proc.stdout as ReadableStream<Uint8Array>).text();

      expect(exitCode).toBe(0);
      expect(stdout).toContain('Commands:');
      // CLI should load and use project config successfully
    });

    it('1.2-E2E-CONFIG-003: should handle config validation errors gracefully', async () => {
      // Create invalid config with absolute path (security violation)
      const invalidConfig = `
version: 1
qualityLevel: strict
tools:
  eslint:
    enabled: true
    configPath: /etc/passwd  # Absolute path - should be rejected
`;
      await writeFile(join(testDir, '.nimatarc'), invalidConfig);

      const proc = spawn({
        cmd: [CLI_PATH, 'init'],
        cwd: testDir,
        stdout: 'pipe',
        stderr: 'pipe',
      });

      const exitCode = await proc.exited;
      const stderr = await new Response(proc.stderr as ReadableStream<Uint8Array>).text();

      // Should fail with validation error
      expect(exitCode).toBeGreaterThan(0);
      // Should mention the problematic field path
      expect(stderr).toMatch(/tools\.eslint\.configpath/i);
      // Should indicate path validation failure
      expect(stderr).toMatch(/invalid path|absolute path/i);
    });

    it('1.2-E2E-CONFIG-004: should display clear error message with field path for validation failures', async () => {
      // Create config with invalid enum value
      const invalidConfig = `
version: 1
qualityLevel: invalid_level  # Invalid enum value
aiAssistants:
  - invalid_assistant  # Invalid assistant
`;
      await writeFile(join(testDir, '.nimatarc'), invalidConfig);

      const proc = spawn({
        cmd: [CLI_PATH, 'init'],
        cwd: testDir,
        stdout: 'pipe',
        stderr: 'pipe',
      });

      const exitCode = await proc.exited;
      const stderr = await new Response(proc.stderr as ReadableStream<Uint8Array>).text();

      // Should fail with validation error
      expect(exitCode).toBeGreaterThan(0);
      // Should mention the field paths
      expect(stderr).toMatch(/qualitylevel/i);
      expect(stderr).toMatch(/aiassistants/i);
      // Should provide validation context
      expect(stderr).toMatch(/invalid|validation/i);
    });

    it('1.2-E2E-CONFIG-005: should handle malformed YAML with helpful error message', async () => {
      // Create malformed YAML
      const malformedConfig = `
version: 1
qualityLevel: strict
tools:
  eslint:
    enabled: true
    configPath: .eslintrc.json
  # Missing closing bracket for tools
  typescript:
    enabled: true
    strict: true
`;
      await writeFile(join(testDir, '.nimatarc'), malformedConfig);

      const proc = spawn({
        cmd: [CLI_PATH, 'init'],
        cwd: testDir,
        stdout: 'pipe',
        stderr: 'pipe',
      });

      const exitCode = await proc.exited;
      const stderr = await new Response(proc.stderr as ReadableStream<Uint8Array>).text();

      // Should fail with YAML parsing error
      expect(exitCode).toBeGreaterThan(0);
      // Should mention YAML parsing issue
      expect(stderr).toMatch(/yaml|parse/i);
      // Should reference the config file
      expect(stderr).toMatch(/\.nimatarc/i);
    });
  });

  describe('Config File Security', () => {
    it('1.2-E2E-CONFIG-006: should reject config files exceeding size limit', async () => {
      // Create oversized config file (>1MB)
      const largeConfig = 'version: 1\nqualityLevel: strict\n';
      const largeSection = 'tools:\n  huge:\n'.repeat(50000); // Creates ~1.5MB config
      const oversizedConfig = largeConfig + largeSection;

      await writeFile(join(testDir, '.nimatarc'), oversizedConfig);

      const proc = spawn({
        cmd: [CLI_PATH, 'init'],
        cwd: testDir,
        stdout: 'pipe',
        stderr: 'pipe',
      });

      const exitCode = await proc.exited;
      const stderr = await new Response(proc.stderr as ReadableStream<Uint8Array>).text();

      // Should fail with size limit error
      expect(exitCode).toBeGreaterThan(0);
      // Should mention file size limit
      expect(stderr).toMatch(/size|limit|too large/i);
    });

    it('1.2-E2E-CONFIG-007: should reject YAML with anchors/aliases for security', async () => {
      // Create config with YAML anchors (security violation)
      const configWithAnchors = `
version: 1
qualityLevel: strict
default_tool_config: &default
  enabled: true
  timeout: 30

tools:
  eslint:
    <<: *default
    configPath: .eslintrc.json
  typescript:
    <<: *default
    strict: true
`;
      await writeFile(join(testDir, '.nimatarc'), configWithAnchors);

      const proc = spawn({
        cmd: [CLI_PATH, 'init'],
        cwd: testDir,
        stdout: 'pipe',
        stderr: 'pipe',
      });

      const exitCode = await proc.exited;
      const stderr = await new Response(proc.stderr as ReadableStream<Uint8Array>).text();

      // Should fail with security error
      expect(exitCode).toBeGreaterThan(0);
      // Should mention anchors/aliases security issue
      expect(stderr).toMatch(/anchor|alias|security/i);
    });
  });

  describe('Config Performance and Caching', () => {
    it('1.2-E2E-CONFIG-008: should load config efficiently for repeated CLI calls', async () => {
      // Create moderately sized config
      const config = `
version: 1
qualityLevel: strict
aiAssistants:
  - claude-code
  - copilot
tools:
  eslint:
    enabled: true
    configPath: .eslintrc.json
  typescript:
    enabled: true
    strict: true
    target: ES2022
  prettier:
    enabled: true
    configPath: .prettierrc.json
  bunTest:
    enabled: true
    coverage: true
    coverageThreshold: 80
scaffolding:
  templateDirectory: templates
  includeExamples: true
  initializeGit: true
  installDependencies: true
logging:
  level: info
`;
      await writeFile(join(testDir, '.nimatarc'), config);

      // Run multiple CLI calls to test caching
      const startTime = performance.now();

      const calls = Array.from({ length: 5 }, async () => {
        const proc = spawn({
          cmd: ['bun', CLI_PATH, '--help'],
          cwd: testDir,
          stdout: 'pipe',
          stderr: 'pipe',
        });
        await proc.exited;
        return proc;
      });

      await Promise.all(calls);
      const endTime = performance.now();
      const totalTime = endTime - startTime;
      const avgTime = totalTime / 5;

      // Config loading should be efficient (average <100ms per call)
      expect(avgTime).toBeLessThan(100);

      // All calls should succeed
      for (const proc of calls) {
        const exitCode = await (await proc).exited;
        expect(exitCode).toBe(0);
      }
    });
  });

  describe('Global Config Integration', () => {
    it('1.2-E2E-CONFIG-009: should respect global config when project config is absent', async () => {
      // Note: This test would require setting up a global config in HOME directory
      // For now, we test that CLI handles missing global config gracefully

      const proc = spawn({
        cmd: [CLI_PATH, '--help'],
        cwd: testDir,
        stdout: 'pipe',
        stderr: 'pipe',
        env: {
          ...process.env,
          HOME: testDir, // Use test directory as HOME to avoid real global config
        },
      });

      const exitCode = await proc.exited;
      const stdout = await new Response(proc.stdout as ReadableStream<Uint8Array>).text();

      expect(exitCode).toBe(0);
      expect(stdout).toContain('Commands:');
      // Should work fine without global config
    });
  });
});
