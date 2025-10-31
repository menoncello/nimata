/**
 * Express Controller Code Generator
 *
 * Generates Express controller implementation code
 */
import type { ProjectConfig } from '../../../types/project-config.js';

/**
 * Generator for Express controller code components
 */
export class ExpressControllerCodeGenerator {
  /**
   * Generate Express app controller
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} App controller TypeScript code
   */
  generateAppController(config: ProjectConfig): string {
    return [
      this.getControllerImports(),
      this.getControllerInterface(),
      this.getControllerClass(config),
      this.getControllerExport(),
    ].join('\n\n');
  }

  /**
   * Get controller import statements
   * @returns {string} Import statements
   */
  private getControllerImports(): string {
    return `import { Request, Response, NextFunction } from 'express';`;
  }

  /**
   * Get controller interface definition
   * @returns {string} Controller interface
   */
  private getControllerInterface(): string {
    return `/**
 * Interface for application controller responses
 */
export interface ApiResponse {
  success: boolean;
  message: string;
  data?: unknown;
  error?: string;
  timestamp: string;
}`;
  }

  /**
   * Get controller class implementation
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Controller class code
   */
  private getControllerClass(config: ProjectConfig): string {
    return [
      this.getControllerClassHeader(),
      this.getControllerConstructor(config),
      this.getGetAppInfoMethod(),
      this.getHealthCheckMethod(),
      this.getTestEndpointMethod(),
      this.getControllerClassFooter(),
    ].join('\n');
  }

  /**
   * Get controller class header
   * @returns {string} Controller class header
   */
  private getControllerClassHeader(): string {
    return `/**
 * Main Application Controller
 * Handles basic application endpoints
 */
export class AppController {
  private readonly serviceName: string;`;
  }

  /**
   * Get controller constructor
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Controller constructor
   */
  private getControllerConstructor(config: ProjectConfig): string {
    return `  constructor() {
    this.serviceName = '${config.name}';
  }`;
  }

  /**
   * Get getAppInfo method
   * @returns {string} getAppInfo method
   */
  private getGetAppInfoMethod(): string {
    return `  /**
   * Get application information
   * @param {string} req - Express request object
   * @param {string} res - Express response object
   * @param {string} next - Express next function
   */
  public getAppInfo(req: Request, res: Response, next: NextFunction): void {
    try {
      const response: ApiResponse = {
        success: true,
        message: 'Application information retrieved successfully',
        data: {
          name: this.serviceName,
          version: '1.0.0',
          environment: process.env.NODE_ENV || 'development',
          uptime: process.uptime(),
          memory: process.memoryUsage(),
          timestamp: new Date().toISOString()
        },
        timestamp: new Date().toISOString()
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }`;
  }

  /**
   * Get healthCheck method
   * @returns {string} healthCheck method
   */
  private getHealthCheckMethod(): string {
    return `  /**
   * Health check endpoint
   * @param {string} req - Express request object
   * @param {string} res - Express response object
   * @param {string} next - Express next function
   */
  public healthCheck(req: Request, res: Response, next: NextFunction): void {
    try {
      const response: ApiResponse = {
        success: true,
        message: 'Service is healthy',
        data: {
          status: 'healthy',
          service: this.serviceName,
          timestamp: new Date().toISOString()
        },
        timestamp: new Date().toISOString()
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }`;
  }

  /**
   * Get testEndpoint method
   * @returns {string} testEndpoint method
   */
  private getTestEndpointMethod(): string {
    return `  /**
   * Test endpoint for development
   * @param {string} req - Express request object
   * @param {string} res - Express response object
   * @param {string} next - Express next function
   */
  public testEndpoint(req: Request, res: Response, next: NextFunction): void {
    try {
      const response: ApiResponse = {
        success: true,
        message: 'Test endpoint working',
        data: {
          query: req.query,
          params: req.params,
          headers: req.headers,
          timestamp: new Date().toISOString()
        },
        timestamp: new Date().toISOString()
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }`;
  }

  /**
   * Get controller class footer
   * @returns {string} Controller class footer
   */
  private getControllerClassFooter(): string {
    return `}`;
  }

  /**
   * Get controller export statement
   * @returns {string} Export statement
   */
  private getControllerExport(): string {
    return `// Export singleton instance
export const appController = new AppController();`;
  }
}
