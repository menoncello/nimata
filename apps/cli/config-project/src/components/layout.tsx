import type { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

/**
 * Simple layout interface for server-side rendering
 */
export interface LayoutInterface {
  render(pageContent: string): string;
}

/**
 * Layout component wrapper
 */
export function Layout({ children }: LayoutProps) {
  return (
    <div className="layout">
      <header className="layout__header">
        <nav className="navbar">
          <div className="navbar__brand">
            <h1>config-project</h1>
          </div>
          <div className="navbar__nav">
            <a href="/" className="nav-link">Home</a>
            <a href="/about" className="nav-link">About</a>
            <a href="/contact" className="nav-link">Contact</a>
          </div>
        </nav>
      </header>

      <main className="layout__main">
        {children}
      </main>

      <footer className="layout__footer">
        <p>&copy; 2024 config-project. All rights reserved.</p>
      </footer>
    </div>
  );
}

/**
 * Server-side layout renderer
 */
export class ServerLayout implements LayoutInterface {
  constructor(private config: { title?: string }) {}

  render(pageContent: string): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${this.config.title || 'config-project'}</title>
  <link rel="stylesheet" href="/styles/main.css">
</head>
<body>
  <div class="layout">
    <header class="layout__header">
      <nav class="navbar">
        <div class="navbar__brand">
          <h1>config-project</h1>
        </div>
      </nav>
    </header>
    <main class="layout__main">
      ${pageContent}
    </main>
    <footer class="layout__footer">
      <p>&copy; 2024 config-project. All rights reserved.</p>
    </footer>
  </div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>
    `.trim();
  }
}