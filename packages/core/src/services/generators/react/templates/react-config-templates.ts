import { ProjectConfig } from '../../../../types/project-config.js';

/**
 * React Configuration Templates
 * Contains template generation methods for React configuration files
 */
export class ReactConfigTemplates {
  /**
   * Generate HTML template
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} HTML template
   */
  getHtmlTemplate(config: ProjectConfig): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${config.name}</title>
  <meta name="description" content="${config.description || 'A modern application built with Bun'}" />
  <link rel="icon" type="image/svg+xml" href="/vite.svg" />
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/index.tsx"></script>
</body>
</html>`;
  }

  /**
   * Generate Vite configuration
   * @returns {string} Vite configuration template
   */
  getViteConfigTemplate(): string {
    return `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
});`;
  }
}
