/**
 * AI Manifest Section Builders
 *
 * Utility functions for building AI manifest sections
 */

import { AIContextConfigOptions } from '../types/config-types.js';
import { JSON_SERIALIZATION } from './constants.js';

/**
 * Build AI manifest content
 * @param options - Configuration options for AI context generation
 * @param getCoverageThreshold - Function to get coverage threshold
 * @returns Generated AI manifest content as JSON string
 */
export function buildAIManifestContent(
  options: AIContextConfigOptions,
  getCoverageThreshold: (qualityLevel: string) => number
): string {
  const manifest = createManifestObject(options, getCoverageThreshold);
  return JSON.stringify(manifest, null, JSON_SERIALIZATION.PRETTY_INDENT);
}

/**
 * Create the manifest object for AI configuration
 * @param options - Configuration options for AI context generation
 * @param getCoverageThreshold - Function to get coverage threshold
 * @returns Complete manifest object
 */
function createManifestObject(
  options: AIContextConfigOptions,
  getCoverageThreshold: (qualityLevel: string) => number
): Record<string, unknown> {
  return {
    version: '1.0.0',
    project: buildManifestProjectSection(options),
    assistants: options.aiAssistants,
    contexts: buildManifestContextsSection(options),
    configuration: buildManifestConfigurationSection(options, getCoverageThreshold),
    generated: new Date().toISOString(),
  };
}

/**
 * Build the project section of the manifest
 * @param options - Configuration options for AI context generation
 * @returns Project section object
 */
function buildManifestProjectSection(options: AIContextConfigOptions): Record<string, unknown> {
  return {
    name: options.projectName,
    description: options.projectDescription || '',
    type: options.projectType,
    qualityLevel: options.qualityLevel,
    environment: options.targetEnvironment,
  };
}

/**
 * Build the contexts section of the manifest
 * @param options - Configuration options for AI context generation
 * @returns Contexts section object
 */
function buildManifestContextsSection(
  options: AIContextConfigOptions
): Record<string, string | null> {
  const CLI_CONTEXT_FILENAME = '.ai/claude-context.md';
  const COPILOT_CONTEXT_FILENAME = '.ai/copilot-context.md';
  const CLAUDE_CODE_ASSISTANT = 'claude-code';
  const COPILOT_ASSISTANT = 'copilot';

  return {
    unified: '.ai/context.md',
    claude: options.aiAssistants.includes(CLAUDE_CODE_ASSISTANT) ? CLI_CONTEXT_FILENAME : null,
    copilot: options.aiAssistants.includes(COPILOT_ASSISTANT) ? COPILOT_CONTEXT_FILENAME : null,
  };
}

/**
 * Build the configuration section of the manifest
 * @param options - Configuration options for AI context generation
 * @param getCoverageThreshold - Function to get coverage threshold
 * @returns Configuration section object
 */
function buildManifestConfigurationSection(
  options: AIContextConfigOptions,
  getCoverageThreshold: (qualityLevel: string) => number
): Record<string, unknown> {
  return {
    codeStyle: options.codeStyle,
    testing: buildTestingConfiguration(options, getCoverageThreshold),
    frameworks: options.frameworks,
    quality: buildQualityConfiguration(options),
  };
}

/**
 * Build the testing configuration
 * @param options - Configuration options for AI context generation
 * @param getCoverageThreshold - Function to get coverage threshold
 * @returns Testing configuration object
 */
function buildTestingConfiguration(
  options: AIContextConfigOptions,
  getCoverageThreshold: (qualityLevel: string) => number
): Record<string, unknown> {
  return {
    enabled: options.testing,
    framework: 'vitest',
    coverage: getCoverageThreshold(options.qualityLevel),
  };
}

/**
 * Build the quality configuration
 * @param options - Configuration options for AI context generation
 * @returns Quality configuration object
 */
function buildQualityConfiguration(options: AIContextConfigOptions): Record<string, unknown> {
  return {
    level: options.qualityLevel,
    eslint: { strict: true },
    typescript: { strict: true },
    prettier: true,
  };
}
