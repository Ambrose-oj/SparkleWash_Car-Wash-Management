// ─── API Response Envelope ────────────────────────────────────────────────────
// Mirrors the ApiResponse<T> type in src/services/mockApi.ts exactly,
// so the frontend can swap the backend without changing any consumers.

export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
  timestamp: string;
}

export function ok<T>(data: T, message = 'OK'): ApiResponse<T> {
  return { data, status: 200, message, timestamp: new Date().toISOString() };
}

export function created<T>(data: T, message = 'Created'): ApiResponse<T> {
  return { data, status: 201, message, timestamp: new Date().toISOString() };
}

// ─── Domain Types (kept in sync with src/types/index.ts) ─────────────────────

export type LeadStatus = 'new' | 'contacted' | 'converted';

export type BusinessType =
  | 'Car Wash'
  | 'Restaurant / Food Service'
  | 'Retail / Shop'
  | 'Logistics / Delivery'
  | 'Beauty / Salon'
  | 'Real Estate'
  | 'Other';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  businessType: BusinessType;
  status: LeadStatus;
  createdAt: string;
  notes?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  businessType: BusinessType | '';
}

export interface Service {
  id: string;
  icon: string;
  title: string;
  outcome: string;
  description: string;
  price: string;
  duration: string;
  popular?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar: string;
}

// ─── HTTP Error ───────────────────────────────────────────────────────────────

export class HttpError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string
  ) {
    super(message);
    this.name = 'HttpError';
  }
}
