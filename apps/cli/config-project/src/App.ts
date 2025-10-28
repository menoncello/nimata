/**
 * ConfigProject App Component
 *
 * Main application component
 */

import { Layout } from './components/Layout.component.js';
import { HomePage } from './pages/Home.page.js';
import type { AppConfig } from './types/app.types.js';

/**
 * Main application class
 */
export class App {
  private config: AppConfig;
  private currentRoute = '/';
  private rootElement: Element | null = null;

  /**
   *
   * @param config
   */
  constructor(config: AppConfig) {
    this.config = config;
  }

  /**
   * Initialize the application
   */
  async initialize(): Promise<void> {
    // Setup routing
    this.setupRouting();

    // Setup global error handling
    this.setupErrorHandling();

    // Initialize services
    await this.initializeServices();
  }

  /**
   * Mount application to DOM element
   * @param element - DOM element to mount to
   */
  mount(element: Element): void {
    this.rootElement = element;
    this.render();
  }

  /**
   * Setup client-side routing
   */
  private setupRouting(): void {
    window.addEventListener('popstate', () => {
      this.currentRoute = window.location.pathname;
      this.render();
    });

    // Handle navigation links
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      const link = target.closest('a');

      if (link && link.href && link.origin === window.location.origin) {
        event.preventDefault();
        const path = new URL(link.href).pathname;
        this.navigateTo(path);
      }
    });
  }

  /**
   * Navigate to a route
   * @param path - Route path
   */
  navigateTo(path: string): void {
    if (path !== this.currentRoute) {
      this.currentRoute = path;
      history.pushState({}, '', path);
      this.render();
    }
  }

  /**
   * Setup global error handling
   */
  private setupErrorHandling(): void {
    window.addEventListener('error', (event) => {
      console.error('Global error:', event.error);
    });

    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
    });
  }

  /**
   * Initialize application services
   */
  private async initializeServices(): Promise<void> {
    // Initialize services here
    if (this.config.debug) {
      console.log('Services initialized');
    }
  }

  /**
   * Render the current route
   */
  private render(): void {
    if (!this.rootElement) return;

    const layout = new Layout(this.config);
    const page = this.getPageComponent(this.currentRoute);

    const content = layout.render(page.render());
    this.rootElement.innerHTML = content;

    // Initialize page
    if (page.onMount) {
      page.onMount();
    }
  }

  /**
   * Get page component for route
   * @param path - Current path
   * @returns Page component instance
   */
  private getPageComponent(path: string) {
    switch (path) {
      case '/':
        return new HomePage(this.config);
      default:
        // 404 page
        return new HomePage(this.config); // For now, return home page
    }
  }

  /**
   * Get current route
   * @returns Current route path
   */
  getRoute(): string {
    return this.currentRoute;
  }

  /**
   * Get app configuration
   * @returns App configuration
   */
  getConfig(): AppConfig {
    return { ...this.config };
  }
}
