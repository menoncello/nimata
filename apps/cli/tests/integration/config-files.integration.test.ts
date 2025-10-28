/**
 * Integration Tests - Configuration Files Generator
 *
 * RED PHASE: These tests are written to FAIL before implementation
 * Following TDD red-green-refactor cycle
 *
 * Tests for AC3: Configuration Files Generation
 * - Generates .gitignore with comprehensive exclusions
 * - Includes node_modules, dist/, .nimata/cache/, and common development files
 * - Creates package.json with project metadata and dependencies
 * - Generates TypeScript configuration (tsconfig.json)
 * - Creates ESLint configuration based on quality level
 */
import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { TestProject } from '../e2e/support/test-project';
import { createProjectConfig } from '../support/factories/project-config.factory';

describe('Configuration Files Generator - AC3: Configuration Files Generation (RED PHASE)', () => {
  let testProject: TestProject;

  beforeEach(async () => {
    testProject = await TestProject.create('config-files-');
  });

  afterEach(async () => {
    await testProject.cleanup();
  });

  describe('AC3.1: .gitignore Generation', () => {
    it('should generate comprehensive .gitignore file', async () => {
      // GIVEN: User wants to create a TypeScript project
      // WHEN: Configuration generator creates .gitignore
      const projectConfig = createProjectConfig({
        name: 'gitignore-test',
        projectType: 'basic',
        qualityLevel: 'strict',
      });

      // This will fail because Configuration Generator is not implemented yet
      // Import the DirectoryStructureGenerator from core package
      const { DirectoryStructureGenerator } = await import('@nimata/core');
      const generator = new DirectoryStructureGenerator();
      const configFiles = generator.generate(projectConfig);

      // THEN: .gitignore should be generated with comprehensive exclusions
      const gitignoreFile = configFiles.find(
        (item) => item.path === '.gitignore' && item.type === 'file'
      );
      expect(gitignoreFile).toBeDefined();
      expect(gitignoreFile?.content).toContain('node_modules');
      expect(gitignoreFile?.content).toContain('dist/');
      expect(gitignoreFile?.content).toContain('.nimata/cache/');
      expect(gitignoreFile?.content).toContain('.DS_Store');
      expect(gitignoreFile?.content).toContain('*.log');
      expect(gitignoreFile?.content).toContain('coverage/');
      expect(gitignoreFile?.content).toContain('.env');
      expect(gitignoreFile?.content).toContain('*.tmp');
    });

    it('should include TypeScript-specific exclusions', async () => {
      // GIVEN: User wants a TypeScript project with TS-specific exclusions
      // WHEN: Configuration generator creates .gitignore
      const projectConfig = createProjectConfig({
        name: 'ts-gitignore-test',
        projectType: 'basic',
        qualityLevel: 'strict',
      });

      // This will fail because Configuration Generator is not implemented yet
      // Import the DirectoryStructureGenerator from core package
      const { DirectoryStructureGenerator } = await import('@nimata/core');
      const generator = new DirectoryStructureGenerator();
      const configFiles = generator.generate(projectConfig);

      // THEN: .gitignore should include TypeScript-specific exclusions
      const gitignoreFile = configFiles.find(
        (item) => item.path === '.gitignore' && item.type === 'file'
      );
      expect(gitignoreFile).toBeDefined();
      expect(gitignoreFile?.content).toContain('*.tsbuildinfo');
      expect(gitignoreFile?.content).toContain('*.d.ts');
    });
  });

  describe('AC3.2: package.json Generation', () => {
    it('should generate package.json with project metadata', async () => {
      // GIVEN: User wants to create a project with metadata
      // WHEN: Configuration generator creates package.json
      const projectConfig = createProjectConfig({
        name: 'package-metadata-test',
        description: 'A test project for metadata generation',
        author: 'Test Author',
        projectType: 'basic',
        qualityLevel: 'strict',
      });

      // This will fail because Configuration Generator is not implemented yet
      // Import the DirectoryStructureGenerator from core package
      const { DirectoryStructureGenerator } = await import('@nimata/core');
      const generator = new DirectoryStructureGenerator();
      const configFiles = generator.generate(projectConfig);

      // THEN: package.json should include project metadata
      const packageJsonFile = configFiles.find(
        (item) => item.path === 'package.json' && item.type === 'file'
      );
      expect(packageJsonFile).toBeDefined();

      const packageJson = JSON.parse(packageJsonFile!.content);
      expect(packageJson.name).toBe('package-metadata-test');
      expect(packageJson.description).toBe('A test project for metadata generation');
      expect(packageJson.author).toBe('Test Author');
      expect(packageJson.version).toBe('1.0.0');
      expect(packageJson.type).toBe('module');
    });

    it('should include appropriate dependencies and scripts', async () => {
      // GIVEN: User wants a project with proper dependencies
      // WHEN: Configuration generator creates package.json
      const projectConfig = createProjectConfig({
        name: 'package-deps-test',
        projectType: 'basic',
        qualityLevel: 'strict',
      });

      // This will fail because Configuration Generator is not implemented yet
      // Import the DirectoryStructureGenerator from core package
      const { DirectoryStructureGenerator } = await import('@nimata/core');
      const generator = new DirectoryStructureGenerator();
      const configFiles = generator.generate(projectConfig);

      // THEN: package.json should include dependencies and scripts
      const packageJsonFile = configFiles.find(
        (item) => item.path === 'package.json' && item.type === 'file'
      );
      expect(packageJsonFile).toBeDefined();

      const packageJson = JSON.parse(packageJsonFile!.content);
      expect(packageJson.devDependencies).toBeDefined();
      expect(packageJson.devDependencies.typescript).toBeDefined();
      expect(packageJson.devDependencies['@types/bun']).toBeDefined();
      expect(packageJson.engines.bun).toBe('>=1.3.0');
      expect(packageJson.scripts.build).toBeDefined();
      expect(packageJson.scripts.test).toBe('bun test');
      expect(packageJson.scripts.dev).toBeDefined();
    });

    it('should adapt dependencies based on project type', async () => {
      // GIVEN: User wants to create a CLI project with specific dependencies
      // WHEN: Configuration generator creates package.json
      const projectConfig = createProjectConfig({
        name: 'cli-deps-test',
        projectType: 'cli',
        qualityLevel: 'strict',
      });

      // This will fail because Configuration Generator is not implemented yet
      // Import the DirectoryStructureGenerator from core package
      const { DirectoryStructureGenerator } = await import('@nimata/core');
      const generator = new DirectoryStructureGenerator();
      const configFiles = generator.generate(projectConfig);

      // THEN: package.json should include CLI-specific dependencies
      const packageJsonFile = configFiles.find(
        (item) => item.path === 'package.json' && item.type === 'file'
      );
      expect(packageJsonFile).toBeDefined();

      const packageJson = JSON.parse(packageJsonFile!.content);
      expect(packageJson.bin).toBeDefined();
      expect(packageJson.dependencies.commander).toBeDefined();
      expect(packageJson.dependencies.chalk).toBeDefined();
    });
  });

  describe('AC3.3: TypeScript Configuration Generation', () => {
    it('should generate tsconfig.json with strict TypeScript settings', async () => {
      // GIVEN: User wants a TypeScript project with strict configuration
      // WHEN: Configuration generator creates tsconfig.json
      const projectConfig = createProjectConfig({
        name: 'tsconfig-test',
        projectType: 'basic',
        qualityLevel: 'strict',
      });

      // This will fail because Configuration Generator is not implemented yet
      // Import the DirectoryStructureGenerator from core package
      const { DirectoryStructureGenerator } = await import('@nimata/core');
      const generator = new DirectoryStructureGenerator();
      const configFiles = generator.generate(projectConfig);

      // THEN: tsconfig.json should include strict TypeScript settings
      const tsconfigFile = configFiles.find(
        (item) => item.path === 'tsconfig.json' && item.type === 'file'
      );
      expect(tsconfigFile).toBeDefined();

      const tsconfig = JSON.parse(tsconfigFile!.content);
      expect(tsconfig.compilerOptions).toBeDefined();
      expect(tsconfig.compilerOptions.target).toBe('ES2022');
      expect(tsconfig.compilerOptions.module).toBe('ESNext');
      expect(tsconfig.compilerOptions.moduleResolution).toBe('bundler');
      expect(tsconfig.compilerOptions.strict).toBe(true);
      expect(tsconfig.compilerOptions.esModuleInterop).toBe(true);
      expect(tsconfig.compilerOptions.skipLibCheck).toBe(true);
      expect(tsconfig.compilerOptions.forceConsistentCasingInFileNames).toBe(true);
    });

    it('should configure proper source and output directories', async () => {
      // GIVEN: User wants a project with proper directory structure
      // WHEN: Configuration generator creates tsconfig.json
      const projectConfig = createProjectConfig({
        name: 'tsconfig-dirs-test',
        projectType: 'basic',
        qualityLevel: 'strict',
      });

      // This will fail because Configuration Generator is not implemented yet
      // Import the DirectoryStructureGenerator from core package
      const { DirectoryStructureGenerator } = await import('@nimata/core');
      const generator = new DirectoryStructureGenerator();
      const configFiles = generator.generate(projectConfig);

      // THEN: tsconfig.json should configure proper directories
      const tsconfigFile = configFiles.find(
        (item) => item.path === 'tsconfig.json' && item.type === 'file'
      );
      expect(tsconfigFile).toBeDefined();

      const tsconfig = JSON.parse(tsconfigFile!.content);
      expect(tsconfig.compilerOptions.outDir).toBe('./dist');
      expect(tsconfig.compilerOptions.rootDir).toBe('./src');
      expect(tsconfig.include).toContain('src/**/*');
      expect(tsconfig.exclude).toContain('node_modules');
      expect(tsconfig.exclude).toContain('dist');
    });
  });

  describe('AC3.4: ESLint Configuration Generation', () => {
    it('should generate ESLint configuration based on quality level', async () => {
      // GIVEN: User wants a project with strict quality settings
      // WHEN: Configuration generator creates ESLint configuration
      const projectConfig = createProjectConfig({
        name: 'eslint-strict-test',
        projectType: 'basic',
        qualityLevel: 'strict',
      });

      // This will fail because Configuration Generator is not implemented yet
      // Import the DirectoryStructureGenerator from core package
      const { DirectoryStructureGenerator } = await import('@nimata/core');
      const generator = new DirectoryStructureGenerator();
      const configFiles = generator.generate(projectConfig);

      // THEN: ESLint configuration should be generated for strict quality
      const eslintFile = configFiles.find(
        (item) => item.path === 'eslint.config.mjs' && item.type === 'file'
      );
      expect(eslintFile).toBeDefined();
      expect(eslintFile?.content).toContain('@typescript-eslint');
      expect(eslintFile?.content).toContain('export default');
      expect(eslintFile?.content).toContain('@typescript-eslint');
      expect(eslintFile?.content).toContain('eslint:recommended');
      expect(eslintFile?.content).toContain('prefer-const');
    });

    it('should generate different ESLint rules for different quality levels', async () => {
      // GIVEN: User wants a project with light quality settings
      // WHEN: Configuration generator creates ESLint configuration
      const projectConfig = createProjectConfig({
        name: 'eslint-light-test',
        projectType: 'basic',
        qualityLevel: 'light',
      });

      // This will fail because Configuration Generator is not implemented yet
      // Import the DirectoryStructureGenerator from core package
      const { DirectoryStructureGenerator } = await import('@nimata/core');
      const generator = new DirectoryStructureGenerator();
      const configFiles = generator.generate(projectConfig);

      // THEN: ESLint configuration should be less strict for light quality
      const eslintFile = configFiles.find(
        (item) => item.path === 'eslint.config.mjs' && item.type === 'file'
      );
      expect(eslintFile).toBeDefined();
      expect(eslintFile?.content).toContain('@typescript-eslint');
      // Light quality should have fewer/less strict rules
      expect(eslintFile?.content).not.toContain('sonarjs'); // High quality only
    });
  });
});
