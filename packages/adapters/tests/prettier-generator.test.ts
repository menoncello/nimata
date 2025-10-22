/**
 * Unit tests for Prettier Generator
 */

import { describe, it, expect, beforeEach } from 'bun:test';
import { PrettierGenerator, createPrettierGenerator } from '../src/generators/prettier-generator';

// Inline type to avoid import issues
interface ProjectConfig {
  name: string;
  description?: string;
  qualityLevel: 'light' | 'medium' | 'strict';
  projectType: 'basic' | 'web' | 'cli' | 'library';
  aiAssistants: Array<'claude-code' | 'copilot'>;
}

describe('PrettierGenerator', () => {
  let generator: PrettierGenerator;

  beforeEach(() => {
    generator = createPrettierGenerator();
  });

  describe('generate', () => {
    it('should generate configurations for basic project with medium quality', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        description: 'Test project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);

      expect(results).toHaveLength(3); // main, ignore, editorconfig
      expect(results[0].filename).toBe('.prettierrc.json');
      expect(results[1].filename).toBe('.prettierignore');
      expect(results[2].filename).toBe('.editorconfig');
    });

    it('should generate configurations for web project with strict quality', () => {
      const config: ProjectConfig = {
        name: 'web-project',
        description: 'Web project',
        qualityLevel: 'strict',
        projectType: 'web',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);

      expect(results).toHaveLength(3);

      const mainConfig = results[0];
      const configContent = JSON.parse(mainConfig.content);
      expect(configContent.trailingComma).toBe('all');
      expect(configContent.printWidth).toBe(80);
    });

    it('should generate configurations for CLI project with light quality', () => {
      const config: ProjectConfig = {
        name: 'cli-project',
        qualityLevel: 'light',
        projectType: 'cli',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);

      expect(results).toHaveLength(3);

      const mainConfig = results[0];
      const configContent = JSON.parse(mainConfig.content);
      expect(configContent.trailingComma).toBe('none');
      expect(configContent.printWidth).toBe(120);
    });

    it('should generate configurations for library project', () => {
      const config: ProjectConfig = {
        name: 'lib-project',
        qualityLevel: 'medium',
        projectType: 'library',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);

      expect(results).toHaveLength(3);

      const mainConfig = results[0];
      const configContent = JSON.parse(mainConfig.content);
      expect(configContent.plugins).toContain('prettier-plugin-packagejson');
    });
  });

  describe('configuration content', () => {
    it('should include proper Prettier configuration', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);
      const mainConfig = results[0];

      const configContent = JSON.parse(mainConfig.content);
      expect(configContent.semi).toBe(true);
      expect(configContent.singleQuote).toBe(true);
      expect(configContent.tabWidth).toBe(2);
      expect(configContent.useTabs).toBe(false);
    });

    it('should include TypeScript plugin', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);
      const mainConfig = results[0];

      const configContent = JSON.parse(mainConfig.content);
      expect(configContent.plugins).toContain('@prettier/plugin-typescript');
    });

    it('should include proper ignore patterns', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);
      const ignoreConfig = results[1];

      expect(ignoreConfig.content).toContain('node_modules/');
      expect(ignoreConfig.content).toContain('dist/');
      expect(ignoreConfig.content).toContain('coverage/');
      expect(ignoreConfig.content).toContain('*.config.js');
    });

    it('should include proper EditorConfig settings', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);
      const editorConfig = results[2];

      expect(editorConfig.content).toContain('root = true');
      expect(editorConfig.content).toContain('end_of_line = lf');
      expect(editorConfig.content).toContain('insert_final_newline = true');
      expect(editorConfig.content).toContain('trim_trailing_whitespace = true');
    });
  });

  describe('quality level differences', () => {
    it('should use relaxed settings for light quality', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'light',
        projectType: 'basic',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);
      const mainConfig = results[0];

      const configContent = JSON.parse(mainConfig.content);
      expect(configContent.trailingComma).toBe('none');
      expect(configContent.printWidth).toBe(120);
    });

    it('should use medium settings for medium quality', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);
      const mainConfig = results[0];

      const configContent = JSON.parse(mainConfig.content);
      expect(configContent.trailingComma).toBe('es5');
      expect(configContent.printWidth).toBe(100);
    });

    it('should use strict settings for strict quality', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'strict',
        projectType: 'basic',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);
      const mainConfig = results[0];

      const configContent = JSON.parse(mainConfig.content);
      expect(configContent.trailingComma).toBe('all');
      expect(configContent.printWidth).toBe(80);
    });
  });

  describe('project type specific configurations', () => {
    it('should include web-specific plugins for web projects', () => {
      const config: ProjectConfig = {
        name: 'web-project',
        qualityLevel: 'medium',
        projectType: 'web',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);
      const mainConfig = results[0];

      const configContent = JSON.parse(mainConfig.content);
      expect(configContent.plugins).toContain('@prettier/plugin-html');
      expect(configContent.plugins).toContain('prettier-plugin-css');
    });

    it('should include library-specific plugins for library projects', () => {
      const config: ProjectConfig = {
        name: 'lib-project',
        qualityLevel: 'medium',
        projectType: 'library',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);
      const mainConfig = results[0];

      const configContent = JSON.parse(mainConfig.content);
      expect(configContent.plugins).toContain('prettier-plugin-packagejson');
    });

    it('should include web-specific overrides for web projects', () => {
      const config: ProjectConfig = {
        name: 'web-project',
        qualityLevel: 'medium',
        projectType: 'web',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);
      const mainConfig = results[0];

      const configContent = JSON.parse(mainConfig.content);
      const htmlOverride = configContent.overrides.find((override: any) =>
        override.files.includes('*.html')
      );
      expect(htmlOverride).toBeDefined();
      expect(htmlOverride.options.singleQuote).toBe(false);
    });
  });

  describe('createPrettierGenerator factory', () => {
    it('should create a new PrettierGenerator instance', () => {
      const generator = createPrettierGenerator();

      expect(generator).toBeInstanceOf(PrettierGenerator);
    });

    it('should create working generator', () => {
      const generator = createPrettierGenerator();
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);
      expect(results).toHaveLength(3);
    });
  });

  describe('configuration validation', () => {
    it('should generate valid JSON for main configuration', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);
      const mainConfig = results[0];

      expect(() => JSON.parse(mainConfig.content)).not.toThrow();
    });

    it('should include required Prettier fields', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);
      const mainConfig = results[0];

      const configContent = JSON.parse(mainConfig.content);
      expect(configContent).toHaveProperty('semi');
      expect(configContent).toHaveProperty('singleQuote');
      expect(configContent).toHaveProperty('tabWidth');
      expect(configContent).toHaveProperty('printWidth');
    });
  });
});
