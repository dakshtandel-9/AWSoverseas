-- Footer contact band, below the nav links and above the copyright line —
-- an open-ended list (not a fixed 4), admin-managed at /admin/footer-contacts.
-- Distinct from the Contact page's office directory (office_groups/
-- office_locations): a flat list, no groups, and its own admin page rather
-- than living inside Site Settings.
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

alter table footer_contacts enable row level security;
drop policy if exists "public read active footer_contacts" on footer_contacts;
create policy "public read active footer_contacts" on footer_contacts
  for select using (is_active = true);
