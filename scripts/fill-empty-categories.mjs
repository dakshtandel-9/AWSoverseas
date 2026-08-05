#!/usr/bin/env node
/**
 * Fills the three active, empty leaf categories with 4 products each. Each
 * product photo is a real, license-clear image (Wikimedia Commons / Flickr
 * CC / LACMA open access) uploaded straight into Cloudinary from its source
 * URL — no local file needed, Cloudinary fetches and re-hosts it.
 *
 * Categories targeted (active, no children, zero products as of 2026-08-05):
 *   - children-clothing   (under Clothing)
 *   - stainless-steel-utensils (under Untensils)
 *   - brass-utensils      (under Untensils)
 *
 * Run: `node --env-file=.env scripts/fill-empty-categories.mjs`
 * Add `--dry` to print the plan without writing.
 */
import { v2 as cloudinary } from "cloudinary";
import { createClient } from "@supabase/supabase-js";

const SCRATCH =
  "/private/tmp/claude-501/-Users-dakshtandel-projects-AWS-Overseas/2e2198a1-3431-42d6-8370-7cf7389192be/scratchpad/img-check";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const DRY = process.argv.includes("--dry");

if (!url || !key) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (run with --env-file=.env).");
  process.exit(1);
}
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error("Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET (run with --env-file=.env).");
  process.exit(1);
}

const db = createClient(url, key, { auth: { persistSession: false } });
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const PLAN = {
  "children-clothing": [
    {
      name: "Cable-Knit Baby Poncho",
      description: "Hand-knit poncho in a heavyweight cable stitch, sized for infants. Pullover styling, no closures to fasten around a squirming toddler.",
      source: "https://live.staticflickr.com/3718/13796569175_6655292620_b.jpg",
    },
    {
      name: "Hooded Baby Sweater",
      description: "Drawstring-hood knit pullover with contrast-stripe cuffs and hem, sized for infants. Soft yarn construction for everyday wear.",
      source: "https://live.staticflickr.com/3533/4010443625_0823fb80f2_b.jpg",
    },
    {
      name: "Knit Toddler Shrug",
      description: "Cropped cardigan shrug in a fine rib knit, cut for toddlers. Open front, easy to layer over a dress or onesie.",
      source: `${SCRATCH}/kids3.jpg`,
    },
    {
      name: "Sleeveless Knit Baby Vest",
      description: "Fine-gauge sleeveless vest in a soft cream knit with a keyhole back closure, sized for infants.",
      source: "https://live.staticflickr.com/5160/5795327519_7531b54ca8_b.jpg",
    },
  ],
  "stainless-steel-utensils": [
    {
      name: "Stainless Steel Saucepan with Lid",
      description: "Mirror-polished stainless steel saucepan with a fitted lid and a riveted stay-cool handle. Induction-base construction.",
      source: "https://live.staticflickr.com/4113/5023478470_178c89be61_b.jpg",
    },
    {
      name: "Stainless Steel Stockpot with Lid",
      description: "Large-capacity stainless steel stockpot with a domed lid and dual riveted side handles for a secure lift when full.",
      source: "https://live.staticflickr.com/4151/5023477994_3ce88de65e_b.jpg",
    },
    {
      name: "Stainless Steel Saute Pan",
      description: "Wide-base stainless steel buffet saute pan with a non-stick interior and a long stay-cool handle.",
      source: "https://live.staticflickr.com/4106/5023481258_8baff1be2b_b.jpg",
    },
    {
      name: "Stacking Steel Tiffin Set",
      description: "Three-tier stainless steel tiffin carrier with clip-lock handles, stacked and locked as one unit for transport.",
      source: "https://live.staticflickr.com/8097/8410506153_2c0b1eacdf.jpg",
    },
  ],
  "brass-utensils": [
    {
      name: "Brass Pooja Thali with Diya",
      description: "Hand-finished brass pooja thali with a fitted brass diya lamp, sized for daily ritual use.",
      source: "https://upload.wikimedia.org/wikipedia/commons/5/51/Brass_thali_with_lamp.jpg",
    },
    {
      name: "Engraved Brass Singing Bowl",
      description: "Hand-engraved brass bowl with mandala and floral chasing across the interior, hammered rim.",
      source: "https://pd.w.org/2025/04/68067fa5d761b1274.60598402-1536x2048.jpeg",
    },
    {
      name: "Brass Ritual Oil Lamp",
      description: "Cast brass sukunda-style oil lamp with a scrollwork handle and figural finial, wick tray to one side.",
      source: `${SCRATCH}/brass-sukunda.jpg`,
    },
    {
      name: "Engraved Brass Ewer",
      description: "Brass ewer with dense floral engraving across the body, a curved spout and a scrolled handle, raised on a fluted foot.",
      source: "https://live.staticflickr.com/7446/16379724816_5cd0b98ae6_b.jpg",
    },
  ],
};

const verb = (past, base) => (DRY ? `to ${base}` : past);
const die = (msg) => {
  console.error(msg);
  process.exit(1);
};

const slugs = Object.keys(PLAN);
const { data: cats, error: catError } = await db
  .from("categories")
  .select("id, name, slug, is_active, parent_id")
  .in("slug", slugs);
if (catError) throw catError;

const bySlug = new Map(cats.map((c) => [c.slug, c]));
for (const slug of slugs) {
  const cat = bySlug.get(slug);
  if (!cat) die(`No category with slug "${slug}". Nothing to do.`);
  if (!cat.is_active) die(`Category "${cat.name}" (${slug}) is not active. Aborting.`);
}

const { data: existingProducts, error: prodError } = await db
  .from("products")
  .select("id, name, category_id")
  .in(
    "category_id",
    cats.map((c) => c.id),
  );
if (prodError) throw prodError;

console.log("\n── Plan ──");
for (const slug of slugs) {
  const cat = bySlug.get(slug);
  const already = existingProducts.filter((p) => p.category_id === cat.id);
  console.log(`\n  ${cat.name} (/products/${slug}) — ${PLAN[slug].length} product(s) to add`);
  if (already.length) {
    console.log(`    (already has ${already.length}: ${already.map((p) => p.name).join(", ")} — will not duplicate)`);
  }
  for (const item of PLAN[slug]) {
    const exists = already.some((p) => p.name.toLowerCase() === item.name.toLowerCase());
    console.log(`    ${exists ? "· already filed" : "+ " + item.name}`);
  }
}

console.log(`\n── Uploading & inserting ──`);
let sortOrder = 0;
for (const slug of slugs) {
  const cat = bySlug.get(slug);
  const already = existingProducts.filter((p) => p.category_id === cat.id);

  for (const item of PLAN[slug]) {
    if (already.some((p) => p.name.toLowerCase() === item.name.toLowerCase())) {
      console.log(`  · ${item.name} — already filed, skipped`);
      continue;
    }

    let imageUrl = item.source;
    if (!DRY) {
      const result = await cloudinary.uploader.upload(item.source, {
        folder: "awsoversea/products",
        resource_type: "image",
      });
      imageUrl = result.secure_url;
    }
    console.log(`  ${verb("Uploaded", "upload")} image for ${item.name}`);

    if (!DRY) {
      const { error } = await db.from("products").insert({
        name: item.name,
        description: item.description,
        category: cat.name,
        category_id: cat.id,
        image_url: imageUrl,
        is_active: true,
        sort_order: sortOrder,
      });
      if (error) throw error;
    }
    sortOrder += 1;
    console.log(`  ${verb("Inserted", "insert")} ${item.name} under ${cat.name}`);
  }
}

console.log(DRY ? "\nDry run — nothing written.\n" : "\nDone.\n");
