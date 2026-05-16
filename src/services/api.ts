/**
 * api.ts — SparkleWash data access layer
 *
 * Services & Testimonials → db.json (static)
 * Leads                   → Express + PostgreSQL (JWT protected)
 * Bookings                → Express + PostgreSQL (availability public, management protected)
 */

import type { Lead, Service, Testimonial, ContactFormData, LeadStatus } from '../types';
import db from '../data/db.json';

export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
  timestamp: string;
}

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface Slot {
  slot: string;
  available: boolean;
  remaining: number;
}

export interface AvailabilityResponse {
  date: string;
  slots: Slot[];
}

export interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  serviceId: string;
  bookingDate: string;
  timeSlot: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  notes: string;
  createdAt: string;
}

export interface CreateBookingData {
  name: string;
  email: string;
  phone: string;
  serviceId: string;
  date: string;
  timeSlot: string;
  notes?: string;
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
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  const body: ApiResponse<T> = await res.json();

  if (!res.ok) throw new Error(body.message || `Request failed: ${res.status}`);
  return body;
}

function localResponse<T>(data: T, message = 'OK'): ApiResponse<T> {
  return { data, status: 200, message, timestamp: new Date().toISOString() };
}

// ─── Services ─────────────────────────────────────────────────────────────────

export async function getServices(): Promise<ApiResponse<Service[]>> {
  return localResponse(db.services as Service[], `${db.services.length} services`);
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

export async function getTestimonials(): Promise<ApiResponse<Testimonial[]>> {
  return localResponse(db.testimonials as Testimonial[], `${db.testimonials.length} testimonials`);
}

// ─── Leads (protected) ────────────────────────────────────────────────────────

export async function getLeads(token: string): Promise<ApiResponse<Lead[]>> {
  return request<Lead[]>('/leads', {}, token);
}

export async function createLead(data: ContactFormData): Promise<ApiResponse<Lead>> {
  return request<Lead>('/leads', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateLeadStatus(
  id: string, status: LeadStatus, token: string
): Promise<ApiResponse<Lead>> {
  return request<Lead>(`/leads/${id}/status`, {
    method: 'PATCH', body: JSON.stringify({ status }),
  }, token);
}

export async function deleteLead(
  id: string, token: string
): Promise<ApiResponse<{ id: string }>> {
  return request<{ id: string }>(`/leads/${id}`, { method: 'DELETE' }, token);
}

// ─── Bookings (public for create/availability, protected for management) ───────

export async function getAvailability(
  date: string
): Promise<ApiResponse<AvailabilityResponse>> {
  return request<AvailabilityResponse>(`/bookings/availability?date=${date}`);
}

export async function createBooking(
  data: CreateBookingData
): Promise<ApiResponse<Booking>> {
  return request<Booking>('/bookings', { method: 'POST', body: JSON.stringify(data) });
}

export async function getBookings(token: string): Promise<ApiResponse<Booking[]>> {
  return request<Booking[]>('/bookings', {}, token);
}

export async function updateBookingStatus(
  id: string, status: string, token: string
): Promise<ApiResponse<Booking>> {
  return request<Booking>(`/bookings/${id}/status`, {
    method: 'PATCH', body: JSON.stringify({ status }),
  }, token);
}
