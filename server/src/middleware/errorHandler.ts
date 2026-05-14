import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../types';

/**
 * Central error handler — must be registered LAST in Express middleware chain.
 * Catches both thrown HttpErrors and unexpected runtime errors, and always
 * responds with the same ApiResponse envelope shape so clients handle one format.
 */
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof HttpError) {
    res.status(err.statusCode).json({
      data: null,
      status: err.statusCode,
      message: err.message,
      timestamp: new Date().toISOString(),
    });
    return;
  }

  // Unexpected error — log full stack in dev, hide detail in production
  console.error('[Server] Unhandled error:', err);
  const message =
    process.env.NODE_ENV === 'development' ? err.message : 'Internal server error';

  res.status(500).json({
    data: null,
    status: 500,
    message,
    timestamp: new Date().toISOString(),
  });
}
