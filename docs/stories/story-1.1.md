# Story 1.1: CLI Framework Setup

Status: Ready

## Story

As a **developer using Nìmata**,
I want **a functional CLI application with command routing and argument parsing**,
so that **I can execute Nìmata commands (init, validate, fix, prompt) from the terminal with proper help and error handling**.

## Acceptance Criteria

1. CLI entry point (`bin/nimata`) executes successfully
2. Command routing supports subcommands (init, validate, fix, prompt)
3. Argument parsing handles flags and options (--help, --version, --config)
4. Help text displays for each command
5. Version number displays correctly
6. Exit codes follow Unix conventions (0=success, non-zero=error)

## Tasks / Subtasks

- [ ] Set up Turborepo monorepo structure (AC: All)
  - [ ] Initialize Turborepo with turbo.json configuration
  - [ ] Create apps/cli package structure
  - [ ] Create packages/core and packages/adapters stub packages
  - [ ] Configure TypeScript project references for all packages
  - [ ] Add Bun as runtime (bun 1.3+)
- [ ] Implement CLI entry point with Yargs (AC: 1, 2, 3)
  - [ ] Create apps/cli/src/index.ts as main entry point
  - [ ] Set up Yargs command routing infrastructure
  - [ ] Implement `bin/nimata` launcher script with proper shebang
  - [ ] Configure command routing for init, validate, fix, prompt subcommands
  - [ ] Add global flags: --help, --version, --config
- [ ] Implement TSyringe dependency injection container (AC: All)
  - [ ] Create apps/cli/src/container.ts for manual DI registration
  - [ ] Set up TSyringe container with clear registration pattern
  - [ ] Document container registration approach (manual, no decorators)
- [ ] Add command help and version display (AC: 3, 4, 5)
  - [ ] Implement --help flag showing all commands
  - [ ] Implement per-command help (e.g., `nimata init --help`)
  - [ ] Implement --version flag reading from package.json
  - [ ] Format help output with clear descriptions and examples
- [ ] Implement proper exit codes (AC: 6)
  - [ ] Exit code 0 for successful command execution
  - [ ] Exit code 1 for validation errors
  - [ ] Exit code 3 for configuration errors
  - [ ] Exit code 130 for interruptions (Ctrl+C)
  - [ ] Document all exit codes in code comments
- [ ] Add tests for CLI framework (AC: All)
  - [ ] Unit test: Command routing (verify correct command handler called)
  - [ ] Unit test: Argument parsing (flags and options)
  - [ ] Unit test: Help text generation
  - [ ] Unit test: Version display
  - [ ] Unit test: Exit codes for different scenarios
  - [ ] E2E test: Execute `nimata --help` and verify output
  - [ ] E2E test: Execute `nimata --version` and verify version
- [ ] Create package.json with dependencies (AC: All)
  - [ ] Add yargs ^17.x
  - [ ] Add tsyringe ^4.x
  - [ ] Add picocolors ^1.x (for colored output)
  - [ ] Add typescript ^5.x as dev dependency
  - [ ] Configure "bin" field to point to CLI entry
  - [ ] Add scripts for build, test, dev

## Dev Notes

- Relevant architecture patterns and constraints
- Source tree components to touch
- Testing standards summary

### Architecture Patterns

**Clean Architecture Lite (3 Layers):**
- CLI Layer: Yargs commands call use cases directly (no controller layer)
- Use Case Layer: Business logic and orchestration
- Adapter Layer: Interface implementations (file system, config, etc.)

**Technology Stack:**
- Runtime: Bun 1.3+ (native APIs for performance)
- Language: TypeScript 5.x with strict mode
- CLI Framework: Yargs 17.x (chosen over Commander/oclif)
- DI Container: TSyringe 4.x with manual registration (no decorators)
- Terminal: Picocolors 1.x for colored output

**Key Architectural Decisions (ADRs):**
- ADR-007: Use Yargs for best TypeScript support, zero decorators, simple routing
- ADR-003: Use TSyringe with manual registration for explicit, debuggable dependency graphs
- ADR-002: Use Clean Architecture Lite (3 layers) to reduce boilerplate while maintaining testability

### Source Tree Components

**Files to Create:**

```
nimata/
├── turbo.json                              # Turborepo configuration
├── package.json                            # Root package.json (workspaces)
├── tsconfig.json                           # Root TypeScript config
├── apps/
│   └── cli/
│       ├── src/
│       │   ├── index.ts                    # Main CLI entry point (Yargs setup)
│       │   ├── container.ts                # TSyringe DI container
│       │   └── commands/                   # Command stubs (to be implemented in later stories)
│       │       ├── init.ts
│       │       ├── validate.ts
│       │       ├── fix.ts
│       │       └── prompt.ts
│       ├── bin/
│       │   └── nimata                      # CLI launcher script
│       ├── tests/
│       │   ├── unit/                       # Unit tests for commands
│       │   └── e2e/                        # E2E tests for full CLI
│       ├── package.json
│       └── tsconfig.json
├── packages/
│   ├── core/                               # Stub for use cases (future stories)
│   │   ├── src/
│   │   │   └── index.ts                    # Export placeholder
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── adapters/                           # Stub for adapters (future stories)
│       ├── src/
│       │   └── index.ts                    # Export placeholder
│       ├── package.json
│       └── tsconfig.json
```

**Command Stubs:**
- Each command file (init.ts, validate.ts, fix.ts, prompt.ts) will contain a minimal Yargs command definition
- Commands will log "Not implemented yet" and exit successfully
- This allows help text to be generated and routing to be tested
- Actual command implementation will come in later stories

### Testing Standards

**Unit Tests (Bun Test):**
- Location: `apps/cli/tests/unit/`
- Coverage target: 100% for CLI framework code
- Mocking: Use jest.fn() for mocking dependencies
- Isolation: Fresh mocks in beforeEach()

**E2E Tests (Bun Test):**
- Location: `apps/cli/tests/e2e/`
- Execute actual CLI commands via `spawn`
- Verify stdout/stderr output
- Check exit codes

**Mutation Testing (Stryker):**
- Not applicable for this story (CLI entry point, no complex logic)
- Will be enabled in future stories with business logic

**Test Structure:**
```typescript
// Example unit test structure
describe('InitCommand', () => {
  let container: DependencyContainer;

  beforeEach(() => {
    container = new DependencyContainer();
    // Register mocks
  });

  it('should route to init command handler', async () => {
    // Test command routing
  });
});
```

### Project Structure Notes

**Alignment with Unified Project Structure:**
- Turborepo monorepo with apps/ and packages/ separation
- TypeScript project references for fast incremental builds
- Bun 1.3+ as runtime (native APIs for file I/O, YAML, hashing)
- TSyringe DI container for testability
- Clean Architecture Lite (3 layers)

**Key Conventions:**
- Manual DI registration (no decorators): Explicit, debuggable
- Yargs for CLI routing: Best TypeScript support
- Picocolors for terminal output: 14x faster than chalk
- Exit codes follow Unix conventions (documented in source)

**No Conflicts Detected:**
- This is the first story, establishing the foundation
- All decisions align with solution-architecture.md
- Technology stack matches PRD and tech-spec-epic-1.md

### References

- [Source: docs/epic-stories.md#Story 1.1] - Acceptance criteria and technical notes
- [Source: docs/tech-spec-epic-1.md#3.2.1 CLI Layer] - Component breakdown and file paths
- [Source: docs/solution-architecture.md#ADR-007] - Yargs selection rationale
- [Source: docs/solution-architecture.md#ADR-003] - TSyringe DI pattern
- [Source: docs/solution-architecture.md#ADR-002] - Clean Architecture Lite pattern
- [Source: docs/solution-architecture.md#7. Proposed Source Tree] - Complete directory structure
- [Source: docs/PRD.md#NFR004] - Maintainability requirements (extensible architecture)

## Dev Agent Record

### Context Reference

- `docs/stories/story-context-1.1.1.xml` (Generated: 2025-10-16)

### Agent Model Used

claude-sonnet-4-5-20250929

### Debug Log References

### Completion Notes List

### File List
