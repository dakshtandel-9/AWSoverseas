-- ============================================================
-- Product enquiries → split into open "Enquiry" (no login) and
-- login-gated "Order", plus first/last name fields.
-- Run this in the Supabase SQL editor (service-role). Idempotent.
-- ============================================================

alter table product_enquiries add column if not exists request_type text not null default 'enquiry';
alter table product_enquiries add column if not exists first_name text not null default '';
alter table product_enquiries add column if not exists last_name text not null default '';

alter table product_enquiries drop constraint if exists product_enquiries_request_type_check;
alter table product_enquiries add constraint product_enquiries_request_type_check
  check (request_type in ('enquiry', 'order'));

create index if not exists product_enquiries_request_type_idx
  on product_enquiries (request_type, created_at desc);

-- Backfill first/last name for existing rows from the old single full_name.
update product_enquiries
set
  first_name = coalesce(nullif(split_part(full_name, ' ', 1), ''), first_name),
  last_name = coalesce(
    nullif(regexp_replace(full_name, '^\S+\s*', ''), ''),
    last_name
  )
where first_name = '' and full_name <> '';
