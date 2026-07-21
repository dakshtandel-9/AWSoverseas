-- Admin-editable button colors: navy (primary CTA) and maroon (secondary/main CTA) fills + hover shades.
-- Also an admin-editable maroon text color, used for headline gradients/icons/links site-wide.
-- Defaults match the existing hardcoded values so nothing changes visually until an admin edits them.
alter table site_settings
  add column if not exists btn_navy text not null default '#02224C',
  add column if not exists btn_navy_hover text not null default '#011a38',
  add column if not exists btn_maroon text not null default '#902d39',
  add column if not exists btn_maroon_hover text not null default '#861b28',
  add column if not exists text_maroon text not null default '#9e4953';
