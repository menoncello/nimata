# Story 1.1: Turborepo Verification Checklist

**Risk Mitigation:** Risk #4 - Turborepo Configuration Errors (Score: 6)
**Owner:** Developer implementing Story 1.1
**Status:** 🔴 Not Started

---

## Purpose

This checklist ensures the Turborepo monorepo setup is correctly configured before any development proceeds. Turborepo is foundational to the entire project architecture - if misconfigured, it blocks all 30 stories across 3 epics.

**Completion Criteria:** All checkboxes must be ✅ before Story 1.1 PR is approved.

---

## Phase 1: Initial Setup Verification

### 1.1 Root Package Configuration

- [ ] **Root package.json exists** at project root
  - Path: `/Users/menoncello/repos/dev/nimata/package.json`
  - Verify workspaces are defined:
    ```json
    {
      "workspaces": [
        "apps/*",
        "packages/*",
        "plugins/*",
        "infrastructure/*"
      ]
    }
    ```

- [ ] **Turborepo installed** as dev dependency
  - Run: `bun pm ls turbo`
  - Expected: `turbo@^2.x` appears in output

- [ ] **Bun lockfile created**
  - Path: `/Users/menoncello/repos/dev/nimata/bun.lockb`
  - File exists and is committed to git

### 1.2 Turborepo Configuration File

- [ ] **turbo.json exists** at project root
  - Path: `/Users/menoncello/repos/dev/nimata/turbo.json`

- [ ] **turbo.json defines build pipeline**
  - Verify contains at minimum:
    ```json
    {
      "$schema": "https://turbo.build/schema.json",
      "pipeline": {
        "build": {
          "dependsOn": ["^build"],
          "outputs": ["dist/**"]
        },
        "test": {
          "dependsOn": ["build"],
          "outputs": []
        },
        "lint": {
          "outputs": []
        }
      }
    }
    ```

- [ ] **Pipeline tasks are defined**
  - `build` task exists with `^build` dependency (builds dependencies first)
  - `test` task exists with `build` dependency
  - `lint` task exists (can run in parallel)

### 1.3 Workspace Structure

- [ ] **apps/ directory created**
  - Path: `/Users/menoncello/repos/dev/nimata/apps/`
  - Contains: `cli/` subdirectory

- [ ] **packages/ directory created**
  - Path: `/Users/menoncello/repos/dev/nimata/packages/`
  - Contains: `core/` and `adapters/` subdirectories (stub packages)

- [ ] **plugins/ directory created** (root-level)
  - Path: `/Users/menoncello/repos/dev/nimata/plugins/`
  - Can be empty for Story 1.1 (populated in later stories)

- [ ] **infrastructure/ directory created** (root-level)
  - Path: `/Users/menoncello/repos/dev/nimata/infrastructure/`
  - Can be empty for Story 1.1 (populated in later stories)

---

## Phase 2: TypeScript Project References

### 2.1 Root TypeScript Configuration

- [ ] **Root tsconfig.json exists**
  - Path: `/Users/menoncello/repos/dev/nimata/tsconfig.json`

- [ ] **Root tsconfig.json defines references**
  - Verify contains:
    ```json
    {
      "compilerOptions": {
        "composite": true,
        "declaration": true,
        "declarationMap": true,
        "incremental": true
      },
      "references": [
        { "path": "./apps/cli" },
        { "path": "./packages/core" },
        { "path": "./packages/adapters" }
      ],
      "files": []
    }
    ```

- [ ] **Composite mode enabled** in root tsconfig
  - `"composite": true` present in compilerOptions

### 2.2 Package-Level TypeScript Configuration

- [ ] **apps/cli/tsconfig.json exists**
  - Path: `/Users/menoncello/repos/dev/nimata/apps/cli/tsconfig.json`
  - Extends root config
  - Defines references to packages/core and packages/adapters

- [ ] **packages/core/tsconfig.json exists**
  - Path: `/Users/menoncello/repos/dev/nimata/packages/core/tsconfig.json`
  - Extends root config
  - No references (leaf package)

- [ ] **packages/adapters/tsconfig.json exists**
  - Path: `/Users/menoncello/repos/dev/nimata/packages/adapters/tsconfig.json`
  - Extends root config
  - References packages/core

- [ ] **TypeScript strict mode enabled** in all package tsconfigs
  - All tsconfig.json files have `"strict": true`

### 2.3 TypeScript Compilation Test

- [ ] **Run tsc --build from root**
  - Command: `cd /Users/menoncello/repos/dev/nimata && tsc --build`
  - Expected: No errors, builds all packages in dependency order
  - Output files created in each package's dist/ or build/ directory

- [ ] **Incremental builds work**
  - Run: `tsc --build` twice
  - Expected: Second run is near-instant (using .tsbuildinfo cache)
  - Verify .tsbuildinfo files exist in each package

- [ ] **Clean builds work**
  - Run: `tsc --build --clean`
  - Expected: All dist/ and .tsbuildinfo files removed
  - Run: `tsc --build` again
  - Expected: Full rebuild succeeds

---

## Phase 3: Turborepo Build Pipeline

### 3.1 Dry-Run Verification

- [ ] **Turborepo dry-run succeeds**
  - Command: `turbo build --dry-run`
  - Expected output shows:
    - Task execution order (dependencies build first)
    - No errors or warnings
    - All packages detected

- [ ] **Turborepo dry-run shows correct task graph**
  - Verify output shows dependency order:
    1. `packages/core#build`
    2. `packages/adapters#build` (depends on core)
    3. `apps/cli#build` (depends on core + adapters)

### 3.2 Actual Build Execution

- [ ] **Run full build**
  - Command: `turbo build`
  - Expected: All packages build successfully
  - No TypeScript errors
  - Output directories created:
    - `apps/cli/dist/`
    - `packages/core/dist/`
    - `packages/adapters/dist/`

- [ ] **Build artifacts exist**
  - Check `apps/cli/dist/index.js` exists
  - Check `packages/core/dist/index.js` exists
  - Check `packages/adapters/dist/index.js` exists
  - Check `.d.ts` declaration files exist for all packages

### 3.3 Local Caching Verification

- [ ] **Initial build timing recorded**
  - Run: `turbo build --force` (ignore cache)
  - Record time: ______ seconds

- [ ] **Cached build is faster**
  - Run: `turbo build` (should use cache)
  - Expected: "cache hit" messages for all tasks
  - Time: ______ seconds (should be < 1 second)

- [ ] **Cache location verified**
  - Path: `/Users/menoncello/repos/dev/nimata/node_modules/.cache/turbo/`
  - Directory exists and contains cache files

- [ ] **Partial cache invalidation works**
  - Modify file in `packages/core/src/`
  - Run: `turbo build`
  - Expected:
    - `packages/core#build` rebuilds (cache miss)
    - `packages/adapters#build` rebuilds (dependent)
    - `apps/cli#build` rebuilds (dependent)
  - Verify only affected packages rebuild

### 3.4 Parallel Task Execution

- [ ] **Lint runs in parallel with build**
  - Run: `turbo build lint --concurrency=10`
  - Expected: lint tasks run in parallel (check timing)
  - No dependency between lint and build

- [ ] **Test depends on build**
  - Run: `turbo test`
  - Expected: build runs first, then test
  - Verify with `turbo test --dry-run` (shows task graph)

---

## Phase 4: Package Linking and Dependencies

### 4.1 Workspace Dependencies

- [ ] **apps/cli depends on packages/core**
  - Check `apps/cli/package.json`:
    ```json
    {
      "dependencies": {
        "@nimata/core": "workspace:*"
      }
    }
    ```

- [ ] **apps/cli depends on packages/adapters**
  - Check `apps/cli/package.json`:
    ```json
    {
      "dependencies": {
        "@nimata/adapters": "workspace:*"
      }
    }
    ```

- [ ] **packages/adapters depends on packages/core**
  - Check `packages/adapters/package.json`:
    ```json
    {
      "dependencies": {
        "@nimata/core": "workspace:*"
      }
    }
    ```

### 4.2 Import Resolution Test

- [ ] **CLI can import from packages/core**
  - Add test import in `apps/cli/src/index.ts`:
    ```typescript
    import { something } from '@nimata/core';
    ```
  - Run: `tsc --build`
  - Expected: No "cannot find module" errors

- [ ] **CLI can import from packages/adapters**
  - Add test import in `apps/cli/src/index.ts`:
    ```typescript
    import { something } from '@nimata/adapters';
    ```
  - Run: `tsc --build`
  - Expected: No "cannot find module" errors

- [ ] **Adapters can import from packages/core**
  - Add test import in `packages/adapters/src/index.ts`:
    ```typescript
    import { something } from '@nimata/core';
    ```
  - Run: `tsc --build`
  - Expected: No "cannot find module" errors

### 4.3 Circular Dependency Prevention

- [ ] **No circular dependencies detected**
  - Run: `turbo build --dry-run`
  - Expected: No warnings about circular dependencies

- [ ] **packages/core does not depend on adapters**
  - Check `packages/core/package.json`
  - Verify NO dependency on `@nimata/adapters`
  - (Core should only define interfaces, not depend on implementations)

---

## Phase 5: CLI Binary Execution

### 5.1 Binary Configuration

- [ ] **apps/cli/package.json defines bin field**
  - Check `apps/cli/package.json`:
    ```json
    {
      "bin": {
        "nimata": "./bin/nimata"
      }
    }
    ```

- [ ] **bin/nimata launcher script exists**
  - Path: `/Users/menoncello/repos/dev/nimata/apps/cli/bin/nimata`
  - Has executable permissions: `chmod +x apps/cli/bin/nimata`
  - Contains proper shebang: `#!/usr/bin/env bun`

### 5.2 Binary Execution Test

- [ ] **Build CLI package**
  - Run: `turbo build --filter=@nimata/cli`
  - Expected: Builds only CLI and its dependencies

- [ ] **Execute CLI binary directly**
  - Run: `./apps/cli/bin/nimata --help`
  - Expected: Help text displays (or stub message)
  - No "cannot find module" errors

- [ ] **Install CLI globally (local test)**
  - Run: `cd apps/cli && bun link`
  - Run: `nimata --help`
  - Expected: CLI executes from anywhere
  - Cleanup: `bun unlink`

---

## Phase 6: Development Workflow

### 6.1 Watch Mode

- [ ] **Turborepo watch mode works**
  - Run: `turbo build --watch` in background
  - Modify file in `packages/core/src/`
  - Expected: Auto-rebuild triggered
  - Verify terminal shows rebuild output

- [ ] **TypeScript watch mode works**
  - Run: `tsc --build --watch` in background
  - Modify file in `packages/core/src/`
  - Expected: Auto-recompile triggered
  - No errors in watch output

### 6.2 Selective Package Builds

- [ ] **Filter by package works**
  - Run: `turbo build --filter=@nimata/core`
  - Expected: Only packages/core builds

- [ ] **Filter with dependencies works**
  - Run: `turbo build --filter=@nimata/cli...`
  - Expected: Builds CLI and all dependencies (core, adapters)

- [ ] **Scope to changed packages works** (requires git)
  - Make change in `packages/core/`
  - Run: `turbo build --filter=[HEAD^1]`
  - Expected: Only rebuilds packages affected by change

---

## Phase 7: CI/CD Preparation

### 7.1 CI Configuration Readiness

- [ ] **Turborepo cache can be disabled**
  - Run: `turbo build --force --no-cache`
  - Expected: Full rebuild ignoring cache

- [ ] **Turborepo cache can be in remote mode** (future)
  - Verify turbo.json doesn't hardcode local paths
  - Verify no absolute paths in configuration

- [ ] **Build logs are captured**
  - Run: `turbo build --output-logs=full`
  - Expected: Full build logs displayed (not just errors)

### 7.2 Error Handling

- [ ] **Build fails on TypeScript errors**
  - Introduce TypeScript error in `packages/core/src/`
  - Run: `turbo build`
  - Expected: Build fails with non-zero exit code
  - Error message is clear and points to file/line

- [ ] **Build fails on missing dependencies**
  - Remove `@nimata/core` from `apps/cli/package.json`
  - Run: `turbo build`
  - Expected: Build fails with "cannot find module" error

- [ ] **Partial build recovery works**
  - Fix errors from above tests
  - Run: `turbo build`
  - Expected: Build succeeds, uses cache for unaffected packages

---

## Phase 8: Documentation and Validation

### 8.1 Documentation

- [ ] **Turborepo setup documented in README**
  - Path: `/Users/menoncello/repos/dev/nimata/README.md`
  - Contains section on monorepo structure
  - Explains workspace organization

- [ ] **Build commands documented**
  - README contains examples:
    - `bun install` (install all workspace dependencies)
    - `turbo build` (build all packages)
    - `turbo test` (run all tests)
    - `turbo lint` (run all linters)

- [ ] **Developer onboarding guide exists**
  - Covers first-time setup steps
  - Explains TypeScript project references
  - Shows how to add new packages

### 8.2 Final Validation

- [ ] **Complete clean build from scratch**
  - Run: `rm -rf node_modules bun.lockb`
  - Run: `rm -rf apps/*/dist packages/*/dist`
  - Run: `bun install`
  - Run: `turbo build`
  - Expected: Clean install and build succeeds

- [ ] **Verify no uncommitted generated files**
  - Run: `git status`
  - Expected: No `dist/` or `node_modules/` in git status
  - Verify `.gitignore` excludes build artifacts

- [ ] **Run full task pipeline**
  - Run: `turbo build test lint`
  - Expected: All tasks complete successfully
  - No warnings or errors

---

## Risk Mitigation Outcome

**After completing this checklist:**

| Metric | Before | After |
|--------|--------|-------|
| Risk #4 Score | 6 (Probability: 2, Impact: 3) | 2 (Probability: 1, Impact: 2) |
| Gate Status | CONCERNS | PASS (if all tests pass) |
| Residual Risk | Turborepo misconfiguration blocks development | Low - verified working, documented |

**Evidence Required for PR Approval:**
- Screenshot or log output of successful `turbo build --dry-run`
- Screenshot or log output of successful `tsc --build`
- Screenshot of cache hit after second `turbo build`
- This checklist with all items ✅ checked

---

## Troubleshooting Common Issues

### Issue: "Workspace not found"
**Solution:** Verify `package.json` workspaces glob patterns match directory structure.

### Issue: "Cannot find module @nimata/core"
**Solution:**
1. Check `packages/core/package.json` has `"name": "@nimata/core"`
2. Run `bun install` to regenerate workspace links
3. Verify TypeScript project references in tsconfig.json

### Issue: "Circular dependency detected"
**Solution:** Review import statements. Core should never import from adapters/CLI.

### Issue: Slow builds
**Solution:**
1. Verify cache is working: `turbo build` should show "cache hit"
2. Check `.turbo/` directory exists
3. Use `turbo build --filter=<package>` for selective builds

### Issue: TypeScript errors in node_modules
**Solution:**
1. Run `bun install` to ensure all dependencies are installed
2. Delete `node_modules/.cache` and rebuild
3. Verify TypeScript version matches across all packages

---

## Approval Sign-Off

**Developer:** __________________ Date: __________

**Checklist Status:** ⬜ Complete (all items ✅)

**Risk #4 Mitigation:** ⬜ Verified

**Ready for Story 1.1 PR:** ⬜ Yes

---

_This checklist is part of Story 1.1 Risk Mitigation Strategy._
_Generated by BMad Test Architect workflow._
