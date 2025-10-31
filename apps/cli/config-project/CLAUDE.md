# Claude Code Integration

AI Assistant: claude-code

## Project Information

**Name**: config-project
**Description**: Project from config

## Code Standards
- All code, comments, and documentation must be written in English
- Follow ESLint rules without disabling them inline
- Write comprehensive tests with high mutation score thresholds
- Use `bunx turbo test` for running tests

## Development Guidelines
- Follow SOLID principles
- Use TypeScript for type safety
- Maintain consistent code formatting with Prettier
- Write meaningful commit messages in English

## Language Requirements

All code, code comments, and technical documentation MUST be written in **English**.

- **Code**: English only
- **Code comments**: English only
- **Technical documentation** (README files, API docs, inline docs, etc.): English only
- **Commit messages**: English only
- **Pull request descriptions**: English only

## Development Workflow

TypeScript
ESLint
test
coverage

## Testing Requirements
- Aim for high test coverage
- Do not lower mutation testing thresholds
- Add more tests to kill surviving mutants
- Use the project's testing framework

## Project Structure
- `src/` - Main source code
- `tests/` - Test files
- `docs/` - Documentation
- `.nimata/` - Project configuration and cache
- `src/components/` - Reusable UI components
- `src/pages/` - Page-level components

## Architecture

Web Application with frontend components.

### Key Components
- src/components/
- src/pages/

## Quality Standards

**Quality Level**: strict
- Target coverage: 95%
- Minimum 95% required for all tests

### ESLint Rules

**CRITICAL RULE**: NEVER disable ESLint rules via inline comments (eslint-disable, eslint-disable-next-line, etc.).

1. ❌ **NEVER USE** `// eslint-disable-next-line`
2. ❌ **NEVER USE** `/* eslint-disable */`
3. ✅ **ALWAYS FIX** the underlying code issue

**Rationale**: Disabling rules masks code quality issues and creates technical debt. Code must comply with all ESLint rules without exceptions.

### Mutation Testing Thresholds

**CRITICAL RULE**: NEVER reduce mutation testing thresholds to make tests pass. If mutation score is below threshold:

1. ✅ **ADD MORE TESTS** to kill surviving mutants
2. ✅ **IMPROVE TEST QUALITY** to cover edge cases
3. ❌ **NEVER LOWER THRESHOLDS** as a shortcut

**Rationale**: Lowering thresholds masks quality issues and creates technical debt. Always improve test coverage instead.

- All ESLint rules must pass
- Code must be well-documented
- Follow the established patterns in the codebase
- Maintain backward compatibility when possible

## Notes
- Author: Your Name
- License: MIT
- Project Type: web
- Quality Level: strict