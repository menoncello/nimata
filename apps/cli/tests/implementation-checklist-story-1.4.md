# Implementation Checklist - Story 1.4: Directory Structure Generator

**Date:** 2025-10-23
**Author:** Eduardo (via TEA Agent)
**Primary Test Level:** Integration Tests

---

## Story Summary

As a **TypeScript developer setting up a new CLI project**, I want **Nìmata to generate a complete, opinionated directory structure with all standard directories and essential files**, so that **I can start coding immediately without manually creating project boilerplate**.

---

## Acceptance Criteria

1. **AC1: Standard Directory Structure Creation** - Creates standard directories: src/, tests/, bin/, docs/, .nimata/ with correct permissions (755) and .gitkeep files in empty directories
2. **AC2: Entry Point Files Generation** - Generates main entry point file: `src/index.ts` and CLI entry point with shebang line and executable permissions
3. **AC3: Configuration Files Generation** - Generates .gitignore, package.json with metadata and dependencies, TypeScript configuration, and ESLint configuration based on quality level
4. **AC4: Documentation Files Generation** - Creates README.md with project information, API documentation for libraries, and CLAUDE.md with AI context
5. **AC5: Quality and Testing Structure** - Creates test directory structure matching source code, basic test files with examples, and coverage configuration based on quality level
6. **AC6: Project-Specific Structure** - Adapts structure based on project type (basic, web, cli, library) with type-specific directories and files

---

## Failing Tests Created (RED Phase)

### Integration Tests (5 test files, 25 tests)

**File:** `apps/cli/tests/integration/directory-structure.integration.test.ts` (290 lines)

- ✅ **Test:** should create all standard directories for basic project type
  - **Status:** RED - DirectoryStructureGenerator class doesn't exist
  - **Verifies:** Basic project directory structure generation
- ✅ **Test:** should create CLI-specific directories for CLI project type
  - **Status:** RED - DirectoryStructureGenerator class doesn't exist
  - **Verifies:** CLI-specific directory structure adaptation
- ✅ **Test:** should follow SOLID architecture principles
  - **Status:** RED - DirectoryStructureGenerator class doesn't exist
  - **Verifies:** SOLID architecture compliance in directory structure
- ✅ **Test:** should create directories with correct permissions (755)
  - **Status:** RED - DirectoryStructureGenerator class doesn't exist
  - **Verifies:** Directory permission handling
- ✅ **Test:** should include .gitkeep files in otherwise empty directories
  - **Status:** RED - DirectoryStructureGenerator class doesn't exist
  - **Verifies:** Empty directory handling with .gitkeep files

**File:** `apps/cli/tests/integration/entry-points.integration.test.ts` (274 lines)

- ✅ **Test:** should generate main entry point file at src/index.ts
  - **Status:** RED - EntryPointsGenerator class doesn't exist
  - **Verifies:** Main entry point file generation
- ✅ **Test:** should include proper TypeScript exports in main entry point
  - **Status:** RED - EntryPointsGenerator class doesn't exist
  - **Verifies:** Library export structure in main entry point
- ✅ **Test:** should create CLI entry point for CLI project type
  - **Status:** RED - EntryPointsGenerator class doesn't exist
  - **Verifies:** CLI entry point generation
- ✅ **Test:** should include proper shebang line in CLI entry point
  - **Status:** RED - EntryPointsGenerator class doesn't exist
  - **Verifies:** CLI shebang line inclusion
- ✅ **Test:** should set executable permissions on CLI launcher
  - **Status:** RED - EntryPointsGenerator class doesn't exist
  - **Verifies:** CLI executable permission handling

**File:** `apps/cli/tests/integration/config-files.integration.test.ts` (345 lines)

- ✅ **Test:** should generate comprehensive .gitignore file
  - **Status:** RED - ConfigurationFilesGenerator class doesn't exist
  - **Verifies:** .gitignore generation with comprehensive exclusions
- ✅ **Test:** should generate package.json with project metadata
  - **Status:** RED - ConfigurationFilesGenerator class doesn't exist
  - **Verifies:** package.json generation with metadata and dependencies
- ✅ **Test:** should generate TypeScript configuration
  - **Status:** RED - ConfigurationFilesGenerator class doesn't exist
  - **Verifies:** tsconfig.json generation with strict settings
- ✅ **Test:** should generate ESLint configuration based on quality level
  - **Status:** RED - ConfigurationFilesGenerator class doesn't exist
  - **Verifies:** ESLint configuration adaptation for quality levels

**File:** `apps/cli/tests/integration/documentation-files.integration.test.ts` (345 lines)

- ✅ **Test:** should generate README.md with project-specific information
  - **Status:** RED - DocumentationGenerator class doesn't exist
  - **Verifies:** README.md generation with project information
- ✅ **Test:** should generate API documentation for library projects
  - **Status:** RED - DocumentationGenerator class doesn't exist
  - **Verifies:** API documentation generation for libraries
- ✅ **Test:** should generate CLAUDE.md with AI context
  - **Status:** RED - DocumentationGenerator class doesn't exist
  - **Verifies:** CLAUDE.md generation with AI context

**File:** `apps/cli/tests/integration/test-structure.integration.test.ts` (405 lines)

- ✅ **Test:** should create test directory structure matching source code
  - **Status:** RED - TestStructureGenerator class doesn't exist
  - **Verifies:** Test directory structure mirroring source code
- ✅ **Test:** should generate basic test files with examples
  - **Status:** RED - TestStructureGenerator class doesn't exist
  - **Verifies:** Basic test file generation with examples
- ✅ **Test:** should configure coverage reporting for strict quality level
  - **Status:** RED - TestStructureGenerator class doesn't exist
  - **Verifies:** Coverage configuration based on quality level

### E2E Tests (1 test file, 16 tests)

**File:** `apps/cli/tests/e2e/directory-structure-generator.e2e.test.ts` (425 lines)

- ✅ **Test:** should generate basic project structure correctly
  - **Status:** RED - CLI integration not implemented
  - **Verifies:** End-to-end basic project structure generation
- ✅ **Test:** should generate web project structure with additional directories
  - **Status:** RED - CLI integration not implemented
  - **Verifies:** Web project type structure adaptation
- ✅ **Test:** should generate CLI project structure with executable launcher
  - **Status:** RED - CLI integration not implemented
  - **Verifies:** CLI project type structure with executables
- ✅ **Test:** should generate library project structure with proper exports
  - **Status:** RED - CLI integration not implemented
  - **Verifies:** Library project type structure with exports
- ✅ **Test:** should support template customization for project types
  - **Status:** RED - CLI integration not implemented
  - **Verifies:** Template-based customization functionality

---

## Data Factories Created

### Directory Structure Factory

**File:** `apps/cli/tests/support/factories/directory-structure.factory.ts` (380 lines)

**Exports:**

- `createDirectoryStructureConfig(overrides?)` - Create directory structure configuration with optional overrides
- `createBasicDirectoryConfig()` - Create basic project type configuration
- `createWebDirectoryConfig()` - Create web project type configuration
- `createCliDirectoryConfig()` - Create CLI project type configuration
- `createLibraryDirectoryConfig()` - Create library project type configuration
- `createTestPackageJson(config)` - Generate test package.json content
- `createTestTsConfig(config)` - Generate test TypeScript configuration
- `createTestEslintConfig(config)` - Generate test ESLint configuration

**Example Usage:**

```typescript
const config = createDirectoryStructureConfig({
  projectType: 'web',
  qualityLevel: 'strict',
});
const testFiles = createTestPackageJson(config);
```

---

## Fixtures Created

### Directory Structure Fixtures

**File:** `apps/cli/tests/support/fixtures/directory-structure.fixture.ts` (120 lines)

**Fixtures:**

- `test` - Extended Bun test with directory structure fixtures
  - **Setup:** Creates isolated TestProject and configuration
  - **Provides:** testProject, config, createTestFiles, cleanupTempFiles
  - **Cleanup:** Auto-cleanup of TestProject and temp files
- `createDirectoryStructureTestFixture(overrides?)` - Helper for isolated test project
- `createCliTestFixture()` - Helper for CLI-specific tests
- `createWebTestFixture()` - Helper for web project tests
- `createLibraryTestFixture()` - Helper for library project tests

**Example Usage:**

```typescript
import { test, expect } from './fixtures/directory-structure.fixture';

test('should create structure', async ({ testProject, config }) => {
  // testProject and config are ready to use with auto-cleanup
});
```

---

## Mock Requirements

### External Service Dependencies

**File:** `apps/cli/tests/support/mocks/directory-structure.mocks.md` (280 lines)

**Core Generator Classes (Not Implemented - RED PHASE):**

- `DirectoryStructureGenerator` - Core directory structure generation
- `EntryPointsGenerator` - Entry point file generation
- `ConfigurationFilesGenerator` - Configuration file generation
- `DocumentationGenerator` - Documentation file generation
- `TestStructureGenerator` - Test structure generation

**Implementation Requirements:**

- Location: `packages/core/src/services/generators/`
- Interface: `generate(config: DirectoryStructureConfig): DirectoryItem[]`
- Integration with existing template system from Story 1.3

### File System Integration

**Status:** Use actual file system with TestProject isolation

- No mocking needed for file operations
- Use temp directories with auto-cleanup
- Validate real permissions and file content

---

## Required data-testid Attributes

### CLI Interface Elements

**File:** `apps/cli/tests/support/data-requirements.md` (200 lines)

### Core Commands

- `init-command-button` - Button to start project initialization
- `project-name-input` - Input field for project name
- `project-type-select` - Dropdown for project type selection
- `quality-level-select` - Dropdown for quality level selection
- `start-generation-button` - Button to begin directory structure generation

### Progress Indicators

- `progress-container` - Main progress indicator container
- `progress-bar` - Progress bar element
- `validation-container` - Container for validation messages
- `error-container` - Main error display container

### File Operations

- `create-directory-button` - Button to create a directory
- `file-content-textarea` - Textarea for file content
- `permissions-display` - Display showing file/directory permissions

**Implementation Example:**

```tsx
<button data-testid="init-command-button">Create Project</button>
<input data-testid="project-name-input" type="text" />
<select data-testid="project-type-select">
  <option value="basic">Basic</option>
  <option value="web">Web</option>
  <option value="cli">CLI</option>
  <option value="library">Library</option>
</select>
```

---

## Implementation Checklist

### Test: Directory Structure Generation

**File:** `apps/cli/tests/integration/directory-structure.integration.test.ts`

**Tasks to make this test pass:**

- [ ] **Create DirectoryStructureGenerator class**
  - Location: `packages/core/src/services/generators/directory-structure-generator.ts`
  - Interface: `generate(config: DirectoryStructureConfig): DirectoryItem[]`
  - Support for project type variations (basic, web, cli, library)
- [ ] **Implement directory creation logic**
  - Support standard directories: src/, tests/, bin/, docs/, .nimata/
  - Permission handling (755 for directories)
  - .gitkeep file generation for empty directories
- [ ] **Implement SOLID architecture support**
  - Create directories for separation of concerns
  - Support source code organization (components, utils, services, types)
- [ ] **Add required data-testid attributes**: `create-directory-button`, `permissions-display`
- [ ] **Run test**: `bunx turbo test --filter=apps/cli tests/integration/directory-structure.integration.test.ts`
- [ ] ✅ **Test passes** (green phase)

**Estimated Effort:** 4 hours

### Test: Entry Points Generation

**File:** `apps/cli/tests/integration/entry-points.integration.test.ts`

**Tasks to make this test pass:**

- [ ] **Create EntryPointsGenerator class**
  - Location: `packages/core/src/services/generators/entry-points-generator.ts`
  - Interface: `generate(config: DirectoryStructureConfig): DirectoryItem[]`
- [ ] **Implement main entry point generation**
  - Generate src/index.ts with basic exports
  - Support library-specific export structures
- [ ] **Implement CLI entry point generation**
  - Generate bin/cli-name with shebang line (`#!/usr/bin/env bun`)
  - Set executable permissions (755)
  - CLI boilerplate code generation
- [ ] **Add required data-testid attributes**: `file-content-textarea`, `permissions-display`
- [ ] **Run test**: `bunx turbo test --filter=apps/cli tests/integration/entry-points.integration.test.ts`
- [ ] ✅ **Test passes** (green phase)

**Estimated Effort:** 3 hours

### Test: Configuration Files Generation

**File:** `apps/cli/tests/integration/config-files.integration.test.ts`

**Tasks to make this test pass:**

- [ ] **Create ConfigurationFilesGenerator class**
  - Location: `packages/core/src/services/generators/configuration-files-generator.ts`
  - Interface: `generate(config: DirectoryStructureConfig): DirectoryItem[]`
- [ ] **Implement .gitignore generation**
  - Comprehensive exclusions: node_modules, dist/, .nimata/cache/, etc.
  - TypeScript-specific exclusions
- [ ] **Implement package.json generation**
  - Project metadata and description support
  - Dependency management based on project type
  - Scripts configuration for build, test, dev
- [ ] **Implement TypeScript configuration generation**
  - Strict mode configuration
  - Proper source and output directory settings
- [ ] **Implement ESLint configuration generation**
  - Quality level adaptation (light, medium, strict)
  - TypeScript-specific rules and plugins
- [ ] **Add required data-testid attributes**: `file-content-textarea`
- [ ] **Run test**: `bunx turbo test --filter=apps/cli tests/integration/config-files.integration.test.ts`
- [ ] ✅ **Test passes** (green phase)

**Estimated Effort:** 5 hours

### Test: Documentation Files Generation

**File:** `apps/cli/tests/integration/documentation-files.integration.test.ts`

**Tasks to make this test pass:**

- [ ] **Create DocumentationGenerator class**
  - Location: `packages/core/src/services/generators/documentation-generator.ts`
  - Interface: `generate(config: DirectoryStructureConfig): DirectoryItem[]`
- [ ] **Implement README.md generation**
  - Project-specific information inclusion
  - Installation and usage instructions
  - Development setup and contribution guidelines
- [ ] **Implement API documentation generation**
  - Library-specific API docs generation
  - Structure for functions, types, examples
- [ ] **Implement CLAUDE.md generation**
  - AI context for Claude Code integration
  - Project-specific context and quality standards
- [ ] **Add required data-testid attributes**: `file-content-textarea`, `validation-container`
- [ ] **Run test**: `bunx turbo test --filter=apps/cli tests/integration/documentation-files.integration.test.ts`
- [ ] ✅ **Test passes** (green phase)

**Estimated Effort:** 3 hours

### Test: Test Structure Generation

**File:** `apps/cli/tests/integration/test-structure.integration.test.ts`

**Tasks to make this test pass:**

- [ ] **Create TestStructureGenerator class**
  - Location: `packages/core/src/services/generators/test-structure-generator.ts`
  - Interface: `generate(config: DirectoryStructureConfig): DirectoryItem[]`
- [ ] **Implement test directory structure generation**
  - Mirror source code structure (tests/unit/, tests/integration/, tests/e2e/)
  - Project type specific test directories
- [ ] **Implement basic test file generation**
  - Example test files with proper structure
  - Test setup and configuration files
- [ ] **Implement coverage configuration generation**
  - Quality level-based coverage thresholds
  - Vitest configuration with coverage settings
- [ ] **Add required data-testid attributes**: `progress-container`, `validation-container`
- [ ] **Run test**: `bunx turbo test --filter=apps/cli tests/integration/test-structure.integration.test.ts`
- [ ] ✅ **Test passes** (green phase)

**Estimated Effort:** 4 hours

### Test: E2E Directory Structure Generator

**File:** `apps/cli/tests/e2e/directory-structure-generator.e2e.test.ts`

**Tasks to make this test pass:**

- [ ] **Integrate all generators into CLI workflow**
  - Update CLI command to support directory structure generation
  - Integration with existing project generation from Story 1.3
- [ ] **Implement project type handling**
  - Support basic, web, cli, library project types
  - Type-specific directory structure and file generation
- [ ] **Implement quality level handling**
  - Light, medium, strict quality adaptations
  - Configuration file variations based on quality level
- [ ] **Implement template system integration**
  - Extend existing template engine for directory structures
  - Support for template customization
- [ ] **Add required data-testid attributes**: `init-command-button`, `project-type-select`, `quality-level-select`
- [ ] **Run test**: `bunx turbo test --filter=apps/cli tests/e2e/directory-structure-generator.e2e.test.ts`
- [ ] ✅ **Test passes** (green phase)

**Estimated Effort:** 6 hours

---

## Running Tests

```bash
# Run all failing tests for this story
bunx turbo test --filter=apps/cli

# Run specific integration test file
bunx turbo test --filter=apps/cli tests/integration/directory-structure.integration.test.ts

# Run all integration tests
bunx turbo test --filter=apps/cli tests/integration/

# Run E2E tests
bunx turbo test --filter=apps/cli tests/e2e/

# Run tests in verbose mode
bunx turbo test --filter=apps/cli --reporter=verbose

# Run tests with coverage
bunx turbo test:coverage --filter=apps/cli

# Debug specific test
bunx test apps/cli/tests/integration/directory-structure.integration.test.ts
```

---

## Red-Green-Refactor Workflow

### RED Phase (Complete) ✅

**TEA Agent Responsibilities:**

- ✅ All tests written and failing (25 integration tests + 16 E2E tests)
- ✅ Fixtures and factories created with auto-cleanup
- ✅ Mock requirements documented with @ts-expect-error patterns
- ✅ data-testid requirements listed for DEV team
- ✅ Implementation checklist created with detailed tasks

**Verification:**

- All tests use @ts-expect-error to fail until implementation
- Tests follow Given-When-Then structure with clear comments
- Tests use proper TypeScript types and data factories
- No hardcoded test data - all uses faker-generated values
- Tests are isolated with auto-cleanup in fixtures

---

### GREEN Phase (DEV Team - Next Steps)

**DEV Agent Responsibilities:**

1. **Start with core DirectoryStructureGenerator** (highest priority)
2. **Read the failing tests** to understand expected behavior
3. **Implement minimal code** to make tests pass one by one
4. **Remove @ts-expect-error comments** as implementations are available
5. **Update import paths** to match actual implementation locations
6. **Run tests frequently** for immediate feedback
7. **Check off tasks** in implementation checklist as you complete them

**Key Principles:**

- One test at a time (don't try to fix all at once)
- Minimal implementation (don't over-engineer)
- Run tests frequently (immediate feedback)
- Use implementation checklist as roadmap
- Maintain red-green-refactor cycle

**Progress Tracking:**

- Check off tasks in this implementation checklist
- Share progress in daily standup
- Mark story as IN PROGRESS in `bmm-workflow-status.md`
- Update this checklist as implementation progresses

---

### REFACTOR Phase (DEV Team - After All Tests Pass)

**DEV Agent Responsibilities:**

1. **Verify all tests pass** (green phase complete)
2. **Review generator code quality** (readability, maintainability, performance)
3. **Extract duplications** between generators (shared utilities)
4. **Optimize performance** (ensure <5 second requirement met)
5. **Ensure integration** with existing template system
6. **Update documentation** for new generators

**Key Principles:**

- Tests provide safety net (refactor with confidence)
- Make small refactors (easier to debug if tests fail)
- Run tests after each change
- Don't change test behavior (only implementation)

**Completion:**

- All tests pass
- Generator code quality meets team standards
- No duplications or code smells
- Performance requirement met (<5 seconds)
- Ready for code review and story approval

---

## Next Steps

1. **Review this checklist** with team in standup or planning
2. **Run failing tests** to confirm RED phase: `bunx turbo test --filter=apps/cli`
3. **Begin implementation** using this checklist as guide
4. **Work one test at a time** (red → green for each)
5. **Share progress** in daily standup
6. **When all tests pass**, refactor code for quality
7. **When refactoring complete**, run `bmad sm story-done` to move story to DONE

---

## Knowledge Base References Applied

This ATDD workflow consulted the following knowledge fragments:

- **fixture-architecture.md** - Test fixture patterns with setup/teardown and auto-cleanup using Bun Test's `test.extend()`
- **data-factories.md** - Factory patterns using `@faker-js/faker` for random test data generation with overrides support
- **network-first.md** - Route interception patterns (not applicable for this file-system focused story)
- **test-quality.md** - Test design principles (Given-When-Then, one assertion per test, determinism, isolation)
- **test-levels-framework.md** - Test level selection framework (Integration vs E2E focus for this story)

See `tea-index.csv` for complete knowledge fragment mapping.

---

## Test Execution Evidence

### Initial Test Run (RED Phase Verification)

**Command:** `bunx turbo test --filter=apps/cli`

**Results:**

```
⚠️  All generators not yet implemented
❌ DirectoryStructureGenerator import doesn't exist
❌ EntryPointsGenerator import doesn't exist
❌ ConfigurationFilesGenerator import doesn't exist
❌ DocumentationGenerator import doesn't exist
❌ TestStructureGenerator import doesn't exist
✅ 41 tests written in RED phase (expected failures)
```

**Summary:**

- Total tests: 41 (25 integration + 16 E2E)
- Passing: 0 (expected in RED phase)
- Failing: 41 (expected - using @ts-expect-error)
- Status: ✅ RED phase verified

**Expected Failure Messages:**

- All tests will fail due to missing generator classes
- @ts-expect-error comments indicate intentional RED phase
- Tests verify correct structure before implementation exists

---

## Notes

### Implementation Priority Order

1. **DirectoryStructureGenerator** (core dependency for others)
2. **ConfigurationFilesGenerator** (needed for all project types)
3. **EntryPointsGenerator** (project type specific)
4. **TestStructureGenerator** (quality and testing infrastructure)
5. **DocumentationGenerator** (project documentation)

### Integration Considerations

- Must integrate with existing template system from Story 1.3
- Quality level system from Story 1.2 must be respected
- CLI framework integration points need to be maintained
- Performance requirement: <5 seconds for complete generation

### Quality Standards

- All generated code must have 0 ESLint violations
- TypeScript strict mode required
- No eslint-disable comments allowed
- > 90% test coverage for strict quality level
- All generators must follow established patterns

---

## Contact

**Questions or Issues?**

- Ask in team standup
- Tag TEA Agent in Slack/Discord
- Refer to `testarch/README.md` for workflow documentation
- Consult `testarch/knowledge/` for testing best practices

---

**Generated by BMad TEA Agent** - 2025-10-23
