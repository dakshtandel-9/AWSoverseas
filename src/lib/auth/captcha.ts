/**
 * Stateless image captcha, signed with the same HMAC pattern as the admin
 * session cookie (see `session.ts`) so no server-side store is needed — the
 * code itself travels inside a signed, short-lived token that the client
 * echoes back on submit.
 *
 * Token shape: `${payloadB64Url}.${signatureHex}`, payload =
 * `{ code: string, exp: number }`, signature = HMAC-SHA256(payload, SESSION_SECRET).
 */

export const CAPTCHA_TTL_MS = 5 * 60 * 1000; // 5 minutes
const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I — ambiguous when distorted
const CODE_LENGTH = 5;

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET is not set in .env");
  }
  return secret;
}

function toBase64Url(bytes: ArrayBuffer | Uint8Array): string {
  const binary = String.fromCharCode(...new Uint8Array(bytes));
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(padded);
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

function toHex(bytes: ArrayBuffer): string {
  return [...new Uint8Array(bytes)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function hmacKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

function randomCode(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(CODE_LENGTH));
  return [...bytes].map((b) => CHARS[b % CHARS.length]).join("");
}

export async function createCaptchaToken(): Promise<{ code: string; token: string }> {
  const code = randomCode();
  const payload = JSON.stringify({ code, exp: Date.now() + CAPTCHA_TTL_MS });
  const payloadB64 = toBase64Url(new TextEncoder().encode(payload));
  const key = await hmacKey();
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payloadB64));
  return { code, token: `${payloadB64}.${toHex(signature)}` };
}

export async function verifyCaptchaToken(token: string | undefined, answer: string | undefined): Promise<boolean> {
  if (!token || !answer) return false;
  const [payloadB64, signatureHex] = token.split(".");
  if (!payloadB64 || !signatureHex) return false;

  try {
    const key = await hmacKey();
    const expectedSig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payloadB64));
    const expectedHex = toHex(expectedSig);

    if (expectedHex.length !== signatureHex.length) return false;
    let diff = 0;
    for (let i = 0; i < expectedHex.length; i++) {
      diff |= expectedHex.charCodeAt(i) ^ signatureHex.charCodeAt(i);
    }
    if (diff !== 0) return false;

    const payload = JSON.parse(new TextDecoder().decode(fromBase64Url(payloadB64))) as {
      code: string;
      exp: number;
    };
    if (typeof payload.exp !== "number" || payload.exp < Date.now()) return false;

    return payload.code.trim().toUpperCase() === answer.trim().toUpperCase();
  } catch {
    return false;
  }
}

/** Renders the code as a small distorted inline SVG — wavy baseline, per-glyph
 * rotation/offset, and noise strokes/dots so it resists trivial OCR. */
export function renderCaptchaSvg(code: string): string {
  const width = 160;
  const height = 56;
  const seedRand = mulberry32(hashString(code));

  // Keep every glyph's bounding box (after rotation) inside the canvas:
  // reserve side padding, cap font size to the per-glyph slot, and clamp
  // rotation/jitter so a corner can't swing past the edge or get clipped
  // by the container's overflow-hidden.
  const padding = 14;
  const usableWidth = width - padding * 2;
  const slot = usableWidth / code.length;
  const fontSize = Math.min(24, slot * 1.15);
  const maxRotate = 18;
  const maxJitterY = 6;

  const glyphs = [...code]
    .map((char, i) => {
      const x = padding + slot * i + slot / 2;
      const y = height / 2 + (seedRand() - 0.5) * maxJitterY;
      const rotate = (seedRand() - 0.5) * maxRotate * 2;
      const hue = 205 + Math.floor(seedRand() * 40 - 20);
      return `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" transform="rotate(${rotate.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)})" text-anchor="middle" dominant-baseline="central" font-family="'Courier New', monospace" font-weight="700" font-size="${fontSize.toFixed(1)}" fill="hsl(${hue} 62% 28%)">${char}</text>`;
    })
    .join("");

  const noiseLines = Array.from({ length: 3 }, () => {
    const y1 = 8 + seedRand() * (height - 16);
    const y2 = 8 + seedRand() * (height - 16);
    return `<path d="M4 ${y1.toFixed(1)} Q ${(width / 2).toFixed(1)} ${(8 + seedRand() * (height - 16)).toFixed(1)} ${width - 4} ${y2.toFixed(1)}" stroke="hsl(205 40% 70%)" stroke-width="1.5" fill="none" opacity="0.5"/>`;
  }).join("");

  const noiseDots = Array.from({ length: 16 }, () => {
    const cx = 4 + seedRand() * (width - 8);
    const cy = 4 + seedRand() * (height - 8);
    return `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="1" fill="hsl(205 45% 60%)" opacity="0.4"/>`;
  }).join("");

  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Captcha image"><rect width="${width}" height="${height}" fill="#eef3fb"/>${noiseLines}${noiseDots}${glyphs}</svg>`;
}

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return hash >>> 0;
}

// Small deterministic PRNG so the same code always renders the same
// "random" distortion (not load-bearing for security, just for rendering).
function mulberry32(seed: number): () => number {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
