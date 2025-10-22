/**
 * Copilot patterns content utilities
 */

/**
 * Get CLI project patterns content
 * @returns CLI patterns string
 */
function getCLIPatternsContent(): string {
  return `### Command pattern example
\`\`\`typescript
export class MyCommand {
  constructor(private readonly dependencies: CommandDependencies) {}

  async execute(options: CommandOptions): Promise<void> {
    try {
      console.log('Command executed successfully');
    } catch (error) {
      console.error('Command failed:', error.message);
      process.exit(1);
    }
  }
}
\`\`\``;
}

/**
 * Get web project patterns content
 * @returns Web patterns string
 */
/**
 * Get Express route example content
 * @returns Express route example string
 */
function getExpressRouteExample(): string {
  return `### Express route example
\`\`\`typescript
import { Request, Response } from 'express';

export const getUserHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await userService.findById(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
\`\`\``;
}

/**
 * Get RESTful API pattern content
 * @returns RESTful API pattern string
 */
function getRestfulApiPattern(): string {
  return `### RESTful API Pattern
\`\`\`typescript
import { Request, Response } from 'express';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export const createSuccessResponse = <T>(data: T): ApiResponse<T> => ({
  success: true,
  data,
});

export const createErrorResponse = (error: string): ApiResponse<never> => ({
  success: false,
  error,
});
\`\`\``;
}

/**
 * Get combined web patterns content
 * @returns Combined web patterns string
 */
function getWebPatternsContent(): string {
  return `${getExpressRouteExample()}

${getRestfulApiPattern()}`;
}

/**
 * Get project-specific patterns content
 * @param projectType - Type of project
 * @returns Project-specific patterns string
 */
export function getProjectSpecificPatternsContent(projectType: string): string {
  switch (projectType) {
    case 'cli':
      return getCLIPatternsContent();
    case 'web':
      return getWebPatternsContent();
    default:
      return '';
  }
}

/**
 * Get best practices content
 * @returns Best practices string
 */
/**
 * Get best practices list content
 * @returns Best practices list string
 */
function getBestPracticesList(): string {
  return `
## Best Practices

- **Always** use proper TypeScript typing
- **Follow** established naming conventions
- **Write** comprehensive tests for all new code
- **Handle** errors gracefully and consistently
- **Include** proper JSDoc documentation
- **Use** async/await instead of Promise chains
- **Prefer** functional programming patterns where appropriate
- **Ensure** all generated code follows these guidelines`;
}

/**
 * Get testing pattern content
 * @returns Testing pattern string
 */
function getTestingPattern(): string {
  return `### Testing Pattern
\`\`\`typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Example functionality', () => {
  beforeEach(() => {
    // Setup before each test
  });

  it('should handle valid input correctly', async () => {
    // Arrange
    const input = 'test input';

    // Act
    const result = await exampleFunction(input);

    // Assert
    expect(result).toBe('Processed: test input');
  });

  it('should throw error for invalid input', async () => {
    // Arrange
    const input = '';

    // Act & Assert
    await expect(exampleFunction(input)).rejects.toThrow('Parameter is required');
  });
});
\`\`\``;
}

/**
 * Get combined best practices content
 * @returns Combined best practices string
 */
export function getBestPracticesContent(): string {
  return `${getBestPracticesList()}

${getTestingPattern()}`;
}
