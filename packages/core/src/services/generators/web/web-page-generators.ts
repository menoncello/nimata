/**
 * Web Page Generators
 *
 * Generates page components for web projects
 */
import type { ProjectConfig } from '../../../types/project-config.js';
import { generateAboutPage } from './modules/about-page-generator.js';
import {
  generateContactPageImports,
  generateContactPageInterfaces,
  generateContactPageComponent,
  generateContactPageExports,
} from './modules/contact-page-generators.js';

/**
 * Web Page Generators
 *
 * Generates page components for web projects
 */
export class WebPageGenerators {
  /**
   * Generate about page component
   * @param config - Project configuration
   * @returns About page component code
   */
  generateAboutPage(config: ProjectConfig): string {
    return generateAboutPage(config);
  }

  /**
   * Generate contact page component
   * @param config - Project configuration
   * @returns Contact page component code
   */
  generateContactPage(config: ProjectConfig): string {
    const { name } = config;

    const imports = generateContactPageImports();
    const interfaces = generateContactPageInterfaces();
    const component = generateContactPageComponent(name);
    const exports = generateContactPageExports();

    return [imports, interfaces, component, exports].join('\n\n');
  }
}
