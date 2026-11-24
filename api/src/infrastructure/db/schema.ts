export const DATABASE_SCHEMA = `PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS customers (
  id                  INTEGER PRIMARY KEY AUTOINCREMENT,
  company_name        TEXT    NOT NULL,
  company_name_search TEXT    NOT NULL,
  tax_id              TEXT    NOT NULL UNIQUE,
  email               TEXT    NOT NULL,
  country             TEXT    NOT NULL CHECK (length(country) = 2),
  plan                TEXT    NOT NULL CHECK (plan IN ('basic', 'pro', 'enterprise')),
  created_at          TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_customers_name_search ON customers (company_name_search);

CREATE TABLE IF NOT EXISTS simulations (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id INTEGER NOT NULL REFERENCES customers (id),
  users       INTEGER NOT NULL CHECK (users BETWEEN 1 AND 100000),
  storage_gb  INTEGER NOT NULL DEFAULT 0 CHECK (storage_gb >= 0),
  api_calls   INTEGER NOT NULL DEFAULT 0 CHECK (api_calls >= 0),
  base_cents  INTEGER NOT NULL CHECK (base_cents >= 0),
  vat_rate_basis_points INTEGER NOT NULL CHECK (vat_rate_basis_points >= 0),
  vat_cents   INTEGER NOT NULL CHECK (vat_cents >= 0),
  total_cents INTEGER NOT NULL CHECK (total_cents = base_cents + vat_cents),
  created_at  TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  archived_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_simulations_customer ON simulations (customer_id, created_at DESC);
`;
