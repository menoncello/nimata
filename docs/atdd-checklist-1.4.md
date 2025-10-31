# ATDD Checklist - Epic 1.1, Story 1.4: Directory Structure Generator

**Date:** 2025-10-23
**Author:** Eduardo
**Primary Test Level:** Integration Tests

---

## Story Overview

As a **TypeScript developer setting up a new CLI project**,
I want **Nìmata to generate a complete, opinionated directory structure with all standard directories and essential files**,
so that **I can start coding immediately without manually creating project boilerplate**.

---

## Acceptance Criteria Coverage

### AC1: Standard Directory Structure Creation ✅ TESTED

**Tests Created**:

- `should create standard directories with correct permissions` (E2E)
- `should create nested directory structure recursively` (Unit)
- `should add .gitkeep files to empty directories` (E2E + Unit)

**Implementation Tasks**:

- [ ] **P0-1: Directory Creation Engine**
  - [ ] Create `DirectoryStructureGenerator` service class
  - [ ] Implement `createDirectories()` method with proper permission handling (755)
  - [ ] Add `createNestedDirectories()` for recursive directory creation
  - [ ] Implement `addGitkeepFiles()` for empty directories
  - [ ] Add error handling for permission denied and disk space issues
  - [ ] **Unit Tests**: Run `bunx turbo test --filter=cli tests/unit/directory-structure-generator.test.ts`

### AC2: Entry Point Files Generation ✅ TESTED

**Tests Created**:

- `should generate main entry point file src/index.ts` (E2E)
- `should generate CLI entry point for CLI project type` (E2E + Unit)
- `should generate main src/index.ts with proper exports` (Unit)
- `should generate CLI entry point with shebang` (Unit)

**Implementation Tasks**:

- [ ] **P1-1: Main Entry Point Generator**
  - [ ] Create `EntryPointGenerator` service class
  - [ ] Implement `generateMainEntryPoint()` method
  - [ ] Add template system for basic TypeScript boilerplate
  - [ ] Include proper exports and project metadata
- [ ] **P1-2: CLI Launcher Generation**
  - [ ] Implement `generateCliEntryPoint()` method
  - [ ] Add shebang line (`#!/usr/bin/env bun`) generation
  - [ ] Set executable permissions (755) on bin launcher
  - [ ] Add CLI-specific boilerplate code template

### AC3: Configuration Files Generation ✅ TESTED

**Tests Created**:

- `should generate comprehensive .gitignore file` (E2E + Unit)
- `should generate package.json with project metadata` (E2E + Unit)
- `should generate TypeScript configuration` (E2E + Unit)

**Implementation Tasks**:

- [ ] **P2-1: Configuration File Generator**
  - [ ] Create `ConfigFileGenerator` service class
  - [ ] Implement `generateGitignore()` with comprehensive exclusions
  - [ ] Add `generatePackageJson()` with project metadata and dependencies
  - [ ] Implement `generateTsConfig()` with strict TypeScript settings
  - [ ] Add `generateEslintConfig()` based on quality level settings

### AC4: Documentation Files Generation ✅ TESTED

**Tests Created**:

- `should create README.md with project information` (E2E)
- `should create CLAUDE.md with AI context` (E2E)

**Implementation Tasks**:

- [ ] **P2-2: Documentation Generator**
  - [ ] Create `DocumentationGenerator` service class
  - [ ] Implement `generateReadme()` with project-specific information
  - [ ] Add `generateClaudeMd()` with AI context for project
  - [ ] Include basic usage examples and setup instructions
  - [ ] Add development setup and contribution guidelines

### AC5: Quality and Testing Structure ✅ TESTED

**Tests Created**:

- `should create test directory structure matching source code` (E2E)
- `should generate basic test files with examples` (E2E)
- `should adapt test structure based on quality level` (Integration)

**Implementation Tasks**:

- [ ] **P3-1: Test Structure Generator**
  - [ ] Create `TestStructureGenerator` service class
  - [ ] Implement `generateTestDirectories()` method
  - [ ] Add `generateBasicTestFiles()` with example tests
  - [ ] Create `generateTestConfigFiles()` for testing setup
- [ ] **P3-2: Quality Configuration**
  - [ ] Integrate with quality level system from Story 1.2
  - [ ] Add quality-specific test structure variations
  - [ ] Generate coverage configuration files
  - [ ] Create quality validation scripts

### AC6: Project-Specific Structure ✅ TESTED

**Tests Created**:

- `should adapt structure for different project types` (E2E)
- `should generate appropriate configuration files for project type` (E2E)
- `should maintain compatibility with existing project types` (Integration)

**Implementation Tasks**:

- [ ] **P4-1: Template Integration**
  - [ ] Integrate directory generation with existing template system (Story 1.3)
  - [ ] Add project type detection and adaptation logic
  - [ ] Implement conditional directory creation based on project type
  - [ ] Ensure compatibility with all 4 project types (basic, web, cli, library)
- [ ] **P4-2: Validation and Error Handling**
  - [ ] Add directory structure validation
  - [ ] Implement comprehensive error handling
  - [ ] Add rollback functionality for failed generation
  - [ ] Provide actionable error messages

---

## Test Files Created

### E2E Tests (1 file)

- `tests/e2e/directory-structure-generator.e2e.test.ts` - 18 test cases covering all acceptance criteria

### Unit Tests (1 file)

- `tests/unit/directory-structure-generator.test.ts` - 25 test cases for individual services

### Integration Tests (1 file)

- `tests/integration/directory-structure-project-generation.integration.test.ts` - 15 test cases for Story 1.3 integration

### Support Infrastructure

- `tests/factories/project-config.factory.ts` - 15 factory functions for test data
- `tests/fixtures/directory-generator.fixture.ts` - 5 specialized test fixtures

**Total Test Cases**: 58 tests across all levels

---

## Required data-testid Attributes

No UI elements requiring data-testid (CLI-based functionality)

---

## Mock Requirements for DEV Team

### File System Mock Requirements

- **Directory Creation**: Mock `fs.mkdir` for permission testing
- **File Writing**: Mock `fs.writeFile` for content generation testing
- **Permission Handling**: Mock `fs.chmod` for executable permission testing

### CLI Command Mock Requirements

- **CLI Execution**: Mock `Bun.spawn` for command testing in isolation
- **Argument Parsing**: Mock CLI argument validation scenarios

---

## Implementation Commands

### Running Tests

```bash
# Run all failing tests (RED phase verification)
bunx turbo test --filter=cli

# Run specific test files
bunx turbo test --filter=cli tests/e2e/directory-structure-generator.e2e.test.ts
bunx turbo test --filter=cli tests/unit/directory-structure-generator.test.ts
bunx turbo test --filter=cli tests/integration/directory-structure-project-generation.integration.test.ts

# Run with coverage
bunx turbo test:coverage --filter=cli

# Run with mutation testing (after implementation)
bunx turbo test:mutation --filter=cli
```

### Development Workflow

```bash
# Install dependencies
bun install

# Start development mode
bunx turbo dev

# Run linting (ESLint compliance required)
bunx turbo lint

# Type checking (TypeScript 0 errors required)
bunx turbo typecheck
```

---

## Red-Green-Refactor Workflow

### RED Phase ✅ COMPLETE

- [x] All acceptance criteria analyzed and mapped to tests
- [x] Tests written in Given-When-Then format
- [x] Tests failing due to missing implementation (verified)
- [x] Data factories created with faker for parallel-safe testing
- [x] Fixtures created with auto-cleanup
- [x] Mock requirements documented
- [x] Implementation checklist created with clear tasks
- [x] Execution commands provided

### GREEN Phase (DEV TEAM RESPONSIBILITY)

1. Pick one failing test from the checklist above
2. Implement minimal code to make it pass
3. Run test to verify green: `bunx turbo test --filter=cli [test-file]`
4. Move to next test
5. Repeat until all tests pass

**Critical Path Implementation Order**:

1. **P0-1**: Directory Creation Engine (Core functionality)
2. **P1-1**: Main Entry Point Generator (Basic functionality)
3. **P2-1**: Configuration File Generator (Essential files)
4. **P4-1**: Template Integration (Story 1.3 compatibility)
5. Remaining P1, P2, P3 tasks (Feature completeness)

### REFACTOR Phase (DEV TEAM RESPONSIBILITY)

1. All tests passing (green)
2. Improve code quality with confidence from test safety net
3. Extract duplications and optimize performance
4. Ensure mutation testing score >80%

---

## Quality Gates Compliance

### ESLint Requirements

- **CRITICAL**: No ESLint rules disabled via inline comments
- All generated code must pass `bunx turbo lint` with 0 errors
- Use proper TypeScript types (no `any` allowed)

### TypeScript Requirements

- Strict TypeScript compilation required
- All generated files must compile with `bunx turbo typecheck` (0 errors)
- Proper type definitions for all public APIs

### Testing Requirements

- All tests must pass before code submission
- Mutation testing score must exceed 80% threshold
- Test coverage must be comprehensive for new code

---

## Integration Points

### Story 1.3 Integration (Project Generation System)

- Directory generation must integrate seamlessly with existing template engine
- Must maintain backward compatibility with existing CLI workflows
- Should extend project generation without breaking existing functionality

### Story 1.2 Integration (Quality System)

- Must respect quality level configurations (basic, standard, high)
- Should generate quality-specific directory structures
- Needs to integrate with existing quality validation system

### BMAD Framework Integration

- Must follow existing service architecture patterns
- Should use established error handling strategies
- Needs to integrate with existing CLI command structure

---

## Success Metrics

### Performance Targets

- **Structure Generation**: <5 seconds for complete directory structure
- **Template Compatibility**: 100% compatibility with existing template system
- **Permission Handling**: All files and directories with correct permissions

### Quality Targets

- **Project Types**: Support for all 4 project types (basic, web, cli, library)
- **Quality Compliance**: Generated projects pass all quality gates immediately
- **Test Coverage**: >90% coverage for new implementation code

---

## Technical Notes

### Architecture Patterns

- Follow pure function → fixture pattern from test architecture knowledge base
- Use factory pattern for test data generation with faker
- Implement composable services rather than monolithic classes

### Error Handling Strategy

- Provide actionable error messages for common failure scenarios
- Implement rollback functionality for partial generation failures
- Use comprehensive error logging for debugging

### File System Considerations

- Handle cross-platform path differences properly
- Respect file system permissions and security constraints
- Implement atomic operations where possible to prevent corruption

---

## Dependencies

### Required Stories

- **Story 1.3** (Project Generation System) - Must be complete for integration
- **Story 1.2** (Quality System) - Quality configuration integration

### Technical Dependencies

- Existing template engine (from Story 1.3)
- Quality configuration system (from Story 1.2)
- CLI framework integration points
- Bun runtime for file system operations

---

## Next Steps for DEV Team

1. **Verify RED Phase**: Run `bunx turbo test --filter=cli` to confirm all tests fail
2. **Review Implementation Checklist**: Start with P0-1 (Directory Creation Engine)
3. **Implement One Test at a Time**: Follow Red-Green-Refactor cycle
4. **Quality Gates**: Ensure ESLint, TypeScript, and test compliance after each implementation
5. **Integration Testing**: Verify Story 1.3 compatibility after P4-1 implementation
6. **Final Validation**: Run complete test suite and ensure >80% mutation score

**Contact**: Test Architect (TEA Agent) for any questions about test requirements or quality standards.
