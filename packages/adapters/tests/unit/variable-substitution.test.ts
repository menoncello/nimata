/**
 * Unit Tests for Variable Substitution System
 *
 * Tests variable substitution, type checking, and complex type handling
 */
import { describe, test, expect, beforeEach } from 'bun:test';
import type { TemplateVariable, ExtendedTemplateContext, ProjectConfig } from '@nimata/core';
import { ConfigurableVariableSubstitutionEngine } from '../../src/template-engine/configurable-variable-substitution.js';
import { TemplateContextFactoryImpl } from '../../src/template-engine/template-context-factory.js';
import {
  VariableSubstitutionEngine,
  StringTransformers,
} from '../../src/template-engine/variable-substitution.js';

describe('VariableSubstitutionEngine', () => {
  let substitutionEngine: VariableSubstitutionEngine;
  let mockContext: ExtendedTemplateContext;

  beforeEach(() => {
    substitutionEngine = new VariableSubstitutionEngine();

    // Create mock context
    const factory = new TemplateContextFactoryImpl();
    const mockConfig: ProjectConfig = {
      name: 'test-project',
      description: 'A test project',
      qualityLevel: 'medium',
      projectType: 'cli',
      aiAssistants: ['claude-code'],
      license: 'MIT',
    };

    mockContext = factory.createExtended(mockConfig, {
      theme: 'dark',
      features: ['feature1', 'feature2'],
      config: {
        database: 'postgresql',
        port: 5432,
        ssl: true,
      },
    });
  });

  describe('Basic Variable Substitution', () => {
    test('should substitute simple string variables', () => {
      const template = 'Hello {{project_name}}!';
      const result = substitutionEngine.substitute(template, mockContext);

      expect(result.substitutedContent).toBe('Hello test-project!');
      expect(result.usedVariables).toContain('project_name');
      expect(result.validation.valid).toBe(true);
    });

    test('should substitute multiple variables', () => {
      const template = '{{project_name}} - {{description}} ({{license}})';
      const result = substitutionEngine.substitute(template, mockContext);

      expect(result.substitutedContent).toBe('test-project - A test project (MIT)');
      expect(result.usedVariables).toHaveLength(3);
      expect(result.validation.valid).toBe(true);
    });

    test('should handle missing variables gracefully', () => {
      const template = 'Hello {{missing_var}}!';
      const result = substitutionEngine.substitute(template, mockContext);

      expect(result.substitutedContent).toBe('Hello !');
      expect(result.usedVariables).toContain('missing_var');
      expect(result.validation.warnings.length).toBeGreaterThan(0);
    });

    test('should handle null and undefined values', () => {
      const contextWithNulls = {
        ...mockContext,
        author: null,
        repository_url: undefined,
      };

      const template = 'Author: {{author}}, URL: {{repository_url}}';
      const result = substitutionEngine.substitute(template, contextWithNulls);

      expect(result.substitutedContent).toBe('Author: , URL: ');
      expect(result.validation.warnings.length).toBe(2);
    });
  });

  describe('Complex Variable Types', () => {
    test('should substitute object variables as JSON', () => {
      const template = 'Config: {{custom_variables.config}}';
      const result = substitutionEngine.substitute(template, mockContext);

      expect(result.substitutedContent).toContain('database');
      expect(result.substitutedContent).toContain('postgresql');
      expect(result.validation.valid).toBe(true);
    });

    test('should substitute array variables as comma-separated values', () => {
      const template = 'Features: {{custom_variables.features}}';
      const result = substitutionEngine.substitute(template, mockContext);

      expect(result.substitutedContent).toBe('Features: feature1, feature2');
      expect(result.validation.valid).toBe(true);
    });

    test('should substitute boolean variables', () => {
      const template = 'Strict mode: {{is_strict}}, Light mode: {{is_light}}';
      const result = substitutionEngine.substitute(template, mockContext);

      expect(result.substitutedContent).toBe('Strict mode: false, Light mode: false');
      expect(result.validation.valid).toBe(true);
    });

    test('should substitute number variables', () => {
      const template = 'Year: {{year}}';
      const result = substitutionEngine.substitute(template, mockContext);

      expect(result.substitutedContent).toMatch(/Year: \d{4}/);
      expect(result.validation.valid).toBe(true);
    });

    test('should substitute Date objects', () => {
      const testDate = new Date('2023-12-25T10:30:00.000Z');
      const contextWithDate = {
        ...mockContext,
        custom_variables: {
          created_at: testDate,
        },
      };

      const template = 'Created: {{custom_variables.created_at}}';
      const result = substitutionEngine.substitute(template, contextWithDate);

      expect(result.substitutedContent).toBe('Created: 2023-12-25T10:30:00.000Z');
      expect(result.validation.valid).toBe(true);
    });
  });

  describe('Nested Variable Access', () => {
    test('should access nested object properties', () => {
      const template =
        'Database: {{custom_variables.config.database}}, Port: {{custom_variables.config.port}}';
      const result = substitutionEngine.substitute(template, mockContext);

      expect(result.substitutedContent).toBe('Database: postgresql, Port: 5432');
      expect(result.validation.valid).toBe(true);
    });

    test('should handle deeply nested properties', () => {
      const deepContext = {
        ...mockContext,
        custom_variables: {
          app: {
            server: {
              host: 'localhost',
              ports: {
                http: 8080,
                https: 8443,
              },
            },
          },
        },
      };

      const template =
        'HTTP: {{custom_variables.app.server.ports.http}}, HTTPS: {{custom_variables.app.server.ports.https}}';
      const result = substitutionEngine.substitute(template, deepContext);

      expect(result.substitutedContent).toBe('HTTP: 8080, HTTPS: 8443');
      expect(result.validation.valid).toBe(true);
    });

    test('should handle missing nested properties', () => {
      const template = 'Missing: {{custom_variables.config.missing_property}}';
      const result = substitutionEngine.substitute(template, mockContext);

      expect(result.substitutedContent).toBe('Missing: ');
      expect(result.validation.warnings.length).toBeGreaterThan(0);
    });
  });

  describe('Variable Validation', () => {
    test('should validate variables against definitions', () => {
      const variables: TemplateVariable[] = [
        {
          name: 'project_name',
          type: 'string',
          description: 'Project name',
          required: true,
        },
        {
          name: 'is_strict',
          type: 'boolean',
          description: 'Strict mode flag',
          required: false,
        },
      ];

      const template = '{{project_name}} - {{is_strict}}';
      const result = substitutionEngine.substitute(template, mockContext, variables);

      expect(result.validation.valid).toBe(true);
      expect(result.substitutedContent).toBe('test-project - false');
    });

    test('should detect missing required variables', () => {
      const variables: TemplateVariable[] = [
        {
          name: 'required_var',
          type: 'string',
          description: 'Required variable',
          required: true,
        },
      ];

      const template = 'Hello {{project_name}}!';
      const result = substitutionEngine.substitute(template, mockContext, variables);

      expect(result.validation.valid).toBe(true);
      expect(result.validation.warnings).toContain(
        "Required variable 'required_var' not found in template"
      );
    });

    test('should detect type mismatches', () => {
      const variables: TemplateVariable[] = [
        {
          name: 'project_name',
          type: 'number',
          description: 'Project name as number',
          required: true,
        },
      ];

      const template = '{{project_name}}';
      const result = substitutionEngine.substitute(template, mockContext, variables);

      expect(result.validation.valid).toBe(true);
      expect(result.validation.warnings.length).toBeGreaterThan(0);
    });
  });

  describe('String Transformations', () => {
    test('should provide various string transformations', () => {
      const template = `
        Camel: {{project_name_camel}}
        Pascal: {{project_name_pascal}}
        Kebab: {{project_name_kebab}}
        Snake: {{project_name_snake}}
        Upper: {{project_name_upper}}
        Lower: {{project_name_lower}}
      `;

      const result = substitutionEngine.substitute(template, mockContext);

      expect(result.substitutedContent).toContain('Camel: testProject');
      expect(result.substitutedContent).toContain('Pascal: TestProject');
      expect(result.substitutedContent).toContain('Kebab: test-project');
      expect(result.substitutedContent).toContain('Snake: test_project');
      expect(result.substitutedContent).toContain('Upper: TEST-PROJECT');
      expect(result.substitutedContent).toContain('Lower: test-project');
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty template', () => {
      const result = substitutionEngine.substitute('', mockContext);

      expect(result.substitutedContent).toBe('');
      expect(result.usedVariables).toHaveLength(0);
      expect(result.validation.valid).toBe(true);
    });

    test('should handle template with no variables', () => {
      const template = 'This is just plain text';
      const result = substitutionEngine.substitute(template, mockContext);

      expect(result.substitutedContent).toBe(template);
      expect(result.usedVariables).toHaveLength(0);
      expect(result.validation.valid).toBe(true);
    });

    test('should handle malformed variable syntax', () => {
      const template = '{{incomplete_var and {{another_incomplete';
      const result = substitutionEngine.substitute(template, mockContext);

      // Should not throw, but also not substitute anything
      expect(result.substitutedContent).toBe(template);
      expect(result.usedVariables).toHaveLength(0);
    });

    test('should handle duplicate variables', () => {
      const template = '{{project_name}} and {{project_name}} again';
      const result = substitutionEngine.substitute(template, mockContext);

      expect(result.substitutedContent).toBe('test-project and test-project again');
      expect(result.usedVariables).toHaveLength(1);
      expect(result.usedVariables[0]).toBe('project_name');
    });
  });

  describe('Variable Extraction and Validation', () => {
    test('should extract variables from template', () => {
      const template = 'Hello {{project_name}}! Your {{custom_variables.theme}} theme is ready.';
      const extracted = VariableSubstitutionEngine.extractVariables(template);

      expect(extracted).toHaveLength(2);
      expect(extracted).toContain('project_name');
      expect(extracted).toContain('custom_variables.theme');
    });

    test('should validate variable syntax', () => {
      const validTemplate = '{{project_name}} and {{custom_variables.theme}}';
      const invalidTemplate = '{{invalid name}} and {{123invalid}} and {{}}';

      const validResult = VariableSubstitutionEngine.validateVariableSyntax(validTemplate);
      expect(validResult.valid).toBe(true);

      const invalidResult = VariableSubstitutionEngine.validateVariableSyntax(invalidTemplate);
      expect(invalidResult.valid).toBe(false);
      expect(invalidResult.errors.length).toBeGreaterThan(0);
    });
  });

  describe('Complex Type Processing', () => {
    test('should process arrays with metadata', () => {
      const { processed } = VariableSubstitutionEngine.processComplexType(
        ['item1', 'item2', 'item3'],
        'test_array',
        'array'
      );

      expect(Array.isArray(processed)).toBe(true);
      if (Array.isArray(processed)) {
        expect(processed[0]).toEqual({
          value: 'item1',
          _index: 0,
          _isFirst: true,
          _isLast: false,
        });
        expect(processed[1]).toEqual({
          value: 'item2',
          _index: 1,
          _isFirst: false,
          _isLast: false,
        });
        expect(processed[2]).toEqual({
          value: 'item3',
          _index: 2,
          _isFirst: false,
          _isLast: true,
        });
      }
    });

    test('should process objects with metadata', () => {
      const testObject = { name: 'test', value: 42 };
      const { processed } = VariableSubstitutionEngine.processComplexType(
        testObject,
        'test_object',
        'object'
      );

      expect(typeof processed === 'object' && processed !== null).toBe(true);
      if (typeof processed === 'object' && processed !== null) {
        expect(processed).toEqual({
          name: 'test',
          value: 42,
          _keys: ['name', 'value'],
          _size: 2,
          _isEmpty: false,
        });
      }
    });

    test('should validate variable types', () => {
      let result = VariableSubstitutionEngine.validateVariableValue(
        'test string',
        'string',
        'test_var'
      );
      expect(result.valid).toBe(true);

      result = VariableSubstitutionEngine.validateVariableValue(123, 'string', 'test_var');
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain("should be of type 'string'");
    });
  });
});

describe('ConfigurableVariableSubstitutionEngine', () => {
  let configurableEngine: ConfigurableVariableSubstitutionEngine;
  let mockContext: ExtendedTemplateContext;

  beforeEach(() => {
    configurableEngine = new ConfigurableVariableSubstitutionEngine({
      strictMode: false,
      includeWarnings: true,
      defaultMissingValue: '[MISSING]',
    });

    const factory = new TemplateContextFactoryImpl();
    const mockConfig: ProjectConfig = {
      name: 'test-project',
      description: 'A test project',
      qualityLevel: 'medium',
      projectType: 'cli',
      aiAssistants: [],
    };

    mockContext = factory.createExtended(mockConfig);
  });

  describe('Configuration', () => {
    test('should use default missing value', () => {
      const template = 'Hello {{missing_var}}!';
      const result = configurableEngine.substituteWithConfig(template, mockContext);

      expect(result.substitutedContent).toBe('Hello [MISSING]!');
    });

    test('should apply custom formatters', () => {
      const engine = new ConfigurableVariableSubstitutionEngine({
        formatters: {
          custom_greeting: () => 'Custom Hello!',
          current_time: () => new Date().toISOString(),
        },
      });

      const template = '{{custom_greeting}} Time: {{current_time}}';
      const result = engine.substituteWithConfig(template, mockContext);

      expect(result.substitutedContent).toContain('Custom Hello!');
      expect(result.substitutedContent).toMatch(
        /Time: \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/
      );
    });

    test('should handle strict mode', () => {
      const strictEngine = new ConfigurableVariableSubstitutionEngine({
        strictMode: true,
      });

      const template = '{{missing_var}}';

      expect(() => {
        strictEngine.substituteWithConfig(template, mockContext);
      }).toThrow('Variable substitution failed');
    });

    test('should filter warnings when disabled', () => {
      const engine = new ConfigurableVariableSubstitutionEngine({
        includeWarnings: false,
      });

      const template = '{{missing_var}}';
      const result = engine.substituteWithConfig(template, mockContext);

      expect(result.validation.warnings).toHaveLength(0);
    });

    test('should update configuration', () => {
      const initialConfig = configurableEngine.getConfig();
      expect(initialConfig.defaultMissingValue).toBe('[MISSING]');

      configurableEngine.updateConfig({ defaultMissingValue: 'N/A' });

      const updatedConfig = configurableEngine.getConfig();
      expect(updatedConfig.defaultMissingValue).toBe('N/A');
    });
  });
});

describe('StringTransformers', () => {
  describe('Camel Case Transformation', () => {
    test('should convert to camelCase', () => {
      expect(StringTransformers.toCamelCase('hello world')).toBe('helloWorld');
      expect(StringTransformers.toCamelCase('Hello World')).toBe('helloWorld');
      expect(StringTransformers.toCamelCase('hello-world_test')).toBe('helloWorldTest');
      expect(StringTransformers.toCamelCase('AlreadyCamelCase')).toBe('alreadyCamelCase');
    });
  });

  describe('Pascal Case Transformation', () => {
    test('should convert to PascalCase', () => {
      expect(StringTransformers.toPascalCase('hello world')).toBe('HelloWorld');
      expect(StringTransformers.toPascalCase('Hello World')).toBe('HelloWorld');
      expect(StringTransformers.toPascalCase('hello-world_test')).toBe('HelloWorldTest');
    });
  });

  describe('Kebab Case Transformation', () => {
    test('should convert to kebab-case', () => {
      expect(StringTransformers.toKebabCase('hello world')).toBe('hello-world');
      expect(StringTransformers.toKebabCase('HelloWorld')).toBe('hello-world');
      expect(StringTransformers.toKebabCase('helloWorld_test')).toBe('hello-world-test');
    });
  });

  describe('Snake Case Transformation', () => {
    test('should convert to snake_case', () => {
      expect(StringTransformers.toSnakeCase('hello world')).toBe('hello_world');
      expect(StringTransformers.toSnakeCase('HelloWorld')).toBe('hello_world');
      expect(StringTransformers.toSnakeCase('helloWorld-test')).toBe('hello_world_test');
    });
  });

  describe('Case Transformations', () => {
    test('should convert to upper case', () => {
      expect(StringTransformers.toUpperCase('hello world')).toBe('HELLO WORLD');
    });

    test('should convert to lower case', () => {
      expect(StringTransformers.toLowerCase('HELLO WORLD')).toBe('hello world');
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty strings', () => {
      expect(StringTransformers.toCamelCase('')).toBe('');
      expect(StringTransformers.toPascalCase('')).toBe('');
      expect(StringTransformers.toKebabCase('')).toBe('');
      expect(StringTransformers.toSnakeCase('')).toBe('');
    });

    test('should handle strings with special characters', () => {
      expect(StringTransformers.toCamelCase('hello-world_test 123')).toBe('helloWorldTest123');
      expect(StringTransformers.toKebabCase('Hello World Test!')).toBe('hello-world-test');
    });

    test('should handle already formatted strings', () => {
      expect(StringTransformers.toCamelCase('alreadyCamelCase')).toBe('alreadyCamelCase');
      expect(StringTransformers.toKebabCase('already-kebab-case')).toBe('already-kebab-case');
      expect(StringTransformers.toSnakeCase('already_snake_case')).toBe('already_snake_case');
    });
  });
});
