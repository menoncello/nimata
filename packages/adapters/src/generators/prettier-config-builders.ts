/**
 * Prettier Configuration Builders
 *
 * Helper functions for building Prettier configuration content
 */
import { FORMATTING, TEXT_LIMITS, JSON_SERIALIZATION } from '../utils/constants.js';
import { PRETTIER_CONSTANTS } from './prettier-constants.js';
import type { PrettierConfigOptions } from './prettier-types.js';

/**
 * Build main Prettier configuration content
 * @param {PrettierConfigOptions} options - Configuration options
 * @returns {PrettierConfigOptions): string} Generated configuration string
 */
export function buildMainConfigContent(options: PrettierConfigOptions): string {
  const config = {
    semi: options.semi,
    trailingComma: options.trailingComma,
    singleQuote: options.singleQuote,
    printWidth: options.printWidth,
    tabWidth: options.tabWidth,
    useTabs: false,
    quoteProps: 'as-needed' as const,
    bracketSpacing: true,
    bracketSameLine: false,
    arrowParens: 'avoid' as const,
    endOfLine: 'lf' as const,
    embeddedLanguageFormatting: 'auto' as const,
    plugins: getPlugins(options),
  };

  // Add TypeScript-specific options
  if (options.enableTypeScript) {
    Object.assign(config, {
      parser: 'typescript',
      requirePragma: false,
      insertPragma: false,
      proseWrap: 'preserve' as const,
      htmlWhitespaceSensitivity: 'css' as const,
      vueIndentScriptAndStyle: false,
      overrides: getOverrides(options),
    });
  }

  return JSON.stringify(config, null, JSON_SERIALIZATION.PRETTY_INDENT);
}

/**
 * Get plugins based on project type
 * @param {PrettierConfigOptions} options - Configuration options
 * @returns {PrettierConfigOptions): string[]} Array of plugin names
 */
export function getPlugins(options: PrettierConfigOptions): string[] {
  const plugins: string[] = [];

  if (options.enableTypeScript) {
    plugins.push('@prettier/plugin-typescript');
  }

  if (options.projectType === 'web') {
    plugins.push('@prettier/plugin-html', 'prettier-plugin-css');
  }

  if (options.projectType === 'library') {
    plugins.push('prettier-plugin-packagejson');
  }

  return plugins;
}

/**
 * Get file-specific overrides
 * @param {PrettierConfigOptions} options - Configuration options
 * @returns {void} Array of override configurations
 */
export function getOverrides(options: PrettierConfigOptions): Array<Record<string, unknown>> {
  const overrides: Array<Record<string, unknown>> = [
    ...getBasicOverrides(),
    ...getWebSpecificOverrides(options.projectType),
  ];

  return overrides;
}

/**
 * Get basic file type overrides
 * @returns {void} Array of basic override configurations
 */
function getBasicOverrides(): Array<Record<string, unknown>> {
  return [getJsonOverride(), getMarkdownOverride(), getYamlOverride(), getConfigOverride()];
}

/**
 * Get JSON file override configuration
 * @returns {void} JSON override configuration
 */
function getJsonOverride(): Record<string, unknown> {
  return {
    files: '*.{json,jsonc}',
    options: {
      printWidth: PRETTIER_CONSTANTS.JSON_PRINT_WIDTH,
      tabWidth: FORMATTING.TAB_WIDTH,
      trailingComma: 'none',
    },
  };
}

/**
 * Get Markdown file override configuration
 * @returns {void} Markdown override configuration
 */
function getMarkdownOverride(): Record<string, unknown> {
  return {
    files: '*.md',
    options: {
      printWidth: TEXT_LIMITS.MAX_LINE_LENGTH,
      proseWrap: 'always',
      tabWidth: FORMATTING.TAB_WIDTH,
    },
  };
}

/**
 * Get YAML file override configuration
 * @returns {void} YAML override configuration
 */
function getYamlOverride(): Record<string, unknown> {
  return {
    files: '*.{yml,yaml}',
    options: {
      tabWidth: FORMATTING.TAB_WIDTH,
      singleQuote: false,
      trailingComma: 'none',
    },
  };
}

/**
 * Get configuration file override
 * @returns {void} Configuration file override
 */
function getConfigOverride(): Record<string, unknown> {
  return {
    files: '*.{config.js,config.mjs,config.ts}',
    options: {
      printWidth: TEXT_LIMITS.MAX_LINE_LENGTH,
      tabWidth: FORMATTING.TAB_WIDTH,
    },
  };
}

/**
 * Get web project specific overrides
 * @param {string} projectType - Project type
 * @returns {void} Array of web-specific override configurations
 */
function getWebSpecificOverrides(projectType: string): Array<Record<string, unknown>> {
  if (projectType !== 'web') {
    return [];
  }

  return [
    // HTML files
    {
      files: ['*.html', '*.htm'],
      options: {
        printWidth: PRETTIER_CONSTANTS.HTML_PRINT_WIDTH,
        tabWidth: FORMATTING.TAB_WIDTH,
        singleQuote: false,
      },
    },
    // CSS files
    {
      files: ['*.css', '*.scss', '*.sass', '*.less'],
      options: {
        singleQuote: false,
        tabWidth: FORMATTING.TAB_WIDTH,
      },
    },
  ];
}

/**
 * Get trailing comma style based on quality level
 * @param {string} qualityLevel - Quality level string
 * @returns {string): 'none' | 'es5' | 'all'} Trailing comma style
 */
export function getTrailingCommaStyle(qualityLevel: string): 'none' | 'es5' | 'all' {
  switch (qualityLevel) {
    case 'light':
      return 'none';
    case 'medium':
      return 'es5';
    case 'strict':
      return 'all';
    default:
      return 'es5';
  }
}

/**
 * Get print width based on quality level
 * @param {string} qualityLevel - Quality level string
 * @returns {string): number} Print width number
 */
export function getPrintWidth(qualityLevel: string): number {
  switch (qualityLevel) {
    case 'light':
      return PRETTIER_CONSTANTS.PRINT_WIDTH.LIGHT;
    case 'medium':
      return TEXT_LIMITS.MAX_LINE_LENGTH;
    case 'strict':
      return PRETTIER_CONSTANTS.PRINT_WIDTH.STRICT;
    default:
      return TEXT_LIMITS.MAX_LINE_LENGTH;
  }
}

/**
 * Get target environment based on project type
 * @param {string} projectType - Project type string
 * @returns {string): 'node' | 'browser' | 'both'} Target environment
 */
export function getTargetEnvironment(projectType: string): 'node' | 'browser' | 'both' {
  switch (projectType) {
    case 'web':
      return 'browser';
    case 'cli':
      return 'node';
    case 'library':
      return 'both';
    default:
      return 'node';
  }
}
