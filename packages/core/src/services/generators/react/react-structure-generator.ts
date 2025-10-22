/**
 * React Structure Generator
 *
 * Generates React-specific project structure and files
 */
import type { ProjectConfig } from '../../../types/project-config.js';
import { toPascalCase } from '../../../utils/string-utils.js';
import { ReactComponentTemplates } from './templates/react-component-templates.js';
import { ReactConfigTemplates } from './templates/react-config-templates.js';
import { ReactCssTemplates } from './templates/react-css-templates.js';
import { ReactHookTemplates } from './templates/react-hook-templates.js';

export interface DirectoryItem {
  path: string;
  type: 'directory' | 'file';
  content?: string;
}

/**
 * Generator for React project structures
 */
export class ReactStructureGenerator {
  private componentTemplates: ReactComponentTemplates;
  private hookTemplates: ReactHookTemplates;
  private cssTemplates: ReactCssTemplates;
  private configTemplates: ReactConfigTemplates;

  /**
   * Initialize the React structure generator with template instances
   */
  constructor() {
    this.componentTemplates = new ReactComponentTemplates();
    this.hookTemplates = new ReactHookTemplates();
    this.cssTemplates = new ReactCssTemplates();
    this.configTemplates = new ReactConfigTemplates();
  }

  /**
   * Generate React project structure
   * @param config - Project configuration
   * @returns React-specific directory structure
   */
  generate(config: ProjectConfig): DirectoryItem[] {
    const componentName = toPascalCase(config.name);

    return [...this.getReactDirectories(), ...this.getReactFiles(config, componentName)];
  }

  /**
   * Get React-specific directories
   * @returns Array of React directory items
   */
  private getReactDirectories(): DirectoryItem[] {
    return [
      { path: 'src', type: 'directory' },
      { path: 'src/components', type: 'directory' },
      { path: 'src/hooks', type: 'directory' },
      { path: 'public', type: 'directory' },
    ];
  }

  /**
   * Get React-specific files
   * @param config - Project configuration
   * @param componentName - Component name
   * @returns Array of React file items
   */
  private getReactFiles(config: ProjectConfig, componentName: string): DirectoryItem[] {
    return [
      this.createAppFile(config),
      this.createComponentFile(componentName, config),
      this.createHookFile(config),
      this.createHtmlFile(config),
      this.createViteConfigFile(config),
      this.createCssFile(config),
    ];
  }

  /**
   * Create the main App.tsx file
   * @param config - Project configuration
   * @returns Directory item for App.tsx file
   */
  private createAppFile(config: ProjectConfig): DirectoryItem {
    const componentName = toPascalCase(config.name);
    const content = this.componentTemplates.getAppComponentTemplate(componentName, config);

    return {
      path: 'src/App.tsx',
      type: 'file',
      content,
    };
  }

  /**
   * Create the main component file
   * @param componentName - Component name
   * @param config - Project configuration
   * @returns Directory item for component file
   */
  private createComponentFile(componentName: string, config: ProjectConfig): DirectoryItem {
    const content = this.componentTemplates.getComponentTemplate(componentName, config);

    return {
      path: `src/components/${componentName}.tsx`,
      type: 'file',
      content,
    };
  }

  /**
   * Create the useApp hook file
   * @param _config - Project configuration
   * @returns Directory item for hook file
   */
  private createHookFile(_config: ProjectConfig): DirectoryItem {
    const content = this.hookTemplates.getUseAppHookTemplate();

    return {
      path: 'src/hooks/useAppState.ts',
      type: 'file',
      content,
    };
  }

  /**
   * Create the HTML template file
   * @param config - Project configuration
   * @returns Directory item for HTML file
   */
  private createHtmlFile(config: ProjectConfig): DirectoryItem {
    const content = this.configTemplates.getHtmlTemplate(config);

    return {
      path: 'public/index.html',
      type: 'file',
      content,
    };
  }

  /**
   * Create the Vite configuration file
   * @param _config - Project configuration
   * @returns Directory item for Vite config file
   */
  private createViteConfigFile(_config: ProjectConfig): DirectoryItem {
    const content = this.configTemplates.getViteConfigTemplate();

    return {
      path: 'vite.config.ts',
      type: 'file',
      content,
    };
  }

  /**
   * Create the main CSS file
   * @param config - Project configuration
   * @returns Directory item for CSS file
   */
  private createCssFile(config: ProjectConfig): DirectoryItem {
    const content = this.cssTemplates.getMainCSSTemplate(config);

    return {
      path: 'src/index.css',
      type: 'file',
      content,
    };
  }
}
