/**
 * Template Discovery Implementation
 *
 * Main entry point for template discovery, scanning, and indexing operations.
 * This class coordinates between different discovery components.
 */
import type {
  TemplateMetadata,
  TemplateDiscovery as ITemplateDiscovery,
  TemplateCatalogConfig,
  ProjectType,
} from '@nimata/core';
import { discoverFromSource, type WatcherConfig } from './template-discovery-utils.js';
import { TemplateIndexManager } from './template-index-manager.js';
import { TemplateScanner } from './template-scanner.js';
import { TemplateWatcher } from './template-watcher.js';

/**
 * Template discovery implementation that coordinates between different discovery components
 */
export class TemplateDiscovery implements ITemplateDiscovery {
  private config: TemplateCatalogConfig;
  private indexManager: TemplateIndexManager;
  private scanner: TemplateScanner;
  private watcher: TemplateWatcher;
  private watcherConfig: WatcherConfig;

  /**
   * Create template discovery instance
   * @param {TemplateCatalogConfig} config - Template catalog configuration containing sources and templates directory
   */
  constructor(config: TemplateCatalogConfig) {
    this.config = config;
    this.indexManager = new TemplateIndexManager();
    this.scanner = new TemplateScanner(this.indexManager);
    this.watcherConfig = {
      enabled: true,
      debounceMs: 500,
      ignoredFiles: ['.DS_Store', 'Thumbs.db', '*.tmp', '*.bak'],
      ignoredDirectories: ['node_modules', '.git', '.turbo', 'dist', 'build'],
    };
    this.watcher = new TemplateWatcher(this.watcherConfig);
  }

  /**
   * Discover templates from file system
   * @param {string} directory - Directory path to scan for templates
   * @returns {void} Array of discovered template metadata
   */
  async discover(directory: string): Promise<TemplateMetadata[]> {
    return this.scanner.discover(directory);
  }

  /**
   * Scan for new or modified templates
   * @param {string} directory - Directory to scan
   * @returns {string): Promise<} Scan results with new, modified, and deleted templates
   */
  async scan(directory: string): Promise<{
    newTemplates: TemplateMetadata[];
    modifiedTemplates: TemplateMetadata[];
    deletedTemplates: string[];
  }> {
    return this.scanner.scan(directory);
  }

  /**
   * Watch for template changes
   * @param {unknown} directory - Directory to watch
   * @param {(event} callback - Callback function for change events
   * @returns {void} Function to stop watching
   */
  watch(
    directory: string,
    callback: (event: 'added' | 'modified' | 'deleted', template: TemplateMetadata) => void
  ): () => void {
    return this.watcher.watch(directory, callback);
  }

  /**
   * Index templates for fast search
   * @param {TemplateMetadata[]} templates - Array of templates to index
   * @returns {void} Promise that resolves when indexing is complete
   */
  async index(templates: TemplateMetadata[]): Promise<void> {
    return this.scanner.index(templates);
  }

  /**
   * Get template by ID
   * @param {string} templateId - Template ID to search for
   * @returns {void} Template metadata or null if not found
   */
  async getTemplateById(templateId: string): Promise<TemplateMetadata | null> {
    return this.indexManager.getTemplateById(templateId);
  }

  /**
   * Get templates by category
   * @param {string} category - Category filter to apply
   * @returns {void} Array of templates matching the category
   */
  async getTemplatesByCategory(category: string): Promise<TemplateMetadata[]> {
    return this.indexManager.getTemplatesByCategory(category);
  }

  /**
   * Get templates by project type
   * @param {ProjectType} projectType - Project type filter to apply
   * @returns {void} Array of templates supporting the specified project type
   */
  async getTemplatesByProjectType(projectType: ProjectType): Promise<TemplateMetadata[]> {
    return this.indexManager.getTemplatesByProjectType(projectType);
  }

  /**
   * Search templates with filters
   * @param {string} query - Search query string
   * @param {{ category?: string; projectType?: ProjectType; tags?: string[]; author?: string; }} filters - Search filters
   * @param {string | undefined} filters.category - Category filter
   * @param {ProjectType | undefined} filters.projectType - Project type filter
   * @param {string[] | undefined} filters.tags - Tags filter
   * @param {string | undefined} filters.author - Author filter
   * @returns {Promise<TemplateMetadata[]>} Array of templates matching the search criteria
   */
  async searchTemplates(
    query: string,
    filters: {
      category?: string;
      projectType?: ProjectType;
      tags?: string[];
      author?: string;
    } = {}
  ): Promise<TemplateMetadata[]> {
    return this.indexManager.search(query, filters);
  }

  /**
   * Refresh template index by rediscovering all templates
   * @returns {void} Refreshed array of all available templates
   */
  async refreshIndex(): Promise<TemplateMetadata[]> {
    return this.scanner.refreshIndex(this.config.templatesDirectory);
  }

  /**
   * Watch for template changes across all configured sources
   * @param {(event} callback - Callback function for change events
   * @returns {void} Promise that resolves when watching is set up
   */
  async watchTemplates(
    callback: (event: string, template: TemplateMetadata) => void
  ): Promise<void> {
    await this.watcher.watchTemplates(this.config.sources, callback);
  }

  /**
   * Stop watching for changes across all sources
   * @returns {void} Promise that resolves when all watchers are stopped
   */
  async stopWatching(): Promise<void> {
    await this.watcher.stopWatching();
  }

  /**
   * Get comprehensive discovery statistics
   * @returns {Promise<} Object containing statistics about templates, categories, project types, and index size
   */
  async getStatistics(): Promise<{
    totalTemplates: number;
    categories: string[];
    projectTypes: string[];
    tags: string[];
    authors: string[];
    indexSize: number;
  }> {
    return this.scanner.getStatistics();
  }

  /**
   * Discover templates from a single source configuration
   * @param {{ }} source - Template source configuration containing path and recursion settings
   * @param {{ }} source.path - Source path to discover templates from
   * @param {{ }} source.recursive - Whether to search recursively in subdirectories
   * @returns {void} Array of discovered templates from the specified source
   */
  private async discoverFromSource(source: {
    path: string;
    recursive?: boolean;
  }): Promise<TemplateMetadata[]> {
    return discoverFromSource(source, this.indexManager);
  }

  /**
   * Get index statistics (alias for getStatistics)
   * @returns {Promise<} Index statistics object
   */
  async getIndexStats(): Promise<{
    totalTemplates: number;
    categories: string[];
    projectTypes: string[];
    tags: string[];
    authors: string[];
    indexSize: number;
  }> {
    return this.getStatistics();
  }

  /**
   * Search templates by query string (alias for searchTemplates)
   * @param {string} query - Search query string
   * @returns {void} Search results with matching templates
   */
  async searchByQuery(query: string): Promise<TemplateMetadata[]> {
    return this.searchTemplates(query);
  }

  /**
   * Get templates by category (alias for getTemplatesByCategory)
   * @param {string} category - Category to filter by
   * @returns {void} Array of templates in the category
   */
  async getByCategory(category: string): Promise<TemplateMetadata[]> {
    return this.getTemplatesByCategory(category);
  }

  /**
   * Get templates by project type (alias for getTemplatesByProjectType)
   * @param {ProjectType} projectType - Project type to filter by
   * @returns {void} Array of templates for the project type
   */
  async getByProjectType(projectType: ProjectType): Promise<TemplateMetadata[]> {
    return this.getTemplatesByProjectType(projectType);
  }

  /**
   * Get templates by tag
   * @param {string} tag - Tag to filter by
   * @returns {void} Array of templates with the specified tag
   */
  async getByTag(tag: string): Promise<TemplateMetadata[]> {
    const allTemplates = await this.indexManager.getAllTemplates();
    return allTemplates.filter((template) =>
      template.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
    );
  }

  /**
   * Get templates by author
   * @param {string} author - Author to filter by
   * @returns {void} Array of templates by the specified author
   */
  async getByAuthor(author: string): Promise<TemplateMetadata[]> {
    const allTemplates = await this.indexManager.getAllTemplates();
    return allTemplates.filter((template) =>
      template.author?.toLowerCase().includes(author.toLowerCase())
    );
  }
}
