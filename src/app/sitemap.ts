import type { MetadataRoute } from "next";
import { SITE, SERVICE_LINKS, NAV_LINKS } from "@/lib/site";
import { getPublishedPosts } from "@/lib/blog-data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = NAV_LINKS.map((link) => ({
    url: `${SITE.url}${link.href}`,
    lastModified: new Date(),
  }));

  const serviceRoutes = SERVICE_LINKS.map((s) => ({
    url: `${SITE.url}/services/${s.slug}`,
    lastModified: new Date(),
  }));

  const posts = await getPublishedPosts();
  const blogRoutes = posts.map((p) => ({
    url: `${SITE.url}/blog/${p.slug}`,
    lastModified: new Date(p.published_at),
  }));

  return [{ url: SITE.url, lastModified: new Date() }, ...staticRoutes, ...serviceRoutes, ...blogRoutes];
}
