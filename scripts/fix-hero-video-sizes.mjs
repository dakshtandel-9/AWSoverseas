import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const ENV_PATH = "/Users/dakshtandel/projects/AWS.Overseas/.env";
const BUCKET = "uploads";

function loadEnv(envPath) {
  const content = fs.readFileSync(envPath, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    let value = trimmed.slice(idx + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}
loadEnv(ENV_PATH);

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const files = [
  { local: "/Users/dakshtandel/projects/AWS.Overseas/public/hero-slider/ship-hero.mp4", remote: "hero-slider/ship-hero.mp4" },
  { local: "/Users/dakshtandel/projects/AWS.Overseas/public/hero-slider/manufacturing.mp4", remote: "hero-slider/manufacturing.mp4" },
  { local: "/Users/dakshtandel/projects/AWS.Overseas/public/hero-slider/cargo.mp4", remote: "hero-slider/cargo.mp4" },
  { local: "/Users/dakshtandel/projects/AWS.Overseas/public/hero-slider/partner-import-export.mp4", remote: "hero-slider/partner-import-export.mp4" },
  { local: "/private/tmp/claude-501/-Users-dakshtandel-projects-AWS-Overseas/5bee269f-3d33-47e3-8faf-a967d68dcdca/scratchpad/warehouse.mp4", remote: "hero-slider/warehouse.mp4" },
];

async function main() {
  for (const f of files) {
    const bytes = fs.readFileSync(f.local);
    const { error } = await db.storage.from(BUCKET).upload(f.remote, bytes, {
      contentType: "video/mp4",
      cacheControl: "31536000",
      upsert: true,
    });
    if (error) {
      console.log(`FAIL ${f.remote}: ${error.message}`);
      continue;
    }
    console.log(`OK   ${f.remote}  (${bytes.length} bytes)`);
  }
}

main().catch((e) => {
  console.error("FATAL", e);
  process.exit(1);
});
