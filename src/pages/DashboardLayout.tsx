import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '../components/dashboard/Sidebar';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';

const PAGE_META: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': {
    title: 'Overview',
    subtitle: 'Welcome back, TC Team',
  },
  '/dashboard/leads': {
    title: 'Leads',
    subtitle: 'All inbound leads from your landing page',
  },
  '/dashboard/analytics': {
    title: 'Analytics',
    subtitle: 'Performance & conversion data',
  },
  '/dashboard/settings': {
    title: 'Settings',
    subtitle: 'Configure your workspace',
  },
};

export default function DashboardLayout() {
  const location = useLocation();
  const meta = PAGE_META[location.pathname] ?? {
    title: 'Dashboard',
    subtitle: '',
  };

  return (
    <div className="flex h-screen overflow-hidden bg-brand-navy">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DashboardHeader title={meta.title} subtitle={meta.subtitle} />

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
