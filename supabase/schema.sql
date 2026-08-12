-- AWSoversea admin backend schema
-- Run this once in the Supabase SQL Editor (Project -> SQL Editor -> New query).

-- ============================================================
-- site_settings — singleton row (id enforced to always be 1)
-- ============================================================
create table if not exists site_settings (
  id integer primary key default 1 check (id = 1),
  -- Up to 5 phone numbers/emails shown in the footer and Contact page; blank = unused slot.
  phone_1 text not null default '',
  phone_2 text not null default '',
  phone_3 text not null default '',
  phone_4 text not null default '',
  phone_5 text not null default '',
  email text not null default '',
  email_2 text not null default '',
  email_3 text not null default '',
  email_4 text not null default '',
  email_5 text not null default '',
  whatsapp_number text not null default '', -- digits only, e.g. "919876543210"
  address text not null default '',
  -- Admin-editable button colors: navy (nav/form CTAs) and maroon (hero/section CTAs), each with a hover shade.
  btn_navy text not null default '#02224C',
  btn_navy_hover text not null default '#011a38',
  btn_maroon text not null default '#902d39',
  btn_maroon_hover text not null default '#861b28',
  -- Admin-editable maroon text color (headline gradients, icons, links).
  text_maroon text not null default '#9e4953',
  updated_at timestamptz not null default now()
);

insert into site_settings (id)
values (1)
on conflict (id) do nothing;

-- Button/text color columns added after the table existed on some deployments.
alter table site_settings add column if not exists btn_navy text not null default '#02224C';
alter table site_settings add column if not exists btn_navy_hover text not null default '#011a38';
alter table site_settings add column if not exists btn_maroon text not null default '#902d39';
alter table site_settings add column if not exists btn_maroon_hover text not null default '#861b28';
alter table site_settings add column if not exists text_maroon text not null default '#9e4953';

-- Extra phone/email slots (footer previously showed exactly 2 phones + 1 email).
alter table site_settings add column if not exists phone_3 text not null default '';
alter table site_settings add column if not exists phone_4 text not null default '';
alter table site_settings add column if not exists phone_5 text not null default '';
alter table site_settings add column if not exists email_2 text not null default '';
alter table site_settings add column if not exists email_3 text not null default '';
alter table site_settings add column if not exists email_4 text not null default '';
alter table site_settings add column if not exists email_5 text not null default '';

alter table site_settings drop column if exists contact_label;
alter table site_settings drop column if exists footer_contacts;

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
-- newsletter_subscribers
-- Captures emails from the footer newsletter form.
-- ============================================================
create table if not exists newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

create index if not exists newsletter_subscribers_created_idx on newsletter_subscribers (created_at desc);

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
-- warehouse_bookings
-- Captures the "Book a Warehouse" popup on the /quote page — a separate ask
-- from the shipment waybill on that same page, open to guests and signed-in
-- customers alike.
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
-- categories — /products shows a grid of top-level categories; clicking one
-- opens /products/[slug], which lists either its subcategories or its
-- products. Categories nest to any depth via parent_id, and a category holds
-- subcategories OR products, never both (see the triggers below). Replaces
-- the free-text products.category column (kept, unused, for backfill history)
-- with a real FK.
-- ============================================================
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  image_url text not null default '',
  parent_id uuid references categories(id) on delete cascade,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Pre-existing installs predate the tree.
alter table categories
  add column if not exists parent_id uuid references categories(id) on delete cascade;

-- How this category lays out the subcategories inside it (see the
-- 2026-07-31-category-child-layout migration for the backfill):
--   'inline' — each subcategory's products are listed on this category's page.
--   'cards'  — each subcategory gets a card that opens its own page.
-- Only applies to subcategories that hold products; one that holds its own
-- subcategories always gets a card, since there is no product grid to open out.
alter table categories
  add column if not exists child_layout text not null default 'inline';

alter table categories drop constraint if exists categories_child_layout_check;
alter table categories add constraint categories_child_layout_check
  check (child_layout in ('cards', 'inline'));

create index if not exists categories_active_idx on categories (is_active, sort_order, created_at desc);

create index if not exists categories_parent_idx on categories (parent_id, sort_order, created_at desc);

drop trigger if exists categories_touch on categories;
create trigger categories_touch
before update on categories
for each row execute function set_updated_at();

alter table products add column if not exists category_id uuid references categories(id) on delete set null;

create index if not exists products_category_idx on products (category_id, sort_order, created_at desc);

-- Branch-or-leaf rule, enforced in the database so it holds no matter which
-- code path writes. Two triggers because the rule spans two tables: a category
-- row is only invalid relative to the products pointing at it, and vice versa.

-- Refuse a product whose category already has subcategories.
create or replace function assert_category_is_leaf()
returns trigger
language plpgsql
as $$
begin
  if new.category_id is null then
    return new;
  end if;

  if exists (select 1 from categories where parent_id = new.category_id) then
    raise exception 'category_has_subcategories'
      using hint = 'Products belong in the deepest subcategory, not a category that holds other categories.';
  end if;

  return new;
end;
$$;

drop trigger if exists products_category_is_leaf on products;
create trigger products_category_is_leaf
before insert or update of category_id on products
for each row execute function assert_category_is_leaf();

-- Refuse a subcategory whose parent already holds products, and refuse a
-- parent chain that would cycle.
create or replace function assert_parent_is_branch()
returns trigger
language plpgsql
as $$
declare
  cursor_id uuid;
  hops integer := 0;
begin
  if new.parent_id is null then
    return new;
  end if;

  if new.parent_id = new.id then
    raise exception 'category_cycle' using hint = 'A category cannot be its own parent.';
  end if;

  if exists (select 1 from products where category_id = new.parent_id) then
    raise exception 'parent_has_products'
      using hint = 'Move or remove the products in that category before adding subcategories to it.';
  end if;

  cursor_id := new.parent_id;
  while cursor_id is not null and hops < 100 loop
    if cursor_id = new.id then
      raise exception 'category_cycle'
        using hint = 'That would put the category inside one of its own subcategories.';
    end if;
    select parent_id into cursor_id from categories where id = cursor_id;
    hops := hops + 1;
  end loop;

  return new;
end;
$$;

drop trigger if exists categories_parent_is_branch on categories;
create trigger categories_parent_is_branch
before insert or update of parent_id on categories
for each row execute function assert_parent_is_branch();

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

-- Optional image attachment (e.g. a reference photo) uploaded with the enquiry.
alter table product_enquiries add column if not exists attachment_url text not null default '';

-- Optional free-text quantity/quality note. Used by the standalone "Request a
-- Product" page (/request-product), where a visitor names something that may
-- not exist in the catalog at all — product_id stays null for these rows.
alter table product_enquiries add column if not exists requested_quantity text not null default '';

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
  referral_code text not null unique,    -- e.g. "DKSH47", generated at first login
  referred_by uuid references user_profiles(id) on delete set null,
  status text not null default 'incomplete'
    check (status in ('incomplete', 'pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- country added after the table existed on some deployments.
alter table user_profiles add column if not exists country text not null default '';

-- Identity verification generalized beyond passport: Indian customers verify
-- with Aadhaar or PAN instead (no passport in daily use for domestic trade).
-- id_type picks the document; id_number/id_front_url/id_back_url replace the
-- old passport-only columns and hold whichever document applies. Existing
-- rows backfill as id_type 'passport' from their passport_* data so no
-- verification history is lost.
alter table user_profiles add column if not exists id_type text not null default 'passport';
alter table user_profiles add column if not exists id_number text not null default '';
alter table user_profiles add column if not exists id_front_url text not null default '';
alter table user_profiles add column if not exists id_back_url text not null default '';

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_name = 'user_profiles' and column_name = 'passport_number'
  ) then
    update user_profiles
    set id_type = 'passport',
        id_number = passport_number,
        id_front_url = passport_front_url,
        id_back_url = passport_back_url
    where id_number = '' and passport_number <> '';
  end if;
end $$;

alter table user_profiles drop constraint if exists user_profiles_id_type_check;
alter table user_profiles add constraint user_profiles_id_type_check
  check (id_type in ('passport', 'aadhaar', 'pan'));

alter table user_profiles drop column if exists passport_number;
alter table user_profiles drop column if exists passport_front_url;
alter table user_profiles drop column if exists passport_back_url;

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
alter table quote_submissions add column if not exists shipment_status text not null default 'verifying';

alter table quote_submissions drop constraint if exists quote_submissions_shipment_status_check;
alter table quote_submissions add constraint quote_submissions_shipment_status_check
  check (shipment_status in ('verifying', 'pending', 'collected', 'customs_cleared', 'in_transit', 'delivered', 'rejected'));

create unique index if not exists quote_submissions_tracking_idx on quote_submissions (tracking_number);

-- Trade direction — /quote carries an Export/Import toggle, and origin_country
-- / destination_country hold whichever side of the route applies: export is
-- Indian state → foreign country, import is foreign country → Indian state.
-- Rows created before the toggle were all outbound, hence the 'export' default.
alter table quote_submissions add column if not exists direction text not null default 'export';

alter table quote_submissions drop constraint if exists quote_submissions_direction_check;
alter table quote_submissions add constraint quote_submissions_direction_check
  check (direction in ('export', 'import'));

-- Optional shipment photo uploaded with the quote request (same pattern as
-- product_enquiries.attachment_url).
alter table quote_submissions add column if not exists attachment_url text not null default '';

create table if not exists shipment_milestones (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid not null references quote_submissions(id) on delete cascade,
  status text not null,
  location text not null default '',
  note text not null default '',
  created_at timestamptz not null default now()
);

alter table shipment_milestones drop constraint if exists shipment_milestones_status_check;
alter table shipment_milestones add constraint shipment_milestones_status_check
  check (status in ('verifying', 'pending', 'collected', 'customs_cleared', 'in_transit', 'delivered', 'rejected'));

create index if not exists shipment_milestones_quote_idx on shipment_milestones (quote_id, created_at);

-- ============================================================
-- wallet_transactions — reward ledger. Admin grants a credit to
-- a referrer when a customer they referred gets a quote/enquiry approved,
-- and every new account is credited a one-time 'signup' welcome bonus.
-- Balance is derived by summing this table (no separate balance column,
-- so it can never drift from the history). A booking can be credited more
-- than once (e.g. a top-up bonus) — source_type + source_id is indexed
-- for lookups but not unique. A signup bonus has no booking behind it, so
-- its source_id is null and a partial unique index caps it at one per user.
--
-- An 'adjustment' row is a manual admin correction from /admin/wallets,
-- not tied to any booking. It is the only kind that may carry a negative
-- amount: deducting money writes a negative row rather than editing or
-- deleting earlier rows, so the history stays append-only and auditable.
-- ============================================================
create table if not exists wallet_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references user_profiles(id) on delete cascade,
  amount numeric not null,
  reason text not null default '',
  source_type text not null,
  source_id uuid,
  referred_user_id uuid references user_profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

-- Pre-existing installs predate the signup bonus.
alter table wallet_transactions alter column source_id drop not null;

alter table wallet_transactions drop constraint if exists wallet_transactions_source_type_check;
alter table wallet_transactions add constraint wallet_transactions_source_type_check
  check (source_type in ('quote', 'enquiry', 'signup', 'adjustment'));

-- Booking credits still require a source; signup and adjustment rows never
-- have one.
alter table wallet_transactions drop constraint if exists wallet_transactions_source_id_check;
alter table wallet_transactions add constraint wallet_transactions_source_id_check
  check ((source_type in ('signup', 'adjustment')) = (source_id is null));

-- Pre-existing installs have the original inline `check (amount > 0)`, which
-- would reject a deduction. Postgres auto-named that constraint
-- wallet_transactions_amount_check, so dropping that exact name removes it on
-- an old install and is a harmless no-op on a fresh one. It is replaced with a
-- rule that allows a negative amount only on an admin adjustment, and never
-- allows zero.
alter table wallet_transactions drop constraint if exists wallet_transactions_amount_check;
alter table wallet_transactions add constraint wallet_transactions_amount_check
  check (amount <> 0 and (amount > 0 or source_type = 'adjustment'));

create index if not exists wallet_transactions_user_idx on wallet_transactions (user_id, created_at desc);
drop index if exists wallet_transactions_source_idx;
create index if not exists wallet_transactions_source_lookup_idx on wallet_transactions (source_type, source_id);

create unique index if not exists wallet_transactions_signup_once_idx
  on wallet_transactions (user_id)
  where source_type = 'signup';

-- Wallet credit has no payout path — there is no withdrawal/cash-out flow, so
-- user_profiles holds no bank details (see the
-- 2026-07-26-remove-wallet-withdrawals migration, which dropped both the
-- wallet_withdrawals table and those columns).

-- ============================================================
-- marketing_integrations — singleton row (id enforced to always be 1).
-- Tracking/verification IDs the admin pastes in at /admin/integrations;
-- the public root layout reads them to inject analytics scripts and
-- search-engine verification meta tags.
-- ============================================================
create table if not exists marketing_integrations (
  id integer primary key default 1 check (id = 1),
  ga4_measurement_id text not null default '',          -- Google Analytics 4, "G-XXXXXXXXXX"
  gtm_container_id text not null default '',            -- Google Tag Manager, "GTM-XXXXXXX"
  google_site_verification text not null default '',    -- Search Console HTML-tag content value
  bing_site_verification text not null default '',      -- Bing "msvalidate.01" content value
  clarity_project_id text not null default '',          -- Microsoft Clarity project ID
  meta_pixel_id text not null default '',               -- Meta Pixel / dataset ID (numeric)
  google_ads_id text not null default '',               -- Google Ads conversion ID, "AW-XXXXXXXXX"
  google_ads_conversion_label text not null default '', -- Google Ads conversion label (after the slash)
  updated_at timestamptz not null default now()
);

insert into marketing_integrations (id)
values (1)
on conflict (id) do nothing;

drop trigger if exists marketing_integrations_touch on marketing_integrations;
create trigger marketing_integrations_touch
before update on marketing_integrations
for each row execute function set_updated_at();

-- ============================================================
-- office_groups / office_locations — the office directory on the Contact page
-- ============================================================
-- A group is a heading like "India Offices"; every office card belongs to one.
-- Both are admin-managed at /admin/offices, so the page is not limited to the
-- two groups seeded below. See the 2026-07-31-office-locations migration.
create table if not exists office_groups (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists office_locations (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references office_groups(id) on delete cascade,
  name text not null,
  address text not null default '',
  -- Two numbers per office: the main line and an alternative. Either can be blank.
  phone_1 text not null default '',
  phone_2 text not null default '',
  email text not null default '',
  -- Optional Google Maps link behind the card's "View on map".
  map_url text not null default '',
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists office_groups_active_idx
  on office_groups (is_active, sort_order, created_at);

create index if not exists office_locations_group_idx
  on office_locations (group_id, sort_order, created_at);

drop trigger if exists office_groups_touch on office_groups;
create trigger office_groups_touch
before update on office_groups
for each row execute function set_updated_at();

drop trigger if exists office_locations_touch on office_locations;
create trigger office_locations_touch
before update on office_locations
for each row execute function set_updated_at();

-- Starting structure only; both groups start empty, and an empty group is
-- hidden on the public page.
insert into office_groups (title, description, sort_order)
select 'India Offices', 'Our offices across India.', 1
where not exists (select 1 from office_groups);

insert into office_groups (title, description, sort_order)
select 'International Offices', 'Where we operate outside India.', 2
where not exists (select 1 from office_groups where sort_order = 2);

-- ============================================================
-- footer_contacts — the footer's contact band, below the nav links and
-- above the copyright line. Admin-managed at /admin/footer-contacts as a
-- flat, open-ended list (unlike the office directory, no groups): add as
-- many as needed and the footer wraps them into rows, 4 per row on desktop.
-- ============================================================
create table if not exists footer_contacts (
  id uuid primary key default gen_random_uuid(),
  headline text not null default '',
  address text not null default '',
  phone text not null default '',
  email text not null default '',
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists footer_contacts_active_idx
  on footer_contacts (is_active, sort_order, created_at);

drop trigger if exists footer_contacts_touch on footer_contacts;
create trigger footer_contacts_touch
before update on footer_contacts
for each row execute function set_updated_at();

-- ============================================================
-- city_agents — the city photo tiles on the Contact page, below the
-- enquiry form. Distinct from office_locations: a flat, image-led list
-- (not grouped), admin-managed at /admin/city-agents, and each tile is
-- individually shareable via /contact?agent=<id>. See the
-- 2026-08-05-city-agents-table migration.
-- ============================================================
create table if not exists city_agents (
  id uuid primary key default gen_random_uuid(),
  city text not null,
  image_url text not null default '',
  agent_name text not null default '',
  address text not null default '',
  phone text not null default '',
  email text not null default '',
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists city_agents_active_idx
  on city_agents (is_active, sort_order, created_at);

drop trigger if exists city_agents_touch on city_agents;
create trigger city_agents_touch
before update on city_agents
for each row execute function set_updated_at();

-- ============================================================
-- Row Level Security
-- ============================================================
alter table site_settings enable row level security;
alter table contact_submissions enable row level security;
alter table newsletter_subscribers enable row level security;
alter table quote_submissions enable row level security;
alter table warehouse_bookings enable row level security;
alter table products enable row level security;
alter table categories enable row level security;
alter table product_enquiries enable row level security;
alter table user_profiles enable row level security;
alter table shipment_milestones enable row level security;
alter table wallet_transactions enable row level security;

-- user_profiles: no public policies — all reads/writes go through the
-- service-role client in Server Actions (passport data must never be
-- readable with the anon key).

-- products: public can read only active products (catalog page). All
-- writes happen via the service-role client from Server Actions.
drop policy if exists "public read active products" on products;
create policy "public read active products" on products
  for select using (is_active = true);

-- categories: public can read only active categories (/products grid and
-- /products/[slug]). All writes happen via the service-role client.
drop policy if exists "public read active categories" on categories;
create policy "public read active categories" on categories
  for select using (is_active = true);

-- product_enquiries: no public policies — inserts go through a Server
-- Action using the service-role client (same pattern as quote_submissions).

-- site_settings: public can read (footer/contact page need it), no public writes.
drop policy if exists "public read site_settings" on site_settings;
create policy "public read site_settings" on site_settings
  for select using (true);

-- office_groups / office_locations: public can read the active rows (the
-- Contact page office directory). All writes go through the service-role
-- client from Server Actions.
alter table office_groups enable row level security;
alter table office_locations enable row level security;

drop policy if exists "public read active office_groups" on office_groups;
create policy "public read active office_groups" on office_groups
  for select using (is_active = true);

drop policy if exists "public read active office_locations" on office_locations;
create policy "public read active office_locations" on office_locations
  for select using (is_active = true);

-- footer_contacts: public can read the active rows (the footer's contact
-- band). All writes go through the service-role client from Server Actions.
alter table footer_contacts enable row level security;
drop policy if exists "public read active footer_contacts" on footer_contacts;
create policy "public read active footer_contacts" on footer_contacts
  for select using (is_active = true);

-- city_agents: public can read the active rows (the Contact page's city
-- tiles). All writes go through the service-role client from Server Actions.
alter table city_agents enable row level security;
drop policy if exists "public read active city_agents" on city_agents;
create policy "public read active city_agents" on city_agents
  for select using (is_active = true);

-- marketing_integrations: public can read — every ID here is injected into the
-- public site's HTML anyway, so none are secrets. No public writes.
alter table marketing_integrations enable row level security;
drop policy if exists "public read marketing_integrations" on marketing_integrations;
create policy "public read marketing_integrations" on marketing_integrations
  for select using (true);

-- contact_submissions / newsletter_subscribers / quote_submissions /
-- warehouse_bookings / shipment_milestones: no public policies at all. Inserts, admin reads, and the public tracking lookup all
-- go through the service-role client (Server Actions), which bypasses RLS —
-- the anon key gets zero access. The tracking lookup is safe to expose
-- without RLS because it's scoped to an exact tracking_number match, not a
-- broad select.

-- wallet_transactions: no public policies — admin grants or adjusts credit,
-- and the customer's own balance/history is read via the service-role client
-- (same pattern as user_profiles).
