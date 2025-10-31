/**
 * Template Engine Tests - Story 1.5 (Handlebars-based)
 *
 * These tests verify the Handlebars-based template engine implementation
 * as specified in Story 1.5 acceptance criteria.
 *
 * Tests are written in RED phase - they will fail initially because
 * the Handlebars-based implementation doesn't exist yet.
 */

import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { mkdtemp, rm, writeFile, mkdir } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
// These imports will fail because the Handlebars-based implementation doesn't exist yet
import type { TemplateContext, ProjectTemplate } from '../src/template-engine/types';
import { HandlebarsTemplateEngine } from '../src/template-engine-handlebars';

describe('Handlebars Template Engine - Story 1.5', () => {
  let templateEngine: HandlebarsTemplateEngine;
  let templatesDir: string;
  let tempDir: string;

  beforeEach(async () => {
    // Create a temporary directory for test templates
    tempDir = await mkdtemp(join(tmpdir(), 'nimata-template-test-'));
    templatesDir = join(tempDir, 'templates', 'typescript-bun-cli');
    await mkdir(templatesDir, { recursive: true });

    // Initialize the template engine with our test directory
    templateEngine = new HandlebarsTemplateEngine(templatesDir);
  });

  afterEach(async () => {
    // Clean up temporary directory
    if (tempDir) {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  describe('AC 1: Loads templates from `templates/typescript-bun-cli/` directory', () => {
    it('should load a valid template from the correct directory structure', async () => {
      // GIVEN: A template file exists in templates/typescript-bun-cli/
      const templateContent = {
        name: 'typescript-bun-cli',
        description: 'TypeScript Bun CLI template',
        files: [
          {
            path: 'package.json',
            template: '{"name": "{{project_name}}", "version": "1.0.0"}',
          },
        ],
      };

      await writeFile(
        join(templatesDir, 'typescript-bun-cli.json'),
        JSON.stringify(templateContent, null, 2)
      );

      // WHEN: Loading the template
      const template = await templateEngine.loadTemplate('typescript-bun-cli');

      // THEN: Template should be loaded successfully
      expect(template).toBeDefined();
      expect(template.name).toBe('typescript-bun-cli');
      expect(template.files).toHaveLength(1);
    });

    it('should throw error for non-existent template', async () => {
      // WHEN: Trying to load a template that doesn't exist
      const loadPromise = templateEngine.loadTemplate('non-existent-template');

      // THEN: Should throw appropriate error
      await expect(loadPromise).rejects.toThrow("Template 'non-existent-template' not found");
    });

    it('should list available templates in the directory', async () => {
      // GIVEN: Multiple template files exist
      await writeFile(
        join(templatesDir, 'typescript-bun-cli.json'),
        JSON.stringify({ name: 'typescript-bun-cli' })
      );
      await writeFile(
        join(templatesDir, 'another-template.json'),
        JSON.stringify({ name: 'another-template' })
      );

      // WHEN: Getting available templates
      const templates = await templateEngine.getAvailableTemplates();

      // THEN: Should return all available template names
      expect(templates).toContain('typescript-bun-cli');
      expect(templates).toContain('another-template');
      expect(templates).toHaveLength(2);
    });
  });

  describe('AC 2: Variable substitution: {{project_name}}, {{description}}, etc.', () => {
    it('should substitute simple variables', async () => {
      // GIVEN: A template with variable placeholders
      const template = 'Hello {{project_name}}! Description: {{description}}';
      const context: TemplateContext = {
        project_name: 'my-awesome-project',
        description: 'An awesome TypeScript project',
      };

      // WHEN: Rendering the template
      const result = await templateEngine.renderTemplate(template, context);

      // THEN: Variables should be substituted correctly
      expect(result).toBe('Hello my-awesome-project! Description: An awesome TypeScript project');
    });

    it('should handle nested object variables', async () => {
      // GIVEN: A template with nested variable references
      const template = 'Author: {{author.name}} ({{author.email}})';
      const context: TemplateContext = {
        author: {
          name: 'John Doe',
          email: 'john@example.com',
        },
      };

      // WHEN: Rendering the template
      const result = await templateEngine.renderTemplate(template, context);

      // THEN: Nested variables should be resolved
      expect(result).toBe('Author: John Doe (john@example.com)');
    });

    it('should handle missing variables gracefully', async () => {
      // GIVEN: A template with missing variables in context
      const template = 'Project: {{project_name}}, Missing: {{missing_var}}';
      const context: TemplateContext = {};

      // WHEN: Rendering the template
      const result = await templateEngine.renderTemplate(template, context);

      // THEN: Missing variables should render as empty strings
      expect(result).toBe('Project: , Missing: ');
    });
  });

  describe('AC 3: Conditional blocks: {{#if strict}}...{{/if}}', () => {
    it('should render conditional blocks when condition is true', async () => {
      // GIVEN: A template with conditional block
      const template = `
Project: {{project_name}}
{{#if strict}}
"strict": true,
{{/if}}
"target": "ES2022"`;
      const context: TemplateContext = {
        project_name: 'my-project',
        strict: true,
      };

      // WHEN: Rendering the template
      const result = await templateEngine.renderTemplate(template, context);

      // THEN: Conditional block should be included
      expect(result).toContain('"strict": true,');
      expect(result).toContain('Project: my-project');
    });

    it('should not render conditional blocks when condition is false', async () => {
      // GIVEN: A template with conditional block
      const template = `
Project: {{project_name}}
{{#if strict}}
"strict": true,
{{/if}}
"target": "ES2022"`;
      const context: TemplateContext = {
        project_name: 'my-project',
        strict: false,
      };

      // WHEN: Rendering the template
      const result = await templateEngine.renderTemplate(template, context);

      // THEN: Conditional block should be excluded
      expect(result).not.toContain('"strict": true,');
      expect(result).toContain('Project: my-project');
      expect(result).toContain('"target": "ES2022"');
    });

    it('should handle nested conditionals', async () => {
      // GIVEN: A template with nested conditionals
      const template = `
{{#if enableTypescript}}
{
  "compilerOptions": {
    {{#if strict}}
    "strict": true,
    {{/if}}
    "target": "ES2022"
  }
}
{{/if}}`;
      const context: TemplateContext = {
        enableTypescript: true,
        strict: true,
      };

      // WHEN: Rendering the template
      const result = await templateEngine.renderTemplate(template, context);

      // THEN: Both conditionals should be processed
      expect(result).toContain('"strict": true,');
      expect(result).toContain('"target": "ES2022"');
    });
  });

  describe('AC 4: Template validation before rendering', () => {
    it('should validate template syntax and report errors', async () => {
      // GIVEN: An invalid Handlebars template (unclosed block)
      const invalidTemplate = 'Hello {{project_name}}{{#if condition}}';

      // WHEN: Validating the template
      const validation = templateEngine.validateTemplate(invalidTemplate);

      // THEN: Should report validation errors
      expect(validation.valid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
      expect(validation.errors[0]).toContain('unclosed block');
    });

    it('should pass validation for valid templates', async () => {
      // GIVEN: A valid Handlebars template
      const validTemplate = 'Hello {{project_name}}{{#if strict}}! Strict mode{{/if}}';

      // WHEN: Validating the template
      const validation = templateEngine.validateTemplate(validTemplate);

      // THEN: Should pass validation
      expect(validation.valid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('should validate template structure', async () => {
      // GIVEN: A template with invalid structure
      const invalidTemplate = {
        // Missing required fields like 'files'
        name: 'invalid-template',
      };

      // WHEN: Validating template structure
      const validation = templateEngine.validateTemplateStructure(invalidTemplate);

      // THEN: Should report structure errors
      expect(validation.valid).toBe(false);
      expect(validation.errors).toContain('Missing required property: files');
    });
  });

  describe('AC 5: Generates files with correct content and formatting', () => {
    it('should generate files with rendered content', async () => {
      // GIVEN: A project template and context
      const projectTemplate: ProjectTemplate = {
        name: 'test-template',
        files: [
          {
            path: 'package.json',
            template:
              '{"name": "{{project_name}}", "version": "1.0.0", "description": "{{description}}"}',
          },
          {
            path: 'README.md',
            template: '# {{project_name}}\n\n{{description}}',
          },
        ],
      };

      const context: TemplateContext = {
        project_name: 'my-project',
        description: 'A test project',
      };

      // WHEN: Processing the project template
      const generatedFiles = await templateEngine.processProjectTemplate(projectTemplate, context);

      // THEN: Should generate files with correct content
      expect(generatedFiles).toHaveLength(2);

      const packageJson = generatedFiles.find((f) => f.path === 'package.json');
      expect(packageJson).toBeDefined();
      expect(packageJson?.content).toBe(
        '{"name": "my-project", "version": "1.0.0", "description": "A test project"}'
      );

      const readme = generatedFiles.find((f) => f.path === 'README.md');
      expect(readme).toBeDefined();
      expect(readme?.content).toBe('# my-project\n\nA test project');
    });

    it('should preserve formatting and indentation in generated files', async () => {
      // GIVEN: A template with specific formatting
      const projectTemplate: ProjectTemplate = {
        name: 'formatted-template',
        files: [
          {
            path: 'tsconfig.json',
            template: `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    {{#if strict}}
    "strict": true,
    {{/if}}
    "outDir": "./dist"
  }
}`,
          },
        ],
      };

      const context: TemplateContext = {
        strict: true,
      };

      // WHEN: Processing the template
      const generatedFiles = await templateEngine.processProjectTemplate(projectTemplate, context);

      // THEN: Should preserve original formatting
      const tsconfig = generatedFiles[0];
      expect(tsconfig.content).toContain('  "compilerOptions": {');
      expect(tsconfig.content).toContain('    "strict": true,');
      expect(tsconfig.content).toMatch(/\n {4}"outDir": "\.\/dist"\n/);
    });
  });

  describe('AC 6: Template catalog supports future tech stack additions', () => {
    it('should support multiple tech stack templates', async () => {
      // GIVEN: Multiple tech stack directories
      const reactDir = join(tempDir, 'templates', 'react-typescript');
      await mkdir(reactDir, { recursive: true });

      await writeFile(
        join(templatesDir, 'typescript-bun-cli.json'),
        JSON.stringify({ name: 'typescript-bun-cli' })
      );
      await writeFile(
        join(reactDir, 'react-typescript.json'),
        JSON.stringify({ name: 'react-typescript' })
      );

      // WHEN: Creating engine for specific tech stack
      const bunEngine = new HandlebarsTemplateEngine(templatesDir);
      const reactEngine = new HandlebarsTemplateEngine(reactDir);

      // THEN: Should load templates from respective directories
      const bunTemplates = await bunEngine.getAvailableTemplates();
      const reactTemplates = await reactEngine.getAvailableTemplates();

      expect(bunTemplates).toContain('typescript-bun-cli');
      expect(reactTemplates).toContain('react-typescript');
    });

    it('should be extensible for new template types', async () => {
      // GIVEN: A new template type with custom structure
      const customTemplate = {
        name: 'custom-stack',
        version: '1.0.0',
        files: [
          {
            path: 'src/index.{{language}}',
            template: 'console.log("Hello {{project_name}}!");',
          },
        ],
        helpers: ['customFormat'],
      };

      await writeFile(
        join(templatesDir, 'custom-stack.json'),
        JSON.stringify(customTemplate, null, 2)
      );

      // WHEN: Loading the custom template
      const template = await templateEngine.loadTemplate('custom-stack');

      // THEN: Should support the new structure
      expect(template.files).toHaveLength(1);
      expect(template.files[0].path).toBe('src/index.{{language}}');
    });
  });

  describe('AC 7: Error handling for missing/invalid templates', () => {
    it('should handle missing template directory gracefully', async () => {
      // GIVEN: A non-existent template directory
      const nonexistentDir = join(tempDir, 'nonexistent');
      const engine = new HandlebarsTemplateEngine(nonexistentDir);

      // WHEN: Trying to get available templates
      const templates = await engine.getAvailableTemplates();

      // THEN: Should return empty array without crashing
      expect(templates).toHaveLength(0);
    });

    it('should provide clear error messages for invalid templates', async () => {
      // GIVEN: An invalid JSON template file
      await writeFile(
        join(templatesDir, 'invalid.json'),
        '{"invalid": json content}' // Invalid JSON
      );

      // WHEN: Trying to load the invalid template
      const loadPromise = templateEngine.loadTemplate('invalid');

      // THEN: Should provide clear error message
      await expect(loadPromise).rejects.toThrow(/invalid json/i);
    });

    it('should handle template rendering errors gracefully', async () => {
      // GIVEN: A template with invalid Handlebars syntax
      const template = 'Hello {{{unbalanced braces';

      // WHEN: Trying to render the template
      const renderPromise = templateEngine.renderTemplate(template, {});

      // THEN: Should handle error gracefully
      await expect(renderPromise).rejects.toThrow();
    });
  });
});
