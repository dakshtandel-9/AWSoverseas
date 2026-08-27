-- sent_emails — the record of every email written by hand at /admin/email and
-- handed to Resend. Transactional mail (welcome, approval, enquiry receipts)
-- is not logged here: it's sent by the code, not by a person, and the Resend
-- dashboard already holds it.
--
-- Failures are rows too, with status 'failed' and the reason in `error`. A
-- send that was refused is exactly the thing an operator needs to find later,
-- so it must not vanish from the list.
create table if not exists sent_emails (
  id uuid primary key default gen_random_uuid(),
  -- The From address as picked in the panel, e.g. sales@awsoverseas.com.
  from_address text not null default '',
  to_addresses text[] not null default '{}',
  cc_addresses text[] not null default '{}',
  bcc_addresses text[] not null default '{}',
  reply_to text not null default '',
  subject text not null default '',
  -- Exactly what was typed, so the message can be reread or resent by hand.
  body text not null default '',
  -- True when the message went out in the masthead/banner shell.
  branded boolean not null default true,
  status text not null default 'sent' check (status in ('sent', 'failed')),
  -- Resend's own id, the handle for finding the message in their dashboard.
  provider_id text not null default '',
  error text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists sent_emails_created_idx on sent_emails (created_at desc);

-- No policy is defined on purpose: this table holds BCC lists and message
-- bodies, and nothing on the public site should ever read it. The panel goes
-- through the service-role client, which bypasses RLS.
alter table sent_emails enable row level security;
