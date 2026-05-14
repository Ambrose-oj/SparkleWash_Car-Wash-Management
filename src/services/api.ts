/**
 * api.ts
 *
 * Data access layer for SparkleWash.
 *
 * Architecture:
 *   - Services & Testimonials → loaded from src/data/db.json (static catalog data)
 *   - Leads                  → fetched from Express + PostgreSQL backend
 *
 * This split is intentional: catalog data never changes at runtime, so it
 * lives in db.json (also used by the backend seed script to populate the DB).
 * Lead data is transactional and must persist — it always goes through the API.
 *
 * The Vite dev proxy rewrites /api/* → http://localhost:3001/api/*
 * In production, set VITE_API_BASE to your deployed backend URL.
 */

import type { Lead, Service, Testimonial, ContactFormData, LeadStatus } from '../types';
import db from '../data/db.json';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
  timestamp: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const BASE = import.meta.env.VITE_API_BASE ?? '/api';

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  const body: ApiResponse<T> = await res.json();

  if (!res.ok) {
    throw new Error(body.message || `Request failed with status ${res.status}`);
  }

  return body;
}

function localResponse<T>(data: T, message = 'OK'): ApiResponse<T> {
  return { data, status: 200, message, timestamp: new Date().toISOString() };
}

// ─── Services — served from db.json ──────────────────────────────────────────

/**
 * Returns the service catalog from db.json.
 * Wrapped in a Promise<ApiResponse<T>> so callers don't need to change
 * when this later switches to a backend call.
 */
export async function getServices(): Promise<ApiResponse<Service[]>> {
  return localResponse(db.services as Service[], `${db.services.length} services`);
}

// ─── Testimonials — served from db.json ──────────────────────────────────────

export async function getTestimonials(): Promise<ApiResponse<Testimonial[]>> {
  return localResponse(
    db.testimonials as Testimonial[],
    `${db.testimonials.length} testimonials`
  );
}

// ─── Leads — always hit the real backend ─────────────────────────────────────

/** GET /api/leads */
export async function getLeads(): Promise<ApiResponse<Lead[]>> {
  return request<Lead[]>('/leads');
}

/** POST /api/leads */
export async function createLead(data: ContactFormData): Promise<ApiResponse<Lead>> {
  return request<Lead>('/leads', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/** PATCH /api/leads/:id/status */
export async function updateLeadStatus(
  id: string,
  status: LeadStatus
): Promise<ApiResponse<Lead>> {
  return request<Lead>(`/leads/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

/** DELETE /api/leads/:id */
export async function deleteLead(id: string): Promise<ApiResponse<{ id: string }>> {
  return request<{ id: string }>(`/leads/${id}`, { method: 'DELETE' });
}
