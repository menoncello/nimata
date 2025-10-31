# menonN Custom Claude Code Commands

Custom Claude Code slash commands for comprehensive quality assurance workflows.

## Overview

This command suite provides automated parallel quality checking and fixing for TypeScript/JavaScript projects using Bun.

## Available Commands

### Main Command

#### `/menon:qa-fix`
**Comprehensive Quality Assurance Parallel Workflow**

Executes the complete QA workflow:

1. **Parallel Execution** - Runs 4 checks simultaneously:
   - `bunx eslint . --fix` (Auto-fix linting)
   - `bunx tsc --noEmit` (Type check)
   - `bunx prettier --write "**/*.{ts,tsx,js,jsx,json,md}"` (Format)
   - `bun run test` (Run tests)

2. **Result Analysis** - Waits for all to complete, checks exit codes

3. **Conditional Fixes** - Applies fixes only for failed checks:
   - If ESLint failed → `/menon:fix-lint-parallel`
   - If TypeScript failed → `/menon:fix-ts-parallel`
   - If Prettier failed → `/menon:fix-format-parallel`
   - If Tests failed → `/menon:fix-test-parallel`

4. **Success Path** - If all checks pass, exits successfully

**Usage:**
```bash
/menon:qa-fix
```

### Fix Commands

#### `/menon:fix-lint-parallel`
Advanced parallel ESLint fixing with intelligent file distribution and batch processing.

**Triggered automatically when:** ESLint check fails
**What it does:**
- Analyzes lint violations across all files
- Distributes files across parallel workers
- Applies fixes using multiple `bunx eslint --fix` processes
- Verifies all violations resolved

#### `/menon:fix-ts-parallel`
Advanced parallel TypeScript error resolution with intelligent fix strategies.

**Triggered automatically when:** TypeScript compilation fails
**What it does:**
- Captures and categorizes TypeScript errors
- Groups errors by file and type
- Applies fixes in parallel batches
- Handles type annotations, imports, and type safety

#### `/menon:fix-format-parallel`
Advanced parallel Prettier formatting for consistent code style.

**Triggered automatically when:** Prettier formatting fails
**What it does:**
- Checks which files need formatting
- Distributes files by type and directory
- Applies Prettier formatting in parallel
- Verifies consistent code style

#### `/menon:fix-test-parallel`
Advanced parallel test failure resolution with intelligent error analysis.

**Triggered automatically when:** Test suite fails
**What it does:**
- Analyzes test failures and categorizes by type
- Groups failing tests for parallel fixing
- Applies fixes for assertions, async, dependencies
- Re-runs tests to verify fixes

## Implementation Architecture

```
/menon:qa-fix
│
├── Parallel Execution (4 processes)
│   ├── bunx eslint . --fix
│   ├── bunx tsc --noEmit
│   ├── bunx prettier --write ...
│   └── bun run test
│
├── Result Collection
│   ├── Check exit codes
│   ├── Identify failed checks
│   └── Store results
│
└── Conditional Fixes
    ├── ESLint failed? → /menon:fix-lint-parallel
    ├── TypeScript failed? → /menon:fix-ts-parallel
    ├── Prettier failed? → /menon:fix-format-parallel
    └── Tests failed? → /menon:fix-test-parallel
```

## Benefits

✅ **Parallel Execution** - All checks run simultaneously (faster)
✅ **Smart Fixes** - Only fixes what's broken (efficient)
✅ **Automatic** - No manual intervention needed (convenient)
✅ **Comprehensive** - Covers lint, types, format, tests (complete)
✅ **Parallel Fixes** - Fix commands also use parallel processing (scalable)

## Workflow Examples

### Example 1: All Checks Pass
```bash
$ /menon:qa-fix
🚀 Starting /menon:qa-fix
📋 Running parallel checks...
✅ ESLint: SUCCESS
✅ TypeScript: SUCCESS
✅ Prettier: SUCCESS
✅ Tests: SUCCESS
✨ All checks passed!
🎉 No fixes needed!
```

### Example 2: ESLint and Tests Fail
```bash
$ /menon:qa-fix
📋 Running parallel checks...
❌ ESLint: FAILED
✅ TypeScript: SUCCESS
✅ Prettier: SUCCESS
❌ Tests: FAILED
🔧 Applying fixes...
🔨 /menon:fix-lint-parallel → Applied
🔨 /menon:fix-test-parallel → Applied
✨ Fixes complete!
```

### Example 3: Partial Success After Fixes
```bash
$ /menon:qa-fix
📋 Running parallel checks...
❌ ESLint: FAILED
✅ TypeScript: SUCCESS
✅ Prettier: SUCCESS
❌ Tests: FAILED
🔧 Applying fixes...
🔨 /menon:fix-lint-parallel → Fixed 23 files
🔨 /menon:fix-test-parallel → Fixed 5 tests
✅ Re-running checks...
✨ All checks now pass!
```

## Technical Details

### Parallel Execution Strategy

The main command uses bash job control:

```bash
# Launch all 4 commands in background
command1 &
command2 &
command3 &
command4 &

# Wait for all to complete
wait

# Check exit codes
# Apply fixes as needed
```

### Error Handling

- Each command runs independently
- Exit codes captured for all processes
- Failed commands trigger specific fix commands
- Multiple fix commands can run in parallel
- Success only when all checks pass

### File Structure

```
.claude/commands/
├── menon-qa-fix.md              # Main command documentation
├── menon-fix-lint-parallel.md   # ESLint fix command
├── menon-fix-ts-parallel.md     # TypeScript fix command
├── menon-fix-format-parallel.md # Prettier fix command
├── menon-fix-test-parallel.md   # Test fix command
├── implement-qa-fix.sh          # Implementation demo script
└── README-menoN-commands.md     # This file
```

## Usage Instructions

### For Claude Code

1. Make sure your project has the command files in `.claude/commands/`
2. In Claude Code, type: `/menon:qa-fix`
3. The workflow will execute automatically
4. Watch the parallel execution and fix application

### For Direct Execution

You can also use the implementation script directly:

```bash
# Make executable
chmod +x .claude/commands/implement-qa-fix.sh

# Run directly
.claude/commands/implement-qa-fix.sh
```

## Integration with Claude Code

These commands are designed to work seamlessly with Claude Code's slash command system. When you type `/menon:qa-fix` in Claude Code:

1. Claude Code reads the command file
2. Displays the workflow description
3. Executes the commands as specified
4. Shows progress and results
5. Applies fixes automatically if needed

## Customization

You can customize these commands by editing the markdown files:

- **Add new checks:** Modify `/menon:qa-fix.md` to include additional parallel checks
- **Change fix commands:** Update the fix command names in the conditional logic
- **Modify commands:** Adjust the actual commands (bunx eslint, bunx tsc, etc.)
- **Add file patterns:** Extend the glob patterns for different file types

## Best Practices

1. **Run before commits** - Use `/menon:qa-fix` before pushing code
2. **CI integration** - Can be adapted for CI/CD pipelines
3. **Pre-commit hooks** - Combine with husky for automatic checking
4. **IDE integration** - Run via terminal in your editor

## Troubleshooting

**Commands not found?**
- Ensure files are in `.claude/commands/` directory
- Check file permissions (should be readable)
- Verify command names match exactly (case-sensitive)

**Parallel execution issues?**
- Ensure your system supports background jobs
- Check available CPU cores for parallel processing
- Monitor system resources during execution

**Fixes not applying?**
- Verify the fix command files exist
- Check that the commands referenced are correct
- Ensure proper error handling in fix scripts

## Support

For issues or questions about these commands, refer to:
- Claude Code documentation: https://docs.claude.com/
- Bun documentation: https://bun.sh/docs
- Project-specific documentation in `/docs`

---

**Created for:** Eduardo Menoncello
**Purpose:** Automated parallel quality assurance for TypeScript/JavaScript projects
**Dependencies:** Bun, ESLint, TypeScript, Prettier, Project test suite
**Last Updated:** 2025-10-31
