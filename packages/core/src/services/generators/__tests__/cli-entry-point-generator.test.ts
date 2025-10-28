/**
 * CLI Entry Point Generator Tests
 *
 * Comprehensive tests for CLI entry point generation functionality
 */

import { promises as fs } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { CliEntryPointGenerator } from '../cli/cli-entry-point-generator.js';

describe('CliEntryPointGenerator', () => {
  let generator: CliEntryPointGenerator;
  let testBaseDir: string;

  beforeEach(async () => {
    generator = new CliEntryPointGenerator();
    // Create a temporary directory for each test
    testBaseDir = join(
      tmpdir(),
      `cli-gen-test-${Date.now()}-${Math.random().toString(36).slice(2)}`
    );
    await fs.mkdir(testBaseDir, { recursive: true });
  });

  afterEach(async () => {
    // Clean up the temporary directory after each test
    try {
      await fs.rm(testBaseDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  });

  describe('generateCliEntryPoint', () => {
    it('should create CLI entry point file with correct structure', async () => {
      // Given
      const cliName = 'my-cli';

      // When
      await generator.generateCliEntryPoint(testBaseDir, cliName);

      // Then
      const cliPath = join(testBaseDir, 'bin', cliName);
      const stat = await fs.stat(cliPath);
      expect(stat.isFile()).toBe(true);
      expect(stat.mode & 0o111).toBeGreaterThan(0); // Should be executable

      const content = await fs.readFile(cliPath, 'utf-8');
      expect(content).toContain('#!/usr/bin/env bun');
      expect(content).toContain(cliName);
      expect(content).toContain('cliEntryPoint');
    });

    it('should create bin directory if it does not exist', async () => {
      // Given
      const cliName = 'test-cli';

      // When
      await generator.generateCliEntryPoint(testBaseDir, cliName);

      // Then
      const binDir = join(testBaseDir, 'bin');
      const binStat = await fs.stat(binDir);
      expect(binStat.isDirectory()).toBe(true);

      const cliPath = join(binDir, cliName);
      const cliStat = await fs.stat(cliPath);
      expect(cliStat.isFile()).toBe(true);
    });

    it('should use existing bin directory if it exists', async () => {
      // Given
      const cliName = 'existing-cli';
      const binDir = join(testBaseDir, 'bin');
      await fs.mkdir(binDir, { recursive: true });

      // When
      await generator.generateCliEntryPoint(testBaseDir, cliName);

      // Then
      const cliPath = join(binDir, cliName);
      const stat = await fs.stat(cliPath);
      expect(stat.isFile()).toBe(true);
    });

    it('should generate valid JavaScript/TypeScript content', async () => {
      // Given
      const cliName = 'valid-cli';

      // When
      await generator.generateCliEntryPoint(testBaseDir, cliName);

      // Then
      const cliPath = join(testBaseDir, 'bin', cliName);
      const content = await fs.readFile(cliPath, 'utf-8');

      // Should contain all required functions
      expect(content).toContain('function cliEntryPoint');
      expect(content).toContain('function showHelp');
      expect(content).toContain('function handleCliError');

      // Should contain error handling
      expect(content).toContain("process.on('uncaughtException'");
      expect(content).toContain("process.on('unhandledRejection'");

      // Should contain entry point call
      expect(content).toContain('cliEntryPoint();');
    });

    it('should handle CLI names with special characters', async () => {
      // Given
      const cliName = 'my-special-cli';

      // When
      await generator.generateCliEntryPoint(testBaseDir, cliName);

      // Then
      const cliPath = join(testBaseDir, 'bin', cliName);
      const content = await fs.readFile(cliPath, 'utf-8');
      expect(content).toContain(cliName);
    });

    it('should handle CLI names with numbers', async () => {
      // Given
      const cliName = 'cli123';

      // When
      await generator.generateCliEntryPoint(testBaseDir, cliName);

      // Then
      const cliPath = join(testBaseDir, 'bin', cliName);
      const content = await fs.readFile(cliPath, 'utf-8');
      expect(content).toContain(cliName);
    });

    it('should propagate filesystem errors', async () => {
      // Given
      const cliName = 'error-cli';
      // Make the base directory read-only to cause an error
      await fs.chmod(testBaseDir, 0o444);

      // When/Then
      await expect(generator.generateCliEntryPoint(testBaseDir, cliName)).rejects.toThrow(
        'Failed to create CLI entry point'
      );

      // Cleanup
      await fs.chmod(testBaseDir, 0o755);
    });

    it('should handle CLI names with hyphens and underscores', async () => {
      // Given
      const cliNames = ['my-cli-tool', 'my_cli_tool', 'cli-tool_123'];

      for (const cliName of cliNames) {
        // When
        await generator.generateCliEntryPoint(testBaseDir, cliName);

        // Then
        const cliPath = join(testBaseDir, 'bin', cliName);
        const content = await fs.readFile(cliPath, 'utf-8');
        expect(content).toContain(cliName);
      }
    });
  });

  describe('CLI content generation', () => {
    it('should generate proper shebang line', async () => {
      // Given
      const cliName = 'shebang-cli';

      // When
      await generator.generateCliEntryPoint(testBaseDir, cliName);

      // Then
      const cliPath = join(testBaseDir, 'bin', cliName);
      const content = await fs.readFile(cliPath, 'utf-8');
      expect(content).toMatch(/^#!\/usr\/bin\/env bun$/m);
    });

    it('should generate file header with correct metadata', async () => {
      // Given
      const cliName = 'header-cli';

      // When
      await generator.generateCliEntryPoint(testBaseDir, cliName);

      // Then
      const cliPath = join(testBaseDir, 'bin', cliName);
      const content = await fs.readFile(cliPath, 'utf-8');
      expect(content).toContain(`${cliName} CLI Entry Point`);
      expect(content).toContain('Main CLI launcher');
      expect(content).toContain('@author Your Name');
      expect(content).toContain('@license MIT');
      expect(content).toContain('@version 1.0.0');
    });

    it('should generate comprehensive error handlers', async () => {
      // Given
      const cliName = 'error-cli';

      // When
      await generator.generateCliEntryPoint(testBaseDir, cliName);

      // Then
      const cliPath = join(testBaseDir, 'bin', cliName);
      const content = await fs.readFile(cliPath, 'utf-8');

      // Should have uncaught exception handler
      expect(content).toContain("process.on('uncaughtException'");
      expect(content).toContain("console.error('Uncaught Exception:'");
      expect(content).toContain("process.env.NODE_ENV === 'development'");

      // Should have unhandled rejection handler
      expect(content).toContain("process.on('unhandledRejection'");
      expect(content).toContain("console.error('Unhandled Rejection at:'");
      expect(content).toContain('process.exit(1)');
    });

    it('should generate main CLI entry point function with argument parsing', async () => {
      // Given
      const cliName = 'main-cli';

      // When
      await generator.generateCliEntryPoint(testBaseDir, cliName);

      // Then
      const cliPath = join(testBaseDir, 'bin', cliName);
      const content = await fs.readFile(cliPath, 'utf-8');

      // Should have proper function signature
      expect(content).toContain('async function cliEntryPoint(): Promise<void>');

      // Should parse command line arguments
      expect(content).toContain('const args = process.argv.slice(2)');

      // Should handle help argument
      expect(content).toContain("if (args.includes('--help'))");
      expect(content).toContain("showHelp('");

      // Should handle version argument
      expect(content).toContain("if (args.includes('--version'))");
      expect(content).toContain(`${cliName} version 1.0.0`);

      // Should handle no arguments case
      expect(content).toContain('if (args.length === 0)');
      expect(content).toContain("showHelp('");
    });

    it('should generate show help function', async () => {
      // Given
      const cliName = 'help-cli';

      // When
      await generator.generateCliEntryPoint(testBaseDir, cliName);

      // Then
      const cliPath = join(testBaseDir, 'bin', cliName);
      const content = await fs.readFile(cliPath, 'utf-8');

      // Should have proper function signature
      expect(content).toContain('function showHelp(cliName: string): void');

      // Should display help information
      expect(content).toContain(`${cliName} - CLI Tool`);
      expect(content).toContain(`Usage: ${cliName} [options]`);
      expect(content).toContain('--help     Show this help message');
      expect(content).toContain('--version  Show version information');
    });

    it('should generate CLI error handling function', async () => {
      // Given
      const cliName = 'handle-cli';

      // When
      await generator.generateCliEntryPoint(testBaseDir, cliName);

      // Then
      const cliPath = join(testBaseDir, 'bin', cliName);
      const content = await fs.readFile(cliPath, 'utf-8');

      // Should have proper function signature
      expect(content).toContain('function handleCliError(error: unknown, cliName: string): void');

      // Should handle different error types
      expect(content).toContain('if (error instanceof Error)');
      expect(content).toContain('console.error(error.message)');

      // Should show stack trace in development
      expect(content).toContain("process.env.NODE_ENV === 'development' || process.env.VERBOSE");
      expect(content).toContain('console.error(error.stack)');

      // Should exit with error code
      expect(content).toContain('process.exit(1)');
    });

    it('should include entry point call at the end', async () => {
      // Given
      const cliName = 'entry-cli';

      // When
      await generator.generateCliEntryPoint(testBaseDir, cliName);

      // Then
      const cliPath = join(testBaseDir, 'bin', cliName);
      const content = await fs.readFile(cliPath, 'utf-8');

      // Should call the entry point function
      expect(content).toContain('cliEntryPoint();');
      // Should be at the end of the file
      expect(content.trim().endsWith('cliEntryPoint();')).toBe(true);
    });
  });

  describe('Generated CLI functionality', () => {
    it('should create CLI that can be executed (basic smoke test)', async () => {
      // Given
      const cliName = 'executable-cli';

      // When
      await generator.generateCliEntryPoint(testBaseDir, cliName);

      // Then - Basic checks that the generated CLI has expected structure
      const cliPath = join(testBaseDir, 'bin', cliName);
      const content = await fs.readFile(cliPath, 'utf-8');

      // Should be a complete, runnable script
      expect(content).toContain('#!/usr/bin/env bun');
      expect(content).toContain('cliEntryPoint();');

      // Should have all required functions defined before use
      const lines = content.split('\n');
      const cliEntryPointIndex = lines.findIndex((line) => line.includes('function cliEntryPoint'));
      const showHelpIndex = lines.findIndex((line) => line.includes('function showHelp'));
      const handleCliErrorIndex = lines.findIndex((line) =>
        line.includes('function handleCliError')
      );
      const entryPointCallIndex = lines.findIndex((line) => line.includes('cliEntryPoint();'));

      expect(cliEntryPointIndex).toBeGreaterThanOrEqual(0);
      expect(showHelpIndex).toBeGreaterThanOrEqual(0);
      expect(handleCliErrorIndex).toBeGreaterThanOrEqual(0);
      expect(entryPointCallIndex).toBeGreaterThan(cliEntryPointIndex);
      expect(entryPointCallIndex).toBeGreaterThan(showHelpIndex);
      expect(entryPointCallIndex).toBeGreaterThan(handleCliErrorIndex);
    });

    it('should handle CLI name substitution throughout the file', async () => {
      // Given
      const cliName = 'substitution-test-cli';

      // When
      await generator.generateCliEntryPoint(testBaseDir, cliName);

      // Then
      const cliPath = join(testBaseDir, 'bin', cliName);
      const content = await fs.readFile(cliPath, 'utf-8');

      // Should substitute CLI name in multiple places
      const occurrences = (content.match(new RegExp(cliName, 'g')) || []).length;
      expect(occurrences).toBeGreaterThan(3); // Should appear in header, help, version, and error handling
    });

    it('should generate consistent formatting and structure', async () => {
      // Given
      const cliName = 'format-test-cli';

      // When
      await generator.generateCliEntryPoint(testBaseDir, cliName);

      // Then
      const cliPath = join(testBaseDir, 'bin', cliName);
      const content = await fs.readFile(cliPath, 'utf-8');

      // Should have proper line endings (no \r characters)
      expect(content).not.toContain('\r');

      // Should have consistent spacing and structure
      expect(content).toContain('\n\n'); // Should have some blank lines for readability
      expect(content).toContain('  '); // Should have indentation

      // Should not have excessive empty lines
      const lines = content.split('\n');
      const consecutiveEmptyLines = lines.reduce((max, line, index) => {
        if (line.trim() === '') {
          const currentEmpty = (lines[index - 1] || '').trim() === '' ? max + 1 : 1;
          return Math.max(max, currentEmpty);
        }
        return max;
      }, 0);
      expect(consecutiveEmptyLines).toBeLessThan(3); // Should not have more than 2 consecutive empty lines
    });
  });

  describe('Error handling and edge cases', () => {
    it('should handle very long CLI names', async () => {
      // Given
      const longCliName = 'a'.repeat(100);

      // When
      await generator.generateCliEntryPoint(testBaseDir, longCliName);

      // Then
      const cliPath = join(testBaseDir, 'bin', longCliName);
      const content = await fs.readFile(cliPath, 'utf-8');
      expect(content).toContain(longCliName);
    });

    it('should handle CLI names with different character sets', async () => {
      // Given
      const cliNames = ['тест-cli', '测试-cli', 'テスト-cli'];

      for (const cliName of cliNames) {
        // When
        await generator.generateCliEntryPoint(testBaseDir, cliName);

        // Then
        const cliPath = join(testBaseDir, 'bin', cliName);
        const content = await fs.readFile(cliPath, 'utf-8');
        expect(content).toContain(cliName);
      }
    });

    it('should handle single character CLI name', async () => {
      // Given
      const singleCharName = 'a';

      // When
      await generator.generateCliEntryPoint(testBaseDir, singleCharName);

      // Then
      const cliPath = join(testBaseDir, 'bin', singleCharName);
      const stat = await fs.stat(cliPath);
      expect(stat.isFile()).toBe(true);
      const content = await fs.readFile(cliPath, 'utf-8');
      expect(content).toContain(singleCharName);
    });

    it('should handle CLI name with only numbers', async () => {
      // Given
      const numericCliName = '12345';

      // When
      await generator.generateCliEntryPoint(testBaseDir, numericCliName);

      // Then
      const cliPath = join(testBaseDir, 'bin', numericCliName);
      const content = await fs.readFile(cliPath, 'utf-8');
      expect(content).toContain(numericCliName);
    });

    it('should handle permission errors when creating directories', async () => {
      // Given
      const cliName = 'permission-cli';
      const binDir = join(testBaseDir, 'bin');
      await fs.mkdir(binDir, { recursive: true });
      await fs.chmod(binDir, 0o444); // Make read-only

      // When/Then
      await expect(generator.generateCliEntryPoint(testBaseDir, cliName)).rejects.toThrow(
        'Failed to create CLI entry point'
      );

      // Cleanup
      await fs.chmod(binDir, 0o755);
    });

    it('should handle permission errors when writing files', async () => {
      // Given
      const cliName = 'write-permission-cli';
      const binDir = join(testBaseDir, 'bin');
      await fs.mkdir(binDir, { recursive: true });
      const cliPath = join(binDir, cliName);
      // Create a read-only file to cause write error
      await fs.writeFile(cliPath, 'existing', { mode: 0o444 });

      // When/Then
      await expect(generator.generateCliEntryPoint(testBaseDir, cliName)).rejects.toThrow(
        'Failed to create CLI entry point'
      );

      // Cleanup
      await fs.chmod(cliPath, 0o644);
    });
  });
});
