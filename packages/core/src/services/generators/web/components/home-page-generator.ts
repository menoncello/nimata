/**
 * Home Page Generator
 *
 * Generates home page components for web projects
 */
import type { ProjectConfig } from '../../../../types/project-config.js';

/**
 * Generates home page components for web applications
 */
export class HomePageGenerator {
  /**
   * Generates home page component
   * @param {ProjectConfig} config - The project configuration
   * @returns {string} Home page component content
   */
  generate(config: ProjectConfig): string {
    const { name, description } = config;
    const imports = this.getImports();
    const homePageComponent = this.getComponent(name, description);
    const homePageHook = this.getHook();
    const defaultExport = this.getDefaultExport();

    return `${imports}

${homePageComponent}

${homePageHook}

${defaultExport}`;
  }

  /**
   * Get home page imports
   * @returns {string} Import statements
   */
  private getImports(): string {
    return `import { useState, useEffect } from 'react';`;
  }

  /**
   * Get home page component
   * @param {string} name - Project name
   * @param {string} description - Project description
   * @returns {string} Home page component function
   */
  private getComponent(name: string, description?: string): string {
    const componentLogic = this.getLogic(name, description);
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
   * @param {string} name - Project name
   * @param {string} description - Project description
   * @returns {string} Component logic code
   */
  private getLogic(name: string, description?: string): string {
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
   * @returns {string} Hero section JSX
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
   * @returns {string} Features section JSX
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
   * @returns {string} Home page hook function
   */
  private getHook(): string {
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
   * @returns {string} Default export statement
   */
  private getDefaultExport(): string {
    return `export default HomePage;`;
  }
}
