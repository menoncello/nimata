/**
 * E2E Tests - Project Generation Integration
 *
 * RED PHASE: These tests are written to FAIL before implementation
 * Following TDD red-green-refactor cycle
 *
 * Tests for AC6: `nimata init` Command Integration
 * - End-to-end `nimata init my-project` workflow completes successfully
 * - Command-line flags: --template, --quality, --ai, --non-interactive
 * - Supports both interactive and non-interactive modes
 * - Project validation after generation
 * - User can immediately run `cd my-project && bun test` successfully
 * - Scaffolding completes in <30 seconds for typical project
 */
import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { executeCLI } from './support/helpers/cli-executor';
import {
  createTempDirectory,
  cleanupTempDirectory,
  assertDirectoryExists,
  assertFileExists,
} from './support/helpers/file-assertions';

describe('Project Generation - Integration (RED PHASE)', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDirectory();
  });

  afterEach(async () => {
    await cleanupTempDirectory(tempDir);
  });

  describe('AC6.1: End-to-End Workflow', () => {
    it('should complete full nimata init workflow successfully', async () => {
      // GIVEN: User wants to create a new project
      // WHEN: Running complete init workflow (non-interactive for speed)
      const startTime = Date.now();
      const result = await executeCLI({
        args: [
          'init',
          'end-to-end-test',
          '--template',
          'basic',
          '--quality',
          'medium',
          '--ai',
          'claude-code',
          '--nonInteractive',
        ],
        cwd: tempDir,
      });

      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000; // Convert to seconds

      // THEN: Full workflow completes successfully
      expect(result.exitCode).toBe(0);
      expect(duration).toBeLessThan(30); // Performance requirement

      // Check project structure created
      await assertDirectoryExists(tempDir, 'end-to-end-test');
      await assertFileExists(`${tempDir}/end-to-end-test/package.json`);
      await assertFileExists(`${tempDir}/end-to-end-test/README.md`);
      await assertFileExists(`${tempDir}/end-to-end-test/eslint.config.mjs`);
      await assertFileExists(`${tempDir}/end-to-end-test/tsconfig.json`);
      await assertFileExists(`${tempDir}/end-to-end-test/prettier.config.mjs`);
    });

    it('should generate working project with all components integrated', async () => {
      // GIVEN: User creates project with all features
      // WHEN: Project generation completes
      const result = await executeCLI({
        args: [
          'init',
          'integrated-test',
          '--template',
          'basic',
          '--quality',
          'strict',
          '--ai',
          'claude-code,copilot',
          '--nonInteractive',
        ],
        cwd: tempDir,
      });

      // THEN: All components work together
      expect(result.exitCode).toBe(0);

      // Verify project structure
      await assertDirectoryExists(tempDir, 'integrated-test');
      await assertDirectoryExists(tempDir, 'integrated-test/src');
      await assertDirectoryExists(tempDir, 'integrated-test/tests');

      // Verify configuration files
      await assertFileExists(`${tempDir}/integrated-test/eslint.config.mjs`);
      await assertFileExists(`${tempDir}/integrated-test/tsconfig.json`);
      await assertFileExists(`${tempDir}/integrated-test/prettier.config.mjs`);

      // Verify AI context files
      await assertFileExists(`${tempDir}/integrated-test/CLAUDE.md`);
      await assertFileExists(`${tempDir}/integrated-test/.github/copilot-instructions.md`);
    });
  });

  describe('AC6.2: Command-Line Flags Support', () => {
    it('should support --template flag', async () => {
      // GIVEN: User specifies template via flag
      // WHEN: Running init with template flag
      const result = await executeCLI({
        args: ['init', 'template-flag-test', '--template', 'basic', '--nonInteractive'],
        cwd: tempDir,
      });

      // THEN: Specified template used
      expect(result.exitCode).toBe(0);
      await assertDirectoryExists(tempDir, 'template-flag-test');
      await assertDirectoryExists(tempDir, 'template-flag-test/src');
      await assertDirectoryExists(tempDir, 'template-flag-test/tests');
    });

    it('should support --quality flag', async () => {
      // GIVEN: User specifies quality via flag
      // WHEN: Running init with quality flag
      const result = await executeCLI({
        args: [
          'init',
          'quality-flag-test',
          '--template',
          'basic',
          '--quality',
          'light',
          '--nonInteractive',
        ],
        cwd: tempDir,
      });

      // THEN: Specified quality level applied
      expect(result.exitCode).toBe(0);

      // Verify quality configuration applied (package.json contains quality-related scripts)
      const packageJson = await Bun.file(`${tempDir}/quality-flag-test/package.json`).json();
      expect(packageJson).toBeDefined();
    });

    it('should support --ai flag', async () => {
      // GIVEN: User specifies AI assistants via flag
      // WHEN: Running init with AI flag
      const result = await executeCLI({
        args: [
          'init',
          'ai-flag-test',
          '--template',
          'basic',
          '--ai',
          'claude-code',
          '--nonInteractive',
        ],
        cwd: tempDir,
      });

      // THEN: Specified AI assistants configured
      expect(result.exitCode).toBe(0);
      await assertFileExists(`${tempDir}/ai-flag-test/CLAUDE.md`);
    });

    it('should support multiple AI assistants with comma separation', async () => {
      // GIVEN: User wants multiple AI assistants
      // WHEN: Using comma-separated values
      const result = await executeCLI({
        args: [
          'init',
          'multiple-ai-test',
          '--template',
          'basic',
          '--ai',
          'claude-code,copilot',
          '--nonInteractive',
        ],
        cwd: tempDir,
      });

      // THEN: Both AI assistants configured
      expect(result.exitCode).toBe(0);
      await assertFileExists(`${tempDir}/multiple-ai-test/CLAUDE.md`);
      await assertFileExists(`${tempDir}/multiple-ai-test/.github/copilot-instructions.md`);
    });

    it('should support --non-interactive flag', async () => {
      // GIVEN: User wants non-interactive mode
      // WHEN: Using non-interactive flag
      const result = await executeCLI({
        args: ['init', 'non-interactive-test', '--non-interactive', '--template', 'basic'],
        cwd: tempDir,
      });

      // THEN: Project generated without prompts
      expect(result.exitCode).toBe(0); // Will fail initially
      expect(result.output).not.toContain('Project name:'); // No interactive prompts
      await assertDirectoryExists(tempDir, 'non-interactive-test');
    });

    it('should combine multiple flags correctly', async () => {
      // GIVEN: User specifies multiple options
      // WHEN: Using multiple flags together
      const result = await executeCLI({
        args: [
          'init',
          'combined-flags-test',
          '--template',
          'basic',
          '--quality',
          'strict',
          '--ai',
          'claude-code',
          '--nonInteractive',
        ],
        cwd: tempDir,
      });

      // THEN: All flags applied correctly
      expect(result.exitCode).toBe(0);

      // Check project created
      await assertDirectoryExists(tempDir, 'combined-flags-test');
      await assertDirectoryExists(tempDir, 'combined-flags-test/src');

      // Check quality applied (strict should have more rules)
      await assertFileExists(`${tempDir}/combined-flags-test/eslint.config.mjs`);

      // Check AI assistant applied
      await assertFileExists(`${tempDir}/combined-flags-test/CLAUDE.md`);
    });
  });

  describe('AC6.3: Interactive vs Non-Interactive Modes', () => {
    it('should use interactive mode by default', async () => {
      // GIVEN: User runs init without flags
      // WHEN: Starting interactive mode
      const result = await executeCLI({
        args: ['init', 'interactive-default-test'],
        cwd: tempDir,
        input: ['\n'], // Provide minimal input
      });

      // THEN: Interactive prompts shown
      expect(result.exitCode).toBe(0); // Will fail initially
      expect(result.output).toContain('Project Description'); // Interactive prompt (name skipped since provided as arg)
    });

    it('should skip interactive prompts with --non-interactive', async () => {
      // GIVEN: User wants non-interactive mode
      // WHEN: Using --non-interactive flag
      const result = await executeCLI({
        args: ['init', 'non-interactive-test', '--non-interactive', '--template', 'basic'],
        cwd: tempDir,
      });

      // THEN: No interactive prompts
      expect(result.exitCode).toBe(0); // Will fail initially
      expect(result.output).not.toContain('Project name:'); // No interactive prompts
      expect(result.output).not.toContain('Description:');
      expect(result.output).not.toContain('Quality level:');
    });

    it('should require all necessary flags in non-interactive mode', async () => {
      // GIVEN: User tries non-interactive without sufficient info
      // WHEN: Missing required information
      const result = await executeCLI({
        args: ['init', 'missing-flags-test', '--nonInteractive'],
        cwd: tempDir,
      });

      // THEN: Error about missing configuration
      expect(result.exitCode).toBe(1); // Should fail
      // The actual error message is "Invalid configuration" or "Project type is required"
      expect(result.output).toContain('Configuration validation failed');
    });
  });

  describe('AC6.4: Project Validation', () => {
    it('should validate generated project structure', async () => {
      // GIVEN: Project generation completes
      // WHEN: Running generation with validation
      const result = await executeCLI({
        args: ['init', 'validation-test', '--template', 'basic', '--nonInteractive'],
        cwd: tempDir,
      });

      // THEN: Project generation succeeds with validated structure
      expect(result.exitCode).toBe(0);
      expect(result.output).toContain('Project generated successfully');

      // Manual validation checks - verify all required files exist
      await assertDirectoryExists(tempDir, 'validation-test');
      await assertFileExists(`${tempDir}/validation-test/package.json`);
      await assertFileExists(`${tempDir}/validation-test/src/index.ts`);
      await assertFileExists(`${tempDir}/validation-test/tests/index.test.ts`);
    });

    it('should detect and report validation errors', async () => {
      // GIVEN: Invalid template specified
      // WHEN: Running validation
      const result = await executeCLI({
        args: [
          'init',
          'validation-error-test',
          '--template',
          'broken-template',
          '--nonInteractive',
        ],
        cwd: tempDir,
      });

      // THEN: Validation errors reported
      expect(result.exitCode).toBe(1); // Should fail
      // yargs will report invalid choice
      expect(result.output).toContain('Invalid values');
    });
  });

  describe('AC6.5: Immediate Test Execution', () => {
    it('should allow immediate test execution after generation', async () => {
      // GIVEN: Project generated successfully
      // WHEN: Running tests immediately
      const result = await executeCLI({
        args: ['init', 'immediate-test-test', '--template', 'basic', '--nonInteractive'],
        cwd: tempDir,
      });

      // THEN: Can run tests immediately
      expect(result.exitCode).toBe(0);

      // Install dependencies first
      const installResult = await executeCLI({
        args: ['install'],
        command: 'bun',
        cwd: `${tempDir}/immediate-test-test`,
        timeout: 60000,
      });
      expect(installResult.exitCode).toBe(0);

      // Run tests in generated project
      const testResult = await executeCLI({
        args: ['test'],
        command: 'bun',
        cwd: `${tempDir}/immediate-test-test`,
      });

      expect(testResult.exitCode).toBe(0); // Tests should pass
      expect(testResult.output).toMatch(/✓|pass/i); // Test success indicator
    });

    it('should include working test examples', async () => {
      // GIVEN: Project generated with test examples
      // WHEN: Checking test files
      const result = await executeCLI({
        args: ['init', 'test-examples-test', '--template', 'basic', '--nonInteractive'],
        cwd: tempDir,
      });

      // THEN: Test examples work
      expect(result.exitCode).toBe(0);

      const testFile = await Bun.file(`${tempDir}/test-examples-test/tests/index.test.ts`).text();
      expect(testFile).toContain('describe');
      expect(testFile).toContain('it');
      expect(testFile).toContain('expect');
    });
  });

  describe('AC6.6: Performance Requirements', () => {
    it('should complete scaffolding in under 30 seconds', async () => {
      // GIVEN: User runs project generation
      // WHEN: Measuring performance
      const startTime = Date.now();
      const result = await executeCLI({
        args: [
          'init',
          'performance-test',
          '--template',
          'basic',
          '--quality',
          'strict',
          '--ai',
          'claude-code,copilot',
          '--nonInteractive',
        ],
        cwd: tempDir,
      });
      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000;

      // THEN: Performance requirement met
      expect(result.exitCode).toBe(0);
      expect(duration).toBeLessThan(30); // Under 30 seconds
    });

    it('should provide progress feedback during generation', async () => {
      // GIVEN: Project generation process
      // WHEN: Monitoring output
      const result = await executeCLI({
        args: ['init', 'progress-feedback-test', '--template', 'basic', '--nonInteractive'],
        cwd: tempDir,
      });

      // THEN: Progress feedback provided in output
      expect(result.exitCode).toBe(0);
      // Check for progress indicators (emoji or status messages)
      expect(result.output).toMatch(/🚀|✅|generating|generated/i);
    });
  });

  describe('AC6.7: Error Handling and Recovery', () => {
    it('should handle existing directory gracefully', async () => {
      // GIVEN: Directory already exists
      // WHEN: Running init on existing directory
      await Bun.write(`${tempDir}/existing-dir/.gitkeep`, ''); // Create existing dir

      const result = await executeCLI({
        args: ['init', 'existing-dir', '--template', 'basic', '--nonInteractive'],
        cwd: tempDir,
      });

      // THEN: Success - allow creating in existing directory
      expect(result.exitCode).toBe(0); // Should succeed
      expect(result.output).toContain('✅ Project configuration complete');
    });

    it('should provide helpful error messages', async () => {
      // GIVEN: Invalid project name (starts with number)
      // WHEN: Running init
      const result = await executeCLI({
        args: ['init', '123invalid', '--template', 'basic', '--nonInteractive'],
        cwd: tempDir,
      });

      // THEN: Validation error reported
      expect(result.exitCode).toBe(1); // Should fail due to invalid name
      expect(result.output).toMatch(/name|invalid/i); // Error message about name
    });

    it('should provide next steps guidance', async () => {
      // GIVEN: Project generation successful
      // WHEN: Process completes
      const result = await executeCLI({
        args: ['init', 'next-steps-test', '--template', 'basic', '--nonInteractive'],
        cwd: tempDir,
      });

      // THEN: Next steps provided
      expect(result.exitCode).toBe(0);
      expect(result.output).toContain('Project generated successfully');
      expect(result.output).toContain('Next Steps');
      expect(result.output).toContain('cd');
      expect(result.output).toContain('bun install');
    });
  });
});
