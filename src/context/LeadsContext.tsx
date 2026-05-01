import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import type { Lead, LeadStatus, ContactFormData } from '../types';
import { mockLeads } from '../data/mockData';

// ─── Types ────────────────────────────────────────────────────────────────────

interface LeadsContextValue {
  leads: Lead[];
  addLead: (data: ContactFormData) => void;
  updateLeadStatus: (id: string, status: LeadStatus) => void;
  deleteLead: (id: string) => void;
  totalLeads: number;
  newLeads: number;
  contactedLeads: number;
  convertedLeads: number;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const LeadsContext = createContext<LeadsContextValue | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function LeadsProvider({ children }: { children: ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>(mockLeads);

  const addLead = useCallback((data: ContactFormData) => {
    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      businessType: data.businessType as Lead['businessType'],
      status: 'new',
      createdAt: new Date().toISOString(),
    };
    setLeads((prev) => [newLead, ...prev]);
  }, []);

  const updateLeadStatus = useCallback((id: string, status: LeadStatus) => {
    setLeads((prev) =>
      prev.map((lead) => (lead.id === id ? { ...lead, status } : lead))
    );
  }, []);

  const deleteLead = useCallback((id: string) => {
    setLeads((prev) => prev.filter((lead) => lead.id !== id));
  }, []);

  const totalLeads = leads.length;
  const newLeads = leads.filter((l) => l.status === 'new').length;
  const contactedLeads = leads.filter((l) => l.status === 'contacted').length;
  const convertedLeads = leads.filter((l) => l.status === 'converted').length;

  return (
    <LeadsContext.Provider
      value={{
        leads,
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
    throw new Error('useLeads must be used inside LeadsProvider');
  }
  return context;
}
