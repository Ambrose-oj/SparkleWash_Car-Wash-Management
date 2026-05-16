/**
 * leadScoring.ts
 *
 * Computes a 0–100 priority score for each lead based on three signals:
 *
 *   Business type  (0–30)  — higher for fleet/corporate clients
 *   Lead status    (0–40)  — higher for leads closer to conversion
 *   Recency        (0–30)  — higher for recently submitted leads
 *
 * Scores are computed at query time and attached to lead objects before
 * being returned by GET /api/leads. They are never stored in the database
 * so they stay fresh automatically as leads age.
 */

type LeadStatus = 'new' | 'contacted' | 'converted';

// ─── Business type weights ────────────────────────────────────────────────────
// Fleet-oriented businesses score highest — they represent multi-vehicle
// corporate accounts. Competitors (Car Wash) score lowest.

const BUSINESS_TYPE_SCORE: Record<string, number> = {
  'Logistics / Delivery':       30,
  'Real Estate':                26,
  'Restaurant / Food Service':  22,
  'Retail / Shop':              18,
  'Beauty / Salon':             15,
  'Other':                      12,
  'Car Wash':                    8,
};

// ─── Status weights ───────────────────────────────────────────────────────────
// Converted leads score highest — they're proven revenue.
// New leads score low but high recency can compensate.

const STATUS_SCORE: Record<LeadStatus, number> = {
  converted:  40,
  contacted:  24,
  new:        10,
};

// ─── Recency weights ──────────────────────────────────────────────────────────
// Fresh leads need to be actioned quickly — reward recency.

function recencyScore(createdAt: string): number {
  const ageMs = Date.now() - new Date(createdAt).getTime();
  const ageDays = ageMs / (1000 * 60 * 60 * 24);

  if (ageDays <= 1)  return 30;
  if (ageDays <= 3)  return 26;
  if (ageDays <= 7)  return 20;
  if (ageDays <= 14) return 14;
  if (ageDays <= 30) return 8;
  return 4;
}

// ─── Main export ──────────────────────────────────────────────────────────────

export interface ScoredLead {
  score: number;
  scoreBreakdown: {
    businessType: number;
    status: number;
    recency: number;
  };
}

export function scoreLead(
  businessType: string,
  status: LeadStatus,
  createdAt: string
): ScoredLead {
  const businessTypePoints = BUSINESS_TYPE_SCORE[businessType] ?? 12;
  const statusPoints       = STATUS_SCORE[status] ?? 10;
  const recencyPoints      = recencyScore(createdAt);

  return {
    score: businessTypePoints + statusPoints + recencyPoints,
    scoreBreakdown: {
      businessType: businessTypePoints,
      status:       statusPoints,
      recency:      recencyPoints,
    },
  };
}
