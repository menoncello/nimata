import { ProjectConfig } from '../../../../types/project-config.js';

/**
 * React CSS Templates
 * Contains template generation methods for React CSS styles
 */
export class ReactCssTemplates {
  /**
   * Generate main CSS template
   * @param config - Project configuration
   * @returns Main CSS template
   */
  getMainCSSTemplate(config: ProjectConfig): string {
    const cssVariables = this.getCSSVariables();
    const baseStyles = this.getBaseCSSStyles();
    const appStyles = this.getAppCSSStyles();
    const componentStyles = this.getComponentCSSStyles();
    const responsiveStyles = this.getResponsiveCSSStyles();

    return `/* ${config.name} - Main Styles */

${cssVariables}

${baseStyles}

${appStyles}

${componentStyles}

${responsiveStyles}`;
  }

  /**
   * Generate CSS custom properties (variables) for theming
   * @returns CSS variables definition string
   */
  private getCSSVariables(): string {
    const themeColor = '#61dafb';
    return `:root {
  --primary-color: ${themeColor};
  --secondary-color: #282c34;
  --text-color: #333;
  --background-color: #fff;
  --error-color: #ff6b6b;
  --success-color: #51cf66;
  --border-radius: 8px;
  --spacing-unit: 1rem;
}`;
  }

  /**
   * Generate base CSS styles for global elements
   * @returns Base CSS styles string
   */
  private getBaseCSSStyles(): string {
    return `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--text-color);
  background-color: var(--background-color);
  line-height: 1.6;
}`;
  }

  /**
   * Generate CSS styles for the main app layout
   * @returns App layout CSS styles string
   */
  private getAppCSSStyles(): string {
    return `${this.getAppLayoutStyles()}
${this.getAppHeaderStyles()}
${this.getAppMainStyles()}
${this.getAppFooterStyles()}`;
  }

  /**
   * Generate app layout CSS styles
   * @returns App layout CSS string
   */
  private getAppLayoutStyles(): string {
    return `.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}`;
  }

  /**
   * Generate app header CSS styles
   * @returns App header CSS string
   */
  private getAppHeaderStyles(): string {
    return `.app-header {
  background-color: var(--primary-color);
  color: white;
  padding: calc(var(--spacing-unit) * 2);
  text-align: center;
}

.app-header h1 {
  font-size: 2.5rem;
  margin-bottom: var(--spacing-unit);
}

.app-header p {
  font-size: 1.2rem;
  opacity: 0.9;
}`;
  }

  /**
   * Generate app main content CSS styles
   * @returns App main CSS string
   */
  private getAppMainStyles(): string {
    return `.app-main {
  flex: 1;
  padding: calc(var(--spacing-unit) * 2);
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}`;
  }

  /**
   * Generate app footer CSS styles
   * @returns App footer CSS string
   */
  private getAppFooterStyles(): string {
    return `.app-footer {
  background-color: var(--secondary-color);
  color: white;
  text-align: center;
  padding: var(--spacing-unit);
}`;
  }

  /**
   * Generate CSS styles for React components
   * @returns Component-specific CSS styles string
   */
  private getComponentCSSStyles(): string {
    return `.component-loading,
.component-error {
  text-align: center;
  padding: calc(var(--spacing-unit) * 2);
}

.component-error {
  color: var(--error-color);
}

.debug-info {
  margin-top: var(--spacing-unit);
  padding: var(--spacing-unit);
  background-color: #f5f5f5;
  border-radius: var(--border-radius);
  border: 1px solid #ddd;
}

.debug-info pre {
  font-size: 0.9rem;
  white-space: pre-wrap;
}

.user-data {
  margin: var(--spacing-unit) 0;
  padding: var(--spacing-unit);
  background-color: #f8f9fa;
  border-radius: var(--border-radius);
}`;
  }

  /**
   * Generate responsive CSS styles for mobile devices
   * @returns Responsive CSS styles string
   */
  private getResponsiveCSSStyles(): string {
    return `/* Responsive design */
@media (max-width: 768px) {
  .app-header h1 {
    font-size: 2rem;
  }

  .app-main {
    padding: var(--spacing-unit);
  }
}`;
  }
}
