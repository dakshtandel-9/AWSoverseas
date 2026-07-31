-- The footer's extra "contact columns" feature (Settings > Footer contact
-- columns) is removed — the footer only ever shows the one site-wide
-- phone/email/address now, and multi-office listings live in the Contact
-- page's office directory instead (see 2026-07-31-office-locations.sql).

alter table site_settings drop column if exists contact_label;
alter table site_settings drop column if exists footer_contacts;
