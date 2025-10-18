# Mutation Testing with Stryker

## Configuration

```json
{
  "testRunner": "command",
  "commandRunner": {
    "command": "bun test"
  },
  "plugins": ["@stryker-mutator/typescript-checker"],
  "thresholds": {
    "high": 90,
    "low": 80,
    "break": 80
  }
}
```

## Target Scores

- **High**: 90% (excellent)
- **Low**: 80% (minimum acceptable)
- **Break**: 80% (CI failure threshold)

## Running Tests

```bash
cd packages/core
bun run test:mutation
```

## Interpreting Results

- **Killed mutants**: Good (tests caught the bug)
- **Survived mutants**: Bad (tests missed the bug)
- **Timeout mutants**: Usually indicates async issues

## Common Mutation Types

- Arithmetic operators (+, -, \*, /)
- Conditional operators (&&, ||)
- Equality checks (===, !==)
- Array methods (push, pop, shift, unshift)
- Boolean values (true/false)

## BMAD Integration

- DEV agent runs mutation testing as optional substep 4.6
- Target mutation score: 80%+
- Surviving mutants indicate test gaps
- Used to validate test quality, not just coverage

## Best Practices

1. Focus on critical business logic first
2. Improve tests for surviving mutants
3. Use mutation reports to identify weak tests
4. Set appropriate thresholds per package complexity
