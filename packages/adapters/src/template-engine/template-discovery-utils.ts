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
 * @param {unknown} templatePath - Path to the template file
 * @returns {void} Template metadata or null if extraction failed
 */
export async function extractTemplateWithErrorHandling(
  templatePath: string
): Promise<TemplateMetadata | null> {
  try {
    return await TemplateMetadataParser.extractTemplateMetadata(templatePath);
  } catch {
    // Failed to extract metadata from template, but continue processing
    return null;
  }
}

/**
 * Process a single template path and categorize it
 * @param {string} templatePath - Path to the template file
 * @param {number} lastScan - Last scan timestamp
 * @param {{ newTemplates: TemplateMetadata[]; modifiedTemplates: TemplateMetadata[] }} collections - Collections to store template metadata
 * @param {TemplateMetadata[]} collections.newTemplates - Array to collect new templates
 * @param {TemplateMetadata[]} collections.modifiedTemplates - Array to collect modified templates
 * @param {{ getTemplateByPath: (path: string) => TemplateMetadata | null }} indexManager - Template index manager instance for checking existing templates
 * @param {(path: string) => TemplateMetadata | null} indexManager.getTemplateByPath - Function to get template by path from the index manager
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
  } catch {
    // Failed to process template, but continue with others
  }
}

/**
 * Find existing template by checking both original and normalized paths
 * @param {string} templatePath - Path to check
 * @param {{ getTemplateByPath: (path: string) => TemplateMetadata | null } | undefined} indexManager - Template index manager instance
 * @param {(path: string) => TemplateMetadata | null} indexManager.getTemplateByPath - Function to get template by path from the index manager
 * @returns {Promise<TemplateMetadata | null>} Existing template or null if not found
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
 * @param {{ path: string; recursive?: boolean }} source - Source configuration
 * @param {string} source.path - Source path
 * @param {boolean} source.recursive - Whether to search recursively
 * @param {{ addTemplate: (template: TemplateMetadata) => void }} indexManager - Template index manager instance
 * @param {(template: TemplateMetadata) => void} indexManager.addTemplate - Function to add template to index
 * @returns {Promise<TemplateMetadata[]>} Array of discovered templates
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
    } catch {
      // Template processing failed, continuing with others
    }
  }

  return templates;
}

/**
 * Calculate duration and log performance metrics
 * @param {number} _startTime - Start time in milliseconds
 * @param {string} _operation - Operation description
 * @param {number} _count - Count of items processed
 * @returns {number} Duration in milliseconds
 */
export function calculateAndLogPerformance(
  _startTime: number,
  _operation: string,
  _count: number
): number {
  return performance.now() - _startTime;
}
