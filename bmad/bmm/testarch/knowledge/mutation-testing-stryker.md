# Mutation Testing with Stryker - BMAD Quality Standards

## Overview

This document defines the MANDATORY mutation testing requirements for BMAD projects using Stryker. These requirements are ZERO TOLERANCE - all packages MUST meet the specified thresholds without exception.

## ZERO TOLERANCE Requirements

### Mandatory Thresholds - NO EXCEPTIONS

- ✅ **Regular packages**: 80% mutation score (minimum)
- ✅ **Core packages**: 85% mutation score (minimum)
- ✅ **Build will BREAK** if thresholds not met
- ✅ **NEVER lower thresholds** to make tests pass
- ✅ **Additional tests MUST be written** to meet requirements

### Quality Enforcement - MANDATORY

- ✅ All mutation tests must pass before story completion
- ✅ Stryker must be integrated into CI/CD pipeline
- ✅ Mutation score reports must be generated and reviewed
- ✅ Surviving mutants must be addressed immediately

## Stryker Configuration Standards

### Root Configuration (stryker.config.js)

```javascript
module.exports = {
  // BMAD MANDATORY: 80%+ mutation score REQUIRED
  mutate: [
    'packages/**/*.js',
    'packages/**/*.ts',
    'apps/**/*.js',
    'apps/**/*.ts',
    '!**/*.test.js',
    '!**/*.test.ts',
    '!**/*.spec.js',
    '!**/*.spec.ts',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/coverage/**',
    '!**/stryker-tmp/**',
  ],

  testRunner: 'command',
  commandRunner: {
    command: 'bun test',
    commandType: 'bun',
  },

  reporters: ['progress', 'html', 'clear-text'],

  htmlReporter: {
    baseDir: 'reports/mutation/html',
  },

  coverageAnalysis: 'perTest',

  thresholds: {
    high: 90,
    low: 80,
    break: 80, // ZERO TOLERANCE: Build will break below 80%
  },

  // BMAD ENFORCEMENT: Settings
  maxConcurrentTestRunners: 4,
  timeout: 60000,
  timeoutFactor: 3,

  plugins: [
    '@stryker-mutator/core',
    '@stryker-mutator/bun-runner',
    '@stryker-mutator/typescript',
    '@stryker-mutator/javascript-mutator',
  ],

  tsconfigFile: 'tsconfig.json',

  mutator: {
    plugins: ['typescript', 'javascript'],
    exclude: [
      // Logging statements have no behavioral impact
      '**/logger.ts',
      '**/*.log.ts',
    ],
  },

  // BMAD MANDATORY: No exclusions for convenience
  ignoreStatic: false,
  ignoreConstant: false,
};
```

### Package-Specific Configurations

#### Core Package (packages/core/stryker.config.js)

```javascript
module.exports = {
  // BMAD MANDATORY: 85%+ mutation score for core packages
  mutate: ['src/**/*.ts', '!src/**/*.test.ts', '!src/**/*.spec.ts', '!src/**/*.d.ts'],

  testRunner: 'command',
  commandRunner: {
    command: 'bun test --cwd packages/core',
    commandType: 'bun',
  },

  reporters: ['progress', 'html', 'clear-text'],

  htmlReporter: {
    baseDir: 'packages/core/reports/mutation/html',
  },

  coverageAnalysis: 'perTest',

  // CORE PACKAGE HIGHER REQUIREMENTS
  thresholds: {
    high: 95,
    low: 85,
    break: 85, // ZERO TOLERANCE: Core must exceed 85%
  },

  // Core package requires HIGHER thresholds
  maxConcurrentTestRunners: 2,
  timeout: 60000,
  timeoutFactor: 3,

  plugins: [
    '@stryker-mutator/core',
    '@stryker-mutator/bun-runner',
    '@stryker-mutator/typescript',
    '@stryker-mutator/javascript-mutator',
  ],

  tsconfigFile: 'tsconfig.json',

  mutator: {
    plugins: ['typescript'],
    exclude: ['**/*.d.ts'],
  },

  // NO EXCLUSIONS for core package code
  ignoreStatic: false,
  ignoreConstant: false,

  mutatorOptions: {
    typescript: {
      // Core package must handle all edge cases
      excludedMutations: [], // NO EXCLUSIONS
    },
  },
};
```

## Test Strategies for High Mutation Scores

### 1. Boundary Value Testing

```typescript
// ✅ CORRECT: Test exact boundaries
describe('ScoreCalculator', () => {
  it('should handle boundary values correctly', () => {
    // Test exact boundary conditions
    expect(calculator.calculateLevel(0)).toBe('Beginner');
    expect(calculator.calculateLevel(100)).toBe('Master');
    expect(calculator.calculateLevel(99)).toBe('Expert');
    expect(calculator.calculateLevel(101)).toBe('Master'); // Cap value
  });
});
```

### 2. Error Path Testing

```typescript
// ✅ CORRECT: Test all error conditions
describe('UserService', () => {
  it('should handle all validation errors', () => {
    const testCases = [
      { data: { name: '' }, error: 'Name is required' },
      { data: { email: 'invalid' }, error: 'Invalid email format' },
      { data: { age: -1 }, error: 'Age must be positive' },
      { data: null, error: 'User data is required' },
      { data: undefined, error: 'User data is required' },
    ];

    testCases.forEach(({ data, error }) => {
      expect(() => userService.validate(data)).toThrow(error);
    });
  });
});
```

### 3. Strict Equality Testing

```typescript
// ✅ CORRECT: Use strict equality to catch mutations
describe('DataProcessor', () => {
  it('should use exact value matching', () => {
    // Use toBe() instead of toEqual() for primitives
    expect(result.status).toBe('active'); // Catches string mutations
    expect(result.count).toBe(5); // Catches arithmetic mutations
    expect(result.isValid).toBe(true); // Catches boolean mutations
  });
});
```

### 4. Conditional Logic Testing

```typescript
// ✅ CORRECT: Test all conditional branches
describe('AccessController', () => {
  it('should handle all permission combinations', () => {
    // Test true condition
    expect(controller.hasAccess(user, resource)).toBe(true);

    // Test false condition
    expect(controller.hasAccess(unauthorizedUser, resource)).toBe(false);

    // Test edge cases
    expect(controller.hasAccess(null, resource)).toBe(false);
    expect(controller.hasAccess(user, null)).toBe(false);
  });
});
```

## Common Mutant Types and How to Kill Them

### 1. Arithmetic Operator Mutations

```typescript
// Mutant: + changes to -, * changes to /
function calculateTotal(price: number, tax: number): number {
  return price + tax; // Mutant: price - tax
}

// Test to kill the mutant:
it('should correctly calculate total with addition', () => {
  expect(calculateTotal(100, 10)).toBe(110); // Original: 110, Mutant: 90
  expect(calculateTotal(50, 25)).toBe(75); // Original: 75, Mutant: 25
});
```

### 2. Boolean Operator Mutations

```typescript
// Mutant: && changes to ||
function isValidUser(user: User): boolean {
  return user.isActive && user.isVerified; // Mutant: user.isActive || user.isVerified
}

// Test to kill the mutant:
it('should require both active and verified status', () => {
  const activeOnly = { isActive: true, isVerified: false };
  const verifiedOnly = { isActive: false, isVerified: true };
  const bothActive = { isActive: true, isVerified: true };

  expect(isValidUser(activeOnly)).toBe(false); // Kills || mutation
  expect(isValidUser(verifiedOnly)).toBe(false); // Kills || mutation
  expect(isValidUser(bothActive)).toBe(true); // Expected behavior
});
```

### 3. Comparison Operator Mutations

```typescript
// Mutant: > changes to <
function isAdult(age: number): boolean {
  return age >= 18; // Mutant: age <= 18
}

// Test to kill the mutant:
it('should correctly identify adult status', () => {
  expect(isAdult(17)).toBe(false); // Kills <= mutation
  expect(isAdult(18)).toBe(true); // Boundary case
  expect(isAdult(19)).toBe(true); // Above boundary
  expect(isAdult(18)).toBe(true); // Exact boundary
});
```

## Running Mutation Tests

### During Development

```bash
# Run mutation tests for current package
bunx stryker run

# Run with specific configuration
bunx stryker run --configFile packages/core/stryker.config.js

# Run with HTML report for detailed analysis
bunx stryker run --reporters html,clear-text,progress
```

### During CI/CD

```bash
# Run mutation tests and fail if thresholds not met
bunx stryker run --break=80

# Generate reports for artifact storage
bunx stryker run --reporters html,json,clear-text
```

### Package-Specific Testing

```bash
# Test core package with higher threshold
cd packages/core && bunx stryker run --break=85

# Test adapter package with standard threshold
cd packages/adapters && bunx stryker run --break=80
```

## Analyzing Results

### HTML Report Analysis

1. **Open HTML report**: `reports/mutation/html/index.html`
2. **Review surviving mutants**: Click on each surviving mutant
3. **Understand the mutation**: See what code change survived
4. **Write targeted tests**: Create tests that would kill the mutant
5. **Re-run tests**: Verify mutant is now killed

### Common Issues and Solutions

#### Surviving Mutants Due to Untested Code

```typescript
// Problem: Code path never tested
if (process.env.NODE_ENV === 'development') {
  console.log('Debug mode');
}

// Solution: Test the code path
it('should handle development environment', () => {
  const originalEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = 'development';

  // Test behavior in development mode
  expect(() => logger.debug('test')).not.toThrow();

  process.env.NODE_ENV = originalEnv;
});
```

#### Surviving Mutants Due to Weak Assertions

```typescript
// Problem: Assertion too generic
expect(result).toBeDefined(); // Won't kill most mutants

// Solution: Use specific assertions
expect(result.id).toBe('expected-id');
expect(result.status).toBe('active');
expect(result.data.length).toBeGreaterThan(0);
```

## Integration with BMAD Workflows

### Story Development Workflow

1. **Write implementation code**
2. **Write comprehensive tests**
3. **Run unit tests**: `bun test`
4. **Run mutation testing**: `bunx stryker run`
5. **Review results**: Check HTML report
6. **Fix surviving mutants**: Add targeted tests
7. **Verify thresholds**: Ensure 80%+ score achieved
8. **Complete story**: Only when all quality gates pass

### Test Architecture Workflow

1. **Design test strategy with mutation testing in mind**
2. **Create test plans that target edge cases**
3. **Include mutation score requirements in specifications**
4. **Verify test patterns will kill common mutants**
5. **Document mutation testing approach**

## Quality Gates - ZERO TOLERANCE

### Automated Enforcement

- ✅ **Build breaks** if mutation score below threshold
- ✅ **Story progress blocked** until thresholds met
- ✅ **PR checks fail** if mutation score regresses
- ✅ **Release blocked** if any package below threshold

### Manual Review Requirements

- ✅ Review HTML mutation reports for each package
- ✅ Understand why each surviving mutant survived
- ✅ Verify targeted tests address specific mutants
- ✅ Document any legitimate surviving mutants (rare exceptions)

### Exception Process

- ❌ **NO EXCEPTIONS** to mutation thresholds
- ❌ **NO TEMPORARY WAIVERS** allowed
- ❌ **NO MANUAL OVERRIDES** permitted
- ✅ **ONLY SOLUTION**: Write better tests

---

**ZERO TOLERANCE POLICY**: Mutation testing is mandatory for all BMAD projects. Thresholds must be met without exception. Build will break, story progress will be blocked, and releases will be prevented if mutation score requirements are not satisfied.
