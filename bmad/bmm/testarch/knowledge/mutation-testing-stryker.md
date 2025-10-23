# Mutation Testing with Stryker

## Configuration

- **Tool**: Stryker 9.x
- **Test Runner**: Bun Test
- **Thresholds**:
  - High: 90%
  - Low: 80%
  - Break: 80%
- **Coverage Analysis**: perTest
- **Plugins**: @stryker-mutator/typescript-checker

## Configuration Example

```json
{
  "$schema": "./node_modules/@stryker-mutator/core/schema/stryker-schema.json",
  "testRunner": "command",
  "commandRunner": {
    "command": "bun test"
  },
  "plugins": ["@stryker-mutator/typescript-checker"],
  "checkers": ["typescript"],
  "tsconfigFile": "tsconfig.json",
  "mutate": ["src/**/*.ts", "!src/**/*.test.ts"],
  "ignorePatterns": [
    "dist",
    "node_modules",
    "coverage",
    "**/*.d.ts",
    "**/*.test.ts",
    "**/tests/**"
  ],
  "reporters": ["html", "clear-text", "progress"],
  "coverageAnalysis": "perTest",
  "thresholds": {
    "high": 90,
    "low": 80,
    "break": 80
  }
}
```

## Best Practices

### Structure Tests to Kill Mutants

1. **Test Boundary Values**

   ```typescript
   it('should handle boundary values', () => {
     expect(calculateScore(0)).toBe(0);
     expect(calculateScore(100)).toBe(100);
     expect(calculateScore(-1)).toBe(0);
   });
   ```

2. **Test Null/Undefined Cases**

   ```typescript
   it('should handle null input gracefully', () => {
     expect(() => processData(null)).toThrow('Invalid input');
   });
   ```

3. **Test Error Paths**

   ```typescript
   it('should throw when data is invalid', () => {
     const invalidData = { name: '', email: 'invalid' };
     expect(() => validateUser(invalidData)).toThrow();
   });
   ```

4. **Avoid Meaningless Assertions**

   ```typescript
   // Bad - won't kill mutants
   expect(result).toBeDefined();
   expect(array.length).toBeGreaterThan(0);

   // Good - specific assertions that validate behavior
   expect(result.id).toBe('expected-id');
   expect(array[0].name).toBe('expected-name');
   ```

### Common Mutant Patterns

- **Arithmetic operators**: `+` → `-`, `*` → `/`
- **Boolean operators**: `&&` → `||`, `!` → (no-op)
- **Comparison operators**: `===` → `!==`, `>` → `<`
- **Conditional statements**: `if (condition)` → `if (!condition)`
- **Return statements**: `return value` → `return undefined`

### Running Mutation Tests

```bash
# Run mutation tests for specific package
bunx turbo run test:mutation --filter=core

# Run mutation tests with coverage report
bunx stryker run --reporters html,clear-text

# Check mutation score threshold
bunx stryker run --break=80
```

### Interpreting Results

- **Surviving mutants**: Tests not comprehensive enough
- **Killed mutants**: Tests caught the mutation (good!)
- **Timed out mutants**: Tests likely hanging on infinite loops
- **No coverage mutants**: Code not tested at all

### Improving Mutation Scores

1. **Add targeted tests for surviving mutants**
2. **Test edge cases and boundary conditions**
3. **Test error handling paths**
4. **Remove unused/dead code**
5. **Make assertions more specific**
