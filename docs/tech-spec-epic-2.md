# Technical Specification: Epic 2 - Find Right (Unified Quality Validation)

**Project:** Nimata CLI
**Epic:** Epic 2 - Find Right - Unified Quality Validation
**Date:** 2025-10-16
**Architecture:** Clean Architecture Lite with SQLite Caching
**Status:** Implementation Ready

---

## Table of Contents

1. [Epic Overview](#1-epic-overview)
2. [Stories Summary](#2-stories-summary)
3. [Component Architecture](#3-component-architecture)
4. [Interfaces and Contracts](#4-interfaces-and-contracts)
5. [Data Models](#5-data-models)
6. [Caching Strategy](#6-caching-strategy)
7. [Tool Wrapper Pattern](#7-tool-wrapper-pattern)
8. [Parallel Execution](#8-parallel-execution)
9. [Watch Mode](#9-watch-mode)
10. [Output Formatting](#10-output-formatting)
11. [Error Handling](#11-error-handling)
12. [Testing Strategy](#12-testing-strategy)
13. [Performance Requirements](#13-performance-requirements)
14. [Acceptance Criteria Mapping](#14-acceptance-criteria-mapping)
15. [Implementation Order](#15-implementation-order)

---

## 1. Epic Overview

### 1.1 Goals and Value Proposition

Epic 2 delivers the **Find Right** pillar of Nimata's quality cascade, providing unified quality validation through a single command that orchestrates multiple quality tools (ESLint, TypeScript, Prettier, Bun Test, Stryker) with intelligent SQLite caching.

**Core Value:**
- **Single-command validation**: `nimata validate` runs all quality tools in parallel
- **Sub-100ms performance**: SQLite caching with WAL mode delivers < 100ms validation for unchanged files (NFR-003)
- **Watch mode support**: Bun.watch() integration for iterative development workflow
- **Unified reporting**: Terminal output with Picocolors + Ora, JSON output for CI/CD

**Key Differentiators:**
- Intelligent caching eliminates redundant validation (3-6x faster than JSON caching)
- Parallel tool execution maximizes throughput
- File hash-based invalidation ensures cache correctness
- Graceful degradation when tools fail (no cascading failures)

### 1.2 Functional Scope

**In Scope:**
- ESLint, TypeScript, Prettier, Bun Test, Stryker integration
- SQLite cache with WAL mode for validation results
- Parallel tool orchestration with Promise.all
- File hash-based cache invalidation (Bun.hash)
- Terminal output formatting (Picocolors + Ora)
- JSON output format for CI/CD integration
- Watch mode for validation command only
- Exit codes for CI/CD integration

**Out of Scope:**
- HTML report generation (Phase 2)
- Real-time validation as you type (Phase 2)
- IDE integrations (Phase 2)
- Custom rule authoring (Phase 2)

### 1.3 Success Metrics

- Validation completes in < 100ms for unchanged files (cache hit)
- Validation completes in < 30s for medium project (cache miss)
- Cache hit rate > 80% in typical development workflow
- Zero false positives (cache never serves stale results)
- Parallel execution reduces total time by 40-60% vs sequential

---

## 2. Stories Summary

| Story ID | Title | Story Points | Primary Components | Swim Lane |
|----------|-------|--------------|-------------------|-----------|
| **2.1** | ESLint Integration | 3 | ESLintRunner, ValidationService | C (Infrastructure) |
| **2.2** | TypeScript Compiler Integration | 3 | TypeScriptRunner, ValidationService | C (Infrastructure) |
| **2.3** | Prettier Integration | 2 | PrettierRunner, ValidationService | C (Infrastructure) |
| **2.4** | Bun Test Integration | 3 | BunTestRunner, ValidationService | C (Infrastructure) |
| **2.5** | Stryker Mutation Testing Integration | 3 | StrykerRunner, ValidationService | C (Infrastructure) |
| **2.6** | Intelligent Caching with SQLite | 4 | CacheService, CacheRepository | E (Adapters) |
| **2.7** | Terminal Output Formatting | 3 | ValidationPresenter | E (Adapters) |
| **2.8** | JSON Output Format | 2 | ValidationPresenter | E (Adapters) |
| **2.9** | Watch Mode for Validation | 3 | WatchService, ValidateCommand | B (CLI) |
| **2.10** | Unified Validate Command | 2 | ValidateCommand, ValidationService | A (Core) |
| **Total** | **10 Stories** | **28 Points** | **12 Components** | **4-5 Devs** |

**Estimated Effort:** 35% of total development (4 weeks across 2 sprints)

---

## 3. Component Architecture

### 3.1 Layered Architecture

Epic 2 follows Clean Architecture Lite with 4 layers:

```
┌─────────────────────────────────────────────────────────┐
│               CLI Layer (apps/cli)                       │
│  ValidateCommand → WatchService → ValidationPresenter   │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│          Use Case Layer (packages/core)                  │
│  ValidationService → ToolOrchestrator → CacheService     │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│        Adapter Layer (packages/adapters)                 │
│  CacheRepository → ValidationPresenter → FileSystem      │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│    Infrastructure Layer (infrastructure/)                │
│  ESLint/TypeScript/Prettier/BunTest/Stryker Wrappers    │
└─────────────────────────────────────────────────────────┘
```

### 3.2 Component Breakdown (12 Components)

#### 3.2.1 Core Components (packages/core)

**ValidationService**
- **Responsibility:** Orchestrates complete validation workflow
- **Dependencies:** IToolOrchestrator, ICacheService, IConfigRepository
- **Key Methods:**
  - `execute(options: ValidateOptions): Promise<Result<ValidationResult>>`
  - `findFiles(config: Config): Promise<string[]>`
  - `aggregateResults(results: ToolResult[]): ValidationResult`

**ToolOrchestrator**
- **Responsibility:** Parallel tool execution with error isolation
- **Dependencies:** IToolRunner[] (5 tool runners)
- **Key Methods:**
  - `runAll(files: string[], config: Config): Promise<ToolResult[]>`
  - `runTool(tool: IToolRunner, files: string[]): Promise<Result<ToolResult>>`

**CacheService**
- **Responsibility:** Cache coordination and invalidation logic
- **Dependencies:** ICacheRepository, IFileHasher
- **Key Methods:**
  - `get(filePath: string, toolName: string): Promise<CachedResult | null>`
  - `set(filePath: string, toolName: string, result: ToolResult): Promise<void>`
  - `invalidate(filePath: string): Promise<void>`
  - `invalidateAll(): Promise<void>`

#### 3.2.2 Infrastructure Components (infrastructure/)

**ESLintRunner**
- **Location:** `infrastructure/eslint-wrapper/src/eslint-runner.ts`
- **Responsibility:** Execute ESLint programmatically via Node API
- **Dependencies:** ESLint library (external)
- **Key Methods:**
  - `run(files: string[], config: ESLintConfig): Promise<ToolResult>`

**TypeScriptRunner**
- **Location:** `infrastructure/typescript-wrapper/src/typescript-runner.ts`
- **Responsibility:** Execute TypeScript compiler for type checking
- **Dependencies:** TypeScript Compiler API (external)
- **Key Methods:**
  - `run(files: string[], config: TSConfig): Promise<ToolResult>`

**PrettierRunner**
- **Location:** `infrastructure/prettier-wrapper/src/prettier-runner.ts`
- **Responsibility:** Execute Prettier in check mode
- **Dependencies:** Prettier library (external)
- **Key Methods:**
  - `run(files: string[], config: PrettierConfig): Promise<ToolResult>`

**BunTestRunner**
- **Location:** `infrastructure/bun-test-wrapper/src/bun-test-runner.ts`
- **Responsibility:** Execute Bun Test runner and collect results
- **Dependencies:** Bun Test API (native)
- **Key Methods:**
  - `run(testPattern: string, config: BunTestConfig): Promise<ToolResult>`

**StrykerRunner**
- **Location:** `infrastructure/stryker-wrapper/src/stryker-runner.ts`
- **Responsibility:** Execute Stryker mutation testing
- **Dependencies:** Stryker library (external)
- **Key Methods:**
  - `run(config: StrykerConfig): Promise<ToolResult>`

#### 3.2.3 Adapter Components (packages/adapters)

**CacheRepository**
- **Location:** `packages/adapters/src/repositories/sqlite-cache-repository.ts`
- **Responsibility:** SQLite cache storage with WAL mode
- **Dependencies:** bun:sqlite (native)
- **Key Methods:**
  - `initialize(): Promise<void>` - Create schema
  - `get(key: CacheKey): Promise<CacheEntry | null>`
  - `set(key: CacheKey, value: CacheEntry): Promise<void>`
  - `invalidate(key: CacheKey): Promise<void>`
  - `close(): Promise<void>`

**ValidationPresenter**
- **Location:** `packages/adapters/src/presenters/validation-presenter.ts`
- **Responsibility:** Format validation results for terminal/JSON output
- **Dependencies:** Picocolors, Ora (external)
- **Key Methods:**
  - `presentTerminal(result: ValidationResult): string`
  - `presentJSON(result: ValidationResult): string`
  - `showProgress(toolName: string): Ora.Spinner`

#### 3.2.4 CLI Components (apps/cli)

**ValidateCommand**
- **Location:** `apps/cli/src/commands/validate.ts`
- **Responsibility:** Yargs command handler for `nimata validate`
- **Dependencies:** ValidationService, ValidationPresenter
- **Key Methods:**
  - `handler(argv: Arguments): Promise<void>`

**WatchService**
- **Location:** `apps/cli/src/services/watch-service.ts`
- **Responsibility:** File watching with Bun.watch() for incremental validation
- **Dependencies:** Bun.watch() (native), ValidationService
- **Key Methods:**
  - `start(patterns: string[]): Promise<void>`
  - `stop(): Promise<void>`

### 3.3 Component Dependencies

```
ValidateCommand
  ├─→ ValidationService (use case)
  └─→ ValidationPresenter (adapter)

ValidationService
  ├─→ ToolOrchestrator (use case)
  ├─→ CacheService (use case)
  └─→ IConfigRepository (interface)

ToolOrchestrator
  ├─→ ESLintRunner (infrastructure)
  ├─→ TypeScriptRunner (infrastructure)
  ├─→ PrettierRunner (infrastructure)
  ├─→ BunTestRunner (infrastructure)
  └─→ StrykerRunner (infrastructure)

CacheService
  ├─→ CacheRepository (adapter)
  └─→ IFileHasher (interface)

WatchService
  ├─→ Bun.watch() (native)
  └─→ ValidationService (use case)
```

---

## 4. Interfaces and Contracts

### 4.1 Core Interfaces

#### IToolRunner

```typescript
// packages/core/src/interfaces/i-tool-runner.ts

export interface IToolRunner {
  /**
   * Tool name for identification and caching
   */
  readonly name: string;

  /**
   * Tool version for cache invalidation
   */
  readonly version: string;

  /**
   * Run tool on specified files
   * @param files - Array of absolute file paths to validate
   * @param config - Tool-specific configuration
   * @returns Promise<ToolResult> with errors, warnings, and timing
   */
  run(files: string[], config: unknown): Promise<ToolResult>;

  /**
   * Check if tool supports incremental validation
   */
  supportsIncremental(): boolean;
}
```

#### IToolOrchestrator

```typescript
// packages/core/src/interfaces/i-tool-orchestrator.ts

export interface IToolOrchestrator {
  /**
   * Run all configured tools in parallel
   * @param files - Files to validate
   * @param options - Orchestration options (cache, parallel, etc.)
   * @returns Promise<ToolResult[]> with results from all tools
   */
  runAll(files: string[], options: OrchestrationOptions): Promise<ToolResult[]>;

  /**
   * Run specific tool by name
   * @param toolName - Name of tool to run (eslint, typescript, etc.)
   * @param files - Files to validate
   * @returns Promise<ToolResult> for single tool
   */
  runTool(toolName: string, files: string[]): Promise<ToolResult>;

  /**
   * Register tool runner for orchestration
   */
  registerTool(tool: IToolRunner): void;
}
```

#### ICacheService

```typescript
// packages/core/src/interfaces/i-cache-service.ts

export interface ICacheService {
  /**
   * Get cached validation result if valid
   * @param filePath - Absolute file path
   * @param toolName - Tool name (eslint, typescript, etc.)
   * @param fileHash - Current file hash for invalidation check
   * @returns Cached result or null if cache miss
   */
  get(
    filePath: string,
    toolName: string,
    fileHash: string
  ): Promise<CachedResult | null>;

  /**
   * Store validation result in cache
   * @param filePath - Absolute file path
   * @param toolName - Tool name
   * @param fileHash - File content hash
   * @param result - Tool validation result
   */
  set(
    filePath: string,
    toolName: string,
    fileHash: string,
    result: ToolResult
  ): Promise<void>;

  /**
   * Invalidate cache for specific file (all tools)
   * @param filePath - File to invalidate
   */
  invalidate(filePath: string): Promise<void>;

  /**
   * Invalidate all cache entries (config change, etc.)
   */
  invalidateAll(): Promise<void>;

  /**
   * Get cache statistics
   */
  getStats(): Promise<CacheStats>;
}
```

#### ICacheRepository

```typescript
// packages/core/src/interfaces/i-cache-repository.ts

export interface ICacheRepository {
  /**
   * Initialize cache storage (create tables, etc.)
   */
  initialize(): Promise<void>;

  /**
   * Get cache entry by key
   * @param key - Cache key with file path, tool name, and hash
   */
  get(key: CacheKey): Promise<CacheEntry | null>;

  /**
   * Store cache entry
   * @param key - Cache key
   * @param entry - Cache entry with results and metadata
   */
  set(key: CacheKey, entry: CacheEntry): Promise<void>;

  /**
   * Delete cache entry by key
   */
  delete(key: CacheKey): Promise<void>;

  /**
   * Delete all cache entries
   */
  clear(): Promise<void>;

  /**
   * Query cache entries by criteria
   */
  query(criteria: CacheQuery): Promise<CacheEntry[]>;

  /**
   * Close connection (cleanup)
   */
  close(): Promise<void>;
}
```

#### IFileHasher

```typescript
// packages/core/src/interfaces/i-file-hasher.ts

export interface IFileHasher {
  /**
   * Compute hash for file content
   * @param filePath - Absolute file path
   * @returns Promise<string> with hash (hex string)
   */
  hashFile(filePath: string): Promise<string>;

  /**
   * Compute hash for string content
   * @param content - String content to hash
   * @returns string hash (hex string)
   */
  hashString(content: string): string;
}
```

### 4.2 Interface Implementation Matrix

| Interface | Implementation | Location | Dependencies |
|-----------|---------------|----------|--------------|
| **IToolRunner** | ESLintRunner | infrastructure/eslint-wrapper | ESLint library |
| **IToolRunner** | TypeScriptRunner | infrastructure/typescript-wrapper | TypeScript Compiler API |
| **IToolRunner** | PrettierRunner | infrastructure/prettier-wrapper | Prettier library |
| **IToolRunner** | BunTestRunner | infrastructure/bun-test-wrapper | Bun Test API |
| **IToolRunner** | StrykerRunner | infrastructure/stryker-wrapper | Stryker library |
| **IToolOrchestrator** | ToolOrchestrator | packages/core | IToolRunner[] |
| **ICacheService** | CacheService | packages/core | ICacheRepository, IFileHasher |
| **ICacheRepository** | SQLiteCacheRepository | packages/adapters | bun:sqlite |
| **IFileHasher** | BunFileHasher | packages/adapters | Bun.hash() |

---

## 5. Data Models

### 5.1 Core Types

#### ValidationResult

```typescript
// packages/core/src/types/validation-result.ts

export interface ValidationResult {
  /**
   * Overall validation success
   */
  success: boolean;

  /**
   * Total error count across all tools
   */
  totalErrors: number;

  /**
   * Total warning count across all tools
   */
  totalWarnings: number;

  /**
   * Total execution time in milliseconds
   */
  executionTime: number;

  /**
   * Cache hit rate (0.0 to 1.0)
   */
  cacheHitRate: number;

  /**
   * Results per tool
   */
  tools: {
    eslint: ToolResult;
    typescript: ToolResult;
    prettier: ToolResult;
    tests: ToolResult;
    mutation?: ToolResult; // Optional Stryker
  };

  /**
   * Issues aggregated by file
   */
  fileResults: Map<string, FileIssue[]>;

  /**
   * Timestamp of validation
   */
  timestamp: number;
}
```

#### ToolResult

```typescript
// packages/core/src/types/tool-result.ts

export interface ToolResult {
  /**
   * Tool name
   */
  tool: string;

  /**
   * Tool success status
   */
  success: boolean;

  /**
   * Errors found by tool
   */
  errors: ToolIssue[];

  /**
   * Warnings found by tool
   */
  warnings: ToolIssue[];

  /**
   * Tool execution time in milliseconds
   */
  executionTime: number;

  /**
   * Whether result came from cache
   */
  fromCache: boolean;

  /**
   * Tool-specific metadata
   */
  metadata?: Record<string, unknown>;
}
```

#### ToolIssue

```typescript
// packages/core/src/types/tool-issue.ts

export interface ToolIssue {
  /**
   * Absolute file path
   */
  filePath: string;

  /**
   * Line number (1-indexed)
   */
  line: number;

  /**
   * Column number (1-indexed)
   */
  column: number;

  /**
   * Issue severity
   */
  severity: 'error' | 'warning' | 'info';

  /**
   * Human-readable message
   */
  message: string;

  /**
   * Rule ID (if applicable)
   */
  ruleId?: string;

  /**
   * Tool that generated issue
   */
  source: string;
}
```

#### FileIssue

```typescript
// packages/core/src/types/file-issue.ts

export interface FileIssue {
  /**
   * Absolute file path
   */
  filePath: string;

  /**
   * All issues for this file
   */
  issues: ToolIssue[];

  /**
   * Total error count for file
   */
  errorCount: number;

  /**
   * Total warning count for file
   */
  warningCount: number;
}
```

### 5.2 Cache Types

#### CacheEntry

```typescript
// packages/core/src/types/cache-entry.ts

export interface CacheEntry {
  /**
   * Absolute file path
   */
  filePath: string;

  /**
   * File content hash (Bun.hash output)
   */
  fileHash: string;

  /**
   * Tool name (eslint, typescript, etc.)
   */
  toolName: string;

  /**
   * Cached tool result
   */
  result: ToolResult;

  /**
   * Cache entry timestamp (Unix epoch)
   */
  timestamp: number;

  /**
   * Tool version at time of caching
   */
  toolVersion: string;

  /**
   * Config hash at time of caching (for invalidation)
   */
  configHash: string;
}
```

#### CacheKey

```typescript
// packages/core/src/types/cache-key.ts

export interface CacheKey {
  /**
   * Absolute file path
   */
  filePath: string;

  /**
   * Tool name
   */
  toolName: string;

  /**
   * File content hash
   */
  fileHash: string;
}
```

#### CacheStats

```typescript
// packages/core/src/types/cache-stats.ts

export interface CacheStats {
  /**
   * Total cache entries
   */
  totalEntries: number;

  /**
   * Cache hits in current session
   */
  hits: number;

  /**
   * Cache misses in current session
   */
  misses: number;

  /**
   * Cache hit rate (0.0 to 1.0)
   */
  hitRate: number;

  /**
   * Total cache size in bytes
   */
  sizeBytes: number;

  /**
   * Oldest cache entry timestamp
   */
  oldestEntry: number;

  /**
   * Newest cache entry timestamp
   */
  newestEntry: number;
}
```

### 5.3 Configuration Types

#### ValidateOptions

```typescript
// packages/core/src/types/validate-options.ts

export interface ValidateOptions {
  /**
   * Files to validate (glob patterns or specific paths)
   */
  files?: string[];

  /**
   * Disable cache for this run
   */
  noCache?: boolean;

  /**
   * Output format (terminal, json)
   */
  reporter?: 'terminal' | 'json';

  /**
   * Enable verbose logging
   */
  verbose?: boolean;

  /**
   * Watch mode enabled
   */
  watch?: boolean;

  /**
   * Include mutation testing (Stryker)
   */
  includeMutationTests?: boolean;

  /**
   * Fail fast on first error
   */
  failFast?: boolean;
}
```

#### OrchestrationOptions

```typescript
// packages/core/src/types/orchestration-options.ts

export interface OrchestrationOptions {
  /**
   * Enable caching
   */
  useCache: boolean;

  /**
   * Enable parallel execution
   */
  parallel: boolean;

  /**
   * Tools to run (empty = all)
   */
  tools?: string[];

  /**
   * Maximum parallel tool executions
   */
  maxParallel?: number;

  /**
   * Timeout per tool in milliseconds
   */
  timeout?: number;
}
```

---

## 6. Caching Strategy

### 6.1 SQLite Schema

```sql
-- Schema: ~/.nimata/cache/validation.db

-- Validation cache table (WAL mode enabled)
CREATE TABLE validation_cache (
  file_path TEXT NOT NULL,
  file_hash TEXT NOT NULL,
  tool_name TEXT NOT NULL,
  tool_version TEXT NOT NULL,
  config_hash TEXT NOT NULL,
  result_json TEXT NOT NULL,
  timestamp INTEGER NOT NULL,
  PRIMARY KEY (file_path, tool_name)
);

-- Indexes for performance
CREATE INDEX idx_file_hash ON validation_cache(file_hash);
CREATE INDEX idx_tool_name ON validation_cache(tool_name);
CREATE INDEX idx_timestamp ON validation_cache(timestamp);
CREATE INDEX idx_config_hash ON validation_cache(config_hash);

-- Cache metadata table
CREATE TABLE cache_metadata (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- Store current config hash for invalidation
INSERT INTO cache_metadata (key, value) VALUES ('config_hash', '');

-- Store schema version
INSERT INTO cache_metadata (key, value) VALUES ('schema_version', '1');
```

### 6.2 WAL Mode Configuration

```typescript
// packages/adapters/src/repositories/sqlite-cache-repository.ts

import { Database } from 'bun:sqlite';

export class SQLiteCacheRepository implements ICacheRepository {
  private db: Database;

  async initialize(): Promise<void> {
    // Open SQLite database
    this.db = new Database('~/.nimata/cache/validation.db');

    // Enable WAL mode for better concurrency and crash resistance
    this.db.exec('PRAGMA journal_mode = WAL');

    // Set synchronous mode to NORMAL (faster, still safe with WAL)
    this.db.exec('PRAGMA synchronous = NORMAL');

    // Enable foreign keys
    this.db.exec('PRAGMA foreign_keys = ON');

    // Set cache size to 10MB
    this.db.exec('PRAGMA cache_size = -10000');

    // Create tables if not exist
    this.db.exec(SCHEMA_SQL);
  }

  // ... rest of implementation
}
```

### 6.3 Cache Invalidation Logic

#### 6.3.1 File Change Detection

```typescript
// packages/core/src/use-cases/cache-service.ts

export class CacheService implements ICacheService {
  constructor(
    private readonly cacheRepo: ICacheRepository,
    private readonly fileHasher: IFileHasher
  ) {}

  async get(
    filePath: string,
    toolName: string,
    fileHash: string
  ): Promise<CachedResult | null> {
    const key: CacheKey = { filePath, toolName, fileHash };

    const entry = await this.cacheRepo.get(key);

    if (!entry) {
      return null; // Cache miss
    }

    // Validate file hash matches (file unchanged)
    if (entry.fileHash !== fileHash) {
      // File changed, invalidate entry
      await this.cacheRepo.delete(key);
      return null;
    }

    // Validate tool version matches (tool not upgraded)
    const currentToolVersion = this.getToolVersion(toolName);
    if (entry.toolVersion !== currentToolVersion) {
      await this.cacheRepo.delete(key);
      return null;
    }

    // Validate config hash matches (config unchanged)
    const currentConfigHash = await this.getConfigHash();
    if (entry.configHash !== currentConfigHash) {
      await this.cacheRepo.delete(key);
      return null;
    }

    // Cache hit - return cached result
    return {
      result: entry.result,
      fromCache: true
    };
  }

  async set(
    filePath: string,
    toolName: string,
    fileHash: string,
    result: ToolResult
  ): Promise<void> {
    const toolVersion = this.getToolVersion(toolName);
    const configHash = await this.getConfigHash();

    const entry: CacheEntry = {
      filePath,
      fileHash,
      toolName,
      result,
      timestamp: Date.now(),
      toolVersion,
      configHash
    };

    await this.cacheRepo.set({ filePath, toolName, fileHash }, entry);
  }

  private getToolVersion(toolName: string): string {
    // Get version from tool runner registry
    const tool = this.toolRegistry.getTool(toolName);
    return tool.version;
  }

  private async getConfigHash(): Promise<string> {
    // Compute hash of relevant config files
    const eslintConfig = await Bun.file('.eslintrc.json').text();
    const tsConfig = await Bun.file('tsconfig.json').text();
    const prettierConfig = await Bun.file('.prettierrc.json').text();

    const combined = eslintConfig + tsConfig + prettierConfig;
    return this.fileHasher.hashString(combined);
  }
}
```

#### 6.3.2 Config Change Detection

When any tool config changes (`.eslintrc.json`, `tsconfig.json`, `.prettierrc.json`), invalidate all cache entries for that tool:

```typescript
// packages/core/src/use-cases/cache-service.ts

export class CacheService implements ICacheService {
  async invalidateByConfigChange(toolName: string): Promise<void> {
    // Query all entries for tool
    const entries = await this.cacheRepo.query({ toolName });

    // Delete all entries
    await Promise.all(entries.map(entry => this.cacheRepo.delete({
      filePath: entry.filePath,
      toolName: entry.toolName,
      fileHash: entry.fileHash
    })));
  }

  async invalidateAll(): Promise<void> {
    // Nuclear option - clear entire cache
    await this.cacheRepo.clear();
  }
}
```

#### 6.3.3 Time-Based Expiration

Optional: Invalidate cache entries older than 7 days (configurable):

```typescript
// packages/core/src/use-cases/cache-service.ts

export class CacheService implements ICacheService {
  async pruneOldEntries(maxAgeMs: number = 7 * 24 * 60 * 60 * 1000): Promise<void> {
    const cutoffTimestamp = Date.now() - maxAgeMs;

    // Query entries older than cutoff
    const oldEntries = await this.cacheRepo.query({
      olderThan: cutoffTimestamp
    });

    // Delete old entries
    await Promise.all(oldEntries.map(entry => this.cacheRepo.delete({
      filePath: entry.filePath,
      toolName: entry.toolName,
      fileHash: entry.fileHash
    })));
  }
}
```

### 6.4 Cache Performance Benchmarks

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Cache Hit Latency** | < 5ms | Time to retrieve cached result from SQLite |
| **Cache Miss Latency** | < 10ms | Time to determine cache miss + query |
| **Cache Write Latency** | < 10ms | Time to store new cache entry |
| **Full Validation (Cache Hit)** | < 100ms | Total validation time with 100% cache hit |
| **Full Validation (Cache Miss)** | < 30s | Total validation time with 0% cache hit (medium project) |
| **Cache Hit Rate** | > 80% | Percentage of cache hits in typical workflow |

---

## 7. Tool Wrapper Pattern

### 7.1 Common Wrapper Interface

All tool runners implement `IToolRunner` interface for consistent orchestration:

```typescript
// infrastructure/eslint-wrapper/src/eslint-runner.ts

import { ESLint } from 'eslint';
import type { IToolRunner, ToolResult, ToolIssue } from '@nimata/core';

export class ESLintRunner implements IToolRunner {
  readonly name = 'eslint';
  readonly version: string;

  constructor() {
    // Get ESLint version from package
    this.version = require('eslint/package.json').version;
  }

  async run(files: string[], config: unknown): Promise<ToolResult> {
    const startTime = Date.now();

    try {
      // Initialize ESLint with config
      const eslint = new ESLint({
        useEslintrc: true,
        ...config
      });

      // Lint files
      const results = await eslint.lintFiles(files);

      // Convert ESLint results to ToolIssue format
      const errors: ToolIssue[] = [];
      const warnings: ToolIssue[] = [];

      for (const result of results) {
        for (const message of result.messages) {
          const issue: ToolIssue = {
            filePath: result.filePath,
            line: message.line,
            column: message.column,
            severity: message.severity === 2 ? 'error' : 'warning',
            message: message.message,
            ruleId: message.ruleId,
            source: 'eslint'
          };

          if (message.severity === 2) {
            errors.push(issue);
          } else {
            warnings.push(issue);
          }
        }
      }

      const executionTime = Date.now() - startTime;

      return {
        tool: this.name,
        success: errors.length === 0,
        errors,
        warnings,
        executionTime,
        fromCache: false
      };

    } catch (error) {
      // Graceful error handling
      return {
        tool: this.name,
        success: false,
        errors: [{
          filePath: '',
          line: 0,
          column: 0,
          severity: 'error',
          message: `ESLint execution failed: ${error.message}`,
          source: 'eslint'
        }],
        warnings: [],
        executionTime: Date.now() - startTime,
        fromCache: false
      };
    }
  }

  supportsIncremental(): boolean {
    return true; // ESLint supports per-file linting
  }
}
```

### 7.2 Infrastructure Layer Organization

```
infrastructure/
├── eslint-wrapper/
│   ├── src/
│   │   └── eslint-runner.ts
│   ├── tests/
│   │   ├── unit/
│   │   │   └── eslint-runner.test.ts
│   │   └── integration/
│   │       └── eslint-execution.test.ts
│   ├── package.json
│   └── tsconfig.json
│
├── typescript-wrapper/
│   ├── src/
│   │   └── typescript-runner.ts
│   ├── tests/
│   │   ├── unit/
│   │   │   └── typescript-runner.test.ts
│   │   └── integration/
│   │       └── typescript-execution.test.ts
│   ├── package.json
│   └── tsconfig.json
│
├── prettier-wrapper/
│   ├── src/
│   │   └── prettier-runner.ts
│   ├── tests/
│   │   ├── unit/
│   │   │   └── prettier-runner.test.ts
│   │   └── integration/
│   │       └── prettier-execution.test.ts
│   ├── package.json
│   └── tsconfig.json
│
├── bun-test-wrapper/
│   ├── src/
│   │   └── bun-test-runner.ts
│   ├── tests/
│   │   ├── unit/
│   │   │   └── bun-test-runner.test.ts
│   │   └── integration/
│   │       └── bun-test-execution.test.ts
│   ├── package.json
│   └── tsconfig.json
│
└── stryker-wrapper/
    ├── src/
    │   └── stryker-runner.ts
    ├── tests/
    │   ├── unit/
    │   │   └── stryker-runner.test.ts
    │   └── integration/
    │       └── stryker-execution.test.ts
    ├── package.json
    └── tsconfig.json
```

### 7.3 Error Handling in Wrappers

All tool wrappers must handle errors gracefully without crashing:

```typescript
// Common error handling pattern

async run(files: string[], config: unknown): Promise<ToolResult> {
  const startTime = Date.now();

  try {
    // Tool execution logic
    const results = await this.executeTool(files, config);
    return this.formatResults(results, startTime);

  } catch (error) {
    // Log error for debugging
    logger.error(`${this.name} execution failed`, {
      tool: this.name,
      error: error.message,
      stack: error.stack
    });

    // Return error result (don't throw)
    return {
      tool: this.name,
      success: false,
      errors: [{
        filePath: '',
        line: 0,
        column: 0,
        severity: 'error',
        message: `${this.name} execution failed: ${error.message}`,
        source: this.name
      }],
      warnings: [],
      executionTime: Date.now() - startTime,
      fromCache: false
    };
  }
}
```

---

## 8. Parallel Execution

### 8.1 ToolOrchestrator Design

```typescript
// packages/core/src/use-cases/tool-orchestrator.ts

export class ToolOrchestrator implements IToolOrchestrator {
  private tools: Map<string, IToolRunner> = new Map();

  constructor(
    private readonly cacheService: ICacheService,
    private readonly config: IConfigRepository
  ) {}

  registerTool(tool: IToolRunner): void {
    this.tools.set(tool.name, tool);
  }

  async runAll(files: string[], options: OrchestrationOptions): Promise<ToolResult[]> {
    const { useCache, parallel, tools: toolNames } = options;

    // Filter tools to run
    const toolsToRun = toolNames && toolNames.length > 0
      ? toolNames.map(name => this.tools.get(name)!).filter(Boolean)
      : Array.from(this.tools.values());

    if (parallel) {
      // Parallel execution with Promise.all
      return await this.runParallel(toolsToRun, files, useCache);
    } else {
      // Sequential execution (fallback)
      return await this.runSequential(toolsToRun, files, useCache);
    }
  }

  private async runParallel(
    tools: IToolRunner[],
    files: string[],
    useCache: boolean
  ): Promise<ToolResult[]> {
    // Execute all tools concurrently
    const promises = tools.map(tool =>
      this.runToolWithCache(tool, files, useCache)
    );

    // Wait for all to complete (Promise.all)
    const results = await Promise.allSettled(promises);

    // Extract results, handle rejections gracefully
    return results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        // Tool execution failed - return error result
        const tool = tools[index];
        logger.error(`Tool ${tool.name} failed in parallel execution`, {
          error: result.reason
        });

        return {
          tool: tool.name,
          success: false,
          errors: [{
            filePath: '',
            line: 0,
            column: 0,
            severity: 'error',
            message: `Tool execution failed: ${result.reason}`,
            source: tool.name
          }],
          warnings: [],
          executionTime: 0,
          fromCache: false
        };
      }
    });
  }

  private async runSequential(
    tools: IToolRunner[],
    files: string[],
    useCache: boolean
  ): Promise<ToolResult[]> {
    const results: ToolResult[] = [];

    for (const tool of tools) {
      try {
        const result = await this.runToolWithCache(tool, files, useCache);
        results.push(result);
      } catch (error) {
        // Handle error gracefully
        logger.error(`Tool ${tool.name} failed in sequential execution`, {
          error
        });

        results.push({
          tool: tool.name,
          success: false,
          errors: [{
            filePath: '',
            line: 0,
            column: 0,
            severity: 'error',
            message: `Tool execution failed: ${error.message}`,
            source: tool.name
          }],
          warnings: [],
          executionTime: 0,
          fromCache: false
        });
      }
    }

    return results;
  }

  private async runToolWithCache(
    tool: IToolRunner,
    files: string[],
    useCache: boolean
  ): Promise<ToolResult> {
    if (!useCache) {
      // No cache - run tool directly
      return await tool.run(files, await this.config.load());
    }

    // Check cache for each file
    const cachedResults: ToolResult[] = [];
    const filesToValidate: string[] = [];

    for (const file of files) {
      const fileHash = await this.hashFile(file);
      const cached = await this.cacheService.get(file, tool.name, fileHash);

      if (cached) {
        cachedResults.push(cached.result);
      } else {
        filesToValidate.push(file);
      }
    }

    // Run tool only on files with cache miss
    let freshResult: ToolResult | null = null;
    if (filesToValidate.length > 0) {
      freshResult = await tool.run(filesToValidate, await this.config.load());

      // Cache fresh results
      for (const file of filesToValidate) {
        const fileHash = await this.hashFile(file);
        await this.cacheService.set(file, tool.name, fileHash, freshResult);
      }
    }

    // Merge cached + fresh results
    return this.mergeResults(cachedResults, freshResult);
  }

  private async hashFile(filePath: string): Promise<string> {
    const content = await Bun.file(filePath).text();
    return Bun.hash(content).toString(16);
  }

  private mergeResults(cached: ToolResult[], fresh: ToolResult | null): ToolResult {
    if (cached.length === 0 && !fresh) {
      throw new Error('No results to merge');
    }

    if (cached.length === 0) {
      return fresh!;
    }

    if (!fresh) {
      // All from cache
      return this.aggregateCachedResults(cached);
    }

    // Merge cached + fresh
    const allResults = [...cached, fresh];
    return {
      tool: allResults[0].tool,
      success: allResults.every(r => r.success),
      errors: allResults.flatMap(r => r.errors),
      warnings: allResults.flatMap(r => r.warnings),
      executionTime: Math.max(...allResults.map(r => r.executionTime)),
      fromCache: cached.length > 0
    };
  }

  private aggregateCachedResults(results: ToolResult[]): ToolResult {
    return {
      tool: results[0].tool,
      success: results.every(r => r.success),
      errors: results.flatMap(r => r.errors),
      warnings: results.flatMap(r => r.warnings),
      executionTime: Math.max(...results.map(r => r.executionTime)),
      fromCache: true
    };
  }

  async runTool(toolName: string, files: string[]): Promise<ToolResult> {
    const tool = this.tools.get(toolName);
    if (!tool) {
      throw new Error(`Tool ${toolName} not registered`);
    }

    return await this.runToolWithCache(tool, files, true);
  }
}
```

### 8.2 Parallel Execution Benefits

| Metric | Sequential Execution | Parallel Execution | Improvement |
|--------|---------------------|-------------------|-------------|
| **Total Time (5 tools, 2s each)** | 10s | 2s | 80% faster |
| **CPU Utilization** | 20% (1 core) | 80% (4 cores) | 4x better |
| **Watch Mode Latency** | 10s | 2s | 80% faster |
| **Developer Waiting Time** | High | Low | Better UX |

---

## 9. Watch Mode

### 9.1 Bun.watch() Integration

```typescript
// apps/cli/src/services/watch-service.ts

import { watch } from 'bun';
import type { FSWatcher } from 'bun';

export class WatchService {
  private watcher: FSWatcher | null = null;
  private isRunning = false;

  constructor(
    private readonly validationService: ValidationService,
    private readonly presenter: ValidationPresenter
  ) {}

  async start(patterns: string[]): Promise<void> {
    if (this.isRunning) {
      throw new Error('Watch service already running');
    }

    this.isRunning = true;

    // Initial validation
    console.log('Running initial validation...');
    await this.validate();

    // Start watching files
    console.log(`Watching files: ${patterns.join(', ')}`);
    this.watcher = watch(patterns, async (event, filename) => {
      if (event === 'change' || event === 'rename') {
        console.log(`File changed: ${filename}`);
        await this.validate([filename]);
      }
    });

    // Handle graceful shutdown
    this.setupShutdownHandlers();

    // Keep process alive
    console.log('Watch mode active. Press Ctrl+C to exit.');
  }

  async stop(): Promise<void> {
    if (!this.isRunning) {
      return;
    }

    this.isRunning = false;

    if (this.watcher) {
      this.watcher.close();
      this.watcher = null;
    }

    console.log('Watch mode stopped.');
  }

  private async validate(files?: string[]): Promise<void> {
    try {
      const result = await this.validationService.execute({
        files,
        noCache: false,
        reporter: 'terminal'
      });

      if (result.isSuccess) {
        const output = this.presenter.presentTerminal(result.value!);
        console.log(output);
      } else {
        console.error(`Validation failed: ${result.error}`);
      }
    } catch (error) {
      console.error(`Validation error: ${error.message}`);
    }
  }

  private setupShutdownHandlers(): void {
    const shutdown = async () => {
      console.log('\nShutting down watch mode...');
      await this.stop();
      process.exit(0);
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  }
}
```

### 9.2 File Change Detection

```typescript
// apps/cli/src/services/watch-service.ts (continued)

export class WatchService {
  private debounceMap: Map<string, NodeJS.Timeout> = new Map();

  async start(patterns: string[]): Promise<void> {
    // ... initialization

    this.watcher = watch(patterns, async (event, filename) => {
      // Debounce file changes (avoid duplicate validations)
      if (this.debounceMap.has(filename)) {
        clearTimeout(this.debounceMap.get(filename)!);
      }

      const timeout = setTimeout(async () => {
        this.debounceMap.delete(filename);

        if (event === 'change' || event === 'rename') {
          console.log(`File changed: ${filename}`);
          await this.validateIncremental([filename]);
        }
      }, 100); // 100ms debounce

      this.debounceMap.set(filename, timeout);
    });
  }

  private async validateIncremental(files: string[]): Promise<void> {
    // Invalidate cache for changed files
    for (const file of files) {
      await this.cacheService.invalidate(file);
    }

    // Run validation only on changed files
    await this.validate(files);
  }
}
```

### 9.3 Watch Mode Performance

| Metric | Target | Measurement |
|--------|--------|-------------|
| **File Change Detection** | < 50ms | Time from file save to watch callback |
| **Incremental Validation** | < 200ms | Time to validate single changed file |
| **Debounce Delay** | 100ms | Delay to prevent duplicate validations |
| **Memory Overhead** | < 50MB | Additional memory for watch mode |

---

## 10. Output Formatting

### 10.1 ValidationPresenter Design

```typescript
// packages/adapters/src/presenters/validation-presenter.ts

import picocolors from 'picocolors';
import ora from 'ora';

export class ValidationPresenter {
  /**
   * Format validation results for terminal output
   */
  presentTerminal(result: ValidationResult): string {
    const lines: string[] = [];

    // Header
    lines.push(this.formatHeader(result));
    lines.push('');

    // Summary per tool
    lines.push(this.formatToolSummary(result));
    lines.push('');

    // Detailed errors (if any)
    if (result.totalErrors > 0) {
      lines.push(this.formatErrors(result));
      lines.push('');
    }

    // Footer with suggestions
    lines.push(this.formatFooter(result));

    return lines.join('\n');
  }

  /**
   * Format validation results as JSON
   */
  presentJSON(result: ValidationResult): string {
    return JSON.stringify(result, null, 2);
  }

  /**
   * Show progress spinner for tool execution
   */
  showProgress(toolName: string): ora.Ora {
    return ora(`Running ${toolName}...`).start();
  }

  private formatHeader(result: ValidationResult): string {
    const icon = result.success ? picocolors.green('✓') : picocolors.red('✗');
    const status = result.success ? 'Validation passed' : 'Validation failed';
    const time = picocolors.gray(`(${result.executionTime}ms)`);

    return `${icon} ${picocolors.bold(status)} ${time}`;
  }

  private formatToolSummary(result: ValidationResult): string {
    const lines: string[] = [];

    for (const [toolName, toolResult] of Object.entries(result.tools)) {
      if (!toolResult) continue;

      const icon = toolResult.success ? picocolors.green('✓') : picocolors.red('✗');
      const name = picocolors.bold(toolName.padEnd(12));
      const time = picocolors.gray(`(${toolResult.executionTime}ms)`);

      let status = '';
      if (toolResult.errors.length > 0) {
        status = picocolors.red(`${toolResult.errors.length} errors`);
      } else if (toolResult.warnings.length > 0) {
        status = picocolors.yellow(`${toolResult.warnings.length} warnings`);
      } else {
        status = picocolors.green('No issues');
      }

      const cacheIndicator = toolResult.fromCache ? picocolors.gray('[cached]') : '';

      lines.push(`${icon} ${name} ${time} - ${status} ${cacheIndicator}`);
    }

    return lines.join('\n');
  }

  private formatErrors(result: ValidationResult): string {
    const lines: string[] = [];
    lines.push(picocolors.bold(picocolors.red('Errors found:')));
    lines.push('');

    // Group errors by file
    for (const [filePath, fileIssue] of result.fileResults.entries()) {
      if (fileIssue.errorCount === 0) continue;

      lines.push(picocolors.bold(filePath));

      for (const issue of fileIssue.issues) {
        if (issue.severity !== 'error') continue;

        const location = picocolors.gray(`${issue.line}:${issue.column}`);
        const ruleId = issue.ruleId ? picocolors.gray(`[${issue.ruleId}]`) : '';
        const message = issue.message;

        lines.push(`  ${location} - ${message} ${ruleId}`);
      }

      lines.push('');
    }

    return lines.join('\n');
  }

  private formatFooter(result: ValidationResult): string {
    if (result.success) {
      const cacheInfo = result.cacheHitRate > 0
        ? picocolors.gray(`Cache hit rate: ${(result.cacheHitRate * 100).toFixed(0)}%`)
        : '';
      return picocolors.green(`All checks passed! ${cacheInfo}`);
    }

    const suggestions: string[] = [];

    suggestions.push(picocolors.yellow('Next steps:'));
    suggestions.push(`  ${picocolors.bold('nimata fix')} - Auto-fix simple issues`);
    suggestions.push(`  ${picocolors.bold('nimata prompt')} - Generate AI prompts for complex fixes`);

    return suggestions.join('\n');
  }
}
```

### 10.2 Terminal Output Examples

#### Success Output

```
✓ Validation passed (245ms)

✓ eslint       (45ms) - No issues [cached]
✓ typescript   (89ms) - No issues
✓ prettier     (12ms) - No issues [cached]
✓ tests        (99ms) - 24 passed

All checks passed! Cache hit rate: 65%
```

#### Failure Output

```
✗ Validation failed (1234ms)

✓ eslint       (123ms) - No issues
✗ typescript   (456ms) - 3 errors
✓ prettier     (45ms) - No issues
✗ tests        (610ms) - 2 failed

Errors found:

src/index.ts
  42:12 - Type 'string' is not assignable to type 'number' [TS2322]
  55:5 - Parameter 'x' implicitly has an 'any' type [TS7006]

src/utils.ts
  15:20 - Object is possibly 'undefined' [TS2532]

tests/index.test.ts
  Test "should handle empty input" failed

Next steps:
  nimata fix - Auto-fix simple issues
  nimata prompt - Generate AI prompts for complex fixes
```

### 10.3 JSON Output Format

```json
{
  "success": false,
  "totalErrors": 3,
  "totalWarnings": 1,
  "executionTime": 1234,
  "cacheHitRate": 0.65,
  "tools": {
    "eslint": {
      "tool": "eslint",
      "success": true,
      "errors": [],
      "warnings": [],
      "executionTime": 123,
      "fromCache": false
    },
    "typescript": {
      "tool": "typescript",
      "success": false,
      "errors": [
        {
          "filePath": "/Users/user/project/src/index.ts",
          "line": 42,
          "column": 12,
          "severity": "error",
          "message": "Type 'string' is not assignable to type 'number'",
          "ruleId": "TS2322",
          "source": "typescript"
        }
      ],
      "warnings": [],
      "executionTime": 456,
      "fromCache": false
    },
    "prettier": {
      "tool": "prettier",
      "success": true,
      "errors": [],
      "warnings": [],
      "executionTime": 45,
      "fromCache": false
    },
    "tests": {
      "tool": "bun-test",
      "success": false,
      "errors": [
        {
          "filePath": "/Users/user/project/tests/index.test.ts",
          "line": 10,
          "column": 0,
          "severity": "error",
          "message": "Test 'should handle empty input' failed",
          "source": "bun-test"
        }
      ],
      "warnings": [],
      "executionTime": 610,
      "fromCache": false
    }
  },
  "fileResults": {
    "/Users/user/project/src/index.ts": {
      "filePath": "/Users/user/project/src/index.ts",
      "issues": [
        {
          "filePath": "/Users/user/project/src/index.ts",
          "line": 42,
          "column": 12,
          "severity": "error",
          "message": "Type 'string' is not assignable to type 'number'",
          "ruleId": "TS2322",
          "source": "typescript"
        }
      ],
      "errorCount": 1,
      "warningCount": 0
    }
  },
  "timestamp": 1697654321000
}
```

---

## 11. Error Handling

### 11.1 Tool Failure Scenarios

| Scenario | Handling Strategy | Exit Code |
|----------|------------------|-----------|
| **Tool executable not found** | Log error, skip tool, continue with others | 0 (if other tools pass) |
| **Tool config invalid** | Log error, skip tool, continue with others | 0 (if other tools pass) |
| **Tool crashes** | Catch exception, log error, continue with others | 0 (if other tools pass) |
| **Tool timeout** | Kill process, log timeout, continue with others | 0 (if other tools pass) |
| **All tools fail** | Log all errors, return failure | 1 |
| **Cache corruption** | Clear cache, run without cache | 0 (if validation passes) |
| **File system error** | Log error, fail validation | 5 |

### 11.2 Graceful Degradation

```typescript
// packages/core/src/use-cases/validation-service.ts

export class ValidationService {
  async execute(options: ValidateOptions): Promise<Result<ValidationResult>> {
    try {
      const config = await this.configRepo.load();
      const files = await this.findFiles(config);

      // Orchestrator handles tool failures internally
      const toolResults = await this.toolOrchestrator.runAll(files, {
        useCache: !options.noCache,
        parallel: true
      });

      // Aggregate results even if some tools failed
      const aggregated = this.aggregateResults(toolResults);

      // Check if critical tools passed (ESLint + TypeScript)
      const criticalToolsPassed = this.checkCriticalTools(toolResults);

      if (!criticalToolsPassed) {
        return Result.failure('Critical tools failed');
      }

      return Result.success(aggregated);

    } catch (error) {
      logger.error('Validation service failed', { error });
      return Result.failure(`Validation failed: ${error.message}`);
    }
  }

  private checkCriticalTools(results: ToolResult[]): boolean {
    const criticalTools = ['eslint', 'typescript'];

    for (const toolName of criticalTools) {
      const result = results.find(r => r.tool === toolName);
      if (!result || !result.success) {
        return false;
      }
    }

    return true;
  }
}
```

### 11.3 Error Logging

```typescript
// packages/adapters/src/logger/pino-logger.ts

import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname'
    }
  },
  base: {
    service: 'nimata-validate'
  }
});

// Usage in error scenarios
logger.error('Tool execution failed', {
  tool: 'eslint',
  error: error.message,
  stack: error.stack,
  files: files.length,
  config: configPath
});
```

### 11.4 Exit Codes

```typescript
// apps/cli/src/commands/validate.ts

export class ValidateCommand {
  async handler(argv: Arguments): Promise<void> {
    const result = await this.validationService.execute({
      files: argv.files,
      noCache: argv.noCache,
      reporter: argv.reporter,
      verbose: argv.verbose
    });

    if (!result.isSuccess) {
      console.error(result.error);
      process.exit(3); // Configuration error
      return;
    }

    const validationResult = result.value!;

    // Present results
    const output = this.presenter.presentTerminal(validationResult);
    console.log(output);

    // Exit codes
    if (!validationResult.success) {
      if (validationResult.totalErrors > 0) {
        process.exit(1); // Validation errors found
      } else if (validationResult.totalWarnings > 0) {
        process.exit(2); // Warnings only
      }
    }

    process.exit(0); // Success
  }
}
```

---

## 12. Testing Strategy

### 12.1 Unit Testing

#### Test Coverage Requirements

| Component | Coverage Target | Mutation Score Target |
|-----------|----------------|----------------------|
| **ValidationService** | 100% | 80%+ |
| **ToolOrchestrator** | 100% | 80%+ |
| **CacheService** | 100% | 80%+ |
| **ESLintRunner** | 100% | 80%+ |
| **TypeScriptRunner** | 100% | 80%+ |
| **PrettierRunner** | 100% | 80%+ |
| **BunTestRunner** | 100% | 80%+ |
| **StrykerRunner** | 100% | 80%+ |
| **CacheRepository** | 100% | 80%+ |
| **ValidationPresenter** | 100% | 80%+ |

#### Example Unit Test

```typescript
// packages/core/tests/unit/use-cases/validation-service.test.ts

import { describe, it, expect, beforeEach, jest } from 'bun:test';
import { ValidationService } from '../../../src/use-cases/validation-service';
import type { IToolOrchestrator, ICacheService, IConfigRepository } from '../../../src/interfaces';

describe('ValidationService', () => {
  let sut: ValidationService;
  let mockOrchestrator: jest.Mocked<IToolOrchestrator>;
  let mockCacheService: jest.Mocked<ICacheService>;
  let mockConfigRepo: jest.Mocked<IConfigRepository>;

  beforeEach(() => {
    // Fresh mocks for each test (100% isolation)
    mockOrchestrator = {
      runAll: jest.fn(),
      runTool: jest.fn(),
      registerTool: jest.fn()
    };

    mockCacheService = {
      get: jest.fn(),
      set: jest.fn(),
      invalidate: jest.fn(),
      invalidateAll: jest.fn(),
      getStats: jest.fn()
    };

    mockConfigRepo = {
      load: jest.fn(),
      save: jest.fn()
    };

    sut = new ValidationService(mockOrchestrator, mockCacheService, mockConfigRepo);
  });

  it('should aggregate results from all tools', async () => {
    // Arrange
    const mockToolResults: ToolResult[] = [
      { tool: 'eslint', success: true, errors: [], warnings: [], executionTime: 100, fromCache: false },
      { tool: 'typescript', success: true, errors: [], warnings: [], executionTime: 200, fromCache: false }
    ];

    mockConfigRepo.load.mockResolvedValue({});
    mockOrchestrator.runAll.mockResolvedValue(mockToolResults);

    // Act
    const result = await sut.execute({ files: ['test.ts'] });

    // Assert
    expect(result.isSuccess).toBe(true);
    expect(result.value!.totalErrors).toBe(0);
    expect(result.value!.totalWarnings).toBe(0);
    expect(result.value!.success).toBe(true);
  });

  it('should return failure when critical tools fail', async () => {
    // Arrange
    const mockToolResults: ToolResult[] = [
      {
        tool: 'eslint',
        success: false,
        errors: [{ filePath: 'test.ts', line: 1, column: 1, severity: 'error', message: 'Error', source: 'eslint' }],
        warnings: [],
        executionTime: 100,
        fromCache: false
      }
    ];

    mockConfigRepo.load.mockResolvedValue({});
    mockOrchestrator.runAll.mockResolvedValue(mockToolResults);

    // Act
    const result = await sut.execute({ files: ['test.ts'] });

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.error).toContain('Critical tools failed');
  });
});
```

### 12.2 Integration Testing

#### Integration Test Examples

```typescript
// infrastructure/eslint-wrapper/tests/integration/eslint-execution.test.ts

import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { ESLintRunner } from '../../src/eslint-runner';
import { tmpdir } from 'os';
import { join } from 'path';

describe('ESLintRunner (Integration)', () => {
  let tempDir: string;
  let sut: ESLintRunner;

  beforeEach(async () => {
    tempDir = await Bun.tempDir();
    sut = new ESLintRunner();

    // Create test files
    await Bun.write(join(tempDir, 'test.ts'), 'const x: any = 1;'); // Should error with no-any
    await Bun.write(join(tempDir, '.eslintrc.json'), JSON.stringify({
      rules: {
        '@typescript-eslint/no-explicit-any': 'error'
      }
    }));
  });

  afterEach(async () => {
    await Bun.rmdir(tempDir, { recursive: true });
  });

  it('should detect ESLint errors in real files', async () => {
    // Act
    const result = await sut.run([join(tempDir, 'test.ts')], {});

    // Assert
    expect(result.tool).toBe('eslint');
    expect(result.success).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors[0].ruleId).toBe('@typescript-eslint/no-explicit-any');
  });
});
```

### 12.3 E2E Testing

```typescript
// apps/cli/tests/e2e/validate-command.test.ts

import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { spawn } from 'bun';

describe('nimata validate (E2E)', () => {
  let tempProjectDir: string;

  beforeEach(async () => {
    tempProjectDir = await setupTestProject();
  });

  afterEach(async () => {
    await cleanupTestProject(tempProjectDir);
  });

  it('should validate project and exit with code 0 on success', async () => {
    // Arrange - create valid project
    await createValidProject(tempProjectDir);

    // Act - run validate command
    const proc = spawn(['bun', 'run', 'nimata', 'validate'], {
      cwd: tempProjectDir,
      env: process.env
    });

    const output = await new Response(proc.stdout).text();
    const exitCode = await proc.exited;

    // Assert
    expect(exitCode).toBe(0);
    expect(output).toContain('Validation passed');
    expect(output).toContain('✓ eslint');
    expect(output).toContain('✓ typescript');
  });

  it('should validate project and exit with code 1 on errors', async () => {
    // Arrange - create project with errors
    await createProjectWithErrors(tempProjectDir);

    // Act - run validate command
    const proc = spawn(['bun', 'run', 'nimata', 'validate'], {
      cwd: tempProjectDir,
      env: process.env
    });

    const output = await new Response(proc.stdout).text();
    const exitCode = await proc.exited;

    // Assert
    expect(exitCode).toBe(1);
    expect(output).toContain('Validation failed');
    expect(output).toContain('✗ typescript');
    expect(output).toContain('errors');
  });
});
```

### 12.4 Performance Testing

```typescript
// tests/performance/validation-benchmark.ts

import { benchmark } from 'bun:test';
import { ValidationService } from '@nimata/core';

benchmark('validate with 100% cache hit (< 100ms)', async () => {
  const service = new ValidationService(...);

  // First run to populate cache
  await service.execute({ files: testFiles });

  // Second run should be < 100ms (cached)
  const startTime = Date.now();
  await service.execute({ files: testFiles });
  const elapsed = Date.now() - startTime;

  expect(elapsed).toBeLessThan(100);
});

benchmark('validate with 0% cache hit (< 30s)', async () => {
  const service = new ValidationService(...);

  // Clear cache
  await cacheService.invalidateAll();

  // Run without cache
  const startTime = Date.now();
  await service.execute({ files: testFiles, noCache: true });
  const elapsed = Date.now() - startTime;

  expect(elapsed).toBeLessThan(30000);
});
```

---

## 13. Performance Requirements

### 13.1 NFR-003 Validation

**Requirement:** Validation returns results in < 100ms for unchanged files with cache

**Validation Plan:**

1. **Setup:** Create medium project (10,000 LOC, 100 files)
2. **Run 1:** Validate without cache (populate cache)
3. **Run 2:** Validate with cache (no file changes)
4. **Measure:** Run 2 execution time must be < 100ms

**Performance Breakdown:**

| Component | Time Budget | Actual Target |
|-----------|-------------|---------------|
| **File Discovery (Bun.Glob)** | 10ms | < 5ms |
| **File Hashing (Bun.hash)** | 20ms | < 10ms |
| **Cache Lookup (SQLite)** | 30ms | < 20ms |
| **Result Aggregation** | 20ms | < 10ms |
| **Output Formatting** | 20ms | < 10ms |
| **Total** | **100ms** | **< 55ms** |

### 13.2 Benchmarking Approach

```typescript
// tests/performance/validation-benchmark.ts

export async function benchmarkCachedValidation() {
  // Setup: Create test project
  const projectDir = await createTestProject({
    files: 100,
    linesPerFile: 100,
    totalLOC: 10000
  });

  const service = new ValidationService(...);

  // Run 1: Populate cache
  await service.execute({ files: await findFiles(projectDir) });

  // Run 2: Measure cached validation
  const iterations = 100;
  const times: number[] = [];

  for (let i = 0; i < iterations; i++) {
    const startTime = performance.now();
    await service.execute({ files: await findFiles(projectDir) });
    const endTime = performance.now();
    times.push(endTime - startTime);
  }

  // Statistics
  const avg = times.reduce((a, b) => a + b, 0) / times.length;
  const min = Math.min(...times);
  const max = Math.max(...times);
  const p95 = times.sort()[Math.floor(times.length * 0.95)];

  console.log(`Cached validation performance (${iterations} iterations):`);
  console.log(`  Average: ${avg.toFixed(2)}ms`);
  console.log(`  Min: ${min.toFixed(2)}ms`);
  console.log(`  Max: ${max.toFixed(2)}ms`);
  console.log(`  P95: ${p95.toFixed(2)}ms`);

  // Assertion
  expect(p95).toBeLessThan(100); // NFR-003 requirement
}
```

### 13.3 Performance Monitoring

```typescript
// packages/core/src/use-cases/validation-service.ts

export class ValidationService {
  async execute(options: ValidateOptions): Promise<Result<ValidationResult>> {
    const metrics = {
      fileDiscovery: 0,
      fileHashing: 0,
      cacheLookup: 0,
      toolExecution: 0,
      resultAggregation: 0,
      outputFormatting: 0
    };

    const totalStart = performance.now();

    // File discovery
    const discoveryStart = performance.now();
    const files = await this.findFiles(config);
    metrics.fileDiscovery = performance.now() - discoveryStart;

    // File hashing
    const hashingStart = performance.now();
    const fileHashes = await this.hashFiles(files);
    metrics.fileHashing = performance.now() - hashingStart;

    // Cache lookup
    const cacheStart = performance.now();
    const cachedResults = await this.getCachedResults(files, fileHashes);
    metrics.cacheLookup = performance.now() - cacheStart;

    // Tool execution
    const executionStart = performance.now();
    const toolResults = await this.toolOrchestrator.runAll(files, options);
    metrics.toolExecution = performance.now() - executionStart;

    // Result aggregation
    const aggregationStart = performance.now();
    const aggregated = this.aggregateResults(toolResults);
    metrics.resultAggregation = performance.now() - aggregationStart;

    const totalTime = performance.now() - totalStart;

    // Log metrics if verbose
    if (options.verbose) {
      logger.info('Validation performance metrics', metrics);
    }

    return Result.success(aggregated);
  }
}
```

---

## 14. Acceptance Criteria Mapping

### 14.1 Story 2.1: ESLint Integration

**Acceptance Criteria → Test Cases:**

| Acceptance Criteria | Test Case | Test Type |
|---------------------|-----------|-----------|
| Runs ESLint programmatically via Node API | `it('should run ESLint via Node API')` | Unit |
| Respects project's .eslintrc.json | `it('should load .eslintrc.json config')` | Integration |
| Captures errors with file, line, rule | `it('should capture lint errors with metadata')` | Unit |
| Returns structured results | `it('should return ToolResult format')` | Unit |
| Handles ESLint errors gracefully | `it('should handle ESLint config errors')` | Unit |
| Supports incremental linting | `it('should support per-file linting')` | Unit |
| Logs execution time | `it('should measure execution time')` | Unit |

### 14.2 Story 2.2: TypeScript Compiler Integration

**Acceptance Criteria → Test Cases:**

| Acceptance Criteria | Test Case | Test Type |
|---------------------|-----------|-----------|
| Runs TypeScript compiler programmatically | `it('should run tsc via Compiler API')` | Unit |
| Executes type checking without emitting files | `it('should run noEmit mode')` | Unit |
| Captures type errors with metadata | `it('should capture diagnostics with location')` | Unit |
| Returns structured diagnostic results | `it('should return ToolResult format')` | Unit |
| Respects tsconfig.json | `it('should load tsconfig.json')` | Integration |
| Handles compiler errors gracefully | `it('should handle syntax errors')` | Unit |
| Supports incremental type checking | `it('should support incremental compilation')` | Unit |

### 14.3 Story 2.6: Intelligent Caching with SQLite

**Acceptance Criteria → Test Cases:**

| Acceptance Criteria | Test Case | Test Type |
|---------------------|-----------|-----------|
| Stores results in SQLite | `it('should store cache entry in SQLite')` | Integration |
| Uses file hash for invalidation | `it('should invalidate on file hash change')` | Unit |
| Invalidates on config change | `it('should invalidate on config hash change')` | Unit |
| Persists across runs | `it('should load cache from previous run')` | Integration |
| Can be manually cleared | `it('should clear cache with --no-cache flag')` | E2E |
| Prunes old entries (>100MB) | `it('should prune cache when size exceeds limit')` | Integration |
| Enables WAL mode | `it('should enable WAL mode on initialization')` | Integration |

### 14.4 Story 2.10: Unified Validate Command

**Acceptance Criteria → Test Cases:**

| Acceptance Criteria | Test Case | Test Type |
|---------------------|-----------|-----------|
| `nimata validate` runs all tools | `it('should orchestrate all tools')` | E2E |
| Supports --no-cache flag | `it('should bypass cache with --no-cache')` | E2E |
| Supports --quiet flag | `it('should suppress output with --quiet')` | E2E |
| Exit code 0 if all pass | `it('should exit with code 0 on success')` | E2E |
| Exit code 1 if any fail | `it('should exit with code 1 on errors')` | E2E |
| Cache improves performance (<2s) | `it('should complete in <2s with cache')` | Performance |
| First run completes in <30s | `it('should complete in <30s without cache')` | Performance |
| Works from any subdirectory | `it('should find project root from subdirectory')` | E2E |

---

## 15. Implementation Order

### 15.1 Sprint 0: Foundation (Week 0)

**Goal:** Set up infrastructure before story implementation

**Tasks:**
1. Define all interfaces in `packages/core/src/interfaces/`
2. Set up Turborepo with package dependencies
3. Configure TypeScript project references
4. Set up DI container with TSyringe
5. Configure Bun Test per package
6. Configure Stryker per package

**Deliverables:**
- All interfaces defined and reviewed
- Monorepo builds successfully
- DI container configured
- Test infrastructure ready

---

### 15.2 Sprint 3-4: Epic 2 Implementation (Weeks 1-2)

#### Swim Lane A: Core (Dev 1) - Sequential

**Week 1:**
- Story 2.10: ValidationService + ToolOrchestrator interfaces
- Story 2.10: Result aggregation logic
- Unit tests for ValidationService

**Week 2:**
- Story 2.10: ValidateCommand integration
- E2E tests for validate command

---

#### Swim Lane B: CLI (Dev 2) - Parallel with C/E

**Week 1:**
- Story 2.9: WatchService implementation
- Story 2.9: Bun.watch() integration
- Unit tests for WatchService

**Week 2:**
- Story 2.9: Debounce logic
- Story 2.9: Graceful shutdown handlers
- Integration tests for watch mode

---

#### Swim Lane C: Infrastructure (Dev 3 + Dev 4) - Parallel (5 independent wrappers)

**Dev 3:**

**Week 1:**
- Story 2.1: ESLintRunner implementation
- Story 2.2: TypeScriptRunner implementation
- Unit tests for both runners

**Week 2:**
- Story 2.3: PrettierRunner implementation
- Integration tests for all 3 runners

**Dev 4:**

**Week 1:**
- Story 2.4: BunTestRunner implementation
- Story 2.5: StrykerRunner implementation
- Unit tests for both runners

**Week 2:**
- Integration tests for both runners
- Error handling for all wrappers

---

#### Swim Lane E: Adapters (Dev 5) - Parallel with B/C

**Week 1:**
- Story 2.6: CacheRepository (SQLite)
- Story 2.6: WAL mode configuration
- Story 2.6: CacheService implementation
- Unit tests for CacheService

**Week 2:**
- Story 2.7: ValidationPresenter (terminal output)
- Story 2.8: ValidationPresenter (JSON output)
- Integration tests for cache
- Unit tests for presenter

---

### 15.3 Implementation Dependencies

```
Sprint 0 (Foundation)
  ↓
Week 1:
  ├─ Swim Lane A: ValidationService interfaces (blocks all)
  ├─ Swim Lane B: WatchService (parallel after interfaces)
  ├─ Swim Lane C: ESLintRunner + TypeScriptRunner (parallel after interfaces)
  ├─ Swim Lane C: BunTestRunner + StrykerRunner (parallel after interfaces)
  └─ Swim Lane E: CacheRepository + CacheService (parallel after interfaces)
  ↓
Week 2:
  ├─ Swim Lane A: ValidateCommand integration (depends on Week 1)
  ├─ Swim Lane B: Watch mode integration (depends on Week 1)
  ├─ Swim Lane C: PrettierRunner + integration tests (depends on Week 1)
  ├─ Swim Lane C: Integration tests for BunTest + Stryker (depends on Week 1)
  └─ Swim Lane E: ValidationPresenter + integration tests (depends on Week 1)
```

### 15.4 Critical Path

**Longest dependency chain:**

```
Sprint 0 (Foundation)
  → Week 1: ValidationService interfaces (Dev 1)
  → Week 1: All tool runners (Devs 3-4, parallel)
  → Week 2: ToolOrchestrator integration (Dev 1)
  → Week 2: ValidateCommand integration (Dev 1)
  → Week 2: E2E tests (Dev 1)
```

**Critical path duration:** 2 weeks (after Sprint 0)

**Parallelization benefit:** Without parallelization, Epic 2 would take 6+ weeks. With 5 developers in swim lanes, Epic 2 completes in 2 weeks (66% time savings).

---

## 16. Summary

### 16.1 Epic 2 Deliverables

**User Value:**
- Single `nimata validate` command orchestrates all quality tools
- Sub-100ms validation for unchanged files (NFR-003 compliance)
- Watch mode for iterative development
- Unified terminal output with actionable suggestions

**Technical Achievements:**
- Clean Architecture Lite implementation (3 layers)
- SQLite caching with WAL mode (3-6x faster than JSON)
- Parallel tool execution (40-60% faster than sequential)
- Graceful degradation (tool failures don't block others)
- 12 components with clear boundaries and responsibilities

**Quality Metrics:**
- 100% unit test coverage with 80%+ mutation score
- Integration tests for all tool wrappers and cache
- E2E tests for complete validate command workflow
- Performance benchmarks validate NFR-003 requirement

### 16.2 Developer Swim Lanes

| Swim Lane | Developer | Stories | Duration |
|-----------|-----------|---------|----------|
| **A (Core)** | Dev 1 | 2.10 | 2 weeks (sequential) |
| **B (CLI)** | Dev 2 | 2.9 | 2 weeks (parallel) |
| **C (Infrastructure)** | Dev 3 + Dev 4 | 2.1, 2.2, 2.3, 2.4, 2.5 | 2 weeks (parallel) |
| **E (Adapters)** | Dev 5 | 2.6, 2.7, 2.8 | 2 weeks (parallel) |

**Total:** 4-5 developers working in parallel for 2 weeks (after Sprint 0)

### 16.3 Success Criteria

**Performance:**
- ✅ Validation completes in < 100ms for unchanged files (cache hit)
- ✅ Validation completes in < 30s for medium project (cache miss)
- ✅ Cache hit rate > 80% in typical development workflow

**Quality:**
- ✅ 100% unit test coverage with 80%+ mutation score
- ✅ All integration tests passing
- ✅ All E2E tests passing
- ✅ Zero cache false positives (stale results)

**User Experience:**
- ✅ Single command runs all tools
- ✅ Clear terminal output with colored results
- ✅ JSON output for CI/CD integration
- ✅ Watch mode for iterative development
- ✅ Graceful degradation when tools fail

---

**Document Status:** ✅ Implementation Ready
**Last Updated:** 2025-10-16
**Related Documents:**
- `/Users/menoncello/repos/dev/nimata/docs/PRD.md`
- `/Users/menoncello/repos/dev/nimata/docs/epic-stories.md`
- `/Users/menoncello/repos/dev/nimata/docs/solution-architecture.md`
- `/Users/menoncello/repos/dev/nimata/docs/epic-alignment-matrix.md`
