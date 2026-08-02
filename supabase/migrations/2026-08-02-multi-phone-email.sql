-- The footer and Contact page previously showed exactly 2 phone numbers and
-- 1 email. Admin can now list up to 5 of each; the existing "email" column
-- stays as the first email slot (no rename, so existing data is untouched).
alter table site_settings
  add column if not exists phone_3 text not null default '',
  add column if not exists phone_4 text not null default '',
  add column if not exists phone_5 text not null default '',
  add column if not exists email_2 text not null default '',
  add column if not exists email_3 text not null default '',
  add column if not exists email_4 text not null default '',
  add column if not exists email_5 text not null default '';
