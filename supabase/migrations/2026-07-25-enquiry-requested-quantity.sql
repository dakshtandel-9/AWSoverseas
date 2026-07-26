-- ============================================================
-- Product enquiries → optional requested quantity/quality note,
-- for the standalone "Request a Product" page (no product_id match
-- required — visitor names something not in the catalog).
-- Run this in the Supabase SQL editor (service-role). Idempotent.
-- ============================================================

alter table product_enquiries add column if not exists requested_quantity text not null default '';
