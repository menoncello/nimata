/**
 * Unit tests for Vitest Generator
 */

import { describe, it, expect, beforeEach } from 'bun:test';
import { VitestGenerator, createVitestGenerator } from '../src/generators/vitest-generator';

// Inline type to avoid import issues
interface ProjectConfig {
  name: string;
  description?: string;
  qualityLevel: 'light' | 'medium' | 'strict';
  projectType: 'basic' | 'web' | 'cli' | 'library';
  aiAssistants: Array<'claude-code' | 'copilot'>;
}

describe('VitestGenerator', () => {
  let generator: VitestGenerator;

  beforeEach(() => {
    generator = createVitestGenerator();
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

      expect(results).toHaveLength(2); // main, setup
      expect(results[0].filename).toBe('vitest.config.ts');
      expect(results[1].filename).toBe('tests/setup.ts');
    });

    it('should generate more configurations for web project', () => {
      const config: ProjectConfig = {
        name: 'web-project',
        description: 'Web project',
        qualityLevel: 'medium',
        projectType: 'web',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);

      expect(results).toHaveLength(3); // main, workspace, setup

      const filenames = results.map((r) => r.filename);
      expect(filenames).toContain('vitest.config.ts');
      expect(filenames).toContain('vitest.workspace.ts');
      expect(filenames).toContain('tests/setup.ts');
    });

    it('should generate configurations for CLI project with strict quality', () => {
      const config: ProjectConfig = {
        name: 'cli-project',
        qualityLevel: 'strict',
        projectType: 'cli',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);

      expect(results).toHaveLength(2);

      const mainConfig = results[0];
      expect(mainConfig.content).toContain('branches: 95');
      expect(mainConfig.content).toContain('testTimeout: 2000');
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

      const filenames = results.map((r) => r.filename);
      expect(filenames).toContain('vitest.config.ts');
      expect(filenames).toContain('vitest.workspace.ts');
      expect(filenames).toContain('tests/setup.ts');
    });
  });

  describe('configuration content', () => {
    it('should include proper imports and exports', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);
      const mainConfig = results[0];

      expect(mainConfig.content).toContain("import { defineConfig } from 'vitest/config'");
      expect(mainConfig.content).toContain('export default defineConfig');
    });

    it('should include TypeScript configuration', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);
      const mainConfig = results[0];

      expect(mainConfig.content).toContain("import tsconfigPaths from 'vite-tsconfig-paths'");
      expect(mainConfig.content).toContain('plugins: [tsconfigPaths()]');
    });

    it('should include test environment settings', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);
      const mainConfig = results[0];

      expect(mainConfig.content).toContain("environment: 'node'");
      expect(mainConfig.content).toContain('globals: true');
      expect(mainConfig.content).toContain("setupFiles: ['./tests/setup.ts']");
    });

    it('should include setup file content', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);
      const setupConfig = results[1];

      expect(setupConfig.content).toContain(
        "import { expect, beforeAll, afterAll, beforeEach, afterEach } from 'vitest'"
      );
      expect(setupConfig.content).toContain('expect.extend');
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

      expect(mainConfig.content).toContain('branches: 70');
      expect(mainConfig.content).toContain('testTimeout: 5000');
      expect(mainConfig.content).toContain("reporter: ['basic']");
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

      expect(mainConfig.content).toContain('branches: 85');
      expect(mainConfig.content).toContain('testTimeout: 3000');
      expect(mainConfig.content).toContain("reporter: ['verbose', 'json']");
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

      expect(mainConfig.content).toContain('branches: 95');
      expect(mainConfig.content).toContain('testTimeout: 2000');
      expect(mainConfig.content).toContain("reporter: ['verbose', 'json', 'html']");
    });

    it('should include comprehensive mocking for strict quality', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'strict',
        projectType: 'basic',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);
      const setupConfig = results.find((r) => r.filename === 'tests/setup.ts');

      expect(setupConfig).toBeDefined();
      if (setupConfig) {
        expect(setupConfig.content).toContain("vi.spyOn(console, 'log')");
        expect(setupConfig.content).toContain("vi.spyOn(console, 'warn')");
        expect(setupConfig.content).toContain("vi.spyOn(console, 'error')");
      }
    });
  });

  describe('project type specific configurations', () => {
    it('should include browser environment for web projects', () => {
      const config: ProjectConfig = {
        name: 'web-project',
        qualityLevel: 'medium',
        projectType: 'web',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);
      const mainConfig = results[0];

      expect(mainConfig.content).toContain("environment: 'jsdom'");
    });

    it('should include UI for web projects', () => {
      const config: ProjectConfig = {
        name: 'web-project',
        qualityLevel: 'medium',
        projectType: 'web',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);
      const mainConfig = results[0];

      expect(mainConfig.content).toContain('ui: true');
    });

    it('should include Node environment for CLI projects', () => {
      const config: ProjectConfig = {
        name: 'cli-project',
        qualityLevel: 'medium',
        projectType: 'cli',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);
      const mainConfig = results[0];

      expect(mainConfig.content).toContain("environment: 'node'");
    });

    it('should include DOM setup for web projects', () => {
      const config: ProjectConfig = {
        name: 'web-project',
        qualityLevel: 'medium',
        projectType: 'web',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);
      const setupConfig = results.find((r) => r.filename === 'tests/setup.ts');

      expect(setupConfig).toBeDefined();
      if (setupConfig) {
        expect(setupConfig.content).toContain("import { JSDOM } from 'jsdom'");
        expect(setupConfig.content).toContain('global.window = dom.window');
        expect(setupConfig.content).toContain('global.document = dom.window.document');
      }
    });

    it('should include workspace configuration for library projects', () => {
      const config: ProjectConfig = {
        name: 'lib-project',
        qualityLevel: 'medium',
        projectType: 'library',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);
      const workspaceConfig = results.find((r) => r.filename === 'vitest.workspace.ts');

      expect(workspaceConfig).toBeDefined();
      if (workspaceConfig) {
        expect(workspaceConfig.content).toContain(
          "import { defineWorkspace } from 'vitest/config'"
        );
        expect(workspaceConfig.content).toContain('unit');
        expect(workspaceConfig.content).toContain('integration');
      }
    });
  });

  describe('coverage configuration', () => {
    it('should include coverage settings when enabled', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);
      const mainConfig = results[0];

      expect(mainConfig.content).toContain('coverage: {');
      expect(mainConfig.content).toContain("provider: 'v8'");
      expect(mainConfig.content).toContain("reporter: ['text', 'json', 'html']");
    });

    it('should include proper coverage thresholds', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);
      const mainConfig = results[0];

      expect(mainConfig.content).toContain('branches: 85');
      expect(mainConfig.content).toContain('functions: 85');
      expect(mainConfig.content).toContain('lines: 85');
      expect(mainConfig.content).toContain('statements: 85');
    });

    it('should include coverage exclusions', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);
      const mainConfig = results[0];

      expect(mainConfig.content).toContain('node_modules/');
      expect(mainConfig.content).toContain('tests/');
      expect(mainConfig.content).toContain('**/*.d.ts');
    });
  });

  describe('createVitestGenerator factory', () => {
    it('should create a new VitestGenerator instance', () => {
      const generator = createVitestGenerator();

      expect(generator).toBeInstanceOf(VitestGenerator);
    });

    it('should create working generator', () => {
      const generator = createVitestGenerator();
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

  describe('configuration validation', () => {
    it('should include required Vitest fields', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);
      const mainConfig = results[0];

      expect(mainConfig.content).toContain('globals: true');
      expect(mainConfig.content).toContain('environment:');
      expect(mainConfig.content).toContain('setupFiles:');
      expect(mainConfig.content).toContain('include:');
      expect(mainConfig.content).toContain('exclude:');
    });

    it('should include proper test match patterns', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: ['claude-code'],
      };

      const results = generator.generate(config);
      const mainConfig = results[0];

      expect(mainConfig.content).toContain('**/*.test.ts');
      expect(mainConfig.content).toContain('**/*.spec.ts');
    });
  });
});
