import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase/server";
import { CategoryForm, type CategoryRecord } from "@/components/admin/category-form";

export default async function AdminEditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data } = await supabaseAdmin().from("categories").select("*").eq("id", id).single();

  if (!data) notFound();

  const category: CategoryRecord = {
    id: data.id,
    name: data.name,
    description: data.description,
    image_url: data.image_url,
    parent_id: data.parent_id,
    sort_order: data.sort_order,
    is_active: data.is_active,
    child_layout: data.child_layout === "cards" ? "cards" : "inline",
  };

  return (
    <div>
      <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#5b6b82]">Catalog</p>
      <h1 className="mt-2 text-2xl font-bold text-[#1A0A53] sm:text-3xl">
        {category.parent_id ? "Edit subcategory" : "Edit category"}
      </h1>
      <CategoryForm category={category} />
    </div>
  );
}
