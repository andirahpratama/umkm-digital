-- =====================================================
-- UMKM Digital — Supabase Schema Setup
-- Jalankan di: Supabase Dashboard > SQL Editor
-- =====================================================

-- ─── USERS TABLE ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  gemini_api_key TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ
);

-- ─── MESSAGES TABLE ───────────────────────────────────
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  user_name TEXT,
  user_email TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── APP SETTINGS TABLE ───────────────────────────────
CREATE TABLE IF NOT EXISTS app_settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── DEFAULT SETTINGS ─────────────────────────────────
INSERT INTO app_settings (key, value)
VALUES
  ('favicon_url', '/assets/favicon.jpg'),
  ('logo_url', '/assets/logo.jpg'),
  ('app_name', 'UMKM Digital')
ON CONFLICT (key) DO NOTHING;

-- ─── DISABLE RLS (Auth dihandle server-side via JWT) ──
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings DISABLE ROW LEVEL SECURITY;

-- ─── STORAGE BUCKET ───────────────────────────────────
-- Buat bucket "assets" untuk logo & favicon
-- Lakukan manual di: Storage > New Bucket
-- Nama bucket: assets
-- Public: YES (centang public)
