/**
 * Integration Tests - Template Engine
 *
 * Tests for template rendering with various configurations
 * Priority: P1 - Core template functionality
 */
import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { mkdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { TemplateEngine } from '../../src/template-engine.js';

describe('Template Engine Integration [T011]', () => {
  let testDir: string;
  let templateEngine: TemplateEngine;

  beforeEach(async () => {
    testDir = join(tmpdir(), `nimata-template-engine-test-${Date.now()}`);
    await mkdir(testDir, { recursive: true });

    templateEngine = new TemplateEngine();
  });

  afterEach(async () => {
    await rm(testDir, { recursive: true, force: true });
  });

  describe('Basic Template Rendering [T011-10]', () => {
    it('[T011-11] should render simple React component template', async () => {
      const template = `import React from 'react';

interface {{componentName}}Props {
  name: string;
}

export function {{componentName}}({ name }: {{componentName}}Props): JSX.Element {
  return (
    <div className="{{componentName|lowercase}}">
      <h1>Hello {name}!</h1>
    </div>
  );
}

export default {{componentName}};`;

      const context = {
        componentName: 'TestComponent',
      };

      const result = await templateEngine.renderTemplate(template, context);

      expect(result).toContain("import React from 'react';");
      expect(result).toContain('interface TestComponentProps');
      expect(result).toContain('export function TestComponent');
      expect(result).toContain('<div className="testcomponent">');
      expect(result).toContain('export default TestComponent;');
    });

    it('[T011-12] should render package.json template with dependencies', async () => {
      const template = `{
  "name": "{{projectName}}",
  "version": "1.0.0",
  "description": "{{description}}",
  "author": "{{author}}",
  "license": "{{license}}",
  "scripts": {
    "test": "bun test",
    "build": "bun run build"
  },
  "dependencies": {
    {{#each dependencies}}
    "{{name}}": "{{version}}",
    {{/each}}
  },
  "devDependencies": {
    {{#each devDependencies}}
    "{{name}}": "{{version}}",
    {{/each}}
  }
}`;

      const context = {
        projectName: 'test-project',
        description: 'A test project',
        author: 'Test Author',
        license: 'MIT',
        dependencies: [
          { name: 'react', version: '^18.2.0' },
          { name: 'react-dom', version: '^18.2.0' },
        ],
        devDependencies: [
          { name: 'typescript', version: '^5.0.0' },
          { name: 'vitest', version: '^1.0.0' },
        ],
      };

      const result = await templateEngine.renderTemplate(template, context);

      expect(result).toContain('"name": "test-project"');
      expect(result).toContain('"description": "A test project"');
      expect(result).toContain('"author": "Test Author"');
      expect(result).toContain('"license": "MIT"');
      expect(result).toContain('"react": "^18.2.0"');
      expect(result).toContain('"react-dom": "^18.2.0"');
      expect(result).toContain('"typescript": "^5.0.0"');
      expect(result).toContain('"vitest": "^1.0.0"');
    });

    it('[T011-13] should render TypeScript configuration template', async () => {
      const template = `{
  "compilerOptions": {
    "target": "{{target}}",
    "module": "{{module}}",
    "lib": ["{{lib}}"],
    "outDir": "{{outDir}}",
    "rootDir": "{{rootDir}}",
    "strict": {{strict}},
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": [
    {{#each include}}
    "{{this}}",
    {{/each}}
  ],
  "exclude": [
    {{#each exclude}}
    "{{this}}",
    {{/each}}
  ]
}`;

      const context = {
        target: 'ES2022',
        module: 'ESNext',
        lib: 'ES2022',
        outDir: './dist',
        rootDir: './src',
        strict: true,
        include: ['src/**/*'],
        exclude: ['node_modules', 'dist', '**/*.test.ts'],
      };

      const result = await templateEngine.renderTemplate(template, context);

      const parsed = JSON.parse(result);
      expect(parsed.compilerOptions.target).toBe('ES2022');
      expect(parsed.compilerOptions.module).toBe('ESNext');
      expect(parsed.compilerOptions.strict).toBe(true);
      expect(parsed.include).toContain('src/**/*');
      expect(parsed.exclude).toContain('node_modules');
    });
  });

  describe('Helper Functions [T011-20]', () => {
    it('[T011-21] should use capitalize helper function', async () => {
      const template = `const {{helper:capitalize variableName}} = '{{value}}';`;

      const context = {
        variableName: 'userName',
        value: 'test value',
      };

      const result = await templateEngine.renderTemplate(template, context);

      expect(result).toContain("const UserName = 'test value';");
    });

    it('[T011-22] should use lowercase helper function', async () => {
      const template = `const {{helper:lowercase className}} = {{helper:uppercase constant}};`;

      const context = {
        className: 'MyClass',
        constant: 'max_value',
      };

      const result = await templateEngine.renderTemplate(template, context);

      expect(result).toContain('const myclass = MAX_VALUE;');
    });

    it('[T011-23] should use kebab-case helper function', async () => {
      const template = `const {{helper:kebabcase componentName}} = '{{componentName}}';`;

      const context = {
        componentName: 'MyComponent',
      };

      const result = await templateEngine.renderTemplate(template, context);

      expect(result).toContain("const my-component = 'MyComponent';");
    });

    it('[T011-24] should use pascal-case helper function', async () => {
      const template = `const {{helper:pascalcase fileName}} = '{{fileName}}';`;

      const context = {
        fileName: 'my-component-name',
      };

      const result = await templateEngine.renderTemplate(template, context);

      expect(result).toContain("const MyComponentName = 'my-component-name';");
    });
  });

  describe('Conditional Rendering [T011-30]', () => {
    it('[T011-31] should render conditional sections', async () => {
      const template = `import React from 'react';

{{#if useTypeScript}}
interface Props {
  name: string;
}
{{else}}
interface Props {
  name: string;
  age?: number;
}
{{/if}}

export function Component({ name }: Props): JSX.Element {
  return <div>Hello {name}!</div>;
}`;

      const typeScriptContext = { useTypeScript: true };
      const typeScriptResult = await templateEngine.renderTemplate(template, typeScriptContext);

      expect(typeScriptResult).toContain('interface Props {');
      expect(typeScriptResult).toContain('name: string;');
      expect(typeScriptResult).not.toContain('age?: number;');

      const jsContext = { useTypeScript: false };
      const jsResult = await templateEngine.renderTemplate(template, jsContext);

      expect(jsResult).toContain('interface Props {');
      expect(jsResult).toContain('name: string;');
      expect(jsResult).toContain('age?: number;');
    });

    it('[T011-32] should render nested conditionals', async () => {
      const template = `{{#if hasAuth && isOAuth}}
// OAuth authentication setup
{{else}}
{{#if hasAuth}}
// Basic authentication setup
{{else}}
// No authentication setup
{{/if}}
{{/if}}`;

      const oauthContext = { hasAuth: true, isOAuth: true };
      const oauthResult = await templateEngine.renderTemplate(template, oauthContext);

      expect(oauthResult).toContain('OAuth authentication setup');
      expect(oauthResult).not.toContain('Basic authentication setup');

      const basicAuthContext = { hasAuth: true, isOAuth: false };
      const basicAuthResult = await templateEngine.renderTemplate(template, basicAuthContext);

      expect(basicAuthResult).not.toContain('OAuth authentication setup');
      expect(basicAuthResult).toContain('Basic authentication setup');

      const noAuthContext = { hasAuth: false, isOAuth: false };
      const noAuthResult = await templateEngine.renderTemplate(template, noAuthContext);

      expect(noAuthResult).not.toContain('OAuth authentication setup');
      expect(noAuthResult).not.toContain('Basic authentication setup');
    });
  });

  describe('Loop Rendering [T011-40]', () => {
    it('[T011-41] should render simple loops', async () => {
      const template = `{{#each items}}
import { {{this}} } from './{{this}}';
{{/each}}`;

      const context = {
        items: ['ComponentA', 'ComponentB', 'ComponentC'],
      };

      const result = await templateEngine.renderTemplate(template, context);

      expect(result).toContain("import { ComponentA } from './ComponentA';");
      expect(result).toContain("import { ComponentB } from './ComponentB';");
      expect(result).toContain("import { ComponentC } from './ComponentC';");
    });

    it('[T011-42] should render loops with index', async () => {
      const template = `const items = [
{{#each items}}
  { id: {{@index}}, name: '{{this}}' },
{{/each}}
];`;

      const context = {
        items: ['apple', 'banana', 'cherry'],
      };

      const result = await templateEngine.renderTemplate(template, context);

      expect(result).toContain("{ id: 0, name: 'apple' }");
      expect(result).toContain("{ id: 1, name: 'banana' }");
      expect(result).toContain("{ id: 2, name: 'cherry' }");
    });

    it('[T011-43] should render object loops', async () => {
      const template = `const config = {
{{#each config}}
  {{@key}}: {{this}},
{{/each}}
};`;

      const context = {
        config: {
          port: 3000,
          host: 'localhost',
          ssl: true,
        },
      };

      const result = await templateEngine.renderTemplate(template, context);

      expect(result).toContain('port: 3000');
      expect(result).toContain('host: localhost');
      expect(result).toContain('ssl: true');
    });
  });

  describe('Complex Templates [T011-50]', () => {
    it('[T011-51] should render React component with complex structure', async () => {
      const template = `import React, { useState } from 'react';

{{#if interfaces}}
{{#each interfaces}}
interface {{this.name}} {
  {{#each this.properties}}
  {{name}}: {{type}};
  {{/each}}
}
{{/each}}
{{/if}}

export function {{componentName}}({{#if props}}{{props}}{{/if}}): JSX.Element {
  {{#if useState}}
  const [state, setState] = useState<{{stateType}}>({{initialState}});
  {{/if}}

  return (
    <div className="{{helper:lowercase componentName}}">
      <h1>{{title}}</h1>
      {{#if children}}
      <div className="content">
        {{children}}
      </div>
      {{/if}}
    </div>
  );
}

export default {{componentName}};`;

      const context = {
        interfaces: [
          {
            name: 'Props',
            properties: [
              { name: 'title', type: 'string' },
              { name: 'children?', type: 'React.ReactNode' },
            ],
          },
        ],
        componentName: 'MyComponent',
        props: '{ title, children }: Props',
        useState: true,
        stateType: 'number',
        initialState: '0',
        title: '{{title}}',
        children: '{{children}}',
      };

      const result = await templateEngine.renderTemplate(template, context);

      expect(result).toContain('interface Props');
      expect(result).toContain('title: string;');
      expect(result).toContain('children?: React.ReactNode;');
      expect(result).toContain('export function MyComponent({ title, children }: Props)');
      expect(result).toContain('const [state, setState] = useState<number>(0);');
      expect(result).toContain('<div className="mycomponent">');
      expect(result).toContain('<h1>{{title}}</h1>');
    });

    it('[T011-52] should render Express server template', async () => {
      const template = `import express from 'express';
{{#if imports}}
{{#each imports}}
import {{this}};
{{/each}}
{{/if}}

const app = express();
const PORT = process.env.PORT || {{port}};

{{#if middleware}}
{{#each middleware}}
app.use({{this}});
{{/each}}
{{/if}}

{{#if routes}}
{{#each routes}}
app.{{method}}('{{path}}', {{handler}});
{{/each}}
{{/if}}

app.listen(PORT, () => {
  // Server running on port PORT - replaced console.log for test standards
});

export default app;`;

      const context = {
        imports: ["cors from 'cors'", "helmet from 'helmet'", "morgan from 'morgan'"],
        port: 3000,
        middleware: ['cors()', 'helmet()', "morgan('combined')"],
        routes: [
          {
            method: 'get',
            path: '/',
            handler: '(req, res) => res.json({ message: "Hello World!" })',
          },
          {
            method: 'post',
            path: '/api/data',
            handler: '(req, res) => res.json({ data: req.body })',
          },
        ],
      };

      const result = await templateEngine.renderTemplate(template, context);

      expect(result).toContain("import cors from 'cors';");
      expect(result).toContain("import helmet from 'helmet';");
      expect(result).toContain("import morgan from 'morgan';");
      expect(result).toContain('const PORT = process.env.PORT || 3000;');
      expect(result).toContain('app.use(cors());');
      expect(result).toContain('app.use(helmet());');
      expect(result).toContain("app.use(morgan('combined'));");
      expect(result).toContain(
        'app.get(\'/\', (req, res) => res.json({ message: "Hello World!" }));'
      );
      expect(result).toContain(
        "app.post('/api/data', (req, res) => res.json({ data: req.body }));"
      );
    });
  });

  describe('Error Handling [T011-60]', () => {
    it('[T011-61] should handle missing variables gracefully', async () => {
      const template = 'Hello {{missingVar}}!';

      const context = {};

      const result = await templateEngine.renderTemplate(template, context);

      expect(result).toBe('Hello !');
    });

    it('[T011-62] should handle undefined helper functions', async () => {
      const template = 'Result: {{helper:nonexistent value}}';

      const context = { value: 'test' };

      const result = await templateEngine.renderTemplate(template, context);

      expect(result).toBe('Result: ');
    });

    it('[T011-63] should handle malformed templates', async () => {
      const template = 'Invalid {{ syntax';

      const context = {};

      const result = await templateEngine.renderTemplate(template, context);

      expect(result).toBe('Invalid {{ syntax');
    });
  });
});
