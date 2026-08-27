#!/usr/bin/env node
/**
 * Builds the email signature's wordmark and publishes it to Cloudflare R2.
 *
 *   node scripts/build-email-signature-assets.mjs
 *
 * Run it after replacing public/brand/logo-nav.png, then paste the printed URL
 * into SIGNATURE_LOGO_URL in src/lib/email-templates.ts.
 *
 * Why R2 and not /public: a sent email keeps fetching this URL for as long as
 * anyone has the message, and mail is sent from a laptop as often as from
 * production. A file in /public only exists once the site is deployed, so
 * every email sent between writing the file and shipping it arrives with a
 * broken image that can never heal. R2 is live the moment this script
 * finishes, and it already serves every other public media file on this site.
 *
 * The filename carries a version because R2 objects are written immutable with
 * a one-year cache header — swapping the artwork means a new -v2 name, never
 * an overwrite, or inboxes keep the old one for a year.
 *
 * The logo is flattened onto white rather than kept transparent: the signature
 * sits on a white cell, and older Outlook still leaves a grey halo around
 * transparent PNGs often enough that it isn't worth risking.
 *
 * There are deliberately no icon files. Phone and email are labelled in text
 * instead — most clients block images until the reader allows them, and a
 * blocked 16px icon renders as a broken-image box that looks far worse than
 * the small caps label it replaced.
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// ---------------------------------------------------------------- env
const ENV_PATH = path.join(process.cwd(), ".env");
if (fs.existsSync(ENV_PATH)) {
  for (const line of fs.readFileSync(ENV_PATH, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i === -1) continue;
    const k = t.slice(0, i).trim();
    let v = t.slice(i + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    if (!(k in process.env)) process.env[k] = v;
  }
}

/** Bump when the artwork changes; never overwrite an existing version. */
const OBJECT_PATH = "email/signature-logo-v1.png";

/** Rendered at 120px in the email, so 300 keeps it sharp on a phone. */
const LOGO_WIDTH = 300;

const png = await sharp("public/brand/logo-nav.png")
  .resize({ width: LOGO_WIDTH })
  .flatten({ background: "#ffffff" })
  .png({ compressionLevel: 9 })
  .toBuffer();

// Kept in /public too, so the repo carries the artwork it ships and the
// template has something to fall back on if R2 is ever unset.
fs.mkdirSync("public/email", { recursive: true });
fs.writeFileSync("public/email/signature-logo.png", png);
console.log(`public/email/signature-logo.png — ${LOGO_WIDTH}px wide, ${(png.length / 1024).toFixed(0)}KB`);

const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, R2_PUBLIC_URL } = process.env;
if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET || !R2_PUBLIC_URL) {
  console.error("R2 is not configured in .env — the file was written locally but not published.");
  process.exit(1);
}

const client = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY },
});

await client.send(
  new PutObjectCommand({
    Bucket: R2_BUCKET,
    Key: OBJECT_PATH,
    Body: png,
    ContentType: "image/png",
    CacheControl: "public, max-age=31536000, immutable",
  }),
);

console.log(`published → ${R2_PUBLIC_URL.replace(/\/+$/, "")}/${OBJECT_PATH}`);
