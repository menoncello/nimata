/**
 * Unit tests for Template Engine
 */

import { describe, it, expect, beforeEach } from 'bun:test';
import { TemplateEngine } from '../src/template-engine';

describe('TemplateEngine', () => {
  let templateEngine: TemplateEngine;

  beforeEach(() => {
    templateEngine = new TemplateEngine();
  });

  describe('renderTemplate', () => {
    it('should render simple variable substitution', async () => {
      const template = 'Hello {{name}}!';
      const context = { name: 'World' };

      const result = await templateEngine.renderTemplate(template, context);

      expect(result).toBe('Hello World!');
    });

    it('should handle missing variables gracefully', async () => {
      const template = 'Hello {{missing}}!';
      const context = {};

      const result = await templateEngine.renderTemplate(template, context);

      expect(result).toBe('Hello !');
    });

    it('should render nested object properties', async () => {
      const template = 'Hello {{user.name}}!';
      const context = { user: { name: 'Alice' } };

      const result = await templateEngine.renderTemplate(template, context);

      expect(result).toBe('Hello Alice!');
    });
  });

  describe('helper functions', () => {
    it('should use capitalize helper', async () => {
      const template = 'Hello {{helper:capitalize name}}!';
      const context = { name: 'world' };

      const result = await templateEngine.renderTemplate(template, context);

      expect(result).toBe('Hello World!');
    });

    it('should use camelCase helper', async () => {
      const template = '{{helper:camelCase name}}';
      const context = { name: 'hello-world' };

      const result = await templateEngine.renderTemplate(template, context);

      expect(result).toBe('helloWorld');
    });

    it('should use pascalCase helper', async () => {
      const template = '{{helper:pascalCase name}}';
      const context = { name: 'hello-world' };

      const result = await templateEngine.renderTemplate(template, context);

      expect(result).toBe('HelloWorld');
    });

    it('should use year helper', async () => {
      const template = 'Year: {{helper:year}}';
      const context = {};

      const result = await templateEngine.renderTemplate(template, context);

      const currentYear = new Date().getFullYear();
      expect(result).toBe(`Year: ${currentYear}`);
    });
  });

  describe('validateTemplate', () => {
    it('should validate correct template', () => {
      const template = 'Hello {{name}}!';

      const result = templateEngine.validateTemplate(template);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect unclosed if blocks', () => {
      const template = '{{#if condition}}Hello';

      const result = templateEngine.validateTemplate(template);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Unclosed {{#if}} blocks: 1 open, 0 closed');
    });

    it('should detect unclosed each blocks', () => {
      const template = '{{#each items}}Hello';

      const result = templateEngine.validateTemplate(template);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Unclosed {{#each}} blocks: 1 open, 0 closed');
    });
  });

  describe('conditional rendering', () => {
    it('should render content when condition is true', async () => {
      const template = '{{#if show}}Hello{{/if}}';
      const context = { show: true };

      const result = await templateEngine.renderTemplate(template, context);

      expect(result).toBe('Hello');
    });

    it('should hide content when condition is false', async () => {
      const template = '{{#if show}}Hello{{/if}}';
      const context = { show: false };

      const result = await templateEngine.renderTemplate(template, context);

      expect(result).toBe('');
    });

    it('should handle boolean expressions', async () => {
      const template = '{{#if condition}}Hello{{/if}}';
      const context = { condition: true };

      const result = await templateEngine.renderTemplate(template, context);

      expect(result).toBe('Hello');
    });
  });

  describe('loop rendering', () => {
    it('should render array items', async () => {
      const template = '{{#each items}}- {{this}} {{/each}}';
      const context = { items: ['apple', 'banana', 'cherry'] };

      const result = await templateEngine.renderTemplate(template, context);

      expect(result).toBe('- apple - banana - cherry ');
    });

    it('should handle empty arrays', async () => {
      const template = '{{#each items}}- {{this}} {{/each}}';
      const context = { items: [] };

      const result = await templateEngine.renderTemplate(template, context);

      expect(result).toBe('');
    });

    it('should handle non-array values', async () => {
      const template = '{{#each items}}- {{this}} {{/each}}';
      const context = { items: 'not an array' };

      const result = await templateEngine.renderTemplate(template, context);

      expect(result).toBe('');
    });
  });
});
