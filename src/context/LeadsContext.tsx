import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import type { Lead, LeadStatus, ContactFormData } from '../types';
import * as api from '../services/mockApi';

// ─── Types ────────────────────────────────────────────────────────────────────

type ApiStatus = 'idle' | 'loading' | 'success' | 'error';

interface LeadsContextValue {
  leads: Lead[];
  status: ApiStatus;
  error: string | null;
  addLead: (data: ContactFormData) => Promise<void>;
  updateLeadStatus: (id: string, status: LeadStatus) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;
  totalLeads: number;
  newLeads: number;
  contactedLeads: number;
  convertedLeads: number;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const LeadsContext = createContext<LeadsContextValue | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function LeadsProvider({ children }: { children: ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [status, setStatus] = useState<ApiStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  // ── Fetch all leads on mount (GET /leads) ──────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    setStatus('loading');

    api
      .getLeads()
      .then((res) => {
        if (!cancelled) {
          setLeads(res.data);
          setStatus('success');
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setError(err.message);
          setStatus('error');
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // ── POST /leads ────────────────────────────────────────────────────────────
  const addLead = useCallback(async (data: ContactFormData) => {
    const res = await api.createLead(data);
    setLeads((prev) => [res.data, ...prev]);
  }, []);

  // ── PATCH /leads/:id/status ────────────────────────────────────────────────
  const updateLeadStatus = useCallback(
    async (id: string, newStatus: LeadStatus) => {
      // Optimistic update first
      setLeads((prev) =>
        prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l))
      );
      // Reconcile with server response
      const res = await api.updateLeadStatus(id, newStatus);
      setLeads((prev) => prev.map((l) => (l.id === id ? res.data : l)));
    },
    []
  );

  // ── DELETE /leads/:id ──────────────────────────────────────────────────────
  const deleteLead = useCallback(async (id: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
    await api.deleteLead(id);
  }, []);

  // ── Derived stats ──────────────────────────────────────────────────────────
  const totalLeads = leads.length;
  const newLeads = leads.filter((l) => l.status === 'new').length;
  const contactedLeads = leads.filter((l) => l.status === 'contacted').length;
  const convertedLeads = leads.filter((l) => l.status === 'converted').length;

  return (
    <LeadsContext.Provider
      value={{
        leads,
        status,
        error,
        addLead,
        updateLeadStatus,
        deleteLead,
        totalLeads,
        newLeads,
        contactedLeads,
        convertedLeads,
      }}
    >
      {children}
    </LeadsContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useLeads(): LeadsContextValue {
  const context = useContext(LeadsContext);
  if (!context) {
    throw new Error('useLeads must be used inside <LeadsProvider>');
  }
  return context;
}
