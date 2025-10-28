/**
 * Template Metadata Parser Core
 *
 * Core functionality for parsing template metadata from different file formats
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import type { TemplateMetadata } from '@nimata/core';
import { TemplateFormatParsers } from './template-format-parsers.js';
import { TemplateMetadataBuilder } from './template-metadata-builder.js';

/**
 * Constants for template parsing
 */
const PARSER_CONSTANTS = {
  DEFAULT_VERSION: '1.0.0',
  DEFAULT_CATEGORY: 'cli',
  DEFAULT_QUALITY_LEVELS: ['light'],
  DEFAULT_PROJECT_TYPES: ['cli'],
  JSON_SNIPPET_LENGTH: 200,
  YAML_SNIPPET_LENGTH: 200,
  HANDLEBARS_SNIPPET_LENGTH: 200,
} as const;

/**
 * Common error message
 */
const UNKNOWN_ERROR_MSG = 'Unknown error occurred during template parsing';

/**
 * Template metadata parser utility class
 */
export class TemplateMetadataParser {
  /**
   * Extract template metadata from file
   * @param filePath The path to the template file
   * @returns The template metadata or null if extraction fails
   */
  static async extractTemplateMetadata(filePath: string): Promise<TemplateMetadata | null> {
    try {
      const stats = await fs.stat(filePath);
      const content = await fs.readFile(filePath, 'utf-8');
      const ext = path.extname(filePath).toLowerCase();

      const metadata = TemplateFormatParsers.parseTemplateContent(content, ext, filePath);
      if (!metadata) {
        return null;
      }

      return TemplateMetadataBuilder.completeTemplateMetadata({
        metadata,
        filePath,
        stats,
        content,
        ext,
      });
    } catch (error) {
      console.warn(`Failed to extract metadata from ${filePath}:`, error);
      return null;
    }
  }
}

/**
 * Export constants for use in other modules
 */
export { PARSER_CONSTANTS, UNKNOWN_ERROR_MSG };
