/**
 * Template Engine Test Fixture
 *
 * Provides common setup and teardown for template engine tests.
 * Includes temporary directory management and template file creation.
 */

import { beforeEach, afterEach } from 'bun:test';
import { mkdtemp, rm, writeFile, mkdir } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
// Import the Handlebars template engine (will fail during RED phase)
import { HandlebarsTemplateEngine } from '../../src/template-engine-handlebars';

/**
 * Template engine test fixture interface
 */
export interface TemplateEngineTestFixture {
  tempDir: string;
  templatesDir: string;
  outputDir: string;
  templateEngine: HandlebarsTemplateEngine;
}

/**
 * Creates a template engine test fixture with temporary directories
 */
export function createTemplateEngineTestFixture(): () => TemplateEngineTestFixture {
  let fixture: TemplateEngineTestFixture;

  beforeEach(async () => {
    // Create temporary directory structure
    const tempDir = await mkdtemp(join(tmpdir(), 'nimata-template-test-'));
    const templatesDir = join(tempDir, 'templates', 'typescript-bun-cli');
    const outputDir = join(tempDir, 'output');

    await mkdir(templatesDir, { recursive: true });
    await mkdir(outputDir, { recursive: true });

    // Initialize template engine
    const templateEngine = new HandlebarsTemplateEngine(templatesDir);

    fixture = {
      tempDir,
      templatesDir,
      outputDir,
      templateEngine,
    };
  });

  afterEach(async () => {
    // Clean up temporary directory
    if (fixture?.tempDir) {
      await rm(fixture.tempDir, { recursive: true, force: true });
    }
  });

  return () => fixture;
}

/**
 * Creates a template engine test fixture with custom templates directory
 */
export function createTemplateEngineTestFixtureWithCustomDir(
  customTemplatesDir: string
): () => TemplateEngineTestFixture {
  let fixture: TemplateEngineTestFixture;

  beforeEach(async () => {
    // Create temporary directory structure
    const tempDir = await mkdtemp(join(tmpdir(), 'nimata-template-test-'));
    const outputDir = join(tempDir, 'output');

    await mkdir(customTemplatesDir, { recursive: true });
    await mkdir(outputDir, { recursive: true });

    // Initialize template engine with custom directory
    const templateEngine = new HandlebarsTemplateEngine(customTemplatesDir);

    fixture = {
      tempDir,
      templatesDir: customTemplatesDir,
      outputDir,
      templateEngine,
    };
  });

  afterEach(async () => {
    // Clean up temporary directory
    if (fixture?.tempDir) {
      await rm(fixture.tempDir, { recursive: true, force: true });
    }
  });

  return () => fixture;
}

/**
 * Helper to write a template file
 */
export async function writeTemplateFile(
  fixture: TemplateEngineTestFixture,
  templateName: string,
  templateContent: Record<string, unknown>
): Promise<void> {
  const templatePath = join(fixture.templatesDir, `${templateName}.json`);
  await writeFile(templatePath, JSON.stringify(templateContent, null, 2));
}

/**
 * Helper to write multiple template files
 */
export async function writeTemplateFiles(
  fixture: TemplateEngineTestFixture,
  templates: Record<string, Record<string, unknown>>
): Promise<void> {
  await Promise.all(
    Object.entries(templates).map(([name, content]) => writeTemplateFile(fixture, name, content))
  );
}

/**
 * Helper to create a simple template file
 */
export async function createSimpleTemplate(
  fixture: TemplateEngineTestFixture,
  name: string,
  files: Array<{ path: string; template: string; condition?: string }>
): Promise<void> {
  const templateContent = {
    name,
    description: `Template ${name}`,
    files,
  };

  await writeTemplateFile(fixture, name, templateContent);
}

/**
 * Helper to create a Handlebars template file
 */
export async function createHandlebarsTemplate(
  fixture: TemplateEngineTestFixture,
  name: string,
  files: Array<{ path: string; template: string; condition?: string }>
): Promise<void> {
  const templateContent = {
    name,
    description: `Handlebars template ${name}`,
    version: '1.0.0',
    files,
  };

  await writeTemplateFile(fixture, name, templateContent);
}

/**
 * Helper to create templates directory structure for multiple tech stacks
 */
export async function createMultiTechStackStructure(
  fixture: TemplateEngineTestFixture,
  techStacks: string[]
): Promise<void> {
  const templatesDir = join(fixture.tempDir, 'templates');

  await Promise.all(
    techStacks.map(async (techStack) => {
      const techStackDir = join(templatesDir, techStack);
      await mkdir(techStackDir, { recursive: true });

      // Create a basic template for each tech stack
      const basicTemplate = {
        name: techStack,
        description: `Basic ${techStack} template`,
        files: [
          {
            path: 'README.md',
            template: `# {{project_name}}\n\n{{description}}\n\nTech Stack: ${techStack}`,
          },
        ],
      };

      const templatePath = join(techStackDir, `${techStack}.json`);
      await writeFile(templatePath, JSON.stringify(basicTemplate, null, 2));
    })
  );
}

/**
 * Helper to create a template with syntax errors for testing validation
 */
export async function createInvalidTemplate(
  fixture: TemplateEngineTestFixture,
  name: string,
  errorType: 'syntax' | 'structure' | 'json'
): Promise<void> {
  let templateContent: Record<string, unknown>;

  switch (errorType) {
    case 'syntax':
      templateContent = {
        name,
        description: `Invalid template ${name}`,
        files: [
          {
            path: 'invalid.txt',
            template: 'Hello {{project_name}}{{#if unclosed', // Invalid Handlebars syntax
          },
        ],
      };
      break;

    case 'structure':
      templateContent = {
        name,
        // Missing required 'files' property
        description: `Invalid structure template ${name}`,
      };
      break;

    case 'json':
      // Create invalid JSON directly
      const templatePath = join(fixture.templatesDir, `${name}.json`);
      await writeFile(templatePath, '{"invalid": json content}'); // Invalid JSON
      return;

    default:
      throw new Error(`Unknown error type: ${errorType}`);
  }

  await writeTemplateFile(fixture, name, templateContent);
}

/**
 * Helper to verify generated files exist and have correct content
 */
export async function verifyGeneratedFiles(
  fixture: TemplateEngineTestFixture,
  expectedFiles: Array<{ path: string; content: string }>
): Promise<void> {
  const { readFile } = await import('fs/promises');

  await Promise.all(
    expectedFiles.map(async (expectedFile) => {
      const filePath = join(fixture.outputDir, expectedFile.path);
      await readFile(filePath, 'utf-8'); // File read for future integration test scenarios

      // Note: This will be used in integration tests where files are actually written
      // For now, this helper is for future integration test scenarios
    })
  );
}

/**
 * Helper to measure performance of template operations
 */
export async function measurePerformance<T>(
  operation: () => Promise<T>
): Promise<{ result: T; duration: number }> {
  const startTime = Date.now();
  const result = await operation();
  const endTime = Date.now();

  return {
    result,
    duration: endTime - startTime,
  };
}

/**
 * Extended fixture for performance testing
 */
export interface PerformanceTestFixture extends TemplateEngineTestFixture {
  performanceMetrics: Array<{
    operation: string;
    duration: number;
    timestamp: number;
  }>;
}

/**
 * Creates a performance-focused template engine test fixture
 */
export function createPerformanceTestFixture(): () => PerformanceTestFixture {
  let fixture: PerformanceTestFixture;

  beforeEach(async () => {
    const baseFixture = createTemplateEngineTestFixture()();
    const tempDir = await mkdtemp(join(tmpdir(), 'nimata-template-perf-test-'));
    const templatesDir = join(tempDir, 'templates', 'typescript-bun-cli');
    const outputDir = join(tempDir, 'output');

    await mkdir(templatesDir, { recursive: true });
    await mkdir(outputDir, { recursive: true });

    const templateEngine = new HandlebarsTemplateEngine(templatesDir);

    fixture = {
      ...baseFixture(),
      tempDir,
      templatesDir,
      outputDir,
      templateEngine,
      performanceMetrics: [],
    };
  });

  afterEach(async () => {
    if (fixture?.tempDir) {
      await rm(fixture.tempDir, { recursive: true, force: true });
    }
  });

  return () => fixture;
}

/**
 * Helper to measure and record performance in performance tests
 */
export async function measureAndRecordPerformance<T>(
  fixture: PerformanceTestFixture,
  operation: string,
  fn: () => Promise<T>
): Promise<T> {
  const startTime = Date.now();
  const result = await fn();
  const duration = Date.now() - startTime;

  fixture.performanceMetrics.push({
    operation,
    duration,
    timestamp: Date.now(),
  });

  return result;
}
