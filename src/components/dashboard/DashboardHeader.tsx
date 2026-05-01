import { Link } from 'react-router-dom';
import { Bell, Search } from 'lucide-react';
import { useLeads } from '../../context/LeadsContext';

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
}

export function DashboardHeader({ title, subtitle }: DashboardHeaderProps) {
  const { newLeads } = useLeads();

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#0C0C0C] shrink-0">
      <div>
        <h1 className="font-display text-2xl text-white">{title}</h1>
        {subtitle && (
          <p className="font-body text-white/40 text-sm">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Mobile brand */}
        <Link to="/" className="md:hidden font-display text-lg text-white mr-2">
          Sparkle<span className="text-gold">Wash</span>
        </Link>

        {/* Notification */}
        <div className="relative">
          <button className="w-9 h-9 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center text-white/50 hover:text-white transition-colors">
            <Bell size={15} />
          </button>
          {newLeads > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gold text-brand-black text-[10px] font-bold font-body flex items-center justify-center">
              {newLeads > 9 ? '9+' : newLeads}
            </span>
          )}
        </div>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-lg bg-gold/20 border border-gold/30 flex items-center justify-center text-gold text-xs font-semibold font-body">
          TC
        </div>
      </div>
    </header>
  );
}
