/**
 * Template Generator
 *
 * Generates type-specific project structure and files
 */
import type { ProjectConfig } from '../../types/project-config.js';
import { BasicStructureGenerator } from './basic/basic-structure-generator.js';
import { CLIStructureGenerator } from './cli/cli-structure-generator.js';
import type { DirectoryItem } from './core/core-file-operations.js';
import { ExpressStructureGenerator } from './express/express-structure-generator.js';
import { LibraryStructureGenerator } from './library/library-structure-generator.js';
import { ReactStructureGenerator } from './react/react-structure-generator.js';
import { TypeScriptStructureGenerator } from './typescript/typescript-structure-generator.js';
import { VueStructureGenerator } from './vue/vue-structure-generator.js';
import { WebStructureGenerator } from './web/web-structure-generator.js';

export type { DirectoryItem };

/**
 * Template Generator Factory
 */
export class TemplateGenerator {
  private readonly reactGenerator: ReactStructureGenerator;
  private readonly vueGenerator: VueStructureGenerator;
  private readonly expressGenerator: ExpressStructureGenerator;
  private readonly basicGenerator: BasicStructureGenerator;
  private readonly cliGenerator: CLIStructureGenerator;
  private readonly webGenerator: WebStructureGenerator;
  private readonly libraryGenerator: LibraryStructureGenerator;
  private readonly typescriptGenerator: TypeScriptStructureGenerator;

  /**
   * Initialize template generators
   */
  constructor() {
    this.reactGenerator = new ReactStructureGenerator();
    this.vueGenerator = new VueStructureGenerator();
    this.expressGenerator = new ExpressStructureGenerator();
    this.basicGenerator = new BasicStructureGenerator();
    this.cliGenerator = new CLIStructureGenerator();
    this.webGenerator = new WebStructureGenerator();
    this.libraryGenerator = new LibraryStructureGenerator();
    this.typescriptGenerator = new TypeScriptStructureGenerator();
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
      case 'cli':
        return this.cliGenerator.generate(config);
      case 'web':
        return this.webGenerator.generate(config);
      case 'library':
        return this.libraryGenerator.generate(config);
      case 'bun-typescript':
        return this.typescriptGenerator.generate(config);
      case 'basic':
      default:
        return this.basicGenerator.generate(config);
    }
  }
}
