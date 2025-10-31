/**
 * Integration Tests - Documentation Files Generator
 *
 * RED PHASE: These tests are written to FAIL before implementation
 * Following TDD red-green-refactor cycle
 *
 * Tests for AC4: Documentation Files Generation
 * - Creates README.md with project-specific information
 * - Includes project name, description, and basic usage examples
 * - Generates API documentation placeholder for library projects
 * - Creates CLAUDE.md with AI context for project
 * - Includes development setup and contribution guidelines
 */
import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { TestProject } from '../e2e/support/test-project';
import { createProjectConfig } from '../support/factories/project-config.factory';

describe('Documentation Files Generator - AC4: Documentation Files Generation (RED PHASE)', () => {
  let testProject: TestProject;

  beforeEach(async () => {
    testProject = await TestProject.create('documentation-');
  });

  afterEach(async () => {
    await testProject.cleanup();
  });

  describe('AC4.1: README.md Generation', () => {
    it('should generate README.md with project-specific information', async () => {
      // GIVEN: User wants to create a project with documentation
      // WHEN: Documentation generator creates README.md
      const projectConfig = createProjectConfig({
        name: 'readme-test',
        description: 'A test project for README generation',
        author: 'Test Author',
        projectType: 'basic',
        qualityLevel: 'strict',
      });

      // Import DocumentationGenerator from core package
      const { DocumentationGenerator } = await import('@nimata/core');
      const generator = new DocumentationGenerator();
      const documentationFiles = generator.generate(projectConfig);

      // THEN: README.md should be generated with project-specific information
      const readmeFile = documentationFiles.find(
        (item) => item.path === 'README.md' && item.type === 'file'
      );
      expect(readmeFile).toBeDefined();
      expect(readmeFile?.content).toContain('# readme-test');
      expect(readmeFile?.content).toContain('A test project for README generation');
      expect(readmeFile?.content).toContain('## Features');
      expect(readmeFile?.content).toContain('## Installation');
      expect(readmeFile?.content).toContain('## Usage');
      expect(readmeFile?.content).toContain('## Development');
      expect(readmeFile?.content).toContain('bun install');
      expect(readmeFile?.content).toContain('bun test');
    });

    it('should include basic usage examples in README.md', async () => {
      // GIVEN: User wants a project with usage examples
      // WHEN: Documentation generator creates README.md
      const projectConfig = createProjectConfig({
        name: 'usage-examples-test',
        projectType: 'basic',
        qualityLevel: 'strict',
      });

      // Import DocumentationGenerator from core package
      const { DocumentationGenerator } = await import('@nimata/core');
      const generator = new DocumentationGenerator();
      const documentationFiles = generator.generate(projectConfig);

      // THEN: README.md should include usage examples
      const readmeFile = documentationFiles.find(
        (item) => item.path === 'README.md' && item.type === 'file'
      );
      expect(readmeFile).toBeDefined();
      expect(readmeFile?.content).toContain('## Usage');
      expect(readmeFile?.content).toContain('```typescript');
      expect(readmeFile?.content).toContain('import');
      expect(readmeFile?.content).toContain('```');
      expect(readmeFile?.content).toContain('bun run build');
      expect(readmeFile?.content).toContain('bun test');
    });

    it('should adapt README content based on project type', async () => {
      // GIVEN: User wants to create a CLI project
      // WHEN: Documentation generator creates README.md
      const projectConfig = createProjectConfig({
        name: 'cli-readme-test',
        projectType: 'cli',
        qualityLevel: 'strict',
      });

      // Import DocumentationGenerator from core package
      const { DocumentationGenerator } = await import('@nimata/core');
      const generator = new DocumentationGenerator();
      const documentationFiles = generator.generate(projectConfig);

      // THEN: README.md should include CLI-specific content
      const readmeFile = documentationFiles.find(
        (item) => item.path === 'README.md' && item.type === 'file'
      );
      expect(readmeFile).toBeDefined();
      expect(readmeFile?.content).toContain('## Installation');
      expect(readmeFile?.content).toContain('## Usage');
      expect(readmeFile?.content).toContain('bun add cli-readme-test');
      expect(readmeFile?.content).toContain('cli-readme-test');
      expect(readmeFile?.content).toContain('CliReadmeTestCore');
    });
  });

  describe('AC4.2: API Documentation Generation', () => {
    it('should generate API documentation for library projects', async () => {
      // GIVEN: User wants to create a library project
      // WHEN: Documentation generator creates API documentation
      const projectConfig = createProjectConfig({
        name: 'api-docs-test',
        projectType: 'library',
        qualityLevel: 'strict',
      });

      // Import DocumentationGenerator from core package
      const { DocumentationGenerator } = await import('@nimata/core');
      const generator = new DocumentationGenerator();
      const documentationFiles = generator.generate(projectConfig);

      // THEN: API documentation should be generated for library
      const apiDocFile = documentationFiles.find(
        (item) => item.path === 'docs/api.md' && item.type === 'file'
      );
      expect(apiDocFile).toBeDefined();
      expect(apiDocFile?.content).toContain('# API Documentation');
      expect(apiDocFile?.content).toContain('## Functions');
      expect(apiDocFile?.content).toContain('## API Reference');
      expect(apiDocFile?.content).toContain('### Functions');
      expect(apiDocFile?.content).toContain('```typescript');
    });

    it('should not generate API documentation for non-library projects', async () => {
      // GIVEN: User wants to create a basic project
      // WHEN: Documentation generator processes basic project
      const projectConfig = createProjectConfig({
        name: 'basic-no-api-docs-test',
        projectType: 'basic',
        qualityLevel: 'strict',
      });

      // Import DocumentationGenerator from core package
      const { DocumentationGenerator } = await import('@nimata/core');
      const generator = new DocumentationGenerator();
      const documentationFiles = generator.generate(projectConfig);

      // THEN: API documentation should not be generated for basic project
      const apiDocFile = documentationFiles.find(
        (item) => item.path === 'docs/api.md' && item.type === 'file'
      );
      expect(apiDocFile).toBeUndefined();
    });
  });

  describe('AC4.3: CLAUDE.md Generation', () => {
    it('should generate CLAUDE.md with AI context', async () => {
      // GIVEN: User wants to create a project with AI context
      // WHEN: Documentation generator creates CLAUDE.md
      const projectConfig = createProjectConfig({
        name: 'claude-context-test',
        description: 'A test project for Claude context',
        projectType: 'basic',
        qualityLevel: 'strict',
        aiAssistants: ['claude-code'],
      });

      // Import DocumentationGenerator from core package
      const { DocumentationGenerator } = await import('@nimata/core');
      const generator = new DocumentationGenerator();
      const documentationFiles = generator.generate(projectConfig);

      // THEN: CLAUDE.md should be generated with AI context
      const claudeFile = documentationFiles.find(
        (item) => item.path === 'CLAUDE.md' && item.type === 'file'
      );
      expect(claudeFile).toBeDefined();
      expect(claudeFile?.content).toContain('Claude Code Configuration for claude-context-test');
      expect(claudeFile?.content).toContain('Project Information');
      expect(claudeFile?.content).toContain('## Development Guidelines');
      expect(claudeFile?.content).toContain('TypeScript with strict mode');
      expect(claudeFile?.content).toContain('TypeScript');
      expect(claudeFile?.content).toContain('## AI Assistant Instructions');
      expect(claudeFile?.content).toContain('comprehensive tests');
    });

    it('should include quality standards in CLAUDE.md', async () => {
      // GIVEN: User wants a project with strict quality standards
      // WHEN: Documentation generator creates CLAUDE.md
      const projectConfig = createProjectConfig({
        name: 'claude-quality-test',
        projectType: 'basic',
        qualityLevel: 'strict',
        aiAssistants: ['claude-code'],
      });

      // Import DocumentationGenerator from core package
      const { DocumentationGenerator } = await import('@nimata/core');
      const generator = new DocumentationGenerator();
      const documentationFiles = generator.generate(projectConfig);

      // THEN: CLAUDE.md should include quality standards
      const claudeFile = documentationFiles.find(
        (item) => item.path === 'CLAUDE.md' && item.type === 'file'
      );
      expect(claudeFile).toBeDefined();
      expect(claudeFile?.content).toContain('- **Quality Level**: strict');
      expect(claudeFile?.content).toContain('code quality');
      expect(claudeFile?.content).toContain('strict mode enabled');
      expect(claudeFile?.content).toContain('test coverage');
      expect(claudeFile?.content).toContain('Write comprehensive tests');
    });
  });

  describe('AC4.4: Development Setup and Contribution Guidelines', () => {
    it('should include development setup instructions', async () => {
      // GIVEN: User wants a project with setup instructions
      // WHEN: Documentation generator creates documentation
      const projectConfig = createProjectConfig({
        name: 'dev-setup-test',
        projectType: 'basic',
        qualityLevel: 'strict',
      });

      // Import DocumentationGenerator from core package
      const { DocumentationGenerator } = await import('@nimata/core');
      const generator = new DocumentationGenerator();
      const documentationFiles = generator.generate(projectConfig);

      // THEN: README should include development setup instructions
      const readmeFile = documentationFiles.find(
        (item) => item.path === 'README.md' && item.type === 'file'
      );
      expect(readmeFile).toBeDefined();
      expect(readmeFile?.content).toContain('## Development');
      expect(readmeFile?.content).toContain('bun install');
      expect(readmeFile?.content).toContain('Development');
      expect(readmeFile?.content).toContain('bun install');
      expect(readmeFile?.content).toContain('bun test');
      expect(readmeFile?.content).toContain('bun test');
      expect(readmeFile?.content).toContain('bun run build');
    });

    it('should include contribution guidelines', async () => {
      // GIVEN: User wants a project with contribution guidelines
      // WHEN: Documentation generator creates documentation
      const projectConfig = createProjectConfig({
        name: 'contribution-test',
        projectType: 'basic',
        qualityLevel: 'strict',
      });

      // Import DocumentationGenerator from core package
      const { DocumentationGenerator } = await import('@nimata/core');
      const generator = new DocumentationGenerator();
      const documentationFiles = generator.generate(projectConfig);

      // THEN: README should include contribution guidelines
      const readmeFile = documentationFiles.find(
        (item) => item.path === 'README.md' && item.type === 'file'
      );
      expect(readmeFile).toBeDefined();
      expect(readmeFile?.content).toContain('## License');
      expect(readmeFile?.content).toContain('Made with ❤️');
      expect(readmeFile?.content).toContain('MIT');
    });
  });
});
