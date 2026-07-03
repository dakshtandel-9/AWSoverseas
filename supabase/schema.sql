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
-- Row Level Security
-- ============================================================
alter table site_settings enable row level security;
alter table blog_posts enable row level security;
alter table contact_submissions enable row level security;
alter table quote_submissions enable row level security;

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

-- contact_submissions / quote_submissions: no public policies at all.
-- Inserts and admin reads both go through the service-role client
-- (Server Actions), which bypasses RLS — the anon key gets zero access.
