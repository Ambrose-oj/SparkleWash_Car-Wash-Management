import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { checkConnection } from './db';
import { authRouter } from './routes/auth';
import { leadsRouter } from './routes/leads';
import { servicesRouter } from './routes/services';
import { testimonialsRouter } from './routes/testimonials';
import { bookingsRouter } from './routes/bookings';
import { requireAuth } from './middleware/requireAuth';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3001;

// ─── Middleware ───────────────────────────────────────────────────────────────

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// ─── Public routes ────────────────────────────────────────────────────────────

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRouter);
app.use('/api/services', servicesRouter);
app.use('/api/testimonials', testimonialsRouter);

// ─── Bookings — availability + create are public, rest require auth ───────────
// A single mount point with a conditional auth middleware.
// GET /availability and POST / are public (landing page booking form).
// Everything else (GET all, PATCH status) requires a valid JWT.

app.use('/api/bookings', (req, res, next) => {
  const isPublic =
    (req.method === 'GET' && req.path === '/availability') ||
    (req.method === 'POST' && req.path === '/');

  if (isPublic) {
    return bookingsRouter(req, res, next);
  }

  requireAuth(req, res, () => bookingsRouter(req, res, next));
});

// ─── Protected routes (JWT required) ─────────────────────────────────────────

app.use('/api/leads', requireAuth, leadsRouter);

// ─── 404 catch-all ────────────────────────────────────────────────────────────

app.use((_req, res) => {
  res.status(404).json({
    data: null,
    status: 404,
    message: 'Route not found',
    timestamp: new Date().toISOString(),
  });
});

// ─── Error handler (must be last) ────────────────────────────────────────────

app.use(errorHandler);

// ─── Keep-alive ping (prevents Render free tier from sleeping) ────────────────
if (process.env.NODE_ENV === 'production' && process.env.RENDER_EXTERNAL_URL) {
  setInterval(async () => {
    try {
      await fetch(`${process.env.RENDER_EXTERNAL_URL}/api/health`);
      console.log('[Keep-alive] Pinged health endpoint');
    } catch (err) {
      console.error('[Keep-alive] Ping failed:', err);
    }
  }, 10 * 60 * 1000); // every 10 minutes
}

// ─── Boot ─────────────────────────────────────────────────────────────────────

async function start(): Promise<void> {
  await checkConnection();
  app.listen(PORT, () => {
    console.log(`[Server] SparkleWash API running on http://localhost:${PORT}`);
    console.log(`[Server] Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

start().catch((err) => {
  console.error('[Server] Failed to start:', err.message);
  process.exit(1);
});