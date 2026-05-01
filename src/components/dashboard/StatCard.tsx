import { LucideIcon } from 'lucide-react';
import { clsx } from 'clsx';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  accent?: 'gold' | 'blue' | 'amber' | 'emerald';
}

const accentMap = {
  gold: {
    icon: 'bg-gold/10 border-gold/20 text-gold',
    trend: 'text-gold',
  },
  blue: {
    icon: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    trend: 'text-blue-400',
  },
  amber: {
    icon: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    trend: 'text-amber-400',
  },
  emerald: {
    icon: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    trend: 'text-emerald-400',
  },
};

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  trendUp,
  accent = 'gold',
}: StatCardProps) {
  const colors = accentMap[accent];

  return (
    <div className="rounded-xl border border-white/8 bg-brand-card p-5 flex flex-col gap-3 hover:border-white/12 transition-colors">
      <div className="flex items-start justify-between">
        <div
          className={clsx(
            'w-9 h-9 rounded-lg border flex items-center justify-center',
            colors.icon
          )}
        >
          <Icon size={16} />
        </div>
        {trend && (
          <span
            className={clsx('font-body text-xs font-medium', colors.trend)}
          >
            {trendUp ? '↑' : '↓'} {trend}
          </span>
        )}
      </div>

      <div>
        <p className="font-display text-3xl text-white">{value}</p>
        <p className="font-body text-white/40 text-sm mt-0.5">{label}</p>
      </div>
    </div>
  );
}
