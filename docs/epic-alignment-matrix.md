# Epic Alignment Matrix

**Project:** Nìmata
**Date:** 2025-10-16
**Purpose:** Maps epics and stories to architectural components for implementation planning

---

## Overview

This document provides the complete mapping between PRD epics/stories and architectural components from the solution architecture. Use this matrix for:

- **Sprint planning**: Identify which components to implement per story
- **Dependency tracking**: Understand component dependencies
- **Parallel development**: Identify swim lanes for concurrent work
- **Story readiness**: Validate all stories have clear component ownership

---

## Epic 1: Start Right - Quality-First Scaffolding (10 Stories)

### Component Summary

| Component | Package | Layer | Primary Responsibility | Stories Supported |
|-----------|---------|-------|----------------------|-------------------|
| **ScaffoldingService** | packages/core | Use Case | Orchestrates project structure generation | 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7 |
| **TemplateRenderer** | packages/adapters | Adapter | Processes Handlebars templates | 1.1, 1.2, 1.3, 1.4, 1.5, 1.6 |
| **FileSystemRepository** | packages/adapters | Adapter | File I/O via Bun.write() | 1.1-1.10 (all) |
| **ScaffolderPlugin** | plugins/plugin-scaffolder | Plugin | Tool-specific config generation | 1.1, 1.2, 1.3, 1.4, 1.5, 1.6 |
| **ClaudeCodePlugin** | plugins/plugin-claude-code | Plugin | AI context generation (CLAUDE.md, MCP, agents, commands, hooks) | 1.7, 1.8, 1.9, 1.10 |
| **ScaffoldCommand** | apps/cli/commands | CLI | `nimata scaffold` command handler | 1.1-1.10 (all) |
| **ScaffoldWizard** | apps/cli/wizards | CLI | Interactive prompts for scaffolding | 1.1, 1.2, 1.7 |

### Story-to-Component Mapping

| Story ID | Story Title | Primary Components | Dependencies | Swim Lane |
|----------|-------------|-------------------|--------------|-----------|
| **1.1** | Generate TypeScript project structure | ScaffoldingService, FileSystemRepository | None | A (Core) |
| **1.2** | Generate TypeScript strict config | ScaffolderPlugin (TSConfigGenerator) | FileSystemRepository | C (Plugins) |
| **1.3** | Generate ESLint config | ScaffolderPlugin (ESLintGenerator) | FileSystemRepository | C (Plugins) |
| **1.4** | Generate Prettier config | ScaffolderPlugin (PrettierGenerator) | FileSystemRepository | C (Plugins) |
| **1.5** | Generate Bun Test config | ScaffolderPlugin (BunConfigGenerator) | FileSystemRepository | C (Plugins) |
| **1.6** | Generate package.json | ScaffolderPlugin (PackageJsonGenerator) | FileSystemRepository | C (Plugins) |
| **1.7** | Generate CLAUDE.md AI context | ClaudeCodePlugin (ContextGenerator) | FileSystemRepository | D (AI Plugin) |
| **1.8** | Generate MCP configuration | ClaudeCodePlugin (MCPGenerator) | FileSystemRepository | D (AI Plugin) |
| **1.9** | Generate agent templates | ClaudeCodePlugin (AgentGenerator) | FileSystemRepository | D (AI Plugin) |
| **1.10** | Generate command and hook templates | ClaudeCodePlugin (CommandGenerator, HookGenerator) | FileSystemRepository | D (AI Plugin) |

### Parallelization Strategy

**Swim Lanes (4-5 developers):**

- **Swim Lane A (Core)**: ScaffoldingService + interfaces (1 developer, sequential)
- **Swim Lane B (CLI)**: ScaffoldCommand + ScaffoldWizard (1 developer, parallel with C/D)
- **Swim Lane C (Plugins)**: ScaffolderPlugin + generators (2 developers, parallel - stories 1.2-1.6 independent)
- **Swim Lane D (AI Plugin)**: ClaudeCodePlugin + generators (1 developer, parallel - stories 1.7-1.10 independent)

**Dependencies:**
- Swim Lane A must complete interfaces before B/C/D start
- Swim Lanes B, C, D can work in parallel after interfaces defined

---

## Epic 2: Find Right - Unified Quality Validation (10 Stories)

### Component Summary

| Component | Package | Layer | Primary Responsibility | Stories Supported |
|-----------|---------|-------|----------------------|-------------------|
| **ValidationService** | packages/core | Use Case | Orchestrates unified validation | 2.1, 2.2, 2.3, 2.4, 2.5, 2.9, 2.10 |
| **ToolOrchestrator** | packages/core | Use Case | Parallel tool execution | 2.1, 2.2, 2.3, 2.4, 2.5 |
| **CacheService** | packages/core | Use Case | Intelligent caching with SQLite | 2.6 |
| **ESLintRunner** | infrastructure/eslint-wrapper | Infrastructure | ESLint execution wrapper | 2.1 |
| **TypeScriptRunner** | infrastructure/typescript-wrapper | Infrastructure | TypeScript compiler wrapper | 2.2 |
| **PrettierRunner** | infrastructure/prettier-wrapper | Infrastructure | Prettier execution wrapper | 2.3 |
| **BunTestRunner** | infrastructure/bun-test-wrapper | Infrastructure | Bun Test execution wrapper | 2.4 |
| **StrykerRunner** | infrastructure/stryker-wrapper | Infrastructure | Stryker mutation testing wrapper | 2.5 |
| **CacheRepository** | packages/adapters | Adapter | SQLite cache with WAL mode | 2.6 |
| **ValidationPresenter** | packages/adapters | Adapter | Terminal output formatting | 2.7, 2.8 |
| **ValidateCommand** | apps/cli/commands | CLI | `nimata validate` command handler | 2.1-2.10 (all) |
| **WatchService** | apps/cli/services | CLI | File watching with Bun.watch() | 2.9 |

### Story-to-Component Mapping

| Story ID | Story Title | Primary Components | Dependencies | Swim Lane |
|----------|-------------|-------------------|--------------|-----------|
| **2.1** | ESLint validation | ESLintRunner, ValidationService | IToolRunner interface | C (Infrastructure) |
| **2.2** | TypeScript validation | TypeScriptRunner, ValidationService | IToolRunner interface | C (Infrastructure) |
| **2.3** | Prettier validation | PrettierRunner, ValidationService | IToolRunner interface | C (Infrastructure) |
| **2.4** | Bun Test execution | BunTestRunner, ValidationService | IToolRunner interface | C (Infrastructure) |
| **2.5** | Stryker mutation testing | StrykerRunner, ValidationService | IToolRunner interface | C (Infrastructure) |
| **2.6** | Intelligent caching with SQLite | CacheService, CacheRepository | ICacheRepository interface | E (Adapters) |
| **2.7** | Terminal output formatting | ValidationPresenter | Picocolors, Ora | E (Adapters) |
| **2.8** | JSON output format | ValidationPresenter | JSON serialization | E (Adapters) |
| **2.9** | Watch mode for validation | WatchService, ValidateCommand | Bun.watch() | B (CLI) |
| **2.10** | Unified validate command | ValidateCommand, ValidationService, ToolOrchestrator | All above | A (Core) |

### Parallelization Strategy

**Swim Lanes (4-5 developers):**

- **Swim Lane A (Core)**: ValidationService + ToolOrchestrator + interfaces (1 developer, sequential)
- **Swim Lane B (CLI)**: ValidateCommand + WatchService (1 developer, parallel with C/E)
- **Swim Lane C (Infrastructure)**: 5 tool wrappers (2 developers, parallel - stories 2.1-2.5 independent)
- **Swim Lane E (Adapters)**: CacheRepository + ValidationPresenter (1 developer, parallel)

**Dependencies:**
- Swim Lane A must complete interfaces before B/C/E start
- Swim Lanes B, C, E can work in parallel after interfaces defined
- Stories 2.1-2.5 (tool wrappers) are 100% independent and parallelizable

---

## Epic 3: Fix Right - Intelligent Refactoring & Triage (10 Stories)

### Component Summary

| Component | Package | Layer | Primary Responsibility | Stories Supported |
|-----------|---------|-------|----------------------|-------------------|
| **RefactoringService** | packages/core | Use Case | Orchestrates AST transformations | 3.1, 3.2, 3.3, 3.4, 3.5, 3.8 |
| **TriageService** | packages/core | Use Case | Issue categorization (auto-fix vs manual) | 3.6 |
| **ASTRefactorer** | infrastructure/ts-morph-wrapper | Infrastructure | Safe AST transformations with ts-morph | 3.1, 3.2, 3.3, 3.4, 3.5 |
| **UnusedImportsTransformer** | infrastructure/ts-morph-wrapper/transformers | Infrastructure | Remove unused imports | 3.1 |
| **TypeInferenceTransformer** | infrastructure/ts-morph-wrapper/transformers | Infrastructure | Infer explicit types | 3.2 |
| **CodeStyleTransformer** | infrastructure/ts-morph-wrapper/transformers | Infrastructure | Apply code style fixes | 3.3 |
| **AIPromptGenerator** | plugins/plugin-claude-code | Plugin | Generate Claude Code prompts for manual fixes | 3.7 |
| **DiffPresenter** | packages/adapters | Adapter | Show before/after diffs | 3.8, 3.9 |
| **FixCommand** | apps/cli/commands | CLI | `nimata fix` command handler | 3.1-3.10 (all) |
| **RefactorWizard** | apps/cli/wizards | CLI | Interactive preview before apply | 3.8 |

### Story-to-Component Mapping

| Story ID | Story Title | Primary Components | Dependencies | Swim Lane |
|----------|-------------|-------------------|--------------|-----------|
| **3.1** | Remove unused imports | UnusedImportsTransformer, ASTRefactorer | IASTRefactorer interface | C (Transformers) |
| **3.2** | Infer explicit types | TypeInferenceTransformer, ASTRefactorer | IASTRefactorer interface | C (Transformers) |
| **3.3** | Apply code style fixes | CodeStyleTransformer, ASTRefactorer | IASTRefactorer interface | C (Transformers) |
| **3.4** | Safe AST transformation | ASTRefactorer (base class) | ts-morph library | C (Transformers) |
| **3.5** | Rollback on error | ASTRefactorer (error handling) | ts-morph library | C (Transformers) |
| **3.6** | Triage issues (auto vs manual) | TriageService | IClassifier interface | A (Core) |
| **3.7** | Generate AI prompts for manual fixes | AIPromptGenerator (ClaudeCodePlugin) | Claude Code prompt templates | D (AI Plugin) |
| **3.8** | Preview refactoring changes | DiffPresenter, RefactorWizard | Picocolors, diff library | E (Adapters) |
| **3.9** | Diff output with syntax highlighting | DiffPresenter | Picocolors | E (Adapters) |
| **3.10** | Unified fix command | FixCommand, RefactoringService, TriageService | All above | B (CLI) |

### Parallelization Strategy

**Swim Lanes (4-5 developers):**

- **Swim Lane A (Core)**: RefactoringService + TriageService + interfaces (1 developer, sequential)
- **Swim Lane B (CLI)**: FixCommand + RefactorWizard (1 developer, parallel with C/D/E)
- **Swim Lane C (Transformers)**: 3 transformers + ASTRefactorer base (2 developers, parallel - stories 3.1-3.5 semi-independent)
- **Swim Lane D (AI Plugin)**: AIPromptGenerator (1 developer, parallel)
- **Swim Lane E (Adapters)**: DiffPresenter (1 developer, parallel)

**Dependencies:**
- Swim Lane A must complete interfaces before B/C/D/E start
- Swim Lanes B, C, D, E can work in parallel after interfaces defined
- Stories 3.1-3.3 (transformers) depend on 3.4 (ASTRefactorer base class) - semi-sequential within Swim Lane C

---

## Cross-Epic Shared Components

These components are used across multiple epics:

| Component | Package | Layer | Used By Epics | Primary Purpose |
|-----------|---------|-------|--------------|----------------|
| **YAMLConfigRepository** | packages/adapters | Adapter | 1, 2, 3 | Load config via Bun.file().yaml() |
| **PinoLogger** | packages/adapters | Adapter | 1, 2, 3 | Structured logging with Pino |
| **DI Container (TSyringe)** | apps/cli/container | CLI | 1, 2, 3 | Dependency injection setup |
| **InitCommand** | apps/cli/commands | CLI | 1 | Project initialization (`nimata init`) |
| **CompletionCommand** | apps/cli/commands | CLI | All | Shell completion generation |

---

## Component Dependency Graph

### High-Level Dependencies

```
CLI Layer (apps/cli)
  ├─ ScaffoldCommand → ScaffoldingService (Epic 1)
  ├─ ValidateCommand → ValidationService (Epic 2)
  ├─ FixCommand → RefactoringService (Epic 3)
  └─ All commands → YAMLConfigRepository, PinoLogger

Use Case Layer (packages/core)
  ├─ ScaffoldingService → IFileSystem, ITemplateRenderer
  ├─ ValidationService → IToolOrchestrator, ICacheService
  └─ RefactoringService → IASTRefactorer, ITriageService

Adapter Layer (packages/adapters)
  ├─ FileSystemRepository → Bun.write(), Bun.file()
  ├─ CacheRepository → bun:sqlite with WAL
  ├─ TemplateRenderer → Handlebars
  ├─ ValidationPresenter → Picocolors, Ora
  └─ DiffPresenter → Picocolors, diff

Infrastructure Layer (infrastructure/ + plugins/)
  ├─ ESLintRunner → ESLint library
  ├─ TypeScriptRunner → TypeScript compiler
  ├─ PrettierRunner → Prettier library
  ├─ BunTestRunner → Bun Test API
  ├─ StrykerRunner → Stryker library
  ├─ ASTRefactorer → ts-morph library
  ├─ ScaffolderPlugin → Config generators
  └─ ClaudeCodePlugin → AI generators (CLAUDE.md, MCP, agents, commands, hooks)
```

### Interface Dependencies (Ports)

**packages/core/interfaces/** (must be implemented first in Sprint 0):

- `IConfigRepository` → YAMLConfigRepository (adapters)
- `IFileSystem` → FileSystemRepository (adapters)
- `ITemplateRenderer` → TemplateRenderer (adapters)
- `ICacheRepository` → CacheRepository (adapters)
- `IToolRunner` → ESLintRunner, TypeScriptRunner, PrettierRunner, etc. (infrastructure)
- `IToolOrchestrator` → ToolOrchestrator (core)
- `ICacheService` → CacheService (core)
- `IASTRefactorer` → ASTRefactorer (infrastructure)
- `IPlugin` → ScaffolderPlugin, ClaudeCodePlugin, etc. (plugins)

---

## Component Coverage Summary

| Metric | Value | Status |
|--------|-------|--------|
| **Total Components** | 29 unique components | ✅ Well-scoped |
| **Total Stories** | 30 stories | ✅ Complete |
| **Component-to-Story Ratio** | 0.97 | ✅ Balanced (not over-componentized) |
| **Shared Components** | 5 (config, logging, DI, init, completion) | ✅ Minimal coupling |
| **Epic 1 Components** | 7 | ✅ Manageable |
| **Epic 2 Components** | 12 | ✅ Manageable (5 parallelizable wrappers) |
| **Epic 3 Components** | 10 | ✅ Manageable (3 parallelizable transformers) |

---

## Story Readiness Summary

| Epic | Total Stories | Ready Stories | Not Ready | Readiness % |
|------|--------------|---------------|-----------|-------------|
| **Epic 1** | 10 | 10 | 0 | ✅ 100% |
| **Epic 2** | 10 | 10 | 0 | ✅ 100% |
| **Epic 3** | 10 | 10 | 0 | ✅ 100% |
| **Total** | **30** | **30** | **0** | **✅ 100%** |

**All 30 stories are implementation-ready.**

Each story has:
- ✅ Clear component ownership
- ✅ Defined interfaces (ports in packages/core/interfaces/)
- ✅ Specified technology stack
- ✅ Test strategy (unit + integration + E2E where applicable)
- ✅ Swim lane assignment for parallelization

---

## Implementation Recommendations

### Sprint 0: Foundation (1 week)

**Focus:** Set up core infrastructure before story implementation.

1. **Turborepo Setup**
   - Initialize monorepo structure
   - Configure turbo.json with task dependencies
   - Set up TypeScript project references

2. **Core Interfaces**
   - Define all interfaces in packages/core/interfaces/
   - Validate interface contracts with TypeScript strict mode

3. **DI Container**
   - Set up TSyringe in apps/cli/container.ts
   - Manual registration for all core services

4. **Testing Infrastructure**
   - Configure Bun Test per package
   - Configure Stryker per package (unit tests only)
   - Set up GitHub Actions CI with Turborepo caching

**Deliverables:**
- Monorepo structure in place
- All interfaces defined
- DI container configured
- CI pipeline working

---

### Sprint 1-3: Epic 1 Implementation (3 weeks)

**Parallel Swim Lanes:**

| Swim Lane | Stories | Developer Count | Duration |
|-----------|---------|----------------|----------|
| **A (Core)** | 1.1 | 1 developer | Week 1 (sequential) |
| **B (CLI)** | 1.1, 1.7 | 1 developer | Weeks 2-3 (parallel) |
| **C (Plugins)** | 1.2, 1.3, 1.4, 1.5, 1.6 | 2 developers | Weeks 2-3 (parallel) |
| **D (AI Plugin)** | 1.7, 1.8, 1.9, 1.10 | 1 developer | Weeks 2-3 (parallel) |

**Critical Path:** Swim Lane A (interfaces) → All others parallel

---

### Sprint 4-6: Epic 2 Implementation (3 weeks)

**Parallel Swim Lanes:**

| Swim Lane | Stories | Developer Count | Duration |
|-----------|---------|----------------|----------|
| **A (Core)** | 2.10 | 1 developer | Week 1 (sequential) |
| **B (CLI)** | 2.9, 2.10 | 1 developer | Weeks 2-3 (parallel) |
| **C (Infrastructure)** | 2.1, 2.2, 2.3, 2.4, 2.5 | 2 developers | Weeks 2-3 (parallel - 5 independent wrappers) |
| **E (Adapters)** | 2.6, 2.7, 2.8 | 1 developer | Weeks 2-3 (parallel) |

**Critical Path:** Swim Lane A (interfaces) → All others parallel

**Highest Parallelization:** Epic 2 has 5 independent tool wrappers (stories 2.1-2.5) that can be developed concurrently by 2 developers (3-2 or 2-3 split).

---

### Sprint 7-9: Epic 3 Implementation (3 weeks)

**Parallel Swim Lanes:**

| Swim Lane | Stories | Developer Count | Duration |
|-----------|---------|----------------|----------|
| **A (Core)** | 3.6, 3.10 | 1 developer | Week 1 (sequential) |
| **B (CLI)** | 3.8, 3.10 | 1 developer | Weeks 2-3 (parallel) |
| **C (Transformers)** | 3.1, 3.2, 3.3, 3.4, 3.5 | 2 developers | Weeks 1-3 (semi-sequential: 3.4 first, then 3.1-3.3 parallel) |
| **D (AI Plugin)** | 3.7 | 1 developer | Weeks 2-3 (parallel) |
| **E (Adapters)** | 3.8, 3.9 | 1 developer | Weeks 2-3 (parallel) |

**Critical Path:** Swim Lane A (interfaces) → Swim Lane C (story 3.4 ASTRefactorer base) → Stories 3.1-3.3 parallel

---

## Conclusion

This Epic Alignment Matrix provides complete traceability between PRD requirements and architectural components. All 30 stories have clear component ownership, dependencies, and parallelization strategies.

**Key Metrics:**
- ✅ 100% story readiness (30/30)
- ✅ 29 well-scoped components
- ✅ 4-5 developer swim lanes per epic
- ✅ Clear critical paths identified
- ✅ Maximum parallelization enabled

Use this matrix for sprint planning, dependency tracking, and parallel development coordination.

---

_Generated by BMad Solution Architecture Cohesion Check_
_Date: 2025-10-16_
_Related Documents: solution-architecture.md, PRD.md, epic-stories.md_
