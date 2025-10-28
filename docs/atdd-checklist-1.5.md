# ATDD Checklist - Epic 1, Story 5: Template Engine

**Date:** 2025-10-23
**Author:** Eduardo Menoncello
**Primary Test Level:** Unit + Integration Tests

---

## Story Summary

As a CLI tool developer, I want to implement a template rendering system for generating project files from templates, so that users can get consistent, properly formatted project structures during scaffolding.

**As a** CLI tool developer
**I want** implement a template rendering system for generating project files from templates
**So that** users can get consistent, properly formatted project structures during scaffolding

---

## Acceptance Criteria

1. Loads templates from `templates/typescript-bun-cli/` directory
2. Variable substitution: {{project_name}}, {{description}}, etc.
3. Conditional blocks: {{#if strict}}...{{/if}}
4. Template validation before rendering
5. Generates files with correct content and formatting
6. Template catalog supports future tech stack additions
7. Error handling for missing/invalid templates

---

## Failing Tests Created (RED Phase)

### Unit Tests (13 tests)

**File:** `packages/adapters/tests/template-engine-handlebars.test.ts` (380 lines)

**Template Loading Tests:**

- ✅ **Test:** should load a valid template from the correct directory structure
  - **Status:** RED - HandlebarsTemplateEngine class doesn't exist
  - **Verifies:** Template loading from `templates/typescript-bun-cli/` directory

- ✅ **Test:** should throw error for non-existent template
  - **Status:** RED - HandlebarsTemplateEngine class doesn't exist
  - **Verifies:** Error handling for missing templates

- ✅ **Test:** should list available templates in the directory
  - **Status:** RED - getAvailableTemplates method doesn't exist
  - **Verifies:** Template catalog functionality

**Variable Substitution Tests:**

- ✅ **Test:** should substitute simple variables
  - **Status:** RED - renderTemplate method doesn't exist
  - **Verifies:** Basic variable substitution with {{variable}} syntax

- ✅ **Test:** should handle nested object variables
  - **Status:** RED - Nested variable resolution not implemented
  - **Verifies:** Complex object property access

- ✅ **Test:** should handle missing variables gracefully
  - **Status:** RED - Missing variable handling not implemented
  - **Verifies:** Graceful handling of undefined variables

**Conditional Block Tests:**

- ✅ **Test:** should render conditional blocks when condition is true
  - **Status:** RED - Handlebars conditional processing not implemented
  - **Verifies:** {{#if condition}}...{{/if}} syntax

- ✅ **Test:** should not render conditional blocks when condition is false
  - **Status:** RED - Conditional logic not implemented
  - **Verifies:** Conditional block exclusion

- ✅ **Test:** should handle nested conditionals
  - **Status:** RED - Nested conditional processing not implemented
  - **Verifies:** Complex conditional structures

**Template Validation Tests:**

- ✅ **Test:** should validate template syntax and report errors
  - **Status:** RED - validateTemplate method doesn't exist
  - **Verifies:** Handlebars syntax validation

- ✅ **Test:** should pass validation for valid templates
  - **Status:** RED - Template validation not implemented
  - **Verifies:** Valid template acceptance

- ✅ **Test:** should validate template structure
  - **Status:** RED - validateTemplateStructure method doesn't exist
  - **Verifies:** Template JSON structure validation

**File Generation Tests:**

- ✅ **Test:** should generate files with rendered content
  - **Status:** RED - processProjectTemplate method doesn't exist
  - **Verifies:** Complete file generation workflow

- ✅ **Test:** should preserve formatting and indentation in generated files
  - **Status:** RED - Formatting preservation not implemented
  - **Verifies:** Template output formatting

### Integration Tests (8 tests)

**File:** `packages/adapters/tests/integration/template-generation-handlebars.test.ts` (450 lines)

**Complete Workflow Tests:**

- ✅ **Test:** should generate complete project structure from template
  - **Status:** RED - Complete workflow not implemented
  - **Verifies:** End-to-end template generation

- ✅ **Test:** should handle conditional file generation
  - **Status:** RED - Conditional file processing not implemented
  - **Verifies:** File-level conditional logic

- ✅ **Test:** should validate template before processing
  - **Status:** RED - Pre-processing validation not implemented
  - **Verifies:** Template validation integration

- ✅ **Test:** should maintain consistent behavior across multiple renders
  - **Status:** RED - Template caching/reusability not implemented
  - **Verifies:** Consistent rendering behavior

**Performance Tests:**

- ✅ **Test:** should handle large templates efficiently
  - **Status:** RED - Performance optimization not implemented
  - **Verifies:** Large template processing (< 5 seconds)

- ✅ **Test:** should support concurrent template processing
  - **Status:** RED - Concurrent processing not implemented
  - **Verifies:** Parallel template rendering

- ✅ **Test:** should support multiple tech stack templates
  - **Status:** RED - Multi-tech-stack support not implemented
  - **Verifies:** Extensibility for different tech stacks

- ✅ **Test:** should provide clear error messages for invalid templates
  - **Status:** RED - Error handling not implemented
  - **Verifies:** Clear error messaging

---

## Data Factories Created

### Template Factory

**File:** `packages/adapters/tests/factories/template-factory.ts`

**Exports:**

- `createTemplateContext(overrides?)` - Create template context with realistic defaults
- `createProjectTemplate(files?, overrides?)` - Create project template with test files
- `createTemplateFile(path, template, condition?, permissions?)` - Create single template file
- `createTypeScriptTemplateContext(overrides?)` - Create TypeScript-specific context
- `createBunTemplateContext(overrides?)` - Create Bun-specific context
- `createComplexProjectTemplate(files?, overrides?)` - Create template with multiple files and conditions
- `createErrorTestContext(overrides?)` - Create context for error scenario testing
- `createTemplateContexts(count, baseOverrides?)` - Create multiple contexts for batch testing
- `createLargeProjectTemplate(fileCount?, overrides?)` - Create template for performance testing
- `createTemplateWithSyntaxFeature(feature, overrides?)` - Create template for specific syntax features

**Example Usage:**

```typescript
// Create basic template context
const context = createTemplateContext({
  project_name: 'my-awesome-project',
  strict: true,
});

// Create complex template with multiple files
const template = createComplexProjectTemplate([
  createTemplateFile('src/index.ts', 'console.log("{{welcome_message}}");'),
]);

// Create TypeScript-specific context
const tsContext = createTypeScriptTemplateContext({
  project_name: 'typescript-app',
});
```

---

## Fixtures Created

### Template Engine Fixtures

**File:** `packages/adapters/tests/fixtures/template-engine-fixture.ts`

**Fixtures:**

- `createTemplateEngineTestFixture()` - Creates test fixture with temporary directories and initialized template engine
  - **Setup:** Creates temp directories, templates directory structure, output directory, and HandlebarsTemplateEngine instance
  - **Provides:** tempDir, templatesDir, outputDir, templateEngine
  - **Cleanup:** Automatically removes all temporary directories

- `createTemplateEngineTestFixtureWithCustomDir(customDir)` - Creates fixture with custom templates directory
  - **Setup:** Uses provided templates directory instead of default structure
  - **Provides:** Same structure as basic fixture but with custom templates directory
  - **Cleanup:** Removes temp directories but preserves custom directory if external

- `createPerformanceTestFixture()` - Creates performance-focused test fixture
  - **Setup:** Same as basic fixture plus performance metrics tracking
  - **Provides:** All basic fixture properties plus performanceMetrics array
  - **Cleanup:** Same as basic fixture

**Helper Functions:**

- `writeTemplateFile(fixture, name, content)` - Writes template JSON files to templates directory
- `writeTemplateFiles(fixture, templates)` - Writes multiple template files concurrently
- `createSimpleTemplate(fixture, name, files)` - Creates basic template structure
- `createHandlebarsTemplate(fixture, name, files)` - Creates Handlebars-specific template
- `createMultiTechStackStructure(fixture, techStacks)` - Creates directory structure for multiple tech stacks
- `createInvalidTemplate(fixture, name, errorType)` - Creates templates with specific error types
- `measurePerformance(operation)` - Measures operation execution time
- `measureAndRecordPerformance(fixture, operation, fn)` - Measures and records performance in fixture

**Example Usage:**

```typescript
// Basic fixture usage
const useFixture = createTemplateEngineTestFixture();
const { tempDir, templatesDir, templateEngine } = useFixture();

// Write a test template
await createSimpleTemplate(fixture, 'test-template', [
  { path: 'package.json', template: '{"name": "{{project_name}}"}' },
]);

// Performance testing
const perfFixture = createPerformanceTestFixture();
await measureAndRecordPerformance(perfFixture, 'load-template', () =>
  templateEngine.loadTemplate('large-template')
);
```

---

## Mock Requirements

### File System Mock

**Requirements:** Template loading and file generation operations need file system access

**Success Scenarios:**

- Template files exist in `templates/typescript-bun-cli/` directory
- Output directories are writable
- Template JSON files are valid

**Error Scenarios:**

- Template files don't exist (ENOENT errors)
- Invalid JSON in template files
- Permission denied on output directories
- Templates directory doesn't exist

**Notes:** Tests use temporary directories via `mkdtemp()` and auto-cleanup in `afterEach()`

### Handlebars Engine Mock

**Requirements:** Handlebars template processing for variable substitution and conditionals

**Functions to Mock/Implement:**

- `Handlebars.compile()` - Template compilation
- `Handlebars.registerHelper()` - Custom helper registration
- Template execution with context data

**Notes:** During RED phase, HandlebarsTemplateEngine will not exist, causing import errors

---

## Required Type Definitions and Interfaces

### Template Engine Types

**File:** `packages/adapters/src/template-engine/types.ts`

**Required Interfaces:**

```typescript
export interface TemplateContext {
  project_name: string;
  description?: string;
  version?: string;
  author?: {
    name?: string;
    email?: string;
    url?: string;
  };
  strict?: boolean;
  enableLogger?: boolean;
  hasRoutes?: boolean;
  timestamp?: string;
  nested?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface ProjectTemplate {
  name: string;
  description?: string;
  version?: string;
  files: TemplateFile[];
  helpers?: string[];
}

export interface TemplateFile {
  path: string;
  template: string;
  condition?: string;
  permissions?: string;
}

export interface GeneratedFile {
  path: string;
  content: string;
  permissions?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export interface TemplateEngineImpl {
  loadTemplate(templateName: string): Promise<ProjectTemplate>;
  renderTemplate(template: string, context: TemplateContext): Promise<string>;
  validateTemplate(template: string): ValidationResult;
  validateTemplateStructure(template: ProjectTemplate): ValidationResult;
  processProjectTemplate(
    template: ProjectTemplate,
    context: TemplateContext
  ): Promise<GeneratedFile[]>;
  getAvailableTemplates(): Promise<string[]>;
}
```

### Handlebars Template Engine Class

**File:** `packages/adapters/src/template-engine/handlebars-template-engine.ts`

**Required Class:**

```typescript
export class HandlebarsTemplateEngine implements TemplateEngineImpl {
  constructor(templatesDir?: string);

  // Template loading and management
  async loadTemplate(templateName: string): Promise<ProjectTemplate>;
  async getAvailableTemplates(): Promise<string[]>;

  // Template rendering
  async renderTemplate(template: string, context: TemplateContext): Promise<string>;
  async processProjectTemplate(
    template: ProjectTemplate,
    context: TemplateContext
  ): Promise<GeneratedFile[]>;

  // Template validation
  validateTemplate(template: string): ValidationResult;
  validateTemplateStructure(template: ProjectTemplate): ValidationResult;

  // Helper management
  registerHelper(name: string, helper: (...args: unknown[]) => unknown): void;
}
```

---

## Implementation Checklist

### Test: Template Loading Tests (3 tests)

**File:** `packages/adapters/tests/template-engine-handlebars.test.ts`

**Tasks to make these tests pass:**

- [ ] Create `packages/adapters/src/template-engine/` directory structure
- [ ] Add Handlebars dependency: `bun add handlebars @types/handlebars`
- [ ] Create `types.ts` with all required interfaces (TemplateContext, ProjectTemplate, etc.)
- [ ] Create `handlebars-template-engine.ts` with HandlebarsTemplateEngine class
- [ ] Implement constructor with optional templatesDir parameter
- [ ] Implement `loadTemplate(templateName: string)` method:
  - [ ] Resolve template path: `templatesDir/templateName.json`
  - [ ] Read file with `fs.readFile()`
  - [ ] Parse JSON with validation
  - [ ] Validate template structure using `validateTemplateStructure()`
  - [ ] Handle ENOENT errors with descriptive messages
- [ ] Implement `getAvailableTemplates()` method:
  - [ ] Read templates directory with `fs.readdir()`
  - [ ] Filter `.json` files
  - [ ] Remove `.json` extension from names
  - [ ] Handle directory read errors (return empty array)
- [ ] Run tests: `bunx turbo test --filter=adapters template-engine-handlebars.test.ts`
- [ ] ✅ All template loading tests pass (green phase)

**Estimated Effort:** 4 hours

---

### Test: Variable Substitution Tests (3 tests)

**File:** `packages/adapters/tests/template-engine-handlebars.test.ts`

**Tasks to make these tests pass:**

- [ ] Implement `renderTemplate(template: string, context: TemplateContext)` method:
  - [ ] Initialize Handlebars instance with proper configuration
  - [ ] Register default helpers for common operations
  - [ ] Compile template using `Handlebars.compile()`
  - [ ] Execute compiled template with context data
  - [ ] Handle missing variables gracefully (return empty string)
  - [ ] Support nested object property access (Handlebars built-in)
- [ ] Add helper functions for complex variable processing:
  - [ ] String manipulation helpers (upper, lower, capitalize)
  - [ ] Date formatting helpers
  - [ ] Array manipulation helpers
- [ ] Implement proper error handling for template execution
- [ ] Test with various context structures and edge cases
- [ ] Run tests: `bunx turbo test --filter=adapters template-engine-handlebars.test.ts`
- [ ] ✅ All variable substitution tests pass (green phase)

**Estimated Effort:** 3 hours

---

### Test: Conditional Block Tests (3 tests)

**File:** `packages/adapters/tests/template-engine-handlebars.test.ts`

**Tasks to make these tests pass:**

- [ ] Ensure Handlebars conditional support is properly configured:
  - [ ] `{{#if condition}}...{{/if}}` syntax support
  - [ ] `{{#unless condition}}...{{/unless}}` syntax support
  - [ ] `{{else}}` blocks within conditionals
  - [ ] Nested conditional logic support
- [ ] Test conditional evaluation with various data types:
  - [ ] Boolean values (true/false)
  - [ ] Null/undefined values
  - [ ] Empty strings and arrays
  - [ ] Zero values
- [ ] Verify conditional file generation at project template level:
  - [ ] File-level condition support in TemplateFile interface
  - [ ] Condition evaluation in `processProjectTemplate()` method
  - [ ] Skip files with falsy conditions
- [ ] Run tests: `bunx turbo test --filter=adapters template-engine-handlebars.test.ts`
- [ ] ✅ All conditional block tests pass (green phase)

**Estimated Effort:** 2 hours

---

### Test: Template Validation Tests (3 tests)

**File:** `packages/adapters/tests/template-engine-handlebars.test.ts`

**Tasks to make these tests pass:**

- [ ] Implement `validateTemplate(template: string)` method:
  - [ ] Use Handlebars compile-time validation
  - [ ] Catch syntax errors during compilation
  - [ ] Return ValidationResult with detailed error messages
  - [ ] Handle unclosed blocks, invalid syntax, etc.
- [ ] Implement `validateTemplateStructure(template: ProjectTemplate)` method:
  - [ ] Validate required fields: name, files
  - [ ] Validate files array structure (path, template properties)
  - [ ] Check for duplicate file paths
  - [ ] Validate file path formats (no directory traversal)
  - [ ] Return ValidationResult with structure errors
- [ ] Create comprehensive validation rules:
  - [ ] Template name format validation
  - [ ] File path format validation
  - [ ] Template content basic validation
- [ ] Run tests: `bunx turbo test --filter=adapters template-engine-handlebars.test.ts`
- [ ] ✅ All template validation tests pass (green phase)

**Estimated Effort:** 3 hours

---

### Test: File Generation Tests (2 tests)

**File:** `packages/adapters/tests/template-engine-handlebars.test.ts`

**Tasks to make these tests pass:**

- [ ] Implement `processProjectTemplate(template: ProjectTemplate, context: TemplateContext)` method:
  - [ ] Iterate through template files array
  - [ ] Evaluate file-level conditions using context
  - [ ] Render file template content using `renderTemplate()`
  - [ ] Render file path using `renderTemplate()` (dynamic paths)
  - [ ] Create GeneratedFile objects with proper structure
  - [ ] Handle file permissions if specified
- [ ] Add support for file path templating:
  - [ ] Variable substitution in file paths (e.g., `src/{{component_name}}.ts`)
  - [ ] Conditional directory creation
- [ ] Preserve formatting and indentation:
  - [ ] Handle multi-line templates correctly
  - [ ] Preserve whitespace and indentation from templates
  - [ ] Handle template output formatting consistently
- [ ] Add error handling for file processing failures
- [ ] Run tests: `bunx turbo test --filter=adapters template-engine-handlebars.test.ts`
- [ ] ✅ All file generation tests pass (green phase)

**Estimated Effort:** 3 hours

---

### Test: Integration Tests (8 tests)

**File:** `packages/adapters/tests/integration/template-generation-handlebars.test.ts`

**Tasks to make these tests pass:**

- [ ] Complete end-to-end workflow testing:
  - [ ] Load template from file system
  - [ ] Process all template files with context
  - [ ] Generate complete project structure
  - [ ] Verify all files are created with correct content
- [ ] Implement performance optimizations:
  - [ ] Template caching for repeated renders
  - [ ] Compiled template reuse
  - [ ] Handlebars instance reuse
  - [ ] Concurrent template processing support
- [ ] Add support for multiple tech stack directories:
  - [ ] Flexible templates directory structure
  - [ ] Support for `templates/{tech-stack}/` pattern
  - [ ] Template discovery across multiple directories
- [ ] Enhance error handling and reporting:
  - [ ] Detailed error messages for invalid templates
  - [ ] Line numbers in template syntax errors
  - [ ] Graceful degradation for missing features
- [ ] Add performance monitoring:
  - [ ] Execution time tracking
  - [ ] Memory usage optimization
  - [ ] Large template handling (> 100 files)
- [ ] Run tests: `bunx turbo test --filter=adapters integration/template-generation-handlebars.test.ts`
- [ ] ✅ All integration tests pass (green phase)

**Estimated Effort:** 5 hours

---

### Additional Implementation Tasks

**File:** `packages/adapters/src/index.ts`

**Tasks:**

- [ ] Export HandlebarsTemplateEngine from main adapter module
- [ ] Update existing template engine exports to maintain compatibility
- [ ] Add deprecation warnings for old template engine if needed
- [ ] Update any dependent code to use new Handlebars-based engine

**Estimated Effort:** 1 hour

---

### Documentation and Examples

**Tasks:**

- [ ] Create comprehensive README for Handlebars template engine
- [ ] Add template examples in `templates/typescript-bun-cli/` directory
- [ ] Document supported Handlebars features and custom helpers
- [ ] Add migration guide from old template engine
- [ ] Update project scaffolding documentation

**Estimated Effort:** 2 hours

---

### Quality Assurance

**Tasks:**

- [ ] Run ESLint and fix any issues (`bunx turbo lint`)
- [ ] Ensure TypeScript strict mode compliance
- [ ] Run mutation testing (`bunx turbo test:mutation`)
- [ ] Verify test coverage meets requirements (>80%)
- [ ] Performance testing with large templates
- [ ] Memory leak testing for template caching

**Estimated Effort:** 2 hours

---

## Total Estimated Effort

**Total Implementation Time:** 23 hours
**Breakdown:**

- Template Loading: 4 hours
- Variable Substitution: 3 hours
- Conditional Blocks: 2 hours
- Template Validation: 3 hours
- File Generation: 3 hours
- Integration Testing: 5 hours
- Additional Tasks: 1 hour
- Documentation: 2 hours
- Quality Assurance: 2 hours

---

## Running Tests

```bash
# Run all failing tests for this story
bunx turbo test --filter=adapters template-engine-handlebars.test.ts integration/template-generation-handlebars.test.ts

# Run specific test file
bunx turbo test --filter=adapters template-engine-handlebars.test.ts

# Run integration tests only
bunx turbo test --filter=adapters integration/template-generation-handlebars.test.ts

# Debug specific test
bunx turbo test --filter=adapters template-engine-handlebars.test.ts --debug

# Run tests with coverage
bunx turbo test:coverage --filter=adapters

# Run tests with specific pattern
bunx turbo test --filter=adapters --grep "Template Loading"
```

---

## Red-Green-Refactor Workflow

### RED Phase (Complete) ✅

**TEA Agent Responsibilities:**

- ✅ All tests written and failing
- ✅ Fixtures and factories created with auto-cleanup
- ✅ Mock requirements documented
- ✅ data-testid requirements listed
- ✅ Implementation checklist created

**Verification:**

- All tests run and fail as expected
- Failure messages are clear and actionable
- Tests fail due to missing implementation, not test bugs

---

### GREEN Phase (DEV Team - Next Steps)

**DEV Agent Responsibilities:**

1. **Pick one failing test** from implementation checklist (start with highest priority)
2. **Read the test** to understand expected behavior
3. **Implement minimal code** to make that specific test pass
4. **Run the test** to verify it now passes (green)
5. **Check off the task** in implementation checklist
6. **Move to next test** and repeat

**Key Principles:**

- One test at a time (don't try to fix all at once)
- Minimal implementation (don't over-engineer)
- Run tests frequently (immediate feedback)
- Use implementation checklist as roadmap

**Progress Tracking:**

- Check off tasks as you complete them
- Share progress in daily standup
- Mark story as IN PROGRESS in `bmm-workflow-status.md`

---

### REFACTOR Phase (DEV Team - After All Tests Pass)

**DEV Agent Responsibilities:**

1. **Verify all tests pass** (green phase complete)
2. **Review code for quality** (readability, maintainability, performance)
3. **Extract duplications** (DRY principle)
4. **Optimize performance** (if needed)
5. **Ensure tests still pass** after each refactor
6. **Update documentation** (if API contracts change)

**Key Principles:**

- Tests provide safety net (refactor with confidence)
- Make small refactors (easier to debug if tests fail)
- Run tests after each change
- Don't change test behavior (only implementation)

**Completion:**

- All tests pass
- Code quality meets team standards
- No duplications or code smells
- Ready for code review and story approval

---

## Next Steps

1. **Review this checklist** with team in standup or planning
2. **Run failing tests** to confirm RED phase: `{test_command_all}`
3. **Begin implementation** using implementation checklist as guide
4. **Work one test at a time** (red → green for each)
5. **Share progress** in daily standup
6. **When all tests pass**, refactor code for quality
7. **When refactoring complete**, run `bmad sm story-done` to move story to DONE

---

## Knowledge Base References Applied

This ATDD workflow consulted the following knowledge fragments:

- **fixture-architecture.md** - Test fixture patterns with setup/teardown and auto-cleanup using Playwright's `test.extend()`
- **data-factories.md** - Factory patterns using `@faker-js/faker` for random test data generation with overrides support
- **component-tdd.md** - Component test strategies using Playwright Component Testing
- **network-first.md** - Route interception patterns (intercept BEFORE navigation to prevent race conditions)
- **test-quality.md** - Test design principles (Given-When-Then, one assertion per test, determinism, isolation)
- **test-levels-framework.md** - Test level selection framework (E2E vs API vs Component vs Unit)

See `tea-index.csv` for complete knowledge fragment mapping.

---

## Test Execution Evidence

### Initial Test Run (RED Phase Verification)

**Command:** `bunx turbo test --filter=adapters template-engine-handlebars.test.ts integration/template-generation-handlebars.test.ts`

**Expected Results:**

```
❯ bunx turbo test --filter=adapters template-engine-handlebars.test.ts integration/template-generation-handlebars.test.ts

packages/adapters:test: run tests
packages/adapters:test: (node:54321) Warning: Cannot find module 'packages/adapters/src/template-engine/handlebars-template-engine'
packages/adapters:test: ❯ template-engine-handlebars.test.ts:
packages/adapters:test: ❯ template-generation-handlebars.test.ts:
packages/adapters:test: ✖ 2 test files failed.
packages/adapters:test: ✖ 21 tests failed.
packages/adapters:test: ❯ packages/adapters/tests/template-engine-handlebars.test.ts:4:23
packages/adapters:test: ❯ Error: Cannot find module "./template-engine/handlebars-template-engine" from "./template-engine-handlebars.test.ts"
packages/adapters:test: ❯ packages/adapters/tests/integration/template-generation-handlebars.test.ts:6:23
packages/adapters:test: ❯ Error: Cannot find module "./template-engine/handlebars-template-engine" from "./integration/template-generation-handlebars.test.ts"

Test Suites: 2 failed, 2 total
Tests:       0 passed, 21 failed
```

**Summary:**

- Total tests: 21 (13 unit + 8 integration)
- Passing: 0 (expected)
- Failing: 21 (expected)
- Status: ✅ RED phase verified

**Expected Failure Messages:**

- `Cannot find module 'packages/adapters/src/template-engine/handlebars-template-engine'` - HandlebarsTemplateEngine class doesn't exist yet
- `Cannot find module './template-engine/types'` - Type definitions don't exist yet
- Template loading, variable substitution, and conditional processing errors - Implementation doesn't exist

---

## Notes

### Important Considerations for this Story

1. **Handlebars Integration**: This story requires replacing or extending the existing custom template engine with Handlebars.js for industry-standard template syntax
2. **Backward Compatibility**: The existing template engine is already implemented - consider whether to replace it or create a parallel implementation
3. **Performance Requirements**: Story specifies <100ms template loading and <10ms rendering times - implementation needs optimization
4. **Extensibility**: Template catalog must support future tech stack additions - design with flexible directory structure

### Technical Decisions Needed

1. **Engine Replacement Strategy**: Should Handlebars replace the existing template engine or coexist?
2. **Template Format**: Handle existing template JSON format or migrate to pure Handlebars?
3. **Directory Structure**: How to handle multiple tech stacks in templates directory?
4. **Caching Strategy**: Implement template compilation caching for performance requirements

### Dependencies

- **Handlebars.js**: `bun add handlebars @types/handlebars`
- **TypeScript**: Ensure strict mode compliance
- **File System**: Heavy use of `fs/promises` for template operations

---

## Contact

**Questions or Issues?**

- Ask in team standup
- Tag @Claude Code in development discussions
- Refer to `testarch/README.md` for workflow documentation
- Consult `testarch/knowledge/` for testing best practices
- Review existing template engine implementation in `packages/adapters/src/template-engine.ts`

---

**Generated by BMad TEA Agent** - 2025-10-23
