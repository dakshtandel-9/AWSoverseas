import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
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
