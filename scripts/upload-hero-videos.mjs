#!/usr/bin/env node
/**
 * One-off: uploads the replacement hero-slider videos (dropped locally into
 * Content/heroVideo/ after the Cloudinary account went to "disabled customer"
 * on 2026-08-17, see the awsoversea-cloudinary-disabled memory) to Supabase
 * Storage, in the same `uploads` bucket / `hero-slider` folder convention
 * src/lib/storage.ts already uses for every other upload.
 *
 * Cargo.mp4 (153MB) exceeds this Supabase project's ~50MB global upload
 * ceiling, so a pre-compressed copy (scratchpad/Cargo-compressed.mp4, h264
 * crf 26, audio stripped, ~38MB) is uploaded in its place — same 1080p frame.
 *
 * Run once: `node --env-file=.env scripts/upload-hero-videos.mjs`
 */
import { createClient } from "@supabase/supabase-js";
import { readFile } from "node:fs/promises";
import path from "node:path";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (e.g. run with --env-file=.env).");
  process.exit(1);
}

const db = createClient(url, key, { auth: { persistSession: false } });
const BUCKET = "uploads";
const CONTENT_DIR = path.join(process.cwd(), "Content/heroVideo");
const SCRATCH_DIR = "/private/tmp/claude-501/-Users-dakshtandel-projects-AWS-Overseas/b52fab22-1930-44b4-8f7e-f1bd55b6de86/scratchpad";

const FILES = [
  { source: path.join(CONTENT_DIR, "ship.mp4"), destName: "ship-hero.mp4" },
  { source: path.join(CONTENT_DIR, "Manufacturers.mp4"), destName: "manufacturing.mp4" },
  { source: path.join(SCRATCH_DIR, "Cargo-compressed.mp4"), destName: "cargo.mp4" },
  { source: path.join(CONTENT_DIR, "Import & Export.mp4"), destName: "partner-import-export.mp4" },
  { source: path.join(CONTENT_DIR, "warehouse.mp4"), destName: "warehouse.mp4" },
];

async function main() {
  const urls = {};
  for (const { source, destName } of FILES) {
    const bytes = await readFile(source);
    const destPath = `hero-slider/${destName}`;
    const { error } = await db.storage.from(BUCKET).upload(destPath, bytes, {
      contentType: "video/mp4",
      upsert: true,
    });
    if (error) {
      console.error(`FAILED ${destName}:`, error.message);
      continue;
    }
    const { data } = db.storage.from(BUCKET).getPublicUrl(destPath);
    urls[destName] = data.publicUrl;
    console.log(`${destName} -> ${data.publicUrl}`);
  }
  console.log("\n" + JSON.stringify(urls, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
