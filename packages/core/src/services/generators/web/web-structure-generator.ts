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
   * @param config - Project configuration
   * @returns Web-specific directory structure
   */
  generate(config: ProjectConfig): DirectoryItem[] {
    const directories = this.getWebDirectories();
    const files = this.getWebFiles(config);

    return [...directories, ...files];
  }

  /**
   * Get web-specific directory structure
   * @returns Array of directory items
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
   * @param config - Project configuration
   * @returns Array of file items
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
   * @param config - Project configuration
   * @returns Entry files array
   */
  private getEntryFiles(config: ProjectConfig): DirectoryItem[] {
    return [
      {
        path: 'src/main.tsx',
        type: 'file',
        content: this.entryGenerators.generateMainEntry(config),
      },
    ];
  }

  /**
   * Get component files
   * @param config - Project configuration
   * @returns Component files array
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
   * @param config - Project configuration
   * @returns Page files array
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
   * @param config - Project configuration
   * @returns Hook files array
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
   * @param config - Project configuration
   * @returns Utility files array
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
   * @param config - Project configuration
   * @returns Style files array
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
   * @param config - Project configuration
   * @returns Configuration files array
   */
  private getConfigFiles(config: ProjectConfig): DirectoryItem[] {
    return [
      {
        path: 'index.html',
        type: 'file',
        content: this.configGenerators.generateHTMLTemplate(config),
      },
      {
        path: 'public/favicon.ico',
        type: 'file',
        content: this.configGenerators.generateFavicon(),
      },
      {
        path: 'vite.config.ts',
        type: 'file',
        content: this.configGenerators.generateViteConfig(config),
      },
    ];
  }
}
