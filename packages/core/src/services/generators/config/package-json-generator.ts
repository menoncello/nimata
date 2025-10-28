/**
 * Package.json Generator
 *
 * Generates package.json content for projects
 */
import { JSON_INDENT } from '../../../constants/generator-constants.js';
import type { ProjectConfig } from '../../../types/project-config.js';

/**
 * Package.json Generator class
 */
export class PackageJsonGenerator {
  /**
   * Generate package.json content
   * @param config - Project configuration
   * @returns package.json content
   */
  generate(config: ProjectConfig): string {
    const { name, version, description, author, license } = config;
    const isCLI = config.projectType === 'cli';

    const basePackage: Record<string, unknown> = {
      name,
      version: version || '1.0.0',
      description: description || `${name} project`,
      main: isCLI ? 'dist/index.js' : 'src/index.ts',
      type: 'module',
      scripts: this.generateScripts(config),
      keywords: [],
      author: author || '',
      license: license || 'MIT',
      engines: {
        node: '>=18.0.0',
        npm: '>=8.0.0',
      },
      devDependencies: this.generateDevDependencies(config),
      dependencies: this.generateDependencies(config),
    };

    if (isCLI) {
      basePackage.bin = {
        [name]: 'dist/index.js',
      };
    }

    return JSON.stringify(basePackage, null, JSON_INDENT);
  }

  /**
   * Generate package.json scripts
   * @param config - Project configuration
   * @returns Scripts object
   */
  private generateScripts(config: ProjectConfig): Record<string, string> {
    const isCLI = config.projectType === 'cli';
    const isWeb = config.projectType === 'web';

    const baseScripts = this.generateBaseScripts();

    if (isCLI) {
      return {
        ...baseScripts,
        ...this.generateCLIScripts(),
      };
    }

    if (isWeb) {
      return {
        ...baseScripts,
        ...this.generateWebScripts(),
      };
    }

    return baseScripts;
  }

  /**
   * Generate base package.json scripts
   * @returns Base scripts object
   */
  private generateBaseScripts(): Record<string, string> {
    return {
      build: 'tsc',
      dev: 'tsx watch src/index.ts',
      test: 'vitest',
      'test:coverage': 'vitest --coverage',
      'test:ui': 'vitest --ui',
      lint: 'eslint src/**/*.ts',
      'lint:fix': 'eslint src/**/*.ts --fix',
      'type-check': 'tsc --noEmit',
      clean: 'rimraf dist',
      prebuild: 'npm run clean',
    };
  }

  /**
   * Generate CLI-specific package.json scripts
   * @returns CLI scripts object
   */
  private generateCLIScripts(): Record<string, string> {
    return {
      start: 'node dist/index.js',
      'dev:cli': 'tsx src/index.ts',
      prepack: 'npm run build',
    };
  }

  /**
   * Generate web-specific package.json scripts
   * @returns Web scripts object
   */
  private generateWebScripts(): Record<string, string> {
    return {
      dev: 'vite',
      build: 'tsc && vite build',
      preview: 'vite preview',
      'dev:server': 'vite --port 3000',
    };
  }

  /**
   * Generate package.json dependencies
   * @param config - Project configuration
   * @returns Dependencies object
   */
  private generateDependencies(config: ProjectConfig): Record<string, string> {
    const isCLI = config.projectType === 'cli';
    const isWeb = config.projectType === 'web';

    if (isCLI) {
      return {
        commander: '^11.0.0',
        chalk: '^5.3.0',
      };
    }

    if (isWeb) {
      return {
        react: '^18.2.0',
        'react-dom': '^18.2.0',
        'react-router-dom': '^6.8.0',
      };
    }

    return {};
  }

  /**
   * Generate package.json devDependencies
   * @param config - Project configuration
   * @returns DevDependencies object
   */
  private generateDevDependencies(config: ProjectConfig): Record<string, string> {
    const isCLI = config.projectType === 'cli';
    const isWeb = config.projectType === 'web';

    const baseDevDeps = this.generateBaseDevDependencies();

    if (isCLI) {
      return {
        ...baseDevDeps,
        ...this.generateCLIDevDependencies(),
      };
    }

    if (isWeb) {
      return {
        ...baseDevDeps,
        ...this.generateWebDevDependencies(),
      };
    }

    return baseDevDeps;
  }

  /**
   * Generate base package.json devDependencies
   * @returns Base devDependencies object
   */
  private generateBaseDevDependencies(): Record<string, string> {
    return {
      '@types/node': '^20.0.0',
      typescript: '^5.0.0',
      tsx: '^4.0.0',
      eslint: '^8.40.0',
      '@typescript-eslint/eslint-plugin': '^6.0.0',
      '@typescript-eslint/parser': '^6.0.0',
      rimraf: '^5.0.0',
      vitest: '^1.0.0',
      '@vitest/coverage-v8': '^1.0.0',
      '@vitest/ui': '^1.0.0',
    };
  }

  /**
   * Generate CLI-specific package.json devDependencies
   * @returns CLI devDependencies object
   */
  private generateCLIDevDependencies(): Record<string, string> {
    return {
      '@types/commander': '^2.12.2',
    };
  }

  /**
   * Generate web-specific package.json devDependencies
   * @returns Web devDependencies object
   */
  private generateWebDevDependencies(): Record<string, string> {
    return {
      vite: '^5.0.0',
      '@vitejs/plugin-react': '^4.0.0',
      '@types/react': '^18.2.0',
      '@types/react-dom': '^18.2.0',
    };
  }
}
