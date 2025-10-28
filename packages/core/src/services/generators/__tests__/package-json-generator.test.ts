/**
 * Package.json Generator Tests
 *
 * Comprehensive tests for package.json generation functionality
 */

import { describe, it, expect, beforeEach } from 'bun:test';
import type { ProjectConfig } from '../../../types/project-config.js';
import { PackageJsonGenerator } from '../config/package-json-generator.js';

describe('PackageJsonGenerator', () => {
  let generator: PackageJsonGenerator;

  beforeEach(() => {
    generator = new PackageJsonGenerator();
  });

  describe('generate method', () => {
    it('should generate valid JSON for basic project', () => {
      // Given
      const config: ProjectConfig = {
        name: 'test-project',
        description: 'Test project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: [],
        version: '1.0.0',
        author: 'Test Author',
        license: 'MIT',
      };

      // When
      const result = generator.generate(config);

      // Then
      expect(() => JSON.parse(result)).not.toThrow();
      const parsed = JSON.parse(result);
      expect(parsed.name).toBe(config.name);
      expect(parsed.version).toBe(config.version);
      expect(parsed.description).toBe(config.description);
      expect(parsed.author).toBe(config.author);
      expect(parsed.license).toBe(config.license);
    });

    it('should use default values when optional fields are missing', () => {
      // Given
      const config: ProjectConfig = {
        name: 'minimal-project',
        qualityLevel: 'light',
        projectType: 'basic',
        aiAssistants: [],
      };

      // When
      const result = generator.generate(config);
      const parsed = JSON.parse(result);

      // Then
      expect(parsed.version).toBe('1.0.0');
      expect(parsed.description).toBe('minimal-project project');
      expect(parsed.author).toBe('');
      expect(parsed.license).toBe('MIT');
    });

    it('should set correct main field for CLI projects', () => {
      // Given
      const cliConfig: ProjectConfig = {
        name: 'cli-tool',
        qualityLevel: 'medium',
        projectType: 'cli',
        aiAssistants: [],
      };

      // When
      const result = generator.generate(cliConfig);
      const parsed = JSON.parse(result);

      // Then
      expect(parsed.main).toBe('dist/index.js');
      expect(parsed.bin).toBeDefined();
      expect(parsed.bin[cliConfig.name]).toBe('dist/index.js');
    });

    it('should set correct main field for non-CLI projects', () => {
      // Given
      const basicConfig: ProjectConfig = {
        name: 'basic-lib',
        qualityLevel: 'medium',
        projectType: 'library',
        aiAssistants: [],
      };

      // When
      const result = generator.generate(basicConfig);
      const parsed = JSON.parse(result);

      // Then
      expect(parsed.main).toBe('src/index.ts');
      expect(parsed.bin).toBeUndefined();
    });

    it('should include engines field with minimum versions', () => {
      // Given
      const config: ProjectConfig = {
        name: 'engines-test',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: [],
      };

      // When
      const result = generator.generate(config);
      const parsed = JSON.parse(result);

      // Then
      expect(parsed.engines.node).toBe('>=18.0.0');
      expect(parsed.engines.npm).toBe('>=8.0.0');
    });

    it('should set type to module', () => {
      // Given
      const config: ProjectConfig = {
        name: 'esm-project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: [],
      };

      // When
      const result = generator.generate(config);
      const parsed = JSON.parse(result);

      // Then
      expect(parsed.type).toBe('module');
    });
  });

  describe('script generation', () => {
    it('should generate base scripts for basic project', () => {
      // Given
      const config: ProjectConfig = {
        name: 'basic-scripts',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: [],
      };

      // When
      const result = generator.generate(config);
      const parsed = JSON.parse(result);

      // Then
      expect(parsed.scripts.build).toBe('tsc');
      expect(parsed.scripts.dev).toBe('tsx watch src/index.ts');
      expect(parsed.scripts.test).toBe('vitest');
      expect(parsed.scripts['test:coverage']).toBe('vitest --coverage');
      expect(parsed.scripts['test:ui']).toBe('vitest --ui');
      expect(parsed.scripts.lint).toBe('eslint src/**/*.ts');
      expect(parsed.scripts['lint:fix']).toBe('eslint src/**/*.ts --fix');
      expect(parsed.scripts['type-check']).toBe('tsc --noEmit');
      expect(parsed.scripts.clean).toBe('rimraf dist');
      expect(parsed.scripts.prebuild).toBe('npm run clean');
    });

    it('should include CLI-specific scripts for CLI projects', () => {
      // Given
      const cliConfig: ProjectConfig = {
        name: 'cli-tool',
        qualityLevel: 'medium',
        projectType: 'cli',
        aiAssistants: [],
      };

      // When
      const result = generator.generate(cliConfig);
      const parsed = JSON.parse(result);

      // Then
      expect(parsed.scripts.start).toBe('node dist/index.js');
      expect(parsed.scripts['dev:cli']).toBe('tsx src/index.ts');
      expect(parsed.scripts.prepack).toBe('npm run build');
      // Should also include base scripts
      expect(parsed.scripts.build).toBe('tsc');
      expect(parsed.scripts.test).toBe('vitest');
    });

    it('should include web-specific scripts for web projects', () => {
      // Given
      const webConfig: ProjectConfig = {
        name: 'web-app',
        qualityLevel: 'medium',
        projectType: 'web',
        aiAssistants: [],
      };

      // When
      const result = generator.generate(webConfig);
      const parsed = JSON.parse(result);

      // Then
      expect(parsed.scripts.dev).toBe('vite');
      expect(parsed.scripts.build).toBe('tsc && vite build');
      expect(parsed.scripts.preview).toBe('vite preview');
      expect(parsed.scripts['dev:server']).toBe('vite --port 3000');
      // Should not include base scripts that conflict
      expect(parsed.scripts['dev:cli']).toBeUndefined();
      expect(parsed.scripts.start).toBeUndefined();
    });

    it('should override base scripts appropriately for web projects', () => {
      // Given
      const webConfig: ProjectConfig = {
        name: 'web-override',
        qualityLevel: 'medium',
        projectType: 'web',
        aiAssistants: [],
      };

      // When
      const result = generator.generate(webConfig);
      const parsed = JSON.parse(result);

      // Then
      // Web-specific dev should override base dev
      expect(parsed.scripts.dev).toBe('vite');
      // Web-specific build should override base build
      expect(parsed.scripts.build).toBe('tsc && vite build');
      // Should keep other base scripts
      expect(parsed.scripts.test).toBe('vitest');
      expect(parsed.scripts.lint).toBe('eslint src/**/*.ts');
    });
  });

  describe('dependency generation', () => {
    it('should generate CLI dependencies for CLI projects', () => {
      // Given
      const cliConfig: ProjectConfig = {
        name: 'cli-deps',
        qualityLevel: 'medium',
        projectType: 'cli',
        aiAssistants: [],
      };

      // When
      const result = generator.generate(cliConfig);
      const parsed = JSON.parse(result);

      // Then
      expect(parsed.dependencies.commander).toBe('^11.0.0');
      expect(parsed.dependencies.chalk).toBe('^5.3.0');
    });

    it('should generate web dependencies for web projects', () => {
      // Given
      const webConfig: ProjectConfig = {
        name: 'web-deps',
        qualityLevel: 'medium',
        projectType: 'web',
        aiAssistants: [],
      };

      // When
      const result = generator.generate(webConfig);
      const parsed = JSON.parse(result);

      // Then
      expect(parsed.dependencies.react).toBe('^18.2.0');
      expect(parsed.dependencies['react-dom']).toBe('^18.2.0');
      expect(parsed.dependencies['react-router-dom']).toBe('^6.8.0');
    });

    it('should have no runtime dependencies for basic project', () => {
      // Given
      const basicConfig: ProjectConfig = {
        name: 'basic-no-deps',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: [],
      };

      // When
      const result = generator.generate(basicConfig);
      const parsed = JSON.parse(result);

      // Then
      expect(Object.keys(parsed.dependencies)).toHaveLength(0);
    });

    it('should generate CLI devDependencies for CLI projects', () => {
      // Given
      const cliConfig: ProjectConfig = {
        name: 'cli-dev-deps',
        qualityLevel: 'medium',
        projectType: 'cli',
        aiAssistants: [],
      };

      // When
      const result = generator.generate(cliConfig);
      const parsed = JSON.parse(result);

      // Then
      expect(parsed.devDependencies['@types/commander']).toBe('^2.12.2');
      // Should include base devDependencies
      expect(parsed.devDependencies.typescript).toBe('^5.0.0');
      expect(parsed.devDependencies.vitest).toBe('^1.0.0');
    });

    it('should generate web devDependencies for web projects', () => {
      // Given
      const webConfig: ProjectConfig = {
        name: 'web-dev-deps',
        qualityLevel: 'medium',
        projectType: 'web',
        aiAssistants: [],
      };

      // When
      const result = generator.generate(webConfig);
      const parsed = JSON.parse(result);

      // Then
      expect(parsed.devDependencies.vite).toBe('^5.0.0');
      expect(parsed.devDependencies['@vitejs/plugin-react']).toBe('^4.0.0');
      expect(parsed.devDependencies['@types/react']).toBe('^18.2.0');
      expect(parsed.devDependencies['@types/react-dom']).toBe('^18.2.0');
      // Should include base devDependencies
      expect(parsed.devDependencies.typescript).toBe('^5.0.0');
      expect(parsed.devDependencies.vitest).toBe('^1.0.0');
    });

    it('should generate base devDependencies for all project types', () => {
      // Given
      const config: ProjectConfig = {
        name: 'base-deps',
        qualityLevel: 'medium',
        projectType: 'library',
        aiAssistants: [],
      };

      // When
      const result = generator.generate(config);
      const parsed = JSON.parse(result);

      // Then
      expect(parsed.devDependencies['@types/node']).toBe('^20.0.0');
      expect(parsed.devDependencies.typescript).toBe('^5.0.0');
      expect(parsed.devDependencies.tsx).toBe('^4.0.0');
      expect(parsed.devDependencies.eslint).toBe('^8.40.0');
      expect(parsed.devDependencies['@typescript-eslint/eslint-plugin']).toBe('^6.0.0');
      expect(parsed.devDependencies['@typescript-eslint/parser']).toBe('^6.0.0');
      expect(parsed.devDependencies.rimraf).toBe('^5.0.0');
      expect(parsed.devDependencies.vitest).toBe('^1.0.0');
      expect(parsed.devDependencies['@vitest/coverage-v8']).toBe('^1.0.0');
      expect(parsed.devDependencies['@vitest/ui']).toBe('^1.0.0');
    });
  });

  describe('edge cases and error handling', () => {
    it('should handle project names with special characters', () => {
      // Given
      const specialConfig: ProjectConfig = {
        name: 'my-special_project@123',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: [],
      };

      // When
      const result = generator.generate(specialConfig);
      const parsed = JSON.parse(result);

      // Then
      expect(parsed.name).toBe(specialConfig.name);
      expect(parsed.description).toBe(`${specialConfig.name} project`);
    });

    it('should handle empty description gracefully', () => {
      // Given
      const config: ProjectConfig = {
        name: 'no-desc',
        description: '',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: [],
      };

      // When
      const result = generator.generate(config);
      const parsed = JSON.parse(result);

      // Then
      expect(parsed.description).toBe('no-desc project');
    });

    it('should handle all project types without errors', () => {
      // Given
      const projectTypes: Array<ProjectConfig['projectType']> = [
        'basic',
        'web',
        'cli',
        'library',
        'bun-react',
        'bun-vue',
        'bun-express',
        'bun-typescript',
      ];

      // When/Then
      for (const projectType of projectTypes) {
        const config: ProjectConfig = {
          name: `test-${projectType}`,
          qualityLevel: 'medium',
          projectType,
          aiAssistants: [],
        };

        expect(() => {
          const result = generator.generate(config);
          JSON.parse(result); // Verify valid JSON
        }).not.toThrow();
      }
    });

    it('should handle all quality levels without errors', () => {
      // Given
      const qualityLevels: Array<ProjectConfig['qualityLevel']> = [
        'light',
        'medium',
        'strict',
        'high',
      ];

      // When/Then
      for (const qualityLevel of qualityLevels) {
        const config: ProjectConfig = {
          name: `test-${qualityLevel}`,
          qualityLevel,
          projectType: 'basic',
          aiAssistants: [],
        };

        expect(() => {
          const result = generator.generate(config);
          JSON.parse(result); // Verify valid JSON
        }).not.toThrow();
      }
    });

    it('should handle custom license types', () => {
      // Given
      const config: ProjectConfig = {
        name: 'custom-license',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: [],
        license: 'Custom-Proprietary-1.0',
      };

      // When
      const result = generator.generate(config);
      const parsed = JSON.parse(result);

      // Then
      expect(parsed.license).toBe('Custom-Proprietary-1.0');
    });

    it('should handle bun-specific project types', () => {
      // Given
      const bunConfig: ProjectConfig = {
        name: 'bun-project',
        qualityLevel: 'medium',
        projectType: 'bun-react',
        aiAssistants: [],
      };

      // When
      const result = generator.generate(bunConfig);
      const parsed = JSON.parse(result);

      // Then
      expect(parsed.name).toBe('bun-project');
      expect(parsed.main).toBe('src/index.ts'); // Not CLI, so should use main
      expect(parsed.bin).toBeUndefined();
      expect(parsed.dependencies).toBeDefined();
    });
  });

  describe('output format', () => {
    it('should produce properly formatted JSON with correct indentation', () => {
      // Given
      const config: ProjectConfig = {
        name: 'formatted',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: [],
      };

      // When
      const result = generator.generate(config);

      // Then
      // Should contain newlines and proper indentation
      expect(result).toContain('\n');
      expect(result).toContain('  '); // Two-space indentation
      // Should be parseable
      expect(() => JSON.parse(result)).not.toThrow();
    });

    it('should include all required fields in output', () => {
      // Given
      const config: ProjectConfig = {
        name: 'complete',
        description: 'Complete test project',
        author: 'Test Author',
        license: 'MIT',
        qualityLevel: 'high',
        projectType: 'cli',
        aiAssistants: ['claude-code'],
        version: '2.1.0',
      };

      // When
      const result = generator.generate(config);
      const parsed = JSON.parse(result);

      // Then
      expect(parsed.name).toBeDefined();
      expect(parsed.version).toBeDefined();
      expect(parsed.description).toBeDefined();
      expect(parsed.main).toBeDefined();
      expect(parsed.type).toBeDefined();
      expect(parsed.scripts).toBeDefined();
      expect(parsed.keywords).toBeDefined();
      expect(parsed.author).toBeDefined();
      expect(parsed.license).toBeDefined();
      expect(parsed.engines).toBeDefined();
      expect(parsed.devDependencies).toBeDefined();
      expect(parsed.dependencies).toBeDefined();
      expect(parsed.bin).toBeDefined();
    });
  });

  describe('integration scenarios', () => {
    it('should handle complex CLI project with all fields', () => {
      // Given
      const complexConfig: ProjectConfig = {
        name: 'complex-cli',
        description: 'A complex CLI tool with many features',
        author: 'Complex Author <complex@example.com>',
        license: 'Apache-2.0',
        qualityLevel: 'high',
        projectType: 'cli',
        aiAssistants: ['claude-code', 'cursor'],
        version: '3.2.1',
        homepage: 'https://github.com/example/complex-cli',
        repository: 'https://github.com/example/complex-cli.git',
        bugs: 'https://github.com/example/complex-cli/issues',
        keywords: ['cli', 'tool', 'automation'],
      };

      // When
      const result = generator.generate(complexConfig);
      const parsed = JSON.parse(result);

      // Then
      expect(parsed.name).toBe('complex-cli');
      expect(parsed.version).toBe('3.2.1');
      expect(parsed.main).toBe('dist/index.js');
      expect(parsed.bin['complex-cli']).toBe('dist/index.js');
      expect(parsed.scripts.start).toBe('node dist/index.js');
      expect(parsed.dependencies.commander).toBeDefined();
      expect(parsed.devDependencies['@types/commander']).toBeDefined();
      expect(parsed.engines.node).toBe('>=18.0.0');
    });

    it('should handle React web project configuration', () => {
      // Given
      const reactConfig: ProjectConfig = {
        name: 'react-web-app',
        description: 'Modern React web application',
        qualityLevel: 'strict',
        projectType: 'web',
        aiAssistants: ['github-copilot'],
        version: '1.0.0',
      };

      // When
      const result = generator.generate(reactConfig);
      const parsed = JSON.parse(result);

      // Then
      expect(parsed.main).toBe('src/index.ts');
      expect(parsed.dependencies.react).toBe('^18.2.0');
      expect(parsed.dependencies['react-dom']).toBe('^18.2.0');
      expect(parsed.dependencies['react-router-dom']).toBe('^6.8.0');
      expect(parsed.devDependencies.vite).toBe('^5.0.0');
      expect(parsed.devDependencies['@vitejs/plugin-react']).toBe('^4.0.0');
      expect(parsed.scripts.dev).toBe('vite');
      expect(parsed.scripts.build).toBe('tsc && vite build');
      expect(parsed.scripts.preview).toBe('vite preview');
    });

    it('should handle library project with minimal dependencies', () => {
      // Given
      const libraryConfig: ProjectConfig = {
        name: 'utility-library',
        description: 'A lightweight utility library',
        qualityLevel: 'medium',
        projectType: 'library',
        aiAssistants: [],
        version: '0.1.0',
      };

      // When
      const result = generator.generate(libraryConfig);
      const parsed = JSON.parse(result);

      // Then
      expect(parsed.main).toBe('src/index.ts');
      expect(parsed.bin).toBeUndefined();
      expect(Object.keys(parsed.dependencies)).toHaveLength(0);
      expect(parsed.devDependencies.typescript).toBeDefined();
      expect(parsed.devDependencies.vitest).toBeDefined();
      expect(parsed.scripts.build).toBe('tsc');
      expect(parsed.scripts.test).toBe('vitest');
    });
  });
});
