# Technical Specification: Epic 3 - Fix Right - Intelligent Refactoring & Triage

**Project:** Nimata CLI Tool
**Epic:** Epic 3 - Fix Right
**Date:** 2025-10-16
**Version:** 1.0
**Status:** Draft

---

## Table of Contents

1. [Epic Overview](#1-epic-overview)
2. [Stories Summary](#2-stories-summary)
3. [Component Architecture](#3-component-architecture)
4. [Interfaces and Contracts](#4-interfaces-and-contracts)
5. [Data Models](#5-data-models)
6. [Safe AST Transformation Pattern](#6-safe-ast-transformation-pattern)
7. [Transformer Design](#7-transformer-design)
8. [Triage Algorithm](#8-triage-algorithm)
9. [AI Prompt Generation](#9-ai-prompt-generation)
10. [Preview Mode](#10-preview-mode)
11. [Error Handling](#11-error-handling)
12. [Testing Strategy](#12-testing-strategy)
13. [AST Testing Approach](#13-ast-testing-approach)
14. [Acceptance Criteria Mapping](#14-acceptance-criteria-mapping)
15. [Implementation Order](#15-implementation-order)

---

## 1. Epic Overview

### 1.1 Goal

Implement intelligent triage that routes simple fixes to static refactoring and complex issues to AI-assisted refactoring, providing 10x faster fixes for simple issues while generating context-aware AI prompts for complex refactoring.

### 1.2 Value Proposition

**Problem Being Solved:**
- Developers waste time manually fixing simple code quality issues (unused imports, type inference, code style)
- AI assistants are overused for trivial fixes, consuming API credits and time
- Complex refactoring requires manual context assembly for AI assistants

**Solution:**
- **Auto-fix pipeline**: AST-based transformations handle 70%+ of simple issues in milliseconds
- **Intelligent triage**: Automatically classify issues as auto-fixable vs manual
- **AI prompt generation**: Generate formatted prompts with full context for complex issues (Claude Code format)

**Impact:**
- 10x faster resolution for simple issues (2-3 seconds vs 30-60 seconds with AI)
- Reduced AI API costs (70% fewer simple prompts)
- Better AI results for complex issues (rich context included)

### 1.3 Technical Approach

**Core Technologies:**
- **ts-morph 22.x**: High-level TypeScript AST manipulation (chosen per ADR-005)
- **Bun 1.3+**: Native file operations, hashing, and performance optimization
- **Picocolors**: Terminal output with syntax highlighting
- **Prompts**: Interactive confirmation dialogs for preview mode

**Architecture Pattern:**
- **Clean Architecture Lite**: Use cases orchestrate transformers and triage logic
- **Plugin-based transformers**: Each transformer is independent and testable
- **Safe transformation pattern**: Validation → Transform → Verify → Commit (or rollback)

### 1.4 Success Criteria

- [ ] Auto-fix resolves 70%+ of simple issues without human intervention
- [ ] AST transformations never introduce syntax errors (100% safe)
- [ ] Preview mode shows clear before/after diffs with syntax highlighting
- [ ] Triage correctly classifies 90%+ of issues (auto vs manual)
- [ ] AI prompts include sufficient context for accurate refactoring suggestions
- [ ] All transformations are reversible (rollback on error)

---

## 2. Stories Summary

| Story ID | Title | Story Points | Primary Component | Swim Lane |
|----------|-------|--------------|-------------------|-----------|
| **3.1** | Remove unused imports | 3 | UnusedImportsTransformer | C (Transformers) |
| **3.2** | Infer explicit types | 5 | TypeInferenceTransformer | C (Transformers) |
| **3.3** | Apply code style fixes | 3 | CodeStyleTransformer | C (Transformers) |
| **3.4** | Safe AST transformation base | 5 | ASTRefactorer (base class) | C (Transformers) |
| **3.5** | Rollback on error | 3 | ASTRefactorer (error handling) | C (Transformers) |
| **3.6** | Triage issues (auto vs manual) | 5 | TriageService | A (Core) |
| **3.7** | Generate AI prompts for manual fixes | 5 | AIPromptGenerator (ClaudeCodePlugin) | D (AI Plugin) |
| **3.8** | Preview refactoring changes | 3 | DiffPresenter, RefactorWizard | E (Adapters) |
| **3.9** | Diff output with syntax highlighting | 2 | DiffPresenter | E (Adapters) |
| **3.10** | Unified fix command | 5 | FixCommand, RefactoringService | B (CLI) |

**Total Story Points:** 39
**Estimated Duration:** 3 sprints (6 weeks with 5 developers)

---

## 3. Component Architecture

### 3.1 Component Overview

Epic 3 consists of **10 primary components** organized across 4 architectural layers:

```
CLI Layer (apps/cli)
  └─ FixCommand, RefactorWizard
       ↓
Use Case Layer (packages/core)
  └─ RefactoringService, TriageService
       ↓
Adapter Layer (packages/adapters)
  └─ DiffPresenter
       ↓
Infrastructure Layer (infrastructure/ + plugins/)
  └─ ASTRefactorer, Transformers (3), AIPromptGenerator
```

### 3.2 Component Details

#### 3.2.1 RefactoringService (Use Case Layer)

**Location:** `packages/core/src/use-cases/refactoring-service.ts`

**Responsibilities:**
- Orchestrate AST transformations across multiple files
- Apply selected transformations in safe mode
- Coordinate with TriageService for issue classification
- Handle transformation failures and rollback

**Dependencies:**
- `IASTRefactorer` (infrastructure)
- `IConfigRepository` (adapters)
- `IFileSystem` (adapters)
- `ILogger` (adapters)

**Key Methods:**
```typescript
class RefactoringService {
  async applyTransformations(
    files: string[],
    transformations: TransformationType[],
    options: RefactorOptions
  ): Promise<RefactorResult>;

  async previewTransformations(
    files: string[],
    transformations: TransformationType[]
  ): Promise<DiffResult[]>;

  async rollbackTransformations(
    sessionId: string
  ): Promise<void>;
}
```

---

#### 3.2.2 TriageService (Use Case Layer)

**Location:** `packages/core/src/use-cases/triage-service.ts`

**Responsibilities:**
- Classify validation issues as auto-fixable or manual
- Calculate complexity score for each issue
- Recommend appropriate fix strategy (auto vs AI)
- Track triage accuracy metrics

**Dependencies:**
- `IClassifier` (core interface)
- `ILogger` (adapters)

**Key Methods:**
```typescript
class TriageService {
  async classifyIssues(
    issues: Issue[]
  ): Promise<TriageResult>;

  async calculateComplexity(
    issue: Issue
  ): Promise<ComplexityScore>;

  getRecommendation(
    category: TriageCategory
  ): FixStrategy;
}
```

---

#### 3.2.3 ASTRefactorer (Infrastructure Layer)

**Location:** `infrastructure/ts-morph-wrapper/src/safe-ast-refactorer.ts`

**Responsibilities:**
- Provide safe AST transformation API using ts-morph
- Implement syntax validation before committing changes
- Handle rollback on transformation errors
- Prevent memory leaks via proper `dispose()` calls

**Dependencies:**
- `ts-morph` library (22.x)
- `Bun.file()` for file operations

**Key Methods:**
```typescript
class ASTRefactorer {
  async applyTransformation(
    filePath: string,
    transformer: ITransformer
  ): Promise<Result<void>>;

  async validateSyntax(
    sourceFile: SourceFile
  ): Promise<ValidationResult>;

  async rollback(
    filePath: string,
    originalContent: string
  ): Promise<void>;
}
```

**Safety Pattern:**
1. Load source file into ts-morph Project
2. Store original content
3. Apply transformation
4. Validate syntax (no new diagnostics)
5. If valid: commit changes
6. If invalid: rollback to original content
7. Always dispose Project to prevent memory leaks

---

#### 3.2.4 UnusedImportsTransformer (Infrastructure Layer)

**Location:** `infrastructure/ts-morph-wrapper/src/transformers/unused-imports-transformer.ts`

**Responsibilities:**
- Detect unused import statements
- Remove entire import if no symbols are used
- Remove specific symbols from import lists if only some are unused
- Preserve side-effect imports (e.g., `import './polyfill'`)

**Algorithm:**
```typescript
class UnusedImportsTransformer implements ITransformer {
  transform(sourceFile: SourceFile): void {
    const imports = sourceFile.getImportDeclarations();

    for (const importDecl of imports) {
      // Skip side-effect imports (no named bindings)
      if (!importDecl.getNamedImports().length) continue;

      const namedImports = importDecl.getNamedImports();
      const unusedImports = namedImports.filter(imp => {
        const identifier = imp.getName();
        const usages = sourceFile.getDescendantsOfKind(
          SyntaxKind.Identifier
        ).filter(id => id.getText() === identifier);

        // Only the import declaration itself = unused
        return usages.length === 1;
      });

      // Remove entire import if all symbols are unused
      if (unusedImports.length === namedImports.length) {
        importDecl.remove();
      } else {
        // Remove only unused symbols
        unusedImports.forEach(imp => imp.remove());
      }
    }
  }
}
```

---

#### 3.2.5 TypeInferenceTransformer (Infrastructure Layer)

**Location:** `infrastructure/ts-morph-wrapper/src/transformers/type-inference-transformer.ts`

**Responsibilities:**
- Add explicit type annotations where TypeScript can infer types
- Target: function return types, variable declarations, class properties
- Only add types that improve readability (skip obvious primitives)

**Algorithm:**
```typescript
class TypeInferenceTransformer implements ITransformer {
  transform(sourceFile: SourceFile): void {
    // Add return types to functions without them
    sourceFile.getFunctions().forEach(fn => {
      if (!fn.getReturnTypeNode()) {
        const inferredType = fn.getReturnType().getText();
        if (this.shouldAddType(inferredType)) {
          fn.setReturnType(inferredType);
        }
      }
    });

    // Add types to variable declarations
    sourceFile.getVariableDeclarations().forEach(varDecl => {
      if (!varDecl.getTypeNode()) {
        const inferredType = varDecl.getType().getText();
        if (this.shouldAddType(inferredType)) {
          varDecl.setType(inferredType);
        }
      }
    });
  }

  private shouldAddType(type: string): boolean {
    // Skip obvious primitives and any
    const skipTypes = ['any', 'string', 'number', 'boolean'];
    return !skipTypes.includes(type) && type !== 'void';
  }
}
```

---

#### 3.2.6 CodeStyleTransformer (Infrastructure Layer)

**Location:** `infrastructure/ts-morph-wrapper/src/transformers/code-style-transformer.ts`

**Responsibilities:**
- Convert `var` to `const` or `let` based on reassignment analysis
- Convert function expressions to arrow functions (when safe)
- Add `readonly` modifiers to class properties never reassigned
- Apply consistent naming conventions

**Algorithm:**
```typescript
class CodeStyleTransformer implements ITransformer {
  transform(sourceFile: SourceFile): void {
    // Convert var to const/let
    sourceFile.getVariableDeclarations().forEach(varDecl => {
      const declarationKind = varDecl.getVariableStatement()?.getDeclarationKind();
      if (declarationKind === VariableDeclarationKind.Var) {
        const isReassigned = this.isVariableReassigned(varDecl);
        const newKind = isReassigned
          ? VariableDeclarationKind.Let
          : VariableDeclarationKind.Const;
        varDecl.getVariableStatement()?.setDeclarationKind(newKind);
      }
    });

    // Add readonly to class properties
    sourceFile.getClasses().forEach(cls => {
      cls.getProperties().forEach(prop => {
        if (!prop.isReadonly() && !this.isPropertyReassigned(prop)) {
          prop.setIsReadonly(true);
        }
      });
    });
  }

  private isVariableReassigned(varDecl: VariableDeclaration): boolean {
    const references = varDecl.findReferencesAsNodes();
    return references.some(ref => ref.wasForgotten() || ref.getParent()?.getKind() === SyntaxKind.BinaryExpression);
  }
}
```

---

#### 3.2.7 AIPromptGenerator (Plugin Layer)

**Location:** `plugins/plugin-claude-code/src/prompt-generator.ts`

**Responsibilities:**
- Generate Claude Code formatted prompts for manual fixes
- Extract relevant code context (function/class containing issue)
- Include imports and type definitions referenced
- Format prompt with clear sections: Context, Task, Code

**Prompt Template (Claude Code Format):**
```markdown
## Refactoring Task

**File:** `src/services/user-service.ts` (lines 42-68)

**Issue:** High cyclomatic complexity (complexity: 15, threshold: 10)

**Context:**
This function handles user authentication with multiple validation steps and error paths.

**Current Code:**
```typescript
import { User } from './models';
import { validateEmail, hashPassword } from './utils';

export async function authenticateUser(
  email: string,
  password: string
): Promise<User | null> {
  // [Current implementation with 15 complexity]
}
```

**Task:**
Reduce cyclomatic complexity by:
1. Extracting validation logic into separate functions
2. Using early returns to reduce nesting
3. Consider extracting error handling into a separate function

**Constraints:**
- Maintain exact same behavior and test coverage
- Preserve all error messages
- No breaking changes to public API
```

---

#### 3.2.8 DiffPresenter (Adapter Layer)

**Location:** `packages/adapters/src/presenters/diff-presenter.ts`

**Responsibilities:**
- Generate unified diffs for before/after code
- Apply syntax highlighting using Picocolors
- Format diffs for terminal display (80-column width)
- Show line numbers for easy navigation

**Output Format:**
```
File: src/index.ts
────────────────────────────────────────────────────────

  12 | -import { unused } from './utils';
  13 | import { used } from './helpers';
  14 |
  15 | export function process() {
  16 | -  let value = 42;
  16 | +  const value = 42;
  17 |   return used(value);
  18 | }

Changes: 2 lines removed, 1 line modified
```

---

#### 3.2.9 RefactorWizard (CLI Layer)

**Location:** `apps/cli/src/wizards/refactor-wizard.ts`

**Responsibilities:**
- Display interactive preview of proposed changes
- Prompt user for approval (all, one-by-one, or cancel)
- Show diff for each file before applying
- Provide summary of applied transformations

**Interaction Flow:**
```
1. Show summary: "Found 3 files with 8 auto-fixable issues"
2. For each file:
   - Display diff with syntax highlighting
   - Prompt: "Apply changes to src/index.ts? (y/n/a/q)"
     - y: Yes (apply this file)
     - n: No (skip this file)
     - a: Apply all remaining files
     - q: Quit without applying
3. Show final summary: "Applied 2/3 files, 6/8 issues fixed"
```

---

#### 3.2.10 FixCommand (CLI Layer)

**Location:** `apps/cli/src/commands/fix.ts`

**Responsibilities:**
- Entry point for `nimata fix` command
- Parse command-line flags (--preview, --no-preview, --dry-run)
- Orchestrate RefactoringService and TriageService
- Display results using DiffPresenter

**Command Signature:**
```bash
nimata fix [files...] [options]

Options:
  --preview, -p       Show preview before applying (default: true)
  --no-preview        Apply changes without preview
  --dry-run           Show what would be fixed without applying
  --transformations   Comma-separated list of transformations to apply
                      (unused-imports, type-inference, code-style)
  --all               Apply all available transformations (default)
```

---

## 4. Interfaces and Contracts

### 4.1 Core Interfaces

#### 4.1.1 IASTRefactorer

```typescript
/**
 * Interface for safe AST-based code transformations
 * Implementations must guarantee syntax validity after transformations
 */
export interface IASTRefactorer {
  /**
   * Apply a transformation to a file safely
   * @param filePath - Absolute path to file
   * @param transformer - Transformation to apply
   * @returns Result indicating success or failure with error details
   */
  applyTransformation(
    filePath: string,
    transformer: ITransformer
  ): Promise<Result<void>>;

  /**
   * Validate syntax of a source file
   * @param sourceFile - ts-morph SourceFile object
   * @returns Validation result with any syntax errors
   */
  validateSyntax(
    sourceFile: SourceFile
  ): Promise<ValidationResult>;

  /**
   * Rollback a file to its original content
   * @param filePath - Absolute path to file
   * @param originalContent - Content to restore
   */
  rollback(
    filePath: string,
    originalContent: string
  ): Promise<void>;

  /**
   * Dispose of ts-morph resources to prevent memory leaks
   */
  dispose(): Promise<void>;
}
```

---

#### 4.1.2 ITransformer

```typescript
/**
 * Base interface for all code transformers
 * Each transformer implements a specific refactoring pattern
 */
export interface ITransformer {
  /**
   * Unique identifier for this transformer
   */
  readonly id: string;

  /**
   * Human-readable name
   */
  readonly name: string;

  /**
   * Description of what this transformer does
   */
  readonly description: string;

  /**
   * Apply transformation to a source file
   * @param sourceFile - ts-morph SourceFile to transform
   * @throws Never throws - errors should be caught by ASTRefactorer
   */
  transform(sourceFile: SourceFile): void;

  /**
   * Check if this transformer can handle a specific issue
   * @param issue - Issue from validation results
   * @returns True if this transformer can fix the issue
   */
  canHandle(issue: Issue): boolean;
}
```

---

#### 4.1.3 ITriageService

```typescript
/**
 * Service for classifying issues as auto-fixable or manual
 */
export interface ITriageService {
  /**
   * Classify a list of validation issues
   * @param issues - Issues from validation results
   * @returns Triage result with categories and recommendations
   */
  classifyIssues(issues: Issue[]): Promise<TriageResult>;

  /**
   * Calculate complexity score for an issue
   * @param issue - Single issue to analyze
   * @returns Complexity score (0-100)
   */
  calculateComplexity(issue: Issue): Promise<ComplexityScore>;

  /**
   * Get recommended fix strategy for a triage category
   * @param category - Triage category (auto, manual, mixed)
   * @returns Fix strategy recommendation
   */
  getRecommendation(category: TriageCategory): FixStrategy;
}
```

---

#### 4.1.4 IRefactoringService

```typescript
/**
 * Orchestrates refactoring operations across multiple files
 */
export interface IRefactoringService {
  /**
   * Apply transformations to files
   * @param files - Absolute paths to files
   * @param transformations - Types of transformations to apply
   * @param options - Refactoring options (preview, dry-run, etc.)
   * @returns Result with statistics and errors
   */
  applyTransformations(
    files: string[],
    transformations: TransformationType[],
    options: RefactorOptions
  ): Promise<RefactorResult>;

  /**
   * Preview transformations without applying
   * @param files - Absolute paths to files
   * @param transformations - Types of transformations to preview
   * @returns Array of diffs for each file
   */
  previewTransformations(
    files: string[],
    transformations: TransformationType[]
  ): Promise<DiffResult[]>;

  /**
   * Rollback transformations from a session
   * @param sessionId - Session identifier from applyTransformations result
   */
  rollbackTransformations(sessionId: string): Promise<void>;
}
```

---

#### 4.1.5 IAIPromptGenerator

```typescript
/**
 * Generates AI-formatted prompts for manual refactoring
 */
export interface IAIPromptGenerator {
  /**
   * Generate prompt for a specific issue
   * @param issue - Issue requiring manual fix
   * @param context - Additional code context
   * @param format - Target AI format (claude-code, copilot)
   * @returns Formatted prompt string
   */
  generatePrompt(
    issue: Issue,
    context: CodeContext,
    format: AIFormat
  ): Promise<string>;

  /**
   * Extract relevant code context for an issue
   * @param issue - Issue to extract context for
   * @param filePath - File containing the issue
   * @returns Code context with imports, types, and surrounding code
   */
  extractContext(
    issue: Issue,
    filePath: string
  ): Promise<CodeContext>;

  /**
   * Generate batch prompt for multiple related issues
   * @param issues - Related issues to address together
   * @param format - Target AI format
   * @returns Combined prompt string
   */
  generateBatchPrompt(
    issues: Issue[],
    format: AIFormat
  ): Promise<string>;
}
```

---

## 5. Data Models

### 5.1 Core Types

#### 5.1.1 TransformationType

```typescript
/**
 * Supported transformation types
 */
export enum TransformationType {
  UnusedImports = 'unused-imports',
  TypeInference = 'type-inference',
  CodeStyle = 'code-style',
  All = 'all'
}
```

---

#### 5.1.2 RefactorOptions

```typescript
/**
 * Options for refactoring operations
 */
export interface RefactorOptions {
  /**
   * Show preview before applying changes
   * @default true
   */
  preview: boolean;

  /**
   * Only show what would be changed, don't apply
   * @default false
   */
  dryRun: boolean;

  /**
   * Apply changes to all files without confirmation
   * @default false
   */
  autoApprove: boolean;

  /**
   * Transformations to apply (or 'all')
   * @default [TransformationType.All]
   */
  transformations: TransformationType[];

  /**
   * File patterns to include
   * @default ['src/**\/*.ts', 'tests/**\/*.ts']
   */
  include: string[];

  /**
   * File patterns to exclude
   * @default ['node_modules/**', 'dist/**']
   */
  exclude: string[];
}
```

---

#### 5.1.3 RefactorResult

```typescript
/**
 * Result of refactoring operation
 */
export interface RefactorResult {
  /**
   * Unique session identifier for rollback
   */
  sessionId: string;

  /**
   * Overall success status
   */
  success: boolean;

  /**
   * Statistics about transformations applied
   */
  statistics: RefactorStatistics;

  /**
   * Results per file
   */
  fileResults: FileRefactorResult[];

  /**
   * Errors encountered during refactoring
   */
  errors: RefactorError[];

  /**
   * Total execution time in milliseconds
   */
  executionTime: number;
}

export interface RefactorStatistics {
  totalFiles: number;
  filesModified: number;
  filesSkipped: number;
  filesFailed: number;
  totalTransformations: number;
  successfulTransformations: number;
  failedTransformations: number;
}

export interface FileRefactorResult {
  filePath: string;
  success: boolean;
  transformationsApplied: TransformationType[];
  linesAdded: number;
  linesRemoved: number;
  linesModified: number;
  originalContent: string; // For rollback
  modifiedContent: string;
  error?: string;
}

export interface RefactorError {
  filePath: string;
  transformation: TransformationType;
  message: string;
  stack?: string;
}
```

---

#### 5.1.4 TriageResult

```typescript
/**
 * Result of issue triage classification
 */
export interface TriageResult {
  /**
   * Total issues analyzed
   */
  totalIssues: number;

  /**
   * Issues classified by category
   */
  categories: {
    autoFixable: CategorizedIssue[];
    manual: CategorizedIssue[];
    mixed: CategorizedIssue[]; // Partial auto-fix possible
  };

  /**
   * Recommended fix strategy
   */
  recommendation: FixStrategy;

  /**
   * Confidence in triage accuracy (0-100)
   */
  confidence: number;
}

export interface CategorizedIssue {
  issue: Issue;
  category: TriageCategory;
  complexity: ComplexityScore;
  recommendedTransformations: TransformationType[];
  requiresAI: boolean;
  aiPromptAvailable: boolean;
}

export enum TriageCategory {
  AutoFixable = 'auto-fixable',
  Manual = 'manual',
  Mixed = 'mixed'
}

export interface FixStrategy {
  autoFixFirst: boolean; // Apply auto-fixes first
  generatePrompts: boolean; // Generate AI prompts for manual issues
  parallelExecution: boolean; // Can run auto-fix and AI in parallel
}
```

---

#### 5.1.5 ComplexityScore

```typescript
/**
 * Complexity score for an issue
 */
export interface ComplexityScore {
  /**
   * Overall complexity (0-100)
   * 0-30: Low (auto-fixable)
   * 31-70: Medium (may require judgment)
   * 71-100: High (requires AI/human)
   */
  overall: number;

  /**
   * Factors contributing to complexity
   */
  factors: {
    cyclomaticComplexity?: number;
    linesOfCode?: number;
    dependencies?: number;
    nestingDepth?: number;
    testCoverage?: number;
  };

  /**
   * Explanation of score
   */
  reasoning: string;
}
```

---

#### 5.1.6 DiffResult

```typescript
/**
 * Diff result for preview mode
 */
export interface DiffResult {
  filePath: string;
  unified: string; // Unified diff format
  linesAdded: number;
  linesRemoved: number;
  linesModified: number;
  hunks: DiffHunk[];
}

export interface DiffHunk {
  oldStart: number;
  oldLines: number;
  newStart: number;
  newLines: number;
  lines: DiffLine[];
}

export interface DiffLine {
  type: 'add' | 'remove' | 'context';
  lineNumber: number;
  content: string;
}
```

---

#### 5.1.7 CodeContext

```typescript
/**
 * Code context for AI prompt generation
 */
export interface CodeContext {
  /**
   * File path
   */
  filePath: string;

  /**
   * Relevant imports
   */
  imports: string[];

  /**
   * Type definitions referenced
   */
  types: string[];

  /**
   * Function or class containing the issue
   */
  focusedCode: string;

  /**
   * Line numbers for the focused code
   */
  lineRange: { start: number; end: number };

  /**
   * Surrounding context (optional)
   */
  surroundingCode?: string;
}
```

---

#### 5.1.8 Issue

```typescript
/**
 * Issue from validation results
 */
export interface Issue {
  /**
   * File path
   */
  filePath: string;

  /**
   * Line number
   */
  line: number;

  /**
   * Column number (optional)
   */
  column?: number;

  /**
   * Severity
   */
  severity: 'error' | 'warning' | 'info';

  /**
   * Rule or error code
   */
  rule: string;

  /**
   * Human-readable message
   */
  message: string;

  /**
   * Source tool (eslint, typescript, etc.)
   */
  source: string;

  /**
   * Auto-fix available from tool
   */
  fixAvailable: boolean;
}
```

---

### 5.2 Type Guards and Utilities

```typescript
/**
 * Type guard for checking if an issue is auto-fixable
 */
export function isAutoFixable(issue: Issue): boolean {
  const autoFixableRules = [
    '@typescript-eslint/no-unused-vars',
    'no-unused-imports',
    'prefer-const',
    'no-var',
    // ... more rules
  ];

  return autoFixableRules.includes(issue.rule) || issue.fixAvailable;
}

/**
 * Type guard for checking if a transformation requires AI
 */
export function requiresAI(complexity: ComplexityScore): boolean {
  return complexity.overall > 70;
}

/**
 * Calculate transformation priority
 */
export function getTransformationPriority(
  transformation: TransformationType
): number {
  const priorities: Record<TransformationType, number> = {
    [TransformationType.UnusedImports]: 1, // Highest priority (safest)
    [TransformationType.CodeStyle]: 2,
    [TransformationType.TypeInference]: 3, // Lowest priority (most complex)
    [TransformationType.All]: 0 // Special case
  };

  return priorities[transformation] ?? 99;
}
```

---

## 6. Safe AST Transformation Pattern

### 6.1 Pattern Overview

The safe AST transformation pattern ensures that code transformations never introduce syntax errors or break existing functionality. This is critical for building trust with users.

**Core Principle:** Every transformation goes through a validation checkpoint before being committed.

### 6.2 Pattern Steps

```
1. Load Source File
   └─ Create ts-morph Project and add source file

2. Store Original Content
   └─ Keep backup for rollback in case of error

3. Apply Transformation
   └─ Execute transformer's transform() method

4. Validate Syntax
   └─ Check for pre-emit diagnostics (syntax errors)

5. Decision Point
   ├─ If Valid:
   │  ├─ Commit changes to disk
   │  └─ Log success
   │
   └─ If Invalid:
      ├─ Rollback to original content
      ├─ Log error with diagnostic details
      └─ Return failure result

6. Cleanup
   └─ Dispose Project to prevent memory leaks
```

### 6.3 Implementation

```typescript
export class SafeASTRefactorer implements IASTRefactorer {
  private readonly logger: ILogger;

  constructor(logger: ILogger) {
    this.logger = logger;
  }

  async applyTransformation(
    filePath: string,
    transformer: ITransformer
  ): Promise<Result<void>> {
    const project = new Project({
      useInMemoryFileSystem: false,
      skipFileDependencyResolution: true
    });

    let sourceFile: SourceFile | undefined;
    let originalContent: string = '';

    try {
      // Step 1: Load source file
      sourceFile = project.addSourceFileAtPath(filePath);

      // Step 2: Store original content for rollback
      originalContent = sourceFile.getFullText();

      this.logger.debug('Applying transformation', {
        transformer: transformer.id,
        file: filePath
      });

      // Step 3: Apply transformation
      transformer.transform(sourceFile);

      // Step 4: Validate syntax
      const validation = await this.validateSyntax(sourceFile);

      if (!validation.isValid) {
        // Step 5a: Invalid - rollback
        this.logger.warn('Transformation introduced syntax errors', {
          transformer: transformer.id,
          file: filePath,
          errors: validation.errors
        });

        sourceFile.replaceWithText(originalContent);
        await sourceFile.save();

        return Result.failure(
          `Transformation failed: ${validation.errors.join(', ')}`
        );
      }

      // Step 5b: Valid - commit
      await sourceFile.save();

      this.logger.info('Transformation applied successfully', {
        transformer: transformer.id,
        file: filePath
      });

      return Result.success(undefined);

    } catch (error) {
      // Unexpected error - rollback
      this.logger.error('Unexpected transformation error', {
        transformer: transformer.id,
        file: filePath,
        error: error.message,
        stack: error.stack
      });

      if (sourceFile && originalContent) {
        await this.rollback(filePath, originalContent);
      }

      return Result.failure(
        `Transformation crashed: ${error.message}`
      );

    } finally {
      // Step 6: Cleanup - prevent memory leaks
      project.dispose();
    }
  }

  async validateSyntax(sourceFile: SourceFile): Promise<ValidationResult> {
    const diagnostics = sourceFile.getPreEmitDiagnostics();

    if (diagnostics.length === 0) {
      return {
        isValid: true,
        errors: []
      };
    }

    const errors = diagnostics.map(diag => {
      const message = diag.getMessageText();
      const messageText = typeof message === 'string'
        ? message
        : message.getMessageText();

      return `Line ${diag.getLineNumber()}: ${messageText}`;
    });

    return {
      isValid: false,
      errors
    };
  }

  async rollback(filePath: string, originalContent: string): Promise<void> {
    try {
      await Bun.write(filePath, originalContent);
      this.logger.info('Rolled back transformation', { file: filePath });
    } catch (error) {
      this.logger.error('Rollback failed', {
        file: filePath,
        error: error.message
      });
      throw error;
    }
  }

  async dispose(): Promise<void> {
    // No persistent resources to dispose
    // Each transformation creates and disposes its own Project
  }
}
```

### 6.4 Memory Leak Prevention

**Problem:** ts-morph creates internal data structures that can leak memory if not disposed properly.

**Solution:**
1. Create new `Project` for each transformation (isolated)
2. Always call `project.dispose()` in `finally` block
3. Use `useInMemoryFileSystem: false` to avoid caching files
4. Skip dependency resolution for performance: `skipFileDependencyResolution: true`

**Memory Usage Pattern:**
```
Before transformation: 50MB
During transformation: 80MB (peak)
After project.dispose(): 52MB (normal variation)
```

### 6.5 Error Scenarios

| Scenario | Handling | User Impact |
|----------|----------|-------------|
| **Syntax error introduced** | Rollback, return failure | File unchanged, error logged |
| **ts-morph crashes** | Catch exception, rollback | File unchanged, error logged |
| **File write fails** | Exception propagates | Original content preserved |
| **Validation fails** | Rollback, return failure | File unchanged, diagnostic errors shown |
| **Out of memory** | Exception propagates | Process may crash (rare) |

---

## 7. Transformer Design

### 7.1 Base Transformer Class

All transformers implement the `ITransformer` interface and extend a common base class for shared functionality.

```typescript
/**
 * Abstract base class for all transformers
 * Provides common utilities and ensures consistent behavior
 */
export abstract class BaseTransformer implements ITransformer {
  abstract readonly id: string;
  abstract readonly name: string;
  abstract readonly description: string;

  /**
   * Apply transformation to source file
   * Subclasses must implement this method
   */
  abstract transform(sourceFile: SourceFile): void;

  /**
   * Check if this transformer can handle an issue
   * Default implementation checks rule name
   */
  canHandle(issue: Issue): boolean {
    const handledRules = this.getHandledRules();
    return handledRules.includes(issue.rule);
  }

  /**
   * Get list of ESLint/TypeScript rules this transformer handles
   */
  protected abstract getHandledRules(): string[];

  /**
   * Check if a node is inside a comment
   * Utility to avoid transforming commented-out code
   */
  protected isInComment(node: Node): boolean {
    const sourceFile = node.getSourceFile();
    const pos = node.getPos();
    const fullText = sourceFile.getFullText();

    // Simple heuristic: check if position is within comment ranges
    const commentRanges = sourceFile.getLeadingCommentRanges();
    return commentRanges.some(range =>
      pos >= range.getPos() && pos <= range.getEnd()
    );
  }

  /**
   * Check if changes should be applied to a node
   * Skips test files, declaration files, and comments
   */
  protected shouldTransform(node: Node): boolean {
    const sourceFile = node.getSourceFile();
    const filePath = sourceFile.getFilePath();

    // Skip .d.ts files
    if (filePath.endsWith('.d.ts')) {
      return false;
    }

    // Skip commented code
    if (this.isInComment(node)) {
      return false;
    }

    return true;
  }
}
```

---

### 7.2 Transformer 1: UnusedImportsTransformer

**Purpose:** Remove import statements for symbols that are never used in the file.

**Safety Considerations:**
- Never remove side-effect imports (e.g., `import './polyfill'`)
- Never remove type-only imports used in type annotations
- Preserve import order and formatting

```typescript
export class UnusedImportsTransformer extends BaseTransformer {
  readonly id = 'unused-imports';
  readonly name = 'Remove Unused Imports';
  readonly description = 'Removes import statements for symbols that are never used';

  protected getHandledRules(): string[] {
    return [
      '@typescript-eslint/no-unused-vars',
      'no-unused-imports',
      'unused-imports/no-unused-imports'
    ];
  }

  transform(sourceFile: SourceFile): void {
    const imports = sourceFile.getImportDeclarations();

    for (const importDecl of imports) {
      // Skip side-effect imports (no bindings)
      if (importDecl.getNamedImports().length === 0 &&
          !importDecl.getDefaultImport() &&
          !importDecl.getNamespaceImport()) {
        continue;
      }

      // Check default import usage
      const defaultImport = importDecl.getDefaultImport();
      if (defaultImport && !this.isIdentifierUsed(sourceFile, defaultImport.getText())) {
        defaultImport.remove();
      }

      // Check namespace import usage
      const namespaceImport = importDecl.getNamespaceImport();
      if (namespaceImport && !this.isIdentifierUsed(sourceFile, namespaceImport.getText())) {
        namespaceImport.remove();
      }

      // Check named imports usage
      const namedImports = importDecl.getNamedImports();
      const unusedNamedImports = namedImports.filter(namedImport => {
        const name = namedImport.getName();
        return !this.isIdentifierUsed(sourceFile, name);
      });

      // Remove unused named imports
      unusedNamedImports.forEach(imp => imp.remove());

      // Remove entire import declaration if all bindings were removed
      if (importDecl.getNamedImports().length === 0 &&
          !importDecl.getDefaultImport() &&
          !importDecl.getNamespaceImport()) {
        importDecl.remove();
      }
    }
  }

  private isIdentifierUsed(sourceFile: SourceFile, identifier: string): boolean {
    const identifiers = sourceFile.getDescendantsOfKind(SyntaxKind.Identifier);

    // Find all usages (excluding the import declaration itself)
    const usages = identifiers.filter(id => {
      if (id.getText() !== identifier) return false;

      // Skip if inside import declaration
      const parent = id.getParent();
      if (Node.isImportSpecifier(parent) ||
          Node.isImportClause(parent)) {
        return false;
      }

      return true;
    });

    return usages.length > 0;
  }
}
```

---

### 7.3 Transformer 2: TypeInferenceTransformer

**Purpose:** Add explicit type annotations where TypeScript can infer types, improving code readability.

**Strategy:**
- Target functions without return type annotations
- Target variables without type annotations (except obvious primitives)
- Skip adding types for `any`, `void`, and simple literals

```typescript
export class TypeInferenceTransformer extends BaseTransformer {
  readonly id = 'type-inference';
  readonly name = 'Add Explicit Type Annotations';
  readonly description = 'Adds type annotations where TypeScript can infer types';

  protected getHandledRules(): string[] {
    return [
      '@typescript-eslint/explicit-function-return-type',
      '@typescript-eslint/explicit-module-boundary-types'
    ];
  }

  transform(sourceFile: SourceFile): void {
    // Add return types to functions
    this.addFunctionReturnTypes(sourceFile);

    // Add types to variable declarations (optional - can be disabled)
    // this.addVariableTypes(sourceFile);
  }

  private addFunctionReturnTypes(sourceFile: SourceFile): void {
    const functions = [
      ...sourceFile.getFunctions(),
      ...sourceFile.getClasses().flatMap(c => c.getMethods()),
      ...sourceFile.getClasses().flatMap(c => c.getGetAccessors())
    ];

    for (const fn of functions) {
      if (!this.shouldTransform(fn)) continue;

      // Skip if already has return type
      if (fn.getReturnTypeNode()) continue;

      // Get inferred return type
      const returnType = fn.getReturnType();
      const typeText = returnType.getText(fn);

      // Skip unhelpful types
      if (this.shouldSkipType(typeText)) continue;

      // Add return type
      try {
        fn.setReturnType(typeText);
      } catch (error) {
        // Type text may be too complex or invalid
        // Skip this function
        console.warn(`Failed to set return type for ${fn.getName()}: ${error.message}`);
      }
    }
  }

  private addVariableTypes(sourceFile: SourceFile): void {
    const variables = sourceFile.getVariableDeclarations();

    for (const varDecl of variables) {
      if (!this.shouldTransform(varDecl)) continue;

      // Skip if already has type annotation
      if (varDecl.getTypeNode()) continue;

      // Skip if initialized with literal (type is obvious)
      const initializer = varDecl.getInitializer();
      if (initializer && this.isLiteralExpression(initializer)) {
        continue;
      }

      // Get inferred type
      const type = varDecl.getType();
      const typeText = type.getText(varDecl);

      // Skip unhelpful types
      if (this.shouldSkipType(typeText)) continue;

      // Add type annotation
      try {
        varDecl.setType(typeText);
      } catch (error) {
        // Type text may be too complex or invalid
        console.warn(`Failed to set type for ${varDecl.getName()}: ${error.message}`);
      }
    }
  }

  private shouldSkipType(typeText: string): boolean {
    const skipTypes = [
      'any',
      'void',
      'never',
      'unknown'
    ];

    // Skip unhelpful types
    if (skipTypes.includes(typeText)) return true;

    // Skip very long types (likely generated)
    if (typeText.length > 100) return true;

    return false;
  }

  private isLiteralExpression(node: Node): boolean {
    return Node.isStringLiteral(node) ||
           Node.isNumericLiteral(node) ||
           Node.isBooleanLiteral(node) ||
           Node.isNullLiteral(node);
  }
}
```

---

### 7.4 Transformer 3: CodeStyleTransformer

**Purpose:** Apply consistent code style (const over let, readonly modifiers, arrow functions).

**Safety Considerations:**
- Only convert `let` to `const` if variable is provably never reassigned
- Only add `readonly` if property is provably never reassigned
- Only convert to arrow functions if `this` binding doesn't change

```typescript
export class CodeStyleTransformer extends BaseTransformer {
  readonly id = 'code-style';
  readonly name = 'Apply Code Style Fixes';
  readonly description = 'Converts let to const, adds readonly, converts to arrow functions';

  protected getHandledRules(): string[] {
    return [
      'prefer-const',
      'no-var',
      '@typescript-eslint/prefer-readonly'
    ];
  }

  transform(sourceFile: SourceFile): void {
    // Convert var to const/let
    this.convertVarDeclarations(sourceFile);

    // Convert let to const where safe
    this.convertLetToConst(sourceFile);

    // Add readonly to class properties
    this.addReadonlyModifiers(sourceFile);

    // Convert function expressions to arrow functions (optional)
    // this.convertToArrowFunctions(sourceFile);
  }

  private convertVarDeclarations(sourceFile: SourceFile): void {
    const varStatements = sourceFile.getVariableStatements();

    for (const stmt of varStatements) {
      if (stmt.getDeclarationKind() !== VariableDeclarationKind.Var) {
        continue;
      }

      const declarations = stmt.getDeclarations();
      const allNeverReassigned = declarations.every(decl =>
        !this.isVariableReassigned(decl)
      );

      // Use const if none are reassigned, otherwise let
      const newKind = allNeverReassigned
        ? VariableDeclarationKind.Const
        : VariableDeclarationKind.Let;

      stmt.setDeclarationKind(newKind);
    }
  }

  private convertLetToConst(sourceFile: SourceFile): void {
    const letStatements = sourceFile.getVariableStatements().filter(stmt =>
      stmt.getDeclarationKind() === VariableDeclarationKind.Let
    );

    for (const stmt of letStatements) {
      const declarations = stmt.getDeclarations();
      const allNeverReassigned = declarations.every(decl =>
        !this.isVariableReassigned(decl)
      );

      if (allNeverReassigned) {
        stmt.setDeclarationKind(VariableDeclarationKind.Const);
      }
    }
  }

  private addReadonlyModifiers(sourceFile: SourceFile): void {
    const classes = sourceFile.getClasses();

    for (const cls of classes) {
      const properties = cls.getProperties();

      for (const prop of properties) {
        // Skip if already readonly
        if (prop.isReadonly()) continue;

        // Skip static properties (different semantics)
        if (prop.isStatic()) continue;

        // Check if property is ever reassigned
        if (!this.isPropertyReassigned(prop)) {
          prop.setIsReadonly(true);
        }
      }
    }
  }

  private isVariableReassigned(varDecl: VariableDeclaration): boolean {
    const name = varDecl.getName();
    const scope = varDecl.getScope();

    // Find all references to this variable
    const references = varDecl.findReferencesAsNodes();

    for (const ref of references) {
      // Skip the declaration itself
      if (ref === varDecl.getNameNode()) continue;

      // Check if reference is on left side of assignment
      const parent = ref.getParent();
      if (Node.isBinaryExpression(parent)) {
        const left = parent.getLeft();
        if (left === ref && parent.getOperatorToken().getText() === '=') {
          return true; // Reassignment found
        }
      }

      // Check for compound assignment (+=, -=, etc.)
      if (Node.isBinaryExpression(parent)) {
        const operator = parent.getOperatorToken().getText();
        if (operator.endsWith('=') && operator !== '===' && operator !== '!==') {
          return true;
        }
      }

      // Check for ++ or --
      if (Node.isPostfixUnaryExpression(parent) || Node.isPrefixUnaryExpression(parent)) {
        return true;
      }
    }

    return false;
  }

  private isPropertyReassigned(prop: PropertyDeclaration): boolean {
    const name = prop.getName();
    const cls = prop.getParent();

    if (!Node.isClassDeclaration(cls)) return false;

    // Check constructor for assignments
    const constructor = cls.getConstructors()[0];
    if (constructor) {
      const assignments = constructor.getDescendantsOfKind(SyntaxKind.BinaryExpression);
      for (const assignment of assignments) {
        const left = assignment.getLeft();
        if (Node.isPropertyAccessExpression(left)) {
          const propName = left.getName();
          if (propName === name) {
            // Constructor assignment is OK (initialization)
            // Check if there are multiple assignments
            const allAssignments = constructor.getDescendantsOfKind(SyntaxKind.BinaryExpression)
              .filter(a => {
                const l = a.getLeft();
                return Node.isPropertyAccessExpression(l) && l.getName() === name;
              });

            if (allAssignments.length > 1) return true;
          }
        }
      }
    }

    // Check methods for assignments
    const methods = cls.getMethods();
    for (const method of methods) {
      const assignments = method.getDescendantsOfKind(SyntaxKind.BinaryExpression);
      for (const assignment of assignments) {
        const left = assignment.getLeft();
        if (Node.isPropertyAccessExpression(left)) {
          const propName = left.getName();
          if (propName === name) {
            return true; // Property reassigned in method
          }
        }
      }
    }

    return false;
  }
}
```

---

### 7.5 Transformer Registration

All transformers are registered in the DI container and can be retrieved by ID:

```typescript
// apps/cli/src/container.ts
import { UnusedImportsTransformer } from '@nimata/infrastructure/ts-morph-wrapper';
import { TypeInferenceTransformer } from '@nimata/infrastructure/ts-morph-wrapper';
import { CodeStyleTransformer } from '@nimata/infrastructure/ts-morph-wrapper';

container.register<ITransformer>('UnusedImportsTransformer', {
  useClass: UnusedImportsTransformer
});

container.register<ITransformer>('TypeInferenceTransformer', {
  useClass: TypeInferenceTransformer
});

container.register<ITransformer>('CodeStyleTransformer', {
  useClass: CodeStyleTransformer
});

// Register all transformers as array for bulk operations
container.register<ITransformer[]>('AllTransformers', {
  useFactory: (c) => [
    c.resolve('UnusedImportsTransformer'),
    c.resolve('TypeInferenceTransformer'),
    c.resolve('CodeStyleTransformer')
  ]
});
```

---

## 8. Triage Algorithm

### 8.1 Algorithm Overview

The triage algorithm classifies validation issues into three categories:

1. **Auto-fixable**: Can be safely fixed by static transformers
2. **Manual**: Requires human judgment or AI assistance
3. **Mixed**: Partially auto-fixable, with remaining manual work

### 8.2 Classification Rules

```typescript
export class TriageService implements ITriageService {
  private readonly transformers: ITransformer[];
  private readonly logger: ILogger;

  constructor(transformers: ITransformer[], logger: ILogger) {
    this.transformers = transformers;
    this.logger = logger;
  }

  async classifyIssues(issues: Issue[]): Promise<TriageResult> {
    const categorized: {
      autoFixable: CategorizedIssue[];
      manual: CategorizedIssue[];
      mixed: CategorizedIssue[];
    } = {
      autoFixable: [],
      manual: [],
      mixed: []
    };

    for (const issue of issues) {
      const complexity = await this.calculateComplexity(issue);
      const category = this.determineCategory(issue, complexity);
      const recommendedTransformations = this.getRecommendedTransformations(issue);

      const categorizedIssue: CategorizedIssue = {
        issue,
        category,
        complexity,
        recommendedTransformations,
        requiresAI: complexity.overall > 70,
        aiPromptAvailable: complexity.overall > 50
      };

      switch (category) {
        case TriageCategory.AutoFixable:
          categorized.autoFixable.push(categorizedIssue);
          break;
        case TriageCategory.Manual:
          categorized.manual.push(categorizedIssue);
          break;
        case TriageCategory.Mixed:
          categorized.mixed.push(categorizedIssue);
          break;
      }
    }

    const recommendation = this.generateRecommendation(categorized);
    const confidence = this.calculateConfidence(categorized);

    return {
      totalIssues: issues.length,
      categories: categorized,
      recommendation,
      confidence
    };
  }

  private determineCategory(
    issue: Issue,
    complexity: ComplexityScore
  ): TriageCategory {
    // Rule-based classification

    // Check if any transformer can handle this issue
    const canBeAutoFixed = this.transformers.some(t => t.canHandle(issue));

    // Low complexity + transformer available = auto-fixable
    if (complexity.overall <= 30 && canBeAutoFixed) {
      return TriageCategory.AutoFixable;
    }

    // High complexity = manual
    if (complexity.overall > 70) {
      return TriageCategory.Manual;
    }

    // Medium complexity with transformer = mixed
    if (canBeAutoFixed) {
      return TriageCategory.Mixed;
    }

    // Default to manual
    return TriageCategory.Manual;
  }

  async calculateComplexity(issue: Issue): Promise<ComplexityScore> {
    // Complexity factors
    const factors: ComplexityScore['factors'] = {};

    // Factor 1: Rule type complexity
    const ruleComplexity = this.getRuleComplexity(issue.rule);

    // Factor 2: Code context complexity (if available)
    // This would require parsing the file, which is expensive
    // For now, use heuristics based on rule type

    // Calculate overall complexity (0-100)
    let overall = ruleComplexity;

    // Adjust based on severity
    if (issue.severity === 'error') {
      overall += 10; // Errors are more complex
    }

    // Adjust based on tool
    if (issue.source === 'typescript') {
      overall += 15; // TypeScript errors often require logic changes
    }

    // Cap at 100
    overall = Math.min(overall, 100);

    const reasoning = this.generateComplexityReasoning(issue, overall);

    return {
      overall,
      factors,
      reasoning
    };
  }

  private getRuleComplexity(rule: string): number {
    // Rule complexity mapping (0-100)
    const complexityMap: Record<string, number> = {
      // Low complexity (0-30) - auto-fixable
      '@typescript-eslint/no-unused-vars': 10,
      'no-unused-imports': 10,
      'prefer-const': 15,
      'no-var': 15,
      '@typescript-eslint/prefer-readonly': 20,

      // Medium complexity (31-70) - may require judgment
      '@typescript-eslint/explicit-function-return-type': 40,
      '@typescript-eslint/no-explicit-any': 50,
      'max-lines-per-function': 55,

      // High complexity (71-100) - requires AI/human
      'complexity': 80, // Cyclomatic complexity
      'max-depth': 75,
      'no-duplicate-code': 85,
      '@typescript-eslint/no-unsafe-call': 90
    };

    return complexityMap[rule] ?? 60; // Default: medium-high
  }

  private generateComplexityReasoning(
    issue: Issue,
    overall: number
  ): string {
    if (overall <= 30) {
      return `Low complexity issue that can be auto-fixed. Rule '${issue.rule}' has a straightforward fix.`;
    }

    if (overall <= 70) {
      return `Medium complexity issue. May require judgment or context understanding. Rule '${issue.rule}' affects code logic.`;
    }

    return `High complexity issue requiring human judgment or AI assistance. Rule '${issue.rule}' involves architectural decisions.`;
  }

  private getRecommendedTransformations(issue: Issue): TransformationType[] {
    const transformations: TransformationType[] = [];

    // Check each transformer
    for (const transformer of this.transformers) {
      if (transformer.canHandle(issue)) {
        // Map transformer ID to TransformationType
        const type = this.mapTransformerIdToType(transformer.id);
        if (type) {
          transformations.push(type);
        }
      }
    }

    return transformations;
  }

  private mapTransformerIdToType(id: string): TransformationType | null {
    const mapping: Record<string, TransformationType> = {
      'unused-imports': TransformationType.UnusedImports,
      'type-inference': TransformationType.TypeInference,
      'code-style': TransformationType.CodeStyle
    };

    return mapping[id] ?? null;
  }

  private generateRecommendation(categorized: TriageResult['categories']): FixStrategy {
    const autoCount = categorized.autoFixable.length;
    const manualCount = categorized.manual.length;
    const mixedCount = categorized.mixed.length;

    // If majority are auto-fixable, recommend auto-fix first
    const autoFixFirst = autoCount > (manualCount + mixedCount);

    // Generate prompts if there are manual issues
    const generatePrompts = manualCount > 0 || mixedCount > 0;

    // Parallel execution if both auto and manual work
    const parallelExecution = autoCount > 0 && manualCount > 0;

    return {
      autoFixFirst,
      generatePrompts,
      parallelExecution
    };
  }

  private calculateConfidence(categorized: TriageResult['categories']): number {
    // Confidence based on complexity scores
    const allIssues = [
      ...categorized.autoFixable,
      ...categorized.manual,
      ...categorized.mixed
    ];

    if (allIssues.length === 0) return 100;

    // Calculate average confidence
    // High confidence for issues far from complexity boundaries (30, 70)
    const confidences = allIssues.map(issue => {
      const complexity = issue.complexity.overall;

      // Distance from boundaries
      const distanceFrom30 = Math.abs(complexity - 30);
      const distanceFrom70 = Math.abs(complexity - 70);
      const minDistance = Math.min(distanceFrom30, distanceFrom70);

      // Normalize to 0-100 (higher distance = higher confidence)
      return Math.min(minDistance * 2, 100);
    });

    const avgConfidence = confidences.reduce((a, b) => a + b, 0) / confidences.length;

    return Math.round(avgConfidence);
  }

  getRecommendation(category: TriageCategory): FixStrategy {
    switch (category) {
      case TriageCategory.AutoFixable:
        return {
          autoFixFirst: true,
          generatePrompts: false,
          parallelExecution: false
        };

      case TriageCategory.Manual:
        return {
          autoFixFirst: false,
          generatePrompts: true,
          parallelExecution: false
        };

      case TriageCategory.Mixed:
        return {
          autoFixFirst: true,
          generatePrompts: true,
          parallelExecution: true
        };
    }
  }
}
```

### 8.3 Triage Accuracy Tracking

To continuously improve the triage algorithm, track accuracy metrics:

```typescript
export interface TriageMetrics {
  totalClassifications: number;
  correctClassifications: number;
  falsePositives: number; // Classified as auto but failed
  falseNegatives: number; // Classified as manual but could have been auto
  accuracy: number; // correctClassifications / totalClassifications
}

// Track metrics in database for analysis
export class TriageMetricsTracker {
  async recordClassification(
    issue: Issue,
    predicted: TriageCategory,
    actual: TriageCategory
  ): Promise<void> {
    // Store in SQLite for analysis
    // Use this data to tune complexity thresholds
  }
}
```

---

## 9. AI Prompt Generation

### 9.1 Claude Code Prompt Format

Claude Code prompts follow a structured format optimized for context understanding:

```typescript
export class AIPromptGenerator implements IAIPromptGenerator {
  private readonly logger: ILogger;

  async generatePrompt(
    issue: Issue,
    context: CodeContext,
    format: AIFormat
  ): Promise<string> {
    switch (format) {
      case AIFormat.ClaudeCode:
        return this.generateClaudeCodePrompt(issue, context);
      case AIFormat.Copilot:
        return this.generateCopilotPrompt(issue, context);
      default:
        throw new Error(`Unsupported AI format: ${format}`);
    }
  }

  private generateClaudeCodePrompt(
    issue: Issue,
    context: CodeContext
  ): string {
    const sections = [
      this.generateTaskSection(issue),
      this.generateContextSection(context),
      this.generateCodeSection(context),
      this.generateConstraintsSection(issue),
      this.generateGuidanceSection(issue)
    ];

    return sections.join('\n\n');
  }

  private generateTaskSection(issue: Issue): string {
    const severityEmoji = issue.severity === 'error' ? '❌' : '⚠️';

    return `## Refactoring Task

**File:** \`${issue.filePath}\` (line ${issue.line})

**Issue:** ${severityEmoji} ${issue.message}

**Rule:** \`${issue.rule}\`

**Severity:** ${issue.severity}`;
  }

  private generateContextSection(context: CodeContext): string {
    let section = `## Context

**File Location:** \`${context.filePath}\`
**Line Range:** ${context.lineRange.start}-${context.lineRange.end}`;

    if (context.imports.length > 0) {
      section += `\n\n**Imports:**\n\`\`\`typescript\n${context.imports.join('\n')}\n\`\`\``;
    }

    if (context.types.length > 0) {
      section += `\n\n**Type Definitions:**\n\`\`\`typescript\n${context.types.join('\n\n')}\n\`\`\``;
    }

    return section;
  }

  private generateCodeSection(context: CodeContext): string {
    return `## Current Code

\`\`\`typescript
${context.focusedCode}
\`\`\``;
  }

  private generateConstraintsSection(issue: Issue): string {
    const constraints = [
      'Maintain exact same behavior and test coverage',
      'Preserve all error messages and logging',
      'No breaking changes to public API',
      'Keep code readable and maintainable'
    ];

    // Add rule-specific constraints
    if (issue.rule === 'complexity') {
      constraints.push('Reduce cyclomatic complexity without adding unnecessary abstractions');
    }

    if (issue.rule.includes('type')) {
      constraints.push('Ensure type safety is improved or maintained');
    }

    return `## Constraints

${constraints.map((c, i) => `${i + 1}. ${c}`).join('\n')}`;
  }

  private generateGuidanceSection(issue: Issue): string {
    const guidance = this.getRuleSpecificGuidance(issue.rule);

    return `## Guidance

${guidance}

**Expected Outcome:**
- [ ] Issue resolved (${issue.rule})
- [ ] Tests still pass
- [ ] Code is more maintainable
- [ ] No new issues introduced`;
  }

  private getRuleSpecificGuidance(rule: string): string {
    const guidanceMap: Record<string, string> = {
      'complexity': `**Refactoring Strategies:**
1. Extract complex conditions into well-named functions
2. Use early returns to reduce nesting
3. Consider extracting error handling into a separate function
4. Break down the function into smaller, focused functions`,

      'max-lines-per-function': `**Refactoring Strategies:**
1. Identify distinct responsibilities within the function
2. Extract each responsibility into a separate function
3. Use descriptive function names that explain the "what" not the "how"
4. Consider creating a class if related functions share state`,

      '@typescript-eslint/no-explicit-any': `**Type Safety Improvement:**
1. Identify the actual type of the value (string, number, object, etc.)
2. Create an interface or type alias if it's a complex object
3. Use generics if the type varies based on usage
4. Consider using \`unknown\` if the type is truly unknown, with type guards`,

      'no-duplicate-code': `**DRY Principle:**
1. Identify the common pattern in the duplicated code
2. Extract the pattern into a reusable function or class
3. Parameterize the differences as function arguments
4. Update all call sites to use the new abstraction`
    };

    return guidanceMap[rule] ?? `**General Guidance:**
- Review the issue and understand why it was flagged
- Consider the simplest fix that maintains code quality
- Ensure the fix doesn't introduce new issues`;
  }

  async extractContext(issue: Issue, filePath: string): Promise<CodeContext> {
    const project = new Project();
    const sourceFile = project.addSourceFileAtPath(filePath);

    try {
      // Find the node at the issue location
      const node = sourceFile.getDescendantAtPos(
        this.getPositionFromLine(sourceFile, issue.line)
      );

      if (!node) {
        throw new Error(`Could not find node at line ${issue.line}`);
      }

      // Find containing function or class
      const container = this.findContainer(node);

      const imports = this.extractRelevantImports(sourceFile, container);
      const types = this.extractRelevantTypes(sourceFile, container);
      const focusedCode = container.getText();
      const lineRange = {
        start: sourceFile.getLineAndColumnAtPos(container.getStart()).line,
        end: sourceFile.getLineAndColumnAtPos(container.getEnd()).line
      };

      return {
        filePath,
        imports,
        types,
        focusedCode,
        lineRange
      };

    } finally {
      project.dispose();
    }
  }

  private findContainer(node: Node): Node {
    // Walk up the tree to find containing function or class
    let current: Node | undefined = node;

    while (current) {
      if (Node.isFunctionDeclaration(current) ||
          Node.isMethodDeclaration(current) ||
          Node.isArrowFunction(current) ||
          Node.isClassDeclaration(current)) {
        return current;
      }

      current = current.getParent();
    }

    // If no container found, return the original node
    return node;
  }

  private extractRelevantImports(
    sourceFile: SourceFile,
    container: Node
  ): string[] {
    // Get all identifiers used in container
    const identifiers = container.getDescendantsOfKind(SyntaxKind.Identifier);
    const usedNames = new Set(identifiers.map(id => id.getText()));

    // Find imports that match used names
    const imports = sourceFile.getImportDeclarations();
    const relevantImports: string[] = [];

    for (const importDecl of imports) {
      const namedImports = importDecl.getNamedImports();
      const hasRelevantImport = namedImports.some(ni =>
        usedNames.has(ni.getName())
      );

      if (hasRelevantImport || importDecl.getDefaultImport()) {
        relevantImports.push(importDecl.getText());
      }
    }

    return relevantImports;
  }

  private extractRelevantTypes(
    sourceFile: SourceFile,
    container: Node
  ): string[] {
    // Extract type aliases and interfaces used in container
    const types: string[] = [];

    // This is simplified - full implementation would trace type references
    const interfaces = sourceFile.getInterfaces();
    const typeAliases = sourceFile.getTypeAliases();

    // Add interfaces and types that are referenced in container
    const containerText = container.getText();

    for (const iface of interfaces) {
      const name = iface.getName();
      if (containerText.includes(name)) {
        types.push(iface.getText());
      }
    }

    for (const typeAlias of typeAliases) {
      const name = typeAlias.getName();
      if (containerText.includes(name)) {
        types.push(typeAlias.getText());
      }
    }

    return types;
  }

  private getPositionFromLine(sourceFile: SourceFile, line: number): number {
    // Convert line number to position
    const lines = sourceFile.getFullText().split('\n');
    let position = 0;

    for (let i = 0; i < line - 1 && i < lines.length; i++) {
      position += lines[i].length + 1; // +1 for newline
    }

    return position;
  }

  async generateBatchPrompt(
    issues: Issue[],
    format: AIFormat
  ): Promise<string> {
    // Group issues by file
    const issuesByFile = new Map<string, Issue[]>();

    for (const issue of issues) {
      const existing = issuesByFile.get(issue.filePath) ?? [];
      existing.push(issue);
      issuesByFile.set(issue.filePath, existing);
    }

    // Generate prompt for each file
    const prompts: string[] = [];

    for (const [filePath, fileIssues] of issuesByFile) {
      const context = await this.extractContext(fileIssues[0], filePath);

      // Create batch prompt header
      let batchPrompt = `# Batch Refactoring: ${filePath}\n\n`;
      batchPrompt += `**Total Issues:** ${fileIssues.length}\n\n`;

      // Add each issue
      for (let i = 0; i < fileIssues.length; i++) {
        batchPrompt += `## Issue ${i + 1}/${fileIssues.length}\n\n`;
        batchPrompt += await this.generatePrompt(fileIssues[i], context, format);
        batchPrompt += '\n\n---\n\n';
      }

      prompts.push(batchPrompt);
    }

    return prompts.join('\n\n');
  }
}
```

---

## 10. Preview Mode

### 10.1 Interactive Preview Flow

Preview mode shows users exactly what will change before applying transformations:

```typescript
export class RefactorWizard {
  private readonly presenter: DiffPresenter;
  private readonly prompts: any; // prompts library

  async showPreview(
    diffs: DiffResult[],
    options: RefactorOptions
  ): Promise<ApprovalResult> {
    // Show summary
    console.log(`\nFound ${diffs.length} files with auto-fixable issues:\n`);

    for (const diff of diffs) {
      console.log(`  ${diff.filePath}: +${diff.linesAdded} -${diff.linesRemoved}`);
    }

    console.log();

    // If auto-approve, skip interactive prompts
    if (options.autoApprove) {
      return {
        approved: diffs,
        rejected: [],
        cancelled: false
      };
    }

    const approved: DiffResult[] = [];
    const rejected: DiffResult[] = [];
    let applyAll = false;
    let cancelled = false;

    for (let i = 0; i < diffs.length; i++) {
      const diff = diffs[i];

      // Show diff with syntax highlighting
      console.log(`\n[${ i + 1}/${diffs.length}] ${diff.filePath}`);
      console.log('─'.repeat(80));
      this.presenter.present(diff);
      console.log('─'.repeat(80));

      if (applyAll) {
        approved.push(diff);
        continue;
      }

      // Prompt for approval
      const response = await this.prompts({
        type: 'select',
        name: 'action',
        message: 'Apply changes to this file?',
        choices: [
          { title: 'Yes (apply this file)', value: 'yes' },
          { title: 'No (skip this file)', value: 'no' },
          { title: 'Apply all remaining files', value: 'all' },
          { title: 'Quit (cancel all)', value: 'quit' }
        ]
      });

      switch (response.action) {
        case 'yes':
          approved.push(diff);
          break;

        case 'no':
          rejected.push(diff);
          break;

        case 'all':
          applyAll = true;
          approved.push(diff);
          break;

        case 'quit':
          cancelled = true;
          rejected.push(...diffs.slice(i));
          break;
      }

      if (cancelled) break;
    }

    return {
      approved,
      rejected,
      cancelled
    };
  }

  showSummary(result: ApprovalResult): void {
    console.log('\n' + '='.repeat(80));
    console.log('Preview Summary');
    console.log('='.repeat(80));

    if (result.cancelled) {
      console.log('\n⚠️  Operation cancelled by user');
    } else {
      console.log(`\n✅ Approved: ${result.approved.length} files`);
      console.log(`❌ Rejected: ${result.rejected.length} files`);
    }

    console.log();
  }
}

export interface ApprovalResult {
  approved: DiffResult[];
  rejected: DiffResult[];
  cancelled: boolean;
}
```

### 10.2 Diff Presentation with Syntax Highlighting

```typescript
export class DiffPresenter {
  private readonly colors: any; // picocolors

  constructor(colors: any) {
    this.colors = colors;
  }

  present(diff: DiffResult): void {
    for (const hunk of diff.hunks) {
      this.presentHunk(hunk);
    }
  }

  private presentHunk(hunk: DiffHunk): void {
    // Show hunk header
    const header = `@@ -${hunk.oldStart},${hunk.oldLines} +${hunk.newStart},${hunk.newLines} @@`;
    console.log(this.colors.cyan(header));

    // Show each line with color coding
    for (const line of hunk.lines) {
      const lineNum = this.formatLineNumber(line.lineNumber);

      switch (line.type) {
        case 'add':
          console.log(this.colors.green(`${lineNum} +${line.content}`));
          break;

        case 'remove':
          console.log(this.colors.red(`${lineNum} -${line.content}`));
          break;

        case 'context':
          console.log(this.colors.dim(`${lineNum}  ${line.content}`));
          break;
      }
    }
  }

  private formatLineNumber(num: number): string {
    return num.toString().padStart(5, ' ');
  }

  presentSummary(diff: DiffResult): void {
    let summary = '\n';
    summary += this.colors.bold(`Changes: `);

    if (diff.linesAdded > 0) {
      summary += this.colors.green(`+${diff.linesAdded} `);
    }

    if (diff.linesRemoved > 0) {
      summary += this.colors.red(`-${diff.linesRemoved} `);
    }

    if (diff.linesModified > 0) {
      summary += this.colors.yellow(`~${diff.linesModified}`);
    }

    console.log(summary);
  }
}
```

---

## 11. Error Handling

### 11.1 Error Scenarios and Recovery

| Error Scenario | Detection | Recovery Strategy | User Impact |
|----------------|-----------|-------------------|-------------|
| **Syntax error introduced** | Pre-emit diagnostics after transform | Rollback to original content | File unchanged, error logged |
| **ts-morph crashes** | Try-catch around transform | Rollback, log error | File unchanged, error logged |
| **File write fails** | Bun.write() throws | Exception propagates | Original content preserved |
| **Validation fails** | Diagnostics.length > 0 | Rollback, return failure | File unchanged, diagnostics shown |
| **Memory leak** | Project not disposed | Always dispose in finally block | Performance degradation prevented |
| **Transformer throws** | Try-catch in SafeASTRefactorer | Log error, skip file | File unchanged, other files continue |
| **Invalid AST modification** | ts-morph throws | Catch exception, rollback | File unchanged, error logged |

### 11.2 Error Handling Implementation

```typescript
export class RefactoringService implements IRefactoringService {
  async applyTransformations(
    files: string[],
    transformations: TransformationType[],
    options: RefactorOptions
  ): Promise<RefactorResult> {
    const sessionId = generateSessionId();
    const fileResults: FileRefactorResult[] = [];
    const errors: RefactorError[] = [];
    const startTime = Date.now();

    // Resolve transformers
    const transformers = this.resolveTransformers(transformations);

    for (const file of files) {
      try {
        const result = await this.applyToFile(file, transformers);
        fileResults.push(result);

        if (!result.success && result.error) {
          errors.push({
            filePath: file,
            transformation: TransformationType.All,
            message: result.error
          });
        }

      } catch (error) {
        // Unexpected error at file level
        this.logger.error('Failed to process file', {
          file,
          error: error.message,
          stack: error.stack
        });

        errors.push({
          filePath: file,
          transformation: TransformationType.All,
          message: error.message,
          stack: error.stack
        });

        fileResults.push({
          filePath: file,
          success: false,
          transformationsApplied: [],
          linesAdded: 0,
          linesRemoved: 0,
          linesModified: 0,
          originalContent: '',
          modifiedContent: '',
          error: error.message
        });
      }
    }

    const executionTime = Date.now() - startTime;
    const statistics = this.calculateStatistics(fileResults);

    return {
      sessionId,
      success: errors.length === 0,
      statistics,
      fileResults,
      errors,
      executionTime
    };
  }

  private async applyToFile(
    file: string,
    transformers: ITransformer[]
  ): Promise<FileRefactorResult> {
    const originalContent = await Bun.file(file).text();
    let modifiedContent = originalContent;
    const appliedTransformations: TransformationType[] = [];

    for (const transformer of transformers) {
      try {
        const result = await this.astRefactorer.applyTransformation(
          file,
          transformer
        );

        if (result.isSuccess) {
          appliedTransformations.push(
            this.mapTransformerIdToType(transformer.id) ?? TransformationType.All
          );

          // Read modified content for next transformer
          modifiedContent = await Bun.file(file).text();
        } else {
          // Transformation failed but file is safe (rolled back)
          this.logger.warn('Transformation failed', {
            file,
            transformer: transformer.id,
            error: result.error
          });
        }

      } catch (error) {
        // Unexpected error in transformer
        this.logger.error('Transformer crashed', {
          file,
          transformer: transformer.id,
          error: error.message
        });

        // Continue with next transformer
        continue;
      }
    }

    // Calculate diff statistics
    const { linesAdded, linesRemoved, linesModified } =
      this.calculateDiff(originalContent, modifiedContent);

    return {
      filePath: file,
      success: true,
      transformationsApplied: appliedTransformations,
      linesAdded,
      linesRemoved,
      linesModified,
      originalContent,
      modifiedContent
    };
  }

  private calculateDiff(
    original: string,
    modified: string
  ): { linesAdded: number; linesRemoved: number; linesModified: number } {
    // Simple line-based diff
    const originalLines = original.split('\n');
    const modifiedLines = modified.split('\n');

    let linesAdded = 0;
    let linesRemoved = 0;
    let linesModified = 0;

    // This is a simplified diff calculation
    // Full implementation would use a proper diff algorithm

    if (modifiedLines.length > originalLines.length) {
      linesAdded = modifiedLines.length - originalLines.length;
    } else if (modifiedLines.length < originalLines.length) {
      linesRemoved = originalLines.length - modifiedLines.length;
    }

    // Count modified lines
    const minLength = Math.min(originalLines.length, modifiedLines.length);
    for (let i = 0; i < minLength; i++) {
      if (originalLines[i] !== modifiedLines[i]) {
        linesModified++;
      }
    }

    return { linesAdded, linesRemoved, linesModified };
  }

  private calculateStatistics(
    fileResults: FileRefactorResult[]
  ): RefactorStatistics {
    return {
      totalFiles: fileResults.length,
      filesModified: fileResults.filter(r =>
        r.success && (r.linesAdded > 0 || r.linesRemoved > 0 || r.linesModified > 0)
      ).length,
      filesSkipped: fileResults.filter(r =>
        r.success && r.transformationsApplied.length === 0
      ).length,
      filesFailed: fileResults.filter(r => !r.success).length,
      totalTransformations: fileResults.reduce((sum, r) =>
        sum + r.transformationsApplied.length, 0
      ),
      successfulTransformations: fileResults.reduce((sum, r) =>
        r.success ? sum + r.transformationsApplied.length : sum, 0
      ),
      failedTransformations: fileResults.reduce((sum, r) =>
        !r.success ? sum + 1 : sum, 0
      )
    };
  }
}
```

### 11.3 Rollback Strategy

```typescript
export class SessionManager {
  private readonly sessions: Map<string, SessionData> = new Map();

  async storeSession(
    sessionId: string,
    fileResults: FileRefactorResult[]
  ): Promise<void> {
    this.sessions.set(sessionId, {
      timestamp: Date.now(),
      fileResults
    });

    // Store in SQLite for persistence across restarts
    await this.persistSession(sessionId, fileResults);
  }

  async rollbackSession(sessionId: string): Promise<void> {
    const session = this.sessions.get(sessionId);

    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    for (const result of session.fileResults) {
      if (result.success && result.originalContent) {
        try {
          await Bun.write(result.filePath, result.originalContent);
          this.logger.info('Rolled back file', { file: result.filePath });
        } catch (error) {
          this.logger.error('Rollback failed', {
            file: result.filePath,
            error: error.message
          });
        }
      }
    }

    this.sessions.delete(sessionId);
  }

  private async persistSession(
    sessionId: string,
    fileResults: FileRefactorResult[]
  ): Promise<void> {
    // Store in SQLite for rollback persistence
    const db = await this.openDatabase();

    await db.run(`
      INSERT INTO refactor_sessions (id, timestamp, data)
      VALUES (?, ?, ?)
    `, [sessionId, Date.now(), JSON.stringify(fileResults)]);
  }
}

interface SessionData {
  timestamp: number;
  fileResults: FileRefactorResult[];
}

function generateSessionId(): string {
  return `refactor-${Date.now()}-${Math.random().toString(36).substring(7)}`;
}
```

---

## 12. Testing Strategy

### 12.1 Test Types Overview

| Test Type | Location | Tools | Coverage Target | Mutation Testing |
|-----------|----------|-------|----------------|------------------|
| **Unit Tests** | `tests/unit/` per package | Bun Test | 100% line coverage | 80%+ mutation score |
| **Integration Tests** | `tests/integration/` per package | Bun Test | 80% coverage | No (too slow) |
| **E2E Tests** | `apps/cli/tests/e2e/` | Bun Test | Critical paths | No |

### 12.2 Unit Testing Strategy

**Test Isolation:** Every test uses fresh mocks via `beforeEach()`.

```typescript
// infrastructure/ts-morph-wrapper/tests/unit/unused-imports-transformer.test.ts
import { describe, it, expect, beforeEach } from 'bun:test';
import { UnusedImportsTransformer } from '../src/transformers/unused-imports-transformer';
import { Project } from 'ts-morph';

describe('UnusedImportsTransformer', () => {
  let sut: UnusedImportsTransformer;
  let project: Project;

  beforeEach(() => {
    sut = new UnusedImportsTransformer();
    project = new Project({ useInMemoryFileSystem: true });
  });

  afterEach(() => {
    project.dispose();
  });

  it('should remove entirely unused import', () => {
    // Arrange
    const sourceFile = project.createSourceFile('test.ts', `
      import { unused } from './utils';

      export function process() {
        return 42;
      }
    `);

    // Act
    sut.transform(sourceFile);

    // Assert
    const result = sourceFile.getFullText();
    expect(result).not.toContain("import { unused } from './utils'");
  });

  it('should preserve used import', () => {
    // Arrange
    const sourceFile = project.createSourceFile('test.ts', `
      import { used } from './utils';

      export function process() {
        return used();
      }
    `);

    // Act
    sut.transform(sourceFile);

    // Assert
    const result = sourceFile.getFullText();
    expect(result).toContain("import { used } from './utils'");
  });

  it('should remove only unused symbols from import', () => {
    // Arrange
    const sourceFile = project.createSourceFile('test.ts', `
      import { used, unused } from './utils';

      export function process() {
        return used();
      }
    `);

    // Act
    sut.transform(sourceFile);

    // Assert
    const result = sourceFile.getFullText();
    expect(result).toContain('used');
    expect(result).not.toContain('unused');
  });

  it('should preserve side-effect imports', () => {
    // Arrange
    const sourceFile = project.createSourceFile('test.ts', `
      import './polyfill';

      export function process() {
        return 42;
      }
    `);

    // Act
    sut.transform(sourceFile);

    // Assert
    const result = sourceFile.getFullText();
    expect(result).toContain("import './polyfill'");
  });
});
```

### 12.3 Integration Testing Strategy

**Test Real ts-morph Integration:**

```typescript
// infrastructure/ts-morph-wrapper/tests/integration/safe-ast-refactorer.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { SafeASTRefactorer } from '../src/safe-ast-refactorer';
import { UnusedImportsTransformer } from '../src/transformers/unused-imports-transformer';
import { tmpdir } from 'os';
import { join } from 'path';
import { mkdirSync, rmSync } from 'fs';

describe('SafeASTRefactorer (Integration)', () => {
  let sut: SafeASTRefactorer;
  let tempDir: string;
  let testFilePath: string;

  beforeEach(async () => {
    // Create temp directory for test files
    tempDir = join(tmpdir(), `nimata-test-${Date.now()}`);
    mkdirSync(tempDir, { recursive: true });

    testFilePath = join(tempDir, 'test.ts');

    // Create test file
    await Bun.write(testFilePath, `
      import { unused } from './utils';

      export function process() {
        return 42;
      }
    `);

    sut = new SafeASTRefactorer(createMockLogger());
  });

  afterEach(() => {
    // Clean up temp directory
    rmSync(tempDir, { recursive: true, force: true });
  });

  it('should apply transformation and modify file', async () => {
    // Arrange
    const transformer = new UnusedImportsTransformer();

    // Act
    const result = await sut.applyTransformation(testFilePath, transformer);

    // Assert
    expect(result.isSuccess).toBe(true);

    const modifiedContent = await Bun.file(testFilePath).text();
    expect(modifiedContent).not.toContain('unused');
  });

  it('should rollback on invalid transformation', async () => {
    // Arrange
    const originalContent = await Bun.file(testFilePath).text();

    // Create transformer that introduces syntax error
    const badTransformer = {
      id: 'bad',
      name: 'Bad Transformer',
      description: 'Introduces syntax errors',
      transform: (sourceFile) => {
        sourceFile.addStatements('this is not valid TypeScript!!!');
      },
      canHandle: () => false,
      getHandledRules: () => []
    };

    // Act
    const result = await sut.applyTransformation(testFilePath, badTransformer);

    // Assert
    expect(result.isSuccess).toBe(false);

    const currentContent = await Bun.file(testFilePath).text();
    expect(currentContent).toBe(originalContent); // Rolled back
  });

  it('should dispose project to prevent memory leaks', async () => {
    // Arrange
    const transformer = new UnusedImportsTransformer();
    const initialMemory = process.memoryUsage().heapUsed;

    // Act
    for (let i = 0; i < 10; i++) {
      await sut.applyTransformation(testFilePath, transformer);
    }

    const finalMemory = process.memoryUsage().heapUsed;
    const memoryGrowth = finalMemory - initialMemory;

    // Assert
    // Memory growth should be minimal (< 10MB for 10 iterations)
    expect(memoryGrowth).toBeLessThan(10 * 1024 * 1024);
  });
});
```

---

## 13. AST Testing Approach

### 13.1 AST Test Philosophy

**Goal:** Ensure transformations never introduce syntax errors or break semantics.

**Approach:**
1. **Golden file testing**: Store expected outputs for known inputs
2. **Syntax validation**: Every transformation must produce valid TypeScript
3. **Semantic preservation**: Test behavior before/after (if tests exist)
4. **Edge case coverage**: Test boundary conditions, empty files, complex structures

### 13.2 Golden File Testing

```typescript
// infrastructure/ts-morph-wrapper/tests/unit/golden-file.test.ts
import { describe, it, expect } from 'bun:test';
import { Project } from 'ts-morph';
import { UnusedImportsTransformer } from '../src/transformers/unused-imports-transformer';
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

describe('UnusedImportsTransformer - Golden Files', () => {
  const goldenDir = join(__dirname, 'golden', 'unused-imports');
  const inputFiles = readdirSync(goldenDir).filter(f => f.endsWith('.input.ts'));

  for (const inputFile of inputFiles) {
    const testName = inputFile.replace('.input.ts', '');
    const expectedFile = join(goldenDir, `${testName}.expected.ts`);

    it(`should match golden output for ${testName}`, () => {
      // Arrange
      const input = readFileSync(join(goldenDir, inputFile), 'utf-8');
      const expected = readFileSync(expectedFile, 'utf-8');

      const project = new Project({ useInMemoryFileSystem: true });
      const sourceFile = project.createSourceFile('test.ts', input);
      const transformer = new UnusedImportsTransformer();

      // Act
      transformer.transform(sourceFile);
      const actual = sourceFile.getFullText();

      // Assert
      expect(actual.trim()).toBe(expected.trim());

      // Cleanup
      project.dispose();
    });
  }
});
```

**Golden File Structure:**
```
tests/unit/golden/unused-imports/
├── simple-unused.input.ts
├── simple-unused.expected.ts
├── partial-unused.input.ts
├── partial-unused.expected.ts
├── side-effect.input.ts
├── side-effect.expected.ts
├── type-only.input.ts
├── type-only.expected.ts
└── complex-imports.input.ts
└── complex-imports.expected.ts
```

### 13.3 Syntax Validation Testing

```typescript
// Test that every transformation produces valid TypeScript
describe('Syntax Validation', () => {
  const transformers = [
    new UnusedImportsTransformer(),
    new TypeInferenceTransformer(),
    new CodeStyleTransformer()
  ];

  for (const transformer of transformers) {
    it(`${transformer.name} should never introduce syntax errors`, () => {
      // Test with various input files
      const testFiles = getTestFiles();

      for (const testFile of testFiles) {
        const project = new Project();
        const sourceFile = project.addSourceFileAtPath(testFile);

        // Apply transformation
        transformer.transform(sourceFile);

        // Check for syntax errors
        const diagnostics = sourceFile.getPreEmitDiagnostics();

        if (diagnostics.length > 0) {
          const errors = diagnostics.map(d => d.getMessageText()).join(', ');
          throw new Error(
            `Transformer ${transformer.name} introduced syntax errors in ${testFile}: ${errors}`
          );
        }

        project.dispose();
      }
    });
  }
});
```

### 13.4 Semantic Preservation Testing

```typescript
// Test that transformations don't change program behavior
describe('Semantic Preservation', () => {
  it('should preserve behavior after unused imports removal', async () => {
    const project = new Project({ useInMemoryFileSystem: true });

    // Create test file with tests
    const sourceFile = project.createSourceFile('test.ts', `
      import { add, multiply, unused } from './utils';

      export function calculate(a: number, b: number): number {
        return add(a, b) + multiply(a, b);
      }
    `);

    const testFile = project.createSourceFile('test.test.ts', `
      import { expect, test } from 'bun:test';
      import { calculate } from './test';

      test('calculate should work', () => {
        expect(calculate(2, 3)).toBe(11); // 2+3 + 2*3 = 5 + 6 = 11
      });
    `);

    // Run tests before transformation
    const beforeResult = await runTests(project);
    expect(beforeResult.passed).toBe(true);

    // Apply transformation
    const transformer = new UnusedImportsTransformer();
    transformer.transform(sourceFile);

    // Run tests after transformation
    const afterResult = await runTests(project);
    expect(afterResult.passed).toBe(true);

    // Behavior preserved
    expect(beforeResult.output).toBe(afterResult.output);

    project.dispose();
  });
});
```

---

## 14. Acceptance Criteria Mapping

### 14.1 Story 3.1: Remove Unused Imports

**Acceptance Criteria → Test Cases:**

| AC | Description | Test Case |
|----|-------------|-----------|
| AC-1 | Identifies import statements where imported symbols are never used | `unused-imports-transformer.test.ts::should detect unused import` |
| AC-2 | Removes entire import statement if no symbols are used | `unused-imports-transformer.test.ts::should remove entirely unused import` |
| AC-3 | Removes specific symbols from import lists if only some are unused | `unused-imports-transformer.test.ts::should remove only unused symbols` |
| AC-4 | Preserves used imports correctly | `unused-imports-transformer.test.ts::should preserve used import` |
| AC-5 | Handles type imports correctly | `unused-imports-transformer.test.ts::should handle type-only imports` |
| AC-6 | Safe: never removes imports with side effects | `unused-imports-transformer.test.ts::should preserve side-effect imports` |

---

### 14.2 Story 3.2: Infer Explicit Types

**Acceptance Criteria → Test Cases:**

| AC | Description | Test Case |
|----|-------------|-----------|
| AC-1 | Adds return type annotations to functions without them | `type-inference-transformer.test.ts::should add return type to function` |
| AC-2 | Adds type annotations to variables without them (except obvious primitives) | `type-inference-transformer.test.ts::should add type to variable` |
| AC-3 | Skips adding types for `any`, `void`, and simple literals | `type-inference-transformer.test.ts::should skip unhelpful types` |
| AC-4 | Preserves existing type annotations | `type-inference-transformer.test.ts::should not overwrite existing types` |
| AC-5 | Handles complex types correctly | `type-inference-transformer.test.ts::should handle complex union types` |

---

### 14.3 Story 3.3: Apply Code Style Fixes

**Acceptance Criteria → Test Cases:**

| AC | Description | Test Case |
|----|-------------|-----------|
| AC-1 | Converts `var` to `const` or `let` based on reassignment | `code-style-transformer.test.ts::should convert var to const when not reassigned` |
| AC-2 | Converts `let` to `const` when variable is never reassigned | `code-style-transformer.test.ts::should convert let to const` |
| AC-3 | Adds `readonly` modifiers to class properties never reassigned | `code-style-transformer.test.ts::should add readonly to property` |
| AC-4 | Preserves formatting and comments | `code-style-transformer.test.ts::should preserve comments` |
| AC-5 | Safe: never converts if variable is reassigned in any scope | `code-style-transformer.test.ts::should not convert reassigned variable` |

---

### 14.4 Story 3.4: Safe AST Transformation Base

**Acceptance Criteria → Test Cases:**

| AC | Description | Test Case |
|----|-------------|-----------|
| AC-1 | Validates syntax after every transformation | `safe-ast-refactorer.test.ts::should validate syntax after transform` |
| AC-2 | Rolls back on syntax errors | `safe-ast-refactorer.test.ts::should rollback on syntax error` |
| AC-3 | Disposes ts-morph Project to prevent memory leaks | `safe-ast-refactorer.test.ts::should dispose project` |
| AC-4 | Never commits changes if validation fails | `safe-ast-refactorer.test.ts::should not commit invalid changes` |
| AC-5 | Logs errors with diagnostic details | `safe-ast-refactorer.test.ts::should log errors` |

---

### 14.5 Story 3.5: Rollback on Error

**Acceptance Criteria → Test Cases:**

| AC | Description | Test Case |
|----|-------------|-----------|
| AC-1 | Restores original file content on transformation error | `safe-ast-refactorer.test.ts::should rollback on error` |
| AC-2 | Continues processing other files after one fails | `refactoring-service.test.ts::should continue after file failure` |
| AC-3 | Tracks which files failed and why | `refactoring-service.test.ts::should track errors` |
| AC-4 | Provides rollback mechanism for entire session | `session-manager.test.ts::should rollback session` |

---

### 14.6 Story 3.6: Triage Issues

**Acceptance Criteria → Test Cases:**

| AC | Description | Test Case |
|----|-------------|-----------|
| AC-1 | Classifies issues as auto-fixable, manual, or mixed | `triage-service.test.ts::should classify issues` |
| AC-2 | Calculates complexity score for each issue | `triage-service.test.ts::should calculate complexity` |
| AC-3 | Recommends appropriate fix strategy | `triage-service.test.ts::should recommend fix strategy` |
| AC-4 | Achieves 90%+ accuracy in classification | `triage-service.test.ts::should maintain high accuracy` |

---

### 14.7 Story 3.7: Generate AI Prompts

**Acceptance Criteria → Test Cases:**

| AC | Description | Test Case |
|----|-------------|-----------|
| AC-1 | Generates Claude Code formatted prompts | `ai-prompt-generator.test.ts::should generate claude code prompt` |
| AC-2 | Extracts relevant code context (function/class containing issue) | `ai-prompt-generator.test.ts::should extract context` |
| AC-3 | Includes imports and type definitions referenced | `ai-prompt-generator.test.ts::should include imports and types` |
| AC-4 | Formats prompt with clear sections (Context, Task, Code) | `ai-prompt-generator.test.ts::should format sections` |
| AC-5 | Limits context size to <4KB | `ai-prompt-generator.test.ts::should limit context size` |

---

### 14.8 Story 3.8: Preview Refactoring Changes

**Acceptance Criteria → Test Cases:**

| AC | Description | Test Case |
|----|-------------|-----------|
| AC-1 | Shows unified diffs for before/after code | `diff-presenter.test.ts::should generate unified diff` |
| AC-2 | Applies syntax highlighting using Picocolors | `diff-presenter.test.ts::should apply syntax highlighting` |
| AC-3 | Prompts user for approval (all, one-by-one, or cancel) | `refactor-wizard.test.ts::should show approval prompt` |
| AC-4 | Shows summary of applied transformations | `refactor-wizard.test.ts::should show summary` |

---

### 14.9 Story 3.9: Diff Output with Syntax Highlighting

**Acceptance Criteria → Test Cases:**

| AC | Description | Test Case |
|----|-------------|-----------|
| AC-1 | Green for added lines | `diff-presenter.test.ts::should color added lines green` |
| AC-2 | Red for removed lines | `diff-presenter.test.ts::should color removed lines red` |
| AC-3 | Dim for context lines | `diff-presenter.test.ts::should dim context lines` |
| AC-4 | Shows line numbers for navigation | `diff-presenter.test.ts::should show line numbers` |

---

### 14.10 Story 3.10: Unified Fix Command

**Acceptance Criteria → Test Cases:**

| AC | Description | Test Case |
|----|-------------|-----------|
| AC-1 | `nimata fix` executes complete fix workflow | `fix-command.test.ts::should run fix workflow` |
| AC-2 | Supports flags: --preview, --no-preview, --dry-run | `fix-command.test.ts::should support flags` |
| AC-3 | Integrates RefactoringService and TriageService | `fix-command.test.ts::should integrate services` |
| AC-4 | Displays results using DiffPresenter | `fix-command.test.ts::should display results` |
| AC-5 | Exit code 0 if successful, 1 if errors | `fix-command.test.ts::should return correct exit code` |

---

## 15. Implementation Order

### 15.1 Recommended Sequence

The following implementation order respects dependencies and enables parallel work:

#### Phase 1: Foundation (Week 1)

**Sequential - Must complete before Phase 2**

1. **Story 3.4: Safe AST Transformation Base** (5 points)
   - Implement `SafeASTRefactorer` class
   - Implement syntax validation pattern
   - Implement rollback mechanism
   - Write unit tests + integration tests
   - **Blocking:** All transformers depend on this

2. **Story 3.5: Rollback on Error** (3 points)
   - Enhance error handling in `SafeASTRefactorer`
   - Implement session management
   - Write unit tests
   - **Blocking:** Required for safe transformations

#### Phase 2: Parallel Transformer Development (Week 2-3)

**Parallel - Can work simultaneously after Phase 1**

**Swim Lane C1 (Developer 1):**
3. **Story 3.1: Remove Unused Imports** (3 points)
   - Implement `UnusedImportsTransformer`
   - Write golden file tests
   - Write unit tests

**Swim Lane C2 (Developer 2):**
4. **Story 3.2: Infer Explicit Types** (5 points)
   - Implement `TypeInferenceTransformer`
   - Write golden file tests
   - Write unit tests

**Swim Lane C3 (Developer 2):**
5. **Story 3.3: Apply Code Style Fixes** (3 points)
   - Implement `CodeStyleTransformer`
   - Write golden file tests
   - Write unit tests

**Swim Lane A (Developer 3):**
6. **Story 3.6: Triage Issues** (5 points)
   - Implement `TriageService`
   - Implement classification algorithm
   - Write unit tests

**Swim Lane D (Developer 4):**
7. **Story 3.7: Generate AI Prompts** (5 points)
   - Implement `AIPromptGenerator` (in ClaudeCodePlugin)
   - Implement context extraction
   - Write unit tests

**Swim Lane E (Developer 5):**
8. **Story 3.8: Preview Refactoring Changes** (3 points)
   - Implement `RefactorWizard`
   - Implement interactive approval flow
   - Write unit tests

9. **Story 3.9: Diff Output with Syntax Highlighting** (2 points)
   - Implement `DiffPresenter`
   - Apply Picocolors formatting
   - Write unit tests

#### Phase 3: Integration (Week 3)

**Sequential - Depends on Phase 2 completion**

10. **Story 3.10: Unified Fix Command** (5 points)
    - Implement `RefactoringService`
    - Implement `FixCommand`
    - Integrate all components
    - Write E2E tests

### 15.2 Dependency Graph

```
Phase 1 (Sequential):
  3.4 (ASTRefactorer base) → 3.5 (Rollback on error)
    ↓
Phase 2 (Parallel):
  3.1 (Unused imports)       ─┐
  3.2 (Type inference)        │ (all depend on 3.4 + 3.5)
  3.3 (Code style)            │
  3.6 (Triage)                ├─→ Phase 3
  3.7 (AI prompts)            │
  3.8 (Preview mode)          │
  3.9 (Diff presenter)       ─┘
    ↓
Phase 3 (Sequential):
  3.10 (Unified fix command)
```

### 15.3 Critical Path

**Total Duration:** 3 weeks (with 5 developers in parallel)

**Critical Path:** 3.4 → 3.5 → 3.2 → 3.10

- Week 1: Stories 3.4 + 3.5 (sequential)
- Week 2-3: Stories 3.1, 3.2, 3.3, 3.6, 3.7, 3.8, 3.9 (parallel)
- Week 3: Story 3.10 (integration)

### 15.4 Developer Assignments

| Developer | Swim Lane | Stories | Total Points |
|-----------|-----------|---------|--------------|
| **Dev 1** | C1 (Transformers) | 3.4, 3.5, 3.1 | 11 points |
| **Dev 2** | C2, C3 (Transformers) | 3.2, 3.3 | 8 points |
| **Dev 3** | A (Core) | 3.6, 3.10 (part) | 8 points |
| **Dev 4** | D (AI Plugin) | 3.7 | 5 points |
| **Dev 5** | E (Adapters) | 3.8, 3.9, 3.10 (part) | 10 points |

**Total Story Points:** 42 (includes integration overhead)

---

## Appendix A: ADR-005 (ts-morph Choice)

**Referenced from Solution Architecture:**

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

## Appendix B: Swim Lane Assignments

**From Epic Alignment Matrix:**

### Swim Lanes (5 developers)

- **Swim Lane A (Core)**: RefactoringService + TriageService + interfaces (1 developer, sequential)
- **Swim Lane B (CLI)**: FixCommand + RefactorWizard (1 developer, parallel with C/D/E)
- **Swim Lane C (Transformers)**: 3 transformers + ASTRefactorer base (2 developers, semi-parallel)
- **Swim Lane D (AI Plugin)**: AIPromptGenerator (1 developer, parallel)
- **Swim Lane E (Adapters)**: DiffPresenter (1 developer, parallel)

**Dependencies:**
- Swim Lane A must complete interfaces before B/C/D/E start
- Swim Lanes B, C, D, E can work in parallel after interfaces defined
- Stories 3.1-3.3 (transformers) depend on 3.4 (ASTRefactorer base class) - semi-sequential within Swim Lane C

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-10-16 | Technical Architect | Initial draft |

---

**End of Technical Specification**
