-- ============================================================
-- warehouse_bookings
-- Captures the "Book a Warehouse" popup on the quote page — a
-- separate ask from the shipment waybill above it. Inserts go
-- through the service-role client from a Server Action, same
-- pattern as newsletter_subscribers/product_enquiries.
-- ============================================================
create table if not exists warehouse_bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  full_name text not null,
  email text not null,
  phone text not null,
  address text not null,
  warehouse_type text not null,
  notes text not null default '',
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists warehouse_bookings_created_idx on warehouse_bookings (created_at desc);

alter table warehouse_bookings enable row level security;

-- No public policies — all inserts and admin reads go through the
-- service-role client, which bypasses RLS.
