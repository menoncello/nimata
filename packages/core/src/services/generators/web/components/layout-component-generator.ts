/**
 * Layout Component Generator
 *
 * Generates layout components for web projects
 */
import type { ProjectConfig } from '../../../../types/project-config.js';

/**
 * Generates layout components for web applications
 */
export class LayoutComponentGenerator {
  /**
   * Generates layout component
   * @param {ProjectConfig} config - The project configuration
   * @returns {string} Layout component content
   */
  generate(config: ProjectConfig): string {
    const { name } = config;
    const imports = this.getImports();
    const interfaces = this.getInterfaces();
    const layoutComponent = this.getComponent(name);
    const serverLayout = this.getServerLayout(name);

    return `${imports}

${interfaces}

${layoutComponent}

${serverLayout}`;
  }

  /**
   * Get layout component imports
   * @returns {string} Import statements
   */
  private getImports(): string {
    return `import type { ReactNode } from 'react';`;
  }

  /**
   * Get layout component interfaces
   * @returns {string} Interface definitions
   */
  private getInterfaces(): string {
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
   * @param {string} name - Project name
   * @returns {string} Layout component function
   */
  private getComponent(name: string): string {
    return `/**
 * Layout component wrapper
 */
export function Layout({ children }: LayoutProps) {
  return (
    <div className="layout">
      <header className="layout__header">
        ${this.getNavbar(name)}
      </header>

      <main className="layout__main">
        {children}
      </main>

      ${this.getFooter(name)}
    </div>
  );
}`;
  }

  /**
   * Get layout navbar
   * @param {string} name - Project name
   * @returns {string} Navbar JSX
   */
  private getNavbar(name: string): string {
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
   * @param {string} name - Project name
   * @returns {string} Footer JSX
   */
  private getFooter(name: string): string {
    return `<footer className="layout__footer">
        <p>&copy; 2024 ${name}. All rights reserved.</p>
      </footer>`;
  }

  /**
   * Get server layout class
   * @param {string} name - Project name
   * @returns {string} Server layout class
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
   * @returns {string} Constructor code
   */
  private getServerLayoutConstructor(): string {
    return `  constructor(private config: { title?: string }) {}`;
  }

  /**
   * Get server layout render method
   * @param {string} name - Project name
   * @returns {string} Render method code
   */
  private getServerLayoutRenderMethod(name: string): string {
    return [
      this.getRenderMethodSignature(),
      this.getHtmlHeadSection(name),
      this.getHtmlBodySection(name),
      this.getRenderMethodEnd(),
    ].join('\n');
  }

  /**
   * Get render method signature
   * @returns {string} Render method signature
   */
  private getRenderMethodSignature(): string {
    return `  render(pageContent: string): string {`;
  }

  /**
   * Get HTML head section
   * @param {string} name - Project name
   * @returns {string} HTML head section
   */
  private getHtmlHeadSection(name: string): string {
    return `    return \`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>\${this.config.title || '${name}'}</title>
  <link rel="stylesheet" href="/styles/main.css">
</head>`;
  }

  /**
   * Get HTML body section
   * @param {string} name - Project name
   * @returns {string} HTML body section
   */
  private getHtmlBodySection(name: string): string {
    return `<body>
  <div class="layout">
    ${this.getServerLayoutHeader(name)}
    ${this.getServerLayoutMain()}
    ${this.getServerLayoutFooter(name)}
  </div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>`;
  }

  /**
   * Get server layout header
   * @param {string} name - Project name
   * @returns {string} Server layout header
   */
  private getServerLayoutHeader(name: string): string {
    return `<header class="layout__header">
      <nav class="navbar">
        <div class="navbar__brand">
          <h1>${name}</h1>
        </div>
      </nav>
    </header>`;
  }

  /**
   * Get server layout main section
   * @returns {string} Server layout main section
   */
  private getServerLayoutMain(): string {
    return `<main class="layout__main">
      \${pageContent}
    </main>`;
  }

  /**
   * Get server layout footer
   * @param {string} name - Project name
   * @returns {string} Server layout footer
   */
  private getServerLayoutFooter(name: string): string {
    return `<footer class="layout__footer">
      <p>&copy; 2024 ${name}. All rights reserved.</p>
    </footer>`;
  }

  /**
   * Get render method end
   * @returns {string} Render method end
   */
  private getRenderMethodEnd(): string {
    return `    \`.trim();
  }`;
  }
}
