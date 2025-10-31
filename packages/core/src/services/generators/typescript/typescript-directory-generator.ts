/**
 * TypeScript Directory Generator
 *
 * Handles the generation of TypeScript-specific directory structures
 */
import type { DirectoryItem } from '../core/file-operations/types.js';

/**
 * Generator for TypeScript project directory structure
 */
export class TypeScriptDirectoryGenerator {
  /**
   * Get TypeScript-specific directory structure
   * @returns {DirectoryItem[]} Array of directory items
   */
  generateTypeScriptDirectories(): DirectoryItem[] {
    return [
      { path: 'src/lib', type: 'directory' },
      { path: 'src/lib/types', type: 'directory' },
      { path: 'src/lib/interfaces', type: 'directory' },
      { path: 'src/lib/enums', type: 'directory' },
      { path: 'src/lib/errors', type: 'directory' },
      { path: 'src/lib/utils', type: 'directory' },
      { path: 'src/lib/validators', type: 'directory' },
      { path: 'src/lib/adapters', type: 'directory' },
      { path: 'src/lib/services', type: 'directory' },
      { path: 'tests/unit', type: 'directory' },
      { path: 'tests/integration', type: 'directory' },
      { path: 'tests/benchmarks', type: 'directory' },
      { path: 'tests/fixtures', type: 'directory' },
      { path: 'tests/mocks', type: 'directory' },
      { path: 'docs/api', type: 'directory' },
      { path: 'docs/guides', type: 'directory' },
      { path: 'examples', type: 'directory' },
      { path: 'scripts', type: 'directory' },
    ];
  }
}
