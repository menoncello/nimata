/**
 * Web Structure Generator (Refactored)
 *
 * Generates web-specific project structure and files using modular approach
 */
import type { ProjectConfig } from '../../../types/project-config.js';
import type { DirectoryItem } from '../core/core-file-operations.js';
import { WebConfigGenerators } from './web-config-generators.js';
import { WebEntryGenerators } from './web-entry-generators.js';
import { WebPageGenerators } from './web-page-generators.js';
import { ComponentGenerator, HookGenerator, StyleGenerator } from './index.js';

/**
 * Generator for web project structures (Refactored)
 */
export class WebStructureGenerator {
  private readonly componentGenerator: ComponentGenerator;
  private readonly hookGenerator: HookGenerator;
  private readonly styleGenerator: StyleGenerator;
  private readonly pageGenerators: WebPageGenerators;
  private readonly configGenerators: WebConfigGenerators;
  private readonly entryGenerators: WebEntryGenerators;

  /**
   * Initialize web structure generator with component generators
   */
  constructor() {
    this.componentGenerator = new ComponentGenerator();
    this.hookGenerator = new HookGenerator();
    this.styleGenerator = new StyleGenerator();
    this.pageGenerators = new WebPageGenerators();
    this.configGenerators = new WebConfigGenerators();
    this.entryGenerators = new WebEntryGenerators();
  }

  /**
   * Generate web project structure
   * @param {ProjectConfig} config - Project configuration
   * @returns {boolean}ic directory structure
   */
  generate(config: ProjectConfig): DirectoryItem[] {
    const directories = this.getWebDirectories();
    const files = this.getWebFiles(config);

    return [...directories, ...files];
  }

  /**
   * Get web-specific directory structure
   * @returns {DirectoryItem[]} Array of directory items items
   */
  private getWebDirectories(): DirectoryItem[] {
    return [
      { path: 'src/components', type: 'directory' },
      { path: 'src/components/common', type: 'directory' },
      { path: 'src/components/forms', type: 'directory' },
      { path: 'src/pages', type: 'directory' },
      { path: 'src/hooks', type: 'directory' },
      { path: 'src/utils', type: 'directory' },
      { path: 'src/types', type: 'directory' },
      { path: 'src/styles', type: 'directory' },
      { path: 'src/styles/components', type: 'directory' },
      { path: 'src/assets', type: 'directory' },
      { path: 'src/assets/images', type: 'directory' },
      { path: 'src/assets/fonts', type: 'directory' },
      { path: 'src/assets/icons', type: 'directory' },
      { path: 'public', type: 'directory' },
      { path: 'public/icons', type: 'directory' },
      { path: 'public/images', type: 'directory' },
      { path: 'tests', type: 'directory' },
      { path: 'tests/unit', type: 'directory' },
      { path: 'tests/integration', type: 'directory' },
      { path: 'tests/e2e', type: 'directory' },
    ];
  }

  /**
   * Get web-specific files
   * @param {ProjectConfig} config - Project configuration
   * @returns {DirectoryItem[]} Array of directory items items
   */
  private getWebFiles(config: ProjectConfig): DirectoryItem[] {
    const entryFiles = this.getEntryFiles(config);
    const componentFiles = this.getComponentFiles(config);
    const pageFiles = this.getPageFiles(config);
    const hookFiles = this.getHookFiles(config);
    const utilityFiles = this.getUtilityFiles(config);
    const styleFiles = this.getStyleFiles(config);
    const configFiles = this.getConfigFiles(config);

    return [
      ...entryFiles,
      ...componentFiles,
      ...pageFiles,
      ...hookFiles,
      ...utilityFiles,
      ...styleFiles,
      ...configFiles,
    ];
  }

  /**
   * Get entry point files
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Entry files array
   */
  private getEntryFiles(config: ProjectConfig): DirectoryItem[] {
    return [
      {
        path: 'src/main.tsx',
        type: 'file',
        content: this.entryGenerators.generateMainEntry(config),
      },
      {
        path: 'src/server.ts',
        type: 'file',
        content: this.generateDevelopmentServer(config),
      },
    ];
  }

  /**
   * Get component files
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Component files array
   */
  private getComponentFiles(config: ProjectConfig): DirectoryItem[] {
    return [
      {
        path: 'src/components/app.tsx',
        type: 'file',
        content: this.componentGenerator.generateAppComponent(config),
      },
      {
        path: 'src/components/layout.tsx',
        type: 'file',
        content: this.componentGenerator.generateLayoutComponent(config),
      },
    ];
  }

  /**
   * Get page files
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Page files array
   */
  private getPageFiles(config: ProjectConfig): DirectoryItem[] {
    return [
      {
        path: 'src/pages/home-page.tsx',
        type: 'file',
        content: this.componentGenerator.generateHomePage(config),
      },
      {
        path: 'src/pages/about-page.tsx',
        type: 'file',
        content: this.pageGenerators.generateAboutPage(config),
      },
      {
        path: 'src/pages/contact-page.tsx',
        type: 'file',
        content: this.pageGenerators.generateContactPage(config),
      },
    ];
  }

  /**
   * Get hook files
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Hook files array
   */
  private getHookFiles(config: ProjectConfig): DirectoryItem[] {
    return [
      {
        path: 'src/hooks/use-app-state.ts',
        type: 'file',
        content: this.hookGenerator.generateAppStateHook(config),
      },
      {
        path: 'src/hooks/use-router.ts',
        type: 'file',
        content: this.hookGenerator.generateRouterHooks(config),
      },
    ];
  }

  /**
   * Get utility files
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Utility files array
   */
  private getUtilityFiles(config: ProjectConfig): DirectoryItem[] {
    return [
      {
        path: 'src/types/index.ts',
        type: 'file',
        content: this.entryGenerators.generateAppTypes(config),
      },
      {
        path: 'src/utils/dom.ts',
        type: 'file',
        content: this.entryGenerators.generateDOMUtils(config),
      },
    ];
  }

  /**
   * Get style files
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Style files array
   */
  private getStyleFiles(config: ProjectConfig): DirectoryItem[] {
    return [
      {
        path: 'src/styles/main.css',
        type: 'file',
        content: this.styleGenerator.generateMainStyles(config),
      },
      {
        path: 'src/styles/components.css',
        type: 'file',
        content: this.styleGenerator.generateComponentStyles(config),
      },
    ];
  }

  /**
   * Get configuration files
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Configuration files array
   */
  private getConfigFiles(config: ProjectConfig): DirectoryItem[] {
    return [
      {
        path: 'index.html',
        type: 'file',
        content: WebConfigGenerators.generateHTMLTemplate(config),
      },
      {
        path: 'public/favicon.ico',
        type: 'file',
        content: WebConfigGenerators.generateFavicon(),
      },
      {
        path: 'vite.config.ts',
        type: 'file',
        content: WebConfigGenerators.generateViteConfig(config),
      },
    ];
  }

  /**
   * Generate development server file for web projects
   * @param {ProjectConfig} _config - Project configuration (not used in current implementation)
   * @returns {string} Development server code
   */
  private generateDevelopmentServer(_config: ProjectConfig): string {
    return this.buildDevServerFile();
  }

  /**
   * Build the complete development server file content
   * @returns {string} Development server code
   */
  private buildDevServerFile(): string {
    return `/**
 * Development Server Configuration
 *
 * This file can be used for custom development server setup
 * For most use cases, Vite's built-in development server should be sufficient.
 */

import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { ViteDevServer } from 'vite';

${this.generateSetupDevServerFunction()}

${this.generateStandaloneServerFunction()}

// Export for potential use
export default {
  setupDevServer,
  createStandaloneServer,
};
`;
  }

  /**
   * Generate setup development server function
   * @returns {string} Setup function code
   */
  private generateSetupDevServerFunction(): string {
    return `/**
 * Setup custom development server with proxy configuration
 * This is useful when you need custom middleware or proxy setup
 */
export async function setupDevServer(vite: ViteDevServer) {
  const app = express();

  // API proxy configuration
  app.use('/api', createProxyMiddleware({
    target: 'http://localhost:3001',
    changeOrigin: true,
    secure: false,
  }));

  // Custom middleware examples
  app.use((req, res, next) => {
    // Add custom headers or logging here
    next();
  });

  return app;
}`;
  }

  /**
   * Generate standalone server function
   * @returns {string} Standalone server function code
   */
  private generateStandaloneServerFunction(): string {
    return `/**
 * Standalone development server (alternative to Vite)
 */
export function createStandaloneServer() {
  const app = express();
  const port = process.env.PORT || 3000;

  // Serve static files from dist directory
  app.use(express.static('dist'));

  // API routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Catch-all handler for SPA routing
  app.get('*', (req, res) => {
    res.sendFile('dist/index.html', { root: '.' });
  });

  app.listen(port, () => {
    console.log(\`🚀 Development server running on http://localhost:\${port}\`);
  });

  return app;
}`;
  }
}
