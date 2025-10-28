/**
 * Template Scanner Implementation
 *
 * Handles scanning and discovery of templates from file system
 */
import path from 'node:path';
import { performance } from 'node:perf_hooks';
import type { TemplateMetadata } from '@nimata/core';
import {
  extractTemplateWithErrorHandling,
  processTemplatePath,
  type TemplateProcessingResults,
  calculateAndLogPerformance,
} from './template-discovery-utils.js';
import { TemplateFileScanner } from './template-file-scanner.js';
import { TemplateIndexManager } from './template-index-manager.js';

/**
 * Template scanner class that handles discovery and scanning operations
 */
export class TemplateScanner {
  private indexManager: TemplateIndexManager;
  private lastScanTime: Map<string, number> = new Map();

  /**
   * Create template scanner instance
   * @param indexManager - Template index manager instance
   */
  constructor(indexManager: TemplateIndexManager) {
    this.indexManager = indexManager;
  }

  /**
   * Discover templates from file system
   * @param directory - Directory path to scan for templates
   * @returns Array of discovered template metadata
   */
  async discover(directory: string): Promise<TemplateMetadata[]> {
    const startTime = performance.now();

    try {
      const templatePaths = await TemplateFileScanner.scanDirectory(directory);
      const templates: TemplateMetadata[] = [];

      for (const templatePath of templatePaths) {
        const template = await extractTemplateWithErrorHandling(templatePath);
        if (template) {
          templates.push(template);
        }
      }

      await this.index(templates);

      // Set last scan time to track for future scans
      this.lastScanTime.set(directory, Date.now());

      calculateAndLogPerformance(startTime, 'Discovered', templates.length);

      return templates;
    } catch (error) {
      throw new Error(
        `Template discovery failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Scan for new or modified templates
   * @param directory - Directory to scan
   * @returns Scan results with new, modified, and deleted templates
   */
  async scan(directory: string): Promise<TemplateProcessingResults> {
    const startTime = performance.now();
    const lastScan = this.lastScanTime.get(directory) || 0;
    const currentTime = Date.now();

    try {
      const templatePaths = await TemplateFileScanner.scanDirectory(directory);
      const scanResults = await this.processTemplateChanges(templatePaths, lastScan);

      this.lastScanTime.set(directory, currentTime);

      const totalProcessed = scanResults.newTemplates.length + scanResults.modifiedTemplates.length;
      calculateAndLogPerformance(startTime, 'Template scan completed', totalProcessed);

      return scanResults;
    } catch (error) {
      throw new Error(
        `Template scan failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Process template changes to find new, modified, and deleted templates
   * @param templatePaths - All template paths found in directory
   * @param lastScan - Timestamp of last scan
   * @returns Scan results with new, modified, and deleted templates
   */
  private async processTemplateChanges(
    templatePaths: string[],
    lastScan: number
  ): Promise<TemplateProcessingResults> {
    const newTemplates: TemplateMetadata[] = [];
    const modifiedTemplates: TemplateMetadata[] = [];
    const deletedTemplates = this.findDeletedTemplates(templatePaths);

    // Check for new and modified templates
    for (const templatePath of templatePaths) {
      await processTemplatePath(
        templatePath,
        lastScan,
        { newTemplates, modifiedTemplates },
        this.indexManager
      );
    }

    return { newTemplates, modifiedTemplates, deletedTemplates };
  }

  /**
   * Find templates that were deleted since last scan
   * @param templatePaths - Current template paths found in directory
   * @returns Array of deleted template IDs
   */
  private findDeletedTemplates(templatePaths: string[]): string[] {
    const deletedTemplates: string[] = [];
    const indexedTemplates = this.indexManager.getAllTemplates();
    const currentPaths = new Set(templatePaths);

    // Check for deleted templates (templates in index but not in file system)
    for (const indexedTemplate of indexedTemplates) {
      // Create both absolute and relative paths for comparison
      const indexedPath = indexedTemplate.filePath;
      const absoluteIndexedPath = path.resolve(indexedPath);
      const relativeIndexedPath = path.relative(process.cwd(), absoluteIndexedPath);

      // Check if the template exists in any of the path formats
      const exists =
        currentPaths.has(indexedPath) ||
        currentPaths.has(absoluteIndexedPath) ||
        currentPaths.has(relativeIndexedPath);

      if (!exists) {
        deletedTemplates.push(indexedTemplate.id);
      }
    }

    return deletedTemplates;
  }

  /**
   * Index templates for fast search
   * @param templates - Array of templates to index
   */
  async index(templates: TemplateMetadata[]): Promise<void> {
    await this.indexManager.indexTemplates(templates);
  }

  /**
   * Refresh template index
   * @param templatesDirectory - Directory containing templates
   * @returns Refreshed array of templates
   */
  async refreshIndex(templatesDirectory: string): Promise<TemplateMetadata[]> {
    console.log('Refreshing template index...');

    this.indexManager.clearIndex();
    const templates = await this.discover(templatesDirectory);

    for (const template of templates) {
      this.indexManager.addTemplate(template);
    }

    console.log(`Index refreshed with ${templates.length} templates`);
    return templates;
  }

  /**
   * Get discovery statistics
   * @returns Statistics about the discovery process
   */
  async getStatistics(): Promise<{
    totalTemplates: number;
    categories: string[];
    projectTypes: string[];
    tags: string[];
    authors: string[];
    indexSize: number;
  }> {
    const allTemplates = this.indexManager.getAllTemplates();
    const categories = [...new Set(allTemplates.map((t) => t.category || 'other'))];
    const projectTypes = [...new Set(allTemplates.flatMap((t) => t.supportedProjectTypes))];
    const tags = [...new Set(allTemplates.flatMap((t) => t.tags || []))];
    const authors = [...new Set(allTemplates.map((t) => t.author).filter(Boolean))];

    return {
      totalTemplates: allTemplates.length,
      categories,
      projectTypes,
      tags,
      authors,
      indexSize: this.indexManager.getIndexSize(),
    };
  }
}
