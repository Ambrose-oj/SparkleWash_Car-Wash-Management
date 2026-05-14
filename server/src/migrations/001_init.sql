-- SparkleWash database schema
-- Run once to set up the database: npm run migrate

-- ─── Leads ───────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS leads (
  id            TEXT        PRIMARY KEY,
  name          TEXT        NOT NULL,
  email         TEXT        NOT NULL,
  phone         TEXT        NOT NULL,
  business_type TEXT        NOT NULL,
  status        TEXT        NOT NULL DEFAULT 'new'
                            CHECK (status IN ('new', 'contacted', 'converted')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes         TEXT        NOT NULL DEFAULT ''
);

CREATE INDEX IF NOT EXISTS leads_status_idx     ON leads(status);
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads(created_at DESC);

-- ─── Services ─────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS services (
  id          TEXT    PRIMARY KEY,
  icon        TEXT    NOT NULL,
  title       TEXT    NOT NULL,
  outcome     TEXT    NOT NULL,
  description TEXT    NOT NULL,
  price       TEXT    NOT NULL,
  duration    TEXT    NOT NULL,
  popular     BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order  INTEGER NOT NULL DEFAULT 0
);

-- ─── Testimonials ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS testimonials (
  id         TEXT    PRIMARY KEY,
  name       TEXT    NOT NULL,
  role       TEXT    NOT NULL,
  content    TEXT    NOT NULL,
  rating     INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  avatar     TEXT    NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);
