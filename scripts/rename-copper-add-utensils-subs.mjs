#!/usr/bin/env node
/**
 * Renames the "Copper" subcategory of Untensils to "Copper Utensils" (slug
 * stays copper-utensils, so no links break), and adds two sibling
 * subcategories: Stainless Steel Utensils and Brass Utensils.
 *
 * Run: `node --env-file=.env scripts/rename-copper-add-utensils-subs.mjs`
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

const PARENT_SLUG = "untensils";
const COPPER_SLUG = "copper-utensils";

const NEW_SUBS = [
  { name: "Stainless Steel Utensils", slug: "stainless-steel-utensils", sort_order: 1 },
  { name: "Brass Utensils", slug: "brass-utensils", sort_order: 2 },
];

const verb = (past, base) => (DRY ? `to ${base}` : past);
const die = (msg) => {
  console.error(msg);
  process.exit(1);
};

const { data: parent, error: parentError } = await db
  .from("categories")
  .select("id, name, slug")
  .eq("slug", PARENT_SLUG)
  .maybeSingle();
if (parentError) throw parentError;
if (!parent) die(`No category with slug "${PARENT_SLUG}". Nothing to do.`);

const { data: copper, error: copperError } = await db
  .from("categories")
  .select("id, name, slug, parent_id")
  .eq("slug", COPPER_SLUG)
  .maybeSingle();
if (copperError) throw copperError;
if (!copper) die(`No category with slug "${COPPER_SLUG}" under ${parent.name}. Nothing to do.`);
if (copper.parent_id !== parent.id) die(`"${copper.name}" is not a child of ${parent.name}. Aborting.`);

console.log(`\n── Plan for ${parent.name} ──`);
console.log(`  ${copper.name} → "Copper Utensils" (slug unchanged: ${COPPER_SLUG})`);
for (const sub of NEW_SUBS) {
  console.log(`  + ${sub.name} (/products/${sub.slug})`);
}

// ── 1. Rename Copper → Copper Utensils ─────────────────────────────────
if (copper.name !== "Copper Utensils") {
  if (!DRY) {
    const { error } = await db.from("categories").update({ name: "Copper Utensils" }).eq("id", copper.id);
    if (error) throw error;
  }
  console.log(`\n  ${verb("Renamed", "rename")} "${copper.name}" → "Copper Utensils"`);
} else {
  console.log(`\n  · Already named "Copper Utensils" — left alone`);
}

// ── 2. Create the two new subcategories ────────────────────────────────
const { data: existingRows, error: existingError } = await db
  .from("categories")
  .select("id, slug")
  .in(
    "slug",
    NEW_SUBS.map((s) => s.slug),
  );
if (existingError) throw existingError;
const existing = new Map(existingRows.map((c) => [c.slug, c]));

for (const sub of NEW_SUBS) {
  if (existing.has(sub.slug)) {
    console.log(`  · ${sub.name} — already there, left alone`);
    continue;
  }
  if (!DRY) {
    const { error } = await db.from("categories").insert({
      name: sub.name,
      slug: sub.slug,
      description: "",
      sort_order: sub.sort_order,
      parent_id: parent.id,
      image_url: "",
      is_active: true,
      child_layout: "inline",
    });
    if (error) throw error;
  }
  console.log(`  + ${sub.name} ${verb("created", "create")} (/products/${sub.slug})`);
}

console.log(
  DRY
    ? "\nDry run — nothing written.\n"
    : "\nDone. Add a photo and description to each new subcategory from Admin → Categories → Untensils.\n",
);
