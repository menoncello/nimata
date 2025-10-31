# Directory Structure Generator - Mock Requirements

This document outlines the mock requirements for the Directory Structure Generator implementation tests. These mocks are needed because the actual generators are not yet implemented.

## External Service Mocks

### File System Operations

**Required for**: Directory creation, file writing, permission setting
**Mock Strategy**: Since we're testing file system operations, we use actual file system with temp directories

- Use `TestProject` class for isolated test environments
- Auto-cleanup in teardown to prevent test pollution
- Real file system operations for realistic testing

### Template Engine Integration

**Required for**: Template processing and file generation
**Mock Strategy**: Templates will be stubbed in test files

- Mock template responses with expected content
- Use `@ts-expect-error` to indicate missing implementations
- Focus on structure and content validation rather than template processing

### Permission Management

**Required for**: File and directory permission handling (755)
**Mock Strategy**: Use actual file system with permission validation

- Test with real file system permissions
- Validate executable bits on bin files
- Check directory permissions match expected values

## Test Data Mocks

### Project Configurations

**Purpose**: Test different project types and quality levels
**Implementation**: Use factory functions

```typescript
// Basic project with strict quality
const basicConfig = createBasicDirectoryConfig();

// Web project with medium quality
const webConfig = createWebDirectoryConfig();
webConfig.qualityLevel = 'medium';
```

### Directory Structure Templates

**Purpose**: Test expected output structure
**Implementation**: Mock expected file contents and structure

- Pre-defined content for common files (package.json, tsconfig.json, etc.)
- Expected directory arrays for validation
- Mock file content for text files (README.md, etc.)

## Implementation Mocks

### Directory Structure Generator

**Status**: NOT IMPLEMENTED (RED PHASE)
**Mock Strategy**: Import error handling with @ts-expect-error

```typescript
// This will fail until implementation is complete
// @ts-expect-error - DirectoryStructureGenerator import doesn't exist
const { DirectoryStructureGenerator } = await import('path-to-implementation');
```

### Entry Points Generator

**Status**: NOT IMPLEMENTED (RED PHASE)
**Mock Strategy**: Import error handling with @ts-expect-error

```typescript
// This will fail until implementation is complete
// @ts-expect-error - EntryPointsGenerator import doesn't exist
const { EntryPointsGenerator } = await import('path-to-implementation');
```

### Configuration Files Generator

**Status**: NOT IMPLEMENTED (RED PHASE)
**Mock Strategy**: Import error handling with @ts-expect-error

```typescript
// This will fail until implementation is complete
// @ts-expect-error - ConfigurationFilesGenerator import doesn't exist
const { ConfigurationFilesGenerator } = await import('path-to-implementation');
```

### Documentation Generator

**Status**: NOT IMPLEMENTED (RED PHASE)
**Mock Strategy**: Import error handling with @ts-expect-error

```typescript
// This will fail until implementation is complete
// @ts-expect-error - DocumentationGenerator import doesn't exist
const { DocumentationGenerator } = await import('path-to-implementation');
```

### Test Structure Generator

**Status**: NOT IMPLEMENTED (RED PHASE)
**Mock Strategy**: Import error handling with @ts-expect-error

```typescript
// This will fail until implementation is complete
// @ts-expect-error - TestStructureGenerator import doesn't exist
const { TestStructureGenerator } = await import('path-to-implementation');
```

## CLI Integration Mocks

### CLI Command Execution

**Required for**: End-to-end workflow testing
**Mock Strategy**: Use actual CLI through executeCLI helper

- No mocking needed - use real CLI execution
- Validate command-line arguments and output
- Test exit codes and error messages

### Interactive Prompts

**Required for**: Testing interactive mode (if needed)
**Mock Strategy**: Use --nonInteractive flag in most tests

- For interactive tests, provide input array to executeCLI
- Mock user input scenarios for validation

## Quality Standards Mocks

### ESLint Configuration Validation

**Purpose**: Test quality level adaptation
**Mock Strategy**: Parse generated ESLint config and validate rules

- Check for quality-specific rule presence/absence
- Validate configuration structure
- Test with different quality levels

### TypeScript Configuration Validation

**Purpose**: Test TypeScript configuration generation
**Mock Strategy**: Parse generated tsconfig.json and validate settings

- Validate compiler options match quality level
- Check include/exclude patterns
- Verify strict mode configuration

## Error Handling Mocks

### File System Errors

**Purpose**: Test error scenarios and recovery
**Mock Strategy**: Simulate permission denied, disk full, etc.

- Test with invalid directory paths
- Validate error message quality
- Test rollback functionality

### Validation Errors

**Purpose**: Test input validation and error reporting
**Mock Strategy**: Test with invalid configurations

- Invalid project names
- Invalid quality levels
- Invalid project types

## Performance Mocks

### Execution Time Limits

**Purpose**: Ensure performance requirements are met
**Mock Strategy**: Measure execution time in tests

- Validate <5 seconds for directory generation
- Test with large project structures
- Monitor memory usage if needed

## Integration Points

### Story 1.3 Project Generation System

**Dependency**: Directory Structure Generator extends existing system
**Mock Strategy**: Use existing templates and infrastructure

- Test integration with existing template engine
- Validate compatibility with project generation workflow
- Ensure no breaking changes to existing functionality

### Quality System from Story 1.2

**Dependency**: Uses quality level configurations
**Mock Strategy**: Test with different quality levels

- Validate strict, medium, light quality adaptations
- Test quality rule application
- Ensure configuration consistency

## Next Steps for DEV Team

1. **Implement DirectoryStructureGenerator class**
   - Location: `packages/core/src/services/generators/directory-structure-generator.ts`
   - Interface: `generate(config: DirectoryStructureConfig): DirectoryItem[]`

2. **Implement EntryPointsGenerator class**
   - Location: `packages/core/src/services/generators/entry-points-generator.ts`
   - Interface: `generate(config: DirectoryStructureConfig): DirectoryItem[]`

3. **Implement ConfigurationFilesGenerator class**
   - Location: `packages/core/src/services/generators/configuration-files-generator.ts`
   - Interface: `generate(config: DirectoryStructureConfig): DirectoryItem[]`

4. **Implement DocumentationGenerator class**
   - Location: `packages/core/src/services/generators/documentation-generator.ts`
   - Interface: `generate(config: DirectoryStructureConfig): DirectoryItem[]`

5. **Implement TestStructureGenerator class**
   - Location: `packages/core/src/services/generators/test-structure-generator.ts`
   - Interface: `generate(config: DirectoryStructureConfig): DirectoryItem[]`

6. **Remove @ts-expect-error comments** once implementations are available
7. **Update import paths** to match actual implementation locations
8. **Run tests to validate green phase** after implementation

## Validation Checklist

After implementation, verify:

- [ ] All @ts-expect-error comments can be removed
- [ ] All generators implement required interfaces
- [ ] Integration with existing template system works
- [ ] Quality level adaptations work correctly
- [ ] File permissions are set correctly
- [ ] Project type variations work as expected
- [ ] Error handling and validation work properly
- [ ] Performance requirements are met (<5 seconds)
- [ ] All tests pass (green phase)
