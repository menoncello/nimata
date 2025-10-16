# Story 1.1: Exit Code Validation Strategy

**Risk Mitigation:** Risk #3 - Exit Code Inconsistency (Score: 6)
**Owner:** CI/CD Pipeline + Developer implementing Story 1.1
**Status:** 🔴 Not Started

---

## Purpose

This document explains the exit code validation strategy for Story 1.1 (CLI Framework Setup) to mitigate **Risk #3: Exit Code Inconsistency** (Score: 6 - CONCERNS).

**Problem:** Inconsistent exit codes break CI/CD pipeline integrations that rely on exit codes for gating decisions. If `nimata validate` returns exit code 0 when it should return 1 (errors found), the CI pipeline will incorrectly pass builds with quality issues.

**Solution:** Comprehensive exit code testing at unit, integration, and E2E levels, plus automated CI validation.

---

## Exit Code Specification

Per Story 1.1 AC #6 and Solution Architecture (Section 6.3), Nìmata follows Unix exit code conventions:

| Exit Code | Meaning                  | When Used                                         | Examples                                                  |
| --------- | ------------------------ | ------------------------------------------------- | --------------------------------------------------------- |
| **0**     | Success                  | Command completed successfully, no errors found   | `nimata --help`, `nimata --version`, `nimata init` (stub) |
| **1**     | Validation errors found  | `validate` command found errors                   | `nimata validate` (errors present), invalid command       |
| **2**     | Validation warnings only | `validate` command found warnings but no errors   | `nimata validate` (warnings only)                         |
| **3**     | Configuration error      | Invalid config file or missing required config    | `nimata validate --config /nonexistent.yaml`              |
| **4**     | Plugin error             | Plugin failed to load or execute                  | Plugin initialization failure                             |
| **5**     | File system error        | Cannot read/write files                           | Permission denied, disk full                              |
| **6**     | Transformation error     | Refactoring failed (syntax error after transform) | `nimata fix` introduces syntax errors                     |
| **130**   | Interrupted (SIGINT)     | User pressed Ctrl+C                               | `nimata validate` (Ctrl+C during execution)               |

---

## Risk Analysis

### Risk #3: Exit Code Inconsistency

**Category:** BUS (Business)
**Description:** Exit codes may not follow Unix conventions (AC #6), breaking CI/CD pipeline integrations that depend on exit codes.

**Evidence:**

- Story requires exit code conventions: 0=success, 1=error, 3=config error, 130=interrupt
- Easy to forget exit codes in error paths (e.g., catching errors but not setting exit code)
- CI/CD pipelines (GitHub Actions, GitLab CI, Jenkins) rely on exit codes for pass/fail gating

**Probability:** 2 (Possible - manual implementation prone to human error)
**Impact:** 3 (Critical - breaks CI/CD automation, prevents pipeline gating)
**Score:** 6 ⚠️ (CONCERNS - requires mitigation before approval)

**Consequences if not mitigated:**

- ❌ CI/CD builds pass incorrectly when validation finds errors
- ❌ Quality gates don't prevent merging bad code
- ❌ Production deployments with unvalidated code
- ❌ Loss of trust in automated quality checks

---

## Mitigation Strategy

### Multi-Layer Testing Approach

The mitigation uses defense-in-depth with three test layers:

```
┌────────────────────────────────────────────────┐
│         E2E Tests (CI Validation)              │
│  Real CLI execution, verify actual exit codes  │
│  ✅ Catches integration issues                 │
└────────────────────────────────────────────────┘
                    ↑
┌────────────────────────────────────────────────┐
│         Integration Tests                      │
│  CLI + DI + Yargs, mock dependencies           │
│  ✅ Catches wiring issues                      │
└────────────────────────────────────────────────┘
                    ↑
┌────────────────────────────────────────────────┐
│         Unit Tests                             │
│  Isolated exit code logic, mocked everything   │
│  ✅ Catches logic errors                       │
└────────────────────────────────────────────────┘
```

### Layer 1: Unit Tests (12 tests)

**Location:** `apps/cli/tests/unit/`

**Test Coverage:**

- 1.1-UNIT-009: Exit code 0 for success
- 1.1-UNIT-010: Exit code 1 for validation error
- 1.1-UNIT-011: Exit code 3 for config error
- 1.1-UNIT-012: Exit code 130 for interrupt (SIGINT)

**Purpose:** Verify exit code logic in isolation (fast feedback).

**Example Test:**

```typescript
describe('Exit Codes', () => {
  it('should exit with code 0 on success', async () => {
    const mockExit = jest.spyOn(process, 'exit').mockImplementation();

    await executeCommand(['--help']);

    expect(mockExit).toHaveBeenCalledWith(0);
  });

  it('should exit with code 1 on validation error', async () => {
    const mockExit = jest.spyOn(process, 'exit').mockImplementation();
    mockValidationService.validate.mockResolvedValue({
      errors: [{ message: 'Error' }],
      warnings: [],
    });

    await executeCommand(['validate']);

    expect(mockExit).toHaveBeenCalledWith(1);
  });
});
```

### Layer 2: Integration Tests (1 test)

**Location:** `apps/cli/tests/integration/`

**Test Coverage:**

- 1.1-INT-001: CLI entry point execution with real DI container

**Purpose:** Verify exit codes work with real Yargs + TSyringe integration.

**Example Test:**

```typescript
describe('CLI Entry Point Integration', () => {
  it('should exit with correct code for invalid command', async () => {
    const mockExit = jest.spyOn(process, 'exit').mockImplementation();

    // Use real container and Yargs setup
    const { executeCliCommand } = await import('../src/index');
    await executeCliCommand(['invalid-command']);

    expect(mockExit).toHaveBeenCalledWith(1);
  });
});
```

### Layer 3: E2E Tests + CI Validation (5 tests)

**Location:** `apps/cli/tests/e2e/` + `.github/workflows/ci.yml`

**Test Coverage:**

- 1.1-E2E-007: Invalid command returns exit code 1
- CI: `nimata --help` returns exit code 0
- CI: `nimata --version` returns exit code 0
- CI: `nimata invalid-command` returns exit code 1
- CI: `nimata` (no args) returns exit code 1

**Purpose:** Verify exit codes in real CLI execution (highest confidence).

**CI Validation Example:**

```bash
# In .github/workflows/ci.yml
- name: 🔍 Exit Code Validation - Success (Exit 0)
  run: |
    ./apps/cli/bin/nimata --help
    EXIT_CODE=$?

    if [ $EXIT_CODE -eq 0 ]; then
      echo "✅ PASS: Exit code 0 for successful command"
    else
      echo "❌ FAIL: Expected exit code 0, got $EXIT_CODE"
      exit 1
    fi
```

---

## CI Pipeline Integration

### GitHub Actions Workflow

**File:** `.github/workflows/ci.yml`

**Job:** `e2e-tests` (Job 6)

**Exit Code Validation Steps:**

1. **Setup:** Build CLI and prepare for execution
2. **Test 1:** `nimata --help` → expect exit 0
3. **Test 2:** `nimata --version` → expect exit 0
4. **Test 3:** `nimata invalid-command` → expect exit 1
5. **Test 4:** `nimata` (no args) → expect exit 1
6. **Test 5:** `nimata validate --config /nonexistent.yaml` → expect exit 3 (Story 1.2+)
7. **Summary:** Generate GitHub Actions summary with pass/fail matrix

**Key Features:**

✅ **Runs on every PR and push to main/develop**
✅ **Fails PR if any exit code test fails**
✅ **Generates visual summary in GitHub Actions UI**
✅ **Blocks merge if exit code validation fails**

### CI Summary Output

Example GitHub Actions summary:

```markdown
## Exit Code Validation Results (Risk #3 Mitigation)

| Test Case                | Expected Exit Code | Result  |
| ------------------------ | ------------------ | ------- |
| `nimata --help`          | 0                  | ✅ PASS |
| `nimata --version`       | 0                  | ✅ PASS |
| `nimata invalid-command` | 1                  | ✅ PASS |
| `nimata` (no args)       | 1                  | ✅ PASS |

**Risk Mitigation Status:** Story 1.1 Risk #3 (Exit Code Inconsistency)
```

---

## Implementation Checklist

### Developer Checklist (Story 1.1 Implementation)

- [ ] **Document exit codes in source code**
  - Add comments in `apps/cli/src/index.ts` documenting all exit codes
  - Reference Solution Architecture Section 6.3

- [ ] **Implement exit code logic**
  - Yargs error handlers set correct exit codes
  - Success paths exit with 0
  - Error paths exit with appropriate non-zero codes

- [ ] **Write unit tests** (1.1-UNIT-009 through 1.1-UNIT-012)
  - Test success exit code (0)
  - Test validation error exit code (1)
  - Test config error exit code (3)
  - Test interrupt exit code (130)

- [ ] **Write integration test** (1.1-INT-001)
  - Test CLI entry point with real DI container

- [ ] **Write E2E test** (1.1-E2E-007)
  - Test invalid command returns exit code 1

- [ ] **Verify CI validation passes**
  - Push to PR branch
  - Check GitHub Actions "E2E Tests + Exit Code Validation" job passes
  - Verify exit code summary in Actions UI

### CI/CD Team Checklist

- [ ] **CI workflow created**
  - File: `.github/workflows/ci.yml`
  - Job: `e2e-tests` includes exit code validation steps

- [ ] **Branch protection rules updated**
  - Require "E2E Tests + Exit Code Validation" job to pass before merge
  - Require status check to pass on `main` and `develop` branches

- [ ] **GitHub Actions secrets configured** (if using Turborepo remote cache)
  - `TURBO_TOKEN` secret added
  - `TURBO_TEAM` secret added

---

## Exit Code Implementation Pattern

### Recommended Pattern (Yargs + Process Exit)

```typescript
// apps/cli/src/index.ts

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

// Exit code constants (documented)
export const EXIT_CODES = {
  SUCCESS: 0, // Command completed successfully
  VALIDATION_ERROR: 1, // Validation errors found
  VALIDATION_WARNING: 2, // Warnings only (no errors)
  CONFIG_ERROR: 3, // Invalid config file
  PLUGIN_ERROR: 4, // Plugin failure
  FILE_SYSTEM_ERROR: 5, // Cannot read/write files
  TRANSFORMATION_ERROR: 6, // Refactoring failed
  INTERRUPTED: 130, // User pressed Ctrl+C (SIGINT)
} as const;

// Global error handler
const handleError = (error: Error): never => {
  if (error.message.includes('config')) {
    console.error(`Config error: ${error.message}`);
    process.exit(EXIT_CODES.CONFIG_ERROR);
  } else if (error.message.includes('validation')) {
    console.error(`Validation error: ${error.message}`);
    process.exit(EXIT_CODES.VALIDATION_ERROR);
  } else {
    console.error(`Unexpected error: ${error.message}`);
    process.exit(EXIT_CODES.VALIDATION_ERROR);
  }
};

// SIGINT handler
process.on('SIGINT', () => {
  console.log('\nInterrupted by user');
  process.exit(EXIT_CODES.INTERRUPTED);
});

// Yargs setup
yargs(hideBin(process.argv))
  .command(/* commands */)
  .demandCommand(1, 'You must provide a command')
  .fail((msg, err, yargs) => {
    if (err) {
      handleError(err);
    } else {
      console.error(msg);
      console.error('\nRun --help for usage information');
      process.exit(EXIT_CODES.VALIDATION_ERROR);
    }
  })
  .help()
  .version()
  .parse();
```

### Command Handler Pattern

```typescript
// apps/cli/src/commands/validate.ts

export const validateCommand: CommandModule = {
  command: 'validate',
  describe: 'Validate project quality',
  handler: async (argv) => {
    try {
      const result = await validateUseCase.execute(argv);

      if (result.errors.length > 0) {
        console.error(`Found ${result.errors.length} errors`);
        process.exit(EXIT_CODES.VALIDATION_ERROR);
      } else if (result.warnings.length > 0) {
        console.warn(`Found ${result.warnings.length} warnings`);
        process.exit(EXIT_CODES.VALIDATION_WARNING);
      } else {
        console.log('✅ Validation passed');
        process.exit(EXIT_CODES.SUCCESS);
      }
    } catch (error) {
      handleError(error);
    }
  },
};
```

---

## Testing Exit Codes in Development

### Manual Testing

```bash
# Test success exit code
./apps/cli/bin/nimata --help
echo "Exit code: $?"
# Expected: 0

# Test invalid command exit code
./apps/cli/bin/nimata invalid-command
echo "Exit code: $?"
# Expected: 1

# Test no command exit code
./apps/cli/bin/nimata
echo "Exit code: $?"
# Expected: 1

# Test interrupt (Ctrl+C)
./apps/cli/bin/nimata validate --watch
# Press Ctrl+C
echo "Exit code: $?"
# Expected: 130
```

### Automated Testing Script

Create `scripts/test-exit-codes.sh`:

```bash
#!/usr/bin/env bash
set +e  # Don't exit on error

CLI_PATH="./apps/cli/bin/nimata"
FAILED=0

test_exit_code() {
  local description="$1"
  local expected_code=$2
  shift 2
  local command=("$@")

  echo "Testing: $description"
  "${command[@]}" >/dev/null 2>&1
  local actual_code=$?

  if [ $actual_code -eq $expected_code ]; then
    echo "  ✅ PASS (exit $actual_code)"
  else
    echo "  ❌ FAIL (expected $expected_code, got $actual_code)"
    FAILED=$((FAILED + 1))
  fi
}

echo "Exit Code Validation Tests"
echo "==========================="
echo ""

test_exit_code "nimata --help" 0 "$CLI_PATH" --help
test_exit_code "nimata --version" 0 "$CLI_PATH" --version
test_exit_code "nimata invalid-command" 1 "$CLI_PATH" invalid-command
test_exit_code "nimata (no args)" 1 "$CLI_PATH"

echo ""
echo "==========================="
if [ $FAILED -eq 0 ]; then
  echo "✅ All tests passed"
  exit 0
else
  echo "❌ $FAILED test(s) failed"
  exit 1
fi
```

Run with: `bun run scripts/test-exit-codes.sh`

---

## Risk Mitigation Outcome

**After implementing this strategy:**

| Metric         | Before                        | After                                         |
| -------------- | ----------------------------- | --------------------------------------------- |
| Risk #3 Score  | 6 (Probability: 2, Impact: 3) | 1 (Probability: 1, Impact: 1)                 |
| Gate Status    | CONCERNS                      | PASS (if all tests pass)                      |
| Test Coverage  | 0 tests                       | 18 tests (12 unit + 1 integration + 5 E2E/CI) |
| CI Validation  | ❌ None                       | ✅ Automated on every PR                      |
| Merge Blocking | ❌ None                       | ✅ PR blocked if exit codes fail              |

**Residual Risk:** Low (1) - Comprehensive testing + CI validation ensures exit codes are correct.

---

## Maintenance

### When to Update This Strategy

1. **New exit codes added** (future stories)
   - Update EXIT_CODES constant
   - Add unit tests for new exit codes
   - Add CI validation tests
   - Update this document

2. **New commands added** (future stories)
   - Verify command handlers use correct exit codes
   - Add E2E tests for new command exit codes

3. **CI platform change** (e.g., move from GitHub Actions to GitLab CI)
   - Port exit code validation steps to new platform
   - Verify visual summaries work

### Review Cadence

- **Every Sprint:** Review exit code test coverage in PRs
- **Every Epic:** Audit all exit code paths for completeness
- **Pre-Release:** Run manual exit code validation script

---

## References

- **Story 1.1:** CLI Framework Setup (AC #6: Exit codes follow Unix conventions)
- **Solution Architecture:** Section 6.3 (Error Handling Strategy, Exit Codes table)
- **Risk Assessment:** Story 1.1 Risk #3 (Exit Code Inconsistency, Score: 6)
- **CI Pipeline:** `.github/workflows/ci.yml` (Job 6: E2E Tests + Exit Code Validation)
- **Unix Exit Code Conventions:** https://tldp.org/LDP/abs/html/exitcodes.html

---

## Approval Sign-Off

**Developer:** **\*\*\*\***\_\_**\*\*\*\*** Date: \***\*\_\_\*\***

**Exit Code Tests Implemented:** ⬜ All 18 tests passing

**CI Validation Verified:** ⬜ GitHub Actions job passing

**Risk #3 Mitigation:** ⬜ Complete

**Ready for Story 1.1 PR:** ⬜ Yes

---

_This document is part of Story 1.1 Risk Mitigation Strategy._
_Generated by BMad Test Architect workflow._
