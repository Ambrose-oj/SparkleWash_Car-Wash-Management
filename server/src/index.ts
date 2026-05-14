import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { checkConnection } from './db';
import { leadsRouter } from './routes/leads';
import { servicesRouter } from './routes/services';
import { testimonialsRouter } from './routes/testimonials';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3001;

// ─── Middleware ───────────────────────────────────────────────────────────────

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type'],
}));

app.use(express.json());

// ─── Routes ───────────────────────────────────────────────────────────────────

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/leads', leadsRouter);
app.use('/api/services', servicesRouter);
app.use('/api/testimonials', testimonialsRouter);

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
