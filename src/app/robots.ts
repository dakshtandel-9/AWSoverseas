import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Private and single-use routes: the admin panel, a signed-in
      // customer's own pages, and links that only work once (email
      // confirmation, password reset).
      disallow: [
        "/admin",
        "/api/",
        "/auth/",
        "/profile",
        "/login",
        "/forgot-password",
        "/reset-password",
      ],
    },
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
