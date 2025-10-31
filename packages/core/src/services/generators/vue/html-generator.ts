/**
 * HTML Template Generator for Vue projects
 */

import type { ProjectConfig } from '../../../types/project-config.js';
import { CSS_VALUES } from './vue-constants.js';

/**
 * Generates HTML templates for Vue projects
 */
export class HTMLGenerator {
  /**
   * Generate HTML template
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} HTML template content
   */
  static generateHtmlTemplate(config: ProjectConfig): string {
    const head = this.getHtmlHead(config);
    const body = this.getHtmlBody(config);

    return `<!DOCTYPE html>
<html lang="en">
${head}

${body}
</html>`;
  }

  /**
   * Get HTML head section
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} HTML head content
   */
  private static getHtmlHead(config: ProjectConfig): string {
    const metaTags = this.getMetaTags(config);
    const title = this.getTitle(config);

    return `  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    ${metaTags}
    ${title}
  </head>`;
  }

  /**
   * Get meta tags
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Meta tags HTML
   */
  private static getMetaTags(config: ProjectConfig): string {
    const viewport = this.getViewportMeta();
    const description = this.getDescriptionMeta(config);
    const themeColor = this.getThemeColorMeta();

    return `${viewport}
    ${description}
    ${themeColor}`;
  }

  /**
   * Get viewport meta tag
   * @returns {string} Viewport meta tag
   */
  private static getViewportMeta(): string {
    return `<meta name="viewport" content="width=device-width, initial-scale=1.0" />`;
  }

  /**
   * Get description meta tag
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Description meta tag
   */
  private static getDescriptionMeta(config: ProjectConfig): string {
    return `<meta name="description" content="${config.description || 'A modern Vue application'}" />`;
  }

  /**
   * Get theme color meta tag
   * @returns {string} Theme color meta tag
   */
  private static getThemeColorMeta(): string {
    return `<meta name="theme-color" content="${CSS_VALUES.BACKGROUND_LIGHT}" />`;
  }

  /**
   * Get title tag
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Title HTML
   */
  private static getTitle(config: ProjectConfig): string {
    return `<title>${config.name}</title>`;
  }

  /**
   * Get HTML body section
   * @param {ProjectConfig} _config - Project configuration (unused)
   * @returns {string} HTML body content
   */
  private static getHtmlBody(_config: ProjectConfig): string {
    return `  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>`;
  }
}
