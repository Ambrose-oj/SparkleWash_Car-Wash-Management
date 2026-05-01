/**
 * mockData.ts
 *
 * Static content only — services and testimonials.
 * These are fetched via mockApi.getServices() / mockApi.getTestimonials()
 * which read from db.json, keeping all data in one source of truth.
 *
 * Lead data lives in db.json and is accessed exclusively through
 * src/services/mockApi.ts — never imported directly.
 */

// Re-export types for convenience — no raw data here
export type { Service, Testimonial } from '../types';