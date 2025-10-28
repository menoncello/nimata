/**
 * Nimata Core - Core use cases and domain logic
 */

export const CORE_VERSION = '0.1.0';

// Configuration (Story 1.2)
export * from './types/config';
export * from './interfaces/config-repository';
export * from './config/defaults';
export * from './utils/deep-merge';
export * from './utils/string-utils';

// Project Generation (Story 1.3)
export * from './types/project-config';
export * from './types/template-catalog';
export * from './types/template-context';
export * from './interfaces/project-wizard';
export * from './interfaces/template-engine';
export * from './interfaces/project-generator';
export * from './services/project-config-processor';

// Directory Structure Generation (Story 1.4)
export { DirectoryStructureGenerator } from './services/generators/directory-structure-generator';
export type { DirectoryItem } from './services/generators/directory-structure-generator';
export { TemplateGenerator } from './services/generators/template-generator';
export { TestFileGenerator } from './services/generators/test-file-generator';
export { IndexGenerator } from './services/generators/core/index-generator';
export { DocumentationGenerator } from './services/generators/documentation-generator';
export { EntryPointsGenerator } from './services/generators/entry-points-generator';
export { ConfigurationFilesGenerator } from './services/generators/configuration-files-generator';
