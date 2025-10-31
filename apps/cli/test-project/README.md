# test-project

## Features

- 🚀 Built with [Bun](https://bun.sh) for lightning-fast performance
- 📝 Written in TypeScript with strict type checking
- 🧪 Comprehensive test coverage with [Vitest](https://vitest.dev/)
- 🎨 Consistent code formatting with [Prettier](https://prettier.io/)
- 🔍 Code quality checks with [ESLint](https://eslint.org/)

## Installation

```bash
bun add test-project
```

## Usage

```typescript
import { TestProjectCore } from 'test-project';

const app = new TestProjectCore({
  debug: true,
});

await app.initialize();
```

## Development

```bash
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
```

## License

MIT

---

Made with ❤️ by the community
