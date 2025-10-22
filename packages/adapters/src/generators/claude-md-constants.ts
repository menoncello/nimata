/**
 * CLAUDE.md Generator Constants
 *
 * Magic numbers and configuration values for CLAUDE.md generation
 */

export const CLAUDE_MD_CONSTANTS = {
  COVERAGE_THRESHOLD: {
    LIGHT: 70,
    MEDIUM: 85,
    STRICT: 95,
    DEFAULT: 80,
  },
  CODE_STYLE: {
    DEFAULT_INDENT_SIZE: 2,
    DEFAULT_PRINT_WIDTH: 100,
    LIGHT_PRINT_WIDTH: 120,
    MEDIUM_PRINT_WIDTH: 100,
    STRICT_PRINT_WIDTH: 80,
  },
} as const;

// Critical ESLint rules content
export const ESLINT_CRITICAL_RULES = `**CRITICAL RULE**: NEVER disable ESLint rules via inline comments (eslint-disable, eslint-disable-next-line, etc.).

1. ❌ **NEVER USE** \`// eslint-disable-next-line\`
2. ❌ **NEVER USE** \`/* eslint-disable */\`
3. ✅ **ALWAYS FIX** the underlying code issue

**Rationale**: Disabling rules masks code quality issues and creates technical debt. Code must comply with all ESLint rules without exceptions.`;

// Mutation testing thresholds content
export const MUTATION_THRESHOLDS = `### Mutation Testing Thresholds

**CRITICAL RULE**: NEVER reduce mutation testing thresholds to make tests pass. If mutation score is below threshold:

1. ✅ **ADD MORE TESTS** to kill surviving mutants
2. ✅ **IMPROVE TEST QUALITY** to cover edge cases
3. ❌ **NEVER LOWER THRESHOLDS** as a shortcut

**Rationale**: Lowering thresholds masks quality issues and creates technical debt. Always improve test coverage instead.`;

// Code style requirements content
export const CODE_STYLE_REQUIREMENTS = `### Code Style Requirements

**CRITICAL RULE**: All code, code comments, and technical documentation MUST be written in **English**.

- **Code**: English only
- **Code comments**: English only
- **Technical documentation**: English only
- **Commit messages**: English only
- **Pull request descriptions**: English only

- **Indentation**: 2 spaces (no tabs)
- **Quotes**: Single quotes preferred`;

// Code patterns content for AI context
export const GOOD_PATTERNS = `### Good Patterns
\`\`\`typescript
// Use explicit return types
function processData(input: string): Promise<ProcessedData> {
  // Implementation
}

// Use proper error handling
try {
  const result = await operation();
  return result;
} catch (error) {
  console.error('Operation failed:', error);
  throw error;
}`;

export const BAD_PATTERNS = `### Avoid These Patterns
\`\`\`typescript
// Avoid any types
const data: any = fetchData();

// Avoid console.log in production code
console.log(data); // ❌

// Avoid missing return types
function process(input) { // ❌
  return input.trim();
}
\`\`\``;

// CLI pattern for AI context
export const CLI_PATTERN = `// Use command pattern for CLI operations
class CreateCommand {
  async execute(options: CommandOptions): Promise<void> {
    // Implementation
  }
}`;

// CLI pattern as bullet point for tests
export const CLI_BULLET_PATTERN = `- Use command pattern for CLI operations`;
