import { isSupabaseConfigured } from "@/lib/supabase/status";
import { ProductForm } from "@/components/admin/product-form";
import { listCategoryTree } from "@/lib/admin-category-tree";

export default async function AdminNewProductPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const categories = isSupabaseConfigured() ? await listCategoryTree() : [];

  return (
    <div>
      <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#5b6b82]">Catalog</p>
      <h1 className="mt-2 text-2xl font-bold text-[#1A0A53] sm:text-3xl">New product</h1>
      <ProductForm categories={categories} defaultCategoryId={category} />
    </div>
  );
}
