/**
 * Integration Tests for Variable Substitution System
 *
 * Tests variable substitution with real templates and contexts
 */
import { describe, test, expect, beforeEach, afterEach } from 'bun:test';
import fs from 'node:fs/promises';
import path from 'node:path';
import type { TemplateVariable, ProjectConfig } from '@nimata/core';
import { TemplateContextFactoryImpl } from '../../src/template-engine/template-context-factory.js';
import { VariableSubstitutionEngine } from '../../src/template-engine/variable-substitution.js';
import { HandlebarsTemplateEngine } from '../../src/template-engine-handlebars.js';

describe('Variable Substitution Integration', () => {
  let substitutionEngine: VariableSubstitutionEngine;
  let templateEngine: HandlebarsTemplateEngine;
  let contextFactory: TemplateContextFactoryImpl;
  let tempDir: string;

  beforeEach(async () => {
    substitutionEngine = new VariableSubstitutionEngine();
    templateEngine = new HandlebarsTemplateEngine();
    contextFactory = new TemplateContextFactoryImpl();

    // Create temporary directory for test templates
    tempDir = path.join(process.cwd(), 'temp-variable-integration');
    await fs.mkdir(tempDir, { recursive: true });
  });

  afterEach(async () => {
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  });

  describe('Template Integration with Variable Substitution', () => {
    test('should substitute variables in real project templates', async () => {
      const projectConfig: ProjectConfig = {
        name: 'my-awesome-cli',
        description: 'An awesome CLI tool for developers',
        author: 'John Doe',
        license: 'MIT',
        qualityLevel: 'strict',
        projectType: 'cli',
        aiAssistants: ['claude-code', 'github-copilot'],
      };

      const context = contextFactory.createExtended(projectConfig, {
        database: 'postgresql',
        port: 5432,
        features: ['auth', 'logging', 'monitoring'],
        theme: 'dark',
      });

      const packageJsonTemplate = `{
  "name": "{{project_name}}",
  "description": "{{description}}",
  "version": "{{version}}",
  "author": "{{author}}",
  "license": "{{license}}",
  "type": "module",
  "engines": {
    "bun": ">=1.3.0"
  },
  "scripts": {
    "start": "bun run src/index.ts",
    "dev": "bun --watch run src/index.ts",
    "build": "bun build src/index.ts --outdir {{build_output}}",
    "test": "bun test",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "{{#if custom_variables.database}}"pg": "^8.0.0"{{/if}}
  },
  "devDependencies": {
    "@types/node": "^24.8.0",
    "typescript": "^5.3.3"
  }
}`;

      const substitutionResult = substitutionEngine.substitute(packageJsonTemplate, context);
      expect(substitutionResult.validation.valid).toBe(true);
      expect(substitutionResult.substitutedContent).toContain('"name": "my-awesome-cli"');
      expect(substitutionResult.substitutedContent).toContain(
        '"description": "An awesome CLI tool for developers"'
      );
      expect(substitutionResult.substitutedContent).toContain('"author": "John Doe"');
      // Handlebars blocks should remain unprocessed after substitution
      expect(substitutionResult.substitutedContent).toContain(
        '{{#if custom_variables.database}}"pg": "^8.0.0"{{/if}}'
      );

      // Test with Handlebars rendering
      const renderedContent = await templateEngine.renderTemplate(
        substitutionResult.substitutedContent,
        context
      );
      expect(renderedContent).toContain('"name": "my-awesome-cli"');
      expect(renderedContent).toContain('"pg": "^8.0.0"');
    });

    test('should handle complex multi-file templates', async () => {
      const projectConfig: ProjectConfig = {
        name: 'web-app',
        description: 'A modern web application',
        qualityLevel: 'high',
        projectType: 'web',
        aiAssistants: ['claude-code'],
      };

      const context = contextFactory.createExtended(projectConfig, {
        apiEndpoint: 'https://api.example.com',
        enableCors: true,
        port: 3000,
        middleware: ['auth', 'cors', 'logging'],
      });

      const files = [
        {
          path: 'src/config/index.ts',
          template: `export const config = {
  appName: '{{project_name}}',
  description: '{{description}}',
  version: '{{version}}',
  quality: '{{quality_level}}',
  port: {{custom_variables.port}},
  apiEndpoint: '{{custom_variables.apiEndpoint}}',
  features: {
    cors: {{custom_variables.enableCors}},
    {{#custom_variables.middleware}}
    {{this}}: true,
    {{/custom_variables.middleware}}
  }
};`,
        },
        {
          path: 'README.md',
          template: `# {{project_name_pascal}}

{{description}}

## Features

{{#if is_high_quality}}
- ✅ High quality code standards
- ✅ Comprehensive testing
- ✅ Full documentation
{{/if}}

## Development

\`\`\`bash
bun install
bun run dev
\`\`\`

## Configuration

The application runs on port \`{{custom_variables.port}}\` and connects to \`{{custom_variables.apiEndpoint}}\`.

## License

{{license}}
`,
        },
      ];

      const results = files.map((file) => ({
        path: file.path,
        substitution: substitutionEngine.substitute(file.template, context),
      }));

      // All substitutions should be valid
      for (const result of results) {
        expect(result.substitution.validation.valid).toBe(true);
      }

      // Test actual rendering
      for (const result of results) {
        const rendered = await templateEngine.renderTemplate(
          result.substitution.substitutedContent,
          context
        );
        expect(rendered).not.toBeNull();
        expect(rendered.length).toBeGreaterThan(0);
      }

      // Verify specific substitutions
      const configResult = results.find((r) => r.path === 'src/config/index.ts');
      if (!configResult?.substitution) {
        throw new Error('Config result not found or has no substitution');
      }
      const configRendered = await templateEngine.renderTemplate(
        configResult.substitution.substitutedContent,
        context
      );
      expect(configRendered).toContain("appName: 'web-app'");
      expect(configRendered).toContain('port: 3000');
      expect(configRendered).toContain('auth: true');

      const readmeResult = results.find((r) => r.path === 'README.md');
      if (!readmeResult?.substitution) {
        throw new Error('README result not found or has no substitution');
      }
      const readmeRendered = await templateEngine.renderTemplate(
        readmeResult.substitution.substitutedContent,
        context
      );
      expect(readmeRendered).toContain('# WebApp');
      expect(readmeRendered).toContain('✅ High quality code standards');
    });

    test('should handle conditional variable substitution', async () => {
      const strictConfig: ProjectConfig = {
        name: 'strict-app',
        description: 'A strict quality application',
        qualityLevel: 'strict',
        projectType: 'library',
        aiAssistants: ['claude-code', 'github-copilot'],
      };

      const lightConfig: ProjectConfig = {
        name: 'light-app',
        description: 'A light quality application',
        qualityLevel: 'light',
        projectType: 'cli',
        aiAssistants: [],
      };

      const template = `{
  "name": "{{project_name}}",
  "strict": {{is_strict}},
  "light": {{is_light}},
  "highQuality": {{is_high_quality}},
  "eslint": "{{#if enable_eslint}}{{eslint_config}}{{/if}}",
  "typescript": "{{#if enable_typescript}}{{typescript_config}}{{/if}}"
}`;

      // Test strict config
      const strictContext = contextFactory.createExtended(strictConfig);
      const strictResult = substitutionEngine.substitute(template, strictContext);
      expect(strictResult.substitutedContent).toContain('"strict": true');
      expect(strictResult.substitutedContent).toContain('"light": false');
      expect(strictResult.substitutedContent).toContain('"highQuality": true');
      // eslint_config and typescript_config should be substituted, but Handlebars blocks should remain
      expect(strictResult.substitutedContent).toContain(
        '"eslint": "{{#if enable_eslint}}{\"extends\":[\"eslint:recommended\",\"@typescript-eslint/recommended\"],\"rules\":{\"no-console\":\"error\",\"prefer-const\":\"error\"}}{{/if}}"'
      );
      expect(strictResult.substitutedContent).toContain(
        '"typescript": "{{#if enable_typescript}}{\"strict\":true,\"noImplicitAny\":false,\"strictNullChecks\":false,\"noImplicitReturns\":true}{{/if}}"'
      );

      // Test light config
      const lightContext = contextFactory.createExtended(lightConfig);
      const lightResult = substitutionEngine.substitute(template, lightContext);
      expect(lightResult.substitutedContent).toContain('"strict": false');
      expect(lightResult.substitutedContent).toContain('"light": true');
      expect(lightResult.substitutedContent).toContain('"highQuality": false');
      // eslint_config and typescript_config should be substituted, but Handlebars blocks should remain
      expect(lightResult.substitutedContent).toContain(
        '"eslint": "{{#if enable_eslint}}{\"extends\":[\"eslint:recommended\",\"@typescript-eslint/recommended\"],\"rules\":{\"no-console\":\"warn\",\"prefer-const\":\"warn\"}}{{/if}}"'
      );
      expect(lightResult.substitutedContent).toContain(
        '"typescript": "{{#if enable_typescript}}{\"strict\":false,\"noImplicitAny\":false,\"strictNullChecks\":false,\"noImplicitReturns\":false}{{/if}}"'
      );
    });
  });

  describe('Complex Variable Types Integration', () => {
    test('should handle complex object variables in templates', async () => {
      const projectConfig: ProjectConfig = {
        name: 'complex-app',
        description: 'Application with complex configuration',
        qualityLevel: 'medium',
        projectType: 'cli',
        aiAssistants: ['claude-code'],
      };

      const complexContext = contextFactory.createExtended(projectConfig, {
        database: {
          host: 'localhost',
          port: 5432,
          name: 'myapp_db',
          ssl: true,
          pool: {
            min: 2,
            max: 10,
            acquireTimeoutMillis: 30000,
          },
        },
        services: {
          auth: {
            enabled: true,
            provider: 'oauth2',
            clientId: 'myapp_client',
          },
          email: {
            enabled: true,
            provider: 'smtp',
            from: 'noreply@example.com',
          },
        },
        features: ['feature-a', 'feature-b', 'feature-c'],
        environment: {
          NODE_ENV: 'development',
          PORT: '3000',
          LOG_LEVEL: 'debug',
        },
      });

      const configTemplate = `export const config = {
  database: {{custom_variables.database}},
  services: {{custom_variables.services}},
  features: [{{#each custom_variables.features}}'{{this}}'{{#unless @last}},{{/unless}}{{/each}}],
  environment: {{custom_variables.environment}}
};`;

      const result = substitutionEngine.substitute(configTemplate, complexContext);
      expect(result.validation.valid).toBe(true);

      // Verify JSON structure is maintained
      expect(result.substitutedContent).toContain('database: {');
      expect(result.substitutedContent).toContain('"host": "localhost"');
      expect(result.substitutedContent).toContain('"pool":');
      expect(result.substitutedContent).toContain('services: {');
      expect(result.substitutedContent).toContain('"enabled": true');
      // Handlebars each block should remain unprocessed after substitution
      expect(result.substitutedContent).toContain(
        "{{#each custom_variables.features}}'{{this}}'{{#unless @last}},{{/unless}}{{/each}}"
      );

      // Test rendering with Handlebars
      const rendered = await templateEngine.renderTemplate(
        result.substitutedContent,
        complexContext
      );
      expect(rendered).toContain("'feature-a','feature-b','feature-c'");
    });

    test('should handle array iteration with complex objects', async () => {
      const projectConfig: ProjectConfig = {
        name: 'multi-service-app',
        description: 'Application with multiple services',
        qualityLevel: 'medium',
        projectType: 'cli',
        aiAssistants: ['claude-code'],
      };

      const context = contextFactory.createExtended(projectConfig, {
        services: [
          {
            name: 'user-service',
            port: 3001,
            database: 'users_db',
            dependencies: ['auth-service', 'notification-service'],
          },
          {
            name: 'order-service',
            port: 3002,
            database: 'orders_db',
            dependencies: ['user-service', 'payment-service'],
          },
          {
            name: 'notification-service',
            port: 3003,
            database: 'notifications_db',
            dependencies: null,
          },
        ],
      });

      const template = `{{#each custom_variables.services}}
Service: {{this.name}}
Port: {{this.port}}
Database: {{this.database}}
Dependencies: {{#if this.dependencies}}{{#each this.dependencies}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}{{else}} None{{/if}}
---
{{/each}}`;

      const result = substitutionEngine.substitute(template, context);
      expect(result.validation.valid).toBe(true);

      const rendered = await templateEngine.renderTemplate(result.substitutedContent, context);

      expect(rendered).toContain('Service: user-service');
      expect(rendered).toContain('Port: 3001');
      expect(rendered).toContain('Database: users_db');
      expect(rendered).toContain('Dependencies: auth-service, notification-service');
      expect(rendered).toContain('Dependencies: \n---'); // Empty dependencies for notification-service
    });
  });

  describe('Error Handling Integration', () => {
    test('should handle missing variables gracefully in templates', async () => {
      const projectConfig: ProjectConfig = {
        name: 'error-test-app',
        description: 'Application for error testing',
        qualityLevel: 'medium',
        projectType: 'cli',
        aiAssistants: [],
        author: 'Test Author',
      };

      const context = contextFactory.createExtended(projectConfig, {});

      const templateWithMissingVars = `Project: {{project_name}}
Missing: {{missing_variable}}
Nested Missing: {{custom_variables.deeply.nested.missing}}
Author: {{author}}`;

      const result = substitutionEngine.substitute(templateWithMissingVars, context);
      expect(result.validation.valid).toBe(true);
      expect(result.validation.warnings.length).toBeGreaterThan(0);

      const rendered = await templateEngine.renderTemplate(result.substitutedContent, context);
      expect(rendered).toContain('Project: error-test-app');
      expect(rendered).toContain('Missing: ');
      expect(rendered).toContain('Nested Missing: ');
      expect(rendered).toContain('Author: Test Author');
    });

    test('should validate complex variable types in real scenarios', async () => {
      const projectConfig: ProjectConfig = {
        name: 'validation-test',
        description: 'Application for validation testing',
        qualityLevel: 'medium',
        projectType: 'cli',
        aiAssistants: [],
      };

      const context = contextFactory.createExtended(projectConfig, {
        port: 'invalid-port', // Should be number
        enabled: 'true', // Should be boolean
        config: 'not-object', // Should be object
        features: 42, // Should be array
      });

      const variables: TemplateVariable[] = [
        {
          name: 'custom_variables.port',
          type: 'number',
          description: 'Server port',
          required: true,
        },
        {
          name: 'custom_variables.enabled',
          type: 'boolean',
          description: 'Feature flag',
          required: true,
        },
        {
          name: 'custom_variables.config',
          type: 'object',
          description: 'Configuration object',
          required: true,
        },
        {
          name: 'custom_variables.features',
          type: 'array',
          description: 'Feature list',
          required: true,
        },
      ];

      const template = `Port: {{custom_variables.port}}
Enabled: {{custom_variables.enabled}}
Config: {{custom_variables.config}}
Features: {{custom_variables.features}}`;

      const result = substitutionEngine.substitute(template, context, variables);
      expect(result.validation.warnings.length).toBeGreaterThan(0);

      // Should still substitute but with type conversion
      expect(result.substitutedContent).toContain('Port: invalid-port');
      expect(result.substitutedContent).toContain('Enabled: true');
      expect(result.substitutedContent).toContain('Config: not-object');
      expect(result.substitutedContent).toContain('Features: 42');
    });
  });

  describe('Performance Integration', () => {
    test('should handle large templates efficiently', async () => {
      const projectConfig: ProjectConfig = {
        name: 'performance-test',
        description: 'Performance testing application',
        qualityLevel: 'high',
        projectType: 'cli',
        aiAssistants: ['claude-code'],
      };

      const context = contextFactory.createExtended(projectConfig, {
        // Create a large object for testing
        largeDataset: Array.from({ length: 1000 }, (_, i) => ({
          id: i,
          name: `item-${i}`,
          value: (i * 123.456) % 1000, // Deterministic value for test data generation
          metadata: {
            created: new Date().toISOString(),
            tags: [`tag-${i % 10}`, `category-${i % 5}`],
          },
        })),
      });

      // Create a large template with many variables
      const largeTemplate = `
# {{project_name}} Performance Test

{{description}}

## Large Dataset Processing

{{#each custom_variables.largeDataset}}
- ID: {{this.id}}
- Name: {{this.name}}
- Value: {{this.value}}
- Created: {{this.metadata.created}}
- Tags: {{#each this.metadata.tags}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}
{{/each}}

## Summary

Total items: {{custom_variables.largeDataset.length}}
First item: {{custom_variables.largeDataset.0.name}}
Last item: {{custom_variables.largeDataset.999.name}}
`;

      const startTime = performance.now();
      const result = substitutionEngine.substitute(largeTemplate, context);
      const substitutionTime = performance.now() - startTime;

      expect(result.validation.valid).toBe(true);
      expect(substitutionTime).toBeLessThan(100); // Should complete in less than 100ms

      // Test rendering performance
      const renderStartTime = performance.now();
      const rendered = await templateEngine.renderTemplate(result.substitutedContent, context);
      const renderTime = performance.now() - renderStartTime;

      expect(renderTime).toBeLessThan(50); // Should render in less than 50ms
      expect(rendered).toContain('Total items: 1000');
      expect(rendered).toContain('First item: item-0');
      expect(rendered).toContain('Last item: item-999');
      expect(rendered.length).toBeGreaterThan(10000); // Large content
    });
  });
});
