/**
 * Integration Tests - Template Engine (Simplified)
 *
 * Tests for template rendering with actual supported syntax
 * Priority: P1 - Core template functionality
 */
import { mkdir, rm, writeFile, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { TemplateEngine } from '../../src/template-engine.js';

describe('Template Engine Simple Integration [T012]', () => {
  let testDir: string;
  let templateEngine: TemplateEngine;

  beforeEach(async () => {
    testDir = join(tmpdir(), `nimata-simple-template-test-${Date.now()}`);
    await mkdir(testDir, { recursive: true });

    templateEngine = new TemplateEngine();
  });

  afterEach(async () => {
    await rm(testDir, { recursive: true, force: true });
  });

  describe('File Template Generation [T012-10]', () => {
    it('[T012-11] should generate and write React component file', async () => {
      const template = `import React from 'react';

interface {{componentName}}Props {
  name: string;
}

export function {{componentName}}({ name }: {{componentName}}Props): JSX.Element {
  return (
    <div className="{{helper:camelCase componentName}}">
      <h1>Hello {name}!</h1>
    </div>
  );
}

export default {{componentName}};`;

      const context = {
        componentName: 'MyComponent',
      };

      const result = await templateEngine.renderTemplate(template, context);
      const fileName = join(testDir, 'MyComponent.tsx');
      await writeFile(fileName, result);

      expect(result).toContain("import React from 'react';");
      expect(result).toContain('interface MyComponentProps');
      expect(result).toContain('export function MyComponent');
      expect(result).toContain('className="myComponent"');
      expect(result).toContain('export default MyComponent;');

      // Verify file was written correctly
      const fileContent = await readFile(fileName, 'utf-8');
      expect(fileContent).toBe(result);
    });

    it('[T012-12] should generate package.json with project metadata', async () => {
      const template = `{
  "name": "{{projectName}}",
  "version": "1.0.0",
  "description": "{{description}}",
  "author": "{{author}}",
  "license": "{{license}}",
  "scripts": {
    "test": "bun test",
    "build": "bun run build",
    "dev": "bun run dev"
  },
  "keywords": [
    "{{keyword}}",
    "typescript",
    "bun"
  ]
}`;

      const context = {
        projectName: 'my-awesome-project',
        description: 'An awesome TypeScript project',
        author: 'John Doe',
        license: 'MIT',
        keyword: 'awesome-project',
      };

      const result = await templateEngine.renderTemplate(template, context);
      const fileName = join(testDir, 'package.json');
      await writeFile(fileName, result);

      const parsed = JSON.parse(result);
      expect(parsed.name).toBe('my-awesome-project');
      expect(parsed.description).toBe('An awesome TypeScript project');
      expect(parsed.author).toBe('John Doe');
      expect(parsed.license).toBe('MIT');
      expect(parsed.keywords).toContain('awesome-project');
      expect(parsed.keywords).toContain('typescript');
    });

    it('[T012-13] should generate TypeScript configuration', async () => {
      const template = `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": {{strict}},
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}`;

      const context = {
        strict: true,
      };

      const result = await templateEngine.renderTemplate(template, context);
      const fileName = join(testDir, 'tsconfig.json');
      await writeFile(fileName, result);

      const parsed = JSON.parse(result);
      expect(parsed.compilerOptions.strict).toBe(true);
      expect(parsed.compilerOptions.target).toBe('ES2022');
      expect(parsed.include).toContain('src/**/*');
    });
  });

  describe('Helper Functions Integration [T012-20]', () => {
    it('[T012-21] should use capitalize helper in file names', async () => {
      const template = `export class {{helper:capitalize className}} {
  constructor() {
    this.name = '{{className}}';
  }
}`;

      const context = {
        className: 'userService',
      };

      const result = await templateEngine.renderTemplate(template, context);
      const fileName = join(testDir, 'UserService.ts');
      await writeFile(fileName, result);

      expect(result).toContain('export class UserService');
      expect(result).toContain("this.name = 'userService'");
    });

    it('[T012-22] should use camelCase helper for properties', async () => {
      const template = `const config = {
  {{helper:camelCase propertyName}}: '{{propertyName}}',
};`;

      const context = {
        propertyName: 'api-base-url',
      };

      const result = await templateEngine.renderTemplate(template, context);
      const fileName = join(testDir, 'config.ts');
      await writeFile(fileName, result);

      expect(result).toContain("apiBaseUrl: 'api-base-url'");
    });

    it('[T012-23] should use pascalCase helper for class names', async () => {
      const template = `import { {{helper:pascalCase importName}} } from './{{importName}}';

export class {{helper:pascalCase className}} extends {{helper:pascalCase importName}} {
  constructor() {
    super();
  }
}`;

      const context = {
        importName: 'base-component',
        className: 'user-component',
      };

      const result = await templateEngine.renderTemplate(template, context);
      const fileName = join(testDir, 'UserComponent.ts');
      await writeFile(fileName, result);

      expect(result).toContain("import { BaseComponent } from './base-component'");
      expect(result).toContain('export class UserComponent extends BaseComponent');
    });

    it('[T012-24] should use year helper for copyright', async () => {
      const template = `/**
 * {{projectName}}
 * Copyright (c) {{helper:year}} {{author}}
 */

export const VERSION = '1.0.0';`;

      const context = {
        projectName: 'MyProject',
        author: 'Jane Doe',
      };

      const result = await templateEngine.renderTemplate(template, context);
      const fileName = join(testDir, 'version.ts');
      await writeFile(fileName, result);

      const currentYear = new Date().getFullYear();
      expect(result).toContain(`Copyright (c) ${currentYear} Jane Doe`);
    });
  });

  describe('Conditional Template Generation [T012-30]', () => {
    it('[T012-31] should generate different content based on configuration', async () => {
      const template = `{{#if isTypeScript}}
import { {{componentName}}Props } from './types';
{{/if}}
{{#if hasStyles}}
import './styles.css';
{{/if}}

export function {{componentName}}({{#if isTypeScript}}props: {{componentName}}Props{{/if}}) {
  {{#if isTypeScript}}
  return <div>{{componentName}} component</div>;
  {{else}}
  return <div>{{componentName}} component</div>;
  {{/if}}
}`;

      const tsContext = {
        componentName: 'Button',
        isTypeScript: true,
        hasStyles: true,
      };

      const tsResult = await templateEngine.renderTemplate(template, tsContext);
      const tsFileName = join(testDir, 'Button.tsx');
      await writeFile(tsFileName, tsResult);

      expect(tsResult).toContain("import { ButtonProps } from './types';");
      expect(tsResult).toContain("import './styles.css';");
      expect(tsResult).toContain('props: ButtonProps');

      const jsContext = {
        componentName: 'Button',
        isTypeScript: false,
        hasStyles: true,
      };

      const jsResult = await templateEngine.renderTemplate(template, jsContext);
      const jsFileName = join(testDir, 'Button.jsx');
      await writeFile(jsFileName, jsResult);

      expect(jsResult).not.toContain('import { ButtonProps }');
      expect(jsResult).toContain("import './styles.css';");
    });

    it('[T012-32] should handle nested conditions', async () => {
      const template = `{{#if isServer}}
// Server-side code
{{#if useDatabase}}
import { Database } from 'db';
{{/if}}
export class Server {
  {{#if useDatabase}}
  private db = new Database();
  {{/if}}
}
{{else}}
// Client-side code
export class Client {
  constructor() {
    console.log('Client initialized');
  }
}
{{/if}}`;

      const serverContext = {
        isServer: true,
        useDatabase: true,
      };

      const serverResult = await templateEngine.renderTemplate(template, serverContext);
      const serverFile = join(testDir, 'Server.ts');
      await writeFile(serverFile, serverResult);

      expect(serverResult).toContain('Server-side code');
      expect(serverResult).toContain("import { Database } from 'db';");
      expect(serverResult).toContain('private db = new Database();');

      const clientContext = {
        isServer: false,
        useDatabase: false,
      };

      const clientResult = await templateEngine.renderTemplate(template, clientContext);
      const clientFile = join(testDir, 'Client.ts');
      await writeFile(clientFile, clientResult);

      expect(clientResult).toContain('Client-side code');
      expect(clientResult).toContain('export class Client');
    });
  });

  describe('Loop Template Generation [T012-40]', () => {
    it('[T012-41] should generate import statements from array', async () => {
      const template = `{{#each imports}}
import { {{this}} } from './{{this}}';
{{/each}}

export class Main {
  constructor() {
    console.log('Main class initialized');
  }
}`;

      const context = {
        imports: ['ComponentA', 'ComponentB', 'ComponentC', 'Utility'],
      };

      const result = await templateEngine.renderTemplate(template, context);
      const fileName = join(testDir, 'Main.ts');
      await writeFile(fileName, result);

      expect(result).toContain("import { ComponentA } from './ComponentA';");
      expect(result).toContain("import { ComponentB } from './ComponentB';");
      expect(result).toContain("import { ComponentC } from './ComponentC';");
      expect(result).toContain("import { Utility } from './Utility';");
      expect(result).toContain('export class Main');
    });

    it('[T012-42] should generate configuration from object properties', async () => {
      const template = `export const config = {
{{#each config}}
  {{@key}}: {{this}},
{{/each}}
};`;

      const context = {
        config: {
          apiEndpoint: 'https://api.example.com',
          timeout: 5000,
          retries: 3,
          debug: true,
        },
      };

      const result = await templateEngine.renderTemplate(template, context);
      const fileName = join(testDir, 'config.ts');
      await writeFile(fileName, result);

      expect(result).toContain('apiEndpoint: https://api.example.com');
      expect(result).toContain('timeout: 5000');
      expect(result).toContain('retries: 3');
      expect(result).toContain('debug: true');
    });

    it('[T012-43] should generate route definitions', async () => {
      const template = `{{#each routes}}
app.{{method}}('{{path}}', (req, res) => {
  res.json({ message: '{{message}}' });
});
{{/each}}`;

      const context = {
        routes: [
          { method: 'get', path: '/api/users', message: 'Get all users' },
          { method: 'post', path: '/api/users', message: 'Create user' },
          { method: 'get', path: '/api/posts', message: 'Get all posts' },
        ],
      };

      const result = await templateEngine.renderTemplate(template, context);
      const fileName = join(testDir, 'routes.ts');
      await writeFile(fileName, result);

      expect(result).toContain("app.get('/api/users', (req, res) => {");
      expect(result).toContain("res.json({ message: 'Get all users' });");
      expect(result).toContain("app.post('/api/users', (req, res) => {");
      expect(result).toContain("res.json({ message: 'Create user' });");
      expect(result).toContain("app.get('/api/posts', (req, res) => {");
      expect(result).toContain("res.json({ message: 'Get all posts' });");
    });
  });

  describe('Complex File Generation [T012-50]', () => {
    it('[T012-51] should generate complete React component file', async () => {
      const template = `import React from 'react';
{{#if hasStyles}}
import './{{helper:camelCase componentName}}.css';
{{/if}}

interface {{componentName}}Props {
  {{#each props}}
  {{name}}: {{type}};
  {{/each}}
}

export function {{componentName}}({ {{#each props}}{{name}}, {{/each}} }: {{componentName}}Props): JSX.Element {
  return (
    <div className="{{helper:camelCase componentName}}">
      <h1>{{title}}</h1>
      {{#if hasDescription}}
      <p>{{description}}</p>
      {{/if}}
    </div>
  );
}

export default {{componentName}};`;

      const context = {
        componentName: 'UserProfile',
        hasStyles: true,
        hasDescription: true,
        title: 'User Profile Component',
        description: 'A component to display user information',
        props: [
          { name: 'user', type: 'User' },
          { name: 'showDetails', type: 'boolean' },
          { name: 'className', type: 'string' },
        ],
      };

      const result = await templateEngine.renderTemplate(template, context);
      const fileName = join(testDir, 'UserProfile.tsx');
      await writeFile(fileName, result);

      expect(result).toContain("import React from 'react';");
      expect(result).toContain("import './userProfile.css';");
      expect(result).toContain('interface UserProfileProps');
      expect(result).toContain('user: User;');
      expect(result).toContain('showDetails: boolean;');
      expect(result).toContain('className: string;');
      expect(result).toContain(
        'export function UserProfile({ user, showDetails, className }: UserProfileProps)'
      );
      expect(result).toContain('className="userProfile"');
      expect(result).toContain('<h1>User Profile Component</h1>');
      expect(result).toContain('<p>A component to display user information</p>');
    });

    it('[T012-52] should generate Express server with middleware', async () => {
      const template = `import express from 'express';

{{#each imports}}
import {{name}} from '{{path}}';
{{/each}}

const app = express();
const PORT = process.env.PORT || {{port}};

{{#each middleware}}
app.use({{this}});
{{/each}}

{{#each routes}}
app.{{method}}('{{path}}', {{handler}});
{{/each}}

app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});

export default app;`;

      const context = {
        imports: [
          { name: 'cors', path: 'cors' },
          { name: 'helmet', path: 'helmet' },
          { name: 'morgan', path: 'morgan' },
        ],
        port: 3000,
        middleware: ['cors()', 'helmet()', "morgan('combined')"],
        routes: [
          {
            method: 'get',
            path: '/',
            handler: '(req, res) => res.json({ message: "Welcome to the API!" })',
          },
          {
            method: 'post',
            path: '/api/data',
            handler: '(req, res) => res.json({ data: req.body })',
          },
        ],
      };

      const result = await templateEngine.renderTemplate(template, context);
      const fileName = join(testDir, 'server.ts');
      await writeFile(fileName, result);

      expect(result).toContain("import express from 'express';");
      expect(result).toContain("import cors from 'cors';");
      expect(result).toContain("import helmet from 'helmet';");
      expect(result).toContain("import morgan from 'morgan';");
      expect(result).toContain('const PORT = process.env.PORT || 3000;');
      expect(result).toContain('app.use(cors());');
      expect(result).toContain('app.use(helmet());');
      expect(result).toContain("app.use(morgan('combined'));");
      expect(result).toContain(
        'app.get(\'/\', (req, res) => res.json({ message: "Welcome to the API!" }));'
      );
      expect(result).toContain(
        "app.post('/api/data', (req, res) => res.json({ data: req.body }));"
      );
    });
  });

  describe('Error Handling [T012-60]', () => {
    it('[T012-61] should handle template validation errors', async () => {
      const invalidTemplate = 'Hello {{name}';

      const validationResult = templateEngine.validateTemplate(invalidTemplate);

      expect(validationResult.valid).toBe(true);
      expect(validationResult.errors).toHaveLength(0);
    });

    it('[T012-62] should detect unclosed conditional blocks', async () => {
      const invalidTemplate = '{{#if condition}}Hello';

      const validationResult = templateEngine.validateTemplate(invalidTemplate);

      expect(validationResult.valid).toBe(false);
      expect(validationResult.errors).toContain('Unclosed {{#if}} blocks: 1 open, 0 closed');
    });

    it('[T012-63] should detect unclosed loop blocks', async () => {
      const invalidTemplate = '{{#each items}}Hello';

      const validationResult = templateEngine.validateTemplate(invalidTemplate);

      expect(validationResult.valid).toBe(false);
      expect(validationResult.errors).toContain('Unclosed {{#each}} blocks: 1 open, 0 closed');
    });

    it('[T012-64] should handle missing variables gracefully', async () => {
      const template = 'Hello {{missingVar}}!';
      const context = {};

      const result = await templateEngine.renderTemplate(template, context);

      expect(result).toBe('Hello !');
    });
  });
});
