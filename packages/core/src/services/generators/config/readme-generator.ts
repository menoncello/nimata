/**
 * README Content Generator
 */

import type { ProjectConfig } from '../../../types/project-config.js';
import { toPascalCase } from '../../../utils/string-utils.js';

/**
 * Generates README content for projects
 */
export class ReadmeGenerator {
  /**
   * Generate README content
   * @param config - Project configuration
   * @returns README markdown content
   */
  static generate(config: ProjectConfig): string {
    const header = this.generateHeader(config);
    const features = this.generateFeatures(config);
    const installation = this.generateInstallation(config);
    const usage = this.generateUsage(config);
    const development = this.generateDevelopmentSection();
    const license = this.generateLicense(config);
    const footer = this.generateFooter(config);

    return [header, features, installation, usage, development, license, footer].join('\n\n');
  }

  /**
   * Generate README header
   * @param config - Project configuration
   * @returns README header content
   */
  private static generateHeader(config: ProjectConfig): string {
    const description = config.description ? `\n\n${config.description}` : '';
    return `# ${config.name}${description}`;
  }

  /**
   * Generate features section
   * @param config - Project configuration
   * @returns Features section content
   */
  private static generateFeatures(config: ProjectConfig): string {
    const baseFeatures = `- 🚀 Built with [Bun](https://bun.sh) for lightning-fast performance
- 📝 Written in TypeScript with strict type checking
- 🧪 Comprehensive test coverage with [Vitest](https://vitest.dev/)
- 🎨 Consistent code formatting with [Prettier](https://prettier.io/)
- 🔍 Code quality checks with [ESLint](https://eslint.org/)`;

    const additionalFeatures =
      config.qualityLevel === 'high'
        ? `\n- 🧬 Mutation testing with [Stryker](https://stryker-mutator.io/)\n- 🚀 CI/CD pipeline with GitHub Actions`
        : '';

    return `## Features\n\n${baseFeatures}${additionalFeatures}`;
  }

  /**
   * Generate installation section
   * @param config - Project configuration
   * @returns Installation section content
   */
  private static generateInstallation(config: ProjectConfig): string {
    return `## Installation

\`\`\`bash
bun add ${config.name}
\`\`\``;
  }

  /**
   * Generate usage section
   * @param config - Project configuration
   * @returns Usage section content
   */
  private static generateUsage(config: ProjectConfig): string {
    const pascalCaseName = toPascalCase(config.name);
    return `## Usage

\`\`\`typescript
import { ${pascalCaseName}Core } from '${config.name}';

const app = new ${pascalCaseName}Core({
  debug: true
});

await app.initialize();
\`\`\``;
  }

  /**
   * Generate development section
   * @returns Development section content
   */
  private static generateDevelopmentSection(): string {
    return `## Development

\`\`\`bash
# Install dependencies
bun install

# Run tests
bun test

# Run tests with coverage
bun test --coverage

# Type checking
bun run typecheck

# Linting
bun run lint

# Format code
bun run format

# Build
bun run build
\`\`\``;
  }

  /**
   * Generate license section
   * @param config - Project configuration
   * @returns License section content
   */
  private static generateLicense(config: ProjectConfig): string {
    return `## License

${config.license || 'MIT'}`;
  }

  /**
   * Generate footer
   * @param config - Project configuration
   * @returns Footer content
   */
  private static generateFooter(config: ProjectConfig): string {
    return `---

Made with ❤️ by ${config.author || 'the community'}`;
  }
}
