-- ============================================================
-- Quote submissions → optional shipment image attachment.
-- Run this in the Supabase SQL editor (service-role). Idempotent.
-- ============================================================

alter table quote_submissions add column if not exists attachment_url text not null default '';
