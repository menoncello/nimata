/**
 * Documentation Generator
 */

import type { ProjectConfig } from '../../../types/project-config.js';

/**
 * Documentation generator
 */
export class DocumentationGenerator {
  /**
   * Generate API documentation placeholder
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} API documentation markdown
   */
  static generateAPIDocumentation(config: ProjectConfig): string {
    return `# API Documentation

## Overview

${config.description || 'A modern TypeScript project'}

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Reference](#api-reference)

## Installation

\`\`\`bash
bun install
\`\`\`

## Usage

\`\`\`typescript
import { main } from '${config.name}';

// TODO: Add usage examples
\`\`\`

## API Reference

### Functions

\`\`\`typescript
// TODO: Add function documentation
\`\`\`

## Contributing

Please see the main README.md for contribution guidelines.

## License

${config.license || 'MIT'}
`;
  }

  /**
   * Generate API documentation (instance method for backward compatibility)
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} API documentation markdown
   */
  generate(config: ProjectConfig): string {
    return DocumentationGenerator.generateAPIDocumentation(config);
  }
}
