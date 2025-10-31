/**
 * Component Generator
 *
 * Generates React/Vue components for web projects
 */
import type { ProjectConfig } from '../../../../types/project-config.js';
import { AppComponentGenerator } from './app-component-generator.js';
import { HomePageGenerator } from './home-page-generator.js';
import { LayoutComponentGenerator } from './layout-component-generator.js';

/**
 * Generates React/Vue components for web applications
 */
export class ComponentGenerator {
  private readonly appGenerator: AppComponentGenerator;
  private readonly layoutGenerator: LayoutComponentGenerator;
  private readonly homePageGenerator: HomePageGenerator;

  /**
   * Initialize component generator with all sub-generators
   */
  constructor() {
    this.appGenerator = new AppComponentGenerator();
    this.layoutGenerator = new LayoutComponentGenerator();
    this.homePageGenerator = new HomePageGenerator();
  }

  /**
   * Generates main application component
   * @param {ProjectConfig} config - The project configuration
   * @returns {string} App component content
   */
  generateAppComponent(config: ProjectConfig): string {
    return this.appGenerator.generate(config);
  }

  /**
   * Generates layout component
   * @param {ProjectConfig} config - The project configuration
   * @returns {string} Layout component content
   */
  generateLayoutComponent(config: ProjectConfig): string {
    return this.layoutGenerator.generate(config);
  }

  /**
   * Generates home page component
   * @param {ProjectConfig} config - The project configuration
   * @returns {string} Home page component content
   */
  generateHomePage(config: ProjectConfig): string {
    return this.homePageGenerator.generate(config);
  }
}
