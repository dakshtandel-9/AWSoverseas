#!/usr/bin/env node
/**
 * Publishes a raw clip from Content/heroVideo/ to the home hero slider, under
 * a versioned object name in Supabase Storage.
 *
 * Always publish a swapped clip under a NEW name rather than upserting the old
 * one. The hero objects are served with `cache-control: max-age=31536000`, so
 * a browser that already fetched a URL — successfully or not — keeps that
 * result for a year and never revalidates. Replacing the bytes behind the same
 * URL cannot reach those caches; only a new URL can. That is what stranded
 * ship-hero.mp4 and flight-hero.mp4 on 2026-08-25. Versioned names are also
 * what make the long max-age safe to keep, which holds cached egress down.
 *
 * Re-encodes from the raw drop each run (1080p, h264 crf 30, audio stripped,
 * faststart) so what ships is always derived from the file in the repo.
 *
 * Usage:
 *   node --env-file=.env scripts/publish-hero-video.mjs <source.mp4> <dest-name.mp4>
 *   node --env-file=.env scripts/publish-hero-video.mjs Content/heroVideo/flight.mp4 flight-hero-v2.mp4
 *
 * Then point the slide's `video` URL in src/app/page.tsx at the printed URL.
 */
import { createClient } from "@supabase/supabase-js";
import { execFile } from "node:child_process";
import { readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { promisify } from "node:util";

const run = promisify(execFile);

const [source, destName] = process.argv.slice(2);
if (!source || !destName) {
  console.error("Usage: node --env-file=.env scripts/publish-hero-video.mjs <source.mp4> <dest-name.mp4>");
  process.exit(1);
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (run with --env-file=.env).");
  process.exit(1);
}

const BUCKET = "uploads";
const dest = `hero-slider/${destName}`;
const encoded = path.join(tmpdir(), destName);

const db = createClient(url, key, { auth: { persistSession: false } });

await run("ffmpeg", [
  "-v", "error", "-y",
  "-i", path.resolve(source),
  "-vf", "scale=1920:-2",
  "-c:v", "libx264", "-crf", "30", "-preset", "slow",
  "-profile:v", "high", "-pix_fmt", "yuv420p",
  "-an", "-movflags", "+faststart",
  encoded,
]);

const bytes = await readFile(encoded);
const { error } = await db.storage.from(BUCKET).upload(dest, bytes, {
  contentType: "video/mp4",
  cacheControl: "31536000",
  upsert: true,
});
await rm(encoded, { force: true });

if (error) {
  console.error(`FAILED ${dest}: ${error.message}`);
  process.exit(1);
}

const { data } = db.storage.from(BUCKET).getPublicUrl(dest);
console.log(`OK ${dest} (${(bytes.length / 1e6).toFixed(2)} MB) -> ${data.publicUrl}`);
