/**
 * Central content loader — the JSON files in /Content are the single
 * source of truth for ALL page copy. Pages/components import named
 * content from here and must never hardcode display text.
 *
 * JSON is resolved at build time via `resolveJsonModule`. Each export is
 * cast through the loose `Content` record type because the JSON shapes are
 * authored, not generated; components destructure the fields they need.
 */
import homeJson from "@/content/home.json";
import aboutJson from "@/content/about.json";
import servicesJson from "@/content/services.json";
import individualServiceJson from "@/content/individualService.json";
import industriesJson from "@/content/industries.json";
import productsJson from "@/content/products.json";
import mobileAppJson from "@/content/mobileApp.json";
import shipmentTrackingJson from "@/content/shipmentTracking.json";
import requestQuoteJson from "@/content/requestQuote.json";
import blogJson from "@/content/blog.json";
import singleBlogJson from "@/content/singleBlog.json";
import faqJson from "@/content/faq.json";
import contactJson from "@/content/contact.json";
import partnerWithUsJson from "@/content/partnerWithUs.json";
import privacyPolicyJson from "@/content/privacyPolicy.json";
import termsConditionsJson from "@/content/termsConditions.json";
import refundPolicyJson from "@/content/refundPolicy.json";
import disclaimerJson from "@/content/disclaimer.json";
import referralRewardsJson from "@/content/referralRewards.json";
import sourcingAgentJson from "@/content/sourcingAgent.json";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Content = Record<string, any>;

export const home = homeJson as Content;
export const about = aboutJson as Content;
export const services = servicesJson as Content;
export const individualService = individualServiceJson as Content;
export const industries = industriesJson as Content;
export const products = productsJson as Content;
export const mobileApp = mobileAppJson as Content;
export const shipmentTracking = shipmentTrackingJson as Content;
export const requestQuote = requestQuoteJson as Content;
export const blog = blogJson as Content;
export const singleBlog = singleBlogJson as Content;
export const faq = faqJson as Content;
export const contact = contactJson as Content;
export const partnerWithUs = partnerWithUsJson as Content;
export const privacyPolicy = privacyPolicyJson as Content;
export const termsConditions = termsConditionsJson as Content;
export const refundPolicy = refundPolicyJson as Content;
export const disclaimer = disclaimerJson as Content;
export const referralRewards = referralRewardsJson as Content;
export const sourcingAgent = sourcingAgentJson as Content;

/** Build a Next.js Metadata object from a page's `meta` block. */
export function metaFrom(meta: Content | undefined, path = "/") {
  const title = meta?.title ?? "AWSOverseas";
  const description = meta?.description ?? "";
  const url = `https://awsoverseas.com${path}`;
  return {
    title,
    description,
    keywords: meta?.keywords as string[] | undefined,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "AWSOverseas",
      type: "website",
    },
    twitter: {
      card: "summary_large_image" as const,
      title,
      description,
    },
  };
}
