#!/usr/bin/env node
/**
 * Copies every public media object out of the Supabase `uploads` bucket into
 * Cloudflare R2, then rewrites the URLs stored on the database rows that point
 * at them. Supabase keeps the database; R2 serves the files.
 *
 * Why: Supabase's free tier allows 5GB/month of egress and one hero video is
 * ~6MB, so downloads — not storage — are the binding constraint. R2 charges
 * $0 for egress at any volume.
 *
 * Safe to re-run: objects already present in R2 are skipped, and the database
 * rewrite only touches rows whose URL still points at Supabase.
 *
 *   node scripts/migrate-media-to-r2.mjs --dry-run   # report only, no writes
 *   node scripts/migrate-media-to-r2.mjs             # perform the migration
 *
 * `id-documents/` is deliberately excluded — see EXCLUDED_PREFIXES below.
 */
import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import { S3Client, PutObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";

const DRY_RUN = process.argv.includes("--dry-run");

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

const {
  NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  R2_ACCOUNT_ID,
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
  R2_BUCKET,
  R2_PUBLIC_URL,
} = process.env;

const missing = Object.entries({
  NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  R2_ACCOUNT_ID,
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
  R2_BUCKET,
  R2_PUBLIC_URL,
})
  .filter(([, v]) => !v)
  .map(([k]) => k);

if (missing.length) {
  console.error(`Missing required env vars:\n  ${missing.join("\n  ")}`);
  process.exit(1);
}

const SUPABASE_BUCKET = "uploads";
const SUPABASE_PREFIX = `${NEXT_PUBLIC_SUPABASE_URL.replace(/\/+$/, "")}/storage/v1/object/public/${SUPABASE_BUCKET}/`;
const R2_PREFIX = `${R2_PUBLIC_URL.replace(/\/+$/, "")}/`;

/**
 * Orphaned ID-verification photos from a feature that no longer exists — the
 * user_profiles.id_front_url / id_back_url columns were dropped (see
 * supabase/schema.sql). Nothing reads these, and they are personal documents,
 * so they are not copied into a public bucket. Delete them at the source
 * instead, once you've confirmed they're not needed for past verifications.
 */
const EXCLUDED_PREFIXES = ["id-documents/"];

/** Every database column holding a URL that points into the uploads bucket. */
const URL_COLUMNS = [
  { table: "products", column: "image_url" },
  { table: "categories", column: "image_url" },
  { table: "city_agents", column: "image_url" },
  { table: "product_enquiries", column: "attachment_url" },
  { table: "quote_submissions", column: "attachment_url" },
];

const db = createClient(NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY },
});

// ---------------------------------------------------------------- helpers
async function listAll(prefix = "") {
  let out = [];
  let offset = 0;
  for (;;) {
    const { data, error } = await db.storage
      .from(SUPABASE_BUCKET)
      .list(prefix, { limit: 100, offset });
    if (error) throw new Error(`list ${prefix}: ${error.message}`);
    if (!data?.length) break;
    for (const item of data) {
      const p = prefix ? `${prefix}/${item.name}` : item.name;
      // Supabase returns folders as rows with a null id.
      if (item.id === null) out = out.concat(await listAll(p));
      else out.push({ key: p, size: item.metadata?.size ?? 0, type: item.metadata?.mimetype });
    }
    if (data.length < 100) break;
    offset += 100;
  }
  return out;
}

async function existsInR2(key) {
  try {
    await r2.send(new HeadObjectCommand({ Bucket: R2_BUCKET, Key: key }));
    return true;
  } catch {
    return false;
  }
}

function contentTypeFor(key, fallback) {
  if (fallback && fallback !== "application/octet-stream") return fallback;
  const ext = key.split(".").pop()?.toLowerCase();
  return (
    {
      webp: "image/webp",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      svg: "image/svg+xml",
      avif: "image/avif",
      mp4: "video/mp4",
      webm: "video/webm",
      pdf: "application/pdf",
    }[ext] ?? "application/octet-stream"
  );
}

const mb = (b) => (b / 1048576).toFixed(1);

// ---------------------------------------------------------------- copy
async function copyObjects() {
  const all = await listAll();
  const skipped = all.filter((o) => EXCLUDED_PREFIXES.some((p) => o.key.startsWith(p)));
  const files = all.filter((o) => !EXCLUDED_PREFIXES.some((p) => o.key.startsWith(p)));
  const totalBytes = files.reduce((s, f) => s + f.size, 0);

  console.log(`Found ${files.length} objects to copy (${mb(totalBytes)} MB).`);
  if (skipped.length) {
    console.log(`Excluding ${skipped.length} object(s) under ${EXCLUDED_PREFIXES.join(", ")} (${mb(skipped.reduce((s, f) => s + f.size, 0))} MB).`);
  }

  let copied = 0;
  let already = 0;
  let failed = 0;

  // Keep a small amount of parallelism: this is much faster for hundreds of
  // thumbnails while still bounding memory when a batch contains videos.
  const CONCURRENCY = 8;
  for (let start = 0; start < files.length; start += CONCURRENCY) {
    const batch = files.slice(start, start + CONCURRENCY);
    await Promise.all(
      batch.map(async (file, offset) => {
        const i = start + offset;
        const label = `[${i + 1}/${files.length}] ${file.key}`;
        if (await existsInR2(file.key)) {
          already++;
          return;
        }
        if (DRY_RUN) {
          console.log(`${label}  would copy (${mb(file.size)} MB)`);
          copied++;
          return;
        }
        try {
          const { data, error } = await db.storage.from(SUPABASE_BUCKET).download(file.key);
          if (error) throw new Error(error.message);
          const bytes = Buffer.from(await data.arrayBuffer());
          await r2.send(
            new PutObjectCommand({
              Bucket: R2_BUCKET,
              Key: file.key,
              Body: bytes,
              ContentType: contentTypeFor(file.key, file.type),
              CacheControl: "public, max-age=31536000, immutable",
            })
          );
          copied++;
          console.log(`${label}  ok (${mb(file.size)} MB)`);
        } catch (err) {
          failed++;
          console.error(`${label}  FAILED: ${err.message}`);
        }
      })
    );
  }

  console.log(`\nObjects: ${copied} copied, ${already} already in R2, ${failed} failed.`);
  return failed;
}

// ---------------------------------------------------------------- db rewrite
async function rewriteUrls() {
  console.log("\nRewriting stored URLs...");
  for (const { table, column } of URL_COLUMNS) {
    const { data, error } = await db
      .from(table)
      .select(`id, ${column}`)
      .like(column, `${SUPABASE_PREFIX}%`);

    if (error) {
      console.error(`  ${table}.${column}  SKIPPED: ${error.message}`);
      continue;
    }
    if (!data?.length) {
      console.log(`  ${table}.${column}  nothing to rewrite`);
      continue;
    }
    if (DRY_RUN) {
      console.log(`  ${table}.${column}  would rewrite ${data.length} row(s)`);
      continue;
    }

    let updated = 0;
    for (const row of data) {
      const next = row[column].replace(SUPABASE_PREFIX, R2_PREFIX);
      const { error: upErr } = await db.from(table).update({ [column]: next }).eq("id", row.id);
      if (upErr) console.error(`  ${table}.${column} row ${row.id}: ${upErr.message}`);
      else updated++;
    }
    console.log(`  ${table}.${column}  rewrote ${updated}/${data.length} row(s)`);
  }
}

// ---------------------------------------------------------------- main
const failures = await copyObjects();
await rewriteUrls();

console.log(
  DRY_RUN
    ? "\nDry run complete — nothing was written."
    : "\nMigration complete."
);
console.log(
  "Hero video URLs are hardcoded in src/app/page.tsx, not stored in the database — update those by hand to:\n  " +
    R2_PREFIX +
    "hero-slider/<file>.mp4"
);
if (failures) process.exitCode = 1;
