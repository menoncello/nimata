/**
 * Integration Tests - Directory Structure Generator
 *
 * RED PHASE: These tests are written to FAIL before implementation
 * Following TDD red-green-refactor cycle
 *
 * Tests for AC1: Standard Directory Structure Creation
 * - Creates standard directories: src/, tests/, bin/, docs/, .nimata/
 * - Directory structure follows SOLID architecture principles
 * - All directories created with correct permissions (755)
 * - Structure supports both basic and CLI project types
 * - Empty .gitkeep files included in otherwise empty directories
 */
import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { TestProject } from '../e2e/support/test-project';
import { createProjectConfig } from '../support/factories/project-config.factory';

describe('Directory Structure Generator - AC1: Standard Directory Structure Creation (RED PHASE)', () => {
  let testProject: TestProject;

  beforeEach(async () => {
    testProject = await TestProject.create('directory-structure-');
  });

  afterEach(async () => {
    await testProject.cleanup();
  });

  describe('AC1.1: Standard Directory Creation', () => {
    it('should create all standard directories for basic project type', async () => {
      // GIVEN: User wants to create a basic TypeScript project
      // WHEN: Directory structure generator processes basic project type
      const projectConfig = createProjectConfig({
        name: 'basic-test-project',
        projectType: 'basic',
        qualityLevel: 'strict',
      });

      // Import the DirectoryStructureGenerator from core package
      const { DirectoryStructureGenerator } = await import('@nimata/core');
      const generator = new DirectoryStructureGenerator();
      const directoryStructure = generator.generate(projectConfig);

      // THEN: All standard directories should be included in structure
      const expectedDirectories = ['src', 'tests', 'bin', 'docs', '.nimata'];

      for (const dir of expectedDirectories) {
        const dirItem = directoryStructure.find(
          (item) => item.path === dir && item.type === 'directory'
        );
        expect(dirItem).toBeDefined();
        expect(dirItem?.type).toBe('directory');
      }
    });

    it('should create CLI-specific directories for CLI project type', async () => {
      // GIVEN: User wants to create a CLI project
      // WHEN: Directory structure generator processes CLI project type
      const projectConfig = createProjectConfig({
        name: 'cli-test-project',
        projectType: 'cli',
        qualityLevel: 'strict',
      });

      // Import the DirectoryStructureGenerator from core package
      const { DirectoryStructureGenerator } = await import('@nimata/core');
      const generator = new DirectoryStructureGenerator();
      const directoryStructure = generator.generate(projectConfig);

      // THEN: CLI-specific directories should be included
      const expectedDirectories = [
        'src',
        'tests',
        'bin',
        'docs',
        '.nimata',
        'src/cli', // CLI-specific directory
      ];

      for (const dir of expectedDirectories) {
        const dirItem = directoryStructure.find(
          (item) => item.path === dir && item.type === 'directory'
        );
        expect(dirItem).toBeDefined();
        expect(dirItem?.type).toBe('directory');
      }
    });
  });

  describe('AC1.2: SOLID Architecture Principles', () => {
    it('should follow SOLID architecture in directory structure', async () => {
      // GIVEN: User wants a project following SOLID principles
      // WHEN: Directory structure generator creates structure
      const projectConfig = createProjectConfig({
        name: 'solid-architecture-project',
        projectType: 'web',
        qualityLevel: 'strict',
      });

      // Import the DirectoryStructureGenerator from core package
      const { DirectoryStructureGenerator } = await import('@nimata/core');
      const generator = new DirectoryStructureGenerator();
      const directoryStructure = generator.generate(projectConfig);

      // THEN: Structure should support SOLID principles
      // Single Responsibility: Separate directories for different concerns
      const solidDirectories = [
        'src/types', // Type definitions
        'src/utils', // Utility functions
        'src/components', // UI components (for web)
        'src/services', // Business logic
        'tests/unit', // Unit tests
        'tests/integration', // Integration tests
        'tests/e2e', // End-to-end tests
      ];

      for (const dir of solidDirectories) {
        const dirItem = directoryStructure.find(
          (item) => item.path === dir && item.type === 'directory'
        );
        expect(dirItem).toBeDefined();
        expect(dirItem?.type).toBe('directory');
      }
    });
  });

  describe('AC1.3: Directory Permissions', () => {
    it('should create directories with correct permissions (755)', async () => {
      // GIVEN: User wants directories with proper permissions
      // WHEN: Directory structure generator creates directories
      const projectConfig = createProjectConfig({
        name: 'permissions-test-project',
        projectType: 'basic',
        qualityLevel: 'strict',
      });

      // Import the DirectoryStructureGenerator from core package
      const { DirectoryStructureGenerator } = await import('@nimata/core');
      const generator = new DirectoryStructureGenerator();
      const directoryStructure = generator.generate(projectConfig);

      // THEN: All directories should have 755 permissions
      for (const dirItem of directoryStructure.filter((item) => item.type === 'directory')) {
        expect(dirItem.mode).toBe(0o755); // rwxr-xr-x
      }
    });
  });

  describe('AC1.4: Empty Directory Handling', () => {
    it('should include .gitkeep files in otherwise empty directories', async () => {
      // GIVEN: User wants to include empty directories in git
      // WHEN: Directory structure generator creates structure
      const projectConfig = createProjectConfig({
        name: 'gitkeep-test-project',
        projectType: 'basic',
        qualityLevel: 'strict',
      });

      // Import the DirectoryStructureGenerator from core package
      const { DirectoryStructureGenerator } = await import('@nimata/core');
      const generator = new DirectoryStructureGenerator();
      const directoryStructure = generator.generate(projectConfig);

      // THEN: Empty directories should contain .gitkeep files
      const potentiallyEmptyDirs = ['docs/examples', 'tests/fixtures', '.nimata/cache'];

      for (const dir of potentiallyEmptyDirs) {
        const gitkeepFile = directoryStructure.find(
          (item) => item.path === `${dir}/.gitkeep` && item.type === 'file'
        );
        expect(gitkeepFile).toBeDefined();
        expect(gitkeepFile?.content).toBe(''); // Empty .gitkeep file
      }
    });
  });
});
