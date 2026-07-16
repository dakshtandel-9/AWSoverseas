-- AWSoversea admin backend schema
-- Run this once in the Supabase SQL Editor (Project -> SQL Editor -> New query).

-- ============================================================
-- site_settings — singleton row (id enforced to always be 1)
-- ============================================================
create table if not exists site_settings (
  id integer primary key default 1 check (id = 1),
  phone_1 text not null default '',
  phone_2 text not null default '',
  email text not null default '',
  whatsapp_number text not null default '', -- digits only, e.g. "919876543210"
  address text not null default '',
  updated_at timestamptz not null default now()
);

insert into site_settings (id)
values (1)
on conflict (id) do nothing;

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists site_settings_touch on site_settings;
create trigger site_settings_touch
before update on site_settings
for each row execute function set_updated_at();

-- ============================================================
-- blog_posts
-- ============================================================
create table if not exists blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category text not null default '',
  excerpt text not null default '',
  read_time text not null default '',
  image_url text not null default '',
  author_name text not null default 'AWSoversea Team',
  table_of_contents jsonb not null default '[]',   -- string[]
  sections jsonb not null default '[]',              -- {heading: string, content: string}[]
  tags jsonb not null default '[]',                  -- string[]
  is_featured boolean not null default false,
  published boolean not null default true,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists blog_posts_published_idx on blog_posts (published, published_at desc);
create unique index if not exists blog_posts_one_featured on blog_posts (is_featured) where is_featured = true;

drop trigger if exists blog_posts_touch on blog_posts;
create trigger blog_posts_touch
before update on blog_posts
for each row execute function set_updated_at();

-- ============================================================
-- contact_submissions
-- ============================================================
create table if not exists contact_submissions (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  company_name text not null default '',
  email text not null,
  phone text not null,
  service_required text not null default '',
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists contact_submissions_created_idx on contact_submissions (created_at desc);

-- ============================================================
-- quote_submissions
-- Field set mirrors requestQuote.json's 3 field groups (quoteForm +
-- shipmentDetails + contactDetails). Promoted columns cover what the admin
-- list/detail view needs to show at a glance; `raw` keeps the full
-- submitted payload (every form field, keyed by its name attribute) so no
-- data is lost even if the JSON's field set drifts from these columns.
-- ============================================================
create table if not exists quote_submissions (
  id uuid primary key default gen_random_uuid(),
  service_type text not null default '',
  shipment_type text not null default '',
  origin_country text not null default '',
  destination_country text not null default '',
  full_name text not null,
  company_name text not null default '',
  email text not null,
  phone text not null,
  raw jsonb not null default '{}',
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists quote_submissions_created_idx on quote_submissions (created_at desc);

-- ============================================================
-- products — admin-managed catalog shown on /products (no pricing;
-- visitors submit a product_enquiries row instead of checking out)
-- ============================================================
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  category text not null default '',
  image_url text not null default '',
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_active_idx on products (is_active, sort_order, created_at desc);

drop trigger if exists products_touch on products;
create trigger products_touch
before update on products
for each row execute function set_updated_at();

-- ============================================================
-- product_enquiries
-- Submitted from the Enquiry modal on a product card. product_name is a
-- snapshot (kept even if the product is later renamed/deleted).
-- ============================================================
create table if not exists product_enquiries (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete set null,
  product_name text not null,
  full_name text not null,
  email text not null,
  phone text not null default '',
  message text not null default '',
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists product_enquiries_created_idx on product_enquiries (created_at desc);

-- Admin-entered quote for an enquiry (price/quantity/delivery date the
-- customer sees back on their profile once the admin has priced it out),
-- plus the approve/reject decision on the enquiry itself.
alter table product_enquiries add column if not exists quoted_price numeric;
alter table product_enquiries add column if not exists quoted_quantity text not null default '';
alter table product_enquiries add column if not exists quoted_weight_kg numeric;
alter table product_enquiries add column if not exists delivery_date date;
alter table product_enquiries add column if not exists quote_status text not null default 'awaiting_quote';
alter table product_enquiries add column if not exists rejection_reason text not null default '';

alter table product_enquiries drop constraint if exists product_enquiries_quote_status_check;
alter table product_enquiries add constraint product_enquiries_quote_status_check
  check (quote_status in ('awaiting_quote', 'quoted', 'rejected'));

-- request_type distinguishes an open "Enquiry" (anyone, no login) from an
-- "Order" (requires a signed-in, approved account). full_name is kept as a
-- snapshot but is now derived from the split first/last name fields.
alter table product_enquiries add column if not exists request_type text not null default 'enquiry';
alter table product_enquiries add column if not exists first_name text not null default '';
alter table product_enquiries add column if not exists last_name text not null default '';

alter table product_enquiries drop constraint if exists product_enquiries_request_type_check;
alter table product_enquiries add constraint product_enquiries_request_type_check
  check (request_type in ('enquiry', 'order'));

create index if not exists product_enquiries_request_type_idx on product_enquiries (request_type, created_at desc);

-- ============================================================
-- user_profiles — one row per Google-authenticated customer
-- (auth.users). Created on first login with a generated referral
-- code; the user then completes their details (status moves
-- incomplete -> pending) and an admin approves or rejects them.
-- Only approved users can submit quotes / product enquiries.
-- ============================================================
create table if not exists user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null default '',
  first_name text not null default '',
  last_name text not null default '',
  username text unique,                  -- lowercase slug; null until profile setup
  phone text not null default '',
  company_name text not null default '',
  country text not null default '',      -- customer's country, from profile setup
  passport_number text not null default '',
  passport_front_url text not null default '',
  passport_back_url text not null default '',
  referral_code text not null unique,    -- e.g. "AWS-7K39QD", generated at first login
  referred_by uuid references user_profiles(id) on delete set null,
  status text not null default 'incomplete'
    check (status in ('incomplete', 'pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- country added after the table existed on some deployments.
alter table user_profiles add column if not exists country text not null default '';

create index if not exists user_profiles_status_idx on user_profiles (status, created_at desc);
create index if not exists user_profiles_referred_by_idx on user_profiles (referred_by);

drop trigger if exists user_profiles_touch on user_profiles;
create trigger user_profiles_touch
before update on user_profiles
for each row execute function set_updated_at();

-- Link submissions to the signed-in account that made them (both forms
-- now require an approved account, but old rows keep user_id = null).
alter table quote_submissions add column if not exists user_id uuid references auth.users(id) on delete set null;
alter table product_enquiries add column if not exists user_id uuid references auth.users(id) on delete set null;

-- ============================================================
-- Shipment tracking — every quote request gets a tracking number at
-- submission time, so anyone (no login) can look up shipment progress
-- at /tracking?ref=... . shipment_status is the current stage shown at a
-- glance; shipment_milestones is the timeline an admin builds up under it.
-- ============================================================
alter table quote_submissions add column if not exists tracking_number text unique;
alter table quote_submissions add column if not exists shipment_status text not null default 'pending'
  check (shipment_status in ('pending', 'collected', 'customs_cleared', 'in_transit', 'delivered'));

create unique index if not exists quote_submissions_tracking_idx on quote_submissions (tracking_number);

create table if not exists shipment_milestones (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid not null references quote_submissions(id) on delete cascade,
  status text not null
    check (status in ('pending', 'collected', 'customs_cleared', 'in_transit', 'delivered')),
  location text not null default '',
  note text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists shipment_milestones_quote_idx on shipment_milestones (quote_id, created_at);

-- ============================================================
-- wallet_transactions — referral reward ledger. Admin grants a credit to
-- a referrer when a customer they referred gets a quote/enquiry approved.
-- Balance is derived by summing this table (no separate balance column,
-- so it can never drift from the history). A booking can be credited more
-- than once (e.g. a top-up bonus) — source_type + source_id is indexed
-- for lookups but not unique.
-- ============================================================
create table if not exists wallet_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references user_profiles(id) on delete cascade,
  amount numeric not null check (amount > 0),
  reason text not null default '',
  source_type text not null check (source_type in ('quote', 'enquiry')),
  source_id uuid not null,
  referred_user_id uuid references user_profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists wallet_transactions_user_idx on wallet_transactions (user_id, created_at desc);
drop index if exists wallet_transactions_source_idx;
create index if not exists wallet_transactions_source_lookup_idx on wallet_transactions (source_type, source_id);

-- Bank details for wallet withdrawals — same pattern as passport fields:
-- plain columns on user_profiles, editable any time from the wallet page.
alter table user_profiles add column if not exists bank_account_number text not null default '';
alter table user_profiles add column if not exists bank_account_holder text not null default '';
alter table user_profiles add column if not exists bank_name text not null default '';
alter table user_profiles add column if not exists bank_ifsc text not null default '';

-- ============================================================
-- wallet_withdrawals — a payout request against wallet_transactions credit.
-- Bank fields are snapshotted at request time (like product_enquiries'
-- product_name snapshot) so a later bank-detail edit never changes a
-- pending/historical request. Pending amounts are locked out of the
-- spendable balance (see getWalletSummary in src/lib/wallet.ts); paid
-- permanently deducts, rejected releases the lock back to available.
-- ============================================================
create table if not exists wallet_withdrawals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references user_profiles(id) on delete cascade,
  amount numeric not null check (amount > 0),
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'rejected')),
  bank_account_number text not null default '',
  bank_account_holder text not null default '',
  bank_name text not null default '',
  bank_ifsc text not null default '',
  rejection_reason text not null default '',
  created_at timestamptz not null default now(),
  decided_at timestamptz
);

create index if not exists wallet_withdrawals_user_idx on wallet_withdrawals (user_id, created_at desc);
create index if not exists wallet_withdrawals_status_idx on wallet_withdrawals (status, created_at desc);

-- ============================================================
-- Row Level Security
-- ============================================================
alter table site_settings enable row level security;
alter table blog_posts enable row level security;
alter table contact_submissions enable row level security;
alter table quote_submissions enable row level security;
alter table products enable row level security;
alter table product_enquiries enable row level security;
alter table user_profiles enable row level security;
alter table shipment_milestones enable row level security;
alter table wallet_transactions enable row level security;
alter table wallet_withdrawals enable row level security;

-- user_profiles: no public policies — all reads/writes go through the
-- service-role client in Server Actions (passport data must never be
-- readable with the anon key).

-- products: public can read only active products (catalog page). All
-- writes happen via the service-role client from Server Actions.
drop policy if exists "public read active products" on products;
create policy "public read active products" on products
  for select using (is_active = true);

-- product_enquiries: no public policies — inserts go through a Server
-- Action using the service-role client (same pattern as quote_submissions).

-- site_settings: public can read (footer/contact page need it), no public writes.
drop policy if exists "public read site_settings" on site_settings;
create policy "public read site_settings" on site_settings
  for select using (true);

-- blog_posts: public can read only published posts. All writes happen via the
-- service-role client from Server Actions, which bypasses RLS entirely, so no
-- insert/update/delete policy is defined for anon/authenticated roles here.
drop policy if exists "public read published posts" on blog_posts;
create policy "public read published posts" on blog_posts
  for select using (published = true);

-- contact_submissions / quote_submissions / shipment_milestones: no public
-- policies at all. Inserts, admin reads, and the public tracking lookup all
-- go through the service-role client (Server Actions), which bypasses RLS —
-- the anon key gets zero access. The tracking lookup is safe to expose
-- without RLS because it's scoped to an exact tracking_number match, not a
-- broad select.

-- wallet_transactions / wallet_withdrawals: no public policies — admin
-- grants credits and reviews payouts, and the customer's own balance/
-- history/requests are all read or written via the service-role client
-- (same pattern as user_profiles).
