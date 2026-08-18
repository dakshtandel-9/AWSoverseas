-- Maintenance mode: a single switch on the settings singleton that swaps the
-- whole public site for the maintenance page. /admin stays reachable so the
-- switch can be turned back off, and so the site can be worked on while it's up.

alter table site_settings add column if not exists maintenance_mode boolean not null default false;
