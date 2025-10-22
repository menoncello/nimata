/**
 * Package.json Generator
 *
 * Generates package.json content for different project types and configurations
 */
import type { ProjectConfig } from '../../types/project-config.js';

/**
 * Generator for package.json files with project-specific configurations
 */
export class PackageJsonGenerator {
  private static readonly SCRIPTS = {
    BUN_TEST: 'bun test',
    BUN_TEST_WATCH: 'bun test --watch',
    BUN_TEST_COVERAGE: 'bun test --coverage',
    BUN_TYPECHECK: 'bun run typecheck',
    BUN_BUILD: 'bun run build',
    BUN_LINT: 'bun run lint',
    BUN_LINT_FIX: 'bun run lint:fix',
    BUN_FORMAT: 'bun run format',
    START: 'bun run start',
    DEV: 'bun run dev',
  } as const;

  private static readonly EXPORT_PATHS = {
    MAIN_INDEX: './dist/index.js',
    MAIN_TYPES: './dist/index.d.ts',
    STYLES: './dist/styles.css',
  } as const;

  private static readonly PROJECT_TYPES = {
    BASIC: 'basic',
    BUN_TYPESCRIPT: 'bun-typescript',
    BUN_REACT: 'bun-react',
    BUN_VUE: 'bun-vue',
    BUN_EXPRESS: 'bun-express',
  } as const;

  private static readonly TEMPLATES = {
    basic: 'bun-typescript-eslint-prettier-vitest',
    'bun-typescript': 'bun-typescript-eslint-prettier-vitest',
    'bun-react': 'bun-react-typescript-eslint-prettier-vitest',
    'bun-vue': 'bun-vue-typescript-eslint-prettier-vitest',
    'bun-express': 'bun-express-typescript-eslint-prettier-vitest',
  } as const;

  /**
   * Generate package.json content for the project
   * @param config - Project configuration
   * @returns Generated package.json object
   */
  generate(config: ProjectConfig): object {
    return {
      name: config.name,
      version: '1.0.0',
      description: config.description || '',
      main: 'dist/index.js',
      types: 'dist/index.d.ts',
      scripts: this.generateScripts(config),
      keywords: this.generateKeywords(config),
      author: config.author || '',
      license: config.license || 'MIT',
      devDependencies: this.generateDevDependenciesSync(config),
      engines: {
        bun: '>=1.0.0',
      },
      ...this.generateTypeSpecificFields(config),
    };
  }

  /**
   * Generate npm scripts for the project
   * @param config - Project configuration
   * @returns Generated scripts object
   */
  private generateScripts(config: ProjectConfig): Record<string, string> {
    const scripts: Record<string, string> = {
      test: PackageJsonGenerator.SCRIPTS.BUN_TEST,
      'test:watch': PackageJsonGenerator.SCRIPTS.BUN_TEST_WATCH,
      'test:coverage': PackageJsonGenerator.SCRIPTS.BUN_TEST_COVERAGE,
      typecheck: PackageJsonGenerator.SCRIPTS.BUN_TYPECHECK,
      build: PackageJsonGenerator.SCRIPTS.BUN_BUILD,
      lint: PackageJsonGenerator.SCRIPTS.BUN_LINT,
      'lint:fix': PackageJsonGenerator.SCRIPTS.BUN_LINT_FIX,
      format: PackageJsonGenerator.SCRIPTS.BUN_FORMAT,
    };

    // Add type-specific scripts
    return { ...scripts, ...this.getTypeSpecificScripts(config) };
  }

  /**
   * Generate keywords for the project
   * @param config - Project configuration
   * @returns Generated keywords array
   */
  private generateKeywords(config: ProjectConfig): string[] {
    const keywords = ['bun', 'typescript'];

    if (config.projectType !== 'basic') {
      keywords.push(config.projectType);
    }

    if (config.template) {
      keywords.push(
        PackageJsonGenerator.TEMPLATES[
          config.template as keyof typeof PackageJsonGenerator.TEMPLATES
        ]
      );
    }

    if (config.qualityLevel === 'high') {
      keywords.push('quality-assured', 'production-ready');
    }

    return keywords;
  }

  /**
   * Generate development dependencies for the project
   * @param config - Project configuration
   * @returns Generated development dependencies object
   */
  private generateDevDependenciesSync(config: ProjectConfig): Record<string, string> {
    const deps: Record<string, string> = {
      '@types/node': '^20.0.0',
      typescript: '^5.0.0',
      eslint: '^8.0.0',
      '@typescript-eslint/eslint-plugin': '^6.0.0',
      '@typescript-eslint/parser': '^6.0.0',
      prettier: '^3.0.0',
      vitest: '^1.0.0',
      '@vitest/coverage-v8': '^1.0.0',
      turbo: '^2.0.0',
    };

    // Add quality level specific dependencies
    if (config.qualityLevel === 'high') {
      deps['@stryker-mutator/core'] = '^8.0.0';
      deps['@stryker-mutator/vitest-runner'] = '^8.0.0';
    }

    // Add type-specific dependencies
    return { ...deps, ...this.getTypeSpecificDevDependencies(config) };
  }

  /**
   * Generate type-specific fields for the project
   * @param config - Project configuration
   * @returns Generated type-specific fields object
   */
  private generateTypeSpecificFields(config: ProjectConfig): Record<string, unknown> {
    switch (config.projectType) {
      case 'bun-react':
        return this.getReactSpecificFields();

      case 'bun-vue':
        return this.getVueSpecificFields();

      case PackageJsonGenerator.PROJECT_TYPES.BUN_EXPRESS:
        return this.getExpressSpecificFields();

      default:
        return this.getDefaultFields();
    }
  }

  /**
   * Get React-specific package.json fields
   * @returns React-specific fields object
   */
  private getReactSpecificFields(): Record<string, unknown> {
    return {
      dependencies: {
        react: '^18.2.0',
        'react-dom': '^18.2.0',
        '@types/react': '^18.2.0',
        '@types/react-dom': '^18.2.0',
      },
      exports: {
        '.': {
          import: PackageJsonGenerator.EXPORT_PATHS.MAIN_INDEX,
          types: PackageJsonGenerator.EXPORT_PATHS.MAIN_TYPES,
        },
        './styles': PackageJsonGenerator.EXPORT_PATHS.STYLES,
      },
    };
  }

  /**
   * Get Vue-specific package.json fields
   * @returns Vue-specific fields object
   */
  private getVueSpecificFields(): Record<string, unknown> {
    return {
      dependencies: {
        vue: '^3.3.0',
        '@vitejs/plugin-vue': '^4.4.0',
      },
      exports: {
        '.': {
          import: PackageJsonGenerator.EXPORT_PATHS.MAIN_INDEX,
          types: PackageJsonGenerator.EXPORT_PATHS.MAIN_TYPES,
        },
        './styles': PackageJsonGenerator.EXPORT_PATHS.STYLES,
      },
    };
  }

  /**
   * Get Express-specific package.json fields
   * @returns Express-specific fields object
   */
  private getExpressSpecificFields(): Record<string, unknown> {
    return {
      dependencies: {
        express: '^4.18.0',
        '@types/express': '^4.17.0',
        cors: '^2.8.0',
        '@types/cors': '^2.8.0',
        helmet: '^7.0.0',
        morgan: '^1.10.0',
        '@types/morgan': '^1.9.0',
      },
      exports: {
        '.': {
          import: PackageJsonGenerator.EXPORT_PATHS.MAIN_INDEX,
          types: PackageJsonGenerator.EXPORT_PATHS.MAIN_TYPES,
        },
      },
    };
  }

  /**
   * Get default package.json fields
   * @returns Default fields object
   */
  private getDefaultFields(): Record<string, unknown> {
    return {
      exports: {
        '.': {
          import: PackageJsonGenerator.EXPORT_PATHS.MAIN_INDEX,
          types: PackageJsonGenerator.EXPORT_PATHS.MAIN_TYPES,
        },
      },
    };
  }

  /**
   * Generate type-specific scripts for the project
   * @param config - Project configuration
   * @returns Generated type-specific scripts object
   */
  private getTypeSpecificScripts(config: ProjectConfig): Record<string, string> {
    switch (config.projectType) {
      case 'bun-react':
      case 'bun-vue':
      case PackageJsonGenerator.PROJECT_TYPES.BUN_EXPRESS:
        return {
          start: PackageJsonGenerator.SCRIPTS.START,
          dev: PackageJsonGenerator.SCRIPTS.DEV,
        };

      default:
        return {};
    }
  }

  /**
   * Generate type-specific development dependencies for the project
   * @param config - Project configuration
   * @returns Generated type-specific development dependencies object
   */
  private getTypeSpecificDevDependencies(config: ProjectConfig): Record<string, string> {
    switch (config.projectType) {
      case 'bun-react':
        return {
          vite: '^5.0.0',
          '@vitejs/plugin-react': '^4.0.0',
          '@types/react': '^18.2.0',
          '@types/react-dom': '^18.2.0',
        };

      case 'bun-vue':
        return {
          vite: '^5.0.0',
          '@vitejs/plugin-vue': '^4.4.0',
        };

      case PackageJsonGenerator.PROJECT_TYPES.BUN_EXPRESS:
        return {
          nodemon: '^3.0.0',
          'ts-node': '^10.9.0',
        };

      default:
        return {};
    }
  }
}
