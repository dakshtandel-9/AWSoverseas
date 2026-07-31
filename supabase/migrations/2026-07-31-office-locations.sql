-- Office locations shown on the Contact page, below the enquiry form.
--
-- Two tables so the admin controls both the headings and the offices under
-- them: a group is a heading like "India Offices" or "International Offices",
-- and every office card belongs to exactly one group. The admin can add,
-- rename, reorder and remove groups, so the page is not limited to the two
-- seeded here.

create table if not exists office_groups (
  id uuid primary key default gen_random_uuid(),
  -- Heading above the row of office cards, e.g. "India Offices".
  title text not null,
  -- Optional line under the heading. Blank hides it.
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

-- Starting structure for the admin page. Both start empty of offices, so the
-- public section stays hidden until the first office is added.
insert into office_groups (title, description, sort_order)
select 'India Offices', 'Our offices across India.', 1
where not exists (select 1 from office_groups);

insert into office_groups (title, description, sort_order)
select 'International Offices', 'Where we operate outside India.', 2
where not exists (select 1 from office_groups where sort_order = 2);

-- Public reads the active rows for the Contact page; every write goes through
-- the service-role client in a Server Action.
alter table office_groups enable row level security;
alter table office_locations enable row level security;

drop policy if exists "public read active office_groups" on office_groups;
create policy "public read active office_groups" on office_groups
  for select using (is_active = true);

drop policy if exists "public read active office_locations" on office_locations;
create policy "public read active office_locations" on office_locations
  for select using (is_active = true);
