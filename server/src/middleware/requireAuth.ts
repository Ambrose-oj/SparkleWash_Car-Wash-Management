import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { HttpError } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'sparklewash-dev-secret';

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
}

/**
 * requireAuth middleware
 * Verifies the Bearer token in the Authorization header.
 * Attaches userId and userRole to the request for downstream handlers.
 */
export function requireAuth(
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    next(new HttpError(401, 'Authentication required'));
    return;
  }

  const token = authHeader.slice(7);

  try {
    const payload = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      role: string;
    };
    req.userId = payload.userId;
    req.userRole = payload.role;
    next();
  } catch {
    next(new HttpError(401, 'Invalid or expired token'));
  }
}
