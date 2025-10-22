/**
 * CSS Variables Generator for Vue projects
 */

import { CSS_VALUES } from './vue-constants.js';

/**
 * Generates CSS variables for Vue projects
 */
export class CSSVariablesGenerator {
  /**
   * Get CSS variables
   * @returns CSS variables
   */
  static getCSSVariables(): string {
    const lightTheme = this.getLightThemeVariables();
    const darkTheme = this.getDarkThemeVariables();
    const typography = this.getTypographyVariables();
    const spacing = this.getSpacingVariables();
    const borderRadius = this.getBorderRadiusVariables();
    const shadows = this.getShadowVariables();
    const transitions = this.getTransitionVariables();

    return `:root {
  /* Colors */
  ${lightTheme}

  /* Typography */
  ${typography}

  /* Spacing */
  ${spacing}

  /* Border radius */
  ${borderRadius}

  /* Shadows */
  ${shadows}

  /* Transitions */
  ${transitions}
}

/* Dark theme */
.theme-dark {
  ${darkTheme}
}`;
  }

  /**
   * Get light theme variables
   * @returns Light theme CSS variables
   */
  private static getLightThemeVariables(): string {
    return `--color-primary: #3498db;
  --color-secondary: #2ecc71;
  --color-accent: #e74c3c;
  --color-background: ${CSS_VALUES.BACKGROUND_LIGHT};
  --color-surface: #ffffff;
  --color-text: ${CSS_VALUES.TEXT_COLOR};
  --color-text-secondary: #666666;
  --color-border: #dddddd;
  --color-error: ${CSS_VALUES.ERROR_COLOR};
  --color-warning: #f39c12;
  --color-success: #27ae60;
  --color-info: #3498db;`;
  }

  /**
   * Get dark theme variables
   * @returns Dark theme CSS variables
   */
  private static getDarkThemeVariables(): string {
    return `--color-background: #1a1a1a;
  --color-surface: #2d2d2d;
  --color-text: #ffffff;
  --color-text-secondary: #cccccc;
  --color-border: #404040;`;
  }

  /**
   * Get typography variables
   * @returns Typography CSS variables
   */
  private static getTypographyVariables(): string {
    return `--font-family-sans: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-family-mono: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, monospace;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --line-height-tight: 1.25;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;`;
  }

  /**
   * Get spacing variables
   * @returns Spacing CSS variables
   */
  private static getSpacingVariables(): string {
    return `--spacing-1: 0.25rem;
  --spacing-2: 0.5rem;
  --spacing-3: 0.75rem;
  --spacing-4: 1rem;
  --spacing-5: 1.25rem;
  --spacing-6: 1.5rem;
  --spacing-8: 2rem;
  --spacing-10: 2.5rem;
  --spacing-12: 3rem;
  --spacing-16: 4rem;
  --spacing-20: 5rem;`;
  }

  /**
   * Get border radius variables
   * @returns Border radius CSS variables
   */
  private static getBorderRadiusVariables(): string {
    return `--radius-sm: 0.25rem;
  --radius-base: ${CSS_VALUES.BORDER_RADIUS};
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  --radius-full: 9999px;`;
  }

  /**
   * Get shadow variables
   * @returns Shadow CSS variables
   */
  private static getShadowVariables(): string {
    return `--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-base: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);`;
  }

  /**
   * Get transition variables
   * @returns Transition CSS variables
   */
  private static getTransitionVariables(): string {
    return `--transition-colors: background-color 150ms ease-in-out, border-color 150ms ease-in-out, color 150ms ease-in-out;
  --transition-transform: transform 150ms ease-in-out;
  --transition-opacity: opacity 150ms ease-in-out;`;
  }
}
