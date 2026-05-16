-- Bookings table
-- Stores car wash appointment bookings made from the landing page.
-- Each slot (date + time) has a max capacity of 3 concurrent bookings.

CREATE TABLE IF NOT EXISTS bookings (
  id           TEXT        PRIMARY KEY,
  name         TEXT        NOT NULL,
  email        TEXT        NOT NULL,
  phone        TEXT        NOT NULL,
  service_id   TEXT        NOT NULL,
  booking_date DATE        NOT NULL,
  time_slot    TEXT        NOT NULL,
  status       TEXT        NOT NULL DEFAULT 'pending'
                           CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  notes        TEXT        NOT NULL DEFAULT '',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS bookings_date_slot_idx ON bookings(booking_date, time_slot);
CREATE INDEX IF NOT EXISTS bookings_email_idx     ON bookings(email);
CREATE INDEX IF NOT EXISTS bookings_status_idx    ON bookings(status);
