#!/usr/bin/env node
/**
 * Splits the Chemical category into Hazardous and Non-Hazardous subcategories
 * and files its 29 products under one or the other.
 *
 * The two classes ship under completely different rules — UN packing, an MSDS,
 * a DG declaration and a carrier cleared to take it on one side; ordinary
 * general cargo on the other — so it's the split a buyer navigates by.
 *
 * Three steps, in this order, because the branch-or-leaf triggers forbid a
 * category from holding products and subcategories at the same time:
 *   1. detach every product from Chemical (category_id = null is always legal)
 *   2. create the two subcategories under it
 *   3. file each product into its subcategory
 *
 * Classification is by transport class, not by how nasty the drum is to handle:
 * a chemical is Hazardous here if it ships as dangerous goods (Class 8
 * corrosives, Class 3 flammables). Names are matched exactly against the two
 * lists below and the script refuses to run if a product in Chemical appears in
 * neither — a new product must be classified deliberately, not defaulted.
 *
 * Idempotent and resumable: products already filed are left alone, and a re-run
 * after a partial failure picks up whatever was detached but not yet filed.
 *
 * Run: `node --env-file=.env scripts/split-chemical-haz.mjs`
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

const PARENT_SLUG = "chemical";

const HAZARDOUS = {
  name: "Hazardous Chemicals",
  slug: "hazardous-chemicals",
  sort_order: 0,
  description:
    "Chemicals that travel as dangerous goods — corrosives and flammables that need a UN-approved container, an MSDS, a signed DG declaration and a carrier cleared to take the class. Our export desk files all of it and books the routing that will actually accept the drum.",
  // Class 8 corrosives, plus one Class 3 flammable (pine oil, UN 1272).
  products: [
    "Caustic Soda",
    "Caustic Soda Lye",
    "Acid Slurry",
    "Oxalic Acid",
    "BKC",
    "Pine Oil 32%",
  ],
};

const NON_HAZARDOUS = {
  name: "Non-Hazardous Chemicals",
  slug: "non-hazardous-chemicals",
  sort_order: 1,
  description:
    "Chemicals that move as general cargo — surfactants, builders, salts and oils with no DG class against them. No dangerous-goods surcharge and no restricted routing, so they consolidate with the rest of your order in drums, bags or IBCs.",
  products: [
    "SLS POWDER",
    "SLS Powder",
    "Peppermint Oil",
    "Technical Grade Urea",
    "EGMS",
    "Stearic Acid",
    "Glycerin",
    "CBSX",
    "LLP",
    "STPP",
    "AOS Powder",
    "CDEA",
    "CAPB",
    "Acid Thickener",
    "TRO 70%",
    "Castor Oil",
    "Alphox 200",
    "Fortified Salt",
    "Sodium Sulfite",
    "Sodium Sulphate",
    "Soda Ash",
    "SLES 70%",
  ],
};

const SUBCATEGORIES = [HAZARDOUS, NON_HAZARDOUS];

/** The DB has stray double spaces and mixed case in product names. */
const norm = (s) => s.trim().toLowerCase().replace(/\s+/g, " ");

const TARGET_BY_NAME = new Map();
for (const sub of SUBCATEGORIES) {
  for (const name of sub.products) TARGET_BY_NAME.set(norm(name), sub);
}

const verb = (past, base) => (DRY ? `to ${base}` : past);
const die = (msg) => {
  console.error(msg);
  process.exit(1);
};

// ── The category ───────────────────────────────────────────────────────
const { data: parent, error: parentError } = await db
  .from("categories")
  .select("id, name, slug, child_layout")
  .eq("slug", PARENT_SLUG)
  .maybeSingle();

if (parentError) throw parentError;
if (!parent) die(`No category with slug "${PARENT_SLUG}". Nothing to do.`);

const { data: subRows, error: subError } = await db
  .from("categories")
  .select("id, slug")
  .eq("parent_id", parent.id);

if (subError) throw subError;
const existingSubs = new Map(subRows.map((c) => [c.slug, c]));
const strays = subRows.filter((c) => !SUBCATEGORIES.some((s) => s.slug === c.slug));
if (strays.length) {
  die(
    `${parent.name} already has subcategories this script doesn't know about ` +
      `(${strays.map((c) => c.slug).join(", ")}). Sort those out by hand first.`,
  );
}

// ── The products to move ───────────────────────────────────────────────
// Rows still on the parent, plus anything a half-finished run left unfiled.
const subIds = [...existingSubs.values()].map((c) => c.id);
const { data: allProducts, error: productError } = await db
  .from("products")
  .select("id, name, category_id, is_active");

if (productError) throw productError;

const inScope = allProducts.filter(
  (p) => p.category_id === parent.id || (p.category_id === null && TARGET_BY_NAME.has(norm(p.name))),
);
const alreadyFiled = allProducts.filter((p) => subIds.includes(p.category_id));

const unclassified = inScope.filter((p) => !TARGET_BY_NAME.has(norm(p.name)));
if (unclassified.length) {
  die(
    `These products in ${parent.name} are in neither list — add them to HAZARDOUS or ` +
      `NON_HAZARDOUS in this script, then re-run:\n` +
      unclassified.map((p) => `  · ${p.name}`).join("\n"),
  );
}

const plan = inScope.map((p) => ({ product: p, target: TARGET_BY_NAME.get(norm(p.name)) }));

console.log(`\n── Plan for ${parent.name} ──`);
for (const sub of SUBCATEGORIES) {
  const moving = plan.filter((row) => row.target === sub);
  const settled = alreadyFiled.filter((p) => p.category_id === existingSubs.get(sub.slug)?.id);
  console.log(`\n  ${sub.name} — ${moving.length + settled.length} product(s)`);
  for (const { product } of moving) {
    console.log(`    + ${product.name}${product.is_active ? "" : "  (hidden)"}`);
  }
  for (const p of settled) console.log(`    · ${p.name} — already filed`);
}

// ── 1. Detach, so the parent stops holding products ────────────────────
console.log(`\n── Moving ──`);
const attached = plan.filter(({ product }) => product.category_id === parent.id);
if (attached.length) {
  if (!DRY) {
    const { error } = await db
      .from("products")
      .update({ category_id: null })
      .in(
        "id",
        attached.map(({ product }) => product.id),
      );
    if (error) throw error;
  }
  console.log(`  ${verb("Detached", "detach")} ${attached.length} product(s) from ${parent.name}`);
}

// ── 2. Create the subcategories ────────────────────────────────────────
for (const sub of SUBCATEGORIES) {
  if (existingSubs.has(sub.slug)) {
    console.log(`  · ${sub.name} — already there, left alone`);
    continue;
  }
  if (!DRY) {
    const { data, error } = await db
      .from("categories")
      .insert({
        name: sub.name,
        slug: sub.slug,
        description: sub.description,
        sort_order: sub.sort_order,
        parent_id: parent.id,
        image_url: "",
        is_active: true,
        child_layout: "inline",
      })
      .select("id, slug")
      .single();
    if (error) throw error;
    existingSubs.set(sub.slug, data);
  }
  console.log(`  + ${sub.name} ${verb("created", "create")} (/products/${sub.slug})`);
}

// ── 3. File each product ───────────────────────────────────────────────
for (const sub of SUBCATEGORIES) {
  const moving = plan.filter((row) => row.target === sub);
  if (!moving.length) continue;
  if (!DRY) {
    const { error } = await db
      .from("products")
      .update({ category_id: existingSubs.get(sub.slug).id })
      .in(
        "id",
        moving.map(({ product }) => product.id),
      );
    if (error) throw error;
  }
  console.log(`  ${verb("Filed", "file")} ${moving.length} product(s) under ${sub.name}`);
}

// ── 4. Two pages, not two stacked grids on the parent ──────────────────
if (parent.child_layout !== "cards") {
  if (!DRY) {
    const { error } = await db.from("categories").update({ child_layout: "cards" }).eq("id", parent.id);
    if (error) throw error;
  }
  console.log(`  ${verb("Set", "set")} ${parent.name} subcategory layout '${parent.child_layout}' → 'cards'`);
}

console.log(
  DRY
    ? "\nDry run — nothing written.\n"
    : "\nDone. Add a photo to each from Admin → Categories → Chemical.\n",
);
