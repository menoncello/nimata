# Bun Testing Patterns

## Test Structure

```typescript
import { describe, it, expect } from 'bun:test';

describe('ComponentName', () => {
  it('should behave correctly', () => {
    // Arrange
    const input = 'test';

    // Act
    const result = functionUnderTest(input);

    // Assert
    expect(result).toBe('expected');
  });
});
```

## Best Practices

- Use `describe`, `it`, `expect` from Bun Test consistently
- Handle async/await correctly in tests
- Use proper TypeScript types for test data (no 'any' allowed)
- No conditionals in tests - use type assertions after runtime validation
- Tests must have meaningful assertions that validate behavior
- Structure tests to kill mutants in mutation testing

## Async Testing

```typescript
describe('AsyncComponent', () => {
  it('should handle async operations', async () => {
    // Arrange
    const mockData = { id: 1, name: 'test' };

    // Act
    const result = await asyncFunction(mockData);

    // Assert
    expect(result).toBeDefined();
    expect(result.name).toBe('test');
  });
});
```

## Error Testing

```typescript
describe('ErrorHandling', () => {
  it('should throw error with invalid input', () => {
    // Arrange
    const invalidInput = null;

    // Act & Assert
    expect(() => functionUnderTest(invalidInput)).toThrow('Invalid input');
  });
});
```

## Mutation Testing Considerations

- Test boundary values (0, -1, max values)
- Test null/undefined cases
- Test error paths and exception handling
- Avoid meaningless assertions
- Use specific, targeted assertions
- Consider edge cases that might survive mutations
