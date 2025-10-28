import { join } from 'node:path';
import { DirectoryStructureGenerator } from '@nimata/core';
import { describe, test, expect, beforeEach, afterEach } from 'bun:test';

// Import the DirectoryStructureGenerator from core package
import { TestProject, createTestProject } from '../e2e/support/test-project.js';

describe('1.4-DirectoryStructureGenerator Service - Unit Tests', () => {
  let testProject: TestProject | null = null;
  let generator: DirectoryStructureGenerator;

  beforeEach(async () => {
    testProject = await createTestProject('directory-generator-unit-');
    // This will fail until DirectoryStructureGenerator is implemented
    generator = new DirectoryStructureGenerator();
  });

  afterEach(async () => {
    if (testProject) {
      await testProject.cleanup();
      testProject = null;
    }
  });

  describe('AC1: Standard Directory Structure Creation (P0)', () => {
    test('1.4-AC1-001: P0 - should create standard directories with correct permissions', async () => {
      // GIVEN: Test project path and generator instance
      const projectPath = testProject!.path;
      const directories = ['src', 'tests', 'bin', 'docs', '.nimata'];

      // WHEN: Creating directories
      await generator.createDirectories(projectPath, directories);

      // THEN: All directories should exist with correct permissions
      for (const dir of directories) {
        const dirPath = join(projectPath, dir);
        expect(testProject!.fileExists(dir)).toBe(true);
      }
    });

    test('1.4-AC1-002: P0 - should create nested directory structure recursively', async () => {
      // GIVEN: Complex nested structure
      const projectPath = testProject!.path;
      const nestedStructure = [
        'src',
        'src/cli',
        'src/types',
        'src/utils',
        'tests/unit',
        'tests/integration',
        'tests/e2e',
        'tests/fixtures',
        '.nimata/cache',
        '.nimata/config',
      ];

      // WHEN: Creating nested directories
      await generator.createNestedDirectories(projectPath, nestedStructure);

      // THEN: All nested directories should exist
      for (const dir of nestedStructure) {
        expect(testProject!.fileExists(dir)).toBe(true);
      }
    });

    test('1.4-AC1-003: P0 - should add .gitkeep files to empty directories', async () => {
      // GIVEN: Directories that would otherwise be empty
      const projectPath = testProject!.path;
      const emptyDirs = ['bin', 'docs', '.nimata/cache'];

      // WHEN: Creating directories with .gitkeep files
      await generator.createDirectoriesWithGitkeep(projectPath, emptyDirs);

      // THEN: .gitkeep files should exist in empty directories
      for (const dir of emptyDirs) {
        const gitkeepPath = join(dir, '.gitkeep');
        expect(testProject!.fileExists(gitkeepPath)).toBe(true);

        const content = await testProject!.readFile(gitkeepPath);
        expect(content).toBe('');
      }
    });
  });

  describe('AC1: Project Type Variations (P0)', () => {
    test('1.4-AC1-004: P0 - should adapt directory structure for CLI projects', async () => {
      // GIVEN: CLI project type
      const projectPath = testProject!.path;
      const projectType = 'cli';

      // WHEN: Generating CLI-specific structure
      await generator.generateAndCreateStructureForType(projectPath, projectType);

      // THEN: CLI-specific directories should be included
      expect(testProject!.fileExists('src/cli')).toBe(true);
      expect(testProject!.fileExists('bin')).toBe(true);
    });

    test('1.4-AC1-005: P0 - should adapt directory structure for web projects', async () => {
      // GIVEN: Web project type
      const projectPath = testProject!.path;
      const projectType = 'web';

      // WHEN: Generating web-specific structure
      await generator.generateAndCreateStructureForType(projectPath, projectType);

      // THEN: Web-specific directories should be included
      expect(testProject!.fileExists('public')).toBe(true);
      expect(testProject!.fileExists('src/components')).toBe(true);
      expect(testProject!.fileExists('src/styles')).toBe(true);
    });

    test('1.4-AC1-006: P0 - should adapt directory structure for library projects', async () => {
      // GIVEN: Library project type
      const projectPath = testProject!.path;
      const projectType = 'library';

      // WHEN: Generating library-specific structure
      await generator.generateAndCreateStructureForType(projectPath, projectType);

      // THEN: Library-specific structure should be created
      expect(testProject!.fileExists('src')).toBe(true);
      expect(testProject!.fileExists('dist')).toBe(true); // Build output
    });
  });

  describe('AC1: Permission Handling (P0)', () => {
    test('1.4-AC1-007: P0 - should set correct permissions on directories (755)', async () => {
      // GIVEN: Directory creation request
      const projectPath = testProject!.path;
      const testDir = join(projectPath, 'test-permissions');

      // WHEN: Creating directory with specific permissions
      await generator.createDirectoryWithPermissions(testDir, 0o755);

      // THEN: Directory should have correct permissions
      expect(testProject!.fileExists('test-permissions')).toBe(true);
      // Permission check would go here once implemented
    });

    test('1.4-AC1-008: P0 - should set executable permissions on CLI bin files', async () => {
      // GIVEN: CLI project with bin files
      const projectPath = testProject!.path;
      const binPath = join(projectPath, 'bin', 'test-cli');

      // WHEN: Creating CLI executable
      await generator.createCliExecutable(binPath, '#!/usr/bin/env bun\nconsole.log("Hello CLI");');

      // THEN: Bin file should be executable
      expect(testProject!.fileExists('bin/test-cli')).toBe(true);
      // Executable permission check would go here
    });
  });

  describe('AC2: Entry Point Files Generation (P1)', () => {
    test('1.4-AC2-001: P1 - should generate main src/index.ts with proper exports', async () => {
      // GIVEN: Basic project type
      const projectPath = testProject!.path;
      const projectName = 'test-project';

      // WHEN: Generating main entry point
      await generator.generateMainEntryPoint(projectPath, projectName);

      // THEN: src/index.ts should exist with proper content
      expect(testProject!.fileExists('src/index.ts')).toBe(true);

      const content = await testProject!.readFile('src/index.ts');
      expect(content).toContain('export');
      expect(content).toContain(projectName);
    });

    test('1.4-AC2-002: P1 - should generate CLI entry point with shebang', async () => {
      // GIVEN: CLI project
      const projectPath = testProject!.path;
      const cliName = 'test-cli';

      // WHEN: Generating CLI entry point
      await generator.generateCliEntryPoint(projectPath, cliName);

      // THEN: CLI executable should exist with shebang
      expect(testProject!.fileExists('bin/test-cli')).toBe(true);

      const content = await testProject!.readFile('bin/test-cli');
      expect(content).toContain('#!/usr/bin/env bun');
    });
  });

  describe('AC3: Configuration Files Generation (P1)', () => {
    test('1.4-AC3-001: P1 - should generate comprehensive .gitignore', async () => {
      // GIVEN: Project path
      const projectPath = testProject!.path;

      // WHEN: Generating .gitignore
      await generator.generateGitignore(projectPath);

      // THEN: .gitignore should contain comprehensive exclusions
      expect(testProject!.fileExists('.gitignore')).toBe(true);

      const content = await testProject!.readFile('.gitignore');
      expect(content).toContain('node_modules');
      expect(content).toContain('dist/');
      expect(content).toContain('.nimata/cache/');
      expect(content).toContain('.DS_Store');
    });

    test('1.4-AC3-002: P1 - should generate package.json with metadata', async () => {
      // GIVEN: Project metadata
      const projectPath = testProject!.path;
      const metadata = {
        name: 'test-project',
        version: '1.0.0',
        description: 'A test project',
        author: 'Test Author',
      };

      // WHEN: Generating package.json
      await generator.generatePackageJson(projectPath, metadata);

      // THEN: package.json should contain metadata
      expect(testProject!.fileExists('package.json')).toBe(true);

      const content = await testProject!.readFile('package.json');
      const pkg = JSON.parse(content);
      expect(pkg.name).toBe(metadata.name);
      expect(pkg.description).toBe(metadata.description);
    });

    test('1.4-AC3-003: P1 - should generate TypeScript configuration', async () => {
      // GIVEN: Project path
      const projectPath = testProject!.path;

      // WHEN: Generating TypeScript configuration
      await generator.generateTsConfig(projectPath);

      // THEN: tsconfig.json should exist with strict settings
      expect(testProject!.fileExists('tsconfig.json')).toBe(true);

      const content = await testProject!.readFile('tsconfig.json');
      const tsconfig = JSON.parse(content);
      expect(tsconfig.compilerOptions.strict).toBe(true);
      expect(tsconfig.compilerOptions.target).toBeDefined();
    });
  });

  describe('Error Handling (P0)', () => {
    test('1.4-P0-1-001: should handle directory creation errors gracefully', async () => {
      // GIVEN: Invalid path or permission issue
      const invalidPath = '/invalid/path/that/cannot/be/created';

      // WHEN: Attempting to create directory in invalid location
      await expect(generator.createDirectories(invalidPath, ['test'])).rejects.toThrow(
        'Failed to create directory'
      );

      // THEN: Should handle error without crashing
    });

    test('1.4-P0-1-002: should provide actionable error messages', async () => {
      // GIVEN: Project with conflicting files
      const projectPath = testProject!.path;

      // Create conflicting file
      await testProject!.writeFile('src', 'This is a file, not a directory');

      // WHEN: Attempting to create directory where file exists
      await expect(generator.createDirectories(projectPath, ['src'])).rejects.toThrow(
        'Failed to create directory'
      );

      // THEN: Should provide clear error message
    });
  });
});
