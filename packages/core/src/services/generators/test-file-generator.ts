/**
 * Test File Generator
 *
 * Generates test files based on project configuration
 */
import type { ProjectConfig } from '../../types/project-config.js';
import { toPascalCase } from '../../utils/string-utils.js';
import { ConfigTestBuilder } from './test-helpers/config-test-builder.js';
import { ErrorTestBuilder } from './test-helpers/error-test-builder.js';
import { TestSetupBuilder } from './test-helpers/test-setup-builder.js';
import { UnitTestBuilder } from './test-helpers/unit-test-builder.js';
import { ExpressTestGenerator } from './tests/express-test-generator.js';
import { ReactTestGenerator } from './tests/react-test-generator.js';
import { VueTestGenerator } from './tests/vue-test-generator.js';

/**
 * Test File Generator
 */
export class TestFileGenerator {
  private readonly reactTestGenerator: ReactTestGenerator;
  private readonly vueTestGenerator: VueTestGenerator;
  private readonly expressTestGenerator: ExpressTestGenerator;
  private readonly testSetupBuilder: TestSetupBuilder;
  private readonly unitTestBuilder: UnitTestBuilder;
  private readonly configTestBuilder: ConfigTestBuilder;
  private readonly errorTestBuilder: ErrorTestBuilder;

  /**
   * Initialize test generators
   */
  constructor() {
    this.reactTestGenerator = new ReactTestGenerator();
    this.vueTestGenerator = new VueTestGenerator();
    this.expressTestGenerator = new ExpressTestGenerator();
    this.testSetupBuilder = new TestSetupBuilder();
    this.unitTestBuilder = new UnitTestBuilder();
    this.configTestBuilder = new ConfigTestBuilder();
    this.errorTestBuilder = new ErrorTestBuilder();
  }

  /**
   * Generate test setup file content
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Test setup TypeScript code
   */
  generateTestSetup(config: ProjectConfig): string {
    const header = this.testSetupBuilder.getTestSetupHeader(config);
    const imports = this.testSetupBuilder.getTestSetupImports();
    const consoleSetup = this.testSetupBuilder.getConsoleSetup(config);
    const environmentSetup = this.testSetupBuilder.getEnvironmentSetup();
    const utilities = this.testSetupBuilder.getTestUtilities();

    return `${header}

${imports}

${consoleSetup}

${environmentSetup}

${utilities}
`;
  }

  /**
   * Generate test file content
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Test file TypeScript code
   */
  generate(config: ProjectConfig): string {
    const className = `${toPascalCase(config.name)}Core`;
    const interfaceName = `${toPascalCase(config.name)}Config`;

    const header = this.unitTestBuilder.getTestFileHeader(config, className);
    const setup = this.unitTestBuilder.getTestSetup(className, interfaceName);
    const constructorTests = this.unitTestBuilder.getConstructorTests(className);
    const initializeTests = this.configTestBuilder.getInitializeTests(className, config);
    const configTests = this.configTestBuilder.getConfigTests(className);
    const updateConfigTests = this.configTestBuilder.getUpdateConfigTests(className);
    const errorTests = this.errorTestBuilder.getErrorHandlingTests(className);
    const typeSpecificTests = this.generateTypeSpecificTests(config);

    return `${header}

${setup}

${constructorTests}

${initializeTests}

${configTests}

${updateConfigTests}

${errorTests}${typeSpecificTests}
});`;
  }

  /**
   * Generate type-specific tests
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Type-specific test code
   */
  private generateTypeSpecificTests(config: ProjectConfig): string {
    switch (config.projectType) {
      case 'bun-react':
        return this.reactTestGenerator.generateReactTests(config);
      case 'bun-vue':
        return this.vueTestGenerator.generateVueTests(config);
      case 'bun-express':
        return this.expressTestGenerator.generateExpressTests(config);
      default:
        return '';
    }
  }
}
