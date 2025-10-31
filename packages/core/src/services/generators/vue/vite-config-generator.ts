/**
 * Vite Configuration Generator for Vue
 */

import type { ProjectConfig } from '../../../types/project-config.js';

/**
 * Generates Vite configuration for Vue projects
 */
export class ViteConfigGenerator {
  /**
   * Generate Vite config for Vue
   * @param {ProjectConfig} _config - Project configuration (unused)
   * @returns {string} Vite configuration TypeScript code
   */
  static generateViteConfig(_config: ProjectConfig): string {
    const imports = this.getViteImports();
    const plugins = this.getPluginsConfig();
    const resolveConfig = this.getResolveConfig();
    const serverConfig = this.getServerConfig();
    const buildConfig = this.getBuildConfig();
    const testConfig = this.getTestConfig();

    return `${imports}

export default defineConfig({
  ${plugins},
  ${resolveConfig},
  ${serverConfig},
  ${buildConfig},
  ${testConfig},
})`;
  }

  /**
   * Get Vite imports
   * @returns {string} Import statements
   */
  private static getViteImports(): string {
    return `import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'`;
  }

  /**
   * Get plugins configuration
   * @returns {string} Plugins configuration
   */
  private static getPluginsConfig(): string {
    return `plugins: [vue()]`;
  }

  /**
   * Get resolve configuration
   * @returns {string} Resolve configuration
   */
  private static getResolveConfig(): string {
    return `resolve: {
  alias: {
    '@': resolve(__dirname, 'src'),
  },
}`;
  }

  /**
   * Get server configuration
   * @returns {string} Server configuration
   */
  private static getServerConfig(): string {
    return `server: {
  port: 3000,
  open: true,
}`;
  }

  /**
   * Get build configuration
   * @returns {string} Build configuration
   */
  private static getBuildConfig(): string {
    return `build: {
  outDir: 'dist',
  sourcemap: true,
  rollupOptions: {
    output: {
      manualChunks: {
        vendor: ['vue'],
      },
    },
  },
}`;
  }

  /**
   * Get test configuration
   * @returns {string} Test configuration
   */
  private static getTestConfig(): string {
    return `test: {
  globals: true,
  environment: 'jsdom',
}`;
  }
}
