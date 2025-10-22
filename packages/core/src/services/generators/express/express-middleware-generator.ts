/**
 * Express Middleware Code Generator
 *
 * Generates Express middleware implementation code
 */
import type { ProjectConfig } from '../../../types/project-config.js';

/**
 * Generator for Express middleware code components
 */
export class ExpressMiddlewareCodeGenerator {
  /**
   * Generate Express error middleware
   * @param _config - Project configuration
   * @returns Error middleware TypeScript code
   */
  generateErrorMiddleware(_config: ProjectConfig): string {
    return [
      this.getMiddlewareImports(),
      this.getErrorInterface(),
      this.getErrorMiddlewareImplementation(),
      this.get404Handler(),
      this.getValidationMiddleware(),
      this.getLoggingMiddleware(),
    ].join('\n\n');
  }

  /**
   * Get middleware import statements
   * @returns Import statements
   */
  private getMiddlewareImports(): string {
    return `import { Request, Response, NextFunction } from 'express';`;
  }

  /**
   * Get error interface definition
   * @returns Error interface
   */
  private getErrorInterface(): string {
    return `/**
 * Extended error interface for application errors
 */
export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
  code?: string;
  details?: Record<string, unknown>;
}`;
  }

  /**
   * Get error middleware implementation
   * @returns Error middleware code
   */
  private getErrorMiddlewareImplementation(): string {
    return [this.getErrorMiddlewareSignature(), this.getErrorMiddlewareBody()].join('\n');
  }

  /**
   * Get error middleware signature
   * @returns Error middleware signature
   */
  private getErrorMiddlewareSignature(): string {
    return `/**
 * Global error handling middleware
 * @param error - Error object
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export function errorHandler(
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void {`;
  }

  /**
   * Get error middleware body
   * @returns Error middleware body
   */
  private getErrorMiddlewareBody(): string {
    return `  const statusCode = error.statusCode || 500;
  const isOperational = error.isOperational || false;

  // Log error details
  console.error('Error occurred:', {
    message: error.message,
    stack: error.stack,
    statusCode,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });

  // Prepare error response
  const errorResponse = {
    success: false,
    error: {
      message: isOperational ? error.message : 'Internal Server Error',
      code: error.code || 'INTERNAL_ERROR',
      ...(isOperational && error.details ? { details: error.details } : {}),
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    },
    timestamp: new Date().toISOString()
  };

  res.status(statusCode).json(errorResponse);
}`;
  }

  /**
   * Get 404 handler implementation
   * @returns 404 handler code
   */
  private get404Handler(): string {
    return `/**
 * 404 Not Found handler
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export function notFoundHandler(req: Request, res: Response, next: NextFunction): void {
  const error: AppError = new Error(\`Route \${req.originalUrl} not found\`);
  error.statusCode = 404;
  error.isOperational = true;
  next(error);
}`;
  }

  /**
   * Get validation middleware implementation
   * @returns Validation middleware code
   */
  private getValidationMiddleware(): string {
    return [this.getValidationMiddlewareSignature(), this.getValidationMiddlewareBody()].join('\n');
  }

  /**
   * Get validation middleware signature
   * @returns Validation middleware signature
   */
  private getValidationMiddlewareSignature(): string {
    return `/**
 * Request validation middleware
 * @param schema - Validation schema
 * @returns Validation middleware function
 */
export function validateRequest(schema: {
  body?: Record<string, unknown>;
  params?: Record<string, unknown>;
  query?: Record<string, unknown>;
}) {
  return (req: Request, res: Response, next: NextFunction): void => {`;
  }

  /**
   * Get validation middleware body
   * @returns Validation middleware body
   */
  private getValidationMiddlewareBody(): string {
    return `    try {
      // Basic validation implementation
      if (schema.body) {
        req.body = req.body || {};
      }
      if (schema.params) {
        req.params = req.params || {};
      }
      if (schema.query) {
        req.query = req.query || {};
      }

      next();
    } catch (error) {
      const appError: AppError = new Error('Validation failed');
      appError.statusCode = 400;
      appError.isOperational = true;
      appError.details = { validationErrors: error };
      next(appError);
    }
  };
}`;
  }

  /**
   * Get logging middleware implementation
   * @returns Logging middleware code
   */
  private getLoggingMiddleware(): string {
    return `/**
 * Request logging middleware
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    console.log({
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: \`\${duration}ms\`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      timestamp: new Date().toISOString()
    });
  });

  next();
}`;
  }
}
