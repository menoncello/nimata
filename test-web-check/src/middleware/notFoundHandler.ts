/**
 * 404 Not Found Middleware
 */

import { Request, Response } from 'express';

/**
 * 404 Not Found handler
 */
export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    status: 'fail',
    message: `Route ${req.originalUrl} not found`,
    availableRoutes: ['/health', '/api', '/api/hello'],
  });
}
