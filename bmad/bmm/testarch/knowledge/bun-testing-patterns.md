# Bun Testing Patterns

## Basic Test Structure

```typescript
import { describe, it, expect } from 'bun:test';

describe('Component', () => {
  it('should work correctly', () => {
    const result = functionUnderTest();
    expect(result).toBe(expected);
  });
});
```

## Async Testing

```typescript
describe('Async Operations', () => {
  it('should handle async operations', async () => {
    const result = await asyncFunction();
    expect(result).toBeDefined();
    expect(result).toBe(expectedResult);
  });

  it('should handle promises correctly', async () => {
    const promise = Promise.resolve('test');
    await expect(promise).resolves.toBe('test');
  });
});
```

## Error Handling Tests

```typescript
describe('Error Handling', () => {
  it('should throw expected error', () => {
    expect(() => functionThatThrows()).toThrow('Expected error message');
  });

  it('should handle async errors', async () => {
    await expect(asyncFunctionThatThrows()).rejects.toThrow('Expected error');
  });
});
```

## Test Data and Mocks

```typescript
describe('Data Testing', () => {
  const testData: TestData = {
    name: 'Test User',
    email: 'test@example.com',
    age: 25
  };

  it('should process test data correctly', () => {
    const result = processUserData(testData);
    expect(result.name).toBe(testData.name);
    expect(result.email).toBe(testData.email);
  });
});
```

## Mutation Testing Best Practices

- **Use boundary values**: Test with 0, -1, maximum values, empty strings, null/undefined
- **Test null/error cases**: Ensure code handles edge cases and error conditions
- **Use specific assertions**: Avoid generic "truthy" tests - be explicit about expected values
- **Use proper TypeScript types**: No 'any' types in test data
- **Test both happy path and error paths**: Ensure all code branches are covered

## Test Organization

```typescript
// Group related tests
describe('UserService', () => {
  describe('createUser', () => {
    it('should create user with valid data');
    it('should reject duplicate emails');
    it('should validate required fields');
  });

  describe('updateUser', () => {
    it('should update user information');
    it('should reject invalid updates');
  });
});
```

## Performance Testing (when applicable)

```typescript
describe('Performance', () => {
  it('should complete within time limit', () => {
    const start = performance.now();
    const result = expensiveOperation();
    const duration = performance.now() - start;

    expect(duration).toBeLessThan(1000); // 1 second limit
    expect(result).toBeDefined();
  });
});
```

## File Structure

```
tests/
├── unit/           # Unit tests for individual functions/classes
├── integration/    # Integration tests for component interactions
├── e2e/           # End-to-end tests for full workflows
├── fixtures/      # Test data and mocks
└── helpers/       # Test utilities and helpers
```

## Running Tests

```bash
# Run all tests
bun test

# Run tests with coverage
bun test --coverage

# Run tests in watch mode
bun test --watch

# Run specific test file
bun test path/to/test.test.ts
```