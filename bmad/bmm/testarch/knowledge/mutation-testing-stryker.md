# Stryker Mutation Testing

## Configuration

This project uses Stryker for mutation testing with the following configuration:

```json
{
  "testRunner": "command",
  "commandRunner": {
    "command": "bun test"
  },
  "plugins": ["@stryker-mutator/typescript-checker"],
  "checkers": ["typescript"],
  "mutate": ["apps/cli/src/**/*.ts", "!apps/cli/src/**/*.test.ts"],
  "thresholds": {
    "high": 90,
    "low": 80,
    "break": 80
  },
  "coverageAnalysis": "perTest"
}
```

## Mutation Score Requirements

- **Target**: 80%+ mutation score (minimum for merge approval)
- **High**: 90%+ (ideal target for critical code)
- **Break**: Below 80% blocks CI/CD pipeline
- **Coverage Analysis**: PerTest to identify which tests kill which mutants

## Understanding Mutation Testing

Mutation testing introduces small changes (mutants) to your code and checks if your tests catch them:

1. **Killed Mutant**: Test fails when mutant is introduced (good!)
2. **Survived Mutant**: Test passes despite mutant (bad - need better test)
3. **Timeout Mutant**: Test takes too long (potential infinite loop)
4. **Error Mutant**: Test crashes (need better error handling)

## Common Mutant Types

- **Arithmetic Operators**: `+` → `-`, `*` → `/`
- **Logical Operators**: `&&` → `||`, `||` → `&&`
- **Conditional Statements**: `if (true)` → `if (false)`
- **Array Methods**: `map` → `filter`, `forEach` → `map`
- **String Methods**: `includes` → `startsWith`, `endsWith` → `includes`

## Test Design for Mutation Testing

### 1. Test Boundary Conditions

```typescript
// Bad - only tests happy path
it('should add numbers', () => {
  expect(add(2, 3)).toBe(5);
});

// Good - tests boundary conditions
it('should handle boundary values', () => {
  expect(add(0, 0)).toBe(0);
  expect(add(-1, 1)).toBe(0);
  expect(add(Number.MAX_SAFE_INTEGER, 1)).toBe(Number.MAX_SAFE_INTEGER + 1);
});
```

### 2. Test Error Paths

```typescript
// Bad - only tests success case
it('should parse valid JSON', () => {
  expect(parseJson('{"key": "value"}')).toEqual({key: 'value'});
});

// Good - tests error cases
it('should handle invalid JSON', () => {
  expect(() => parseJson('invalid')).toThrow();
  expect(() => parseJson('')).toThrow();
  expect(() => parseJson(null)).toThrow();
});
```

### 3. Test Null/Undefined Cases

```typescript
it('should handle null and undefined inputs', () => {
  expect(processData(null)).toBeNull();
  expect(processData(undefined)).toBeUndefined();
  expect(processData('')).toBe('');
});
```

### 4. Use Specific Assertions

```typescript
// Bad - generic assertion
it('should return something', () => {
  expect(result).toBeTruthy();
});

// Good - specific assertion
it('should return correct user object', () => {
  expect(result).toEqual({
    id: 1,
    name: 'Test User',
    email: 'test@example.com'
  });
});
```

## Running Mutation Tests

```bash
# Run mutation tests
bun run test:mutation

# Run with specific package
bunx turbo run test:mutation --filter=@nimata/cli

# View detailed HTML report
open reports/mutation/mutation-report.html
```

## Improving Mutation Scores

### 1. Identify Surviving Mutants

Check the HTML report for:
- **Red mutants**: Survived (need better tests)
- **Yellow mutants**: Timeout (potential infinite loops)
- **Green mutants**: Killed (good coverage)

### 2. Add Targeted Tests

For each surviving mutant:
```typescript
// If mutant changes `+` to `-` and survives
it('should handle subtraction correctly', () => {
  expect(calculate(5, 3, 'subtract')).toBe(2);
});

// If mutant changes `&&` to `||` and survives
it('should require both conditions', () => {
  expect(validateUser(null, 'password')).toBe(false);
  expect(validateUser('user', null)).toBe(false);
  expect(validateUser('user', 'password')).toBe(true);
});
```

### 3. Focus on Business Logic

Prioritize mutation testing for:
- **Core business logic**: Validation, calculations, transformations
- **Security checks**: Authentication, authorization, input validation
- **Data processing**: Parsing, formatting, conversions
- **Error handling**: Exception cases, edge conditions

## Integration with CI/CD

- **Pull Request**: Block merge if mutation score < 80%
- **Main Branch**: Target 90%+ mutation score
- **Critical Files**: Require 95%+ mutation score for security-sensitive code

## Best Practices

1. **Write meaningful tests**: Each test should verify specific behavior
2. **Test edge cases**: Boundary values, null/undefined, error conditions
3. **Avoid test duplication**: Each test should add unique value
4. **Use proper TypeScript types**: No 'any' types in test code
5. **Keep tests fast**: Mutation testing runs many test executions
6. **Review surviving mutants**: Each represents a gap in test coverage

## Common Pitfalls

- **Testing implementation details**: Focus on behavior, not internal code
- **Over-mocking**: Mock only external dependencies, not the code being tested
- **Ignored mutants**: Use `// Stryker disable next-line` sparingly and document why
- **Complex test setup**: Keep tests simple and focused
- **Mutation testing on integration tests**: Focus on unit tests for mutation testing