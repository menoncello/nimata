# Complete Code Quality Fix Skill

Orchestrates comprehensive code quality workflow using specialized skills.

## Usage

Execute `quality-fix` to run the complete quality improvement workflow:

- Runs lint, typecheck, and tests to identify all issues
- Launches specialized skills for each area: eslint-fix, typecheck-fix, test-fix
- Coordinates fixes in optimal sequence (lint → types → tests)
- Validates zero errors across all quality dimensions
- Generates comprehensive fix report with metrics

## Process

1. **Initial Assessment**: Run all quality checks and categorize issues
2. **ESLint Phase**: Execute `eslint-fix` to resolve all linting violations
3. **TypeScript Phase**: Execute `typecheck-fix` to resolve all type errors
4. **Test Phase**: Execute `test-fix` to resolve all test failures
5. **Final Validation**: Verify 0 errors across all categories

## Result

Returns complete quality fix report with:

- Before/after metrics for all categories
- Detailed inventory of all changes made
- Quality improvements achieved
- Verification that all quality gates passed

## Individual Skills

You can also execute individual skills for specific areas:

- `eslint-fix`: Fix only ESLint violations
- `typecheck-fix`: Fix only TypeScript errors
- `test-fix`: Fix only failing tests
