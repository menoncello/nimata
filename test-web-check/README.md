# TestWebCheck

## Features

- Express.js web server with TypeScript
- RESTful API with proper error handling
- Health check endpoint
- CORS support
- Security headers with Helmet
- Request logging with Morgan
- Environment-based configuration
- Graceful shutdown handling

## Installation

```bash
# Clone and install dependencies
bun install

# Copy environment file
cp .env.example .env

# Configure your environment variables
nano .env
```

## Development

```bash
# Start development server with hot reload
bun run start:dev

# Run in watch mode
bun run dev

# Type checking
bun run typecheck

# Run tests
bun test

# Run tests with coverage
bun run test:coverage

# Linting
bun run lint

# Formatting
bun run format
```

## Production

```bash
# Build the project
bun run build

# Start production server
bun run start

# Or use PM2 for process management
pm2 start dist/server.js --name "test-web-check"
```

## API Endpoints

### Health Check

```bash
GET /health
```

Returns server health status and basic information.

### API Documentation

```bash
GET /api
```

Returns API documentation and available endpoints.

### Hello API

```bash
# Get greeting
GET /api/hello?name=World

# Create custom greeting
POST /api/hello
Content-Type: application/json

{
  "name": "TypeScript",
  "options": {
    "uppercase": true,
    "exclamation": true,
    "language": "es"
  }
}
```

### Response Format

All API responses follow a consistent format:

```json
{
  "status": "success|fail|error",
  "message": "Descriptive message",
  "data": {},
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Error Handling

The application includes comprehensive error handling:

- Global error handler middleware
- Custom error classes
- Proper HTTP status codes
- Error logging
- Development vs production error responses

## Environment Variables

| Variable       | Default       | Description             |
| -------------- | ------------- | ----------------------- |
| `NODE_ENV`     | `development` | Application environment |
| `PORT`         | `3000`        | Server port             |
| `CORS_ORIGINS` | `*`           | Allowed CORS origins    |

## Project Structure

```
src/
├── server.ts              # Main server file
├── routes/
│   ├── api.ts            # API router
│   └── hello.ts          # Hello routes
├── services/
│   └── helloService.ts   # Business logic
├── middleware/
│   ├── errorHandler.ts  # Error handling
│   └── notFoundHandler.ts # 404 handling
└── types/
    └── index.ts         # Type definitions
```

## License

MIT © 2025
