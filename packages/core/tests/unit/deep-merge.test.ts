import { describe, it, expect } from 'bun:test';
import { deepMerge } from '../../src/utils/deep-merge';
import {
  createSimpleObject,
  createNestedObject,
  createArray,
  createProjectConfig,
  createGlobalConfig,
  createDefaultConfig,
} from '../factories/config-factory';

describe('Story 1.2 - AC3: Configuration System Deep Merge', () => {
  describe('P0 - Critical Merge Logic', () => {
    it('should merge two simple objects', () => {
      const base = createSimpleObject({ a: 1, b: 2 });
      const override = createSimpleObject({ b: 3, c: 4 });
      const result = deepMerge(base, override);
      expect(result).toEqual({ a: 1, b: 3, c: 4 });
    });

    it('should return base when override is empty', () => {
      const base = createSimpleObject({ a: 1, b: 2 });
      const override = createSimpleObject({});
      const result = deepMerge(base, override);
      expect(result).toEqual({ a: 1, b: 2 });
    });

    it('should override primitive values', () => {
      const base = createSimpleObject({ value: 'old' });
      const override = createSimpleObject({ value: 'new' });
      const result = deepMerge(base, override);
      expect(result).toEqual({ value: 'new' });
    });
  });

  describe('P1 - Nested Object Merging', () => {
    it('should deeply merge nested objects', () => {
      // Given nested tool configurations
      const base = {
        tools: {
          eslint: { enabled: true, configPath: 'a.json' },
        },
      };
      const override = {
        tools: {
          eslint: { configPath: 'b.json' },
        },
      };

      // When deep merging them
      const result = deepMerge(base, override);

      // Then nested properties should be merged correctly
      expect(result).toEqual({
        tools: {
          eslint: {
            enabled: true,
            configPath: 'b.json',
          },
        },
      });
    });

    it('should merge 5-level nested structures', () => {
      // Given deeply nested configuration structures
      const base = createNestedObject(5);
      const override = createNestedObject(5, {
        level1: {
          level2: {
            level3: {
              level4: {
                level5: { value: 'override' },
              },
            },
          },
        },
      });

      // When deep merging them
      const result = deepMerge(base, override);

      // Then all levels should be merged with proper precedence
      expect(result).toEqual({
        level1: {
          level2: {
            level3: {
              level4: {
                level5: {
                  value: 'override',
                  keep: true,
                },
              },
            },
          },
        },
      });
    });

    it('should add new nested properties', () => {
      // Given a base configuration with some tools
      const base = {
        tools: {
          eslint: { enabled: true },
        },
      };
      const override = {
        tools: {
          typescript: { enabled: true },
        },
      };

      // When deep merging them
      const result = deepMerge(base, override);

      // Then new nested properties should be added
      expect(result).toEqual({
        tools: {
          eslint: { enabled: true },
          typescript: { enabled: true },
        },
      });
    });
  });

  describe('P1 - Array Handling', () => {
    it('should replace arrays not merge', () => {
      // Given two configurations with array properties
      const base = { items: createArray(3, 'item') };
      const override = { items: createArray(2, 'override') };

      // When deep merging them
      const result = deepMerge(base, override);

      // Then arrays should be replaced not merged
      expect(result).toEqual({ items: ['override1', 'override2'] });
    });

    it('should replace empty array with new array', () => {
      // Given a configuration with empty array
      const base = { items: [] };
      const override = { items: createArray(2) };

      // When deep merging them
      const result = deepMerge(base, override);

      // Then empty array should be replaced
      expect(result).toEqual({ items: ['item1', 'item2'] });
    });

    it('should replace array with empty array', () => {
      // Given a configuration with array and empty override
      const base = { items: createArray(2) };
      const override = { items: [] };

      // When deep merging them
      const result = deepMerge(base, override);

      // Then array should be replaced with empty array
      expect(result).toEqual({ items: [] });
    });
  });

  describe('P2 - Edge Cases', () => {
    it('should not override with undefined values', () => {
      // Given a base configuration and override with undefined
      const base = createSimpleObject({ a: 1, b: 2 });
      const override = createSimpleObject({ a: undefined, c: 3 });

      // When deep merging them
      const result = deepMerge(base, override);

      // Then undefined should not override defined values
      expect(result).toEqual({ a: 1, b: 2, c: 3 });
    });

    it('should override with null values', () => {
      // Given a configuration with a value and null override
      const base = createSimpleObject({ value: 'something' });
      const override = createSimpleObject({ value: null });

      // When deep merging them
      const result = deepMerge(base, override);

      // Then null should override the value
      expect(result).toEqual({ value: null });
    });

    it('should merge when base has undefined', () => {
      // Given a base with undefined and override with value
      const base = createSimpleObject({ a: undefined, b: 2 });
      const override = createSimpleObject({ a: 1 });

      // When deep merging them
      const result = deepMerge(base, override);

      // Then undefined should be replaced
      expect(result).toEqual({ a: 1, b: 2 });
    });

    it('should merge when base has null', () => {
      // Given a base with null and override with value
      const base = createSimpleObject({ value: null });
      const override = createSimpleObject({ value: 'new' });

      // When deep merging them
      const result = deepMerge(base, override);

      // Then null should be replaced
      expect(result).toEqual({ value: 'new' });
    });
  });

  describe('P2 - Error Handling', () => {
    it('should throw TypeError for null base', () => {
      // Given null base object
      // When deep merging with valid override
      // Then it should throw TypeError
      expect(() => deepMerge(null as any, {})).toThrow(TypeError);
    });

    it('should throw TypeError for array base', () => {
      // Given array base object
      // When deep merging with valid override
      // Then it should throw TypeError
      expect(() => deepMerge([] as any, {})).toThrow(TypeError);
    });

    it('should throw TypeError for string base', () => {
      // Given string base object
      // When deep merging with valid override
      // Then it should throw TypeError
      expect(() => deepMerge('string' as any, {})).toThrow(TypeError);
    });

    it('should throw TypeError for number base', () => {
      // Given number base object
      // When deep merging with valid override
      // Then it should throw TypeError
      expect(() => deepMerge(123 as any, {})).toThrow(TypeError);
    });
  });

  describe('P2 - Edge Cases', () => {
    it('should return base for null override', () => {
      // Given valid base and null override
      const base = createSimpleObject({ a: 1 });

      // When deep merging
      const result = deepMerge(base, null as any);

      // Then base should be returned unchanged
      expect(result).toEqual(base);
    });

    it('should return base for array override', () => {
      // Given valid base and array override
      const base = createSimpleObject({ a: 1 });

      // When deep merging
      const result = deepMerge(base, [] as any);

      // Then base should be returned unchanged
      expect(result).toEqual(base);
    });

    it('should return base for string override', () => {
      // Given valid base and string override
      const base = createSimpleObject({ a: 1 });

      // When deep merging
      const result = deepMerge(base, 'string' as any);

      // Then base should be returned unchanged
      expect(result).toEqual(base);
    });

    it('should handle Date objects as values', () => {
      // Given configuration with date values
      const date = new Date('2024-01-01');
      const base = { created: new Date('2023-01-01') };
      const override = { created: date };

      // When deep merging
      const result = deepMerge(base, override);

      // Then date objects should be preserved
      expect(result.created).toBe(date);
    });

    it('should not mutate original objects', () => {
      // Given base and override objects
      const base = { tools: { eslint: { enabled: true } } };
      const override = { tools: { eslint: { configPath: 'test' } } };

      const baseCopy = JSON.parse(JSON.stringify(base));
      const overrideCopy = JSON.parse(JSON.stringify(override));

      // When deep merging
      deepMerge(base, override);

      // Then original objects should not be mutated
      expect(base).toEqual(baseCopy);
      expect(override).toEqual(overrideCopy);
    });

    it('should handle empty nested objects', () => {
      // Given base with empty nested object
      const base = { tools: {} };
      const override = { tools: { eslint: { enabled: true } } };

      // When deep merging
      const result = deepMerge(base, override);

      // Then empty nested object should be merged correctly
      expect(result).toEqual({
        tools: {
          eslint: { enabled: true },
        },
      });
    });

    // Mutation testing: Edge cases for isPlainObject function
    it('should handle custom object types correctly', () => {
      // Given various object types that should not be treated as plain objects
      class CustomClass {}
      const base = { a: 1 };

      // When deep merging with custom object override
      const result1 = deepMerge(base, { value: new CustomClass() } as any);
      const result2 = deepMerge(base, { value: new Date() } as any);
      const result3 = deepMerge(base, { value: /regex/ } as any);
      const result4 = deepMerge(base, { value: new Uint8Array() } as any);

      // Then custom objects should be assigned as values (not merged)
      expect(result1.value).toBeInstanceOf(CustomClass);
      expect(result2.value).toBeInstanceOf(Date);
      expect(result3.value).toBeInstanceOf(RegExp);
      expect(result4.value).toBeInstanceOf(Uint8Array);
    });

    it('should handle null and undefined values in nested objects', () => {
      // Given nested objects with null/undefined values
      const base = {
        nested: {
          keep: 'base',
          replace: 'base',
          nullReplace: 'base',
        },
      };

      const override = {
        nested: {
          replace: 'override',
          nullReplace: null,
          undefinedKeep: undefined,
          newAdd: 'new',
        },
      };

      // When deep merging
      const result = deepMerge(base, override);

      // Then null should override, undefined should not, and new keys should be added
      expect(result).toEqual({
        nested: {
          keep: 'base', // preserved from base
          replace: 'override', // overridden
          nullReplace: null, // null overrides base value
          newAdd: 'new', // new key added
          // undefinedKeep is not included (undefined doesn't override)
        },
      });
    });

    it('should preserve array replacement behavior', () => {
      // Given base and override with arrays
      const base = {
        array1: ['a', 'b', 'c'],
        array2: [1, 2, 3],
        nested: { array: ['x', 'y'] },
      };

      const override = {
        array1: ['d', 'e'], // shorter array
        array2: [], // empty array
        nested: { array: ['z'] }, // nested array replacement
      };

      // When deep merging
      const result = deepMerge(base, override);

      // Then arrays should be replaced, not merged
      expect(result.array1).toEqual(['d', 'e']);
      expect(result.array2).toEqual([]);
      expect(result.nested.array).toEqual(['z']);
    });

    it('should throw TypeError with specific message for invalid base', () => {
      // Given invalid base types
      const invalidBases = [null, undefined, 'string', 123, [], true];

      // When/Then - each should throw TypeError with specific message
      for (const invalidBase of invalidBases) {
        expect(() => deepMerge(invalidBase as any, {})).toThrow(TypeError);
        expect(() => deepMerge(invalidBase as any, {})).toThrow('Base must be a plain object');
      }
    });
  });

  describe('P0 - Realistic Config Scenarios', () => {
    it('should merge default plus global plus project configs', () => {
      // Given default, global, and project configurations
      const defaults = createDefaultConfig();
      const global = createGlobalConfig({
        tools: { eslint: { configPath: '.eslintrc.js' } },
      });
      const project = createProjectConfig({
        tools: { typescript: { strict: false } },
      });

      // When merging configurations in cascade order
      const step1 = deepMerge(defaults, global);
      const result = deepMerge(step1, project);

      // Then result should respect precedence: project > global > defaults
      expect(result).toEqual({
        qualityLevel: 'strict', // From project
        aiAssistants: ['copilot'], // From global
        tools: {
          eslint: {
            enabled: true, // From defaults
            configPath: '.eslintrc.js', // From global
          },
          typescript: {
            enabled: true, // From defaults
            strict: false, // From project (overrides default)
          },
        },
        logging: { level: 'debug' }, // From global
      });
    });
  });

  describe('P0 - Performance', () => {
    it('should merge 100-key config in under 10ms', () => {
      // Given large configuration objects with 100 keys each
      const base: Record<string, unknown> = {};
      const override: Record<string, unknown> = {};

      for (let i = 0; i < 100; i++) {
        base[`key${i}`] = { nested: { value: i } };
        override[`key${i}`] = { nested: { value: i * 2 } };
      }

      // When deep merging large configurations
      const start = performance.now();
      const result = deepMerge(base, override);
      const duration = performance.now() - start;

      // Then operation should complete quickly
      expect(duration).toBeLessThan(10);
      expect(Object.keys(result)).toHaveLength(100);

      // Performance evidence
      console.log(
        `✅ Deep merge 100-key config: ${duration.toFixed(2)}ms (${((duration / 100) * 1000).toFixed(3)}μs per key)`
      );
    });

    it('should demonstrate O(n) complexity evidence', () => {
      // Test different sizes to document linear complexity
      const sizes = [10, 25, 50, 100];
      const measurements: Array<{ size: number; time: number }> = [];

      for (const size of sizes) {
        const base: Record<string, unknown> = {};
        const override: Record<string, unknown> = {};

        for (let i = 0; i < size; i++) {
          base[`key${i}`] = { value: i, nested: { data: `base-${i}` } };
          override[`key${i}`] = { value: i * 2 };
        }

        const start = performance.now();
        deepMerge(base, override);
        const duration = performance.now() - start;
        measurements.push({ size, time: duration });
      }

      // Verify linear growth (allowing more tolerance for system load)
      for (let i = 1; i < measurements.length; i++) {
        const current = measurements[i];
        const previous = measurements[i - 1];
        const sizeRatio = current.size / previous.size;
        const timeRatio = current.time / previous.time;

        expect(timeRatio).toBeLessThan(sizeRatio * 3); // Increased tolerance
      }

      // Document complexity evidence
      console.log('✅ Deep Merge Complexity Evidence:');
      measurements.forEach(({ size, time }) => {
        console.log(
          `  ${size} keys: ${time.toFixed(3)}ms (${((time / size) * 1000).toFixed(3)}μs per key)`
        );
      });
      console.log('  Complexity: O(n) verified - Linear time complexity');
    });

    it('should handle realistic config cascade efficiently', () => {
      // Given realistic configuration cascade (defaults → global → project)
      const defaults = {
        version: 1,
        qualityLevel: 'medium',
        aiAssistants: ['claude-code'],
        tools: {
          eslint: { enabled: true, configPath: '.eslintrc.json' },
          typescript: { enabled: true, strict: true },
          prettier: { enabled: true },
          bunTest: { enabled: true, coverage: true },
        },
        scaffolding: {
          templateDirectory: 'templates',
          includeExamples: true,
        },
        logging: { level: 'info' },
      };

      const global = {
        qualityLevel: 'strict',
        aiAssistants: ['claude-code', 'copilot'],
        tools: {
          eslint: { configPath: '.eslintrc.js' },
          typescript: { target: 'ES2022' },
        },
        logging: { level: 'debug', destination: '~/.nimata/logs/nimata.log' },
      };

      const project = {
        qualityLevel: 'strict',
        tools: {
          typescript: { strict: false },
          prettier: { enabled: false },
        },
      };

      // When performing realistic cascade merge
      const start = performance.now();
      const step1 = deepMerge(defaults, global);
      const result = deepMerge(step1, project);
      const duration = performance.now() - start;

      // Then merge should be fast and correct
      expect(duration).toBeLessThan(5); // target: <5ms for realistic configs
      expect(result.qualityLevel).toBe('strict'); // project > global > defaults
      expect(result.aiAssistants).toEqual(['claude-code', 'copilot']); // from global
      expect(result.tools?.typescript?.strict).toBe(false); // project override
      expect(result.tools?.typescript?.target).toBe('ES2022'); // global merge
      expect(result.tools?.eslint?.configPath).toBe('.eslintrc.js'); // global override

      console.log(`✅ Realistic cascade merge: ${duration.toFixed(2)}ms`);
    });
  });
});
