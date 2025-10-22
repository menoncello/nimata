# @nimata/adapters

Adapter implementations for the Nìmata TypeScript CLI project generator.

## Overview

This package provides the core adapters and utilities for generating TypeScript projects with various templates, configurations, and AI assistant integrations.

## Features

### 🚀 Project Generation

- **Multiple Templates**: Basic, Web, CLI, and Library project types
- **Quality Levels**: Light, Medium, and Strict code quality configurations
- **AI Assistant Integration**: Claude Code and GitHub Copilot support
- **Interactive Mode**: Guided project setup with wizard interface

### 🛠️ Configuration Generators

- **ESLint**: Comprehensive linting rules with TypeScript support
- **TypeScript**: Multi-config setup (base, build, test, etc.)
- **Prettier**: Code formatting with project-specific rules
- **Vitest**: Modern testing framework configuration
- **AI Context**: Claude.md and Copilot instruction generation

### 📊 User Experience

- **Progress Indicators**: Visual feedback during project generation
- **Error Handling**: Detailed error messages with suggestions
- **Help System**: Comprehensive help documentation and examples
- **Performance Optimization**: Caching and async operation handling

## Installation

```bash
npm install @nimata/adapters
# or
bun add @nimata/adapters
```

## Quick Start

```typescript
import { createEnhancedInitCommand } from '@nimata/adapters';

// Create and use the enhanced init command
const initCommand = createEnhancedInitCommand();
const command = initCommand.createCommand();

// Execute with options
await initCommand.execute('my-project', {
  template: 'web',
  quality: 'strict',
  ai: 'claude-code,copilot',
  verbose: true,
});
```

## Core Components

### Project Generator

```typescript
import { ProjectGenerator } from '@nimata/adapters';

const generator = new ProjectGenerator();
await generator.generate({
  name: 'my-project',
  type: 'web',
  quality: 'medium',
  aiAssistants: ['claude-code'],
});
```

### Template Engine

```typescript
import { TemplateEngine } from '@nimata/adapters';

const engine = new TemplateEngine();
const result = await engine.render('Hello {{name}}!', { name: 'World' });
```

### Configuration Generators

```typescript
import { ESLintGenerator, TypeScriptGenerator, PrettierGenerator } from '@nimata/adapters';

const eslintGen = new ESLintGenerator();
const eslintConfig = await eslintGen.generate(config);

const tsGen = new TypeScriptGenerator();
const tsConfig = await tsGen.generate(config);
```

### Project Validator

```typescript
import { createProjectValidator } from '@nimata/adapters';

const validator = createProjectValidator();
const result = await validator.validateProject({
  projectPath: './my-project',
  config: projectConfig,
  verbose: true,
});

if (result.success) {
  console.log('✅ Project is valid!');
} else {
  console.log('❌ Issues found:', result.errors);
}
```

## CLI Utilities

### Progress Indicators

```typescript
import { Progress } from '@nimata/adapters';

// Simple progress
const progress = Progress.create({ total: 100, label: 'Processing' });
progress.start();
progress.update(50, 'Halfway there...');
progress.complete('Done!');

// Step-based progress
const steps = Progress.steps(
  [
    { name: 'Setup', weight: 1 },
    { name: 'Build', weight: 2 },
    { name: 'Test', weight: 1 },
  ],
  'Project Generation'
);

steps.start();
steps.nextStep();
steps.update(1, 'Building...');
steps.complete();
```

### Enhanced Logging

```typescript
import { CLI } from '@nimata/adapters';

const logger = CLI.logger({ verbose: true, color: true });

logger.success('Operation completed!');
logger.error('Something went wrong');
logger.warn('Please check this');
logger.info('Useful information');
logger.debug('Debug details');

const spinner = logger.spinner('Working...');
spinner.start();
// ... do work
spinner.stop('All done!');
```

### Error Handling

```typescript
import { CLI } from '@nimata/adapters';

const logger = CLI.logger();
const errorHandler = CLI.errorHandler(logger);

try {
  // ... risky operation
} catch (error) {
  errorHandler.handle(error, 'operation context');
}
```

### Performance Monitoring

```typescript
import { Performance } from '@nimata/adapters';

// Monitor operations
const monitor = Performance.monitor();
const id = monitor.start('database-query');
// ... perform operation
const metric = monitor.stop(id);
console.log(`Query took ${metric.duration}ms`);

// Cache frequently used results
const cache = Performance.memoryCache<string>({ ttl: 60000 });
cache.set('user:123', JSON.stringify(userData));
const cached = cache.get('user:123');

// Debounce expensive operations
const debouncedSearch = Performance.debounce(searchAPI, 300);
debouncedSearch(query);
```

### Help System

```typescript
import { Help } from '@nimata/adapters';

// Show general help
Help.show();

// Show command-specific help
Help.command('init');

// Show topic help
Help.topic('project-types');

// List all topics
Help.topics();
```

## Project Templates

### Basic TypeScript Project

- Minimal TypeScript setup
- ESLint and Prettier configuration
- Basic testing with Vitest
- Suitable for libraries and small applications

### Web Application

- Express.js setup
- Static file serving
- API route structure
- Frontend build configuration
- Development server

### CLI Application

- Commander.js integration
- Argument parsing
- Help system
- Subcommand structure
- Distribution setup

### Library Package

- UMD/IIFE build support
- Declaration files
- Multiple export formats
- Documentation generation
- Publishing configuration

## Quality Levels

### Light

- Basic ESLint rules
- Simple TypeScript configuration
- Minimal dependencies
- Fast setup

### Medium (Default)

- Comprehensive ESLint rules
- Strict TypeScript settings
- Testing framework
- Code formatting

### Strict

- Maximum TypeScript strictness
- Comprehensive linting
- Type checking for all files
- Pre-commit hooks
- Quality gates

## AI Assistant Integration

### Claude Code

- Generates `CLAUDE.md` with project context
- Includes coding standards and best practices
- Project-specific guidelines
- Development workflow instructions

### GitHub Copilot

- Creates `.github/copilot-instructions.md`
- Code style guidelines
- Framework-specific patterns
- Security and performance considerations

## Examples

### Generate a Web Project with Strict Quality

```typescript
import { createEnhancedInitCommand } from '@nimata/adapters';

const command = createEnhancedInitCommand();
await command.execute('my-web-app', {
  template: 'web',
  quality: 'strict',
  ai: 'claude-code',
  verbose: true,
});
```

### Create a CLI Tool with Multiple AI Assistants

```typescript
await command.execute('my-cli-tool', {
  template: 'cli',
  quality: 'medium',
  ai: 'claude-code,copilot',
  directory: './tools',
  skipInstall: false,
});
```

### Generate and Validate a Library

```typescript
import { ProjectGenerator, createProjectValidator } from '@nimata/adapters';

const generator = new ProjectGenerator();
const validator = createProjectValidator();

// Generate project
await generator.generate({
  name: 'my-library',
  type: 'library',
  quality: 'strict',
  aiAssistants: ['copilot'],
});

// Validate generated project
const validation = await validator.validateProject({
  projectPath: './my-library',
  config: {
    name: 'my-library',
    qualityLevel: 'strict',
    projectType: 'library',
    aiAssistants: ['copilot'],
  },
});

if (!validation.success) {
  console.error('Validation failed:', validation.errors);
}
```

## API Reference

### Classes

- `ProjectGenerator` - Main project generation orchestrator
- `TemplateEngine` - Template rendering and processing
- `ProjectValidator` - Project structure and configuration validation
- `ProgressIndicator` - Visual progress feedback
- `StepProgressIndicator` - Multi-step progress tracking
- `Spinner` - Indeterminate progress indicator
- `CLILogger` - Enhanced logging with multiple levels
- `CLIErrorHandler` - Sophisticated error handling with suggestions
- `HelpSystem` - Comprehensive help documentation
- `PerformanceMonitor` - Operation timing and metrics
- `MemoryCache` - In-memory caching with TTL
- `FileSystemCache` - File-based caching system
- `AsyncQueue` - Concurrent operation management

### Generators

- `ESLintGenerator` - ESLint configuration generation
- `TypeScriptGenerator` - TypeScript configuration generation
- `PrettierGenerator` - Prettier configuration generation
- `VitestGenerator` - Vitest configuration generation
- `ClaudeMDGenerator` - Claude Code instruction generation
- `CopilotGenerator` - GitHub Copilot instruction generation
- `AIContextGenerator` - Unified AI context generation

### Utilities

- `Progress` - Progress indicator factory functions
- `CLI` - CLI utility factory functions
- `Help` - Help system utility functions
- `Performance` - Performance optimization utilities

## Development

### Building

```bash
bun build
# or
npm run build
```

### Testing

```bash
bun test
# or
npm test
```

### Linting

```bash
bun run lint
# or
npm run lint
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

- 📖 [Documentation](https://github.com/nimata/cli/docs)
- 🐛 [Issue Tracker](https://github.com/nimata/cli/issues)
- 💬 [Discussions](https://github.com/nimata/cli/discussions)

## Related Packages

- `@nimata/cli` - Main CLI application
- `@nimata/core` - Core functionality
- `@nimata/templates` - Project templates
