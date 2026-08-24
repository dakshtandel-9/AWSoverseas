#!/usr/bin/env node
/**
 * Publishes the current Content/heroVideo/ship.mp4 as the home hero's first
 * slide, under a *versioned* object name.
 *
 * Why a new name instead of upserting hero-slider/ship-hero.mp4 again: that
 * object was uploaded on 2026-08-18 with `cache-control: max-age=31536000`,
 * so every browser that loaded the home page before the clip was swapped has
 * the old ship pinned until 2027 and never revalidates. Replacing the bytes
 * at the same URL cannot reach those caches — only a new URL can. Versioned
 * names also make the long max-age safe to keep, which is what keeps the
 * project's cached egress down.
 *
 * Re-encodes from the raw drop each run (1080p, h264 crf 30, audio stripped,
 * faststart) so what ships is always derived from the file in the repo.
 *
 * Run: `node --env-file=.env scripts/publish-ship-hero-v2.mjs`
 */
import { createClient } from "@supabase/supabase-js";
import { execFile } from "node:child_process";
import { readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { promisify } from "node:util";

const run = promisify(execFile);

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (run with --env-file=.env).");
  process.exit(1);
}

const BUCKET = "uploads";
const SOURCE = path.join(process.cwd(), "Content/heroVideo/ship.mp4");
const DEST = "hero-slider/ship-hero-v2.mp4";
const ENCODED = path.join(tmpdir(), "ship-hero-v2.mp4");

const db = createClient(url, key, { auth: { persistSession: false } });

await run("ffmpeg", [
  "-v", "error", "-y",
  "-i", SOURCE,
  "-vf", "scale=1920:-2",
  "-c:v", "libx264", "-crf", "30", "-preset", "slow",
  "-profile:v", "high", "-pix_fmt", "yuv420p",
  "-an", "-movflags", "+faststart",
  ENCODED,
]);

const bytes = await readFile(ENCODED);
const { error } = await db.storage.from(BUCKET).upload(DEST, bytes, {
  contentType: "video/mp4",
  cacheControl: "31536000",
  upsert: true,
});
await rm(ENCODED, { force: true });

if (error) {
  console.error(`FAILED ${DEST}: ${error.message}`);
  process.exit(1);
}

const { data } = db.storage.from(BUCKET).getPublicUrl(DEST);
console.log(`OK ${DEST} (${(bytes.length / 1e6).toFixed(2)} MB) -> ${data.publicUrl}`);
