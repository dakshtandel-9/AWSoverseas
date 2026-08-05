import { NextRequest, NextResponse } from "next/server";

// Free, no-key IP geolocation fallback for hosts that don't inject a
// country header themselves (Vercel does; a plain Node host won't).
const FALLBACK_ENDPOINT = "https://ipapi.co/{ip}/country/";

function countryFromHeaders(req: NextRequest): string | null {
  // Vercel / most edge platforms inject this directly — no network call.
  const vercelCountry = req.headers.get("x-vercel-ip-country");
  if (vercelCountry) return vercelCountry;

  // Cloudflare, if the app ever sits behind it.
  const cfCountry = req.headers.get("cf-ipcountry");
  if (cfCountry && cfCountry !== "XX") return cfCountry;

  return null;
}

function clientIp(req: NextRequest): string | null {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip");
}

export async function GET(req: NextRequest) {
  const headerCountry = countryFromHeaders(req);
  if (headerCountry) {
    return NextResponse.json({ country: headerCountry });
  }

  const ip = clientIp(req);
  if (!ip || ip === "127.0.0.1" || ip === "::1") {
    return NextResponse.json({ country: null });
  }

  try {
    const res = await fetch(FALLBACK_ENDPOINT.replace("{ip}", ip), {
      headers: { "User-Agent": "Mozilla/5.0" },
      signal: AbortSignal.timeout(2500),
    });
    if (!res.ok) return NextResponse.json({ country: null });
    const text = (await res.text()).trim();
    const country = /^[A-Za-z]{2}$/.test(text) ? text.toUpperCase() : null;
    return NextResponse.json({ country });
  } catch {
    return NextResponse.json({ country: null });
  }
}
