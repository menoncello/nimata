/**
 * Responsive Styles Module
 *
 * Generates responsive design styles and media queries
 */

/**
 * Generates responsive design styles with media queries
 */
export class ResponsiveStyles {
  /**
   * Generate responsive styles for different screen sizes
   * @returns {string} Responsive CSS styles
   */
  generateResponsiveStyles(): string {
    const tabletStyles = this.getTabletStyles();
    const mobileStyles = this.getMobileStyles();

    return `/* Responsive Styles */
${tabletStyles}

${mobileStyles}`;
  }

  /**
   * Get tablet responsive styles
   * @returns {string} Tablet CSS styles
   */
  private getTabletStyles(): string {
    return `@media (max-width: 768px) {
  .container {
    padding: 0 0.75rem;
  }

  .grid-cols-2 {
    grid-template-columns: 1fr;
  }

  .grid-cols-3 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .grid-cols-4 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .gap-4 { gap: 0.75rem; }
  .gap-6 { gap: 1rem; }
  .gap-8 { gap: 1.5rem; }
}`;
  }

  /**
   * Get mobile responsive styles
   * @returns {string} Mobile CSS styles
   */
  private getMobileStyles(): string {
    return `@media (max-width: 480px) {
  .grid-cols-3,
  .grid-cols-4 {
    grid-template-columns: 1fr;
  }

  .btn {
    padding: 0.625rem 1.25rem;
    font-size: 0.875rem;
  }

  .card {
    padding: 1rem;
  }
}`;
  }

  /**
   * Generate dark mode styles
   * @returns {string} Dark mode CSS styles
   */
  generateDarkModeStyles(): string {
    return `/* Dark mode support */
@media (prefers-color-scheme: dark) {
  :root {
    --color-white: #0f172a;
    --color-gray-50: #1e293b;
    --color-gray-100: #334155;
    --color-gray-200: #475569;
    --color-gray-300: #64748b;
    --color-gray-700: #cbd5e1;
    --color-gray-800: #e2e8f0;
    --color-gray-900: #f8fafc;
  }

  body {
    color: var(--color-gray-900);
    background-color: var(--color-white);
  }

  .card {
    background: var(--color-gray-50);
    border-color: var(--color-gray-200);
  }

  .form-input {
    background-color: var(--color-gray-50);
    border-color: var(--color-gray-200);
    color: var(--color-gray-900);
  }
}`;
  }

  /**
   * Generate accessibility-focused responsive styles
   * @returns {string} Accessibility CSS styles
   */
  generateAccessibilityStyles(): string {
    return `/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Focus styles for better accessibility */
.btn:focus,
.form-input:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .btn {
    border-width: 3px;
  }

  .card {
    border-width: 2px;
  }
}`;
  }

  /**
   * Generate print styles
   * @returns {string} Print CSS styles
   */
  generatePrintStyles(): string {
    return `/* Print Styles */
@media print {
  .navbar,
  .layout__footer,
  .btn,
  .notifications {
    display: none;
  }

  .layout__main {
    padding: 0;
  }

  body {
    font-size: 12pt;
    line-height: 1.4;
  }

  h1 {
    font-size: 18pt;
  }

  h2 {
    font-size: 16pt;
  }

  h3 {
    font-size: 14pt;
  }
}`;
  }

  /**
   * Generate complete responsive styles section
   * @returns {string} Complete responsive styles CSS
   */
  generateResponsiveSection(): string {
    const responsive = this.generateResponsiveStyles();
    const darkMode = this.generateDarkModeStyles();
    const accessibility = this.generateAccessibilityStyles();
    const print = this.generatePrintStyles();

    return [responsive, darkMode, accessibility, print].join('\n\n');
  }
}
