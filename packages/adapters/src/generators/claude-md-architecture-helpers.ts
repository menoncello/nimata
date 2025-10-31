/**
 * CLAUDE.md Architecture Helpers
 *
 * Helper functions for architecture section generation
 */

/**
 * Gets architecture description for basic project type
 * @returns {string} Architecture description string
 */
function getBasicArchitectureDescription(): string {
  return `- **src/**: Main source code
- **tests/**: Test files
- **docs/**: Documentation
- Simple, flat structure suitable for small projects`;
}

/**
 * Gets architecture description for CLI project type
 * @returns {string} Architecture description string
 */
function getCliArchitectureDescription(): string {
  return `- **src/commands/**: CLI command implementations
- **src/utils/**: Utility functions and helpers
- **src/types/**: TypeScript type definitions
- **src/config/**: Configuration management
- Organized for CLI application with command separation`;
}

/**
 * Gets architecture description for web project type
 * @returns {string} Architecture description string
 */
function getWebArchitectureDescription(): string {
  return `- **src/components/**: Reusable UI components
- **src/pages/**: Page-level components
- **src/api/**: API client and services
- **src/utils/**: Shared utilities
- **src/types/**: TypeScript definitions
- **public/**: Static assets
- Modern web application structure`;
}

/**
 * Gets architecture description for library project type
 * @returns {string} Architecture description string
 */
function getLibraryArchitectureDescription(): string {
  return `- **src/**: Library source code
- **types/**: Public type definitions
- **examples/**: Usage examples
- **docs/**: API documentation
- **tests/**: Comprehensive test suite
- Package structure optimized for distribution`;
}

/**
 * Gets architecture section content based on project type
 * @param {string} projectType - Project type identifier
 * @returns {string): string} Architecture section content
 */
export function getArchitectureSection(projectType: string): string {
  switch (projectType) {
    case 'basic':
      return getBasicArchitectureDescription();
    case 'cli':
      return getCliArchitectureDescription();
    case 'web':
      return getWebArchitectureDescription();
    case 'library':
      return getLibraryArchitectureDescription();
    default:
      return '';
  }
}
