import type { MetadataRoute } from "next";
import { SERVICE_LINKS, NAV_LINKS, FOOTER_NAV } from "@/lib/site";
import { absoluteUrl } from "@/lib/site-url";
import { getActiveCategories } from "@/lib/category-data";

/**
 * Every page a crawler should index. Static routes come from the site's own
 * navigation rather than a hand-kept list, so a page added to the header or
 * footer is in the sitemap the same day.
 *
 * Sign-in, profile and admin routes are deliberately absent — they're
 * blocked in robots.ts and carry `robots: { index: false }`.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const navPaths = [
    ...NAV_LINKS.map((link) => link.href),
    ...Object.values(FOOTER_NAV).flatMap((group) => group.map((link) => link.href)),
  ];

  // The header and footer share links (About, Contact, Products), so dedupe.
  const staticRoutes = [...new Set(navPaths)].map((href) => ({
    url: absoluteUrl(href),
    lastModified: new Date(),
    priority: href === "/" ? 1 : 0.8,
  }));

  const serviceRoutes = SERVICE_LINKS.map((s) => ({
    url: absoluteUrl(`/services/${s.slug}`),
    lastModified: new Date(),
    priority: 0.7,
  }));

  // Subcategories open inside their parent's page rather than being linked from
  // it, so the sitemap is how a crawler finds their own pages.
  const categories = await getActiveCategories();
  const categoryRoutes = categories.map((c) => ({
    url: absoluteUrl(`/products/${c.slug}`),
    lastModified: new Date(),
    priority: 0.7,
  }));

  return [...staticRoutes, ...serviceRoutes, ...categoryRoutes];
}
