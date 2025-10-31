# /menon:qa-fix - Comprehensive Quality Assurance Parallel Workflow

Executes parallel code quality checks and applies automatic fixes when needed.

## Workflow Description

This command runs quality assurance checks in parallel and automatically applies fixes based on the results.

### Step 1: Parallel Execution

Execute the following commands **in parallel**:

1. **ESLint Check & Auto-fix**
   - Command: `bunx eslint . --fix`
   - Purpose: Automatically fix linting violations
   - Expected: Zero errors after execution

2. **TypeScript Type Check**
   - Command: `bunx tsc --noEmit`
   - Purpose: Verify TypeScript compilation without emitting files
   - Expected: Zero type errors

3. **Prettier Formatting**
   - Command: `bunx prettier --write "**/*.{ts,tsx,js,jsx,json,md}"`
   - Purpose: Format all source files consistently
   - Expected: All files formatted

4. **Run Tests**
   - Command: `bun run test`
   - Purpose: Execute all test suites
   - Expected: 100% pass rate

### Step 2: Result Analysis

Wait for all parallel commands to complete, then analyze each result:

- Check exit codes from each command
- Identify which commands succeeded (exit code 0) or failed (exit code != 0)
- Store results for fix application

### Step 3: Conditional Fix Execution

Based on Step 1 results, execute fix commands:

**If ESLint failed (exit code != 0):**
- Execute: `/menon:fix-lint-parallel`
- Purpose: Advanced parallel lint fixing

**If TypeScript failed (exit code != 0):**
- Execute: `/menon:fix-ts-parallel`
- Purpose: TypeScript error resolution

**If Prettier failed (exit code != 0):**
- Execute: `/menon:fix-format-parallel`
- Purpose: File formatting fixes

**If Tests failed (exit code != 0):**
- Execute: `/menon:fix-test-parallel`
- Purpose: Test failure resolution

**If all commands succeeded (exit code 0 for all):**
- Display success message: "✅ All quality checks passed!"
- Exit process normally

## Implementation Notes

### Parallel Execution Strategy

Use background bash processes or job control to run all 4 commands simultaneously:

```bash
# Launch all commands in background
bunx eslint . --fix &
bunx tsc --noEmit &
bunx prettier --write "**/*.{ts,tsx,js,jsx,json,md}" &
bun run test &

# Wait for all background jobs to complete
wait

# Capture exit codes
# Apply fixes based on results
```

### Error Handling

- Each command must be monitored independently
- Exit codes must be captured for conditional logic
- Fix commands should only be triggered if the corresponding check failed
- Multiple fix commands can run if multiple checks failed

### Output Requirements

Provide clear progress indication:
- Show which commands are running
- Display results as each command completes
- Clearly indicate which fixes are being applied
- Final summary of all checks and applied fixes

## Expected Outcome

- **Success Path**: All 4 checks pass → No fixes needed → Exit with success
- **Partial Success**: Some checks fail → Apply targeted fixes → Re-run failed checks
- **Complete Success After Fixes**: All checks eventually pass → Exit with success

## Usage Example

```bash
/menon:qa-fix
```

This will:
1. Run all 4 quality checks in parallel
2. Wait for all to complete
3. Apply any necessary fixes
4. Report final status

## Related Commands

- `/menon:fix-lint-parallel` - Advanced parallel lint fixing
- `/menon:fix-ts-parallel` - TypeScript error resolution
- `/menon:fix-format-parallel` - File formatting fixes
- `/menon:fix-test-parallel` - Test failure resolution
