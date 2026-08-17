#!/usr/bin/env node
/**
 * One-off: writes the client's real tracking and verification IDs into the
 * singleton `marketing_integrations` row — the same row /admin/integrations
 * edits and the root layout reads. Google Ads and Meta Pixel columns are
 * left untouched (no account for those yet).
 *
 * Patterns mirror INTEGRATION_PATTERNS in src/lib/marketing-integrations.ts,
 * so a typo here fails loudly instead of being silently dropped at render.
 * Run once: `node --env-file=.env scripts/connect-tracking-ids.mjs`
 */
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (e.g. run with --env-file=.env).");
  process.exit(1);
}

const row = {
  ga4_measurement_id: "G-NYRJPF402F",
  gtm_container_id: "GTM-MW72GXBX",
  google_site_verification: "IUmB3hnGkwNr5XikX7rBZLwx2ZV8aW9whkBb6hd8AEA",
  bing_site_verification: "744DE5B363BCDB8B4AEE5C98AF1B2623",
  clarity_project_id: "y2297nmb9k",
};

const patterns = {
  ga4_measurement_id: /^G-[A-Z0-9]{4,16}$/i,
  gtm_container_id: /^GTM-[A-Z0-9]{4,10}$/i,
  google_site_verification: /^[A-Za-z0-9_=-]{8,100}$/,
  bing_site_verification: /^[A-F0-9]{16,64}$/i,
  clarity_project_id: /^[a-z0-9]{4,20}$/i,
};

for (const [column, value] of Object.entries(row)) {
  if (!patterns[column].test(value)) {
    console.error(`${column} = "${value}" doesn't match the format the site validates against.`);
    process.exit(1);
  }
}

const db = createClient(url, key, { auth: { persistSession: false } });

const { data, error } = await db
  .from("marketing_integrations")
  .update(row)
  .eq("id", 1)
  .select()
  .single();

if (error) {
  console.error("Update failed:", error.message);
  process.exit(1);
}

console.log("Connected:");
for (const column of Object.keys(row)) console.log(`  ${column}: ${data[column]}`);
