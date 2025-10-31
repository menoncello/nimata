/**
 * Base Styles Module
 *
 * Generates CSS reset, base styles, and CSS variables
 */
import type { ProjectConfig } from '../../../../../types/project-config.js';
import { ColorUtilities } from './color-utilities.js';

// Constants for style generation
const COLOR_ADJUSTMENT_AMOUNT = 20;

/**
 * Generates CSS reset, base styles, and CSS variables
 */
export class BaseStyles {
  private readonly colorUtilities: ColorUtilities;

  /**
   * Initialize base styles generator with color utilities
   */
  constructor() {
    this.colorUtilities = new ColorUtilities();
  }

  /**
   * Generate styles header comment
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Styles header comment
   */
  generateStylesHeader(config: ProjectConfig): string {
    return `/*
 * ${config.name} - Main Styles
 * Modern, responsive, and accessible CSS
 */`;
  }

  /**
   * Generate CSS reset styles
   * @returns {string} CSS reset styles
   */
  generateCSSReset(): string {
    return `/* CSS Reset and Base Styles */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}`;
  }

  /**
   * Generate CSS variables based on project configuration
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} CSS variables
   */
  generateCSSVariables(config: ProjectConfig): string {
    const primaryColor = this.colorUtilities.getPrimaryColor(config);

    return `:root {
  /* Color Palette */
  --color-primary: ${primaryColor};
  --color-primary-light: ${this.colorUtilities.lightenColor(primaryColor, COLOR_ADJUSTMENT_AMOUNT)};
  --color-primary-dark: ${this.colorUtilities.darkenColor(primaryColor, COLOR_ADJUSTMENT_AMOUNT)};

  --color-secondary: #64748b;
  --color-accent: #f59e0b;

  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #3b82f6;

  /* Neutral Colors */
  --color-white: #ffffff;
  --color-gray-50: #f8fafc;
  --color-gray-100: #f1f5f9;
  --color-gray-200: #e2e8f0;
  --color-gray-300: #cbd5e1;
  --color-gray-400: #94a3b8;
  --color-gray-500: #64748b;
  --color-gray-600: #475569;
  --color-gray-700: #334155;
  --color-gray-800: #1e293b;
  --color-gray-900: #0f172a;

  /* Typography */
  --font-family-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-family-mono: 'Fira Code', 'SF Mono', Monaco, monospace;`;
  }

  /**
   * Generate base HTML styles
   * @returns {string} Base HTML styles
   */
  generateBaseStyles(): string {
    return `/* Base Styles */
html {
  font-size: 16px;
  line-height: 1.5;
  -webkit-text-size-adjust: 100%;
}

body {
  font-family: var(--font-family-sans);
  line-height: 1.6;
  color: var(--color-gray-900);
  background-color: var(--color-white);
}

img, picture, video, canvas, svg {
  display: block;
  max-width: 100%;
}

input, button, textarea, select {
  font: inherit;
}`;
  }

  /**
   * Generate complete base styles section
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Complete base styles CSS
   */
  generateBaseStylesSection(config: ProjectConfig): string {
    const header = this.generateStylesHeader(config);
    const reset = this.generateCSSReset();
    const variables = this.generateCSSVariables(config);
    const baseStyles = this.generateBaseStyles();

    return [header, reset, variables, baseStyles].join('\n\n');
  }
}
