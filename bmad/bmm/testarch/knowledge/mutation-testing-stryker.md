# Stryker Mutation Testing for Nìmata

## Overview

This document describes Stryker mutation testing configuration and best practices for Nìmata. Mutation testing validates test quality by making small changes to source code (mutants) and checking if tests catch these changes.

## Configuration

### Stryker Configuration Template

```json
// stryker.config.json (per package)
{
  "$schema": "./node_modules/@stryker-mutator/core/schema/stryker-schema.json",
  "mutate": [
    "src/**/*.ts",
    "!src/**/*.d.ts",
    "!src/**/*.test.ts",
    "!src/**/__tests__/**/*"
  ],
  "testRunner": "bun",
  "coverageAnalysis": "perTest",
  "reporters": [
    "html",
    "clear-text",
    "json",
    "progress"
  ],
  "tempDirName": ".stryker-tmp",
  "thresholds": {
    "high": 80,
    "low": 60,
    "break": 50
  },
  "concurrency": 2,
  "maxConcurrentTestRunners": 2,
  "timeout": 60000,
  "timeoutFactor": 1.5
}
```

### Package.json Scripts

```json
{
  "scripts": {
    "test": "bun test",
    "test:mutation": "stryker run",
    "test:mutation:debug": "stryker run --timeoutMs 120000 --concurrency 1"
  }
}
```

## Mutation Testing Strategy

### Target Mutations

Stryker automatically targets these mutation types:

```typescript
// Arithmetic mutations
x + y → x - y
x * y → x / y
x++ → x--
x-- → x++

// Conditional mutations
if (condition) → if (!condition)
a > b → a >= b
a < b → a <= b
a === b → a !== b
a !== b → a === b

// Logical mutations
a && b → a || b
a || b → a && b

// Boolean mutations
true → false
false → true
```

### Mutation Score Thresholds

- **High**: 80% - Target for production code
- **Low**: 60% - Minimum acceptable
- **Break**: 50% - CI will fail below this

## Test Design for Mutation Testing

### Write Tests That Kill Mutants

#### ❌ Bad: Tests That Survive Mutations

```typescript
// Bad - Won't kill arithmetic mutants
it('should calculate result', () => {
  const result = calculator.add(2, 3);
  expect(result).toBeGreaterThan(0); // Always true
});

// Bad - Won't kill conditional mutants
it('should handle validation', () => {
  const result = validator.validate(input);
  expect(typeof result).toBe('boolean'); // Always boolean
});

// Bad - Won't kill comparison mutants
it('should have correct type', () => {
  expect(typeof item.id).toBe('number'); // Always number
});
```

#### ✅ Good: Tests That Kill Mutants

```typescript
// Good - Kills arithmetic mutants
it('should add two numbers correctly', () => {
  expect(calculator.add(2, 3)).toBe(5);
  expect(calculator.add(-1, 1)).toBe(0);
  expect(calculator.add(0, 0)).toBe(0);
});

// Good - Kills conditional mutants
it('should accept only valid inputs', () => {
  expect(validator.isValidInput(1)).toBe(true);
  expect(validator.isValidInput(0)).toBe(false);
  expect(validator.isValidInput(-1)).toBe(false);
});

// Good - Kills comparison mutants
it('should detect when quantity exceeds threshold', () => {
  const threshold = 100;
  expect(inventory.isOverThreshold(threshold + 1)).toBe(true);
  expect(inventory.isOverThreshold(threshold)).toBe(false);
});
```

### Boundary Value Testing

```typescript
describe('boundary value testing for mutation killing', () => {
  const limits = { min: 1, max: 100 };

  it('should enforce minimum limit', () => {
    expect(validator.enforceMinLimit(limits.min)).toBe(limits.min);
    expect(validator.enforceMinLimit(limits.min - 1)).toBe(limits.min);
  });

  it('should enforce maximum limit', () => {
    expect(validator.enforceMaxLimit(limits.max)).toBe(limits.max);
    expect(validator.enforceMaxLimit(limits.max + 1)).toBe(limits.max);
  });
});
```

### Error Path Testing

```typescript
describe('error path testing', () => {
  it('should throw specific error for invalid state', () => {
    const invalidState = { status: null };

    expect(() => service.process(invalidState))
      .toThrow(new InvalidStateError('State cannot be null'));
  });

  it('should handle network errors gracefully', async () => {
    const networkError = new NetworkError('Connection failed');
    mockApiClient.fetch.rejects(networkError);

    const result = await service.fetchData();

    expect(result.error).toBe(networkError.message);
    expect(result.retryCount).toBe(1);
  });
});
```

## Common Mutation Testing Patterns

### 1. Test Business Logic Rules

```typescript
// Source code with mutants
function calculateDiscount(price: number, customer: Customer): number {
  if (customer.isPremium) {
    return price * 0.9; // Mutation target: 0.9 → 1.1
  }
  return price; // Mutation target: return → return 0
}

// Test that kills mutants
describe('calculateDiscount', () => {
  it('should apply 10% discount for premium customers', () => {
    const premiumCustomer = { isPremium: true };
    expect(calculateDiscount(100, premiumCustomer)).toBe(90);
  });

  it('should return full price for regular customers', () => {
    const regularCustomer = { isPremium: false };
    expect(calculateDiscount(100, regularCustomer)).toBe(100);
  });
});
```

### 2. Test Array Operations

```typescript
// Source code with mutants
function findActiveUsers(users: User[]): User[] {
  return users.filter(user => user.isActive); // Mutation targets: filter, ===
}

// Test that kills mutants
describe('findActiveUsers', () => {
  it('should return only active users', () => {
    const users = [
      { id: 1, isActive: true },
      { id: 2, isActive: false },
      { id: 3, isActive: true }
    ];

    const active = findActiveUsers(users);

    expect(active).toHaveLength(2);
    expect(active.map(u => u.id)).toEqual([1, 3]);
  });

  it('should return empty array for inactive users', () => {
    const users = [
      { id: 1, isActive: false },
      { id: 2, isActive: false }
    ];

    const active = findActiveUsers(users);

    expect(active).toHaveLength(0);
  });
});
```

### 3. Test String Operations

```typescript
// Source code with mutants
function formatUsername(firstName: string, lastName: string): string {
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}`; // Multiple mutation targets
}

// Test that kills mutants
describe('formatUsername', () => {
  it('should format username with lowercase and dot separator', () => {
    expect(formatUsername('John', 'Doe')).toBe('john.doe');
    expect(formatUsername('JANE', 'SMITH')).toBe('jane.smith');
  });

  it('should handle empty strings', () => {
    expect(formatUsername('', '')).toBe('.');
  });

  it('should handle special characters', () => {
    expect(formatUsername('José', 'O\'Connor')).toBe('josé.o\'connor');
  });
});
```

## Analyzing Mutation Reports

### HTML Report Analysis

After running `bun run test:mutation`, examine the HTML report:

1. **Surviving Mutants**: Focus on mutants that survived
2. **Coverage Analysis**: Check if tests cover all code paths
3. **Mutant Categories**: Identify patterns in surviving mutants

### Common Surviving Mutant Types

```typescript
// Example: Surviving equality mutant
if (user.age >= 18) { // Original
  user.canVote = true;
}

// Mutant that survived
if (user.age > 18) { // Changed >= to >
  user.canVote = true;
}

// Fix: Test boundary condition
it('should allow voting at exactly 18 years old', () => {
  const user = createUser({ age: 18 });
  expect(user.canVote).toBe(true);
});
```

### Improving Low Scores

#### 1. Add Boundary Tests
```typescript
// Add tests for edge cases
it('should handle boundary conditions', () => {
  expect(validator.isValid(0)).toBe(false); // Boundary
  expect(validator.isValid(1)).toBe(true);  // Just above boundary
});
```

#### 2. Test Error Conditions
```typescript
it('should throw error for negative values', () => {
  expect(() => calculator.sqrt(-1)).toThrow('Cannot calculate square root of negative number');
});
```

#### 3. Test Specific Return Values
```typescript
// Instead of generic assertions
expect(result).toBeDefined();

// Use specific assertions
expect(result).toEqual({ id: 1, status: 'active' });
```

## Integration with CI/CD

### GitHub Actions Workflow

```yaml
# .github/workflows/mutation-testing.yml
name: Mutation Testing

on:
  pull_request:
    branches: [main]

jobs:
  mutation:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Bun
        uses: oven-sh/setup-bun@v1

      - name: Install dependencies
        run: bun install

      - name: Run mutation testing
        run: bun run test:mutation

      - name: Upload mutation report
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: mutation-report
          path: reports/mutation/html
```

### Quality Gates

```typescript
// scripts/check-mutation-score.ts
import { readFileSync } from 'fs';
import { resolve } from 'path';

interface MutationReport {
  metrics: {
    mutationScore: number;
  };
}

export function checkMutationScore(packagePath: string): void {
  const reportPath = resolve(packagePath, 'reports/mutation/mutation.json');
  const report: MutationReport = JSON.parse(readFileSync(reportPath, 'utf8'));

  const score = report.metrics.mutationScore;
  const threshold = 80;

  if (score < threshold) {
    console.error(`❌ Mutation score ${score}% is below threshold ${threshold}%`);
    process.exit(1);
  }

  console.log(`✅ Mutation score ${score}% passes threshold ${threshold}%`);
}
```

## Best Practices Summary

### ✅ Do
- Write specific assertions that verify exact behavior
- Test boundary values and edge cases
- Include error path testing
- Use meaningful test data
- Structure tests to kill multiple mutants
- Review mutation reports and improve weak tests

### ❌ Don't
- Write tests that always pass
- Use generic assertions (toBeDefined, toBeTruthy)
- Skip error condition testing
- Ignore boundary cases
- Accept low mutation scores without investigation
- Use eslint-disable to bypass quality gates

## Troubleshooting

### Common Issues

1. **Low mutation score on utility functions**
   - Add more specific assertions
   - Test edge cases and error conditions
   - Use boundary value testing

2. **Mutants surviving in simple functions**
   - Check if tests are actually testing the function logic
   - Add tests for different input combinations
   - Verify assertions are specific enough

3. **Performance issues**
   - Reduce concurrency in stryker.config.json
   - Use selective mutation targeting
   - Exclude non-critical files from mutation

### Debug Mode

```bash
# Run with debugging
bun run test:mutation:debug

# Check specific mutants
stryker run --mutators '<operator>'

# Limit to specific files
stryker run --mutate 'src/services/*.ts'
```

## Resources

- [Stryker Documentation](https://stryker-mutator.io/docs/)
- [Mutation Testing Best Practices](https://stryker-mutator.io/docs/guides/mutation-testing-best-practices)
- [Nìmata Quality Standards](docs/solution-architecture.md)
- [Bun Testing Patterns](bun-testing-patterns.md)