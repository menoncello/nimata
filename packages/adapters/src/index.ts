/**
 * Adapter implementations for Nimata framework
 */

export const ADAPTERS_VERSION = '0.1.0';

// Configuration (Story 1.2)
export * from './repositories/yaml-config-repository';

// Project Generation (Story 1.3)
export * from './wizards/project-wizard';
export * from './template-engine';
export * from './project-generator';

// Configuration Generators (Story 1.3)
export * from './generators/eslint-generator';
export * from './generators/typescript-generator';
export * from './generators/prettier-generator';
export * from './generators/vitest-generator';
export * from './generators/claude-md-generator';
export * from './generators/copilot-generator';
export * from './generators/ai-context-generator';

// Commands (Story 1.3)
export * from './commands/init';
export * from './commands/enhanced-init';

// Validators (Story 1.3)
// Project validator will be implemented in future iterations
// export * from './validators/project-validator';

// CLI Utilities (Story 1.3)
export * from './utils/progress';
export * from './utils/cli-helpers';
export * from './utils/help-system';
export * from './utils/performance';

// Project Utilities (Story 1.3)
export { getProjectDirectory } from './utils/project-utilities';
