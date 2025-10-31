/**
 * Template Engine Test Data Factories
 *
 * Provides factory functions for creating template-related test data
 * with realistic defaults and explicit overrides.
 */

/**
 * Template context interface for test data
 */
export interface TemplateContext {
  project_name: string;
  description?: string;
  version?: string;
  author?: {
    name?: string;
    email?: string;
    url?: string;
  };
  strict?: boolean;
  enableLogger?: boolean;
  hasRoutes?: boolean;
  timestamp?: string;
  nested?: Record<string, unknown>;
  [key: string]: unknown;
}

/**
 * Project template interface for test data
 */
export interface ProjectTemplate {
  name: string;
  description?: string;
  version?: string;
  files: TemplateFile[];
  helpers?: string[];
}

export interface TemplateFile {
  path: string;
  template: string;
  condition?: string;
  permissions?: string;
}

/**
 * Creates a template context with sensible defaults
 */
export function createTemplateContext(overrides: Partial<TemplateContext> = {}): TemplateContext {
  const timestamp = new Date().toISOString();

  return {
    project_name: 'test-project',
    description: 'A test project for template engine',
    version: '1.0.0',
    author: {
      name: 'Test Author',
      email: 'test@example.com',
      url: 'https://example.com',
    },
    strict: false,
    enableLogger: false,
    hasRoutes: false,
    timestamp,
    nested: {
      value: 'test-value',
      enabled: true,
      count: 42,
    },
    ...overrides,

    // Handle nested author overrides properly
    author: {
      name: 'Test Author',
      email: 'test@example.com',
      url: 'https://example.com',
      ...(overrides.author || {}),
    },
  };
}

/**
 * Creates a project template with test files
 */
export function createProjectTemplate(
  files: Array<Partial<TemplateFile>> = [],
  overrides: Partial<ProjectTemplate> = {}
): ProjectTemplate {
  const defaultFiles: TemplateFile[] = [
    {
      path: 'package.json',
      template: `{
  "name": "{{project_name}}",
  "version": "{{version}}",
  "description": "{{description}}"
}`,
    },
    {
      path: 'README.md',
      template: `# {{project_name}}

{{description}}

Author: {{author.name}} ({{author.email}})`,
    },
  ];

  const templateFiles =
    files.length > 0
      ? files.map((file) => ({
          path: file.path || `test-file-${Date.now()}-${files.indexOf(file)}.txt`, // Deterministic unique test filename
          template: file.template || 'Test content {{project_name}}',
          condition: file.condition,
          permissions: file.permissions,
        }))
      : defaultFiles;

  return {
    name: 'test-template',
    description: 'A test template',
    version: '1.0.0',
    files: templateFiles,
    ...overrides,
  };
}

/**
 * Creates a simple template file
 */
export function createTemplateFile(
  path: string,
  template: string,
  condition?: string,
  permissions?: string
): TemplateFile {
  return {
    path,
    template,
    condition,
    permissions,
  };
}

/**
 * Creates a TypeScript-specific template context
 */
export function createTypeScriptTemplateContext(
  overrides: Partial<TemplateContext> = {}
): TemplateContext {
  return createTemplateContext({
    project_name: 'typescript-app',
    description: 'A TypeScript application',
    strict: true,
    enableLogger: true,
    hasRoutes: true,
    nested: {
      target: 'ES2022',
      module: 'ESNext',
      outDir: './dist',
    },
    ...overrides,
  });
}

/**
 * Creates a Bun-specific template context
 */
export function createBunTemplateContext(
  overrides: Partial<TemplateContext> = {}
): TemplateContext {
  return createTemplateContext({
    project_name: 'bun-app',
    description: 'A Bun runtime application',
    version: '1.0.0',
    nested: {
      runtime: 'bun',
      target: 'bun',
      packageManager: 'bun',
    },
    ...overrides,
  });
}

/**
 * Creates a complex template with multiple files and conditions
 */
export function createComplexProjectTemplate(
  files: TemplateFile[] = [],
  overrides: Partial<ProjectTemplate> = {}
): ProjectTemplate {
  const defaultComplexFiles: TemplateFile[] = [
    createTemplateFile(
      'package.json',
      `{
  "name": "{{project_name}}",
  "version": "{{version}}",
  "description": "{{description}}",
  "main": "src/index.ts",
  "scripts": {
    "dev": "bun run src/index.ts",
    "build": "bun build src/index.ts --outdir dist",
    "test": "bun test"
    {{#if strict}},
    "lint": "eslint src --ext .ts"
    {{/if}}
  },
  "dependencies": {
    "zod": "^4.1.12"
  }{{#if devDependencies}},
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0"
  }{{/if}}
}`
    ),
    createTemplateFile(
      'tsconfig.json',
      `{
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
    "esModuleInterop": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}`,
      'strict' // Only include if strict is true
    ),
    createTemplateFile(
      'src/index.ts',
      `/**
 * {{project_name}}
 * {{description}}
 */

// {{welcome_message || "Welcome to " + project_name}} - replaced console.log for test standards

{{#if enableLogger}}
import { Logger } from './utils/logger';
const logger = new Logger('{{project_name}}');
logger.info('Application started');
{{/if}}

{{#if hasRoutes}}
import { Router } from './router';
const router = new Router();
{{/if}}`
    ),
    createTemplateFile(
      'README.md',
      `# {{project_name}}

{{description}}

## Features

{{#if strict}}
- ✅ TypeScript strict mode enabled
{{/if}}
{{#if enableLogger}}
- ✅ Structured logging
{{/if}}
{{#if hasRoutes}}
- ✅ Routing system
{{/if}}

## Getting Started

\`\`\`bash
bun install
bun run dev
\`\`\`
`
    ),
  ];

  return createProjectTemplate(files.length > 0 ? files : defaultComplexFiles, {
    name: 'complex-template',
    description: 'A complex template with multiple features',
    ...overrides,
  });
}

/**
 * Creates template context for testing error scenarios
 */
export function createErrorTestContext(overrides: Partial<TemplateContext> = {}): TemplateContext {
  return createTemplateContext({
    project_name: '', // Empty to test error handling
    description: undefined, // Undefined to test missing values
    strict: null as any, // Null to test edge cases
    nested: {
      // Circular reference test (if supported)
      value: 'test',
      ref: null as any,
    },
    ...overrides,
  });
}

/**
 * Creates multiple template contexts for batch testing
 */
export function createTemplateContexts(
  count: number,
  baseOverrides: Partial<TemplateContext> = {}
): TemplateContext[] {
  return Array.from({ length: count }, (_, i) =>
    createTemplateContext({
      project_name: `test-project-${i}`,
      description: `Test project number ${i}`,
      version: `1.${i}.0`,
      ...baseOverrides,
    })
  );
}

/**
 * Creates a template for testing performance with many files
 */
export function createLargeProjectTemplate(
  fileCount = 100,
  overrides: Partial<ProjectTemplate> = {}
): ProjectTemplate {
  const files: TemplateFile[] = Array.from({ length: fileCount }, (_, i) =>
    createTemplateFile(
      `src/module${i}.ts`,
      `// Module ${i}
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

  public getInfo(): string {
    return \`\${this.name}: \${this.description}\`;
  }
}`
    )
  );

  return createProjectTemplate(files, {
    name: 'large-template',
    description: 'A large template with many files for performance testing',
    ...overrides,
  });
}

/**
 * Helper function to create template with specific syntax features
 */
export function createTemplateWithSyntaxFeature(
  feature: 'conditionals' | 'loops' | 'partials' | 'helpers' | 'variables',
  overrides: Partial<ProjectTemplate> = {}
): ProjectTemplate {
  let files: TemplateFile[] = [];

  switch (feature) {
    case 'conditionals':
      files = [
        createTemplateFile(
          'conditional.json',
          `{
  "name": "{{project_name}}",
  "strict": {{#if strict}}true{{else}}false{{/if}},
  "logger": {{#if enableLogger}}"enabled"{{else}}"disabled"{{/if}}
}`
        ),
      ];
      break;

    case 'variables':
      files = [
        createTemplateFile(
          'variables.txt',
          `Project: {{project_name}}
Version: {{version}}
Author: {{author.name}} ({{author.email}})
Nested: {{nested.value}}
Timestamp: {{timestamp}}`
        ),
      ];
      break;

    case 'helpers':
      files = [
        createTemplateFile(
          'helpers.txt',
          `Upper: {{upper project_name}}
Lower: {{lower description}}
Capitalized: {{capitalize author.name}}`
        ),
      ];
      break;

    default:
      files = [createTemplateFile('default.txt', '{{project_name}} - {{description}}')];
  }

  return createProjectTemplate(files, {
    name: `${feature}-template`,
    description: `Template for testing ${feature}`,
    ...overrides,
  });
}
