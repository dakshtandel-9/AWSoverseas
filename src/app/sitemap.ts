import type { MetadataRoute } from "next";
import { SITE, SERVICE_LINKS, NAV_LINKS } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = NAV_LINKS.map((link) => ({
    url: `${SITE.url}${link.href}`,
    lastModified: new Date(),
  }));

  const serviceRoutes = SERVICE_LINKS.map((s) => ({
    url: `${SITE.url}/services/${s.slug}`,
    lastModified: new Date(),
  }));

  return [{ url: SITE.url, lastModified: new Date() }, ...staticRoutes, ...serviceRoutes];
}
