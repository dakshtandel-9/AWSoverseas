-- ============================================================
-- Wallet → signup bonus. Every new account is credited a one-time
-- welcome bonus, which is a wallet credit with no booking behind it:
-- source_type gains 'signup' and source_id becomes nullable.
-- A partial unique index makes the grant idempotent — a user can hold
-- at most one signup row no matter how many times the profile-creation
-- path runs concurrently.
-- Run this in the Supabase SQL editor (service-role). Idempotent.
-- ============================================================

alter table wallet_transactions alter column source_id drop not null;

alter table wallet_transactions drop constraint if exists wallet_transactions_source_type_check;
alter table wallet_transactions add constraint wallet_transactions_source_type_check
  check (source_type in ('quote', 'enquiry', 'signup'));

-- Booking credits still require a source; signup credits never have one.
alter table wallet_transactions drop constraint if exists wallet_transactions_source_id_check;
alter table wallet_transactions add constraint wallet_transactions_source_id_check
  check ((source_type = 'signup') = (source_id is null));

create unique index if not exists wallet_transactions_signup_once_idx
  on wallet_transactions (user_id)
  where source_type = 'signup';
