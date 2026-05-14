import { Router, Request, Response, NextFunction } from 'express';
import { pool } from '../db';
import { ok, Service } from '../types';

export const servicesRouter = Router();

// ─── GET /api/services ────────────────────────────────────────────────────────

servicesRouter.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await pool.query<Service>(`
      SELECT
        id,
        icon,
        title,
        outcome,
        description,
        price,
        duration,
        popular
      FROM services
      ORDER BY sort_order ASC
    `);

    res.json(ok(result.rows, `${result.rowCount} services retrieved`));
  } catch (err) {
    next(err);
  }
});
