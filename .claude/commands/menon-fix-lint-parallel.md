# /menon:fix-lint-parallel - Advanced Parallel ESLint Fix

Applies advanced lint fixes using parallel processing for optimal performance.

## Purpose

This command is automatically triggered when `bunx eslint . --fix` fails in the `/menon:qa-fix` workflow. It applies comprehensive lint fixes using parallel execution strategies.

## Workflow

### Phase 1: Lint Issue Detection

1. **Run comprehensive lint check**
   - Command: `bunx eslint . --format=json`
   - Output: Detailed JSON report of all lint violations
   - Purpose: Identify exact files and violations that need fixing

2. **Parse and categorize issues**
   - Group violations by file
   - Categorize by rule type and severity
   - Count total violations per file

### Phase 2: Parallel Fix Strategy

1. **File distribution across parallel workers**
   - Split files with violations into batches
   - Distribute evenly across available CPU cores
   - Ensure no file conflicts between workers

2. **Parallel execution**
   - Launch multiple `bunx eslint --fix [file-pattern]` processes
   - Each worker handles a subset of files
   - Workers run simultaneously for maximum speed

### Phase 3: Verification

1. **Re-run lint check**
   - Command: `bunx eslint .`
   - Verify all violations are resolved
   - Check for any remaining errors

2. **Report results**
   - Number of files fixed
   - Number of violations resolved
   - Any remaining issues (if any)

## Implementation Strategy

```bash
# Get list of files with lint issues
bunx eslint . --format=json > lint-report.json

# Parse and split into batches
# For each batch, run parallel eslint fix
bunx eslint --fix [batch-1-files] &
bunx eslint --fix [batch-2-files] &
bunx eslint --fix [batch-3-files] &
wait

# Verify all issues resolved
bunx eslint .
```

## Expected Outcome

- All ESLint violations resolved across all files
- Code follows project's linting rules
- Exit code 0 (success)
- Detailed report of fixes applied

## Related Commands

- `/menon:qa-fix` - Main workflow that triggers this command
- `/menon:fix-ts-parallel` - TypeScript fixes
- `/menon:fix-format-parallel` - Formatting fixes
- `/menon:fix-test-parallel` - Test fixes
