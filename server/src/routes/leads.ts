import { Router, Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { pool } from '../db';
import { ok, created, HttpError, Lead, LeadStatus, ContactFormData } from '../types';
import { scoreLead } from '../utils/leadScoring';

export const leadsRouter = Router();

const VALID_STATUSES: LeadStatus[] = ['new', 'contacted', 'converted'];

// ─── GET /api/leads ───────────────────────────────────────────────────────────

leadsRouter.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await pool.query<Lead & {
      businessType: string;
      createdAt: string;
    }>(`
      SELECT
        id,
        name,
        email,
        phone,
        business_type  AS "businessType",
        status,
        created_at     AS "createdAt",
        notes
      FROM leads
      ORDER BY created_at DESC
    `);

    // Attach score to each lead — computed fresh on every fetch
    const scored = result.rows.map((lead) => {
      const { score, scoreBreakdown } = scoreLead(
        lead.businessType,
        lead.status as LeadStatus,
        lead.createdAt
      );
      return { ...lead, score, scoreBreakdown };
    });

    res.json(ok(scored, `${result.rowCount} leads retrieved`));
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/leads ──────────────────────────────────────────────────────────

leadsRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = req.body as ContactFormData;

    if (!body.name?.trim())         throw new HttpError(400, 'name is required');
    if (!body.email?.trim())        throw new HttpError(400, 'email is required');
    if (!body.phone?.trim())        throw new HttpError(400, 'phone is required');
    if (!body.businessType)         throw new HttpError(400, 'businessType is required');

    const id = `lead-${uuidv4()}`;
    const now = new Date();

    const result = await pool.query<Lead>(
      `INSERT INTO leads (id, name, email, phone, business_type, status, created_at, notes)
       VALUES ($1, $2, $3, $4, $5, 'new', $6, $7)
       RETURNING
         id, name, email, phone,
         business_type AS "businessType",
         status,
         created_at    AS "createdAt",
         notes`,
      [
        id,
        body.name.trim(),
        body.email.trim().toLowerCase(),
        body.phone.trim(),
        body.businessType,
        now,
        '',
      ]
    );

    const lead = result.rows[0];
    const { score, scoreBreakdown } = scoreLead(
      lead.businessType,
      lead.status as LeadStatus,
      lead.createdAt
    );

    res.status(201).json(created({ ...lead, score, scoreBreakdown }, 'Lead created'));
  } catch (err) {
    next(err);
  }
});

// ─── PATCH /api/leads/:id/status ──────────────────────────────────────────────

leadsRouter.patch(
  '/:id/status',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { status } = req.body as { status: LeadStatus };

      if (!VALID_STATUSES.includes(status)) {
        throw new HttpError(
          400,
          `Invalid status "${status}". Must be one of: ${VALID_STATUSES.join(', ')}`
        );
      }

      const result = await pool.query<Lead>(
        `UPDATE leads SET status = $1 WHERE id = $2
         RETURNING
           id, name, email, phone,
           business_type AS "businessType",
           status,
           created_at    AS "createdAt",
           notes`,
        [status, id]
      );

      if (result.rowCount === 0) {
        throw new HttpError(404, `Lead not found: ${id}`);
      }

      const lead = result.rows[0];
      const { score, scoreBreakdown } = scoreLead(
        lead.businessType,
        lead.status as LeadStatus,
        lead.createdAt
      );

      res.json(ok({ ...lead, score, scoreBreakdown }, `Status updated to "${status}"`));
    } catch (err) {
      next(err);
    }
  }
);

// ─── DELETE /api/leads/:id ────────────────────────────────────────────────────

leadsRouter.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM leads WHERE id = $1 RETURNING id`,
      [id]
    );

    if (result.rowCount === 0) {
      throw new HttpError(404, `Lead not found: ${id}`);
    }

    res.json(ok({ id }, 'Lead deleted'));
  } catch (err) {
    next(err);
  }
});
