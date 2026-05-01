import { Link } from 'react-router-dom';
import { useLeads } from '../context/LeadsContext';
import { StatCard } from '../components/dashboard/StatCard';
import { Badge } from '../components/ui/Badge';
import { Users, UserCheck, TrendingUp, Activity } from 'lucide-react';

export default function DashboardOverview() {
  const { leads, totalLeads, newLeads, contactedLeads, convertedLeads } =
    useLeads();

  const conversionRate =
    totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0;

  const recentLeads = leads.slice(0, 5);

  return (
    <div className="p-6 flex flex-col gap-6">
      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Leads"
          value={totalLeads}
          icon={Users}
          trend="This month"
          trendUp
          accent="gold"
        />
        <StatCard
          label="New Leads"
          value={newLeads}
          icon={Activity}
          accent="blue"
        />
        <StatCard
          label="Contacted"
          value={contactedLeads}
          icon={UserCheck}
          accent="amber"
        />
        <StatCard
          label="Converted"
          value={`${convertedLeads} (${conversionRate}%)`}
          icon={TrendingUp}
          trend={`${conversionRate}% rate`}
          trendUp={conversionRate >= 20}
          accent="emerald"
        />
      </div>

      {/* Recent leads preview */}
      <div className="rounded-xl border border-white/8 bg-brand-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <h2 className="font-display text-lg text-white">Recent Leads</h2>
          <Link
            to="/dashboard/leads"
            className="font-body text-xs text-gold/70 hover:text-gold transition-colors"
          >
            View all →
          </Link>
        </div>

        <div className="divide-y divide-white/5">
          {recentLeads.map((lead) => (
            <div
              key={lead.id}
              className="flex items-center justify-between px-5 py-3.5 hover:bg-white/2 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/8 flex items-center justify-center text-white/60 text-xs font-semibold shrink-0">
                  {lead.name.charAt(0)}
                </div>
                <div>
                  <p className="font-body text-white text-sm font-medium">
                    {lead.name}
                  </p>
                  <p className="font-body text-white/40 text-xs">
                    {lead.businessType}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-body text-white/30 text-xs hidden sm:block">
                  {new Date(lead.createdAt).toLocaleDateString('en-NG', {
                    day: 'numeric',
                    month: 'short',
                  })}
                </span>
                <Badge status={lead.status} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pipeline overview */}
      <div className="rounded-xl border border-white/8 bg-brand-card p-5">
        <h2 className="font-display text-lg text-white mb-4">Pipeline</h2>
        <div className="flex flex-col gap-3">
          {[
            {
              label: 'New Leads',
              count: newLeads,
              color: 'bg-blue-400',
              pct: (newLeads / Math.max(totalLeads, 1)) * 100,
            },
            {
              label: 'Contacted',
              count: contactedLeads,
              color: 'bg-amber-400',
              pct: (contactedLeads / Math.max(totalLeads, 1)) * 100,
            },
            {
              label: 'Converted',
              count: convertedLeads,
              color: 'bg-emerald-400',
              pct: (convertedLeads / Math.max(totalLeads, 1)) * 100,
            },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <p className="font-body text-white/50 text-xs w-20 shrink-0">
                {item.label}
              </p>
              <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${item.color}`}
                  style={{ width: `${item.pct}%` }}
                />
              </div>
              <span className="font-body text-white/60 text-xs w-8 text-right">
                {item.count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
