import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase/server";
import { ProductForm, type ProductRecord } from "@/components/admin/product-form";

export default async function AdminEditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data } = await supabaseAdmin().from("products").select("*").eq("id", id).single();

  if (!data) notFound();

  const product: ProductRecord = {
    id: data.id,
    name: data.name,
    description: data.description,
    category: data.category,
    image_url: data.image_url,
    sort_order: data.sort_order,
    is_active: data.is_active,
  };

  return (
    <div>
      <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#5b6b82]">Catalog</p>
      <h1 className="mt-2 text-2xl font-bold text-[#002144] sm:text-3xl">Edit product</h1>
      <ProductForm product={product} />
    </div>
  );
}
