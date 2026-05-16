import { Router, Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../db';
import { ok, created, HttpError } from '../types';

export const authRouter = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'sparklewash-dev-secret';
const JWT_EXPIRES_IN = '7d';

// ─── POST /api/auth/register ──────────────────────────────────────────────────
// Creates the first admin account. Disabled once any user exists.

authRouter.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, name } = req.body as {
      email: string;
      password: string;
      name: string;
    };

    if (!email?.trim()) throw new HttpError(400, 'email is required');
    if (!password || password.length < 8)
      throw new HttpError(400, 'password must be at least 8 characters');
    if (!name?.trim()) throw new HttpError(400, 'name is required');

    // Only allow registration if no users exist yet
    const existing = await pool.query('SELECT COUNT(*) FROM users');
    if (Number(existing.rows[0].count) > 0) {
      throw new HttpError(403, 'Registration is closed. Contact your administrator.');
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const id = `user-${uuidv4()}`;

    const result = await pool.query(
      `INSERT INTO users (id, email, password_hash, name, role)
       VALUES ($1, $2, $3, $4, 'super_admin')
       RETURNING id, email, name, role, created_at AS "createdAt"`,
      [id, email.trim().toLowerCase(), passwordHash, name.trim()]
    );

    const user = result.rows[0];
    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.status(201).json(created({ user, token }, 'Account created successfully'));
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/auth/login ─────────────────────────────────────────────────────

authRouter.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body as { email: string; password: string };

    if (!email?.trim()) throw new HttpError(400, 'email is required');
    if (!password) throw new HttpError(400, 'password is required');

    const result = await pool.query(
      `SELECT id, email, name, role, password_hash AS "passwordHash"
       FROM users WHERE email = $1`,
      [email.trim().toLowerCase()]
    );

    if (result.rowCount === 0) {
      // Same error for wrong email or wrong password — prevents user enumeration
      throw new HttpError(401, 'Invalid email or password');
    }

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.passwordHash);

    if (!valid) {
      throw new HttpError(401, 'Invalid email or password');
    }

    // Update last login timestamp
    await pool.query('UPDATE users SET last_login = NOW() WHERE id = $1', [user.id]);

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    const { passwordHash: _, ...safeUser } = user;

    res.json(ok({ user: safeUser, token }, 'Login successful'));
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────

authRouter.get('/me', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new HttpError(401, 'No token provided');
    }

    const token = authHeader.slice(7);
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string };

    const result = await pool.query(
      `SELECT id, email, name, role, created_at AS "createdAt", last_login AS "lastLogin"
       FROM users WHERE id = $1`,
      [payload.userId]
    );

    if (result.rowCount === 0) {
      throw new HttpError(401, 'User not found');
    }

    res.json(ok(result.rows[0], 'Authenticated'));
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      next(new HttpError(401, 'Invalid or expired token'));
      return;
    }
    next(err);
  }
});
