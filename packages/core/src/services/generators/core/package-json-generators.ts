/**
 * Package.json Generators
 *
 * Handles package.json content generation and related operations
 */

// Constants
const JSON_INDENTATION = 2;

export interface PackageMetadata {
  name?: string;
  version?: string;
  description?: string;
  keywords?: string[];
  author?: string;
  license?: string;
  projectType?: string;
}

/**
 * Package.json content generators
 */
export class PackageJsonGenerators {
  /**
   * Create package.json content object
   * @param {PackageMetadata} metadata - Package metadata
   * @returns {object} Package.json content object
   */
  static createPackageJsonContent(metadata: PackageMetadata): object {
    const basePackageJson = PackageJsonGenerators.createBasePackageJson(metadata);
    const projectSpecificConfig = PackageJsonGenerators.createProjectSpecificConfig(
      metadata.projectType,
      metadata.name
    );

    return { ...basePackageJson, ...projectSpecificConfig };
  }

  /**
   * Create base package.json content
   * @param {PackageMetadata} metadata - Package metadata
   * @returns {object} Base package.json content
   */
  private static createBasePackageJson(metadata: PackageMetadata): object {
    return {
      name: metadata.name || 'new-project',
      version: metadata.version || '1.0.0',
      description: metadata.description || 'A modern TypeScript project',
      main: 'src/index.ts', // Default for development projects, will be overridden for libraries
      type: 'module',
      scripts: PackageJsonGenerators.createPackageScripts(),
      keywords: metadata.keywords || [],
      author: metadata.author ?? 'Your Name',
      license: metadata.license || 'MIT',
      dependencies: {},
      devDependencies: PackageJsonGenerators.createPackageDevDependencies(),
      engines: PackageJsonGenerators.createPackageEngines(),
    };
  }

  /**
   * Create project-specific package.json configuration
   * @param {string | undefined} projectType - Type of project
   * @param {string | undefined} projectName - Name of the project
   * @returns {object} Project-specific configuration
   */
  private static createProjectSpecificConfig(projectType?: string, projectName?: string): object {
    switch (projectType) {
      case 'cli':
        return PackageJsonGenerators.createCliConfig(projectName);
      case 'web':
        return PackageJsonGenerators.createWebConfig();
      case 'library':
        return PackageJsonGenerators.createLibraryConfig();
      default:
        return {};
    }
  }

  /**
   * Create CLI-specific configuration
   * @param {string} projectName - Name of the project
   * @returns {object} CLI configuration
   */
  private static createCliConfig(projectName = 'cli-app'): object {
    return {
      bin: {
        [projectName]: `./bin/${projectName}`,
      },
      dependencies: {
        commander: '^12.0.0',
        chalk: '^5.0.0',
      },
    };
  }

  /**
   * Create web-specific configuration
   * @returns {object} Web configuration
   */
  private static createWebConfig(): object {
    return {
      dependencies: {
        react: '^18.2.0',
        'react-dom': '^18.2.0',
      },
    };
  }

  /**
   * Create library-specific configuration
   * @returns {object} Library configuration
   */
  private static createLibraryConfig(): object {
    return {
      main: './dist/index.js', // Libraries should point to built files
      module: './dist/index.esm.js', // ES modules version
      types: './dist/index.d.ts',
      exports: {
        '.': {
          import: './dist/index.js',
          types: './dist/index.d.ts',
        },
      },
    };
  }

  /**
   * Create package.json scripts
   * @returns {object} Package.json scripts object
   */
  private static createPackageScripts(): object {
    return {
      dev: `bun --watch src/index.ts`,
      build: `bun build src/index.ts --outdir dist --target node`,
      test: 'bun test',
      lint: 'eslint . --ext .ts,.js',
      'lint:fix': 'eslint . --ext .ts,.js --fix',
      format: 'prettier --write .',
      'format:check': 'prettier --check .',
    };
  }

  /**
   * Create package.json devDependencies
   * @returns {object} Package.json devDependencies object
   */
  private static createPackageDevDependencies(): object {
    return {
      '@types/node': '^20.0.0',
      '@types/bun': '^1.0.0',
      '@typescript-eslint/eslint-plugin': '^8.0.0',
      '@typescript-eslint/parser': '^8.0.0',
      'bun-types': '^1.0.0',
      eslint: '^9.0.0',
      prettier: '^3.0.0',
      typescript: '^5.0.0',
      vitest: '^1.0.0',
    };
  }

  /**
   * Create package.json engines
   * @returns {object} Package.json engines object
   */
  private static createPackageEngines(): object {
    return {
      node: '>=18.0.0',
      bun: '>=1.3.0',
    };
  }

  /**
   * Create package.json file item for DirectoryItem structure
   * @param {PackageMetadata} metadata - Package metadata
   * @returns {DirectoryItem} Directory item
   */
  static createPackageJsonFile(metadata: PackageMetadata): {
    path: string;
    type: 'file';
    content: string;
  } {
    return {
      path: 'package.json',
      type: 'file',
      content: JSON.stringify(
        PackageJsonGenerators.createPackageJsonContent(metadata),
        null,
        JSON_INDENTATION
      ),
    };
  }
}
