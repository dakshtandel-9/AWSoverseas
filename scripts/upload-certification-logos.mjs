#!/usr/bin/env node
/**
 * One-off: uploads the 12 certification/membership logos shown in the home
 * page's "Certified Excellence in Global Trade" marquee to Cloudflare R2.
 *
 * They were the last assets still served from the Cloudinary account that went
 * to "disabled customer" on 2026-08-17 (see the awsoversea-cloudinary-disabled
 * memory), so every logo 401'd and the marquee rendered as broken-image alt
 * text. The originals were recovered from commit 44c7d49^, which is the commit
 * that moved them out of public/ and into Cloudinary in the first place.
 *
 * Files are read from public/certifications/ and written to `certifications/`
 * in the bucket, matching the folder-per-kind convention src/lib/r2.ts uses.
 * Names are the certification code, so the object path says what the logo is —
 * the Cloudinary set had two (`logo3`, `logo5`) that did not.
 *
 * The source files are not kept in the repo (media lives on the CDN). To run
 * this again, restore them first, then re-upload:
 *
 *   git checkout 44c7d49^ -- public/certifications/
 *   node scripts/upload-certification-logos.mjs
 *
 * The restored files use the pre-Cloudinary names, which need renaming to the
 * object keys home.json now expects. Double extensions collapse to the real
 * format (dgft.jpg.webp -> dgft.webp, fssi.png -> fssai.png), and the two
 * opaque names are: logo3 -> gstc, logo5 -> apeda. Also spice ->
 * spices-board and udyogaadhaar -> udyog-aadhaar.
 *
 * Re-runnable: objects are overwritten in place with the same key.
 */
import fs from "node:fs";
import path from "node:path";
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

const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, R2_PUBLIC_URL } = process.env;

if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET || !R2_PUBLIC_URL) {
  console.error("Missing R2 credentials. Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET and R2_PUBLIC_URL in .env.");
  process.exit(1);
}

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY },
});

const SOURCE_DIR = path.join(process.cwd(), "public/certifications");
const TYPES = { ".webp": "image/webp", ".png": "image/png" };

async function main() {
  const files = fs.readdirSync(SOURCE_DIR).filter((f) => path.extname(f) in TYPES).sort();
  const urls = {};

  for (const file of files) {
    const key = `certifications/${file}`;
    await r2.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET,
        Key: key,
        Body: fs.readFileSync(path.join(SOURCE_DIR, file)),
        ContentType: TYPES[path.extname(file)],
        CacheControl: "public, max-age=31536000, immutable",
      })
    );
    urls[file] = `${R2_PUBLIC_URL.replace(/\/+$/, "")}/${key}`;
    console.log(`${file} -> ${urls[file]}`);
  }

  console.log(`\n${files.length} logos uploaded.`);
  console.log(JSON.stringify(urls, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
