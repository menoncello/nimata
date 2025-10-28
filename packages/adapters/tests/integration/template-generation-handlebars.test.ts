/**
 * Integration Tests - Template Generation Workflow (Story 1.5)
 *
 * Tests the complete template generation workflow using Handlebars
 * from loading templates to generating final files.
 */

import { mkdtemp, rm, writeFile, mkdir } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import type { TemplateContext } from '../../../core/src/interfaces/template-engine.js';
import type { ProjectTemplate } from '../../../core/src/types/project-config.js';
import { HandlebarsTemplateEngine } from '../../src/template-engine-handlebars.js';

describe('Template Generation Integration - Story 1.5', () => {
  let templateEngine: HandlebarsTemplateEngine;
  let templatesDir: string;
  let outputDir: string;
  let tempDir: string;

  beforeEach(async () => {
    // Create temporary directories
    tempDir = await mkdtemp(join(tmpdir(), 'nimata-integration-test-'));
    templatesDir = join(tempDir, 'templates', 'typescript-bun-cli');
    outputDir = join(tempDir, 'output');
    await mkdir(templatesDir, { recursive: true });
    await mkdir(outputDir, { recursive: true });

    templateEngine = new HandlebarsTemplateEngine(templatesDir);
  });

  afterEach(async () => {
    // Clean up
    if (tempDir) {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  describe('Complete Template Generation Workflow', () => {
    it('should generate complete project structure from template', async () => {
      // GIVEN: A complete TypeScript Bun CLI template
      const templateContent: ProjectTemplate = {
        name: 'typescript-bun-cli',
        description: 'TypeScript Bun CLI project template',
        files: [
          {
            path: 'package.json',
            template: `{
  "name": "{{project_name}}",
  "version": "1.0.0",
  "description": "{{description}}",
  "main": "src/index.ts",
  "scripts": {
    "dev": "bun run src/index.ts",
    "build": "bun build src/index.ts --outdir dist",
    "test": "bun test",
    {{#if strict}}
    "lint": "eslint src --ext .ts",
    {{/if}}
    "start": "bun run dist/index.js"
  },
  "dependencies": {
    "zod": "^4.1.12"
  },
  {{#if devDependencies}}
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0"
  }
  {{/if}}
}`,
          },
          {
            path: 'tsconfig.json',
            template: `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "node",
    {{#if strict}}
    "strict": true,
    "noImplicitAny": true,
    {{/if}}
    "outDir": "./dist",
    "rootDir": "./src",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}`,
          },
          {
            path: 'src/index.ts',
            template: `/**
 * {{project_name}}
 * {{description}}
 */

console.log('{{welcome_message}}');

{{#if enableLogger}}
import { Logger } from './utils/logger';
const logger = new Logger('{{project_name}}');
logger.info('Application started');
{{/if}}

{{#if hasRoutes}}
import { Router } from './router';
const router = new Router();
{{/if}}`,
          },
          {
            path: 'README.md',
            template: `# {{project_name}}

{{description}}

## Getting Started

\`\`\`bash
# Install dependencies
bun install

# Run in development mode
bun run dev

# Run tests
bun test

{{#if strict}}
# Lint code
bun run lint

{{/if}}
# Build for production
bun run build
\`\`\`

## Features

{{#if strict}}
- ✅ TypeScript strict mode enabled
{{/if}}
- ✅ Modern ES2022+ syntax
- ✅ Fast Bun runtime
{{#if enableLogger}}
- ✅ Structured logging
{{/if}}
{{#if hasRoutes}}
- ✅ Routing system
{{/if}}

## License

MIT`,
          },
        ],
      };

      // Save the template
      await writeFile(
        join(templatesDir, 'typescript-bun-cli.json'),
        JSON.stringify(templateContent, null, 2)
      );

      // WHEN: Processing the template with context
      const context: TemplateContext = {
        project_name: 'awesome-typescript-app',
        description: 'An awesome TypeScript application built with Bun',
        welcome_message: 'Welcome to Awesome TypeScript App!',
        strict: true,
        devDependencies: true,
        enableLogger: true,
        hasRoutes: false,
      };

      const loadedTemplate = await templateEngine.loadTemplate('typescript-bun-cli');
      const generatedFiles = await templateEngine.processProjectTemplate(loadedTemplate, context);

      // THEN: Should generate all files with correct content
      expect(generatedFiles).toHaveLength(4);

      // Verify package.json
      const packageJson = generatedFiles.find((f) => f.path === 'package.json');
      expect(packageJson).toBeDefined();
      const packageContent = packageJson?.content;
      expect(packageContent).toContain('"name": "awesome-typescript-app"');
      expect(packageContent).toContain(
        '"description": "An awesome TypeScript application built with Bun"'
      );
      expect(packageContent).toContain('"lint": "eslint src --ext .ts"');
      expect(packageContent).toContain('"devDependencies"');

      // Verify tsconfig.json
      const tsconfig = generatedFiles.find((f) => f.path === 'tsconfig.json');
      expect(tsconfig).toBeDefined();
      const tsconfigContent = tsconfig?.content;
      expect(tsconfigContent).toContain('"strict": true');
      expect(tsconfigContent).toContain('"noImplicitAny": true');
      expect(tsconfigContent).toContain('"outDir": "./dist"');

      // Verify src/index.ts
      const indexTs = generatedFiles.find((f) => f.path === 'src/index.ts');
      expect(indexTs).toBeDefined();
      const indexContent = indexTs?.content;
      expect(indexContent).toContain('Welcome to Awesome TypeScript App!');
      expect(indexContent).toContain('import { Logger }');
      expect(indexContent).not.toContain('import { Router }');

      // Verify README.md
      const readme = generatedFiles.find((f) => f.path === 'README.md');
      expect(readme).toBeDefined();
      const readmeContent = readme?.content;
      expect(readmeContent).toContain('# awesome-typescript-app');
      expect(readmeContent).toContain('✅ TypeScript strict mode enabled');
      expect(readmeContent).toContain('✅ Structured logging');
      expect(readmeContent).not.toContain('✅ Routing system');
    });

    it('should handle conditional file generation', async () => {
      // GIVEN: A template with conditional files
      const templateContent: ProjectTemplate = {
        name: 'conditional-template',
        files: [
          {
            path: 'base.txt',
            template: 'Base file content',
          },
          {
            path: 'optional.txt',
            template: 'Optional file content',
            condition: 'includeOptional',
          },
          {
            path: 'config.json',
            template: '{{#if enableFeatures}}{"features": true}{{/if}}',
          },
        ],
      };

      await writeFile(
        join(templatesDir, 'conditional-template.json'),
        JSON.stringify(templateContent, null, 2)
      );

      // WHEN: Processing with condition set to false
      const contextWithoutOptional: TemplateContext = {
        includeOptional: false,
        enableFeatures: false,
      };

      const loadedTemplate = await templateEngine.loadTemplate('conditional-template');
      const filesWithoutOptional = await templateEngine.processProjectTemplate(
        loadedTemplate,
        contextWithoutOptional
      );

      // THEN: Should only include non-conditional files
      expect(filesWithoutOptional).toHaveLength(2);
      expect(filesWithoutOptional.some((f) => f.path === 'optional.txt')).toBe(false);

      // WHEN: Processing with condition set to true
      const contextWithOptional: TemplateContext = {
        includeOptional: true,
        enableFeatures: true,
      };

      const filesWithOptional = await templateEngine.processProjectTemplate(
        loadedTemplate,
        contextWithOptional
      );

      // THEN: Should include all files
      expect(filesWithOptional).toHaveLength(3);
      expect(filesWithOptional.some((f) => f.path === 'optional.txt')).toBe(true);

      const configFile = filesWithOptional.find((f) => f.path === 'config.json');
      expect(configFile?.content).toBe('{"features": true}');
    });

    it('should validate template before processing', async () => {
      // GIVEN: A template with syntax errors
      const invalidTemplateContent: ProjectTemplate = {
        name: 'invalid-template',
        files: [
          {
            path: 'invalid.txt',
            template: 'Hello {{project_name}}{{#if unclosed',
          },
        ],
      };

      await writeFile(
        join(templatesDir, 'invalid-template.json'),
        JSON.stringify(invalidTemplateContent, null, 2)
      );

      // WHEN: Loading and processing the template
      const loadedTemplate = await templateEngine.loadTemplate('invalid-template');

      // THEN: Should catch validation errors during processing
      const processPromise = templateEngine.processProjectTemplate(loadedTemplate, {
        project_name: 'test',
      });

      await expect(processPromise).rejects.toThrow(/rendering.*failed/i);
    });

    it('should maintain consistent behavior across multiple renders', async () => {
      // GIVEN: A template with complex substitutions
      const templateContent: ProjectTemplate = {
        name: 'consistency-test',
        files: [
          {
            path: 'output.json',
            template: `{
  "project": "{{project_name}}",
  "description": "{{description}}",
  "timestamp": "{{timestamp}}",
  "nested": {
    "value": "{{nested.value}}",
    "enabled": {{nested.enabled}}
  }
}`,
          },
        ],
      };

      await writeFile(
        join(templatesDir, 'consistency-test.json'),
        JSON.stringify(templateContent, null, 2)
      );

      const context: TemplateContext = {
        project_name: 'consistency-test',
        description: 'Testing consistent rendering',
        timestamp: '2025-10-23T12:00:00Z',
        nested: {
          value: 'test-value',
          enabled: true,
        },
      };

      // WHEN: Rendering the same template multiple times
      const loadedTemplate = await templateEngine.loadTemplate('consistency-test');

      const result1 = await templateEngine.processProjectTemplate(loadedTemplate, context);
      const result2 = await templateEngine.processProjectTemplate(loadedTemplate, context);
      const result3 = await templateEngine.processProjectTemplate(loadedTemplate, context);

      // THEN: Results should be identical
      expect(result1).toEqual(result2);
      expect(result2).toEqual(result3);

      const content = result1[0].content;
      expect(content).toContain('"project": "consistency-test"');
      expect(content).toContain('"enabled": true');
      expect(content).toContain('"timestamp": "2025-10-23T12:00:00Z"');
    });
  });

  describe('Performance and Scalability', () => {
    it('should handle large templates efficiently', async () => {
      // GIVEN: A template with many files and complex content
      const files = [];
      for (let i = 0; i < 50; i++) {
        files.push({
          path: `src/module${i}.ts`,
          template: `// Module ${i}
export class Module${i} {
  private name = '{{project_name}}-${i}';
  private description = '{{description}}';

  {{#if strict}}
  private strict: boolean = true;
  {{/if}}

  public getName(): string {
    return this.name;
  }

  public getDescription(): string {
    return this.description;
  }
}
`,
        });
      }

      const largeTemplate: ProjectTemplate = {
        name: 'large-template',
        files,
      };

      await writeFile(
        join(templatesDir, 'large-template.json'),
        JSON.stringify(largeTemplate, null, 2)
      );

      const context: TemplateContext = {
        project_name: 'large-project',
        description: 'A large project with many modules',
        strict: true,
      };

      // WHEN: Processing the large template
      const startTime = Date.now();
      const loadedTemplate = await templateEngine.loadTemplate('large-template');
      const generatedFiles = await templateEngine.processProjectTemplate(loadedTemplate, context);
      const endTime = Date.now();

      // THEN: Should complete within reasonable time (< 5 seconds)
      const processingTime = endTime - startTime;
      expect(processingTime).toBeLessThan(5000);
      expect(generatedFiles).toHaveLength(50);

      // Verify some files were processed correctly
      const firstFile = generatedFiles[0];
      expect(firstFile.content).toContain('large-project-0');
      expect(firstFile.content).toContain('private strict: boolean = true');
    });

    it('should support concurrent template processing', async () => {
      // GIVEN: Multiple templates to process concurrently
      const templateContent: ProjectTemplate = {
        name: 'concurrent-test',
        files: [
          {
            path: 'output.json',
            template: '{"project": "{{project_name}}", "id": "{{id}}"}',
          },
        ],
      };

      await writeFile(
        join(templatesDir, 'concurrent-test.json'),
        JSON.stringify(templateContent, null, 2)
      );

      const loadedTemplate = await templateEngine.loadTemplate('concurrent-test');

      // WHEN: Processing multiple templates concurrently
      const concurrentPromises = Array.from({ length: 10 }, (_, i) =>
        templateEngine.processProjectTemplate(loadedTemplate, {
          project_name: `concurrent-project-${i}`,
          id: i,
        })
      );

      const results = await Promise.all(concurrentPromises);

      // THEN: All templates should be processed correctly
      expect(results).toHaveLength(10);
      results.forEach((result, i) => {
        expect(result[0].content).toContain(`concurrent-project-${i}`);
        expect(result[0].content).toContain(`"id": "${i}"`);
      });
    });
  });
});
