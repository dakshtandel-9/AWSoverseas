import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase/server";
import { ProductForm, type ProductRecord } from "@/components/admin/product-form";
import { listProductTargets } from "@/lib/admin-category-tree";

export default async function AdminEditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = supabaseAdmin();
  const [{ data }, categories] = await Promise.all([
    db.from("products").select("*").eq("id", id).single(),
    listProductTargets(),
  ]);

  if (!data) notFound();

  const product: ProductRecord = {
    id: data.id,
    name: data.name,
    description: data.description,
    category_id: data.category_id,
    image_url: data.image_url,
    sort_order: data.sort_order,
    is_active: data.is_active,
  };

  return (
    <div>
      <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#5b6b82]">Catalog</p>
      <h1 className="mt-2 text-2xl font-bold text-[#1A0A53] sm:text-3xl">Edit subproduct</h1>
      <ProductForm product={product} categories={categories} />
    </div>
  );
}
