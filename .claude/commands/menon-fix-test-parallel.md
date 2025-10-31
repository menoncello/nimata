# /menon:fix-test-parallel - Advanced Parallel Test Fixing

Resolves test failures using parallel processing and intelligent error analysis.

## Purpose

This command is automatically triggered when `bun run test` fails in the `/menon:qa-fix` workflow. It diagnoses and fixes test failures efficiently using parallel strategies.

## Workflow

### Phase 1: Test Failure Analysis

1. **Run tests to capture failures**
   - Command: `bun run test --reporter=json`
   - Output: Detailed JSON report of all test failures
   - Purpose: Identify exact failing tests and error messages

2. **Categorize failure types**
   - Assertion failures (expected vs actual)
   - Timeout errors
   - Missing dependencies
   - Setup/teardown issues
   - Async operation problems

### Phase 2: Parallel Fix Strategy

1. **Group failing tests**
   - Group by test file
   - Group by failure type
   - Identify tests that can be fixed in parallel
   - Consider test dependencies

2. **Parallel fix execution**
   - Distribute failing test files across workers
   - Each worker fixes a subset of tests
   - Run fixes simultaneously for speed

### Phase 3: Intelligent Fixes

Common fix patterns applied in parallel:

1. **Assertion fixes**
   - Update expected values
   - Fix comparison logic
   - Correct assertion methods

2. **Test setup fixes**
   - Fix beforeEach/afterEach hooks
   - Resolve fixture issues
   - Fix mock configurations

3. **Async test fixes**
   - Add missing `async/await`
   - Fix promise handling
   - Resolve timing issues

4. **Dependency fixes**
   - Fix import statements
   - Update test utilities
   - Resolve module resolution

### Phase 4: Re-run and Verify

1. **Re-run failing tests**
   - Execute fixed tests individually
   - Verify each fix resolves the issue
   - Ensure no regressions introduced

2. **Run full test suite**
   - Command: `bun run test`
   - Verify all tests pass
   - Check test coverage remains intact

## Implementation Strategy

```bash
# Run tests and capture failures
bun run test --reporter=json > test-results.json

# Parse failures and group by test file
# Fix tests in parallel batches
# Batch 1: Unit test failures
# Batch 2: Integration test failures
# Batch 3: E2E test failures

wait

# Re-run all tests to verify fixes
bun run test
```

## Expected Outcome

- All test failures resolved
- 100% test pass rate
- Exit code 0 (success)
- No regressions introduced
- Detailed fix report

## Related Commands

- `/menon:qa-fix` - Main workflow that triggers this command
- `/menon:fix-lint-parallel` - Linting fixes
- `/menon:fix-ts-parallel` - TypeScript fixes
- `/menon:fix-format-parallel` - Formatting fixes
