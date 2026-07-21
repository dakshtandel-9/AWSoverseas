-- ============================================================
-- Shipment tracking → add a "verifying" stage before "pending pickup".
-- New quote requests now start at shipment_status = 'verifying' until
-- an admin confirms the request. Existing rows are untouched.
-- Run this in the Supabase SQL editor (service-role). Idempotent.
-- ============================================================

alter table quote_submissions alter column shipment_status set default 'verifying';

alter table quote_submissions drop constraint if exists quote_submissions_shipment_status_check;
alter table quote_submissions add constraint quote_submissions_shipment_status_check
  check (shipment_status in ('verifying', 'pending', 'collected', 'customs_cleared', 'in_transit', 'delivered', 'rejected'));

alter table shipment_milestones drop constraint if exists shipment_milestones_status_check;
alter table shipment_milestones add constraint shipment_milestones_status_check
  check (status in ('verifying', 'pending', 'collected', 'customs_cleared', 'in_transit', 'delivered', 'rejected'));
