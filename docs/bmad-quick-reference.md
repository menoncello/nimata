# BMad Method v6 - Workflow quick Reference

## Anytime

```bash
/bmad:module:agents:name     # Load agent (once per session)
*workflow-name               # Execute workflow
```

**Tip**: Agent stays loaded until you switch to another agent.

---

## Level 3-4: Complete Flow

### Project Initialization (Once)

```bash
# PHASE 1: ANALYSIS / NEW PROJECT
/bmad:bmm:agents:analyst *workflow-status

# Optional
/bmad:bmm:agents:analyst *brainstorm-project

# Optional
/bmad:bmm:agents:analyst *research Market Research
/bmad:bmm:agents:analyst *research Deep Research Prompt Generator
/bmad:bmm:agents:analyst *research Technical/Architecture Research
/bmad:bmm:agents:analyst *research Competitive Intelligence
/bmad:bmm:agents:analyst *research User Research
/bmad:bmm:agents:analyst *research Domain/Industry Research

/bmad:bmm:agents:analyst *product-brief

# PHASE 2: PLANNING
/bmad:bmm:agents:pm *prd

# Optional
/bmad:bmm:agents:ux-expert *ux-spec

# PHASE 3: ARCHITECTURE (Once)
/bmad:bmm:agents:architect *solution-architecture
/menon:analyze-bmad-gaps

/bmad:bmm:agents:sm *assess-project-ready
```

---

## Epic Loop (Just in Time - Repeat for Each Epic)

### Epic N: Solutioning (JIT)

```bash
/bmad:bmm:agents:architect *tech-spec epic X
/bmad:bmm:agents:tea *test-design epic X
```

### Epic N: Story Loop (Repeat for Each Story)

```bash
# 1. Story Creation
/bmad:bmm:agents:sm *create-story X.X
# [User reviews]
/bmad:bmm:agents:sm *story-ready X.X
/bmad:bmm:agents:sm *story-context X.X

# 2. Testing (ATDD - recommended for P0/P1)
/bmad:bmm:agents:tea *atdd X.X

# 3. Implementation - ZERO TOLERANCE QUALITY GATES
/bmad:bmm:agents:dev *develop X.X  # MANDATORY: TypeScript 0 errors, ESLint 0 violations, Tests 100%, Mutation 80%+ (85%+ core)

# 4. Quality Checks - MANDATORY VALIDATION
/bmad:bmm:agents:tea *test-review X.X
/bmad:bmm:agents:tea *validate-test-quality  # Validate test code quality and mutation score

# Mutation testing with Stryker (80%+ threshold required - NO EXCEPTIONS)

# 5. Quality Gate (P0/P1 stories)
/bmad:bmm:agents:tea *trace X.X
/bmad:bmm:agents:tea *nfr-assess X.X

# 6. If have some issue, back to 3 (Implementation)

# 7. Finish
/bmad:bmm:agents:dev *review X.X

# If have some issue, back to 3 (Implementation)

# [User verifies DoD]
/bmad:bmm:agents:dev *story-approved

#atualiza o bmad6
node /Users/menoncello/repos/oss/bmad6/tools/cli/bmad-cli.js install

/menon:analyze-bmad-gaps
/menon:finalize-story
```

### Epic N: Epic-Level Validation

```bash
# After all stories in epic complete
/bmad:bmm:agents:tea *trace epic X
/bmad:bmm:agents:tea *nfr-assess epic X

/bmad:bmm:agents:architect *validate-tech-spec epic X

/bmad:bmm:agents:sm *retrospective epic X
```

**Repeat epic loop for all remaining epics**

---

## Project-Level Validation (Before Release)

```bash
# After all epics complete
/bmad:bmm:agents:tea *trace
/bmad:bmm:agents:tea *nfr-assess

/bmad:bmm:agents:architect *validate-architecture

/bmad:bmm:agents:pm *validate

/bmad:bmm:agents:sm *retrospective
```

---

## Course Correction (Any Phase)

```bash
/bmad:bmm:agents:sm
*correct-course              # Handle scope changes, blockers

/bmad:bmm:agents:pm
*correct-course              # PM perspective on changes

/bmad:bmm:agents:architect
*correct-course              # Technical perspective on changes
```

## MANDATORY Quality Standards - ZERO TOLERANCE

**CRITICAL REQUIREMENTS - NO EXCEPTIONS:**

- ✅ **TypeScript**: 0 compilation errors (strict mode)
- ✅ **ESLint**: 0 violations (NO eslint-disable comments allowed)
- ✅ **Tests**: 100% pass rate with meaningful assertions
- ✅ **Mutation**: 80%+ score (85%+ for core packages) using Stryker
- ✅ **Test Runner**: Bun Test exclusively (no other frameworks)
- ✅ **Type Safety**: NO @ts-ignore, NO non-null assertions (!)
- ✅ **Code Quality**: All code smells must be addressed during implementation

**FORBIDDEN PRACTICES:**

- ❌ **NEVER** use `eslint-disable` comments
- ❌ **NEVER** use `@ts-ignore` or non-null assertions
- ❌ **NEVER** lower mutation thresholds to make tests pass
- ❌ **NEVER** proceed with known quality issues
- ❌ **NEVER** write meaningless tests that don't validate behavior

**QUALITY GATE ENFORCEMENT:**

- Build will BREAK if any quality gate fails
- Story progress BLOCKED until all quality gates pass
- Additional tests MUST be added to meet mutation thresholds
- Code MUST be refactored to eliminate ESLint violations

**TEST REQUIREMENTS:**

- All tests use Bun Test API (`describe`, `it`, `expect`)
- Tests must have specific, meaningful assertions
- Each acceptance criterion must have corresponding test coverage
- Tests must be designed to kill mutants effectively
