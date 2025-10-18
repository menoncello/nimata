import { mkdtemp, rm, writeFile } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { YAMLConfigRepository } from '../../src/repositories/yaml-config-repository';

describe('YAML Security Validation (P0-1)', () => {
  let tempDir: string;
  let repo: YAMLConfigRepository;

  beforeEach(async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'nimata-security-test-'));
    repo = new YAMLConfigRepository();
  });

  afterEach(async () => {
    await rm(tempDir, { recursive: true, force: true });
  });

  describe('file size validation', () => {
    it('should reject YAML files exceeding 1MB', async () => {
      const largeContent = 'x'.repeat(1024 * 1024 + 1);
      const configPath = join(tempDir, '.nimatarc');
      await writeFile(configPath, `version: 1\nqualityLevel: strict\ndata: "${largeContent}"`);

      await expect(repo.load(tempDir)).rejects.toThrow(/Configuration file too large/);
    });

    it('should accept files under 1MB', async () => {
      const validContent = 'x'.repeat(100);
      const configPath = join(tempDir, '.nimatarc');
      await writeFile(configPath, `version: 1\nqualityLevel: strict\ndata: "${validContent}"`);

      const config = await repo.load(tempDir);
      expect(config.version).toBe(1);
    });
  });

  describe('YAML anchor/alias security', () => {
    it('should reject YAML with anchors', async () => {
      const configPath = join(tempDir, '.nimatarc');
      await writeFile(
        configPath,
        `
version: 1
tools: &tools
  eslint:
    enabled: true
`
      );

      await expect(repo.load(tempDir)).rejects.toThrow(/YAML anchors\/aliases.*not allowed/);
    });

    it('should reject YAML with aliases', async () => {
      const configPath = join(tempDir, '.nimatarc');
      await writeFile(
        configPath,
        `
version: 1
tools:
  eslint: *default
`
      );

      await expect(repo.load(tempDir)).rejects.toThrow(/YAML anchors\/aliases.*not allowed/);
    });

    it('should accept YAML without anchors or aliases', async () => {
      const configPath = join(tempDir, '.nimatarc');
      await writeFile(
        configPath,
        `
version: 1
qualityLevel: strict
tools:
  eslint:
    enabled: true
`
      );

      const config = await repo.load(tempDir);
      expect(config.tools?.eslint?.enabled).toBe(true);
    });
  });

  describe('nesting depth validation', () => {
    it('should reject YAML exceeding 10 levels of nesting', async () => {
      const configPath = join(tempDir, '.nimatarc');
      const deepNesting = `
version: 1
l1:
  l2:
    l3:
      l4:
        l5:
          l6:
            l7:
              l8:
                l9:
                  l10:
                    l11:
                      value: "too deep"
`;
      await writeFile(configPath, deepNesting);

      await expect(repo.load(tempDir)).rejects.toThrow(/exceeds maximum nesting depth/);
    });

    it('should accept YAML with 10 levels of nesting', async () => {
      const configPath = join(tempDir, '.nimatarc');
      const validNesting = `
version: 1
l1:
  l2:
    l3:
      l4:
        l5:
          l6:
            l7:
              l8:
                l9: "just right"
`;
      await writeFile(configPath, validNesting);

      const config = await repo.load(tempDir);
      expect(config.version).toBe(1);
    });

    it('should accept shallow nesting', async () => {
      const configPath = join(tempDir, '.nimatarc');
      await writeFile(
        configPath,
        `
version: 1
qualityLevel: strict
tools:
  eslint:
    enabled: true
`
      );

      const config = await repo.load(tempDir);
      expect(config.version).toBe(1);
    });
  });

  describe('path validation', () => {
    it.skip('should reject absolute paths in config (validation happens on load)', async () => {
      // NOTE: Path validation happens on load(), not save()
      // save() should succeed, but load() should reject invalid paths
      const config = {
        version: 1,
        qualityLevel: 'strict' as const,
        aiAssistants: ['claude-code' as const],
        tools: {
          eslint: {
            enabled: true,
            configPath: '/absolute/path/.eslintrc.json',
          },
        },
        scaffolding: {},
        validation: {},
        refactoring: {},
        logging: {},
      };

      // Save should succeed
      await expect(repo.save(config, tempDir)).resolves.toBeUndefined();

      // But loading should fail
      await expect(repo.load(tempDir)).rejects.toThrow(/Absolute paths.*not allowed/);
    });

    it.skip('should reject parent directory references (validation happens on load)', async () => {
      // NOTE: Path validation happens on load(), not save()
      const config = {
        version: 1,
        qualityLevel: 'strict' as const,
        aiAssistants: ['claude-code' as const],
        tools: {
          typescript: {
            enabled: true,
            configPath: '../../../etc/passwd',
          },
        },
        scaffolding: {},
        validation: {},
        refactoring: {},
        logging: {},
      };

      // Save should succeed
      await expect(repo.save(config, tempDir)).resolves.toBeUndefined();

      // But loading should fail
      await expect(repo.load(tempDir)).rejects.toThrow(
        /parent directory references.*not allowed/
      );
    });

    it('should accept relative paths', async () => {
      const config = {
        version: 1,
        qualityLevel: 'strict' as const,
        aiAssistants: ['claude-code' as const],
        tools: {
          eslint: {
            enabled: true,
            configPath: '.eslintrc.json',
          },
        },
        scaffolding: {},
        validation: {},
        refactoring: {},
        logging: {},
      };

      await repo.save(config, tempDir);

      const saved = await repo.load(tempDir);
      expect(saved.tools?.eslint?.configPath).toBe('.eslintrc.json');
    });
  });
});
