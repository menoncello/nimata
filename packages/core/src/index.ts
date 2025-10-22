/**
 * @nimata/core - Core use cases and domain logic
 */

export const CORE_VERSION = '0.1.0';

// Configuration (Story 1.2)
export * from './types/config';
export * from './interfaces/config-repository';
export * from './config/defaults';
export * from './utils/deep-merge';

// Project Generation (Story 1.3)
export * from './types/project-config';
export * from './interfaces/project-wizard';
export * from './interfaces/template-engine';
export * from './interfaces/project-generator';
export * from './services/project-config-processor';
