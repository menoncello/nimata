/**
 * TypeScript Configuration Generator
 *
 * Generates TypeScript configuration files for projects
 */
import type { ProjectConfig } from '../../../types/project-config.js';

/**
 * TypeScript Configuration Generator class
 */
export class TypeScriptConfigGenerator {
  /**
   * Generate TypeScript configuration
   * @param _config - Project configuration
   * @returns tsconfig.json content
   */
  generate(_config: ProjectConfig): string {
    return `{
  "compilerOptions": ${this.generateCompilerOptions()},
  "include": ${this.generateInclude()},
  "exclude": ${this.generateExclude()},
  "ts-node": ${this.generateTsNode()}
}`;
  }

  /**
   * Generate TypeScript compiler options
   * @returns Compiler options JSON string
   */
  private generateCompilerOptions(): string {
    return `{
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "allowJs": true,
    "strict": true,
    "noEmit": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "dist",
    "rootDir": "src",
    "removeComments": false,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "verbatimModuleSyntax": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitOverride": true,
    "baseUrl": ".",
    "paths": ${this.generatePaths()}
  }`;
  }

  /**
   * Generate TypeScript path mappings
   * @returns Path mappings JSON string
   */
  private generatePaths(): string {
    return `{
      "@/*": ["src/*"],
      "@/types/*": ["src/types/*"],
      "@/utils/*": ["src/utils/*"],
      "@/config/*": ["src/config/*"],
      "@/services/*": ["src/services/*"]
    }`;
  }

  /**
   * Generate TypeScript include patterns
   * @returns Include patterns JSON string
   */
  private generateInclude(): string {
    return `[
    "src/**/*",
    "tests/**/*"
  ]`;
  }

  /**
   * Generate TypeScript exclude patterns
   * @returns Exclude patterns JSON string
   */
  private generateExclude(): string {
    return `[
    "node_modules",
    "dist",
    "build",
    "coverage"
  ]`;
  }

  /**
   * Generate TypeScript ts-node configuration
   * @returns ts-node configuration JSON string
   */
  private generateTsNode(): string {
    return `{
    "esm": true,
    "experimentalSpecifierResolution": "node"
  }`;
  }
}
