# Technical Specification: Epic 1 - Start Right: Quality-First Scaffolding

**Project:** Nìmata CLI Tool
**Epic:** Epic 1 of 3
**Date:** 2025-10-16
**Status:** Implementation Ready

---

## Table of Contents

1. [Epic Overview](#1-epic-overview)
2. [Stories Summary](#2-stories-summary)
3. [Component Architecture](#3-component-architecture)
4. [Interfaces and Contracts](#4-interfaces-and-contracts)
5. [Data Models](#5-data-models)
6. [Implementation Patterns](#6-implementation-patterns)
7. [Template Structure](#7-template-structure)
8. [Plugin Implementation](#8-plugin-implementation)
9. [Error Handling](#9-error-handling)
10. [Testing Strategy](#10-testing-strategy)
11. [Acceptance Criteria Mapping](#11-acceptance-criteria-mapping)
12. [Implementation Order](#12-implementation-order)

---

## 1. Epic Overview

### 1.1 Epic Goal

Enable developers to scaffold TypeScript+Bun CLI projects with comprehensive quality tooling and AI context files pre-configured in under 30 seconds.

### 1.2 Value Proposition

- **Eliminates 2-4 hours** of manual project setup
- **Generates persistent AI context** (CLAUDE.md) to reduce AI hallucinations and context re-establishment overhead
- **Delivers quality-first defaults**: Strict TypeScript, comprehensive ESLint, Prettier, Bun Test pre-configured
- **Supports multiple AI assistants**: Claude Code primary (Phase 1), extensible to GitHub Copilot (Phase 2)

### 1.3 Success Metrics

- Scaffolding completes in **<30 seconds** for typical CLI project
- Generated projects **compile and pass all quality checks** 100% of the time immediately after creation
- Users report **15-20 minutes saved per day** on AI context management
- **80%+ of users** choose "strict" quality level (validates opinionated defaults work)

### 1.4 Key Technologies

| Technology     | Version | Purpose                                        |
| -------------- | ------- | ---------------------------------------------- |
| **Bun**        | 1.3+    | Runtime, native APIs (file I/O, YAML, hashing) |
| **TypeScript** | 5.x     | Type safety, strict mode enforcement           |
| **Yargs**      | 17.x    | CLI framework, command routing                 |
| **Prompts**    | 2.x     | Interactive wizards                            |
| **Handlebars** | 4.x     | Template rendering                             |
| **TSyringe**   | 4.x     | Dependency injection                           |
| **Picocolors** | 1.x     | Terminal colors                                |
| **Ora**        | 7.x     | Progress spinners                              |

---

## 2. Stories Summary

| Story ID | Title                                   | Story Points | Primary Components                                      | Swim Lane          |
| -------- | --------------------------------------- | ------------ | ------------------------------------------------------- | ------------------ |
| **1.1**  | CLI Framework Setup                     | 3            | CLI entry point, Yargs routing, TSyringe DI             | A (Infrastructure) |
| **1.2**  | Configuration System                    | 2            | YAMLConfigRepository, config cascade                    | A (Infrastructure) |
| **1.3**  | Interactive Wizard                      | 4            | ScaffoldWizard, Prompts integration                     | B (Scaffolding)    |
| **1.4**  | Directory Structure Generator           | 3            | ScaffoldingService, FileSystemRepository                | B (Scaffolding)    |
| **1.5**  | Template Engine                         | 3            | TemplateRenderer, Handlebars integration                | B (Scaffolding)    |
| **1.6**  | ESLint Configuration Generator          | 3            | ScaffolderPlugin, ESLintGenerator                       | C (Quality Config) |
| **1.7**  | TypeScript Configuration Generator      | 2            | ScaffolderPlugin, TSConfigGenerator                     | C (Quality Config) |
| **1.8**  | Prettier & Bun Test Configuration       | 2            | ScaffolderPlugin, PrettierGenerator, BunConfigGenerator | C (Quality Config) |
| **1.9**  | AI Rules Library & CLAUDE.md Generator  | 4            | ClaudeCodePlugin, ContextGenerator                      | D (AI Rules)       |
| **1.10** | GitHub Copilot Instructions Generator   | 2            | ClaudeCodePlugin, CopilotGenerator                      | D (AI Rules)       |
| **1.11** | Quality Level Presets & End-to-End Init | 3            | InitCommand, preset system integration                  | E (Integration)    |

**Total Story Points:** 31
**Estimated Duration:** Sprints 1-2 (4 weeks with 4-5 developers)

---

## 3. Component Architecture

### 3.1 Architecture Layers

Epic 1 follows Clean Architecture Lite with 3 layers:

```
┌─────────────────────────────────────────────────────────┐
│         CLI Layer (apps/cli)                             │
│  InitCommand, ScaffoldWizard, ProgressPresenter         │
│         ↓ Calls use cases directly                      │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│         Use Case Layer (packages/core)                   │
│  ScaffoldingService (orchestration + business logic)    │
│         ↓ Depends on interfaces (ports)                 │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│         Adapter Layer (packages/adapters)                │
│  FileSystemRepository, TemplateRenderer, ConfigRepo     │
│         ↓ Implements interfaces from Use Case layer     │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│         Plugin Layer (plugins/)                          │
│  ScaffolderPlugin, ClaudeCodePlugin                     │
└─────────────────────────────────────────────────────────┘
```

### 3.2 Component Breakdown

#### 3.2.1 CLI Layer (apps/cli)

| Component             | File Path                                     | Responsibility                                                                   | Stories   |
| --------------------- | --------------------------------------------- | -------------------------------------------------------------------------------- | --------- |
| **InitCommand**       | apps/cli/src/commands/init.ts                 | `nimata init` command handler, orchestrates wizard + scaffolding                 | 1.1, 1.11 |
| **ScaffoldWizard**    | apps/cli/src/wizards/scaffold-wizard.ts       | Interactive prompts, collects user input (project name, quality level, AI tools) | 1.3       |
| **ProgressPresenter** | apps/cli/src/presenters/progress-presenter.ts | Terminal output with Ora spinners, progress updates                              | All       |
| **DI Container**      | apps/cli/src/container.ts                     | TSyringe dependency injection setup                                              | 1.1       |

#### 3.2.2 Use Case Layer (packages/core)

| Component              | File Path                                          | Responsibility                                                                       | Stories        |
| ---------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------ | -------------- |
| **ScaffoldingService** | packages/core/src/use-cases/scaffolding-service.ts | Orchestrates project generation: directory structure, templates, configs, AI context | 1.4, 1.5, 1.11 |

#### 3.2.3 Adapter Layer (packages/adapters)

| Component                | File Path                                                    | Responsibility                                        | Stories  |
| ------------------------ | ------------------------------------------------------------ | ----------------------------------------------------- | -------- |
| **FileSystemRepository** | packages/adapters/src/repositories/file-system-repository.ts | File I/O via Bun.write(), directory creation          | 1.4, All |
| **YAMLConfigRepository** | packages/adapters/src/repositories/yaml-config-repository.ts | Config loading via Bun.file().yaml(), deep merge      | 1.2      |
| **TemplateRenderer**     | packages/adapters/src/template-renderer.ts                   | Handlebars template processing, variable substitution | 1.5      |

#### 3.2.4 Plugin Layer (plugins/)

| Component                | File Path                                                                 | Responsibility                                 | Stories            |
| ------------------------ | ------------------------------------------------------------------------- | ---------------------------------------------- | ------------------ |
| **ScaffolderPlugin**     | plugins/plugin-scaffolder/src/scaffolder-plugin.ts                        | Orchestrates tool config generation            | 1.6, 1.7, 1.8      |
| **ESLintGenerator**      | plugins/plugin-scaffolder/src/config-generators/eslint-generator.ts       | Generate .eslintrc.json based on quality level | 1.6                |
| **TSConfigGenerator**    | plugins/plugin-scaffolder/src/config-generators/tsconfig-generator.ts     | Generate tsconfig.json with strict mode        | 1.7                |
| **PrettierGenerator**    | plugins/plugin-scaffolder/src/config-generators/prettier-generator.ts     | Generate .prettierrc.json                      | 1.8                |
| **BunConfigGenerator**   | plugins/plugin-scaffolder/src/config-generators/bun-config-generator.ts   | Configure Bun Test in package.json             | 1.8                |
| **PackageJsonGenerator** | plugins/plugin-scaffolder/src/config-generators/package-json-generator.ts | Generate package.json with dependencies        | 1.4, 1.6, 1.7, 1.8 |
| **ClaudeCodePlugin**     | plugins/plugin-claude-code/src/claude-code-plugin.ts                      | Orchestrates AI context generation             | 1.9, 1.10          |
| **ContextGenerator**     | plugins/plugin-claude-code/src/context-generator.ts                       | Generate CLAUDE.md with project context        | 1.9                |
| **CopilotGenerator**     | plugins/plugin-claude-code/src/copilot-generator.ts                       | Generate .github/copilot-instructions.md       | 1.10               |

### 3.3 Dependency Flow

```
InitCommand
  └─> ScaffoldWizard (collects input)
  └─> ScaffoldingService (orchestrates generation)
      └─> FileSystemRepository (creates directories)
      └─> TemplateRenderer (processes templates)
      └─> ScaffolderPlugin
          └─> ESLintGenerator, TSConfigGenerator, etc.
      └─> ClaudeCodePlugin
          └─> ContextGenerator, CopilotGenerator
```

**Key Principle:** Use cases depend on interfaces (ports), not concrete implementations. TSyringe resolves dependencies at runtime.

---

## 4. Interfaces and Contracts

### 4.1 Core Interfaces (packages/core/src/interfaces/)

#### 4.1.1 IScaffoldingService

```typescript
// packages/core/src/interfaces/i-scaffolding-service.ts
export interface IScaffoldingService {
  /**
   * Generate complete project structure
   * @param options - Scaffolding options from wizard
   * @returns Result with project metadata or error
   */
  scaffold(options: ScaffoldOptions): Promise<Result<ProjectMetadata>>;
}

export interface ScaffoldOptions {
  projectName: string;
  description: string;
  targetDirectory: string;
  qualityLevel: QualityLevel;
  aiAssistants: AIAssistant[];
  author?: string;
  license?: string;
}

export enum QualityLevel {
  Light = 'light',
  Medium = 'medium',
  Strict = 'strict',
}

export enum AIAssistant {
  ClaudeCode = 'claude-code',
  GitHubCopilot = 'github-copilot',
  Windsurf = 'windsurf', // Phase 2
}
```

#### 4.1.2 IFileSystem

```typescript
// packages/core/src/interfaces/i-file-system.ts
export interface IFileSystem {
  /**
   * Create directory (recursive)
   * @param path - Absolute path
   */
  createDirectory(path: string): Promise<Result<void>>;

  /**
   * Write file with content
   * @param path - Absolute path
   * @param content - File content (string or Buffer)
   */
  writeFile(path: string, content: string | Buffer): Promise<Result<void>>;

  /**
   * Read file content
   * @param path - Absolute path
   * @returns File content as string
   */
  readFile(path: string): Promise<Result<string>>;

  /**
   * Check if path exists
   * @param path - Absolute path
   * @returns true if exists, false otherwise
   */
  exists(path: string): Promise<boolean>;

  /**
   * Copy file or directory
   * @param source - Source path
   * @param destination - Destination path
   */
  copy(source: string, destination: string): Promise<Result<void>>;
}
```

#### 4.1.3 ITemplateRenderer

```typescript
// packages/core/src/interfaces/i-template-renderer.ts
export interface ITemplateRenderer {
  /**
   * Render template with context variables
   * @param templatePath - Path to .hbs template file
   * @param context - Template variables
   * @returns Rendered content
   */
  render(templatePath: string, context: TemplateContext): Promise<Result<string>>;

  /**
   * Register partial template
   * @param name - Partial name
   * @param templatePath - Path to partial template
   */
  registerPartial(name: string, templatePath: string): Promise<Result<void>>;

  /**
   * Register helper function
   * @param name - Helper name
   * @param fn - Helper function
   */
  registerHelper(name: string, fn: HandlebarsHelper): void;
}

export type TemplateContext = Record<string, unknown>;

export type HandlebarsHelper = (...args: unknown[]) => string;
```

#### 4.1.4 IConfigRepository

```typescript
// packages/core/src/interfaces/i-config-repository.ts
export interface IConfigRepository {
  /**
   * Load configuration with cascade (defaults → user → project)
   * @param projectRoot - Project root directory (optional)
   * @returns Merged configuration
   */
  load(projectRoot?: string): Promise<Result<Config>>;

  /**
   * Save configuration to project directory
   * @param config - Configuration object
   * @param projectRoot - Project root directory
   */
  save(config: Config, projectRoot: string): Promise<Result<void>>;

  /**
   * Merge configurations (deep merge)
   * @param base - Base configuration
   * @param override - Override configuration
   * @returns Merged configuration
   */
  merge(base: Config, override: Partial<Config>): Config;
}
```

#### 4.1.5 IPlugin

```typescript
// packages/core/src/interfaces/i-plugin.ts
export interface IPlugin {
  name: string;
  version: string;

  /**
   * Initialize plugin (load resources, validate dependencies)
   */
  initialize(): Promise<void>;

  /**
   * Teardown plugin (cleanup resources)
   */
  teardown(): Promise<void>;

  /**
   * Check if plugin supports capability
   * @param capability - Capability name
   */
  supports(capability: string): boolean;

  /**
   * Execute plugin capability
   * @param capability - Capability name
   * @param args - Arguments for capability
   */
  execute(capability: string, args: unknown): Promise<unknown>;
}

export interface IScaffolderPlugin extends IPlugin {
  /**
   * Generate project structure
   * @param options - Scaffolding options
   */
  generateProjectStructure(options: ScaffoldOptions): Promise<void>;

  /**
   * Generate tool configurations
   * @param toolConfigs - Tool configuration specs
   */
  generateConfigs(toolConfigs: ToolConfig[]): Promise<void>;
}

export interface IAIPlugin extends IPlugin {
  /**
   * Generate AI context files
   * @param projectMeta - Project metadata
   */
  generateContext(projectMeta: ProjectMetadata): Promise<void>;

  /**
   * Validate AI context (syntax, completeness)
   * @param contextPath - Path to AI context file
   */
  validateContext(contextPath: string): Promise<Result<void>>;
}
```

---

## 5. Data Models

### 5.1 Domain Types (packages/core/src/types/)

#### 5.1.1 ProjectMetadata

```typescript
// packages/core/src/types/project-metadata.ts
export interface ProjectMetadata {
  name: string;
  description: string;
  version: string;
  author?: string;
  license?: string;
  createdAt: Date;
  nimataVersion: string;
  qualityLevel: QualityLevel;
  aiAssistants: AIAssistant[];
  projectType: 'cli' | 'library' | 'api'; // Extensible
  techStack: TechStack;
  directoryStructure: DirectoryStructure;
}

export interface TechStack {
  runtime: 'bun' | 'node';
  language: 'typescript' | 'javascript';
  testFramework: 'bun-test' | 'jest' | 'vitest';
  linter: 'eslint';
  formatter: 'prettier';
}

export interface DirectoryStructure {
  root: string;
  src: string;
  tests: string;
  bin: string;
  docs: string;
  nimata: string; // .nimata directory
}
```

#### 5.1.2 Config

```typescript
// packages/core/src/types/config.ts
export interface Config {
  version: number; // Config schema version
  qualityLevel: QualityLevel;
  aiAssistants: AIAssistant[];
  tools: ToolsConfig;
  scaffolding: ScaffoldingConfig;
  logging: LoggingConfig;
}

export interface ToolsConfig {
  eslint: ESLintConfig;
  typescript: TypeScriptConfig;
  prettier: PrettierConfig;
  bunTest: BunTestConfig;
}

export interface ESLintConfig {
  enabled: boolean;
  configPath: string; // Relative to project root
  rules?: Record<string, unknown>;
}

export interface TypeScriptConfig {
  enabled: boolean;
  configPath: string;
  strict: boolean;
  target: string; // ES2022, etc.
}

export interface PrettierConfig {
  enabled: boolean;
  configPath: string;
  overrides?: Record<string, unknown>;
}

export interface BunTestConfig {
  enabled: boolean;
  coverage: boolean;
  coverageThreshold?: number; // 0-100
}

export interface ScaffoldingConfig {
  templateDirectory: string;
  includeExamples: boolean;
  initializeGit: boolean;
  installDependencies: boolean;
}

export interface LoggingConfig {
  level: 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';
  destination: string; // File path or 'stdout'
}
```

#### 5.1.3 TemplateContext

```typescript
// packages/core/src/types/template-context.ts
export interface TemplateContext {
  // Project metadata
  projectName: string;
  projectDescription: string;
  projectVersion: string;
  author?: string;
  license?: string;

  // Quality settings
  qualityLevel: QualityLevel;
  isStrict: boolean;
  isMedium: boolean;
  isLight: boolean;

  // AI assistants
  hasClaudeCode: boolean;
  hasGitHubCopilot: boolean;
  hasWindsurf: boolean;

  // Tech stack
  runtime: string;
  language: string;
  testFramework: string;

  // Paths
  srcDir: string;
  testDir: string;
  binDir: string;

  // Timestamps
  createdAt: string; // ISO 8601
  year: number;

  // Conditionals for templates
  includeExamples: boolean;
  initializeGit: boolean;
}
```

#### 5.1.4 ToolConfig

```typescript
// packages/core/src/types/tool-config.ts
export interface ToolConfig {
  tool: ToolName;
  qualityLevel: QualityLevel;
  outputPath: string; // Where to write config file
  templatePath?: string; // Custom template path
  overrides?: Record<string, unknown>; // User overrides
}

export type ToolName = 'eslint' | 'typescript' | 'prettier' | 'bun-test' | 'package-json';
```

#### 5.1.5 Result Pattern

```typescript
// packages/core/src/common/result.ts
export class Result<T> {
  private constructor(
    public readonly isSuccess: boolean,
    public readonly value?: T,
    public readonly error?: string
  ) {}

  static success<T>(value: T): Result<T> {
    return new Result(true, value);
  }

  static failure<T>(error: string): Result<T> {
    return new Result(false, undefined, error);
  }

  map<U>(fn: (value: T) => U): Result<U> {
    if (this.isSuccess && this.value !== undefined) {
      return Result.success(fn(this.value));
    }
    return Result.failure<U>(this.error || 'Unknown error');
  }

  flatMap<U>(fn: (value: T) => Result<U>): Result<U> {
    if (this.isSuccess && this.value !== undefined) {
      return fn(this.value);
    }
    return Result.failure<U>(this.error || 'Unknown error');
  }
}
```

---

## 6. Implementation Patterns

### 6.1 Scaffolding Service Pattern

```typescript
// packages/core/src/use-cases/scaffolding-service.ts
import { injectable, inject } from 'tsyringe';
import type { IFileSystem } from '../interfaces/i-file-system';
import type { ITemplateRenderer } from '../interfaces/i-template-renderer';
import type { IScaffolderPlugin } from '../interfaces/i-plugin';
import type { ScaffoldOptions, ProjectMetadata } from '../types';
import { Result } from '../common/result';

@injectable()
export class ScaffoldingService {
  constructor(
    @inject('IFileSystem') private readonly fileSystem: IFileSystem,
    @inject('ITemplateRenderer') private readonly templateRenderer: ITemplateRenderer,
    @inject('ScaffolderPlugin') private readonly scaffolderPlugin: IScaffolderPlugin,
    @inject('ClaudeCodePlugin') private readonly claudeCodePlugin: IPlugin
  ) {}

  async scaffold(options: ScaffoldOptions): Promise<Result<ProjectMetadata>> {
    try {
      // 1. Create directory structure
      const dirResult = await this.createDirectoryStructure(options);
      if (!dirResult.isSuccess) return Result.failure(dirResult.error!);

      // 2. Generate base files (package.json, tsconfig.json, etc.)
      const baseResult = await this.generateBaseFiles(options);
      if (!baseResult.isSuccess) return Result.failure(baseResult.error!);

      // 3. Generate tool configs via ScaffolderPlugin
      const configResult = await this.scaffolderPlugin.generateConfigs([
        { tool: 'eslint', qualityLevel: options.qualityLevel, outputPath: '.eslintrc.json' },
        { tool: 'typescript', qualityLevel: options.qualityLevel, outputPath: 'tsconfig.json' },
        { tool: 'prettier', qualityLevel: options.qualityLevel, outputPath: '.prettierrc.json' },
      ]);

      // 4. Generate AI context via ClaudeCodePlugin
      if (options.aiAssistants.includes(AIAssistant.ClaudeCode)) {
        await this.claudeCodePlugin.execute('generate-context', {
          projectMeta: this.buildProjectMetadata(options),
        });
      }

      // 5. Build project metadata
      const metadata = this.buildProjectMetadata(options);

      return Result.success(metadata);
    } catch (error) {
      return Result.failure(`Scaffolding failed: ${(error as Error).message}`);
    }
  }

  private async createDirectoryStructure(options: ScaffoldOptions): Promise<Result<void>> {
    const dirs = [
      options.targetDirectory,
      `${options.targetDirectory}/src`,
      `${options.targetDirectory}/tests`,
      `${options.targetDirectory}/bin`,
      `${options.targetDirectory}/docs`,
      `${options.targetDirectory}/.nimata`,
    ];

    for (const dir of dirs) {
      const result = await this.fileSystem.createDirectory(dir);
      if (!result.isSuccess) return result;
    }

    return Result.success(undefined);
  }

  private async generateBaseFiles(options: ScaffoldOptions): Promise<Result<void>> {
    const context = this.buildTemplateContext(options);

    // Render and write package.json
    const packageJsonResult = await this.templateRenderer.render(
      'templates/package.json.hbs',
      context
    );
    if (!packageJsonResult.isSuccess) return Result.failure(packageJsonResult.error!);

    const writeResult = await this.fileSystem.writeFile(
      `${options.targetDirectory}/package.json`,
      packageJsonResult.value!
    );
    if (!writeResult.isSuccess) return writeResult;

    // Similar for other base files (README.md, .gitignore, etc.)

    return Result.success(undefined);
  }

  private buildTemplateContext(options: ScaffoldOptions): TemplateContext {
    return {
      projectName: options.projectName,
      projectDescription: options.description,
      projectVersion: '1.0.0',
      author: options.author,
      license: options.license || 'MIT',
      qualityLevel: options.qualityLevel,
      isStrict: options.qualityLevel === QualityLevel.Strict,
      isMedium: options.qualityLevel === QualityLevel.Medium,
      isLight: options.qualityLevel === QualityLevel.Light,
      hasClaudeCode: options.aiAssistants.includes(AIAssistant.ClaudeCode),
      hasGitHubCopilot: options.aiAssistants.includes(AIAssistant.GitHubCopilot),
      hasWindsurf: false,
      runtime: 'bun',
      language: 'typescript',
      testFramework: 'bun-test',
      srcDir: 'src',
      testDir: 'tests',
      binDir: 'bin',
      createdAt: new Date().toISOString(),
      year: new Date().getFullYear(),
      includeExamples: true,
      initializeGit: true,
    };
  }

  private buildProjectMetadata(options: ScaffoldOptions): ProjectMetadata {
    return {
      name: options.projectName,
      description: options.description,
      version: '1.0.0',
      author: options.author,
      license: options.license || 'MIT',
      createdAt: new Date(),
      nimataVersion: '1.0.0', // TODO: Load from package.json
      qualityLevel: options.qualityLevel,
      aiAssistants: options.aiAssistants,
      projectType: 'cli',
      techStack: {
        runtime: 'bun',
        language: 'typescript',
        testFramework: 'bun-test',
        linter: 'eslint',
        formatter: 'prettier',
      },
      directoryStructure: {
        root: options.targetDirectory,
        src: `${options.targetDirectory}/src`,
        tests: `${options.targetDirectory}/tests`,
        bin: `${options.targetDirectory}/bin`,
        docs: `${options.targetDirectory}/docs`,
        nimata: `${options.targetDirectory}/.nimata`,
      },
    };
  }
}
```

### 6.2 Template Rendering Pattern

```typescript
// packages/adapters/src/template-renderer.ts
import Handlebars from 'handlebars';
import { injectable, inject } from 'tsyringe';
import type { IFileSystem } from '@nimata/core/interfaces/i-file-system';
import type {
  ITemplateRenderer,
  TemplateContext,
} from '@nimata/core/interfaces/i-template-renderer';
import { Result } from '@nimata/core/common/result';

@injectable()
export class TemplateRenderer implements ITemplateRenderer {
  private readonly handlebars: typeof Handlebars;

  constructor(@inject('IFileSystem') private readonly fileSystem: IFileSystem) {
    this.handlebars = Handlebars.create();
    this.registerDefaultHelpers();
  }

  async render(templatePath: string, context: TemplateContext): Promise<Result<string>> {
    try {
      // Read template file
      const templateResult = await this.fileSystem.readFile(templatePath);
      if (!templateResult.isSuccess) {
        return Result.failure(`Failed to read template: ${templateResult.error}`);
      }

      // Compile template
      const template = this.handlebars.compile(templateResult.value!);

      // Render with context
      const rendered = template(context);

      return Result.success(rendered);
    } catch (error) {
      return Result.failure(`Template rendering failed: ${(error as Error).message}`);
    }
  }

  async registerPartial(name: string, templatePath: string): Promise<Result<void>> {
    try {
      const templateResult = await this.fileSystem.readFile(templatePath);
      if (!templateResult.isSuccess) {
        return Result.failure(`Failed to read partial: ${templateResult.error}`);
      }

      this.handlebars.registerPartial(name, templateResult.value!);
      return Result.success(undefined);
    } catch (error) {
      return Result.failure(`Partial registration failed: ${(error as Error).message}`);
    }
  }

  registerHelper(name: string, fn: HandlebarsHelper): void {
    this.handlebars.registerHelper(name, fn);
  }

  private registerDefaultHelpers(): void {
    // kebab-case helper
    this.handlebars.registerHelper('kebab-case', (str: string) => {
      return str.toLowerCase().replace(/\s+/g, '-');
    });

    // camelCase helper
    this.handlebars.registerHelper('camel-case', (str: string) => {
      return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
    });

    // PascalCase helper
    this.handlebars.registerHelper('pascal-case', (str: string) => {
      return str
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');
    });

    // JSON stringify helper
    this.handlebars.registerHelper('json', (obj: unknown) => {
      return JSON.stringify(obj, null, 2);
    });
  }
}
```

### 6.3 Config Generation Pattern

```typescript
// plugins/plugin-scaffolder/src/config-generators/eslint-generator.ts
import type { QualityLevel, ToolConfig } from '@nimata/core/types';
import { Result } from '@nimata/core/common/result';

export class ESLintGenerator {
  async generate(config: ToolConfig): Promise<Result<string>> {
    try {
      const eslintConfig = this.buildESLintConfig(config.qualityLevel);
      return Result.success(JSON.stringify(eslintConfig, null, 2));
    } catch (error) {
      return Result.failure(`ESLint config generation failed: ${(error as Error).message}`);
    }
  }

  private buildESLintConfig(qualityLevel: QualityLevel): Record<string, unknown> {
    const baseConfig = {
      env: {
        es2022: true,
        node: true,
      },
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        project: './tsconfig.json',
      },
      plugins: ['@typescript-eslint'],
      extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
    };

    // Quality level specific rules
    const rules = this.getRulesByQualityLevel(qualityLevel);

    return {
      ...baseConfig,
      rules,
    };
  }

  private getRulesByQualityLevel(qualityLevel: QualityLevel): Record<string, unknown> {
    const commonRules = {
      'no-console': 'warn',
      'no-unused-vars': 'off', // Use TypeScript's check
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    };

    const qualityRules: Record<QualityLevel, Record<string, unknown>> = {
      [QualityLevel.Light]: {
        ...commonRules,
      },
      [QualityLevel.Medium]: {
        ...commonRules,
        '@typescript-eslint/explicit-function-return-type': 'warn',
        '@typescript-eslint/no-explicit-any': 'warn',
      },
      [QualityLevel.Strict]: {
        ...commonRules,
        '@typescript-eslint/explicit-function-return-type': 'error',
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/no-non-null-assertion': 'error',
        '@typescript-eslint/strict-boolean-expressions': 'error',
        complexity: ['error', 10],
        'max-lines-per-function': ['error', 50],
        '@typescript-eslint/prefer-readonly': 'error',
      },
    };

    return qualityRules[qualityLevel];
  }
}
```

---

## 7. Template Structure

### 7.1 Template Directory Organization

```
packages/core/templates/          # Generic templates (all project types)
├── base/
│   ├── package.json.hbs
│   ├── tsconfig.base.json.hbs
│   ├── .gitignore.hbs
│   └── README.md.hbs
└── partials/
    ├── header.hbs
    └── license.hbs

plugins/plugin-scaffolder/templates/  # TypeScript+Bun specific templates
├── typescript/
│   ├── tsconfig.strict.json
│   ├── tsconfig.lib.json
│   └── tsconfig.app.json
├── bun/
│   ├── bunfig.toml
│   └── bun.test.config.ts
├── eslint/
│   ├── eslint.config.light.js
│   ├── eslint.config.medium.js
│   └── eslint.config.strict.js
├── prettier/
│   └── .prettierrc.json
└── src/
    ├── index.ts.hbs
    └── cli.ts.hbs

plugins/plugin-claude-code/templates/  # Claude Code AI context templates
├── CLAUDE.md.hbs                 # Main AI context file
├── mcp/
│   └── mcp-config.json.hbs       # MCP configuration
├── agents/
│   └── quality-assistant.md.hbs  # Agent template
├── commands/
│   └── validate-fix.md.hbs       # Command template
└── hooks/
    └── pre-commit.md.hbs         # Hook template
```

### 7.2 Template Examples

#### 7.2.1 package.json.hbs

```handlebars
{ "name": "{{projectName}}", "version": "{{projectVersion}}", "description": "{{projectDescription}}",
{{#if author}}
  "author": "{{author}}",
{{/if}}
"license": "{{license}}", "type": "module", "main": "./dist/index.js", "bin": { "{{projectName}}":
"./bin/cli.js" }, "scripts": { "dev": "bun run --watch src/index.ts", "build": "bun build
src/index.ts --outdir dist --target bun", "test": "bun test", "test:coverage": "bun test
--coverage", "lint": "eslint src tests", "format": "prettier --write src tests", "typecheck": "tsc
--noEmit" }, "dependencies": { "yargs": "^17.0.0", "prompts": "^2.0.0" }, "devDependencies": {
"@types/bun": "latest", "@types/node": "^20.0.0", "@types/yargs": "^17.0.0", "typescript": "^5.0.0",
"eslint": "^9.0.0", "@typescript-eslint/parser": "^7.0.0", "@typescript-eslint/eslint-plugin":
"^7.0.0", "prettier": "^3.0.0" }, "engines": { "bun": ">=1.3.0" } }
```

#### 7.2.2 tsconfig.strict.json

```json
{
  "compilerOptions": {
    // Language and Environment
    "target": "ES2022",
    "lib": ["ES2022"],
    "module": "ESNext",
    "moduleResolution": "bundler",

    // Strict Type Checking
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "noUncheckedSideEffectImports": true,

    // Module Resolution
    "resolveJsonModule": true,
    "allowImportingTsExtensions": true,
    "moduleDetection": "force",

    // Emit
    "noEmit": true,
    "sourceMap": true,
    "declaration": true,
    "declarationMap": true,

    // Interop Constraints
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,

    // Type Checking
    "skipLibCheck": true,

    // Path Mapping
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*", "tests/**/*"],
  "exclude": ["node_modules", "dist", ".nimata"]
}
```

#### 7.2.3 CLAUDE.md.hbs

```handlebars
#
{{projectName}}
- AI Context **Generated by Nìmata on
{{createdAt}}** ## Project Overview

{{projectDescription}}

- **Type:**
{{projectType}}
- **Runtime:**
{{runtime}}
- **Language:**
{{language}}
- **Quality Level:**
{{qualityLevel}}

## Architecture This project follows Clean Architecture Lite principles with 3 layers: 1. **CLI
Layer** (`src/cli/`) - Command handlers and user interaction 2. **Use Case Layer** (`src/core/`) -
Business logic and domain types 3. **Adapter Layer** (`src/adapters/`) - External integrations and
I/O ## Directory Structure
```

{{projectName}}/
├── src/
│ ├── index.ts # Entry point
│ ├── cli/ # CLI commands
│ ├── core/ # Business logic
│ └── adapters/ # External integrations
├── tests/
│ ├── unit/ # Unit tests (100% coverage target)
│ └── integration/ # Integration tests
├── bin/
│ └── cli.ts # CLI launcher
└── docs/

````

## Coding Standards

{{#if isStrict}}
### Strict Mode Enabled

This project uses TypeScript strict mode with comprehensive quality checks:

- **No `any` types** - All types must be explicit
- **Prefer `readonly`** - Use readonly for immutable data
- **Explicit return types** - All functions must declare return types
- **Max complexity: 10** - Functions should be simple and focused
- **Max function length: 50 lines** - Keep functions short
- **Test coverage: 80%+** - Comprehensive test coverage required

### Code Patterns

**✅ Good:**
```typescript
export function processData(input: string): Result<ProcessedData> {
  const validated = validateInput(input);
  if (!validated.isSuccess) {
    return Result.failure(validated.error);
  }
  return Result.success({ data: validated.value });
}
````

**❌ Bad:**

```typescript
export function processData(input: any) {
  return { data: input };
}
```

{{/if}}

{{#if isMedium}}

### Medium Quality Level

This project uses moderate quality checks:

- Prefer explicit types over `any`
- Write unit tests for critical paths
- Use ESLint and Prettier for consistency
  {{/if}}

{{#if isLight}}

### Light Quality Level

This project uses basic quality checks:

- Basic ESLint rules for common errors
- Prettier for code formatting
- TypeScript for type safety
  {{/if}}

## Testing Guidelines

- **Unit tests:** Test individual functions/classes in isolation
- **Integration tests:** Test component interactions
- **Test location:** `tests/` directory mirrors `src/` structure
- **Test framework:** Bun Test with native coverage

**Example:**

```typescript
import { describe, it, expect, beforeEach } from 'bun:test';
import { MyService } from '@/core/my-service';

describe('MyService', () => {
  let service: MyService;

  beforeEach(() => {
    service = new MyService();
  });

  it('should process data correctly', () => {
    const result = service.process('input');
    expect(result.isSuccess).toBe(true);
  });
});
```

## Common Patterns

### Result Pattern

Use the `Result` type for error handling instead of throwing exceptions:

```typescript
export class Result<T> {
  static success<T>(value: T): Result<T>;
  static failure<T>(error: string): Result<T>;
}
```

### Dependency Injection

Use TSyringe for dependency injection (manual registration, no decorators):

```typescript
container.register<IService>('IService', {
  useClass: MyService,
});
```

## AI Assistant Guidelines

{{#if hasClaudeCode}}

### Claude Code Integration

This project is configured for Claude Code:

- Follow coding standards above
- Respect architecture boundaries (CLI → Use Case → Adapter)
- Write tests for all new code
- Use Result pattern for error handling
  {{/if}}

{{#if hasGitHubCopilot}}

### GitHub Copilot Integration

Copilot instructions available in `.github/copilot-instructions.md`
{{/if}}

## Quality Commands

```bash
# Run all quality checks
bun run lint && bun run typecheck && bun run test

# Auto-fix linting issues
bun run lint --fix

# Format code
bun run format

# Type check without emitting
bun run typecheck
```

---

_This file is generated by Nìmata and should be kept up-to-date as the project evolves._

````

#### 7.2.4 eslint.config.strict.js

```javascript
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
  {
    files: ['src/**/*.ts', 'tests/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        project: './tsconfig.json'
      }
    },
    plugins: {
      '@typescript-eslint': tsPlugin
    },
    rules: {
      // TypeScript Strict Rules
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/strict-boolean-expressions': 'error',
      '@typescript-eslint/prefer-readonly': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

      // Complexity Rules
      'complexity': ['error', 10],
      'max-lines-per-function': ['error', { max: 50, skipBlankLines: true, skipComments: true }],
      'max-depth': ['error', 3],

      // Best Practices
      'no-console': 'warn',
      'prefer-const': 'error',
      'no-var': 'error'
    }
  }
];
````

---

## 8. Plugin Implementation

### 8.1 ScaffolderPlugin Design

```typescript
// plugins/plugin-scaffolder/src/scaffolder-plugin.ts
import { injectable, inject } from 'tsyringe';
import type { IScaffolderPlugin, ToolConfig, ScaffoldOptions } from '@nimata/core';
import type { IFileSystem } from '@nimata/core/interfaces/i-file-system';
import { ESLintGenerator } from './config-generators/eslint-generator';
import { TSConfigGenerator } from './config-generators/tsconfig-generator';
import { PrettierGenerator } from './config-generators/prettier-generator';
import { BunConfigGenerator } from './config-generators/bun-config-generator';
import { PackageJsonGenerator } from './config-generators/package-json-generator';

@injectable()
export class ScaffolderPlugin implements IScaffolderPlugin {
  public readonly name = 'scaffolder';
  public readonly version = '1.0.0';

  private readonly generators: Map<string, ConfigGenerator>;

  constructor(@inject('IFileSystem') private readonly fileSystem: IFileSystem) {
    this.generators = new Map([
      ['eslint', new ESLintGenerator()],
      ['typescript', new TSConfigGenerator()],
      ['prettier', new PrettierGenerator()],
      ['bun-test', new BunConfigGenerator()],
      ['package-json', new PackageJsonGenerator()],
    ]);
  }

  async initialize(): Promise<void> {
    // Validate templates exist
    for (const [tool, generator] of this.generators) {
      await generator.validateTemplates();
    }
  }

  async teardown(): Promise<void> {
    // Cleanup if needed
  }

  supports(capability: string): boolean {
    return ['generate-project', 'generate-configs'].includes(capability);
  }

  async execute(capability: string, args: unknown): Promise<unknown> {
    switch (capability) {
      case 'generate-project':
        return this.generateProjectStructure(args as ScaffoldOptions);
      case 'generate-configs':
        return this.generateConfigs(args as ToolConfig[]);
      default:
        throw new Error(`Unsupported capability: ${capability}`);
    }
  }

  async generateProjectStructure(options: ScaffoldOptions): Promise<void> {
    // Create src/ structure with example files
    const srcFiles = [
      { path: 'src/index.ts', template: 'templates/src/index.ts.hbs' },
      { path: 'src/cli.ts', template: 'templates/src/cli.ts.hbs' },
    ];

    for (const file of srcFiles) {
      const content = await this.renderTemplate(file.template, {
        projectName: options.projectName,
        projectDescription: options.description,
      });
      await this.fileSystem.writeFile(`${options.targetDirectory}/${file.path}`, content);
    }
  }

  async generateConfigs(toolConfigs: ToolConfig[]): Promise<void> {
    for (const config of toolConfigs) {
      const generator = this.generators.get(config.tool);
      if (!generator) {
        throw new Error(`No generator found for tool: ${config.tool}`);
      }

      const result = await generator.generate(config);
      if (!result.isSuccess) {
        throw new Error(`Config generation failed: ${result.error}`);
      }

      await this.fileSystem.writeFile(config.outputPath, result.value!);
    }
  }

  private async renderTemplate(
    templatePath: string,
    context: Record<string, unknown>
  ): Promise<string> {
    // Template rendering logic (simplified)
    const templateResult = await this.fileSystem.readFile(templatePath);
    if (!templateResult.isSuccess) {
      throw new Error(`Failed to read template: ${templateResult.error}`);
    }
    // Actual Handlebars rendering would happen here
    return templateResult.value!;
  }
}

interface ConfigGenerator {
  generate(config: ToolConfig): Promise<Result<string>>;
  validateTemplates(): Promise<void>;
}
```

### 8.2 ClaudeCodePlugin Design

```typescript
// plugins/plugin-claude-code/src/claude-code-plugin.ts
import { injectable, inject } from 'tsyringe';
import type { IAIPlugin, ProjectMetadata } from '@nimata/core';
import type { IFileSystem } from '@nimata/core/interfaces/i-file-system';
import type { ITemplateRenderer } from '@nimata/core/interfaces/i-template-renderer';
import { Result } from '@nimata/core/common/result';

@injectable()
export class ClaudeCodePlugin implements IAIPlugin {
  public readonly name = 'claude-code';
  public readonly version = '1.0.0';

  constructor(
    @inject('IFileSystem') private readonly fileSystem: IFileSystem,
    @inject('ITemplateRenderer') private readonly templateRenderer: ITemplateRenderer
  ) {}

  async initialize(): Promise<void> {
    // Validate Claude Code templates exist
    const requiredTemplates = [
      'templates/CLAUDE.md.hbs',
      'templates/mcp/mcp-config.json.hbs',
      'templates/agents/quality-assistant.md.hbs',
      'templates/commands/validate-fix.md.hbs',
      'templates/hooks/pre-commit.md.hbs',
    ];

    for (const template of requiredTemplates) {
      const exists = await this.fileSystem.exists(template);
      if (!exists) {
        throw new Error(`Required template not found: ${template}`);
      }
    }
  }

  async teardown(): Promise<void> {
    // Cleanup if needed
  }

  supports(capability: string): boolean {
    return ['generate-context', 'validate-context'].includes(capability);
  }

  async execute(capability: string, args: unknown): Promise<unknown> {
    switch (capability) {
      case 'generate-context':
        return this.generateContext((args as { projectMeta: ProjectMetadata }).projectMeta);
      case 'validate-context':
        return this.validateContext((args as { contextPath: string }).contextPath);
      default:
        throw new Error(`Unsupported capability: ${capability}`);
    }
  }

  async generateContext(projectMeta: ProjectMetadata): Promise<void> {
    // 1. Generate CLAUDE.md
    await this.generateCLAUDEmd(projectMeta);

    // 2. Generate MCP configuration
    await this.generateMCPConfig(projectMeta);

    // 3. Generate agent templates
    await this.generateAgentTemplates(projectMeta);

    // 4. Generate command templates
    await this.generateCommandTemplates(projectMeta);

    // 5. Generate hook templates
    await this.generateHookTemplates(projectMeta);
  }

  private async generateCLAUDEmd(projectMeta: ProjectMetadata): Promise<void> {
    const context = this.buildContextFromMetadata(projectMeta);

    const result = await this.templateRenderer.render(
      'plugins/plugin-claude-code/templates/CLAUDE.md.hbs',
      context
    );

    if (!result.isSuccess) {
      throw new Error(`Failed to render CLAUDE.md: ${result.error}`);
    }

    await this.fileSystem.writeFile(
      `${projectMeta.directoryStructure.root}/CLAUDE.md`,
      result.value!
    );
  }

  private async generateMCPConfig(projectMeta: ProjectMetadata): Promise<void> {
    const context = {
      projectName: projectMeta.name,
      nimataVersion: projectMeta.nimataVersion,
      toolsEnabled: this.getEnabledTools(projectMeta),
    };

    const result = await this.templateRenderer.render(
      'plugins/plugin-claude-code/templates/mcp/mcp-config.json.hbs',
      context
    );

    if (!result.isSuccess) {
      throw new Error(`Failed to render MCP config: ${result.error}`);
    }

    const mcpDir = `${projectMeta.directoryStructure.root}/.claude/mcp`;
    await this.fileSystem.createDirectory(mcpDir);
    await this.fileSystem.writeFile(`${mcpDir}/config.json`, result.value!);
  }

  private async generateAgentTemplates(projectMeta: ProjectMetadata): Promise<void> {
    const context = this.buildContextFromMetadata(projectMeta);

    const result = await this.templateRenderer.render(
      'plugins/plugin-claude-code/templates/agents/quality-assistant.md.hbs',
      context
    );

    if (!result.isSuccess) {
      throw new Error(`Failed to render agent template: ${result.error}`);
    }

    const agentsDir = `${projectMeta.directoryStructure.root}/.claude/agents`;
    await this.fileSystem.createDirectory(agentsDir);
    await this.fileSystem.writeFile(`${agentsDir}/quality-assistant.md`, result.value!);
  }

  private async generateCommandTemplates(projectMeta: ProjectMetadata): Promise<void> {
    const context = this.buildContextFromMetadata(projectMeta);

    const result = await this.templateRenderer.render(
      'plugins/plugin-claude-code/templates/commands/validate-fix.md.hbs',
      context
    );

    if (!result.isSuccess) {
      throw new Error(`Failed to render command template: ${result.error}`);
    }

    const commandsDir = `${projectMeta.directoryStructure.root}/.claude/commands`;
    await this.fileSystem.createDirectory(commandsDir);
    await this.fileSystem.writeFile(`${commandsDir}/validate-fix.md`, result.value!);
  }

  private async generateHookTemplates(projectMeta: ProjectMetadata): Promise<void> {
    const context = this.buildContextFromMetadata(projectMeta);

    const result = await this.templateRenderer.render(
      'plugins/plugin-claude-code/templates/hooks/pre-commit.md.hbs',
      context
    );

    if (!result.isSuccess) {
      throw new Error(`Failed to render hook template: ${result.error}`);
    }

    const hooksDir = `${projectMeta.directoryStructure.root}/.claude/hooks`;
    await this.fileSystem.createDirectory(hooksDir);
    await this.fileSystem.writeFile(`${hooksDir}/pre-commit.md`, result.value!);
  }

  async validateContext(contextPath: string): Promise<Result<void>> {
    try {
      // Read CLAUDE.md
      const readResult = await this.fileSystem.readFile(contextPath);
      if (!readResult.isSuccess) {
        return Result.failure(`Failed to read context file: ${readResult.error}`);
      }

      const content = readResult.value!;

      // Validate structure
      const requiredSections = [
        '## Project Overview',
        '## Architecture',
        '## Directory Structure',
        '## Coding Standards',
        '## Testing Guidelines',
      ];

      for (const section of requiredSections) {
        if (!content.includes(section)) {
          return Result.failure(`Missing required section: ${section}`);
        }
      }

      // Validate size (should be < 10KB for fast AI parsing)
      const sizeKB = Buffer.byteLength(content, 'utf8') / 1024;
      if (sizeKB > 10) {
        return Result.failure(`Context file too large: ${sizeKB.toFixed(2)}KB (max 10KB)`);
      }

      return Result.success(undefined);
    } catch (error) {
      return Result.failure(`Context validation failed: ${(error as Error).message}`);
    }
  }

  private buildContextFromMetadata(projectMeta: ProjectMetadata): Record<string, unknown> {
    return {
      projectName: projectMeta.name,
      projectDescription: projectMeta.description,
      projectVersion: projectMeta.version,
      author: projectMeta.author,
      license: projectMeta.license,
      projectType: projectMeta.projectType,
      qualityLevel: projectMeta.qualityLevel,
      isStrict: projectMeta.qualityLevel === 'strict',
      isMedium: projectMeta.qualityLevel === 'medium',
      isLight: projectMeta.qualityLevel === 'light',
      hasClaudeCode: projectMeta.aiAssistants.includes('claude-code'),
      hasGitHubCopilot: projectMeta.aiAssistants.includes('github-copilot'),
      runtime: projectMeta.techStack.runtime,
      language: projectMeta.techStack.language,
      testFramework: projectMeta.techStack.testFramework,
      createdAt: projectMeta.createdAt.toISOString(),
      year: projectMeta.createdAt.getFullYear(),
    };
  }

  private getEnabledTools(projectMeta: ProjectMetadata): string[] {
    return [
      projectMeta.techStack.linter,
      projectMeta.techStack.formatter,
      projectMeta.techStack.testFramework,
    ];
  }
}
```

---

## 9. Error Handling

### 9.1 Error Categories

| Category              | HTTP Status Analogy       | Exit Code | When Used                                   |
| --------------------- | ------------------------- | --------- | ------------------------------------------- |
| **Validation Error**  | 400 Bad Request           | 3         | Invalid config, missing required fields     |
| **File System Error** | 500 Internal Error        | 5         | Cannot read/write files, permission denied  |
| **Template Error**    | 500 Internal Error        | 6         | Template rendering failed, missing template |
| **Plugin Error**      | 500 Internal Error        | 4         | Plugin failed to initialize or execute      |
| **User Cancellation** | 499 Client Closed Request | 130       | User pressed Ctrl+C during wizard           |

### 9.2 Error Handling Patterns

#### 9.2.1 Result Pattern for Use Cases

```typescript
// Use Result pattern to avoid throwing exceptions
async scaffold(options: ScaffoldOptions): Promise<Result<ProjectMetadata>> {
  try {
    const dirResult = await this.createDirectoryStructure(options);
    if (!dirResult.isSuccess) {
      return Result.failure(`Directory creation failed: ${dirResult.error}`);
    }

    const configResult = await this.generateConfigs(options);
    if (!configResult.isSuccess) {
      return Result.failure(`Config generation failed: ${configResult.error}`);
    }

    return Result.success(metadata);
  } catch (error) {
    return Result.failure(`Unexpected error: ${(error as Error).message}`);
  }
}
```

#### 9.2.2 Error Recovery Strategies

```typescript
// Retry pattern for transient errors
async writeFileWithRetry(path: string, content: string, maxRetries = 3): Promise<Result<void>> {
  let lastError: string = '';

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const result = await this.fileSystem.writeFile(path, content);
    if (result.isSuccess) {
      return result;
    }

    lastError = result.error!;

    // Transient errors (e.g., EBUSY on Windows)
    if (this.isTransientError(lastError) && attempt < maxRetries) {
      await this.sleep(100 * attempt); // Exponential backoff
      continue;
    }

    // Non-transient error, fail immediately
    break;
  }

  return Result.failure(`Failed after ${maxRetries} attempts: ${lastError}`);
}

private isTransientError(error: string): boolean {
  const transientPatterns = ['EBUSY', 'EAGAIN', 'EWOULDBLOCK'];
  return transientPatterns.some(pattern => error.includes(pattern));
}
```

#### 9.2.3 Graceful Degradation

```typescript
// If AI context generation fails, continue with scaffolding
async scaffold(options: ScaffoldOptions): Promise<Result<ProjectMetadata>> {
  // Critical: directory structure and base files
  const criticalResult = await this.generateCriticalFiles(options);
  if (!criticalResult.isSuccess) {
    return Result.failure(criticalResult.error!);
  }

  // Non-critical: AI context
  if (options.aiAssistants.includes(AIAssistant.ClaudeCode)) {
    try {
      await this.claudeCodePlugin.generateContext(metadata);
    } catch (error) {
      // Log warning but don't fail scaffolding
      logger.warn('AI context generation failed', { error: (error as Error).message });
      console.warn('⚠ AI context generation failed, continuing without it...');
    }
  }

  return Result.success(metadata);
}
```

### 9.3 User-Friendly Error Messages

```typescript
// Map technical errors to user-friendly messages
function formatErrorForUser(error: string): string {
  const errorMap: Record<string, string> = {
    EACCES: 'Permission denied. Please check file permissions or run with appropriate privileges.',
    ENOENT: 'File or directory not found. Please check the path and try again.',
    EEXIST:
      'Directory already exists. Please choose a different project name or remove the existing directory.',
    ENOSPC: 'No space left on device. Please free up disk space and try again.',
    EMFILE: 'Too many open files. Please close other applications and try again.',
  };

  for (const [code, message] of Object.entries(errorMap)) {
    if (error.includes(code)) {
      return message;
    }
  }

  return `An error occurred: ${error}. Please check the logs for more details.`;
}
```

---

## 10. Testing Strategy

### 10.1 Test Coverage Targets

| Test Type             | Coverage Target    | Mutation Score Target | Location                         |
| --------------------- | ------------------ | --------------------- | -------------------------------- |
| **Unit Tests**        | 100% line coverage | 80%+ mutation score   | `tests/unit/` per package        |
| **Integration Tests** | 80% coverage       | N/A (no Stryker)      | `tests/integration/` per package |
| **E2E Tests**         | 80% critical paths | N/A (no Stryker)      | `apps/cli/tests/e2e/`            |

### 10.2 Unit Testing Strategy

#### 10.2.1 Use Case Tests (packages/core)

```typescript
// packages/core/tests/unit/scaffolding-service.test.ts
import { describe, it, expect, beforeEach, mock } from 'bun:test';
import { ScaffoldingService } from '@/use-cases/scaffolding-service';
import type { IFileSystem } from '@/interfaces/i-file-system';
import type { ITemplateRenderer } from '@/interfaces/i-template-renderer';
import { Result } from '@/common/result';
import { QualityLevel, AIAssistant } from '@/types';

describe('ScaffoldingService', () => {
  let sut: ScaffoldingService;
  let mockFileSystem: IFileSystem;
  let mockTemplateRenderer: ITemplateRenderer;
  let mockScaffolderPlugin: any;
  let mockClaudeCodePlugin: any;

  beforeEach(() => {
    // Create fresh mocks for every test (isolation)
    mockFileSystem = {
      createDirectory: mock(async () => Result.success(undefined)),
      writeFile: mock(async () => Result.success(undefined)),
      readFile: mock(async () => Result.success('mock content')),
      exists: mock(async () => true),
      copy: mock(async () => Result.success(undefined)),
    };

    mockTemplateRenderer = {
      render: mock(async () => Result.success('rendered content')),
      registerPartial: mock(async () => Result.success(undefined)),
      registerHelper: mock(() => {}),
    };

    mockScaffolderPlugin = {
      name: 'scaffolder',
      version: '1.0.0',
      initialize: mock(async () => {}),
      teardown: mock(async () => {}),
      supports: mock(() => true),
      execute: mock(async () => {}),
      generateConfigs: mock(async () => {}),
    };

    mockClaudeCodePlugin = {
      name: 'claude-code',
      version: '1.0.0',
      initialize: mock(async () => {}),
      teardown: mock(async () => {}),
      supports: mock(() => true),
      execute: mock(async () => {}),
    };

    sut = new ScaffoldingService(
      mockFileSystem,
      mockTemplateRenderer,
      mockScaffolderPlugin,
      mockClaudeCodePlugin
    );
  });

  describe('scaffold', () => {
    it('should create directory structure successfully', async () => {
      // Arrange
      const options = {
        projectName: 'test-project',
        description: 'Test description',
        targetDirectory: '/tmp/test-project',
        qualityLevel: QualityLevel.Strict,
        aiAssistants: [],
      };

      // Act
      const result = await sut.scaffold(options);

      // Assert
      expect(result.isSuccess).toBe(true);
      expect(mockFileSystem.createDirectory).toHaveBeenCalledTimes(6); // 6 directories
      expect(mockFileSystem.createDirectory).toHaveBeenCalledWith('/tmp/test-project');
      expect(mockFileSystem.createDirectory).toHaveBeenCalledWith('/tmp/test-project/src');
      expect(mockFileSystem.createDirectory).toHaveBeenCalledWith('/tmp/test-project/tests');
    });

    it('should return failure when directory creation fails', async () => {
      // Arrange
      const options = {
        projectName: 'test-project',
        description: 'Test description',
        targetDirectory: '/tmp/test-project',
        qualityLevel: QualityLevel.Strict,
        aiAssistants: [],
      };

      mockFileSystem.createDirectory = mock(async () =>
        Result.failure('EACCES: permission denied')
      );

      // Act
      const result = await sut.scaffold(options);

      // Assert
      expect(result.isSuccess).toBe(false);
      expect(result.error).toContain('Directory creation failed');
    });

    it('should generate AI context when Claude Code is enabled', async () => {
      // Arrange
      const options = {
        projectName: 'test-project',
        description: 'Test description',
        targetDirectory: '/tmp/test-project',
        qualityLevel: QualityLevel.Strict,
        aiAssistants: [AIAssistant.ClaudeCode],
      };

      // Act
      const result = await sut.scaffold(options);

      // Assert
      expect(result.isSuccess).toBe(true);
      expect(mockClaudeCodePlugin.execute).toHaveBeenCalledWith(
        'generate-context',
        expect.objectContaining({
          projectMeta: expect.objectContaining({
            name: 'test-project',
            qualityLevel: QualityLevel.Strict,
          }),
        })
      );
    });

    it('should not generate AI context when no AI assistants specified', async () => {
      // Arrange
      const options = {
        projectName: 'test-project',
        description: 'Test description',
        targetDirectory: '/tmp/test-project',
        qualityLevel: QualityLevel.Strict,
        aiAssistants: [],
      };

      // Act
      const result = await sut.scaffold(options);

      // Assert
      expect(result.isSuccess).toBe(true);
      expect(mockClaudeCodePlugin.execute).not.toHaveBeenCalled();
    });

    it('should handle quality level strict correctly', async () => {
      // Arrange
      const options = {
        projectName: 'test-project',
        description: 'Test description',
        targetDirectory: '/tmp/test-project',
        qualityLevel: QualityLevel.Strict,
        aiAssistants: [],
      };

      // Act
      const result = await sut.scaffold(options);

      // Assert
      expect(result.isSuccess).toBe(true);
      expect(mockScaffolderPlugin.generateConfigs).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            tool: 'eslint',
            qualityLevel: QualityLevel.Strict,
          }),
        ])
      );
    });
  });
});
```

#### 10.2.2 Adapter Tests (packages/adapters)

```typescript
// packages/adapters/tests/unit/template-renderer.test.ts
import { describe, it, expect, beforeEach, mock } from 'bun:test';
import { TemplateRenderer } from '@/template-renderer';
import type { IFileSystem } from '@nimata/core/interfaces/i-file-system';
import { Result } from '@nimata/core/common/result';

describe('TemplateRenderer', () => {
  let sut: TemplateRenderer;
  let mockFileSystem: IFileSystem;

  beforeEach(() => {
    mockFileSystem = {
      createDirectory: mock(async () => Result.success(undefined)),
      writeFile: mock(async () => Result.success(undefined)),
      readFile: mock(async () => Result.success('{{projectName}} - {{description}}')),
      exists: mock(async () => true),
      copy: mock(async () => Result.success(undefined)),
    };

    sut = new TemplateRenderer(mockFileSystem);
  });

  describe('render', () => {
    it('should render template with context', async () => {
      // Arrange
      const context = {
        projectName: 'my-project',
        description: 'My awesome project',
      };

      // Act
      const result = await sut.render('template.hbs', context);

      // Assert
      expect(result.isSuccess).toBe(true);
      expect(result.value).toBe('my-project - My awesome project');
    });

    it('should return failure when template file not found', async () => {
      // Arrange
      mockFileSystem.readFile = mock(async () =>
        Result.failure('ENOENT: no such file or directory')
      );

      // Act
      const result = await sut.render('missing.hbs', {});

      // Assert
      expect(result.isSuccess).toBe(false);
      expect(result.error).toContain('Failed to read template');
    });

    it('should handle conditional blocks correctly', async () => {
      // Arrange
      mockFileSystem.readFile = mock(async () =>
        Result.success('{{#if isStrict}}Strict mode enabled{{/if}}')
      );
      const context = { isStrict: true };

      // Act
      const result = await sut.render('template.hbs', context);

      // Assert
      expect(result.isSuccess).toBe(true);
      expect(result.value).toBe('Strict mode enabled');
    });
  });

  describe('registerHelper', () => {
    it('should register and use custom helper', async () => {
      // Arrange
      mockFileSystem.readFile = mock(async () => Result.success('{{kebab-case projectName}}'));
      const context = { projectName: 'My Project' };

      // Act
      const result = await sut.render('template.hbs', context);

      // Assert
      expect(result.isSuccess).toBe(true);
      expect(result.value).toBe('my-project');
    });
  });
});
```

### 10.3 Integration Testing Strategy

#### 10.3.1 File System Integration Tests

```typescript
// packages/adapters/tests/integration/file-system-repository.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { FileSystemRepository } from '@/repositories/file-system-repository';
import { tmpdir } from 'os';
import { join } from 'path';

describe('FileSystemRepository (Integration)', () => {
  let sut: FileSystemRepository;
  let tempDir: string;

  beforeEach(async () => {
    // Create real temp directory
    tempDir = join(tmpdir(), `nimata-test-${Date.now()}`);
    await Bun.mkdir(tempDir, { recursive: true });
    sut = new FileSystemRepository();
  });

  afterEach(async () => {
    // Clean up temp directory
    await Bun.rmdir(tempDir, { recursive: true, force: true });
  });

  it('should create directory recursively', async () => {
    // Arrange
    const nestedPath = join(tempDir, 'a', 'b', 'c');

    // Act
    const result = await sut.createDirectory(nestedPath);

    // Assert
    expect(result.isSuccess).toBe(true);
    const exists = await Bun.file(nestedPath).exists();
    expect(exists).toBe(true);
  });

  it('should write and read file correctly', async () => {
    // Arrange
    const filePath = join(tempDir, 'test.txt');
    const content = 'Hello, Nìmata!';

    // Act
    const writeResult = await sut.writeFile(filePath, content);
    const readResult = await sut.readFile(filePath);

    // Assert
    expect(writeResult.isSuccess).toBe(true);
    expect(readResult.isSuccess).toBe(true);
    expect(readResult.value).toBe(content);
  });

  it('should handle permission errors gracefully', async () => {
    // Arrange
    const invalidPath = '/root/forbidden/test.txt'; // Requires root permissions

    // Act
    const result = await sut.writeFile(invalidPath, 'content');

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.error).toContain('EACCES');
  });
});
```

### 10.4 E2E Testing Strategy

```typescript
// apps/cli/tests/e2e/init-command.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { spawn } from 'bun';
import { tmpdir } from 'os';
import { join } from 'path';

describe('nimata init (E2E)', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = join(tmpdir(), `nimata-e2e-${Date.now()}`);
    await Bun.mkdir(tempDir, { recursive: true });
  });

  afterEach(async () => {
    await Bun.rmdir(tempDir, { recursive: true, force: true });
  });

  it('should scaffold project with default options', async () => {
    // Arrange
    const projectName = 'test-cli';
    const projectDir = join(tempDir, projectName);

    // Act - Run actual CLI command
    const proc = spawn(['bun', 'run', 'nimata', 'init', projectName], {
      cwd: tempDir,
      env: { ...process.env, NIMATA_AUTO_CONFIRM: 'true' }, // Skip interactive prompts
      stdin: 'inherit',
      stdout: 'pipe',
      stderr: 'pipe',
    });

    const output = await new Response(proc.stdout).text();
    const exitCode = await proc.exited;

    // Assert
    expect(exitCode).toBe(0);
    expect(output).toContain('Project scaffolded successfully');

    // Verify files created
    expect(await Bun.file(join(projectDir, 'package.json')).exists()).toBe(true);
    expect(await Bun.file(join(projectDir, 'tsconfig.json')).exists()).toBe(true);
    expect(await Bun.file(join(projectDir, '.eslintrc.json')).exists()).toBe(true);
    expect(await Bun.file(join(projectDir, 'CLAUDE.md')).exists()).toBe(true);

    // Verify directory structure
    expect(await Bun.file(join(projectDir, 'src')).exists()).toBe(true);
    expect(await Bun.file(join(projectDir, 'tests')).exists()).toBe(true);
    expect(await Bun.file(join(projectDir, '.nimata')).exists()).toBe(true);
  });

  it('should compile generated project successfully', async () => {
    // Arrange
    const projectName = 'test-cli';
    const projectDir = join(tempDir, projectName);

    // Scaffold project
    const scaffoldProc = spawn(['bun', 'run', 'nimata', 'init', projectName], {
      cwd: tempDir,
      env: { ...process.env, NIMATA_AUTO_CONFIRM: 'true' },
    });
    await scaffoldProc.exited;

    // Act - Run TypeScript compiler
    const compileProc = spawn(['bun', 'x', 'tsc', '--noEmit'], {
      cwd: projectDir,
      stdout: 'pipe',
      stderr: 'pipe',
    });

    const exitCode = await compileProc.exited;

    // Assert
    expect(exitCode).toBe(0); // No compilation errors
  });

  it('should pass all quality checks on generated project', async () => {
    // Arrange
    const projectName = 'test-cli';
    const projectDir = join(tempDir, projectName);

    // Scaffold project
    const scaffoldProc = spawn(['bun', 'run', 'nimata', 'init', projectName], {
      cwd: tempDir,
      env: { ...process.env, NIMATA_AUTO_CONFIRM: 'true' },
    });
    await scaffoldProc.exited;

    // Act - Run all quality checks (if nimata validate was implemented)
    const qualityProc = spawn(['bun', 'run', 'lint'], {
      cwd: projectDir,
      stdout: 'pipe',
      stderr: 'pipe',
    });

    const exitCode = await qualityProc.exited;

    // Assert
    expect(exitCode).toBe(0); // All quality checks pass
  });
});
```

### 10.5 Mutation Testing Configuration

```json
// packages/core/stryker.config.json
{
  "$schema": "./node_modules/@stryker-mutator/core/schema/stryker-schema.json",
  "testRunner": "command",
  "commandRunner": {
    "command": "bun test tests/unit/**/*.test.ts"
  },
  "coverageAnalysis": "perTest",
  "mutate": ["src/**/*.ts", "!src/**/*.test.ts", "!src/types/**"],
  "ignore": ["**/tests/integration/**", "**/tests/e2e/**"],
  "thresholds": {
    "high": 80,
    "low": 60,
    "break": 50
  },
  "mutator": {
    "plugins": ["@stryker-mutator/typescript-checker"]
  },
  "checkers": ["typescript"],
  "tsconfigFile": "tsconfig.json",
  "reporters": ["html", "clear-text", "progress"],
  "htmlReporter": {
    "fileName": "mutation-report.html"
  }
}
```

---

## 11. Acceptance Criteria Mapping

### 11.1 Story 1.1: CLI Framework Setup

| AC #     | Acceptance Criteria                   | Test Case                                                    | Test Type | Status    |
| -------- | ------------------------------------- | ------------------------------------------------------------ | --------- | --------- |
| AC-1.1.1 | CLI entry point executes successfully | `init-command.test.ts::should execute nimata command`        | E2E       | ✅ Mapped |
| AC-1.1.2 | Command routing supports subcommands  | `command-router.test.ts::should route to correct subcommand` | Unit      | ✅ Mapped |
| AC-1.1.3 | Argument parsing handles flags        | `argument-parser.test.ts::should parse flags correctly`      | Unit      | ✅ Mapped |
| AC-1.1.4 | Help text displays for each command   | `help-display.test.ts::should show help text`                | E2E       | ✅ Mapped |
| AC-1.1.5 | Version number displays correctly     | `version-display.test.ts::should show version`               | E2E       | ✅ Mapped |
| AC-1.1.6 | Exit codes follow Unix conventions    | `exit-codes.test.ts::should return correct exit codes`       | E2E       | ✅ Mapped |

### 11.2 Story 1.2: Configuration System

| AC #     | Acceptance Criteria                  | Test Case                                                    | Test Type   | Status    |
| -------- | ------------------------------------ | ------------------------------------------------------------ | ----------- | --------- |
| AC-1.2.1 | Reads .nimatarc from project root    | `yaml-config-repository.test.ts::should read project config` | Integration | ✅ Mapped |
| AC-1.2.2 | Supports global config               | `yaml-config-repository.test.ts::should read global config`  | Integration | ✅ Mapped |
| AC-1.2.3 | Project config overrides global      | `config-cascade.test.ts::should merge configs correctly`     | Unit        | ✅ Mapped |
| AC-1.2.4 | Configuration schema validation      | `config-validation.test.ts::should validate schema`          | Unit        | ✅ Mapped |
| AC-1.2.5 | Default values for optional settings | `config-defaults.test.ts::should use defaults`               | Unit        | ✅ Mapped |
| AC-1.2.6 | Programmatic config loading          | `yaml-config-repository.test.ts::should load config`         | Unit        | ✅ Mapped |

### 11.3 Story 1.3: Interactive Wizard

| AC #     | Acceptance Criteria             | Test Case                                                 | Test Type | Status    |
| -------- | ------------------------------- | --------------------------------------------------------- | --------- | --------- |
| AC-1.3.1 | Wizard collects required inputs | `scaffold-wizard.test.ts::should collect all inputs`      | Unit      | ✅ Mapped |
| AC-1.3.2 | Inline help accessible via [?]  | `wizard-help.test.ts::should show help on demand`         | E2E       | ✅ Mapped |
| AC-1.3.3 | Smart defaults pre-selected     | `scaffold-wizard.test.ts::should pre-select defaults`     | Unit      | ✅ Mapped |
| AC-1.3.4 | Multi-select for AI assistants  | `wizard-multiselect.test.ts::should handle multi-select`  | Unit      | ✅ Mapped |
| AC-1.3.5 | Input validation with errors    | `wizard-validation.test.ts::should validate input`        | Unit      | ✅ Mapped |
| AC-1.3.6 | Progress indicator              | `wizard-progress.test.ts::should show progress`           | E2E       | ✅ Mapped |
| AC-1.3.7 | Navigate to previous questions  | `wizard-navigation.test.ts::should allow back navigation` | E2E       | ✅ Mapped |
| AC-1.3.8 | Completes in <15 questions      | `wizard-length.test.ts::should complete within limit`     | E2E       | ✅ Mapped |

### 11.4 Story 1.4: Directory Structure Generator

| AC #     | Acceptance Criteria          | Test Case                                                | Test Type   | Status    |
| -------- | ---------------------------- | -------------------------------------------------------- | ----------- | --------- |
| AC-1.4.1 | Creates standard directories | `scaffolding-service.test.ts::should create directories` | Unit        | ✅ Mapped |
| AC-1.4.2 | Generates entry point file   | `directory-generator.test.ts::should create index.ts`    | Integration | ✅ Mapped |
| AC-1.4.3 | Creates bin launcher script  | `directory-generator.test.ts::should create bin script`  | Integration | ✅ Mapped |
| AC-1.4.4 | Generates .gitignore         | `directory-generator.test.ts::should create gitignore`   | Integration | ✅ Mapped |
| AC-1.4.5 | Creates README.md            | `directory-generator.test.ts::should create readme`      | Integration | ✅ Mapped |
| AC-1.4.6 | Correct file permissions     | `file-permissions.test.ts::should set permissions`       | Integration | ✅ Mapped |
| AC-1.4.7 | SOLID architecture support   | `directory-structure.test.ts::should support SOLID`      | E2E         | ✅ Mapped |

### 11.5 Story 1.5: Template Engine

| AC #     | Acceptance Criteria            | Test Case                                                | Test Type   | Status    |
| -------- | ------------------------------ | -------------------------------------------------------- | ----------- | --------- |
| AC-1.5.1 | Loads templates from directory | `template-renderer.test.ts::should load templates`       | Unit        | ✅ Mapped |
| AC-1.5.2 | Variable substitution          | `template-renderer.test.ts::should substitute variables` | Unit        | ✅ Mapped |
| AC-1.5.3 | Conditional blocks             | `template-renderer.test.ts::should handle conditionals`  | Unit        | ✅ Mapped |
| AC-1.5.4 | Template validation            | `template-renderer.test.ts::should validate templates`   | Unit        | ✅ Mapped |
| AC-1.5.5 | Correct formatting             | `template-output.test.ts::should format correctly`       | Integration | ✅ Mapped |
| AC-1.5.6 | Template catalog extensible    | `template-catalog.test.ts::should support new stacks`    | Unit        | ✅ Mapped |
| AC-1.5.7 | Error handling                 | `template-renderer.test.ts::should handle errors`        | Unit        | ✅ Mapped |

### 11.6 Story 1.6: ESLint Configuration Generator

| AC #     | Acceptance Criteria           | Test Case                                                | Test Type   | Status    |
| -------- | ----------------------------- | -------------------------------------------------------- | ----------- | --------- |
| AC-1.6.1 | Creates .eslintrc.json        | `eslint-generator.test.ts::should create config file`    | Integration | ✅ Mapped |
| AC-1.6.2 | Light quality level rules     | `eslint-generator.test.ts::should apply light rules`     | Unit        | ✅ Mapped |
| AC-1.6.3 | Medium quality level rules    | `eslint-generator.test.ts::should apply medium rules`    | Unit        | ✅ Mapped |
| AC-1.6.4 | Strict quality level rules    | `eslint-generator.test.ts::should apply strict rules`    | Unit        | ✅ Mapped |
| AC-1.6.5 | Installs required packages    | `package-json-generator.test.ts::should add eslint deps` | Integration | ✅ Mapped |
| AC-1.6.6 | Config passes validation      | `eslint-config-validation.test.ts::should validate`      | E2E         | ✅ Mapped |
| AC-1.6.7 | Generated project passes lint | `init-command.test.ts::should pass eslint`               | E2E         | ✅ Mapped |

### 11.7 Story 1.7: TypeScript Configuration Generator

| AC #     | Acceptance Criteria                    | Test Case                                                | Test Type | Status    |
| -------- | -------------------------------------- | -------------------------------------------------------- | --------- | --------- |
| AC-1.7.1 | Creates tsconfig.json with strict mode | `tsconfig-generator.test.ts::should enable strict`       | Unit      | ✅ Mapped |
| AC-1.7.2 | Target ES2022, module ESNext           | `tsconfig-generator.test.ts::should set target`          | Unit      | ✅ Mapped |
| AC-1.7.3 | Source maps enabled                    | `tsconfig-generator.test.ts::should enable sourcemaps`   | Unit      | ✅ Mapped |
| AC-1.7.4 | Declaration files generated            | `tsconfig-generator.test.ts::should enable declarations` | Unit      | ✅ Mapped |
| AC-1.7.5 | Path aliases configured                | `tsconfig-generator.test.ts::should configure paths`     | Unit      | ✅ Mapped |
| AC-1.7.6 | Excludes node_modules, dist, tests     | `tsconfig-generator.test.ts::should exclude dirs`        | Unit      | ✅ Mapped |
| AC-1.7.7 | Compiler validates config              | `init-command.test.ts::should compile successfully`      | E2E       | ✅ Mapped |
| AC-1.7.8 | Generated project compiles             | `init-command.test.ts::should compile with tsc`          | E2E       | ✅ Mapped |

### 11.8 Story 1.8: Prettier & Bun Test Configuration

| AC #     | Acceptance Criteria                 | Test Case                                               | Test Type   | Status    |
| -------- | ----------------------------------- | ------------------------------------------------------- | ----------- | --------- |
| AC-1.8.1 | Creates .prettierrc.json            | `prettier-generator.test.ts::should create config`      | Integration | ✅ Mapped |
| AC-1.8.2 | Opinionated formatting rules        | `prettier-generator.test.ts::should set rules`          | Unit        | ✅ Mapped |
| AC-1.8.3 | Creates .prettierignore             | `prettier-generator.test.ts::should create ignore file` | Integration | ✅ Mapped |
| AC-1.8.4 | Bun Test configured in package.json | `bun-config-generator.test.ts::should add scripts`      | Unit        | ✅ Mapped |
| AC-1.8.5 | Sample test file generated          | `bun-config-generator.test.ts::should create test`      | Integration | ✅ Mapped |
| AC-1.8.6 | bun test runs successfully          | `init-command.test.ts::should run tests`                | E2E         | ✅ Mapped |
| AC-1.8.7 | prettier --check passes             | `init-command.test.ts::should pass prettier`            | E2E         | ✅ Mapped |

### 11.9 Story 1.9: AI Rules Library & CLAUDE.md Generator

| AC #      | Acceptance Criteria                   | Test Case                                                        | Test Type   | Status    |
| --------- | ------------------------------------- | ---------------------------------------------------------------- | ----------- | --------- |
| AC-1.9.1  | Rules library contains best practices | `rules-library.test.ts::should contain common rules`             | Unit        | ✅ Mapped |
| AC-1.9.2  | Generates CLAUDE.md in root           | `claude-code-plugin.test.ts::should create CLAUDE.md`            | Integration | ✅ Mapped |
| AC-1.9.3  | Project structure explanation         | `claude-context-validation.test.ts::should explain structure`    | E2E         | ✅ Mapped |
| AC-1.9.4  | Coding standards documented           | `claude-context-validation.test.ts::should document standards`   | E2E         | ✅ Mapped |
| AC-1.9.5  | Architecture decisions included       | `claude-context-validation.test.ts::should include architecture` | E2E         | ✅ Mapped |
| AC-1.9.6  | Quality level constraints             | `context-generator.test.ts::should adapt to quality level`       | Unit        | ✅ Mapped |
| AC-1.9.7  | Common patterns and anti-patterns     | `claude-context-validation.test.ts::should show patterns`        | E2E         | ✅ Mapped |
| AC-1.9.8  | Rules adapt to quality level          | `context-generator.test.ts::should adapt rules`                  | Unit        | ✅ Mapped |
| AC-1.9.9  | Human-readable markdown               | `claude-context-validation.test.ts::should be readable`          | E2E         | ✅ Mapped |
| AC-1.9.10 | File size < 10KB                      | `claude-code-plugin.test.ts::should validate size`               | Unit        | ✅ Mapped |
| AC-1.9.11 | Good/bad code examples                | `claude-context-validation.test.ts::should include examples`     | E2E         | ✅ Mapped |

### 11.10 Story 1.10: GitHub Copilot Instructions Generator

| AC #      | Acceptance Criteria                       | Test Case                                                         | Test Type   | Status    |
| --------- | ----------------------------------------- | ----------------------------------------------------------------- | ----------- | --------- |
| AC-1.10.1 | Generates .github/copilot-instructions.md | `copilot-generator.test.ts::should create file`                   | Integration | ✅ Mapped |
| AC-1.10.2 | Contains coding standards                 | `copilot-context-validation.test.ts::should document standards`   | E2E         | ✅ Mapped |
| AC-1.10.3 | Architectural decisions                   | `copilot-context-validation.test.ts::should include architecture` | E2E         | ✅ Mapped |
| AC-1.10.4 | Format optimized for Copilot              | `copilot-generator.test.ts::should use copilot format`            | Unit        | ✅ Mapped |
| AC-1.10.5 | Adapts to quality level                   | `copilot-generator.test.ts::should adapt to quality`              | Unit        | ✅ Mapped |
| AC-1.10.6 | TypeScript/Bun conventions                | `copilot-context-validation.test.ts::should include conventions`  | E2E         | ✅ Mapped |
| AC-1.10.7 | Follows Copilot best practices            | `copilot-validation.test.ts::should follow best practices`        | Unit        | ✅ Mapped |
| AC-1.10.8 | File < 5KB                                | `copilot-generator.test.ts::should validate size`                 | Unit        | ✅ Mapped |

### 11.11 Story 1.11: Quality Level Presets & End-to-End Init

| AC #      | Acceptance Criteria               | Test Case                                               | Test Type   | Status    |
| --------- | --------------------------------- | ------------------------------------------------------- | ----------- | --------- |
| AC-1.11.1 | Three preset configurations       | `quality-presets.test.ts::should have three presets`    | Unit        | ✅ Mapped |
| AC-1.11.2 | Presets define tools correctly    | `quality-presets.test.ts::should define tool configs`   | Unit        | ✅ Mapped |
| AC-1.11.3 | Selection affects all configs     | `init-command.test.ts::should apply preset everywhere`  | E2E         | ✅ Mapped |
| AC-1.11.4 | End-to-end init completes         | `init-command.test.ts::should complete successfully`    | E2E         | ✅ Mapped |
| AC-1.11.5 | Correct structure for all levels  | `init-command.test.ts::should create correct structure` | E2E         | ✅ Mapped |
| AC-1.11.6 | Generated files are valid         | `init-command.test.ts::should validate files`           | E2E         | ✅ Mapped |
| AC-1.11.7 | Scaffolding completes < 30s       | `performance.test.ts::should complete within time`      | Performance | ✅ Mapped |
| AC-1.11.8 | Can run cd & bun test immediately | `init-command.test.ts::should run tests immediately`    | E2E         | ✅ Mapped |

**Total Acceptance Criteria:** 88
**Total Test Cases Mapped:** 88
**Coverage:** 100%

---

## 12. Implementation Order

### 12.1 Sprint 0: Foundation (Week 1)

**Goal:** Set up infrastructure before story implementation

| Task                          | Owner | Duration | Dependencies  | Deliverable                      |
| ----------------------------- | ----- | -------- | ------------- | -------------------------------- |
| Turborepo monorepo setup      | Dev 1 | 1 day    | None          | Working monorepo with turbo.json |
| TypeScript project references | Dev 1 | 1 day    | Turbo setup   | All packages compile together    |
| Define core interfaces        | Dev 1 | 2 days   | None          | packages/core/src/interfaces/    |
| TSyringe DI container         | Dev 1 | 1 day    | Interfaces    | apps/cli/src/container.ts        |
| Testing infrastructure        | Dev 2 | 2 days   | None          | Bun Test + Stryker configs       |
| CI pipeline (GitHub Actions)  | Dev 2 | 1 day    | Testing setup | Working CI with caching          |

**Week 1 Deliverables:**

- ✅ Monorepo structure functional
- ✅ All interfaces defined and validated
- ✅ DI container configured
- ✅ Testing infrastructure ready
- ✅ CI pipeline working

---

### 12.2 Sprint 1: Core Scaffolding (Week 2-3)

**Swim Lane Assignment:**

| Swim Lane              | Developer | Stories       | Parallel?              |
| ---------------------- | --------- | ------------- | ---------------------- |
| **A (Infrastructure)** | Dev 1     | 1.1, 1.2      | Sequential             |
| **B (Scaffolding)**    | Dev 2     | 1.3, 1.4, 1.5 | After A completes      |
| **C (Quality Config)** | Dev 3     | 1.6, 1.7, 1.8 | Parallel with B        |
| **D (AI Rules)**       | Dev 4     | 1.9, 1.10     | Parallel with B, C     |
| **E (Integration)**    | Dev 5     | 1.11          | After B, C, D complete |

#### Week 2 (Sprint 1, Week 1)

**Day 1-2: Story 1.1 (Dev 1) + Story 1.3 (Dev 2)**

- Dev 1: CLI framework setup (Yargs, command routing)
- Dev 2: Interactive wizard (Prompts integration)
- Dev 3: Start ESLint generator research
- Dev 4: Start CLAUDE.md template research

**Day 3-4: Story 1.2 (Dev 1) + Story 1.4 (Dev 2) + Story 1.6 (Dev 3)**

- Dev 1: Configuration system (YAML, cascade)
- Dev 2: Directory structure generator
- Dev 3: ESLint configuration generator
- Dev 4: Start CLAUDE.md generator

**Day 5: Story 1.5 (Dev 2) + Story 1.7 (Dev 3) + Story 1.9 (Dev 4)**

- Dev 1: Help with integration
- Dev 2: Template engine (Handlebars)
- Dev 3: TypeScript config generator
- Dev 4: AI rules library & CLAUDE.md generator

#### Week 3 (Sprint 1, Week 2)

**Day 1-2: Stories 1.8, 1.9, 1.10 (parallel)**

- Dev 2: Prettier & Bun Test config
- Dev 3: Finish TypeScript config
- Dev 4: Finish CLAUDE.md, start GitHub Copilot instructions

**Day 3-5: Story 1.11 (Integration)**

- All devs: End-to-end init command integration
- All devs: Quality level presets
- All devs: E2E testing

---

### 12.3 Implementation Dependencies

#### Critical Path (Sequential)

```
Sprint 0 (Foundation)
  ↓
Story 1.1 (CLI Framework) ← MUST COMPLETE FIRST
  ↓
Story 1.2 (Config System) ← MUST COMPLETE SECOND
  ↓
┌─────────────────────────────────────────────────┐
│ Parallel Development (Week 2-3)                 │
│                                                 │
│ Swim Lane B: 1.3, 1.4, 1.5 (Dev 2)             │
│ Swim Lane C: 1.6, 1.7, 1.8 (Dev 3)             │
│ Swim Lane D: 1.9, 1.10 (Dev 4)                 │
└─────────────────────────────────────────────────┘
  ↓
Story 1.11 (Integration) ← MUST COMPLETE LAST
```

#### Dependency Matrix

| Story | Depends On                              | Can Start After | Blocks               |
| ----- | --------------------------------------- | --------------- | -------------------- |
| 1.1   | Sprint 0                                | Day 1           | 1.2, 1.3             |
| 1.2   | 1.1                                     | Day 3           | 1.3, 1.4             |
| 1.3   | 1.1, 1.2                                | Day 3           | 1.4, 1.11            |
| 1.4   | 1.3                                     | Day 5           | 1.5, 1.11            |
| 1.5   | 1.4                                     | Day 7           | 1.6, 1.7, 1.8, 1.11  |
| 1.6   | 1.5 (interfaces)                        | Day 7           | 1.11                 |
| 1.7   | 1.5 (interfaces)                        | Day 7           | 1.11                 |
| 1.8   | 1.5 (interfaces)                        | Day 7           | 1.11                 |
| 1.9   | 1.5 (interfaces)                        | Day 7           | 1.10, 1.11           |
| 1.10  | 1.9                                     | Day 10          | 1.11                 |
| 1.11  | 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 1.10 | Day 12          | None (Epic complete) |

---

### 12.4 Risk Mitigation

| Risk                                | Probability | Impact | Mitigation Strategy                                                   |
| ----------------------------------- | ----------- | ------ | --------------------------------------------------------------------- |
| **Handlebars template complexity**  | Medium      | High   | Use simple templates first, add complexity incrementally              |
| **Bun API compatibility issues**    | Low         | Medium | Test Bun native APIs early in Sprint 0                                |
| **Plugin isolation failures**       | Low         | High   | Implement error boundaries from day 1, test with intentional failures |
| **CLAUDE.md size exceeds 10KB**     | Medium      | Medium | Monitor size during development, prune verbose content                |
| **Cross-platform file path issues** | Medium      | Medium | Use path.join() everywhere, test on Windows/Mac/Linux early           |
| **Scaffolding performance <30s**    | Low         | Medium | Profile during development, optimize template rendering if needed     |

---

## Appendix A: Glossary

| Term                        | Definition                                                                                   |
| --------------------------- | -------------------------------------------------------------------------------------------- |
| **Clean Architecture Lite** | Simplified 3-layer architecture (CLI → Use Case → Adapter) optimized for CLI tools           |
| **Quality Level**           | Three preset configurations: Light (basic), Medium (standard), Strict (comprehensive)        |
| **AI Context**              | Persistent files (CLAUDE.md, MCP config, etc.) that provide project context to AI assistants |
| **Result Pattern**          | Explicit error handling pattern using Result<T> type instead of throwing exceptions          |
| **Template Context**        | Variables passed to Handlebars templates for rendering                                       |
| **Scaffolding**             | Project structure generation process (directories, files, configs)                           |
| **DI Container**            | TSyringe dependency injection container for managing component dependencies                  |
| **Mutation Testing**        | Testing technique that validates test quality by introducing bugs and checking if tests fail |

---

## Appendix B: Related ADRs

This tech spec references the following Architecture Decision Records from solution-architecture.md:

- **ADR-001:** Use Bun 1.3+ Runtime Instead of Node.js
- **ADR-002:** Use Clean Architecture Lite (3 Layers) Instead of Traditional 4 Layers
- **ADR-003:** Use TSyringe for Dependency Injection with Manual Registration
- **ADR-007:** Use Yargs + Prompts Instead of Commander or oclif

---

## Appendix C: Epic 1 Component Directory Structure

```
nimata/
├── apps/
│   └── cli/
│       ├── src/
│       │   ├── commands/
│       │   │   └── init.ts                    # Story 1.1, 1.11
│       │   ├── wizards/
│       │   │   └── scaffold-wizard.ts         # Story 1.3
│       │   ├── presenters/
│       │   │   └── progress-presenter.ts      # All stories
│       │   ├── container.ts                   # Story 1.1 (DI setup)
│       │   └── index.ts                       # Story 1.1 (CLI entry)
│       └── tests/
│           ├── unit/
│           └── e2e/
│
├── packages/
│   ├── core/
│   │   ├── src/
│   │   │   ├── use-cases/
│   │   │   │   └── scaffolding-service.ts     # Story 1.4, 1.5, 1.11
│   │   │   ├── interfaces/
│   │   │   │   ├── i-scaffolding-service.ts   # Sprint 0
│   │   │   │   ├── i-file-system.ts           # Sprint 0
│   │   │   │   ├── i-template-renderer.ts     # Sprint 0
│   │   │   │   ├── i-config-repository.ts     # Sprint 0
│   │   │   │   └── i-plugin.ts                # Sprint 0
│   │   │   ├── types/
│   │   │   │   ├── project-metadata.ts        # Story 1.4
│   │   │   │   ├── config.ts                  # Story 1.2
│   │   │   │   ├── template-context.ts        # Story 1.5
│   │   │   │   └── tool-config.ts             # Story 1.6
│   │   │   └── common/
│   │   │       └── result.ts                  # Sprint 0
│   │   ├── templates/                          # Story 1.5
│   │   │   ├── base/
│   │   │   │   ├── package.json.hbs
│   │   │   │   ├── tsconfig.base.json.hbs
│   │   │   │   ├── .gitignore.hbs
│   │   │   │   └── README.md.hbs
│   │   │   └── partials/
│   │   └── tests/unit/
│   │
│   └── adapters/
│       ├── src/
│       │   ├── repositories/
│       │   │   ├── file-system-repository.ts   # Story 1.4
│       │   │   └── yaml-config-repository.ts   # Story 1.2
│       │   └── template-renderer.ts            # Story 1.5
│       └── tests/
│           ├── unit/
│           └── integration/
│
├── plugins/
│   ├── plugin-scaffolder/                      # Stories 1.6, 1.7, 1.8
│   │   ├── src/
│   │   │   ├── scaffolder-plugin.ts
│   │   │   └── config-generators/
│   │   │       ├── eslint-generator.ts         # Story 1.6
│   │   │       ├── tsconfig-generator.ts       # Story 1.7
│   │   │       ├── prettier-generator.ts       # Story 1.8
│   │   │       ├── bun-config-generator.ts     # Story 1.8
│   │   │       └── package-json-generator.ts   # Story 1.6, 1.7, 1.8
│   │   ├── templates/
│   │   │   ├── typescript/
│   │   │   │   ├── tsconfig.strict.json
│   │   │   │   ├── tsconfig.lib.json
│   │   │   │   └── tsconfig.app.json
│   │   │   ├── bun/
│   │   │   │   ├── bunfig.toml
│   │   │   │   └── bun.test.config.ts
│   │   │   ├── eslint/
│   │   │   │   └── eslint.config.js
│   │   │   └── prettier/
│   │   │       └── .prettierrc.json
│   │   └── tests/unit/
│   │
│   └── plugin-claude-code/                     # Stories 1.9, 1.10
│       ├── src/
│       │   ├── claude-code-plugin.ts
│       │   ├── context-generator.ts            # Story 1.9
│       │   ├── copilot-generator.ts            # Story 1.10
│       │   ├── mcp-generator.ts                # Story 1.9
│       │   ├── agent-generator.ts              # Story 1.9
│       │   ├── command-generator.ts            # Story 1.9
│       │   └── hook-generator.ts               # Story 1.9
│       ├── templates/
│       │   ├── CLAUDE.md.hbs                   # Story 1.9
│       │   ├── copilot-instructions.md.hbs     # Story 1.10
│       │   ├── mcp/
│       │   │   └── mcp-config.json.hbs
│       │   ├── agents/
│       │   │   └── quality-assistant.md.hbs
│       │   ├── commands/
│       │   │   └── validate-fix.md.hbs
│       │   └── hooks/
│       │       └── pre-commit.md.hbs
│       └── tests/unit/
```

---

**Document Status:** Implementation Ready
**Last Updated:** 2025-10-16
**Next Steps:** Sprint 0 foundation setup → Sprint 1 implementation

---

_Generated by BMad Method Technical Specification workflow_
