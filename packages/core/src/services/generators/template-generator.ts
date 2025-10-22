/**
 * Template Generator
 *
 * Generates type-specific project structure and files
 */
import type { ProjectConfig } from '../../types/project-config.js';
import { BasicStructureGenerator } from './basic/basic-structure-generator.js';
import { ExpressStructureGenerator } from './express/express-structure-generator.js';
import { ReactStructureGenerator } from './react/react-structure-generator.js';
import { VueStructureGenerator } from './vue/vue-structure-generator.js';

export interface DirectoryItem {
  path: string;
  type: 'directory' | 'file';
  content?: string;
}

/**
 * Template Generator Factory
 */
export class TemplateGenerator {
  private readonly reactGenerator: ReactStructureGenerator;
  private readonly vueGenerator: VueStructureGenerator;
  private readonly expressGenerator: ExpressStructureGenerator;
  private readonly basicGenerator: BasicStructureGenerator;

  /**
   * Initialize template generators
   */
  constructor() {
    this.reactGenerator = new ReactStructureGenerator();
    this.vueGenerator = new VueStructureGenerator();
    this.expressGenerator = new ExpressStructureGenerator();
    this.basicGenerator = new BasicStructureGenerator();
  }

  /**
   * Generate project structure based on project type
   * @param config - Project configuration
   * @returns Directory structure for specified project type
   */
  generate(config: ProjectConfig): DirectoryItem[] {
    switch (config.projectType) {
      case 'bun-react':
        return this.reactGenerator.generate(config);
      case 'bun-vue':
        return this.vueGenerator.generate(config);
      case 'bun-express':
        return this.expressGenerator.generate(config);
      default:
        return this.basicGenerator.generate(config);
    }
  }
}
