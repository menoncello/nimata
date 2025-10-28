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
   *
   * @param config
   */
  constructor(config: AppConfig) {
    this.config = config;
  }

  /**
   * Render layout with page content
   * @param pageContent - Page content HTML
   * @returns Complete layout HTML
   */
  render(pageContent: string): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${this.config.name}</title>
  <meta name="description" content="${this.config.description || 'A modern web application'}">
  <link rel="icon" type="image/x-icon" href="/favicon.ico">
</head>
<body>
  <header class="app-header">
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
  </header>

  <main class="app-main">
    ${pageContent}
  </main>

  <footer class="app-footer">
    <p>&copy; ${new Date().getFullYear()} ${this.config.name}. All rights reserved.</p>
  </footer>
</body>
</html>
    `.trim();
  }
}
