import { Router, Request, Response, NextFunction } from 'express';
import { pool } from '../db';
import { ok, Testimonial } from '../types';

export const testimonialsRouter = Router();

// ─── GET /api/testimonials ────────────────────────────────────────────────────

testimonialsRouter.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await pool.query<Testimonial>(`
      SELECT
        id,
        name,
        role,
        content,
        rating,
        avatar
      FROM testimonials
      ORDER BY sort_order ASC
    `);

    res.json(ok(result.rows, `${result.rowCount} testimonials retrieved`));
  } catch (err) {
    next(err);
  }
});
