/**
 * Directory Structure Generator Tests
 *
 * Unit tests for Story 1.4 - P0-1: Directory Creation Engine
 */

import { describe, it, expect, beforeEach } from 'bun:test';
import type { ProjectConfig } from '../../../types/project-config.js';
import { DirectoryStructureGenerator } from '../directory-structure-generator.js';

describe('DirectoryStructureGenerator - Story 1.4 P0-1', () => {
  let generator: DirectoryStructureGenerator;
  let basicConfig: ProjectConfig;

  beforeEach(() => {
    generator = new DirectoryStructureGenerator();
    basicConfig = {
      name: 'test-project',
      description: 'Test project for directory structure generation',
      qualityLevel: 'medium',
      projectType: 'basic',
      aiAssistants: ['claude-code'],
    };
  });

  describe('AC1: Standard Directory Structure Creation', () => {
    it('should create core directories', () => {
      // When
      const structure = generator.generate(basicConfig);

      // Then
      const directories = structure.filter((item) => item.type === 'directory');
      const directoryPaths = directories.map((item) => item.path);

      expect(directoryPaths).toContain('src');
      expect(directoryPaths).toContain('tests');
      expect(directoryPaths).toContain('bin');
      expect(directoryPaths).toContain('docs');
      expect(directoryPaths).toContain('.nimata');
      expect(directoryPaths).toContain('.nimata/cache');
      expect(directoryPaths).toContain('.nimata/config');
    });

    it('should create test structure directories', () => {
      // When
      const structure = generator.generate(basicConfig);

      // Then
      const directories = structure.filter((item) => item.type === 'directory');
      const directoryPaths = directories.map((item) => item.path);

      expect(directoryPaths).toContain('tests/unit');
      expect(directoryPaths).toContain('tests/integration');
      expect(directoryPaths).toContain('tests/e2e');
      expect(directoryPaths).toContain('tests/fixtures');
      expect(directoryPaths).toContain('tests/factories');
    });

    it('should create documentation structure directories', () => {
      // When
      const structure = generator.generate(basicConfig);

      // Then
      const directories = structure.filter((item) => item.type === 'directory');
      const directoryPaths = directories.map((item) => item.path);

      expect(directoryPaths).toContain('docs/api');
      expect(directoryPaths).toContain('docs/examples');
    });

    it('should include .gitkeep files in empty directories', () => {
      // When
      const structure = generator.generate(basicConfig);

      // Then
      const gitkeepFiles = structure.filter(
        (item) => item.type === 'file' && item.path.endsWith('.gitkeep')
      );
      const gitkeepPaths = gitkeepFiles.map((item) => item.path);

      expect(gitkeepPaths).toContain('dist/.gitkeep');
      expect(gitkeepPaths).toContain('tests/unit/.gitkeep');
      expect(gitkeepPaths).toContain('tests/integration/.gitkeep');
      expect(gitkeepPaths).toContain('tests/e2e/.gitkeep');
      expect(gitkeepPaths).toContain('tests/fixtures/.gitkeep');
      expect(gitkeepPaths).toContain('tests/factories/.gitkeep');
      expect(gitkeepPaths).toContain('docs/api/.gitkeep');
      expect(gitkeepPaths).toContain('docs/examples/.gitkeep');
      expect(gitkeepPaths).toContain('.nimata/cache/.gitkeep');
      expect(gitkeepPaths).toContain('.nimata/config/.gitkeep');
    });

    it('should structure directories following SOLID principles', () => {
      // When
      const structure = generator.generate(basicConfig);

      // Then - Should have clear separation of concerns
      const directories = structure.filter((item) => item.type === 'directory');
      const directoryPaths = directories.map((item) => item.path);

      // Source code organization
      expect(directoryPaths.some((path) => path.startsWith('src/'))).toBe(true);

      // Test organization with clear structure
      expect(directoryPaths.filter((path) => path.startsWith('tests/')).length).toBeGreaterThan(3);

      // Configuration and cache separation
      const nimataDirs = directoryPaths.filter(
        (path) => path.startsWith('.nimata') || path === '.nimata'
      );
      expect(nimataDirs.sort()).toEqual(['.nimata', '.nimata/cache', '.nimata/config']);
    });
  });

  describe('AC2: Entry Point Files Generation', () => {
    it('should generate main entry point file', () => {
      // When
      const structure = generator.generate(basicConfig);

      // Then
      const indexFile = structure.find(
        (item) => item.type === 'file' && item.path === 'src/index.ts'
      );

      expect(indexFile).toBeDefined();
      expect(indexFile?.content).toBeDefined();
      expect(indexFile?.content).toContain('export');
      expect(indexFile?.content).toContain(basicConfig.name);
    });

    it('should create CLI launcher for CLI projects', () => {
      // Given
      const cliConfig = { ...basicConfig, projectType: 'cli' as const };

      // When
      const structure = generator.generate(cliConfig);

      // Then
      const cliLauncher = structure.find(
        (item) => item.type === 'file' && item.path === `bin/${cliConfig.name}`
      );

      expect(cliLauncher).toBeDefined();
      expect(cliLauncher?.content).toContain('#!/usr/bin/env bun');
      expect(cliLauncher?.content).toContain('import { main }');
      expect(cliLauncher?.executable).toBe(true);
    });

    it('should not create CLI launcher for non-CLI projects', () => {
      // Given
      const webConfig = { ...basicConfig, projectType: 'web' as const };

      // When
      const structure = generator.generate(webConfig);

      // Then
      const cliLauncher = structure.find(
        (item) => item.type === 'file' && item.path === `bin/${webConfig.name}`
      );

      expect(cliLauncher).toBeUndefined();
    });

    it('should generate entry points with proper boilerplate code', () => {
      // When
      const structure = generator.generate(basicConfig);

      // Then
      const indexFile = structure.find(
        (item) => item.type === 'file' && item.path === 'src/index.ts'
      );

      expect(indexFile?.content).toContain('/**');
      expect(indexFile?.content).toContain('*');
      expect(indexFile?.content).toContain(basicConfig.description);
      expect(indexFile?.content).toContain('export');
    });
  });

  describe('AC3: Configuration Files Generation', () => {
    it('should generate .gitignore with comprehensive exclusions', () => {
      // When
      const structure = generator.generate(basicConfig);

      // Then
      const gitignore = structure.find(
        (item) => item.type === 'file' && item.path === '.gitignore'
      );

      expect(gitignore).toBeDefined();
      expect(gitignore?.content).toContain('node_modules');
      expect(gitignore?.content).toContain('dist/');
      expect(gitignore?.content).toContain('.nimata/cache/');
      expect(gitignore?.content).toContain('.DS_Store');
      expect(gitignore?.content).toContain('*.log');
    });

    it('should generate package.json with project metadata', () => {
      // When
      const structure = generator.generate(basicConfig);

      // Then
      const packageJson = structure.find(
        (item) => item.type === 'file' && item.path === 'package.json'
      );

      expect(packageJson).toBeDefined();
      expect(packageJson?.content).toContain(basicConfig.name);
      expect(packageJson?.content).toContain(basicConfig.description);
      expect(packageJson?.content).toContain('typescript');
      expect(packageJson?.content).toContain('vitest');
      expect(packageJson?.content).toContain('scripts');
    });

    it('should generate TypeScript configuration', () => {
      // When
      const structure = generator.generate(basicConfig);

      // Then
      const tsconfig = structure.find(
        (item) => item.type === 'file' && item.path === 'tsconfig.json'
      );

      expect(tsconfig).toBeDefined();
      expect(tsconfig?.content).toContain('compilerOptions');
      expect(tsconfig?.content).toContain('strict');
      expect(tsconfig?.content).toContain('include');
      expect(tsconfig?.content).toContain('exclude');
    });

    it('should generate ESLint configuration based on quality level', () => {
      // When
      const structure = generator.generate(basicConfig);

      // Then
      const eslintConfig = structure.find(
        (item) => item.type === 'file' && item.path === '.eslintrc.json'
      );

      expect(eslintConfig).toBeDefined();
      expect(eslintConfig?.content).toContain('@typescript-eslint');
      expect(eslintConfig?.content).toContain('rules');
    });
  });

  describe('AC4: Documentation Files Generation', () => {
    it('should generate README.md with project information', () => {
      // When
      const structure = generator.generate(basicConfig);

      // Then
      const readme = structure.find((item) => item.type === 'file' && item.path === 'README.md');

      expect(readme).toBeDefined();
      expect(readme?.content).toContain(basicConfig.name);
      expect(readme?.content).toContain(basicConfig.description);
      expect(readme?.content).toContain('#');
    });

    it('should generate API documentation placeholder', () => {
      // When
      const structure = generator.generate(basicConfig);

      // Then
      const apiDocs = structure.find((item) => item.type === 'file' && item.path === 'docs/api.md');

      expect(apiDocs).toBeDefined();
      expect(apiDocs?.content).toContain('API Documentation');
      expect(apiDocs?.content).toContain('## Overview');
      expect(apiDocs?.content).toContain('## Installation');
    });

    it('should generate AI assistant configuration files', () => {
      // Given
      const claudeConfig: ProjectConfig = {
        ...basicConfig,
        aiAssistants: ['claude-code', 'cursor'] as ProjectConfig['aiAssistants'],
      };

      // When
      const structure = generator.generate(claudeConfig);

      // Then
      const claudeFile = structure.find(
        (item) => item.type === 'file' && item.path === '.claude/CLAUDE.md'
      );
      const cursorFile = structure.find(
        (item) => item.type === 'file' && item.path === '.cursorrules'
      );

      expect(claudeFile).toBeDefined();
      expect(cursorFile).toBeDefined();
    });
  });

  describe('AC5: Quality and Testing Structure', () => {
    it('should create test directory structure matching source code', () => {
      // When
      const structure = generator.generate(basicConfig);

      // Then
      const directories = structure.filter((item) => item.type === 'directory');
      const testDirs = directories.filter((item) => item.path.startsWith('tests/'));
      const testPaths = testDirs.map((item) => item.path);

      // Should mirror typical source organization
      expect(testPaths).toContain('tests/unit');
      expect(testPaths).toContain('tests/integration');
      expect(testPaths).toContain('tests/e2e');
      expect(testPaths).toContain('tests/fixtures');
      expect(testPaths).toContain('tests/factories');
    });

    it('should generate basic test files with examples', () => {
      // When
      const structure = generator.generate(basicConfig);

      // Then
      const testSetup = structure.find(
        (item) => item.type === 'file' && item.path === 'tests/setup.ts'
      );
      const indexTest = structure.find(
        (item) => item.type === 'file' && item.path === 'tests/index.test.ts'
      );

      expect(testSetup).toBeDefined();
      expect(testSetup?.content).toContain('import { vi }');
      expect(testSetup?.content).toContain('beforeEach');

      expect(indexTest).toBeDefined();
      expect(indexTest?.content).toContain('describe');
      expect(indexTest?.content).toContain('it');
      expect(indexTest?.content).toContain('expect');
    });

    it('should set up test configuration files', () => {
      // When
      const structure = generator.generate(basicConfig);

      // Then
      const vitestConfig = structure.find(
        (item) => item.type === 'file' && item.path === 'vitest.config.ts'
      );

      expect(vitestConfig).toBeDefined();
      expect(vitestConfig?.content).toContain('defineConfig');
      expect(vitestConfig?.content).toContain('coverage');
    });

    it('should include test data and fixtures directories', () => {
      // When
      const structure = generator.generate(basicConfig);

      // Then
      const directories = structure.filter((item) => item.type === 'directory');
      const directoryPaths = directories.map((item) => item.path);

      expect(directoryPaths).toContain('tests/fixtures');
      expect(directoryPaths).toContain('tests/factories');
      expect(structure.find((item) => item.path === 'tests/fixtures/.gitkeep')).toBeDefined();
      expect(structure.find((item) => item.path === 'tests/factories/.gitkeep')).toBeDefined();
    });

    it('should configure coverage reporting based on quality level', () => {
      // Given
      const highQualityConfig = { ...basicConfig, qualityLevel: 'high' as const };

      // When
      const structure = generator.generate(highQualityConfig);

      // Then
      const vitestConfig = structure.find(
        (item) => item.type === 'file' && item.path === 'vitest.config.ts'
      );

      expect(vitestConfig?.content).toContain('coverage');

      // High quality should include additional quality configurations
      const strykerConfig = structure.find(
        (item) => item.type === 'file' && item.path === 'stryker.config.json'
      );
      expect(strykerConfig).toBeDefined();
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle empty project configuration', () => {
      // Given
      const emptyConfig: ProjectConfig = {
        name: 'empty',
        qualityLevel: 'light',
        projectType: 'basic',
        aiAssistants: [],
      };

      // When
      const structure = generator.generate(emptyConfig);

      // Then
      expect(structure.length).toBeGreaterThan(0);
      expect(structure.some((item) => item.path === 'src/index.ts')).toBe(true);
    });

    it('should handle project with special characters in name', () => {
      // Given
      const specialConfig = {
        ...basicConfig,
        name: 'my-special_project@123',
      };

      // When
      const structure = generator.generate(specialConfig);

      // Then
      expect(structure.some((item) => item.path === 'src/index.ts')).toBe(true);
      expect(structure.some((item) => item.path === `bin/${specialConfig.name}`)).toBe(false); // Not CLI
    });

    it('should handle all project types without errors', () => {
      // Given
      const projectTypes: Array<ProjectConfig['projectType']> = [
        'basic',
        'web',
        'cli',
        'library',
        'bun-react',
        'bun-vue',
        'bun-express',
      ];

      // When/Then
      for (const projectType of projectTypes) {
        const config = { ...basicConfig, projectType };
        expect(() => generator.generate(config)).not.toThrow();
      }
    });

    it('should handle all quality levels without errors', () => {
      // Given
      const qualityLevels: Array<ProjectConfig['qualityLevel']> = [
        'light',
        'medium',
        'strict',
        'high',
      ];

      // When/Then
      for (const qualityLevel of qualityLevels) {
        const config = { ...basicConfig, qualityLevel };
        expect(() => generator.generate(config)).not.toThrow();
      }
    });
  });

  describe('Performance Requirements', () => {
    it('should generate directory structure in under 5 seconds', () => {
      // Given
      const startTime = performance.now();

      // When
      generator.generate(basicConfig);

      // Then
      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(5000); // 5 seconds in milliseconds
    });

    it('should handle large project configurations efficiently', () => {
      // Given
      const complexConfig: ProjectConfig = {
        ...basicConfig,
        qualityLevel: 'high',
        projectType: 'bun-express',
        aiAssistants: ['claude-code', 'cursor', 'github-copilot'] as ProjectConfig['aiAssistants'],
      };

      // When
      const startTime = performance.now();
      const structure = generator.generate(complexConfig);
      const endTime = performance.now();

      // Then
      const duration = endTime - startTime;
      expect(duration).toBeLessThan(5000);
      expect(structure.length).toBeGreaterThan(20); // Should generate more files for complex config
    });
  });

  describe('Integration with Existing Systems', () => {
    it('should integrate with template engine', () => {
      // When
      const structure = generator.generate(basicConfig);

      // Then
      // Should include template-generated files (from template-generator)
      expect(structure.some((item) => item.path.startsWith('src/utils/'))).toBe(true);
      expect(structure.some((item) => item.path.startsWith('src/constants/'))).toBe(true);
    });

    it('should integrate with quality configuration system', () => {
      // Given
      const strictConfig = { ...basicConfig, qualityLevel: 'strict' as const };

      // When
      const structure = generator.generate(strictConfig);

      // Then
      // Should include quality configuration files
      expect(structure.some((item) => item.path === 'tsconfig.json')).toBe(true);
      expect(structure.some((item) => item.path === '.eslintrc.json')).toBe(true);
      expect(structure.some((item) => item.path === 'vitest.config.ts')).toBe(true);
    });

    it('should maintain compatibility with existing interfaces', () => {
      // When
      const structure = generator.generate(basicConfig);

      // Then
      // All directory items should have required properties
      for (const item of structure) {
        expect(item.path).toBeDefined();
        expect(item.type).toBeDefined();
        expect(['directory', 'file']).toContain(item.type);

        if (item.type === 'file') {
          expect(item.content).toBeDefined();
        }
      }
    });
  });
});
