/**
 * Tech Stack Search Utilities
 *
 * Utility functions for searching and filtering tech stacks
 */
import type { TechStackDefinition, ProjectType } from '@nimata/core';
import type { TechStackSearchResult, TechStackMetadata } from './tech-stack-types.js';
import { sortTechStacksByPriority } from './tech-stack-utils.js';

/**
 * Applies text search to results
 * @param results - Initial results
 * @param query - Search query
 * @returns Filtered results
 */
export function applyTextSearch(
  results: TechStackDefinition[],
  query: string
): TechStackDefinition[] {
  if (!query) {
    return results;
  }

  const lowerQuery = query.toLowerCase();
  return results.filter(
    (stack) =>
      stack.name.toLowerCase().includes(lowerQuery) ||
      stack.description.toLowerCase().includes(lowerQuery) ||
      (stack.metadata?.tags as string[])?.some((tag: string) =>
        tag.toLowerCase().includes(lowerQuery)
      )
  );
}

/**
 * Applies filters to search results
 * @param results - Results to filter
 * @param filters - Filters to apply
 * @param filters.projectTypes - Project types to filter by
 * @param filters.categories - Categories to filter by
 * @param filters.tags - Tags to filter by
 * @returns Filtered results
 */
export function applyFilters(
  results: TechStackDefinition[],
  filters?: {
    projectTypes?: ProjectType[];
    categories?: string[];
    tags?: string[];
  }
): TechStackDefinition[] {
  if (!filters) {
    return results;
  }

  let filteredResults = results;

  if (filters.projectTypes && filters.projectTypes.length > 0) {
    filteredResults = filteredResults.filter((stack) =>
      filters.projectTypes.some((type) => stack.supportedProjectTypes.includes(type))
    );
  }

  if (filters.categories && filters.categories.length > 0) {
    // Manually filter by category since TechStackDefinition doesn't have a category property
    filteredResults = filteredResults.filter((stack) =>
      filters.categories.includes((stack.metadata?.category as string) || '')
    );
  }

  if (filters.tags && filters.tags.length > 0) {
    filteredResults = filteredResults.filter((stack) =>
      filters.tags.some((tag) => (stack.metadata?.tags as string[])?.includes(tag))
    );
  }

  return filteredResults;
}

/**
 * Transforms tech stack definitions to metadata format
 * @param results - Results to transform
 * @returns Transformed metadata
 */
export function transformToTechStackMetadata(results: TechStackDefinition[]): TechStackMetadata[] {
  return results.map((stack) => ({
    id: stack.id,
    name: stack.name,
    version: stack.version,
    description: stack.description,
    keywords: (stack.metadata?.tags as string[]) || [],
    createdAt: new Date(),
    updatedAt: new Date(),
    downloadCount: 0,
    rating: 0,
    popularity: 0,
  }));
}

/**
 * Sorts search results
 * @param results - Results to sort
 * @returns Sorted results
 */
export function sortResults(results: TechStackDefinition[]): TechStackDefinition[] {
  // Add priority from metadata to each stack for sorting
  const stacksWithPriority = results.map((stack) => ({
    ...stack,
    priority: (stack.metadata?.priority as number) || undefined,
  }));
  const sortedByPriority = sortTechStacksByPriority(stacksWithPriority);
  return sortedByPriority.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Creates search results object
 * @param stacks - Search results
 * @param query - Search query
 * @param filters - Applied filters
 * @param executionTime - Time taken to execute search
 * @returns Formatted search results
 */
export function createSearchResults(
  stacks: TechStackDefinition[],
  query: string,
  filters: Record<string, unknown>,
  executionTime: number
): TechStackSearchResult {
  return {
    stacks: transformToTechStackMetadata(stacks),
    total: stacks.length,
    query,
    filters: filters,
    executionTime,
  };
}
