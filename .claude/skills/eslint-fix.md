# ESLint Fix Skill

Fixes all ESLint/Biome violations in the codebase systematically.

## Usage

Execute `eslint-fix` to run the complete ESLint fixing workflow:

- Analyzes all ESLint violations across packages
- Applies auto-fixes in parallel using turbo optimization
- Manually fixes complex rule violations file-by-file
- Ensures 0 ESLint errors without disabling any rules
- Maintains code functionality while improving style

## Process

1. **Assessment**: `bunx turbo lint` to catalog all violations
2. **Auto-Fix**: Apply parallel auto-fixes where possible
3. **Manual Fix**: Systematic resolution of complex violations
4. **Validation**: Verify 0 ESLint errors across all packages

## Result

Returns comprehensive report of all ESLint fixes applied with before/after metrics.
