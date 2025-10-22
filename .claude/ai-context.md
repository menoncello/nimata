# AI Context for nimata

**Generated**: 2025-10-21
**Quality Level**: strict
**Project Type**: basic

## Project Overview

**Name**: nimata
**Type**: Basic TypeScript Project
**Description**: asd

### Key Dependencies

- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Vitest for testing

## Code Patterns

### Good Patterns

```typescript
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
}
```

### Avoid These Patterns

```typescript
// Avoid any types
const data: any = fetchData();

// Avoid console.log in production code
console.log(data); // ❌

// Avoid missing return types
function process(input) {
  // ❌
  return input.trim();
}
```

## Testing Strategy

- Achieve 95% test coverage
- Use Vitest as the primary testing framework
- Test both happy path and error cases
- Mock external dependencies

## Development Guidelines

- Follow the existing code style
- Write tests for new features
- Update documentation when needed
- Use TypeScript strictly
- Handle errors properly

## Project Structure

```
src/
├── components/     # UI components (if web project)
├── utils/         # Utility functions
├── types/         # TypeScript type definitions
└── tests/         # Test files
```
