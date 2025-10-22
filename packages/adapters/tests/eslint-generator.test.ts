/**
 * Unit tests for ESLint Generator
 */

import { describe, it, expect, beforeEach } from 'bun:test';
import { ESLintGenerator, createESLintGenerator } from '../src/generators/eslint-generator';

// Inline type to avoid import issues
interface ProjectConfig {
  name: string;
  description?: string;
  qualityLevel: 'light' | 'medium' | 'strict';
  projectType: 'basic' | 'web' | 'cli' | 'library';
  aiAssistants: Array<'claude-code' | 'copilot'>;
}

describe('ESLintGenerator', () => {
  let generator: ESLintGenerator;

  beforeEach(() => {
    generator = createESLintGenerator({
      name: 'test-project',
      description: 'Test project',
      qualityLevel: 'medium',
      projectType: 'basic',
      aiAssistants: ['claude-code'],
    });
  });

  describe('generate', () => {
    it('should generate configurations for basic project with medium quality', () => {
      const specificGenerator = createESLintGenerator({
        name: 'test-project',
        description: 'Test project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['claude-code'],
      });
      const results = specificGenerator.generate();

      expect(results).toHaveLength(4); // main, typescript, testing, ignore
      expect(results[0].filename).toBe('eslint.config.mjs');
      expect(results[1].filename).toBe('eslint.typescript.mjs');
      expect(results[2].filename).toBe('eslint.testing.mjs');
      expect(results[3].filename).toBe('.eslintignore');
    });

    it('should generate configurations for web project with strict quality', () => {
      const config: ProjectConfig = {
        name: 'web-project',
        description: 'Web project',
        qualityLevel: 'strict',
        projectType: 'web',
        aiAssistants: ['claude-code'],
      };

      const strictGenerator = createESLintGenerator(config);
      const results = strictGenerator.generate();

      expect(results).toHaveLength(4);

      const mainConfig = results[0];
      expect(mainConfig.content).toContain('Quality Level: strict');
      expect(mainConfig.content).toContain('Target Environment: browser');

      const tsConfig = results[1];
      expect(tsConfig.content).toContain('Web Application');
      expect(tsConfig.content).toContain('@typescript-eslint/no-explicit-any": "error"');
    });

    it('should generate configurations for CLI project with light quality', () => {
      const config: ProjectConfig = {
        name: 'cli-project',
        qualityLevel: 'light',
        projectType: 'cli',
        aiAssistants: ['claude-code'],
      };

      const specificGenerator = createESLintGenerator(config);
      const results = specificGenerator.generate();

      expect(results).toHaveLength(4);

      const mainConfig = results[0];
      expect(mainConfig.content).toContain('Quality Level: light');
      expect(mainConfig.content).toContain('Target Environment: node');

      const tsConfig = results[1];
      expect(tsConfig.content).toContain('CLI Application');
      expect(tsConfig.content).toContain('@typescript-eslint/no-explicit-any": "off"');
    });

    it('should generate configurations for library project', () => {
      const config: ProjectConfig = {
        name: 'lib-project',
        qualityLevel: 'medium',
        projectType: 'library',
        aiAssistants: ['claude-code'],
      };

      const specificGenerator = createESLintGenerator(config);
      const results = specificGenerator.generate();

      expect(results).toHaveLength(4);

      const mainConfig = results[0];
      expect(mainConfig.content).toContain('Quality Level: medium');
      expect(mainConfig.content).toContain('Target Environment: both');

      const tsConfig = results[1];
      expect(tsConfig.content).toContain('Library Package');
      expect(tsConfig.content).toContain('Library-specific rules');
    });
  });

  describe('configuration content', () => {
    it('should include proper imports and exports', () => {
      const results = generator.generate();
      const mainConfig = results[0];

      expect(mainConfig.content).toContain("import eslint from '@eslint/js';");
      expect(mainConfig.content).toContain('export default [');
      expect(mainConfig.content).toContain('eslint.configs.recommended');
    });

    it('should include TypeScript configuration', () => {
      const results = generator.generate();
      const tsConfig = results[1];

      expect(tsConfig.content).toContain(
        "import typescriptPlugin from '@typescript-eslint/eslint-plugin';"
      );
      expect(tsConfig.content).toContain(
        "import typescriptParser from '@typescript-eslint/parser';"
      );
      expect(tsConfig.content).toContain("files: ['**/*.ts']");
    });

    it('should include testing configuration', () => {
      const results = generator.generate();
      const testConfig = results[2];

      expect(testConfig.content).toContain('files: ["**/*.test.ts","**/*.spec.ts"');
      expect(testConfig.content).toContain('no-unused-expressions": "off"');
    });

    it('should include ignore file content', () => {
      const results = generator.generate();
      const ignoreConfig = results[3];

      expect(ignoreConfig.content).toContain('node_modules/');
      expect(ignoreConfig.content).toContain('dist/');
      expect(ignoreConfig.content).toContain('coverage/');
      expect(ignoreConfig.content).toContain('*.config.js');
    });
  });

  describe('quality level differences', () => {
    it('should use relaxed rules for light quality', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'light',
        projectType: 'basic',
        aiAssistants: ['claude-code'],
      };

      const lightGenerator = createESLintGenerator(config);
      const results = lightGenerator.generate();
      const tsConfig = results[1];

      expect(tsConfig.content).toContain('@typescript-eslint/no-explicit-any": "off"');
      expect(tsConfig.content).toContain('@typescript-eslint/no-unused-vars": "warn"');
    });

    it('should use medium rules for medium quality', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['claude-code'],
      };

      const mediumGenerator = createESLintGenerator(config);
      const results = mediumGenerator.generate();
      const tsConfig = results[1];

      expect(tsConfig.content).toContain('@typescript-eslint/no-explicit-any": "warn"');
      expect(tsConfig.content).toContain('@typescript-eslint/no-unused-vars": "error"');
      expect(tsConfig.content).toContain('@typescript-eslint/prefer-nullish-coalescing": "error"');
    });

    it('should use strict rules for strict quality', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'strict',
        projectType: 'basic',
        aiAssistants: ['claude-code'],
      };

      const strictGenerator = createESLintGenerator(config);
      const results = strictGenerator.generate();
      const tsConfig = results[1];

      expect(tsConfig.content).toContain('@typescript-eslint/no-explicit-any": "error"');
      expect(tsConfig.content).toContain('@typescript-eslint/no-non-null-assertion": "error"');
      expect(tsConfig.content).toContain('@typescript-eslint/no-floating-promises": "error"');
    });
  });

  describe('project type specific configurations', () => {
    it('should include browser globals for web projects', () => {
      const config: ProjectConfig = {
        name: 'web-project',
        qualityLevel: 'medium',
        projectType: 'web',
        aiAssistants: ['claude-code'],
      };

      const webGenerator = createESLintGenerator(config);
      const results = webGenerator.generate();
      const mainConfig = results[0];

      expect(mainConfig.content).toContain('"window": "readonly"');
      expect(mainConfig.content).toContain('"document": "readonly"');
      expect(mainConfig.content).toContain('"navigator": "readonly"');
    });

    it('should include Node.js globals for CLI projects', () => {
      const config: ProjectConfig = {
        name: 'cli-project',
        qualityLevel: 'medium',
        projectType: 'cli',
        aiAssistants: ['claude-code'],
      };

      const cliGenerator = createESLintGenerator(config);
      const results = cliGenerator.generate();
      const mainConfig = results[0];

      expect(mainConfig.content).toContain('"process": "readonly"');
      expect(mainConfig.content).toContain('"Buffer": "readonly"');
      expect(mainConfig.content).toContain('"__dirname": "readonly"');
    });

    it('should include both globals for library projects', () => {
      const config: ProjectConfig = {
        name: 'lib-project',
        qualityLevel: 'medium',
        projectType: 'library',
        aiAssistants: ['claude-code'],
      };

      const libGenerator = createESLintGenerator(config);
      const results = libGenerator.generate();
      const mainConfig = results[0];

      expect(mainConfig.content).toContain('"window": "readonly"');
      expect(mainConfig.content).toContain('"process": "readonly"');
    });
  });

  describe('createESLintGenerator factory', () => {
    it('should create a new ESLintGenerator instance', () => {
      const generator = createESLintGenerator();

      expect(generator).toBeInstanceOf(ESLintGenerator);
    });

    it('should create working generator', () => {
      const generator = createESLintGenerator();
      const results = generator.generate();
      expect(results).toHaveLength(4);
    });
  });
});
