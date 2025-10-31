/**
 * Integration Tests for Template Loading
 *
 * Tests loading templates from the templates/typescript-bun-cli/ directory
 */
import { describe, test, expect, beforeEach, afterEach } from 'bun:test';
import fs from 'node:fs/promises';
import path from 'node:path';
import { HandlebarsTemplateEngine } from '../../src/template-engine-handlebars.js';

describe('Template Loading Integration', () => {
  let templateEngine: HandlebarsTemplateEngine;
  let tempTemplatesDir: string;

  beforeEach(async () => {
    // Create the complete template directory structure
    tempTemplatesDir = path.join(process.cwd(), 'temp-templates-integration');
    await fs.mkdir(path.join(tempTemplatesDir, 'typescript-bun-cli', 'base'), { recursive: true });
    await fs.mkdir(path.join(tempTemplatesDir, 'typescript-bun-cli', 'src'), { recursive: true });
    await fs.mkdir(path.join(tempTemplatesDir, 'typescript-bun-cli', 'config'), {
      recursive: true,
    });

    templateEngine = new HandlebarsTemplateEngine(tempTemplatesDir);
  });

  afterEach(async () => {
    // Clean up temporary directory
    try {
      await fs.rm(tempTemplatesDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  });

  describe('Loading from templates/typescript-bun-cli/ directory', () => {
    test('should load template from correct directory structure', async () => {
      const testTemplate = {
        name: 'test-cli-project',
        description: 'Test CLI project template',
        version: '1.0.0',
        supportedProjectTypes: ['cli'],
        variables: [
          {
            name: 'project_name',
            type: 'string' as const,
            description: 'Project name',
            required: true,
          },
          {
            name: 'description',
            type: 'string' as const,
            description: 'Project description',
            required: false,
            default: 'A CLI project',
          },
        ],
        files: [
          {
            path: 'package.json',
            template:
              '{\n  "name": "{{project_name}}",\n  "description": "{{description}}",\n  "type": "module"\n}',
          },
          {
            path: 'src/index.ts',
            template: 'console.log("{{description}}");',
          },
        ],
      };

      const templatePath = path.join(
        tempTemplatesDir,
        'typescript-bun-cli',
        'test-cli-project.json'
      );
      await fs.writeFile(templatePath, JSON.stringify(testTemplate, null, 2));

      const loadedTemplate = await templateEngine.loadTemplate('test-cli-project');

      expect(loadedTemplate.name).toBe('test-cli-project');
      expect(loadedTemplate.supportedProjectTypes).toContain('cli');
      expect(loadedTemplate.variables).toHaveLength(2);
      expect(loadedTemplate.files).toHaveLength(2);
    });

    test('should throw error when template not found in correct directory', async () => {
      await expect(templateEngine.loadTemplate('nonexistent-template')).rejects.toThrow(
        /not found at/
      );
    });

    test('should validate template structure from directory', async () => {
      const invalidTemplate = {
        name: 'invalid-template',
        // Missing required fields
        files: 'not-an-array',
      };

      const templatePath = path.join(
        tempTemplatesDir,
        'typescript-bun-cli',
        'invalid-template.json'
      );
      await fs.writeFile(templatePath, JSON.stringify(invalidTemplate));

      await expect(templateEngine.loadTemplate('invalid-template')).rejects.toThrow(
        'Invalid template structure'
      );
    });
  });

  describe('Template Directory Structure', () => {
    test('should discover all templates in typescript-bun-cli directory', async () => {
      // Create multiple template files
      const templates = [
        { name: 'basic-cli', description: 'Basic CLI template' },
        { name: 'advanced-cli', description: 'Advanced CLI template' },
        { name: 'web-app', description: 'Web application template' },
      ];

      for (const template of templates) {
        const templateData = {
          name: template.name,
          description: template.description,
          version: '1.0.0',
          supportedProjectTypes: ['cli'],
          variables: [],
          files: [],
        };

        const templatePath = path.join(
          tempTemplatesDir,
          'typescript-bun-cli',
          `${template.name}.json`
        );
        await fs.writeFile(templatePath, JSON.stringify(templateData, null, 2));
      }

      const availableTemplates = await templateEngine.getAvailableTemplates();

      expect(availableTemplates).toHaveLength(3);
      expect(availableTemplates).toContain('basic-cli');
      expect(availableTemplates).toContain('advanced-cli');
      expect(availableTemplates).toContain('web-app');
    });

    test('should ignore non-JSON files in template directory', async () => {
      // Create various files
      await fs.writeFile(
        path.join(tempTemplatesDir, 'typescript-bun-cli', 'valid-template.json'),
        '{}'
      );
      await fs.writeFile(
        path.join(tempTemplatesDir, 'typescript-bun-cli', 'readme.md'),
        '# Readme'
      );
      await fs.writeFile(
        path.join(tempTemplatesDir, 'typescript-bun-cli', 'config.xml'),
        '<config></config>'
      );

      const availableTemplates = await templateEngine.getAvailableTemplates();

      expect(availableTemplates).toHaveLength(1);
      expect(availableTemplates[0]).toBe('valid-template');
    });

    test('should handle empty template directory', async () => {
      // Directory exists but is empty
      const availableTemplates = await templateEngine.getAvailableTemplates();

      expect(availableTemplates).toHaveLength(0);
    });
  });

  describe('Template Rendering Integration', () => {
    test('should render templates loaded from directory', async () => {
      const complexTemplate = {
        name: 'complex-project',
        description: 'Complex project template',
        version: '1.0.0',
        supportedProjectTypes: ['cli'],
        variables: [
          {
            name: 'project_name',
            type: 'string' as const,
            description: 'Project name',
            required: true,
          },
          {
            name: 'is_strict',
            type: 'boolean' as const,
            description: 'Strict mode',
            required: false,
            default: false,
          },
          {
            name: 'features',
            type: 'select' as const,
            description: 'Features to include',
            required: true,
            default: 'basic',
            options: [
              { label: 'Basic', value: 'basic' },
              { label: 'Advanced', value: 'advanced' },
            ],
          },
        ],
        files: [
          {
            path: 'package.json',
            template: `{
  "name": "{{project_name}}",
  "description": "Generated on {{year}}",
  "strict": {{#if is_strict}}true{{else}}false{{/if}}
}`,
          },
          {
            path: 'src/config.ts',
            template: `export const config = {
  strict: {{#if is_strict}}true{{else}}false{{/if}},
  features: "{{features}}"
};`,
          },
          {
            path: 'README.md',
            template: `# {{uppercase project_name}}

{{#if is_strict}}
## Strict Mode Enabled
{{/if}}

Generated: {{now}}
`,
          },
        ],
      };

      const templatePath = path.join(
        tempTemplatesDir,
        'typescript-bun-cli',
        'complex-project.json'
      );
      await fs.writeFile(templatePath, JSON.stringify(complexTemplate, null, 2));

      const loadedTemplate = await templateEngine.loadTemplate('complex-project');
      const context = {
        project_name: 'my-cli-tool',
        is_strict: true,
        features: 'advanced',
      };

      const generatedFiles = await templateEngine.processProjectTemplate(loadedTemplate, context);

      expect(generatedFiles).toHaveLength(3);

      const packageJson = generatedFiles.find((f) => f.path === 'package.json');
      expect(packageJson?.content).toContain('"name": "my-cli-tool"');
      expect(packageJson?.content).toContain('"strict": true');

      const configTs = generatedFiles.find((f) => f.path === 'src/config.ts');
      expect(configTs?.content).toContain('strict: true');
      expect(configTs?.content).toContain('features: "advanced"');

      const readme = generatedFiles.find((f) => f.path === 'README.md');
      expect(readme?.content).toContain('# MY-CLI-TOOL');
      expect(readme?.content).toContain('## Strict Mode Enabled');
      expect(readme?.content).toMatch(/Generated: \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/);
    });
  });

  describe('Performance Requirements', () => {
    test('should load templates within 100ms', async () => {
      const testTemplate = {
        name: 'performance-test',
        description: 'Performance test template',
        version: '1.0.0',
        supportedProjectTypes: ['cli'],
        variables: [],
        files: [],
      };

      const templatePath = path.join(
        tempTemplatesDir,
        'typescript-bun-cli',
        'performance-test.json'
      );
      await fs.writeFile(templatePath, JSON.stringify(testTemplate, null, 2));

      const startTime = performance.now();
      await templateEngine.loadTemplate('performance-test');
      const endTime = performance.now();

      const loadTime = endTime - startTime;
      expect(loadTime).toBeLessThan(100); // Less than 100ms
    });

    test('should render templates within 10ms for cached templates', async () => {
      // Create and load a template to get it cached
      const testTemplate = {
        name: 'render-performance-test',
        description: 'Render performance test',
        version: '1.0.0',
        supportedProjectTypes: ['cli'],
        variables: [],
        files: [
          {
            path: 'test.txt',
            template: 'Hello {{name}}! {{#if show}}Visible{{else}}Hidden{{/if}}',
          },
        ],
      };

      const templatePath = path.join(
        tempTemplatesDir,
        'typescript-bun-cli',
        'render-performance-test.json'
      );
      await fs.writeFile(templatePath, JSON.stringify(testTemplate, null, 2));

      const context = { name: 'World', show: true };

      // First render to cache the template
      await templateEngine.renderTemplate('Hello {{name}}!', context);

      // Now measure cached render time
      const startTime = performance.now();
      await templateEngine.renderTemplate('Hello {{name}}!', context);
      const endTime = performance.now();

      const renderTime = endTime - startTime;
      expect(renderTime).toBeLessThan(10); // Less than 10ms for cached templates
    });
  });

  describe('Error Handling Integration', () => {
    test('should handle malformed JSON template files', async () => {
      const malformedJson = '{ "name": "test", invalid: json }';
      const templatePath = path.join(tempTemplatesDir, 'typescript-bun-cli', 'malformed.json');
      await fs.writeFile(templatePath, malformedJson);

      await expect(templateEngine.loadTemplate('malformed')).rejects.toThrow();
    });

    test('should handle missing required template fields', async () => {
      const incompleteTemplate = {
        name: 'incomplete',
        description: 'Missing required fields',
        // Missing: version, supportedProjectTypes, variables, files
      };

      const templatePath = path.join(tempTemplatesDir, 'typescript-bun-cli', 'incomplete.json');
      await fs.writeFile(templatePath, JSON.stringify(incompleteTemplate));

      await expect(templateEngine.loadTemplate('incomplete')).rejects.toThrow(
        'Invalid template structure'
      );
    });

    test('should handle file system permissions issues', async () => {
      // Create directory with restricted permissions (simulated)
      const restrictedDir = path.join(tempTemplatesDir, 'typescript-bun-cli-restricted');
      await fs.mkdir(restrictedDir, { recursive: true });

      const restrictedEngine = new HandlebarsTemplateEngine(restrictedDir);

      // Should not crash, should return empty array
      const templates = await restrictedEngine.getAvailableTemplates();
      expect(templates).toHaveLength(0);
    });
  });
});
