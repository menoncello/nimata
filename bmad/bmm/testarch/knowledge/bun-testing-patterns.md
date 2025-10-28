# Bun Testing Patterns - BMAD Quality Standards

## Overview

This document defines the mandatory testing patterns for BMAD projects using Bun Test. These patterns are ZERO TOLERANCE requirements - all tests MUST follow these standards without exception.

## Core Principles - ZERO TOLERANCE

### 1. Bun Test API Usage

```typescript
// ✅ CORRECT: Use Bun Test API exclusively
import { describe, it, expect, beforeEach, afterEach } from 'bun:test';

// ❌ FORBIDDEN: Never use other test frameworks
import { describe, it, expect } from 'jest'; // FORBIDDEN
import { test, expect } from '@playwright/test'; // FORBIDDEN
```

### 2. Test Structure Patterns

```typescript
// ✅ CORRECT: Standard test structure
describe('UserService', () => {
  beforeEach(async () => {
    // Setup code
  });

  it('should create user with valid data', async () => {
    // Given
    const userData = { name: 'John', email: 'john@example.com' };

    // When
    const result = await userService.create(userData);

    // Then
    expect(result.id).toBeDefined();
    expect(result.name).toBe(userData.name);
    expect(result.email).toBe(userData.email);
  });

  afterEach(async () => {
    // Cleanup code
  });
});
```

### 3. Type Safety Requirements

```typescript
// ✅ CORRECT: Proper TypeScript types
interface User {
  id: string;
  name: string;
  email: string;
}

const createTestUser = (data: Partial<User>): User => {
  return {
    id: 'test-id',
    name: data.name || 'Test User',
    email: data.email || 'test@example.com',
  };
};

// ❌ FORBIDDEN: Never use 'any' or @ts-ignore
const testUser: any = { id: 1, name: 'Test' }; // FORBIDDEN
// @ts-ignore
const result = someFunction(); // FORBIDDEN
```

### 4. Assertion Patterns

```typescript
// ✅ CORRECT: Specific, meaningful assertions
it('should validate user email format', () => {
  const invalidEmail = 'invalid-email';

  expect(() => userService.validateEmail(invalidEmail)).toThrow('Invalid email format');
});

// ✅ CORRECT: Test both success and failure cases
it('should handle both valid and invalid inputs', () => {
  expect(userService.isValid('valid-data')).toBe(true);
  expect(userService.isValid('')).toBe(false);
  expect(userService.isValid(null)).toBe(false);
});

// ❌ FORBIDDEN: Generic or meaningless assertions
it('should work', () => {
  expect(result).toBeDefined(); // Too generic
  expect(true).toBe(true); // Meaningless
});
```

## Async Testing Patterns

### 1. Promise Handling

```typescript
// ✅ CORRECT: Proper async/await
it('should handle async operations correctly', async () => {
  const promise = userService.createAsync(userData);
  const result = await promise;

  expect(result.id).toBeDefined();
});

// ✅ CORRECT: Error handling in async tests
it('should throw error for invalid data', async () => {
  await expect(userService.createAsync(invalidData)).rejects.toThrow('Invalid user data');
});

// ❌ FORBIDDEN: Floating promises
it('should handle async operations', () => {
  userService.createAsync(userData); // Floating promise - FORBIDDEN
});
```

### 2. Mock Patterns

```typescript
// ✅ CORRECT: Proper mocking with Bun
import { mock } from 'bun:test';

const mockDatabase = mock(() => ({
  save: () => Promise.resolve({ id: '1' }),
  find: () => Promise.resolve([]),
}));

// ✅ CORRECT: Spy on methods
const spy = mockDatabase.spy('save');

it('should save user to database', async () => {
  await userService.create(userData);

  expect(spy).toHaveBeenCalledWith(userData);
  expect(spy).toHaveBeenCalledTimes(1);
});
```

## Test Data Management

### 1. Test Factories

```typescript
// ✅ CORRECT: Use test factories for consistent data
const createTestUser = (overrides: Partial<User> = {}): User => ({
  id: 'test-id',
  name: 'Test User',
  email: 'test@example.com',
  ...overrides,
});

it('should work with custom user data', () => {
  const customUser = createTestUser({ name: 'Custom Name' });

  expect(customUser.name).toBe('Custom Name');
  expect(customUser.email).toBe('test@example.com'); // Default preserved
});
```

### 2. Test Organization

```typescript
// ✅ CORRECT: Organize tests by feature/behavior
describe('UserService - Creation', () => {
  describe('when valid data provided', () => {
    it('should create user successfully');
    it('should return user with ID');
  });

  describe('when invalid data provided', () => {
    it('should throw validation error');
    it('should not save to database');
  });
});
```

## Mutation Testing Considerations

### 1. Write Tests That Kill Mutants

```typescript
// ✅ CORRECT: Tests that catch specific mutations
it('should handle boundary conditions', () => {
  // Test exact boundary values
  expect(userService.isValidLength('abc')).toBe(true); // Exactly 3 chars
  expect(userService.isValidLength('ab')).toBe(false); // Below boundary
  expect(userService.isValidLength('abcd')).toBe(true); // Above boundary
});

it('should use strict equality', () => {
  // Use toBe() instead of toEqual() for primitives
  expect(result.count).toBe(5); // Catches mutation to >= or <=
  expect(result.name).toBe('exact-name'); // Catches string mutations
});
```

### 2. Error Path Testing

```typescript
// ✅ CORRECT: Test all error conditions
it('should handle database connection errors', async () => {
  mockDatabase.mockRejectedValueOnce(new Error('Connection failed'));

  await expect(userService.create(userData)).rejects.toThrow('Database connection failed');
});

it('should validate all required fields', () => {
  const requiredFields = ['name', 'email', 'password'];

  requiredFields.forEach((field) => {
    const invalidData = { ...userData };
    delete invalidData[field];

    expect(() => userService.validate(invalidData)).toThrow(`${field} is required`);
  });
});
```

## Quality Gate Requirements

### Mandatory Test Coverage

- ✅ Every acceptance criterion must have corresponding test
- ✅ Every public method must be tested
- ✅ Every error condition must be tested
- ✅ Every boundary condition must be tested

### Mutation Score Requirements

- ✅ **Regular packages**: 80%+ mutation score
- ✅ **Core packages**: 85%+ mutation score
- ✅ **NO EXCEPTIONS** - thresholds never lowered
- ✅ Additional tests MUST be written to meet thresholds

### Code Quality Standards

- ✅ TypeScript compilation: 0 errors
- ✅ ESLint violations: 0 (no eslint-disable allowed)
- ✅ Test assertions must be meaningful and specific
- ✅ Test data must use proper TypeScript types

## Examples - What to Do and What to Avoid

### ✅ Good Example

```typescript
describe('UserService', () => {
  const userService = new UserService(mockDatabase);

  it('should create user with valid data and return proper structure', async () => {
    // Given
    const userData: CreateUserData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'SecurePass123!',
    };

    // When
    const result = await userService.create(userData);

    // Then - specific assertions
    expect(result).toBeDefined();
    expect(result.id).toMatch(/^[a-zA-Z0-9-]{36}$/); // UUID format
    expect(result.name).toBe(userData.name);
    expect(result.email).toBe(userData.email.toLowerCase());
    expect(result.password).not.toBe(userData.password); // Should be hashed
    expect(result.createdAt).toBeInstanceOf(Date);
  });
});
```

### ❌ Bad Example (FORBIDDEN)

```typescript
it('should create user', async () => {
  // @ts-ignore - FORBIDDEN
  const userData = { name: 'John', email: 'john@example.com' };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any - FORBIDDEN
  const result: any = await userService.create(userData);

  expect(result).toBeDefined(); // Too generic
  expect(true).toBe(true); // Meaningless
});
```

## Integration with BMAD Workflows

### During Story Development

1. Create tests that follow these patterns
2. Ensure all tests pass 100%
3. Run mutation testing to verify 80%+ score
4. Fix any ESLint violations (no disable comments)
5. Only mark story complete when all quality gates pass

### During Test Architecture

1. Use these patterns when designing test strategies
2. Ensure test plans include mutation testing considerations
3. Verify test data factories provide proper type safety
4. Include quality gate requirements in test specifications

---

**ZERO TOLERANCE POLICY**: Any deviation from these patterns will block story completion and require immediate remediation. Quality gates are mandatory with no exceptions allowed.
