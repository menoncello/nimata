/**
 * Express Server Code Generator
 *
 * Generates Express server implementation code
 */
import type { ProjectConfig } from '../../../types/project-config.js';

/**
 * Generator for Express server code components
 */
export class ExpressServerCodeGenerator {
  /**
   * Generate Express server file
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Express server TypeScript code
   */
  generateExpressServer(config: ProjectConfig): string {
    return [
      this.getServerImports(),
      this.getCreateAppFunction(config),
      this.getStartServerFunction(),
      this.getAutoStartScript(),
    ].join('\n\n');
  }

  /**
   * Get server import statements
   * @returns {string} Import statements
   */
  private getServerImports(): string {
    return `import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from './middleware/error-handler.js';
import { indexRouter } from './routes/index.js';
import { config } from './config/environment.js';`;
  }

  /**
   * Get createApp function implementation
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} createApp function code
   */
  private getCreateAppFunction(config: ProjectConfig): string {
    return [
      this.getCreateAppSignature(),
      this.getCreateAppInitialization(),
      this.getCreateAppSecurity(config),
      this.getCreateAppLogging(config),
      this.getCreateAppBodyParsing(),
      this.getCreateAppRoutes(),
      this.getCreateAppHealthCheck(config),
      this.getCreateApp404Handler(),
      this.getCreateAppErrorHandler(),
      this.getCreateAppReturn(),
    ].join('\n');
  }

  /**
   * Get createApp function signature
   * @returns {string} createApp function signature
   */
  private getCreateAppSignature(): string {
    return `/**
 * Create and configure Express application
 */
export function createApp(): express.Application {`;
  }

  /**
   * Get createApp initialization
   * @returns {string} createApp initialization
   */
  private getCreateAppInitialization(): string {
    return `  const app = express();`;
  }

  /**
   * Get createApp security middleware
   * @param {ProjectConfig} _config - Project configuration (unused, kept for interface compatibility)
   * @returns {string} Security middleware code
   */
  private getCreateAppSecurity(_config: ProjectConfig): string {
    return `  // Security middleware
  app.use(helmet());
  app.use(cors({
    origin: config.cors.origin,
    credentials: true
  }));`;
  }

  /**
   * Get createApp logging middleware
   * @param {ProjectConfig} _config - Project configuration (unused, kept for interface compatibility)
   * @returns {string} Logging middleware code
   */
  private getCreateAppLogging(_config: ProjectConfig): string {
    return `  // Logging
  if (config.environment === 'development') {
    app.use(morgan('dev'));
  }`;
  }

  /**
   * Get createApp body parsing middleware
   * @returns {string} Body parsing middleware code
   */
  private getCreateAppBodyParsing(): string {
    return `  // Body parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));`;
  }

  /**
   * Get createApp routes setup
   * @returns {string} Routes setup code
   */
  private getCreateAppRoutes(): string {
    return `  // API routes
  app.use('/api', indexRouter);`;
  }

  /**
   * Get createApp health check endpoint
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Health check endpoint code
   */
  private getCreateAppHealthCheck(config: ProjectConfig): string {
    return `  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: '${config.name}',
      version: '1.0.0'
    });
  });`;
  }

  /**
   * Get createApp 404 handler
   * @returns {string} 404 handler code
   */
  private getCreateApp404Handler(): string {
    return `  // 404 handler
  app.use('*', (req, res) => {
    res.status(404).json({
      error: 'Route not found',
      path: req.originalUrl,
      method: req.method
    });
  });`;
  }

  /**
   * Get createApp error handler
   * @returns {string} Error handler code
   */
  private getCreateAppErrorHandler(): string {
    return `  // Error handling middleware (must be last)
  app.use(errorHandler);`;
  }

  /**
   * Get createApp return statement
   * @returns {string} Return statement
   */
  private getCreateAppReturn(): string {
    return `  return app;
}`;
  }

  /**
   * Get startServer function implementation
   * @returns {string} startServer function code
   */
  private getStartServerFunction(): string {
    return `/**
 * Start the Express server
 */
export function startServer(): void {
  const PORT = config.port || 3000;

  createApp().listen(PORT, () => {
    console.log(\`🚀 Server is running on port \${PORT}\`);
    console.log(\`📖 API documentation: http://localhost:\${PORT}/api\`);
    console.log(\`🏥 Health check: http://localhost:\${PORT}/health\`);
  });
}`;
  }

  /**
   * Get auto-start script for server
   * @returns {string} Auto-start script code
   */
  private getAutoStartScript(): string {
    return `// Auto-start server if this file is run directly
if (require.main === module) {
  startServer().catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
}`;
  }
}
