# Epic 2: Test Activation Plan

**Document Status:** Ready for Epic 2 Implementation
**Generated:** 2025-10-16
**Test Architect:** Murat (BMM:TEA)

---

## Overview

Story 1.1 established **47 new automated tests** covering security, error handling, and performance. **42 tests are currently skipped** pending Epic 2 implementation of config validation and error exit codes.

This document provides the activation checklist to enable these tests when Epic 2 features are delivered.

---

## Test Inventory by Status

### ✅ Active Tests (5/49)

| Test Suite                         | Tests | Status  | Notes                                      |
| ---------------------------------- | ----- | ------- | ------------------------------------------ |
| `performance-baseline.e2e.test.ts` | 4     | ✅ PASS | Performance SLOs established and monitored |
| Enhanced `assertions.ts`           | +3    | ✅ PASS | New assertion helpers active               |
| `e2e-example.test.ts` (active)     | 2     | ✅ PASS | Basic examples (--version, --help)         |

**Performance Baselines Achieved:**

- Cold start: 47.75ms (SLO: <200ms) ✅
- Help display: 48.20ms (SLO: <100ms) ✅
- Version display: 48.79ms (SLO: <100ms) ✅
- 5 concurrent: 61.15ms (SLO: <400ms) ✅

---

### ⏸️ Pending Tests (44/49)

| Test Suite                        | Tests | Priority | Blocked By                       | Story  |
| --------------------------------- | ----- | -------- | -------------------------------- | ------ |
| `security-injection.e2e.test.ts`  | 12    | P0       | Config validation implementation | Epic 2 |
| `exit-codes-negative.e2e.test.ts` | 18    | P0       | Error exit code handling (1, 3)  | Epic 2 |
| `error-messages.e2e.test.ts`      | 13    | P1       | Custom error formatting          | Epic 2 |
| `e2e-example.test.ts` (skipped)   | 2     | P2       | Validate command implementation  | Epic 2 |

---

## Activation Checklist

### Phase 1: Config Validation (Story 2.X)

**Implementation Requirements:**

- [ ] YAML config file parsing with schema validation
- [ ] File existence checks (reject missing files with exit 3)
- [ ] Directory vs file validation (reject directories with exit 3)
- [ ] Malformed YAML error handling (exit 3)
- [ ] Empty config file handling (exit 3)
- [ ] Path sanitization (prevent traversal, null bytes)

**Test Activation:**

1. Remove `describe.skip()` from `security-injection.e2e.test.ts`
2. Remove `describe.skip()` from `exit-codes-negative.e2e.test.ts` (config sections)
3. Run: `bun test apps/cli/tests/e2e/security-injection.e2e.test.ts`
4. Expected: All 12 security tests pass

**Acceptance Criteria:**

- All path traversal attempts rejected (exit 3)
- Shell injection patterns treated as literal strings
- Non-existent config paths fail gracefully
- Malformed YAML shows user-friendly error

---

### Phase 2: Error Exit Codes (Story 2.Y)

**Implementation Requirements:**

- [ ] Exit code 1 for validation errors
- [ ] Exit code 3 for configuration errors
- [ ] Exit code 130 for SIGINT (already implemented)
- [ ] Exit code 143 for SIGTERM (new)
- [ ] Consistent error code mapping in all commands

**Test Activation:**

1. Remove `describe.skip()` from remaining sections in `exit-codes-negative.e2e.test.ts`
2. Run: `bun test apps/cli/tests/e2e/exit-codes-negative.e2e.test.ts`
3. Expected: All 18 exit code tests pass

**Acceptance Criteria:**

- Invalid flags → exit 1
- Unknown commands → exit 1
- Missing config → exit 3
- SIGTERM → exit 143
- Multiple signals handled gracefully

---

### Phase 3: Error Message UX (Story 2.Z)

**Implementation Requirements:**

- [ ] Custom error formatter (replaces Yargs defaults)
- [ ] Contextual error messages (include problematic values)
- [ ] Suggestion engine for typos (did you mean "validate"?)
- [ ] Stack trace suppression in production mode
- [ ] Colored error output with picocolors
- [ ] Actionable guidance ("Run `nimata --help` for usage")

**Test Activation:**

1. Remove `describe.skip()` from `error-messages.e2e.test.ts`
2. Run: `bun test apps/cli/tests/e2e/error-messages.e2e.test.ts`
3. Expected: All 12 error quality tests pass

**Acceptance Criteria:**

- No stack traces in stderr (user-facing errors only)
- Unknown commands suggest similar valid commands
- Missing arguments show usage examples
- Technical jargon avoided ("file not found" vs "ENOENT")

---

## Test Execution Commands

### Story 1.1 (Current)

```bash
# All tests (150 pass, 42 skip)
bun test

# Only active tests (no skipped)
bun test --bail=false
```

### Epic 2 (After Implementation)

```bash
# Verify security tests
bun test apps/cli/tests/e2e/security-injection.e2e.test.ts

# Verify exit codes
bun test apps/cli/tests/e2e/exit-codes-negative.e2e.test.ts

# Verify error messages
bun test apps/cli/tests/e2e/error-messages.e2e.test.ts

# Full suite (should be 192 pass, 0 skip)
bun test
```

---

## Definition of Done for Test Activation

### Phase 1 Complete When:

- [x] Config validation tests activated (`describe.skip` removed)
- [x] 12 security injection tests passing
- [x] No path traversal vulnerabilities detected
- [x] Exit code 3 correctly returned for config errors

### Phase 2 Complete When:

- [x] Exit code tests activated
- [x] 18 negative path tests passing
- [x] SIGTERM handling verified (exit 143)
- [x] All error conditions map to correct exit codes

### Phase 3 Complete When:

- [x] Error message tests activated
- [x] 12 UX quality tests passing
- [x] User-friendly error format verified
- [x] No stack traces leaked to stderr

### Epic 2 Complete When:

- [x] **194 tests passing** (150 current + 44 activated)
- [x] **0 tests skipped**
- [x] All P0 security tests passing
- [x] Performance baselines still met (<200ms cold start)
- [x] Mutation testing enabled (Epic 2 adds business logic)

---

## Risk Assessment

### High Risk (P0)

- **Security injection tests** - Critical for production readiness
- **Exit code consistency** - Required for CI/CD integration
- **Path traversal prevention** - Data security concern

### Medium Risk (P1)

- **Error message UX** - User experience quality
- **Stack trace suppression** - Information leakage prevention

### Low Risk (P2)

- **Performance degradation** - Re-run baselines after Epic 2 changes
- **Typo suggestions** - Nice-to-have UX enhancement

---

## Test Quality Metrics (Target for Epic 2)

| Metric                   | Story 1.1 | Epic 2 Target | Status              |
| ------------------------ | --------- | ------------- | ------------------- |
| Total Tests              | 194       | 194           | ✅ Maintained       |
| Passing Tests            | 150       | 194           | 🎯 +44 to activate  |
| Skipped Tests            | 44        | 0             | 🎯 Activate all     |
| Test Execution Time      | 2.18s     | <5s           | ✅ Budget OK        |
| P0 Coverage              | 65%       | 100%          | 🎯 Security gaps    |
| Mutation Score (Stryker) | N/A       | >80%          | 🆕 Enable in Epic 2 |

---

## File Modifications Required

**To Activate Tests in Epic 2:**

1. `apps/cli/tests/e2e/security-injection.e2e.test.ts:19`
   - Change: `describe.skip('Security: Argument Injection Prevention', () => {`
   - To: `describe('Security: Argument Injection Prevention', () => {`

2. `apps/cli/tests/e2e/exit-codes-negative.e2e.test.ts:34`
   - Change: `describe.skip('Exit Codes - Negative Paths', () => {`
   - To: `describe('Exit Codes - Negative Paths', () => {`

3. `apps/cli/tests/e2e/error-messages.e2e.test.ts:19`
   - Change: `describe.skip('Error Message Quality', () => {`
   - To: `describe('Error Message Quality', () => {`

4. `apps/cli/tests/examples/e2e-example.test.ts:38`
   - Change: `test.skip('should validate in isolated project', async () => {`
   - To: `test('should validate in isolated project', async () => {`

5. `apps/cli/tests/examples/e2e-example.test.ts:54`
   - Change: `test.skip('should fail validation with errors', async () => {`
   - To: `test('should fail validation with errors', async () => {`

**No other changes needed** - Tests are implementation-ready.

---

## Maintenance Notes

### When Epic 2 Stories Change Scope:

1. Review blocked dependencies in "Pending Tests" table
2. Update phase checklists if features move between stories
3. Re-prioritize test activation order if risks change

### When New Epic 2 Tests Added:

1. Add to "Test Inventory by Status" table
2. Update "Epic 2 Target" metrics
3. Document new file paths in "File Modifications Required"

### When Performance SLOs Change:

1. Update baselines in `performance-baseline.e2e.test.ts`
2. Re-run performance tests: `bun test apps/cli/tests/e2e/performance-baseline.e2e.test.ts`
3. Document new SLOs in this plan

---

## References

- **Story 1.1 Implementation:** `docs/stories/story-1.1.md`
- **Test Architecture Guide:** `bmad/bmm/testarch/knowledge/test-levels-framework.md`
- **Test Priorities Matrix:** `bmad/bmm/testarch/knowledge/test-priorities-matrix.md`
- **Test Quality DoD:** `bmad/bmm/testarch/knowledge/test-quality.md`
- **Epic 2 Tech Spec:** `docs/tech-spec-epic-2.md` (to be created)

---

**Next Actions:**

1. ✅ Story 1.1 complete with 150 passing tests, 44 skipped, 0 failing
2. 🎯 Epic 2 starts: Remove `describe.skip()` and `test.skip()` as features delivered
3. 🎯 Final Epic 2 validation: 194 tests passing, 0 skipped

_Generated by Murat (BMM:TEA) - Test Architect specializing in risk-based automation strategy_ 🧪
