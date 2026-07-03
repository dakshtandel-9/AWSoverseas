/**
 * Signed admin session cookie, built on Web Crypto (`crypto.subtle`) so the
 * exact same code verifies a session in `middleware.ts` (Edge runtime) and
 * in Server Actions (Node runtime) without a runtime-specific fork.
 *
 * Cookie value shape: `${payloadB64Url}.${signatureHex}`, where payload is
 * `{ exp: number }` (ms epoch) and signature = HMAC-SHA256(payload, SESSION_SECRET).
 */

export const SESSION_COOKIE = "aws_admin_session";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

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

export async function createSessionToken(): Promise<{ token: string; maxAge: number }> {
  const payload = JSON.stringify({ exp: Date.now() + SESSION_TTL_MS });
  const payloadB64 = toBase64Url(new TextEncoder().encode(payload));
  const key = await hmacKey();
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payloadB64));
  return { token: `${payloadB64}.${toHex(signature)}`, maxAge: SESSION_TTL_MS / 1000 };
}

export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const [payloadB64, signatureHex] = token.split(".");
  if (!payloadB64 || !signatureHex) return false;

  try {
    const key = await hmacKey();
    const expectedSig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payloadB64));
    const expectedHex = toHex(expectedSig);

    if (expectedHex.length !== signatureHex.length) return false;
    // Constant-time compare (Web Crypto has no timingSafeEqual; XOR-fold instead).
    let diff = 0;
    for (let i = 0; i < expectedHex.length; i++) {
      diff |= expectedHex.charCodeAt(i) ^ signatureHex.charCodeAt(i);
    }
    if (diff !== 0) return false;

    const payload = JSON.parse(new TextDecoder().decode(fromBase64Url(payloadB64))) as { exp: number };
    return typeof payload.exp === "number" && payload.exp > Date.now();
  } catch {
    return false;
  }
}

export async function verifyPassword(candidate: string): Promise<boolean> {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  if (candidate.length !== expected.length) {
    // Still hash-compare to avoid a length-based timing signal being the
    // only leak; not load-bearing here but cheap to do right.
  }
  const enc = new TextEncoder();
  const a = await crypto.subtle.digest("SHA-256", enc.encode(candidate));
  const b = await crypto.subtle.digest("SHA-256", enc.encode(expected));
  const aBytes = new Uint8Array(a);
  const bBytes = new Uint8Array(b);
  let diff = 0;
  for (let i = 0; i < aBytes.length; i++) diff |= aBytes[i] ^ bBytes[i];
  return diff === 0;
}
