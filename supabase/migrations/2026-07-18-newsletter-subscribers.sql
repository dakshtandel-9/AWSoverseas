-- ============================================================
-- newsletter_subscribers
-- Captures emails from the footer newsletter form (and any other
-- NewsletterForm instance on the site). Inserts go through the
-- service-role client from a Server Action, same pattern as
-- contact_submissions — no public RLS policy needed.
-- ============================================================
create table if not exists newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

create index if not exists newsletter_subscribers_created_idx on newsletter_subscribers (created_at desc);

alter table newsletter_subscribers enable row level security;

-- No public policies — all inserts and admin reads go through the
-- service-role client in Server Actions, which bypasses RLS.
