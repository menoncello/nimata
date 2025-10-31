/**
 * Prettier File Generators
 *
 * Functions to generate specific Prettier configuration files
 */
import { FORMATTING } from '../utils/constants.js';
import type { PrettierConfigOptions, GeneratedPrettierConfig } from './prettier-types.js';

/**
 * Generate main Prettier configuration
 * @param {PrettierConfigOptions} _options - Configuration options (unused but kept for consistency)
 * @returns {PrettierConfigOptions): GeneratedPrettierConfig} Generated configuration file
 */
export function generateMainConfig(_options: PrettierConfigOptions): GeneratedPrettierConfig {
  const filename = '.prettierrc.json';
  const content = ''; // This will be filled by the main class

  return {
    filename,
    content,
    description: 'Main Prettier configuration with formatting rules',
  };
}

/**
 * Generate Prettier ignore file
 * @returns {GeneratedPrettierConfig} Generated ignore file
 */
export function generateIgnoreFile(): GeneratedPrettierConfig {
  const filename = '.prettierignore';
  const content = [
    getDependencyPatterns(),
    getBuildPatterns(),
    getCoveragePatterns(),
    getLogPatterns(),
    getEnvironmentPatterns(),
    getIdePatterns(),
    getOsPatterns(),
    getTempPatterns(),
    getRuntimePatterns(),
    getDocumentationPatterns(),
    getConfigPatterns(),
    getPackagePatterns(),
    getGeneratedPatterns(),
    getChangelogPatterns(),
    getMarkdownPatterns(),
  ].join('\n\n');

  return {
    filename,
    content,
    description: 'Prettier ignore file patterns',
  };
}

/**
 * Get dependency ignore patterns
 * @returns {string} Dependency patterns string
 */
function getDependencyPatterns(): string {
  return `# Dependencies
node_modules/`;
}

/**
 * Get build output ignore patterns
 * @returns {string} Build patterns string
 */
function getBuildPatterns(): string {
  return `# Build outputs
dist/
build/
*.tsbuildinfo`;
}

/**
 * Get coverage report ignore patterns
 * @returns {string} Coverage patterns string
 */
function getCoveragePatterns(): string {
  return `# Coverage reports
coverage/
*.lcov`;
}

/**
 * Get log file ignore patterns
 * @returns {string} Log patterns string
 */
function getLogPatterns(): string {
  return `# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*`;
}

/**
 * Get environment file ignore patterns
 * @returns {string} Environment patterns string
 */
function getEnvironmentPatterns(): string {
  return `# Environment files
.env*
!.env.example`;
}

/**
 * Get IDE ignore patterns
 * @returns {string} IDE patterns string
 */
function getIdePatterns(): string {
  return `# IDE
.vscode/
.idea/
*.swp
*.swo`;
}

/**
 * Get OS ignore patterns
 * @returns {string} OS patterns string
 */
function getOsPatterns(): string {
  return `# OS
.DS_Store
Thumbs.db`;
}

/**
 * Get temporary file ignore patterns
 * @returns {string} Temp patterns string
 */
function getTempPatterns(): string {
  return `# Temporary files
*.tmp
.tmp/`;
}

/**
 * Get runtime ignore patterns
 * @returns {string} Runtime patterns string
 */
function getRuntimePatterns(): string {
  return `# Runtime
.cache/
.temp/`;
}

/**
 * Get documentation ignore patterns
 * @returns {string} Documentation patterns string
 */
function getDocumentationPatterns(): string {
  return `# Documentation
docs/build/
site/public/`;
}

/**
 * Get configuration file ignore patterns
 * @returns {string} Config patterns string
 */
function getConfigPatterns(): string {
  return `# Configuration files that shouldn't be reformatted
*.config.js
*.config.mjs
*.config.ts`;
}

/**
 * Get package file ignore patterns
 * @returns {string} Package patterns string
 */
function getPackagePatterns(): string {
  return `# Package files
package-lock.json
yarn.lock`;
}

/**
 * Get generated file ignore patterns
 * @returns {string} Generated patterns string
 */
function getGeneratedPatterns(): string {
  return `# Generated files
generated/
*.generated.ts
*.generated.js`;
}

/**
 * Get changelog ignore patterns
 * @returns {string} Changelog patterns string
 */
function getChangelogPatterns(): string {
  return `# Changelogs
CHANGELOG.md`;
}

/**
 * Get markdown ignore patterns
 * @returns {string} Markdown patterns string
 */
function getMarkdownPatterns(): string {
  return `# Markdown files with specific formatting
*.md
!README.md`;
}

/**
 * Generate Editor configuration
 * @param {PrettierConfigOptions} options - Configuration options
 * @returns {PrettierConfigOptions): GeneratedPrettierConfig} Generated editor configuration file
 */
export function generateEditorConfig(options: PrettierConfigOptions): GeneratedPrettierConfig {
  const filename = '.editorconfig';
  const content = [
    getEditorConfigHeader(),
    getGlobalConfig(),
    getTypeScriptConfig(options),
    getJsonConfig(),
    getYamlConfig(),
    getMarkdownConfig(),
    getPackageConfig(),
    getAdditionalConfig(),
  ].join('\n\n');

  return {
    filename,
    content,
    description: 'Editor configuration for consistent formatting across editors',
  };
}

/**
 * Get EditorConfig header
 * @returns {string} Header section string
 */
function getEditorConfigHeader(): string {
  return `# EditorConfig is awesome: https://EditorConfig.org

# top-most EditorConfig file
root = true`;
}

/**
 * Get global EditorConfig settings
 * @returns {string} Global config section string
 */
function getGlobalConfig(): string {
  return `# Unix-style newlines with a newline ending every file
[*]
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true
charset = utf-8`;
}

/**
 * Get TypeScript and JavaScript configuration
 * @param {PrettierConfigOptions} options - Configuration options
 * @returns {PrettierConfigOptions): string} TypeScript config section string
 */
function getTypeScriptConfig(options: PrettierConfigOptions): string {
  return `# TypeScript and JavaScript files
[*.{ts,js,mjs,cjs}]
indent_style = space
indent_size = ${options.tabWidth}
${options.semi ? '' : '# '}semicolon = ${options.semi}
${options.singleQuote ? '' : '# '}quote_type = ${options.singleQuote ? 'single' : 'double'}`;
}

/**
 * Get JSON configuration
 * @returns {string} JSON config section string
 */
function getJsonConfig(): string {
  return `# JSON files
[*.json]
indent_style = space
indent_size = ${FORMATTING.TAB_WIDTH}`;
}

/**
 * Get YAML configuration
 * @returns {string} YAML config section string
 */
function getYamlConfig(): string {
  return `# YAML files
[*.{yml,yaml}]
indent_style = space
indent_size = ${FORMATTING.TAB_WIDTH}`;
}

/**
 * Get Markdown configuration
 * @returns {string} Markdown config section string
 */
function getMarkdownConfig(): string {
  return `# Markdown files
[*.md]
trim_trailing_whitespace = false`;
}

/**
 * Get package.json configuration
 * @returns {string} Package config section string
 */
function getPackageConfig(): string {
  return `# Package files
[package.json]
indent_style = space
indent_size = ${FORMATTING.TAB_WIDTH}`;
}

/**
 * Get additional configuration files
 * @returns {string} Additional config section string
 */
function getAdditionalConfig(): string {
  return `# Configuration files
[*.{config.js,config.mjs,config.ts}]
indent_style = space
indent_size = ${FORMATTING.TAB_WIDTH}`;
}
