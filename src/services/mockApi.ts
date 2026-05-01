/**
 * mockApi.ts
 *
 * Simulates a RESTful API with true persistence via localStorage.
 *
 * Strategy:
 *   1. On first ever load  → fetch /db.json, seed localStorage
 *   2. On subsequent loads → read from localStorage (mutations survive refresh)
 *   3. After every write   → flush updated store back to localStorage
 *
 * This means: added leads, status changes, and deletes all persist across
 * page refreshes — exactly like a real API backed by a database.
 *
 * To swap for a real backend: replace each function body with a fetch() call.
 * The signatures, return types, and consumer code stay identical.
 *
 * Endpoints simulated:
 *   GET    /leads            → getLeads()
 *   POST   /leads            → createLead(data)
 *   PATCH  /leads/:id/status → updateLeadStatus(id, status)
 *   DELETE /leads/:id        → deleteLead(id)
 *   GET    /services         → getServices()
 *   GET    /testimonials     → getTestimonials()
 */

import type { Lead, Service, Testimonial, ContactFormData, LeadStatus } from '../types';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
  timestamp: string;
}

interface Db {
  leads: Lead[];
  services: Service[];
  testimonials: Testimonial[];
}

// ─── Storage key ──────────────────────────────────────────────────────────────

const STORAGE_KEY = 'sparklewash_db';

// ─── Persistence helpers ──────────────────────────────────────────────────────

/** Read from localStorage, or null if not yet seeded */
function readStore(): Db | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Db) : null;
  } catch {
    return null;
  }
}

/** Write the entire store back to localStorage */
function writeStore(db: Db): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch (e) {
    console.warn('[MockAPI] localStorage write failed:', e);
  }
}

// ─── In-memory cache (avoids re-parsing localStorage on every call) ───────────

let _db: Db | null = null;

/**
 * getDb() — initialise the store on first call:
 *   - If localStorage has data → use it (mutations from previous sessions survive)
 *   - If not → fetch db.json, seed localStorage, return fresh data
 */
async function getDb(): Promise<Db> {
  if (_db) return _db;

  const persisted = readStore();
  if (persisted) {
    _db = persisted;
    return _db;
  }

  // First ever load: seed from the static JSON file
  const res = await fetch('/db.json');
  if (!res.ok) throw new Error(`[MockAPI] Failed to load db.json: ${res.status}`);
  const fresh = (await res.json()) as Db;

  _db = fresh;
  writeStore(_db); // Persist immediately so next refresh uses localStorage
  return _db;
}

/** Call after every mutation to flush changes to localStorage */
function persist(): void {
  if (_db) writeStore(_db);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function delay(ms = 400): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function ok<T>(data: T, message = 'OK'): ApiResponse<T> {
  return { data, status: 200, message, timestamp: new Date().toISOString() };
}

function created<T>(data: T, message = 'Created'): ApiResponse<T> {
  return { data, status: 201, message, timestamp: new Date().toISOString() };
}

// ─── Leads ────────────────────────────────────────────────────────────────────

/** GET /leads */
export async function getLeads(): Promise<ApiResponse<Lead[]>> {
  const db = await getDb();
  await delay(350);
  const sorted = [...db.leads].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  return ok(sorted, `${sorted.length} leads retrieved`);
}

/** POST /leads */
export async function createLead(data: ContactFormData): Promise<ApiResponse<Lead>> {
  const db = await getDb();
  await delay(900);

  const newLead: Lead = {
    id: `lead-${Date.now()}`,
    name: data.name.trim(),
    email: data.email.trim().toLowerCase(),
    phone: data.phone.trim(),
    businessType: data.businessType as Lead['businessType'],
    status: 'new',
    createdAt: new Date().toISOString(),
  };

  db.leads = [newLead, ...db.leads];
  persist(); // ← write to localStorage
  return created(newLead, 'Lead created successfully');
}

/** PATCH /leads/:id/status */
export async function updateLeadStatus(
  id: string,
  status: LeadStatus
): Promise<ApiResponse<Lead>> {
  const db = await getDb();
  await delay(300);

  const index = db.leads.findIndex((l) => l.id === id);
  if (index === -1) throw new Error(`[MockAPI] Lead not found: ${id}`);

  db.leads[index] = { ...db.leads[index], status };
  persist(); // ← write to localStorage
  return ok(db.leads[index], `Lead status updated to "${status}"`);
}

/** DELETE /leads/:id */
export async function deleteLead(id: string): Promise<ApiResponse<{ id: string }>> {
  const db = await getDb();
  await delay(300);

  if (!db.leads.some((l) => l.id === id)) throw new Error(`[MockAPI] Lead not found: ${id}`);

  db.leads = db.leads.filter((l) => l.id !== id);
  persist(); // ← write to localStorage
  return ok({ id }, 'Lead deleted');
}

// ─── Services ─────────────────────────────────────────────────────────────────

/** GET /services */
export async function getServices(): Promise<ApiResponse<Service[]>> {
  const db = await getDb();
  await delay(200);
  return ok(db.services, `${db.services.length} services retrieved`);
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

/** GET /testimonials */
export async function getTestimonials(): Promise<ApiResponse<Testimonial[]>> {
  const db = await getDb();
  await delay(200);
  return ok(db.testimonials, `${db.testimonials.length} testimonials retrieved`);
}

// ─── Dev utility ─────────────────────────────────────────────────────────────

/**
 * resetDb() — wipes localStorage and reseeds from db.json.
 * Call from the browser console: import('/src/services/mockApi.ts').then(m => m.resetDb())
 */
export async function resetDb(): Promise<void> {
  localStorage.removeItem(STORAGE_KEY);
  _db = null;
  await getDb();
  console.info('[MockAPI] Database reset to db.json defaults');
}