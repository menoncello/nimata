/**
 * Entry Points Generator
 *
 * Generates main entry point files for different project types
 */
import { promises as fs } from 'node:fs';
import { join } from 'node:path';
import type { ProjectConfig } from '../../../types/project-config.js';
import { DirectoryItem, CoreFileOperations } from './core-file-operations.js';

// File name constants
const MAIN_ENTRY_FILE = 'src/index.ts';

// File permission constants
const DEFAULT_FILE_PERMISSIONS = 0o644;
const DEFAULT_EXECUTABLE_PERMISSIONS = 0o755;

/**
 * Handles entry point file generation
 */
export class EntryPointsGenerator {
  /**
   * Generate main entry point file (src/index.ts)
   * @param {string} basePath - Base project path
   * @param {string} projectName - Name of the project
   * @throws Error if file creation fails or path validation fails
   */
  static async generateMainEntryPoint(basePath: string, projectName: string): Promise<void> {
    const filePath = join(basePath, MAIN_ENTRY_FILE);

    CoreFileOperations.validatePath(basePath, MAIN_ENTRY_FILE);

    const content = EntryPointsGenerator.createMainEntryPointContent(projectName);

    try {
      await EntryPointsGenerator.ensureSrcDirectoryExists(basePath);
      await fs.writeFile(filePath, content, { mode: DEFAULT_FILE_PERMISSIONS });
    } catch (error) {
      throw EntryPointsGenerator.createFileError('main entry point', error);
    }
  }

  /**
   * Generate CLI entry point file
   * @param {string} basePath - Base project path
   * @param {string} cliName - Name of the CLI executable
   * @param {ProjectConfig} config - Project configuration
   * @throws Error if file creation fails or path validation fails
   */
  static async generateCliEntryPoint(
    basePath: string,
    cliName: string,
    config: ProjectConfig
  ): Promise<void> {
    CoreFileOperations.validatePath(basePath, `bin/${cliName}`);

    const cliLauncher = EntryPointsGenerator.createCLILauncher(config);
    await CoreFileOperations.createCliExecutable(join(basePath, `bin/${cliName}`), cliLauncher);
  }

  /**
   * Generate entry point files as DirectoryItems
   * @param {ProjectConfig} config - Project configuration
   * @returns {DirectoryItem[]} Directory items
   */
  static generateEntryPoints(config: ProjectConfig): DirectoryItem[] {
    const entryPoints: DirectoryItem[] = [
      {
        path: MAIN_ENTRY_FILE,
        type: 'file' as const,
        content: EntryPointsGenerator.createMainEntryPointContent(config.name),
      },
    ];

    // Add CLI launcher if project type is CLI
    if (config.projectType === 'cli') {
      entryPoints.push(EntryPointsGenerator.createCLILauncherItem(config));
    }

    return entryPoints;
  }

  /**
   * Create main entry point file content
   * @param {string} projectName - Name of the project
   * @returns {string} Main entry point file content
   */
  static createMainEntryPointContent(projectName: string): string {
    return `/**
 * ${projectName}
 * Main entry point for ${projectName}
 *
 * @author Your Name
 * @license MIT
 * @version 1.0.0
 */

// Add your main exports here
export const VERSION = '1.0.0';
export const NAME = '${projectName}';

// Add your main functionality here
export function main(): void {
  console.log(\`Welcome to \${projectName} v\${VERSION}\`);
}

// Export any additional modules or functions
export default { main, VERSION, NAME };
`;
  }

  /**
   * Create CLI launcher
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} CLI launcher script content
   */
  static createCLILauncher(config: ProjectConfig): string {
    const header = EntryPointsGenerator.generateCLIHeader(config);
    const errorHandlers = EntryPointsGenerator.generateCLIErrorHandlers();
    const cliEntryPoint = EntryPointsGenerator.generateCLIEntryPoint(config);

    return `${header}\n\n${errorHandlers}\n\n${cliEntryPoint}`;
  }

  /**
   * Create CLI launcher as DirectoryItem
   * @param {ProjectConfig} config - Project configuration
   * @returns {DirectoryItem} Directory item
   */
  private static createCLILauncherItem(config: ProjectConfig): DirectoryItem {
    return {
      path: `bin/${config.name}`,
      type: 'file',
      content: EntryPointsGenerator.createCLILauncher(config),
      executable: true,
      mode: DEFAULT_EXECUTABLE_PERMISSIONS,
    };
  }

  /**
   * Generate CLI header
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} CLI header content
   */
  private static generateCLIHeader(config: ProjectConfig): string {
    return `#!/usr/bin/env bun
/**
 * ${config.name} CLI Entry Point
 *
 * Main CLI launcher for ${config.name}
 *
 * @author ${config.author || 'Your Name'}
 * @license ${config.license || 'MIT'}
 * @version 1.0.0
 */`;
  }

  /**
   * Generate CLI error handlers
   * @returns {string} CLI error handlers content
   */
  private static generateCLIErrorHandlers(): string {
    return `// Error handling for uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error.message);
  if (process.env.NODE_ENV === 'development') {
    console.error(error.stack);
  }
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});`;
  }

  /**
   * Generate CLI entry point function
   * @param {ProjectConfig} _config - Project configuration
   * @returns {string} CLI entry point function content
   */
  private static generateCLIEntryPoint(_config: ProjectConfig): string {
    return [
      EntryPointsGenerator.generateCLIImports(),
      EntryPointsGenerator.generateCLIEntryPointFunction(),
      EntryPointsGenerator.generateCLIExecution(),
    ].join('\n\n');
  }

  /**
   * Generate CLI import statements
   * @returns {string} Import statements
   */
  private static generateCLIImports(): string {
    return `// Import CLI main function
import { main } from '../src/cli/index.js';`;
  }

  /**
   * Generate CLI entry point function
   * @returns {string} CLI entry point function
   */
  private static generateCLIEntryPointFunction(): string {
    return [
      EntryPointsGenerator.generateCLIEntryPointHeader(),
      EntryPointsGenerator.generateCLIEntryPointTryBlock(),
      EntryPointsGenerator.generateCLIEntryPointCatchBlock(),
      EntryPointsGenerator.generateCLIEntryPointFooter(),
    ].join('\n');
  }

  /**
   * Generate CLI entry point header
   * @returns {string} Function header and opening
   */
  private static generateCLIEntryPointHeader(): string {
    return `/**
 * CLI entry point wrapper with enhanced error handling
 */
async function cliEntryPoint(): Promise<void> {
  try {`;
  }

  /**
   * Generate CLI entry point try block
   * @returns {string} Try block implementation
   */
  private static generateCLIEntryPointTryBlock(): string {
    return `    console.log('🚀 Starting CLI...');

    // Parse command line arguments
    const args = process.argv.slice(2);

    // Show help if no arguments provided
    if (args.length === 0) {
      args.push('--help');
    }

    // Execute CLI main function
    await main(args);`;
  }

  /**
   * Generate CLI entry point catch block
   * @returns {string} Error handling implementation
   */
  private static generateCLIEntryPointCatchBlock(): string {
    return `  } catch (error) {
    console.error('❌ CLI Error:');
    if (error instanceof Error) {
      console.error(error.message);
      if (process.env.NODE_ENV === 'development' || process.env.VERBOSE) {
        console.error('\\nStack trace:');
        console.error(error.stack);
      }
    } else {
      console.error('Unknown error occurred');
    }

    // Exit with error code
    process.exit(1);`;
  }

  /**
   * Generate CLI entry point footer
   * @returns {string} Function closing
   */
  private static generateCLIEntryPointFooter(): string {
    return `  }
}`;
  }

  /**
   * Generate CLI execution call
   * @returns {string} Execution statement
   */
  private static generateCLIExecution(): string {
    return `// Execute CLI entry point
cliEntryPoint();`;
  }

  /**
   * Ensure src directory exists
   * @param {string} basePath - Base project path
   * @throws Error if directory creation fails
   */
  private static async ensureSrcDirectoryExists(basePath: string): Promise<void> {
    await fs.mkdir(join(basePath, 'src'), { recursive: true, mode: 0o755 });
  }

  /**
   * Create a standardized file creation error
   * @param {string} fileName - Name of the file being created
   * @param {string} originalError - Original error that occurred
   * @returns {string} Error with standardized message
   */
  private static createFileError(fileName: string, originalError: unknown): Error {
    if (originalError instanceof Error) {
      return new Error(`Failed to generate ${fileName}: ${originalError.message}`);
    }
    return new Error(`Failed to generate ${fileName}: Unknown error`);
  }

  /**
   * Generate web-specific entry points
   * @param {ProjectConfig} config - Project configuration
   * @returns {DirectoryItem[]} Web-specific entry point files
   */
  static generateWebEntryPoints(config: ProjectConfig): DirectoryItem[] {
    return [
      {
        path: 'src/main.tsx',
        type: 'file',
        content: EntryPointsGenerator.generateWebMainEntry(config),
      },
      {
        path: 'src/vite-env.d.ts',
        type: 'file',
        content: EntryPointsGenerator.generateViteTypes(),
      },
    ];
  }

  /**
   * Generate library-specific entry points
   * @param {ProjectConfig} config - Project configuration
   * @returns {DirectoryItem[]} Library-specific entry point files
   */
  static generateLibraryEntryPoints(config: ProjectConfig): DirectoryItem[] {
    return [
      {
        path: 'src/lib/index.ts',
        type: 'file',
        content: EntryPointsGenerator.generateLibraryMainExport(config),
      },
    ];
  }

  /**
   * Generate web main entry point
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Web main entry point content
   */
  private static generateWebMainEntry(config: ProjectConfig): string {
    return `/**
 * ${config.name} Web Application Entry Point
 *
 * Main entry point for the web application
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/main.css';

// Initialize and render the app
const container = document.getElementById('root');

if (!container) {
  throw new Error('Root container not found');
}

const root = createRoot(container);
root.render(<App />);

// Enable hot module replacement in development
if (import.meta.hot) {
  import.meta.hot.accept();
}
`;
  }

  /**
   * Generate Vite types
   * @returns {string} Vite type definitions
   */
  private static generateViteTypes(): string {
    return `/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_API_URL: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly MODE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
  readonly hot: {
    readonly accept: () => void;
    readonly dispose: (callback: () => void) => void;
    readonly decline: () => void;
    readonly invalidate: () => void;
  } | undefined;
}
`;
  }

  /**
   * Generate library main export
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Library main export content
   */
  private static generateLibraryMainExport(config: ProjectConfig): string {
    const className = config.name
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');

    return `/**
 * ${config.name}
 *
${config.description || 'A modern TypeScript library'}
 *
 * @author ${config.author || 'Your Name'}
 * @license ${config.license || 'MIT'}
 * @version 1.0.0
 */

// Main exports
export { ${className} } from './core.js';
export type { ${className}Config, ${className}Options } from './types/index.js';

// Utility exports
export * from './utils/index.js';

// Default export
export { ${className} as default } from './core.js';
`;
  }
}
