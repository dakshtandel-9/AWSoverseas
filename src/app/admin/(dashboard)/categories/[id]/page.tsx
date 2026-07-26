import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, FolderTree, Package, Pencil, Plus } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/status";
import { SetupNotice } from "@/components/admin/setup-notice";
import { CategoryListGrid } from "@/components/admin/category-list-grid";
import { ProductListGrid } from "@/components/admin/product-list-grid";
import { getAdminCategory, getAdminTrail, listAdminCategories } from "@/lib/admin-category-tree";

export default async function AdminCategoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!isSupabaseConfigured()) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-[#002144] sm:text-3xl">Category</h1>
        <div className="mt-6">
          <SetupNotice />
        </div>
      </div>
    );
  }

  const category = await getAdminCategory(id);
  if (!category) notFound();

  const db = supabaseAdmin();
  const [subcategories, trail, { data: productRows }] = await Promise.all([
    listAdminCategories(id),
    getAdminTrail(id),
    db
      .from("products")
      .select("id, name, image_url, is_active, sort_order")
      .eq("category_id", id)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false }),
  ]);

  const products = (productRows ?? []).map((p) => ({ ...p, categoryName: category.name }));

  // Branch or leaf: whichever it already holds is the only thing it can take
  // more of. An empty category can still become either.
  const isBranch = subcategories.length > 0;
  const isLeaf = products.length > 0;

  return (
    <div>
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-[#5b6b82]">
        <Link href="/admin/categories" className="hover:text-maroon-admin">
          Categories
        </Link>
        {trail.map((step, i) => (
          <span key={step.id} className="flex items-center gap-1.5">
            <ChevronRight className="size-3.5 text-[#94a3b8]" />
            {i === trail.length - 1 ? (
              <span className="font-semibold text-[#002144]">{step.name}</span>
            ) : (
              <Link href={`/admin/categories/${step.id}`} className="hover:text-maroon-admin">
                {step.name}
              </Link>
            )}
          </span>
        ))}
      </nav>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#002144] sm:text-3xl">{category.name}</h1>
          <p className="mt-2 max-w-2xl text-sm text-[#5b6b82]">
            {isBranch
              ? "This category holds subcategories, so products go inside those — not here."
              : isLeaf
                ? "This category holds products directly, so it can't also contain subcategories."
                : "Empty. Add subcategories to group things further, or add products directly — whichever you add first is what this category holds from now on."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/admin/categories/${category.id}/edit`}
            className="inline-flex items-center gap-2 rounded-full border border-[#e4e9f2] px-5 py-2.5 text-sm font-semibold text-[#002144] transition-colors hover:bg-[#f6f8fc]"
          >
            <Pencil className="size-4" />
            Edit category
          </Link>

          {!isLeaf && (
            <Link
              href={`/admin/categories/new?parent=${category.id}`}
              className="inline-flex items-center gap-2 rounded-full btn-navy px-5 py-2.5 text-sm font-semibold text-white transition-colors"
            >
              <Plus className="size-4" />
              New subcategory
            </Link>
          )}

          {!isBranch && (
            <Link
              href={`/admin/products/new?category=${category.id}`}
              className="inline-flex items-center gap-2 rounded-full btn-navy px-5 py-2.5 text-sm font-semibold text-white transition-colors"
            >
              <Plus className="size-4" />
              New product
            </Link>
          )}
        </div>
      </div>

      {isBranch || !isLeaf ? (
        <section className="mt-10">
          <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-[#002144]">
            <FolderTree className="size-4" />
            Subcategories
          </h2>
          <div className="mt-5">
            <CategoryListGrid categories={subcategories} />
          </div>
        </section>
      ) : null}

      {isLeaf || !isBranch ? (
        <section className="mt-10">
          <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-[#002144]">
            <Package className="size-4" />
            Products
          </h2>
          <div className="mt-5">
            <ProductListGrid products={products} />
          </div>
        </section>
      ) : null}
    </div>
  );
}
