/**
 * Web Configuration Generators
 *
 * Generates configuration files for web projects
 */
import type { ProjectConfig } from '../../../types/project-config.js';
import { DEFAULT_DEV_PORT } from '../../validators/validation-constants.js';

/**
 * Web Configuration Generators
 *
 * Generates configuration files for web projects
 */
export class WebConfigGenerators {
  /**
   * Generate HTML template
   * @param config - Project configuration
   * @returns HTML template code
   */
  generateHTMLTemplate(config: ProjectConfig): string {
    const { name } = config;
    const head = this.generateHTMLHead(name);
    const body = this.generateHTMLBody();

    return `<!DOCTYPE html>
<html lang="en">
  ${head}
  ${body}
</html>
`;
  }

  /**
   * Generate HTML head section
   * @param name - Project name
   * @returns HTML head content
   */
  private generateHTMLHead(name: string): string {
    return `<head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="${name} - A modern web application" />
    <meta name="keywords" content="${name}, web, react, typescript" />
    <meta name="author" content="${name} Team" />
    <title>${name}</title>

    <!-- Preconnect to improve performance -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

    <!-- Add any additional meta tags or external resources here -->
  </head>`;
  }

  /**
   * Generate HTML body section
   * @returns HTML body content
   */
  private generateHTMLBody(): string {
    return `<body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>

    <!-- Add any additional scripts here -->

    <!-- Error tracking script (uncomment when you have a tracking service) -->
    <!--
    <script>
      window.addEventListener('error', function(e) {
        // Track errors here
        console.error('Application error:', e.error);
      });
    </script>
    -->
  </body>`;
  }

  /**
   * Generate favicon
   * @returns Favicon SVG code
   */
  generateFavicon(): string {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <text y=".9em" font-size="90">⚛️</text>
</svg>`;
  }

  /**
   * Generate Vite configuration
   * @param config - Project configuration
   * @returns Vite configuration code
   */
  generateViteConfig(config: ProjectConfig): string {
    const { name } = config;

    return `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // Development server configuration
  server: ${this.generateServerConfig()},

  // Build configuration
  build: ${this.generateBuildConfig()},

  // Path resolution
  resolve: ${this.generateResolveConfig()},

  // Environment variables configuration
  define: ${this.generateDefineConfig(name)},

  // CSS configuration
  css: ${this.generateCssConfig()},

  // Optimization
  optimizeDeps: ${this.generateOptimizeDepsConfig()},
});
`;
  }

  /**
   * Generate server configuration for Vite
   * @returns Server configuration object
   */
  private generateServerConfig(): string {
    return `{
    port: ${DEFAULT_DEV_PORT},
    open: true,
    cors: true,

    // Proxy configuration for API calls
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
    },
  }`;
  }

  /**
   * Generate build configuration for Vite
   * @returns Build configuration object
   */
  private generateBuildConfig(): string {
    return `{
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
        },
      },
    },
  }`;
  }

  /**
   * Generate path resolution configuration for Vite
   * @returns Resolve configuration object
   */
  private generateResolveConfig(): string {
    return `{
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@pages': resolve(__dirname, './src/pages'),
      '@hooks': resolve(__dirname, './src/hooks'),
      '@utils': resolve(__dirname, './src/utils'),
      '@styles': resolve(__dirname, './src/styles'),
      '@assets': resolve(__dirname, './src/assets'),
    },
  }`;
  }

  /**
   * Generate environment variables configuration for Vite
   * @param appName - Application name
   * @returns Define configuration object
   */
  private generateDefineConfig(appName: string): string {
    return `{
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __APP_NAME__: JSON.stringify('${appName}'),
  }`;
  }

  /**
   * Generate CSS configuration for Vite
   * @returns CSS configuration object
   */
  private generateCssConfig(): string {
    return `{
    modules: {
      localsConvention: 'camelCase',
    },
  }`;
  }

  /**
   * Generate optimization configuration for Vite
   * @returns Optimize dependencies configuration
   */
  private generateOptimizeDepsConfig(): string {
    return `{
    include: ['react', 'react-dom', 'react-router-dom'],
  }`;
  }
}
