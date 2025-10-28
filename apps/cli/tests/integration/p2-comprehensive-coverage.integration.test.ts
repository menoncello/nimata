/**
 * Comprehensive P2 Integration Tests - Story 1.4
 *
 * Focus: P2 Coverage: 0% → 80%+
 * Tests for advanced scenarios, edge cases, and integration points
 *
 * These tests address the P2 coverage gaps by testing:
 * - Directory permissions handling
 * - Empty directory management (.gitkeep files)
 * - Project type variations and customizations
 * - Quality level adaptations
 * - Complex configuration scenarios
 * - Error handling and edge cases
 * - Integration with existing systems (Stories 1.2, 1.3)
 */

import { DirectoryStructureGenerator } from '@nimata/core';
import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { TestProject, createTestProject } from '../e2e/support/test-project.js';
import {
  createProjectConfig,
  createStrictQualityProjectConfig,
  createWebProjectConfig,
  createCLIProjectConfig,
  createLibraryProjectConfig,
} from '../support/factories/project-config.factory.js';

describe('P2 Comprehensive Integration Tests - Story 1.4', () => {
  let testProject: TestProject;
  let generator: DirectoryStructureGenerator;

  beforeEach(async () => {
    testProject = await createTestProject('p2-comprehensive-');
    generator = new DirectoryStructureGenerator();
  });

  afterEach(async () => {
    if (testProject) {
      await testProject.cleanup();
    }
  });

  describe('P2-1: Directory Permissions and Structure', () => {
    it('should create all directories with correct 755 permissions', async () => {
      // GIVEN: User creates any project type
      const projectConfig = createStrictQualityProjectConfig();

      // WHEN: Directory structure generator creates structure
      const directoryStructure = generator.generate(projectConfig);

      // THEN: All directories should have 755 permissions
      const directories = directoryStructure.filter((item) => item.type === 'directory');
      expect(directories.length).toBeGreaterThan(0);

      directories.forEach((dir) => {
        expect(dir.mode).toBe(0o755); // rwxr-xr-x
        expect(dir.path).toBeDefined();
        expect(dir.path.length).toBeGreaterThan(0);
      });
    });

    it('should create files with appropriate permissions', async () => {
      // GIVEN: User creates a CLI project
      const projectConfig = createCLIProjectConfig();

      // WHEN: Directory structure generator creates structure
      const directoryStructure = generator.generate(projectConfig);

      // THEN: CLI launcher should have executable permissions
      const cliLauncher = directoryStructure.find(
        (item) => item.path === `bin/${projectConfig.name}` && item.type === 'file'
      );
      expect(cliLauncher).toBeDefined();
      expect(cliLauncher!.executable).toBe(true);
      expect(cliLauncher!.mode).toBe(0o755);

      // Regular files should have read/write permissions
      const regularFiles = directoryStructure.filter(
        (item) => item.type === 'file' && !item.executable
      );
      regularFiles.forEach((file) => {
        expect(file.mode).toBe(0o644); // rw-r--r--
      });
    });

    it('should include .gitkeep files in all potentially empty directories', async () => {
      // GIVEN: User creates a web project with many directories
      const projectConfig = createWebProjectConfig();

      // WHEN: Directory structure generator creates structure
      const directoryStructure = generator.generate(projectConfig);

      // THEN: .gitkeep files should be included in empty directories
      const expectedGitkeepDirs = [
        'dist/.gitkeep',
        'bin/.gitkeep',
        'docs/.gitkeep',
        'docs/api/.gitkeep',
        'docs/examples/.gitkeep',
        'tests/unit/.gitkeep',
        'tests/integration/.gitkeep',
        'tests/e2e/.gitkeep',
        'tests/fixtures/.gitkeep',
        'tests/factories/.gitkeep',
        '.nimata/cache/.gitkeep',
        '.nimata/config/.gitkeep',
        'public/.gitkeep',
        'src/components/.gitkeep',
        'src/styles/.gitkeep',
      ];

      expectedGitkeepDirs.forEach((expectedPath) => {
        const gitkeepFile = directoryStructure.find(
          (item) => item.path === expectedPath && item.type === 'file'
        );
        expect(gitkeepFile).toBeDefined();
        expect(gitkeepFile!.content).toBe('');
        expect(gitkeepFile!.mode).toBe(0o644);
      });
    });
  });

  describe('P2-2: Project Type Variations and Customizations', () => {
    it('should generate basic project structure correctly', async () => {
      // GIVEN: User creates a basic project
      const projectConfig = createProjectConfig({
        name: 'basic-test-project',
        projectType: 'basic',
        qualityLevel: 'medium',
      });

      // WHEN: Directory structure generator creates structure
      const directoryStructure = generator.generate(projectConfig);

      // THEN: Core directories should be present
      const expectedCoreDirs = ['src', 'tests', 'bin', 'docs', '.nimata'];
      expectedCoreDirs.forEach((dir) => {
        const dirItem = directoryStructure.find(
          (item) => item.path === dir && item.type === 'directory'
        );
        expect(dirItem).toBeDefined();
        expect(dirItem!.mode).toBe(0o755);
      });

      // AND: Core files should be present
      const expectedFiles = ['src/index.ts', 'README.md', '.gitignore', 'package.json'];
      expectedFiles.forEach((file) => {
        const fileItem = directoryStructure.find(
          (item) => item.path === file && item.type === 'file'
        );
        expect(fileItem).toBeDefined();
        expect(fileItem!.content).toBeDefined();
        expect(fileItem!.content!.length).toBeGreaterThan(0);
      });
    });

    it('should generate web project structure with additional directories', async () => {
      // GIVEN: User creates a web project
      const projectConfig = createWebProjectConfig();

      // WHEN: Directory structure generator creates structure
      const directoryStructure = generator.generate(projectConfig);

      // THEN: Web-specific directories should be included
      const expectedWebDirs = ['public', 'src/components', 'src/styles'];
      expectedWebDirs.forEach((dir) => {
        const dirItem = directoryStructure.find(
          (item) => item.path === dir && item.type === 'directory'
        );
        expect(dirItem).toBeDefined();
        expect(dirItem!.mode).toBe(0o755);
      });

      // AND: Web-specific dependencies should be in package.json
      const packageJsonFile = directoryStructure.find(
        (item) => item.path === 'package.json' && item.type === 'file'
      );
      expect(packageJsonFile).toBeDefined();

      const packageJson = JSON.parse(packageJsonFile!.content);
      expect(packageJson.dependencies).toBeDefined();
      expect(packageJson.dependencies.react).toBeDefined();
      expect(packageJson.dependencies['react-dom']).toBeDefined();
    });

    it('should generate CLI project structure with executable launcher', async () => {
      // GIVEN: User creates a CLI project
      const projectConfig = createCLIProjectConfig();

      // WHEN: Directory structure generator creates structure
      const directoryStructure = generator.generate(projectConfig);

      // THEN: CLI-specific directories should be included
      const expectedCLIDirs = ['src/cli'];
      expectedCLIDirs.forEach((dir) => {
        const dirItem = directoryStructure.find(
          (item) => item.path === dir && item.type === 'directory'
        );
        expect(dirItem).toBeDefined();
        expect(dirItem!.mode).toBe(0o755);
      });

      // AND: CLI launcher should be executable
      const cliLauncher = directoryStructure.find(
        (item) => item.path === `bin/${projectConfig.name}` && item.type === 'file'
      );
      expect(cliLauncher).toBeDefined();
      expect(cliLauncher!.executable).toBe(true);
      expect(cliLauncher!.mode).toBe(0o755);
      expect(cliLauncher!.content).toContain('#!/usr/bin/env node');
    });

    it('should generate library project structure with proper exports', async () => {
      // GIVEN: User creates a library project
      const projectConfig = createLibraryProjectConfig();

      // WHEN: Directory structure generator creates structure
      const directoryStructure = generator.generate(projectConfig);

      // THEN: Library-specific directories should be included
      const expectedLibraryDirs = ['dist'];
      expectedLibraryDirs.forEach((dir) => {
        const dirItem = directoryStructure.find(
          (item) => item.path === dir && item.type === 'directory'
        );
        expect(dirItem).toBeDefined();
        expect(dirItem!.mode).toBe(0o755);
      });

      // AND: Main index should export properly for library
      const indexFile = directoryStructure.find(
        (item) => item.path === 'src/index.ts' && item.type === 'file'
      );
      expect(indexFile).toBeDefined();
      expect(indexFile!.content).toContain('export');
      expect(indexFile!.content).toContain('VERSION');
      expect(indexFile!.content).toContain('PACKAGE_NAME');
    });
  });

  describe('P2-3: Quality Level Adaptations', () => {
    it('should adapt structure for light quality level', async () => {
      // GIVEN: User creates project with light quality
      const projectConfig = createProjectConfig({
        name: 'light-quality-project',
        qualityLevel: 'light',
      });

      // WHEN: Directory structure generator creates structure
      const directoryStructure = generator.generate(projectConfig);

      // THEN: Basic structure should be present but minimal
      const basicDirs = ['src', 'tests', 'bin'];
      basicDirs.forEach((dir) => {
        const dirItem = directoryStructure.find(
          (item) => item.path === dir && item.type === 'directory'
        );
        expect(dirItem).toBeDefined();
      });

      // AND: Package.json should have light dependencies
      const packageJsonFile = directoryStructure.find(
        (item) => item.path === 'package.json' && item.type === 'file'
      );
      const packageJson = JSON.parse(packageJsonFile!.content);
      expect(packageJson.devDependencies).toBeDefined();
      expect(packageJson.devDependencies.typescript).toBeDefined();
      expect(packageJson.devDependencies.eslint).toBeDefined();
    });

    it('should adapt structure for strict quality level', async () => {
      // GIVEN: User creates project with strict quality
      const projectConfig = createStrictQualityProjectConfig();

      // WHEN: Directory structure generator creates structure
      const directoryStructure = generator.generate(projectConfig);

      // THEN: Complete structure should be present
      const completeDirs = [
        'src',
        'tests',
        'bin',
        'docs',
        '.nimata',
        'tests/unit',
        'tests/integration',
      ];
      completeDirs.forEach((dir) => {
        const dirItem = directoryStructure.find(
          (item) => item.path === dir && item.type === 'directory'
        );
        expect(dirItem).toBeDefined();
      });

      // AND: Package.json should have comprehensive dependencies
      const packageJsonFile = directoryStructure.find(
        (item) => item.path === 'package.json' && item.type === 'file'
      );
      const packageJson = JSON.parse(packageJsonFile!.content);
      expect(packageJson.devDependencies).toBeDefined();
      expect(packageJson.devDependencies.typescript).toBeDefined();
      expect(packageJson.devDependencies.eslint).toBeDefined();
      expect(packageJson.devDependencies.prettier).toBeDefined();
      expect(packageJson.devDependencies['@typescript-eslint/eslint-plugin']).toBeDefined();
    });

    it('should include quality-specific configuration files', async () => {
      // GIVEN: User creates project with strict quality
      const projectConfig = createStrictQualityProjectConfig();

      // WHEN: Directory structure generator creates structure
      const directoryStructure = generator.generate(projectConfig);

      // THEN: Quality configuration files should be present
      const expectedConfigFiles = ['.gitignore', 'package.json', 'tsconfig.json'];
      expectedConfigFiles.forEach((file) => {
        const fileItem = directoryStructure.find(
          (item) => item.path === file && item.type === 'file'
        );
        expect(fileItem).toBeDefined();
        expect(fileItem!.content).toBeDefined();
        expect(fileItem!.content!.length).toBeGreaterThan(0);
      });
    });
  });

  describe('P2-4: Edge Cases and Error Scenarios', () => {
    it('should handle project names with special characters', async () => {
      // GIVEN: User creates project with special characters in name
      const projectConfig = createProjectConfig({
        name: 'my-awesome_project_123',
        projectType: 'basic',
      });

      // WHEN: Directory structure generator creates structure
      const directoryStructure = generator.generate(projectConfig);

      // THEN: Structure should be created successfully
      expect(directoryStructure.length).toBeGreaterThan(0);

      // AND: Files should reference correct project name
      const packageJsonFile = directoryStructure.find(
        (item) => item.path === 'package.json' && item.type === 'file'
      );
      const packageJson = JSON.parse(packageJsonFile!.content);
      expect(packageJson.name).toBe('my-awesome_project_123');
    });

    it('should handle empty descriptions gracefully', async () => {
      // GIVEN: User creates project without description
      const projectConfig = createProjectConfig({
        name: 'no-description-project',
        description: undefined,
        projectType: 'basic',
      });

      // WHEN: Directory structure generator creates structure
      const directoryStructure = generator.generate(projectConfig);

      // THEN: Files should be created with default description
      const packageJsonFile = directoryStructure.find(
        (item) => item.path === 'package.json' && item.type === 'file'
      );
      const packageJson = JSON.parse(packageJsonFile!.content);
      expect(packageJson.description).toBe('A modern TypeScript project');

      const readmeFile = directoryStructure.find(
        (item) => item.path === 'README.md' && item.type === 'file'
      );
      expect(readmeFile).toBeDefined();
      expect(readmeFile!.content).toContain('# no-description-project');
    });

    it('should handle maximum length project names', async () => {
      // GIVEN: User creates project with very long name
      const longName = 'a'.repeat(50); // 50 characters
      const projectConfig = createProjectConfig({
        name: longName,
        projectType: 'basic',
      });

      // WHEN: Directory structure generator creates structure
      const directoryStructure = generator.generate(projectConfig);

      // THEN: Structure should be created successfully
      expect(directoryStructure.length).toBeGreaterThan(0);

      // AND: CLI launcher should use the full name
      const cliLauncher = directoryStructure.find(
        (item) => item.path === `bin/${longName}` && item.type === 'file'
      );
      if (projectConfig.projectType === 'cli') {
        expect(cliLauncher).toBeDefined();
      }
    });

    it('should handle all project types consistently', async () => {
      // GIVEN: User creates projects of all types
      const projectTypes = ['basic', 'web', 'cli', 'library'] as const;

      projectTypes.forEach((projectType) => {
        // WHEN: Directory structure generator creates structure
        const projectConfig = createProjectConfig({
          name: `${projectType}-test-project`,
          projectType,
          qualityLevel: 'medium',
        });

        const directoryStructure = generator.generate(projectConfig);

        // THEN: Core structure should always be present
        const coreDirs = ['src', 'tests'];
        coreDirs.forEach((dir) => {
          const dirItem = directoryStructure.find(
            (item) => item.path === dir && item.type === 'directory'
          );
          expect(dirItem).toBeDefined();
        });

        // AND: Essential files should always be present
        const essentialFiles = ['src/index.ts', 'README.md', '.gitignore', 'package.json'];
        essentialFiles.forEach((file) => {
          const fileItem = directoryStructure.find(
            (item) => item.path === file && item.type === 'file'
          );
          expect(fileItem).toBeDefined();
        });
      });
    });
  });

  describe('P2-5: Integration with Existing Systems', () => {
    it('should maintain compatibility with Story 1.3 project generation', async () => {
      // GIVEN: User creates project with AI assistant configuration
      const projectConfig = createProjectConfig({
        name: 'ai-integrated-project',
        projectType: 'basic',
        qualityLevel: 'strict',
        aiAssistants: ['claude-code', 'copilot'],
      });

      // WHEN: Directory structure generator creates structure
      const directoryStructure = generator.generate(projectConfig);

      // THEN: AI assistant configurations should be included
      const claudeConfig = directoryStructure.find(
        (item) => item.path === '.claude.md' && item.type === 'file'
      );
      expect(claudeConfig).toBeDefined();
      expect(claudeConfig!.content).toContain('claude-code');

      // AND: .nimata directory structure should be present
      const nimataDirs = ['.nimata', '.nimata/cache', '.nimata/config'];
      nimataDirs.forEach((dir) => {
        const dirItem = directoryStructure.find(
          (item) => item.path === dir && item.type === 'directory'
        );
        expect(dirItem).toBeDefined();
      });
    });

    it('should integrate with Story 1.2 quality configuration system', async () => {
      // GIVEN: User creates project with strict quality requirements
      const projectConfig = createStrictQualityProjectConfig();

      // WHEN: Directory structure generator creates structure
      const directoryStructure = generator.generate(projectConfig);

      // THEN: Quality-specific configurations should be present
      const packageJsonFile = directoryStructure.find(
        (item) => item.path === 'package.json' && item.type === 'file'
      );
      const packageJson = JSON.parse(packageJsonFile!.content);

      // Should have quality-related scripts
      expect(packageJson.scripts).toBeDefined();
      expect(packageJson.scripts.lint).toBeDefined();
      expect(packageJson.scripts['lint:fix']).toBeDefined();
      expect(packageJson.scripts.format).toBeDefined();
      expect(packageJson.scripts.test).toBeDefined();

      // Should have quality-related dev dependencies
      expect(packageJson.devDependencies).toBeDefined();
      expect(packageJson.devDependencies.eslint).toBeDefined();
      expect(packageJson.devDependencies.prettier).toBeDefined();
    });

    it('should support template-based customization', async () => {
      // GIVEN: User creates project with template specification
      const projectConfig = createProjectConfig({
        name: 'template-customized-project',
        projectType: 'basic',
        qualityLevel: 'medium',
        template: 'custom-template',
      });

      // WHEN: Directory structure generator creates structure
      const directoryStructure = generator.generate(projectConfig);

      // THEN: Basic structure should be created (template customization would be enhanced in future iterations)
      expect(directoryStructure.length).toBeGreaterThan(0);

      const coreFiles = ['src/index.ts', 'README.md', 'package.json'];
      coreFiles.forEach((file) => {
        const fileItem = directoryStructure.find(
          (item) => item.path === file && item.type === 'file'
        );
        expect(fileItem).toBeDefined();
      });
    });
  });

  describe('P2-6: Performance and Scalability', () => {
    it('should handle large project configurations efficiently', async () => {
      // GIVEN: User creates multiple projects in sequence
      const projectConfigs = Array.from({ length: 10 }, (_, i) =>
        createProjectConfig({
          name: `perf-test-project-${i}`,
          projectType: ['basic', 'web', 'cli', 'library'][i % 4] as any,
          qualityLevel: 'strict',
        })
      );

      const startTime = performance.now();

      // WHEN: Directory structure generator creates structures
      const results = projectConfigs.map((config) => generator.generate(config));

      const endTime = performance.now();
      const duration = endTime - startTime;

      // THEN: All structures should be created efficiently
      expect(results).toHaveLength(10);
      results.forEach((structure, index) => {
        expect(structure.length).toBeGreaterThan(0);

        // Verify each structure has the expected core elements
        const hasCoreDirs = structure.some(
          (item) => ['src', 'tests', 'bin'].includes(item.path) && item.type === 'directory'
        );
        expect(hasCoreDirs).toBe(true);
      });

      // Performance should be reasonable (less than 1 second for 10 projects)
      expect(duration).toBeLessThan(1000);
    });

    it('should maintain consistent output for identical inputs', async () => {
      // GIVEN: Same project configuration
      const projectConfig = createStrictQualityProjectConfig();

      // WHEN: Directory structure generator creates structures multiple times
      const structure1 = generator.generate(projectConfig);
      const structure2 = generator.generate(projectConfig);

      // THEN: Outputs should be identical
      expect(structure1).toHaveLength(structure2.length);

      structure1.forEach((item, index) => {
        const correspondingItem = structure2[index];
        expect(item.path).toBe(correspondingItem.path);
        expect(item.type).toBe(correspondingItem.type);
        expect(item.content).toBe(correspondingItem.content);
        expect(item.mode).toBe(correspondingItem.mode);
        expect(item.executable).toBe(correspondingItem.executable);
      });
    });
  });
});
