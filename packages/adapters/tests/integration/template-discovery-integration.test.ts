/**
 * Template Discovery Integration Tests
 */
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type { TemplateCatalogConfig } from '@nimata/core';
import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { TemplateDiscovery } from '../../src/template-engine/template-discovery.js';

describe('TemplateDiscovery Integration', () => {
  let discovery: TemplateDiscovery;
  let testDir: string;

  beforeEach(async () => {
    testDir = join(tmpdir(), `template-discovery-test-${Date.now()}`);

    const config: TemplateCatalogConfig = {
      templatesDirectory: testDir,
      autoDiscovery: true,
      discoveryPatterns: ['**/*.hbs', '**/*.json', '**/*.yaml', '**/*.yml'],
      validationRules: [],
      cache: {
        enabled: true,
        ttl: 3600,
        maxSize: 100,
      },
      extensibility: {
        enabled: true,
        autoRegisterNewTypes: true,
        customValidators: [],
      },
    };

    discovery = new TemplateDiscovery(config);

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
    await fs.mkdir(join(testDir, 'typescript', 'src'), { recursive: true });
    await fs.mkdir(join(testDir, 'bun'), { recursive: true });
    await fs.mkdir(join(testDir, 'config'), { recursive: true });

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
  },
  "dependencies": {},
  "devDependencies": {
    "typescript": "^5.0.0"
  }
}`
    );

    await fs.writeFile(
      join(testDir, 'typescript', 'src', 'index.ts.hbs'),
      `/**
 * {{project_name}} - {{description}}
 * Generated on: {{current_date}}
 * Quality level: {{quality_level}}
 */

export class {{pascal_case project_name}} {
  private readonly name: string;

  constructor(name: string) {
    this.name = name;
  }

  public greet(): string {
    return \`Hello, \${this.name}!\`;
  }
}

export default {{pascal_case project_name}};`
    );

    await fs.writeFile(
      join(testDir, 'bun', 'index.ts.hbs'),
      `#!/usr/bin/env bun
/**
 * {{project_name}} - {{description}}
 * Bun-based CLI application
 */

{{#if is_strict}}
console.log('Running in strict mode');
{{/if}}

console.log('{{project_name}}: {{description}}');

const args = process.argv.slice(2);
if (args.length > 0) {
  console.log('Arguments:', args.join(', '));
} else {
  console.log('Usage: bun run index.ts [args...]');
}`
    );

    // Create JSON template files
    await fs.writeFile(
      join(testDir, 'config', 'tsconfig.json'),
      `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}`
    );

    // Create YAML template files
    await fs.writeFile(
      join(testDir, 'github-actions.yml'),
      `---
name: CI/CD Pipeline
on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18.x, 20.x]

    steps:
    - uses: actions/checkout@v3

    - name: Use Node.js $\{ matrix.node-version \}
      uses: actions/setup-node@v3
      with:
        node-version: $\{ matrix.node-version \}
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Run tests
      run: npm test

    - name: Build project
      run: npm run build`
    );

    // Create files with frontmatter metadata
    await fs.writeFile(
      join(testDir, 'typescript', 'README.md.hbs'),
      `---
name: TypeScript README Template
description: README template for TypeScript projects
category: documentation
tags: [readme, typescript, documentation]
supportedProjectTypes: [cli, library]
recommendedQualityLevels: [prototype, production]
author: Nimata Team
version: 1.0.0
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
\`\`\`

## Features

{{#if features}}
{{#each features}}
- {{name}}: {{description}}
{{/each}}
{{else}}
- Coming soon!
{{/if}}

## License

MIT`
    );
  }

  describe('Template Discovery', () => {
    it('should discover all template files', async () => {
      const templates = await discovery.discover(testDir);

      expect(templates.length).toBeGreaterThan(0);

      // Verify basic template properties
      for (const template of templates) {
        expect(template.id).toBeDefined();
        expect(template.name).toBeDefined();
        expect(template.description).toBeDefined();
        expect(template.version).toBeDefined();
        expect(template.filePath).toBeDefined();
        expect(template.category).toBeDefined();
        expect(template.supportedProjectTypes).toBeDefined();
        expect(template.recommendedQualityLevels).toBeDefined();
        expect(template.validation).toBeDefined();
        expect(template.usageStats).toBeDefined();
      }
    });

    it('should extract metadata from Handlebars templates with comments', async () => {
      const templates = await discovery.discover(testDir);
      const readmeTemplate = templates.find((t) => t.filePath.includes('README.md.hbs'));

      expect(readmeTemplate).toBeDefined();
      if (readmeTemplate) {
        expect(readmeTemplate.name).toBe('TypeScript README Template');
        expect(readmeTemplate.description).toBe('README template for TypeScript projects');
        expect(readmeTemplate.category).toBe('documentation');
        expect(readmeTemplate.tags).toContain('readme');
        expect(readmeTemplate.tags).toContain('typescript');
        expect(readmeTemplate.supportedProjectTypes).toContain('cli');
        expect(readmeTemplate.supportedProjectTypes).toContain('library');
        expect(readmeTemplate.author).toBe('Nimata Team');
        expect(readmeTemplate.version).toBe('1.0.0');
      }
    });

    it('should infer categories from file paths', async () => {
      const templates = await discovery.discover(testDir);

      const configTemplate = templates.find((t) => t.filePath.includes('tsconfig.json'));
      expect(configTemplate?.category).toBe('configuration');

      const srcTemplate = templates.find((t) => t.filePath.includes('src/index.ts.hbs'));
      expect(srcTemplate?.category).toBe('source');

      const readmeTemplate = templates.find((t) => t.filePath.includes('README.md.hbs'));
      expect(readmeTemplate?.category).toBe('documentation');
    });

    it('should handle different file types', async () => {
      const templates = await discovery.discover(testDir);

      // Should discover Handlebars files
      const hbsTemplates = templates.filter((t) => t.filePath.endsWith('.hbs'));
      expect(hbsTemplates.length).toBeGreaterThan(0);

      // Should discover JSON files
      const jsonTemplates = templates.filter((t) => t.filePath.endsWith('.json'));
      expect(jsonTemplates.length).toBeGreaterThan(0);

      // Should discover YAML files
      const yamlTemplates = templates.filter((t) => t.filePath.includes('.yml'));
      expect(yamlTemplates.length).toBeGreaterThan(0);
    });

    it('should validate template content', async () => {
      const templates = await discovery.discover(testDir);

      for (const template of templates) {
        expect(template.validation.valid).toBe(true);
        expect(template.validation.errors).toEqual([]);
        expect(template.validation.timestamp).toBeInstanceOf(Date);
        expect(template.validation.validator).toBe('TemplateDiscovery');
      }
    });

    it('should calculate template size', async () => {
      const templates = await discovery.discover(testDir);

      for (const template of templates) {
        expect(template.size).toBeGreaterThan(0);
        expect(typeof template.size).toBe('number');
      }
    });

    it('should set last modified time', async () => {
      const templates = await discovery.discover(testDir);

      for (const template of templates) {
        expect(template.lastModified).toBeInstanceOf(Date);
        expect(template.lastModified.getTime()).toBeGreaterThan(0);
      }
    });
  });

  describe('Template Indexing', () => {
    it('should index templates for fast search', async () => {
      const templates = await discovery.discover(testDir);
      await discovery.index(templates);

      const stats = await (discovery as any).getIndexStats();
      expect(stats.totalTemplates).toBe(templates.length);
      expect(stats.categories.length).toBeGreaterThan(0);
      expect(stats.projectTypes.length).toBeGreaterThan(0);
      expect(stats.indexSize).toBeGreaterThan(0);
    });

    it('should search templates by query', async () => {
      const templates = await discovery.discover(testDir);
      await discovery.index(templates);

      // Search for 'typescript'
      const tsResults = await (discovery as any).searchByQuery('typescript');
      expect(tsResults.length).toBeGreaterThan(0);

      // Search for 'readme'
      const readmeResults = await (discovery as any).searchByQuery('readme');
      expect(readmeResults.length).toBeGreaterThan(0);

      // Search for non-existent term
      const noResults = await (discovery as any).searchByQuery('nonexistentterm12345');
      expect(noResults.length).toBe(0);
    });

    it('should get templates by category', async () => {
      const templates = await discovery.discover(testDir);
      await discovery.index(templates);

      const documentationTemplates = await (discovery as any).getByCategory('documentation');
      expect(documentationTemplates.length).toBeGreaterThan(0);

      const configurationTemplates = await (discovery as any).getByCategory('configuration');
      expect(configurationTemplates.length).toBeGreaterThan(0);
    });

    it('should get templates by project type', async () => {
      const templates = await discovery.discover(testDir);
      await discovery.index(templates);

      const cliTemplates = await (discovery as any).getByProjectType('cli');
      expect(cliTemplates.length).toBeGreaterThan(0);

      const libraryTemplates = await (discovery as any).getByProjectType('library');
      expect(libraryTemplates.length).toBeGreaterThan(0);
    });

    it('should get templates by tag', async () => {
      const templates = await discovery.discover(testDir);
      await discovery.index(templates);

      const typescriptTemplates = await (discovery as any).getByTag('typescript');
      expect(typescriptTemplates.length).toBeGreaterThan(0);

      const documentationTemplates = await (discovery as any).getByTag('documentation');
      expect(documentationTemplates.length).toBeGreaterThan(0);
    });

    it('should get templates by author', async () => {
      const templates = await discovery.discover(testDir);
      await discovery.index(templates);

      const nimataTemplates = await (discovery as any).getByAuthor('Nimata Team');
      expect(nimataTemplates.length).toBeGreaterThan(0);
    });
  });

  describe('Template Scanning', () => {
    it('should detect new templates', async () => {
      const initialTemplates = await discovery.discover(testDir);
      await discovery.index(initialTemplates);

      // Add a new template file
      const fs = await import('node:fs/promises');
      const newTemplatePath = join(testDir, 'new-template.hbs');

      // Small delay to ensure different timestamp
      await new Promise((resolve) => setTimeout(resolve, 10));

      await fs.writeFile(newTemplatePath, 'Hello {{name}}!');

      // Small delay to ensure file system timestamp is updated
      await new Promise((resolve) => setTimeout(resolve, 10));

      const scanResult = await discovery.scan(testDir);

      expect(scanResult.newTemplates.length).toBe(1);
      expect(scanResult.modifiedTemplates.length).toBe(0);
      expect(scanResult.deletedTemplates.length).toBe(0);

      const newTemplate = scanResult.newTemplates[0];
      expect(newTemplate.filePath).toContain('new-template.hbs');
      expect(newTemplate.name).toBe('new-template');
    });

    it('should detect modified templates', async () => {
      const initialTemplates = await discovery.discover(testDir);
      await discovery.index(initialTemplates);

      // Modify an existing template
      const fs = await import('node:fs/promises');
      const modifyPath = join(testDir, 'typescript', 'package.json.hbs');

      // Small delay to ensure different timestamp
      await new Promise((resolve) => setTimeout(resolve, 10));

      await fs.writeFile(modifyPath, '{ "modified": true }');

      // Small delay to ensure file system timestamp is updated
      await new Promise((resolve) => setTimeout(resolve, 10));

      const scanResult = await discovery.scan(testDir);

      expect(scanResult.newTemplates.length).toBe(0);
      expect(scanResult.modifiedTemplates.length).toBe(1);
      expect(scanResult.deletedTemplates.length).toBe(0);

      const modifiedTemplate = scanResult.modifiedTemplates[0];
      expect(modifiedTemplate.filePath).toContain('package.json.hbs');
    });

    it('should detect deleted templates', async () => {
      const initialTemplates = await discovery.discover(testDir);
      await discovery.index(initialTemplates);

      // Delete a template file
      const fs = await import('node:fs/promises');
      const deletePath = join(testDir, 'config', 'tsconfig.json');
      await fs.unlink(deletePath);

      const scanResult = await discovery.scan(testDir);

      expect(scanResult.newTemplates.length).toBe(0);
      expect(scanResult.modifiedTemplates.length).toBe(0);
      expect(scanResult.deletedTemplates.length).toBe(1);
    });

    it('should handle multiple changes in one scan', async () => {
      const initialTemplates = await discovery.discover(testDir);
      await discovery.index(initialTemplates);

      const fs = await import('node:fs/promises');

      // Add new template
      const newTemplatePath = join(testDir, 'added.hbs');
      await fs.writeFile(newTemplatePath, 'Added template');

      // Ensure the file is actually newer by setting modification time
      const fsSync = await import('node:fs');
      const stats = fsSync.statSync(newTemplatePath);
      const futureTime = new Date(Date.now() + 1000);
      fsSync.utimesSync(newTemplatePath, stats.atime, futureTime);

      // Longer delay to ensure file timestamps are updated
      await new Promise((resolve) => setTimeout(resolve, 250));

      // Modify existing template
      const modifiedPath = join(testDir, 'bun', 'index.ts.hbs');
      await fs.writeFile(modifiedPath, 'Modified content');

      // Ensure the file is actually newer by setting modification time
      const stats2 = fsSync.statSync(modifiedPath);
      const futureTime2 = new Date(Date.now() + 1000);
      fsSync.utimesSync(modifiedPath, stats2.atime, futureTime2);

      // Longer delay to ensure file timestamps are updated
      await new Promise((resolve) => setTimeout(resolve, 250));

      // Delete existing template
      await fs.unlink(join(testDir, 'config', 'tsconfig.json'));

      // Longer delay to ensure file timestamps are updated
      await new Promise((resolve) => setTimeout(resolve, 250));

      const scanResult = await discovery.scan(testDir);

      expect(scanResult.newTemplates.length).toBe(1);
      expect(scanResult.modifiedTemplates.length).toBe(1);
      expect(scanResult.deletedTemplates.length).toBe(1);
    });
  });

  describe('Error Handling', () => {
    it('should handle non-existent directory', async () => {
      const nonExistentDir = join(testDir, 'non-existent');

      await expect(discovery.discover(nonExistentDir)).rejects.toThrow('Directory not found');
    });

    it('should handle invalid JSON files', async () => {
      const fs = await import('node:fs/promises');
      const invalidJsonPath = join(testDir, 'invalid.json');
      await fs.writeFile(invalidJsonPath, '{ invalid json content }');

      const templates = await discovery.discover(testDir);
      const invalidJsonTemplate = templates.find((t) => t.filePath.includes('invalid.json'));

      expect(invalidJsonTemplate).toBeUndefined(); // Should skip invalid files
    });

    it('should handle permission errors gracefully', async () => {
      // This test is harder to implement reliably across different platforms
      // For now, just ensure it doesn't crash
      const templates = await discovery.discover(testDir);
      expect(Array.isArray(templates)).toBe(true);
    });

    it('should handle empty directory', async () => {
      const emptyDir = join(testDir, 'empty');
      const fs = await import('node:fs/promises');
      await fs.mkdir(emptyDir);

      const templates = await discovery.discover(emptyDir);
      expect(templates).toEqual([]);
    });
  });

  describe('File Watching', () => {
    it('should set up file watcher', async () => {
      let _changeEventFired = false;
      let _changedTemplate: any = null;

      const unwatch = discovery.watch(testDir, (event, template) => {
        _changeEventFired = true;
        _changedTemplate = template;
      });

      expect(typeof unwatch).toBe('function');

      // Cleanup
      unwatch();
    });

    it('should handle watch cleanup', async () => {
      const unwatch1 = discovery.watch(testDir, () => {
        // Empty callback for testing
      });
      const unwatch2 = discovery.watch(testDir, () => {
        // Empty callback for testing
      });

      expect(typeof unwatch1).toBe('function');
      expect(typeof unwatch2).toBe('function');

      // Should not throw when cleaning up
      expect(() => unwatch1()).not.toThrow();
      expect(() => unwatch2()).not.toThrow();
    });
  });
});
