import { describe, test, expect, beforeEach, afterEach } from 'bun:test';
import { TestProject, createTestProject } from '../e2e/support/test-project.js';

// Import existing project generation system (from Story 1.3)
// import { ProjectGenerationSystem } from '../../src/services/project-generation-system.js';
// import { DirectoryStructureGenerator } from '@nimata/core';

describe('Directory Structure Generator Integration with Project Generation System', () => {
  let testProject: TestProject | null = null;
  let projectGenerator: any; // Will be imported from Story 1.3 implementation
  let directoryGenerator: any; // Will be imported from Story 1.4 implementation

  beforeEach(async () => {
    testProject = await createTestProject('integration-dir-struct-');
    // projectGenerator = new ProjectGenerationSystem();
    // directoryGenerator = new DirectoryStructureGenerator();
  });

  afterEach(async () => {
    if (testProject) {
      await testProject.cleanup();
      testProject = null;
    }
  });

  describe('Integration with Template Engine', () => {
    test('should integrate directory generation with existing template system', async () => {
      // GIVEN: Existing template system from Story 1.3
      const projectPath = testProject!.path;
      const projectConfig = {
        name: 'integration-test',
        type: 'basic',
        description: 'Integration test for directory structure generator',
        quality: 'standard',
      };

      // WHEN: Running complete project generation with directory structure
      // const result = await projectGenerator.generateProject(projectPath, projectConfig);

      // This should internally use DirectoryStructureGenerator from Story 1.4
      // await directoryGenerator.generateDirectoryStructure(projectPath, projectConfig);

      // THEN: Both template files and directory structure should be created
      // Template files (from Story 1.3)
      expect(testProject!.fileExists('src/index.ts')).toBe(true);
      expect(testProject!.fileExists('package.json')).toBe(true);
      expect(testProject!.fileExists('README.md')).toBe(true);

      // Directory structure (from Story 1.4)
      expect(testProject!.fileExists('tests/')).toBe(true);
      expect(testProject!.fileExists('bin/')).toBe(true);
      expect(testProject!.fileExists('docs/')).toBe(true);
      expect(testProject!.fileExists('.nimata/')).toBe(true);
    });

    test('should maintain compatibility with existing project types', async () => {
      // GIVEN: All supported project types from Story 1.3
      const projectTypes = ['basic', 'web', 'cli', 'library'];

      for (const projectType of projectTypes) {
        // Create fresh test project for each type
        const typeTestProject = await createTestProject(`integration-${projectType}-`);

        try {
          // WHEN: Generating project with specific type
          const projectConfig = {
            name: `${projectType}-test`,
            type: projectType,
            description: `Test project for ${projectType} type`,
          };

          // const result = await projectGenerator.generateProject(typeTestProject.path, projectConfig);

          // THEN: Should generate appropriate structure for each project type
          expect(typeTestProject.fileExists('src/')).toBe(true);
          expect(typeTestProject.fileExists('tests/')).toBe(true);

          // Type-specific directories
          if (projectType === 'web') {
            expect(typeTestProject.fileExists('public/')).toBe(true);
            expect(typeTestProject.fileExists('src/components/')).toBe(true);
          } else if (projectType === 'cli') {
            expect(typeTestProject.fileExists('bin/')).toBe(true);
            expect(typeTestProject.fileExists('src/cli/')).toBe(true);
          } else if (projectType === 'library') {
            expect(typeTestProject.fileExists('dist/')).toBe(true);
          }
        } finally {
          await typeTestProject.cleanup();
        }
      }
    });
  });

  describe('Quality System Integration', () => {
    test('should integrate with quality configuration system from Story 1.2', async () => {
      // GIVEN: High quality configuration
      const projectPath = testProject!.path;
      const projectConfig = {
        name: 'high-quality-test',
        type: 'basic',
        quality: 'high', // From Story 1.2 quality levels
        description: 'High quality project with comprehensive testing',
      };

      // WHEN: Generating project with high quality settings
      // const result = await projectGenerator.generateProject(projectPath, projectConfig);

      // THEN: Should generate enhanced directory structure for high quality
      expect(testProject!.fileExists('tests/')).toBe(true);
      expect(testProject!.fileExists('tests/unit/')).toBe(true);
      expect(testProject!.fileExists('tests/integration/')).toBe(true);
      expect(testProject!.fileExists('tests/e2e/')).toBe(true);
      expect(testProject!.fileExists('tests/fixtures/')).toBe(true);

      // Quality-specific configurations
      expect(testProject!.fileExists('eslint.config.mjs')).toBe(true);
      expect(testProject!.fileExists('tsconfig.json')).toBe(true);

      // High quality should include additional testing infrastructure
      expect(testProject!.fileExists('tests/setup.ts')).toBe(true);
    });

    test('should adapt test structure based on quality level', async () => {
      // GIVEN: Different quality levels
      const qualityLevels = ['basic', 'standard', 'high'];

      for (const quality of qualityLevels) {
        const qualityTestProject = await createTestProject(`quality-${quality}-test-`);

        try {
          const projectConfig = {
            name: `${quality}-project`,
            type: 'basic',
            quality: quality,
            description: `Project with ${quality} quality level`,
          };

          // WHEN: Generating project with specific quality level
          // await projectGenerator.generateProject(qualityTestProject.path, projectConfig);

          // THEN: Test structure should reflect quality level
          expect(qualityTestProject.fileExists('tests/')).toBe(true);

          // Higher quality levels should have more comprehensive test structure
          if (quality === 'high') {
            expect(qualityTestProject.fileExists('tests/performance/')).toBe(true);
            expect(qualityTestProject.fileExists('tests/mutation/')).toBe(true);
          }
        } finally {
          await qualityTestProject.cleanup();
        }
      }
    });
  });

  describe('AI Context Integration', () => {
    test('should integrate with AI context generation from Story 1.3', async () => {
      // GIVEN: Project configuration requiring AI context
      const projectPath = testProject!.path;
      const projectConfig = {
        name: 'ai-context-test',
        type: 'basic',
        description: 'Project with AI context integration',
        generateAiContext: true,
      };

      // WHEN: Generating project with AI context
      // const result = await projectGenerator.generateProject(projectPath, projectConfig);

      // THEN: Should generate AI context files alongside directory structure
      expect(testProject!.fileExists('CLAUDE.md')).toBe(true);

      const claudeContent = await testProject!.readFile('CLAUDE.md');
      expect(claudeContent).toContain('ai-context-test');
      expect(claudeContent).toContain('Project Context');

      // Directory structure should still be generated
      expect(testProject!.fileExists('src/')).toBe(true);
      expect(testProject!.fileExists('tests/')).toBe(true);
      expect(testProject!.fileExists('docs/')).toBe(true);
    });
  });

  describe('Workflow Integration', () => {
    test('should work within existing CLI command structure', async () => {
      // GIVEN: CLI command structure from existing system
      const projectPath = testProject!.path;

      // WHEN: Running CLI command that triggers project generation
      // This simulates: bun run cli generate --type basic --name test-project
      const result = Bun.spawn(
        [
          'bun',
          'run',
          'apps/cli/src/index.ts',
          'generate',
          '--type',
          'basic',
          '--name',
          'integration-test',
          '--description',
          'Integration test project',
        ],
        {
          cwd: projectPath,
          stdout: 'pipe',
          stderr: 'pipe',
        }
      );

      await result.exited;

      // THEN: Should generate complete project with directory structure
      // Template files (existing functionality)
      expect(testProject!.fileExists('package.json')).toBe(true);
      expect(testProject!.fileExists('tsconfig.json')).toBe(true);
      expect(testProject!.fileExists('src/index.ts')).toBe(true);

      // Directory structure (new functionality from Story 1.4)
      expect(testProject!.fileExists('tests/')).toBe(true);
      expect(testProject!.fileExists('tests/unit/')).toBe(true);
      expect(testProject!.fileExists('tests/integration/')).toBe(true);
      expect(testProject!.fileExists('tests/e2e/')).toBe(true);
      expect(testProject!.fileExists('bin/')).toBe(true);
      expect(testProject!.fileExists('docs/')).toBe(true);
      expect(testProject!.fileExists('.nimata/')).toBe(true);
    });

    test('should maintain backward compatibility with existing workflows', async () => {
      // GIVEN: Existing workflow that doesn't specify directory structure
      const projectPath = testProject!.path;

      // WHEN: Running minimal project generation (should still create basic structure)
      const result = Bun.spawn(
        ['bun', 'run', 'apps/cli/src/index.ts', 'generate', '--name', 'backward-compat-test'],
        {
          cwd: projectPath,
          stdout: 'pipe',
          stderr: 'pipe',
        }
      );

      await result.exited;

      // THEN: Should work with existing functionality while adding directory structure
      expect(testProject!.fileExists('package.json')).toBe(true);
      expect(testProject!.fileExists('src/index.ts')).toBe(true);

      // New directory structure should be added by default
      expect(testProject!.fileExists('tests/')).toBe(true);
      expect(testProject!.fileExists('docs/')).toBe(true);
    });
  });

  describe('Error Handling Integration', () => {
    test('should handle integration errors gracefully', async () => {
      // GIVEN: Project generation with invalid configuration
      const projectPath = testProject!.path;
      const invalidConfig = {
        name: '', // Invalid empty name
        type: 'invalid-type', // Invalid project type
        description: 'Test with invalid config',
      };

      // WHEN: Attempting to generate project with invalid config
      // const result = await projectGenerator.generateProject(projectPath, invalidConfig);

      // THEN: Should handle errors without partial generation
      // expect(result.success).toBe(false);
      // expect(result.errors).toBeDefined();
      expect(true).toBe(true); // Placeholder until implementation

      // Should not leave partial files
      expect(testProject!.fileExists('src/')).toBe(false);
      expect(testProject!.fileExists('tests/')).toBe(false);
    });

    test('should provide rollback on failed generation', async () => {
      // GIVEN: Project generation that fails partway through
      const projectPath = testProject!.path;

      // Mock a failure scenario (e.g., permission error)
      // This would require the implementation to have rollback capability

      // WHEN: Generation fails partway through
      // const result = await projectGenerator.generateProject(projectPath, config);

      // THEN: Should clean up any partially created files
      // expect(result.rolledBack).toBe(true);
      expect(true).toBe(true); // Placeholder until implementation
    });
  });
});
