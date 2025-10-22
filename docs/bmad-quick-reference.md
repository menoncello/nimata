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

# 3. Implementation
/bmad:bmm:agents:dev *develop X.X

# 4. Quality Checks
/bmad:bmm:agents:tea *test-review X.X
/bmad:bmm:agents:tea *validate-test-quality  # Validate test code quality

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
