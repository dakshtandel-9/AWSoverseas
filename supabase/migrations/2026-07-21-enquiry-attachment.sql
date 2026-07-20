-- ============================================================
-- Product enquiries → optional image attachment.
-- Run this in the Supabase SQL editor (service-role). Idempotent.
-- ============================================================

alter table product_enquiries add column if not exists attachment_url text not null default '';
