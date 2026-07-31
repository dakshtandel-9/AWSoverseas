#!/usr/bin/env node
/**
 * One-off repair for the catalog: 53 products had no `category_id`, so they
 * were on no page at all. Their old free-text `products.category` column still
 * named the group they belonged to (Namkeen Snacks, Frozen Foods, Wooden
 * Temples, Decorative Products) — those groups had simply never been created as
 * category rows. The rest were either real products that lost their category
 * (copper bottles, apparel, dinnerware) or leftovers from before categories
 * existed: all-caps rows duplicating a category name, plus three test rows.
 *
 * Creates the missing categories, files every real product, and hides the
 * leftovers (hidden, not deleted — `is_active = false` is one click to undo).
 *
 * Idempotent: re-running it changes nothing. Names are matched with whitespace
 * collapsed and case ignored, and anything it can't place is reported rather
 * than skipped silently.
 *
 * Run: `node --env-file=.env scripts/fix-catalog.mjs`
 * Add `--dry` to print the plan without writing.
 */
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const DRY = process.argv.includes("--dry");

if (!url || !key) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (run with --env-file=.env).");
  process.exit(1);
}

const db = createClient(url, key, { auth: { persistSession: false } });

/** Names in this file are written for humans; the DB has stray double spaces. */
const norm = (s) => s.trim().toLowerCase().replace(/\s+/g, " ");

// ── Categories to create ────────────────────────────────────────────────
// `under` is the parent's name (null = top level). Order matters: a parent must
// be created before its children, so branches come before leaves.
const NEW_CATEGORIES = [
  {
    name: "Namkeen & Frozen Foods",
    under: "Food Products",
    sort_order: 3,
    description:
      "Traditional Indian namkeen and frozen ready-to-cook foods, packed and cold-chain shipped to export food safety standards.",
    imageFrom: "Bhujia",
  },
  {
    name: "Namkeen Snacks",
    under: "Namkeen & Frozen Foods",
    sort_order: 0,
    description:
      "Bhujia, sev, mixture and other savoury Indian snacks, made to order and packed in retail or bulk formats.",
    imageFrom: "Bhujia",
  },
  {
    name: "Frozen Foods",
    under: "Namkeen & Frozen Foods",
    sort_order: 1,
    description:
      "Frozen parathas, samosas, paneer and ready meals, shipped under an unbroken cold chain with full export documentation.",
    imageFrom: "Frozen Samosas",
  },
  {
    name: "Wooden Temples",
    under: "Handicraft",
    sort_order: 5,
    description:
      "Hand-carved mandirs in sheesham, teak and sevan wood, crated with ISPM-15 treated packaging for overseas freight.",
    imageFrom: "Sheesham Wood Temple",
  },
  {
    name: "Decorative Products",
    under: "Handicraft",
    sort_order: 6,
    description:
      "Wall art, pendant lamps, shelving and floral pieces for interiors, made by hand in repeatable bulk runs.",
    imageFrom: "Wall Painting",
  },
  {
    name: "Garments & Textiles",
    under: null,
    sort_order: 8,
    description:
      "Women's apparel manufactured to order — tunics, dresses, kaftans and ponchos — quality-checked and export-packed for bulk buyers.",
    imageFrom: "Sleeveless A line Dress",
  },
  {
    name: "Dinnerware & Crockery",
    under: null,
    sort_order: 9,
    description:
      "Melamine and steel dinner sets, thalis and serveware in export-friendly bulk packs, suited to hospitality and retail buyers.",
    imageFrom: "ROYAL DINNERWARE COLLECTION",
  },
];

// ── Where each unfiled product belongs ──────────────────────────────────
const FILE_UNDER = {
  "Namkeen Snacks": ["Bhujia", "Sev", "Mixture", "Chakli", "Mathri", "Moong Dal Snack"],
  "Frozen Foods": [
    "Frozen Parathas",
    "Frozen Samosas",
    "Frozen Vegetables",
    "Frozen Paneer",
    "Frozen Snacks",
    "Frozen Ready Meals",
  ],
  "Wooden Temples": [
    "Sheesham Wood Temple",
    "Sevan Wood Temple",
    "Teak Wood Temple",
    "Hardwood Temple",
  ],
  "Decorative Products": [
    "Wall Painting",
    "Room Racks & Shelves",
    "Floral Arrangement",
    "Hemp Pendant Lamps",
  ],
  "Copper Products": [
    "Artistic copper bottle",
    "Classic Copper Bottle",
    "Copper matka foral print",
    "Surahi Copper Bottle",
    "Chrome plated copper bottle",
  ],
  "Garments & Textiles": [
    "Halter With Smocking Back",
    "Sleeveless A line Dress",
    "Pintuck Shirt",
    "Button Down Collared Tunic",
    "V Neck Tassel Poncho",
    "Boat Neck Tassel Kaftan",
    "V Neck Tunic",
  ],
  "Dinnerware & Crockery": [
    "ECO URMI DINNERWARE COLLECTION",
    "ROYAL DINNERWARE COLLECTION",
    "PLATO GLOSS DINNER PLATE",
    "Premium Thali Plates with 8 Separators",
    "Sada Khumcha Thali",
  ],
  "Leather Footwear": ["Tan Loafer"],
  "Rice Products": ["India Gate Classic Basmati Rice"],
};

// Leftovers: three test rows, and all-caps rows that duplicate a category that
// now exists in its own right. Hidden rather than deleted.
const HIDE = [
  "dfgh",
  "meta",
  "test",
  "ELECTRIC SWITICHES & WIRES",
  "READY MADE GARMENT & FABRICS",
  "FRUITS & VEGETABLES",
  "STAINLESS STELL UTENSILS",
  "CHEMICALS",
  "MEDICINE & MEDICAL EQUPMENTS",
  "IMITATION JEWELLERYS",
  "FURNITURES",
  "TRACTORS & BATTERY VEHICLES",
  "LEATHER PRODUCTS",
  "CROCERY",
];

const slugify = (name) =>
  name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

async function loadCategories() {
  const { data, error } = await db.from("categories").select("id, name, slug, parent_id");
  if (error) throw error;
  return new Map(data.map((c) => [norm(c.name), c]));
}

async function loadProducts() {
  const { data, error } = await db.from("products").select("id, name, image_url, category_id, is_active");
  if (error) throw error;
  const byName = new Map();
  for (const p of data) {
    // Two rows could share a normalised name; keep the unfiled one, which is
    // the row this repair is about.
    const existing = byName.get(norm(p.name));
    if (!existing || (existing.category_id && !p.category_id)) byName.set(norm(p.name), p);
  }
  return byName;
}

const verb = (past, base) => (DRY ? `to ${base}` : past);
let created = 0;
let filed = 0;
let hidden = 0;
const problems = [];

let categories = await loadCategories();
const products = await loadProducts();

// ── 1. Create the missing categories ───────────────────────────────────
console.log("\n── Categories ──");
for (const spec of NEW_CATEGORIES) {
  if (categories.has(norm(spec.name))) {
    console.log(`  = ${spec.name} — already exists`);
    continue;
  }

  let parentId = null;
  if (spec.under) {
    const parent = categories.get(norm(spec.under));
    if (!parent) {
      problems.push(`No parent "${spec.under}" for new category "${spec.name}" — skipped.`);
      continue;
    }
    parentId = parent.id;
  }

  const source = products.get(norm(spec.imageFrom));
  if (!source?.image_url) {
    problems.push(`No photo available for "${spec.name}" (wanted ${spec.imageFrom}'s) — skipped.`);
    continue;
  }

  console.log(`  + ${spec.name}${spec.under ? ` (inside ${spec.under})` : " (top level)"}`);
  created++;

  if (DRY) {
    // Let later steps resolve against it so the dry run reports the full plan.
    categories.set(norm(spec.name), { id: `dry-${slugify(spec.name)}`, name: spec.name });
    continue;
  }

  const { error } = await db.from("categories").insert({
    name: spec.name,
    slug: slugify(spec.name),
    description: spec.description,
    image_url: source.image_url,
    parent_id: parentId,
    sort_order: spec.sort_order,
    is_active: true,
  });

  if (error) {
    problems.push(`Creating "${spec.name}" failed: ${error.message}`);
    continue;
  }
  categories = await loadCategories();
}

// ── 2. File the unfiled products ───────────────────────────────────────
console.log("\n── Filing products ──");
for (const [categoryName, names] of Object.entries(FILE_UNDER)) {
  const category = categories.get(norm(categoryName));
  if (!category) {
    problems.push(`No category "${categoryName}" — its ${names.length} products stay unfiled.`);
    continue;
  }

  let order = 0;
  for (const name of names) {
    const product = products.get(norm(name));
    if (!product) {
      problems.push(`No product named "${name}" — nothing filed.`);
      continue;
    }
    if (product.category_id) {
      console.log(`  = ${name} — already filed`);
      order++;
      continue;
    }

    console.log(`  → ${name}  ⇒  ${categoryName}`);
    filed++;
    order++;

    if (DRY) continue;
    const { error } = await db
      .from("products")
      .update({ category_id: category.id, sort_order: order - 1 })
      .eq("id", product.id);
    if (error) problems.push(`Filing "${name}" failed: ${error.message}`);
  }
}

// ── 3. Hide the leftovers ──────────────────────────────────────────────
console.log("\n── Hiding leftovers ──");
for (const name of HIDE) {
  const product = products.get(norm(name));
  if (!product) {
    problems.push(`No product named "${name}" — nothing hidden.`);
    continue;
  }
  if (!product.is_active) {
    console.log(`  = ${name} — already hidden`);
    continue;
  }

  console.log(`  × ${name}`);
  hidden++;

  if (DRY) continue;
  const { error } = await db.from("products").update({ is_active: false }).eq("id", product.id);
  if (error) problems.push(`Hiding "${name}" failed: ${error.message}`);
}

console.log(
  `\n${DRY ? "[dry run] " : ""}${created} categories ${verb("created", "create")}, ` +
    `${filed} products ${verb("filed", "file")}, ${hidden} ${verb("hidden", "hide")}.`,
);

if (problems.length > 0) {
  console.log("\n── Needs attention ──");
  for (const p of problems) console.log(`  ! ${p}`);
  process.exitCode = 1;
}
