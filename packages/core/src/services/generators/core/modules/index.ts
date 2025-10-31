/**
 * Export all generator modules
 */

// Shared utilities
export * from './shared/common-generators.js';

// CLI generators
export * from './cli/cli-index-generator.js';
export * from './cli/cli-interfaces.js';
export * from './cli/cli-classes.js';
export * from './cli/cli-exports.js';

// Web generators
export * from './web/web-index-generator.js';
export * from './web/web-interfaces.js';
export * from './web/web-classes.js';
export * from './web/web-exports.js';

// Library generators
export * from './library/library-index-generator.js';
export * from './library/library-interfaces.js';
export * from './library/library-classes.js';
export * from './library/library-exports.js';

// TypeScript generators
export * from './typescript/typescript-index-generator.js';
export * from './typescript/typescript-interfaces.js';
export * from './typescript/typescript-classes.js';
export * from './typescript/typescript-exports.js';

// Framework generators
export * from './framework/framework-index-generator.js';
export * from './framework/framework-classes.js';
export * from './framework/framework-exports.js';
// Re-export interfaces without conflict
export {
  generateFrameworkInterface,
  getVueInterface,
  getReactInterface,
  getExpressInterface,
} from './framework/framework-interfaces.js';
