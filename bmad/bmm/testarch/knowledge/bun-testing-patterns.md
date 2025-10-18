# Bun Testing Patterns

## Test Configuration

- Use `bun test` for test execution
- Test files: `*.test.ts` or `*.spec.ts`
- Snapshot support: Built-in
- Coverage: `bun test --coverage`

## Common Patterns

```typescript
// Unit test example
import { describe, it, expect, beforeEach } from 'bun:test';

describe('DeepMerge', () => {
  beforeEach(() => {
    // Setup
  });

  it('should merge simple objects', () => {
    const result = deepMerge({ a: 1 }, { b: 2 });
    expect(result).toEqual({ a: 1, b: 2 });
  });
});
```

## Async Testing

```typescript
import { test } from 'bun:test';

test('async function', async () => {
  const result = await asyncFunction();
  expect(result).toBe('expected');
});
```

## Mock Testing

```typescript
import { mock } from 'bun:test';

const mockFn = mock(() => 'mocked value');
mockFn.mockReturnValueOnce('different value');
```

## Performance Testing

```typescript
import { test } from 'bun:test';

test('load performance', async () => {
  const start = performance.now();
  await loadConfig();
  const duration = performance.now() - start;
  expect(duration).toBeLessThan(50); // < 50ms target
});
```

## File Watching

```bash
bun test --watch
```

## Integration with BMAD

- Tests must pass 100% during story implementation
- Quality gates include TypeScript compilation and ESLint checks
- Mutation testing targets 80%+ score using Stryker
