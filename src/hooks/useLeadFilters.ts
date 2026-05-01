import { useState, useMemo, useCallback } from 'react';
import type { Lead, LeadFilters, SortConfig, SortField } from '../types';

const INITIAL_FILTERS: LeadFilters = {
  search: '',
  status: 'all',
  businessType: 'all',
};

export function useLeadFilters(leads: Lead[]) {
  const [filters, setFilters] = useState<LeadFilters>(INITIAL_FILTERS);
  const [sort, setSort] = useState<SortConfig>({
    field: 'createdAt',
    direction: 'desc',
  });

  const setSearch = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search }));
  }, []);

  const setStatus = useCallback((status: LeadFilters['status']) => {
    setFilters((prev) => ({ ...prev, status }));
  }, []);

  const setBusinessType = useCallback(
    (businessType: LeadFilters['businessType']) => {
      setFilters((prev) => ({ ...prev, businessType }));
    },
    []
  );

  const toggleSort = useCallback((field: SortField) => {
    setSort((prev) =>
      prev.field === field
        ? { field, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
        : { field, direction: 'asc' }
    );
  }, []);

  const filteredLeads = useMemo(() => {
    let result = [...leads];

    // Search filter
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.email.toLowerCase().includes(q) ||
          l.phone.includes(q) ||
          l.businessType.toLowerCase().includes(q)
      );
    }

    // Status filter
    if (filters.status !== 'all') {
      result = result.filter((l) => l.status === filters.status);
    }

    // Business type filter
    if (filters.businessType !== 'all') {
      result = result.filter((l) => l.businessType === filters.businessType);
    }

    // Sort
    result.sort((a, b) => {
      const dir = sort.direction === 'asc' ? 1 : -1;
      if (sort.field === 'createdAt') {
        return (
          dir *
          (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        );
      }
      return dir * String(a[sort.field]).localeCompare(String(b[sort.field]));
    });

    return result;
  }, [leads, filters, sort]);

  return {
    filters,
    sort,
    filteredLeads,
    setSearch,
    setStatus,
    setBusinessType,
    toggleSort,
  };
}
