-- Users table for dashboard authentication
-- Run via: npm run migrate

CREATE TABLE IF NOT EXISTS users (
  id            TEXT        PRIMARY KEY,
  email         TEXT        NOT NULL UNIQUE,
  password_hash TEXT        NOT NULL,
  name          TEXT        NOT NULL,
  role          TEXT        NOT NULL DEFAULT 'admin'
                            CHECK (role IN ('admin', 'super_admin')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_login    TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS users_email_idx ON users(email);
