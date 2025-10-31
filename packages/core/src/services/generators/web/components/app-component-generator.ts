/**
 * App Component Generator
 *
 * Generates the main application component for web projects
 */
import type { ProjectConfig } from '../../../../types/project-config.js';

/**
 * Generates main application component
 */
export class AppComponentGenerator {
  /**
   * Generates main application component
   * @param {ProjectConfig} config - The project configuration
   * @returns {string} App component content
   */
  generate(config: ProjectConfig): string {
    const imports = this.getImports();
    const interfaces = this.getInterfaces();
    const component = this.getComponent(config);
    const defaultExport = this.getDefaultExport();

    return `${imports}

${interfaces}

${component}

${defaultExport}`;
  }

  /**
   * Get app component imports
   * @returns {string} Import statements
   */
  private getImports(): string {
    return `import { useState, useEffect } from 'react';
import { Router } from './router.js';
import { Layout } from './layout.js';
import { useAppState } from '../hooks/use-app-state.js';
import '../styles/main.css';`;
  }

  /**
   * Get app component interfaces
   * @returns {string} Interface definitions
   */
  private getInterfaces(): string {
    return `interface AppConfig {
  debug?: boolean;
  routes?: Record<string, () => Promise<React.ComponentType>>;
}`;
  }

  /**
   * Get app component function
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} App component function
   */
  private getComponent(config: ProjectConfig): string {
    const { name } = config;
    const componentLogic = this.getComponentLogic(name);
    const loadingState = this.getLoadingState(name);
    const mainContent = this.getMainContent();

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
   * @param {string} _name - Project name (unused)
   * @returns {string} Component logic code
   */
  private getComponentLogic(_name: string): string {
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
   * @param {string} name - Project name
   * @returns {string} Loading state JSX
   */
  private getLoadingState(name: string): string {
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
   * @returns {string} Main content JSX
   */
  private getMainContent(): string {
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
   * @returns {string} Default export statement
   */
  private getDefaultExport(): string {
    return `export default App;`;
  }
}
