/**
 * TypeScript Configuration Generator Tests
 *
 * Comprehensive tests for TypeScript configuration generation functionality
 */

import { describe, it, expect, beforeEach } from 'bun:test';
import type { ProjectConfig } from '../../../types/project-config.js';
import { TypeScriptConfigGenerator } from '../config/typescript-config-generator.js';

describe('TypeScriptConfigGenerator', () => {
  let generator: TypeScriptConfigGenerator;

  beforeEach(() => {
    generator = new TypeScriptConfigGenerator();
  });

  describe('generate method', () => {
    it('should generate valid JSON configuration', () => {
      // Given
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: [],
      };

      // When
      const result = generator.generate(config);

      // Then
      expect(() => JSON.parse(result)).not.toThrow();
      const parsed = JSON.parse(result);
      expect(parsed.compilerOptions).toBeDefined();
      expect(parsed.include).toBeDefined();
      expect(parsed.exclude).toBeDefined();
      expect(parsed['ts-node']).toBeDefined();
    });

    it('should generate configuration for all project types', () => {
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

        const result = generator.generate(config);
        expect(() => JSON.parse(result)).not.toThrow();

        const parsed = JSON.parse(result);
        expect(parsed.compilerOptions).toBeDefined();
        expect(parsed.include).toBeDefined();
        expect(parsed.exclude).toBeDefined();
      }
    });

    it('should generate configuration for all quality levels', () => {
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

        const result = generator.generate(config);
        expect(() => JSON.parse(result)).not.toThrow();

        const parsed = JSON.parse(result);
        expect(parsed.compilerOptions).toBeDefined();
        expect(parsed.compilerOptions.strict).toBe(true); // Should always be strict
      }
    });

    it('should ignore config parameter in current implementation', () => {
      // Given
      const config1: ProjectConfig = {
        name: 'project-1',
        qualityLevel: 'light',
        projectType: 'basic',
        aiAssistants: [],
      };

      const config2: ProjectConfig = {
        name: 'project-2',
        qualityLevel: 'high',
        projectType: 'web',
        aiAssistants: ['claude-code'],
      };

      // When
      const result1 = generator.generate(config1);
      const result2 = generator.generate(config2);

      // Then - Results should be identical since config is ignored
      expect(result1).toBe(result2);
    });
  });

  describe('compiler options generation', () => {
    it('should generate comprehensive compiler options', () => {
      // Given
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: [],
      };

      // When
      const result = generator.generate(config);
      const parsed = JSON.parse(result);

      // Then
      const compilerOptions = parsed.compilerOptions;

      // Target and module settings
      expect(compilerOptions.target).toBe('ES2022');
      expect(compilerOptions.module).toBe('ESNext');
      expect(compilerOptions.moduleResolution).toBe('node');

      // Interop settings
      expect(compilerOptions.allowSyntheticDefaultImports).toBe(true);
      expect(compilerOptions.esModuleInterop).toBe(true);

      // JavaScript compatibility
      expect(compilerOptions.allowJs).toBe(true);
      expect(compilerOptions.skipLibCheck).toBe(true);

      // Strict type checking
      expect(compilerOptions.strict).toBe(true);
      expect(compilerOptions.noUncheckedIndexedAccess).toBe(true);
      expect(compilerOptions.exactOptionalPropertyTypes).toBe(true);
      expect(compilerOptions.noImplicitReturns).toBe(true);
      expect(compilerOptions.noImplicitOverride).toBe(true);

      // Output settings
      expect(compilerOptions.noEmit).toBe(true);
      expect(compilerOptions.declaration).toBe(true);
      expect(compilerOptions.declarationMap).toBe(true);
      expect(compilerOptions.sourceMap).toBe(true);
      expect(compilerOptions.outDir).toBe('dist');
      expect(compilerOptions.rootDir).toBe('src');

      // Module settings
      expect(compilerOptions.isolatedModules).toBe(true);
      expect(compilerOptions.verbatimModuleSyntax).toBe(true);
      expect(compilerOptions.resolveJsonModule).toBe(true);

      // Code quality settings
      expect(compilerOptions.noFallthroughCasesInSwitch).toBe(true);
      expect(compilerOptions.forceConsistentCasingInFileNames).toBe(true);

      // Path settings
      expect(compilerOptions.baseUrl).toBe('.');
      expect(compilerOptions.paths).toBeDefined();
    });

    it('should generate path mappings', () => {
      // Given
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: [],
      };

      // When
      const result = generator.generate(config);
      const parsed = JSON.parse(result);

      // Then
      const paths = parsed.compilerOptions.paths;

      expect(paths['@/*']).toEqual(['src/*']);
      expect(paths['@/types/*']).toEqual(['src/types/*']);
      expect(paths['@/utils/*']).toEqual(['src/utils/*']);
      expect(paths['@/config/*']).toEqual(['src/config/*']);
      expect(paths['@/services/*']).toEqual(['src/services/*']);
    });
  });

  describe('include patterns generation', () => {
    it('should generate correct include patterns', () => {
      // Given
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: [],
      };

      // When
      const result = generator.generate(config);
      const parsed = JSON.parse(result);

      // Then
      const include = parsed.include;
      expect(include).toContain('src/**/*');
      expect(include).toContain('tests/**/*');
      expect(include).toHaveLength(2);
    });

    it('should include source and test directories', () => {
      // Given
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'high',
        projectType: 'web',
        aiAssistants: ['claude-code'],
      };

      // When
      const result = generator.generate(config);
      const parsed = JSON.parse(result);

      // Then
      const include = parsed.include;
      expect(include).toEqual(expect.arrayContaining(['src/**/*', 'tests/**/*']));
    });
  });

  describe('exclude patterns generation', () => {
    it('should generate correct exclude patterns', () => {
      // Given
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: [],
      };

      // When
      const result = generator.generate(config);
      const parsed = JSON.parse(result);

      // Then
      const exclude = parsed.exclude;
      expect(exclude).toContain('node_modules');
      expect(exclude).toContain('dist');
      expect(exclude).toContain('build');
      expect(exclude).toContain('coverage');
      expect(exclude).toHaveLength(4);
    });

    it('should exclude typical build and dependency directories', () => {
      // Given
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'strict',
        projectType: 'cli',
        aiAssistants: [],
      };

      // When
      const result = generator.generate(config);
      const parsed = JSON.parse(result);

      // Then
      const exclude = parsed.exclude;
      expect(exclude).toEqual(
        expect.arrayContaining(['node_modules', 'dist', 'build', 'coverage'])
      );
    });
  });

  describe('ts-node configuration generation', () => {
    it('should generate ts-node configuration', () => {
      // Given
      const config: ProjectConfig = {
        name: 'test-project',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: [],
      };

      // When
      const result = generator.generate(config);
      const parsed = JSON.parse(result);

      // Then
      const tsNode = parsed['ts-node'];
      expect(tsNode).toBeDefined();
      expect(tsNode.esm).toBe(true);
      expect(tsNode.experimentalSpecifierResolution).toBe('node');
    });

    it('should configure ts-node for ESM support', () => {
      // Given
      const config: ProjectConfig = {
        name: 'esm-project',
        qualityLevel: 'high',
        projectType: 'library',
        aiAssistants: [],
      };

      // When
      const result = generator.generate(config);
      const parsed = JSON.parse(result);

      // Then
      const tsNode = parsed['ts-node'];
      expect(tsNode.esm).toBe(true);
      expect(tsNode.experimentalSpecifierResolution).toBe('node');
    });
  });

  describe('JSON structure and formatting', () => {
    it('should generate properly formatted JSON', () => {
      // Given
      const config: ProjectConfig = {
        name: 'format-test',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: [],
      };

      // When
      const result = generator.generate(config);

      // Then
      // Should be valid JSON
      expect(() => JSON.parse(result)).not.toThrow();

      // Should have proper structure
      expect(result).toContain('"compilerOptions"');
      expect(result).toContain('"include"');
      expect(result).toContain('"exclude"');
      expect(result).toContain('"ts-node"');

      // Should have consistent formatting (the generator uses template literals)
      expect(result).toContain('\n'); // Should have line breaks for readability
    });

    it('should include all required top-level properties', () => {
      // Given
      const config: ProjectConfig = {
        name: 'complete-test',
        qualityLevel: 'high',
        projectType: 'web',
        aiAssistants: [],
      };

      // When
      const result = generator.generate(config);
      const parsed = JSON.parse(result);

      // Then
      expect(Object.keys(parsed)).toEqual(['compilerOptions', 'include', 'exclude', 'ts-node']);
    });

    it('should generate TypeScript configuration suitable for modern development', () => {
      // Given
      const config: ProjectConfig = {
        name: 'modern-project',
        qualityLevel: 'high',
        projectType: 'bun-express',
        aiAssistants: ['claude-code'],
      };

      // When
      const result = generator.generate(config);
      const parsed = JSON.parse(result);

      // Then
      const compilerOptions = parsed.compilerOptions;

      // Should support modern JavaScript features
      expect(['ES2022', 'ESNext', 'ES2020']).toContain(compilerOptions.target);
      expect(['ESNext', 'ES2022']).toContain(compilerOptions.module);

      // Should enable strict type checking
      expect(compilerOptions.strict).toBe(true);

      // Should support modern module resolution
      expect(compilerOptions.moduleResolution).toBe('node');
      expect(compilerOptions.isolatedModules).toBe(true);

      // Should support path aliases
      expect(compilerOptions.baseUrl).toBe('.');
      expect(Object.keys(compilerOptions.paths).length).toBeGreaterThan(0);
    });
  });

  describe('Configuration compatibility', () => {
    it('should generate configuration compatible with Node.js projects', () => {
      // Given
      const config: ProjectConfig = {
        name: 'node-project',
        qualityLevel: 'medium',
        projectType: 'cli',
        aiAssistants: [],
      };

      // When
      const result = generator.generate(config);
      const parsed = JSON.parse(result);

      // Then
      const compilerOptions = parsed.compilerOptions;

      // Node.js compatible settings
      expect(compilerOptions.moduleResolution).toBe('node');
      expect(compilerOptions.allowSyntheticDefaultImports).toBe(true);
      expect(compilerOptions.esModuleInterop).toBe(true);
      expect(compilerOptions.resolveJsonModule).toBe(true);

      // Should support CommonJS/ESM interop
      expect(compilerOptions.allowJs).toBe(true);
      expect(compilerOptions.skipLibCheck).toBe(true);
    });

    it('should generate configuration suitable for library development', () => {
      // Given
      const config: ProjectConfig = {
        name: 'library-project',
        qualityLevel: 'high',
        projectType: 'library',
        aiAssistants: [],
      };

      // When
      const result = generator.generate(config);
      const parsed = JSON.parse(result);

      // Then
      const compilerOptions = parsed.compilerOptions;

      // Library-friendly settings
      expect(compilerOptions.declaration).toBe(true);
      expect(compilerOptions.declarationMap).toBe(true);
      expect(compilerOptions.sourceMap).toBe(true);
      expect(compilerOptions.strict).toBe(true);

      // Should include test files
      expect(parsed.include).toContain('tests/**/*');

      // Should exclude build artifacts
      expect(parsed.exclude).toContain('dist');
      expect(parsed.exclude).toContain('build');
    });

    it('should generate configuration supporting TypeScript testing', () => {
      // Given
      const config: ProjectConfig = {
        name: 'tested-project',
        qualityLevel: 'strict',
        projectType: 'basic',
        aiAssistants: [],
      };

      // When
      const result = generator.generate(config);
      const parsed = JSON.parse(result);

      // Then
      // Should include test directories
      expect(parsed.include).toContain('tests/**/*');

      // Should have ts-node configuration for test runners
      expect(parsed['ts-node']).toBeDefined();
      expect(parsed['ts-node'].esm).toBe(true);

      // Should have strict settings for test reliability
      expect(parsed.compilerOptions.strict).toBe(true);
      expect(parsed.compilerOptions.noImplicitReturns).toBe(true);
      expect(parsed.compilerOptions.noFallthroughCasesInSwitch).toBe(true);
    });
  });

  describe('Edge cases and robustness', () => {
    it('should handle special characters in project name', () => {
      // Given
      const config: ProjectConfig = {
        name: 'special-project-@#$%',
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: [],
      };

      // When/Then
      expect(() => {
        const result = generator.generate(config);
        JSON.parse(result);
      }).not.toThrow();
    });

    it('should handle extremely long project names', () => {
      // Given
      const longName = 'a'.repeat(1000);
      const config: ProjectConfig = {
        name: longName,
        qualityLevel: 'medium',
        projectType: 'basic',
        aiAssistants: [],
      };

      // When/Then
      expect(() => {
        const result = generator.generate(config);
        JSON.parse(result);
      }).not.toThrow();
    });

    it('should handle missing optional config fields', () => {
      // Given
      const config: ProjectConfig = {
        name: 'minimal-project',
        qualityLevel: 'light',
        projectType: 'basic',
        aiAssistants: [],
        // All optional fields omitted
      };

      // When/Then
      expect(() => {
        const result = generator.generate(config);
        JSON.parse(result);
      }).not.toThrow();
    });

    it('should handle config with all optional fields', () => {
      // Given
      const config: ProjectConfig = {
        name: 'complete-project',
        description: 'A complete project with all fields',
        author: 'Test Author',
        license: 'MIT',
        qualityLevel: 'high',
        projectType: 'web',
        aiAssistants: ['claude-code', 'cursor'],
        version: '2.1.0',
        homepage: 'https://example.com',
        repository: 'https://github.com/example/repo',
        bugs: 'https://github.com/example/repo/issues',
        keywords: ['typescript', 'test', 'project'],
        theme: { primaryColor: '#blue' },
      };

      // When/Then
      expect(() => {
        const result = generator.generate(config);
        JSON.parse(result);
      }).not.toThrow();
    });
  });
});
