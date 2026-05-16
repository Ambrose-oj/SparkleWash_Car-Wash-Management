# SparkleWash — Premium Auto Detailing Platform

A full-stack business management platform for a premium auto detailing service in Lagos, Nigeria. Built with React, Express, and PostgreSQL on Supabase.

**Live Site:** [sparkle-wash-xi.vercel.app](https://sparkle-wash-xi.vercel.app)  
**Backend API:** [sparklewash-car-wash-management.onrender.com](https://sparklewash-car-wash-management.onrender.com/api/health)

---

## Overview

SparkleWash is a production-ready platform with two sides:

- **Landing Page** — a public-facing site where customers can explore services, read testimonials, book appointments, and submit enquiries
- **Admin Dashboard** — a protected management interface where staff track leads, manage bookings, and monitor business performance

---

## Demo

**Admin Dashboard Access**  
Visit the live site and click **Admin** in the navigation, or go directly to `/login`

```
Email:    sparklewash2026admin@gmail.com
Password: mypassword123
```

> These are read-only demo credentials. The dashboard is fully functional — you can view leads, update statuses, export CSV, and see the booking system in action.

---

## Features

### Landing Page

- Services catalog with pricing and duration
- Customer testimonials carousel (mobile) and grid (desktop)
- **Booking system** — pick a date, select a service, choose an available time slot. Slots have a max capacity of 3 and conflict detection prevents double-booking
- Contact / enquiry form that saves leads to the database

### Admin Dashboard

- **Lead management** — view, filter, search, and update status of all inbound leads
- **Lead scoring** — automatic 0–100 priority score based on business type, lead status, and recency. Leads ranked by score on the overview
- **CSV export** — download all leads with scores, status, and contact details
- **Bookings** — view all appointments with date, time slot, service, and status
- **Analytics pipeline** — visual breakdown of leads by stage

### Backend & Infrastructure

- Express + TypeScript REST API
- PostgreSQL via Supabase with 4 tables: `leads`, `bookings`, `services`, `users`
- JWT authentication — protected dashboard routes, token stored in memory
- Atomic booking conflict detection via database transactions
- Deployed on Render (backend) + Vercel (frontend)

---

## Tech Stack

| Layer      | Technology                               |
| ---------- | ---------------------------------------- |
| Frontend   | React 18, TypeScript, Vite, Tailwind CSS |
| Backend    | Node.js, Express, TypeScript             |
| Database   | PostgreSQL (Supabase)                    |
| Auth       | JWT (jsonwebtoken + bcryptjs)            |
| Deployment | Vercel (frontend), Render (backend)      |
| State      | React Context API                        |
| Routing    | React Router v6                          |

---

## Project Structure

```
sparklewash/
├── src/                        # Frontend (React)
│   ├── components/
│   │   ├── landing/            # Hero, Services, Testimonials, Booking, Contact
│   │   ├── dashboard/          # LeadsTable, StatCard, ScoreBadge, DashboardHeader
│   │   └── ui/                 # Button, Badge, shared primitives
│   ├── context/
│   │   ├── AuthContext.tsx     # JWT auth state
│   │   └── LeadsContext.tsx    # Lead CRUD + derived stats
│   ├── pages/                  # LandingPage, LoginPage, Dashboard pages
│   ├── services/
│   │   └── api.ts              # Data access layer (db.json for static, API for transactional)
│   ├── types/                  # Shared TypeScript interfaces
│   └── utils/
│       └── exportLeadsToCSV.ts # CSV export with proper escaping
│
└── server/                     # Backend (Express)
    └── src/
        ├── routes/             # leads, bookings, auth, services, testimonials
        ├── middleware/         # requireAuth (JWT), errorHandler
        ├── migrations/         # SQL schema files (001_init, 002_auth, 003_bookings)
        ├── seeds/              # DB seed from db.json
        ├── utils/
        │   └── leadScoring.ts  # 0–100 scoring algorithm
        └── db.ts               # Supabase PostgreSQL pool
```

---

## Local Development

### Prerequisites

- Node.js 18+
- A Supabase project (free tier works)

### 1. Clone and install frontend

```bash
git clone https://github.com/Ambrose-oj/SparkleWash_Car_Wash_Management.git
cd SparkleWash_Car_Wash_Management
npm install
```

### 2. Set up the backend

```bash
cd server
npm install
cp .env.example .env
```

Fill in your Supabase connection details in `server/.env`:

```env
DB_HOST=your-supabase-pooler-host
DB_PORT=6543
DB_NAME=postgres
DB_USER=postgres.your-project-id
DB_PASSWORD=your-password
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=your-secret-key
```

### 3. Run migrations and seed

```bash
npm run migrate   # creates tables
npm run seed      # populates with sample data
```

### 4. Start both servers

```bash
# Terminal 1 — backend
cd server && npm run dev

# Terminal 2 — frontend
npm run dev
```

Frontend runs at `http://localhost:5173`, backend at `http://localhost:3001`.

### 5. Create an admin account

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"you@email.com","name":"Your Name","password":"yourpassword"}'
```

---

## API Endpoints

| Method | Endpoint                     | Auth | Description                    |
| ------ | ---------------------------- | ---- | ------------------------------ |
| POST   | `/api/auth/register`         | —    | Create first admin account     |
| POST   | `/api/auth/login`            | —    | Login, returns JWT             |
| GET    | `/api/auth/me`               | ✓    | Get current user               |
| GET    | `/api/leads`                 | ✓    | All leads with scores          |
| POST   | `/api/leads`                 | —    | Submit new lead (contact form) |
| PATCH  | `/api/leads/:id/status`      | ✓    | Update lead status             |
| DELETE | `/api/leads/:id`             | ✓    | Delete lead                    |
| GET    | `/api/bookings/availability` | —    | Available slots for a date     |
| POST   | `/api/bookings`              | —    | Create booking                 |
| GET    | `/api/bookings`              | ✓    | All bookings                   |
| PATCH  | `/api/bookings/:id/status`   | ✓    | Update booking status          |
| GET    | `/api/services`              | —    | Service catalog                |
| GET    | `/api/testimonials`          | —    | Testimonials                   |

---

## Lead Scoring

Each lead receives an automatic priority score (0–100) computed on every fetch — never stored in the database so it stays fresh:

| Signal        | Weight | Logic                                          |
| ------------- | ------ | ---------------------------------------------- |
| Business type | 0–30   | Logistics/Fleet (30) → Car Wash competitor (8) |
| Lead status   | 0–40   | Converted (40) → New (10)                      |
| Recency       | 0–30   | Same day (30) → 30+ days old (4)               |

Leads are ranked by score on the dashboard overview with Hot / Warm / Cool / Cold badges.

---

## License

MIT
