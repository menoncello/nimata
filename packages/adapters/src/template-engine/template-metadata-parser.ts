/**
 * Template Metadata Parser Utility
 *
 * Handles parsing template metadata from different file formats
 * This is the main entry point that re-exports functionality from specialized modules
 */

// Re-export the main class from core module
export { TemplateMetadataParser } from './template-metadata-parser-core.js';

// Re-export types and utilities for external use
export type { TemplateMetadata, ProjectType, ProjectQualityLevel } from '@nimata/core';
