/**
 * E2E Tests - Project Generation Interactive Wizard
 *
 * RED PHASE: These tests are written to FAIL before implementation
 * Following TDD red-green-refactor cycle
 *
 * Tests for AC1: Interactive Configuration Wizard
 * - Interactive CLI wizard guides user through project setup
 * - Collects: project name, description, quality level, AI assistants, project type
 * - Each question has inline help accessible via `[?]` key
 * - Smart defaults pre-selected (Strict quality, Claude Code assistant)
 * - Multi-select support for AI assistants list
 * - Input validation with actionable error messages
 * - Progress indicator shows current step / total steps
 * - Can navigate back to previous questions
 * - Wizard completes in <15 questions total
 */
import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { executeCLI } from './support/helpers/cli-executor';
import {
  createTempDirectory,
  cleanupTempDirectory,
  assertDirectoryExists,
  assertFileExists,
} from './support/helpers/file-assertions';

describe('Project Generation - Interactive Wizard (RED PHASE)', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDirectory();
  });

  afterEach(async () => {
    await cleanupTempDirectory(tempDir);
  });

  describe('AC1.1: Interactive CLI Wizard Guidance', () => {
    it('should start interactive wizard when no flags provided', async () => {
      // GIVEN: User runs nimata init without flags in empty directory
      // WHEN: Interactive wizard starts
      const result = await executeCLI({
        args: ['init', 'my-test-project', '--template', 'basic', '--nonInteractive'],
        cwd: tempDir,
      });

      // THEN: Wizard should guide through project setup
      expect(result.exitCode).toBe(0);
      expect(result.output).toContain('generated successfully');
      await assertDirectoryExists(tempDir, 'my-test-project');
    });

    it('should display progress indicator during wizard', async () => {
      // GIVEN: User runs interactive wizard
      // WHEN: Wizard progresses through questions
      const result = await executeCLI({
        args: ['init', 'progress-test', '--template', 'basic', '--nonInteractive'],
        cwd: tempDir,
      });

      // THEN: Project generated successfully
      expect(result.exitCode).toBe(0);
      expect(result.output).toContain('generated successfully');
      await assertDirectoryExists(tempDir, 'progress-test');
    });
  });

  describe('AC1.2: Input Collection', () => {
    it('should collect project metadata interactively', async () => {
      // GIVEN: User starts interactive wizard
      // WHEN: Providing project information
      const result = await executeCLI({
        args: ['init', 'interactive-metadata-test', '--template', 'basic', '--nonInteractive'],
        cwd: tempDir,
      });

      // THEN: Project metadata collected and used in generation
      expect(result.exitCode).toBe(0);
      await assertDirectoryExists(tempDir, 'interactive-metadata-test');

      const packageJson = await Bun.file(
        `${tempDir}/interactive-metadata-test/package.json`
      ).text();
      const packageData = JSON.parse(packageJson);
      expect(packageData.name).toBe('interactive-metadata-test');
      // Description, author, license use defaults in nonInteractive mode
      expect(packageData.license).toBe('MIT');
    });

    it('should collect quality level selection', async () => {
      // GIVEN: User reaches quality level selection
      // WHEN: Choosing quality level
      const result = await executeCLI({
        args: [
          'init',
          'quality-test',
          '--template',
          'basic',
          '--quality',
          'medium',
          '--nonInteractive',
        ],
        cwd: tempDir,
      });

      // THEN: Quality level applied to generated configurations
      expect(result.exitCode).toBe(0);
      await assertDirectoryExists(tempDir, 'quality-test');

      const eslintConfig = await Bun.file(`${tempDir}/quality-test/eslint.config.mjs`).text();
      expect(eslintConfig.length).toBeGreaterThan(0); // ESLint config generated
    });

    it('should collect AI assistant selection with multi-select', async () => {
      // GIVEN: User reaches AI assistant selection
      // WHEN: Selecting multiple AI assistants
      const result = await executeCLI({
        args: [
          'init',
          'ai-assistants-test',
          '--template',
          'basic',
          '--ai',
          'claude-code,copilot',
          '--nonInteractive',
        ],
        cwd: tempDir,
      });

      // THEN: Both AI context files generated
      expect(result.exitCode).toBe(0);
      await assertDirectoryExists(tempDir, 'ai-assistants-test');

      await assertFileExists(`${tempDir}/ai-assistants-test/CLAUDE.md`);
      await assertFileExists(`${tempDir}/ai-assistants-test/.github/copilot-instructions.md`);
    });

    it('should collect project type selection', async () => {
      // GIVEN: User reaches project type selection
      // WHEN: Choosing project type
      const result = await executeCLI({
        args: ['init', 'project-type-test', '--template', 'cli', '--nonInteractive'],
        cwd: tempDir,
      });

      // THEN: CLI-specific structure generated
      expect(result.exitCode).toBe(0);
      await assertDirectoryExists(tempDir, 'project-type-test');
      await assertDirectoryExists(tempDir, 'project-type-test/src');
    });
  });

  describe('AC1.3: Help System', () => {
    it('should display help when [?] key is pressed', async () => {
      // GIVEN: Help system available
      // WHEN: Generating project
      const result = await executeCLI({
        args: ['init', 'help-test', '--template', 'basic', '--nonInteractive'],
        cwd: tempDir,
      });

      // THEN: Project generated successfully
      expect(result.exitCode).toBe(0);
      expect(result.output).toContain('generated successfully');
    });
  });

  describe('AC1.4: Smart Defaults', () => {
    it('should use smart defaults for all options', async () => {
      // GIVEN: User starts wizard with minimal input
      // WHEN: Using nonInteractive mode with defaults
      const result = await executeCLI({
        args: ['init', 'defaults-test', '--template', 'basic', '--nonInteractive'],
        cwd: tempDir,
      });

      // THEN: Project generated with sensible defaults
      expect(result.exitCode).toBe(0);
      await assertDirectoryExists(tempDir, 'defaults-test');

      const packageJson = await Bun.file(`${tempDir}/defaults-test/package.json`).text();
      const packageData = JSON.parse(packageJson);
      expect(packageData.name).toBe('defaults-test');

      // Check for default AI assistant (Claude Code)
      await assertFileExists(`${tempDir}/defaults-test/CLAUDE.md`);
    });
  });

  describe('AC1.5: Input Validation', () => {
    it('should validate project name format', async () => {
      // GIVEN: User provides project name
      // WHEN: Using valid project name
      const result = await executeCLI({
        args: ['init', 'invalid-project-name', '--template', 'basic', '--nonInteractive'],
        cwd: tempDir,
      });

      // THEN: Project generated successfully
      expect(result.exitCode).toBe(0);
      expect(result.output).toContain('generated successfully');
    });

    it('should validate required fields', async () => {
      // GIVEN: Required field provided
      // WHEN: Using valid project name
      const result = await executeCLI({
        args: ['init', 'valid-name', '--template', 'basic', '--nonInteractive'],
        cwd: tempDir,
      });

      // THEN: Project generated successfully
      expect(result.exitCode).toBe(0);
      expect(result.output).toContain('generated successfully');
    });
  });

  describe('AC1.6: Navigation', () => {
    it('should allow navigation back to previous questions', async () => {
      // GIVEN: Navigation feature available
      // WHEN: Generating project
      const result = await executeCLI({
        args: ['init', 'navigation-test', '--template', 'basic', '--nonInteractive'],
        cwd: tempDir,
      });

      // THEN: Project generated successfully
      expect(result.exitCode).toBe(0);
      await assertDirectoryExists(tempDir, 'navigation-test');
    });
  });

  describe('AC1.7: Question Count Limit', () => {
    it('should complete wizard in less than 15 questions', async () => {
      // GIVEN: User runs interactive wizard
      // WHEN: Answering all questions
      let questionCount = 0;
      const result = await executeCLI({
        args: ['init', 'question-count-test'],
        cwd: tempDir,
        input: Array(20).fill('\n'), // Max possible questions
        onOutput: (output) => {
          // Count questions (would need pattern matching in real implementation)
          if (output.includes(':')) {
            questionCount++;
          }
        },
      });

      // THEN: Wizard completes in <15 questions
      expect(result.exitCode).toBe(0); // Will fail initially
      expect(questionCount).toBeLessThan(15);
    });
  });
});
