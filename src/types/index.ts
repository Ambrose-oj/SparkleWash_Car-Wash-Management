// ─── Lead Types ───────────────────────────────────────────────────────────────

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
  createdAt: string; // ISO date string
  notes?: string;
}

// ─── Form Types ───────────────────────────────────────────────────────────────

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  businessType: BusinessType | '';
}

export interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  businessType?: string;
}

// ─── Service Types ────────────────────────────────────────────────────────────

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

// ─── Testimonial Types ────────────────────────────────────────────────────────

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar: string;
}

// ─── Dashboard Filter Types ───────────────────────────────────────────────────

export interface LeadFilters {
  search: string;
  status: LeadStatus | 'all';
  businessType: BusinessType | 'all';
}

export type SortField = 'name' | 'createdAt' | 'status' | 'businessType';
export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}
