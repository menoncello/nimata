# /menon:qa-fix - Parallel Quality Assurance Fix Workflow

Execute this command to run parallel QA checks and automatically apply fixes in a loop until all checks pass.

## Workflow

**Step 1: Execute parallel QA checks**
- Run bunx eslint . --fix (parallel)
- Run bunx tsc --noEmit (parallel)
- Run bunx prettier --write "**/*.{ts,tsx,js,jsx,json,md}" (parallel)
- Run bun run test (parallel)

**Step 2: Analyze results**
- Check exit codes of all parallel processes
- Identify which checks failed

**Step 3: Apply fixes based on failures**
- If ESLint had issues → execute /menon:fix-lint-parallel
- If TypeScript had errors → execute /menon:fix-ts-parallel
- If Prettier had issues → execute /menon:fix-format-parallel
- If tests failed → execute /menon:fix-test-parallel
- If no errors → exit workflow

**Step 4: Repeat**
- Loop back to Step 1 until all checks pass

## Usage

Simply run:
```
/menon:qa-fix
```

The workflow will continue running until all quality checks pass successfully.
