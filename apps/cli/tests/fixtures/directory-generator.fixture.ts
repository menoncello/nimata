import { test as base } from 'bun:test';
import { TestProject, createTestProject } from '../e2e/support/test-project.js';
import {
  ProjectConfig,
  createProjectConfig,
  createCliProjectConfig,
  createWebProjectConfig,
  createLibraryProjectConfig,
} from '../factories/project-config.factory.js';

/**
 * Fixture for directory structure generator tests
 * Provides test project isolation and factory methods
 */
export const test = base.extend<{
  testProject: TestProject;
  createBasicConfig: () => ProjectConfig;
  createCliConfig: () => ProjectConfig;
  createWebConfig: () => ProjectConfig;
  createLibraryConfig: () => ProjectConfig;
  createCustomConfig: (overrides: Partial<ProjectConfig>) => ProjectConfig;
  createDirectory: (path: string) => Promise<void>;
  writeFile: (path: string, content: string) => Promise<void>;
  readFile: (path: string) => Promise<string>;
  fileExists: (path: string) => boolean;
}>({
  // Test project fixture - creates isolated temporary directory
  testProject: async ({}, use) => {
    const testProject = await createTestProject('directory-generator-');
    await use(testProject);
    await testProject.cleanup();
  },

  // Factory methods for different project configurations
  createBasicConfig: async ({}, use) => {
    await use(() => createProjectConfig({ type: 'basic' }));
  },

  createCliConfig: async ({}, use) => {
    await use(() => createCliProjectConfig());
  },

  createWebConfig: async ({}, use) => {
    await use(() => createWebProjectConfig());
  },

  createLibraryConfig: async ({}, use) => {
    await use(() => createLibraryProjectConfig());
  },

  createCustomConfig: async ({}, use) => {
    await use((overrides) => createProjectConfig(overrides));
  },

  // Helper methods for file system operations within test project
  createDirectory: async ({ testProject }, use) => {
    await use(async (relativePath: string) => {
      const fullPath = testProject.resolve(relativePath);
      await Bun.write(`${fullPath}/.gitkeep`, ''); // Create with .gitkeep
    });
  },

  writeFile: async ({ testProject }, use) => {
    await use(async (relativePath: string, content: string) => {
      await testProject.writeFile(relativePath, content);
    });
  },

  readFile: async ({ testProject }, use) => {
    await use(async (relativePath: string) => {
      return testProject.readFile(relativePath);
    });
  },

  fileExists: async ({ testProject }, use) => {
    await use((relativePath: string) => {
      return testProject.fileExists(relativePath);
    });
  },
});

/**
 * Specialized fixture for CLI project testing
 */
export const cliTest = base.extend<{
  testProject: TestProject;
  cliConfig: ProjectConfig;
  createExecutable: (name: string, content: string) => Promise<void>;
  verifyExecutablePermissions: (path: string) => Promise<boolean>;
}>({
  testProject: async ({}, use) => {
    const testProject = await createTestProject('cli-generator-');
    await use(testProject);
    await testProject.cleanup();
  },

  cliConfig: async ({}, use) => {
    await use(createCliProjectConfig());
  },

  createExecutable: async ({ testProject }, use) => {
    await use(async (name: string, content: string) => {
      const fullPath = testProject.resolve(`bin/${name}`);
      const contentWithShebang = content.startsWith('#!')
        ? content
        : `#!/usr/bin/env bun\n${content}`;
      await Bun.write(fullPath, contentWithShebang);

      // Set executable permissions
      await Bun.spawn(['chmod', '+x', fullPath], { stdout: 'ignore', stderr: 'ignore' });
    });
  },

  verifyExecutablePermissions: async ({ testProject }, use) => {
    await use(async (relativePath: string) => {
      const fullPath = testProject.resolve(relativePath);
      const stats = await Bun.file(fullPath).stat();
      // Check if file is executable (owner permission)
      return (stats.mode & 0o111) !== 0;
    });
  },
});

/**
 * Specialized fixture for quality testing
 */
export const qualityTest = base.extend<{
  testProject: TestProject;
  basicConfig: ProjectConfig;
  standardConfig: ProjectConfig;
  highQualityConfig: ProjectConfig;
  verifyQualityFiles: (quality: string) => Promise<boolean>;
}>({
  testProject: async ({}, use) => {
    const testProject = await createTestProject('quality-generator-');
    await use(testProject);
    await testProject.cleanup();
  },

  basicConfig: async ({}, use) => {
    await use(createProjectConfig({ quality: 'basic' }));
  },

  standardConfig: async ({}, use) => {
    await use(createProjectConfig({ quality: 'standard' }));
  },

  highQualityConfig: async ({}, use) => {
    await use(createProjectConfig({ quality: 'high' }));
  },

  verifyQualityFiles: async ({ testProject }, use) => {
    await use(async (quality: string) => {
      const baseFiles = ['package.json', 'tsconfig.json', '.gitignore'];
      const standardFiles = ['eslint.config.mjs', 'tests/setup.ts'];
      const highQualityFiles = [
        'tests/performance/',
        'tests/mutation/',
        'tests/security/',
        'docs/api.md',
        'CLAUDE.md',
      ];

      const allFiles = [...baseFiles];
      if (quality !== 'basic') allFiles.push(...standardFiles);
      if (quality === 'high') allFiles.push(...highQualityFiles);

      return allFiles.every((file) => testProject.fileExists(file));
    });
  },
});

/**
 * Fixture for integration testing with existing project generation system
 */
export const integrationTest = base.extend<{
  testProject: TestProject;
  existingProjectConfig: ProjectConfig;
  mockExistingFiles: () => Promise<void>;
  verifyBackwardCompatibility: () => Promise<boolean>;
}>({
  testProject: async ({}, use) => {
    const testProject = await createTestProject('integration-generator-');
    await use(testProject);
    await testProject.cleanup();
  },

  existingProjectConfig: async ({}, use) => {
    await use(
      createProjectConfig({
        name: 'existing-project',
        type: 'basic',
        description: 'Project with existing Story 1.3 functionality',
      })
    );
  },

  mockExistingFiles: async ({ testProject: _testProject, writeFile }, use) => {
    await use(async () => {
      // Mock existing template files from Story 1.3
      await writeFile(
        'package.json',
        JSON.stringify(
          {
            name: 'existing-project',
            version: '1.0.0',
            scripts: { build: 'tsc', test: 'bun test' },
          },
          null,
          2
        )
      );

      await writeFile(
        'tsconfig.json',
        JSON.stringify(
          {
            compilerOptions: { strict: true, target: 'ES2022' },
          },
          null,
          2
        )
      );

      await writeFile(
        'src/index.ts',
        '// Existing entry point\nexport function hello() {\n  return "Hello World";\n}\n'
      );
    });
  },

  verifyBackwardCompatibility: async ({ testProject: _testProject, fileExists }, use) => {
    await use(async () => {
      // Verify existing files still exist
      const existingFiles = ['package.json', 'tsconfig.json', 'src/index.ts'];
      const existingFilesExist = existingFiles.every((file) => fileExists(file));

      // Verify new directory structure was added
      const newDirectories = ['tests/', 'docs/', '.nimata/'];
      const newDirectoriesExist = newDirectories.every((dir) => fileExists(dir));

      return existingFilesExist && newDirectoriesExist;
    });
  },
});

/**
 * Fixture for error handling testing
 */
export const errorTest = base.extend<{
  testProject: TestProject;
  createConflictingFile: (path: string) => Promise<void>;
  createPermissionDeniedScenario: (path: string) => Promise<void>;
  simulateNetworkError: () => Promise<void>;
}>({
  testProject: async ({}, use) => {
    const testProject = await createTestProject('error-generator-');
    await use(testProject);
    await testProject.cleanup();
  },

  createConflictingFile: async ({ testProject: _testProject, writeFile }, use) => {
    await use(async (path: string) => {
      // Create a file where directory should be created
      await writeFile(path, 'This is a file, not a directory');
    });
  },

  createPermissionDeniedScenario: async ({ testProject }, use) => {
    await use(async (path: string) => {
      // Create a directory with restricted permissions (on Unix-like systems)
      const fullPath = testProject.resolve(path);
      await Bun.mkdir(fullPath, { recursive: true });
      try {
        await Bun.spawn(['chmod', '000', fullPath], { stdout: 'ignore', stderr: 'ignore' });
      } catch {
        // Permission tests may not work on all systems
      }
    });
  },

  simulateNetworkError: async ({}, use) => {
    await use(async () => {
      // Mock network error scenarios for template fetching
      // This would be used when testing external template retrieval
    });
  },
});

// Export the base test for fallback
export { expect } from 'bun:test';
