/**
 * Path Security Validation Tests
 *
 * Security tests for Story 1.4 - Path traversal and injection protection
 */

import { describe, it, expect, beforeEach } from 'bun:test';
import type { ProjectConfig } from '../../../types/project-config.js';
import { DirectoryStructureGenerator } from '../directory-structure-generator.js';

describe('Path Security Validation - Story 1.4', () => {
  let generator: DirectoryStructureGenerator;
  let basicConfig: ProjectConfig;

  beforeEach(() => {
    generator = new DirectoryStructureGenerator();
    basicConfig = {
      name: 'test-project',
      description: 'Test project for security validation',
      qualityLevel: 'medium',
      projectType: 'basic',
      aiAssistants: [],
      template: 'basic',
      author: 'Test Author',
      license: 'MIT',
      version: '1.0.0',
    };
  });

  describe('P0 - Critical Path Traversal Protection', () => {
    it('should allow valid relative paths', () => {
      // When & Then - Should not throw
      expect(() => generator.generate(basicConfig)).not.toThrow();
      const result = generator.generate(basicConfig);
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it('1.4-SEC-003: P0 - should block path traversal using resolve and relative', () => {
      // Given
      // Using relative path for security - avoids publicly writable directories
      const basePath = './test-temp';
      const maliciousPath = '../../../etc/passwd';

      // When & Then
      expect(() => {
        generator['validatePath'](basePath, maliciousPath);
      }).toThrow(/Path traversal detected.*contains dangerous pattern/);
    });
  });

  describe('P1 - Special Character and Injection Protection', () => {
    it('1.4-SEC-007: P1 - should block line break injection', () => {
      // Given
      // Using relative path for security - avoids publicly writable directories
      const basePath = './test-temp';
      const maliciousPath = 'file\n.txt';

      // When & Then
      expect(() => {
        generator['validatePath'](basePath, maliciousPath);
      }).toThrow(/contains null bytes or line breaks/);
    });
  });

  describe('P2 - Complex Attack Patterns', () => {
    it('1.4-SEC-016: P2 - should block double-slash and dot abuse', () => {
      // Given
      // Using relative path for security - avoids publicly writable directories
      const basePath = './test-temp';
      const maliciousPath = '....//....//etc';

      // When & Then
      expect(() => {
        generator['validatePath'](basePath, maliciousPath);
      }).toThrow();
    });
  });

  describe('P2 - File Creation Security', () => {
    it('1.4-SEC-019: P2 - should validate paths in CLI executable creation', () => {
      // Given
      // Using relative path for security - avoids publicly writable directories
      const basePath = './test-temp';
      const maliciousPath = '../../../bin/malicious-cli';

      // When & Then
      expect(() => {
        generator['validatePath'](basePath, maliciousPath);
      }).toThrow();
    });

    it('1.4-SEC-020: P2 - should validate paths in main entry point creation', () => {
      // Given
      // Using relative path for security - avoids publicly writable directories
      const basePath = './test-temp';
      const maliciousPath = '../../../tmp/index.ts';

      // When & Then
      expect(() => {
        generator['validatePath'](basePath, maliciousPath);
      }).toThrow();
    });
  });

  describe('P3 - Legitimate Operations Should Pass', () => {
    it('1.4-SEC-021: P3 - should allow valid relative paths', () => {
      // Given
      // Using relative path for security - avoids publicly writable directories
      const basePath = './test-temp';
      const validPaths = [
        'src',
        'src/index.ts',
        'tests/unit',
        'bin/cli-name',
        '.config/file.json',
        'nested/deep/structure/path',
      ];

      // When & Then - Should not throw for any valid paths
      for (const path of validPaths) {
        expect(() => {
          generator['validatePath'](basePath, path);
        }).not.toThrow();
      }
    });

    it('1.4-SEC-022: P3 - should allow normal file names', () => {
      // Given
      // Using relative path for security - avoids publicly writable directories
      const basePath = './test-temp';
      const validPaths = ['README.md', '.gitignore', 'package.json'];

      // When & Then - Should not throw
      for (const path of validPaths) {
        expect(() => {
          generator['validatePath'](basePath, path);
        }).not.toThrow();
      }
    });

    it('1.4-SEC-023: P3 - should allow CLI operations with valid paths', () => {
      // Given
      // Using relative path for security - avoids publicly writable directories
      const basePath = './test-temp';
      const validPath = 'bin/my-cli';

      // When & Then - Should not throw
      expect(() => {
        generator['validatePath'](basePath, validPath);
      }).not.toThrow();
    });
  });
});
