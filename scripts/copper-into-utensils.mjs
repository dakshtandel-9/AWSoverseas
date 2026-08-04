#!/usr/bin/env node
/**
 * Files the copper range inside Utensils.
 *
 * "Copper Products" sat at the top level next to "Untensils", which held twelve
 * generic utensil rows (Bottle, Jar, Glass, Thali/Plates…) directly. This moves
 * the thirteen copper items into a new "Copper" subcategory under Utensils,
 * deletes those twelve rows, and retires the now-empty top-level category.
 *
 * Order is forced by the branch-or-leaf triggers in schema.sql: a category
 * holds subcategories or products, never both, so the twelve have to go before
 * Utensils will accept a child. The delete is permanent — no enquiry rows point
 * at any of the twelve, and product_enquiries snapshots product_name anyway.
 *
 * The switched-off UTENTELSIS tree is left alone. It already owns the `copper`
 * slug, which is why the new subcategory is named Copper but slugged
 * copper-utensils.
 *
 * Idempotent: re-running it changes nothing. Anything it can't resolve is
 * reported rather than skipped silently.
 *
 * Run: `node --env-file=.env scripts/copper-into-utensils.mjs`
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
const SOURCE_SLUG = "copper-products";
const NEW_CATEGORY = {
  name: "Copper",
  slug: "copper-utensils",
  child_layout: "inline",
  sort_order: 0,
};

/** The twelve rows to delete, listed by name so a surprise row is never hit. */
const DROP = [
  "Bottle",
  "Jar",
  "Glass",
  "Thali/Plates",
  "Kadhai/Tasla",
  "Casserole",
  "Tope/Patiala",
  "Bowl/Fancy Bowl",
  "Drum/Container",
  "Tiffin",
  "Bucket",
  "Dabba/Canisters",
];

const norm = (s) => s.trim().toLowerCase().replace(/\s+/g, " ");
const verb = (past, base) => (DRY ? `to ${base}` : past);
const problems = [];

async function categoryBySlug(slug) {
  const { data, error } = await db.from("categories").select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  return data;
}

const parent = await categoryBySlug(PARENT_SLUG);
const source = await categoryBySlug(SOURCE_SLUG);
if (!parent) {
  console.error(`No category with slug "${PARENT_SLUG}" — nothing to do.`);
  process.exit(1);
}

// ── 1. Delete the loose utensil rows ───────────────────────────────────
console.log("\n── Removing loose products from Utensils ──");
const { data: loose, error: looseError } = await db
  .from("products")
  .select("id, name")
  .eq("category_id", parent.id);
if (looseError) throw looseError;

const wanted = new Set(DROP.map(norm));
const unexpected = loose.filter((p) => !wanted.has(norm(p.name)));
for (const p of unexpected) {
  problems.push(`"${p.name}" sits in Utensils but is not on the delete list — left in place.`);
}

let dropped = 0;
for (const name of DROP) {
  const row = loose.find((p) => norm(p.name) === norm(name));
  if (!row) {
    console.log(`  = ${name} — already gone`);
    continue;
  }
  console.log(`  × ${name}`);
  dropped++;
  if (DRY) continue;
  const { error } = await db.from("products").delete().eq("id", row.id);
  if (error) problems.push(`Deleting "${name}" failed: ${error.message}`);
}

// A leftover row would make the next step fail with parent_has_products, so
// stop here rather than half-applying the move.
if (!DRY && unexpected.length > 0) {
  console.log("\n── Needs attention ──");
  for (const p of problems) console.log(`  ! ${p}`);
  console.log("\nUtensils still holds products, so it cannot take a subcategory. Stopped.");
  process.exit(1);
}

// ── 2. Create the Copper subcategory ───────────────────────────────────
console.log("\n── Subcategory ──");
let target = await categoryBySlug(NEW_CATEGORY.slug);
if (target) {
  console.log(`  = ${NEW_CATEGORY.name} — already exists`);
} else {
  console.log(`  + ${NEW_CATEGORY.name} (inside ${parent.name})`);
  if (DRY) {
    target = { id: "dry-copper", name: NEW_CATEGORY.name };
  } else {
    const { data, error } = await db
      .from("categories")
      .insert({
        ...NEW_CATEGORY,
        // The retiring top-level category's own words and photo carry over.
        description: source?.description ?? "",
        image_url: source?.image_url ?? "",
        parent_id: parent.id,
        is_active: true,
      })
      .select("*")
      .single();
    if (error) {
      console.error(`Creating "${NEW_CATEGORY.name}" failed: ${error.message}`);
      process.exit(1);
    }
    target = data;
  }
}

// ── 3. Move the copper products across ─────────────────────────────────
console.log("\n── Filing copper products ──");
let moved = 0;
if (!source) {
  console.log(`  = no "${SOURCE_SLUG}" category — already moved`);
} else {
  // Same order the site reads them in, so the grid keeps its current sequence.
  const { data: copper, error } = await db
    .from("products")
    .select("id, name")
    .eq("category_id", source.id)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw error;

  let order = 0;
  for (const product of copper) {
    console.log(`  → ${product.name}`);
    moved++;
    const position = order++;
    if (DRY) continue;
    const { error: moveError } = await db
      .from("products")
      .update({ category_id: target.id, sort_order: position })
      .eq("id", product.id);
    if (moveError) problems.push(`Moving "${product.name}" failed: ${moveError.message}`);
  }
  if (copper.length === 0) console.log("  = nothing left to move");
}

// ── 4. Retire the empty top-level category ─────────────────────────────
console.log("\n── Top-level Copper Products ──");
if (!source) {
  console.log("  = gone already");
} else if (!source.is_active) {
  console.log("  = already hidden");
} else {
  console.log(`  × hiding "${source.name}" — its products now live under ${parent.name}`);
  if (!DRY) {
    const { error } = await db.from("categories").update({ is_active: false }).eq("id", source.id);
    if (error) problems.push(`Hiding "${source.name}" failed: ${error.message}`);
  }
}

console.log(
  `\n${DRY ? "[dry run] " : ""}${dropped} products ${verb("deleted", "delete")}, ` +
    `${moved} copper products ${verb("moved", "move")}.`,
);

if (problems.length > 0) {
  console.log("\n── Needs attention ──");
  for (const p of problems) console.log(`  ! ${p}`);
  process.exitCode = 1;
}
