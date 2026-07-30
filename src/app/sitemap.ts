import type { MetadataRoute } from "next";
import { SITE, SERVICE_LINKS, NAV_LINKS } from "@/lib/site";
import { getActiveCategories } from "@/lib/category-data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = NAV_LINKS.map((link) => ({
    url: `${SITE.url}${link.href}`,
    lastModified: new Date(),
  }));

  const serviceRoutes = SERVICE_LINKS.map((s) => ({
    url: `${SITE.url}/services/${s.slug}`,
    lastModified: new Date(),
  }));

  // Subcategories open inside their parent's page rather than being linked from
  // it, so the sitemap is how a crawler finds their own pages.
  const categories = await getActiveCategories();
  const categoryRoutes = categories.map((c) => ({
    url: `${SITE.url}/products/${c.slug}`,
    lastModified: new Date(),
  }));

  return [
    { url: SITE.url, lastModified: new Date() },
    ...staticRoutes,
    ...serviceRoutes,
    ...categoryRoutes,
  ];
}
