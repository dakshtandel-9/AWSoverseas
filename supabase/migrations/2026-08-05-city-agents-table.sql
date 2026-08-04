-- City agent directory shown on the Contact page, below the enquiry form —
-- one photo tile per city; clicking it opens the agent's contact details.
-- Distinct from office_locations (the grouped office directory further down
-- the page): this is a flat, image-led list, admin-managed at
-- /admin/city-agents, and each tile is individually shareable via
-- /contact?agent=<id>.
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

alter table city_agents enable row level security;
drop policy if exists "public read active city_agents" on city_agents;
create policy "public read active city_agents" on city_agents
  for select using (is_active = true);
