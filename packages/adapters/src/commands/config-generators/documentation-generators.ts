/**
 * Documentation Generators
 *
 * Generates API documentation for library projects
 */

import type { ProjectConfig } from '../enhanced-init-types.js';

/**
 * Documentation Generators Class
 */
export class DocumentationGenerators {
  /**
   * Generate API documentation for library projects
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} API documentation content
   */
  generateApiDocumentation(config: ProjectConfig): string {
    return `# API Documentation

## Overview

${config.description || 'A modern TypeScript library'}

## Installation

\`\`\`bash
npm install ${config.name}
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

MIT
`;
  }
}
