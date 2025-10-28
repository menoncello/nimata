/**
 * Template Manager Unit Tests
 */
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { TemplateManager } from '../../src/template-engine/template-manager.js';

describe('TemplateManager', () => {
  let templateManager: TemplateManager;
  let testDir: string;

  beforeEach(async () => {
    testDir = join(tmpdir(), `template-manager-test-${Date.now()}`);
    templateManager = new TemplateManager(testDir);

    // Create test directory structure
    await setupTestDirectory();
  });

  afterEach(async () => {
    // Clean up test directory
    const fs = await import('node:fs/promises');
    try {
      await fs.rm(testDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  });

  async function setupTestDirectory(): Promise<void> {
    const fs = await import('node:fs/promises');

    // Create directory structure
    await fs.mkdir(testDir, { recursive: true });
    await fs.mkdir(join(testDir, 'typescript'), { recursive: true });

    // Create Handlebars template files
    await fs.writeFile(
      join(testDir, 'typescript', 'package.json.hbs'),
      `{
  "name": "{{project_name}}",
  "version": "1.0.0",
  "description": "{{description}}",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js"
  }
}`
    );

    await fs.writeFile(
      join(testDir, 'typescript', 'index.ts.hbs'),
      `/**
 * {{project_name}} - {{description}}
 */

export class {{pascal_case project_name}} {
  constructor(private name: string) {}

  greet(): string {
    return \`Hello, \${this.name}!\`;
  }
}`
    );

    // Create template with metadata
    await fs.writeFile(
      join(testDir, 'README.md.hbs'),
      `---
name: README Template
description: Project README template
category: documentation
tags: [readme, documentation]
---

# {{project_name}}

{{description}}

## Installation

\`\`\`bash
npm install {{project_name}}
\`\`\`

## Usage

\`\`\`typescript
import {{pascal_case project_name}} from '{{project_name}}';
const instance = new {{pascal_case project_name}}('{{project_name}}');
console.log(instance.greet());
\`\`\``
    );
  }

  describe('Template Discovery', () => {
    it('should discover all template files', async () => {
      const templates = await templateManager.discoverTemplates();

      expect(templates.length).toBeGreaterThan(0);

      // Verify basic template properties
      for (const template of templates) {
        expect(template.id).toBeDefined();
        expect(template.name).toBeDefined();
        expect(template.description).toBeDefined();
        expect(template.filePath).toBeDefined();
        expect(template.category).toBeDefined();
        expect(Array.isArray(template.tags)).toBe(true);
        expect(Array.isArray(template.variables)).toBe(true);
      }
    });

    it('should extract metadata from templates', async () => {
      const templates = await templateManager.discoverTemplates();
      const readmeTemplate = templates.find((t) => t.name === 'README Template');

      expect(readmeTemplate).toBeDefined();
      if (readmeTemplate) {
        expect(readmeTemplate.description).toBe('Project README template');
        expect(readmeTemplate.category).toBe('documentation');
        expect(readmeTemplate.tags).toContain('readme');
        expect(readmeTemplate.tags).toContain('documentation');
      }
    });

    it('should extract variables from templates', async () => {
      const templates = await templateManager.discoverTemplates();
      const packageTemplate = templates.find((t) => t.filePath.includes('package.json.hbs'));

      expect(packageTemplate).toBeDefined();
      if (packageTemplate) {
        expect(packageTemplate.variables).toContain('project_name');
        expect(packageTemplate.variables).toContain('description');
      }
    });

    it('should infer categories from file paths', async () => {
      const templates = await templateManager.discoverTemplates();
      const srcTemplate = templates.find((t) => t.filePath.includes('index.ts.hbs'));
      expect(srcTemplate?.category).toBe('general'); // TypeScript file in typescript folder
    });
  });

  describe('Template Rendering', () => {
    beforeEach(async () => {
      await templateManager.discoverTemplates();
    });

    it('should render simple templates', async () => {
      const context = {
        project_name: 'test-project',
        description: 'A test project',
      };

      const result = await templateManager.renderTemplate('Hello {{project_name}}!', context);
      expect(result).toBe('Hello test-project!');
    });

    it('should render templates with helpers', async () => {
      const context = {
        project_name: 'my-test-project',
        description: 'A test project',
      };

      const result = await templateManager.renderTemplate('{{pascal_case project_name}}', context);
      expect(result).toBe('MyTestProject');
    });

    it('should handle conditional templates', async () => {
      const context = {
        project_name: 'test-project',
        description: 'A test project',
        author: 'Test Author',
      };

      const template = `
{{#ifExists author}}
Author: {{author}}
{{else}}
No author
{{/ifExists}}
Project: {{project_name}}
      `.trim();

      const result = await templateManager.renderTemplate(template, context);
      expect(result).toContain('Author: Test Author');
      expect(result).toContain('Project: test-project');
    });

    it('should validate template syntax', () => {
      const validTemplate = 'Hello {{name}}!';
      const invalidTemplate = 'Hello {{name}!';

      const validResult = templateManager.validateTemplate(validTemplate);
      const invalidResult = templateManager.validateTemplate(invalidTemplate);

      expect(validResult.valid).toBe(true);
      expect(validResult.errors).toEqual([]);

      expect(invalidResult.valid).toBe(false);
      expect(invalidResult.errors.length).toBeGreaterThan(0);
    });
  });

  describe('Template Search and Filtering', () => {
    beforeEach(async () => {
      await templateManager.discoverTemplates();
    });

    it('should search templates by query', async () => {
      const results = templateManager.searchTemplates('readme');
      expect(results.length).toBeGreaterThan(0);

      const readmeTemplate = results.find((t) => t.name === 'README Template');
      expect(readmeTemplate).toBeDefined();
    });

    it('should get templates by category', async () => {
      const docsTemplates = templateManager.getTemplatesByCategory('documentation');
      expect(docsTemplates.length).toBeGreaterThan(0);

      const generalTemplates = templateManager.getTemplatesByCategory('general');
      expect(generalTemplates.length).toBeGreaterThan(0);
    });

    it('should get templates by tag', async () => {
      const readmeTemplates = templateManager.getTemplatesByTag('readme');
      expect(readmeTemplates.length).toBeGreaterThan(0);
    });

    it('should get all templates', async () => {
      const allTemplates = templateManager.getAllTemplates();
      expect(allTemplates.length).toBeGreaterThan(0);

      for (const template of allTemplates) {
        expect(template.id).toBeDefined();
        expect(template.name).toBeDefined();
      }
    });

    it('should get template metadata by ID', async () => {
      const templates = templateManager.getAllTemplates();
      expect(templates.length).toBeGreaterThan(0);

      const firstTemplate = templates[0];
      const metadata = templateManager.getTemplateMetadata(firstTemplate.id);

      expect(metadata).toBeDefined();
      expect(metadata?.id).toBe(firstTemplate.id);
      expect(metadata?.name).toBe(firstTemplate.name);
    });
  });

  describe('Template Loading', () => {
    beforeEach(async () => {
      await templateManager.discoverTemplates();
    });

    it('should load template by name', async () => {
      // Note: This requires the template to be in the templates directory
      // For this test, we'll create a simple template file
      const fs = await import('node:fs/promises');
      const testTemplatePath = join(testDir, 'test-template.hbs');
      await fs.writeFile(testTemplatePath, 'Hello {{name}}!');

      const template = await templateManager.loadTemplate('test-template.hbs');

      expect(template.name).toBe('test-template.hbs');
      expect(template.content).toBe('Hello {{name}}!');
      expect(template.extractedVariables).toContain('name');
    });

    it('should throw error for non-existent template', async () => {
      await expect(templateManager.loadTemplate('non-existent.hbs')).rejects.toThrow();
    });
  });

  describe('Helper Registration', () => {
    it('should register custom helpers', async () => {
      templateManager.registerHelper('uppercase', (str: string) => str.toUpperCase());

      const result = await templateManager.renderTemplate('{{uppercase name}}', { name: 'test' });
      expect(result).toBe('TEST');
    });

    it('should work with built-in helpers', async () => {
      const result = await templateManager.renderTemplate('{{camelCase "my-test-string"}}', {});
      expect(result).toBe('myTestString');
    });
  });

  describe('Caching', () => {
    it('should cache compiled templates', async () => {
      const template = 'Hello {{name}}!';
      const context = { name: 'test' };

      // First render
      const result1 = await templateManager.renderTemplate(template, context);
      const stats1 = templateManager.getCacheStats();

      // Second render (should use cache)
      const result2 = await templateManager.renderTemplate(template, context);
      const stats2 = templateManager.getCacheStats();

      expect(result1).toBe(result2);
      expect(stats1.size).toBe(1);
      expect(stats2.size).toBe(1); // Should not increase on cache hit
    });

    it('should clear cache', async () => {
      await templateManager.renderTemplate('Hello {{name}}!', { name: 'test' });

      let stats = templateManager.getCacheStats();
      expect(stats.size).toBe(1);

      templateManager.clearCache();

      stats = templateManager.getCacheStats();
      expect(stats.size).toBe(0);
    });
  });

  describe('Available Templates', () => {
    it('should return list of available template names', async () => {
      await templateManager.discoverTemplates();

      const templateNames = await templateManager.getAvailableTemplates();
      expect(Array.isArray(templateNames)).toBe(true);
      expect(templateNames.length).toBeGreaterThan(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid template syntax gracefully', async () => {
      const invalidTemplate = 'Hello {{name}!';
      const context = { name: 'test' };

      await expect(templateManager.renderTemplate(invalidTemplate, context)).rejects.toThrow();
    });

    it('should handle missing variables gracefully', async () => {
      const template = 'Hello {{missing_var}}!';
      const context = {};

      // Should render with empty variable
      const result = await templateManager.renderTemplate(template, context);
      expect(result).toBe('Hello !');
    });
  });
});
