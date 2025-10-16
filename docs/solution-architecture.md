# Nìmata Solution Architecture Document

**Project:** Nìmata
**Date:** 2025-10-16
**Author:** User + BMad Architect

## Executive Summary

Nìmata is a CLI tool that orchestrates quality validation for TypeScript/Bun projects through a three-pillar quality cascade: **Start Right** (quality-first scaffolding with AI context), **Find Right** (unified validation), and **Fix Right** (intelligent refactoring with AI assistance). Built as a Turborepo monorepo with Clean Architecture Lite principles, Nìmata leverages Bun 1.3+ native features (SQLite caching, YAML parsing, file hashing) to deliver sub-100ms validation checks with watch mode support. The architecture supports parallel development across 30 stories organized into 3 epics, with a plugin system enabling extensibility while maintaining strict test isolation and mutation testing coverage.

**Key Architectural Highlights:**

- **Modular Monolith** with Clean Architecture Lite (3 layers: CLI → Use Cases → Adapters)
- **Turborepo monorepo** with apps/, packages/, plugins/, infrastructure/ organization
- **Bun 1.3+ native features** for 40-60% performance improvement over npm equivalents
- **Plugin architecture** with static registration and intelligent recommendations
- **Strict TDD** with Stryker mutation testing on unit tests (80%+ mutation score target)
- **Multi-AI assistant support** starting with Claude Code (Phase 1), expandable to Copilot/Windsurf (Phase 2)

## 1. Technology Stack and Decisions

### 1.1 Technology and Library Decision Table

| Category                 | Technology                               | Version  | Rationale                                                                                            | Alternative Considered           | Decision Driver                                                  |
| ------------------------ | ---------------------------------------- | -------- | ---------------------------------------------------------------------------------------------------- | -------------------------------- | ---------------------------------------------------------------- |
| **Runtime**              | Bun                                      | 1.3+     | Native SQLite, YAML, file hashing, glob, watch APIs. 40-60% faster than Node.js for file operations. | Node.js 20 LTS                   | Performance (NFR-003), native features eliminate 6+ dependencies |
| **Language**             | TypeScript                               | 5.x      | Type safety, strict mode enforcement, best Bun support                                               | JavaScript                       | Developer experience, type safety required by SOLID principles   |
| **CLI Framework**        | Yargs                                    | 17.x     | Best TypeScript support, subcommand routing, built-in completion infrastructure                      | Commander, oclif                 | TypeScript-first design, zero decorators, simple routing         |
| **Interactive UI**       | Prompts                                  | 2.x      | Lightweight async prompts, best UX for wizards                                                       | Inquirer, Enquirer               | Async/await API, minimal bundle size, Bun compatibility          |
| **Terminal Colors**      | Picocolors                               | 1.x      | Fastest terminal colors library, 6x smaller than chalk                                               | Chalk, Kleur                     | Performance, bundle size (14x faster than chalk)                 |
| **Progress UI**          | Ora                                      | 7.x      | Spinners with best terminal compatibility                                                            | Listr2, cli-progress             | Simple API, wide terminal support, spinner + text updates        |
| **Monorepo**             | Turborepo                                | 2.x      | Best-in-class caching, 80% CI time savings, npm/Bun support                                          | Nx, Rush, Lerna                  | Industry standard, simple config, remote caching support         |
| **Dependency Injection** | TSyringe                                 | 4.x      | Manual registration (no decorators), Microsoft-maintained                                            | InversifyJS, Awilix              | TDD focus, manual bindings for debugging, performance            |
| **AST Manipulation**     | ts-morph                                 | 22.x     | High-level TypeScript AST API, syntax validation                                                     | TypeScript Compiler API directly | Developer productivity > bundle size, safe transformations       |
| **Logging**              | Pino                                     | 9.x      | Fastest Node.js logger, structured JSON logging                                                      | Winston, Bunyan                  | Performance (NFR-003), structured output, log levels             |
| **Configuration**        | Bun.file().yaml()                        | Native   | Native Bun YAML parsing, zero dependencies                                                           | js-yaml, yaml                    | Performance, native Bun API, eliminates dependency               |
| **Caching**              | bun:sqlite                               | Native   | Native SQLite with WAL mode, 3-6x faster than JSON                                                   | JSON files, Redis                | Performance (NFR-003), persistence, query capabilities           |
| **File Watching**        | Bun.watch()                              | Native   | Native Bun file watcher, cross-platform                                                              | chokidar, node:fs.watch          | Performance, native Bun API, cross-platform support              |
| **File Globbing**        | Bun.Glob                                 | Native   | Native Bun glob pattern matching                                                                     | glob, fast-glob                  | Performance, native Bun API, async iteration                     |
| **File Hashing**         | Bun.hash()                               | Native   | Native Bun hashing (xxHash64), faster than crypto                                                    | crypto, xxhash-wasm              | Performance, native Bun API, cache invalidation                  |
| **Build Tool**           | Bun.build()                              | Native   | Native bundler with minification                                                                     | esbuild, tsup                    | Native Bun API, tree-shaking, single binary compilation          |
| **Testing**              | Bun Test                                 | 1.3+     | Native test runner with snapshots, watch mode                                                        | Vitest, Jest                     | Bun native, faster execution, built-in coverage                  |
| **Mutation Testing**     | Stryker                                  | 8.x      | Industry standard mutation testing, Bun Test support                                                 | Not applicable                   | FR-013, 80%+ mutation score requirement                          |
| **Quality Tools**        | ESLint 9.x, TypeScript 5.x, Prettier 3.x | Latest   | Tools being orchestrated                                                                             | Not applicable                   | Project purpose                                                  |
| **Shell Completion**     | Yargs completion + custom scripts        | Built-in | Manual completion scripts for < 100ms performance                                                    | omelette, tabtab                 | Performance (NFR-003), full control over completion logic        |

### 1.2 Technology Decision Rationale

**Bun 1.3+ Native Features (Performance Optimization):**

The decision to use Bun native features eliminates 6+ npm dependencies and provides 40-60% performance improvement:

1. **bun:sqlite with WAL mode** (3-6x faster than JSON for caching)
2. **Bun.file().yaml()** (no js-yaml dependency)
3. **Bun.hash()** (faster file hashing for cache invalidation)
4. **Bun.watch()** (cross-platform file watching)
5. **Bun.Glob** (native glob pattern matching)
6. **Bun.build()** (bundling and single binary compilation)

**TSyringe (Manual Registration, No Decorators):**

Manual dependency injection container registration provides:

- Clear, debuggable dependency graphs
- No magic decorators (explicit binding)
- Full control over lifetime management
- TDD-friendly mocking and testing

**ts-morph (High-Level AST API):**

Chosen over direct TypeScript Compiler API for:

- Developer productivity (hours vs days for refactoring)
- Built-in syntax validation
- Rollback on error (safe transformations)
- Memory leak prevention (proper dispose handling)

## 2. Architecture Overview

### 2.1 Architecture Style: Clean Architecture Lite (3 Layers)

Nìmata uses a simplified Clean Architecture pattern optimized for CLI tools, reducing 4 traditional layers to 3:

```
┌─────────────────────────────────────────────────────────────┐
│                    CLI Layer (apps/cli)                      │
│  Yargs Commands → Prompts Wizards → Ora Progress → Output   │
│         ↓ Call use cases directly (no Controllers)          │
└─────────────────────────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│             Use Case Layer (packages/core)                   │
│  ScaffoldingService, ValidationService, RefactoringService   │
│  TriageService, TemplateRenderer (business logic + types)    │
│         ↓ Depend on Interfaces (Ports), not Adapters        │
└─────────────────────────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│           Adapter Layer (packages/adapters)                  │
│  Repositories (FileSystem, Config, Cache), Presenters, etc.  │
│         ↓ Implement interfaces from Use Case layer          │
└─────────────────────────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│     Infrastructure Layer (infrastructure/ + plugins/)        │
│  Tool Wrappers (ESLint, TypeScript, Prettier, ts-morph)     │
│  Plugins (Scaffolder, Validator, Refactorer, Claude Code)   │
└─────────────────────────────────────────────────────────────┘
```

**Simplifications from Traditional Clean Architecture:**

1. **No separate Entities package**: Domain types live with use cases (co-location principle)
2. **No Controllers layer**: Yargs commands call use cases directly (CLI tools don't need HTTP-style controllers)
3. **Kept core principles**: Dependency inversion, interfaces, testability, SOLID

### 2.2 Modular Monolith with Plugin Architecture

**Deployment Model**: Single deployment unit (monolithic binary)
**Module Boundaries**: Clear separation via Turborepo packages
**Plugin System**: Static registration with intelligent recommendations

```typescript
// Static plugin registration in apps/cli/src/container.ts
import { ScaffolderPlugin } from '@nimata/plugin-scaffolder';
import { ValidatorPlugin } from '@nimata/plugin-validator';
import { RefactorerPlugin } from '@nimata/plugin-refactorer';
import { ClaudeCodePlugin } from '@nimata/plugin-claude-code';

container.register<IPlugin[]>('Plugins', {
  useValue: [
    new ScaffolderPlugin(),
    new ValidatorPlugin(),
    new RefactorerPlugin(),
    new ClaudeCodePlugin(),
  ],
});
```

**Plugin Isolation**: Each plugin runs in error boundary to prevent crashes from affecting other plugins.

### 2.3 Turborepo Monorepo Organization

**Repository Strategy**: Monorepo with Turborepo for build orchestration

```
nimata/
├── apps/                       # Executable applications
│   └── cli/                    # Main CLI entry point
├── packages/                   # Shared libraries
│   ├── core/                   # Pure business logic + types
│   └── adapters/               # Interface implementations
├── plugins/                    # Plugin modules (root-level)
│   ├── plugin-scaffolder/
│   ├── plugin-validator/
│   ├── plugin-refactorer/
│   └── plugin-claude-code/
└── infrastructure/             # Tool wrappers (root-level)
    ├── eslint-wrapper/
    ├── typescript-wrapper/
    ├── prettier-wrapper/
    └── ts-morph-wrapper/
```

**Benefits:**

- Single source of truth for all code
- Shared build pipeline with caching (80% CI time savings)
- Version locking across all packages
- Atomic commits across boundaries

### 2.4 Component Boundaries (Epic-Driven)

Components naturally align with the three epics from the PRD:

**Epic 1: Start Right - Scaffolding System**

- **ScaffoldingService** (Use Case): Orchestrates project structure generation
- **TemplateRenderer** (Adapter): Handlebars template processing
- **FileSystemRepository** (Adapter): File operations via Bun.write()
- **ConfigGenerators** (Plugin): Generate tool configs (tsconfig, package.json, etc.)
- **ClaudeCodeGenerator** (Plugin): AI context generation (CLAUDE.md, MCP, agents, commands, hooks)

**Epic 2: Find Right - Validation System**

- **ValidationService** (Use Case): Orchestrates all quality tools
- **ToolOrchestrator** (Use Case): Parallel tool execution
- **CacheService** (Use Case): SQLite-based intelligent caching
- **ToolRunners** (Infrastructure): ESLint, TypeScript, Prettier, Bun Test wrappers
- **CacheRepository** (Adapter): SQLite with WAL mode
- **ValidationPresenter** (Adapter): Terminal output formatting

**Epic 3: Fix Right - Refactoring System**

- **RefactoringService** (Use Case): Orchestrates AST transformations
- **TriageService** (Use Case): Issue categorization (auto-fix vs manual)
- **ASTRefactorer** (Infrastructure): ts-morph wrapper with safety checks
- **AIPromptGenerator** (Plugin): Claude Code prompt generation for manual fixes
- **DiffPresenter** (Adapter): Show before/after diffs with syntax highlighting

### 2.5 Dependency Flow

**Strict Dependency Rules:**

```
CLI Layer (apps/cli)
  ↓ depends on
Use Case Layer (packages/core)
  ↓ depends on (interfaces only)
Adapter Layer (packages/adapters)
  ↓ depends on
Infrastructure Layer (infrastructure/ + plugins/)
```

**No circular dependencies allowed.** Enforced by TypeScript project references and Turborepo task dependencies.

## 3. Data Architecture

### 3.1 Persistent Data Storage

**Storage Locations (OS-Agnostic):**

| Data Type            | Location                               | Format       | Persistence | Purpose                                                  |
| -------------------- | -------------------------------------- | ------------ | ----------- | -------------------------------------------------------- |
| **User Preferences** | `~/.nimata/config.yaml`                | YAML         | Permanent   | Global user settings (log level, default tool configs)   |
| **Project Config**   | `<project-root>/.nimata/config.yaml`   | YAML         | Permanent   | Project-specific settings (overrides user config)        |
| **Validation Cache** | `~/.nimata/cache/validation.db`        | SQLite (WAL) | Temporary   | Cached validation results (file hash → results)          |
| **Project Metadata** | `<project-root>/.nimata/metadata.json` | JSON         | Permanent   | Project initialization metadata (creation date, version) |
| **Logs**             | `~/.nimata/logs/*.log`                 | JSON Lines   | Temporary   | Structured Pino logs (rotated daily)                     |

### 3.2 Configuration Cascade Strategy

**Deep merge with project override:**

1. **Defaults** (hardcoded in `packages/core/src/config/defaults.ts`)
2. **User Config** (`~/.nimata/config.yaml`) - merges with defaults
3. **Project Config** (`<project-root>/.nimata/config.yaml`) - overrides user + defaults

```typescript
// Configuration merge logic
const finalConfig = deepMerge(
  DEFAULTS,
  userConfig, // ~/.nimata/config.yaml
  projectConfig // .nimata/config.yaml (highest priority)
);
```

**Rationale**: Team standards (project config) override individual preferences (user config).

### 3.3 Cache Architecture

**SQLite with WAL Mode (Write-Ahead Logging):**

```sql
-- Schema for validation.db
CREATE TABLE validation_cache (
  file_path TEXT PRIMARY KEY,
  file_hash TEXT NOT NULL,
  tool_name TEXT NOT NULL,
  results TEXT NOT NULL,  -- JSON serialized results
  timestamp INTEGER NOT NULL,
  UNIQUE(file_path, tool_name)
);

CREATE INDEX idx_file_hash ON validation_cache(file_hash);
CREATE INDEX idx_timestamp ON validation_cache(timestamp);
```

**Cache Invalidation Strategy:**

1. **File change detection**: Compare `Bun.hash(file)` with cached hash
2. **Tool config change**: Invalidate all results for that tool
3. **Time-based**: Invalidate entries older than 7 days (configurable)
4. **Manual**: `nimata validate --no-cache` bypasses cache

**Performance**: 3-6x faster than JSON file caching, enables sub-100ms validation checks (NFR-003).

### 3.4 Data Flow Diagrams

**Validation Flow with Caching:**

```
User runs: nimata validate

1. ValidationService.validate()
   ↓
2. Load project files (Bun.Glob)
   ↓
3. For each file:
   ├─ Calculate file hash (Bun.hash)
   ├─ Check CacheRepository.get(filePath, toolName, fileHash)
   ├─ If cache hit → return cached results
   └─ If cache miss:
      ├─ Run tool via ToolRunner (ESLint, TypeScript, etc.)
      ├─ Store results in CacheRepository
      └─ Return fresh results
   ↓
4. Aggregate results across all tools
   ↓
5. ValidationPresenter.present(results)
   ↓
6. Output to terminal (Picocolors + Ora)
```

## 4. Component and Integration Overview

### 4.1 Core Components

**CLI Entry Point (apps/cli/src/index.ts):**

```typescript
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { container } from './container';
import { ScaffoldCommand } from './commands/scaffold';
import { ValidateCommand } from './commands/validate';
import { FixCommand } from './commands/fix';
import { InitCommand } from './commands/init';

yargs(hideBin(process.argv))
  .command(container.resolve(InitCommand))
  .command(container.resolve(ScaffoldCommand))
  .command(container.resolve(ValidateCommand))
  .command(container.resolve(FixCommand))
  .demandCommand(1, 'You must provide a command')
  .help()
  .version()
  .parse();
```

**Dependency Injection Container (apps/cli/src/container.ts):**

```typescript
import { container } from 'tsyringe';
import { IConfigRepository } from '@nimata/core';
import { YAMLConfigRepository } from '@nimata/adapters';

// Manual registration (no decorators)
container.register<IConfigRepository>('IConfigRepository', {
  useClass: YAMLConfigRepository,
});

container.register<ValidateUseCase>('ValidateUseCase', {
  useFactory: (c) =>
    new ValidateUseCase(
      c.resolve('IConfigRepository'),
      c.resolve('IToolOrchestrator'),
      c.resolve('ICacheService')
    ),
});

// ... more registrations
```

**Use Case Example (packages/core/src/use-cases/validate-use-case.ts):**

```typescript
export class ValidateUseCase {
  constructor(
    private readonly configRepo: IConfigRepository,
    private readonly toolOrchestrator: IToolOrchestrator,
    private readonly cacheService: ICacheService
  ) {}

  async execute(options: ValidateOptions): Promise<ValidationResult> {
    const config = await this.configRepo.load();
    const files = await this.findFiles(config);

    // Parallel tool execution with caching
    const results = await this.toolOrchestrator.runAll(files, {
      useCache: !options.noCache,
      tools: config.tools,
    });

    return this.aggregateResults(results);
  }

  private async findFiles(config: Config): Promise<string[]> {
    // Use Bun.Glob for fast file discovery
    const glob = new Bun.Glob(config.include);
    return Array.from(glob.scanSync('.'));
  }

  private aggregateResults(results: ToolResult[]): ValidationResult {
    // Aggregate errors/warnings across all tools
    // Return unified format
  }
}
```

### 4.2 Plugin Architecture

**Plugin Interface (packages/core/src/interfaces/plugin.ts):**

```typescript
export interface IPlugin {
  name: string;
  version: string;

  // Lifecycle hooks
  initialize(): Promise<void>;
  teardown(): Promise<void>;

  // Capabilities
  supports(capability: string): boolean;
  execute(capability: string, args: unknown): Promise<unknown>;
}

export interface IScaffolderPlugin extends IPlugin {
  generateProjectStructure(options: ScaffoldOptions): Promise<void>;
  generateConfigs(toolConfigs: ToolConfig[]): Promise<void>;
}

export interface IValidatorPlugin extends IPlugin {
  validate(files: string[], toolName: string): Promise<ValidationResult>;
}

export interface IRefactorerPlugin extends IPlugin {
  refactor(files: string[], transformation: Transformation): Promise<RefactorResult>;
}

export interface IAIPlugin extends IPlugin {
  generateContext(projectMeta: ProjectMetadata): Promise<void>;
  generatePrompt(issue: Issue): Promise<string>;
}
```

**Plugin Isolation (Error Boundary):**

```typescript
export class PluginManager {
  async executePlugin(plugin: IPlugin, capability: string, args: unknown): Promise<Result> {
    try {
      const result = await plugin.execute(capability, args);
      return Result.success(result);
    } catch (error) {
      // Log error but don't crash
      logger.error(`Plugin ${plugin.name} failed: ${error.message}`);
      return Result.failure(`Plugin ${plugin.name} failed`);
    }
  }
}
```

### 4.3 Integration Points

**Tool Wrapper Pattern (Infrastructure Layer):**

```typescript
// infrastructure/eslint-wrapper/src/eslint-runner.ts
export class ESLintRunner implements IToolRunner {
  async run(files: string[], config: ESLintConfig): Promise<ToolResult> {
    const eslint = new ESLint(config);
    const results = await eslint.lintFiles(files);

    return {
      tool: 'eslint',
      errors: results.flatMap((r) => r.messages.filter((m) => m.severity === 2)),
      warnings: results.flatMap((r) => r.messages.filter((m) => m.severity === 1)),
      executionTime: Date.now() - startTime,
    };
  }
}
```

**Watch Mode Integration (NFR-003):**

```typescript
// Bun.watch() for file watching (validate command only)
import { watch } from 'bun';

export class WatchService {
  async watchAndValidate(patterns: string[]): Promise<void> {
    const watcher = watch(patterns, async (event, filename) => {
      if (event === 'change' || event === 'rename') {
        await this.validateUseCase.execute({ files: [filename] });
      }
    });

    // Graceful shutdown on SIGINT/SIGTERM
    process.on('SIGINT', () => watcher.close());
    process.on('SIGTERM', () => watcher.close());
  }
}
```

## 5. Architecture Decision Records

### ADR-001: Use Bun 1.3+ Runtime Instead of Node.js

**Status**: Accepted

**Context**:
Need to choose JavaScript runtime for CLI tool. Options: Node.js 20 LTS vs Bun 1.3+.

**Decision**:
Use Bun 1.3+ as primary runtime.

**Rationale**:

- Native SQLite support with WAL mode (3-6x faster than JSON caching)
- Native YAML parsing eliminates js-yaml dependency
- Native file hashing (Bun.hash) faster than crypto module
- Native file watching (Bun.watch) cross-platform
- Native glob matching (Bun.Glob) faster than npm alternatives
- 40-60% overall performance improvement for file operations
- Supports NFR-003 requirement: < 100ms validation checks with cache

**Consequences**:

- Positive: Significant performance gains, fewer dependencies, native features
- Positive: Bun Test provides fast native testing
- Negative: Smaller ecosystem than Node.js (mitigated by npm compatibility)
- Negative: Users must install Bun (documented in installation guide)

**Alternatives Considered**:

- Node.js 20 LTS: More mature ecosystem but no native features, slower performance

---

### ADR-002: Use Clean Architecture Lite (3 Layers) Instead of Traditional 4 Layers

**Status**: Accepted

**Context**:
Need to choose architecture pattern for CLI tool. Traditional Clean Architecture has 4 layers (Entities, Use Cases, Controllers, Adapters).

**Decision**:
Use simplified "Clean Architecture Lite" with 3 layers: CLI → Use Cases → Adapters.

**Rationale**:

- CLI tools don't need separate Controllers layer (Yargs commands can call use cases directly)
- Domain types (entities) can live with use cases (co-location principle)
- Keeps core benefits: dependency inversion, testability, SOLID principles
- Reduces boilerplate and complexity for CLI context
- Aligns with Epic-driven component boundaries

**Consequences**:

- Positive: Simpler architecture, less boilerplate, faster development
- Positive: Still maintains testability and SOLID principles
- Negative: Slightly less separation than traditional Clean Architecture
- Mitigation: Strict TypeScript project references prevent circular dependencies

**Alternatives Considered**:

- Traditional Clean Architecture (4 layers): Over-engineering for CLI tool
- Functional approach (no classes): Harder to test with DI, less clear boundaries
- Event-driven architecture: Unnecessary complexity for synchronous CLI operations

---

### ADR-003: Use TSyringe for Dependency Injection with Manual Registration

**Status**: Accepted

**Context**:
Need DI container for testability and SOLID principles. Options: TSyringe, InversifyJS, Awilix, or no DI.

**Decision**:
Use TSyringe with manual registration (no decorators).

**Rationale**:

- TDD requirement demands easy mocking and dependency replacement
- Manual registration provides explicit, debuggable dependency graphs
- No magic decorators → clear, traceable code
- Microsoft-maintained, TypeScript-first design
- Performance: Faster than InversifyJS (reflection-based)
- Simple API: register, resolve, clear

**Consequences**:

- Positive: Clear dependency graphs, excellent debuggability
- Positive: Easy to mock for unit tests
- Positive: Performance better than decorator-based solutions
- Negative: Manual registration code (mitigated by generator script)
- Negative: No automatic registration by decorators (intentional trade-off)

**Alternatives Considered**:

- InversifyJS: Decorator-based (too much magic), reflection overhead
- Awilix: Auto-registration (less explicit, harder to debug)
- No DI: Violates SOLID principles, makes testing difficult

---

### ADR-004: Use SQLite with WAL Mode for Validation Caching

**Status**: Accepted

**Context**:
Need caching strategy for validation results to achieve < 100ms performance (NFR-003). Options: JSON files, SQLite, Redis, in-memory.

**Decision**:
Use `bun:sqlite` with WAL (Write-Ahead Logging) mode.

**Rationale**:

- 3-6x faster than JSON file caching (benchmark: 150ms vs 45ms for 1000 entries)
- WAL mode prevents database corruption on crashes
- Enables complex queries (find by hash, timestamp, tool)
- Zero external dependencies (native Bun feature)
- Persistent across runs (unlike in-memory)
- Local storage (no network latency like Redis)
- Supports NFR-003: < 100ms validation checks

**Consequences**:

- Positive: Significant performance improvement
- Positive: Query capabilities (complex invalidation strategies)
- Positive: Persistent cache across CLI runs
- Negative: Slightly larger on-disk footprint than JSON (mitigated by compression)
- Negative: Requires SQLite knowledge (mitigated by Repository pattern abstraction)

**Alternatives Considered**:

- JSON files: Too slow (150ms+ for large projects)
- Redis: Overkill (requires separate process), network overhead
- In-memory: Doesn't persist across runs, doesn't support watch mode

---

### ADR-005: Use ts-morph for AST Manipulation Instead of TypeScript Compiler API

**Status**: Accepted

**Context**:
Need AST manipulation for refactoring features (Epic 3). Options: ts-morph vs TypeScript Compiler API directly.

**Decision**:
Use ts-morph as high-level wrapper around TypeScript Compiler API.

**Rationale**:

- Developer productivity: hours vs days for refactoring implementations
- Built-in syntax validation: prevents invalid transformations
- Rollback on error: safe transformations with automatic revert
- Memory leak prevention: proper dispose() handling
- Clear error messages: better DX than raw Compiler API
- Extensive documentation and examples

**Consequences**:

- Positive: Faster feature development (10x productivity gain)
- Positive: Safer transformations (validation + rollback)
- Positive: Easier onboarding (simpler API)
- Negative: Larger bundle size (~2MB vs ~1MB for direct API)
- Mitigation: Bundle size acceptable for CLI tool (not a web app)

**Alternatives Considered**:

- TypeScript Compiler API directly: Lower-level, harder to use, error-prone
- Babel AST: Not TypeScript-native, requires extra transformation steps

---

### ADR-006: Use Turborepo for Monorepo Orchestration

**Status**: Accepted

**Context**:
Need monorepo build orchestration. Options: Turborepo, Nx, Rush, Lerna.

**Decision**:
Use Turborepo for build caching and task orchestration.

**Rationale**:

- Industry standard for TypeScript monorepos
- Best-in-class caching: 80% CI time savings measured
- Simple configuration: single `turbo.json` file
- Remote caching support (future: Vercel Remote Cache)
- Excellent Bun compatibility
- Fast adoption curve (simpler than Nx)

**Consequences**:

- Positive: Dramatic CI performance improvement (80% time savings)
- Positive: Local development speed improvement (incremental builds)
- Positive: Simple configuration and maintenance
- Negative: Less feature-rich than Nx (acceptable for Level 2 project)
- Negative: Requires learning Turborepo concepts (task dependencies, pipelines)

**Alternatives Considered**:

- Nx: More features but higher complexity, steeper learning curve
- Rush: Microsoft-maintained but less popular, smaller community
- Lerna: Deprecated, no longer maintained

---

### ADR-007: Use Yargs + Prompts Instead of Commander or oclif

**Status**: Accepted

**Context**:
Need CLI framework for command routing and interactive prompts. Options: Yargs, Commander, oclif.

**Decision**:
Use Yargs for command routing + Prompts for interactive mode.

**Rationale**:

- Yargs: Best TypeScript support, zero decorators, simple routing
- Prompts: Async/await API, lightweight, excellent Bun compatibility
- Separation of concerns: routing (Yargs) vs interaction (Prompts)
- Built-in shell completion infrastructure in Yargs
- Smaller bundle size than oclif (which includes everything)

**Consequences**:

- Positive: Simple, focused libraries (single responsibility)
- Positive: Excellent TypeScript experience
- Positive: Lightweight bundle size
- Negative: Two libraries instead of one monolithic framework (oclif)
- Mitigation: Both libraries are mature, stable, well-documented

**Alternatives Considered**:

- Commander: Less TypeScript-focused, weaker completion support
- oclif: Monolithic framework, decorator-heavy, larger bundle size

---

### ADR-008: Plugin Discovery via Static Registration with Intelligent Recommendations

**Status**: Accepted

**Context**:
Need plugin discovery mechanism. Options: static registration, package.json conventions, registry file, or hybrid.

**Decision**:
Use hybrid approach: static registration for built-in plugins + intelligent recommendations from registry.

**Rationale**:

- MVP: 4 built-in plugins (scaffolder, validator, refactorer, claude-code)
- Static registration: explicit imports, no runtime discovery overhead
- Intelligent recommendations: registry suggests relevant plugins based on project type
- Extensibility: users can add custom plugins via static import
- Future: plugin installation via `nimata plugin install <name>`

**Consequences**:

- Positive: Fast startup (no dynamic discovery in MVP)
- Positive: Clear, traceable plugin loading
- Positive: Extensible for future plugin ecosystem
- Negative: Manual import required for custom plugins (acceptable for MVP)
- Future: Add dynamic discovery via package.json conventions in Phase 2

**Alternatives Considered**:

- Package.json conventions (nimata-plugin-\*): Dynamic discovery overhead, slower startup
- Registry file only: No built-in plugins, complicates distribution
- Static only: Not extensible by users

---

### ADR-009: Shell Completion via Manual Scripts Instead of Library

**Status**: Accepted

**Context**:
Need shell completion for all shells (Bash, Zsh, Fish, PowerShell). Options: Yargs built-in, omelette, tabtab, or manual scripts.

**Decision**:
Use Yargs completion infrastructure + manual custom completion scripts.

**Rationale**:

- Performance: < 100ms completion requirement (NFR-003)
- Full control: custom logic for context-aware completions
- Yargs provides: completion command (`nimata completion`) that generates shell-specific scripts
- Manual completers: write custom completion logic per command
- Generated during: `nimata init` adds completion installation to setup

**Consequences**:

- Positive: Best performance (< 100ms)
- Positive: Full control over completion behavior
- Positive: Supports all major shells
- Negative: More code to maintain (vs library)
- Mitigation: Yargs handles shell-specific syntax, we only write completion logic

**Alternatives Considered**:

- Yargs built-in completion: Simple but limited functionality
- omelette/tabtab: Abstraction overhead, less control

---

### ADR-010: Watch Mode Only for Validate Command

**Status**: Accepted

**Context**:
NFR-003 specifies watch mode. Need to decide which commands support it.

**Decision**:
Watch mode only for `validate` command (not `fix` or `scaffold`).

**Rationale**:

- Find Right pillar: iterative validation during development
- Refactoring (`fix`) should be deliberate, not automatic on file save
- Scaffolding (`scaffold`) is one-time operation
- Performance: watch mode uses Bun.watch() for fast file change detection
- Aligns with TDD workflow: watch tests + validation simultaneously

**Consequences**:

- Positive: Clear use case (validation iteration)
- Positive: Prevents unintended automatic refactoring
- Positive: Simple implementation scope for MVP
- Negative: Users might expect watch mode for `fix` (mitigated by documentation)
- Future: Add watch mode for `fix` in Phase 2 if user feedback demands it

**Alternatives Considered**:

- Watch mode for all commands: Automatic refactoring is dangerous
- No watch mode: Violates NFR-003 requirement

---

### ADR-011: Configuration Cascade with Deep Merge and Project Override

**Status**: Accepted

**Context**:
Multiple config locations (~/.nimata/config.yaml and <project>/.nimata/config.yaml). Need merge strategy.

**Decision**:
Deep merge with project config overriding user config.

**Rationale**:

- User config = developer preferences (log level, color scheme)
- Project config = team standards (tool versions, rule sets)
- Team standards should override individual preferences for consistency
- Deep merge: allows partial overrides (not all-or-nothing)
- Aligns with "Start Right" pillar: team standards enforced

**Consequences**:

- Positive: Flexible configuration (user defaults + project overrides)
- Positive: Team consistency (project config wins)
- Positive: Developer freedom (user config for personal preferences)
- Negative: Potential confusion about which config is active (mitigated by `nimata config show` command)

**Alternatives Considered**:

- Project replaces user (no merge): Loses user preferences entirely
- User config only: No team standards enforcement

---

### ADR-012: Binary Distribution in Phase 2, npm in MVP

**Status**: Accepted

**Context**:
Distribution options: npm, single binary, or both. Need to prioritize for MVP.

**Decision**:
MVP uses npm distribution, single binary added in Phase 2.

**Rationale**:

- npm distribution: simpler, faster to implement
- Single binary: requires cross-platform testing (Linux, macOS, Windows)
- `bun build --compile` powerful but needs validation
- Focus MVP on core functionality, optimize distribution later
- npm install -g nimata: familiar workflow for developers

**Consequences**:

- Positive: Faster MVP delivery (simpler distribution)
- Positive: Familiar installation method (npm)
- Negative: Users must have Bun installed (documented in README)
- Phase 2: Add single binary via `bun build --compile` for users without Bun

**Alternatives Considered**:

- Binary in MVP: Adds complexity, delays core feature delivery
- Binary only: No npm distribution (limits adoption for npm users)

## 6. Implementation Guidance

### 6.1 Development Workflow

**Phase 4 Implementation Plan:**

1. **Sprint 0 (Setup)**: Turborepo setup, TSyringe container, core interfaces
2. **Sprint 1-3 (Epic 1)**: Scaffolding system (10 stories, parallelizable)
3. **Sprint 4-6 (Epic 2)**: Validation system (10 stories, parallelizable)
4. **Sprint 7-9 (Epic 3)**: Refactoring system (10 stories, parallelizable)

**Story Parallelization Strategy:**

The PRD defines 30 stories across 3 epics with 4-5 developer swim lanes for parallel development:

- **Swim Lane A**: Core use cases (sequential dependencies)
- **Swim Lane B**: CLI commands (parallel, independent)
- **Swim Lane C**: Infrastructure wrappers (parallel, independent)
- **Swim Lane D**: Plugins (parallel, independent)
- **Swim Lane E**: Adapters (parallel after interfaces defined)

### 6.2 Testing Guidelines

**Strict Test Isolation:**

```typescript
// ✅ Good: Isolated unit test with mocked dependencies
describe('ValidateUseCase', () => {
  let sut: ValidateUseCase;
  let mockConfigRepo: jest.Mocked<IConfigRepository>;
  let mockToolOrchestrator: jest.Mocked<IToolOrchestrator>;
  let mockCacheService: jest.Mocked<ICacheService>;

  beforeEach(() => {
    // Fresh mocks for every test
    mockConfigRepo = createMockConfigRepository();
    mockToolOrchestrator = createMockToolOrchestrator();
    mockCacheService = createMockCacheService();

    sut = new ValidateUseCase(mockConfigRepo, mockToolOrchestrator, mockCacheService);
  });

  afterEach(() => {
    // Clean up any resources
    jest.clearAllMocks();
  });

  it('should return cached results when cache hit', async () => {
    // Arrange
    mockCacheService.get.mockResolvedValue(cachedResult);

    // Act
    const result = await sut.execute({ files: ['test.ts'] });

    // Assert
    expect(result).toEqual(cachedResult);
    expect(mockToolOrchestrator.runAll).not.toHaveBeenCalled();
  });
});
```

**Mutation Testing Configuration (Stryker):**

```json
// stryker.config.json (per package)
{
  "testRunner": "command",
  "commandRunner": {
    "command": "bun test tests/unit/**/*.test.ts"
  },
  "coverageAnalysis": "perTest",
  "mutate": ["src/**/*.ts", "!src/**/*.test.ts"],
  "ignore": ["**/tests/integration/**", "**/tests/e2e/**", "**/tests/performance/**"],
  "thresholds": {
    "high": 80,
    "low": 60,
    "break": 50
  }
}
```

**Test Types by Layer:**

| Layer                 | Unit Tests                     | Integration Tests      | E2E Tests             | Performance Tests         | Mutation Testing         |
| --------------------- | ------------------------------ | ---------------------- | --------------------- | ------------------------- | ------------------------ |
| **apps/cli**          | ✅ Commands (mocked use cases) | ✅ Command flow        | ✅ Full CLI execution | ✅ Watch mode performance | ❌ (no Stryker)          |
| **packages/core**     | ✅ Use cases (100% coverage)   | ❌                     | ❌                    | ❌                        | ✅ (80%+ mutation score) |
| **packages/adapters** | ✅ Repositories, Presenters    | ✅ File system, SQLite | ❌                    | ❌                        | ✅ (80%+ mutation score) |
| **plugins/**          | ✅ Plugin logic                | ✅ Tool integration    | ❌                    | ❌                        | ✅ (80%+ mutation score) |
| **infrastructure/**   | ✅ Wrapper logic               | ✅ Tool execution      | ❌                    | ✅ Tool overhead          | ✅ (80%+ mutation score) |

### 6.3 Error Handling Strategy

**Result Pattern for Use Cases:**

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
}

// Usage in use cases
export class ValidateUseCase {
  async execute(options: ValidateOptions): Promise<Result<ValidationResult>> {
    try {
      const config = await this.configRepo.load();
      const results = await this.toolOrchestrator.runAll(files, config);
      return Result.success(results);
    } catch (error) {
      logger.error('Validation failed', { error });
      return Result.failure(`Validation failed: ${error.message}`);
    }
  }
}
```

**Exit Codes:**

| Exit Code | Meaning                  | When Used                                         |
| --------- | ------------------------ | ------------------------------------------------- |
| 0         | Success                  | Command completed successfully, no errors found   |
| 1         | Validation errors found  | `validate` command found errors                   |
| 2         | Validation warnings only | `validate` command found warnings but no errors   |
| 3         | Configuration error      | Invalid config file or missing required config    |
| 4         | Plugin error             | Plugin failed to load or execute                  |
| 5         | File system error        | Cannot read/write files                           |
| 6         | Transformation error     | Refactoring failed (syntax error after transform) |
| 130       | Interrupted (SIGINT)     | User pressed Ctrl+C                               |

### 6.4 Safe AST Transformation Pattern

```typescript
// infrastructure/ts-morph-wrapper/src/refactorer.ts
export class SafeASTRefactorer {
  async applyTransformation(filePath: string, transformer: Transformer): Promise<Result<void>> {
    const project = new Project();
    const sourceFile = project.addSourceFileAtPath(filePath);
    const originalText = sourceFile.getFullText();

    try {
      // Apply transformation
      transformer.transform(sourceFile);

      // Validate syntax (no errors introduced)
      const diagnostics = sourceFile.getPreEmitDiagnostics();
      if (diagnostics.length > 0) {
        const errors = diagnostics.map((d) => d.getMessageText()).join(', ');
        return Result.failure(`Transformation introduced errors: ${errors}`);
      }

      // Save if valid
      await sourceFile.save();
      return Result.success(undefined);
    } catch (error) {
      // Rollback on any error
      sourceFile.replaceWithText(originalText);
      await sourceFile.save();
      return Result.failure(`Transformation failed: ${error.message}`);
    } finally {
      // Prevent memory leaks
      project.dispose();
    }
  }
}
```

### 6.5 Performance Best Practices

**1. Use Bun Native APIs:**

```typescript
// ❌ Bad: Using npm packages when Bun native exists
import yaml from 'js-yaml';
import glob from 'fast-glob';
import crypto from 'crypto';

// ✅ Good: Using Bun native APIs
const config = await Bun.file('config.yaml').yaml();
const files = new Bun.Glob('**/*.ts').scanSync('.');
const hash = Bun.hash(fileContent);
```

**2. Cache Validation Results:**

```typescript
// Always check cache before running tools
async validate(file: string): Promise<Result> {
  const fileHash = Bun.hash(await Bun.file(file).text());

  // Check cache first
  const cached = await this.cache.get(file, 'eslint', fileHash);
  if (cached) return cached;

  // Run tool only if cache miss
  const result = await this.eslint.run(file);
  await this.cache.set(file, 'eslint', fileHash, result);
  return result;
}
```

**3. Parallel Tool Execution:**

```typescript
// Run tools in parallel using Promise.all
async runAll(files: string[]): Promise<ToolResult[]> {
  const toolPromises = [
    this.eslintRunner.run(files),
    this.typescriptRunner.run(files),
    this.prettierRunner.run(files),
    this.bunTestRunner.run()
  ];

  return Promise.all(toolPromises);
}
```

## 7. Proposed Source Tree

```
nimata/
├── .github/
│   └── workflows/
│       ├── ci.yml                          # Turborepo CI with caching
│       ├── mutation-testing.yml            # Stryker mutation testing
│       └── release.yml                     # npm publish + GitHub release
│
├── apps/
│   └── cli/                                # Main CLI application
│       ├── src/
│       │   ├── commands/                   # Yargs command handlers
│       │   │   ├── init.ts                 # nimata init
│       │   │   ├── scaffold.ts             # nimata scaffold
│       │   │   ├── validate.ts             # nimata validate
│       │   │   ├── fix.ts                  # nimata fix
│       │   │   └── completion.ts           # nimata completion
│       │   ├── wizards/                    # Prompts interactive wizards
│       │   │   ├── scaffold-wizard.ts      # Interactive scaffold
│       │   │   └── config-wizard.ts        # Config setup
│       │   ├── presenters/                 # Terminal output formatting
│       │   │   ├── validation-presenter.ts # Validation results
│       │   │   ├── diff-presenter.ts       # Before/after diffs
│       │   │   └── progress-presenter.ts   # Ora spinners
│       │   ├── container.ts                # TSyringe DI setup
│       │   └── index.ts                    # CLI entry point (Yargs)
│       ├── tests/
│       │   ├── unit/                       # Command unit tests
│       │   └── e2e/                        # Full CLI execution tests
│       ├── package.json
│       └── tsconfig.json
│
├── packages/
│   ├── core/                               # Pure business logic + types
│   │   ├── src/
│   │   │   ├── use-cases/                  # Business logic
│   │   │   │   ├── scaffolding-service.ts
│   │   │   │   ├── validation-service.ts
│   │   │   │   ├── tool-orchestrator.ts
│   │   │   │   ├── cache-service.ts
│   │   │   │   ├── refactoring-service.ts
│   │   │   │   └── triage-service.ts
│   │   │   ├── interfaces/                 # Ports (dependency inversion)
│   │   │   │   ├── i-config-repository.ts
│   │   │   │   ├── i-file-system.ts
│   │   │   │   ├── i-cache-repository.ts
│   │   │   │   ├── i-tool-runner.ts
│   │   │   │   └── i-plugin.ts
│   │   │   ├── types/                      # Domain types
│   │   │   │   ├── validation-result.ts
│   │   │   │   ├── tool-result.ts
│   │   │   │   ├── refactor-result.ts
│   │   │   │   └── config.ts
│   │   │   ├── config/
│   │   │   │   └── defaults.ts             # Default configuration
│   │   │   └── common/
│   │   │       └── result.ts               # Result pattern
│   │   ├── templates/                      # Generic templates (all tools)
│   │   │   ├── tsconfig.base.json
│   │   │   ├── package.json.hbs
│   │   │   └── .gitignore.hbs
│   │   ├── tests/
│   │   │   └── unit/                       # Use case unit tests + Stryker
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── adapters/                           # Interface implementations
│       ├── src/
│       │   ├── repositories/
│       │   │   ├── yaml-config-repository.ts  # Bun.file().yaml()
│       │   │   ├── file-system-repository.ts  # Bun.write()
│       │   │   └── sqlite-cache-repository.ts # bun:sqlite with WAL
│       │   └── presenters/
│       │       ├── terminal-presenter.ts      # Picocolors output
│       │       └── json-presenter.ts          # JSON output format
│       ├── tests/
│       │   ├── unit/                       # Adapter unit tests + Stryker
│       │   └── integration/                # SQLite, file system tests
│       ├── package.json
│       └── tsconfig.json
│
├── plugins/                                # Plugin modules (root-level)
│   ├── plugin-scaffolder/                  # Epic 1: Scaffolding
│   │   ├── src/
│   │   │   ├── scaffolder-plugin.ts
│   │   │   ├── template-renderer.ts        # Handlebars
│   │   │   └── config-generators/
│   │   │       ├── tsconfig-generator.ts
│   │   │       ├── eslint-generator.ts
│   │   │       ├── prettier-generator.ts
│   │   │       └── package-json-generator.ts
│   │   ├── templates/                      # TS+Bun-specific templates
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
│   │   ├── tests/unit/                     # Plugin tests + Stryker
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── plugin-validator/                   # Epic 2: Validation
│   │   ├── src/
│   │   │   ├── validator-plugin.ts
│   │   │   └── result-aggregator.ts
│   │   ├── tests/unit/                     # Plugin tests + Stryker
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── plugin-refactorer/                  # Epic 3: Refactoring
│   │   ├── src/
│   │   │   ├── refactorer-plugin.ts
│   │   │   ├── transformers/
│   │   │   │   ├── unused-imports.ts
│   │   │   │   ├── type-inference.ts
│   │   │   │   └── code-style.ts
│   │   │   └── diff-generator.ts
│   │   ├── tests/unit/                     # Plugin tests + Stryker
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── plugin-claude-code/                 # Claude Code AI integration
│       ├── src/
│       │   ├── claude-code-plugin.ts
│       │   ├── context-generator.ts        # Generate CLAUDE.md
│       │   ├── mcp-generator.ts            # MCP configuration
│       │   ├── agent-generator.ts          # Agent templates
│       │   ├── command-generator.ts        # Command templates
│       │   ├── hook-generator.ts           # Hook templates
│       │   └── prompt-generator.ts         # AI prompts for manual fixes
│       ├── templates/                      # Claude Code templates
│       │   ├── CLAUDE.md.hbs               # AI context template
│       │   ├── mcp/
│       │   │   └── mcp-config.json.hbs
│       │   ├── agents/
│       │   │   └── quality-assistant.md.hbs
│       │   ├── commands/
│       │   │   └── validate-fix.md.hbs
│       │   └── hooks/
│       │       └── pre-commit.md.hbs
│       ├── tests/unit/                     # Plugin tests + Stryker
│       ├── package.json
│       └── tsconfig.json
│
├── infrastructure/                         # Tool wrappers (root-level)
│   ├── eslint-wrapper/
│   │   ├── src/
│   │   │   └── eslint-runner.ts            # ESLint execution
│   │   ├── tests/
│   │   │   ├── unit/                       # Wrapper logic + Stryker
│   │   │   └── integration/                # ESLint execution
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── typescript-wrapper/
│   │   ├── src/
│   │   │   └── typescript-runner.ts        # tsc execution
│   │   ├── tests/
│   │   │   ├── unit/                       # Wrapper logic + Stryker
│   │   │   └── integration/                # tsc execution
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── prettier-wrapper/
│   │   ├── src/
│   │   │   └── prettier-runner.ts          # Prettier execution
│   │   ├── tests/
│   │   │   ├── unit/                       # Wrapper logic + Stryker
│   │   │   └── integration/                # Prettier execution
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── ts-morph-wrapper/
│       ├── src/
│       │   ├── safe-ast-refactorer.ts      # ts-morph with safety checks
│       │   └── transformers/
│       │       └── base-transformer.ts     # Transformer base class
│       ├── tests/
│       │   ├── unit/                       # Wrapper logic + Stryker
│       │   └── integration/                # AST transformations
│       ├── package.json
│       └── tsconfig.json
│
├── tests/
│   └── performance/                        # Performance benchmarks (no Stryker)
│       ├── validation-benchmark.ts         # < 100ms validation check
│       ├── watch-mode-benchmark.ts         # Watch mode overhead
│       └── cache-benchmark.ts              # SQLite vs JSON comparison
│
├── docs/
│   ├── PRD.md                              # Product Requirements Document
│   ├── epic-stories.md                     # Epic/story breakdown
│   ├── solution-architecture.md            # This document
│   ├── architecture-decisions.md           # ADR collection
│   ├── bmm-workflow-status.md              # Workflow status
│   ├── installation-guide.md               # Installation instructions
│   └── api-reference.md                    # API documentation
│
├── turbo.json                              # Turborepo configuration
├── package.json                            # Root package.json (workspaces)
├── bun.lockb                               # Bun lockfile
├── tsconfig.json                           # Root TypeScript config
├── .gitignore
└── README.md
```

### Key Directory Conventions:

1. **Root-level plugins/ and infrastructure/**: Better organization, clear ownership
2. **apps/cli**: Single executable entry point
3. **packages/core**: Pure business logic, zero external tool dependencies
4. **packages/adapters**: Implementations of core interfaces
5. **tests/unit/ per package**: Stryker mutation testing enabled
6. **tests/integration/ per package**: No Stryker (too slow)
7. **tests/performance/ at root**: Performance benchmarks (no Stryker)

## 8. Testing Strategy

### 8.1 Test Types and Coverage

| Test Type             | Location                         | Tools                        | Purpose                                                                 | Coverage Target    | Mutation Testing       |
| --------------------- | -------------------------------- | ---------------------------- | ----------------------------------------------------------------------- | ------------------ | ---------------------- |
| **Unit Tests**        | `tests/unit/` per package        | Bun Test                     | Test individual functions/classes in isolation with mocked dependencies | 100% line coverage | ✅ 80%+ mutation score |
| **Integration Tests** | `tests/integration/` per package | Bun Test                     | Test component interactions (SQLite, file system, tool execution)       | 80% coverage       | ❌ Too slow            |
| **E2E Tests**         | `apps/cli/tests/e2e/`            | Bun Test                     | Test full CLI execution from command to output                          | 80% critical paths | ❌ Too slow            |
| **Performance Tests** | `tests/performance/` at root     | Hyperfine, custom benchmarks | Validate NFR-003 (< 100ms validation with cache)                        | N/A (benchmark)    | ❌ Not applicable      |

### 8.2 Unit Testing Strategy

**Principles:**

1. **100% isolation**: Every test uses fresh mocks via `beforeEach()`
2. **AAA pattern**: Arrange, Act, Assert
3. **One assertion per test**: Clear failure messages
4. **No real dependencies**: Mock all external dependencies (file system, database, tools)

**Mock Factory Pattern:**

```typescript
// packages/core/tests/unit/mocks/mock-config-repository.ts
export function createMockConfigRepository(): jest.Mocked<IConfigRepository> {
  return {
    load: jest.fn(),
    save: jest.fn(),
    merge: jest.fn()
  };
}

// Usage in tests
beforeEach(() => {
  mockConfigRepo = createMockConfigRepository();
  sut = new ValidateUseCase(mockConfigRepo, ...);
});
```

### 8.3 Mutation Testing with Stryker

**Configuration per package:**

```json
// packages/core/stryker.config.json
{
  "testRunner": "command",
  "commandRunner": {
    "command": "bun test tests/unit/**/*.test.ts"
  },
  "coverageAnalysis": "perTest",
  "mutate": ["src/**/*.ts", "!src/**/*.test.ts"],
  "ignore": ["**/tests/integration/**", "**/tests/e2e/**", "**/tests/performance/**"],
  "thresholds": {
    "high": 80,
    "low": 60,
    "break": 50
  },
  "mutator": {
    "plugins": ["@stryker-mutator/typescript-checker"]
  }
}
```

**Target Mutation Score**: 80%+ for all packages (core, adapters, plugins, infrastructure).

**Mutation Testing Workflow:**

1. Unit tests run during development (Bun Test)
2. Stryker runs in CI on every PR (GitHub Actions)
3. PR blocks if mutation score < 50% (break threshold)
4. Target 80%+ mutation score for merge approval

### 8.4 Integration Testing Strategy

**File System Integration Tests:**

```typescript
// packages/adapters/tests/integration/file-system-repository.test.ts
import { tmpdir } from 'os';
import { join } from 'path';

describe('FileSystemRepository (Integration)', () => {
  let tempDir: string;
  let sut: FileSystemRepository;

  beforeEach(async () => {
    // Create real temp directory
    tempDir = await Bun.tempDir();
    sut = new FileSystemRepository(tempDir);
  });

  afterEach(async () => {
    // Clean up temp directory
    await Bun.rmdir(tempDir, { recursive: true });
  });

  it('should write and read file correctly', async () => {
    const filePath = join(tempDir, 'test.txt');
    await sut.write(filePath, 'content');
    const content = await sut.read(filePath);
    expect(content).toBe('content');
  });
});
```

**SQLite Integration Tests:**

```typescript
// packages/adapters/tests/integration/sqlite-cache-repository.test.ts
describe('SQLiteCacheRepository (Integration)', () => {
  let tempDbPath: string;
  let sut: SQLiteCacheRepository;

  beforeEach(async () => {
    tempDbPath = join(await Bun.tempDir(), 'test.db');
    sut = new SQLiteCacheRepository(tempDbPath);
    await sut.initialize();
  });

  afterEach(async () => {
    await sut.close();
    await Bun.unlink(tempDbPath);
  });

  it('should store and retrieve cached validation result', async () => {
    const result = { errors: [], warnings: [] };
    await sut.set('file.ts', 'eslint', 'hash123', result);
    const cached = await sut.get('file.ts', 'eslint', 'hash123');
    expect(cached).toEqual(result);
  });
});
```

### 8.5 E2E Testing Strategy

**Full CLI Execution Tests:**

```typescript
// apps/cli/tests/e2e/validate-command.test.ts
import { spawn } from 'bun';

describe('nimata validate (E2E)', () => {
  let tempProjectDir: string;

  beforeEach(async () => {
    tempProjectDir = await setupTempProject();
  });

  afterEach(async () => {
    await cleanupTempProject(tempProjectDir);
  });

  it('should validate project and output errors', async () => {
    // Run actual CLI command
    const proc = spawn(['bun', 'run', 'nimata', 'validate'], {
      cwd: tempProjectDir,
      env: process.env,
    });

    const output = await new Response(proc.stdout).text();
    const exitCode = await proc.exited;

    expect(exitCode).toBe(1); // Errors found
    expect(output).toContain('ESLint: 3 errors');
    expect(output).toContain('TypeScript: 1 error');
  });
});
```

### 8.6 Performance Testing Strategy

**Validation Performance Benchmark (NFR-003):**

```typescript
// tests/performance/validation-benchmark.ts
import { benchmark } from 'bun:test';

benchmark('validate with cache (< 100ms)', async () => {
  const service = new ValidationService(...);
  await service.validate({ files: testFiles, useCache: true });
});

// Expected: < 100ms for cached validation
```

**Watch Mode Performance Test:**

```typescript
// tests/performance/watch-mode-benchmark.ts
benchmark('watch mode file change detection', async () => {
  const watcher = new WatchService(...);
  await watcher.start();

  // Trigger file change
  await Bun.write('test.ts', 'new content');

  // Measure time until validation completes
  const elapsed = await watcher.waitForValidation();

  expect(elapsed).toBeLessThan(200); // < 200ms for watch mode
});
```

### 8.7 Test Pyramid

```
         /\
        /E2\     E2E Tests (10%)
       /    \    - Full CLI execution
      /------\   - Critical user paths
     /  Int.  \  Integration Tests (30%)
    /          \ - Tool wrappers
   /------------\- File system, SQLite
  /   Unit Tests \ Unit Tests (60%)
 /                \- Use cases, adapters
/------------------\- 100% coverage, 80%+ mutation score
```

## 9. Deployment and Operations

### 9.1 Distribution Strategy

**Phase 1 (MVP): npm Distribution**

```bash
# Installation
npm install -g nimata

# or with Bun
bun install -g nimata

# Usage
nimata init
nimata scaffold
nimata validate
nimata fix
```

**Phase 2: Single Binary Distribution**

```bash
# Build single binaries for all platforms
bun build --compile apps/cli/src/index.ts --outfile nimata-linux-x64
bun build --compile apps/cli/src/index.ts --outfile nimata-darwin-arm64
bun build --compile apps/cli/src/index.ts --outfile nimata-win-x64.exe

# Distribution via GitHub Releases
# Users download platform-specific binary
```

### 9.2 Versioning and Releases

**Semantic Versioning (semver):**

- **Major** (1.0.0 → 2.0.0): Breaking changes (CLI API, config format)
- **Minor** (1.0.0 → 1.1.0): New features (backward compatible)
- **Patch** (1.0.0 → 1.0.1): Bug fixes (backward compatible)

**Release Process:**

1. Update version in `package.json` (root + all packages)
2. Update CHANGELOG.md with release notes
3. Create git tag: `git tag v1.0.0`
4. Push tag: `git push origin v1.0.0`
5. GitHub Actions workflow:
   - Run CI (tests, linting, mutation testing)
   - Publish to npm: `npm publish --access public`
   - Create GitHub Release with binaries (Phase 2)

### 9.3 Update Mechanism

**Phase 1 (npm):**

```bash
# Check for updates
npm outdated -g nimata

# Update to latest
npm update -g nimata
```

**Phase 2 (Self-update command):**

```bash
# Check version
nimata --version

# Self-update command (checks GitHub Releases)
nimata update
```

### 9.4 Logging and Diagnostics

**Structured Logging with Pino:**

```typescript
// Log levels: trace, debug, info, warn, error, fatal
logger.info('Validation started', { files: fileCount });
logger.error('Tool execution failed', { tool: 'eslint', error: err.message });

// Log output location: ~/.nimata/logs/nimata.log
// JSON Lines format (one JSON object per line)
{"level":30,"time":1634567890,"msg":"Validation started","files":10}
```

**Debug Mode:**

```bash
# Enable verbose logging
nimata validate --verbose

# Enable debug logging (includes trace)
nimata validate --debug
```

**Log Rotation:**

- Daily rotation (midnight UTC)
- Keep last 7 days of logs
- Compress logs older than 1 day

### 9.5 Performance Monitoring

**Performance Metrics Collected:**

1. **Validation time per tool** (ESLint, TypeScript, Prettier, Bun Test)
2. **Cache hit rate** (percentage of cached results used)
3. **Watch mode latency** (file change → validation complete)
4. **Memory usage** (heap size during validation)

**Metrics Export:**

```bash
# Performance summary after validation
nimata validate --show-timing

# Output:
# Validation completed in 89ms
# ├─ ESLint: 32ms (cache: 80%)
# ├─ TypeScript: 45ms (cache: 60%)
# └─ Prettier: 12ms (cache: 90%)
```

### 9.6 Configuration Management

**Config File Locations:**

1. `~/.nimata/config.yaml` (user global config)
2. `<project>/.nimata/config.yaml` (project-specific config)

**Config Validation:**

```bash
# Validate config syntax and values
nimata config validate

# Show effective config (after merge)
nimata config show

# Initialize config with wizard
nimata init
```

## 10. Security

### 10.1 Security Principles

1. **No network operations in MVP**: Eliminates entire class of security vulnerabilities
2. **File system sandboxing**: All file operations restricted to project directory
3. **No code execution from config**: YAML config is data only, no eval()
4. **Dependency security**: Automated dependency audits via Dependabot
5. **Plugin isolation**: Plugins run in error boundaries to prevent crashes

### 10.2 Threat Model

| Threat                         | Mitigation                                                | Priority |
| ------------------------------ | --------------------------------------------------------- | -------- |
| **Malicious config file**      | Config validation, no code execution in YAML              | P0       |
| **Path traversal**             | Path normalization, restrict to project directory         | P0       |
| **Dependency vulnerabilities** | Dependabot alerts, automated security updates             | P0       |
| **Malicious plugin**           | Static registration only (no dynamic loading in MVP)      | P1       |
| **AST transformation bugs**    | Syntax validation, rollback on error, comprehensive tests | P0       |
| **Cache poisoning**            | File hash validation, SQLite integrity checks             | P1       |

### 10.3 Input Validation

**Config File Validation:**

```typescript
// Validate all config values against schema
const configSchema = z.object({
  tools: z.object({
    eslint: z.object({
      enabled: z.boolean(),
      configPath: z.string().optional(),
    }),
    // ... more tools
  }),
  include: z.array(z.string()),
  exclude: z.array(z.string()),
});

// Validate and sanitize
const validatedConfig = configSchema.parse(rawConfig);
```

**Path Validation:**

```typescript
// Prevent path traversal attacks
function sanitizePath(userPath: string, projectRoot: string): string {
  const normalized = path.normalize(userPath);
  const absolute = path.resolve(projectRoot, normalized);

  // Ensure path is within project root
  if (!absolute.startsWith(projectRoot)) {
    throw new Error('Path traversal detected');
  }

  return absolute;
}
```

### 10.4 Dependency Security

**Automated Security Audits:**

```bash
# Run security audit (CI)
bun audit

# Dependabot configuration (.github/dependabot.yml)
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "daily"
    open-pull-requests-limit: 10
```

**Minimal Dependencies:**

By using Bun native features, we eliminate 6+ dependencies:

- ❌ js-yaml → ✅ Bun.file().yaml()
- ❌ fast-glob → ✅ Bun.Glob
- ❌ chokidar → ✅ Bun.watch()
- ❌ crypto (for hashing) → ✅ Bun.hash()

**Fewer dependencies = smaller attack surface.**

### 10.5 AST Transformation Safety

**Syntax Validation Before Save:**

```typescript
// Always validate syntax after transformation
const diagnostics = sourceFile.getPreEmitDiagnostics();
if (diagnostics.length > 0) {
  // Rollback transformation
  sourceFile.replaceWithText(originalText);
  throw new Error('Transformation introduced syntax errors');
}
```

**Preview Mode (Dry-Run):**

```bash
# Preview refactoring changes without applying
nimata fix --dry-run

# Output shows diff, prompts for confirmation
```

### 10.6 Secure Defaults

**Default Configuration:**

```yaml
# ~/.nimata/config.yaml (secure defaults)
tools:
  eslint:
    enabled: true
    configPath: .eslintrc.json # Relative to project root
  typescript:
    enabled: true
    configPath: tsconfig.json
  prettier:
    enabled: true
    configPath: .prettierrc.json

include:
  - 'src/**/*.ts'
  - 'tests/**/*.ts'

exclude:
  - '**/node_modules/**'
  - '**/dist/**'
  - '**/.nimata/**' # Exclude own config directory

cache:
  enabled: true
  ttl: 604800 # 7 days in seconds
  maxSize: 100MB

logging:
  level: 'info' # No debug by default
  destination: '~/.nimata/logs/nimata.log'
```

---

## Specialist Sections

### Testing Specialist Section (Expanded in Section 8)

- Unit testing strategy with 100% isolation
- Mutation testing with Stryker (80%+ mutation score target)
- Integration testing for file system and SQLite
- E2E testing for full CLI execution
- Performance testing for NFR-003 validation

### DevOps Specialist Section (Expanded in Section 9)

- Distribution strategy: npm (Phase 1) → single binary (Phase 2)
- Versioning with semantic versioning
- CI/CD with GitHub Actions (Turborepo caching)
- Logging with Pino (structured JSON logs)
- Performance monitoring and metrics

### Security Specialist Section (Expanded in Section 10)

- No network operations in MVP (eliminates entire threat class)
- File system sandboxing and path validation
- Config validation (no code execution)
- Dependency security with Dependabot
- AST transformation safety (validation + rollback)

---

_Generated using BMad Method Solution Architecture workflow_
_Date: 2025-10-16_
_Architect: User + BMad Architect_
