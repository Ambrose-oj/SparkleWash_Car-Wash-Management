import { useState } from 'react';
import { Download } from 'lucide-react';
import { LeadsTable } from '../components/dashboard/LeadsTable';
import { useLeads } from '../context/LeadsContext';
import { exportLeadsToCSV } from '../utils/exportLeadsToCSV';

export default function LeadsPage() {
  const { leads } = useLeads();
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState('');

  async function handleExport() {
    setExportError('');
    setExporting(true);

    try {
      exportLeadsToCSV(leads);
    } catch (err) {
      setExportError(err instanceof Error ? err.message : 'Export failed');
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="font-display text-xl text-white">Lead Management</h2>
          <p className="font-body text-white/40 text-sm mt-1">
            Track, filter, and manage every inbound lead from your landing page.
          </p>
        </div>

        <div className="flex flex-col items-end gap-1">
          <button
            onClick={handleExport}
            disabled={exporting || leads.length === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-white/60 font-body text-sm hover:border-gold/30 hover:text-gold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Download size={14} />
            {exporting ? 'Exporting…' : `Export CSV (${leads.length})`}
          </button>
          {exportError && (
            <p className="font-body text-red-400 text-xs">{exportError}</p>
          )}
        </div>
      </div>

      <LeadsTable />
    </div>
  );
}
