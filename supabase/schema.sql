-- ============================================================
-- Floral Scentora — Supabase Products Table Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- 1. Create the products table
CREATE TABLE IF NOT EXISTS products (
  id            BIGSERIAL    PRIMARY KEY,
  name          TEXT         NOT NULL,
  brand         TEXT         NOT NULL DEFAULT 'Floral Scentora',
  category      TEXT         NOT NULL DEFAULT 'Floral',
  price         NUMERIC(12,2) NOT NULL DEFAULT 0,
  quantity      INTEGER      NOT NULL DEFAULT 0,
  stock_status  TEXT         NOT NULL DEFAULT 'In Stock',
  notes_top     TEXT         DEFAULT '',
  notes_middle  TEXT         DEFAULT '',
  notes_base    TEXT         DEFAULT '',
  description   TEXT         DEFAULT '',
  image         TEXT         DEFAULT '',
  longevity     TEXT         DEFAULT '',
  sillage       TEXT         DEFAULT '',
  created_at    TIMESTAMPTZ  DEFAULT NOW(),
  updated_at    TIMESTAMPTZ  DEFAULT NOW()
);

-- 2. Index for fast category filtering
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

-- 3. Index for stock status filtering in admin panel
CREATE INDEX IF NOT EXISTS idx_products_stock_status ON products(stock_status);

-- 4. Auto-update updated_at on every row change
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- 5. Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- 6. Allow public SELECT (anyone can browse products)
CREATE POLICY "Public can read products"
  ON products FOR SELECT
  USING (true);

-- 7. Allow full CRUD via service role key (used by our API functions)
--    The service role bypasses RLS automatically — no policy needed for it.
--    This policy lets the anon key also do writes (for simpler setup):
CREATE POLICY "Allow all writes"
  ON products FOR ALL
  USING (true)
  WITH CHECK (true);
