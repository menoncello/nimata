# Data-testid Attributes Required for Story 1.4

This document lists all the `data-testid` attributes that need to be added to the Directory Structure Generator implementation for test stability.

## CLI Interface Elements

### Main Commands

- `init-command-button` - Button to start project initialization
- `project-name-input` - Input field for project name
- `project-type-select` - Dropdown for project type selection (basic, web, cli, library)
- `quality-level-select` - Dropdown for quality level selection (light, medium, strict)
- `ai-assistants-select` - Multi-select for AI assistants (claude-code, copilot)
- `template-select` - Dropdown for template selection (if applicable)
- `interactive-toggle` - Checkbox to toggle interactive mode
- `start-generation-button` - Button to begin directory structure generation

### Progress Indicators

- `progress-container` - Main progress indicator container
- `progress-bar` - Progress bar element
- `progress-text` - Progress status text
- `current-step` - Current step indicator
- `step-status-{step-name}` - Status indicator for each step

### Validation Messages

- `validation-container` - Container for validation messages
- `validation-error` - Error message display
- `validation-warning` - Warning message display
- `validation-success` - Success message display
- `field-error-{field-name}` - Field-specific error indicators

### File Structure Display

- `structure-preview` - Container showing generated directory structure
- `directory-item-{path}` - Individual directory display items
- `file-item-{path}` - Individual file display items
- `permissions-display` - Display showing file/directory permissions

## Generated File Elements

### Configuration Files

- `package-json-content` - Display area for generated package.json
- `tsconfig-json-content` - Display area for generated tsconfig.json
- `eslint-config-content` - Display area for generated ESLint configuration
- `vite-config-content` - Display area for generated Vite configuration (web projects)

### Entry Points

- `main-entry-content` - Display area for src/index.ts content
- `cli-launcher-content` - Display area for bin/cli-name content
- `library-exports-content` - Display area for library export configuration

### Documentation

- `readme-content` - Display area for README.md content
- `claude-md-content` - Display area for CLAUDE.md content
- `api-docs-content` - Display area for API documentation content

## File System Operations

### Directory Creation

- `create-directory-button` - Button to create a directory
- `directory-path-input` - Input field for directory path
- `directory-permissions-select` - Dropdown for directory permissions
- `create-with-parents-checkbox` - Checkbox to create parent directories

### File Creation

- `create-file-button` - Button to create a file
- `file-path-input` - Input field for file path
- `file-content-textarea` - Textarea for file content
- `file-permissions-select` - Dropdown for file permissions
- `overwrite-existing-checkbox` - Checkbox to overwrite existing files

### Batch Operations

- `batch-create-button` - Button to create multiple files/directories
- `batch-preview` - Preview area for batch operations
- `select-all-checkbox` - Checkbox to select all items
- `clear-selection-button` - Button to clear selection

## Error Handling

### Error Display

- `error-container` - Main error display container
- `error-title` - Error message title
- `error-details` - Error details and stack trace
- `error-retry-button` - Button to retry failed operation
- `error-dismiss-button` - Button to dismiss error message

### Recovery Actions

- `rollback-button` - Button to rollback changes
- `cleanup-temp-button` - Button to cleanup temporary files
- `continue-despite-errors-checkbox` - Checkbox to continue despite non-critical errors

## Template Management

### Template Selection

- `template-list` - List of available templates
- `template-item-{template-name}` - Individual template items
- `template-preview` - Preview area for selected template
- `template-description` - Template description text

### Custom Templates

- `create-template-button` - Button to create custom template
- `template-name-input` - Input for custom template name
- `template-json-editor` - JSON editor for template configuration
- `save-template-button` - Button to save custom template

## Settings and Configuration

### Quality Settings

- `quality-settings-panel` - Panel for quality level configuration
- `strict-rules-toggle` - Toggle for strict ESLint rules
- `coverage-threshold-input` - Input for test coverage threshold
- `mutation-testing-checkbox` - Checkbox for mutation testing

### AI Assistant Integration

- `claude-code-config` - Configuration panel for Claude Code
- `copilot-config` - Configuration panel for GitHub Copilot
- `ai-context-editor` - Editor for AI context customization

## Debug and Development

### Debug Information

- `debug-panel` - Panel for debug information
- `generated-files-list` - List of generated files with paths
- `execution-log` - Log of execution steps
- `performance-metrics` - Performance timing information

### Developer Tools

- `export-config-button` - Button to export configuration
- `import-config-button` - Button to import configuration
- `reset-to-defaults-button` - Button to reset all settings

## Usage Examples

### Interactive Mode

```typescript
// Basic usage in CLI
<init-command-button data-testid="init-command-button">
  <project-name-input data-testid="project-name-input" />
  <project-type-select data-testid="project-type-select" />
  <start-generation-button data-testid="start-generation-button" />
</init-command-button>
```

### File System Operations

```typescript
// Directory creation with validation
<create-directory-button data-testid="create-directory-button">
  <directory-path-input data-testid="directory-path-input" />
  <directory-permissions-select data-testid="directory-permissions-select" />
</create-directory-button>
```

### Error Handling

```typescript
// Error display with recovery options
<error-container data-testid="error-container">
  <error-title data-testid="error-title" />
  <error-retry-button data-testid="error-retry-button" />
  <rollback-button data-testid="rollback-button" />
</error-container>
```

## Implementation Notes

### Test Selection Strategy

- **Primary selection**: `data-testid` attributes for all interactive elements
- **Secondary selection**: ARIA labels for accessibility compliance
- **Tertiary selection**: Text content only when elements are unique
- **Avoid**: CSS classes, element types, dynamic attributes

### Performance Considerations

- Keep `data-testid` names short but descriptive
- Use consistent naming conventions
- Group related attributes with prefixes
- Avoid attribute value conflicts

### Accessibility Compliance

- All `data-testid` elements should have proper ARIA labels
- Use semantic HTML elements where appropriate
- Ensure keyboard navigation works
- Provide text alternatives for visual content

## Validation Checklist

After implementation, verify:

- [ ] All interactive elements have `data-testid` attributes
- [ ] Test files use `data-testid` selectors instead of CSS classes
- [ ] No hardcoded CSS classes or element types in tests
- [ ] All `data-testid` values are unique and descriptive
- [ ] Error handling elements have proper test identifiers
- [ ] Progress indicators are testable via `data-testid`
- [ ] File content display areas are accessible to tests

## Maintenance

### Adding New Elements

When adding new UI elements:

1. Choose descriptive `data-testid` name
2. Add to this documentation
3. Update test files to use new identifier
4. Ensure no naming conflicts with existing identifiers
5. Follow established naming conventions

### Removing Elements

When removing UI elements:

1. Remove corresponding `data-testid` attributes from code
2. Update this documentation
3. Remove or update related tests
4. Check for any dependent functionality that might be affected
