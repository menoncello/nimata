# /menon:qa-fix-parallel - Complete Parallel QA Fix Workflow with Loop

Execute this command to run parallel QA checks and automatically apply fixes in a continuous loop until all checks pass.

## Workflow Logic

**Step 1: Execute parallel QA checks (all at once)**
- bunx eslint . --fix
- bunx tsc --noEmit
- bunx prettier --write "**/*.{ts,tsx,js,jsx,json,md}"
- bun run test

**Step 2: Analyze results**
- Collect exit codes from all 4 parallel processes

**Step 3: Apply fixes based on failures**
- If ESLint failed (exit code ≠ 0) → execute /menon:fix-lint-parallel
- If TypeScript failed (exit code ≠ 0) → execute /menon:fix-ts-parallel
- If Prettier failed (exit code ≠ 0) → execute /menon:fix-format-parallel
- If Tests failed (exit code ≠ 0) → execute /menon:fix-test-parallel
- If all passed (exit code = 0 for all) → exit with success

**Step 4: Loop**
- Repeat from Step 1 until all checks pass

## Usage

```
/menon:qa-fix-parallel
```

The workflow will continuously run until all quality checks pass successfully. Press Ctrl+C to stop at any time.

## Implementation

```bash
#!/bin/bash

echo "🚀 Starting /menon:qa-fix-parallel - Continuous QA Fix Loop"
echo "=================================================================="
echo ""

ITERATION=1

while true; do
  echo "📋 Iteration $ITERATION - Running parallel QA checks..."
  echo ""

  # Run all 4 checks in parallel
  (
    echo "  └─ [1/4] Running: bunx eslint . --fix"
    bunx eslint . --fix > /tmp/eslint.log 2>&1
    ESLINT_EXIT=$?
    if [ $ESLINT_EXIT -eq 0 ]; then
      echo "     ✅ ESLint: SUCCESS"
    else
      echo "     ❌ ESLint: FAILED (exit code: $ESLINT_EXIT)"
    fi
    echo "$ESLINT_EXIT" > /tmp/eslint_exit.txt
  ) &

  (
    echo "  └─ [2/4] Running: bunx tsc --noEmit"
    bunx tsc --noEmit > /tmp/tsc.log 2>&1
    TSC_EXIT=$?
    if [ $TSC_EXIT -eq 0 ]; then
      echo "     ✅ TypeScript: SUCCESS"
    else
      echo "     ❌ TypeScript: FAILED (exit code: $TSC_EXIT)"
    fi
    echo "$TSC_EXIT" > /tmp/tsc_exit.txt
  ) &

  (
    echo "  └─ [3/4] Running: bunx prettier --write"
    bunx prettier --write "**/*.{ts,tsx,js,jsx,json,md}" > /tmp/prettier.log 2>&1
    PRETTIER_EXIT=$?
    if [ $PRETTIER_EXIT -eq 0 ]; then
      echo "     ✅ Prettier: SUCCESS"
    else
      echo "     ❌ Prettier: FAILED (exit code: $PRETTIER_EXIT)"
    fi
    echo "$PRETTIER_EXIT" > /tmp/prettier_exit.txt
  ) &

  (
    echo "  └─ [4/4] Running: bun run test"
    bun run test > /tmp/test.log 2>&1
    TEST_EXIT=$?
    if [ $TEST_EXIT -eq 0 ]; then
      echo "     ✅ Tests: SUCCESS"
    else
      echo "     ❌ Tests: FAILED (exit code: $TEST_EXIT)"
    fi
    echo "$TEST_EXIT" > /tmp/test_exit.txt
  ) &

  echo "⏳ Waiting for all checks to complete..."
  wait
  echo ""

  # Read exit codes
  ESLINT_EXIT=$(cat /tmp/eslint_exit.txt)
  TSC_EXIT=$(cat /tmp/tsc_exit.txt)
  PRETTIER_EXIT=$(cat /tmp/prettier_exit.txt)
  TEST_EXIT=$(cat /tmp/test_exit.txt)

  # Check if all passed
  if [ $ESLINT_EXIT -eq 0 ] && [ $TSC_EXIT -eq 0 ] && [ $PRETTIER_EXIT -eq 0 ] && [ $TEST_EXIT -eq 0 ]; then
    echo "🎉 SUCCESS! All QA checks passed!"
    echo ""
    echo "Final status:"
    echo "  ✅ ESLint: Clean"
    echo "  ✅ TypeScript: No errors"
    echo "  ✅ Prettier: Properly formatted"
    echo "  ✅ Tests: All passing"
    echo ""
    echo "=================================================================="
    exit 0
  fi

  # Apply fixes for failed checks
  echo "🔧 Applying fixes for failed checks..."
  echo ""

  if [ $ESLINT_EXIT -ne 0 ]; then
    echo "🔨 Running: /menon:fix-lint-parallel"
    /menon:fix-lint-parallel
    echo ""
  fi

  if [ $TSC_EXIT -ne 0 ]; then
    echo "🔨 Running: /menon:fix-ts-parallel"
    /menon:fix-ts-parallel
    echo ""
  fi

  if [ $PRETTIER_EXIT -ne 0 ]; then
    echo "🔨 Running: /menon:fix-format-parallel"
    /menon:fix-format-parallel
    echo ""
  fi

  if [ $TEST_EXIT -ne 0 ]; then
    echo "🔨 Running: /menon:fix-test-parallel"
    /menon:fix-test-parallel
    echo ""
  fi

  echo "✅ Fixes applied! Starting next iteration..."
  echo ""
  echo "=================================================================="
  echo ""

  ITERATION=$((ITERATION + 1))
done
```
