/**
 * Library Structure Generator
 *
 * Generates library-specific project structure and files
 */

import type { ProjectConfig } from '../../../types/project-config.js';
import type { DirectoryItem } from '../core/core-file-operations.js';
import { ConstantsGenerator } from './components/constants-generator.js';
import { CoreModuleGenerator } from './components/core-module-generator.js';
import { ExamplesGenerator } from './components/examples-generator.js';
import { MainExportGenerator } from './components/main-export-generator.js';
import { PerformanceBenchmarkGenerator } from './components/performance-benchmark-generator.js';
import { TypesGenerator } from './components/types-generator.js';
import { UtilsGenerator } from './components/utils-generator.js';

/**
 * Generator for library project structures
 */
export class LibraryStructureGenerator {
  private readonly constantsGenerator: ConstantsGenerator;
  private readonly coreModuleGenerator: CoreModuleGenerator;
  private readonly examplesGenerator: ExamplesGenerator;
  private readonly mainExportGenerator: MainExportGenerator;
  private readonly performanceBenchmarkGenerator: PerformanceBenchmarkGenerator;
  private readonly typesGenerator: TypesGenerator;
  private readonly utilsGenerator: UtilsGenerator;

  /**
   * Initialize library structure generators
   */
  constructor() {
    this.constantsGenerator = new ConstantsGenerator();
    this.coreModuleGenerator = new CoreModuleGenerator();
    this.examplesGenerator = new ExamplesGenerator();
    this.mainExportGenerator = new MainExportGenerator();
    this.performanceBenchmarkGenerator = new PerformanceBenchmarkGenerator();
    this.typesGenerator = new TypesGenerator();
    this.utilsGenerator = new UtilsGenerator();
  }

  /**
   * Generate library project structure
   * @param config - Project configuration
   * @returns Library-specific directory structure
   */
  generate(config: ProjectConfig): DirectoryItem[] {
    const directories = this.getLibraryDirectories();
    const files = this.getLibraryFiles(config);

    return [...directories, ...files];
  }

  /**
   * Get library-specific directory structure
   * @returns Array of directory items
   */
  private getLibraryDirectories(): DirectoryItem[] {
    return [
      { path: 'src/lib', type: 'directory' },
      { path: 'src/lib/types', type: 'directory' },
      { path: 'src/lib/utils', type: 'directory' },
      { path: 'src/lib/constants', type: 'directory' },
      { path: 'examples', type: 'directory' },
      { path: 'examples/basic', type: 'directory' },
      { path: 'examples/advanced', type: 'directory' },
      { path: 'benchmarks', type: 'directory' },
    ];
  }

  /**
   * Get library-specific files
   * @param config - Project configuration
   * @returns Array of file items
   */
  private getLibraryFiles(config: ProjectConfig): DirectoryItem[] {
    const coreFiles = this.generateCoreFiles(config);
    const exampleFiles = this.generateExampleFiles(config);
    const benchmarkFiles = this.generateBenchmarkFiles(config);

    return [...coreFiles, ...exampleFiles, ...benchmarkFiles];
  }

  /**
   * Generates core library files
   * @param config - Project configuration
   * @returns Core file items
   */
  private generateCoreFiles(config: ProjectConfig): DirectoryItem[] {
    const fileContents = this.generateCoreFileContents(config);
    const filePaths = [
      'src/lib/index.ts',
      'src/lib/core.ts',
      'src/lib/types/index.ts',
      'src/lib/utils/index.ts',
      'src/lib/constants/index.ts',
    ];

    return filePaths.map((path, index) => ({
      path,
      type: 'file' as const,
      content: fileContents[index],
    }));
  }

  /**
   * Generates core file contents
   * @param config - Project configuration
   * @returns Array of file contents
   */
  private generateCoreFileContents(config: ProjectConfig): string[] {
    return [
      this.mainExportGenerator.generateMainExport(config),
      this.coreModuleGenerator.generateCoreModule(config),
      this.typesGenerator.generateTypeExports(config),
      this.utilsGenerator.generateUtilsExports(config),
      this.constantsGenerator.generateConstantsExports(config),
    ];
  }

  /**
   * Generates example files
   * @param config - Project configuration
   * @returns Example file items
   */
  private generateExampleFiles(config: ProjectConfig): DirectoryItem[] {
    const basicExample = this.examplesGenerator.generateBasicExample(config);
    const advancedExample = this.examplesGenerator.generateAdvancedExample(config);

    return [
      {
        path: 'examples/basic/usage.ts',
        type: 'file',
        content: basicExample,
      },
      {
        path: 'examples/advanced/usage.ts',
        type: 'file',
        content: advancedExample,
      },
    ];
  }

  /**
   * Generates benchmark files
   * @param config - Project configuration
   * @returns Benchmark file items
   */
  private generateBenchmarkFiles(config: ProjectConfig): DirectoryItem[] {
    const performanceBenchmark =
      this.performanceBenchmarkGenerator.generatePerformanceBenchmark(config);

    return [
      {
        path: 'benchmarks/performance.test.ts',
        type: 'file',
        content: performanceBenchmark,
      },
    ];
  }
}
