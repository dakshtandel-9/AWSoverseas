#!/usr/bin/env node
/**
 * One-off: seeds the `products` table with the client's real commodity
 * list (rice, spices, furniture, chemicals, tractors, garments, fabrics,
 * leather goods, jute bags, imitation jewellery, melamine crockery, tiles,
 * electrical switches/wires, medical/surgical items). Images are stable
 * Unsplash CDN URLs (no API key needed, direct photo IDs — not the
 * deprecated source.unsplash.com redirect).
 * Run once: `node --env-file=.env scripts/seed-products.mjs`
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

const products = [
  {
    name: "Rice",
    category: "Food Grains",
    description:
      "Basmati and non-basmati rice sourced for bulk export, handled with fumigation and phytosanitary certification for international shipment.",
    image_url: img("photo-1586201375761-83865001e31c"),
  },
  {
    name: "Spices",
    category: "Food Grains",
    description:
      "Whole and ground spices — turmeric, chilli, cumin, coriander and blends — packed and certified for export-grade food safety standards.",
    image_url: img("photo-1596040033229-a9821ebd058d"),
  },
  {
    name: "Furniture",
    category: "Home & Living",
    description:
      "Wooden and metal furniture for residential and commercial use, crated with ISPM-15 treated packaging for overseas freight.",
    image_url: img("photo-1555041469-a586c61ea9bc"),
  },
  {
    name: "Chemicals",
    category: "Industrial",
    description:
      "Industrial and specialty chemicals shipped under IMDG/MSDS documentation, covering both hazardous and non-hazardous classes.",
    image_url: img("photo-1587854692152-cbe660dbde88"),
  },
  {
    name: "Tractors",
    category: "Machinery",
    description:
      "New tractors from leading brands including Solis, New Holland and Massey Ferguson, exported with full documentation and roadworthy compliance.",
    image_url: img("photo-1592982537447-7440770cbfc9"),
  },
  {
    name: "Ready Made Garments",
    category: "Textiles",
    description:
      "Men's, women's and children's apparel manufactured to order, quality-checked and export-packed for bulk international buyers.",
    image_url: img("photo-1441986300917-64674bd600d8"),
  },
  {
    name: "Fabrics",
    category: "Textiles",
    description:
      "Cotton, synthetic and blended fabric rolls sourced from mills, available in bulk yardage for garment manufacturers abroad.",
    image_url: img("photo-1620799140408-edc6dcb6d633"),
  },
  {
    name: "Leather Shoes, Ladies Chappal & Leather Bags",
    category: "Leather Goods",
    description:
      "Genuine leather footwear, ladies' chappals and handbags, manufactured for export with consistent sizing and finish across bulk orders.",
    image_url: img("photo-1560769629-975ec94e6a86"),
  },
  {
    name: "Jute Bags",
    category: "Packaging",
    description:
      "Eco-friendly jute bags in custom sizes and prints, popular with overseas retailers for sustainable packaging and promotional use.",
    image_url: img("photo-1603126857599-f6e157fa2fe6"),
  },
  {
    name: "Imitation Jewellery",
    category: "Fashion Accessories",
    description:
      "Costume and imitation jewellery — necklaces, earrings and bangles — produced in bulk designs for export to fashion retailers.",
    image_url: img("photo-1611591437281-460bfbe1220a"),
  },
  {
    name: "Melamine Crockery",
    category: "Home & Living",
    description:
      "Durable melamine plates, bowls and serveware in export-friendly bulk packs, suited for hospitality and retail buyers.",
    image_url: img("photo-1610701596007-11502861dcfa"),
  },
  {
    name: "Tiles",
    category: "Building Materials",
    description:
      "Ceramic and vitrified floor and wall tiles, palletised and export-packed to withstand long-haul sea freight.",
    image_url: img("photo-1600607687939-ce8a6c25118c"),
  },
  {
    name: "Electric Switches and Board Wires",
    category: "Electrical",
    description:
      "Modular electrical switches, switchboards and insulated wiring, sourced from certified manufacturers for bulk export orders.",
    image_url: img("photo-1621905251189-08b45d6a269e"),
  },
  {
    name: "Medicine and Surgical Items",
    category: "Healthcare",
    description:
      "Pharmaceutical products and surgical consumables exported under proper cold-chain and regulatory documentation where required.",
    image_url: img("photo-1584982751601-97dcc096659c"),
  },
];

const rows = products.map((p, i) => ({
  ...p,
  is_active: true,
  sort_order: i,
}));

const { data, error } = await db.from("products").insert(rows).select("id, name");

if (error) {
  console.error("Insert failed:", error);
  process.exit(1);
}

console.log(`Inserted ${data.length} products:`);
for (const row of data) console.log(` - ${row.name}`);
