import { CategoryForm } from "@/components/admin/category-form";
import { isSupabaseConfigured } from "@/lib/supabase/status";
import { listParentOptions } from "@/lib/admin-category-tree";

export default async function AdminNewCategoryPage({
  searchParams,
}: {
  searchParams: Promise<{ parent?: string }>;
}) {
  const { parent } = await searchParams;
  const parentOptions = isSupabaseConfigured() ? await listParentOptions() : [];

  return (
    <div>
      <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#5b6b82]">Catalog</p>
      <h1 className="mt-2 text-2xl font-bold text-[#002144] sm:text-3xl">
        {parent ? "New subcategory" : "New category"}
      </h1>
      <CategoryForm parentOptions={parentOptions} defaultParentId={parent} />
    </div>
  );
}
