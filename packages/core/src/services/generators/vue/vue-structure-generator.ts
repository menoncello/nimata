/**
 * Vue Structure Generator
 *
 * Generates Vue-specific project structure and files
 */
import type { ProjectConfig } from '../../../types/project-config.js';
import { toPascalCase } from '../../../utils/string-utils.js';
import type { DirectoryItem } from '../core/core-file-operations.js';
import { VueComponentGenerators } from './vue-component-generators.js';
import { VueComposableGenerators } from './vue-composable-generators.js';
import { VueConfigGenerators } from './vue-config-generators.js';
import { FILE_PATHS } from './vue-constants.js';

/**
 * Generator for Vue project structures
 */
export class VueStructureGenerator {
  /**
   * Generate Vue project structure
   * @param config - Project configuration
   * @returns Vue-specific directory structure
   */
  generate(config: ProjectConfig): DirectoryItem[] {
    const directories = this.createDirectories();
    const components = this.createComponentFiles(config);
    const configs = this.createConfigFiles(config);

    return [...directories, ...components, ...configs];
  }

  /**
   * Create directory structure
   * @returns Directory items
   */
  private createDirectories(): DirectoryItem[] {
    return [
      { path: FILE_PATHS.COMPONENTS, type: 'directory' },
      { path: FILE_PATHS.COMPOSABLES, type: 'directory' },
      { path: FILE_PATHS.UTILS, type: 'directory' },
      { path: FILE_PATHS.PUBLIC, type: 'directory' },
    ];
  }

  /**
   * Create component files
   * @param config - Project configuration
   * @returns Component file items
   */
  private createComponentFiles(config: ProjectConfig): DirectoryItem[] {
    const componentName = toPascalCase(config.name);

    return [
      {
        path: FILE_PATHS.APP_VUE,
        type: 'file',
        content: VueComponentGenerators.generateVueAppComponent(config),
      },
      {
        path: `${FILE_PATHS.COMPONENTS}/${componentName}.vue`,
        type: 'file',
        content: VueComponentGenerators.generateVueMainComponent(config),
      },
      {
        path: FILE_PATHS.USE_APP_STATE,
        type: 'file',
        content: VueComposableGenerators.generateVueComposable(config),
      },
    ];
  }

  /**
   * Create configuration files
   * @param config - Project configuration
   * @returns Configuration file items
   */
  private createConfigFiles(config: ProjectConfig): DirectoryItem[] {
    return [
      {
        path: FILE_PATHS.INDEX_HTML,
        type: 'file',
        content: VueConfigGenerators.generateHtmlTemplate(config),
      },
      {
        path: FILE_PATHS.VITE_CONFIG,
        type: 'file',
        content: VueConfigGenerators.generateViteConfig(config),
      },
      {
        path: FILE_PATHS.INDEX_CSS,
        type: 'file',
        content: VueConfigGenerators.generateMainCSS(config),
      },
    ];
  }
}
