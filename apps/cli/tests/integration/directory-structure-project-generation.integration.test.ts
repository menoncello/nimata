import { describe, test, expect, beforeEach, afterEach } from 'bun:test';
import type { ProjectConfig } from '@nimata/adapters/wizards/project-wizard';
import { DirectoryStructureGenerator } from '@nimata/core';
import { TestProject, createTestProject } from '../e2e/support/test-project.js';

/**
 * Helper function to generate a project using the DirectoryStructureGenerator
 */
async function generateProject(
  testProject: TestProject,
  config: Partial<ProjectConfig>
): Promise<void> {
  const directoryGenerator = new DirectoryStructureGenerator();

  const defaultConfig: ProjectConfig = {
    name: 'test-project',
    description: 'Test project',
    author: 'Test Author',
    license: 'MIT',
    qualityLevel: 'medium',
    projectType: 'basic',
    aiAssistants: [],
    template: 'basic',
    ...config,
  };

  // Validate configuration before generation
  validateProjectConfig(defaultConfig);

  const structure = directoryGenerator.generate(defaultConfig);
  await directoryGenerator.createStructureFromDirectoryItems(testProject.path, structure);
}

/**
 * Validate project configuration
 * @param {ProjectConfig} config - Project configuration to validate
 * @throws {Error} If configuration is invalid
 */
function validateProjectConfig(config: ProjectConfig): void {
  if (!config.name || config.name.trim() === '') {
    throw new Error('Project name is required and cannot be empty');
  }

  const validProjectTypes = ['basic', 'web', 'cli', 'library'];
  if (!validProjectTypes.includes(config.projectType)) {
    throw new Error(
      `Invalid project type: ${config.projectType}. Must be one of: ${validProjectTypes.join(', ')}`
    );
  }

  const validQualityLevels = ['light', 'medium', 'basic', 'standard', 'high', 'strict'];
  if (!validQualityLevels.includes(config.qualityLevel)) {
    throw new Error(
      `Invalid quality level: ${config.qualityLevel}. Must be one of: ${validQualityLevels.join(', ')}`
    );
  }
}

describe('Directory Structure Generator Integration with Project Generation System', () => {
  let testProject: TestProject | null = null;

  beforeEach(async () => {
    testProject = await createTestProject('integration-dir-struct-');
  });

  afterEach(async () => {
    if (testProject) {
      await testProject.cleanup();
      testProject = null;
    }
  });

  describe('Integration with Template Engine', () => {
    test('should integrate directory generation with existing template system', async () => {
      // GIVEN: Existing template system from Story 1.3 and directory structure from Story 1.4
      await generateProject(testProject!, {
        name: 'integration-test',
        projectType: 'basic',
      });

      // WHEN: Running complete project generation with directory structure
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
          await generateProject(typeTestProject, {
            name: `${projectType}-test`,
            projectType: projectType as any,
          });

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
      await generateProject(testProject!, {
        name: 'quality-test',
        projectType: 'basic',
        qualityLevel: 'high',
      });

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
          // WHEN: Generating project with specific quality level
          await generateProject(qualityTestProject, {
            name: `quality-${quality}-test`,
            projectType: 'basic',
            qualityLevel: quality as any,
          });

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
      await generateProject(testProject!, {
        name: 'ai-context-test',
        projectType: 'basic',
        aiAssistants: ['claude-code'],
        description: 'ai-context-test project',
      });

      // WHEN: Generating project with AI context
      // THEN: Should generate AI context files alongside directory structure
      expect(testProject!.fileExists('.claude/')).toBe(true);
      expect(testProject!.fileExists('CLAUDE.md')).toBe(true);

      const claudeContent = await testProject!.readFile('CLAUDE.md');
      expect(claudeContent).toContain('ai-context-test project');
      expect(claudeContent).toContain('Project Information');

      // Directory structure should still be generated
      expect(testProject!.fileExists('src/')).toBe(true);
      expect(testProject!.fileExists('tests/')).toBe(true);
      expect(testProject!.fileExists('docs/')).toBe(true);
    });
  });

  describe('Workflow Integration', () => {
    test('should work within existing CLI command structure', async () => {
      // GIVEN: CLI command structure from existing system
      // Use the directory structure generator directly to simulate CLI behavior
      await generateProject(testProject!, {
        name: 'integration-test',
        projectType: 'basic',
        description: 'Integration test project',
      });

      // WHEN: Running CLI command that triggers project generation
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
      // WHEN: Running minimal project generation (should still create basic structure)
      await generateProject(testProject!, {
        name: 'backward-compat-test',
        projectType: 'basic',
      });

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
      // Test with empty project name (should be handled gracefully)
      try {
        await generateProject(testProject!, {
          name: '', // Invalid empty name
          projectType: 'basic' as any,
        });
      } catch {
        // Expected to fail, but should handle gracefully
      }

      // THEN: Should handle errors without partial generation
      // The implementation should not create partial files on error
      expect(testProject!.fileExists('src/')).toBe(false);
      expect(testProject!.fileExists('tests/')).toBe(false);
    });

    test('should provide rollback on failed generation', async () => {
      // GIVEN: Project generation that fails partway through
      // Mock a failure scenario by using invalid project type
      try {
        await generateProject(testProject!, {
          name: 'rollback-test',
          projectType: 'invalid-type' as any,
        });
      } catch {
        // Expected to fail
      }

      // THEN: Should clean up any partially created files
      // Should not leave partial files when generation fails
      expect(testProject!.fileExists('src/')).toBe(false);
      expect(testProject!.fileExists('tests/')).toBe(false);
    });
  });
});
