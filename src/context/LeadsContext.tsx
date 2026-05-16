import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import type { Lead, LeadStatus, ContactFormData } from '../types';
import * as api from '../services/api';
import { useAuth } from './AuthContext';

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
  const { token } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [status, setStatus] = useState<ApiStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  // ── Fetch leads when token is available ────────────────────────────────────
  useEffect(() => {
    if (!token) {
      // Not authenticated — clear leads and don't fetch
      setLeads([]);
      setStatus('idle');
      return;
    }

    let cancelled = false;
    setStatus('loading');

    api
      .getLeads(token)
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
  }, [token]);

  // ── POST /leads ────────────────────────────────────────────────────────────
  const addLead = useCallback(
    async (data: ContactFormData) => {
      const res = await api.createLead(data);
      setLeads((prev) => [res.data, ...prev]);
    },
    []
  );

  // ── PATCH /leads/:id/status ────────────────────────────────────────────────
  const updateLeadStatus = useCallback(
    async (id: string, newStatus: LeadStatus) => {
      if (!token) throw new Error('Not authenticated');
      setLeads((prev) =>
        prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l))
      );
      const res = await api.updateLeadStatus(id, newStatus, token);
      setLeads((prev) => prev.map((l) => (l.id === id ? res.data : l)));
    },
    [token]
  );

  // ── DELETE /leads/:id ──────────────────────────────────────────────────────
  const deleteLead = useCallback(
    async (id: string) => {
      if (!token) throw new Error('Not authenticated');
      setLeads((prev) => prev.filter((l) => l.id !== id));
      try {
        await api.deleteLead(id, token);
      } catch (err) {
        // Rollback optimistic delete on failure
        api.getLeads(token).then((res) => setLeads(res.data));
        throw err;
      }
    },
    [token]
  );

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