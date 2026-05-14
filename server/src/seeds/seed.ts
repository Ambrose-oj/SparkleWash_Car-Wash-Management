/**
 * Seed script — populates the database from src/data/db.json.
 * Safe to run multiple times (uses INSERT ... ON CONFLICT DO NOTHING).
 *
 * Usage:  npm run seed
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { pool, checkConnection } from '../db';
import type { Lead, Service, Testimonial } from '../types';

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));

// Path relative to this file — adjust if your db.json lives elsewhere
const DB_JSON_PATH = join(__dirname, '..', '..', '..', 'src', 'data', 'db.json');

interface DbJson {
  leads: Lead[];
  services: (Service & { sort_order?: number })[];
  testimonials: (Testimonial & { sort_order?: number })[];
}

async function seed(): Promise<void> {
  await checkConnection();

  const raw = readFileSync(DB_JSON_PATH, 'utf8');
  const db: DbJson = JSON.parse(raw);

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // ── Leads ──────────────────────────────────────────────────────────────
    for (const lead of db.leads) {
      await client.query(
        `INSERT INTO leads (id, name, email, phone, business_type, status, created_at, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (id) DO NOTHING`,
        [
          lead.id,
          lead.name,
          lead.email,
          lead.phone,
          lead.businessType,
          lead.status,
          lead.createdAt,
          lead.notes ?? '',
        ]
      );
    }
    console.log(`[Seed] ✓ ${db.leads.length} leads`);

    // ── Services ───────────────────────────────────────────────────────────
    for (let i = 0; i < db.services.length; i++) {
      const s = db.services[i];
      await client.query(
        `INSERT INTO services (id, icon, title, outcome, description, price, duration, popular, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (id) DO NOTHING`,
        [s.id, s.icon, s.title, s.outcome, s.description, s.price, s.duration, s.popular ?? false, i]
      );
    }
    console.log(`[Seed] ✓ ${db.services.length} services`);

    // ── Testimonials ───────────────────────────────────────────────────────
    for (let i = 0; i < db.testimonials.length; i++) {
      const t = db.testimonials[i];
      await client.query(
        `INSERT INTO testimonials (id, name, role, content, rating, avatar, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (id) DO NOTHING`,
        [t.id, t.name, t.role, t.content, t.rating, t.avatar, i]
      );
    }
    console.log(`[Seed] ✓ ${db.testimonials.length} testimonials`);

    await client.query('COMMIT');
    console.log('[Seed] Database seeded successfully.');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch((err) => {
  console.error('[Seed] Failed:', err.message);
  process.exit(1);
});
