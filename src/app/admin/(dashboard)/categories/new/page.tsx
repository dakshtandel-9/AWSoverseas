import { CategoryForm } from "@/components/admin/category-form";

export default async function AdminNewCategoryPage({
  searchParams,
}: {
  searchParams: Promise<{ parent?: string }>;
}) {
  const { parent } = await searchParams;

  return (
    <div>
      <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#5b6b82]">Catalog</p>
      <h1 className="mt-2 text-2xl font-bold text-[#1A0A53] sm:text-3xl">
        {parent ? "New product" : "New category"}
      </h1>
      <CategoryForm defaultParentId={parent} />
    </div>
  );
}
