# @nimata/adapters Examples

This document provides comprehensive examples of using the @nimata/adapters package for TypeScript project generation and CLI utilities.

## Table of Contents

- [Basic Usage](#basic-usage)
- [Project Generation](#project-generation)
- [Template Engine](#template-engine)
- [Configuration Generators](#configuration-generators)
- [Project Validation](#project-validation)
- [CLI Utilities](#cli-utilities)
- [Performance Optimization](#performance-optimization)
- [Error Handling](#error-handling)
- [Complete Workflows](#complete-workflows)

## Basic Usage

### Simple Project Generation

```typescript
import { createEnhancedInitCommand } from '@nimata/adapters';

// Create command instance
const initCommand = createEnhancedInitCommand();

// Generate a basic TypeScript project
await initCommand.execute('my-project', {
  template: 'basic',
  quality: 'medium',
  ai: 'claude-code',
});
```

### Using Individual Components

```typescript
import { ProjectGenerator, TemplateEngine, createProjectValidator } from '@nimata/adapters';

// Generate project
const generator = new ProjectGenerator();
await generator.generate({
  name: 'my-app',
  type: 'web',
  quality: 'strict',
  aiAssistants: ['claude-code', 'copilot'],
});

// Validate project
const validator = createProjectValidator();
const result = await validator.validateProject({
  projectPath: './my-app',
  config: {
    name: 'my-app',
    qualityLevel: 'strict',
    projectType: 'web',
    aiAssistants: ['claude-code', 'copilot'],
  },
});

console.log('Validation result:', result);
```

## Project Generation

### Generate Different Project Types

```typescript
import { ProjectGenerator } from '@nimata/adapters';

const generator = new ProjectGenerator();

// Basic TypeScript project
await generator.generate({
  name: 'basic-lib',
  type: 'basic',
  quality: 'medium',
  aiAssistants: ['claude-code'],
});

// Web application
await generator.generate({
  name: 'web-app',
  type: 'web',
  quality: 'strict',
  aiAssistants: ['claude-code', 'copilot'],
  description: 'A modern web application with Express.js',
});

// CLI tool
await generator.generate({
  name: 'my-cli',
  type: 'cli',
  quality: 'medium',
  aiAssistants: ['copilot'],
  description: 'Command-line interface tool',
});

// Library package
await generator.generate({
  name: 'awesome-lib',
  type: 'library',
  quality: 'strict',
  aiAssistants: ['claude-code'],
  description: 'Reusable TypeScript library',
});
```

### Custom Project Configuration

```typescript
import { ProjectGenerator, createProjectWizard } from '@nimata/adapters';

// Interactive project setup
const wizard = createProjectWizard();
const config = await wizard.run();

// Generate with custom configuration
const generator = new ProjectGenerator();
await generator.generate({
  ...config,
  // Override specific settings
  description: 'Custom project description',
  quality: 'strict',
  aiAssistants: ['claude-code', 'copilot'],
});
```

### Batch Project Generation

```typescript
import { ProjectGenerator, Performance } from '@nimata/adapters';

async function generateMultipleProjects(
  projects: Array<{
    name: string;
    type: 'basic' | 'web' | 'cli' | 'library';
    quality: 'light' | 'medium' | 'strict';
  }>
) {
  const generator = new ProjectGenerator();
  const queue = Performance.queue(3); // 3 concurrent operations

  const results = await Promise.allSettled(
    projects.map((project) =>
      queue.add(() =>
        generator.generate({
          name: project.name,
          type: project.type,
          quality: project.quality,
          aiAssistants: ['claude-code'],
        })
      )
    )
  );

  await queue.drain(); // Wait for all operations to complete

  return results;
}

// Usage
const projects = [
  { name: 'service-a', type: 'web' as const, quality: 'strict' as const },
  { name: 'service-b', type: 'web' as const, quality: 'medium' as const },
  { name: 'shared-lib', type: 'library' as const, quality: 'strict' as const },
  { name: 'dev-cli', type: 'cli' as const, quality: 'light' as const },
];

const results = await generateMultipleProjects(projects);
results.forEach((result, index) => {
  if (result.status === 'fulfilled') {
    console.log(`✅ ${projects[index].name} generated successfully`);
  } else {
    console.error(`❌ ${projects[index].name} failed:`, result.reason);
  }
});
```

## Template Engine

### Basic Template Rendering

```typescript
import { TemplateEngine } from '@nimata/adapters';

const engine = new TemplateEngine();

// Simple variable substitution
const result1 = await engine.render('Hello {{name}}!', { name: 'World' });
console.log(result1); // "Hello World!"

// Complex template with conditionals
const template = `
{{#if user}}
Welcome back, {{user.name}}!
{{#if user.isAdmin}}
You have administrator privileges.
{{/if}}
{{else}}
Please log in to continue.
{{/if}}
`;

const result2 = await engine.render(template, {
  user: {
    name: 'John',
    isAdmin: true,
  },
});
```

### Template with Helpers

```typescript
import { TemplateEngine } from '@nimata/adapters';

const engine = new TemplateEngine();

// Register custom helper
engine.registerHelper('uppercase', (str: string) => str.toUpperCase());
engine.registerHelper('formatDate', (date: Date) => date.toISOString());

const template = `
Project: {{uppercase name}}
Created: {{formatDate createdAt}}
Type: {{type}}
{{#if isTSReady}}
✅ TypeScript Ready
{{/if}}
`;

const result = await engine.render(template, {
  name: 'My Project',
  createdAt: new Date(),
  type: 'web',
  isTSReady: true,
});
```

### Template Inheritance

```typescript
import { TemplateEngine } from '@nimata/adapters';

const engine = new TemplateEngine();

// Base template
const baseTemplate = `
<!DOCTYPE html>
<html>
<head>
  <title>{{title}}</title>
  {{{head}}}
</head>
<body>
  <header>{{{header}}}</header>
  <main>{{{content}}}</main>
  <footer>{{{footer}}}</footer>
</body>
</html>
`;

// Page template
const pageTemplate = `
{{> base}}
{{#content}}
<h1>{{pageTitle}}</h1>
<p>{{pageContent}}</p>
{{/content}}
`;

await engine.registerPartial('base', baseTemplate);
const result = await engine.render(pageTemplate, {
  title: 'My Page',
  pageTitle: 'Welcome',
  pageContent: 'This is my page content.',
});
```

## Configuration Generators

### ESLint Configuration

```typescript
import { ESLintGenerator } from '@nimata/adapters';

const eslintGen = new ESLintGenerator();

// Generate for different project types
const basicConfig = await eslintGen.generate({
  name: 'basic-project',
  projectType: 'basic',
  qualityLevel: 'medium',
  aiAssistants: ['claude-code'],
});

const strictConfig = await eslintGen.generate({
  name: 'strict-project',
  projectType: 'web',
  qualityLevel: 'strict',
  aiAssistants: ['claude-code', 'copilot'],
});

console.log('ESLint files:', Object.keys(basicConfig.files));
```

### TypeScript Configuration

```typescript
import { TypeScriptGenerator } from '@nimata/adapters';

const tsGen = new TypeScriptGenerator();

const config = await tsGen.generate({
  name: 'my-project',
  projectType: 'library',
  qualityLevel: 'strict',
  aiAssistants: ['claude-code'],
});

// Access generated files
console.log('TypeScript configs:', Object.keys(config.files));
// - tsconfig.json
// - tsconfig.base.json
// - tsconfig.build.json
// - tsconfig.test.json
// - tsconfig.eslint.json
```

### AI Assistant Configuration

```typescript
import { ClaudeMDGenerator, CopilotGenerator, AIContextGenerator } from '@nimata/adapters';

// Claude.md configuration
const claudeGen = new ClaudeMDGenerator();
const claudeConfig = await claudeGen.generate({
  name: 'my-project',
  projectType: 'web',
  qualityLevel: 'strict',
  aiAssistants: ['claude-code'],
});

// GitHub Copilot configuration
const copilotGen = new CopilotGenerator();
const copilotConfig = await copilotGen.generate({
  name: 'my-project',
  projectType: 'web',
  qualityLevel: 'strict',
  aiAssistants: ['copilot'],
});

// Unified AI context
const aiContextGen = new AIContextGenerator();
const unifiedConfig = await aiContextGen.generate({
  name: 'my-project',
  projectType: 'web',
  qualityLevel: 'strict',
  aiAssistants: ['claude-code', 'copilot'],
});
```

## Project Validation

### Basic Validation

```typescript
import { createProjectValidator } from '@nimata/adapters';

const validator = createProjectValidator();

const result = await validator.validateProject({
  projectPath: './my-project',
  config: {
    name: 'my-project',
    qualityLevel: 'medium',
    projectType: 'web',
    aiAssistants: ['claude-code'],
  },
  verbose: true,
});

if (result.success) {
  console.log('✅ Project is valid!');
  console.log('Info:', result.info);
} else {
  console.log('❌ Validation failed:');
  result.errors.forEach((error) => console.log(`  - ${error}`));
  result.warnings.forEach((warning) => console.log(`  ⚠️  ${warning}`));
}
```

### Comprehensive Validation Pipeline

```typescript
import { createProjectValidator, Progress } from '@nimata/adapters';

async function validateProjectWithProgress(projectPath: string) {
  const validator = createProjectValidator();
  const progress = Progress.steps(
    [
      { name: 'Loading configuration', weight: 1 },
      { name: 'Validating structure', weight: 2 },
      { name: 'Checking configurations', weight: 2 },
      { name: 'Validating dependencies', weight: 1 },
      { name: 'Checking AI setup', weight: 1 },
    ],
    'Project Validation'
  );

  progress.start();

  try {
    progress.nextStep();
    const config = await loadProjectConfig(projectPath);
    progress.increment('Configuration loaded');

    progress.nextStep();
    const result = await validator.validateProject({
      projectPath,
      config,
      verbose: true,
    });

    progress.complete('Validation complete');

    return result;
  } catch (error) {
    progress.stop();
    throw error;
  }
}
```

## CLI Utilities

### Progress Indicators

```typescript
import { Progress } from '@nimata/adapters';

// Simple progress bar
const progress = Progress.create({
  total: 100,
  label: 'Downloading packages',
  showPercentage: true,
  showTime: true,
});

progress.start();

// Simulate progress
for (let i = 0; i <= 100; i += 10) {
  progress.update(i, `Processing item ${i / 10}`);
  await new Promise((resolve) => setTimeout(resolve, 100));
}

progress.complete('Download complete!');

// Multi-step progress
const steps = Progress.steps(
  [
    { name: 'Setup environment', weight: 1 },
    { name: 'Install dependencies', weight: 3 },
    { name: 'Build project', weight: 2 },
    { name: 'Run tests', weight: 2 },
    { name: 'Generate documentation', weight: 1 },
  ],
  'CI Pipeline'
);

steps.start();

steps.nextStep();
steps.update(1, 'Creating build directory...');
await new Promise((resolve) => setTimeout(resolve, 500));

steps.nextStep();
steps.update(1, 'Installing npm packages...');
await new Promise((resolve) => setTimeout(resolve, 2000));

steps.complete('Pipeline completed successfully!');
```

### Enhanced Logging

```typescript
import { CLI } from '@nimata/adapters';

// Create logger with custom options
const logger = CLI.logger({
  verbose: true,
  color: true,
  json: false, // Set to true for structured logging
});

// Different log levels
logger.success('Project generated successfully!');
logger.info('Using TypeScript configuration');
logger.warn('Deprecated option detected');
logger.error('Failed to install dependencies');

// Debug logging with data
logger.debug('Template variables:', {
  name: 'my-project',
  type: 'web',
  quality: 'strict',
});

// Step logging
logger.step(1, 5, 'Setting up project structure');
logger.step(2, 5, 'Generating configuration files');

// Headers and separators
logger.header('Project Generation');
logger.info('Starting project generation...');
logger.separator();
```

### Spinners and Indeterminate Progress

```typescript
import { CLI } from '@nimata/adapters';

const logger = CLI.logger();

// Create spinner
const spinner = logger.spinner('Installing dependencies...');
spinner.start();

// Simulate work
await new Promise((resolve) => setTimeout(resolve, 3000));

// Stop with final message
spinner.stop('Dependencies installed successfully!');

// Update spinner message during work
const longSpinner = logger.spinner('Processing files...');
longSpinner.start();

const files = ['file1.ts', 'file2.ts', 'file3.ts'];
for (const file of files) {
  longSpinner.updateMessage(`Processing ${file}...`);
  await new Promise((resolve) => setTimeout(resolve, 1000));
}

longSpinner.stop('All files processed!');
```

## Performance Optimization

### Caching

```typescript
import { Performance } from '@nimata/adapters';

// In-memory caching
const cache = Performance.memoryCache({
  ttl: 5 * 60 * 1000, // 5 minutes
  maxSize: 100,
});

// Cache expensive operations
async function expensiveOperation(input: string): Promise<string> {
  const cacheKey = `op:${input}`;

  // Try to get from cache
  let result = cache.get(cacheKey);
  if (result) {
    return result;
  }

  // Perform expensive operation
  console.log('Computing expensive operation...');
  await new Promise((resolve) => setTimeout(resolve, 1000));
  result = `Result for ${input}`;

  // Cache the result
  cache.set(cacheKey, result);
  return result;
}

// File system caching
const fsCache = Performance.fileSystemCache({
  ttl: 60 * 60 * 1000, // 1 hour
  directory: './.cache',
});

async function downloadAndCache(url: string): Promise<string> {
  const cacheKey = Buffer.from(url).toString('base64');

  // Try cache first
  let content = await fsCache.get(cacheKey);
  if (content) {
    console.log('Using cached content');
    return content;
  }

  // Download content
  console.log('Downloading content...');
  content = await fetch(url).then((r) => r.text());

  // Cache for future use
  await fsCache.set(cacheKey, content);
  return content;
}
```

### Performance Monitoring

```typescript
import { Performance } from '@nimata/adapters';

const monitor = Performance.monitor();

// Monitor individual operations
async function monitoredOperation() {
  const id = monitor.start('database-query');

  try {
    // Perform database operation
    await new Promise((resolve) => setTimeout(resolve, 250));

    const metric = monitor.stop(id);
    console.log(`Query completed in ${metric?.duration}ms`);
  } catch (error) {
    monitor.stop(id);
    throw error;
  }
}

// Monitor multiple operations
async function complexWorkflow() {
  const operations = ['load-config', 'validate-input', 'process-data', 'save-results'];

  for (const op of operations) {
    const id = monitor.start(op);
    await new Promise((resolve) => setTimeout(resolve(Math.random() * 1000)));
    monitor.stop(id);
  }

  // Show performance summary
  monitor.printSummary();
}
```

### Async Operations

```typescript
import { Performance } from '@nimata/adapters';

// Concurrent operation queue
const queue = Performance.queue(3); // 3 concurrent operations

async function processFiles(files: string[]) {
  const results = await Promise.all(
    files.map(file =>
      queue.add(async () => {
        const id = monitor.start(`process-${file}`);

        try {
          // Process file
          await new Promise(resolve => setTimeout(resolve, Math.random() * 1000)));
          console.log(`Processed ${file}`);

          return { file, status: 'success' };
        } finally {
          monitor.stop(id);
        }
      })
    )
  );

  await queue.drain(); // Wait for all operations
  return results;
}

// Debounce and throttle operations
const debouncedSearch = Performance.debounce(async (query: string) => {
  console.log('Searching for:', query);
  // Expensive search operation
}, 300);

const throttledSave = Performance.throttle(async (data: any) => {
  console.log('Saving data...');
  // Save operation
}, 1000);

// Memoized functions
const memoizedExpensive = Performance.memoize(
  async (input: number) => {
    console.log('Computing expensive result...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    return input * 2;
  }
);

// Usage
await memoizedExpensive(5); // Computes
await memoizedExpensive(5); // Uses cache
await memoizedExpensive(10); // Computes new value
```

## Error Handling

### Sophisticated Error Handling

```typescript
import { CLI } from '@nimata/adapters';

const logger = CLI.logger({ verbose: true });
const errorHandler = CLI.errorHandler(logger);

async function robustOperation() {
  try {
    // Risky operation
    throw new Error('EACCES: permission denied to write to directory');
  } catch (error) {
    // Handle with context and suggestions
    errorHandler.handle(error as any, 'file write operation');
  }
}

// Create custom CLI errors
function validateInput(input: string) {
  if (!input || input.length < 3) {
    throw CLI.error('Input too short', {
      type: 'validation',
      code: 'INPUT_TOO_SHORT',
      suggestions: [
        'Use at least 3 characters',
        'Check the input requirements',
        'Try a different value',
      ],
    });
  }
}

// Error recovery strategies
async function operationWithRetry(operation: () => Promise<any>, maxRetries = 3) {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      logger.debug(`Attempt ${attempt} of ${maxRetries}`);
      return await operation();
    } catch (error) {
      lastError = error as Error;
      logger.warn(`Attempt ${attempt} failed: ${error.message}`);

      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
        logger.info(`Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  // All attempts failed
  errorHandler.handle(lastError as any, `operation after ${maxRetries} attempts`);
  throw lastError;
}
```

## Complete Workflows

### Full Project Generation Pipeline

```typescript
import {
  ProjectGenerator,
  createProjectValidator,
  createEnhancedInitCommand,
  Progress,
  CLI,
  Performance,
} from '@nimata/adapters';

async function completeProjectWorkflow(config: {
  name: string;
  type: 'basic' | 'web' | 'cli' | 'library';
  quality: 'light' | 'medium' | 'strict';
  aiAssistants: Array<'claude-code' | 'copilot'>;
  targetDir?: string;
}) {
  const logger = CLI.logger({ verbose: true });
  const monitor = Performance.monitor();
  const progress = Progress.steps(
    [
      { name: 'Validate configuration', weight: 1 },
      { name: 'Generate project', weight: 5 },
      { name: 'Validate output', weight: 2 },
      { name: 'Install dependencies', weight: 3 },
      { name: 'Final validation', weight: 1 },
    ],
    'Complete Project Setup'
  );

  progress.start();

  try {
    // Step 1: Validate configuration
    progress.nextStep();
    const configId = monitor.start('config-validation');

    if (!config.name || !config.type || !config.quality) {
      throw new Error('Missing required configuration fields');
    }

    monitor.stop(configId);
    progress.increment('Configuration validated');

    // Step 2: Generate project
    progress.nextStep();
    const genId = monitor.start('project-generation');

    const generator = new ProjectGenerator();
    const targetPath = config.targetDir || `./${config.name}`;

    await generator.generate({
      name: config.name,
      type: config.type,
      quality: config.quality,
      aiAssistants: config.aiAssistants,
      targetPath,
    });

    monitor.stop(genId);
    progress.increment(`Project generated in ${targetPath}`);

    // Step 3: Validate generated project
    progress.nextStep();
    const validateId = monitor.start('project-validation');

    const validator = createProjectValidator();
    const validation = await validator.validateProject({
      projectPath: targetPath,
      config: {
        name: config.name,
        qualityLevel: config.quality,
        projectType: config.type,
        aiAssistants: config.aiAssistants,
      },
      verbose: true,
    });

    if (!validation.success) {
      logger.error('Project validation failed:');
      validation.errors.forEach((error) => logger.error(`  - ${error}`));
      throw new Error('Generated project failed validation');
    }

    monitor.stop(validateId);
    progress.increment('Project validation passed');

    // Step 4: Install dependencies
    progress.nextStep();
    const installId = monitor.start('dependency-installation');

    // Simulate dependency installation
    logger.info('Installing dependencies...');
    await new Promise((resolve) => setTimeout(resolve, 2000));

    monitor.stop(installId);
    progress.increment('Dependencies installed');

    // Step 5: Final validation
    progress.nextStep();
    const finalId = monitor.start('final-validation');

    // Run final checks
    logger.info('Running final validation...');
    await new Promise((resolve) => setTimeout(resolve, 1000));

    monitor.stop(finalId);
    progress.complete('Project setup completed successfully!');

    // Show results
    logger.success(`✨ Project "${config.name}" is ready!`);
    logger.separator();
    logger.info('Next steps:');
    logger.info(`  1. cd ${targetPath}`);
    logger.info('  2. bun install or npm install');
    logger.info('  3. bun run dev or npm run dev');
    logger.separator();

    // Performance summary
    if (logger['verbose']) {
      monitor.printSummary();
    }

    return {
      success: true,
      projectPath: targetPath,
      validation,
      metrics: monitor.getMetrics(),
    };
  } catch (error) {
    progress.stop();
    const errorHandler = CLI.errorHandler(logger);
    errorHandler.handle(error as any, 'project generation workflow');
    throw error;
  }
}

// Usage example
await completeProjectWorkflow({
  name: 'my-awesome-project',
  type: 'web',
  quality: 'strict',
  aiAssistants: ['claude-code', 'copilot'],
  targetDir: './projects',
});
```

### Interactive CLI Session

```typescript
import { createEnhancedInitCommand, CLI } from '@nimata/adapters';

async function interactiveSession() {
  const logger = CLI.logger({ color: true });

  logger.header('🚀 Nìmata CLI - Interactive Project Generator');

  const command = createEnhancedInitCommand();

  // Simulate interactive input
  const answers = {
    projectName: 'my-interactive-project',
    projectType: 'web',
    qualityLevel: 'medium',
    aiAssistants: ['claude-code'],
    features: ['eslint', 'prettier', 'testing'],
    skipInstall: false,
  };

  logger.info('📝 Project Configuration:');
  Object.entries(answers).forEach(([key, value]) => {
    const formattedKey = key.replace(/([A-Z])/g, ' $1').toLowerCase();
    logger.info(`  ${formattedKey}: ${Array.isArray(value) ? value.join(', ') : value}`);
  });

  // Confirm configuration
  logger.separator();
  logger.info('Generating project with the above configuration...');

  // Execute generation
  await command.execute(answers.projectName, {
    template: answers.projectType,
    quality: answers.qualityLevel,
    ai: answers.aiAssistants.join(','),
    skipInstall: answers.skipInstall,
    verbose: true,
  });
}

// Run interactive session
await interactiveSession();
```

These examples demonstrate the comprehensive capabilities of the @nimata/adapters package for TypeScript project generation, CLI utilities, and development workflows.
