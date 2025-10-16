# Nìmata Test Framework

Comprehensive test infrastructure for CLI application with E2E process testing and enhanced unit patterns.

## Directory Structure

```
tests/
├── e2e/                    # End-to-end CLI tests
│   ├── support/            # E2E test utilities
│   │   ├── cli-runner.ts   # Spawn-based CLI execution
│   │   ├── test-project.ts # Isolated test project management
│   │   └── assertions.ts   # CLI-specific assertions
│   └── *.e2e.test.ts       # E2E test files
├── unit/                   # Unit tests
│   └── **/*.test.ts        # Unit test files
├── fixtures/               # Static test data
│   └── index.ts            # Reusable fixtures
├── factories/              # Dynamic test data generators
│   └── index.ts            # Factory functions with overrides
├── helpers/                # Pure utility functions
│   └── index.ts            # Framework-agnostic helpers
└── examples/               # Example test patterns
    ├── e2e-example.test.ts
    └── unit-example.test.ts
```

## Test Types

### E2E CLI Tests

**Purpose:** Test actual CLI command execution with real processes and filesystem.

**Location:** `tests/e2e/**/*.e2e.test.ts`

**Pattern:**

```typescript
import { createCliRunner, createTestProject, assertCli } from './e2e/support';

describe('CLI Command', () => {
  const cli = createCliRunner();
  let project: Awaited<ReturnType<typeof createTestProject>>;

  afterEach(async () => {
    await project?.cleanup();
  });

  test('should validate project', async () => {
    project = await createTestProject();
    await project.scaffold();

    const result = await cli.run(['validate'], {
      cwd: project.path,
      timeout: 10_000,
    });

    assertCli(result).success().stdoutContains('passed').completedWithin(5000);
  });
});
```

**Key Features:**

- Spawns real CLI processes
- Isolated temporary directories
- Captures stdout/stderr/exit codes
- Automatic cleanup
- Timeout protection

### Unit Tests

**Purpose:** Test individual functions and modules in isolation.

**Location:** `tests/unit/**/*.test.ts`

**Pattern:**

```typescript
import { createPackageJson, createValidationResult } from '../factories';
import { stripAnsi } from '../helpers';

test('should validate package.json', () => {
  const pkg = createPackageJson({
    name: 'my-project',
    version: '1.0.0',
  });

  expect(pkg.name).toBe('my-project');
});
```

**Key Features:**

- Pure functions only
- Factory-based test data
- No shared state
- Fast execution (<1ms per test)

## Test Utilities

### CLI Runner

Execute CLI commands in spawned processes:

```typescript
const cli = createCliRunner();

// Run with custom options
const result = await cli.run(['validate', '--fix'], {
  cwd: '/path/to/project',
  env: { DEBUG: '1' },
  timeout: 10_000,
  stdin: 'user input\n',
});

// Assert success
const result = await cli.runSuccess(['init']);

// Assert failure
const result = await cli.runFailure(['validate'], 1);
```

### Test Project

Create isolated test projects:

```typescript
const project = await createTestProject();

// Write files
await project.writeFile('src/index.ts', 'export const foo = 42;');
await project.writePackageJson({ name: 'test', version: '1.0.0' });

// Read files
const content = await project.readFile('src/index.ts');

// Check existence
const exists = project.fileExists('package.json');

// Get full path
const fullPath = project.resolve('src/index.ts');

// Scaffold basic structure
await project.scaffold('my-project');

// Cleanup (automatic in afterEach)
await project.cleanup();
```

### Assertions

Fluent CLI result assertions:

```typescript
assertCli(result)
  .success() // Exit code 0
  .stdoutContains('passed') // Stdout contains text
  .stdoutMatches(/\d+ tests/) // Stdout matches regex
  .stderrContains('warning') // Stderr contains text
  .noStderr() // Stderr is empty
  .completedWithin(5000); // Completed in <5000ms
```

### Factories

Generate test data with overrides:

```typescript
// Package.json
const pkg = createPackageJson({
  name: 'custom-name',
  scripts: { test: 'bun test' },
});

// TypeScript config
const tsconfig = createTsConfig({
  strict: true,
  compilerOptions: { noUnusedLocals: true },
});

// Source code with issues
const source = createSourceFile({
  hasUnusedVariable: true,
  hasAnyType: true,
  complexity: 5,
});

// Validation result
const result = createValidationResult({
  passed: false,
  errors: ['Type error'],
  tool: 'typescript',
});
```

### Fixtures

Reusable static test data:

```typescript
import { packageJsonFixtures, sourceFixtures } from '../fixtures';

// Use predefined fixtures
const minimal = packageJsonFixtures.minimal;
const withScripts = packageJsonFixtures.withScripts;
const simpleFunction = sourceFixtures.simpleFunction;
```

### Helpers

Pure utility functions:

```typescript
import { stripAnsi, measureTime, createTestId } from '../helpers';

// Strip ANSI color codes
const plain = stripAnsi(coloredOutput);

// Measure execution time
const { result, duration } = await measureTime(async () => {
  return await expensiveOperation();
});

// Generate unique test ID
const id = createTestId('test'); // "test-abc123xyz"
```

## Running Tests

```bash
# All tests (includes 42 skipped tests pending Epic 2)
bun test

# Unit tests only
bun run test:unit

# E2E tests only
bun run test:e2e

# Watch mode
bun run test:watch

# Coverage
bun run test:coverage

# Mutation testing (enabled in Epic 2)
bun run test:mutation

# Run specific pending test suite (will show as skipped)
bun test apps/cli/tests/e2e/security-injection.e2e.test.ts
bun test apps/cli/tests/e2e/exit-codes-negative.e2e.test.ts
bun test apps/cli/tests/e2e/error-messages.e2e.test.ts
```

### Test Status by Story

**Story 1.1 (Current):**

- ✅ 150 tests passing
- ⏸️ 44 tests skipped (pending Epic 2)
- ❌ 0 tests failing

**Epic 2 (After Implementation):**

- 🎯 194 tests passing (150 + 44 activated)
- ⏸️ 0 tests skipped
- ❌ 0 tests failing

See `docs/epic-2-test-activation-plan.md` for activation checklist.

## Best Practices

### ✅ DO

- Use factories for dynamic test data
- Use fixtures for static reusable data
- Clean up test projects in `afterEach`
- Use isolated temp directories for E2E tests
- Test exit codes, stdout, and stderr
- Use `assertCli` for fluent assertions
- Generate parallel-safe identifiers (UUIDs, timestamps)

### ❌ DON'T

- Share state between tests
- Use hardcoded file paths
- Skip cleanup in E2E tests
- Rely on execution order
- Use static test data with mutation
- Test implementation details in unit tests
- Use real filesystem in unit tests

## Architecture Principles

### Pure Functions → Fixtures → Tests

```typescript
// 1. Pure helper (framework-agnostic)
function calculateScore(value: number): number {
  return value * 2;
}

// 2. Factory (reusable test data)
function createScoreInput(overrides = {}): { value: number } {
  return { value: overrides.value ?? 42 };
}

// 3. Test (uses factory)
test('should calculate score', () => {
  const input = createScoreInput({ value: 10 });
  expect(calculateScore(input.value)).toBe(20);
});
```

### Isolation & Parallelism

- Each test runs in isolation
- No shared mutable state
- Factories generate unique data
- Parallel-safe by default

### API-First Testing

- E2E tests spawn real processes
- Unit tests use pure functions
- Integration tests use factories
- No mocking unless absolutely necessary

## Examples

See `tests/examples/` for:

- `e2e-example.test.ts` - Complete E2E patterns
- `unit-example.test.ts` - Unit test patterns with factories/fixtures

## Timeouts

- **Unit tests:** 1-5ms (default)
- **E2E tests:** 5-30s (configurable via `timeout` option)
- **Default E2E timeout:** 30s
- **CI timeout multiplier:** 2x

## CI Configuration

Tests run automatically in CI with:

- Parallel execution (1 worker in CI, unlimited locally)
- 2 retries on failure (CI only)
- JUnit XML reports for CI integration
- Coverage reports uploaded to CI

## Troubleshooting

**E2E test times out:**

- Increase timeout: `{ timeout: 60_000 }`
- Check CLI bin path is correct
- Verify test project cleanup

**Tests fail with "file not found":**

- Use `project.resolve()` for full paths
- Ensure `scaffold()` or file write before read

**Tests interfere with each other:**

- Check for shared state
- Verify unique identifiers in factories
- Ensure cleanup in `afterEach`

**CLI output assertions fail:**

- Use `stripAnsi()` for colored output
- Check for platform-specific line endings
- Use regex for flexible matching

---

**Framework:** Bun Test
**Mutation Testing:** Stryker
**Architecture:** Pure functions → Factories → Fixtures → Tests
