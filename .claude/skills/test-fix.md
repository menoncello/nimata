# Test Fix Skill

Fixes all failing tests and improves test quality across the codebase.

## Usage

Execute `test-fix` to run the complete test fixing workflow:

- Analyzes all failing tests across packages using `bunx turbo test`
- Fixes syntax errors, assertion failures, and logic issues
- Improves test coverage for uncovered code paths
- Achieves mutation testing thresholds without lowering standards
- Maintains test quality while ensuring 100% pass rate

## Process

1. **Assessment**: `bunx turbo test` to catalog all test failures
2. **Critical Fixes**: Syntax errors, import issues, assertion failures
3. **Quality Improvement**: Coverage gaps, edge cases, integration tests
4. **Mutation Testing**: Improve tests to kill surviving mutants
5. **Validation**: Verify 100% test pass rate across all packages

## Result

Returns comprehensive report of all test fixes applied with coverage improvements and mutation testing compliance.
