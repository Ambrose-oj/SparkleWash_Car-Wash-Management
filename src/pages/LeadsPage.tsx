import { LeadsTable } from '../components/dashboard/LeadsTable';

export default function LeadsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="font-display text-xl text-white">Lead Management</h2>
        <p className="font-body text-white/40 text-sm mt-1">
          Track, filter, and manage every inbound lead from your landing page.
        </p>
      </div>
      <LeadsTable />
    </div>
  );
}
