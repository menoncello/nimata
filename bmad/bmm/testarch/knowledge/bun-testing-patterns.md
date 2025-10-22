# Bun Testing Patterns for Nìmata

## Overview

This document describes testing patterns and best practices for Nìmata using Bun Test as the primary test runner. All tests must meet quality gates: TypeScript 0 errors, ESLint 0 errors, and achieve 80%+ mutation score with Stryker.

## Test Structure

### Basic Test File Template

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import type { ComponentUnderTest } from '../../src/types';

describe('ComponentName', () => {
  let component: ComponentUnderTest;

  beforeEach(() => {
    // Setup - create fresh instance for each test
    component = new ComponentUnderTest();
  });

  afterEach(() => {
    // Cleanup - release resources if needed
    component?.dispose?.();
  });

  describe('core functionality', () => {
    it('should initialize with default values', () => {
      // Arrange
      const expectedDefaults = {
        /* ... */
      };

      // Act
      const actual = component.getDefaults();

      // Assert
      expect(actual).toEqual(expectedDefaults);
    });
  });

  describe('error handling', () => {
    it('should throw ValidationError for invalid input', () => {
      // Arrange
      const invalidInput = null;

      // Act & Assert
      expect(() => component.process(invalidInput)).toThrow('Invalid input provided');
    });
  });
});
```

## Async Testing Patterns

### Async/Await Tests

```typescript
describe('AsyncService', () => {
  it('should handle async operations correctly', async () => {
    // Arrange
    const service = new AsyncService();
    const expectedData = { id: 1, name: 'test' };

    // Act
    const result = await service.fetchData(expectedData.id);

    // Assert
    expect(result).toEqual(expectedData);
  });

  it('should reject with proper error type', async () => {
    // Arrange
    const service = new AsyncService();

    // Act & Assert
    await expect(service.fetchData(-1)).rejects.toThrow(NotFoundError);
  });
});
```

### Promise Testing

```typescript
it('should handle promise resolution', () => {
  // Arrange
  const promise = Promise.resolve('success');

  // Act & Assert
  return expect(promise).resolves.toBe('success');
});

it('should handle promise rejection', () => {
  // Arrange
  const promise = Promise.reject(new Error('failure'));

  // Act & Assert
  return expect(promise).rejects.toThrow('failure');
});
```

## Test Data Management

### Type-Safe Test Data

```typescript
interface TestData {
  id: number;
  name: string;
  active: boolean;
}

const createTestData = (overrides: Partial<TestData> = {}): TestData => ({
  id: 1,
  name: 'test-item',
  active: true,
  ...overrides,
});

// Usage in tests
it('should process test data correctly', () => {
  const data = createTestData({ active: false });
  const result = processor.process(data);
  expect(result.wasProcessed).toBe(false);
});
```

### Data Factories

```typescript
class TestDataFactory {
  static createUser(overrides: Partial<User> = {}): User {
    return {
      id: Math.random(),
      name: 'Test User',
      email: 'test@example.com',
      createdAt: new Date(),
      ...overrides,
    };
  }

  static createProject(user: User, overrides: Partial<Project> = {}): Project {
    return {
      id: Math.random(),
      name: 'Test Project',
      ownerId: user.id,
      status: 'active',
      ...overrides,
    };
  }
}
```

## Mock Patterns

### Interface Mocks

```typescript
import { mock } from 'bun:test';

// Mock interface implementation
const mockRepository: Repository = {
  save: mock(() => Promise.resolve({ id: 1 })),
  findById: mock(() => Promise.resolve(null)),
  delete: mock(() => Promise.resolve(true)),
};

// Verify mock calls
it('should call repository save with correct data', async () => {
  const service = new Service(mockRepository);
  const data = { name: 'test' };

  await service.create(data);

  expect(mockRepository.save).toHaveBeenCalledWith(data);
});
```

### Module Mocks

```typescript
// Mock external modules
import { Database } from '../../src/database';

// Mock the module
const mockDatabase = {
  query: mock(() => Promise.resolve([{ id: 1, name: 'test' }])),
  transaction: mock((callback) => callback(mockDatabase)),
};

// Replace module for test
global.mockDatabase = mockDatabase;
```

## Mutation Testing Considerations

### Test Design for High Mutation Scores

```typescript
// Good - Kills multiple mutants
it('should validate input parameters', () => {
  expect(() => service.process(null)).toThrow('Invalid input');
  expect(() => service.process(undefined)).toThrow('Invalid input');
  expect(() => service.process('')).toThrow('Invalid input');
});

// Bad - Single assertion, easy to bypass
it('should throw error for invalid input', () => {
  expect(() => service.process(null)).toThrow();
});
```

### Boundary Value Testing

```typescript
describe('boundary value testing', () => {
  const validRange = { min: 1, max: 100 };

  it('should accept minimum valid value', () => {
    const result = validator.validate(validRange.min);
    expect(result).toBe(true);
  });

  it('should accept maximum valid value', () => {
    const result = validator.validate(validRange.max);
    expect(result).toBe(true);
  });

  it('should reject values outside range', () => {
    expect(validator.validate(validRange.min - 1)).toBe(false);
    expect(validator.validate(validRange.max + 1)).toBe(false);
  });
});
```

## Coverage Requirements

### Line Coverage

- **100%** line coverage required for business logic
- **80%** minimum for utility/helper functions
- Use meaningful assertions, not just coverage

### Branch Coverage

- Test all conditional branches
- Include error paths and edge cases
- Use boundary value testing

### Mutation Score

- **80%+** mutation score required using Stryker
- Structure tests to actually catch bugs
- Avoid redundant or meaningless assertions

## Quality Gates Enforcement

All tests must pass these quality gates:

1. **TypeScript Compilation**: 0 errors in strict mode
2. **ESLint Validation**: 0 errors, no eslint-disable comments
3. **Prettier Formatting**: 100% compliance
4. **Test Execution**: 100% pass rate
5. **Mutation Testing**: 80%+ score

## Common Patterns to Avoid

### ❌ Bad Patterns

```typescript
// Bad - Conditionals in tests
it('should handle different inputs', () => {
  if (process.env.NODE_ENV === 'test') {
    expect(result).toBe('test');
  } else {
    expect(result).toBe('production');
  }
});

// Bad - Tests that always pass
it('should not throw', () => {
  expect(() => component.method()).not.toThrow();
});

// Bad - Meaningless assertions
it('should return something', () => {
  const result = service.getData();
  expect(result).toBeDefined();
});
```

### ✅ Good Patterns

```typescript
// Good - Type-safe assertions
it('should return expected type', () => {
  const result: UserData = service.getUser(1);
  expect(result).toHaveProperty('id');
  expect(result).toHaveProperty('email');
  expect(typeof result.id).toBe('number');
});

// Good - Specific assertions
it('should calculate total with tax included', () => {
  const amount = 100;
  const tax = 0.2;
  const expected = 120;

  const result = calculator.calculateTotal(amount, tax);

  expect(result).toBe(expected);
});

// Good - Error path testing
it('should throw specific error for invalid amount', () => {
  expect(() => calculator.calculateTotal(-100, 0.2)).toThrow(InvalidAmountError);
});
```

## Integration with Development Workflow

### Pre-commit Quality Checks

```bash
#!/bin/bash
# .git/hooks/pre-commit

echo "Running quality gates..."

# TypeScript check
bun run typecheck

# ESLint check
bun run lint

# Test execution
bun test

# Mutation testing (in CI)
if [ "$CI" = "true" ]; then
  bun run test:mutation
fi

echo "All quality gates passed!"
```

### CI/CD Integration

```yaml
# .github/workflows/test.yml
name: Quality Gates

on: [push, pull_request]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Bun
        uses: oven-sh/setup-bun@v1

      - name: Install dependencies
        run: bun install

      - name: TypeScript check
        run: bun run typecheck

      - name: ESLint check
        run: bun run lint

      - name: Run tests
        run: bun test --coverage

      - name: Mutation testing
        run: bun run test:mutation
```

## Resources

- [Bun Test Documentation](https://bun.sh/docs/cli/test)
- [Stryker Mutation Testing](https://stryker-mutator.io/)
- [Nìmata Quality Standards](docs/solution-architecture.md)
- [ESLint Configuration](docs/LINTING-RULES.md)
