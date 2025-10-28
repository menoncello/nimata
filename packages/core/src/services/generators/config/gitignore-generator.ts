/**
 * Gitignore Generator
 *
 * Generates .gitignore content for projects
 */
import type { ProjectConfig } from '../../../types/project-config.js';

/**
 * Gitignore Generator class
 */
export class GitignoreGenerator {
  /**
   * Generate .gitignore content
   * @param _config - Project configuration
   * @returns .gitignore content
   */
  generate(_config: ProjectConfig): string {
    return [
      this.generateDependencies(),
      this.generateBuilds(),
      this.generateEnvironment(),
      this.generateIDE(),
      this.generateOS(),
      this.generateLogs(),
      this.generateRuntime(),
      this.generateCoverage(),
      this.generateCache(),
      this.generateOutputs(),
      this.generateEditors(),
    ].join('\n');
  }

  /**
   * Generate dependencies section of .gitignore
   * @returns Dependencies gitignore content
   */
  private generateDependencies(): string {
    return `# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
jspm_packages/`;
  }

  /**
   * Generate builds section of .gitignore
   * @returns Builds gitignore content
   */
  private generateBuilds(): string {
    return `# Production builds
dist/
build/
out/
.next/
.nuxt/
.cache/

# Next.js build output
.next

# Nuxt.js build / generate output
.nuxt

# Gatsby files
.cache/
public`;
  }

  /**
   * Generate environment variables section of .gitignore
   * @returns Environment gitignore content
   */
  private generateEnvironment(): string {
    return `# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local`;
  }

  /**
   * Generate IDE files section of .gitignore
   * @returns IDE gitignore content
   */
  private generateIDE(): string {
    return `# IDE files
.vscode/
.idea/
*.swp
*.swo
*~`;
  }

  /**
   * Generate OS generated files section of .gitignore
   * @returns OS gitignore content
   */
  private generateOS(): string {
    return `# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db`;
  }

  /**
   * Generate logs section of .gitignore
   * @returns Logs gitignore content
   */
  private generateLogs(): string {
    return `# Logs
logs/
*.log`;
  }

  /**
   * Generate runtime data section of .gitignore
   * @returns Runtime gitignore content
   */
  private generateRuntime(): string {
    return `# Runtime data
pids/
*.pid
*.seed
*.pid.lock`;
  }

  /**
   * Generate coverage section of .gitignore
   * @returns Coverage gitignore content
   */
  private generateCoverage(): string {
    return `# Coverage directory used by tools like istanbul
coverage/
*.lcov

# nyc test coverage
.nyc_output/`;
  }

  /**
   * Generate cache section of .gitignore
   * @returns Cache gitignore content
   */
  private generateCache(): string {
    return `# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Optional stylelint cache
.stylelintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# parcel-bundler cache (https://parceljs.org/)
.parcel-cache/`;
  }

  /**
   * Generate outputs section of .gitignore
   * @returns Outputs gitignore content
   */
  private generateOutputs(): string {
    return `# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# Storybook build outputs
.out
.storybook-out

# Temporary folders
tmp/
temp/`;
  }

  /**
   * Generate editor files section of .gitignore
   * @returns Editor gitignore content
   */
  private generateEditors(): string {
    return `# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Local Netlify folder
.netlify

# Turbo
.turbo

# Vite
.vite/

# TypeScript
*.tsbuildinfo

# Test results
test-results/
playwright-report/
test-results.xml
`;
  }
}
