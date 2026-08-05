import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const LOOKUP_TIMEOUT_MS = 3000;
const CACHE_TTL_MS = 60 * 60 * 1000;

// Resolved countries, keyed by client IP (or "self" for a local/dev request
// where the visitor's IP isn't visible). Keeps the free lookup providers
// from being hit once per page view.
const cache = new Map<string, { country: string | null; at: number }>();

// Free, no-key providers, tried in order until one returns a country. Each
// takes the visitor's IP, or resolves the caller's own IP when passed null
// (which is what makes this work in local dev, where the browser's IP is
// 127.0.0.1 and the server's egress IP is the real connection).
const PROVIDERS: {
  url: (ip: string | null) => string;
  parse: (body: string) => string | null;
}[] = [
  {
    url: (ip) => (ip ? `https://api.country.is/${ip}` : "https://api.country.is/"),
    parse: (body) => {
      try {
        return JSON.parse(body)?.country ?? null;
      } catch {
        return null;
      }
    },
  },
  {
    url: (ip) =>
      ip
        ? `https://get.geojs.io/v1/ip/country/${ip}.json`
        : "https://get.geojs.io/v1/ip/country.json",
    parse: (body) => {
      try {
        return JSON.parse(body)?.country ?? null;
      } catch {
        return null;
      }
    },
  },
  {
    // Self-only (no per-IP form), so it's last — still useful in local dev.
    url: () => "https://www.cloudflare.com/cdn-cgi/trace",
    parse: (body) => body.match(/^loc=([A-Z]{2})$/m)?.[1] ?? null,
  },
];

function countryFromHeaders(req: NextRequest): string | null {
  // Vercel / most edge platforms inject this directly — no network call.
  const vercelCountry = req.headers.get("x-vercel-ip-country");
  if (vercelCountry && vercelCountry !== "XX") return vercelCountry;

  // Cloudflare, if the app ever sits behind it.
  const cfCountry = req.headers.get("cf-ipcountry");
  if (cfCountry && cfCountry !== "XX") return cfCountry;

  return null;
}

// Loopback, LAN and link-local addresses tell us nothing about location —
// e.g. a phone hitting the dev server over Wi-Fi shows up as 192.168.x.x.
function isPrivateIp(ip: string): boolean {
  return (
    ip === "127.0.0.1" ||
    ip === "::1" ||
    ip.startsWith("10.") ||
    ip.startsWith("192.168.") ||
    ip.startsWith("169.254.") ||
    ip.startsWith("fc") ||
    ip.startsWith("fd") ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(ip)
  );
}

function clientIp(req: NextRequest): string | null {
  const forwarded = req.headers.get("x-forwarded-for");
  const raw = forwarded ? forwarded.split(",")[0].trim() : req.headers.get("x-real-ip");
  if (!raw) return null;
  const ip = raw.replace(/^::ffff:/, "");
  return isPrivateIp(ip) ? null : ip;
}

async function lookupCountry(ip: string | null): Promise<string | null> {
  for (const provider of PROVIDERS) {
    try {
      const res = await fetch(provider.url(ip), {
        headers: { "User-Agent": "Mozilla/5.0" },
        signal: AbortSignal.timeout(LOOKUP_TIMEOUT_MS),
        cache: "no-store",
      });
      if (!res.ok) continue;
      const country = provider.parse(await res.text());
      if (country && /^[A-Za-z]{2}$/.test(country)) return country.toUpperCase();
    } catch {
      // try the next provider
    }
  }
  return null;
}

export async function GET(req: NextRequest) {
  const headerCountry = countryFromHeaders(req);
  if (headerCountry) {
    return NextResponse.json(
      { country: headerCountry.toUpperCase() },
      { headers: { "Cache-Control": "no-store" } },
    );
  }

  const ip = clientIp(req);
  const key = ip ?? "self";

  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < CACHE_TTL_MS) {
    return NextResponse.json(
      { country: hit.country },
      { headers: { "Cache-Control": "no-store" } },
    );
  }

  const country = await lookupCountry(ip);
  cache.set(key, { country, at: Date.now() });

  return NextResponse.json({ country }, { headers: { "Cache-Control": "no-store" } });
}
