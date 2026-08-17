#!/usr/bin/env node
/**
 * One-off: the old Cloudinary account (dwethh3fq) that every `products.image_url`
 * and `categories.image_url` pointed to is dead (every asset now 401s, account
 * unrecoverable — no login access). This re-sources a relevant stock photo for
 * each row instead, hotlinked to the Unsplash CDN (images.unsplash.com — already
 * an allowed remote pattern in next.config.ts, same approach scripts/seed-products.mjs
 * used for the original 14-item catalog). No Cloudinary involved, matching the
 * site's move away from it.
 *
 * Every photo ID below was resolved from a real Unsplash photo page and verified
 * with a live HTTP 200 against the CDN before being added here.
 *
 * Deliberately NOT touched: city_agents.image_url (real named people — a stock
 * substitute would misrepresent who they are; needs an actual re-upload) and the
 * two transactional-email graphics / hero-slider assets (specific brand imagery,
 * not a "product we don't have a photo of").
 *
 * Run once: `node --env-file=.env scripts/recover-product-images.mjs`
 */
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (e.g. run with --env-file=.env).");
  process.exit(1);
}

const db = createClient(url, key, { auth: { persistSession: false } });

const img = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;

// One representative photo per product/category theme — same "one photo per
// bucket" convention the original 14-item seed used, just with far more buckets
// to match how granular the real catalog turned out to be.
const PHOTO = {
  rice: img("photo-1586201375761-83865001e31c"),
  spices: img("photo-1596040033229-a9821ebd058d"),
  furniture: img("photo-1555041469-a586c61ea9bc"),
  chemicals: img("photo-1587854692152-cbe660dbde88"),
  tractor: img("photo-1592982537447-7440770cbfc9"),
  apparel: img("photo-1441986300917-64674bd600d8"),
  fabrics: img("photo-1620799140408-edc6dcb6d633"),
  leatherFootwear: img("photo-1560769629-975ec94e6a86"),
  packaging: img("photo-1603126857599-f6e157fa2fe6"),
  jewellery: img("photo-1611591437281-460bfbe1220a"),
  crockery: img("photo-1610701596007-11502861dcfa"),
  tiles: img("photo-1600607687939-ce8a6c25118c"),
  pharmaMedical: img("photo-1584982751601-97dcc096659c"),

  childrenClothing: img("photo-1756626287301-5c73d6139282"),
  woodenHandicraft: img("photo-1669687769369-383d3d562445"),
  leatherBags: img("photo-1637759292654-a12cb2be085e"),
  leatherAccessories: img("photo-1614330315994-efd5ea8163a1"),
  freshVegetables: img("photo-1567547981970-2a44cc30cf66"),
  brassCopper: img("photo-1579481802836-4c56a02b36d9"),
  stainlessSteel: img("photo-1511224931379-b4e4324ea7fc"),
  flour: img("photo-1714842981153-ffeaf74e7a1a"),
  frozenFoods: img("photo-1773419808002-bab9e1f840a0"),
  woodenTemple: img("photo-1765441863467-12214bb5d729"),
  flowerPot: img("photo-1603517428838-fea2e7dc0096"),
  abaya: img("photo-1569245087840-dcf487ddbad5"),
  partyDress: img("photo-1517970640957-23d07d5ed08c"),
  loungewear: img("photo-1766056278825-55168658f120"),
  freshFruits: img("photo-1554197008-9eff9a9625f7"),
  decorative: img("photo-1727192807128-0cee790dcc83"),
  marbleStone: img("photo-1566041510394-cf7c8fe21800"),
  bamboo: img("photo-1528221297180-b340bcc21812"),
  dalsPulses: img("photo-1644432757699-bb5a01e8fb0e"),
  namkeen: img("photo-1572098873382-f8e4bf925781"),
};

// Individual fruit/vegetable shots — used only inside the Fresh Fruits /
// Fresh Vegetables categories, falling back to the basket photo above.
const FRUIT = {
  apple: img("photo-1567306226416-28f0efdc88ce"),
  banana: img("photo-1662150681339-867e940ea30d"),
  orange: img("photo-1551030797-46c120009b82"),
  guava: img("photo-1536511132770-e5058c7e8c46"),
  mango: img("photo-1524807621076-c7ba046f3f3a"),
  grapes: img("photo-1698703428304-5ea0e245e266"),
  pomegranate: img("photo-1561998289-5804fd19b83a"),
};
const VEGGIE = {
  carrot: img("photo-1562959148-2021870ff3f4"),
  tomato: img("photo-1546241491-ac6233f6051d"),
  onion: img("photo-1741517480900-8bee5b4f48df"),
  potato: img("photo-1561635741-c416a5193b6e"),
  cabbage: img("photo-1622765419521-ca4a13ea08c9"),
  cauliflower: img("photo-1613743990305-736d763f3d70"),
  garlic: img("photo-1575025120628-9d016842e612"),
  "green chilli": img("photo-1574598066641-8f166d494d35"),
  capsicum: img("photo-1621953723422-6023013f659d"),
};

// Last resort only — an asset already local to the repo (no external
// dependency), used if a product name matches nothing below.
const FALLBACK = "/hero-slider/cargo.jpg";

// `products.category` → photo, for the 141 rows that already carry a clean category.
const PRODUCT_CATEGORY_PHOTO = {
  "Accessories": PHOTO.jewellery,
  "Bamboo Products": PHOTO.bamboo,
  "Ceramic Products": PHOTO.crockery,
  "Children Clothing": PHOTO.childrenClothing,
  "COCONUT SHELL": PHOTO.chemicals,
  "Copper Products": PHOTO.brassCopper,
  "Dals & Pulses": PHOTO.dalsPulses,
  "Decorative Products": PHOTO.decorative,
  "Flour Products": PHOTO.flour,
  "Flower Pots": PHOTO.flowerPot,
  "Fresh Fruits": PHOTO.freshFruits,
  "Fresh Vegetables": PHOTO.freshVegetables,
  "Frozen Foods": PHOTO.frozenFoods,
  "Furniture": PHOTO.furniture,
  "Indian Spices": PHOTO.spices,
  "Jewellery Types": PHOTO.jewellery,
  "Leather Accessories": PHOTO.leatherAccessories,
  "Leather Bags": PHOTO.leatherBags,
  "Leather Footwear": PHOTO.leatherFootwear,
  "Namkeen Snacks": PHOTO.namkeen,
  "Packaging Products": PHOTO.packaging,
  "Rice Products": PHOTO.rice,
  "Stainless Steel Utensils": PHOTO.stainlessSteel,
  "Stone Products": PHOTO.marbleStone,
  "Wooden Handicrafts": PHOTO.woodenHandicraft,
  "Wooden Temples": PHOTO.woodenTemple,
};

// `categories.name` → photo, for the 46 category tiles (slightly different
// naming from the product categories above, e.g. "Copper Utensils" vs "Copper Products").
const CATEGORY_TABLE_PHOTO = {
  "Fabrics": PHOTO.fabrics,
  "Children Clothing": PHOTO.childrenClothing,
  "Handicraft": PHOTO.woodenHandicraft,
  "Dals, Pulses & Beans": PHOTO.dalsPulses,
  "Leather Products": PHOTO.leatherBags,
  "Fresh Vegetables": PHOTO.freshVegetables,
  "Namkeen Snacks": PHOTO.namkeen,
  "Untensils": PHOTO.stainlessSteel,
  "Grocery Products": PHOTO.flour,
  "Decorative Products": PHOTO.decorative,
  "Wooden Handicrafts": PHOTO.woodenHandicraft,
  "Imitation Jewellery": PHOTO.jewellery,
  "Flour Products": PHOTO.flour,
  "Jewellery Types": PHOTO.jewellery,
  "Ceramic Products": PHOTO.crockery,
  "Copper Utensils": PHOTO.brassCopper,
  "Indian Spices": PHOTO.spices,
  "Stainless Steel Utensils": PHOTO.stainlessSteel,
  "PHARMA AND SURGICAL PRODUCTS": PHOTO.pharmaMedical,
  "Mens Clothing": PHOTO.apparel,
  "Frozen Foods": PHOTO.frozenFoods,
  "AGRI FRESH PRODUCE": PHOTO.freshFruits,
  "Leather Footwear": PHOTO.leatherFootwear,
  "Furniture": PHOTO.furniture,
  "Rice Products": PHOTO.rice,
  "Leather Bags": PHOTO.leatherBags,
  "Accessories": PHOTO.jewellery,
  "Hazardous Chemicals": PHOTO.chemicals,
  "Stone Products": PHOTO.marbleStone,
  "Fruits & Vegetables": PHOTO.freshVegetables,
  "Tractor": PHOTO.tractor,
  "Bamboo Products": PHOTO.bamboo,
  "Women Clothing": PHOTO.apparel,
  "Brass Utensils": PHOTO.brassCopper,
  "Ceramic & Stone Products": PHOTO.crockery,
  "Leather Accessories": PHOTO.leatherAccessories,
  "Non-Hazardous Chemicals": PHOTO.chemicals,
  "Fresh Fruits": PHOTO.freshFruits,
  "Packaging Products": PHOTO.packaging,
  "Namkeen & Frozen Foods": PHOTO.namkeen,
  "Wooden Temples": PHOTO.woodenTemple,
  "Flower Pots": PHOTO.flowerPot,
  "Activated Carbon": PHOTO.chemicals,
  "Dinnerware & Crockery": PHOTO.crockery,
  "CHEMICALS -HAZARDOUS & NON HAZARDOUS": PHOTO.chemicals,
  "Clothing & Fabrics": PHOTO.fabrics,
};

// Keyword routing for the 117 products with no category — checked in order,
// first match wins. Order matters: more specific patterns (e.g. "loungewear")
// are checked before generic ones (e.g. "boys'") that would otherwise catch them first.
const KEYWORD_RULES = [
  [/party dress|princess|tulle|frock|gown|off-shoulder|one-shoulder|full flare/i, PHOTO.partyDress],
  [/abaya|kaftan|jalabiya|hijab/i, PHOTO.abaya],
  [/loungewear|nightwear|pajama|night suit|sweatpants|lounge pants/i, PHOTO.loungewear],
  [/boys'|boy's|girls'|girl's|\bkids\b|children's/i, PHOTO.childrenClothing],
  [/copper|brass|handi\b|degchi|\blagan\b|donga|kumcha|matka|surahi|bucket/i, PHOTO.brassCopper],
  [/stainless steel|tope set|drinking glasses|teapot|tea kettle|lid cookware|food storage|lemon set/i, PHOTO.stainlessSteel],
  [/dinnerware|dinner plate|\bthali\b/i, PHOTO.crockery],
  [/jewellery box/i, PHOTO.jewellery],
  [/denim fabric|cotton fabric|woven fabric|polyester|viscose|lienen/i, PHOTO.fabrics],
  [/tan loafer|women shoes/i, PHOTO.leatherFootwear],
  [/mens jeans|mens pants|mens shirt|mens tshirt|women jeans|women pants|women shirt|women tops|women tshirt/i, PHOTO.apparel],
  [/solis|new holland/i, PHOTO.tractor],
  [/medical equipment|pharma product|surgical product/i, PHOTO.pharmaMedical],
  [/black eye bean|green moong dal|red kidney bean|urad dal|white kabuli/i, PHOTO.dalsPulses],
  [/golden sella/i, PHOTO.rice],
  [/dry ginger|turmeric/i, PHOTO.spices],
  [/fortified salt/i, PHOTO.flour],
  [
    /acid slurry|acid thickener|alphox|aos powder|\bbkc\b|\bcapb\b|caserol|castor oil|caustic soda|\bcbsx\b|\bcdea\b|activated carbon|\begms\b|glycerin|\bllp\b|oxalic acid|peppermint oil|pine oil|\bsles\b|sls powder|soda ash|sodium sulf|stearic acid|\bstpp\b|\btro\b|technical grade urea/i,
    PHOTO.chemicals,
  ],
];

function photoForProduct(name, category) {
  const lower = name.toLowerCase();
  if (category === "Fresh Fruits") {
    const hit = Object.keys(FRUIT).find((k) => lower.includes(k));
    if (hit) return FRUIT[hit];
  }
  if (category === "Fresh Vegetables") {
    const hit = Object.keys(VEGGIE).find((k) => lower.includes(k));
    if (hit) return VEGGIE[hit];
  }
  if (category && PRODUCT_CATEGORY_PHOTO[category]) return PRODUCT_CATEGORY_PHOTO[category];
  for (const [pattern, photo] of KEYWORD_RULES) {
    if (pattern.test(name)) return photo;
  }
  return FALLBACK;
}

async function main() {
  const { data: products, error: productsErr } = await db
    .from("products")
    .select("id, name, category, image_url");
  if (productsErr) throw productsErr;

  const { data: categories, error: categoriesErr } = await db
    .from("categories")
    .select("id, name, image_url");
  if (categoriesErr) throw categoriesErr;

  let fixed = 0;
  let fellBack = 0;
  for (const p of products) {
    if (!p.image_url?.includes("dwethh3fq")) continue;
    const photo = photoForProduct(p.name, p.category);
    if (photo === FALLBACK) fellBack++;
    const { error } = await db.from("products").update({ image_url: photo }).eq("id", p.id);
    if (error) {
      console.error(`FAILED product ${p.id} (${p.name}):`, error.message);
      continue;
    }
    fixed++;
  }
  console.log(`Products: ${fixed} updated (${fellBack} on the local fallback photo).`);

  let catFixed = 0;
  for (const c of categories) {
    if (!c.image_url?.includes("dwethh3fq")) continue;
    const photo = CATEGORY_TABLE_PHOTO[c.name] ?? FALLBACK;
    const { error } = await db.from("categories").update({ image_url: photo }).eq("id", c.id);
    if (error) {
      console.error(`FAILED category ${c.id} (${c.name}):`, error.message);
      continue;
    }
    catFixed++;
  }
  console.log(`Categories: ${catFixed} updated.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
