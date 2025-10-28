/**
 * Simple template metadata parsing utilities
 */

/**
 * Template metadata interface
 */
export interface SimpleTemplateMetadata {
  name?: string;
  description?: string;
  category?: string;
  tags?: string[];
}

/**
 * Simple template metadata parser
 */
export class SimpleTemplateMetadataParser {
  /**
   * Parse metadata from template content
   * @param content - The template content to parse
   * @returns The parsed metadata
   */
  static parseMetadata(content: string): SimpleTemplateMetadata {
    const metadata: SimpleTemplateMetadata = {};

    this.parseJsonMetadata(content, metadata);
    this.parseYamlMetadata(content, metadata);

    return metadata;
  }

  /**
   * Parse JSON metadata from content
   * @param content - Template content
   * @param metadata - Metadata object to update with parsed values
   * @param metadata.name - Template name property to update
   * @param metadata.description - Template description property to update
   * @param metadata.category - Template category property to update
   * @param metadata.tags - Template tags property to update
   */
  private static parseJsonMetadata(content: string, metadata: SimpleTemplateMetadata): void {
    if (!content.trim().startsWith('{')) {
      return;
    }

    try {
      const jsonData = JSON.parse(content);
      if (jsonData.name) metadata.name = jsonData.name;
      if (jsonData.description) metadata.description = jsonData.description;
      if (jsonData.category) metadata.category = jsonData.category;
      if (Array.isArray(jsonData.tags)) metadata.tags = jsonData.tags;
    } catch {
      // Not valid JSON, ignore
    }
  }

  /**
   * Parse YAML metadata from content
   * @param content - Template content to parse
   * @param metadata - Metadata object to update with parsed values
   * @param metadata.name - Template name property to update
   * @param metadata.description - Template description property to update
   * @param metadata.category - Template category property to update
   * @param metadata.tags - Template tags property to update
   */
  private static parseYamlMetadata(content: string, metadata: SimpleTemplateMetadata): void {
    const yamlMatch = content.match(/^(---\n([\S\s]*?)\n---)/);
    if (!yamlMatch) {
      return;
    }

    const yamlContent = yamlMatch[1];
    const lines = yamlContent.split('\n');

    for (const line of lines) {
      this.parseYamlLine(line, metadata);
    }
  }

  /**
   * Parse a single YAML line
   * @param line - YAML line to parse
   * @param metadata - Metadata object to update with parsed values
   * @param metadata.name - Template name property to update
   * @param metadata.description - Template description property to update
   * @param metadata.category - Template category property to update
   * @param metadata.tags - Template tags property to update
   */
  private static parseYamlLine(line: string, metadata: SimpleTemplateMetadata): void {
    const colonIndex = line.indexOf(':');
    if (colonIndex <= 0) {
      return;
    }

    const key = line.slice(0, colonIndex).trim();
    const value = this.extractYamlValue(line, colonIndex);

    this.updateMetadataFromYaml(key, value, metadata);
  }

  /**
   * Extract value from YAML line
   * @param line - YAML line
   * @param colonIndex - Position of colon
   * @returns Extracted value
   */
  private static extractYamlValue(line: string, colonIndex: number): string {
    let value = line.slice(colonIndex + 1).trim();

    // Remove quotes if present
    if (this.isQuoted(value)) {
      value = value.slice(1, -1);
    }

    return value;
  }

  /**
   * Check if string is quoted
   * @param value - String to check
   * @returns True if string is quoted
   */
  private static isQuoted(value: string): boolean {
    return (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    );
  }

  /**
   * Update metadata from parsed YAML key-value pair
   * @param key - YAML key to process
   * @param value - YAML value to process
   * @param metadata - Metadata object to update with parsed values
   * @param metadata.name - Template name property to update
   * @param metadata.description - Template description property to update
   * @param metadata.category - Template category property to update
   * @param metadata.tags - Template tags property to update
   */
  private static updateMetadataFromYaml(
    key: string,
    value: string,
    metadata: SimpleTemplateMetadata
  ): void {
    switch (key) {
      case 'name':
        metadata.name = value;
        break;
      case 'description':
        metadata.description = value;
        break;
      case 'category':
        metadata.category = value;
        break;
      case 'tags':
        metadata.tags = this.parseYamlTags(value);
        break;
    }
  }

  /**
   * Parse YAML tags array
   * @param value - YAML tags string
   * @returns Array of tags
   */
  private static parseYamlTags(value: string): string[] {
    if (!value.startsWith('[') || !value.endsWith(']')) {
      return [];
    }

    return value
      .slice(1, -1)
      .split(',')
      .map((t) => t.trim().replace(/["']/g, ''));
  }
}
