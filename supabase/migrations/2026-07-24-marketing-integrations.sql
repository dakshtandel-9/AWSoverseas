-- marketing_integrations — singleton row (id enforced to always be 1), same
-- pattern as site_settings. Stores the tracking/verification IDs the admin
-- pastes in at /admin/integrations; the public root layout reads them to
-- inject analytics scripts and search-engine verification meta tags.
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

alter table marketing_integrations enable row level security;

-- Public read: every one of these IDs is injected into the public site's HTML
-- anyway, so none of them are secrets. Writes go through the service-role
-- client in Server Actions only.
drop policy if exists "public read marketing_integrations" on marketing_integrations;
create policy "public read marketing_integrations" on marketing_integrations
  for select using (true);
