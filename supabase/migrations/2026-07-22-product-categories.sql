-- Product categories — /products now shows a category grid; clicking one
-- goes to /products/[slug] listing that category's products. Replaces the
-- old free-text products.category string with a real, admin-managed table
-- (name, slug, description, image) so categories can have their own hero.
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  image_url text not null default '',
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists categories_active_idx on categories (is_active, sort_order, created_at desc);

drop trigger if exists categories_touch on categories;
create trigger categories_touch
before update on categories
for each row execute function set_updated_at();

alter table products add column if not exists category_id uuid references categories(id) on delete set null;

create index if not exists products_category_idx on products (category_id, sort_order, created_at desc);

-- Backfill: one category row per distinct existing products.category value,
-- then point each product at its new category. Old text column is left in
-- place (unused by the app going forward) so no data is lost.
insert into categories (name, slug)
select distinct
  trim(p.category),
  lower(regexp_replace(trim(p.category), '[^a-zA-Z0-9]+', '-', 'g'))
from products p
where trim(p.category) <> ''
on conflict (slug) do nothing;

update products p
set category_id = c.id
from categories c
where p.category_id is null
  and trim(p.category) <> ''
  and c.slug = lower(regexp_replace(trim(p.category), '[^a-zA-Z0-9]+', '-', 'g'));

alter table categories enable row level security;

drop policy if exists "public read active categories" on categories;
create policy "public read active categories" on categories
  for select using (is_active = true);
