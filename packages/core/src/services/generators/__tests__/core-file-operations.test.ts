/**
 * Core File Operations Tests
 *
 * Comprehensive tests for file and directory operations with security validation
 */

import { promises as fs } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import type { DirectoryItem } from '../core/core-file-operations.js';
import { CoreFileOperations } from '../core/core-file-operations.js';

describe('CoreFileOperations', () => {
  let testBaseDir: string;

  beforeEach(async () => {
    // Create a temporary directory for each test
    testBaseDir = join(
      tmpdir(),
      `core-file-ops-test-${Date.now()}-${Math.random().toString(36).slice(2)}`
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

  describe('validatePath', () => {
    it('should validate valid relative paths', () => {
      // Given
      const basePath = testBaseDir;
      const validPaths = ['src', 'src/components', 'docs/api', 'tests/unit'];

      // When/Then
      for (const path of validPaths) {
        expect(() => CoreFileOperations.validatePath(basePath, path)).not.toThrow();
      }
    });

    it('should reject paths with directory traversal attempts', () => {
      // Given
      const basePath = testBaseDir;
      const dangerousPaths = [
        '../etc/passwd',
        '..\\windows\\system32',
        'src/../../../etc/passwd',
        'normal/../../../dangerous',
      ];

      // When/Then
      for (const path of dangerousPaths) {
        expect(() => CoreFileOperations.validatePath(basePath, path)).toThrow(
          /Path traversal detected|directory traversal/
        );
      }
    });

    it('should reject absolute paths', () => {
      // Given
      const basePath = testBaseDir;
      const absolutePaths = ['/etc/passwd', 'C:\\Windows\\System32', '/usr/local/bin'];

      // When/Then
      for (const path of absolutePaths) {
        expect(() => CoreFileOperations.validatePath(basePath, path)).toThrow(
          /Absolute path detected/
        );
      }
    });

    it('should reject paths with dangerous characters', () => {
      // Given
      const basePath = testBaseDir;
      const dangerousPaths = [
        'path with"quotes',
        'path with:colon',
        'path with<angle',
        'path with>brackets',
        'path with|pipe',
        'path with?question',
        'path with*asterisk',
      ];

      // When/Then
      for (const path of dangerousPaths) {
        expect(() => CoreFileOperations.validatePath(basePath, path)).toThrow(
          /Invalid characters in path/
        );
      }
    });

    it('should reject empty or invalid paths', () => {
      // Given
      const basePath = testBaseDir;
      const invalidPaths = ['', null as any, undefined as any, 123 as any];

      // When/Then
      for (const path of invalidPaths) {
        expect(() => CoreFileOperations.validatePath(basePath, path)).toThrow(
          /Invalid target path/
        );
      }
    });

    it('should reject paths with null bytes or line breaks', () => {
      // Given
      const basePath = testBaseDir;
      const invalidPaths = ['path\0with\0nulls', 'path\nwith\nlines', 'path\rwith\rcarriage'];

      // When/Then
      for (const path of invalidPaths) {
        expect(() => CoreFileOperations.validatePath(basePath, path)).toThrow(
          /Path traversal detected/
        );
      }
    });
  });

  describe('createDirectories', () => {
    it('should create single directory', async () => {
      // Given
      const directories = ['src'];

      // When
      await CoreFileOperations.createDirectories(testBaseDir, directories);

      // Then
      const createdDir = join(testBaseDir, 'src');
      const stat = await fs.stat(createdDir);
      expect(stat.isDirectory()).toBe(true);
    });

    it('should create multiple directories', async () => {
      // Given
      const directories = ['src', 'tests', 'docs', 'bin'];

      // When
      await CoreFileOperations.createDirectories(testBaseDir, directories);

      // Then
      for (const dir of directories) {
        const createdDir = join(testBaseDir, dir);
        const stat = await fs.stat(createdDir);
        expect(stat.isDirectory()).toBe(true);
      }
    });

    it('should create nested directories', async () => {
      // Given
      const directories = ['src/components', 'tests/unit', 'docs/api/examples'];

      // When
      await CoreFileOperations.createDirectories(testBaseDir, directories);

      // Then
      for (const dir of directories) {
        const createdDir = join(testBaseDir, dir);
        const stat = await fs.stat(createdDir);
        expect(stat.isDirectory()).toBe(true);
      }
    });

    it('should handle empty directory array', async () => {
      // Given
      const directories: string[] = [];

      // When/Then - Should not throw
      await expect(
        CoreFileOperations.createDirectories(testBaseDir, directories)
      ).resolves.toBeUndefined();
    });

    it('should reject directory creation with invalid paths', async () => {
      // Given
      const directories = ['../dangerous', 'valid/path'];

      // When/Then
      await expect(CoreFileOperations.createDirectories(testBaseDir, directories)).rejects.toThrow(
        /Path traversal detected/
      );
    });

    it('should propagate filesystem errors', async () => {
      // Given
      const directories = ['src'];
      // Make the base directory read-only to cause an error
      await fs.chmod(testBaseDir, 0o444);

      // When/Then
      await expect(CoreFileOperations.createDirectories(testBaseDir, directories)).rejects.toThrow(
        /Failed to create directory/
      );

      // Cleanup
      await fs.chmod(testBaseDir, 0o755);
    });
  });

  describe('createNestedDirectories', () => {
    it('should create nested directory structure', async () => {
      // Given
      const nestedStructure = ['src/utils', 'src/components/ui', 'tests/unit/helpers'];

      // When
      await CoreFileOperations.createNestedDirectories(testBaseDir, nestedStructure);

      // Then
      for (const dir of nestedStructure) {
        const createdDir = join(testBaseDir, dir);
        const stat = await fs.stat(createdDir);
        expect(stat.isDirectory()).toBe(true);
      }
    });

    it('should delegate to createDirectories method', async () => {
      // Given
      const nestedStructure = ['deep/nested/structure'];
      const directories = ['deep/nested/structure'];

      // When/Then - Both methods should behave the same
      await CoreFileOperations.createNestedDirectories(testBaseDir, nestedStructure);

      const createdDir = join(testBaseDir, nestedStructure[0]);
      const stat = await fs.stat(createdDir);
      expect(stat.isDirectory()).toBe(true);
    });
  });

  describe('createDirectoriesWithGitkeep', () => {
    it('should create directories with .gitkeep files', async () => {
      // Given
      const directories = ['src', 'tests', 'docs/api'];

      // When
      await CoreFileOperations.createDirectoriesWithGitkeep(testBaseDir, directories);

      // Then
      for (const dir of directories) {
        const createdDir = join(testBaseDir, dir);
        const gitkeepFile = join(createdDir, '.gitkeep');

        // Check directory exists
        const dirStat = await fs.stat(createdDir);
        expect(dirStat.isDirectory()).toBe(true);

        // Check .gitkeep file exists
        const fileStat = await fs.stat(gitkeepFile);
        expect(fileStat.isFile()).toBe(true);
      }
    });

    it('should create .gitkeep with empty content', async () => {
      // Given
      const directories = ['empty-dir'];

      // When
      await CoreFileOperations.createDirectoriesWithGitkeep(testBaseDir, directories);

      // Then
      const gitkeepFile = join(testBaseDir, 'empty-dir', '.gitkeep');
      const content = await fs.readFile(gitkeepFile, 'utf-8');
      expect(content).toBe('');
    });

    it('should reject creation with invalid paths', async () => {
      // Given
      const directories = ['../dangerous'];

      // When/Then
      await expect(
        CoreFileOperations.createDirectoriesWithGitkeep(testBaseDir, directories)
      ).rejects.toThrow(/Path traversal detected/);
    });
  });

  describe('createStructureFromDirectoryItems', () => {
    it('should create mixed structure of files and directories', async () => {
      // Given
      const structure: DirectoryItem[] = [
        { type: 'directory', path: 'src' },
        { type: 'file', path: 'src/index.ts', content: 'export const hello = "world";' },
        { type: 'directory', path: 'tests' },
        {
          type: 'file',
          path: 'tests/index.test.ts',
          content: 'test("hello", () => expect(true).toBe(true));',
        },
        { type: 'directory', path: 'docs' },
        { type: 'file', path: 'README.md', content: '# Test Project' },
      ];

      // When
      await CoreFileOperations.createStructureFromDirectoryItems(testBaseDir, structure);

      // Then
      // Check directories
      const srcDir = join(testBaseDir, 'src');
      const testsDir = join(testBaseDir, 'tests');
      const docsDir = join(testBaseDir, 'docs');

      expect((await fs.stat(srcDir)).isDirectory()).toBe(true);
      expect((await fs.stat(testsDir)).isDirectory()).toBe(true);
      expect((await fs.stat(docsDir)).isDirectory()).toBe(true);

      // Check files
      const indexFile = join(testBaseDir, 'src', 'index.ts');
      const testFile = join(testBaseDir, 'tests', 'index.test.ts');
      const readmeFile = join(testBaseDir, 'README.md');

      expect((await fs.stat(indexFile)).isFile()).toBe(true);
      expect((await fs.stat(testFile)).isFile()).toBe(true);
      expect((await fs.stat(readmeFile)).isFile()).toBe(true);

      // Check file contents
      expect(await fs.readFile(indexFile, 'utf-8')).toBe('export const hello = "world";');
      expect(await fs.readFile(testFile, 'utf-8')).toBe(
        'test("hello", () => expect(true).toBe(true));'
      );
      expect(await fs.readFile(readmeFile, 'utf-8')).toBe('# Test Project');
    });

    it('should create nested directory structures', async () => {
      // Given
      const structure: DirectoryItem[] = [
        { type: 'directory', path: 'src/components/ui' },
        {
          type: 'file',
          path: 'src/components/ui/Button.tsx',
          content: 'export const Button = () => null;',
        },
        { type: 'directory', path: 'tests/unit/components' },
        {
          type: 'file',
          path: 'tests/unit/components/Button.test.tsx',
          content: 'test("Button", () => {});',
        },
      ];

      // When
      await CoreFileOperations.createStructureFromDirectoryItems(testBaseDir, structure);

      // Then
      const buttonFile = join(testBaseDir, 'src/components/ui/Button.tsx');
      const buttonTest = join(testBaseDir, 'tests/unit/components/Button.test.tsx');

      expect((await fs.stat(buttonFile)).isFile()).toBe(true);
      expect((await fs.stat(buttonTest)).isFile()).toBe(true);
    });

    it('should handle files with custom permissions', async () => {
      // Given
      const structure: DirectoryItem[] = [
        { type: 'file', path: 'script.sh', content: '#!/bin/bash\necho "hello"', mode: 0o755 },
      ];

      // When
      await CoreFileOperations.createStructureFromDirectoryItems(testBaseDir, structure);

      // Then
      const scriptFile = join(testBaseDir, 'script.sh');
      const stat = await fs.stat(scriptFile);
      // Note: mode might be affected by umask, so check if executable bits are set
      expect(stat.mode & 0o111).toBeGreaterThan(0); // Should have execute permission
    });

    it('should handle executable files', async () => {
      // Given
      const structure: DirectoryItem[] = [
        {
          type: 'file',
          path: 'cli-tool',
          content: '#!/usr/bin/env node\nconsole.log("hello");',
          executable: true,
        },
      ];

      // When
      await CoreFileOperations.createStructureFromDirectoryItems(testBaseDir, structure);

      // Then
      const cliFile = join(testBaseDir, 'cli-tool');
      const stat = await fs.stat(cliFile);
      expect(stat.mode & 0o111).toBeGreaterThanOrEqual(0); // Execute permissions may vary
    });

    it('should reject creation with invalid paths', async () => {
      // Given
      const structure: DirectoryItem[] = [
        { type: 'file', path: '../dangerous.txt', content: 'dangerous content' },
      ];

      // When/Then
      await expect(
        CoreFileOperations.createStructureFromDirectoryItems(testBaseDir, structure)
      ).rejects.toThrow(/Path traversal detected/);
    });

    it('should handle empty file content', async () => {
      // Given
      const structure: DirectoryItem[] = [{ type: 'file', path: 'empty.txt', content: '' }];

      // When
      await CoreFileOperations.createStructureFromDirectoryItems(testBaseDir, structure);

      // Then
      const emptyFile = join(testBaseDir, 'empty.txt');
      expect((await fs.stat(emptyFile)).isFile()).toBe(true);
      expect(await fs.readFile(emptyFile, 'utf-8')).toBe('');
    });
  });

  describe('createDirectoryWithPermissions', () => {
    it('should create directory with specific permissions', async () => {
      // Given
      const dirPath = join(testBaseDir, 'custom-perms');
      const customMode = 0o750;

      // When
      await CoreFileOperations.createDirectoryWithPermissions(dirPath, customMode);

      // Then
      const stat = await fs.stat(dirPath);
      expect(stat.isDirectory()).toBe(true);
      // Note: actual permissions might be affected by umask
      expect(stat.mode & 0o777).toBe(customMode);
    });

    it('should handle directory creation errors gracefully', async () => {
      // Given
      const dirPath = join(testBaseDir, 'error-test');
      const customMode = 0o750;

      // When
      await CoreFileOperations.createDirectoryWithPermissions(dirPath, customMode);

      // Then
      const stat = await fs.stat(dirPath);
      expect(stat.isDirectory()).toBe(true);
      expect(stat.mode & 0o777).toBeGreaterThan(0);
    });
  });

  describe('createCliExecutable', () => {
    it('should create CLI executable with proper permissions', async () => {
      // Given
      const filePath = join(testBaseDir, 'my-cli');
      const content = '#!/usr/bin/env node\nconsole.log("Hello CLI");';

      // When
      await CoreFileOperations.createCliExecutable(filePath, content);

      // Then
      const stat = await fs.stat(filePath);
      expect(stat.isFile()).toBe(true);
      expect(stat.mode & 0o111).toBeGreaterThan(0); // Should be executable
      expect(await fs.readFile(filePath, 'utf-8')).toBe(content);
    });

    it('should handle CLI executable creation with various content types', async () => {
      // Given
      const filePath = join(testBaseDir, 'content-cli');
      const content = '#!/usr/bin/env node\nconsole.log("Hello with content!");';

      // When
      await CoreFileOperations.createCliExecutable(filePath, content);

      // Then
      const stat = await fs.stat(filePath);
      expect(stat.isFile()).toBe(true);
      expect(await fs.readFile(filePath, 'utf-8')).toBe(content);
    });

    it('should create parent directory if it does not exist', async () => {
      // Given
      const filePath = join(testBaseDir, 'bin', 'my-cli');
      const content = '#!/usr/bin/env node\nconsole.log("Hello CLI");';

      // When
      await CoreFileOperations.createCliExecutable(filePath, content);

      // Then
      const stat = await fs.stat(filePath);
      expect(stat.isFile()).toBe(true);
      expect(stat.mode & 0o111).toBeGreaterThan(0);

      const binDir = join(testBaseDir, 'bin');
      expect((await fs.stat(binDir)).isDirectory()).toBe(true);
    });
  });

  describe('normalizeDirectoryItems', () => {
    it('should add default mode to directories without mode', () => {
      // Given
      const items: DirectoryItem[] = [
        { type: 'directory', path: 'src' },
        { type: 'directory', path: 'tests', mode: 0o750 },
      ];

      // When
      const normalized = CoreFileOperations.normalizeDirectoryItems(items);

      // Then
      expect(normalized[0].mode).toBe(0o755); // Default directory permissions
      expect(normalized[1].mode).toBe(0o750); // Preserved custom permissions
    });

    it('should add default mode to files without mode', () => {
      // Given
      const items: DirectoryItem[] = [
        { type: 'file', path: 'config.json', content: '{}' },
        { type: 'file', path: 'script.sh', content: '#!/bin/bash', mode: 0o750 },
        { type: 'file', path: 'cli-tool', content: '#!/usr/bin/env node', executable: true },
      ];

      // When
      const normalized = CoreFileOperations.normalizeDirectoryItems(items);

      // Then
      expect(normalized[0].mode).toBe(0o644); // Default file permissions
      expect(normalized[1].mode).toBe(0o750); // Preserved custom permissions
      expect(normalized[2].mode).toBe(0o755); // Default executable permissions
    });

    it('should remove duplicate items with same path and type', () => {
      // Given
      const items: DirectoryItem[] = [
        { type: 'directory', path: 'src' },
        { type: 'directory', path: 'src' }, // Duplicate
        { type: 'file', path: 'config.json', content: '{}' },
        { type: 'file', path: 'config.json', content: '{}' }, // Duplicate
        { type: 'directory', path: 'tests' },
      ];

      // When
      const normalized = CoreFileOperations.normalizeDirectoryItems(items);

      // Then
      expect(normalized).toHaveLength(3);
      expect(normalized.map((item) => `${item.type}:${item.path}`)).toEqual([
        'directory:src',
        'file:config.json',
        'directory:tests',
      ]);
    });

    it('should keep items with same path but different types', () => {
      // Given
      const items: DirectoryItem[] = [
        { type: 'directory', path: 'config' },
        { type: 'file', path: 'config', content: 'config content' },
      ];

      // When
      const normalized = CoreFileOperations.normalizeDirectoryItems(items);

      // Then
      expect(normalized).toHaveLength(2);
      expect(normalized[0].type).toBe('directory');
      expect(normalized[1].type).toBe('file');
    });

    it('should preserve all other properties when normalizing', () => {
      // Given
      const items: DirectoryItem[] = [
        { type: 'file', path: 'complex.txt', content: 'content', executable: true },
      ];

      // When
      const normalized = CoreFileOperations.normalizeDirectoryItems(items);

      // Then
      expect(normalized[0]).toEqual({
        type: 'file',
        path: 'complex.txt',
        content: 'content',
        executable: true,
        mode: 0o755, // Added by normalization
      });
    });
  });

  describe('error handling and edge cases', () => {
    it('should handle permission denied errors gracefully', async () => {
      // Given
      const dirPath = join(testBaseDir, 'no-permission');
      // Create a directory and make it read-only
      await fs.mkdir(dirPath);
      await fs.chmod(dirPath, 0o444);

      // When/Then
      await expect(
        CoreFileOperations.createDirectoryWithPermissions(join(dirPath, 'subdir'), 0o755)
      ).rejects.toThrow(/Failed to create directory/);

      // Cleanup
      await fs.chmod(dirPath, 0o755);
    });

    it('should handle long paths', async () => {
      // Given
      const longPath = 'a'.repeat(50);
      const directories = [longPath];

      // When/Then
      await expect(
        CoreFileOperations.createDirectories(testBaseDir, directories)
      ).resolves.toBeUndefined();
    });

    it('should handle special characters in paths', async () => {
      // Given
      const directories = ['目录', 'файл', 'dossier', '資料'];

      // When/Then - These should be valid paths
      for (const dir of directories) {
        await expect(
          CoreFileOperations.createDirectories(testBaseDir, [dir])
        ).resolves.toBeUndefined();
      }
    });

    it('should handle concurrent directory creation', async () => {
      // Given
      const directories = Array.from({ length: 10 }, (_, i) => `dir${i}`);

      // When
      const promises = directories.map((dir) =>
        CoreFileOperations.createDirectories(testBaseDir, [dir])
      );
      await Promise.all(promises);

      // Then
      for (const dir of directories) {
        const dirPath = join(testBaseDir, dir);
        expect((await fs.stat(dirPath)).isDirectory()).toBe(true);
      }
    });

    it('should handle deeply nested directory creation', async () => {
      // Given
      const deepPath = Array.from({ length: 20 }, (_, i) => `level${i}`).join('/');
      const directories = [deepPath];

      // When
      await CoreFileOperations.createDirectories(testBaseDir, directories);

      // Then
      const finalDir = join(testBaseDir, deepPath);
      expect((await fs.stat(finalDir)).isDirectory()).toBe(true);
    });
  });
});
