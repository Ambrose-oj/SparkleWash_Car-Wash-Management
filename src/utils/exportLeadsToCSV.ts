import type { Lead } from '../types';

/**
 * exportLeadsToCSV
 *
 * Converts an array of leads to a CSV string and triggers a browser download.
 * Handles special characters by quoting fields that contain commas, quotes,
 * or newlines — a common source of bugs in naive CSV implementations.
 */

function escapeCSVField(value: string | number | undefined): string {
  const str = String(value ?? '');
  // If the field contains a comma, double-quote, or newline — wrap in quotes
  // and escape any existing double-quotes by doubling them
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

const CSV_COLUMNS: { header: string; key: keyof Lead }[] = [
  { header: 'Name',          key: 'name'         },
  { header: 'Email',         key: 'email'        },
  { header: 'Phone',         key: 'phone'        },
  { header: 'Business Type', key: 'businessType' },
  { header: 'Status',        key: 'status'       },
  { header: 'Score',         key: 'score'        },
  { header: 'Notes',         key: 'notes'        },
  { header: 'Date Submitted',key: 'createdAt'    },
];

export function exportLeadsToCSV(leads: Lead[], filename = 'sparklewash-leads.csv'): void {
  if (leads.length === 0) {
    throw new Error('No leads to export');
  }

  const header = CSV_COLUMNS.map((c) => c.header).join(',');

  const rows = leads.map((lead) =>
    CSV_COLUMNS.map((col) => {
      const value = lead[col.key];
      // Format ISO date strings to readable format
      if (col.key === 'createdAt' && typeof value === 'string') {
        return escapeCSVField(
          new Date(value).toLocaleDateString('en-NG', {
            day: 'numeric', month: 'short', year: 'numeric',
          })
        );
      }
      return escapeCSVField(value as string | number);
    }).join(',')
  );

  const csv = [header, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href     = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();

  // Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
