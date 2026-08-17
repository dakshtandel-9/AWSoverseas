import { unstable_cache } from "next/cache";
import { supabasePublic } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/status";

export type MarketingIntegrations = {
  ga4MeasurementId: string;
  gtmContainerId: string;
  googleSiteVerification: string;
  bingSiteVerification: string;
  clarityProjectId: string;
  metaPixelId: string;
  googleAdsId: string;
  googleAdsConversionLabel: string;
};

/**
 * Exact shape each ID must have. Shared by the save action (reject bad input
 * with a message) and the cached getter (silently drop anything malformed so
 * a bad value can never reach the inline <script> tags in the root layout).
 */
export const INTEGRATION_PATTERNS: Record<keyof MarketingIntegrations, RegExp> = {
  ga4MeasurementId: /^G-[A-Z0-9]{4,16}$/i,
  gtmContainerId: /^GTM-[A-Z0-9]{4,10}$/i,
  googleSiteVerification: /^[A-Za-z0-9_=-]{8,100}$/,
  bingSiteVerification: /^[A-F0-9]{16,64}$/i,
  clarityProjectId: /^[a-z0-9]{4,20}$/i,
  metaPixelId: /^[0-9]{5,20}$/,
  googleAdsId: /^AW-[0-9]{6,12}$/i,
  googleAdsConversionLabel: /^[A-Za-z0-9_-]{4,40}$/,
};

const EMPTY: MarketingIntegrations = {
  ga4MeasurementId: "",
  gtmContainerId: "",
  googleSiteVerification: "",
  bingSiteVerification: "",
  clarityProjectId: "",
  metaPixelId: "",
  googleAdsId: "",
  googleAdsConversionLabel: "",
};

function clean(value: string | null | undefined, pattern: RegExp): string {
  const v = (value ?? "").trim();
  return pattern.test(v) ? v : "";
}

async function readIntegrations(): Promise<MarketingIntegrations> {
  const db = supabasePublic();
  const { data } = await db.from("marketing_integrations").select("*").eq("id", 1).single();
  if (!data) return EMPTY;
  return {
    ga4MeasurementId: clean(data.ga4_measurement_id, INTEGRATION_PATTERNS.ga4MeasurementId),
    gtmContainerId: clean(data.gtm_container_id, INTEGRATION_PATTERNS.gtmContainerId),
    googleSiteVerification: clean(data.google_site_verification, INTEGRATION_PATTERNS.googleSiteVerification),
    bingSiteVerification: clean(data.bing_site_verification, INTEGRATION_PATTERNS.bingSiteVerification),
    clarityProjectId: clean(data.clarity_project_id, INTEGRATION_PATTERNS.clarityProjectId),
    metaPixelId: clean(data.meta_pixel_id, INTEGRATION_PATTERNS.metaPixelId),
    googleAdsId: clean(data.google_ads_id, INTEGRATION_PATTERNS.googleAdsId),
    googleAdsConversionLabel: clean(data.google_ads_conversion_label, INTEGRATION_PATTERNS.googleAdsConversionLabel),
  };
}

const getCachedIntegrations = unstable_cache(
  readIntegrations,
  ["marketing-integrations"],
  // Saving at /admin/integrations invalidates the tag, so edits made there go
  // live instantly. The hourly window is the backstop for a change made
  // outside the form (a direct Supabase edit, a seed script) — without it a
  // stale copy could outlive a deployment and silently drop every script tag.
  { tags: ["marketing-integrations"], revalidate: 3600 },
);

/** Single call site for every tracking/verification ID — reads from Supabase, admin-editable at /admin/integrations. */
export async function getMarketingIntegrations(): Promise<MarketingIntegrations> {
  if (!isSupabaseConfigured()) return EMPTY;
  try {
    return await getCachedIntegrations();
  } catch {
    return EMPTY;
  }
}

/**
 * Uncached read for the admin form only. The form posts back whatever it was
 * rendered with, so filling it from the shared cache risks showing a stale
 * blank field and wiping a good ID on save.
 */
export async function getMarketingIntegrationsFresh(): Promise<MarketingIntegrations> {
  if (!isSupabaseConfigured()) return EMPTY;
  try {
    return await readIntegrations();
  } catch {
    return EMPTY;
  }
}
