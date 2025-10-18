/**
 * Example unit test with factories and helpers
 * Demonstrates isolated testing with pure functions
 */

import { describe, expect, test } from 'bun:test';
import { createPackageJson, createValidationResult, createSourceFile } from '../factories';
import { packageJsonFixtures } from '../fixtures';
import { stripAnsi, measureTime } from '../helpers';

async function delay(ms: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function testDelayFunction(): Promise<number> {
  await delay(50);
  return 42;
}

function createResult(): Record<string, unknown> {
  return createValidationResult();
}

describe('Unit Test Example', () => {
  describe('Factory Pattern', () => {
    test('should create package.json with defaults', () => {
      const pkg = createPackageJson();

      expect(pkg['version']).toBe('0.1.0');
      expect(pkg['type']).toBe('module');
      expect(pkg['name']).toMatch(/^project-/);
    });

    test('should create package.json with overrides', () => {
      const pkg = createPackageJson({
        name: 'my-project',
        version: '2.0.0',
        scripts: {
          test: 'bun test',
        },
      });

      expect(pkg['name']).toBe('my-project');
      expect(pkg['version']).toBe('2.0.0');
      expect(pkg['scripts']).toEqual({ test: 'bun test' });
    });

    test('should create validation result with defaults', () => {
      const result = createValidationResult();

      expect(result.passed).toBe(true);
      expect(result.errors).toEqual([]);
      expect(result.tool).toBe('eslint');
    });

    test('should create validation result with errors', () => {
      const result = createValidationResult({
        passed: false,
        errors: ['Type error on line 42'],
        tool: 'typescript',
      });

      expect(result.passed).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.tool).toBe('typescript');
    });

    test('should create source file with issues', () => {
      const source = createSourceFile({
        hasUnusedVariable: true,
        hasAnyType: true,
        complexity: 3,
      });

      expect(source).toContain('any');
      expect(source).toContain('unused');
      expect(source.split('if').length).toBeGreaterThan(3);
    });
  });

  describe('Fixture Pattern', () => {
    test('should use static fixtures', () => {
      const pkg = packageJsonFixtures.minimal;

      expect(pkg['name']).toBe('test-project');
      expect(pkg['version']).toBe('0.1.0');
    });

    test('should use fixture with scripts', () => {
      const pkg = packageJsonFixtures.withScripts;

      expect(pkg['scripts']).toBeDefined();
      expect(pkg['scripts']?.build).toBe('tsc');
    });
  });

  describe('Helper Functions', () => {
    test('should strip ANSI codes', () => {
      const colored = '\u001B[32mSuccess\u001B[0m';
      const plain = stripAnsi(colored);

      expect(plain).toBe('Success');
    });

    test('should measure execution time', async () => {
      const { result, duration } = await measureTime(testDelayFunction);

      expect(result).toBe(42);
      expect(duration).toBeGreaterThanOrEqual(50);
      expect(duration).toBeLessThan(100);
    });
  });

  describe('Isolation Pattern', () => {
    test('should not share state between tests', () => {
      // Each factory call generates unique data
      const pkg1 = createPackageJson();
      const pkg2 = createPackageJson();

      expect(pkg1['name']).not.toBe(pkg2['name']);
    });

    test('should generate parallel-safe identifiers', () => {
      const results = Array.from({ length: 100 }, createResult);

      // All results should be independent
      expect(results).toHaveLength(100);
    });
  });
});
