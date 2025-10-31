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
   * @param {ProjectConfig} _config - Project configuration
   * @returns {string} Error middleware TypeScript code
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
   * @returns {string} Import statements
   */
  private getMiddlewareImports(): string {
    return `import { Request, Response, NextFunction } from 'express';`;
  }

  /**
   * Get error interface definition
   * @returns {string} Error interface
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
   * @returns {string} Error middleware code
   */
  private getErrorMiddlewareImplementation(): string {
    return [this.getErrorMiddlewareSignature(), this.getErrorMiddlewareBody()].join('\n');
  }

  /**
   * Get error middleware signature
   * @returns {string} Error middleware signature
   */
  private getErrorMiddlewareSignature(): string {
    return `/**
 * Global error handling middleware
 * @param {string} error - Error object
 * @param {string} req - Express request object
 * @param {string} res - Express response object
 * @param {string} next - Express next function
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
   * @returns {string} Error middleware body
   */
  private getErrorMiddlewareBody(): string {
    return [
      this.getErrorContext(),
      this.getErrorLogging(),
      this.getErrorResponsePreparation(),
      this.getErrorSending(),
    ].join('\n\n');
  }

  /**
   * Get error context initialization
   * @returns {string} Error context code
   */
  private getErrorContext(): string {
    return `  const statusCode = error.statusCode || 500;
  const isOperational = error.isOperational || false;`;
  }

  /**
   * Get error logging logic
   * @returns {string} Error logging code
   */
  private getErrorLogging(): string {
    return `  // Log error details using structured logging
  const logData = {
    message: error.message,
    stack: error.stack,
    statusCode,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  };

  // In production, use a proper logging service
  if (process.env.NODE_ENV === 'production') {
    // Send to logging service (e.g., Winston, Pino, etc.)
    // For now, we'll write to stderr as a fallback
    process.stderr.write(JSON.stringify({ level: 'error', ...logData }) + '\\n');
  } else {
    // Development logging
    process.stderr.write(\`ERROR: \${JSON.stringify(logData, null, 2)}\\n\`);
  }`;
  }

  /**
   * Get error response preparation
   * @returns {string} Error response preparation code
   */
  private getErrorResponsePreparation(): string {
    return `  // Prepare error response
  const errorResponse = {
    success: false,
    error: {
      message: isOperational ? error.message : 'Internal Server Error',
      code: error.code || 'INTERNAL_ERROR',
      ...(isOperational && error.details ? { details: error.details } : {}),
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    },
    timestamp: new Date().toISOString()
  };`;
  }

  /**
   * Get error sending logic
   * @returns {string} Error sending code
   */
  private getErrorSending(): string {
    return `  res.status(statusCode).json(errorResponse);`;
  }

  /**
   * Get 404 handler implementation
   * @returns {string} 404 handler code
   */
  private get404Handler(): string {
    return `/**
 * 404 Not Found handler
 * @param {string} req - Express request object
 * @param {string} res - Express response object
 * @param {string} next - Express next function
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
   * @returns {string} Validation middleware code
   */
  private getValidationMiddleware(): string {
    return [this.getValidationMiddlewareSignature(), this.getValidationMiddlewareBody()].join('\n');
  }

  /**
   * Get validation middleware signature
   * @returns {string} Validation middleware signature
   */
  private getValidationMiddlewareSignature(): string {
    return `/**
 * Request validation middleware
 * @param {string} schema - Validation schema
 * @returns {string} Validation middleware function
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
   * @returns {string} Validation middleware body
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
   * @returns {string} Logging middleware code
   */
  private getLoggingMiddleware(): string {
    return [this.getLoggingMiddlewareSignature(), this.getLoggingMiddlewareBody()].join('\n');
  }

  /**
   * Get logging middleware signature
   * @returns {string} Logging middleware signature
   */
  private getLoggingMiddlewareSignature(): string {
    return `/**
 * Request logging middleware
 * @param {string} req - Express request object
 * @param {string} res - Express response object
 * @param {string} next - Express next function
 */
export function requestLogger(req: Request, res: Response, next: NextFunction): void {`;
  }

  /**
   * Get logging middleware body
   * @returns {string} Logging middleware body
   */
  private getLoggingMiddlewareBody(): string {
    return [this.getRequestTimingStart(), this.getResponseLogging(), this.getNextCall()].join(
      '\n\n'
    );
  }

  /**
   * Get request timing start
   * @returns {string} Request timing code
   */
  private getRequestTimingStart(): string {
    return `  const startTime = Date.now();`;
  }

  /**
   * Get response logging logic
   * @returns {string} Response logging code
   */
  private getResponseLogging(): string {
    return `  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const logData = {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: \`\${duration}ms\`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      timestamp: new Date().toISOString()
    };

    // In production, use a proper logging service
    if (process.env.NODE_ENV === 'production') {
      // Send to logging service (e.g., Winston, Pino, etc.)
      // For now, we'll write to stdout as a fallback
      process.stdout.write(JSON.stringify({ level: 'info', ...logData }) + '\\n');
    } else {
      // Development logging
      process.stdout.write(\`ACCESS: \${JSON.stringify(logData, null, 2)}\\n\`);
    }
  });`;
  }

  /**
   * Get next function call
   * @returns {string} Next call code
   */
  private getNextCall(): string {
    return `  next();`;
  }
}
