/**
 * Template Discovery Utilities
 *
 * Utility functions and helper methods for template discovery operations
 */
import { performance } from 'node:perf_hooks';
import type { TemplateMetadata } from '@nimata/core';
import { TemplateFileScanner } from './template-file-scanner.js';
import { TemplateMetadataParser } from './template-metadata-parser.js';

/**
 * Performance constants for timing operations
 */
export const DISCOVERY_CONSTANTS = {
  DECIMAL_PLACES: 2,
} as const;

/**
 * File watcher configuration interface
 */
export interface WatcherConfig {
  enabled: boolean;
  debounceMs: number;
  ignoredFiles: string[];
  ignoredDirectories: string[];
}

/**
 * Template processing results interface
 */
export interface TemplateProcessingResults {
  newTemplates: TemplateMetadata[];
  modifiedTemplates: TemplateMetadata[];
  deletedTemplates: string[];
}

/**
 * Extract template metadata with error handling
 * @param templatePath - Path to the template file
 * @returns Template metadata or null if extraction failed
 */
export async function extractTemplateWithErrorHandling(
  templatePath: string
): Promise<TemplateMetadata | null> {
  try {
    return await TemplateMetadataParser.extractTemplateMetadata(templatePath);
  } catch (error) {
    console.warn(`Failed to extract metadata from ${templatePath}:`, error);
    return null;
  }
}

/**
 * Process a single template path and categorize it
 * @param templatePath - Path to the template file
 * @param lastScan - Last scan timestamp
 * @param collections - Object containing arrays to collect new and modified templates
 * @param collections.newTemplates - Array to collect new templates
 * @param collections.modifiedTemplates - Array to collect modified templates
 * @param indexManager - Template index manager instance for checking existing templates
 * @param indexManager.getTemplateByPath - Function to get template by path from the index manager
 */
export async function processTemplatePath(
  templatePath: string,
  lastScan: number,
  collections: { newTemplates: TemplateMetadata[]; modifiedTemplates: TemplateMetadata[] },
  indexManager?: { getTemplateByPath: (path: string) => TemplateMetadata | null }
): Promise<void> {
  try {
    const fileStats = await TemplateFileScanner.getFileStats(templatePath);
    const lastModified = fileStats.lastModified.getTime();

    if (lastModified <= lastScan) return; // Skip unchanged files

    const template = await TemplateMetadataParser.extractTemplateMetadata(templatePath);
    if (!template) return;

    const existingTemplate = await findExistingTemplate(templatePath, indexManager);

    if (existingTemplate) {
      collections.modifiedTemplates.push(template);
    } else {
      collections.newTemplates.push(template);
    }
  } catch (error) {
    console.warn(`Failed to process ${templatePath}:`, error);
  }
}

/**
 * Find existing template by checking both original and normalized paths
 * @param templatePath - Path to check
 * @param indexManager - Template index manager instance
 * @param indexManager.getTemplateByPath - Function to get template by path from the index manager
 * @returns Existing template or null if not found
 */
async function findExistingTemplate(
  templatePath: string,
  indexManager?: { getTemplateByPath: (path: string) => TemplateMetadata | null }
): Promise<TemplateMetadata | null> {
  const path = await import('node:path');

  // Try the original path
  let existingTemplate = indexManager?.getTemplateByPath(templatePath);

  // Try absolute path
  if (!existingTemplate) {
    const absolutePath = path.resolve(templatePath);
    existingTemplate = indexManager?.getTemplateByPath(absolutePath);
  }

  // Try relative path from cwd
  if (!existingTemplate) {
    const relativePath = path.relative(process.cwd(), templatePath);
    existingTemplate = indexManager?.getTemplateByPath(relativePath);
  }

  return existingTemplate || null;
}

/**
 * Discover templates from a single source
 * @param source - Template source configuration
 * @param source.path - Source path
 * @param source.recursive - Whether to search recursively
 * @param indexManager - Template index manager instance
 * @param indexManager.addTemplate - Function to add template to index
 * @returns Array of discovered templates
 */
export async function discoverFromSource(
  source: { path: string; recursive?: boolean },
  indexManager: { addTemplate: (template: TemplateMetadata) => void }
): Promise<TemplateMetadata[]> {
  const templates: TemplateMetadata[] = [];
  const templateFiles = await TemplateFileScanner.scanDirectory(source.path);

  for (const filePath of templateFiles) {
    try {
      const template = await TemplateMetadataParser.extractTemplateMetadata(filePath);
      if (template) {
        templates.push(template);
        indexManager.addTemplate(template);
      }
    } catch (error) {
      console.warn(`Failed to process template ${filePath}:`, error);
    }
  }

  return templates;
}

/**
 * Calculate duration and log performance metrics
 * @param startTime - Start time in milliseconds
 * @param operation - Operation description
 * @param count - Count of items processed
 * @returns Duration in milliseconds
 */
export function calculateAndLogPerformance(
  startTime: number,
  operation: string,
  count: number
): number {
  const duration = performance.now() - startTime;
  console.log(
    `${operation} ${count} templates in ${duration.toFixed(DISCOVERY_CONSTANTS.DECIMAL_PLACES)}ms`
  );
  return duration;
}
