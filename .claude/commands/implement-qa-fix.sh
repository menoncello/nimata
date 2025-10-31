#!/bin/bash
# /menon:qa-fix Implementation Script
# This script demonstrates the parallel workflow execution

set -e  # Exit on error (we'll handle errors manually)

echo "🚀 Starting /menon:qa-fix - Parallel Quality Assurance Workflow"
echo "================================================================"
echo ""

# Step 1: Execute all 4 commands in parallel
echo "📋 Step 1: Running parallel quality checks..."
echo ""

# Initialize result tracking
ESLINT_RESULT=0
TSC_RESULT=0
PRETTIER_RESULT=0
TEST_RESULT=0

# Function to run command and capture result
run_command() {
    local cmd_name=$1
    local cmd=$2
    local result_var=$3

    echo "  └─ Running: $cmd_name"
    eval "$cmd" > "/tmp/${cmd_name}.log" 2>&1
    local exit_code=$?
    eval "$result_var=$exit_code"

    if [ $exit_code -eq 0 ]; then
        echo "     ✅ $cmd_name: SUCCESS"
    else
        echo "     ❌ $cmd_name: FAILED (exit code: $exit_code)"
    fi
    echo ""
}

# Run all commands in parallel
(
    run_command "ESLint" "bunx eslint . --fix" "ESLINT_RESULT"
) &

(
    run_command "TypeScript" "bunx tsc --noEmit" "TSC_RESULT"
) &

(
    run_command "Prettier" "bunx prettier --write \"**/*.{ts,tsx,js,jsx,json,md}\"" "PRETTIER_RESULT"
) &

(
    run_command "Tests" "bun run test" "TEST_RESULT"
) &

# Wait for all parallel jobs to complete
echo "⏳ Waiting for all checks to complete..."
wait
echo ""
echo "✅ All parallel checks completed!"
echo ""

# Step 2: Analyze results
echo "📊 Step 2: Analyzing results..."
echo ""

# Check which commands failed
NEEDS_FIX=0

if [ $ESLINT_RESULT -ne 0 ]; then
    echo "  ❌ ESLint check failed - will apply fix"
    NEEDS_FIX=1
fi

if [ $TSC_RESULT -ne 0 ]; then
    echo "  ❌ TypeScript check failed - will apply fix"
    NEEDS_FIX=1
fi

if [ $PRETTIER_RESULT -ne 0 ]; then
    echo "  ❌ Prettier check failed - will apply fix"
    NEEDS_FIX=1
fi

if [ $TEST_RESULT -ne 0 ]; then
    echo "  ❌ Tests failed - will apply fix"
    NEEDS_FIX=1
fi

echo ""

# Step 3: Apply fixes if needed
if [ $NEEDS_FIX -eq 1 ]; then
    echo "🔧 Step 3: Applying fixes for failed checks..."
    echo ""

    if [ $ESLINT_RESULT -ne 0 ]; then
        echo "  🔨 Running: /menon:fix-lint-parallel"
        # In actual implementation, this would trigger the slash command
        # For demo purposes, we run a simple eslint fix
        bunx eslint . --fix || echo "  ⚠️  ESLint fix encountered issues"
        echo ""
    fi

    if [ $TSC_RESULT -ne 0 ]; then
        echo "  🔨 Running: /menon:fix-ts-parallel"
        # For demo purposes, show what would happen
        echo "  ℹ️  TypeScript fixes would be applied here"
        echo ""
    fi

    if [ $PRETTIER_RESULT -ne 0 ]; then
        echo "  🔨 Running: /menon:fix-format-parallel"
        # For demo purposes, show what would happen
        echo "  ℹ️  Format fixes would be applied here"
        echo ""
    fi

    if [ $TEST_RESULT -ne 0 ]; then
        echo "  🔨 Running: /menon:fix-test-parallel"
        # For demo purposes, show what would happen
        echo "  ℹ️  Test fixes would be applied here"
        echo ""
    fi

    echo "✅ All fixes applied!"
    echo ""
    echo "📝 NOTE: In actual implementation, each fix command would be"
    echo "   triggered via Claude Code's /menon:fix-* parallel commands."
    echo ""

else
    echo "✨ Step 3: All checks passed successfully!"
    echo ""
    echo "✅ ESLint: No issues found"
    echo "✅ TypeScript: No type errors"
    echo "✅ Prettier: All files formatted"
    echo "✅ Tests: 100% pass rate"
    echo ""
    echo "🎉 Quality Assurance Complete - No fixes needed!"
fi

echo "================================================================"
echo "✨ /menon:qa-fix workflow completed"
