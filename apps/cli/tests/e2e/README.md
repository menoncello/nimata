# E2E Testing Guide - Nìmata CLI

## Overview

E2E tests for Nìmata CLI using **Bun Test** with production-grade patterns:

- **Pure function helpers** → Framework-agnostic, unit testable
- **Data factories** → Deterministic test projects with overrides
- **Isolated execution** → Each test gets its own temp directory
- **Fast feedback** → Bun native performance, no browser overhead

## Architecture

```
tests/e2e/
├── support/
│   ├── helpers/              # Pure functions (unit testable)
│   │   ├── cli-executor.ts   # CLI command execution
│   │   └── file-assertions.ts # File system operations
│   └── fixtures/             # Test data factories
│       └── test-projects.ts  # Project scaffolding factories
└── *.e2e.test.ts            # E2E test files
```

## Key Patterns

### 1. CLI Execution Helper

```typescript
import { executeCLI, executeCLISuccess } from './support/helpers/cli-executor';

// Basic execution
const result = await executeCLI({
  args: ['validate'],
  cwd: tempDir,
});

// Expect success (throws if exit code != 0)
const result = await executeCLISuccess({
  args: ['init', '--yes'],
  cwd: tempDir,
});
```

### 2. File Assertions

```typescript
import { fileExists, readJSON, directoryContainsFiles } from './support/helpers/file-assertions';

// Check file exists
expect(await fileExists(`${tempDir}/package.json`)).toBe(true);

// Read and assert JSON
const pkg = await readJSON(`${tempDir}/package.json`);
expect(pkg.name).toBe('my-project');

// Check directory structure
expect(await directoryContainsFiles(tempDir, ['package.json', 'tsconfig.json'])).toBe(true);
```

### 3. Test Project Factories

```typescript
import { createFullProject, createProjectWithErrors } from './support/fixtures/test-projects';

// Create clean project
await createFullProject(tempDir, {
  name: 'my-project',
  version: '1.0.0',
  includeTypeScript: true,
});

// Create project with validation errors
await createProjectWithErrors(tempDir);
```

### 4. Test Isolation with Temp Directories

```typescript
import { createTempDirectory, cleanupTempDirectory } from './support/helpers/file-assertions';

describe('my test suite', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDirectory();
  });

  afterEach(async () => {
    await cleanupTempDirectory(tempDir);
  });

  it('should test in isolation', async () => {
    // Each test gets its own temp directory
  });
});
```

## Writing New Tests

### Template: Command E2E Test

```typescript
/**
 * E2E Tests - [Command Name]
 */
import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { executeCLI } from './support/helpers/cli-executor';
import { createTempDirectory, cleanupTempDirectory } from './support/helpers/file-assertions';

describe('nimata [command] (E2E)', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDirectory();
  });

  afterEach(async () => {
    await cleanupTempDirectory(tempDir);
  });

  it('should [behavior]', async () => {
    const result = await executeCLI({
      args: ['command', '--flag'],
      cwd: tempDir,
    });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('expected output');
  });
});
```

## Running Tests

```bash
# Run all E2E tests
bun test apps/cli/tests/e2e/

# Run specific test file
bun test apps/cli/tests/e2e/init-command.e2e.test.ts

# Run with watch mode
bun test --watch apps/cli/tests/e2e/

# Run with coverage
bun test --coverage apps/cli/tests/e2e/
```

## Testing Guidelines

### ✅ DO

- **Use temp directories** for each test (isolation)
- **Use factories** for test data (deterministic)
- **Test exit codes** explicitly
- **Keep helpers pure** (framework-agnostic)
- **Test both success and failure** paths
- **Clean up resources** in `afterEach()`

### ❌ DON'T

- **Don't share state** between tests
- **Don't use hardcoded paths** (use temp directories)
- **Don't test implementation details** (test behavior)
- **Don't skip cleanup** (causes flaky tests)
- **Don't use timeouts** unless absolutely necessary

## Performance Targets

| Metric                      | Target  |
| --------------------------- | ------- |
| **Single test execution**   | < 500ms |
| **Full E2E suite**          | < 30s   |
| **Test isolation overhead** | < 50ms  |
| **CLI command execution**   | < 2s    |

## Troubleshooting

### Tests timing out

```typescript
// Increase timeout for slow commands
const result = await executeCLI({
  args: ['validate'],
  timeout: 60_000, // 60 seconds
});
```

### Temp directory cleanup fails

```bash
# Manually clean up temp directories
rm -rf /tmp/bun-*
```

### CLI not found

```bash
# Ensure CLI is built
cd apps/cli
bun run build
```

## Test Quality Standards

- **100% of critical paths** covered
- **Parallel-safe** (no shared state)
- **Fast feedback** (< 30s full suite)
- **Deterministic** (no flaky tests)
- **Self-cleaning** (no leftover artifacts)

## References

- [Bun Test Documentation](https://bun.sh/docs/cli/test)
- [Testing Philosophy](../../../../docs/solution-architecture.md#8-testing-strategy)
- [Fixture Architecture](../../../bmm/testarch/knowledge/fixture-architecture.md)
- [Data Factories](../../../bmm/testarch/knowledge/data-factories.md)

---

_Generated by Murat - Master Test Architect_ 🧪🐦
