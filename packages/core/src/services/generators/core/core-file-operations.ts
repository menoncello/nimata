/**
 * Core File Operations
 *
 * Main entry point for core file operations functionality.
 * This file has been refactored to use modularized components while maintaining backward compatibility.
 *
 * The original 342-line file has been split into smaller, focused modules:
 * - types.ts: Type definitions
 * - file-permissions.ts: Permission management utilities
 * - path-validation.ts: Security validation logic
 * - directory-operations.ts: Directory creation functions
 * - file-operations.ts: File creation functions
 * - cli-executable.ts: CLI executable creation functions
 * - utils.ts: Utility functions
 * - index.ts: Main exports and CoreFileOperations class
 */

// Re-export everything from the modularized index to maintain backward compatibility
export * from './file-operations/index.js';

// Keep the original export for backward compatibility
export { CoreFileOperations } from './file-operations/index.js';
export type { DirectoryItem, FileCreationContext } from './file-operations/types.js';
