import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LeadsProvider } from './context/LeadsContext';
import { PlaceholderPage } from './pages/PlaceholderPage';

const LandingPage = lazy(() => import('./pages/LandingPage'));
const DashboardLayout = lazy(() => import('./pages/DashboardLayout'));
const DashboardOverview = lazy(() => import('./pages/DashboardOverview'));
const LeadsPage = lazy(() => import('./pages/LeadsPage'));

function FullPageLoader() {
  return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-gold/30 border-t-gold animate-spin" />
        <span className="font-body text-white/30 text-sm">Loading…</span>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <LeadsProvider>
        <Suspense fallback={<FullPageLoader />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardOverview />} />
              <Route path="leads" element={<LeadsPage />} />
              <Route
                path="analytics"
                element={
                  <PlaceholderPage
                    title="Analytics"
                    description="Detailed conversion funnels, source tracking, and revenue attribution will live here."
                  />
                }
              />
              <Route
                path="settings"
                element={
                  <PlaceholderPage
                    title="Settings"
                    description="Configure notifications, team members, and CRM integrations from this panel."
                  />
                }
              />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </LeadsProvider>
    </BrowserRouter>
  );
}
