# Fix All Code Quality Issues - Enhanced Monorepo Workflow

Execute comprehensive code quality workflow optimized for monorepos with parallel agent execution and sequential issue type resolution.

## Monorepo Detection and Analysis

1. **Monorepo Structure Detection**
   - Detect if project is a monorepo by analyzing package.json workspaces, turbo.json, or lerna.json
   - Identify all packages/services/apps in the monorepo structure
   - Map dependencies and build order between packages

2. **Initial Assessment Phase**
   - Run `bunx turbo lint` to identify all ESLint violations across all packages
   - Run `bunx turbo typecheck` to identify all TypeScript errors across all packages
   - Run `bunx turbo test` to identify all failing tests across all packages
   - Create detailed inventory of issues by package and file:
     - Lint issues: File path, line number, rule violation, severity
     - Type errors: File path, error type, error message
     - Test failures: Test file, test name, failure reason

## Parallel Correction Workflow

### Phase 1: ESLint Issues Resolution (Priority 1)

1. **File Assignment Strategy**
   - Group lint issues by affected files
   - Distribute files across 3 parallel ESLint fixer agents
   - Ensure no file is assigned to more than one agent
   - Respect package dependencies in file assignment

2. **Parallel Execution (3 Agents)**
   - Agent 1: Handles first 1/3 of affected files
   - Agent 2: Handles second 1/3 of affected files
   - Agent 3: Handles remaining 1/3 of affected files
   - Each agent reports completion when all assigned files are fixed

3. **Progress Tracking**
   - Real-time status updates for each agent
   - File completion tracking
   - Issue resolution verification

### Phase 2: TypeScript Error Resolution (Priority 2)

1. **Trigger Condition**
   - Starts automatically after ESLint phase completion
   - Only proceeds when all lint agents report completion

2. **File Assignment Strategy**
   - Group type errors by affected files
   - Exclude files already processed in ESLint phase (unless new type errors emerge)
   - Distribute remaining files across 3 parallel TypeScript fixer agents

3. **Parallel Execution (3 Agents)**
   - Agent 4: Handles first 1/3 of type error files
   - Agent 5: Handles second 1/3 of type error files
   - Agent 6: Handles remaining 1/3 of type error files
   - Each agent resolves type errors and validates fixes

### Phase 3: Test Failure Resolution (Priority 3)

1. **Trigger Condition**
   - Starts only after both ESLint and TypeScript phases complete
   - Re-runs tests to identify any new failures from previous fixes

2. **Test File Assignment**
   - Group failing test files
   - Distribute test files across 3 parallel test fixer agents
   - Consider test interdependencies in assignment

3. **Parallel Execution (3 Agents)**
   - Reuse the same 3 agents sequentially for test fixes
   - Each agent handles a subset of failing test files
   - Verify fixes by re-running affected tests

## Agent Concurrency Management

### File Locking System

- Implement file-level locking to prevent concurrent modifications
- Track which agent is currently working on which file
- Queue files when multiple agents need to modify the same file

### Dependency Resolution

- Respect package build order when assigning files
- Handle inter-package dependencies correctly
- Ensure upstream packages are fixed before downstream packages

## Final Validation Phase

1. **Comprehensive Quality Checks**
   - Re-run `bunx turbo lint` - expecting 0 errors
   - Re-run `bunx turbo typecheck` - expecting 0 errors
   - Re-run `bunx turbo test` - expecting 100% pass rate
   - Validate all packages build successfully

2. **Regression Testing**
   - Ensure no new issues were introduced during fixes
   - Verify package dependencies remain intact
   - Validate that the monorepo structure remains functional

3. **Comprehensive Fix Report**
   - Agent execution metrics and timing
   - File-level fix inventory by agent
   - Before/after quality comparison
   - Package-specific improvement metrics

## Expected Outcome

- **0 ESLint errors**: All linting violations resolved across all packages
- **0 TypeScript errors**: All type errors resolved with improved type safety
- **100% test pass rate**: All failing tests fixed with maintained coverage
- **Efficient parallel processing**: 6 agents working concurrently without conflicts
- **Package integrity**: All packages maintain their functionality and dependencies
- **Detailed fix tracking**: Complete inventory of changes made by each agent

## Usage

Execute this command when you want to comprehensively fix all code quality issues in a monorepo. The workflow will automatically detect the monorepo structure, categorize issues by package and file, and apply appropriate fixes using specialized agents working in parallel with proper concurrency control.
