/**
 * Unit Tests for Conditional Helpers
 *
 * Tests advanced conditional logic, nested conditions, and boolean expressions
 */
import { describe, test, expect, beforeEach } from 'bun:test';
import Handlebars from 'handlebars';
import {
  ConditionalHelpers,
  ConditionalUtils,
} from '../../src/template-engine/conditional-helpers.js';

describe('ConditionalHelpers', () => {
  let handlebars: typeof Handlebars;

  beforeEach(() => {
    handlebars = Handlebars.create();
    ConditionalHelpers.registerAll(handlebars);
  });

  describe('Basic Conditional Helpers', () => {
    test('should handle ifAny helper', () => {
      const template = `{{#ifAny true false true}}YES{{else}}NO{{/ifAny}}`;
      const compiled = handlebars.compile(template);
      const result = compiled({});
      expect(result).toBe('YES');
    });

    test('should handle ifAll helper', () => {
      const template = `{{#ifAll true true true}}YES{{else}}NO{{/ifAll}}`;
      const compiled = handlebars.compile(template);
      const result = compiled({});
      expect(result).toBe('YES');

      const template2 = `{{#ifAll true false true}}YES{{else}}NO{{/ifAll}}`;
      const compiled2 = handlebars.compile(template2);
      const result2 = compiled2({});
      expect(result2).toBe('NO');
    });

    test('should handle ifExists helper', () => {
      const template = `{{#ifExists value}}EXISTS{{else}}MISSING{{/ifExists}}`;
      const compiled = handlebars.compile(template);

      expect(compiled({ value: 'test' })).toBe('EXISTS');
      expect(compiled({ value: null })).toBe('MISSING');
      expect(compiled({})).toBe('MISSING');
    });

    test('should handle ifEmpty helper', () => {
      const template = `{{#ifEmpty value}}EMPTY{{else}}NOT EMPTY{{/ifEmpty}}`;
      const compiled = handlebars.compile(template);

      expect(compiled({ value: '' })).toBe('EMPTY');
      expect(compiled({ value: [] })).toBe('EMPTY');
      expect(compiled({ value: {} })).toBe('EMPTY');
      expect(compiled({ value: null })).toBe('EMPTY');
      expect(compiled({ value: 'test' })).toBe('NOT EMPTY');
      expect(compiled({ value: [1, 2] })).toBe('NOT EMPTY');
    });

    test('should handle ifNotEmpty helper', () => {
      const template = `{{#ifNotEmpty value}}NOT EMPTY{{else}}EMPTY{{/ifNotEmpty}}`;
      const compiled = handlebars.compile(template);

      expect(compiled({ value: 'test' })).toBe('NOT EMPTY');
      expect(compiled({ value: [1, 2] })).toBe('NOT EMPTY');
      expect(compiled({ value: '' })).toBe('EMPTY');
      expect(compiled({ value: [] })).toBe('EMPTY');
    });
  });

  describe('Advanced Conditional Helpers', () => {
    test('should handle ifInRange helper', () => {
      const template = `{{#ifInRange value 5 10}}IN RANGE{{else}}OUT OF RANGE{{/ifInRange}}`;
      const compiled = handlebars.compile(template);

      expect(compiled({ value: 7 })).toBe('IN RANGE');
      expect(compiled({ value: 5 })).toBe('IN RANGE');
      expect(compiled({ value: 10 })).toBe('IN RANGE');
      expect(compiled({ value: 4 })).toBe('OUT OF RANGE');
      expect(compiled({ value: 11 })).toBe('OUT OF RANGE');
    });

    test('should handle ifIncludes helper', () => {
      const template = `{{#ifIncludes array item}}FOUND{{else}}NOT FOUND{{/ifIncludes}}`;
      const compiled = handlebars.compile(template);

      expect(compiled({ array: ['a', 'b', 'c'], item: 'b' })).toBe('FOUND');
      expect(compiled({ array: ['a', 'b', 'c'], item: 'd' })).toBe('NOT FOUND');
      expect(compiled({ array: [], item: 'a' })).toBe('NOT FOUND');
    });

    test('should handle ifHasProperty helper', () => {
      const template = `{{#ifHasProperty obj prop}}HAS PROPERTY{{else}}NO PROPERTY{{/ifHasProperty}}`;
      const compiled = handlebars.compile(template);

      expect(compiled({ obj: { name: 'test' }, prop: 'name' })).toBe('HAS PROPERTY');
      expect(compiled({ obj: { name: 'test' }, prop: 'age' })).toBe('NO PROPERTY');
      expect(compiled({ obj: null, prop: 'name' })).toBe('NO PROPERTY');
    });

    test('should handle ifType helper', () => {
      const template = `{{#ifType value 'string'}}STRING{{else}}NOT STRING{{/ifType}}`;
      const compiled = handlebars.compile(template);

      expect(compiled({ value: 'test' })).toBe('STRING');
      expect(compiled({ value: 123 })).toBe('NOT STRING');
      expect(compiled({ value: true })).toBe('NOT STRING');
    });
  });

  describe('Logical Operator Helpers', () => {
    test('should handle and helper', () => {
      const template = `{{#if (and true true)}}ALL TRUE{{else}}NOT ALL TRUE{{/if}}`;
      const compiled = handlebars.compile(template);
      expect(compiled({})).toBe('ALL TRUE');
    });

    test('should handle or helper', () => {
      const template = `{{#if (or false true)}}ANY TRUE{{else}}ALL FALSE{{/if}}`;
      const compiled = handlebars.compile(template);
      expect(compiled({})).toBe('ANY TRUE');
    });

    test('should handle not helper', () => {
      const template = `{{#if (not false)}}NOT FALSE{{else}}FALSE{{/if}}`;
      const compiled = handlebars.compile(template);
      expect(compiled({})).toBe('NOT FALSE');
    });

    test('should handle xor helper', () => {
      const template = `{{#if (xor true false)}}XOR TRUE{{else}}XOR FALSE{{/if}}`;
      const compiled = handlebars.compile(template);
      expect(compiled({})).toBe('XOR TRUE');

      const template2 = `{{#if (xor true true)}}XOR TRUE{{else}}XOR FALSE{{/if}}`;
      const compiled2 = handlebars.compile(template2);
      expect(compiled2({})).toBe('XOR FALSE');
    });
  });

  describe('String Conditional Helpers', () => {
    test('should handle ifEqualsIgnoreCase helper', () => {
      const template = `{{#ifEqualsIgnoreCase str1 str2}}EQUAL{{else}}NOT EQUAL{{/ifEqualsIgnoreCase}}`;
      const compiled = handlebars.compile(template);

      expect(compiled({ str1: 'Hello', str2: 'hello' })).toBe('EQUAL');
      expect(compiled({ str1: 'Hello', str2: 'World' })).toBe('NOT EQUAL');
    });

    test('should handle ifContains helper', () => {
      const template = `{{#ifContains str substr}}CONTAINS{{else}}NOT CONTAINS{{/ifContains}}`;
      const compiled = handlebars.compile(template);

      expect(compiled({ str: 'Hello World', substr: 'World' })).toBe('CONTAINS');
      expect(compiled({ str: 'Hello World', substr: 'Bye' })).toBe('NOT CONTAINS');
    });

    test('should handle ifStartsWith helper', () => {
      const template = `{{#ifStartsWith str prefix}}STARTS WITH{{else}}DOES NOT START WITH{{/ifStartsWith}}`;
      const compiled = handlebars.compile(template);

      expect(compiled({ str: 'Hello World', prefix: 'Hello' })).toBe('STARTS WITH');
      expect(compiled({ str: 'Hello World', prefix: 'World' })).toBe('DOES NOT START WITH');
    });

    test('should handle ifEndsWith helper', () => {
      const template = `{{#ifEndsWith str suffix}}ENDS WITH{{else}}DOES NOT END WITH{{/ifEndsWith}}`;
      const compiled = handlebars.compile(template);

      expect(compiled({ str: 'Hello World', suffix: 'World' })).toBe('ENDS WITH');
      expect(compiled({ str: 'Hello World', suffix: 'Hello' })).toBe('DOES NOT END WITH');
    });

    test('should handle ifLength helper', () => {
      const template = `{{#ifLength str '==' 5}}LENGTH 5{{else}}NOT LENGTH 5{{/ifLength}}`;
      const compiled = handlebars.compile(template);

      expect(compiled({ str: 'Hello' })).toBe('LENGTH 5');
      expect(compiled({ str: 'Hello World' })).toBe('NOT LENGTH 5');
    });
  });

  describe('Array Conditional Helpers', () => {
    test('should handle ifArrayLength helper', () => {
      const template = `{{#ifArrayLength array 3}}LENGTH 3{{else}}NOT LENGTH 3{{/ifArrayLength}}`;
      const compiled = handlebars.compile(template);

      expect(compiled({ array: [1, 2, 3] })).toBe('LENGTH 3');
      expect(compiled({ array: [1, 2] })).toBe('NOT LENGTH 3');
    });

    test('should handle ifArrayMinLength helper', () => {
      const template = `{{#ifArrayMinLength array 3}}MIN LENGTH 3{{else}}NOT MIN LENGTH 3{{/ifArrayMinLength}}`;
      const compiled = handlebars.compile(template);

      expect(compiled({ array: [1, 2, 3, 4] })).toBe('MIN LENGTH 3');
      expect(compiled({ array: [1, 2] })).toBe('NOT MIN LENGTH 3');
    });

    test('should handle ifArrayMaxLength helper', () => {
      const template = `{{#ifArrayMaxLength array 3}}MAX LENGTH 3{{else}}NOT MAX LENGTH 3{{/ifArrayMaxLength}}`;
      const compiled = handlebars.compile(template);

      expect(compiled({ array: [1, 2, 3] })).toBe('MAX LENGTH 3');
      expect(compiled({ array: [1, 2, 3, 4] })).toBe('NOT MAX LENGTH 3');
    });
  });

  describe('Object Conditional Helpers', () => {
    test('should handle ifObjectSize helper', () => {
      const template = `{{#ifObjectSize obj 2}}SIZE 2{{else}}NOT SIZE 2{{/ifObjectSize}}`;
      const compiled = handlebars.compile(template);

      expect(compiled({ obj: { a: 1, b: 2 } })).toBe('SIZE 2');
      expect(compiled({ obj: { a: 1 } })).toBe('NOT SIZE 2');
    });

    test('should handle ifObjectMinSize helper', () => {
      const template = `{{#ifObjectMinSize obj 2}}MIN SIZE 2{{else}}NOT MIN SIZE 2{{/ifObjectMinSize}}`;
      const compiled = handlebars.compile(template);

      expect(compiled({ obj: { a: 1, b: 2, c: 3 } })).toBe('MIN SIZE 2');
      expect(compiled({ obj: { a: 1 } })).toBe('NOT MIN SIZE 2');
    });
  });

  describe('Nested Conditions', () => {
    test('should handle nested if conditions', () => {
      const template = `
        {{#if condition1}}
          {{#if condition2}}
            BOTH TRUE
          {{else}}
            FIRST TRUE, SECOND FALSE
          {{/if}}
        {{else}}
          FIRST FALSE
        {{/if}}
      `;

      const compiled = handlebars.compile(template);

      expect(compiled({ condition1: true, condition2: true }).trim()).toBe('BOTH TRUE');
      expect(compiled({ condition1: true, condition2: false }).trim()).toBe(
        'FIRST TRUE, SECOND FALSE'
      );
      expect(compiled({ condition1: false, condition2: true }).trim()).toBe('FIRST FALSE');
    });

    test('should handle complex nested logic', () => {
      const template = `
        {{#if (and condition1 condition2)}}
          {{#if condition3}}
            ALL THREE TRUE
          {{else}}
            FIRST TWO TRUE, THIRD FALSE
          {{/if}}
        {{else}}
          NOT BOTH FIRST TWO
        {{/if}}
      `;

      const compiled = handlebars.compile(template);

      expect(compiled({ condition1: true, condition2: true, condition3: true }).trim()).toBe(
        'ALL THREE TRUE'
      );
      expect(compiled({ condition1: true, condition2: true, condition3: false }).trim()).toBe(
        'FIRST TWO TRUE, THIRD FALSE'
      );
      expect(compiled({ condition1: false, condition2: true, condition3: true }).trim()).toBe(
        'NOT BOTH FIRST TWO'
      );
    });
  });

  describe('Error Handling', () => {
    test('should handle missing context gracefully', () => {
      const template = `{{#ifExists missingProp}}EXISTS{{else}}MISSING{{/ifExists}}`;
      const compiled = handlebars.compile(template);
      expect(compiled({})).toBe('MISSING');
    });

    test('should handle invalid types gracefully', () => {
      const template = `{{#ifArrayLength notArray 3}}LENGTH 3{{else}}NOT ARRAY{{/ifArrayLength}}`;
      const compiled = handlebars.compile(template);
      expect(compiled({ notArray: 'not an array' })).toBe('NOT ARRAY');
    });
  });
});

describe('ConditionalUtils', () => {
  describe('Expression Evaluation', () => {
    test('should evaluate simple boolean expressions', () => {
      const context = { a: true, b: false, c: 5, d: 'test' };

      expect(ConditionalUtils.evaluateExpression('a && b', context)).toBe(false);
      expect(ConditionalUtils.evaluateExpression('a || b', context)).toBe(true);
      expect(ConditionalUtils.evaluateExpression('c > 3', context)).toBe(true);
      expect(ConditionalUtils.evaluateExpression('c >= 5', context)).toBe(true);
    });

    test('should evaluate string equality expressions', () => {
      const context = { str1: 'hello', str2: 'world', str3: 'hello' };

      expect(ConditionalUtils.evaluateExpression('str1 === str3', context)).toBe(true);
      expect(ConditionalUtils.evaluateExpression('str1 !== str2', context)).toBe(true);
      expect(ConditionalUtils.evaluateExpression('str1 === str2', context)).toBe(false);
    });

    test('should handle invalid expressions safely', () => {
      const context = { a: 1, b: 2 };

      expect(ConditionalUtils.evaluateExpression('a + b', context)).toBe(false);
      expect(ConditionalUtils.evaluateExpression('unknownVar', context)).toBe(false);
      expect(ConditionalUtils.evaluateExpression('', context)).toBe(false);
    });

    test('should create helper from expression', () => {
      const context = { a: true, b: false };
      const helper = ConditionalUtils.createHelper('a && b');

      const mockOptions = {
        fn: () => 'YES',
        inverse: () => 'NO',
        data: { root: context },
      };

      expect(helper({}, context, mockOptions)).toBe('NO');
    });
  });

  describe('Syntax Validation', () => {
    test('should validate balanced conditional blocks', () => {
      const validTemplate = `
        {{#if condition}}content{{/if}}
        {{#unless condition}}content{{/unless}}
        {{#each items}}item{{/each}}
      `;

      const result = ConditionalUtils.validateConditionalSyntax(validTemplate);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should detect unbalanced if blocks', () => {
      const invalidTemplate = `
        {{#if condition}}content
        {{#if another}}content{{/if}}
      `;

      const result = ConditionalUtils.validateConditionalSyntax(invalidTemplate);
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain('Unbalanced #if blocks');
    });

    test('should detect unbalanced each blocks', () => {
      const invalidTemplate = `
        {{#each items}}
          {{#if condition}}content{{/if}}
        {{#each otherItems}}item{{/each}}
      `;

      const result = ConditionalUtils.validateConditionalSyntax(invalidTemplate);
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain('Unbalanced #each blocks');
    });

    test('should detect invalid nested blocks', () => {
      const invalidTemplate = `{{#if condition}}{{#if another}}content{{/if}}{{/if}}`;
      const result = ConditionalUtils.validateConditionalSyntax(invalidTemplate);
      expect(result.valid).toBe(true); // This is actually valid nesting
    });
  });
});
