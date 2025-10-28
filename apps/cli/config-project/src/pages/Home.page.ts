/**
 * Home Page
 *
 * Application home page component
 */

import type { PageComponent } from '../components/Layout.component.js';
import type { AppConfig } from '../types/app.types.js';

/**
 * Home page component
 */
export class HomePage implements PageComponent {
  private config: AppConfig;

  /**
   *
   * @param config
   */
  constructor(config: AppConfig) {
    this.config = config;
  }

  /**
   * Render home page content
   * @returns HTML string
   */
  render(): string {
    return `
<section class="hero-section">
  <div class="hero-content">
    <h1>Welcome to ${this.config.name}</h1>
    <p>${this.config.description || 'A modern web application built with TypeScript'}</p>
    <div class="hero-actions">
      <button class="btn btn-primary" onclick="app.navigateTo('/about')">Learn More</button>
      <button class="btn btn-secondary" onclick="app.navigateTo('/contact')">Get in Touch</button>
    </div>
  </div>
</section>

<section class="features-section">
  <div class="container">
    <h2>Features</h2>
    <div class="features-grid">
      <div class="feature-card">
        <h3>🚀 Fast</h3>
        <p>Built with modern tools for optimal performance</p>
      </div>
      <div class="feature-card">
        <h3>🔧 Type Safe</h3>
        <p>TypeScript ensures type safety throughout</p>
      </div>
      <div class="feature-card">
        <h3>🎨 Responsive</h3>
        <p>Works seamlessly on all devices</p>
      </div>
    </div>
  </div>
</section>
    `.trim();
  }

  /**
   * Called when page is mounted
   */
  onMount(): void {
    // Add any page-specific initialization here
    console.log('Home page mounted');
  }

  /**
   * Called when page is unmounted
   */
  onUnmount(): void {
    // Add any cleanup here
    console.log('Home page unmounted');
  }
}
