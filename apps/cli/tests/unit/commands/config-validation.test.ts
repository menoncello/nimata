/**
 * Unit Tests - Configuration Validation [T005]
 *
 * Tests for configuration validation logic in the init command
 * Priority: P1 - Core functionality
 */
import 'reflect-metadata';
import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { ProjectConfigProcessorImpl } from '@nimata/core/services/project-config-processor';
import type { ProjectConfig } from '@nimata/core/types/project-config';
import { useDIContainer } from '../../support/fixtures/test-fixtures';

describe('Configuration Validation [T005]', () => {
  let cleanupDI: () => void;
  let processor: ProjectConfigProcessorImpl;

  beforeEach(() => {
    cleanupDI = useDIContainer();
    processor = new ProjectConfigProcessorImpl();
  });

  afterEach(() => {
    cleanupDI();
  });

  describe('Project Name Validation [T005-10]', () => {
    it('[T005-11] should accept valid project names', async () => {
      const validNames = ['my-project', 'test_app', 'project123', 'a'];

      for (const name of validNames) {
        const config = { name } as ProjectConfig;
        const result = await processor.validateFinalConfig(config);

        expect(result.errors.filter((e) => e.includes('Project name'))).toHaveLength(0);
      }
    });

    it('[T005-12] should reject empty project names', async () => {
      const config = { name: '' } as ProjectConfig;
      const result = await processor.validateFinalConfig(config);

      expect(result.errors).toContain('Project name is required');
      expect(result.valid).toBe(false);
    });

    it('[T005-13] should reject project names with invalid characters', async () => {
      const invalidNames = ['My Project', 'project@name', 'project/name', 'project:name'];

      for (const name of invalidNames) {
        const config = { name } as ProjectConfig;
        const result = await processor.validateFinalConfig(config);

        expect(result.valid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
      }
    });

    it('[T005-14] should reject potentially dangerous project names', async () => {
      const dangerousNames = ['../project', '~project', 'CON', 'PRN'];

      for (const name of dangerousNames) {
        const config = { name } as ProjectConfig;
        const result = await processor.validateFinalConfig(config);

        expect(result.valid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
      }
    });

    it('[T005-15] should warn about reserved project names', async () => {
      const reservedNames = ['node', 'npm', 'test', 'lib', 'src'];

      for (const name of reservedNames) {
        const config = { name } as ProjectConfig;
        const result = await processor.validateFinalConfig(config);

        expect(result.warnings.some((w) => w.includes('reserved name'))).toBe(true);
      }
    });
  });

  describe('Project Type Validation [T005-20]', () => {
    it('[T005-21] should accept valid project types', async () => {
      const validTypes = [
        'basic',
        'web',
        'cli',
        'library',
        'bun-react',
        'bun-vue',
        'bun-express',
        'bun-typescript',
      ];

      for (const type of validTypes) {
        const config = { name: 'test', projectType: type as any } as ProjectConfig;
        const result = await processor.validateFinalConfig(config);

        expect(result.errors.filter((e) => e.includes('Invalid project type'))).toHaveLength(0);
      }
    });

    it('[T005-22] should warn about invalid project types', async () => {
      const config = {
        name: 'test',
        projectType: 'invalid-type' as any,
      } as ProjectConfig;

      const result = await processor.validateFinalConfig(config);

      expect(result.warnings.some((w) => w.includes('Invalid project type'))).toBe(true);
    });
  });

  describe('Quality Level Validation [T005-30]', () => {
    it('[T005-31] should accept valid quality levels', async () => {
      const validLevels = ['light', 'medium', 'strict', 'high'];

      for (const level of validLevels) {
        const config = {
          name: 'test',
          qualityLevel: level as any,
        } as ProjectConfig;

        const result = await processor.validateFinalConfig(config);

        expect(result.errors.filter((e) => e.includes('Invalid quality level'))).toHaveLength(0);
      }
    });

    it('[T005-32] should warn about invalid quality levels', async () => {
      const config = {
        name: 'test',
        qualityLevel: 'invalid-level' as any,
      } as ProjectConfig;

      const result = await processor.validateFinalConfig(config);

      expect(result.warnings.some((w) => w.includes('Invalid quality level'))).toBe(true);
    });

    it('[T005-33] should warn about light quality level security implications', async () => {
      const config = {
        name: 'test',
        qualityLevel: 'light' as any,
      } as ProjectConfig;

      const result = await processor.validateFinalConfig(config);

      expect(
        result.warnings.some((w) => w.includes('Light quality level provides minimal security'))
      ).toBe(true);
    });
  });

  describe('AI Assistants Validation [T005-40]', () => {
    it('[T005-41] should accept valid AI assistants', async () => {
      const validAssistants = ['claude-code', 'copilot', 'github-copilot', 'ai-context', 'cursor'];

      for (const assistant of validAssistants) {
        const config = {
          name: 'test',
          aiAssistants: [assistant as any],
        } as ProjectConfig;

        const result = await processor.validateFinalConfig(config);

        expect(result.errors.filter((e) => e.includes('Invalid AI assistant'))).toHaveLength(0);
      }
    });

    it('[T005-42] should warn about invalid AI assistants', async () => {
      const config = {
        name: 'test',
        aiAssistants: ['invalid-assistant' as any],
      } as ProjectConfig;

      const result = await processor.validateFinalConfig(config);

      expect(result.warnings.some((w) => w.includes('Invalid AI assistant'))).toBe(true);
    });

    it('[T005-43] should warn about too many AI assistants', async () => {
      const config = {
        name: 'test',
        aiAssistants: [
          'claude-code',
          'copilot',
          'github-copilot',
          'ai-context',
          'cursor',
          'extra',
        ] as any[],
      } as ProjectConfig;

      const result = await processor.validateFinalConfig(config);

      expect(result.warnings.some((w) => w.includes('many AI assistants'))).toBe(true);
    });
  });

  describe('Security Validation [T005-50]', () => {
    it('[T005-51] should reject dangerous content in description', async () => {
      const dangerousDescriptions = [
        '<script>alert("xss")</script>',
        'data:text/html;base64,PHNjcmlwdD5hbGVydCgneHNzJyk8L3NjcmlwdD4=', // Base64 encoded script tag
        'onclick=alert("xss")',
        'data:text/html,<script>alert("xss")</script>',
      ];

      for (const desc of dangerousDescriptions) {
        const config = {
          name: 'test',
          description: desc,
        } as ProjectConfig;

        const result = await processor.validateFinalConfig(config);

        expect(
          result.errors.some((e) => e.includes('contains potentially dangerous content'))
        ).toBe(true);
      }
    });

    it('[T005-52] should reject dangerous content in author field', async () => {
      const dangerousAuthors = [
        '<script>alert("xss")</script>',
        'vbscript:msgbox("xss")', // Alternative script protocol for testing
        'onclick=alert("xss")',
      ];

      for (const author of dangerousAuthors) {
        const config = {
          name: 'test',
          author: author,
        } as ProjectConfig;

        const result = await processor.validateFinalConfig(config);

        expect(
          result.errors.some((e) =>
            e.includes('Author field contains potentially dangerous content')
          )
        ).toBe(true);
      }
    });

    it('[T005-53] should warn about very long descriptions', async () => {
      const longDescription = 'a'.repeat(1001);
      const config = {
        name: 'test',
        description: longDescription,
      } as ProjectConfig;

      const result = await processor.validateFinalConfig(config);

      expect(result.warnings.some((w) => w.includes('Project description is very long'))).toBe(
        true
      );
    });

    it('[T005-54] should warn about long author names', async () => {
      const longAuthor = 'a'.repeat(101);
      const config = {
        name: 'test',
        author: longAuthor,
      } as ProjectConfig;

      const result = await processor.validateFinalConfig(config);

      expect(result.warnings.some((w) => w.includes('Author name is quite long'))).toBe(true);
    });
  });

  describe('Target Directory Validation [T005-60]', () => {
    it('[T005-61] should reject target directory with path traversal', async () => {
      const dangerousDirs = ['../project', '../../../etc', 'folder/../project'];

      for (const dir of dangerousDirs) {
        const config = {
          name: 'test',
          targetDirectory: dir,
        } as ProjectConfig;

        const result = await processor.validateFinalConfig(config);

        expect(result.errors.some((e) => e.includes('cannot contain ".." or "~"'))).toBe(true);
      }
    });

    it('[T005-62] should accept absolute paths', async () => {
      const absolutePaths = ['/home/user/project', 'C:\\Users\\User\\project'];

      for (const path of absolutePaths) {
        const config = {
          name: 'test',
          targetDirectory: path,
          qualityLevel: 'medium' as const,
          projectType: 'basic' as const,
          aiAssistants: ['claude-code' as const],
        } as ProjectConfig;

        const result = await processor.validateFinalConfig(config);

        expect(result.errors.some((e) => e.includes('Absolute paths are not allowed'))).toBe(false);
      }
    });

    it('[T005-63] should warn about dangerous directory names', async () => {
      const config = {
        name: 'test',
        targetDirectory: './project/etc/bin',
      } as ProjectConfig;

      const result = await processor.validateFinalConfig(config);

      expect(result.warnings.some((w) => w.includes('contains potentially dangerous path'))).toBe(
        true
      );
    });
  });

  describe('Default Application [T005-70]', () => {
    it('[T005-71] should apply defaults to partial configuration', async () => {
      const partialConfig = { name: 'test-project' } as Partial<ProjectConfig>;

      const result = await processor.process(partialConfig);

      expect(result.name).toBe('test-project');
      expect(result.description).toBe('');
      expect(result.author).toBe('');
      expect(result.license).toBe('MIT');
      expect(result.qualityLevel).toBe('medium');
      expect(result.projectType).toBe('basic');
      expect(result.aiAssistants).toEqual(['claude-code']);
      expect(result.nonInteractive).toBe(false);
    });

    it('[T005-72] should use provided values over defaults', async () => {
      const config = {
        name: 'test-project',
        description: 'Test description',
        author: 'Test Author',
        license: 'Apache-2.0',
        qualityLevel: 'strict' as const,
        projectType: 'web' as const,
        aiAssistants: ['copilot' as const],
        nonInteractive: true,
      } as Partial<ProjectConfig>;

      const result = await processor.process(config);

      expect(result.name).toBe('test-project');
      expect(result.description).toBe('Test description');
      expect(result.author).toBe('Test Author');
      expect(result.license).toBe('Apache-2.0');
      expect(result.qualityLevel).toBe('strict');
      expect(result.projectType).toBe('web');
      expect(result.aiAssistants).toEqual(['copilot']);
      expect(result.nonInteractive).toBe(true);
    });
  });
});
