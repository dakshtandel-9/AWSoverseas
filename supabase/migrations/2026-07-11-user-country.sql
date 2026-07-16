-- ============================================================
-- Add a country field to customer profiles (collected during
-- profile setup, shown on the profile + admin user views).
-- Run in the Supabase SQL editor. Idempotent.
-- ============================================================

alter table user_profiles add column if not exists country text not null default '';
