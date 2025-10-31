# /menon:fix-format-parallel - Advanced Parallel Prettier Formatting

Applies consistent code formatting using Prettier with parallel processing for large codebases.

## Purpose

This command is automatically triggered when `bunx prettier --write` fails in the `/menon:qa-fix` workflow. It ensures consistent code formatting across all project files.

## Workflow

### Phase 1: Format Detection

1. **Check current formatting**
   - Command: `bunx prettier --check "**/*.{ts,tsx,js,jsx,json,md}"`
   - Output: List of files that need formatting
   - Purpose: Identify files with formatting violations

2. **Categorize file types**
   - TypeScript/JavaScript files
   - JSON configuration files
   - Markdown documentation
   - Other supported formats

### Phase 2: Parallel Formatting Strategy

1. **File distribution**
   - Split files by type and directory
   - Distribute across available CPU cores
   - Group related files together for consistency

2. **Parallel format execution**
   - Run multiple Prettier processes simultaneously
   - Each process handles a subset of files
   - Preserve formatting dependencies

### Phase 3: Format Application

For each file batch, apply Prettier formatting:

1. **Prettier write operation**
   - Command: `bunx prettier --write [file-pattern]`
   - Applied to: All files in the batch
   - Ensures: Consistent indentation, spacing, quotes, etc.

2. **Config-aware formatting**
   - Respects `.prettierrc` configuration
   - Follows project-specific rules
   - Maintains existing code structure

### Phase 4: Verification

1. **Re-run format check**
   - Command: `bunx prettier --check "**/*.{ts,tsx,js,jsx,json,md}"`
   - Verify all files are properly formatted
   - No formatting violations should remain

2. **Report results**
   - Number of files formatted
   - Types of formatting changes applied
   - Final formatting status

## Implementation Strategy

```bash
# Check which files need formatting
bunx prettier --check "**/*.{ts,tsx,js,jsx,json,md}" > format-report.txt

# Split files into parallel batches
# Batch 1: apps/* files
# Batch 2: packages/* files
# Batch 3: docs/* and root files

bunx prettier --write apps/**/*.{ts,tsx,js,jsx,json,md} &
bunx prettier --write packages/**/*.{ts,tsx,js,jsx,json,md} &
bunx prettier --write *.{json,md} &
wait

# Verify all files formatted
bunx prettier --check "**/*.{ts,tsx,js,jsx,json,md}"
```

## Expected Outcome

- All files properly formatted according to Prettier rules
- Consistent code style across entire project
- Exit code 0 (success)
- Detailed formatting report

## Related Commands

- `/menon:qa-fix` - Main workflow that triggers this command
- `/menon:fix-lint-parallel` - Linting fixes
- `/menon:fix-ts-parallel` - TypeScript fixes
- `/menon:fix-test-parallel` - Test fixes
