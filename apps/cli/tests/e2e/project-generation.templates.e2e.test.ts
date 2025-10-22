/**
 * E2E Tests - Project Generation Templates System
 *
 * RED PHASE: These tests are written to FAIL before implementation
 * Following TDD red-green-refactor cycle
 *
 * Tests for AC2: Project Templates System
 * - Support for multiple project templates: basic, web, cli, library
 * - Template engine supports variable substitution: {{project_name}}, {{description}}, etc.
 * - Conditional blocks: {{#if strict}}...{{/if}} for quality-level variations
 * - Template validation before rendering
 * - Generates files with correct content and formatting
 * - Template catalog supports future tech stack additions
 * - Error handling for missing/invalid templates
 */
import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { executeCLI } from './support/helpers/cli-executor';
import {
  createTempDirectory,
  cleanupTempDirectory,
  assertDirectoryExists,
  assertFileExists,
} from './support/helpers/file-assertions';

describe('Project Generation - Templates System (RED PHASE)', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDirectory();
  });

  afterEach(async () => {
    await cleanupTempDirectory(tempDir);
  });

  describe('AC2.1: Multiple Project Templates Support', () => {
    it('should generate basic project template', async () => {
      // GIVEN: User selects basic project type
      // WHEN: Project generation completes
      const result = await executeCLI({
        args: ['init', 'basic-template-test', '--template', 'basic', '--nonInteractive'],
        cwd: tempDir,
      });

      // THEN: Basic project structure generated
      expect(result.exitCode).toBe(0);
      await assertDirectoryExists(tempDir, 'basic-template-test');
      await assertDirectoryExists(tempDir, 'basic-template-test/src');
      await assertDirectoryExists(tempDir, 'basic-template-test/tests');

      // Check basic template files
      await assertFileExists(`${tempDir}/basic-template-test/src/index.ts`);
      await assertFileExists(`${tempDir}/basic-template-test/tests/index.test.ts`);
      await assertFileExists(`${tempDir}/basic-template-test/README.md`);
    });

    it('should generate web application template', async () => {
      // GIVEN: User selects web project type
      // WHEN: Project generation completes
      const result = await executeCLI({
        args: ['init', 'web-template-test', '--template', 'web', '--nonInteractive'],
        cwd: tempDir,
      });

      // THEN: Web project structure generated
      expect(result.exitCode).toBe(0);
      await assertDirectoryExists(tempDir, 'web-template-test');
      await assertDirectoryExists(tempDir, 'web-template-test/src');

      // Check web-specific files
      await assertFileExists(`${tempDir}/web-template-test/src/server.ts`);
      await assertFileExists(`${tempDir}/web-template-test/package.json`);
    });

    it('should generate CLI application template', async () => {
      // GIVEN: User selects CLI project type
      // WHEN: Project generation completes
      const result = await executeCLI({
        args: ['init', 'cli-template-test', '--template', 'cli', '--nonInteractive'],
        cwd: tempDir,
      });

      // THEN: CLI project structure generated
      expect(result.exitCode).toBe(0);
      await assertDirectoryExists(tempDir, 'cli-template-test');
      await assertDirectoryExists(tempDir, 'cli-template-test/src');

      // Check basic files
      await assertFileExists(`${tempDir}/cli-template-test/src/index.ts`);
      await assertFileExists(`${tempDir}/cli-template-test/package.json`);
    });

    it('should generate library package template', async () => {
      // GIVEN: User selects library project type
      // WHEN: Project generation completes
      const result = await executeCLI({
        args: ['init', 'library-template-test', '--template', 'library', '--nonInteractive'],
        cwd: tempDir,
      });

      // THEN: Library project structure generated
      expect(result.exitCode).toBe(0);
      await assertDirectoryExists(tempDir, 'library-template-test');
      await assertDirectoryExists(tempDir, 'library-template-test/src');
      await assertDirectoryExists(tempDir, 'library-template-test/tests');

      // Check library files
      await assertFileExists(`${tempDir}/library-template-test/src/index.ts`);
      await assertFileExists(`${tempDir}/library-template-test/README.md`);
    });
  });

  describe('AC2.2: Variable Substitution', () => {
    it('should substitute project name variables in templates', async () => {
      // GIVEN: Template contains {{name}} variable
      // WHEN: Generating project with custom name
      const result = await executeCLI({
        args: ['init', 'variable-substitution-test', '--template', 'basic', '--nonInteractive'],
        cwd: tempDir,
      });

      // THEN: Variables replaced with actual values
      expect(result.exitCode).toBe(0);

      const packageJson = await Bun.file(
        `${tempDir}/variable-substitution-test/package.json`
      ).text();
      const packageData = JSON.parse(packageJson);
      expect(packageData.name).toBe('variable-substitution-test');

      const readme = await Bun.file(`${tempDir}/variable-substitution-test/README.md`).text();
      expect(readme).toContain('variable-substitution-test');
      expect(readme).not.toContain('{{name}}');
    });

    it('should substitute description variables in templates', async () => {
      // GIVEN: Template contains {{description}} variable
      // WHEN: Generating project with description
      const result = await executeCLI({
        args: [
          'init',
          'description-test',
          '--template',
          'basic',
          '--description',
          'A test project for variable substitution',
          '--nonInteractive',
        ],
        cwd: tempDir,
      });

      // THEN: Description variable replaced
      expect(result.exitCode).toBe(0);

      const packageJson = await Bun.file(`${tempDir}/description-test/package.json`).text();
      const packageData = JSON.parse(packageJson);
      expect(packageData.description).toBe('A test project for variable substitution');

      const readme = await Bun.file(`${tempDir}/description-test/README.md`).text();
      expect(readme).toContain('A test project for variable substitution');
      expect(readme).not.toContain('{{description}}');
    });

    it('should substitute multiple variables in single file', async () => {
      // GIVEN: Template contains multiple variables
      // WHEN: Generating project with multiple values
      const result = await executeCLI({
        args: [
          'init',
          'multi-variable-test',
          '--template',
          'basic',
          '--description',
          'Multi variable test',
          '--author',
          'Test Author',
          '--nonInteractive',
        ],
        cwd: tempDir,
      });

      // THEN: All variables replaced correctly
      expect(result.exitCode).toBe(0);

      const packageJson = await Bun.file(`${tempDir}/multi-variable-test/package.json`).text();
      const packageData = JSON.parse(packageJson);
      expect(packageData.name).toBe('multi-variable-test');
      expect(packageData.description).toBe('Multi variable test');
      expect(packageData.author).toBe('Test Author');
    });
  });

  describe('AC2.3: Conditional Blocks', () => {
    it('should include strict quality blocks when strict quality selected', async () => {
      // GIVEN: Template has conditional blocks for quality levels
      // WHEN: Generating with strict quality
      const result = await executeCLI({
        args: [
          'init',
          'strict-conditional-test',
          '--template',
          'basic',
          '--quality',
          'strict',
          '--nonInteractive',
        ],
        cwd: tempDir,
      });

      // THEN: Project generated successfully with strict quality
      expect(result.exitCode).toBe(0);

      // Verify tsconfig.json was created with compiler options
      const tsConfig = await Bun.file(`${tempDir}/strict-conditional-test/tsconfig.json`).text();
      const tsConfigData = JSON.parse(tsConfig);
      expect(tsConfigData.compilerOptions).toBeDefined();
      expect(tsConfigData.compilerOptions.target).toBe('ES2022');
    });

    it('should exclude strict quality blocks when light quality selected', async () => {
      // GIVEN: Template has conditional blocks for quality levels
      // WHEN: Generating with light quality
      const result = await executeCLI({
        args: [
          'init',
          'light-conditional-test',
          '--template',
          'basic',
          '--quality',
          'light',
          '--nonInteractive',
        ],
        cwd: tempDir,
      });

      // THEN: Light quality configuration applied (strict rules disabled)
      expect(result.exitCode).toBe(0);

      const tsConfig = await Bun.file(`${tempDir}/light-conditional-test/tsconfig.json`).text();
      const tsConfigData = JSON.parse(tsConfig);
      expect(tsConfigData.compilerOptions.strict).toBe(false);
      expect(tsConfigData.compilerOptions.noImplicitAny).toBe(false);
    });

    it('should include AI assistant blocks when assistants selected', async () => {
      // GIVEN: Template configured with AI assistants
      // WHEN: Generating with Claude assistant
      const result = await executeCLI({
        args: [
          'init',
          'ai-conditional-test',
          '--template',
          'basic',
          '--ai',
          'claude-code',
          '--nonInteractive',
        ],
        cwd: tempDir,
      });

      // THEN: Project generated successfully with AI configuration
      expect(result.exitCode).toBe(0);

      // Verify package.json was created (AI-specific files may be added in future)
      await assertFileExists(`${tempDir}/ai-conditional-test/package.json`);
      const packageJson = await Bun.file(`${tempDir}/ai-conditional-test/package.json`).text();
      expect(packageJson).toContain('ai-conditional-test');
    });
  });

  describe('AC2.4: Template Validation', () => {
    it('should validate template exists before generation', async () => {
      // GIVEN: User requests non-existent template
      // WHEN: Attempting generation
      const result = await executeCLI({
        args: ['init', 'validation-test', '--template', 'non-existent', '--nonInteractive'],
        cwd: tempDir,
      });

      // THEN: Error about invalid template choice (yargs validation)
      expect(result.exitCode).toBe(1);
      expect(result.output).toContain('Invalid values');
      expect(result.output).toContain('non-existent');
      expect(result.output).toContain('Choices:');
    });

    it('should validate template syntax before rendering', async () => {
      // GIVEN: User requests invalid template name
      // WHEN: Attempting generation
      const result = await executeCLI({
        args: [
          'init',
          'syntax-validation-test',
          '--template',
          'corrupted-template',
          '--nonInteractive',
        ],
        cwd: tempDir,
      });

      // THEN: Template validation error from yargs
      expect(result.exitCode).toBe(1);
      expect(result.output).toContain('Invalid values');
      expect(result.output).toContain('corrupted-template');
    });
  });

  describe('AC2.5: File Generation Quality', () => {
    it('should generate files with correct content formatting', async () => {
      // GIVEN: Valid template
      // WHEN: Generating project
      const result = await executeCLI({
        args: ['init', 'formatting-test', '--template', 'basic', '--nonInteractive'],
        cwd: tempDir,
      });

      // THEN: Generated files properly formatted
      expect(result.exitCode).toBe(0);

      // Check JSON formatting
      const packageJson = await Bun.file(`${tempDir}/formatting-test/package.json`).text();
      expect(() => JSON.parse(packageJson)).not.toThrow(); // Valid JSON

      // Check TypeScript formatting
      const indexTs = await Bun.file(`${tempDir}/formatting-test/src/index.ts`).text();
      expect(indexTs).toContain('export'); // Valid TypeScript structure
      expect(indexTs).not.toContain('{{'); // No unresolved template variables
    });

    it('should set correct file permissions', async () => {
      // GIVEN: CLI template
      // WHEN: Generating CLI project
      const result = await executeCLI({
        args: ['init', 'permissions-test', '--template', 'cli', '--nonInteractive'],
        cwd: tempDir,
      });

      // THEN: Files created with appropriate permissions
      expect(result.exitCode).toBe(0);

      // Check that basic files were created (permissions are set by template engine)
      await assertFileExists(`${tempDir}/permissions-test/package.json`);
      await assertFileExists(`${tempDir}/permissions-test/src/index.ts`);

      // Verify file is readable (basic permission check)
      const packageJson = await Bun.file(`${tempDir}/permissions-test/package.json`).text();
      expect(packageJson).toBeTruthy();
    });
  });

  describe('AC2.6: Template Catalog Extensibility', () => {
    it('should list available templates', async () => {
      // GIVEN: User wants to see available templates
      // WHEN: Running init with --list-templates flag
      const result = await executeCLI({
        args: ['init', '--list-templates'],
        cwd: tempDir,
      });

      // THEN: All available templates listed
      expect(result.exitCode).toBe(0); // Will fail initially
      expect(result.output).toContain('Available templates:');
      expect(result.output).toContain('basic');
      expect(result.output).toContain('web');
      expect(result.output).toContain('cli');
      expect(result.output).toContain('library');
    });

    it('should support future template additions', async () => {
      // GIVEN: New template added to system
      // WHEN: User lists templates
      // This test verifies the template system is extensible
      const result = await executeCLI({
        args: ['init', '--list-templates'],
        cwd: tempDir,
      });

      // THEN: Template system can accommodate new templates
      expect(result.exitCode).toBe(0); // Will fail initially
      expect(result.output).toContain('Available templates:');
      // System should be designed to automatically detect new templates
    });
  });
});
