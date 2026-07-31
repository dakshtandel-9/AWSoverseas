import { CategoryForm } from "@/components/admin/category-form";
import { getAdminCategory } from "@/lib/admin-category-tree";
import { isSupabaseConfigured } from "@/lib/supabase/status";

export default async function AdminNewCategoryPage({
  searchParams,
}: {
  searchParams: Promise<{ parent?: string }>;
}) {
  const { parent } = await searchParams;
  const parentCategory = parent && isSupabaseConfigured() ? await getAdminCategory(parent) : null;

  return (
    <div>
      <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#5b6b82]">Catalog</p>
      <h1 className="mt-2 text-2xl font-bold text-[#1A0A53] sm:text-3xl">
        {parent ? "New subcategory" : "New category"}
      </h1>
      {parentCategory && (
        <p className="mt-2 text-sm text-[#5b6b82]">
          Goes inside <span className="font-semibold text-[#1A0A53]">{parentCategory.name}</span>.
        </p>
      )}
      <CategoryForm defaultParentId={parent} />
    </div>
  );
}
