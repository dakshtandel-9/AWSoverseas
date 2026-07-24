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

const getCachedIntegrations = unstable_cache(
  async (): Promise<MarketingIntegrations> => {
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
  },
  ["marketing-integrations"],
  { tags: ["marketing-integrations"] },
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
