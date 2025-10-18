/**
 * @nimata/core - Core use cases and domain logic
 */

export const CORE_VERSION = '0.1.0';

// Configuration (Story 1.2)
export * from './types/config';
export * from './interfaces/config-repository';
export * from './config/defaults';
export * from './utils/deep-merge';
export * from './utils/logger';
