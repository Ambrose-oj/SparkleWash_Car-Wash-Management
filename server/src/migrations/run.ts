/**
 * Migration runner — reads and executes all *.sql files in this directory
 * in filename order. Safe to run multiple times (all statements use IF NOT EXISTS).
 *
 * Usage:  npm run migrate
 */

import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { pool, checkConnection } from '../db';

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));

async function runMigrations(): Promise<void> {
  await checkConnection();

  const files = readdirSync(__dirname)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  for (const file of files) {
    const sql = readFileSync(join(__dirname, file), 'utf8');
    console.log(`[Migrate] Running ${file}...`);
    await pool.query(sql);
    console.log(`[Migrate] ✓ ${file}`);
  }

  console.log('[Migrate] All migrations complete.');
  await pool.end();
}

runMigrations().catch((err) => {
  console.error('[Migrate] Failed:', err.message);
  process.exit(1);
});
