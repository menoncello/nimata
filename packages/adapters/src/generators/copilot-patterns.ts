/**
 * Copilot Pattern Utilities
 *
 * Provides pattern generation utilities for GitHub Copilot instructions
 */

/**
 * Get TypeScript function pattern
 * @returns {string} Function pattern code block
 */
function getFunctionPattern(): string {
  return `### TypeScript Function Pattern
\`\`\`typescript
// Example function with proper typing and documentation
/**
 * Process input data and return result
 * @param {string} input - The input data to process
 * @returns {void} Promise that resolves to processed data
 */
async function processData(input: string): Promise<ProcessedData> {
  try {
    const result = await someOperation(input);
    return result;
  } catch (error) {
    console.error('Processing failed:', error);
    throw error;
  }
}
\`\`\``;
}

/**
 * Get class pattern
 * @returns {string} Class pattern code block
 */
function getClassPattern(): string {
  return `### Class Pattern
\`\`\`typescript
/**
 * Example service class with dependency injection
 */
export class DataService {
  constructor(private repository: DataRepository) {}

  async findById(id: string): Promise<Data | null> {
    return this.repository.findById(id);
  }

  async create(data: CreateDataDto): Promise<Data> {
    const entity = new Data();
    Object.assign(entity, data);
    return this.repository.save(entity);
  }
}
\`\`\``;
}

/**
 * Get error handling pattern
 * @returns {string} Error handling pattern code block
 */
function getErrorHandlingPattern(): string {
  return `### Error Handling Pattern
\`\`\`typescript
/**
 * Standardized error handling wrapper
 */
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  context: string
): Promise<Result<T>> {
  try {
    const result = await operation();
    return { success: true, data: result };
  } catch (error) {
    console.error(\`Error in \${context}:\`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
\`\`\``;
}

/**
 * Get testing pattern
 * @returns {string} Testing pattern code block
 */
function getTestingPattern(): string {
  return `### Testing Pattern
\`\`\`typescript
/**
 * Example test with proper structure and assertions
 */
describe('DataService', () => {
  let service: DataService;
  let mockRepository: jest.Mocked<DataRepository>;

  beforeEach(() => {
    mockRepository = createMockRepository();
    service = new DataService(mockRepository);
  });

  it('should create data successfully', async () => {
    // Arrange
    const inputData = { name: 'Test', value: 123 };
    const expectedData = { id: '1', ...inputData };
    mockRepository.save.mockResolvedValue(expectedData);

    // Act
    const result = await service.create(inputData);

    // Assert
    expect(result).toEqual(expectedData);
    expect(mockRepository.save).toHaveBeenCalledWith(
      expect.objectContaining(inputData)
    );
  });
});
\`\`\``;
}

/**
 * Get project-specific guidelines
 * @returns {string} Guidelines text
 */
function getProjectGuidelines(): string {
  return `## Project-Specific Guidelines

- Always use proper TypeScript types
- Follow the established folder structure
- Write meaningful commit messages
- Add JSDoc comments for public APIs
- Handle errors gracefully and consistently
- Write tests for all public methods
- Use async/await instead of promises with .then()
- Prefer functional programming patterns where appropriate`;
}

/**
 * Get code patterns and examples content
 * @returns {string} Code patterns content string
 */
export function getCodePatternsContent(): string {
  const patterns = [
    '## Common Patterns',
    getFunctionPattern(),
    getClassPattern(),
    getErrorHandlingPattern(),
    getTestingPattern(),
    getProjectGuidelines(),
    '## API Patterns',
    getAPIPatterns('web'),
    '## Configuration Patterns',
    getConfigurationPatterns(),
    '## Error Handling Patterns',
    getErrorHandlingPatterns(),
  ];

  return patterns.join('\n\n');
}

/**
 * Wrap code in markdown code block
 * @param {string} code - Code to wrap
 * @returns {string): string} Wrapped code
 */
export function wrapInCodeBlock(code: string): string {
  return `\`\`\`typescript
${code}
\`\`\``;
}

/**
 * Get project-specific pattern
 * @param {string} projectType - Type of project
 * @returns {string): string} Pattern code
 */
export function getProjectPattern(projectType: string): string {
  const patterns = {
    cli: getCliPattern(),
    web: getWebPattern(),
    basic: getBasicPattern(),
  };

  return patterns[projectType as keyof typeof patterns] || patterns.basic;
}

/**
 * Get CLI pattern
 * @returns {string} CLI pattern code
 */
function getCliPattern(): string {
  return `// Command pattern example
export class MyCommand {
  async execute(options: CommandOptions): Promise<void> {
    try {
      // Command implementation
      console.log('Command executed successfully');
    } catch (error) {
      console.error('Command failed:', error.message);
      process.exit(1);
    }
  }
}`;
}

/**
 * Get web pattern
 * @returns {string} Web pattern code
 */
function getWebPattern(): string {
  return `// Express route example
import { Request, Response } from 'express';

export const getUserHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await userService.findById(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};`;
}

/**
 * Get basic pattern
 * @returns {string} Basic pattern code
 */
function getBasicPattern(): string {
  return `// Basic function pattern
export const exampleFunction = (param: string): string => {
  if (!param) {
    throw new Error('Parameter is required');
  }
  return \`Processed: \${param}\`;
};`;
}

/**
 * Get testing patterns
 * @returns {string} Testing patterns string
 */
export function getTestingPatterns(): string {
  return `import { describe, it, expect, beforeEach, vi } from 'vitest';

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
});`;
}

/**
 * Get error handling patterns
 * @returns {string} Error handling patterns string
 */
export function getErrorHandlingPatterns(): string {
  return `// Error handling pattern
export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 500
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const safeExecute = async <T>(
  operation: () => Promise<T>,
  errorMessage: string
): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(errorMessage, 'OPERATION_FAILED');
  }
};`;
}

/**
 * Get API patterns
 * @param {string} projectType - Type of project
 * @returns {string): string} API patterns string
 */
export function getAPIPatterns(projectType: string): string {
  if (projectType === 'web') {
    return `// RESTful API pattern
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export const createSuccessResponse = <T>(data: T): ApiResponse<T> => ({
  data,
  success: true,
});

export const createErrorResponse = (message: string): ApiResponse<null> => ({
  data: null,
  success: false,
  message,
});`;
  }

  return '';
}

/**
 * Get configuration patterns
 * @returns {string} Configuration patterns string
 */
export function getConfigurationPatterns(): string {
  return `// Configuration pattern
export interface AppConfig {
  port: number;
  database: DatabaseConfig;
  logging: LoggingConfig;
}

export const loadConfig = (): AppConfig => {
  return {
    port: parseInt(process.env.PORT || '3000', 10),
    database: {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
    },
    logging: {
      level: process.env.LOG_LEVEL || 'info',
    },
  };
};`;
}
