/**
 * Integration Tests for Conditional Logic System
 *
 * Tests conditional logic with real templates and contexts
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import type { ProjectConfig, ExtendedTemplateContext } from '@nimata/core';
import { describe, test, expect, beforeEach, afterEach } from 'bun:test';
import { ConditionalUtils } from '../../src/template-engine/conditional-helpers.js';
import { TemplateContextFactoryImpl } from '../../src/template-engine/template-context-factory.js';
import { HandlebarsTemplateEngine } from '../../src/template-engine-handlebars.js';

/**
 * Helper function to get category for test data
 * @param index - The index to get category for
 * @returns Category string
 */
function getCategory(index: number): string {
  const mod = index % 3;
  if (mod === 0) return 'A';
  if (mod === 1) return 'B';
  return 'C';
}

/**
 * Creates a test project configuration for conditional file generation
 * @returns Project configuration
 */
function createConditionalTestConfig(): ProjectConfig {
  return {
    name: 'conditional-file-generation',
    description: 'Testing conditional file generation',
    qualityLevel: 'medium',
    projectType: 'cli',
    aiAssistants: [],
  };
}

/**
 * Creates extended context for conditional testing
 * @param projectConfig - Base project configuration
 * @returns Extended context with features
 */
function createConditionalTestContext(
  projectConfig: ProjectConfig,
  contextFactory: TemplateContextFactoryImpl
): ExtendedTemplateContext {
  return contextFactory.createExtended(projectConfig, {
    features: {
      config: true,
      logging: false,
      testing: true,
      documentation: true,
      monitoring: false,
    },
    database: {
      enabled: true,
      type: 'postgresql',
      migrations: true,
    },
    auth: {
      enabled: true,
      type: 'jwt',
      oauth: false,
    },
  });
}

/**
 * Tests config file generation
 * @param templateEngine - Template engine instance
 * @param context - Template context
 */
async function testConfigFileGeneration(
  templateEngine: HandlebarsTemplateEngine,
  context: ExtendedTemplateContext
): Promise<void> {
  const configTemplate = `{{#if custom_variables.features.config}}
export const config = {
  appName: '{{project_name}}',
  {{#if custom_variables.database.enabled}}
  database: {
    type: '{{custom_variables.database.type}}',
    {{#if custom_variables.database.migrations}}
    migrations: true,
    {{/if}}
  },
  {{/if}}
  {{#if custom_variables.auth.enabled}}
  auth: {
    type: '{{custom_variables.auth.type}}',
    {{#if custom_variables.auth.oauth}}
    oauth: true,
    {{/if}}
  },
  {{/if}}
  logging: {{custom_variables.features.logging}}
};
{{else}}
export const config = {};
{{/if}}`;

  const configResult = await templateEngine.renderTemplate(configTemplate, context);

  expect(configResult).toContain('export const config = {');
  expect(configResult).toContain("appName: 'conditional-file-generation'");
  expect(configResult).toContain('database: {');
  expect(configResult).toContain("type: 'postgresql'");
  expect(configResult).toContain('migrations: true');
  expect(configResult).toContain('auth: {');
  expect(configResult).toContain("type: 'jwt'");
  expect(configResult).toContain('logging: false');
}

/**
 * Tests setup file generation
 * @param templateEngine - Template engine instance
 * @param context - Template context
 */
async function testSetupFileGeneration(
  templateEngine: HandlebarsTemplateEngine,
  context: ExtendedTemplateContext
): Promise<void> {
  const setupTemplate = `{{#if custom_variables.features.testing}}
import { setupTestDatabase } from './utils/database';
{{#if custom_variables.database.enabled}}
{{#if custom_variables.database.migrations}}
import { runMigrations } from '../migrations';
{{/if}}
{{/if}}

export const setupTests = async () => {
  {{#if custom_variables.database.enabled}}
  {{#if custom_variables.database.migrations}}
  await runMigrations();
  {{/if}}
  await setupTestDatabase();
  {{/if}}
};
{{else}}
// No test setup required
{{/if}}`;

  const testResult = await templateEngine.renderTemplate(setupTemplate, context);

  expect(testResult).toContain('import { setupTestDatabase }');
  expect(testResult).toContain('import { runMigrations }');
  expect(testResult).toContain('await runMigrations();');
  expect(testResult).toContain('await setupTestDatabase();');
}

/**
 * Tests documentation file generation
 * @param templateEngine - Template engine instance
 * @param context - Template context
 */
async function testDocumentationFileGeneration(
  templateEngine: HandlebarsTemplateEngine,
  context: ExtendedTemplateContext
): Promise<void> {
  const docsTemplate = `# API Documentation

{{#if custom_variables.features.documentation}}
## Overview
This is the API documentation for {{project_name}}.

{{#if custom_variables.database.enabled}}
## Database Endpoints
{{#if (eq custom_variables.database.type 'postgresql')}}
- Uses PostgreSQL for data persistence
{{/if}}
{{/if}}

{{#if custom_variables.auth.enabled}}
## Authentication
{{#if (eq custom_variables.auth.type 'jwt')}}
- JWT-based authentication
{{/if}}
{{#if custom_variables.auth.oauth}}
- OAuth2 authentication support
{{/if}}
{{/if}}

{{#if custom_variables.features.monitoring}}
## Monitoring
Application monitoring is enabled.
{{else}}
## Monitoring
Application monitoring is not configured.
{{/if}}
{{else}}
No documentation available.
{{/if}}`;

  const docsResult = await templateEngine.renderTemplate(docsTemplate, context);

  expect(docsResult).toContain('# API Documentation');
  expect(docsResult).toContain('## Overview');
  expect(docsResult).toContain('## Database Endpoints');
  expect(docsResult).toContain('- Uses PostgreSQL for data persistence');
  expect(docsResult).toContain('## Authentication');
  expect(docsResult).toContain('- JWT-based authentication');
  expect(docsResult).toContain('Application monitoring is not configured.');
}

describe('Conditional Logic Integration', () => {
  let templateEngine: HandlebarsTemplateEngine;
  let contextFactory: TemplateContextFactoryImpl;
  let tempDir: string;

  beforeEach(async () => {
    templateEngine = new HandlebarsTemplateEngine();
    contextFactory = new TemplateContextFactoryImpl();

    // Create temporary directory for test templates
    tempDir = path.join(process.cwd(), 'temp-conditional-integration');
    await fs.mkdir(tempDir, { recursive: true });
  });

  afterEach(async () => {
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  });

  describe('Basic Conditional Logic Integration', () => {
    test('should render simple if/else conditions', async () => {
      const projectConfig: ProjectConfig = {
        name: 'conditional-test',
        description: 'Testing conditional logic',
        qualityLevel: 'strict',
        projectType: 'cli',
        aiAssistants: ['claude-code'],
      };

      const context = contextFactory.createExtended(projectConfig, {
        enableLogging: true,
        enableDebug: false,
        environment: 'production',
      });

      const template = `
# Configuration Report

## Logging Status
{{#if custom_variables.enableLogging}}
✅ Logging is enabled
{{#if custom_variables.enableDebug}}
🔍 Debug mode is also enabled
{{else}}
📝 Debug mode is disabled
{{/if}}
{{else}}
❌ Logging is disabled
{{/if}}

## Environment
{{#if (eq custom_variables.environment 'production')}}
🚀 Production environment detected
{{else}}
🛠️ Development environment detected
{{/if}}

## Quality Level
{{#if is_strict}}
🔒 Strict quality mode enabled
{{else}}
⚠️ Standard quality mode
{{/if}}
`;

      const result = await templateEngine.renderTemplate(template, context);

      expect(result).toContain('✅ Logging is enabled');
      expect(result).toContain('📝 Debug mode is disabled');
      expect(result).toContain('🚀 Production environment detected');
      expect(result).toContain('🔒 Strict quality mode enabled');
    });

    test('should handle complex nested conditions', async () => {
      const projectConfig: ProjectConfig = {
        name: 'nested-conditional-test',
        description: 'Testing nested conditional logic',
        qualityLevel: 'high',
        projectType: 'web',
        aiAssistants: ['claude-code', 'github-copilot'],
      };

      const context = contextFactory.createExtended(projectConfig, {
        features: {
          authentication: true,
          authorization: false,
          logging: true,
          monitoring: true,
          testing: true,
        },
        config: {
          database: 'postgresql',
          cache: 'redis',
          queue: 'rabbitmq',
        },
        deployment: {
          containerized: true,
          orchestrated: true,
          monitored: false,
        },
      });

      const template = `
# Feature Configuration

## Security Features
{{#if custom_variables.features.authentication}}
{{#if custom_variables.features.authorization}}
🔐 Both authentication and authorization are enabled
{{else}}
🔑 Authentication is enabled but authorization is not
{{/if}}
{{else}}
🚫 No security features configured
{{/if}}

## Infrastructure Setup
{{#if (and custom_variables.deployment.containerized custom_variables.deployment.orchestrated)}}
{{#if custom_variables.deployment.monitored}}
📊 Full containerized, orchestrated, and monitored deployment
{{else}}
🐳 Containerized and orchestrated deployment (no monitoring)
{{/if}}
{{else}}
💻 Traditional deployment setup
{{/if}}

## Database Stack
{{#ifExists custom_variables.config.database}}
Database: {{custom_variables.config.database}}
{{#ifExists custom_variables.config.cache}}
Cache: {{custom_variables.config.cache}}
{{#ifExists custom_variables.config.queue}}
Queue: {{custom_variables.config.queue}}
{{else}}
No message queue configured
{{/ifExists}}
{{else}}
No cache configured
{{/ifExists}}
{{else}}
No database configured
{{/ifExists}}
`;

      const result = await templateEngine.renderTemplate(template, context);

      expect(result).toContain('🔑 Authentication is enabled but authorization is not');
      expect(result).toContain('🐳 Containerized and orchestrated deployment (no monitoring)');
      expect(result).toContain('Database: postgresql');
      expect(result).toContain('Cache: redis');
      expect(result).toContain('Queue: rabbitmq');
    });

    test('should handle switch-like conditional logic', async () => {
      const projectConfig: ProjectConfig = {
        name: 'switch-conditional-test',
        description: 'Testing switch-like conditional logic',
        qualityLevel: 'medium',
        projectType: 'cli',
        aiAssistants: [],
      };

      const context = contextFactory.createExtended(projectConfig, {
        logLevel: 'error',
        theme: 'dark',
        environment: 'staging',
      });

      const template = `
# Configuration

## Log Level
{{#if (eq custom_variables.logLevel 'debug')}}
🐛 Debug mode - maximum verbosity
{{else if (eq custom_variables.logLevel 'info')}}
ℹ️ Info mode - normal verbosity
{{else if (eq custom_variables.logLevel 'warn')}}
⚠️ Warning mode - important messages only
{{else if (eq custom_variables.logLevel 'error')}}
❌ Error mode - errors only
{{else}}
🔍 Unknown log level: {{custom_variables.logLevel}}
{{/if}}

## Theme Configuration
{{#if (eq custom_variables.theme 'dark')}}
🌙 Dark theme enabled
{{else if (eq custom_variables.theme 'light')}}
☀️ Light theme enabled
{{else if (eq custom_variables.theme 'auto')}}
🎨 Auto theme based on system preference
{{else}}
🎨 Custom theme: {{custom_variables.theme}}
{{/if}}

## Environment-Specific Settings
{{#if (eq custom_variables.environment 'production')}}
🚀 Production settings applied
{{else if (eq custom_variables.environment 'staging')}}
🧪 Staging settings applied
{{else if (eq custom_variables.environment 'development')}}
🛠️ Development settings applied
{{/if}}
`;

      const result = await templateEngine.renderTemplate(template, context);

      expect(result).toContain('❌ Error mode - errors only');
      expect(result).toContain('🌙 Dark theme enabled');
      expect(result).toContain('🧪 Staging settings applied');
    });
  });

  describe('Array and Object Conditional Logic', () => {
    test('should handle array-based conditions', async () => {
      const projectConfig: ProjectConfig = {
        name: 'array-conditional-test',
        description: 'Testing array conditional logic',
        qualityLevel: 'medium',
        projectType: 'library',
        aiAssistants: [],
      };

      const context = contextFactory.createExtended(projectConfig, {
        features: ['auth', 'logging', 'monitoring', 'cache'],
        dependencies: ['express', 'cors', 'helmet'],
        emptyArray: [],
        scripts: {
          build: 'tsc',
          test: 'jest',
          lint: 'eslint',
        },
      });

      const template = `
# Dependencies and Features

## Features Configuration
{{#ifArrayMinLength custom_variables.features 3}}
Multiple features configured:
{{#each custom_variables.features}}
- ✅ {{this}}
{{/each}}
{{else}}
Limited features configured
{{/ifArrayMinLength}}

## Dependencies Management
{{#ifArrayMaxLength custom_variables.dependencies 3}}
Core dependencies ({{custom_variables.dependencies.length}} total):
{{#each custom_variables.dependencies}}
- {{this}}
{{/each}}
{{else}}
External dependencies detected
{{/ifArrayMaxLength}}

## Build Scripts
{{#ifObjectMinSize custom_variables.scripts 3}}
Available scripts:
{{#each (objectKeys custom_variables.scripts)}}
- \`${this}\`
{{/each}}
{{else}}
Minimal script configuration
{{/ifObjectMinSize}}

## Array Validation
{{#ifArrayLength custom_variables.emptyArray 0}}
Empty array detected
{{else}}
Array has content
{{/ifArrayLength}}
`;

      const result = await templateEngine.renderTemplate(template, context);

      expect(result).toContain('Multiple features configured:');
      expect(result).toContain('- ✅ auth');
      expect(result).toContain('- ✅ logging');
      expect(result).toContain('Core dependencies (3 total):');
      expect(result).toContain('Available scripts:');
      expect(result).toContain('Empty array detected');
    });

    test('should handle object property conditions', async () => {
      const projectConfig: ProjectConfig = {
        name: 'object-conditional-test',
        description: 'Testing object conditional logic',
        qualityLevel: 'high',
        projectType: 'web',
        aiAssistants: ['claude-code'],
      };

      const context = contextFactory.createExtended(projectConfig, {
        server: {
          host: 'localhost',
          port: 3000,
          ssl: true,
          proxy: false,
        },
        database: {
          type: 'postgresql',
          host: 'db.example.com',
          port: 5432,
          ssl: true,
        },
        emptyObject: {},
        nullObject: null,
      });

      const template = `
# Server Configuration

## Main Server
{{#ifHasProperty custom_variables.server 'ssl'}}
{{#if custom_variables.server.ssl}}
🔒 SSL enabled for {{custom_variables.server.host}}:{{custom_variables.server.port}}
{{else}}
🔓 No SSL configured
{{/if}}
{{else}}
⚠️ Server configuration incomplete
{{/ifHasProperty}}

## Database Configuration
{{#if (and (ifHasProperty custom_variables.database 'type') (ifHasProperty custom_variables.database 'host'))}}
Database: {{custom_variables.database.type}} at {{custom_variables.database.host}}:{{custom_variables.database.port}}
{{#if custom_variables.database.ssl}}
🔒 Database connection secured with SSL
{{else}}
⚠️ Database connection not secured
{{/if}}
{{else}}
❌ Database configuration missing
{{/if}}

## Object Size Validation
{{#ifObjectSize custom_variables.emptyObject 0}}
Empty object detected
{{else}}
Object has properties
{{/ifObjectSize}}

{{#ifObjectSize custom_variables.nullObject 0}}
Null object detected
{{else}}
Non-null object
{{/ifObjectSize}}
`;

      const result = await templateEngine.renderTemplate(template, context);

      expect(result).toContain('🔒 SSL enabled for localhost:3000');
      expect(result).toContain('Database: postgresql at db.example.com:5432');
      expect(result).toContain('🔒 Database connection secured with SSL');
      expect(result).toContain('Empty object detected');
      expect(result).toContain('Null object detected');
    });
  });

  describe('Complex Conditional Scenarios', () => {
    test('should handle multi-level conditional logic for project generation', async () => {
      const projectConfig: ProjectConfig = {
        name: 'complex-conditional-app',
        description: 'Complex conditional logic test application',
        qualityLevel: 'strict',
        projectType: 'web',
        aiAssistants: ['claude-code', 'github-copilot'],
      };

      const context = contextFactory.createExtended(projectConfig, {
        features: {
          web: true,
          api: true,
          database: true,
          auth: true,
          logging: true,
          monitoring: false,
          testing: true,
          documentation: false,
        },
        deployment: {
          environment: 'production',
          containerized: true,
          ssl: true,
          cdn: true,
          monitoring: true,
        },
        performance: {
          caching: true,
          compression: true,
          minification: true,
          bundleAnalysis: false,
        },
      });

      const template = `
# Project Setup Summary

## Application Type
{{#if (and custom_variables.features.web custom_variables.features.api)}}
🌐 Full-stack web application with API
{{else if custom_variables.features.web}}
🖥️ Frontend web application
{{else if custom_variables.features.api}}
🔌 API-only application
{{else}}
📦 Utility/library project
{{/if}}

## Feature Matrix
{{#if (ifAll custom_variables.features.web custom_variables.features.api custom_variables.features.database)}}
### Complete Web Stack
- ✅ Frontend framework
- ✅ Backend API
- ✅ Database integration
{{/if}}

{{#if (ifAll custom_variables.features.auth custom_variables.features.logging custom_variables.features.testing)}}
### Development Quality
- ✅ Authentication system
- ✅ Logging framework
- ✅ Testing suite
{{/if}}

{{#if (ifAll custom_variables.features.monitoring custom_variables.features.documentation false)}}
### Operational Excellence
- ⚠️ Monitoring system (missing)
- ⚠️ Documentation (missing)
{{/if}}

## Deployment Configuration
{{#if (eq custom_variables.deployment.environment 'production')}}
🚀 Production Deployment
{{#if (ifAll custom_variables.deployment.containerized custom_variables.deployment.ssl custom_variables.deployment.cdn)}}
### Enterprise-Ready Setup
- ✅ Containerized deployment
- ✅ SSL/TLS encryption
- ✅ CDN distribution
{{/if}}

{{#if custom_variables.deployment.monitoring}}
### Monitoring Setup
- ✅ Application monitoring
{{#if (and custom_variables.features.database custom_variables.features.logging)}}
- ✅ Database performance monitoring
- ✅ Application logging
{{/if}}
{{else}}
⚠️ No monitoring configured
{{/if}}
{{else}}
🛠️ Development/Testing Environment
{{/if}}

## Performance Optimizations
{{#if (ifAll custom_variables.performance.caching custom_variables.performance.compression custom_variables.performance.minification)}}
### Performance Stack
- ✅ Response caching
- ✅ Content compression
- ✅ Asset minification
{{/if}}

{{#if custom_variables.performance.bundleAnalysis}}
📊 Bundle analysis enabled
{{else}}
📦 Bundle analysis disabled
{{/if}}
`;

      const result = await templateEngine.renderTemplate(template, context);

      expect(result).toContain('🌐 Full-stack web application with API');
      expect(result).toContain('### Complete Web Stack');
      expect(result).toContain('### Development Quality');
      expect(result).toContain('### Enterprise-Ready Setup');
      expect(result).toContain('### Performance Stack');
      expect(result).toContain('📦 Bundle analysis disabled');
    });

    test('should handle conditional file generation based on features', async () => {
      const projectConfig = createConditionalTestConfig();
      const context = createConditionalTestContext(projectConfig, contextFactory);

      // Test config file generation
      await testConfigFileGeneration(templateEngine, context);

      // Test setup file generation
      await testSetupFileGeneration(templateEngine, context);

      // Test documentation file generation
      await testDocumentationFileGeneration(templateEngine, context);
    });
  });

  describe('Performance and Error Handling', () => {
    test('should handle large conditional templates efficiently', async () => {
      const projectConfig: ProjectConfig = {
        name: 'performance-test',
        description: 'Performance testing for conditional logic',
        qualityLevel: 'high',
        projectType: 'cli',
        aiAssistants: [],
      };

      const context = contextFactory.createExtended(projectConfig, {
        items: Array.from({ length: 100 }, (_, i) => ({
          id: i,
          name: `Item ${i}`,
          active: i % 2 === 0,
          category: getCategory(i),
          metadata: {
            created: new Date().toISOString(),
            priority: i % 5,
            tags: [`tag-${i % 10}`, `cat-${i % 3}`],
          },
        })),
      });

      // Create a large template with many conditional blocks
      const largeTemplate = `
# Large Conditional Template Test

## Items Summary
{{#if (gt custom_variables.items.length 0)}}
Total items: {{custom_variables.items.length}}
{{#if (gt custom_variables.items.length 50)}}
Large dataset detected (> 50 items)
{{else}}
Small to medium dataset
{{/if}}
{{else}}
No items found
{{/if}}

## Detailed Items List
{{#each custom_variables.items}}
{{#if this.active}}
### {{this.name}} (ID: {{this.id}})
- Category: {{this.category}}
- Priority: {{this.metadata.priority}}
- Created: {{this.metadata.created}}
- Tags: {{#each this.metadata.tags}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}

{{#if (eq this.category 'A')}}
**Category A Item** - Special processing required
{{else if (eq this.category 'B')}}
**Category B Item** - Standard processing
{{else}}
**Category C Item** - Default processing
{{/if}}

{{#if (gte this.metadata.priority 4)}}
⚠️ High priority item - immediate attention required
{{/if}}

---
{{else}}
~~Item {{this.name}} (Inactive)~~
{{/if}}
{{/each}}

## Statistics
{{#if (ifAll (gt custom_variables.items.length 0) (ifExists custom_variables.items.0.active))}}
First item is active: {{custom_variables.items.0.active}}
{{/if}}

{{#if (ifAll (gt custom_variables.items.length 1) (ifExists custom_variables.items.1.active))}}
Second item is active: {{custom_variables.items.1.active}}
{{/if}}
`;

      const startTime = performance.now();
      const result = await templateEngine.renderTemplate(largeTemplate, context);
      const renderTime = performance.now() - startTime;

      expect(renderTime).toBeLessThan(200); // Should render in less than 200ms
      expect(result).toContain('Total items: 100');
      expect(result).toContain('Large dataset detected (> 50 items)');
      expect(result).toContain('Item 0 (ID: 0)');
      expect(result).toContain('~~Item Item 1 (Inactive)~~');
      expect(result).toContain('**Category A Item**');
      expect(result).toContain('**Category B Item**');
      expect(result).toContain('**Category C Item**');
      expect(result).toContain('⚠️ High priority item');
      expect(result).toContain('~~Item Item 1 (Inactive)~~');
    });

    test('should handle conditional syntax validation', async () => {
      const validTemplate = `
{{#if condition}}
  Content here
{{/if}}
{{#unless otherCondition}}
  Other content
{{/unless}}
{{#each items}}
  {{this}}
{{/each}}
`;

      const invalidTemplate = `
{{#if condition}}
  Content here
{{#unless otherCondition}}
  Invalid nesting
{{/unless}}
{{#each items}}
  {{this}}
{{/each}}
`;

      const validResult = ConditionalUtils.validateConditionalSyntax(validTemplate);
      expect(validResult.valid).toBe(true);
      expect(validResult.errors).toHaveLength(0);

      const invalidResult = ConditionalUtils.validateConditionalSyntax(invalidTemplate);
      expect(invalidResult.valid).toBe(false);
      expect(invalidResult.errors.length).toBeGreaterThan(0);
    });
  });
});
