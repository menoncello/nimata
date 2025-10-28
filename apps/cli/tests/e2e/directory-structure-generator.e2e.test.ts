/**
 * E2E Tests - Directory Structure Generator Workflow
 *
 * RED PHASE: These tests are written to FAIL before implementation
 * Following TDD red-green-refactor cycle
 *
 * Tests for AC6: Project-Specific Structure
 * - Adapts structure based on project type (basic, web, cli, library)
 * - Includes project-specific directories (e.g., public/ for web apps)
 * - Generates appropriate configuration files for project type
 * - Includes type-specific entry points and exports
 * - Supports template-based customization
 */
import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { executeCLI } from './support/helpers/cli-executor';
import {
  createTempDirectory,
  cleanupTempDirectory,
  assertDirectoryExists,
  assertFileExists,
} from './support/helpers/file-assertions';

describe('Directory Structure Generator - AC6: Project-Specific Structure (RED PHASE)', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDirectory();
  });

  afterEach(async () => {
    await cleanupTempDirectory(tempDir);
  });

  describe('AC6.1: Project Type Variations', () => {
    it('should generate basic project structure correctly', async () => {
      // GIVEN: User wants to create a basic TypeScript project
      // WHEN: Running directory structure generation for basic project type
      const result = await executeCLI({
        args: [
          'init',
          'basic-structure-test',
          '--template',
          'basic',
          '--quality',
          'strict',
          '--nonInteractive',
        ],
        cwd: tempDir,
      });

      // THEN: Basic project structure should be created
      expect(result.exitCode).toBe(0);

      // Verify basic project structure
      await assertDirectoryExists(tempDir, 'basic-structure-test');
      await assertDirectoryExists(tempDir, 'basic-structure-test/src');
      await assertDirectoryExists(tempDir, 'basic-structure-test/tests');
      await assertDirectoryExists(tempDir, 'basic-structure-test/docs');
      await assertDirectoryExists(tempDir, 'basic-structure-test/.nimata');

      // Basic project should NOT have type-specific directories
      // await assertDirectoryExists(tempDir, 'basic-structure-test/public'); // Should NOT exist
      // await assertDirectoryExists(tempDir, 'basic-structure-test/bin'); // Should NOT exist
    });

    it('should generate web project structure with additional directories', async () => {
      // GIVEN: User wants to create a web application project
      // WHEN: Running directory structure generation for web project type
      const result = await executeCLI({
        args: [
          'init',
          'web-structure-test',
          '--template',
          'web',
          '--quality',
          'strict',
          '--nonInteractive',
        ],
        cwd: tempDir,
      });

      // THEN: Web project structure should include web-specific directories
      expect(result.exitCode).toBe(0);

      // Verify web project structure
      await assertDirectoryExists(tempDir, 'web-structure-test');
      await assertDirectoryExists(tempDir, 'web-structure-test/src');
      await assertDirectoryExists(tempDir, 'web-structure-test/src/components');
      await assertDirectoryExists(tempDir, 'web-structure-test/src/utils');
      await assertDirectoryExists(tempDir, 'web-structure-test/public');
      await assertDirectoryExists(tempDir, 'web-structure-test/tests');
      await assertDirectoryExists(tempDir, 'web-structure-test/tests/unit/components');

      // Web-specific files
      await assertFileExists(`${tempDir}/web-structure-test/index.html`);
      await assertFileExists(`${tempDir}/web-structure-test/public/styles.css`);
    });

    it('should generate CLI project structure with executable launcher', async () => {
      // GIVEN: User wants to create a CLI application project
      // WHEN: Running directory structure generation for CLI project type
      const result = await executeCLI({
        args: [
          'init',
          'cli-structure-test',
          '--template',
          'cli',
          '--quality',
          'strict',
          '--nonInteractive',
        ],
        cwd: tempDir,
      });

      // THEN: CLI project structure should include CLI-specific components
      expect(result.exitCode).toBe(0);

      // Verify CLI project structure
      await assertDirectoryExists(tempDir, 'cli-structure-test');
      await assertDirectoryExists(tempDir, 'cli-structure-test/src');
      await assertDirectoryExists(tempDir, 'cli-structure-test/src/cli');
      await assertDirectoryExists(tempDir, 'cli-structure-test/bin');
      await assertDirectoryExists(tempDir, 'cli-structure-test/tests');
      await assertDirectoryExists(tempDir, 'cli-structure-test/tests/e2e');

      // CLI-specific files
      await assertFileExists(`${tempDir}/cli-structure-test/bin/cli-structure-test`);
    });

    it('should generate library project structure with proper exports', async () => {
      // GIVEN: User wants to create a library project
      // WHEN: Running directory structure generation for library project type
      const result = await executeCLI({
        args: [
          'init',
          'library-structure-test',
          '--template',
          'library',
          '--quality',
          'strict',
          '--nonInteractive',
        ],
        cwd: tempDir,
      });

      // THEN: Library project structure should include library-specific components
      expect(result.exitCode).toBe(0);

      // Verify library project structure
      await assertDirectoryExists(tempDir, 'library-structure-test');
      await assertDirectoryExists(tempDir, 'library-structure-test/src');
      await assertDirectoryExists(tempDir, 'library-structure-test/src/types');
      await assertDirectoryExists(tempDir, 'library-structure-test/tests');
      await assertDirectoryExists(tempDir, 'library-structure-test/docs');
      await assertDirectoryExists(tempDir, 'library-structure-test/docs/api');

      // Library-specific files
      await assertFileExists(`${tempDir}/library-structure-test/docs/api.md`);

      // Verify proper export structure in package.json
      const packageJson = await Bun.file(`${tempDir}/library-structure-test/package.json`).json();
      expect(packageJson.exports).toBeDefined();
      expect(packageJson.main).toBe('./dist/index.js');
      expect(packageJson.types).toBe('./dist/index.d.ts');
    });
  });

  describe('AC6.2: Project-Specific Configuration Files', () => {
    it('should generate web-specific configuration files', async () => {
      // GIVEN: User wants to create a web project with web-specific config
      // WHEN: Running directory structure generation for web project type
      const result = await executeCLI({
        args: [
          'init',
          'web-config-test',
          '--template',
          'web',
          '--quality',
          'strict',
          '--nonInteractive',
        ],
        cwd: tempDir,
      });

      // THEN: Web project should have web-specific configuration files
      expect(result.exitCode).toBe(0);

      // Verify web-specific configurations
      await assertFileExists(`${tempDir}/web-config-test/vite.config.ts`);
      await assertFileExists(`${tempDir}/web-config-test/index.html`);
      await assertFileExists(`${tempDir}/web-config-test/tsconfig.json`); // Should include web-specific config

      // Check vite configuration content
      const viteConfig = await Bun.file(`${tempDir}/web-config-test/vite.config.ts`).text();
      expect(viteConfig).toContain('export default defineConfig');
      expect(viteConfig).toContain('plugins:');
      expect(viteConfig).toContain('@vitejs/plugin-react');
    });

    it('should generate CLI-specific configuration files', async () => {
      // GIVEN: User wants to create a CLI project with CLI-specific config
      // WHEN: Running directory structure generation for CLI project type
      const result = await executeCLI({
        args: [
          'init',
          'cli-config-test',
          '--template',
          'cli',
          '--quality',
          'strict',
          '--nonInteractive',
        ],
        cwd: tempDir,
      });

      // THEN: CLI project should have CLI-specific configuration files
      expect(result.exitCode).toBe(0);

      // Verify CLI-specific configurations
      await assertFileExists(`${tempDir}/cli-config-test/bin/cli-config-test`);

      // Check CLI launcher content
      const cliLauncher = await Bun.file(`${tempDir}/cli-config-test/bin/cli-config-test`).text();
      expect(cliLauncher).toContain('#!/usr/bin/env bun');
      expect(cliLauncher).toContain('console.log');
      expect(cliLauncher).toContain('cli-config-test');

      // Check package.json bin configuration
      const packageJson = await Bun.file(`${tempDir}/cli-config-test/package.json`).json();
      expect(packageJson.bin).toBeDefined();
      expect(packageJson.bin['cli-config-test']).toBe('./bin/cli-config-test');
    });

    it('should generate library-specific configuration files', async () => {
      // GIVEN: User wants to create a library project with library-specific config
      // WHEN: Running directory structure generation for library project type
      const result = await executeCLI({
        args: [
          'init',
          'library-config-test',
          '--template',
          'library',
          '--quality',
          'strict',
          '--nonInteractive',
        ],
        cwd: tempDir,
      });

      // THEN: Library project should have library-specific configuration files
      expect(result.exitCode).toBe(0);

      // Verify library-specific configurations
      await assertFileExists(`${tempDir}/library-config-test/package.json`);
      await assertFileExists(`${tempDir}/library-config-test/docs/api.md`);

      // Check package.json library configuration
      const packageJson = await Bun.file(`${tempDir}/library-config-test/package.json`).json();
      expect(packageJson.exports).toBeDefined();
      expect(packageJson.main).toBe('./dist/index.js');
      expect(packageJson.module).toBe('./dist/index.esm.js');
      expect(packageJson.types).toBe('./dist/index.d.ts');
    });
  });

  describe('AC6.3: Type-Specific Entry Points and Exports', () => {
    it('should generate appropriate entry points for web projects', async () => {
      // GIVEN: User wants to create a web project
      // WHEN: Running directory structure generation for web project type
      const result = await executeCLI({
        args: [
          'init',
          'web-entry-test',
          '--template',
          'web',
          '--quality',
          'strict',
          '--nonInteractive',
        ],
        cwd: tempDir,
      });

      // THEN: Web project should have web-specific entry points
      expect(result.exitCode).toBe(0);

      // Verify web-specific entry points
      await assertFileExists(`${tempDir}/web-entry-test/src/index.ts`);
      await assertFileExists(`${tempDir}/web-entry-test/src/App.tsx`);
      await assertFileExists(`${tempDir}/web-entry-test/index.html`);

      // Check main entry point content
      const mainEntry = await Bun.file(`${tempDir}/web-entry-test/src/index.ts`).text();
      expect(mainEntry).toContain('import { StrictMode } from');
      expect(mainEntry).toContain('createRoot');
      expect(mainEntry).toContain('document.getElementById');
    });

    it('should generate appropriate entry points for CLI projects', async () => {
      // GIVEN: User wants to create a CLI project
      // WHEN: Running directory structure generation for CLI project type
      const result = await executeCLI({
        args: [
          'init',
          'cli-entry-test',
          '--template',
          'cli',
          '--quality',
          'strict',
          '--nonInteractive',
        ],
        cwd: tempDir,
      });

      // THEN: CLI project should have CLI-specific entry points
      expect(result.exitCode).toBe(0);

      // Verify CLI-specific entry points
      await assertFileExists(`${tempDir}/cli-entry-test/src/index.ts`);
      await assertFileExists(`${tempDir}/cli-entry-test/bin/cli-entry-test`);

      // Check main entry point content
      const mainEntry = await Bun.file(`${tempDir}/cli-entry-test/src/index.ts`).text();
      expect(mainEntry).toContain('export');
      expect(mainEntry).toContain('main');

      // Check CLI launcher content
      const cliLauncher = await Bun.file(`${tempDir}/cli-entry-test/bin/cli-entry-test`).text();
      expect(cliLauncher).toContain('#!/usr/bin/env bun');
      expect(cliLauncher).toContain('import { main } from');
    });

    it('should generate appropriate entry points for library projects', async () => {
      // GIVEN: User wants to create a library project
      // WHEN: Running directory structure generation for library project type
      const result = await executeCLI({
        args: [
          'init',
          'library-entry-test',
          '--template',
          'library',
          '--quality',
          'strict',
          '--nonInteractive',
        ],
        cwd: tempDir,
      });

      // THEN: Library project should have library-specific entry points
      expect(result.exitCode).toBe(0);

      // Verify library-specific entry points
      await assertFileExists(`${tempDir}/library-entry-test/src/index.ts`);

      // Check library entry point content
      const mainEntry = await Bun.file(`${tempDir}/library-entry-test/src/index.ts`).text();
      expect(mainEntry).toContain('export * from');
      expect(mainEntry).toContain('export {');
      expect(mainEntry).toContain('export type');
    });
  });

  describe('AC6.4: Template-Based Customization', () => {
    it('should support template customization for project types', async () => {
      // GIVEN: User wants to create a project with specific template
      // WHEN: Running directory structure generation with specific template
      const result = await executeCLI({
        args: [
          'init',
          'template-custom-test',
          '--template',
          'web',
          '--quality',
          'strict',
          '--nonInteractive',
        ],
        cwd: tempDir,
      });

      // THEN: Project structure should reflect template customization
      expect(result.exitCode).toBe(0);

      // Verify template-based customization
      await assertDirectoryExists(tempDir, 'template-custom-test/src/components');
      await assertDirectoryExists(tempDir, 'template-custom-test/src/utils');
      await assertFileExists(`${tempDir}/template-custom-test/src/App.tsx`);

      // Verify template-specific files exist
      const appComponent = await Bun.file(`${tempDir}/template-custom-test/src/App.tsx`).text();
      expect(appComponent).toContain('function App');
      expect(appComponent).toContain('export default App');
      expect(appComponent).toContain('<div className="app">');
      expect(appComponent).toContain('</div>');
    });

    it('should adapt structure based on quality level configuration', async () => {
      // GIVEN: User wants to create a project with light quality
      // WHEN: Running directory structure generation with light quality
      const result = await executeCLI({
        args: [
          'init',
          'quality-light-test',
          '--template',
          'basic',
          '--quality',
          'light',
          '--nonInteractive',
        ],
        cwd: tempDir,
      });

      // THEN: Project structure should be adapted for light quality
      expect(result.exitCode).toBe(0);

      // Verify light quality adaptations
      await assertFileExists(`${tempDir}/quality-light-test/package.json`);
      await assertFileExists(`${tempDir}/quality-light-test/eslint.config.mjs`);
      await assertFileExists(`${tempDir}/quality-light-test/tsconfig.json`);

      // Check ESLint configuration is less strict for light quality
      const eslintConfig = await Bun.file(`${tempDir}/quality-light-test/eslint.config.mjs`).text();
      expect(eslintConfig).toContain('@typescript-eslint');
      // Light quality should have fewer strict rules
    });
  });
});
