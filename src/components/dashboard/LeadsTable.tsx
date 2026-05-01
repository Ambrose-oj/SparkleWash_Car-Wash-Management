import { useState } from 'react';
import { clsx } from 'clsx';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Input, Select } from '../ui/Input';
import { useLeads } from '../../context/LeadsContext';
import { useLeadFilters } from '../../hooks/useLeadFilters';
import type { Lead, LeadStatus } from '../../types';
import {
  Search,
  ChevronUp,
  ChevronDown,
  Trash2,
  MoreHorizontal,
  SortAsc,
} from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'new', label: 'New Lead' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'converted', label: 'Converted' },
];

const BUSINESS_OPTIONS = [
  { value: 'all', label: 'All Business Types' },
  { value: 'Car Wash', label: 'Car Wash' },
  { value: 'Restaurant / Food Service', label: 'Restaurant / Food Service' },
  { value: 'Retail / Shop', label: 'Retail / Shop' },
  { value: 'Logistics / Delivery', label: 'Logistics / Delivery' },
  { value: 'Beauty / Salon', label: 'Beauty / Salon' },
  { value: 'Real Estate', label: 'Real Estate' },
  { value: 'Other', label: 'Other' },
];

export function LeadsTable() {
  const { leads, updateLeadStatus, deleteLead } = useLeads();
  const {
    filters,
    sort,
    filteredLeads,
    setSearch,
    setStatus,
    setBusinessType,
    toggleSort,
  } = useLeadFilters(leads);

  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-NG', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const SortIcon = ({ field }: { field: string }) => {
    if (sort.field !== field)
      return <SortAsc size={12} className="opacity-20" />;
    return sort.direction === 'asc' ? (
      <ChevronUp size={12} className="text-gold" />
    ) : (
      <ChevronDown size={12} className="text-gold" />
    );
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
          />
          <input
            type="search"
            placeholder="Search by name, email or phone…"
            value={filters.search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-white/10 bg-white/5 text-sm text-white placeholder:text-white/30 font-body focus:outline-none focus:border-gold/40 focus:ring-1 focus:ring-gold/20 transition-all"
            aria-label="Search leads"
          />
        </div>

        {/* Status filter */}
        <select
          value={filters.status}
          onChange={(e) => setStatus(e.target.value as any)}
          className="px-3 py-2.5 rounded-lg border border-white/10 bg-brand-card text-sm text-white font-body focus:outline-none focus:border-gold/40 transition-all appearance-none cursor-pointer"
          aria-label="Filter by status"
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value} className="bg-brand-card">
              {o.label}
            </option>
          ))}
        </select>

        {/* Business type filter */}
        <select
          value={filters.businessType}
          onChange={(e) => setBusinessType(e.target.value as any)}
          className="px-3 py-2.5 rounded-lg border border-white/10 bg-brand-card text-sm text-white font-body focus:outline-none focus:border-gold/40 transition-all appearance-none cursor-pointer"
          aria-label="Filter by business type"
        >
          {BUSINESS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value} className="bg-brand-card">
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {/* Result count */}
      <div className="flex items-center justify-between">
        <p className="font-body text-sm text-white/40">
          {filteredLeads.length} lead{filteredLeads.length !== 1 ? 's' : ''}{' '}
          found
        </p>
      </div>

      {/* Table (desktop) */}
      <div className="hidden md:block rounded-xl border border-white/8 overflow-hidden">
        <table className="w-full text-sm font-body">
          <thead>
            <tr className="border-b border-white/8 bg-white/3">
              {[
                { label: 'Name', field: 'name' },
                { label: 'Contact', field: null },
                { label: 'Business Type', field: 'businessType' },
                { label: 'Status', field: 'status' },
                { label: 'Date', field: 'createdAt' },
                { label: '', field: null },
              ].map(({ label, field }) => (
                <th
                  key={label || 'actions'}
                  className={clsx(
                    'text-left px-4 py-3 text-white/40 font-medium text-xs tracking-wide',
                    field && 'cursor-pointer hover:text-white/70 select-none'
                  )}
                  onClick={() => field && toggleSort(field as any)}
                >
                  <div className="flex items-center gap-1.5">
                    {label}
                    {field && <SortIcon field={field} />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredLeads.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-16 text-white/30 font-body"
                >
                  No leads match your filters.
                </td>
              </tr>
            ) : (
              filteredLeads.map((lead) => (
                <TableRow
                  key={lead.id}
                  lead={lead}
                  openMenu={openMenu}
                  setOpenMenu={setOpenMenu}
                  onStatusChange={updateLeadStatus}
                  onDelete={deleteLead}
                  formatDate={formatDate}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Cards (mobile) */}
      <div className="md:hidden flex flex-col gap-3">
        {filteredLeads.length === 0 ? (
          <div className="text-center py-12 text-white/30 font-body text-sm">
            No leads match your filters.
          </div>
        ) : (
          filteredLeads.map((lead) => (
            <MobileLeadCard
              key={lead.id}
              lead={lead}
              onStatusChange={updateLeadStatus}
              onDelete={deleteLead}
              formatDate={formatDate}
            />
          ))
        )}
      </div>
    </div>
  );
}

// ─── Table Row ────────────────────────────────────────────────────────────────

function TableRow({
  lead,
  openMenu,
  setOpenMenu,
  onStatusChange,
  onDelete,
  formatDate,
}: {
  lead: Lead;
  openMenu: string | null;
  setOpenMenu: (id: string | null) => void;
  onStatusChange: (id: string, status: LeadStatus) => void;
  onDelete: (id: string) => void;
  formatDate: (iso: string) => string;
}) {
  const isMenuOpen = openMenu === lead.id;

  return (
    <tr className="hover:bg-white/2 transition-colors group">
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-white/8 flex items-center justify-center text-white/60 text-xs font-semibold shrink-0">
            {lead.name.charAt(0)}
          </div>
          <div>
            <p className="text-white font-medium text-sm">{lead.name}</p>
            {lead.notes && (
              <p className="text-white/30 text-xs truncate max-w-[180px]">
                {lead.notes}
              </p>
            )}
          </div>
        </div>
      </td>
      <td className="px-4 py-3.5">
        <div>
          <p className="text-white/70 text-xs">{lead.email}</p>
          <p className="text-white/40 text-xs mt-0.5">{lead.phone}</p>
        </div>
      </td>
      <td className="px-4 py-3.5">
        <span className="text-white/60 text-xs">{lead.businessType}</span>
      </td>
      <td className="px-4 py-3.5">
        <Badge status={lead.status} />
      </td>
      <td className="px-4 py-3.5">
        <span className="text-white/40 text-xs">{formatDate(lead.createdAt)}</span>
      </td>
      <td className="px-4 py-3.5">
        <div className="relative flex justify-end">
          <button
            onClick={() => setOpenMenu(isMenuOpen ? null : lead.id)}
            className="w-7 h-7 rounded-md flex items-center justify-center text-white/30 hover:text-white hover:bg-white/8 transition-colors opacity-0 group-hover:opacity-100"
            aria-label="Open actions"
          >
            <MoreHorizontal size={14} />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 top-8 w-44 rounded-lg border border-white/10 bg-[#1a1a1a] shadow-xl z-20 py-1 animate-fade-in">
              {(['new', 'contacted', 'converted'] as LeadStatus[]).map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    onStatusChange(lead.id, s);
                    setOpenMenu(null);
                  }}
                  className={clsx(
                    'w-full text-left px-3 py-2 text-xs font-body transition-colors',
                    lead.status === s
                      ? 'text-gold bg-gold/5'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  )}
                >
                  Mark as{' '}
                  {s === 'new'
                    ? 'New Lead'
                    : s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
              <div className="border-t border-white/5 my-1" />
              <button
                onClick={() => {
                  onDelete(lead.id);
                  setOpenMenu(null);
                }}
                className="w-full text-left px-3 py-2 text-xs font-body text-red-400/70 hover:text-red-400 hover:bg-red-500/5 transition-colors flex items-center gap-2"
              >
                <Trash2 size={12} />
                Delete Lead
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}

// ─── Mobile Card ──────────────────────────────────────────────────────────────

function MobileLeadCard({
  lead,
  onStatusChange,
  onDelete,
  formatDate,
}: {
  lead: Lead;
  onStatusChange: (id: string, status: LeadStatus) => void;
  onDelete: (id: string) => void;
  formatDate: (iso: string) => string;
}) {
  return (
    <div className="rounded-xl border border-white/8 bg-brand-card p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-white/8 flex items-center justify-center text-white/60 text-sm font-semibold">
            {lead.name.charAt(0)}
          </div>
          <div>
            <p className="text-white font-medium text-sm">{lead.name}</p>
            <p className="text-white/40 text-xs">{lead.businessType}</p>
          </div>
        </div>
        <Badge status={lead.status} />
      </div>

      <div className="flex flex-col gap-1 text-xs font-body">
        <p className="text-white/50">{lead.email}</p>
        <p className="text-white/40">{lead.phone}</p>
        <p className="text-white/25">{formatDate(lead.createdAt)}</p>
      </div>

      <div className="flex gap-2 pt-2 border-t border-white/5">
        {(['new', 'contacted', 'converted'] as LeadStatus[]).map((s) => (
          <button
            key={s}
            onClick={() => onStatusChange(lead.id, s)}
            className={clsx(
              'flex-1 py-1.5 rounded-md text-xs font-body font-medium transition-colors',
              lead.status === s
                ? 'bg-gold/15 text-gold border border-gold/20'
                : 'bg-white/5 text-white/40 hover:text-white hover:bg-white/10'
            )}
          >
            {s === 'new' ? 'New' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
        <button
          onClick={() => onDelete(lead.id)}
          className="px-3 py-1.5 rounded-md bg-red-500/10 text-red-400/60 hover:text-red-400 text-xs transition-colors"
        >
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
}
