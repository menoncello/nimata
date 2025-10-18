# Story 1.2 ATDD Implementation Checklist

**Generated:** 2025-10-16
**Architect:** Murat (Master Test Architect)
**Status:** RED (All tests failing - awaiting implementation)

## 📋 Test Suite Overview

| Test File                                                          | Test Count   | Priority | Status              |
| ------------------------------------------------------------------ | ------------ | -------- | ------------------- |
| `packages/core/tests/unit/deep-merge.test.ts`                      | 16 tests     | P0-3     | 🔴 RED              |
| `packages/adapters/tests/unit/yaml-security.test.ts`               | 15 tests     | P0-1     | 🔴 RED              |
| `packages/adapters/tests/unit/yaml-config-repository.perf.test.ts` | 10 tests     | P0-2     | 🔴 RED              |
| `packages/adapters/tests/integration/config-file-loading.test.ts`  | 18 tests     | Core     | 🔴 RED              |
| `apps/cli/tests/e2e/config-loading.e2e.test.ts`                    | 14 tests     | P1-2     | 🔴 RED              |
| **TOTAL**                                                          | **73 tests** | -        | 🔴 **0/73 passing** |

## 🎯 Implementation Order (Red → Green → Refactor)

### Phase 1: P0-3 - Deep Merge Foundation (Start Here)

**File to Create:** `packages/core/src/utils/deep-merge.ts`

**Tests to Turn Green:** `packages/core/tests/unit/deep-merge.test.ts`

**Requirements:**

- ✅ Implement `deepMerge(base, override)` function
- ✅ Handle nested objects (deep merge, not shallow replace)
- ✅ Replace arrays instead of merging them
- ✅ Treat `undefined` as non-override (preserve base value)
- ✅ Treat `null` as explicit override
- ✅ Do not mutate input objects (return new object)
- ✅ Handle primitive vs object type mismatches
- ✅ O(n) time complexity where n = total keys
- ✅ Document complexity in JSDoc (`@complexity Time: O(n), Space: O(n)`)
- ✅ Performance: <10ms for 100-key config

**Test Mapping:**
| Test | Code Location | Implementation Task |
|------|---------------|---------------------|
| `should merge two flat objects` | `deepMerge()` core logic | Spread base, spread override, return merged |
| `should merge nested objects deeply` | Recursive merge | Detect object type, recurse for nested objects |
| `should handle 5-level nested structures` | Recursion depth | Test deep nesting, ensure no stack overflow |
| `should replace arrays instead of merging` | Array detection | `Array.isArray()` check, return override array |
| `should not override with undefined` | Undefined handling | Filter out undefined keys from override |
| `should override with null explicitly` | Null handling | Allow null to override base value |
| `should not mutate input objects` | Immutability | Use `structuredClone()` or recursive copy |
| `should handle primitive overriding object` | Type mismatch | When override is primitive, replace entire base |
| `should merge 100-key config in <10ms` | Performance | Ensure O(n) algorithm, no unnecessary copies |
| `should document O(n) complexity` | JSDoc | Add `@complexity` tag with Big-O notation |

**Acceptance:** 16/16 tests passing, 80%+ mutation score

---

### Phase 2: P0-1 - Security Hardening

**Files to Create/Modify:**

- `packages/adapters/src/repositories/yaml-config-repository.ts` (validation logic)
- `packages/core/src/types/config.ts` (Zod schemas)

**Tests to Turn Green:** `packages/adapters/tests/unit/yaml-security.test.ts`

**Requirements:**

- ✅ Reject YAML files >1MB (check file size before parsing)
- ✅ Reject YAML nesting >10 levels (recursive depth check)
- ✅ Reject YAML anchors and aliases (Bun YAML parser config)
- ✅ Reject absolute paths in `configPath` fields (Zod validator)
- ✅ Detect path traversal attempts (`../` patterns)
- ✅ Provide clear error messages with field paths
- ✅ Include file path in all error messages

**Test Mapping:**
| Test | Code Location | Implementation Task |
|------|---------------|---------------------|
| `should reject YAML files exceeding 1MB` | `YAMLConfigRepository.load()` | `stat()` file before parsing, throw if >1MB |
| `should reject YAML with nesting >10 levels` | `validateNestingDepth()` utility | Recursive depth counter, throw at 11 |
| `should reject YAML with anchors` | Bun YAML parser options | Configure parser to reject anchors |
| `should reject YAML with aliases` | Bun YAML parser options | Configure parser to reject aliases |
| `should reject absolute paths in configPath` | Zod schema | `.refine(path => !isAbsolute(path))` |
| `should reject path traversal attempts` | Zod schema | `.refine(path => !path.includes('..'))` |
| `should include field path in errors` | Zod error formatting | Use `zodError.format()` for field paths |

**Acceptance:** 15/15 tests passing

---

### Phase 3: P0-2 - Performance Benchmarks

**Files to Modify:**

- `packages/adapters/src/repositories/yaml-config-repository.ts` (caching)
- `packages/core/src/utils/deep-merge.ts` (optimization)

**Tests to Turn Green:** `packages/adapters/tests/unit/yaml-config-repository.perf.test.ts`

**Requirements:**

- ✅ Config load <50ms (p95) for 100-key config
- ✅ Typical config load <20ms
- ✅ In-memory caching (per-process lifetime)
- ✅ Cache key: `${projectRoot}:${mtime}`
- ✅ Deep merge benchmarked for 5-level nesting
- ✅ No memory leaks on repeated loads
- ✅ Document cache strategy in JSDoc

**Test Mapping:**
| Test | Code Location | Implementation Task |
|------|---------------|---------------------|
| `should load 100-key config in <50ms` | `YAMLConfigRepository.load()` | Optimize parsing, use native Bun YAML |
| `should load typical config in <20ms` | File I/O optimization | Minimize disk reads, cache aggressively |
| `should cache loaded config` | Cache implementation | `Map<string, Config>` keyed by project path |
| `should document cache invalidation` | JSDoc | Document "Cache is per-process lifetime" |
| `should not leak memory on repeated loads` | Cache management | Reuse cache entry, don't create new objects |
| `should merge 5-level nesting efficiently` | `deepMerge()` optimization | Ensure O(n) algorithm, profile hotspots |
| `should document Big-O complexity` | JSDoc | `@complexity Time: O(n), Space: O(n)` |

**Acceptance:** 10/10 tests passing, p95 load time <50ms

---

### Phase 4: Core Implementation (AC1-AC6)

**Files to Create:**

- `packages/core/src/types/config.ts` (interfaces and Zod schemas)
- `packages/core/src/config/defaults.ts` (default config object)
- `packages/core/src/interfaces/i-config-repository.ts` (port interface)
- `packages/adapters/src/repositories/yaml-config-repository.ts` (adapter implementation)

**Tests to Turn Green:** `packages/adapters/tests/integration/config-file-loading.test.ts`

**Requirements:**

- ✅ AC1: Read `.nimatarc` from project root (YAML format)
- ✅ AC2: Support global config `~/.nimata/config.yaml`
- ✅ AC3: Project overrides global (deep merge cascade)
- ✅ AC4: Schema validation with clear errors
- ✅ AC5: Default values for all optional settings
- ✅ AC6: Programmatic load and validation

**Test Mapping:**
| Test | Code Location | Implementation Task |
|------|---------------|---------------------|
| `should load project config from .nimatarc` | `YAMLConfigRepository.loadProjectConfig()` | `Bun.file(join(projectRoot, '.nimatarc')).yaml()` |
| `should load global config` | `YAMLConfigRepository.loadGlobalConfig()` | `Bun.file(join(homedir(), '.nimata', 'config.yaml')).yaml()` |
| `should handle missing .nimatarc gracefully` | Fallback logic | Return defaults when file doesn't exist |
| `should merge project with global config` | `YAMLConfigRepository.load()` | `deepMerge(defaults, global, project)` |
| `should deeply merge nested objects` | Uses `deepMerge()` | Already implemented in Phase 1 |
| `should replace arrays` | Uses `deepMerge()` | Already implemented in Phase 1 |
| `should apply all defaults` | `defaults.ts` | Export complete default config object |
| `should merge defaults with partial config` | Cascade logic | Three-layer merge: defaults → global → project |
| `should not override explicit values` | Merge behavior | `undefined` doesn't override (Phase 1) |
| `should apply correct priority` | Cascade implementation | Project > Global > Defaults |

**Acceptance:** 18/18 tests passing

---

### Phase 5: P1-2 - CLI Integration & Logging

**Files to Modify:**

- `apps/cli/src/container.ts` (DI registration)
- `packages/adapters/src/repositories/yaml-config-repository.ts` (logging)

**Tests to Turn Green:** `apps/cli/tests/e2e/config-loading.e2e.test.ts`

**Requirements:**

- ✅ P1-1: Log config load success at debug level
- ✅ P1-1: Log config validation errors at warn level
- ✅ P1-1: Log config merge operations at debug level
- ✅ P1-1: Mask sensitive config values in logs
- ✅ P1-2: E2E test for project override
- ✅ P1-2: E2E test for clear error messages
- ✅ P1-2: E2E test for qualityLevel respected

**Test Mapping:**
| Test | Code Location | Implementation Task |
|------|---------------|---------------------|
| `should respect qualityLevel from .nimatarc` | CLI command execution | Inject `IConfigRepository`, read config before validation |
| `should override global config` | Config cascade in CLI | DI container provides configured repository |
| `should show clear error with field path` | Error handling | Catch Zod errors, format with field paths |
| `should show clear error for absolute path` | Validation error | Security validation throws, CLI catches and formats |
| `should show clear error for YAML syntax` | YAML parse error | Wrap parse errors with file path and clear message |
| `should use defaults when no config` | Fallback behavior | Repository returns defaults, CLI proceeds normally |
| `should log config load success` | Logging integration | `logger.debug('Config loaded', { source, path })` |
| `should log validation errors` | Error logging | `logger.warn('Config validation failed', { field, error })` |
| `should log merge operations` | Merge logging | `logger.debug('Config merge', { sources, overrides })` |
| `should not log sensitive values` | Log sanitization | Redact paths/values in log statements |

**Acceptance:** 14/14 tests passing

---

## 🔄 Red → Green → Refactor Loop

### Phase 1 Loop (Deep Merge)

1. **RED:** Run `bun test packages/core/tests/unit/deep-merge.test.ts` → 16 failures
2. **GREEN:** Implement `deepMerge()` → 16 passing
3. **REFACTOR:** Optimize for performance, add JSDoc
4. **VERIFY:** Run mutation tests → 80%+ score

### Phase 2 Loop (Security)

1. **RED:** Run `bun test packages/adapters/tests/unit/yaml-security.test.ts` → 15 failures
2. **GREEN:** Add validation logic → 15 passing
3. **REFACTOR:** Extract validators, improve error messages

### Phase 3 Loop (Performance)

1. **RED:** Run `bun test packages/adapters/tests/unit/yaml-config-repository.perf.test.ts` → 10 failures
2. **GREEN:** Add caching → 10 passing
3. **REFACTOR:** Profile and optimize hotspots

### Phase 4 Loop (Core)

1. **RED:** Run `bun test packages/adapters/tests/integration/config-file-loading.test.ts` → 18 failures
2. **GREEN:** Implement YAMLConfigRepository → 18 passing
3. **REFACTOR:** Extract file I/O, improve error handling

### Phase 5 Loop (E2E)

1. **RED:** Run `bun test apps/cli/tests/e2e/config-loading.e2e.test.ts` → 14 failures
2. **GREEN:** Integrate with CLI → 14 passing
3. **REFACTOR:** Improve logging, polish UX

---

## 🧩 Data Factories & Fixtures

### Config Factory

**Location:** `packages/adapters/tests/fixtures/config-factory.ts`

```typescript
/**
 * Factory for generating test configs
 * Follows ATDD data-factories pattern
 */
export function createTestConfig(overrides: Partial<Config> = {}): Config {
  return deepMerge(DEFAULT_TEST_CONFIG, overrides);
}

export function createLargeConfig(keyCount: number): string {
  // Generate YAML with N keys for performance testing
}

export function createMaliciousYaml(type: 'anchor' | 'size' | 'depth'): string {
  // Generate security test payloads
}
```

### Test Helpers

**Location:** `packages/adapters/tests/helpers/temp-config.ts`

```typescript
/**
 * Helper for creating temporary config files
 * Auto-cleanup after test
 */
export async function withTempConfig(
  yaml: string,
  callback: (configPath: string) => Promise<void>
): Promise<void> {
  const tempDir = await mkdtemp(join(tmpdir(), 'nimata-test-'));
  const configPath = join(tempDir, '.nimatarc');
  await writeFile(configPath, yaml);

  try {
    await callback(configPath);
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
}
```

---

## 📊 Progress Tracking

**Update this section as tests turn green:**

### Phase 1: Deep Merge (P0-3)

- [ ] Basic object merging (3 tests)
- [ ] Array handling (2 tests)
- [ ] Null/undefined handling (3 tests)
- [ ] Edge cases (5 tests)
- [ ] Performance (1 test)
- [ ] Documentation (2 tests)
- [ ] **Mutation Score:** \_\_\_% (Target: 80%+)

### Phase 2: Security (P0-1)

- [ ] File size limits (3 tests)
- [ ] Nesting depth limits (2 tests)
- [ ] Malicious payloads (3 tests)
- [ ] Path validation (4 tests)
- [ ] Error clarity (3 tests)

### Phase 3: Performance (P0-2)

- [ ] Config load performance (2 tests)
- [ ] Deep merge performance (2 tests)
- [ ] Cache performance (2 tests)
- [ ] Memory performance (1 test)
- [ ] Documentation (3 tests)
- [ ] **P95 Load Time:** \_\_\_ms (Target: <50ms)

### Phase 4: Core Implementation

- [ ] AC1: Project config loading (3 tests)
- [ ] AC2: Global config support (2 tests)
- [ ] AC3: Config cascade (4 tests)
- [ ] AC5: Defaults (3 tests)
- [ ] Three-level priority (1 test)
- [ ] Error handling (2 tests)
- [ ] **Integration Test Coverage:** \_\_\_% (Target: 100%)

### Phase 5: CLI Integration (P1-2)

- [ ] Config override E2E (2 tests)
- [ ] Error messages E2E (3 tests)
- [ ] Default behavior (2 tests)
- [ ] Performance (1 test)
- [ ] Logging (4 tests)
- [ ] **E2E Coverage:** \_\_\_% (Target: 100%)

---

## ✅ Definition of Done

Story 1.2 is complete when:

- [ ] **All 73 tests passing** (0/73 currently)
- [ ] **Mutation score ≥80%** for deep merge logic
- [ ] **P95 load time <50ms** for 100-key config
- [ ] **100% test coverage** for config logic (unit + integration)
- [ ] **Security tests passing** (YAML limits, path validation)
- [ ] **E2E tests passing** (CLI respects config cascade)
- [ ] **Logging implemented** (debug/warn levels, no sensitive data)
- [ ] **Documentation complete** (JSDoc, complexity, cache strategy)
- [ ] **Code review completed** with focus on security
- [ ] **NFR sign-off** from Murat (Test Architect)

---

## 🐦 Murat's Notes

_Chirp!_ Key implementation principles:

1. **Start with Phase 1** - Deep merge is foundation for everything
2. **One test at a time** - Resist urge to implement multiple features
3. **Security is P0** - Don't skip validation tests
4. **Performance matters** - Profile early, optimize as you go
5. **Logging is debugging** - Future-you will thank present-you
6. **Mutation testing catches gaps** - Don't skip it, embrace it

**Common Pitfalls:**

- ❌ Shallow merge instead of deep merge
- ❌ Mutating input objects (breaks immutability)
- ❌ Forgetting undefined vs null semantics
- ❌ Missing cache invalidation on config changes
- ❌ Logging sensitive config values
- ❌ Weak path traversal validation

**Quality Gates:**

- 🚪 Phase 1 gate: 80%+ mutation score on deep merge
- 🚪 Phase 2 gate: All security tests passing
- 🚪 Phase 3 gate: P95 load time <50ms
- 🚪 Phase 5 gate: E2E tests with real CLI invocation

_Good luck, and may your tests always be green!_ 🟢

---

**Last Updated:** 2025-10-16
**Next Review:** After Phase 1 completion
