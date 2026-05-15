import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Single shared pool — reused across all requests.
// pg manages idle connections automatically; max:10 is safe for dev.
export const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 6543,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
  ssl: { rejectUnauthorized: false },
});

// Crash loudly on pool errors so they aren't silently swallowed
pool.on('error', (err) => {
  console.error('[DB] Unexpected pool error:', err.message);
  process.exit(1);
});

/** Verify the DB is reachable at startup */
export async function checkConnection(): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query('SELECT 1');
    console.log('[DB] PostgreSQL connected');
  } finally {
    client.release();
  }
}
