/**
 * E2E Tests - Project Generation AI Context Files
 *
 * RED PHASE: These tests are written to FAIL before implementation
 * Following TDD red-green-refactor cycle
 *
 * Tests for AC5: AI Context Files Generation
 * - Generates CLAUDE.md with persistent AI context
 * - Creates GitHub Copilot instructions file
 * - AI rules adapt based on selected quality level
 * - Files are optimized for AI parsing (concise, structured)
 * - Include coding standards, architecture decisions, project-specific patterns
 * - Examples of good/bad code patterns included
 */
import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { executeCLI } from './support/helpers/cli-executor';
import {
  createTempDirectory,
  cleanupTempDirectory,
  assertFileExists,
} from './support/helpers/file-assertions';

describe('Project Generation - AI Context Files (RED PHASE)', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDirectory();
  });

  afterEach(async () => {
    await cleanupTempDirectory(tempDir);
  });

  describe('AC5.1: CLAUDE.md Generation', () => {
    it('should generate CLAUDE.md file', async () => {
      // GIVEN: User selects Claude Code assistant
      // WHEN: Project generation completes
      const result = await executeCLI({
        args: [
          'init',
          'claude-test',
          '--template',
          'basic',
          '--ai',
          'claude-code',
          '--nonInteractive',
        ],
        cwd: tempDir,
      });

      // THEN: CLAUDE.md file generated
      expect(result.exitCode).toBe(0); // Will fail initially
      await assertFileExists(`${tempDir}/claude-test/CLAUDE.md`);

      const claudeContent = await Bun.file(`${tempDir}/claude-test/CLAUDE.md`).text();
      expect(claudeContent).toContain('Claude Code Integration');
      expect(claudeContent).toContain('**Name**: claude-test');
    });

    it('should include project structure in CLAUDE.md', async () => {
      // GIVEN: User generates web project
      // WHEN: Project generation completes
      const result = await executeCLI({
        args: [
          'init',
          'claude-structure-test',
          '--template',
          'web',
          '--ai',
          'claude-code',
          '--nonInteractive',
        ],
        cwd: tempDir,
      });

      // THEN: Project structure documented in CLAUDE.md
      expect(result.exitCode).toBe(0); // Will fail initially

      const claudeContent = await Bun.file(`${tempDir}/claude-structure-test/CLAUDE.md`).text();
      expect(claudeContent).toContain('## Project Overview');
      expect(claudeContent).toContain('src/');
      expect(claudeContent).toContain('## Architecture');
      expect(claudeContent).toContain('src/components/');
      expect(claudeContent).toContain('src/pages/');
    });

    it('should include coding standards based on quality level', async () => {
      // GIVEN: User selects strict quality level
      // WHEN: Project generation completes
      const result = await executeCLI({
        args: [
          'init',
          'claude-standards-test',
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

      // THEN: Strict coding standards in CLAUDE.md
      expect(result.exitCode).toBe(0); // Will fail initially

      const claudeContent = await Bun.file(`${tempDir}/claude-standards-test/CLAUDE.md`).text();
      expect(claudeContent).toContain('## Quality Standards');
      expect(claudeContent).toContain('**Quality Level**: strict');
      expect(claudeContent).toContain('Target coverage: 95%');
      expect(claudeContent).toContain('Minimum 95% required for all tests');
    });

    it('should include architecture decisions', async () => {
      // GIVEN: User generates library project
      // WHEN: Project generation completes
      const result = await executeCLI({
        args: [
          'init',
          'claude-architecture-test',
          '--template',
          'library',
          '--ai',
          'claude-code',
          '--nonInteractive',
        ],
        cwd: tempDir,
      });

      // THEN: Architecture decisions documented
      expect(result.exitCode).toBe(0); // Will fail initially

      const claudeContent = await Bun.file(`${tempDir}/claude-architecture-test/CLAUDE.md`).text();
      expect(claudeContent).toContain('## Architecture');
      expect(claudeContent).toContain('Library Package');
      expect(claudeContent).toContain('TypeScript');
      expect(claudeContent).toContain('src/');
    });

    it('should be optimized for AI parsing', async () => {
      // GIVEN: CLAUDE.md generated
      // WHEN: Analyzing file content
      const result = await executeCLI({
        args: [
          'init',
          'claude-optimized-test',
          '--template',
          'basic',
          '--ai',
          'claude-code',
          '--nonInteractive',
        ],
        cwd: tempDir,
      });

      // THEN: Content optimized for AI parsing
      expect(result.exitCode).toBe(0); // Will fail initially

      const claudeContent = await Bun.file(`${tempDir}/claude-optimized-test/CLAUDE.md`).text();

      // Check for AI-optimized structure
      expect(claudeContent.length).toBeLessThan(10000); // Under 10KB for AI parsing
      expect(claudeContent).toMatch(/^# /m); // Clear headers
      expect(claudeContent).toContain('##'); // Section headers
      expect(claudeContent).not.toContain('<!--'); // No HTML comments
      expect(claudeContent).not.toContain('<!'); // No complex markup
    });
  });

  describe('AC5.2: GitHub Copilot Instructions Generation', () => {
    it('should generate GitHub Copilot instructions file', async () => {
      // GIVEN: User selects GitHub Copilot assistant
      // WHEN: Project generation completes
      const result = await executeCLI({
        args: [
          'init',
          'copilot-test',
          '--template',
          'basic',
          '--ai',
          'copilot',
          '--nonInteractive',
        ],
        cwd: tempDir,
      });

      // THEN: GitHub Copilot instructions file generated
      expect(result.exitCode).toBe(0); // Will fail initially
      await assertFileExists(`${tempDir}/copilot-test/.github/copilot-instructions.md`);

      const copilotContent = await Bun.file(
        `${tempDir}/copilot-test/.github/copilot-instructions.md`
      ).text();
      expect(copilotContent).toContain('GitHub Copilot Instructions');
      expect(copilotContent).toContain('**Name**: copilot-test');
    });

    it('should include project-specific coding conventions', async () => {
      // GIVEN: User generates CLI project
      // WHEN: Project generation completes
      const result = await executeCLI({
        args: [
          'init',
          'copilot-conventions-test',
          '--template',
          'cli',
          '--ai',
          'copilot',
          '--nonInteractive',
        ],
        cwd: tempDir,
      });

      // THEN: CLI-specific coding conventions included
      expect(result.exitCode).toBe(0); // Will fail initially

      const copilotContent = await Bun.file(
        `${tempDir}/copilot-conventions-test/.github/copilot-instructions.md`
      ).text();
      expect(copilotContent).toContain('CLI Development Guidelines');
      expect(copilotContent).toContain('command pattern');
      expect(copilotContent).toContain('error');
      expect(copilotContent).toContain('TypeScript');
    });

    it('should include technology stack guidance', async () => {
      // GIVEN: User generates web project
      // WHEN: Project generation completes
      const result = await executeCLI({
        args: [
          'init',
          'copilot-tech-stack-test',
          '--template',
          'web',
          '--ai',
          'copilot',
          '--nonInteractive',
        ],
        cwd: tempDir,
      });

      // THEN: Web technology stack guidance included
      expect(result.exitCode).toBe(0); // Will fail initially

      const copilotContent = await Bun.file(
        `${tempDir}/copilot-tech-stack-test/.github/copilot-instructions.md`
      ).text();
      expect(copilotContent).toContain('Overview');
      expect(copilotContent).toContain('Web Application');
      expect(copilotContent).toContain('TypeScript');
      expect(copilotContent).toContain('Browser');
    });

    it('should be optimized for Copilot format', async () => {
      // GIVEN: Copilot instructions generated
      // WHEN: Analyzing file format
      const result = await executeCLI({
        args: [
          'init',
          'copilot-format-test',
          '--template',
          'basic',
          '--ai',
          'copilot',
          '--nonInteractive',
        ],
        cwd: tempDir,
      });

      // THEN: Content optimized for Copilot
      expect(result.exitCode).toBe(0); // Will fail initially

      const copilotContent = await Bun.file(
        `${tempDir}/copilot-format-test/.github/copilot-instructions.md`
      ).text();

      // Check for Copilot-optimized format
      expect(copilotContent).toContain('# '); // Markdown headers
      expect(copilotContent).toContain('- '); // Bullet points
      expect(copilotContent).toContain('##'); // Section headers
      expect(copilotContent.length).toBeGreaterThan(100); // Has content
    });
  });

  describe('AC5.3: Multi-Assistant Support', () => {
    it('should generate both AI context files when both assistants selected', async () => {
      // GIVEN: User selects both AI assistants
      // WHEN: Project generation completes
      const result = await executeCLI({
        args: [
          'init',
          'both-ai-test',
          '--template',
          'basic',
          '--ai',
          'claude-code,copilot',
          '--nonInteractive',
        ],
        cwd: tempDir,
      });

      // THEN: Both AI context files generated
      expect(result.exitCode).toBe(0); // Will fail initially
      await assertFileExists(`${tempDir}/both-ai-test/CLAUDE.md`);
      await assertFileExists(`${tempDir}/both-ai-test/.github/copilot-instructions.md`);

      const claudeContent = await Bun.file(`${tempDir}/both-ai-test/CLAUDE.md`).text();
      const copilotContent = await Bun.file(
        `${tempDir}/both-ai-test/.github/copilot-instructions.md`
      ).text();

      expect(claudeContent).toContain('Claude Code');
      expect(copilotContent).toContain('GitHub Copilot');
    });

    it('should adapt content for selected assistants', async () => {
      // GIVEN: Different AI assistants have different requirements
      // WHEN: Generating context files
      const resultClaude = await executeCLI({
        args: [
          'init',
          'claude-adapted-test',
          '--template',
          'basic',
          '--ai',
          'claude-code',
          '--nonInteractive',
        ],
        cwd: tempDir,
      });

      // THEN: Content adapted for each assistant
      expect(resultClaude.exitCode).toBe(0); // Will fail initially

      const claudeContent = await Bun.file(`${tempDir}/claude-adapted-test/CLAUDE.md`).text();
      expect(claudeContent).toContain('Claude Code Integration'); // Claude-specific format
      expect(claudeContent).toContain('Language Requirements'); // Claude-specific field
    });
  });

  describe('AC5.4: Quality Level Adaptation', () => {
    it('should adapt AI rules based on strict quality level', async () => {
      // GIVEN: User selects strict quality level
      // WHEN: Generating AI context files
      const result = await executeCLI({
        args: [
          'init',
          'strict-ai-test',
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

      // THEN: Strict quality rules in AI context
      expect(result.exitCode).toBe(0); // Will fail initially

      const claudeContent = await Bun.file(`${tempDir}/strict-ai-test/CLAUDE.md`).text();
      expect(claudeContent).toContain('**Quality Level**: strict');
      expect(claudeContent).toContain('95%');
      expect(claudeContent).toContain('TypeScript');
      expect(claudeContent).toContain('ESLint');
    });

    it('should adapt AI rules based on light quality level', async () => {
      // GIVEN: User selects light quality level
      // WHEN: Generating AI context files
      const result = await executeCLI({
        args: [
          'init',
          'light-ai-test',
          '--template',
          'basic',
          '--quality',
          'light',
          '--ai',
          'claude-code',
          '--nonInteractive',
        ],
        cwd: tempDir,
      });

      // THEN: Light quality rules in AI context
      expect(result.exitCode).toBe(0); // Will fail initially

      const claudeContent = await Bun.file(`${tempDir}/light-ai-test/CLAUDE.md`).text();
      expect(claudeContent).toContain('**Quality Level**: light');
      expect(claudeContent).toContain('70%');
      expect(claudeContent).toContain('TypeScript');
    });
  });

  describe('AC5.5: Code Pattern Examples', () => {
    it('should include good code pattern examples', async () => {
      // GIVEN: AI context files generated
      // WHEN: Analyzing content for examples
      const result = await executeCLI({
        args: [
          'init',
          'pattern-examples-test',
          '--template',
          'basic',
          '--ai',
          'claude-code',
          '--nonInteractive',
        ],
        cwd: tempDir,
      });

      // THEN: Good code pattern examples included
      expect(result.exitCode).toBe(0); // Will fail initially

      const claudeContent = await Bun.file(`${tempDir}/pattern-examples-test/CLAUDE.md`).text();
      expect(claudeContent).toContain('## Development Workflow');
      expect(claudeContent).toContain('TypeScript');
      expect(claudeContent).toContain('ESLint');
      expect(claudeContent).toContain('test');
      expect(claudeContent).toContain('coverage');
    });

    it('should include bad code pattern examples', async () => {
      // GIVEN: AI context files generated
      // WHEN: Analyzing content for anti-patterns
      const result = await executeCLI({
        args: [
          'init',
          'anti-patterns-test',
          '--template',
          'basic',
          '--ai',
          'claude-code',
          '--nonInteractive',
        ],
        cwd: tempDir,
      });

      // THEN: Bad code pattern examples included
      expect(result.exitCode).toBe(0); // Will fail initially

      const claudeContent = await Bun.file(`${tempDir}/anti-patterns-test/CLAUDE.md`).text();
      expect(claudeContent).toContain('NEVER');
      expect(claudeContent).toContain('❌');
      expect(claudeContent).toContain('✅');
      expect(claudeContent).toContain('ESLint');
      expect(claudeContent).toContain('CRITICAL RULE');
    });

    it('should include project-specific pattern guidance', async () => {
      // GIVEN: User generates CLI project
      // WHEN: AI context includes CLI-specific patterns
      const result = await executeCLI({
        args: [
          'init',
          'cli-patterns-test',
          '--template',
          'cli',
          '--ai',
          'claude-code',
          '--nonInteractive',
        ],
        cwd: tempDir,
      });

      // THEN: CLI-specific pattern guidance included
      expect(result.exitCode).toBe(0); // Will fail initially

      const claudeContent = await Bun.file(`${tempDir}/cli-patterns-test/CLAUDE.md`).text();
      expect(claudeContent).toContain('CLI Development');
      expect(claudeContent).toContain('argument parsing');
      expect(claudeContent).toContain('error handling');
      expect(claudeContent).toContain('CLI Application');
    });
  });

  describe('AC5.6: File Size and Structure', () => {
    it('should keep AI context files under 10KB for parsing', async () => {
      // GIVEN: AI context files generated
      // WHEN: Checking file sizes
      const result = await executeCLI({
        args: [
          'init',
          'file-size-test',
          '--template',
          'library',
          '--ai',
          'claude-code,copilot',
          '--nonInteractive',
        ],
        cwd: tempDir,
      });

      // THEN: Files under size limits
      expect(result.exitCode).toBe(0); // Will fail initially

      const claudeFile = Bun.file(`${tempDir}/file-size-test/CLAUDE.md`);
      const copilotFile = Bun.file(`${tempDir}/file-size-test/.github/copilot-instructions.md`);

      expect(claudeFile.size).toBeLessThan(10240); // Under 10KB
      expect(copilotFile.size).toBeLessThan(5120); // Under 5KB for Copilot
    });

    it('should use clear section structure', async () => {
      // GIVEN: AI context files generated
      // WHEN: Analyzing structure
      const result = await executeCLI({
        args: [
          'init',
          'structure-test',
          '--template',
          'basic',
          '--ai',
          'claude-code',
          '--nonInteractive',
        ],
        cwd: tempDir,
      });

      // THEN: Clear section structure used
      expect(result.exitCode).toBe(0); // Will fail initially

      const claudeContent = await Bun.file(`${tempDir}/structure-test/CLAUDE.md`).text();

      // Check for clear section structure
      expect(claudeContent).toMatch(/^# /m); // Main title
      expect(claudeContent).toMatch(/^## /m); // Section headers
      expect(claudeContent).toMatch(/^### /m); // Subsection headers
      expect(claudeContent).toMatch(/^- /m); // Bullet points
      expect(claudeContent).toContain('**'); // Bold text
    });
  });
});
