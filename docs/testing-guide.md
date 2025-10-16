# Nìmata Testing Guide

## Overview

Nìmata uses **strict TDD** with multiple testing layers and **mutation testing** for quality gates.

**Testing Stack:**

- **Bun Test** - Unit + E2E tests
- **Stryker** - Mutation testing (80%+ mutation score target)
- **@playwright/test** - Future API testing capability

---

## Test Structure

```
apps/cli/tests/
├── unit/                          # Unit tests (100% coverage target)
│   ├── test-helpers.ts            # Shared utilities and mocks
│   ├── app-*.test.ts              # App-level tests
│   ├── cli-builder.test.ts        # CLI builder tests
│   └── commands/*.test.ts         # Command handler tests
└── e2e/                           # E2E tests (80% coverage target)
    ├── support/
    │   ├── helpers/               # Pure functions (unit testable)
    │   │   ├── cli-executor.ts    # CLI execution helpers
    │   │   └── file-assertions.ts # File system utilities
    │   └── fixtures/              # Test data factories
    │       └── test-projects.ts   # Project structure factories
    └── *.e2e.test.ts              # E2E test files
```

---

## Test Types

### Unit Tests (`tests/unit/`)

**Purpose:** Test individual functions/classes in isolation

**Characteristics:**

- 100% mocked dependencies
- Fast execution (< 10ms per test)
- AAA pattern (Arrange, Act, Assert)
- Subject to mutation testing (80%+ score)

**Example:**

```typescript
import { describe, it, expect } from 'bun:test';

describe('MyService', () => {
  it('should calculate sum correctly', () => {
    const service = new MyService();
    expect(service.add(2, 3)).toBe(5);
  });
});
```

### E2E Tests (`tests/e2e/`)

**Purpose:** Test full CLI workflows end-to-end

**Characteristics:**

- Real CLI execution
- Temp directory isolation
- File system assertions
- No mutation testing (too slow)

**Example:**

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { executeCLI } from './support/helpers/cli-executor';
import { createTempDirectory, cleanupTempDirectory } from './support/helpers/file-assertions';

describe('nimata init (E2E)', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDirectory();
  });

  afterEach(async () => {
    await cleanupTempDirectory(tempDir);
  });

  it('should initialize project', async () => {
    const result = await executeCLI({
      args: ['init', '--yes'],
      cwd: tempDir,
    });

    expect(result.exitCode).toBe(0);
  });
});
```

---

## Running Tests

```bash
# Run all tests
bun test

# Run only unit tests
bun test tests/unit/

# Run only E2E tests
bun test tests/e2e/

# Watch mode (re-run on file changes)
bun test --watch

# Coverage report
bun test --coverage

# Mutation testing
bun run test:mutation
```

---

## Mutation Testing with Stryker

**Goal:** Ensure tests actually validate behavior (not just coverage)

**Configuration:** `apps/cli/stryker.conf.json`

```json
{
  "testRunner": "command",
  "commandRunner": {
    "command": "bun test tests/unit/**/*.test.ts"
  },
  "coverageAnalysis": "perTest",
  "mutate": ["src/**/*.ts", "!src/**/*.test.ts"],
  "ignore": ["**/tests/integration/**", "**/tests/e2e/**"],
  "thresholds": {
    "high": 80,
    "low": 60,
    "break": 50
  }
}
```

**What Stryker Does:**

1. Mutates your source code (e.g., `+` → `-`, `===` → `!==`)
2. Runs your unit tests
3. Fails if tests still pass (mutant survived)

**Mutation Score Targets:**

- **High:** 80%+ (ideal)
- **Low:** 60% (acceptable)
- **Break:** 50% (CI fails)

**Critical Rule:**
❌ **NEVER lower thresholds to make tests pass**
✅ **ALWAYS improve tests to kill surviving mutants**

---

## Testing Best Practices

### ✅ DO

**Unit Tests:**

- Mock all dependencies
- Test one behavior per test
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)
- Aim for 100% line coverage
- Target 80%+ mutation score

**E2E Tests:**

- Use temp directories (isolation)
- Use test factories (deterministic)
- Test exit codes explicitly
- Clean up in `afterEach()`
- Test both success and failure paths

**General:**

- Write tests first (TDD)
- Keep tests fast (< 30s full suite)
- Make tests deterministic (no flakiness)
- Use pure helper functions

### ❌ DON'T

- Share state between tests
- Use hardcoded file paths
- Skip cleanup (causes flaky tests)
- Test implementation details
- Lower mutation thresholds
- Use timeouts unless necessary
- Mock what you don't own

---

## Helpers and Utilities

### Unit Test Helpers (`tests/unit/test-helpers.ts`)

```typescript
import { sleep, waitFor, captureConsole, createExitMock } from './test-helpers';

// Sleep utility
await sleep(1000);

// Wait for condition
await waitFor(() => myCondition === true, 5000);

// Capture console output
const { stdout, stderr } = captureConsole(() => {
  console.log('test');
});

// Mock process.exit
const exitMock = createExitMock();
```

### E2E Helpers

**CLI Executor** (`tests/e2e/support/helpers/cli-executor.ts`)

```typescript
import { executeCLI, executeCLISuccess, executeCLIFailure } from './support/helpers/cli-executor';

// Basic execution
const result = await executeCLI({ args: ['validate'] });

// Expect success (throws if fails)
await executeCLISuccess({ args: ['init'] });

// Expect failure (throws if succeeds)
await executeCLIFailure({ args: ['validate'] });
```

**File Assertions** (`tests/e2e/support/helpers/file-assertions.ts`)

```typescript
import {
  fileExists,
  readFile,
  readJSON,
  directoryExists,
  listFiles,
} from './support/helpers/file-assertions';

expect(await fileExists(path)).toBe(true);
const content = await readFile(path);
const json = await readJSON<PackageJson>(path);
```

**Test Factories** (`tests/e2e/support/fixtures/test-projects.ts`)

```typescript
import {
  createFullProject,
  createProjectWithErrors,
  createPackageJson,
} from './support/fixtures/test-projects';

// Create clean project
await createFullProject(tempDir, {
  name: 'my-project',
  includeTypeScript: true,
});

// Create project with errors
await createProjectWithErrors(tempDir);
```

---

## Performance Targets

| Metric                   | Target  |
| ------------------------ | ------- |
| **Unit test execution**  | < 10ms  |
| **E2E test execution**   | < 500ms |
| **Full unit test suite** | < 5s    |
| **Full E2E suite**       | < 30s   |
| **Mutation testing**     | < 5min  |

---

## CI Integration

Tests run automatically on every PR via GitHub Actions:

```yaml
# .github/workflows/ci.yml
- name: Run Unit Tests
  run: bun test tests/unit/

- name: Run E2E Tests
  run: bun test tests/e2e/

- name: Run Mutation Tests
  run: bun run test:mutation

- name: Check Coverage
  run: bun test --coverage
```

**Quality Gates:**

- ✅ All unit tests pass
- ✅ All E2E tests pass
- ✅ Mutation score ≥ 50% (break threshold)
- ✅ Line coverage ≥ 80%

---

## Troubleshooting

### Mutation tests failing

**Symptom:** Stryker reports surviving mutants

**Solution:** Add tests to kill mutants, don't lower thresholds

```typescript
// Bad: Mutant survives
it('should add numbers', () => {
  expect(add(2, 3)).toBeTruthy(); // Passes even if mutated to subtract
});

// Good: Mutant killed
it('should add numbers', () => {
  expect(add(2, 3)).toBe(5); // Fails if mutated
});
```

### E2E tests timing out

**Symptom:** Tests hang or timeout

**Solution:** Increase timeout for slow commands

```typescript
const result = await executeCLI({
  args: ['validate'],
  timeout: 60_000, // 60 seconds
});
```

### Temp directory cleanup fails

**Symptom:** `ENOENT` or permission errors

**Solution:** Ensure cleanup in `afterEach()`

```typescript
afterEach(async () => {
  await cleanupTempDirectory(tempDir);
});
```

---

## References

- [Bun Test Documentation](https://bun.sh/docs/cli/test)
- [Stryker Documentation](https://stryker-mutator.io/)
- [Solution Architecture - Testing Strategy](./solution-architecture.md#8-testing-strategy)
- [E2E Testing README](../apps/cli/tests/e2e/README.md)

---

_Generated by Murat - Master Test Architect_ 🧪🐦
