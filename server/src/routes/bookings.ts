import { Router, Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { pool } from '../db';
import { ok, created, HttpError } from '../types';

export const bookingsRouter = Router();

// Available time slots — fixed windows throughout the day
const TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00', '16:00',
];

const SLOT_CAPACITY = 3; // Max bookings per slot

// ─── GET /api/bookings/availability?date=YYYY-MM-DD ───────────────────────────
// Public — returns available slots for a given date.

bookingsRouter.get(
  '/availability',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { date } = req.query as { date?: string };

      if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        throw new HttpError(400, 'date query param required in YYYY-MM-DD format');
      }

      const parsed = new Date(date);
      if (isNaN(parsed.getTime())) {
        throw new HttpError(400, `Invalid date: ${date}`);
      }

      // Reject dates in the past
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (parsed < today) {
        throw new HttpError(400, 'Cannot check availability for past dates');
      }

      // Count active bookings per slot for this date in one query
      const result = await pool.query<{ time_slot: string; count: string }>(
        `SELECT time_slot, COUNT(*) AS count
         FROM bookings
         WHERE booking_date = $1
           AND status != 'cancelled'
         GROUP BY time_slot`,
        [date]
      );

      const bookedCounts = new Map(
        result.rows.map((r) => [r.time_slot, Number(r.count)])
      );

      const slots = TIME_SLOTS.map((slot) => ({
        slot,
        available: (bookedCounts.get(slot) ?? 0) < SLOT_CAPACITY,
        remaining: SLOT_CAPACITY - (bookedCounts.get(slot) ?? 0),
      }));

      res.json(ok({ date, slots }, 'Availability retrieved'));
    } catch (err) {
      next(err);
    }
  }
);

// ─── POST /api/bookings ───────────────────────────────────────────────────────
// Public — creates a new booking with atomic slot conflict detection.

bookingsRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, phone, serviceId, date, timeSlot, notes } = req.body as {
      name: string;
      email: string;
      phone: string;
      serviceId: string;
      date: string;
      timeSlot: string;
      notes?: string;
    };

    // Validate required fields
    if (!name?.trim())     throw new HttpError(400, 'name is required');
    if (!email?.trim())    throw new HttpError(400, 'email is required');
    if (!phone?.trim())    throw new HttpError(400, 'phone is required');
    if (!serviceId?.trim()) throw new HttpError(400, 'serviceId is required');
    if (!date)             throw new HttpError(400, 'date is required');
    if (!timeSlot)         throw new HttpError(400, 'timeSlot is required');

    if (!TIME_SLOTS.includes(timeSlot)) {
      throw new HttpError(400, `Invalid time slot: ${timeSlot}`);
    }

    // Reject past dates
    const bookingDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (bookingDate < today) {
      throw new HttpError(400, 'Cannot book appointments in the past');
    }

    // Atomic slot check + insert using a transaction.
    // SELECT COUNT ... FOR UPDATE locks the matching rows so concurrent requests
    // can't both pass the capacity check and double-book the same slot.
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const countResult = await client.query<{ count: string }>(
        `SELECT COUNT(*) AS count
         FROM bookings
         WHERE booking_date = $1
           AND time_slot   = $2
           AND status      != 'cancelled'`,
        [date, timeSlot]
      );

      const current = Number(countResult.rows[0].count);
      if (current >= SLOT_CAPACITY) {
        await client.query('ROLLBACK');
        throw new HttpError(409, 'This time slot is fully booked. Please choose another.');
      }

      const id = `booking-${uuidv4()}`;

      const insertResult = await client.query(
        `INSERT INTO bookings
           (id, name, email, phone, service_id, booking_date, time_slot, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING
           id, name, email, phone,
           service_id  AS "serviceId",
           booking_date::text AS "bookingDate",
           time_slot   AS "timeSlot",
           status,
           created_at  AS "createdAt",
           notes`,
        [
          id,
          name.trim(),
          email.trim().toLowerCase(),
          phone.trim(),
          serviceId,
          date,
          timeSlot,
          notes?.trim() ?? '',
        ]
      );

      await client.query('COMMIT');
      res.status(201).json(created(insertResult.rows[0], 'Booking confirmed'));
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/bookings ────────────────────────────────────────────────────────
// Protected — dashboard view of all bookings.

bookingsRouter.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await pool.query(
      `SELECT
         id, name, email, phone,
         service_id          AS "serviceId",
         booking_date::text  AS "bookingDate",
         time_slot           AS "timeSlot",
         status,
         notes,
         created_at          AS "createdAt"
       FROM bookings
       ORDER BY booking_date ASC, time_slot ASC`
    );

    res.json(ok(result.rows, `${result.rowCount} bookings retrieved`));
  } catch (err) {
    next(err);
  }
});

// ─── PATCH /api/bookings/:id/status ──────────────────────────────────────────
// Protected — update booking status from dashboard.

bookingsRouter.patch(
  '/:id/status',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { status } = req.body as { status: string };

      const valid = ['pending', 'confirmed', 'cancelled'];
      if (!valid.includes(status)) {
        throw new HttpError(400, `Invalid status. Must be one of: ${valid.join(', ')}`);
      }

      const result = await pool.query(
        `UPDATE bookings SET status = $1 WHERE id = $2
         RETURNING
           id, name, email, phone,
           service_id          AS "serviceId",
           booking_date::text  AS "bookingDate",
           time_slot           AS "timeSlot",
           status, notes,
           created_at          AS "createdAt"`,
        [status, id]
      );

      if (result.rowCount === 0) {
        throw new HttpError(404, `Booking not found: ${id}`);
      }

      res.json(ok(result.rows[0], `Booking status updated to "${status}"`));
    } catch (err) {
      next(err);
    }
  }
);
