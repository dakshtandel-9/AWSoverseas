-- ============================================================
-- Quote requests → cover both trade directions.
-- /quote used to be export-only: origin was always an Indian state and
-- destination always a foreign country. It now carries an Export/Import
-- toggle, and import flips that pair (foreign origin → Indian state).
-- origin_country / destination_country already hold whichever side of the
-- route applies, so only the direction itself is new.
-- Every existing row predates the toggle and was an outbound shipment, so
-- backfilling them as 'export' is accurate, not just a convenient default.
-- Run this in the Supabase SQL editor (service-role). Idempotent.
-- ============================================================

alter table quote_submissions add column if not exists direction text not null default 'export';

alter table quote_submissions drop constraint if exists quote_submissions_direction_check;
alter table quote_submissions add constraint quote_submissions_direction_check
  check (direction in ('export', 'import'));
