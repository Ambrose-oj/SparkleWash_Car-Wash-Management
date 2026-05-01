import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  Settings,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Overview', href: '/dashboard' },
  { icon: Users, label: 'Leads', href: '/dashboard/leads' },
  { icon: TrendingUp, label: 'Analytics', href: '/dashboard/analytics' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={clsx(
        'relative hidden md:flex flex-col bg-[#0C0C0C] border-r border-white/5 transition-all duration-300 shrink-0',
        collapsed ? 'w-16' : 'w-56'
      )}
    >
      {/* Logo */}
      <div
        className={clsx(
          'flex items-center gap-2.5 px-4 py-5 border-b border-white/5',
          collapsed && 'justify-center'
        )}
      >
        <div className="w-7 h-7 rounded-full bg-gold flex items-center justify-center text-brand-black text-xs font-bold font-display shrink-0">
          S
        </div>
        {!collapsed && (
          <span className="font-display text-lg text-white tracking-wide whitespace-nowrap">
            Sparkle<span className="text-gold">Wash</span>
          </span>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-4 flex flex-col gap-1 px-2">
        {NAV_ITEMS.map(({ icon: Icon, label, href }) => {
          const active =
            href === '/dashboard'
              ? location.pathname === '/dashboard'
              : location.pathname.startsWith(href);

          return (
            <Link
              key={href}
              to={href}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group',
                active
                  ? 'bg-gold/10 text-gold border border-gold/15'
                  : 'text-white/50 hover:text-white hover:bg-white/5',
                collapsed && 'justify-center'
              )}
              title={collapsed ? label : undefined}
            >
              <Icon size={16} className="shrink-0" />
              {!collapsed && (
                <span className="font-body text-sm font-medium">{label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-white/5 flex flex-col gap-2">
        <Link
          to="/"
          className={clsx(
            'flex items-center gap-2 px-3 py-2 rounded-lg text-white/30 hover:text-white/60 transition-colors',
            collapsed && 'justify-center'
          )}
          title={collapsed ? 'View Landing Page' : undefined}
        >
          <ExternalLink size={14} className="shrink-0" />
          {!collapsed && (
            <span className="font-body text-xs">View Landing Page</span>
          )}
        </Link>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed((v) => !v)}
        className="absolute -right-3 top-16 w-6 h-6 rounded-full bg-[#1a1a1a] border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-colors z-10"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  );
}
