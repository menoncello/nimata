/**
 * Style Generator
 *
 * Generates CSS/SCSS styles for web applications using modular approach
 */
import type { ProjectConfig } from '../../../../types/project-config.js';
import { BasicComponentStyles } from './components/basic-component-styles.js';
import { LayoutStyles } from './components/layout-styles.js';
import { UtilityStyles } from './components/utility-styles.js';
import { BaseStyles } from './modules/base-styles.js';
import { ColorUtilities } from './modules/color-utilities.js';
import { ComponentStyles } from './modules/component-styles.js';
import { ResponsiveStyles } from './modules/responsive-styles.js';

/**
 * Generates CSS/SCSS styles for web applications using modular approach
 */
export class StyleGenerator {
  private readonly baseStyles: BaseStyles;
  private readonly basicComponentStyles: BasicComponentStyles;
  private readonly utilityStyles: UtilityStyles;
  private readonly layoutStyles: LayoutStyles;
  private readonly componentStyles: ComponentStyles;
  private readonly responsiveStyles: ResponsiveStyles;
  private readonly colorUtilities: ColorUtilities;

  /**
   * Initialize style generators with modular components
   */
  constructor() {
    this.baseStyles = new BaseStyles();
    this.basicComponentStyles = new BasicComponentStyles();
    this.utilityStyles = new UtilityStyles();
    this.layoutStyles = new LayoutStyles();
    this.componentStyles = new ComponentStyles();
    this.responsiveStyles = new ResponsiveStyles();
    this.colorUtilities = new ColorUtilities();
  }

  /**
   * Generates main application styles using modular approach
   * @param config - The project configuration
   * @returns Main CSS content
   */
  generateMainStyles(config: ProjectConfig): string {
    const baseSection = this.baseStyles.generateBaseStylesSection(config);
    const layout = this.layoutStyles.generateLayoutStyles();
    const components = this.basicComponentStyles.generateBasicComponentStyles();
    const utilities = this.utilityStyles.generateUtilityStyles();
    const responsive = this.responsiveStyles.generateResponsiveSection();

    return [baseSection, layout, components, utilities, responsive].join('\n\n');
  }

  /**
   * Generates component-specific styles using modular approach
   * @param _config - The project configuration (unused for now, but kept for API compatibility)
   * @returns Component CSS content
   */
  public generateComponentStyles(_config: ProjectConfig): string {
    return this.componentStyles.generateComponentStylesSection();
  }

  /**
   * Get primary color based on project configuration
   * @param config - Project configuration containing theme settings
   * @returns Primary color hex code
   */
  public getPrimaryColor(config: ProjectConfig): string {
    return this.colorUtilities.getPrimaryColor(config);
  }

  /**
   * Lighten a hex color by a specified percentage
   * @param color - Hex color code to lighten (e.g., '#3b82f6')
   * @param percent - Percentage to lighten (0-100)
   * @returns Lightened hex color code
   */
  public lightenColor(color: string, percent: number): string {
    return this.colorUtilities.lightenColor(color, percent);
  }

  /**
   * Darken a hex color by a specified percentage
   * @param color - Hex color code to darken (e.g., '#3b82f6')
   * @param percent - Percentage to darken (0-100)
   * @returns Darkened hex color code
   */
  public darkenColor(color: string, percent: number): string {
    return this.colorUtilities.darkenColor(color, percent);
  }
}
