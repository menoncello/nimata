# ESLint - Maximum Quality Rules

## 📋 Configuration Summary

This ESLint configuration is set up with **MAXIMUM STRICTNESS** to ensure the highest possible code quality.

**Philosophy:** Zero tolerance for warnings - **EVERYTHING IS AN ERROR**.

## 🔌 Installed Plugins

1. **@typescript-eslint** (v8.46.1) - TypeScript linting
2. **eslint-plugin-sonarjs** (v3.0.5) - Code quality & complexity
3. **eslint-plugin-unicorn** (v61.0.2) - Modern best practices
4. **eslint-plugin-import** (v2.32.0) - Import management
5. **eslint-plugin-jsdoc** (v61.1.4) - Documentation quality

## 📏 Complexity and Size Limits

| Metric                      | Limit | Rule                           |
| --------------------------- | ----- | ------------------------------ |
| **Lines per function**      | 30    | `max-lines-per-function`       |
| **Lines per file**          | 300   | `max-lines`                    |
| **Cyclomatic complexity**   | 10    | `complexity`                   |
| **Cognitive complexity**    | 15    | `sonarjs/cognitive-complexity` |
| **Nesting depth**           | 3     | `max-depth`                    |
| **Parameters per function** | 4     | `max-params`                   |
| **Statements per function** | 15    | `max-statements`               |
| **Nested callbacks**        | 3     | `max-nested-callbacks`         |

## 🚫 Duplicated Code

- **Duplicated strings:** Error if string appears 3+ times (`sonarjs/no-duplicate-string`)
- **Identical functions:** Error (`sonarjs/no-identical-functions`)
- **Duplicated branches:** Error (`sonarjs/no-duplicated-branches`)
- **Duplicated imports:** Error (`import/no-duplicates`)

## 📐 TypeScript - Maximum Type Safety

```typescript
// ❌ FORBIDDEN
function test(data: any) { ... }                    // @typescript-eslint/no-explicit-any
function process(data) { ... }                      // @typescript-eslint/explicit-function-return-type
export function api(data) { ... }                   // @typescript-eslint/explicit-module-boundary-types
const value = data!.property                        // @typescript-eslint/no-non-null-assertion

// ✅ CORRECT
function test(data: SomeType): ReturnType { ... }
function process(data: Input): Output { ... }
export function api(data: Request): Response { ... }
const value = data?.property ?? defaultValue
```

## 📦 Import Management

### Required Rules

1. **Alphabetical ordering** with groups:
   - builtin (node modules)
   - external (npm packages)
   - internal (project)
   - parent/sibling/index

2. **No blank lines** between imports

3. **Blank line required** after imports

4. **No default exports** (use named exports)

### Example

```typescript
// ✅ CORRECT
import { spawn } from 'bun';
import pc from 'picocolors';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { configureContainer } from './container.js';
import { initCommand } from './commands/init.js';

// Code here...

// ❌ WRONG
import { initCommand } from './commands/init.js';
import yargs from 'yargs'; // Wrong order
import pc from 'picocolors';
import { spawn } from 'bun';
// Missing blank line

export default function () {} // Default export forbidden
```

## 📝 JSDoc Documentation

### Required for

- ✅ Function Declarations
- ✅ Method Definitions
- ✅ Class Declarations
- ❌ Arrow Functions (optional)
- ❌ Function Expressions (optional)

### Required Fields

```typescript
/**
 * Function description (REQUIRED)
 *
 * @param name - Parameter description (REQUIRED)
 * @param age - Parameter description (REQUIRED)
 * @returns Return value description (REQUIRED)
 */
export function createUser(name: string, age: number): User {
  return { name, age };
}
```

## 🎯 Best Practices (Unicorn)

### Naming

- **Files:** kebab-case required (`user-service.ts` ✅, `UserService.ts` ❌)
- **Interfaces:** PascalCase without I prefix (`User` ✅, `IUser` ❌)
- **Types:** PascalCase (`UserData` ✅)
- **Enums:** PascalCase (`UserRole` ✅)

### Modern Code

```typescript
// ❌ WRONG
for (let i = 0; i < arr.length; i++) {} // unicorn/no-for-loop
const found = arr.filter((x) => x.id === 1)[0]; // unicorn/prefer-array-find
const hasItems = arr.length > 0; // unicorn/explicit-length-check
value ? value : defaultValue; // unicorn/prefer-ternary

// ✅ CORRECT
for (const item of arr) {
}
const found = arr.find((x) => x.id === 1);
const hasItems = arr.length > 0;
value ?? defaultValue;
```

## 🧪 Test Exceptions

Files `**/*.test.ts`, `**/*.spec.ts`, and `**/tests/**/*.ts` have relaxed rules:

- ✅ `any` types allowed (for mocks)
- ✅ Long functions allowed (complex scenarios)
- ✅ Magic numbers allowed
- ✅ Duplicated strings allowed
- ✅ Default exports allowed
- ✅ JSDoc optional

## 🚀 Commands

```bash
# Check code
bun run lint

# Auto-fix
bun run lint:fix

# Format code
bun run format

# Check formatting
bun run format:check
```

## 📊 Benefits

### Code Quality

- ✅ Small and focused functions (max 30 lines)
- ✅ Low complexity (max 10 cyclomatic)
- ✅ Zero code duplication
- ✅ 100% type safety

### Maintainability

- ✅ Self-documenting code
- ✅ Consistent structure
- ✅ Easy to understand and modify

### Bug Prevention

- ✅ Early problem detection
- ✅ Code smells eliminated
- ✅ Best practices enforced

## 🎯 Quality Metrics

With these rules, the code meets the highest industry standards:

- **Cyclomatic Complexity:** ≤ 10 (Excellent)
- **Cognitive Complexity:** ≤ 15 (Very Good)
- **Lines per Function:** ≤ 30 (Excellent)
- **Type Coverage:** 100% (No `any`)
- **Code Duplication:** 0% (Zero tolerance)

## 📚 References

- [TypeScript ESLint](https://typescript-eslint.io/)
- [SonarJS](https://github.com/SonarSource/eslint-plugin-sonarjs)
- [Unicorn](https://github.com/sindresorhus/eslint-plugin-unicorn)
- [ESLint Import](https://github.com/import-js/eslint-plugin-import)
- [ESLint JSDoc](https://github.com/gajus/eslint-plugin-jsdoc)

---

**Status:** ✅ All rules configured and validated
**Severity:** MAXIMUM - Zero warnings, everything is error
**Last updated:** 2025-10-16
