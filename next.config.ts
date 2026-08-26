import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Catalog media already arrives compressed from R2. Serving it directly
    // keeps the site independent of Vercel's per-transformation quota while
    // preserving the browser-native lazy loading emitted by next/image.
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      // Media lives in Cloudflare R2. Wildcarded because the development
      // origin is `pub-<bucket hash>.r2.dev` — the hash isn't known until the
      // bucket exists, and it changes if the bucket is recreated. When the
      // domain moves to Cloudflare DNS and R2 gets a custom domain, add that
      // hostname here too.
      { protocol: "https", hostname: "*.r2.dev" },
      // Kept so images uploaded before the R2 migration keep rendering, and
      // so the Supabase fallback path in src/lib/storage.ts still works.
      { protocol: "https", hostname: "trjwefkdnublzryekmes.supabase.co" },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  async redirects() {
    // Admin routes renamed so each URL matches the page it serves. Kept
    // permanent: bookmarks and links inside already-sent notification emails
    // still point at the old paths.
    // Note /admin/enquiries is deliberately absent — it used to serve Orders
    // and now serves Enquiries, so it can't redirect anywhere.
    return [
      { source: "/admin/enquiries-open", destination: "/admin/enquiries", permanent: true },
      { source: "/admin/city-agents", destination: "/admin/associates", permanent: true },
      { source: "/admin/city-agents/:path*", destination: "/admin/associates/:path*", permanent: true },
      { source: "/admin/integrations", destination: "/admin/seo", permanent: true },
    ];
  },
};

export default nextConfig;
