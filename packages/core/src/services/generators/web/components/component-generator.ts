/**
 * Component Generator
 *
 * Generates React/Vue components for web projects
 */
import type { ProjectConfig } from '../../../../types/project-config.js';

/**
 * Generates React/Vue components for web applications
 */
export class ComponentGenerator {
  /**
   * Generates main application component
   * @param config - The project configuration
   * @returns App component content
   */
  generateAppComponent(config: ProjectConfig): string {
    const imports = this.getAppImports();
    const interfaces = this.getAppInterfaces();
    const component = this.getAppComponent(config);
    const defaultExport = this.getAppDefaultExport();

    return `${imports}

${interfaces}

${component}

${defaultExport}`;
  }

  /**
   * Get app component imports
   * @returns Import statements
   */
  private getAppImports(): string {
    return `import { useState, useEffect } from 'react';
import { Router } from './router.js';
import { Layout } from './layout.js';
import { useAppState } from '../hooks/use-app-state.js';
import '../styles/main.css';`;
  }

  /**
   * Get app component interfaces
   * @returns Interface definitions
   */
  private getAppInterfaces(): string {
    return `interface AppConfig {
  debug?: boolean;
  routes?: Record<string, () => Promise<React.ComponentType>>;
}`;
  }

  /**
   * Get app component function
   * @param config - Project configuration
   * @returns App component function
   */
  private getAppComponent(config: ProjectConfig): string {
    const { name } = config;
    const componentLogic = this.getAppComponentLogic(name);
    const loadingState = this.getAppLoadingState(name);
    const mainContent = this.getAppMainContent();

    return `/**
 * Main application component
 */
export function App() {
${componentLogic}

${loadingState}

${mainContent}
}`;
  }

  /**
   * Get app component logic
   * @param _name - Project name (unused)
   * @returns Component logic code
   */
  private getAppComponentLogic(_name: string): string {
    return `  const { state, loading, notifications, setTheme } = useAppState();
  const [router] = useState(() => new Router({
    debug: import.meta.env.DEV,
  }));

  useEffect(() => {
    // Initialize router
    router.setupRouting();
    router.setupErrorHandling();

    // Apply theme
    if (state.theme) {
      setTheme(state.theme);
    }
  }, [router, state.theme, setTheme]);`;
  }

  /**
   * Get app loading state
   * @param name - Project name
   * @returns Loading state JSX
   */
  private getAppLoadingState(name: string): string {
    return `  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner" />
        <p>Loading ${name}...</p>
      </div>
    );
  }`;
  }

  /**
   * Get app main content
   * @returns Main content JSX
   */
  private getAppMainContent(): string {
    return `  return (
    <div className="app" data-theme={state.theme}>
      <Layout>
        <Router />

        {/* Notifications */}
        {notifications.length > 0 && (
          <div className="notifications">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={\`notification notification--\${notification.type}\`}
              >
                {notification.message}
                <button
                  onClick={() => {/* Handle notification removal */}}
                  className="notification__close"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </Layout>
    </div>
  );`;
  }

  /**
   * Get app default export
   * @returns Default export statement
   */
  private getAppDefaultExport(): string {
    return `export default App;`;
  }

  /**
   * Generates layout component
   * @param config - The project configuration
   * @returns Layout component content
   */
  generateLayoutComponent(config: ProjectConfig): string {
    const { name } = config;
    const imports = this.getLayoutImports();
    const interfaces = this.getLayoutInterfaces();
    const layoutComponent = this.getLayoutComponent(name);
    const serverLayout = this.getServerLayout(name);

    return `${imports}

${interfaces}

${layoutComponent}

${serverLayout}`;
  }

  /**
   * Get layout component imports
   * @returns Import statements
   */
  private getLayoutImports(): string {
    return `import type { ReactNode } from 'react';`;
  }

  /**
   * Get layout component interfaces
   * @returns Interface definitions
   */
  private getLayoutInterfaces(): string {
    return `interface LayoutProps {
  children: ReactNode;
}

/**
 * Simple layout interface for server-side rendering
 */
export interface LayoutInterface {
  render(pageContent: string): string;
}`;
  }

  /**
   * Get layout component function
   * @param name - Project name
   * @returns Layout component function
   */
  private getLayoutComponent(name: string): string {
    return `/**
 * Layout component wrapper
 */
export function Layout({ children }: LayoutProps) {
  return (
    <div className="layout">
      <header className="layout__header">
        ${this.getLayoutNavbar(name)}
      </header>

      <main className="layout__main">
        {children}
      </main>

      ${this.getLayoutFooter(name)}
    </div>
  );
}`;
  }

  /**
   * Get layout navbar
   * @param name - Project name
   * @returns Navbar JSX
   */
  private getLayoutNavbar(name: string): string {
    return `<nav className="navbar">
          <div className="navbar__brand">
            <h1>${name}</h1>
          </div>
          <div className="navbar__nav">
            <a href="/" className="nav-link">Home</a>
            <a href="/about" className="nav-link">About</a>
            <a href="/contact" className="nav-link">Contact</a>
          </div>
        </nav>`;
  }

  /**
   * Get layout footer
   * @param name - Project name
   * @returns Footer JSX
   */
  private getLayoutFooter(name: string): string {
    return `<footer className="layout__footer">
        <p>&copy; 2024 ${name}. All rights reserved.</p>
      </footer>`;
  }

  /**
   * Get server layout class
   * @param name - Project name
   * @returns Server layout class
   */
  private getServerLayout(name: string): string {
    const constructor = this.getServerLayoutConstructor();
    const renderMethod = this.getServerLayoutRenderMethod(name);

    return `/**
 * Server-side layout renderer
 */
export class ServerLayout implements LayoutInterface {
${constructor}

${renderMethod}
}`;
  }

  /**
   * Get server layout constructor
   * @returns Constructor code
   */
  private getServerLayoutConstructor(): string {
    return `  constructor(private config: { title?: string }) {}`;
  }

  /**
   * Get server layout render method
   * @param name - Project name
   * @returns Render method code
   */
  private getServerLayoutRenderMethod(name: string): string {
    return `  render(pageContent: string): string {
    return \`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>\${this.config.title || '${name}'}</title>
  <link rel="stylesheet" href="/styles/main.css">
</head>
<body>
  <div class="layout">
    <header class="layout__header">
      <nav class="navbar">
        <div class="navbar__brand">
          <h1>${name}</h1>
        </div>
      </nav>
    </header>

    <main class="layout__main">
      \${pageContent}
    </main>

    <footer class="layout__footer">
      <p>&copy; 2024 ${name}. All rights reserved.</p>
    </footer>
  </div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>
    \`.trim();
  }`;
  }

  /**
   * Generates home page component
   * @param config - The project configuration
   * @returns Home page component content
   */
  generateHomePage(config: ProjectConfig): string {
    const { name, description } = config;
    const imports = this.getHomePageImports();
    const homePageComponent = this.getHomePageComponent(name, description);
    const homePageHook = this.getHomePageHook();
    const defaultExport = this.getHomePageDefaultExport();

    return `${imports}

${homePageComponent}

${homePageHook}

${defaultExport}`;
  }

  /**
   * Get home page imports
   * @returns Import statements
   */
  private getHomePageImports(): string {
    return `import { useState, useEffect } from 'react';`;
  }

  /**
   * Get home page component
   * @param name - Project name
   * @param description - Project description
   * @returns Home page component function
   */
  private getHomePageComponent(name: string, description?: string): string {
    const componentLogic = this.getHomePageLogic(name, description);
    const heroSection = this.getHeroSection();
    const featuresSection = this.getFeaturesSection();

    return `/**
 * Home page component
 */
export function HomePage() {
${componentLogic}

  return (
    <div className="home-page">
      ${heroSection}

      ${featuresSection}
    </div>
  );
}`;
  }

  /**
   * Get home page logic
   * @param name - Project name
   * @param description - Project description
   * @returns Component logic code
   */
  private getHomePageLogic(name: string, description?: string): string {
    return `  const [message, setMessage] = useState('Welcome to ${name}!');

  useEffect(() => {
    // Simulate API call or data fetching
    const timer = setTimeout(() => {
      setMessage('${description || 'A modern web application built with best practices'}');
    }, 1000);

    return () => clearTimeout(timer);
  }, []);`;
  }

  /**
   * Get hero section
   * @returns Hero section JSX
   */
  private getHeroSection(): string {
    return `<section className="hero">
        <div className="hero__content">
          <h1 className="hero__title">{message}</h1>
          <p className="hero__description">
            Get started with your new project in seconds.
          </p>
          <div className="hero__actions">
            <button className="btn btn--primary">
              Get Started
            </button>
            <button className="btn btn--secondary">
              Learn More
            </button>
          </div>
        </div>
      </section>`;
  }

  /**
   * Get features section
   * @returns Features section JSX
   */
  private getFeaturesSection(): string {
    return `<section className="features">
        <h2>Features</h2>
        <div className="features__grid">
          <div className="feature-card">
            <h3>⚡ Fast Performance</h3>
            <p>Optimized for speed and efficiency.</p>
          </div>
          <div className="feature-card">
            <h3>🎨 Modern Design</h3>
            <p>Clean, responsive, and accessible UI.</p>
          </div>
          <div className="feature-card">
            <h3>🛠️ Developer Friendly</h3>
            <p>Built with modern tools and best practices.</p>
          </div>
        </div>
      </section>`;
  }

  /**
   * Get home page hook
   * @returns Home page hook function
   */
  private getHomePageHook(): string {
    return `/**
 * Home page lifecycle hooks
 */
export function useHomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    console.log('Home page mounted');

    return () => {
      console.log('Home page unmounted');
    };
  }, []);

  return { mounted };
}`;
  }

  /**
   * Get home page default export
   * @returns Default export statement
   */
  private getHomePageDefaultExport(): string {
    return `export default HomePage;`;
  }
}
