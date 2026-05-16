/**
 * api.ts
 *
 * Data access layer for SparkleWash.
 *
 * Architecture:
 *   - Services & Testimonials → loaded from src/data/db.json (static catalog)
 *   - Leads                  → Express + PostgreSQL backend (JWT protected)
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
  options: RequestInit = {},
  token?: string
): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE}${path}`, { ...options, headers });
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

// ─── Leads — JWT protected backend ───────────────────────────────────────────

export async function getLeads(token: string): Promise<ApiResponse<Lead[]>> {
  return request<Lead[]>('/leads', {}, token);
}

export async function createLead(data: ContactFormData): Promise<ApiResponse<Lead>> {
  return request<Lead>('/leads', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateLeadStatus(
  id: string,
  status: LeadStatus,
  token: string
): Promise<ApiResponse<Lead>> {
  return request<Lead>(
    `/leads/${id}/status`,
    { method: 'PATCH', body: JSON.stringify({ status }) },
    token
  );
}

export async function deleteLead(
  id: string,
  token: string
): Promise<ApiResponse<{ id: string }>> {
  return request<{ id: string }>(`/leads/${id}`, { method: 'DELETE' }, token);
}
