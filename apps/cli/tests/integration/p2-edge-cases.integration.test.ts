/**
 * Advanced Edge Case Tests - Story 1.4 P2 Coverage
 *
 * Focus: Edge cases, error scenarios, and complex boundary conditions
 * Tests to push P2 coverage from 74% → 90%+
 */

import { DirectoryStructureGenerator } from '@nimata/core';
import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { TestProject, createTestProject } from '../e2e/support/test-project.js';
import { createProjectConfig } from '../support/factories/project-config.factory.js';

describe('P2 Advanced Edge Cases - Story 1.4', () => {
  let testProject: TestProject;
  let generator: DirectoryStructureGenerator;

  beforeEach(async () => {
    testProject = await createTestProject('p2-edge-cases-');
    generator = new DirectoryStructureGenerator();
  });

  afterEach(async () => {
    if (testProject) {
      await testProject.cleanup();
    }
  });

  describe('Boundary Value Tests', () => {
    it('should handle minimum valid project name length', async () => {
      // GIVEN: Project name with minimum valid length (1 character)
      const projectConfig = createProjectConfig({
        name: 'a',
        projectType: 'basic',
      });

      // WHEN: Directory structure generator creates structure
      const directoryStructure = generator.generate(projectConfig);

      // THEN: Structure should be created successfully
      expect(directoryStructure.length).toBeGreaterThan(0);

      // AND: Files should reference the short name correctly
      const packageJsonFile = directoryStructure.find(
        (item) => item.path === 'package.json' && item.type === 'file'
      );
      const packageJson = JSON.parse(packageJsonFile!.content);
      expect(packageJson.name).toBe('a');

      const cliLauncher = directoryStructure.find(
        (item) => item.path === 'bin/a' && item.type === 'file'
      );
      if (projectConfig.projectType === 'cli') {
        expect(cliLauncher).toBeDefined();
      }
    });

    it('should handle Unicode characters in project name', async () => {
      // GIVEN: Project name with Unicode characters
      const projectConfig = createProjectConfig({
        name: 'tést-项目-🚀',
        projectType: 'basic',
      });

      // WHEN: Directory structure generator creates structure
      const directoryStructure = generator.generate(projectConfig);

      // THEN: Structure should be created successfully
      expect(directoryStructure.length).toBeGreaterThan(0);

      // AND: Unicode should be preserved in package.json
      const packageJsonFile = directoryStructure.find(
        (item) => item.path === 'package.json' && item.type === 'file'
      );
      const packageJson = JSON.parse(packageJsonFile!.content);
      expect(packageJson.name).toBe('tést-项目-🚀');
    });

    it('should handle empty author field gracefully', async () => {
      // GIVEN: Project configuration with empty author
      const projectConfig = createProjectConfig({
        name: 'no-author-project',
        author: '',
        projectType: 'basic',
      });

      // WHEN: Directory structure generator creates structure
      const directoryStructure = generator.generate(projectConfig);

      // THEN: Package.json should handle empty author
      const packageJsonFile = directoryStructure.find(
        (item) => item.path === 'package.json' && item.type === 'file'
      );
      const packageJson = JSON.parse(packageJsonFile!.content);
      expect(packageJson.author).toBe('');
    });

    it('should handle null and undefined optional fields', async () => {
      // GIVEN: Project configuration with null/undefined fields
      const projectConfig = createProjectConfig({
        name: 'null-fields-project',
        description: null as any,
        author: undefined,
        license: null as any,
        projectType: 'basic',
      });

      // WHEN: Directory structure generator creates structure
      const directoryStructure = generator.generate(projectConfig);

      // THEN: Structure should be created with defaults
      expect(directoryStructure.length).toBeGreaterThan(0);

      const packageJsonFile = directoryStructure.find(
        (item) => item.path === 'package.json' && item.type === 'file'
      );
      const packageJson = JSON.parse(packageJsonFile!.content);
      expect(packageJson.name).toBe('null-fields-project');
      expect(packageJson.description).toBe('A modern TypeScript project');
      expect(packageJson.author).toBe('Your Name');
      expect(packageJson.license).toBe('MIT');
    });
  });

  describe('Content Validation Tests', () => {
    it('should generate valid JSON in package.json', async () => {
      // GIVEN: Any valid project configuration
      const projectConfig = createProjectConfig({
        name: 'json-validation-project',
        projectType: 'web',
      });

      // WHEN: Directory structure generator creates structure
      const directoryStructure = generator.generate(projectConfig);

      // THEN: package.json should contain valid JSON
      const packageJsonFile = directoryStructure.find(
        (item) => item.path === 'package.json' && item.type === 'file'
      );
      expect(packageJsonFile).toBeDefined();

      // Should not throw when parsing
      expect(() => {
        JSON.parse(packageJsonFile!.content);
      }).not.toThrow();

      // Should have required fields
      const packageJson = JSON.parse(packageJsonFile!.content);
      expect(packageJson.name).toBeDefined();
      expect(packageJson.version).toBeDefined();
      expect(packageJson.type).toBeDefined();
      expect(packageJson.scripts).toBeDefined();
      expect(packageJson.engines).toBeDefined();
    });

    it('should include shebang in CLI launcher files', async () => {
      // GIVEN: CLI project configuration
      const projectConfig = createProjectConfig({
        name: 'shebang-test-cli',
        projectType: 'cli',
      });

      // WHEN: Directory structure generator creates structure
      const directoryStructure = generator.generate(projectConfig);

      // THEN: CLI launcher should have shebang
      const cliLauncher = directoryStructure.find(
        (item) => item.path === 'bin/shebang-test-cli' && item.type === 'file'
      );
      expect(cliLauncher).toBeDefined();
      expect(cliLauncher!.content).toMatch(/^#!.*\/usr\/bin\/env/);
      expect(cliLauncher!.executable).toBe(true);
    });

    it('should generate TypeScript with proper syntax', async () => {
      // GIVEN: Any project configuration
      const projectConfig = createProjectConfig({
        name: 'ts-syntax-project',
        projectType: 'library',
      });

      // WHEN: Directory structure generator creates structure
      const directoryStructure = generator.generate(projectConfig);

      // THEN: Generated TypeScript files should have proper syntax
      const indexFile = directoryStructure.find(
        (item) => item.path === 'src/index.ts' && item.type === 'file'
      );
      expect(indexFile).toBeDefined();
      expect(indexFile!.content).toContain('export');
      expect(indexFile!.content).toContain('interface');
      expect(indexFile!.content).toContain('class');

      // Test files should have proper syntax
      const testFiles = directoryStructure.filter(
        (item) => item.path.endsWith('.test.ts') && item.type === 'file'
      );
      testFiles.forEach((testFile) => {
        expect(testFile.content).toContain('import');
        expect(testFile.content).toContain('describe');
        expect(testFile.content).toContain('test');
        expect(testFile.content).toContain('expect');
      });
    });

    it('should generate proper directory structure depth', async () => {
      // GIVEN: Complex project configuration
      const projectConfig = createProjectConfig({
        name: 'depth-test-project',
        projectType: 'web',
      });

      // WHEN: Directory structure generator creates structure
      const directoryStructure = generator.generate(projectConfig);

      // THEN: Should have appropriate directory depth
      const directories = directoryStructure.filter((item) => item.type === 'directory');

      // Should have nested directories
      const nestedDirs = directories.filter((dir) => dir.path.includes('/'));
      expect(nestedDirs.length).toBeGreaterThan(0);

      // Should have reasonable depth (not too deep)
      const maxDepth = Math.max(...directories.map((dir) => dir.path.split('/').length));
      expect(maxDepth).toBeLessThan(5); // Reasonable depth limit
    });
  });

  describe('Error Recovery Tests', () => {
    it('should handle malformed project config gracefully', async () => {
      // GIVEN: Project configuration with malformed but valid structure
      const malformedConfig = {
        name: 'malformed-project',
        description: '',
        author: '',
        license: '',
        qualityLevel: 'strict' as const,
        projectType: 'basic' as const,
        aiAssistants: [] as string[],
        // Missing required fields that should have defaults
      };

      // WHEN: Directory structure generator creates structure
      const directoryStructure = generator.generate(malformedConfig);

      // THEN: Should still create valid structure
      expect(directoryStructure.length).toBeGreaterThan(0);

      // Should have core elements
      const hasCoreFiles = directoryStructure.some((item) =>
        ['src/index.ts', 'package.json', 'README.md'].includes(item.path)
      );
      expect(hasCoreFiles).toBe(true);
    });

    it('should handle array fields with edge cases', async () => {
      // GIVEN: Project configuration with edge case arrays
      const projectConfig = createProjectConfig({
        name: 'array-edge-cases',
        aiAssistants: ['claude-code'], // Single item array
        projectType: 'basic',
      });

      // WHEN: Directory structure generator creates structure
      const directoryStructure = generator.generate(projectConfig);

      // THEN: Should handle single item arrays correctly
      expect(directoryStructure.length).toBeGreaterThan(0);

      // Should generate AI config for single assistant
      const claudeConfig = directoryStructure.find(
        (item) => item.path === '.claude/CLAUDE.md' && item.type === 'file'
      );
      expect(claudeConfig).toBeDefined();
    });
  });

  describe('Consistency Tests', () => {
    it('should maintain consistent file naming conventions', async () => {
      // GIVEN: Multiple project configurations
      const projectConfigs = [
        createProjectConfig({ name: 'consistency-test-1', projectType: 'basic' }),
        createProjectConfig({ name: 'consistency-test-2', projectType: 'web' }),
        createProjectConfig({ name: 'consistency-test-3', projectType: 'cli' }),
      ];

      // WHEN: Directory structure generator creates structures
      const structures = projectConfigs.map((config) => generator.generate(config));

      // THEN: Each structure should have consistent core files
      structures.forEach((structure, index) => {
        const config = projectConfigs[index];

        // Should always have these core files
        const coreFiles = ['src/index.ts', 'package.json', 'README.md', '.gitignore'];
        coreFiles.forEach((file) => {
          const fileItem = structure.find((item) => item.path === file && item.type === 'file');
          expect(fileItem).toBeDefined();
          expect(fileItem!.content).toBeDefined();
          expect(fileItem!.content!.length).toBeGreaterThan(0);
        });

        // Package.json should have consistent structure
        const packageJsonFile = structure.find(
          (item) => item.path === 'package.json' && item.type === 'file'
        );
        const packageJson = JSON.parse(packageJsonFile!.content);
        expect(packageJson.name).toBe(config.name);
        expect(packageJson.version).toBe('1.0.0');
        expect(packageJson.type).toBe('module');
        expect(packageJson.engines).toBeDefined();
      });
    });

    it('should maintain consistent directory permissions', async () => {
      // GIVEN: Multiple project types
      const projectTypes = ['basic', 'web', 'cli', 'library'] as const;

      projectTypes.forEach((projectType) => {
        // WHEN: Directory structure generator creates structure
        const projectConfig = createProjectConfig({
          name: `${projectType}-consistency`,
          projectType,
        });
        const directoryStructure = generator.generate(projectConfig);

        // THEN: All directories should have consistent permissions
        const directories = directoryStructure.filter((item) => item.type === 'directory');
        directories.forEach((dir) => {
          expect(dir.mode).toBe(0o755);
        });

        // AND: Files should have appropriate permissions
        const files = directoryStructure.filter((item) => item.type === 'file');
        files.forEach((file) => {
          if (file.executable) {
            expect(file.mode).toBe(0o755);
          } else {
            expect(file.mode).toBe(0o644);
          }
        });
      });
    });
  });

  describe('Memory and Performance Edge Cases', () => {
    it('should handle large content generation efficiently', async () => {
      // GIVEN: Project configuration that might generate large content
      const projectConfig = createProjectConfig({
        name: 'large-content-project',
        description: 'A'.repeat(1000), // Large description
        author: 'B'.repeat(100), // Large author name
        projectType: 'library',
        qualityLevel: 'strict',
      });

      // WHEN: Directory structure generator creates structure
      const startTime = performance.now();
      const directoryStructure = generator.generate(projectConfig);
      const endTime = performance.now();

      // THEN: Should complete efficiently
      const duration = endTime - startTime;
      expect(duration).toBeLessThan(500); // Should complete in under 500ms

      // AND: Should handle large content properly
      expect(directoryStructure.length).toBeGreaterThan(0);

      const packageJsonFile = directoryStructure.find(
        (item) => item.path === 'package.json' && item.type === 'file'
      );
      const packageJson = JSON.parse(packageJsonFile!.content);
      expect(packageJson.description).toBe('A'.repeat(1000));
      expect(packageJson.author).toBe('B'.repeat(100));
    });

    it('should not create duplicate entries', async () => {
      // GIVEN: Any project configuration
      const projectConfig = createProjectConfig({
        name: 'no-duplicates-project',
        projectType: 'basic',
      });

      // WHEN: Directory structure generator creates structure
      const directoryStructure = generator.generate(projectConfig);

      // THEN: Should not have duplicate paths
      const paths = directoryStructure.map((item) => item.path);
      const uniquePaths = [...new Set(paths)];
      expect(paths).toHaveLength(uniquePaths.length);

      // AND: Should not have duplicate content for same path type
      const filesByPath = directoryStructure.reduce(
        (acc, item) => {
          const key = `${item.path}:${item.type}`;
          if (!acc[key]) acc[key] = [];
          acc[key].push(item);
          return acc;
        },
        {} as Record<string, typeof directoryStructure>
      );

      Object.values(filesByPath).forEach((items) => {
        expect(items).toHaveLength(1); // Each path/type combination should be unique
      });
    });
  });
});
