/**
 * CSS Layout Generator for Vue projects
 */

/**
 * Generates CSS layout styles for Vue projects
 */
export class CSSLayoutGenerator {
  /**
   * Get base styles
   * @returns {string} Base CSS styles
   */
  static getBaseStyles(): string {
    const reset = this.getResetStyles();
    const html = this.getHtmlStyles();
    const body = this.getBodyStyles();
    const typography = this.getTypographyStyles();
    const forms = this.getFormStyles();
    const focus = this.getFocusStyles();

    return `/* Reset and base styles */
${reset}

${html}

${body}

${typography}

${forms}

${focus}`;
  }

  /**
   * Get component styles
   * @returns {string} Component CSS
   */
  static getComponentStyles(): string {
    const appLayout = this.getAppLayoutStyles();
    const componentSpecific = this.getComponentSpecificStyles();

    return `/* App layout */
${appLayout}

${componentSpecific}`;
  }

  /**
   * Get reset styles
   * @returns {string} Reset CSS
   */
  private static getResetStyles(): string {
    return `*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}`;
  }

  /**
   * Get HTML styles
   * @returns {string} HTML CSS
   */
  private static getHtmlStyles(): string {
    return `html {
  font-family: var(--font-family-sans);
  line-height: var(--line-height-normal);
  color: var(--color-text);
  background-color: var(--color-background);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}`;
  }

  /**
   * Get body styles
   * @returns {string} Body CSS
   */
  private static getBodyStyles(): string {
    return `body {
  min-height: 100vh;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-normal);
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}`;
  }

  /**
   * Get typography styles
   * @returns {string} Typography CSS
   */
  private static getTypographyStyles(): string {
    return `/* Typography */
h1, h2, h3, h4, h5, h6 {
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-tight);
  margin-bottom: var(--spacing-4);
}

h1 { font-size: var(--font-size-3xl); }
h2 { font-size: var(--font-size-2xl); }
h3 { font-size: var(--font-size-xl); }
h4 { font-size: var(--font-size-lg); }
h5 { font-size: var(--font-size-base); }
h6 { font-size: var(--font-size-sm); }

p {
  margin-bottom: var(--spacing-4);
  color: var(--color-text-secondary);
}

a {
  color: var(--color-primary);
  text-decoration: none;
  transition: var(--transition-colors);
}

a:hover {
  text-decoration: underline;
}`;
  }

  /**
   * Get form styles
   * @returns {string} Form CSS
   */
  private static getFormStyles(): string {
    return `/* Form elements */
button,
input,
textarea,
select {
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
  margin: 0;
}

button {
  background: none;
  border: none;
  cursor: pointer;
}`;
  }

  /**
   * Get focus styles
   * @returns {string} Focus CSS
   */
  private static getFocusStyles(): string {
    return `/* Focus styles */
:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}`;
  }

  /**
   * Get app layout styles
   * @returns {string} App layout CSS
   */
  private static getAppLayoutStyles(): string {
    const appStyles = this.getAppStyles();
    const headerStyles = this.getHeaderStyles();
    const mainStyles = this.getMainStyles();
    const footerStyles = this.getFooterStyles();

    return `${appStyles}

${headerStyles}

${mainStyles}

${footerStyles}`;
  }

  /**
   * Get app styles
   * @returns {string} App CSS
   */
  private static getAppStyles(): string {
    return `.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}`;
  }

  /**
   * Get header styles
   * @returns {string} Header CSS
   */
  private static getHeaderStyles(): string {
    return `.app-header {
  background-color: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  padding: var(--spacing-6);
  text-align: center;
}

.app-header h1 {
  color: var(--color-text);
  margin-bottom: var(--spacing-2);
}

.app-header p {
  color: var(--color-text-secondary);
  margin-bottom: 0;
}`;
  }

  /**
   * Get main styles
   * @returns {string} Main CSS
   */
  private static getMainStyles(): string {
    return `.app-main {
  flex: 1;
  padding: var(--spacing-6);
  display: flex;
  justify-content: center;
  align-items: flex-start;
}`;
  }

  /**
   * Get footer styles
   * @returns {string} Footer CSS
   */
  private static getFooterStyles(): string {
    return `.app-footer {
  background-color: var(--color-surface);
  border-top: 1px solid var(--color-border);
  padding: var(--spacing-4);
  text-align: center;
  color: var(--color-text-secondary);
}`;
  }

  /**
   * Get component-specific styles
   * @returns {string} Component CSS
   */
  private static getComponentSpecificStyles(): string {
    const errorStyles = this.getErrorStyles();
    const loadingStyles = this.getLoadingStyles();
    const userDataStyles = this.getUserDataStyles();
    const debugStyles = this.getDebugStyles();

    return `${errorStyles}

${loadingStyles}

${userDataStyles}

${debugStyles}`;
  }

  /**
   * Get error styles
   * @returns {string} Error CSS
   */
  private static getErrorStyles(): string {
    return `.component-error {
  color: var(--color-error);
  background-color: rgba(231, 76, 60, 0.1);
  border: 1px solid var(--color-error);
  border-radius: var(--radius-base);
  padding: var(--spacing-4);
  margin-bottom: var(--spacing-4);
}`;
  }

  /**
   * Get loading styles
   * @returns {string} Loading CSS
   */
  private static getLoadingStyles(): string {
    return `.component-loading {
  color: var(--color-text-secondary);
  text-align: center;
  padding: var(--spacing-6);
}`;
  }

  /**
   * Get user data styles
   * @returns {string} User data CSS
   */
  private static getUserDataStyles(): string {
    return `.user-data {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-base);
  padding: var(--spacing-5);
  margin-bottom: var(--spacing-4);
}`;
  }

  /**
   * Get debug styles
   * @returns {string} Debug CSS
   */
  private static getDebugStyles(): string {
    return `.debug-info {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-base);
  padding: var(--spacing-4);
  margin-top: var(--spacing-4);
}

.debug-info pre {
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: var(--spacing-3);
  font-family: var(--font-family-mono);
  font-size: var(--font-size-sm);
  overflow-x: auto;
  white-space: pre-wrap;
}`;
  }
}
