-- ============================================================
-- Removes the wallet withdrawal (cash-out) feature. Customers keep a
-- referral/signup wallet balance, but there is no longer any path to pay it
-- out, so the payout request table and the bank details it snapshotted are
-- both gone. Wallet balance is now simply the sum of wallet_transactions.
--
-- DESTRUCTIVE and one-way: dropping wallet_withdrawals discards every past
-- payout request (including 'paid' rows — the record of money already sent),
-- and dropping the user_profiles bank columns discards saved bank details.
-- Export both first if you need that history:
--   select * from wallet_withdrawals;
--   select id, email, bank_account_holder, bank_account_number, bank_name,
--          bank_ifsc from user_profiles where bank_account_number <> '';
--
-- Run this in the Supabase SQL editor (service-role). Idempotent.
-- ============================================================

drop table if exists wallet_withdrawals;

alter table user_profiles drop column if exists bank_account_number;
alter table user_profiles drop column if exists bank_account_holder;
alter table user_profiles drop column if exists bank_name;
alter table user_profiles drop column if exists bank_ifsc;
