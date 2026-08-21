"use server";

import { updateTag } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/server";
import { INTEGRATION_PATTERNS, type MarketingIntegrations } from "@/lib/marketing-integrations";

export type IntegrationsState = { error?: string; success?: boolean };

/** Form field name → validation key + the message shown when the pasted value doesn't look right. */
const FIELDS: {
  column: string;
  key: keyof MarketingIntegrations;
  label: string;
  example: string;
}[] = [
  { column: "ga4_measurement_id", key: "ga4MeasurementId", label: "Google Analytics Measurement ID", example: "G-ABC12DE3FG" },
  { column: "gtm_container_id", key: "gtmContainerId", label: "Google Tag Manager container ID", example: "GTM-ABC1234" },
  { column: "google_site_verification", key: "googleSiteVerification", label: "Google Search Console verification code", example: "the content value from the HTML tag" },
  { column: "bing_site_verification", key: "bingSiteVerification", label: "Bing Webmaster verification code", example: "the content value from the msvalidate.01 tag" },
  { column: "clarity_project_id", key: "clarityProjectId", label: "Microsoft Clarity project ID", example: "abcd1efgh2" },
  { column: "meta_pixel_id", key: "metaPixelId", label: "Meta Pixel ID", example: "1234567890123456 (numbers only)" },
  { column: "google_ads_id", key: "googleAdsId", label: "Google Ads conversion ID", example: "AW-123456789" },
  { column: "google_ads_conversion_label", key: "googleAdsConversionLabel", label: "Google Ads conversion label", example: "AbCdEfGhIj0KLmNoPqR" },
];

/**
 * People paste the whole `<meta ... content="TOKEN" />` tag more often than
 * just the token — accept both by pulling out the content value if present.
 */
function extractToken(raw: string): string {
  const match = raw.match(/content=["']([^"']+)["']/i);
  return (match ? match[1] : raw).trim();
}

export async function updateIntegrationsAction(
  _prevState: IntegrationsState,
  formData: FormData,
): Promise<IntegrationsState> {
  const row: Record<string, string> = {};

  for (const field of FIELDS) {
    const value = extractToken(String(formData.get(field.column) ?? ""));
    // Empty means "not connected" — always allowed.
    if (value && !INTEGRATION_PATTERNS[field.key].test(value)) {
      return { error: `${field.label} doesn't look right — expected something like ${field.example}.` };
    }
    row[field.column] = value;
  }

  if (row.google_ads_conversion_label && !row.google_ads_id) {
    return { error: "A Google Ads conversion label needs the conversion ID (AW-…) alongside it." };
  }

  const db = supabaseAdmin();
  // Upsert so saving works even if the singleton row hasn't been seeded yet.
  const { error } = await db.from("marketing_integrations").upsert({ id: 1, ...row });

  if (error) {
    return { error: "Couldn't save integrations. Please try again." };
  }

  updateTag("marketing-integrations");
  return { success: true };
}
