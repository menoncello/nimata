# Risk Assessment and Test Coverage: Story 1.1 - CLI Framework Setup

**Story:** 1.1 - CLI Framework Setup
**Epic:** Epic 1 - Start Right (Scaffolding)
**Date:** 2025-10-16
**Test Architect:** BMad Test Architect
**Status:** 🟡 CONCERNS (Mitigation Required)

---

## Executive Summary

Story 1.1 establishes the foundational CLI framework for Nìmata, including Turborepo monorepo setup, Yargs command routing, TSyringe dependency injection, and proper Unix exit code handling. This story is **critical** to all subsequent development - if the foundation is unstable, all 30 stories across 3 epics are at risk.

**Risk Profile:**

- **Total Risks Identified:** 5
- **Critical Risks (≥6):** 2 (Exit Code Inconsistency, Turborepo Configuration)
- **Total Risk Score:** 20
- **Current Gate Status:** 🟡 **CONCERNS** (clear mitigations required before PR approval)

**Test Coverage:**

- **Total Test Scenarios:** 23 (12 Unit + 2 Integration + 9 E2E)
- **All Priority P0:** Yes (foundational story, all tests critical)
- **Mutation Testing:** Applied to unit tests (80%+ score target)

**Mitigation Status:**

- ✅ Risk #1, #2, #5: Mitigated with comprehensive test coverage
- ⚠️ Risk #3: **CI validation required** (exit code validation in GitHub Actions)
- ⚠️ Risk #4: **Manual verification required** (Turborepo setup checklist)

**Gate Approval Criteria:**

- All 23 test scenarios implemented and passing
- Risk #3 mitigation: CI exit code validation configured and passing
- Risk #4 mitigation: Turborepo verification checklist completed
- No critical issues unresolved

---

## Story Context

### Story Summary

**As a** developer using Nìmata,
**I want** a functional CLI application with command routing and argument parsing,
**so that** I can execute Nìmata commands (init, validate, fix, prompt) from the terminal with proper help and error handling.

### Acceptance Criteria

| ID    | Acceptance Criterion                                                     | Priority | Test Coverage                                  |
| ----- | ------------------------------------------------------------------------ | -------- | ---------------------------------------------- |
| AC #1 | CLI entry point (`bin/nimata`) executes successfully                     | P0       | 1.1-UNIT-001, 1.1-INT-001, 1.1-E2E-003-006     |
| AC #2 | Command routing supports subcommands (init, validate, fix, prompt)       | P0       | 1.1-UNIT-002-005, 1.1-INT-002, 1.1-E2E-003-007 |
| AC #3 | Argument parsing handles flags and options (--help, --version, --config) | P0       | 1.1-UNIT-006-008, 1.1-E2E-001-002              |
| AC #4 | Help text displays for each command                                      | P0       | 1.1-UNIT-006, 1.1-E2E-001, 1.1-E2E-008         |
| AC #5 | Version number displays correctly                                        | P0       | 1.1-UNIT-007, 1.1-E2E-002                      |
| AC #6 | Exit codes follow Unix conventions (0=success, non-zero=error)           | P0       | 1.1-UNIT-009-012, 1.1-E2E-007, CI validation   |

### Architecture Context

**Technology Stack:**

- **Turborepo** - Monorepo build orchestration (80% CI time savings)
- **Yargs** - CLI command routing (best TypeScript support)
- **TSyringe** - Dependency injection with manual registration
- **Bun 1.3+** - Runtime with native features
- **TypeScript 5.x** - Strict mode, project references

**Architecture Pattern:**

- Clean Architecture Lite (3 layers: CLI → Use Cases → Adapters)
- Modular monolith with static plugin registration
- No decorators, explicit dependency injection

**Source Tree (Story 1.1 Scope):**

```
nimata/
├── turbo.json                      # Turborepo configuration
├── package.json                    # Root workspaces
├── tsconfig.json                   # Root TS config with references
├── apps/
│   └── cli/
│       ├── src/
│       │   ├── index.ts            # Yargs entry point
│       │   ├── container.ts        # TSyringe DI setup
│       │   └── commands/           # Command stubs (init, validate, fix, prompt)
│       ├── bin/nimata              # CLI launcher
│       ├── tests/unit/             # Unit tests
│       ├── tests/integration/      # Integration tests
│       └── tests/e2e/              # E2E tests
├── packages/
│   ├── core/                       # Stub package (use cases)
│   └── adapters/                   # Stub package (implementations)
├── plugins/                        # Empty (future stories)
└── infrastructure/                 # Empty (future stories)
```

---

## Risk Assessment

### Risk Scoring Framework

Per **Risk Governance** and **Probability-Impact Scale** knowledge fragments:

**Probability:**

- 1 = Unlikely (standard implementation, low uncertainty)
- 2 = Possible (edge cases or partial unknowns)
- 3 = Likely (known issues, new integrations, high ambiguity)

**Impact:**

- 1 = Minor (cosmetic issues, easy workarounds)
- 2 = Degraded (partial feature loss, manual workaround required)
- 3 = Critical (blockers, data/security/regulatory exposure)

**Risk Score = Probability × Impact**

**Risk Thresholds:**

- 1-3: Document for awareness
- 4-5: Monitor closely, plan mitigations
- 6-8: **CONCERNS** at the gate until mitigations implemented
- 9: Automatic gate **FAIL** until resolved or formally waived

### Risk Category Definitions

- **TECH** - Architecture flaws, technical debt, integration issues
- **SEC** - Missing security controls, vulnerabilities
- **PERF** - SLA risk, performance degradation
- **DATA** - Data loss, corruption, integrity issues
- **BUS** - User/business harm, UX degradation
- **OPS** - Deployment/runtime failures, operational issues

---

## Identified Risks

### Risk #1: DI Container Misconfiguration

**Category:** TECH
**Owner:** Developer implementing Story 1.1

**Description:**
Manual TSyringe registration may be incomplete or incorrect, causing runtime dependency injection failures when commands attempt to resolve dependencies from the container.

**Evidence:**

- Story requires manual DI registration pattern (ADR-003: no decorators)
- Container setup in `apps/cli/src/container.ts` must manually register all interfaces
- Human error: forgetting to register a dependency or mismatching interface/implementation
- Error manifests at runtime, not compile time

**Scoring:**

- **Probability:** 2 (Possible - manual registration prone to human error, but detectable in testing)
- **Impact:** 2 (Degraded - commands fail at runtime with clear error messages, but application doesn't crash silently)
- **Score:** **4** (Monitor closely, plan mitigations)

**Mitigation Plan:**

| Action                                                                            | Owner     | Timeline            | Status         |
| --------------------------------------------------------------------------------- | --------- | ------------------- | -------------- |
| Create comprehensive unit tests for container registration with mock verification | Developer | Sprint 1, Story 1.1 | 🔴 Not Started |
| Test resolution of each registered dependency in isolation                        | Developer | Sprint 1, Story 1.1 | 🔴 Not Started |
| Integration test: verify command execution with real container                    | Developer | Sprint 1, Story 1.1 | 🔴 Not Started |
| Document container registration pattern in code comments                          | Developer | Sprint 1, Story 1.1 | 🔴 Not Started |

**Test Coverage:**

- 1.1-UNIT-001: TSyringe Container Registration
- 1.1-INT-002: Command Routing with DI Resolution

**Residual Risk After Mitigation:**

- **Probability:** 1 (Unlikely - comprehensive tests catch registration errors)
- **Impact:** 1 (Minor - errors caught in testing, not production)
- **Residual Score:** **1** (Low)

---

### Risk #2: Command Routing Failures

**Category:** TECH
**Owner:** Developer implementing Story 1.1

**Description:**
Yargs command routing may fail for edge cases such as invalid commands, missing arguments, malformed flags, or unexpected input combinations. Users may receive unclear error messages or commands may route to wrong handlers.

**Evidence:**

- Story AC #2 requires subcommand routing for init, validate, fix, prompt
- No existing Yargs implementation in the codebase (greenfield)
- Yargs configuration must handle: invalid commands, missing commands, flag parsing errors, help display
- Integration with TSyringe container adds complexity (resolver failures)

**Scoring:**

- **Probability:** 2 (Possible - new Yargs integration, edge cases exist)
- **Impact:** 2 (Degraded - commands don't execute, but user gets error messages; not a silent failure)
- **Score:** **4** (Monitor closely, plan mitigations)

**Mitigation Plan:**

| Action                                                            | Owner     | Timeline            | Status         |
| ----------------------------------------------------------------- | --------- | ------------------- | -------------- |
| Unit test each command registration (init, validate, fix, prompt) | Developer | Sprint 1, Story 1.1 | 🔴 Not Started |
| E2E test for all command routing paths including error cases      | Developer | Sprint 1, Story 1.1 | 🔴 Not Started |
| Test invalid command handling with proper error messages          | Developer | Sprint 1, Story 1.1 | 🔴 Not Started |
| Test missing command (no args) with help text display             | Developer | Sprint 1, Story 1.1 | 🔴 Not Started |
| Test per-command help (e.g., `nimata init --help`)                | Developer | Sprint 1, Story 1.1 | 🔴 Not Started |

**Test Coverage:**

- 1.1-UNIT-002: Command Routing - Init Command
- 1.1-UNIT-003: Command Routing - Validate Command
- 1.1-UNIT-004: Command Routing - Fix Command
- 1.1-UNIT-005: Command Routing - Prompt Command
- 1.1-INT-002: Command Routing with DI Resolution
- 1.1-E2E-003 through 1.1-E2E-006: Command stub execution
- 1.1-E2E-007: Invalid command error handling

**Residual Risk After Mitigation:**

- **Probability:** 1 (Unlikely - comprehensive routing tests cover edge cases)
- **Impact:** 1 (Minor - errors caught in testing, clear error messages)
- **Residual Score:** **1** (Low)

---

### Risk #3: Exit Code Inconsistency ⚠️ CRITICAL

**Category:** BUS
**Owner:** Developer implementing Story 1.1 + CI/CD Pipeline

**Description:**
Exit codes may not follow Unix conventions (AC #6), breaking CI/CD pipeline integrations that depend on exit codes for gating decisions. If `nimata validate` returns exit code 0 when it should return 1 (errors found), the CI pipeline will incorrectly pass builds with quality issues, allowing bad code to be merged and deployed.

**Evidence:**

- Story AC #6 requires exit code conventions: 0=success, 1=error, 3=config error, 130=interrupt
- Solution Architecture Section 6.3 defines full exit code table (0, 1, 2, 3, 4, 5, 6, 130)
- Easy to forget exit codes in error handling paths (catch errors but don't set exit code)
- CI/CD pipelines (GitHub Actions, GitLab CI, Jenkins) rely on exit codes for pass/fail gating
- **Business Impact:** Quality gates don't prevent merging bad code → production deployments with unvalidated code → loss of trust in automated quality checks

**Scoring:**

- **Probability:** 2 (Possible - manual implementation, easy to forget in error paths)
- **Impact:** 3 (Critical - breaks CI/CD automation, prevents pipeline gating, business risk)
- **Score:** **6** ⚠️ (**CONCERNS** - requires mitigation before PR approval)

**Mitigation Plan:**

| Action                                                                | Owner      | Timeline            | Status          |
| --------------------------------------------------------------------- | ---------- | ------------------- | --------------- |
| Document all exit codes in source comments (apps/cli/src/index.ts)    | Developer  | Sprint 1, Story 1.1 | 🔴 Not Started  |
| Create unit tests verifying each exit code scenario (0, 1, 3, 130)    | Developer  | Sprint 1, Story 1.1 | 🔴 Not Started  |
| Create E2E tests that assert exit codes for all commands              | Developer  | Sprint 1, Story 1.1 | 🔴 Not Started  |
| **Add exit code validation to CI pipeline** (GitHub Actions)          | CI/CD Team | Sprint 1, Story 1.1 | 🔴 **REQUIRED** |
| Configure branch protection: require exit code validation job to pass | CI/CD Team | Sprint 1, Story 1.1 | 🔴 **REQUIRED** |
| Generate visual exit code summary in CI (GitHub Actions Summary)      | CI/CD Team | Sprint 1, Story 1.1 | 🔴 Not Started  |

**Test Coverage:**

- 1.1-UNIT-009: Exit Code - Success (0)
- 1.1-UNIT-010: Exit Code - Validation Error (1)
- 1.1-UNIT-011: Exit Code - Config Error (3)
- 1.1-UNIT-012: Exit Code - Interrupt (130)
- 1.1-E2E-007: Invalid Command Exit Code (1)
- **CI Validation:** 4 automated tests in `.github/workflows/ci.yml`

**CI Validation Tests:**

1. `nimata --help` → exit 0
2. `nimata --version` → exit 0
3. `nimata invalid-command` → exit 1
4. `nimata` (no args) → exit 1

**Supporting Documents:**

- `docs/story-1.1-exit-code-validation-strategy.md` (detailed implementation guide)
- `.github/workflows/ci.yml` (Job 6: E2E Tests + Exit Code Validation)

**Residual Risk After Mitigation:**

- **Probability:** 1 (Unlikely - comprehensive tests + CI validation ensures correctness)
- **Impact:** 1 (Minor - errors caught in CI before merge, never reach production)
- **Residual Score:** **1** (Low)

**Gate Blocker:** ⚠️ **YES** - PR cannot be approved until:

1. All exit code unit tests pass (1.1-UNIT-009 through 1.1-UNIT-012)
2. E2E exit code test passes (1.1-E2E-007)
3. CI exit code validation job passes in GitHub Actions
4. Branch protection rule enforces exit code validation job

---

### Risk #4: Turborepo Configuration Errors ⚠️ CRITICAL

**Category:** OPS
**Owner:** Developer implementing Story 1.1

**Description:**
Incorrect Turborepo setup may break the build pipeline, TypeScript project references, or caching mechanisms. This is a **foundational risk** - if Turborepo is misconfigured, it blocks all 30 stories across 3 epics. Developers won't be able to build packages, run tests, or leverage caching for fast CI times.

**Evidence:**

- Story requires Turborepo monorepo setup with apps/, packages/, plugins/, infrastructure/ structure
- No existing Turborepo configuration in the codebase (greenfield)
- TypeScript project references must be correctly configured for incremental builds
- Turborepo pipeline tasks must have correct dependencies (`build` depends on `^build`, `test` depends on `build`)
- Local caching must work (second `turbo build` should be near-instant)
- **Operational Impact:** Broken build pipeline blocks all development, incorrect caching causes slow CI (defeats purpose of Turborepo)

**Scoring:**

- **Probability:** 2 (Possible - first Turborepo setup, learning curve, complex configuration)
- **Impact:** 3 (Critical - blocks all subsequent development if build fails, defeats NFR-003 performance goals)
- **Score:** **6** ⚠️ (**CONCERNS** - requires mitigation before PR approval)

**Mitigation Plan:**

| Action                                                                | Owner     | Timeline            | Status          |
| --------------------------------------------------------------------- | --------- | ------------------- | --------------- |
| Follow Turborepo official docs for TypeScript monorepo setup          | Developer | Sprint 1, Story 1.1 | 🔴 Not Started  |
| **Complete Turborepo verification checklist (75+ items)**             | Developer | Sprint 1, Story 1.1 | 🔴 **REQUIRED** |
| Verify turbo.json pipeline configuration with `turbo build --dry-run` | Developer | Sprint 1, Story 1.1 | 🔴 **REQUIRED** |
| Test TypeScript project references with `tsc --build`                 | Developer | Sprint 1, Story 1.1 | 🔴 **REQUIRED** |
| Validate local caching works (second build near-instant)              | Developer | Sprint 1, Story 1.1 | 🔴 **REQUIRED** |
| Test selective package builds (`turbo build --filter=@nimata/cli`)    | Developer | Sprint 1, Story 1.1 | 🔴 Not Started  |
| Document Turborepo setup in README.md                                 | Developer | Sprint 1, Story 1.1 | 🔴 Not Started  |
| Provide evidence: screenshots/logs of successful builds               | Developer | Sprint 1, Story 1.1 | 🔴 **REQUIRED** |

**Verification Checklist:**

- `docs/story-1.1-turborepo-verification-checklist.md` (8 phases, 75+ validation points)

**Checklist Phases:**

1. Initial Setup Verification (9 items)
2. TypeScript Project References (13 items)
3. Turborepo Build Pipeline (11 items)
4. Package Linking and Dependencies (9 items)
5. CLI Binary Execution (5 items)
6. Development Workflow (6 items)
7. CI/CD Preparation (7 items)
8. Documentation and Validation (7 items)

**Test Coverage:**

- This risk is mitigated through **manual verification** (not automated tests)
- Checklist must be completed and evidence provided before PR approval

**Residual Risk After Mitigation:**

- **Probability:** 1 (Unlikely - comprehensive checklist covers all failure modes)
- **Impact:** 2 (Degraded - if issues slip through, they're fixable in follow-up PRs)
- **Residual Score:** **2** (Low-Medium)

**Gate Blocker:** ⚠️ **YES** - PR cannot be approved until:

1. Turborepo verification checklist completed (all 75+ items ✅)
2. Evidence provided: `turbo build --dry-run` output screenshot
3. Evidence provided: `tsc --build` success screenshot
4. Evidence provided: Cache hit screenshot (second `turbo build`)

---

### Risk #5: Help Text Generation Incompleteness

**Category:** BUS
**Owner:** Developer implementing Story 1.1

**Description:**
Help text may be incomplete or unclear, harming developer experience (NFR-004: Maintainability). Users may not understand how to use commands, leading to frustration, support requests, and reduced adoption.

**Evidence:**

- Story AC #4 requires help text for each command
- Yargs auto-generates help from command definitions (description, options)
- Risk: forgetting to add descriptions to command definitions
- Risk: unclear or missing option descriptions
- **User Impact:** Poor DX, confusion about command usage, increased support burden

**Scoring:**

- **Probability:** 1 (Unlikely - Yargs handles help generation well, straightforward implementation)
- **Impact:** 2 (Degraded - poor UX, but functionality intact; workaround: read docs)
- **Score:** **2** (Document for awareness)

**Mitigation Plan:**

| Action                                                                   | Owner     | Timeline            | Status         |
| ------------------------------------------------------------------------ | --------- | ------------------- | -------------- |
| E2E tests verify help text includes descriptions for all commands        | Developer | Sprint 1, Story 1.1 | 🔴 Not Started |
| Test global help (`nimata --help`) shows all commands                    | Developer | Sprint 1, Story 1.1 | 🔴 Not Started |
| Test per-command help (`nimata init --help`) shows command-specific info | Developer | Sprint 1, Story 1.1 | 🔴 Not Started |
| Manual review of help text output for clarity                            | Developer | Sprint 1, Story 1.1 | 🔴 Not Started |

**Test Coverage:**

- 1.1-UNIT-006: Global Flag - Help
- 1.1-E2E-001: Execute CLI - Help Flag (verify all commands listed)
- 1.1-E2E-008: Execute CLI - Per-Command Help

**Residual Risk After Mitigation:**

- **Probability:** 1 (Unlikely - tests verify help text presence)
- **Impact:** 1 (Minor - clear help text improves UX)
- **Residual Score:** **1** (Low)

---

## Risk Summary Table

| Risk # | Category | Description                    | Prob | Impact | Score    | Status                            | Residual |
| ------ | -------- | ------------------------------ | ---- | ------ | -------- | --------------------------------- | -------- |
| **1**  | TECH     | DI Container Misconfiguration  | 2    | 2      | **4**    | Mitigated (tests)                 | 1        |
| **2**  | TECH     | Command Routing Failures       | 2    | 2      | **4**    | Mitigated (tests)                 | 1        |
| **3**  | BUS      | Exit Code Inconsistency        | 2    | 3      | **6** ⚠️ | **CONCERNS** (CI required)        | 1        |
| **4**  | OPS      | Turborepo Configuration Errors | 2    | 3      | **6** ⚠️ | **CONCERNS** (checklist required) | 2        |
| **5**  | BUS      | Help Text Generation           | 1    | 2      | **2**    | Low                               | 1        |

**Total Risk Score:** 20 (sum of all scores)
**Critical Risks (≥6):** 2 items (Exit Code Inconsistency, Turborepo Configuration)
**Average Risk Score:** 4.0 (total / 5 risks)

---

## Gate Decision

### Current Gate Status: 🟡 **CONCERNS**

**Rationale:**
Residual risks exist but have clear owners, actions, and timelines. All mitigations MUST be implemented before Story 1.1 PR approval.

**Gate Approval Criteria:**

✅ **PASS** requires:

- All 23 test scenarios implemented and passing
- Risk #1 mitigation: Unit tests 1.1-UNIT-001, integration test 1.1-INT-002 passing
- Risk #2 mitigation: Unit tests 1.1-UNIT-002-005, E2E tests 1.1-E2E-003-007 passing
- **Risk #3 mitigation: CI exit code validation configured and passing** ⚠️
- **Risk #4 mitigation: Turborepo verification checklist completed with evidence** ⚠️
- Risk #5 mitigation: E2E tests 1.1-E2E-001, 1.1-E2E-008 passing
- No critical issues unresolved
- All AC criteria traced to implemented tests

⚠️ **CONCERNS** if:

- Risk #3 mitigation incomplete (CI exit code validation not configured)
- Risk #4 mitigation incomplete (Turborepo setup not verified)

❌ **FAIL** if:

- Any P0 test fails
- Risk #3 or #4 unmitigated at PR submission time

### Gate History Log

| Date       | Status      | Approver            | Notes                                                                                                            |
| ---------- | ----------- | ------------------- | ---------------------------------------------------------------------------------------------------------------- |
| 2025-10-16 | 🟡 CONCERNS | BMad Test Architect | Initial risk assessment completed. Mitigations required: Risk #3 (CI validation), Risk #4 (Turborepo checklist). |

---

## Test Coverage Strategy

### Test Pyramid Alignment

```
         /\
        /E2\     E2E Tests (9 tests, 39%)
       /    \    - Full CLI execution
      /------\   - Real exit codes
     /  Int.  \  Integration Tests (2 tests, 9%)
    /          \ - CLI + DI integration
   /------------\- Component boundaries
  /   Unit Tests \ Unit Tests (12 tests, 52%)
 /                \- Command routing, DI, exit codes
/------------------\- Fastest feedback, 100% isolation
```

**Distribution:**

- Unit Tests: 52% (12/23 tests)
- Integration Tests: 9% (2/23 tests)
- E2E Tests: 39% (9/23 tests)

**Rationale:**
Story 1.1 is foundational, requiring strong E2E coverage to verify the entire CLI pipeline works. Higher E2E percentage than typical (usually 10%) is justified for this critical foundation story.

### Test Levels Decision Matrix

Per **Test Levels Framework**, test level selection follows these rules:

| Scenario                  | Test Level  | Rationale                                        |
| ------------------------- | ----------- | ------------------------------------------------ |
| DI container registration | Unit        | Isolated logic, no external dependencies         |
| Command routing logic     | Unit        | Yargs configuration, mocked command handlers     |
| Exit code logic           | Unit        | Isolated process.exit() calls, fast feedback     |
| CLI + DI integration      | Integration | Component boundary (Yargs ↔ TSyringe)           |
| Full CLI execution        | E2E         | User-facing critical path, real binary execution |

### Test Priority Assignment

Per **Test Priorities Matrix**, all tests are **P0 (Critical)** because:

1. **Foundational story** - All subsequent stories depend on this working
2. **Revenue-impacting** - If CLI doesn't work, product is unusable
3. **High user impact** - Affects 100% of users (all developers using Nìmata)
4. **No rollback capability** - Can't deploy without working CLI

**P0 Testing Requirements:**

- Comprehensive coverage at all levels (unit, integration, E2E)
- Both happy and unhappy paths
- Edge cases and error scenarios
- Exit codes validated in CI

---

## Test Coverage Matrix

### Unit Tests (12 scenarios)

| Test ID      | Requirement   | Scenario                         | Priority | Mitigates | Data/Tooling                      |
| ------------ | ------------- | -------------------------------- | -------- | --------- | --------------------------------- |
| 1.1-UNIT-001 | AC #1, #2, #3 | TSyringe container registration  | P0       | Risk #1   | Mock instances for all interfaces |
| 1.1-UNIT-002 | AC #2         | Command routing - Init           | P0       | Risk #2   | Mocked InitCommand handler        |
| 1.1-UNIT-003 | AC #2         | Command routing - Validate       | P0       | Risk #2   | Mocked ValidateCommand handler    |
| 1.1-UNIT-004 | AC #2         | Command routing - Fix            | P0       | Risk #2   | Mocked FixCommand handler         |
| 1.1-UNIT-005 | AC #2         | Command routing - Prompt         | P0       | Risk #2   | Mocked PromptCommand handler      |
| 1.1-UNIT-006 | AC #3, #4     | Global flag - Help               | P0       | Risk #5   | Yargs parser with help middleware |
| 1.1-UNIT-007 | AC #3, #5     | Global flag - Version            | P0       | N/A       | Mocked package.json version       |
| 1.1-UNIT-008 | AC #3         | Global flag - Config             | P1 → P0  | N/A       | Mocked command handler            |
| 1.1-UNIT-009 | AC #6         | Exit code - Success (0)          | P0       | Risk #3   | Mocked successful execution       |
| 1.1-UNIT-010 | AC #6         | Exit code - Validation Error (1) | P0       | Risk #3   | Mocked validation error           |
| 1.1-UNIT-011 | AC #6         | Exit code - Config Error (3)     | P0       | Risk #3   | Mocked config error               |
| 1.1-UNIT-012 | AC #6         | Exit code - Interrupt (130)      | P0       | Risk #3   | Mocked SIGINT signal              |

**Unit Test Implementation Notes:**

- All unit tests use fresh mocks in `beforeEach()` (100% isolation)
- Follow AAA pattern (Arrange, Act, Assert)
- One assertion per test (clear failure messages)
- Mock all external dependencies (file system, process.exit)
- Mutation testing applied (Stryker, 80%+ score target)

### Integration Tests (2 scenarios)

| Test ID     | Requirement | Scenario                           | Priority | Mitigates   | Data/Tooling                          |
| ----------- | ----------- | ---------------------------------- | -------- | ----------- | ------------------------------------- |
| 1.1-INT-001 | AC #1       | CLI entry point execution          | P0       | Risk #1, #2 | Real file system, Bun runtime         |
| 1.1-INT-002 | AC #2, #1   | Command routing with DI resolution | P0       | Risk #1, #2 | Real TSyringe container, mocked repos |

**Integration Test Implementation Notes:**

- Uses real TSyringe container (not mocked)
- Uses real Yargs configuration
- Mocks external dependencies (repositories, file system operations)
- Tests component boundaries (CLI ↔ DI ↔ Use Cases)

### E2E Tests (9 scenarios)

| Test ID     | Requirement | Scenario                              | Priority | Mitigates   | Data/Tooling               |
| ----------- | ----------- | ------------------------------------- | -------- | ----------- | -------------------------- |
| 1.1-E2E-001 | AC #4, #3   | Execute CLI - Help Flag               | P0       | Risk #5     | Real CLI binary, Bun spawn |
| 1.1-E2E-002 | AC #5, #3   | Execute CLI - Version Flag            | P0       | N/A         | Real CLI binary, Bun spawn |
| 1.1-E2E-003 | AC #1, #2   | Execute CLI - Init Command (stub)     | P0       | Risk #2     | Real CLI binary, Bun spawn |
| 1.1-E2E-004 | AC #1, #2   | Execute CLI - Validate Command (stub) | P0       | Risk #2     | Real CLI binary, Bun spawn |
| 1.1-E2E-005 | AC #1, #2   | Execute CLI - Fix Command (stub)      | P0       | Risk #2     | Real CLI binary, Bun spawn |
| 1.1-E2E-006 | AC #1, #2   | Execute CLI - Prompt Command (stub)   | P0       | Risk #2     | Real CLI binary, Bun spawn |
| 1.1-E2E-007 | AC #2, #6   | Execute CLI - Invalid Command         | P0       | Risk #2, #3 | Real CLI binary, Bun spawn |
| 1.1-E2E-008 | AC #4       | Execute CLI - Per-Command Help        | P0       | Risk #5     | Real CLI binary, Bun spawn |
| 1.1-E2E-009 | AC #6       | Execute CLI - No Command              | P0       | Risk #3     | Real CLI binary, Bun spawn |

**E2E Test Implementation Notes:**

- Executes real CLI binary via `bun spawn`
- Verifies stdout/stderr output
- Asserts exit codes using `$?` or `proc.exited`
- No mocking (full integration with OS)
- Tests user-facing behavior exactly as end-users experience it

### CI Validation Tests (4 scenarios)

| Test   | Command                  | Expected Exit Code | Purpose                            | Mitigates |
| ------ | ------------------------ | ------------------ | ---------------------------------- | --------- |
| CI-001 | `nimata --help`          | 0                  | Verify help exits successfully     | Risk #3   |
| CI-002 | `nimata --version`       | 0                  | Verify version exits successfully  | Risk #3   |
| CI-003 | `nimata invalid-command` | 1                  | Verify error handling sets exit 1  | Risk #3   |
| CI-004 | `nimata` (no args)       | 1                  | Verify missing command sets exit 1 | Risk #3   |

**CI Validation Implementation:**

- Runs in `.github/workflows/ci.yml` (Job 6: E2E Tests + Exit Code Validation)
- Uses bash script with `set +e` to capture exit codes
- Generates visual summary in GitHub Actions UI
- Blocks PR merge if any exit code test fails

---

## Test Execution Strategy

### Execution Order (Fail Fast)

**Phase 1: Foundation Verification (MUST pass before any other tests)**

1. 1.1-INT-001: CLI Entry Point Execution
2. 1.1-UNIT-001: TSyringe Container Registration
3. 1.1-E2E-003-006: Command stub execution

**Phase 2: Routing & Parsing Verification** 4. 1.1-UNIT-002-005: Command routing unit tests 5. 1.1-UNIT-006-008: Global flag parsing 6. 1.1-INT-002: Command routing with DI

**Phase 3: Exit Code & Help Verification (Mitigates Risk #3)** 7. 1.1-UNIT-009-012: Exit code unit tests 8. 1.1-E2E-001-002: Help and version E2E tests 9. 1.1-E2E-007, 009: Exit code E2E validation 10. 1.1-E2E-008: Per-command help

**Phase 4: CI Validation (Final Gate)** 11. CI-001 through CI-004: Exit code validation in CI

**Rationale:**
Fail fast on foundation issues (Phase 1) to avoid wasting time on downstream tests. Exit code validation last (Phase 3-4) because it depends on all routing working correctly.

### Local Development Testing

```bash
# Run all tests
bun test

# Run only unit tests (fast feedback)
bun test apps/cli/tests/unit/

# Run only E2E tests
bun test apps/cli/tests/e2e/

# Run specific test file
bun test apps/cli/tests/unit/container.test.ts

# Run with coverage
bun test --coverage

# Run mutation testing (Stryker)
bun run stryker run
```

### CI Pipeline Testing

```bash
# Turborepo: Run all tests in parallel
turbo test

# Turborepo: Run only unit tests
turbo test --filter='*[!e2e]*'

# Turborepo: Run tests for specific package
turbo test --filter=@nimata/cli

# Exit code validation (automated in CI)
# See .github/workflows/ci.yml Job 6
```

---

## Mutation Testing Strategy

### Stryker Configuration

**Target:** 80%+ mutation score for all unit tests

**Configuration:** `packages/*/stryker.config.json`

```json
{
  "testRunner": "command",
  "commandRunner": {
    "command": "bun test tests/unit/**/*.test.ts"
  },
  "coverageAnalysis": "perTest",
  "mutate": ["src/**/*.ts", "!src/**/*.test.ts"],
  "thresholds": {
    "high": 80,
    "low": 60,
    "break": 50
  }
}
```

**Mutation Testing Scope:**

- **Unit tests only** (12 tests) - fastest feedback
- **Not applied to:** Integration tests (too slow), E2E tests (too slow)

**CI Integration:**

- Runs in `.github/workflows/ci.yml` (Job 7: Mutation Testing)
- Only runs on PRs (not every commit)
- Continues on error (doesn't fail build if score < 80%)
- Uploads mutation report as artifact

**Expected Mutation Score:**

- Target: 80%+ (high threshold)
- Break: 50% (PR fails if below this)
- Typical score for well-tested code: 75-85%

### Mutation Testing for Story 1.1

**Expected Mutants:**

- Boundary conditions in exit code logic
- Boolean negations in command routing
- Return value mutations in DI container
- String mutations in help text

**Example Mutants:**

```typescript
// Original
if (exitCode === 0) { ... }

// Mutant 1: Boundary mutator
if (exitCode === 1) { ... }

// Mutant 2: Equality mutator
if (exitCode !== 0) { ... }

// Tests should kill both mutants
```

---

## Test Data and Prerequisites

### Test Environment Setup

**Prerequisites for Story 1.1 Tests:**

- Bun 1.3+ installed
- Node modules installed (`bun install`)
- Turborepo build completed (`turbo build`)
- CLI binary executable (`chmod +x apps/cli/bin/nimata`)

**Test Data:**

- No external test data required (Story 1.1 is command stubs)
- Mock data for DI container (interfaces, implementations)
- Package.json version for `--version` test

### Test Isolation Requirements

**Unit Tests:**

- Fresh mocks in `beforeEach()`
- No shared state between tests
- No real file system access
- No real network calls
- Mock `process.exit()` to prevent test runner exit

**Integration Tests:**

- Real TSyringe container (cleared between tests)
- Real Yargs configuration (new instance per test)
- Mocked repositories (no real DB/file operations)

**E2E Tests:**

- Real CLI binary execution (isolated process)
- Temporary directories for file operations (if needed in future)
- Clean environment variables per test

---

## Definition of Done

### Story 1.1 Complete When:

**Development:**

- ✅ All 6 acceptance criteria implemented
- ✅ Turborepo monorepo structure created
- ✅ TSyringe DI container configured
- ✅ Yargs command routing working for all 4 commands (stubs)
- ✅ Help and version flags working
- ✅ Exit codes follow Unix conventions (documented in code)

**Testing:**

- ✅ All 23 test scenarios implemented
- ✅ All unit tests passing (12/12)
- ✅ All integration tests passing (2/2)
- ✅ All E2E tests passing (9/9)
- ✅ Test coverage ≥ 100% for CLI framework code
- ✅ Mutation score ≥ 80% for unit tests (Stryker)

**Risk Mitigation:**

- ✅ Risk #1 mitigation: DI container tests passing
- ✅ Risk #2 mitigation: Command routing tests passing
- ✅ **Risk #3 mitigation: CI exit code validation configured and passing** ⚠️
- ✅ **Risk #4 mitigation: Turborepo verification checklist completed** ⚠️
- ✅ Risk #5 mitigation: Help text tests passing

**CI/CD:**

- ✅ CI pipeline configured (`.github/workflows/ci.yml`)
- ✅ Exit code validation job passing in CI
- ✅ Branch protection rule enforces exit code validation
- ✅ All CI jobs passing (lint, build, typecheck, test, e2e, security)

**Documentation:**

- ✅ Exit codes documented in source code comments
- ✅ Turborepo setup documented in README
- ✅ Test implementation examples in test files

**Gate Approval:**

- ✅ Gate status: **PASS** (all CONCERNS resolved)
- ✅ No critical issues unresolved
- ✅ All evidence provided (screenshots/logs)

---

## Risk Mitigation Outcome Summary

| Risk                 | Initial Score | Mitigation                             | Residual Score | Reduction |
| -------------------- | ------------- | -------------------------------------- | -------------- | --------- |
| #1: DI Container     | 4             | Comprehensive unit + integration tests | 1              | 75%       |
| #2: Command Routing  | 4             | Unit + integration + E2E tests         | 1              | 75%       |
| #3: Exit Code        | **6** ⚠️      | Unit + E2E + **CI validation**         | 1              | 83%       |
| #4: Turborepo Config | **6** ⚠️      | **Manual verification checklist**      | 2              | 67%       |
| #5: Help Text        | 2             | E2E help text tests                    | 1              | 50%       |

**Total Risk Reduction:** 70% (from 20 to 6)

**Final Gate Status:** 🟢 **PASS** (after mitigations complete)

---

## References

### Story Documents

- **Story:** `docs/stories/story-1.1.md`
- **Solution Architecture:** `docs/solution-architecture.md`
- **Test Levels Framework:** `bmad/bmm/testarch/knowledge/test-levels-framework.md`
- **Test Priorities Matrix:** `bmad/bmm/testarch/knowledge/test-priorities-matrix.md`
- **Risk Governance:** `bmad/bmm/testarch/knowledge/risk-governance.md`
- **Probability-Impact Scale:** `bmad/bmm/testarch/knowledge/probability-impact.md`

### Mitigation Documents

- **Turborepo Verification Checklist:** `docs/story-1.1-turborepo-verification-checklist.md`
- **Exit Code Validation Strategy:** `docs/story-1.1-exit-code-validation-strategy.md`
- **CI Pipeline Configuration:** `.github/workflows/ci.yml`

### Architecture Decisions

- **ADR-001:** Use Bun 1.3+ Runtime
- **ADR-002:** Clean Architecture Lite (3 Layers)
- **ADR-003:** TSyringe with Manual Registration
- **ADR-006:** Turborepo for Monorepo Orchestration
- **ADR-007:** Yargs + Prompts for CLI

---

## Approval Sign-Off

### Test Architect Approval

**Test Architect:** BMad Test Architect
**Date:** 2025-10-16
**Signature:** \***\*\*\*\*\*\*\***\_\***\*\*\*\*\*\*\***

**Risk Assessment Status:** ✅ Complete
**Test Coverage Status:** ✅ Comprehensive (23 scenarios)
**Mitigation Plans Status:** ✅ Documented
**Gate Decision:** 🟡 CONCERNS (mitigations required)

### Developer Acknowledgment

**Developer:** **\*\*\*\***\_\_**\*\*\*\*** Date: \***\*\_\_\*\***

**I acknowledge:**

- ✅ I have reviewed all 5 risks and understand the mitigation requirements
- ✅ I will implement all 23 test scenarios before PR submission
- ✅ I will complete the Turborepo verification checklist (Risk #4)
- ✅ I will configure CI exit code validation (Risk #3)
- ✅ I will provide evidence (screenshots/logs) for Turborepo setup
- ✅ I understand the PR cannot be approved until all CONCERNS are resolved

**Ready to Implement:** ⬜ Yes

---

_This risk assessment was generated by BMad Test Architect workflow._
_Framework: Test Architect (Risk and Test Design v3.1)_
_Date: 2025-10-16_
