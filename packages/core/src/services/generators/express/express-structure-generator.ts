/**
 * Express Structure Generator
 *
 * Generates Express-specific project structure and files
 */
import type { ProjectConfig } from '../../../types/project-config.js';
import { ExpressConfigCodeGenerator } from './express-config-generator.js';
import { ExpressControllerCodeGenerator } from './express-controller-generator.js';
import { ExpressMiddlewareCodeGenerator } from './express-middleware-generator.js';
import { ExpressServerCodeGenerator } from './express-server-generator.js';

export interface DirectoryItem {
  path: string;
  type: 'directory' | 'file';
  content?: string;
}

/**
 * Generator for Express project structures
 */
export class ExpressStructureGenerator {
  private readonly serverGenerator: ExpressServerCodeGenerator;
  private readonly controllerGenerator: ExpressControllerCodeGenerator;
  private readonly middlewareGenerator: ExpressMiddlewareCodeGenerator;
  private readonly configGenerator: ExpressConfigCodeGenerator;

  /**
   * Initialize the Express structure generator
   */
  constructor() {
    this.serverGenerator = new ExpressServerCodeGenerator();
    this.controllerGenerator = new ExpressControllerCodeGenerator();
    this.middlewareGenerator = new ExpressMiddlewareCodeGenerator();
    this.configGenerator = new ExpressConfigCodeGenerator();
  }

  /**
   * Generate Express project structure
   * @param config - Project configuration
   * @returns Express-specific directory structure
   */
  generate(config: ProjectConfig): DirectoryItem[] {
    const directories = this.getExpressDirectories();
    const files = this.getExpressFiles(config);

    return [...directories, ...files];
  }

  /**
   * Get Express-specific directory structure
   * @returns Array of directory items
   */
  private getExpressDirectories(): DirectoryItem[] {
    return [
      { path: 'src/routes', type: 'directory' },
      { path: 'src/middleware', type: 'directory' },
      { path: 'src/controllers', type: 'directory' },
      { path: 'src/services', type: 'directory' },
      { path: 'src/utils', type: 'directory' },
      { path: 'src/config', type: 'directory' },
    ];
  }

  /**
   * Get Express-specific files
   * @param config - Project configuration
   * @returns Array of file items
   */
  private getExpressFiles(config: ProjectConfig): DirectoryItem[] {
    return [
      {
        path: 'src/server.ts',
        type: 'file',
        content: this.serverGenerator.generateExpressServer(config),
      },
      {
        path: 'src/routes/index.ts',
        type: 'file',
        content: this.generateMainRoute(config),
      },
      {
        path: 'src/controllers/app.controller.ts',
        type: 'file',
        content: this.controllerGenerator.generateAppController(config),
      },
      {
        path: 'src/middleware/error-handler.ts',
        type: 'file',
        content: this.middlewareGenerator.generateErrorMiddleware(config),
      },
      {
        path: 'src/config/environment.ts',
        type: 'file',
        content: this.configGenerator.generateEnvironmentConfig(config),
      },
    ];
  }

  /**
   * Generate main Express route
   * @param _config - Project configuration
   * @returns Main route TypeScript code
   */
  private generateMainRoute(_config: ProjectConfig): string {
    return `import { Router } from 'express';
import { appController } from '../controllers/app.controller.js';

const router = Router();

/**
 * @route GET /api
 * @desc Get basic API information
 * @access Public
 */
router.get('/', appController.getAppInfo.bind(appController));

/**
 * @route GET /api/health
 * @desc Health check endpoint
 * @access Public
 */
router.get('/health', appController.healthCheck.bind(appController));

/**
 * @route GET /api/test
 * @desc Test endpoint for development
 * @access Public
 */
router.get('/test', appController.testEndpoint.bind(appController));

export { router as indexRouter };`;
  }
}
