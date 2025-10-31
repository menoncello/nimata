/**
 * Layout Component
 *
 * Main application layout wrapper
 */

import type { AppConfig } from '../types/app.types.js';

export interface PageComponent {
  render: () => string;
  onMount?: () => void;
  onUnmount?: () => void;
}

/**
 * Layout component class
 */
export class Layout {
  private config: AppConfig;

  /**
   * Creates a new Layout component instance.
   * @param {AppConfig} config - Application configuration object containing name, description, and other settings
   */
  constructor(config: AppConfig) {
    this.config = config;
  }

  /**
   * Renders the HTML head section with meta tags and title.
   * @returns {string} HTML head section string
   */
  private renderHead(): string {
    return `<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${this.config.name}</title>
  <meta name="description" content="${this.config.description || 'A modern web application'}">
  <link rel="icon" type="image/x-icon" href="/favicon.ico">
</head>`;
  }

  /**
   * Renders the navigation header section.
   * @returns {string} HTML navigation section string
   */
  private renderNavigation(): string {
    return `<header class="app-header">
  <nav class="app-nav">
    <div class="nav-brand">
      <a href="/" class="brand-link">${this.config.name}</a>
    </div>
    <ul class="nav-menu">
      <li><a href="/" class="nav-link">Home</a></li>
      <li><a href="/about" class="nav-link">About</a></li>
      <li><a href="/contact" class="nav-link">Contact</a></li>
    </ul>
  </nav>
</header>`;
  }

  /**
   * Renders the footer section with copyright information.
   * @returns {string} HTML footer section string
   */
  private renderFooter(): string {
    const currentYear = new Date().getFullYear();
    return `<footer class="app-footer">
  <p>&copy; ${currentYear} ${this.config.name}. All rights reserved.</p>
</footer>`;
  }

  /**
   * Render layout with page content
   * @param {string} pageContent - Page content HTML
   * @returns {string} Complete layout HTML string
   */
  render(pageContent: string): string {
    return `
<!DOCTYPE html>
<html lang="en">
${this.renderHead()}
<body>
  ${this.renderNavigation()}

  <main class="app-main">
    ${pageContent}
  </main>

  ${this.renderFooter()}
</body>
</html>
    `.trim();
  }
}
