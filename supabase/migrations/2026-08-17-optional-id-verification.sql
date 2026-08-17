-- ID verification is no longer required to finish signing up: a customer can
-- save their details and upload their documents later from /profile.
--
-- 'unverified' is that in-between state — contact details on file, no ID
-- documents yet. It's deliberately separate from 'pending' (documents
-- submitted, sitting in the admin review queue, nothing for the customer to
-- do) and from 'incomplete' (nothing submitted at all, which still bounces
-- the user back to /profile/setup and expires their session early).
-- Unverified accounts stay gated from quoting, exactly like pending ones.

alter table user_profiles drop constraint if exists user_profiles_status_check;
alter table user_profiles add constraint user_profiles_status_check
  check (status in ('incomplete', 'unverified', 'pending', 'approved', 'rejected'));
