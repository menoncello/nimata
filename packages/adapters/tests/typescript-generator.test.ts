/**
 * Unit tests for TypeScript Generator
 */

import { describe, it, expect, beforeEach } from 'bun:test';
import {
  TypeScriptGenerator,
  createTypeScriptGenerator,
} from '../src/generators/typescript-generator';

// Inline type to avoid import issues
interface ProjectConfig {
  name: string;
  description?: string;
  qualityLevel: 'light' | 'medium' | 'strict';
  projectType: 'basic' | 'web' | 'cli' | 'library';
  aiAssistants: Array<'claude-code' | 'copilot'>;
}

// Helper function to validate JSON content
function validateJsonContent(content: string): void {
  expect(() => JSON.parse(content)).not.toThrow();
}

describe('TypeScriptGenerator', () => {
  let generator: TypeScriptGenerator;

  beforeEach(() => {
    generator = createTypeScriptGenerator();
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

      expect(results.length).toBeGreaterThan(0);
      expect(results[0].filename).toBe('tsconfig.json');
      expect(results[0].description).toBe('Main TypeScript configuration');
    });

    it('should generate more configurations for web project', () => {
      const config: ProjectConfig = {
        name: 'web-project',
        qualityLevel: 'medium',
        projectType: 'web',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);

      expect(results.length).toBeGreaterThan(0);

      // Check that we have the expected files
      const filenames = results.map((r) => r.filename);
      expect(filenames).toContain('tsconfig.json');
      expect(filenames).toContain('tsconfig.base.json');
      expect(filenames).toContain('tsconfig.test.json');
    });

    it('should generate configurations for CLI project', () => {
      const config: ProjectConfig = {
        name: 'cli-project',
        qualityLevel: 'strict',
        projectType: 'cli',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);

      expect(results.length).toBeGreaterThan(0);

      const mainConfig = results.find((r) => r.filename === 'tsconfig.json');
      expect(mainConfig).toBeDefined();
      if (mainConfig) {
        expect(mainConfig.content).toContain('"strict": true');
        expect(mainConfig.content).toContain('"noUnusedLocals": true');
      }
    });

    it('should generate configurations for library project', () => {
      const config: ProjectConfig = {
        name: 'lib-project',
        qualityLevel: 'medium',
        projectType: 'library',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);

      expect(results.length).toBeGreaterThan(0);

      const filenames = results.map((r) => r.filename);
      expect(filenames).toContain('tsconfig.json');
      expect(filenames).toContain('tsconfig.types.json');
      expect(filenames).toContain('esbuild.config.mjs');
    });
  });

  describe('configuration content', () => {
    it('should include proper extends reference', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);
      const mainConfig = results.find((r) => r.filename === 'tsconfig.json');

      expect(mainConfig).toBeDefined();
      if (mainConfig) {
        expect(mainConfig.content).toContain('"extends": "./tsconfig.base.json"');
      }
    });

    it('should include TypeScript compiler options', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);
      const mainConfig = results.find((r) => r.filename === 'tsconfig.json');

      expect(mainConfig).toBeDefined();
      if (mainConfig) {
        expect(mainConfig.content).toContain('"compilerOptions"');
        expect(mainConfig.content).toContain('"target"');
        expect(mainConfig.content).toContain('"module"');
        expect(mainConfig.content).toContain('"moduleResolution"');
      }
    });

    it('should include include and exclude patterns', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);
      const mainConfig = results.find((r) => r.filename === 'tsconfig.json');

      expect(mainConfig).toBeDefined();
      if (mainConfig) {
        expect(mainConfig.content).toContain('"include"');
        expect(mainConfig.content).toContain('"exclude"');
        expect(mainConfig.content).toContain('src/**/*');
        expect(mainConfig.content).toContain('node_modules');
      }
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

      const results = generator.generate(config);
      const mainConfig = results.find((r) => r.filename === 'tsconfig.json');

      expect(mainConfig).toBeDefined();
      if (mainConfig) {
        expect(mainConfig.content).toContain('"noImplicitAny": false');
        expect(mainConfig.content).toContain('"noImplicitReturns": false');
        expect(mainConfig.content).toContain('"noUnusedLocals": false');
      }
    });

    it('should use medium rules for medium quality', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);
      const mainConfig = results.find((r) => r.filename === 'tsconfig.json');

      expect(mainConfig).toBeDefined();
      if (mainConfig) {
        expect(mainConfig.content).toContain('"noImplicitAny": true');
        expect(mainConfig.content).toContain('"noImplicitReturns": true');
        expect(mainConfig.content).toContain('"noUnusedLocals": false');
      }
    });

    it('should use strict rules for strict quality', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'strict',
        projectType: 'basic',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);
      const mainConfig = results.find((r) => r.filename === 'tsconfig.json');

      expect(mainConfig?.content).toContain('"noImplicitAny": true');
      expect(mainConfig?.content).toContain('"noImplicitReturns": true');
      expect(mainConfig?.content).toContain('"noUnusedLocals": true');
      expect(mainConfig?.content).toContain('"exactOptionalPropertyTypes": true');
    });
  });

  describe('project type specific configurations', () => {
    it('should include JSX for web projects', () => {
      const config: ProjectConfig = {
        name: 'web-project',
        qualityLevel: 'medium',
        projectType: 'web',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);
      const mainConfig = results.find((r) => r.filename === 'tsconfig.json');

      expect(mainConfig?.content).toContain('"jsx": "react-jsx"');
    });

    it('should include Node.js target for CLI projects', () => {
      const config: ProjectConfig = {
        name: 'cli-project',
        qualityLevel: 'medium',
        projectType: 'cli',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);
      const mainConfig = results.find((r) => r.filename === 'tsconfig.json');

      expect(mainConfig?.content).toContain('"module": "NodeNext"');
      expect(mainConfig?.content).toContain('"target"');
    });

    it('should include path mappings for library projects', () => {
      const config: ProjectConfig = {
        name: 'lib-project',
        qualityLevel: 'medium',
        projectType: 'library',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);
      const mainConfig = results.find((r) => r.filename === 'tsconfig.json');

      expect(mainConfig?.content).toContain('"baseUrl": "./src"');
      expect(mainConfig?.content).toContain('"paths"');
      expect(mainConfig?.content).toContain('"@/*":');
      expect(mainConfig?.content).toContain('"./src/*"');
    });
  });

  describe('special configuration files', () => {
    it('should generate base configuration', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);
      const baseConfig = results.find((r) => r.filename === 'tsconfig.base.json');

      expect(baseConfig).toBeDefined();
      expect(baseConfig?.description).toBe('Base TypeScript configuration with shared settings');
      expect(baseConfig?.content).toContain('"compilerOptions"');
      expect(baseConfig?.content).toContain('"strict": true');
    });

    it('should generate testing configuration', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);
      const testConfig = results.find((r) => r.filename === 'tsconfig.test.json');

      expect(testConfig).toBeDefined();
      expect(testConfig?.description).toBe('TypeScript configuration for tests');
      expect(testConfig?.content).toContain('"extends": "./tsconfig.base.json"');
      expect(testConfig?.content).toContain('"noEmit": true');
    });

    it('should generate ESBuild configuration for library projects', () => {
      const config: ProjectConfig = {
        name: 'lib-project',
        qualityLevel: 'medium',
        projectType: 'library',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);
      const esbuildConfig = results.find((r) => r.filename === 'esbuild.config.mjs');

      expect(esbuildConfig).toBeDefined();
      expect(esbuildConfig?.description).toBe('ESBuild configuration for fast compilation');
      expect(esbuildConfig?.content).toContain("import { build } from 'esbuild'");
      expect(esbuildConfig?.content).toContain("entryPoints: ['src/index.ts']");
    });
  });

  describe('configuration validation', () => {
    it('should generate valid JSON for all configurations', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);

      for (const result of results) {
        if (result.filename.endsWith('.json')) {
          validateJsonContent(result.content);
        }
      }
    });

    it('should include required TypeScript fields', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);
      const mainConfig = results.find((r) => r.filename === 'tsconfig.json');

      expect(mainConfig).toBeDefined();
      const parsed = JSON.parse(mainConfig?.content ?? '{}');
      expect(parsed).toHaveProperty('compilerOptions');
      expect(parsed).toHaveProperty('include');
      expect(parsed).toHaveProperty('exclude');
    });
  });

  describe('createTypeScriptGenerator factory', () => {
    it('should create a new TypeScriptGenerator instance', () => {
      const generator = createTypeScriptGenerator();

      expect(generator).toBeInstanceOf(TypeScriptGenerator);
    });

    it('should create working generator', () => {
      const generator = createTypeScriptGenerator();
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);
      expect(results.length).toBeGreaterThan(0);
    });
  });
});
