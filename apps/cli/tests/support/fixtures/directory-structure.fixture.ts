/**
 * Directory Structure Generator Test Fixtures
 *
 * Test fixtures with auto-cleanup following the fixture-architecture pattern
 * from the knowledge base. These fixtures provide isolated test environments
 * for directory structure generation functionality.
 */

import { promises as fs } from 'node:fs';
import { join } from 'node:path';
import { test as base } from '@bun:test';
import { TestProject } from '../e2e/support/test-project';
import {
  createDirectoryStructureConfig,
  DirectoryStructureConfig,
} from '../factories/directory-structure.factory';

// Extend the base test type with our fixtures
interface DirectoryStructureFixture {
  testProject: TestProject;
  config: DirectoryStructureConfig;
  createTestFiles: (relativePath: string, content: string) => Promise<void>;
  cleanupTempFiles: () => Promise<void>;
  createdTempFiles: string[];
}

export const test = base.extend<DirectoryStructureFixture>({
  // Fixture for isolated test project with auto-cleanup
  testProject: async ({}, use) => {
    const testProject = await TestProject.create('directory-structure-test-');

    await use(testProject);

    // Auto-cleanup after test
    await testProject.cleanup();
  },

  // Fixture for project configuration
  config: async ({ testProject }, use) => {
    const config = createDirectoryStructureConfig({
      targetDirectory: testProject.path,
    });

    await use(config);
  },

  // Fixture for creating test files during test execution
  createTestFiles: async ({ testProject }, use) => {
    const createdTempFiles: string[] = [];

    const createTestFiles = async (relativePath: string, content: string) => {
      const fullPath = join(testProject.path, relativePath);
      await fs.mkdir(join(fullPath, '..'), { recursive: true });
      await fs.writeFile(fullPath, content, 'utf-8');
      createdTempFiles.push(relativePath);
    };

    await use(createTestFiles);

    // Cleanup created temp files
    for (const filePath of createdTempFiles) {
      try {
        await fs.unlink(join(testProject.path, filePath));
      } catch (error) {
        // Best effort cleanup
        console.warn(`Failed to cleanup temp file: ${filePath}`, error);
      }
    }
  },

  // Fixture for cleaning up temporary files
  cleanupTempFiles: async ({ testProject }, use) => {
    const cleanupTempFiles = async () => {
      // This would be called during test to cleanup specific files
      // The actual cleanup happens in the createTestFiles fixture
    };

    await use(cleanupTempFiles);
  },

  // Fixture for tracking created temp files
  createdTempFiles: async ({}, use) => {
    const files: string[] = [];
    await use(files);
  },
});

// Export the extended test for use in test files
export { expect } from '@bun:test';

/**
 * Helper fixture for directory structure integration tests
 */
export const createDirectoryStructureTestFixture = async (
  overrides: Partial<DirectoryStructureConfig> = {}
): Promise<{ testProject: TestProject; config: DirectoryStructureConfig }> => {
  const testProject = await TestProject.create('directory-structure-fixture-');
  const config = createDirectoryStructureConfig({
    ...overrides,
    targetDirectory: testProject.path,
  });

  return { testProject, config };
};

/**
 * Helper fixture for CLI integration tests
 */
export const createCliTestFixture = async (): Promise<{
  testProject: TestProject;
  config: DirectoryStructureConfig;
}> => {
  const testProject = await TestProject.create('cli-fixture-');
  const config = createDirectoryStructureConfig({
    projectType: 'cli',
    qualityLevel: 'strict',
    targetDirectory: testProject.path,
  });

  return { testProject, config };
};

/**
 * Helper fixture for web project integration tests
 */
export const createWebTestFixture = async (): Promise<{
  testProject: TestProject;
  config: DirectoryStructureConfig;
}> => {
  const testProject = await TestProject.create('web-fixture-');
  const config = createDirectoryStructureConfig({
    projectType: 'web',
    qualityLevel: 'strict',
    targetDirectory: testProject.path,
  });

  return { testProject, config };
};

/**
 * Helper fixture for library project integration tests
 */
export const createLibraryTestFixture = async (): Promise<{
  testProject: TestProject;
  config: DirectoryStructureConfig;
}> => {
  const testProject = await TestProject.create('library-fixture-');
  const config = createDirectoryStructureConfig({
    projectType: 'library',
    qualityLevel: 'strict',
    targetDirectory: testProject.path,
  });

  return { testProject, config };
};
