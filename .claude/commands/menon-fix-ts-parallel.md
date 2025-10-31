# /menon:fix-ts-parallel - Advanced Parallel TypeScript Fix

Applies TypeScript error fixes using parallel processing and intelligent error resolution.

## Purpose

This command is automatically triggered when `bunx tsc --noEmit` fails in the `/menon:qa-fix` workflow. It resolves TypeScript compilation errors efficiently using parallel strategies.

## Workflow

### Phase 1: Error Analysis

1. **Capture TypeScript errors**
   - Command: `bunx tsc --noEmit --pretty`
   - Output: Complete list of type errors with file locations
   - Purpose: Identify all TypeScript issues requiring resolution

2. **Categorize error types**
   - Missing type annotations
   - Type mismatches
   - Undefined variables/functions
   - Import/export issues
   - Generic type problems

### Phase 2: Parallel Resolution Strategy

1. **Error grouping by file**
   - Group errors by source file
   - Prioritize files with most errors
   - Identify dependencies between fixes

2. **Parallel fix execution**
   - Split files into batches based on error count
   - Run TypeScript fixes in parallel across batches
   - Each batch processed by a separate worker

### Phase 3: Intelligent Fixes

Common fix patterns applied in parallel:

1. **Type annotations**
   - Add missing `: Type` annotations
   - Infer types from context
   - Use generics where appropriate

2. **Import fixes**
   - Fix missing imports
   - Update import paths
   - Resolve module resolution issues

3. **Type safety**
   - Fix type assertions
   - Resolve union/intersection types
   - Handle generic constraints

### Phase 4: Verification

1. **Re-run TypeScript check**
   - Command: `bunx tsc --noEmit`
   - Verify all type errors resolved
   - Ensure no new errors introduced

2. **Report results**
   - Number of files fixed
   - Number of errors resolved
   - Types of fixes applied

## Implementation Strategy

```bash
# Capture all TypeScript errors
bunx tsc --noEmit > ts-errors.log

# Parse errors and group by file
# Apply fixes in parallel batches
# Batch 1: Files with critical errors
# Batch 2: Files with warnings
# Batch 3: Files with minor issues

wait

# Verify all errors resolved
bunx tsc --noEmit
```

## Expected Outcome

- All TypeScript compilation errors resolved
- Full type safety maintained
- Exit code 0 (success)
- Detailed fix report

## Related Commands

- `/menon:qa-fix` - Main workflow that triggers this command
- `/menon:fix-lint-parallel` - Linting fixes
- `/menon:fix-format-parallel` - Formatting fixes
- `/menon:fix-test-parallel` - Test fixes
