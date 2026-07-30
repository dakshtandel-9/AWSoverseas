import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Package, Pencil, Plus } from "lucide-react";
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
        <h1 className="text-2xl font-bold text-[#1A0A53] sm:text-3xl">Category</h1>
        <div className="mt-6">
          <SetupNotice />
        </div>
      </div>
    );
  }

  const category = await getAdminCategory(id);
  if (!category) notFound();

  const db = supabaseAdmin();
  const [products, trail, { data: subproductRows }] = await Promise.all([
    listAdminCategories(id),
    getAdminTrail(id),
    db
      .from("products")
      .select("id, name, image_url, is_active, sort_order")
      .eq("category_id", id)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false }),
  ]);

  const subproducts = (subproductRows ?? []).map((p) => ({ ...p, categoryName: category.name }));

  // Two levels, decided by where this row sits: a top-level row is a category
  // and holds products; anything nested is a product and holds subproducts.
  const isCategory = category.parent_id === null;

  // A category with no nested "product" groupings yet is a leaf: items go
  // straight into it (the products table) rather than through an extra
  // grouping layer. One that already has product groupings keeps using them,
  // so we never mix the two structures under the same category.
  const isLeafCategory = isCategory && products.length === 0;

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
              <span className="font-semibold text-[#1A0A53]">{step.name}</span>
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
          <h1 className="text-2xl font-bold text-[#1A0A53] sm:text-3xl">{category.name}</h1>
          <p className="mt-2 max-w-2xl text-sm text-[#5b6b82]">
            {isLeafCategory
              ? "Add the individual items customers can enquire on. They show as a grid on this category's page."
              : isCategory
                ? "Add a product for each group you want on this category's page. Each one gets its own photo, description, and row of subproducts — all on the same page, no extra page per product."
                : "Add the individual items customers can enquire on. They show as a grid under this product's description."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/admin/categories/${category.id}/edit`}
            className="inline-flex items-center gap-2 rounded-full border border-[#e4e9f2] px-5 py-2.5 text-sm font-semibold text-[#1A0A53] transition-colors hover:bg-[#f6f8fc]"
          >
            <Pencil className="size-4" />
            {isCategory ? "Edit category" : "Edit product"}
          </Link>

          {isLeafCategory ? (
            <Link
              href={`/admin/products/new?category=${category.id}`}
              className="inline-flex items-center gap-2 rounded-full btn-navy px-5 py-2.5 text-sm font-semibold text-white transition-colors"
            >
              <Plus className="size-4" />
              Add item
            </Link>
          ) : isCategory ? (
            <Link
              href={`/admin/categories/new?parent=${category.id}`}
              className="inline-flex items-center gap-2 rounded-full btn-navy px-5 py-2.5 text-sm font-semibold text-white transition-colors"
            >
              <Plus className="size-4" />
              New product
            </Link>
          ) : (
            <Link
              href={`/admin/products/new?category=${category.id}`}
              className="inline-flex items-center gap-2 rounded-full btn-navy px-5 py-2.5 text-sm font-semibold text-white transition-colors"
            >
              <Plus className="size-4" />
              New subproduct
            </Link>
          )}
        </div>
      </div>

      <section className="mt-10">
        <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-[#1A0A53]">
          <Package className="size-4" />
          {isLeafCategory ? "Items" : isCategory ? "Products" : "Subproducts"}
        </h2>
        <div className="mt-5">
          {isLeafCategory ? (
            <ProductListGrid products={subproducts} />
          ) : isCategory ? (
            <CategoryListGrid categories={products} />
          ) : (
            <ProductListGrid products={subproducts} />
          )}
        </div>
      </section>
    </div>
  );
}
