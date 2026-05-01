# SparkleWash — Frontend Assessment Project

A production-ready frontend system built for the TCprojects Assessment Challenge.
A **Business Growth Landing Page** paired with an **Admin Lead Dashboard** for a fictional premium auto-detailing business in Lagos.

---

## Live Demo

| Part | URL |
|------|-----|
| Landing Page | `/` |
| Admin Dashboard | `/dashboard` |

---

## Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | React 18 + TypeScript | Industry standard, strict typing, hooks-first |
| Styling | TailwindCSS v3 | Utility-first, zero dead CSS, fast iteration |
| Routing | React Router v6 | Nested layouts, lazy loading support |
| State | Context API + useReducer pattern | Lightweight, no extra deps for this scope |
| Build | Vite | Sub-second HMR, fast production builds |
| Fonts | Cormorant Garamond + DM Sans | Premium serif for display, clean sans for UI |

---

## Project Structure

```
src/
├── components/
│   ├── ui/               # Reusable primitives: Button, Badge, Input, Select
│   ├── landing/          # Landing-page sections: Navbar, Hero, Services, Testimonials, Contact, Footer
│   └── dashboard/        # Dashboard components: Sidebar, DashboardHeader, StatCard, LeadsTable
├── context/
│   └── LeadsContext.tsx  # Global leads state with CRUD operations
├── data/
│   └── mockData.ts       # Mock leads, services, testimonials
├── hooks/
│   ├── useForm.ts        # Contact form state, validation, submission
│   └── useLeadFilters.ts # Search, filter, sort logic (memoized)
├── pages/
│   ├── LandingPage.tsx   # Public-facing landing page
│   ├── DashboardLayout.tsx  # Dashboard shell with Sidebar + Header
│   ├── DashboardOverview.tsx # Stats + pipeline view
│   ├── LeadsPage.tsx     # Full lead management table
│   └── PlaceholderPage.tsx  # Analytics / Settings stubs
└── types/
    └── index.ts          # Shared TypeScript interfaces
```

---

## Architecture Decisions

### 1. Separation of Concerns
- All logic (validation, filtering, sorting) lives in **custom hooks**, not components
- Components are purely presentational or lightly orchestrate hooks
- Data types are centralized in `types/index.ts` — no duplicated interfaces

### 2. Context API for State
- `LeadsContext` holds all lead data and exposes `addLead`, `updateLeadStatus`, `deleteLead`
- The landing page form writes directly to this context — leads appear in the dashboard immediately
- Chose Context API over Zustand to keep dependencies minimal; Zustand would be the natural upgrade path at scale

### 3. Lazy Loading
- All pages are `lazy()`-wrapped with `Suspense` boundaries
- Landing page sections (Services, Testimonials, Contact) load lazily after the Hero — the above-the-fold experience is instant
- A consistent skeleton loader maintains visual stability during loads

### 4. Component Reusability
- `Button`, `Input`, `Select`, `Badge`, `StatCard` are fully prop-driven primitives
- `ServiceCard` and `TestimonialCard` are composable with typed data shapes
- Zero hardcoded strings inside UI components — all content flows from `mockData.ts`

---

## Features

### Landing Page
- ✅ Animated hero with gradient mesh background
- ✅ Stats bar (1,200+ cars, 98% satisfaction, 5 years)
- ✅ 4 service cards with hover CTAs and "Most Popular" badge
- ✅ Testimonial grid (desktop) + touch carousel (mobile)
- ✅ Lead capture form with full validation and success state
- ✅ Collapsible mobile nav
- ✅ Smooth scroll navigation

### Admin Dashboard
- ✅ Collapsible sidebar with active route highlighting
- ✅ Stats overview: Total, New, Contacted, Converted + conversion rate
- ✅ Pipeline progress bars
- ✅ Full lead table with sortable columns
- ✅ Real-time search across name, email, phone, business type
- ✅ Filter by status + business type
- ✅ Per-lead status update via dropdown menu
- ✅ Delete leads
- ✅ Mobile-responsive card layout
- ✅ New lead badge on notification bell

---

## Scalability Path

### Phase 2 — Backend Integration
```
Landing Form → POST /api/leads → PostgreSQL
Dashboard → GET /api/leads?status=new&page=1
```
- Replace `LeadsContext` mock with `react-query` / `SWR` for server state
- API layer already abstracted — swap `mockData.ts` calls for `services/api.ts`

### Phase 3 — Authentication
- Add `/login` route with JWT auth
- Protect `/dashboard/*` with a `<RequireAuth>` wrapper
- Role-based access: Admin vs. Viewer

### Phase 4 — CRM Expansion
- Lead assignment to team members
- Email/WhatsApp follow-up triggers
- Activity timeline per lead
- Revenue attribution per conversion

### Phase 5 — Multi-tenant SaaS
- Each business gets their own `workspaceId`
- Landing page becomes a template engine
- Dashboard becomes a white-label product

---

## Performance Considerations

- **Lazy loading** on all routes and above-the-fold-optional sections
- **useMemo** in `useLeadFilters` — filtering/sorting never re-runs unless data or filters change
- **useCallback** on all context mutations — no unnecessary re-renders down the tree
- **CSS animations** only — no JS animation libraries, zero jank
- **Google Fonts** loaded with `preconnect` hints — no render blocking
- **Vite** tree-shaking removes unused code at build time
- `clsx` for conditional classes — no string concatenation performance pitfalls

---

## Getting Started

```bash
# Install
npm install

# Dev server
npm run dev

# Production build
npm run build

# Preview build
npm run preview
```

---

## Deployment

Ready for **Vercel** or **Netlify** with zero config.

```bash
# Vercel
npx vercel --prod

# Netlify
netlify deploy --prod --dir=dist
```

---

## Author

Built as part of the TCprojects Frontend Assessment Challenge.
> "This isn't about building something flashy for show — it's about proving you can create frontend systems that solve real business problems."
